import uuid
from datetime import date, datetime
from sqlalchemy import String, Integer, Numeric, Date, DateTime, ForeignKey
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column
from ..core.database import Base

class GapScore(Base):
    __tablename__ = "gap_scores"

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    district_id: Mapped[int] = mapped_column(ForeignKey("districts.id"), nullable=False)
    sector_id: Mapped[int] = mapped_column(ForeignKey("sectors.id"), nullable=False)
    job_role_id: Mapped[uuid.UUID] = mapped_column(ForeignKey("job_roles.id"), nullable=False)
    nsqf_level: Mapped[int] = mapped_column(Integer, nullable=False)
    demand_count: Mapped[int] = mapped_column(Integer, nullable=False)
    trained_capacity: Mapped[int] = mapped_column(Integer, nullable=False)
    placement_rate: Mapped[float] = mapped_column(Numeric(5, 2), nullable=False)
    gap_score: Mapped[float] = mapped_column(Numeric(5, 2), nullable=False)
    severity_level: Mapped[str] = mapped_column(String(30), nullable=False)
    calculation_date: Mapped[date] = mapped_column(Date, default=date.today, nullable=False)
