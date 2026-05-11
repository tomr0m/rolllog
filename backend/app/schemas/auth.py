import re
from datetime import datetime

from pydantic import BaseModel, EmailStr, Field, field_validator

from app.models.user import Belt


class UserBase(BaseModel):
    email: EmailStr
    name: str = Field(..., min_length=2, max_length=50)


class SignupRequest(UserBase):
    password: str = Field(..., min_length=8)

    @field_validator("email", mode="before")
    @classmethod
    def lowercase_email(cls, v: str) -> str:
        return v.lower()


class LoginRequest(BaseModel):
    email: EmailStr
    password: str

    @field_validator("email", mode="before")
    @classmethod
    def lowercase_email(cls, v: str) -> str:
        return v.lower()


class QuickStartRequest(BaseModel):
    name: str = Field(..., min_length=2, max_length=50)

    @field_validator("name")
    @classmethod
    def name_alphanumeric(cls, v: str) -> str:
        if not re.match(r"^[a-zA-Z0-9 ]+$", v.strip()):
            raise ValueError("Name may only contain letters, numbers, and spaces")
        return v.strip()


class UserOut(BaseModel):
    id: int
    email: str | None
    name: str
    is_quick_start: bool
    practices_gi: bool
    gi_belt: Belt | None
    gi_stripes: int
    practices_no_gi: bool
    no_gi_belt: Belt | None
    no_gi_stripes: int
    start_date: datetime | None
    onboarding_done: bool
    created_at: datetime

    model_config = {"from_attributes": True}


class AuthResponse(BaseModel):
    user: UserOut
    access_token: str
    token_type: str = "bearer"
