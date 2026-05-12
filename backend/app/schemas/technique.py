from datetime import datetime
from typing import List, Optional

from pydantic import BaseModel

from app.models.technique import TechniqueCategory, TechniqueDiscipline, TechniqueStatus
from app.models.user import Belt


class TechniqueRead(BaseModel):
    id: int
    slug: str
    name: str
    category: TechniqueCategory
    discipline: TechniqueDiscipline
    belt_required: Belt
    stripes_required: int
    description: Optional[str]
    aliases: List[str]
    prerequisite_technique_ids: List[int]
    sort_order: int

    user_status: TechniqueStatus
    times_practiced: int
    last_practiced_at: Optional[datetime] = None
    first_practiced_at: Optional[datetime] = None
    mastered_at: Optional[datetime] = None


class TechniquesResponse(BaseModel):
    techniques: List[TechniqueRead]


class MissingPrereq(BaseModel):
    id: int
    name: str
    times_practiced: int
    times_needed: int


class NextUnlock(BaseModel):
    id: int
    name: str
    missing_prereqs: List[MissingPrereq]


class NextToMaster(BaseModel):
    id: int
    name: str
    times_practiced: int
    times_needed: int


class ProgressionRead(BaseModel):
    xp: int
    next_stripe_xp: int
    progress_to_next_stripe: float
    suggested_belt: Belt
    suggested_stripes: int
    gi_belt: Optional[Belt]
    gi_stripes: int
    no_gi_belt: Optional[Belt]
    no_gi_stripes: int
    total_techniques: int
    locked: int
    unlocked: int
    attempted: int
    mastered: int
    next_unlocks: List[NextUnlock]
    next_to_master: List[NextToMaster]
