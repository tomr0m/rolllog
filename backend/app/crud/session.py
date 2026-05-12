from collections import Counter
from datetime import date, datetime, timedelta, timezone
from typing import Optional

from sqlalchemy.orm import Session

from app.crud.technique import (
    MASTERY_THRESHOLD,
    build_match_index,
    compute_initial_status,
    get_all_techniques,
    get_or_create_user_technique,
    match_free_text,
    session_xp_award,
    stripes_for_xp,
)
from app.models.session import Discipline, TrainingSession
from app.models.technique import Technique, TechniqueStatus, UserTechnique
from app.models.user import User
from app.schemas.session import SessionCreate, SessionStats


# Result of creating a session — includes rewards for the response payload.
class SessionCreateResult:
    def __init__(
        self,
        session: TrainingSession,
        xp_gained: int,
        techniques_mastered: list[str],
        techniques_unlocked: list[str],
        techniques_attempted_early: list[str],
        new_stripe_earned: bool,
        new_stripe_count: int | None,
    ):
        self.session = session
        self.xp_gained = xp_gained
        self.techniques_mastered = techniques_mastered
        self.techniques_unlocked = techniques_unlocked
        self.techniques_attempted_early = techniques_attempted_early
        self.new_stripe_earned = new_stripe_earned
        self.new_stripe_count = new_stripe_count


def create_session(db: Session, user: User, data: SessionCreate) -> SessionCreateResult:
    """Create a session and apply all progression side effects."""
    now = datetime.now(timezone.utc)

    # 1) Match free-text techniques against the catalog.
    all_techs = get_all_techniques(db)
    match_index = build_match_index(all_techs)
    matched, unmatched_raw = match_free_text(data.techniques or [], match_index)

    # 2) Persist the session with both arrays.
    session = TrainingSession(
        user_id=user.id,
        date=data.date,
        discipline=data.discipline,
        duration_minutes=data.duration_minutes,
        techniques=unmatched_raw,  # raw custom-only after Phase 3
        technique_ids=[t.id for t in matched],
        partners=data.partners,
        notes=data.notes,
    )
    db.add(session)
    db.flush()  # populate session.id

    # 3) Apply per-technique progression updates.
    newly_mastered: list[Technique] = []
    newly_attempted_early: list[Technique] = []
    techniques_by_id = {t.id: t for t in all_techs}

    for tech in matched:
        ut = get_or_create_user_technique(db, user, tech)
        was_locked = ut.status == TechniqueStatus.LOCKED

        ut.times_practiced = (ut.times_practiced or 0) + 1
        if ut.first_practiced_at is None:
            ut.first_practiced_at = now
        ut.last_practiced_at = now

        # Transition LOCKED → ATTEMPTED ("early attempt"), or UNLOCKED → ATTEMPTED.
        if ut.status in (TechniqueStatus.LOCKED, TechniqueStatus.UNLOCKED):
            ut.status = TechniqueStatus.ATTEMPTED
            if was_locked:
                newly_attempted_early.append(tech)

        # Mastery transition.
        if (
            ut.status != TechniqueStatus.MASTERED
            and ut.times_practiced >= MASTERY_THRESHOLD
        ):
            ut.status = TechniqueStatus.MASTERED
            ut.mastered_at = now
            newly_mastered.append(tech)

    db.flush()

    # 4) Cascading unlocks — for each technique whose only-remaining prereq
    #    was just mastered, set its UserTechnique to UNLOCKED if it would now
    #    pass `compute_initial_status`.
    unlocked_now: list[Technique] = []
    if newly_mastered:
        # Refresh the map after writes
        ut_map: dict[int, UserTechnique] = {
            ut.technique_id: ut
            for ut in db.query(UserTechnique).filter(UserTechnique.user_id == user.id).all()
        }
        mastered_ids = {t.id for t in newly_mastered}
        for downstream in all_techs:
            if mastered_ids.isdisjoint(downstream.prerequisite_technique_ids or []):
                continue
            existing = ut_map.get(downstream.id)
            new_status = compute_initial_status(user, downstream, ut_map)
            # Only PROMOTE locked rows. Don't demote a row that's already
            # ATTEMPTED/MASTERED.
            if new_status != TechniqueStatus.UNLOCKED:
                continue
            if existing is None:
                # Create a row in UNLOCKED state.
                row = UserTechnique(
                    user_id=user.id,
                    technique_id=downstream.id,
                    status=TechniqueStatus.UNLOCKED,
                    times_practiced=0,
                )
                db.add(row)
                unlocked_now.append(downstream)
            elif existing.status == TechniqueStatus.LOCKED:
                existing.status = TechniqueStatus.UNLOCKED
                unlocked_now.append(downstream)
        db.flush()

    # 5) Award XP.
    xp_gained = session_xp_award(
        duration_minutes=data.duration_minutes,
        recognized_count=len(matched),
        newly_mastered_count=len(newly_mastered),
    )
    stripes_before = stripes_for_xp(user.xp)
    user.xp = (user.xp or 0) + xp_gained
    stripes_after = stripes_for_xp(user.xp)
    new_stripe_earned = stripes_after > stripes_before
    user.stripes_earned_in_app = stripes_after

    db.commit()
    db.refresh(session)

    return SessionCreateResult(
        session=session,
        xp_gained=xp_gained,
        techniques_mastered=[t.name for t in newly_mastered],
        techniques_unlocked=[t.name for t in unlocked_now],
        techniques_attempted_early=[t.name for t in newly_attempted_early],
        new_stripe_earned=new_stripe_earned,
        new_stripe_count=stripes_after if new_stripe_earned else None,
    )


