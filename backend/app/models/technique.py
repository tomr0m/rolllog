import enum
from datetime import datetime, timezone
from typing import TYPE_CHECKING

from sqlalchemy import (
    DateTime,
    Enum,
    ForeignKey,
    Integer,
    String,
    Text,
    UniqueConstraint,
    func,
)
from sqlalchemy.dialects.postgresql import ARRAY
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database import Base
from app.models.user import Belt

if TYPE_CHECKING:
    from app.models.user import User


class TechniqueCategory(str, enum.Enum):
    FUNDAMENTAL = "FUNDAMENTAL"
    GUARD = "GUARD"
    PASS = "PASS"
    SWEEP = "SWEEP"
    SUBMISSION = "SUBMISSION"
    ESCAPE = "ESCAPE"
    TAKEDOWN = "TAKEDOWN"
    TRANSITION = "TRANSITION"


class TechniqueDiscipline(str, enum.Enum):
    BOTH = "BOTH"
    GI_ONLY = "GI_ONLY"
    NO_GI_ONLY = "NO_GI_ONLY"


class TechniqueStatus(str, enum.Enum):
    LOCKED = "LOCKED"
    UNLOCKED = "UNLOCKED"
    ATTEMPTED = "ATTEMPTED"
    MASTERED = "MASTERED"


class Technique(Base):
    __tablename__ = "techniques"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    slug: Mapped[str] = mapped_column(String(100), unique=True, nullable=False, index=True)
    name: Mapped[str] = mapped_column(String(150), nullable=False)
    category: Mapped[TechniqueCategory] = mapped_column(
        Enum(TechniqueCategory, name="technique_category"), nullable=False
    )
    discipline: Mapped[TechniqueDiscipline] = mapped_column(
        Enum(TechniqueDiscipline, name="technique_discipline"),
        nullable=False,
        default=TechniqueDiscipline.BOTH,
    )
    belt_required: Mapped[Belt] = mapped_column(Enum(Belt), nullable=False)
    stripes_required: Mapped[int] = mapped_column(Integer, default=0, nullable=False)

    description: Mapped[str | None] = mapped_column(Text, nullable=True)
    aliases: Mapped[list] = mapped_column(ARRAY(String(100)), nullable=False, default=list)

    prerequisite_technique_ids: Mapped[list] = mapped_column(
        ARRAY(Integer), nullable=False, default=list
    )

    sort_order: Mapped[int] = mapped_column(Integer, default=0, nullable=False)

    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now(), nullable=False
    )


class UserTechnique(Base):
    __tablename__ = "user_techniques"
    __table_args__ = (UniqueConstraint("user_id", "technique_id", name="uq_user_technique"),)

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    user_id: Mapped[int] = mapped_column(
        Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True
    )
    technique_id: Mapped[int] = mapped_column(
        Integer, ForeignKey("techniques.id", ondelete="CASCADE"), nullable=False, index=True
    )

    status: Mapped[TechniqueStatus] = mapped_column(
        Enum(TechniqueStatus, name="technique_status"),
        nullable=False,
        default=TechniqueStatus.LOCKED,
    )
    times_practiced: Mapped[int] = mapped_column(Integer, default=0, nullable=False)
    first_practiced_at: Mapped[datetime | None] = mapped_column(
        DateTime(timezone=True), nullable=True
    )
    last_practiced_at: Mapped[datetime | None] = mapped_column(
        DateTime(timezone=True), nullable=True
    )
    mastered_at: Mapped[datetime | None] = mapped_column(
        DateTime(timezone=True), nullable=True
    )

    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now(), nullable=False
    )
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        server_default=func.now(),
        onupdate=lambda: datetime.now(timezone.utc),
        nullable=False,
    )

    user: Mapped["User"] = relationship("User", back_populates="user_techniques")
    technique: Mapped["Technique"] = relationship("Technique")
