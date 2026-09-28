import pytest
from pydantic import ValidationError
from sqlalchemy import CheckConstraint

from app.core.config import Settings
from app.models.auth import AccountStatus, EmailVerification, RefreshToken, VerificationPurpose
from app.models.user import User


def test_account_status_enum_values():
    expected_values = {
        "PENDING_VERIFICATION",
        "PENDING_APPROVAL",
        "ACTIVE",
        "SUSPENDED",
        "REJECTED",
    }
    actual_values = {status.value for status in AccountStatus}
    assert actual_values == expected_values
    assert len(AccountStatus) == 5


def test_verification_purpose_enum_values():
    expected_values = {"VERIFY_EMAIL", "RESET_PASSWORD"}
    actual_values = {p.value for p in VerificationPurpose}
    assert actual_values == expected_values
    assert len(VerificationPurpose) == 2


def test_user_model_columns_and_nullability():
    table = User.__table__

    # Existing columns
    assert table.columns["id"].nullable is False
    assert table.columns["keycloak_sub"].nullable is True
    assert table.columns["keycloak_sub"].unique is True
    assert table.columns["email"].nullable is False
    assert table.columns["email"].unique is True
    assert table.columns["full_name"].nullable is False
    assert table.columns["is_active"].nullable is False

    # New auth columns
    assert table.columns["password_hash"].nullable is True
    assert table.columns["account_status"].nullable is False
    assert table.columns["email_verified"].nullable is False
    assert table.columns["phone"].nullable is True
    assert table.columns["created_at"].nullable is False
    assert table.columns["updated_at"].nullable is False
    assert table.columns["last_login_at"].nullable is True

    # Check constraint on account_status
    check_constraints = [c for c in table.constraints if isinstance(c, CheckConstraint)]
    status_check = next((c for c in check_constraints if c.name == "ck_users_account_status"), None)
    assert status_check is not None
    assert "PENDING_VERIFICATION" in str(status_check.sqltext)
    assert "ACTIVE" in str(status_check.sqltext)

    # Index on account_status
    index_names = {idx.name for idx in table.indexes}
    assert "ix_users_account_status" in index_names


def test_refresh_token_model_columns_and_constraints():
    table = RefreshToken.__table__
    assert table.name == "refresh_tokens"

    # Columns
    cols = table.columns
    assert cols["id"].nullable is False
    assert cols["user_id"].nullable is False
    assert cols["token_hash"].nullable is False
    assert cols["family_id"].nullable is False
    assert cols["expires_at"].nullable is False
    assert cols["revoked_at"].nullable is True
    assert cols["created_at"].nullable is False
    assert cols["user_agent"].nullable is True
    assert cols["ip_address"].nullable is True

    # Foreign key to users.id with CASCADE
    fk = next(iter(cols["user_id"].foreign_keys))
    assert fk.target_fullname == "users.id"
    assert fk.ondelete is not None and fk.ondelete.upper() == "CASCADE"

    # Verify no separate UniqueConstraint for token_hash
    from sqlalchemy import UniqueConstraint

    unique_constraints = [c for c in table.constraints if isinstance(c, UniqueConstraint)]
    token_hash_uqs = [
        c for c in unique_constraints if {col.name for col in c.columns} == {"token_hash"}
    ]
    assert len(token_hash_uqs) == 0, "Should not have a separate UniqueConstraint on token_hash"

    # Verify exactly one unique index on token_hash
    token_hash_indexes = [
        idx for idx in table.indexes if {col.name for col in idx.columns} == {"token_hash"}
    ]
    assert len(token_hash_indexes) == 1, "Should have exactly one index on token_hash"
    assert token_hash_indexes[0].unique is True, "The index on token_hash must be unique"
    assert token_hash_indexes[0].name == "ix_refresh_tokens_token_hash"

    # Indexes on family_id, user_id, expires_at
    indexed_col_sets = [{c.name for c in idx.columns} for idx in table.indexes]
    assert {"family_id"} in indexed_col_sets
    assert {"user_id"} in indexed_col_sets
    assert {"expires_at"} in indexed_col_sets


def test_email_verification_model_columns_and_constraints():
    table = EmailVerification.__table__
    assert table.name == "email_verifications"

    # Columns
    cols = table.columns
    assert cols["id"].nullable is False
    assert cols["user_id"].nullable is False
    assert cols["code_hash"].nullable is False
    assert cols["purpose"].nullable is False
    assert cols["expires_at"].nullable is False
    assert cols["consumed_at"].nullable is True
    assert cols["attempts"].nullable is False
    assert cols["created_at"].nullable is False

    # Foreign key to users.id with CASCADE
    fk = next(iter(cols["user_id"].foreign_keys))
    assert fk.target_fullname == "users.id"
    assert fk.ondelete is not None and fk.ondelete.upper() == "CASCADE"

    # Check constraint on purpose
    check_constraints = [c for c in table.constraints if isinstance(c, CheckConstraint)]
    purpose_check = next(
        (c for c in check_constraints if c.name == "ck_email_verifications_purpose"), None
    )
    assert purpose_check is not None
    assert "VERIFY_EMAIL" in str(purpose_check.sqltext)
    assert "RESET_PASSWORD" in str(purpose_check.sqltext)

    # Composite index on (user_id, purpose)
    indexed_col_tuples = [tuple(c.name for c in idx.columns) for idx in table.indexes]
    assert ("user_id", "purpose") in indexed_col_tuples


# The production branch of validate_environment_constraints checks KEYCLOAK_URL before
# AUTH_JWT_SECRET, so every production Settings() here must supply an https Keycloak URL and a
# non-compromised salt. Otherwise the assertion below matches an unrelated earlier error.
_PROD_BASE = {
    "ENVIRONMENT": "production",
    "KEYCLOAK_URL": "https://auth.example.gov.in",
    "DPDP_TENANT_SALT": "p" * 32,
}


def test_config_jwt_secret_validation_in_production():
    # Production with empty secret -> raises
    with pytest.raises(ValidationError, match="AUTH_JWT_SECRET must be at least 32 characters"):
        Settings(**_PROD_BASE, AUTH_JWT_SECRET="")

    # Production with short secret -> raises
    with pytest.raises(ValidationError, match="AUTH_JWT_SECRET must be at least 32 characters"):
        Settings(**_PROD_BASE, AUTH_JWT_SECRET="short_secret_under_32_chars")

    # Production with 32+ character secret -> succeeds
    prod_settings = Settings(
        **_PROD_BASE,
        AUTH_JWT_SECRET="a_production_jwt_signing_secret_key_32_bytes!",
    )
    assert prod_settings.AUTH_JWT_SECRET == "a_production_jwt_signing_secret_key_32_bytes!"


def test_config_jwt_secret_validation_in_development():
    # Development with empty secret -> succeeds
    dev_settings = Settings(ENVIRONMENT="development", AUTH_JWT_SECRET="")
    assert dev_settings.AUTH_JWT_SECRET == ""
