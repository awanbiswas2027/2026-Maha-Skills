import pytest
from pydantic import ValidationError

from app.core.config import _COMPROMISED_SALT, Settings


def test_cfg_001_omit_dpdp_tenant_salt(monkeypatch: pytest.MonkeyPatch) -> None:
    """CFG-001: omit DPDP_TENANT_SALT -> ValidationError."""
    monkeypatch.delenv("DPDP_TENANT_SALT", raising=False)
    with pytest.raises(ValidationError):
        Settings(_env_file=None)


def test_cfg_002_salt_shorter_than_32_chars() -> None:
    """CFG-002: salt shorter than 32 chars -> ValidationError."""
    with pytest.raises(ValidationError):
        Settings(DPDP_TENANT_SALT="too_short_salt_under_32_chars", _env_file=None)


def test_cfg_003_compromised_salt_production() -> None:
    """CFG-003: compromised salt + ENVIRONMENT=production -> ValidationError."""
    with pytest.raises(ValidationError):
        Settings(
            ENVIRONMENT="production",
            DPDP_TENANT_SALT=_COMPROMISED_SALT,
            KEYCLOAK_URL="https://auth.mahaskills.gov.in",
            AUTH_JWT_SECRET="a" * 32,
            _env_file=None,
        )


def test_cfg_004_compromised_salt_development() -> None:
    """CFG-004: compromised salt + ENVIRONMENT=development -> constructs successfully."""
    s = Settings(
        ENVIRONMENT="development",
        DPDP_TENANT_SALT=_COMPROMISED_SALT,
        _env_file=None,
    )
    assert s.DPDP_TENANT_SALT == _COMPROMISED_SALT


def test_cfg_005_invalid_environment_literal() -> None:
    """CFG-005: ENVIRONMENT="prod" -> ValidationError."""
    with pytest.raises(ValidationError):
        Settings(
            ENVIRONMENT="prod",
            DPDP_TENANT_SALT="s" * 32,
            _env_file=None,
        )


def test_cfg_006_cors_origins_comma_separated() -> None:
    """CFG-006: CORS_ORIGINS="a, b ,c" -> ["a","b","c"]."""
    s = Settings(
        DPDP_TENANT_SALT="s" * 32,
        CORS_ORIGINS="a, b ,c",
        _env_file=None,
    )
    assert s.CORS_ORIGINS == ["a", "b", "c"]


def test_cfg_007_cors_origins_json_array() -> None:
    """CFG-007: CORS_ORIGINS='["a","b"]' -> ["a","b"]."""
    s = Settings(
        DPDP_TENANT_SALT="s" * 32,
        CORS_ORIGINS='["a","b"]',
        _env_file=None,
    )
    assert s.CORS_ORIGINS == ["a", "b"]


def test_cfg_008_cors_origins_wildcard_staging() -> None:
    """CFG-008: CORS_ORIGINS="*" + ENVIRONMENT=staging -> ValidationError."""
    with pytest.raises(ValidationError):
        Settings(
            ENVIRONMENT="staging",
            CORS_ORIGINS="*",
            DPDP_TENANT_SALT="s" * 32,
            KEYCLOAK_URL="https://staging-auth.mahaskills.gov.in",
            AUTH_JWT_SECRET="a" * 32,
            _env_file=None,
        )


def test_cfg_009_keycloak_url_trailing_slash() -> None:
    """CFG-009: KEYCLOAK_URL with trailing slash -> issuer has no double slash."""
    s = Settings(
        DPDP_TENANT_SALT="s" * 32,
        KEYCLOAK_URL="http://localhost:8080/",
        KEYCLOAK_REALM="mahaskills",
        _env_file=None,
    )
    assert s.keycloak_issuer == "http://localhost:8080/realms/mahaskills"
    assert "//realms" not in s.keycloak_issuer


def test_cfg_010_keycloak_audience_fallback() -> None:
    """CFG-010: keycloak_audience with KEYCLOAK_AUDIENCE unset -> equals KEYCLOAK_CLIENT_ID."""
    s = Settings(
        DPDP_TENANT_SALT="s" * 32,
        KEYCLOAK_CLIENT_ID="mahaskills-api",
        KEYCLOAK_AUDIENCE=None,
        _env_file=None,
    )
    assert s.keycloak_audience == "mahaskills-api"


def test_cfg_011_database_url_sync_asyncpg() -> None:
    """CFG-011: database_url_sync from an asyncpg URL -> postgresql+psycopg2://..."""
    s = Settings(
        DPDP_TENANT_SALT="s" * 32,
        DATABASE_URL="postgresql+asyncpg://mahaskills_user:pass@localhost:5432/mahaskills",
        _env_file=None,
    )
    assert (
        s.database_url_sync
        == "postgresql+psycopg2://mahaskills_user:pass@localhost:5432/mahaskills"
    )


def test_cfg_012_database_url_sync_non_asyncpg() -> None:
    """CFG-012: database_url_sync from a non-asyncpg URL -> unchanged."""
    s = Settings(
        DPDP_TENANT_SALT="s" * 32,
        DATABASE_URL="postgresql+psycopg2://mahaskills_user:pass@localhost:5432/mahaskills",
        _env_file=None,
    )
    assert (
        s.database_url_sync
        == "postgresql+psycopg2://mahaskills_user:pass@localhost:5432/mahaskills"
    )

    s_sqlite = Settings(
        DPDP_TENANT_SALT="s" * 32,
        DATABASE_URL="sqlite:///test.db",
        _env_file=None,
    )
    assert s_sqlite.database_url_sync == "sqlite:///test.db"


def test_cfg_013_keycloak_url_http_production() -> None:
    """CFG-013: KEYCLOAK_URL="http://..." + ENVIRONMENT=production -> ValidationError."""
    with pytest.raises(ValidationError):
        Settings(
            ENVIRONMENT="production",
            KEYCLOAK_URL="http://auth.mahaskills.gov.in",
            DPDP_TENANT_SALT="s" * 32,
            AUTH_JWT_SECRET="a" * 32,
            _env_file=None,
        )


def test_cors_origins_empty_string() -> None:
    """Edge case: CORS_ORIGINS="" -> empty list []."""
    s = Settings(
        DPDP_TENANT_SALT="s" * 32,
        CORS_ORIGINS="",
        _env_file=None,
    )
    assert s.CORS_ORIGINS == []


def test_keycloak_jwks_url() -> None:
    """Keycloak JWKS URL derived property."""
    s = Settings(
        DPDP_TENANT_SALT="s" * 32,
        KEYCLOAK_URL="https://auth.mahaskills.gov.in",
        KEYCLOAK_REALM="mahaskills",
        _env_file=None,
    )
    assert (
        s.keycloak_jwks_url
        == "https://auth.mahaskills.gov.in/realms/mahaskills/protocol/openid-connect/certs"
    )


def test_keycloak_audience_explicit() -> None:
    """Explicit KEYCLOAK_AUDIENCE overrides client id."""
    s = Settings(
        DPDP_TENANT_SALT="s" * 32,
        KEYCLOAK_CLIENT_ID="mahaskills-api",
        KEYCLOAK_AUDIENCE="custom-audience",
        _env_file=None,
    )
    assert s.keycloak_audience == "custom-audience"
