import uuid
from datetime import datetime
from sqlalchemy import String, Integer, Numeric, Boolean, DateTime, ForeignKey, Text
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column
from ..core.database import Base

class PlacementBatch(Base):
    __tablename__ = "placement_batches"

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    institute_id: Mapped[uuid.UUID] = mapped_column(ForeignKey("institutes.id"), nullable=False)
    academic_year: Mapped[str] = mapped_column(String(9), nullable=False)
    batch_month: Mapped[int] = mapped_column(Integer, nullable=False)
    file_name: Mapped[str] = mapped_column(String(255), nullable=False)
    s3_object_key: Mapped[str] = mapped_column(String(500), nullable=False)
    status: Mapped[str] = mapped_column(String(30), default="PENDING", nullable=False)
    uploaded_by: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), nullable=False)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=datetime.utcnow)

class PlacementRecord(Base):
    __tablename__ = "placement_records"

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    batch_id: Mapped[uuid.UUID] = mapped_column(ForeignKey("placement_batches.id"), nullable=False)
    institute_id: Mapped[uuid.UUID] = mapped_column(ForeignKey("institutes.id"), nullable=False)
    course_id: Mapped[uuid.UUID] = mapped_column(ForeignKey("courses.id"), nullable=False)
    candidate_hash: Mapped[str] = mapped_column(String(64), nullable=False)
    batch_year: Mapped[int] = mapped_column(Integer, primary_key=True, nullable=False)
    is_placed: Mapped[bool] = mapped_column(Boolean, nullable=False)
    monthly_salary: Mapped[float] = mapped_column(Numeric(10, 2), nullable=True)

class PlacementValidationError(Base):
    __tablename__ = "placement_validation_errors"

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    batch_id: Mapped[uuid.UUID] = mapped_column(ForeignKey("placement_batches.id"), nullable=False)
    row_number: Mapped[int] = mapped_column(Integer, nullable=False)
    column_name: Mapped[str] = mapped_column(String(100), nullable=False)
    rejected_value: Mapped[str] = mapped_column(Text, nullable=True)
    error_code: Mapped[str] = mapped_column(String(50), nullable=False)
    error_message_en: Mapped[str] = mapped_column(Text, nullable=False)
