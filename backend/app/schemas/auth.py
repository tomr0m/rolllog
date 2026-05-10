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


class UserOut(BaseModel):
    id: int
    email: str
    name: str
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
