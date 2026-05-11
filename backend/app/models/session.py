import enum
from datetime import date, datetime, timezone

from sqlalchemy import Date, DateTime, Enum, ForeignKey, Integer, Text, func
from sqlalchemy.dialects.postgresql import ARRAY
from sqlalchemy import String
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database import Base


class Discipline(str, enum.Enum):
    GI = "GI"
    NO_GI = "NO_GI"


class TrainingSession(Base):
    __tablename__ = "training_sessions"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    user_id: Mapped[int] = mapped_column(
        Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True
    )

    date: Mapped[date] = mapped_column(Date, nullable=False)
    discipline: Mapped[Discipline] = mapped_column(Enum(Discipline, name="discipline"), nullable=False)
    duration_minutes: Mapped[int] = mapped_column(Integer, nullable=False)

    techniques: Mapped[list] = mapped_column(ARRAY(String(50)), nullable=False, default=list)
    partners: Mapped[list] = mapped_column(ARRAY(String(50)), nullable=False, default=list)
    notes: Mapped[str | None] = mapped_column(Text, nullable=True)

    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now(), nullable=False
    )
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        server_default=func.now(),
        onupdate=lambda: datetime.now(timezone.utc),
        nullable=False,
    )

    user: Mapped["User"] = relationship("User", back_populates="sessions")  # type: ignore[name-defined]
