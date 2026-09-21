from sqlalchemy.dialects.postgresql import JSONB, UUID
from sqlalchemy.ext.compiler import compiles


@compiles(JSONB, "sqlite")
def compile_jsonb_sqlite(type_, compiler, **kw):
    return "JSON"


@compiles(UUID, "sqlite")
def compile_uuid_sqlite(type_, compiler, **kw):
    return "TEXT"


import os
import time
import uuid
from typing import Any

# Settings() is constructed at import time in app.core.config, and DPDP_TENANT_SALT is a required
# field with no default (deliberately — a usable pepper must never sit in source control). Tests run
# without a .env file, so supply a non-secret test value before anything imports the app. This is a
# test fixture value, not a credential; real environments provide the pepper via the environment.
os.environ.setdefault("DPDP_TENANT_SALT", "t" * 32)

import pytest
from cryptography.hazmat.primitives import serialization
from cryptography.hazmat.primitives.asymmetric import rsa
from httpx import AsyncClient
from jose import jwk, jwt

from app.core.config import settings
from app.core.jwks import jwks_client
from app.main import app


@pytest.fixture
async def client():
    async with AsyncClient(app=app, base_url="http://test") as ac:
        yield ac


@pytest.fixture(autouse=True)
def ensure_test_jwt_secret(monkeypatch: pytest.MonkeyPatch):
    """Ensure settings.AUTH_JWT_SECRET is configured for test execution if not in environment."""
    if not settings.AUTH_JWT_SECRET:
        monkeypatch.setattr(
            settings,
            "AUTH_JWT_SECRET",
            "test_jwt_secret_key_at_least_32_characters_long!",
        )


@pytest.fixture(scope="session")
def rsa_test_keypair():
    """Session-scoped RSA keypair for minting and verifying Keycloak RS256 test tokens."""
    key = rsa.generate_private_key(public_exponent=65537, key_size=2048)
    private_pem = key.private_bytes(
        encoding=serialization.Encoding.PEM,
        format=serialization.PrivateFormat.PKCS8,
        encryption_algorithm=serialization.NoEncryption(),
    ).decode("utf-8")
    public_pem = (
        key.public_key()
        .public_bytes(
            encoding=serialization.Encoding.PEM,
            format=serialization.PublicFormat.SubjectPublicKeyInfo,
        )
        .decode("utf-8")
    )
    jwk_dict = jwk.RSAKey(key=public_pem, algorithm="RS256").to_dict()
    kid = "test-keycloak-kid-001"
    jwk_dict["kid"] = kid
    return {
        "private_pem": private_pem,
        "public_pem": public_pem,
        "jwk_dict": jwk_dict,
        "kid": kid,
    }


@pytest.fixture
def mint_token(rsa_test_keypair: dict[str, Any]):
    """Session-ready fixture to mint RS256 Keycloak test tokens with pre-configured JWKS cache."""
    jwks_client.set_cached_keys({rsa_test_keypair["kid"]: rsa_test_keypair["jwk_dict"]})

    def _mint(
        roles: list[str] | None = None,
        account_status: str = "ACTIVE",
        district_id: int | None = 14,
        institute_id: str | None = None,
        sector_ids: list[int] | None = None,
        employer_id: str | None = None,
        sub: str | None = None,
        email: str | None = None,
        expired: bool = False,
        payload_overrides: dict[str, Any] | None = None,
    ) -> str:
        now = int(time.time())
        exp = now - 60 if expired else now + 900
        payload = {
            "iss": settings.keycloak_issuer,
            "aud": settings.keycloak_audience,
            "sub": sub or str(uuid.uuid4()),
            "exp": exp,
            "iat": now - 100,
            "nbf": now - 100,
            "jti": str(uuid.uuid4()),
            "typ": "Bearer",
            "email": email or "test.user@mahaskills.gov.in",
            "account_status": account_status,
            "realm_access": {"roles": roles if roles is not None else ["DISTRICT_OFFICER"]},
            "district_id": district_id,
            "district_name": "Pune",
            "division": "Pune",
            "institute_id": institute_id,
            "sector_ids": sector_ids if sector_ids is not None else [],
            "employer_id": employer_id,
        }
        if payload_overrides:
            payload.update(payload_overrides)

        headers = {"kid": rsa_test_keypair["kid"]}
        return jwt.encode(
            payload,
            rsa_test_keypair["private_pem"],
            algorithm="RS256",
            headers=headers,
        )

    return _mint


import pytest_asyncio
from sqlalchemy.ext.asyncio import AsyncSession, async_sessionmaker, create_async_engine

from app.core.database import Base, get_db_session


@pytest_asyncio.fixture
async def db_session():
    engine = create_async_engine("sqlite+aiosqlite:///:memory:", echo=False)
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)

    SessionLocal = async_sessionmaker(engine, class_=AsyncSession, expire_on_commit=False)
    async with SessionLocal() as session:
        yield session

    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.drop_all)
    await engine.dispose()


@pytest_asyncio.fixture(autouse=True)
async def override_get_db_session(db_session):
    async def _get_db_session_override():
        yield db_session

    app.dependency_overrides[get_db_session] = _get_db_session_override
    yield
    app.dependency_overrides.clear()
