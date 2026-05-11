import enum
from datetime import datetime, timezone
from typing import TYPE_CHECKING, List

from sqlalchemy import Boolean, DateTime, Enum, Integer, String, func
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database import Base

if TYPE_CHECKING:
    from app.models.session import TrainingSession


class Belt(str, enum.Enum):
    WHITE = "WHITE"
    BLUE = "BLUE"
    PURPLE = "PURPLE"
    BROWN = "BROWN"
    BLACK = "BLACK"


class User(Base):
    __tablename__ = "users"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    email: Mapped[str | None] = mapped_column(String(255), unique=True, nullable=True, index=True)
    password_hash: Mapped[str | None] = mapped_column(String(255), nullable=True)
    name: Mapped[str] = mapped_column(String(100), nullable=False)
    is_quick_start: Mapped[bool] = mapped_column(Boolean, default=False, nullable=False)

    practices_gi: Mapped[bool] = mapped_column(Boolean, default=False, nullable=False)
    gi_belt: Mapped[Belt | None] = mapped_column(Enum(Belt), nullable=True)
    gi_stripes: Mapped[int] = mapped_column(Integer, default=0, nullable=False)

    practices_no_gi: Mapped[bool] = mapped_column(Boolean, default=False, nullable=False)
    no_gi_belt: Mapped[Belt | None] = mapped_column(Enum(Belt), nullable=True)
    no_gi_stripes: Mapped[int] = mapped_column(Integer, default=0, nullable=False)

    start_date: Mapped[datetime | None] = mapped_column(DateTime(timezone=True), nullable=True)
    onboarding_done: Mapped[bool] = mapped_column(Boolean, default=False, nullable=False)

    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now(), nullable=False
    )
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        server_default=func.now(),
        onupdate=lambda: datetime.now(timezone.utc),
        nullable=False,
    )

    sessions: Mapped[List["TrainingSession"]] = relationship(
        "TrainingSession", back_populates="user", cascade="all, delete-orphan"
    )
