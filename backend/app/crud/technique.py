"""Technique catalog + per-user progression logic.

Pure functions where possible. The DB session is passed in; the caller is
responsible for commit semantics.
"""

from datetime import datetime, timezone
from typing import Iterable, Optional

from sqlalchemy.orm import Session

from app.models.technique import (
    Technique,
    TechniqueStatus,
    UserTechnique,
)
from app.models.user import Belt, User


MASTERY_THRESHOLD = 5

BELT_ORDER: list[Belt] = [Belt.WHITE, Belt.BLUE, Belt.PURPLE, Belt.BROWN, Belt.BLACK]

STRIPE_THRESHOLDS = [100, 250, 500, 1000, 2500]  # XP required to reach stripe N


# ---------------------------------------------------------------------------
# Catalog access
# ---------------------------------------------------------------------------

def get_all_techniques(db: Session) -> list[Technique]:
    return (
        db.query(Technique)
        .order_by(Technique.belt_required.asc(), Technique.sort_order.asc())
        .all()
    )


def get_technique_by_id(db: Session, technique_id: int) -> Optional[Technique]:
    return db.query(Technique).filter(Technique.id == technique_id).first()


def get_user_techniques_map(db: Session, user_id: int) -> dict[int, UserTechnique]:
    rows = db.query(UserTechnique).filter(UserTechnique.user_id == user_id).all()
    return {ut.technique_id: ut for ut in rows}


# ---------------------------------------------------------------------------
# Status computation
# ---------------------------------------------------------------------------

def _belt_meets_requirement(user_belt: Belt | None, required_belt: Belt) -> bool:
    """Returns True if the user's belt is at-or-above the required belt."""
    if user_belt is None:
        # No belt set → treat as white belt (lowest)
        user_belt = Belt.WHITE
    return BELT_ORDER.index(user_belt) >= BELT_ORDER.index(required_belt)


def _highest_belt(user: User) -> Belt:
    candidates: list[Belt] = []
    if user.gi_belt:
        candidates.append(user.gi_belt)
    if user.no_gi_belt:
        candidates.append(user.no_gi_belt)
    if not candidates:
        return Belt.WHITE
    return max(candidates, key=lambda b: BELT_ORDER.index(b))


def compute_initial_status(
    user: User,
    technique: Technique,
    user_techniques_by_id: dict[int, UserTechnique],
) -> TechniqueStatus:
    """Status when the user has no UserTechnique row yet."""
    # Belt gate
    if not _belt_meets_requirement(_highest_belt(user), technique.belt_required):
        return TechniqueStatus.LOCKED

    # Stripe gate at correct belt
    highest = _highest_belt(user)
    if highest == technique.belt_required:
        user_stripes = max(user.gi_stripes or 0, user.no_gi_stripes or 0)
        if user_stripes < technique.stripes_required:
            return TechniqueStatus.LOCKED

    # Prereq gate — all prereqs must be MASTERED
    for prereq_id in technique.prerequisite_technique_ids or []:
        ut = user_techniques_by_id.get(prereq_id)
        if ut is None or ut.status != TechniqueStatus.MASTERED:
            return TechniqueStatus.LOCKED

    return TechniqueStatus.UNLOCKED


def get_or_create_user_technique(
    db: Session, user: User, technique: Technique
) -> UserTechnique:
    """Get the UserTechnique row for this user+technique, creating it if absent."""
    existing = (
        db.query(UserTechnique)
        .filter(
            UserTechnique.user_id == user.id, UserTechnique.technique_id == technique.id
        )
        .first()
    )
    if existing is not None:
        return existing

    user_techs = get_user_techniques_map(db, user.id)
    initial = compute_initial_status(user, technique, user_techs)
    ut = UserTechnique(
        user_id=user.id,
        technique_id=technique.id,
        status=initial,
        times_practiced=0,
    )
    db.add(ut)
    db.flush()
    return ut


# ---------------------------------------------------------------------------
# Free-text matching
# ---------------------------------------------------------------------------

def _normalize(s: str) -> str:
    return " ".join(s.strip().lower().split())


def build_match_index(techniques: Iterable[Technique]) -> dict[str, Technique]:
    """Build a normalized name+aliases → Technique lookup."""
    idx: dict[str, Technique] = {}
    for t in techniques:
        idx[_normalize(t.name)] = t
        for alias in t.aliases or []:
            idx[_normalize(alias)] = t
    return idx


def match_free_text(
    free_texts: Iterable[str], match_index: dict[str, Technique]
) -> tuple[list[Technique], list[str]]:
    """Returns (matched_techniques, unmatched_raw_texts)."""
    matched: dict[int, Technique] = {}
    unmatched: list[str] = []
    for raw in free_texts:
        key = _normalize(raw)
        if key in match_index:
            tech = match_index[key]
            matched[tech.id] = tech
        else:
            unmatched.append(raw.strip())
    return list(matched.values()), unmatched


# ---------------------------------------------------------------------------
# XP / stripe calculation
# ---------------------------------------------------------------------------

def xp_required_for_stripe(stripe_count: int) -> int:
    """Cumulative XP needed to have earned `stripe_count` stripes."""
    if stripe_count <= 0:
        return 0
    idx = min(stripe_count, len(STRIPE_THRESHOLDS)) - 1
    return sum(STRIPE_THRESHOLDS[: idx + 1])


def stripes_for_xp(xp: int) -> int:
    """How many virtual stripes the given XP buys."""
    total = 0
    stripes = 0
    for threshold in STRIPE_THRESHOLDS:
        if xp >= total + threshold:
            total += threshold
            stripes += 1
        else:
            break
    return stripes


def xp_progress_to_next(xp: int) -> tuple[int, int, float]:
    """Returns (current_stripe_count, xp_into_next, fraction_to_next)."""
    earned = stripes_for_xp(xp)
    base = xp_required_for_stripe(earned)
    if earned >= len(STRIPE_THRESHOLDS):
        # Past all defined stripes
        return earned, xp - base, 1.0
    next_cost = STRIPE_THRESHOLDS[earned]
    into = xp - base
    frac = into / next_cost if next_cost else 1.0
    return earned, next_cost, max(0.0, min(1.0, frac))


def session_xp_award(
    duration_minutes: int,
    recognized_count: int,
    newly_mastered_count: int,
) -> int:
    base = duration_minutes // 3
    return base + (2 * recognized_count) + (25 * newly_mastered_count)
