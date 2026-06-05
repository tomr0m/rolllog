from datetime import datetime
from typing import Optional

from pydantic import BaseModel


class FocusCard(BaseModel):
    title: str
    technique_name: str
    body: str


class CloseToCard(BaseModel):
    title: str
    technique_name: str
    body: str


class PatternCard(BaseModel):
    title: str
    body: str


class CoachInsights(BaseModel):
    focus: FocusCard
    close_to: CloseToCard
    pattern: PatternCard
    generated_at: datetime


class CoachStatus(BaseModel):
    ai_enabled: bool
    last_insight_at: Optional[datetime] = None
    cache_expires_at: Optional[datetime] = None
