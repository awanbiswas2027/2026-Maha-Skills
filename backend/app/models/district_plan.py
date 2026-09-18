import uuid

from sqlalchemy import ForeignKey, Integer, Numeric, String
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column

from ..core.database import Base


class DistrictPlan(Base):
    __tablename__ = "district_plans"

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    district_id: Mapped[int] = mapped_column(ForeignKey("districts.id"), nullable=False)
    fiscal_year: Mapped[str] = mapped_column(String(9), nullable=False)
    plan_type: Mapped[str] = mapped_column(String(30), default="ANNUAL", nullable=False)
    status: Mapped[str] = mapped_column(String(30), default="DRAFT", nullable=False)
    total_target_intake: Mapped[int] = mapped_column(Integer, default=0, nullable=False)
    total_estimated_budget: Mapped[float] = mapped_column(
        Numeric(14, 2), default=0.0, nullable=False
    )


class DistrictPlanItem(Base):
    __tablename__ = "district_plan_items"

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    plan_id: Mapped[uuid.UUID] = mapped_column(ForeignKey("district_plans.id"), nullable=False)
    course_id: Mapped[uuid.UUID] = mapped_column(ForeignKey("courses.id"), nullable=False)
    target_intake: Mapped[int] = mapped_column(Integer, nullable=False)
    target_placement_rate: Mapped[float] = mapped_column(Numeric(5, 2), nullable=False)
