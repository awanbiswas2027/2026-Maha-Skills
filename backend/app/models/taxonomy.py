import uuid
from datetime import datetime
from sqlalchemy import String, Integer, Text, Boolean, DateTime, ForeignKey
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship
from ..core.database import Base

class Sector(Base):
    __tablename__ = "sectors"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    code: Mapped[str] = mapped_column(String(20), unique=True, nullable=False)
    name_en: Mapped[str] = mapped_column(String(150), nullable=False)
    name_mr: Mapped[str] = mapped_column(String(150), nullable=False)
    description: Mapped[str] = mapped_column(Text, nullable=True)
    is_active: Mapped[bool] = mapped_column(Boolean, default=True, nullable=False)

class SectorSkillCouncil(Base):
    __tablename__ = "sscs"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    code: Mapped[str] = mapped_column(String(30), unique=True, nullable=False)
    name: Mapped[str] = mapped_column(String(200), nullable=False)
    sector_id: Mapped[int] = mapped_column(ForeignKey("sectors.id"), nullable=False)
    contact_email: Mapped[str] = mapped_column(String(255), nullable=False)

class JobRole(Base):
    __tablename__ = "job_roles"

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    sector_id: Mapped[int] = mapped_column(ForeignKey("sectors.id"), nullable=False)
    ssc_id: Mapped[int] = mapped_column(ForeignKey("sscs.id"), nullable=True)
    qp_code: Mapped[str] = mapped_column(String(50), unique=True, nullable=False)
    title_en: Mapped[str] = mapped_column(String(200), nullable=False)
    title_mr: Mapped[str] = mapped_column(String(200), nullable=False)
    nsqf_level: Mapped[int] = mapped_column(Integer, nullable=False)
    is_active: Mapped[bool] = mapped_column(Boolean, default=True, nullable=False)

class Skill(Base):
    __tablename__ = "skills"

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    sector_id: Mapped[int] = mapped_column(ForeignKey("sectors.id"), nullable=False)
    name_en: Mapped[str] = mapped_column(String(150), nullable=False)
    name_mr: Mapped[str] = mapped_column(String(150), nullable=False)
    skill_type: Mapped[str] = mapped_column(String(50), default="TECHNICAL", nullable=False)
    is_emerging: Mapped[bool] = mapped_column(Boolean, default=False, nullable=False)

class JobRoleSkill(Base):
    __tablename__ = "job_role_skills"

    job_role_id: Mapped[uuid.UUID] = mapped_column(ForeignKey("job_roles.id"), primary_key=True)
    skill_id: Mapped[uuid.UUID] = mapped_column(ForeignKey("skills.id"), primary_key=True)
    is_mandatory: Mapped[bool] = mapped_column(Boolean, default=True, nullable=False)
