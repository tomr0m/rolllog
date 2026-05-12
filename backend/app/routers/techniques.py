from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.core.deps import get_current_user
from app.crud.technique import (
    compute_initial_status,
    get_all_techniques,
    get_technique_by_id,
    get_user_techniques_map,
    xp_progress_to_next,
    stripes_for_xp,
    BELT_ORDER,
    MASTERY_THRESHOLD,
)
from app.database import get_db
from app.models.technique import Technique, TechniqueStatus
from app.models.user import User
from app.schemas.technique import (
    MissingPrereq,
    NextToMaster,
    NextUnlock,
    ProgressionRead,
    TechniqueRead,
    TechniquesResponse,
)

router = APIRouter(prefix="/api", tags=["techniques"])


def _serialize(technique: Technique, ut_map: dict, user: User) -> TechniqueRead:
    ut = ut_map.get(technique.id)
    if ut is None:
        status = compute_initial_status(user, technique, ut_map)
        return TechniqueRead(
            id=technique.id,
            slug=technique.slug,
            name=technique.name,
            category=technique.category,
            discipline=technique.discipline,
            belt_required=technique.belt_required,
            stripes_required=technique.stripes_required,
            description=technique.description,
            aliases=technique.aliases or [],
            prerequisite_technique_ids=technique.prerequisite_technique_ids or [],
            sort_order=technique.sort_order,
            user_status=status,
            times_practiced=0,
        )
    return TechniqueRead(
        id=technique.id,
        slug=technique.slug,
        name=technique.name,
        category=technique.category,
        discipline=technique.discipline,
        belt_required=technique.belt_required,
        stripes_required=technique.stripes_required,
        description=technique.description,
        aliases=technique.aliases or [],
        prerequisite_technique_ids=technique.prerequisite_technique_ids or [],
        sort_order=technique.sort_order,
        user_status=ut.status,
        times_practiced=ut.times_practiced,
        last_practiced_at=ut.last_practiced_at,
        first_practiced_at=ut.first_practiced_at,
        mastered_at=ut.mastered_at,
    )


@router.get("/techniques", response_model=TechniquesResponse)
def list_techniques(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    techniques = get_all_techniques(db)
    ut_map = get_user_techniques_map(db, current_user.id)
    return TechniquesResponse(
        techniques=[_serialize(t, ut_map, current_user) for t in techniques]
    )


@router.get("/techniques/{technique_id}", response_model=TechniqueRead)
def get_technique(
    technique_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    technique = get_technique_by_id(db, technique_id)
    if not technique:
        raise HTTPException(status_code=404, detail="Technique not found")
    ut_map = get_user_techniques_map(db, current_user.id)
    return _serialize(technique, ut_map, current_user)


@router.get("/progression", response_model=ProgressionRead)
def get_progression(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    techniques = get_all_techniques(db)
    ut_map = get_user_techniques_map(db, current_user.id)
    techniques_by_id = {t.id: t for t in techniques}

    earned, next_cost, frac = xp_progress_to_next(current_user.xp)
    suggested_stripes = stripes_for_xp(current_user.xp)

    # Suggested belt: bump up at every 4 stripes earned beyond current
    highest_real_belt_idx = 0
    if current_user.gi_belt:
        highest_real_belt_idx = max(
            highest_real_belt_idx, BELT_ORDER.index(current_user.gi_belt)
        )
    if current_user.no_gi_belt:
        highest_real_belt_idx = max(
            highest_real_belt_idx, BELT_ORDER.index(current_user.no_gi_belt)
        )
    # Suggest a belt bump after stripe 5 (XP > all stripe thresholds)
    if suggested_stripes >= len([100, 250, 500, 1000, 2500]) and highest_real_belt_idx < len(
        BELT_ORDER
    ) - 1:
        suggested_belt = BELT_ORDER[highest_real_belt_idx + 1]
    else:
        suggested_belt = BELT_ORDER[highest_real_belt_idx]

    # Counts by status — use computed status when no row exists
    counts = {
        TechniqueStatus.LOCKED: 0,
        TechniqueStatus.UNLOCKED: 0,
        TechniqueStatus.ATTEMPTED: 0,
        TechniqueStatus.MASTERED: 0,
    }
    for t in techniques:
        ut = ut_map.get(t.id)
        st = ut.status if ut else compute_initial_status(current_user, t, ut_map)
        counts[st] += 1

    # Next-to-master: ATTEMPTED rows closest to 5 practices
    attempted_rows = [
        ut for ut in ut_map.values() if ut.status == TechniqueStatus.ATTEMPTED
    ]
    attempted_rows.sort(key=lambda ut: -ut.times_practiced)
    next_to_master_items: list[NextToMaster] = []
    for ut in attempted_rows[:3]:
        t = techniques_by_id.get(ut.technique_id)
        if t is None:
            continue
        next_to_master_items.append(
            NextToMaster(
                id=t.id,
                name=t.name,
                times_practiced=ut.times_practiced,
                times_needed=MASTERY_THRESHOLD,
            )
        )

    # Next-unlocks: LOCKED techniques whose prereqs are 1 away (one prereq either
    # not mastered or still being practiced — and the only thing missing is mastery).
    next_unlocks: list[NextUnlock] = []
    for t in techniques:
        ut = ut_map.get(t.id)
        status = ut.status if ut else compute_initial_status(current_user, t, ut_map)
        if status != TechniqueStatus.LOCKED:
            continue
        if not t.prerequisite_technique_ids:
            continue
        missing: list[MissingPrereq] = []
        for pid in t.prerequisite_technique_ids:
            put = ut_map.get(pid)
            pt = techniques_by_id.get(pid)
            if pt is None:
                continue
            if put is None or put.status != TechniqueStatus.MASTERED:
                missing.append(
                    MissingPrereq(
                        id=pt.id,
                        name=pt.name,
                        times_practiced=put.times_practiced if put else 0,
                        times_needed=MASTERY_THRESHOLD,
                    )
                )
        if missing and len(missing) <= 1:
            next_unlocks.append(
                NextUnlock(id=t.id, name=t.name, missing_prereqs=missing)
            )

    # Limit & sort: prioritize ones whose missing prereq is closest to mastery
    next_unlocks.sort(
        key=lambda nu: -(nu.missing_prereqs[0].times_practiced if nu.missing_prereqs else 0)
    )
    next_unlocks = next_unlocks[:5]

    return ProgressionRead(
        xp=current_user.xp,
        next_stripe_xp=next_cost,
        progress_to_next_stripe=frac,
        suggested_belt=suggested_belt,
        suggested_stripes=suggested_stripes,
        gi_belt=current_user.gi_belt,
        gi_stripes=current_user.gi_stripes,
        no_gi_belt=current_user.no_gi_belt,
        no_gi_stripes=current_user.no_gi_stripes,
        total_techniques=len(techniques),
        locked=counts[TechniqueStatus.LOCKED],
        unlocked=counts[TechniqueStatus.UNLOCKED],
        attempted=counts[TechniqueStatus.ATTEMPTED],
        mastered=counts[TechniqueStatus.MASTERED],
        next_unlocks=next_unlocks,
        next_to_master=next_to_master_items,
    )
