import secrets
from pathlib import Path

import pytest
from httpx import AsyncClient
from jose import jwt

from app.core.config import Settings, settings
from app.core.security import AuthException, resolve_security_context
from app.services.auth_token_service import (
    LocalSigningKeyUnavailableError,
    create_access_token,
)


@pytest.fixture
def override_settings(monkeypatch):
    def _override(**kwargs):
        for k, v in kwargs.items():
            monkeypatch.setattr(settings, k, v)
        return settings

    return _override


@pytest.mark.asyncio
async def test_reg_p15_001(override_settings):
    override_settings(AUTH_JWT_SECRET="")
    token = jwt.encode(
        {
            "sub": "123",
            "realm_access": {"roles": ["CANDIDATE"]},
            "aud": settings.keycloak_audience,
            "iss": settings.AUTH_JWT_ISSUER,
            "exp": 9999999999,
            "nbf": 0,
        },
        "",
        algorithm="HS256",
    )
    with pytest.raises(AuthException) as exc_info:
        resolve_security_context(token)
    assert exc_info.value.status_code == 401
    assert exc_info.value.detail["message"] == "Token verification failed"
    assert exc_info.value.detail["code"] == "TOKEN_INVALID"


@pytest.mark.asyncio
async def test_reg_p15_002(client: AsyncClient, override_settings):
    override_settings(AUTH_JWT_SECRET="")
    token = jwt.encode(
        {
            "sub": "123",
            "realm_access": {"roles": ["CANDIDATE"]},
            "aud": settings.keycloak_audience,
            "iss": settings.AUTH_JWT_ISSUER,
            "exp": 9999999999,
            "nbf": 0,
        },
        "",
        algorithm="HS256",
    )
    response = await client.get("/v1/auth/me", headers={"Authorization": f"Bearer {token}"})
    assert response.status_code == 401


@pytest.mark.asyncio
async def test_reg_p15_003(override_settings):
    override_settings(AUTH_JWT_SECRET="")
    with pytest.raises(LocalSigningKeyUnavailableError) as exc_info:
        create_access_token("123", ["CANDIDATE"])
    assert exc_info.value.status_code == 503
    assert exc_info.value.detail["code"] == "LOCAL_AUTH_UNAVAILABLE"

    override_settings(AUTH_JWT_SECRET="a" * 31)
    with pytest.raises(LocalSigningKeyUnavailableError) as exc_info2:
        create_access_token("123", ["CANDIDATE"])
    assert exc_info2.value.status_code == 503


@pytest.mark.asyncio
async def test_reg_p15_004(override_settings):
    # 32 ASCII bytes
    secret_32_ascii = "a" * 32
    override_settings(AUTH_JWT_SECRET=secret_32_ascii)
    token = create_access_token("123", ["CANDIDATE"])
    ctx = resolve_security_context(token)
    assert ctx.user_id == "123"

    # 16 x 2-byte char = 32 bytes
    secret_16_multi = "é" * 16
    override_settings(AUTH_JWT_SECRET=secret_16_multi)
    token2 = create_access_token("123", ["CANDIDATE"])
    ctx2 = resolve_security_context(token2)
    assert ctx2.user_id == "123"

    # 31 ASCII bytes
    override_settings(AUTH_JWT_SECRET="a" * 31)
    with pytest.raises(LocalSigningKeyUnavailableError):
        create_access_token("123", ["CANDIDATE"])

    # 31 bytes (15 x 2-byte + 1 ASCII)
    override_settings(AUTH_JWT_SECRET="é" * 15 + "a")
    with pytest.raises(LocalSigningKeyUnavailableError):
        create_access_token("123", ["CANDIDATE"])


@pytest.mark.asyncio
async def test_reg_p15_005(override_settings, caplog):
    valid_key_1 = secrets.token_urlsafe(48)
    valid_key_2 = secrets.token_urlsafe(48)

    override_settings(AUTH_JWT_SECRET=valid_key_1)
    token = create_access_token("123", ["CANDIDATE"])

    override_settings(AUTH_JWT_SECRET=valid_key_2)
    with pytest.raises(AuthException) as exc_info:
        resolve_security_context(token)

    assert exc_info.value.status_code == 401
    assert exc_info.value.detail["message"] == "Token verification failed"
    assert ":" not in exc_info.value.detail["message"]

    # Check that a WARNING was logged containing library detail
    assert any(
        record.levelname == "WARNING" and "Signature verification failed" in record.message
        for record in caplog.records
    )


@pytest.mark.asyncio
async def test_reg_p15_006(override_settings, mint_token):
    override_settings(AUTH_JWT_SECRET="")
    token = mint_token(roles=["ADMIN"], sub="user-123")
    ctx = resolve_security_context(token)
    assert ctx.user_id == "user-123"
    assert "ADMIN" in ctx.roles


@pytest.mark.asyncio
async def test_reg_p15_007(client: AsyncClient, override_settings, db_session):
    # Setup active user
    await client.post(
        "/v1/auth/register",
        json={
            "email": "candidate@example.com",
            "password": "TestPassword123!",
            "full_name": "Test Candidate",
            "role": "CANDIDATE",
        },
    )
    from sqlalchemy import text

    await db_session.execute(
        text("UPDATE users SET account_status = 'ACTIVE' WHERE email = 'candidate@example.com'")
    )
    await db_session.commit()

    override_settings(AUTH_JWT_SECRET="")
    response = await client.post(
        "/v1/auth/login", json={"email": "candidate@example.com", "password": "TestPassword123!"}
    )
    assert response.status_code == 503
    assert response.json()["detail"]["code"] == "LOCAL_AUTH_UNAVAILABLE"

    result = await db_session.execute(text("SELECT COUNT(*) FROM refresh_tokens"))
    assert result.scalar() == 0


def test_reg_p15_008(caplog):
    import logging

    # test_auth_schema.py style tests
    with caplog.at_level(logging.WARNING, logger="app.core.config"):
        # Development allows empty secret but logs exactly one warning
        s1 = Settings(
            ENVIRONMENT="development",
            AUTH_JWT_SECRET="",
            DPDP_TENANT_SALT=secrets.token_urlsafe(32),
        )
        warnings = [r for r in caplog.records if r.levelname == "WARNING"]
        assert len(warnings) == 1
        assert "disabled" in warnings[0].message
        assert s1.AUTH_JWT_SECRET == ""

    # Staging fails with 31 bytes
    from pydantic import ValidationError

    with pytest.raises(ValidationError):
        Settings(
            ENVIRONMENT="staging",
            AUTH_JWT_SECRET="a" * 31,
            DPDP_TENANT_SALT=secrets.token_urlsafe(32),
        )

    # Production passes with 32 bytes of 2-byte chars
    s3 = Settings(
        ENVIRONMENT="production",
        AUTH_JWT_SECRET="é" * 16,
        DPDP_TENANT_SALT=secrets.token_urlsafe(32),
        KEYCLOAK_URL="https://example.com",
    )
    assert s3.AUTH_JWT_SECRET == "é" * 16


def test_reg_p15_009():
    compose_path = Path(__file__).parent.parent.parent / "docker-compose.yml"
    content = compose_path.read_text()
    assert "AUTH_JWT_SECRET=${AUTH_JWT_SECRET:?" in content
    # Make sure no literal assignment
    lines = content.splitlines()
    for line in lines:
        if "AUTH_JWT_SECRET" in line:
            # Should not be like AUTH_JWT_SECRET=something_literal
            assert "${AUTH_JWT_SECRET" in line or "AUTH_JWT_SECRET" not in line.split("=")[0]