def get_sessions(
    db: Session,
    user_id: int,
    discipline: Optional[Discipline] = None,
    limit: int = 50,
    offset: int = 0,
) -> tuple[list[TrainingSession], int]:
    q = db.query(TrainingSession).filter(TrainingSession.user_id == user_id)
    if discipline:
        q = q.filter(TrainingSession.discipline == discipline)
    total = q.count()
    sessions = (
        q.order_by(TrainingSession.date.desc(), TrainingSession.created_at.desc())
        .offset(offset)
        .limit(limit)
        .all()
    )
    return sessions, total


def get_session_by_id(db: Session, session_id: int, user_id: int) -> TrainingSession | None:
    return (
        db.query(TrainingSession)
        .filter(TrainingSession.id == session_id, TrainingSession.user_id == user_id)
        .first()
    )


def get_session_stats(db: Session, user_id: int) -> SessionStats:
    all_sessions = db.query(TrainingSession).filter(TrainingSession.user_id == user_id).all()

    now = datetime.now(timezone.utc)
    this_month = [
        s for s in all_sessions
        if s.date.year == now.year and s.date.month == now.month
    ]

    total_minutes = sum(s.duration_minutes for s in all_sessions)
    month_minutes = sum(s.duration_minutes for s in this_month)

    gi_count = sum(1 for s in all_sessions if s.discipline == Discipline.GI)
    no_gi_count = sum(1 for s in all_sessions if s.discipline == Discipline.NO_GI)

    # Streak: consecutive days ending today or yesterday
    session_dates = sorted(set(s.date for s in all_sessions), reverse=True)
    streak = 0
    if session_dates:
        today = now.date()
        yesterday = today - timedelta(days=1)
        if today in session_dates:
            check: date | None = today
        elif yesterday in session_dates:
            check = yesterday
        else:
            check = None

        if check is not None:
            for d in session_dates:
                if d == check:
                    streak += 1
                    check = check - timedelta(days=1)
                elif d < check:
                    break

    partner_counter: Counter[str] = Counter()
    technique_counter: Counter[str] = Counter()
    for s in all_sessions:
        partner_counter.update(s.partners or [])
        technique_counter.update(s.techniques or [])
        # Also include recognized technique IDs by name
    # Resolve recognized technique names
    recognized_ids = set()
    for s in all_sessions:
        recognized_ids.update(s.technique_ids or [])
    if recognized_ids:
        recognized = (
            db.query(Technique)
            .filter(Technique.id.in_(recognized_ids))
            .all()
        )
        recognized_by_id = {t.id: t for t in recognized}
        for s in all_sessions:
            for tid in s.technique_ids or []:
                t = recognized_by_id.get(tid)
                if t:
                    technique_counter[t.name] += 1

    return SessionStats(
        total_sessions=len(all_sessions),
        total_hours=round(total_minutes / 60, 1),
        sessions_this_month=len(this_month),
        hours_this_month=round(month_minutes / 60, 1),
        current_streak_days=streak,
        gi_sessions=gi_count,
        no_gi_sessions=no_gi_count,
        top_partners=[p for p, _ in partner_counter.most_common(5)],
        top_techniques=[t for t, _ in technique_counter.most_common(10)],
    )
