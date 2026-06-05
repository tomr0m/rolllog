"""Coach dashboard endpoints — synthesized AI insights with 6-hour caching."""

from datetime import datetime, timedelta, timezone

from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session

from app.ai.coach import (
    DASHBOARD_FALLBACK,
    AICoach,
    ai_enabled,
    get_anthropic_client,
)
from app.core.deps import get_current_user
from app.database import get_db
from app.models.user import User
from app.schemas.coach import CoachInsights, CoachStatus

router = APIRouter(prefix="/api/coach", tags=["coach"])

# Simple in-memory cache: { user_id: {"result": dict, "generated_at": datetime} }.
# AI calls cost money, so dashboard insights are cached per-user for 6 hours.
_insights_cache: dict[int, dict] = {}
CACHE_TTL = timedelta(hours=6)


def _is_fresh(entry: dict) -> bool:
    return datetime.now(timezone.utc) - entry["generated_at"] < CACHE_TTL


@router.get("/insights", response_model=CoachInsights)
def coach_insights(
    refresh: bool = Query(False),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    cached = _insights_cache.get(current_user.id)
    if not refresh and cached and _is_fresh(cached):
        return CoachInsights(**cached["result"], generated_at=cached["generated_at"])

    client = get_anthropic_client()
    if client is None:
        # AI not configured — serve generic guidance, don't cache.
        return CoachInsights(**DASHBOARD_FALLBACK, generated_at=datetime.now(timezone.utc))

    coach = AICoach(client)
    result = coach.generate_dashboard_insights(current_user, db)
    generated_at = datetime.now(timezone.utc)
    _insights_cache[current_user.id] = {"result": result, "generated_at": generated_at}
    return CoachInsights(**result, generated_at=generated_at)


@router.get("/status", response_model=CoachStatus)
def coach_status(current_user: User = Depends(get_current_user)):
    cached = _insights_cache.get(current_user.id)
    last_insight_at = None
    cache_expires_at = None
    if cached and _is_fresh(cached):
        last_insight_at = cached["generated_at"]
        cache_expires_at = cached["generated_at"] + CACHE_TTL
    return CoachStatus(
        ai_enabled=ai_enabled(),
        last_insight_at=last_insight_at,
        cache_expires_at=cache_expires_at,
    )
