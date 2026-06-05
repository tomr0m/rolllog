from typing import Optional

from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session

from app.ai.coach import AICoach, get_anthropic_client
from app.core.deps import get_current_user
from app.crud.session import create_session, get_session_by_id, get_session_stats, get_sessions
from app.database import get_db
from app.models.session import Discipline
from app.models.user import User
from app.schemas.session import (
    SessionCreate,
    SessionCreateResponse,
    SessionRead,
    SessionRewards,
    SessionStats,
    SessionsResponse,
)

router = APIRouter(prefix="/api/sessions", tags=["sessions"])


@router.post("", response_model=SessionCreateResponse, status_code=status.HTTP_201_CREATED)
def log_session(
    body: SessionCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    if body.discipline == Discipline.GI and not current_user.practices_gi:
        raise HTTPException(status_code=400, detail="You don't practice Gi")
    if body.discipline == Discipline.NO_GI and not current_user.practices_no_gi:
        raise HTTPException(status_code=400, detail="You don't practice No-Gi")
    result = create_session(db, current_user, body)

    # Generate an AI coaching note for this session. If the AI is unavailable
    # for any reason, gracefully degrade to None — the session always saves.
    coach_note: str | None = None
    client = get_anthropic_client()
    if client is not None:
        coach_note = AICoach(client).generate_inline_note(current_user, result.session, db)

    return SessionCreateResponse(
        session=SessionRead.model_validate(result.session),
        rewards=SessionRewards(
            xp_gained=result.xp_gained,
            techniques_mastered=result.techniques_mastered,
            techniques_unlocked=result.techniques_unlocked,
            techniques_attempted_early=result.techniques_attempted_early,
            new_stripe_earned=result.new_stripe_earned,
            new_stripe_count=result.new_stripe_count,
            coach_note=coach_note,
        ),
    )


@router.get("/stats", response_model=SessionStats)
def session_stats(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return get_session_stats(db, current_user.id)


@router.get("", response_model=SessionsResponse)
def list_sessions(
    discipline: Optional[Discipline] = Query(None),
    limit: int = Query(50, ge=1, le=200),
    offset: int = Query(0, ge=0),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    sessions, total = get_sessions(db, current_user.id, discipline, limit, offset)
    return SessionsResponse(sessions=sessions, total=total)


@router.get("/{session_id}", response_model=SessionRead)
def get_session(
    session_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    session = get_session_by_id(db, session_id, current_user.id)
    if not session:
        raise HTTPException(status_code=404, detail="Session not found")
    return session
