from datetime import date, datetime
from typing import List, Optional

from pydantic import BaseModel, Field, field_validator

from app.models.session import Discipline


class SessionCreate(BaseModel):
    date: date
    discipline: Discipline
    duration_minutes: int = Field(..., ge=5, le=600)
    techniques: List[str] = Field(default_factory=list)
    partners: List[str] = Field(default_factory=list)
    notes: Optional[str] = None

    @field_validator("date")
    @classmethod
    def date_not_future(cls, v: date) -> date:
        from datetime import date as date_cls
        if v > date_cls.today():
            raise ValueError("Date cannot be in the future")
        return v

    @field_validator("techniques")
    @classmethod
    def validate_techniques(cls, v: List[str]) -> List[str]:
        if len(v) > 30:
            raise ValueError("Maximum 30 techniques per session")
        for t in v:
            t = t.strip()
            if not (1 <= len(t) <= 50):
                raise ValueError("Each technique must be 1–50 characters")
        return [t.strip() for t in v]

    @field_validator("partners")
    @classmethod
    def validate_partners(cls, v: List[str]) -> List[str]:
        if len(v) > 20:
            raise ValueError("Maximum 20 partners per session")
        for p in v:
            p = p.strip()
            if not (1 <= len(p) <= 50):
                raise ValueError("Each partner name must be 1–50 characters")
        return [p.strip() for p in v]


class SessionRead(BaseModel):
    id: int
    user_id: int
    date: date
    discipline: Discipline
    duration_minutes: int
    techniques: List[str]
    technique_ids: List[int] = Field(default_factory=list)
    partners: List[str]
    notes: Optional[str]
    created_at: datetime

    model_config = {"from_attributes": True}


class SessionRewards(BaseModel):
    xp_gained: int
    techniques_mastered: List[str]
    techniques_unlocked: List[str]
    techniques_attempted_early: List[str]
    new_stripe_earned: bool
    new_stripe_count: Optional[int]
    coach_note: Optional[str] = None


class SessionCreateResponse(BaseModel):
    session: SessionRead
    rewards: SessionRewards


class SessionsResponse(BaseModel):
    sessions: List[SessionRead]
    total: int


class SessionStats(BaseModel):
    total_sessions: int
    total_hours: float
    sessions_this_month: int
    hours_this_month: float
    current_streak_days: int
    gi_sessions: int
    no_gi_sessions: int
    top_partners: List[str]
    top_techniques: List[str]
