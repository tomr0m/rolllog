from collections import Counter
from datetime import date, datetime, timedelta, timezone
from typing import Optional

from sqlalchemy.orm import Session

from app.models.session import Discipline, TrainingSession
from app.schemas.session import SessionCreate, SessionStats


def create_session(db: Session, user_id: int, data: SessionCreate) -> TrainingSession:
    session = TrainingSession(
        user_id=user_id,
        date=data.date,
        discipline=data.discipline,
        duration_minutes=data.duration_minutes,
        techniques=data.techniques,
        partners=data.partners,
        notes=data.notes,
    )
    db.add(session)
    db.commit()
    db.refresh(session)
    return session


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
