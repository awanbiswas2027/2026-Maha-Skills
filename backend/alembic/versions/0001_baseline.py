"""baseline schema

Revision ID: 0001
Revises:
Create Date: 2026-09-18 22:00:00.000000

"""

from collections.abc import Sequence

import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

from alembic import op

# revision identifiers, used by Alembic.
revision: str = "0001"
down_revision: str | None = None
branch_labels: str | Sequence[str] | None = None
depends_on: str | Sequence[str] | None = None


def upgrade() -> None:
    # 1. districts
    op.create_table(
        "districts",
        sa.Column("id", sa.Integer(), autoincrement=True, nullable=False),
        sa.Column("code", sa.String(length=10), nullable=False),
        sa.Column("name_en", sa.String(length=100), nullable=False),
        sa.Column("name_mr", sa.String(length=100), nullable=False),
        sa.Column("division", sa.String(length=50), nullable=False),
        sa.Column("latitude", sa.Numeric(precision=9, scale=6), nullable=False),
        sa.Column("longitude", sa.Numeric(precision=9, scale=6), nullable=False),
        sa.Column("is_active", sa.Boolean(), server_default=sa.true(), nullable=False),
        sa.Column(
            "created_at",
            sa.DateTime(timezone=True),
            server_default=sa.text("now()"),
            nullable=False,
        ),
        sa.PrimaryKeyConstraint("id"),
        sa.UniqueConstraint("code"),
    )

    # 2. sectors
    op.create_table(
        "sectors",
        sa.Column("id", sa.Integer(), autoincrement=True, nullable=False),
        sa.Column("code", sa.String(length=20), nullable=False),
        sa.Column("name_en", sa.String(length=150), nullable=False),
        sa.Column("name_mr", sa.String(length=150), nullable=False),
        sa.Column("description", sa.Text(), nullable=True),
        sa.Column("is_active", sa.Boolean(), server_default=sa.true(), nullable=False),
        sa.PrimaryKeyConstraint("id"),
        sa.UniqueConstraint("code"),
    )

    # 3. sscs
    op.create_table(
        "sscs",
        sa.Column("id", sa.Integer(), autoincrement=True, nullable=False),
        sa.Column("code", sa.String(length=30), nullable=False),
        sa.Column("name", sa.String(length=200), nullable=False),
        sa.Column("sector_id", sa.Integer(), nullable=False),
        sa.Column("contact_email", sa.String(length=255), nullable=False),
        sa.ForeignKeyConstraint(["sector_id"], ["sectors.id"]),
        sa.PrimaryKeyConstraint("id"),
        sa.UniqueConstraint("code"),
    )

    # 4. job_roles
    op.create_table(
        "job_roles",
        sa.Column("id", postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column("sector_id", sa.Integer(), nullable=False),
        sa.Column("ssc_id", sa.Integer(), nullable=True),
        sa.Column("qp_code", sa.String(length=50), nullable=False),
        sa.Column("title_en", sa.String(length=200), nullable=False),
        sa.Column("title_mr", sa.String(length=200), nullable=False),
        sa.Column("nsqf_level", sa.Integer(), nullable=False),
        sa.Column("is_active", sa.Boolean(), server_default=sa.true(), nullable=False),
        sa.ForeignKeyConstraint(["sector_id"], ["sectors.id"]),
        sa.ForeignKeyConstraint(["ssc_id"], ["sscs.id"]),
        sa.PrimaryKeyConstraint("id"),
        sa.UniqueConstraint("qp_code"),
    )

    # 5. skills
    op.create_table(
        "skills",
        sa.Column("id", postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column("sector_id", sa.Integer(), nullable=False),
        sa.Column("name_en", sa.String(length=150), nullable=False),
        sa.Column("name_mr", sa.String(length=150), nullable=False),
        sa.Column("skill_type", sa.String(length=50), server_default="TECHNICAL", nullable=False),
        sa.Column("is_emerging", sa.Boolean(), server_default=sa.false(), nullable=False),
        sa.ForeignKeyConstraint(["sector_id"], ["sectors.id"]),
        sa.PrimaryKeyConstraint("id"),
    )

    # 6. job_role_skills
    op.create_table(
        "job_role_skills",
        sa.Column("job_role_id", postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column("skill_id", postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column("is_mandatory", sa.Boolean(), server_default=sa.true(), nullable=False),
        sa.ForeignKeyConstraint(["job_role_id"], ["job_roles.id"]),
        sa.ForeignKeyConstraint(["skill_id"], ["skills.id"]),
        sa.PrimaryKeyConstraint("job_role_id", "skill_id"),
    )

    # 7. institutes
    op.create_table(
        "institutes",
        sa.Column("id", postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column("mis_code", sa.String(length=50), nullable=False),
        sa.Column("name", sa.String(length=255), nullable=False),
        sa.Column("district_id", sa.Integer(), nullable=False),
        sa.Column("taluka", sa.String(length=100), nullable=False),
        sa.Column("institute_type", sa.String(length=50), nullable=False),
        sa.Column("is_active", sa.Boolean(), server_default=sa.true(), nullable=False),
        sa.ForeignKeyConstraint(["district_id"], ["districts.id"]),
        sa.PrimaryKeyConstraint("id"),
        sa.UniqueConstraint("mis_code"),
    )

    # 8. courses
    op.create_table(
        "courses",
        sa.Column("id", postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column("job_role_id", postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column("course_code", sa.String(length=50), nullable=False),
        sa.Column("title_en", sa.String(length=200), nullable=False),
        sa.Column("title_mr", sa.String(length=200), nullable=False),
        sa.Column("duration_months", sa.Integer(), nullable=False),
        sa.Column("nsqf_level", sa.Integer(), nullable=False),
        sa.Column("status", sa.String(length=30), server_default="ACTIVE", nullable=False),
        sa.ForeignKeyConstraint(["job_role_id"], ["job_roles.id"]),
        sa.PrimaryKeyConstraint("id"),
        sa.UniqueConstraint("course_code"),
    )

    # 9. institute_courses
    op.create_table(
        "institute_courses",
        sa.Column("id", postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column("institute_id", postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column("course_id", postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column("sanctioned_intake", sa.Integer(), nullable=False),
        sa.Column("academic_year", sa.String(length=9), nullable=False),
        sa.ForeignKeyConstraint(["course_id"], ["courses.id"]),
        sa.ForeignKeyConstraint(["institute_id"], ["institutes.id"]),
        sa.PrimaryKeyConstraint("id"),
    )

    # 10. placement_batches
    op.create_table(
        "placement_batches",
        sa.Column("id", postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column("institute_id", postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column("academic_year", sa.String(length=9), nullable=False),
        sa.Column("batch_month", sa.Integer(), nullable=False),
        sa.Column("file_name", sa.String(length=255), nullable=False),
        sa.Column("s3_object_key", sa.String(length=500), nullable=False),
        sa.Column("status", sa.String(length=30), server_default="PENDING", nullable=False),
        sa.Column("uploaded_by", postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column(
            "created_at",
            sa.DateTime(timezone=True),
            server_default=sa.text("now()"),
            nullable=False,
        ),
        sa.ForeignKeyConstraint(["institute_id"], ["institutes.id"]),
        sa.PrimaryKeyConstraint("id"),
    )

    # 11. placement_records
    op.create_table(
        "placement_records",
        sa.Column("id", postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column("batch_id", postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column("institute_id", postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column("course_id", postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column("candidate_hash", sa.String(length=64), nullable=False),
        sa.Column("batch_year", sa.Integer(), nullable=False),
        sa.Column("is_placed", sa.Boolean(), nullable=False),
        sa.Column("monthly_salary", sa.Numeric(precision=10, scale=2), nullable=True),
        sa.ForeignKeyConstraint(["batch_id"], ["placement_batches.id"]),
        sa.ForeignKeyConstraint(["course_id"], ["courses.id"]),
        sa.ForeignKeyConstraint(["institute_id"], ["institutes.id"]),
        sa.PrimaryKeyConstraint("id", "batch_year"),
    )

    # 12. placement_validation_errors
    op.create_table(
        "placement_validation_errors",
        sa.Column("id", postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column("batch_id", postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column("row_number", sa.Integer(), nullable=False),
        sa.Column("column_name", sa.String(length=100), nullable=False),
        sa.Column("rejected_value", sa.Text(), nullable=True),
        sa.Column("error_code", sa.String(length=50), nullable=False),
        sa.Column("error_message_en", sa.Text(), nullable=False),
        sa.ForeignKeyConstraint(["batch_id"], ["placement_batches.id"]),
        sa.PrimaryKeyConstraint("id"),
    )

    # 13. gap_scores
    op.create_table(
        "gap_scores",
        sa.Column("id", postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column("district_id", sa.Integer(), nullable=False),
        sa.Column("sector_id", sa.Integer(), nullable=False),
        sa.Column("job_role_id", postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column("nsqf_level", sa.Integer(), nullable=False),
        sa.Column("demand_count", sa.Integer(), nullable=False),
        sa.Column("trained_capacity", sa.Integer(), nullable=False),
        sa.Column("placement_rate", sa.Numeric(precision=5, scale=2), nullable=False),
        sa.Column("gap_score", sa.Numeric(precision=5, scale=2), nullable=False),
        sa.Column("severity_level", sa.String(length=30), nullable=False),
        sa.Column(
            "calculation_date", sa.Date(), server_default=sa.text("CURRENT_DATE"), nullable=False
        ),
        sa.ForeignKeyConstraint(["district_id"], ["districts.id"]),
        sa.ForeignKeyConstraint(["job_role_id"], ["job_roles.id"]),
        sa.ForeignKeyConstraint(["sector_id"], ["sectors.id"]),
        sa.PrimaryKeyConstraint("id"),
    )

    # 14. recommendations
    op.create_table(
        "recommendations",
        sa.Column("id", postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column("recommendation_code", sa.String(length=30), nullable=False),
        sa.Column("job_role_id", postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column("district_id", sa.Integer(), nullable=False),
        sa.Column("recommendation_type", sa.String(length=50), nullable=False),
        sa.Column("title_en", sa.String(length=255), nullable=False),
        sa.Column("rationale_en", sa.Text(), nullable=False),
        sa.Column("status", sa.String(length=50), server_default="DRAFT", nullable=False),
        sa.Column("assigned_ssc_id", sa.Integer(), nullable=True),
        sa.ForeignKeyConstraint(["assigned_ssc_id"], ["sscs.id"]),
        sa.ForeignKeyConstraint(["district_id"], ["districts.id"]),
        sa.ForeignKeyConstraint(["job_role_id"], ["job_roles.id"]),
        sa.PrimaryKeyConstraint("id"),
        sa.UniqueConstraint("recommendation_code"),
    )

    # 15. recommendation_evidence
    op.create_table(
        "recommendation_evidence",
        sa.Column("id", postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column("recommendation_id", postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column("evidence_type", sa.String(length=50), nullable=False),
        sa.Column("payload", postgresql.JSONB(astext_type=sa.Text()), nullable=False),
        sa.Column("dossier_pdf_s3_key", sa.String(length=500), nullable=True),
        sa.ForeignKeyConstraint(["recommendation_id"], ["recommendations.id"]),
        sa.PrimaryKeyConstraint("id"),
    )

    # 16. district_plans
    op.create_table(
        "district_plans",
        sa.Column("id", postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column("district_id", sa.Integer(), nullable=False),
        sa.Column("fiscal_year", sa.String(length=9), nullable=False),
        sa.Column("plan_type", sa.String(length=30), server_default="ANNUAL", nullable=False),
        sa.Column("status", sa.String(length=30), server_default="DRAFT", nullable=False),
        sa.Column("total_target_intake", sa.Integer(), server_default="0", nullable=False),
        sa.Column(
            "total_estimated_budget",
            sa.Numeric(precision=14, scale=2),
            server_default="0.0",
            nullable=False,
        ),
        sa.ForeignKeyConstraint(["district_id"], ["districts.id"]),
        sa.PrimaryKeyConstraint("id"),
    )

    # 17. district_plan_items
    op.create_table(
        "district_plan_items",
        sa.Column("id", postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column("plan_id", postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column("course_id", postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column("target_intake", sa.Integer(), nullable=False),
        sa.Column("target_placement_rate", sa.Numeric(precision=5, scale=2), nullable=False),
        sa.ForeignKeyConstraint(["course_id"], ["courses.id"]),
        sa.ForeignKeyConstraint(["plan_id"], ["district_plans.id"]),
        sa.PrimaryKeyConstraint("id"),
    )

    # 18. users
    op.create_table(
        "users",
        sa.Column("id", postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column("keycloak_sub", sa.String(length=100), nullable=False),
        sa.Column("email", sa.String(length=255), nullable=False),
        sa.Column("full_name", sa.String(length=150), nullable=False),
        sa.Column("is_active", sa.Boolean(), server_default=sa.true(), nullable=False),
        sa.PrimaryKeyConstraint("id"),
        sa.UniqueConstraint("email"),
        sa.UniqueConstraint("keycloak_sub"),
    )

    # 19. user_scopes
    op.create_table(
        "user_scopes",
        sa.Column("id", postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column("user_id", postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column("role_name", sa.String(length=50), nullable=False),
        sa.Column("district_id", sa.Integer(), nullable=True),
        sa.ForeignKeyConstraint(["district_id"], ["districts.id"]),
        sa.ForeignKeyConstraint(["user_id"], ["users.id"]),
        sa.PrimaryKeyConstraint("id"),
    )

    # 20. audit_logs
    op.create_table(
        "audit_logs",
        sa.Column("id", postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column("actor_id", postgresql.UUID(as_uuid=True), nullable=True),
        sa.Column("actor_role", sa.String(length=50), nullable=False),
        sa.Column("action", sa.String(length=100), nullable=False),
        sa.Column("resource_type", sa.String(length=100), nullable=False),
        sa.Column("resource_id", sa.String(length=100), nullable=False),
        sa.Column("old_values", postgresql.JSONB(astext_type=sa.Text()), nullable=True),
        sa.Column("new_values", postgresql.JSONB(astext_type=sa.Text()), nullable=True),
        sa.Column(
            "created_at",
            sa.DateTime(timezone=True),
            server_default=sa.text("now()"),
            nullable=False,
        ),
        sa.PrimaryKeyConstraint("id"),
    )


def downgrade() -> None:
    op.drop_table("audit_logs")
    op.drop_table("user_scopes")
    op.drop_table("users")
    op.drop_table("district_plan_items")
    op.drop_table("district_plans")
    op.drop_table("recommendation_evidence")
    op.drop_table("recommendations")
    op.drop_table("gap_scores")
    op.drop_table("placement_validation_errors")
    op.drop_table("placement_records")
    op.drop_table("placement_batches")
    op.drop_table("institute_courses")
    op.drop_table("courses")
    op.drop_table("institutes")
    op.drop_table("job_role_skills")
    op.drop_table("skills")
    op.drop_table("job_roles")
    op.drop_table("sscs")
    op.drop_table("sectors")
    op.drop_table("districts")
