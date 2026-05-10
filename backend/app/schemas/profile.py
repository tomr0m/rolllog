from datetime import date

from pydantic import BaseModel, Field, model_validator

from app.models.user import Belt


class OnboardingRequest(BaseModel):
    practices_gi: bool
    gi_belt: Belt | None = None
    gi_stripes: int = Field(default=0, ge=0, le=4)

    practices_no_gi: bool
    no_gi_belt: Belt | None = None
    no_gi_stripes: int = Field(default=0, ge=0, le=4)

    start_date: date | None = None

    @model_validator(mode="after")
    def validate_disciplines(self) -> "OnboardingRequest":
        if not self.practices_gi and not self.practices_no_gi:
            raise ValueError("At least one of practices_gi or practices_no_gi must be True")
        if self.practices_gi and self.gi_belt is None:
            raise ValueError("gi_belt is required when practices_gi is True")
        if self.practices_no_gi and self.no_gi_belt is None:
            raise ValueError("no_gi_belt is required when practices_no_gi is True")
        return self
