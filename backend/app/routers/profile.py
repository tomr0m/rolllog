from datetime import datetime, timezone

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.core.deps import get_current_user
from app.database import get_db
from app.models.user import User
from app.schemas.auth import UserOut
from app.schemas.profile import OnboardingRequest

router = APIRouter(prefix="/api/profile", tags=["profile"])


@router.post("/onboarding", response_model=UserOut)
def onboarding(body: OnboardingRequest, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    current_user.practices_gi = body.practices_gi
    current_user.gi_belt = body.gi_belt
    current_user.gi_stripes = body.gi_stripes

    current_user.practices_no_gi = body.practices_no_gi
    current_user.no_gi_belt = body.no_gi_belt
    current_user.no_gi_stripes = body.no_gi_stripes

    if body.start_date:
        current_user.start_date = datetime(
            body.start_date.year, body.start_date.month, body.start_date.day, tzinfo=timezone.utc
        )

    current_user.onboarding_done = True
    current_user.updated_at = datetime.now(timezone.utc)

    db.commit()
    db.refresh(current_user)
    return UserOut.model_validate(current_user)
