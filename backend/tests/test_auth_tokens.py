import json
import time
import uuid
from typing import Any

import httpx
import pytest
from fastapi import HTTPException
from fastapi.security import HTTPAuthorizationCredentials
from jose import jwt

from app.core.config import settings
from app.core.jwks import jwks_client
from app.core.security import (
    get_current_security_context,
    get_optional_security_context,
    resolve_security_context,
)
from app.services.auth_token_service import (
    ALL_ROLES,
    STAFF_ROLES,
    StaffRoleNotPermittedError,
    create_access_token,
    create_refresh_token,
    hash_refresh_token,
)


def _mint_test_hs256_token(
    payload_overrides: dict[str, Any] | None = None,
    secret: str | None = None,
    headers: dict[str, Any] | None = None,
) -> str:
    """Helper to mint HS256 tokens directly for security and edge-case testing."""
    now = int(time.time())
    payload = {
        "iss": settings.AUTH_JWT_ISSUER,
        "aud": settings.keycloak_audience,
        "sub": str(uuid.uuid4()),
        "exp": now + 900,
        "iat": now,
        "nbf": now,
        "jti": str(uuid.uuid4()),
        "typ": "Bearer",
        "email": "candidate@example.com",
        "account_status": "ACTIVE",
        "realm_access": {"roles": ["CANDIDATE"]},
        "district_id": 14,
        "district_name": "Pune",
        "division": "Pune",
        "institute_id": None,
        "sector_ids": [101, 102],
        "employer_id": None,
    }
    if payload_overrides:
        payload.update(payload_overrides)
    key = secret or settings.AUTH_JWT_SECRET
    return jwt.encode(payload, key, algorithm="HS256", headers=headers)


def _mint_test_rs256_token(
    rsa_test_keypair: dict[str, Any],
    payload_overrides: dict[str, Any] | None = None,
    headers: dict[str, Any] | None = None,
) -> str:
    """Helper to mint RS256 tokens signed with test RSA private key."""
    now = int(time.time())
    payload = {
        "iss": settings.keycloak_issuer,
        "aud": settings.keycloak_audience,
        "sub": str(uuid.uuid4()),
        "exp": now + 900,
        "iat": now,
        "nbf": now,
        "jti": str(uuid.uuid4()),
        "typ": "Bearer",
        "email": "officer@mahaskills.gov.in",
        "account_status": "ACTIVE",
        "realm_access": {"roles": ["DISTRICT_OFFICER"]},
        "district_id": 14,
        "district_name": "Pune",
        "division": "Pune",
        "institute_id": None,
        "sector_ids": [],
        "employer_id": None,
    }
    if payload_overrides:
        payload.update(payload_overrides)

    token_headers = {"kid": rsa_test_keypair["kid"]}
    if headers:
        token_headers.update(headers)

    return jwt.encode(
        payload,
        rsa_test_keypair["private_pem"],
        algorithm="RS256",
        headers=token_headers,
    )


# ---------------------------------------------------------------------------
# REG-TOK-001: Valid local token
# ---------------------------------------------------------------------------
def test_reg_tok_001_valid_local_token() -> None:
    """REG-TOK-001: valid local token -> context with issuer='local', correct roles and scopes."""
    user_id = str(uuid.uuid4())
    mock_user = {
        "id": user_id,
        "email": "candidate.test@example.com",
        "account_status": "ACTIVE",
    }
    scopes = {
        "district_id": 14,
        "district_name": "Pune",
        "division": "Pune",
        "sector_ids": [10, 20],
        "employer_id": None,
    }

    token = create_access_token(user=mock_user, roles=["CANDIDATE"], scopes=scopes)
    ctx = resolve_security_context(token)

    assert ctx.issuer == "local"
    assert ctx.user_id == user_id
    assert ctx.roles == ["CANDIDATE"]
    assert ctx.email == "candidate.test@example.com"
    assert ctx.district_id == 14
    assert ctx.sector_ids == [10, 20]
    assert ctx.account_status == "ACTIVE"
    assert ctx.is_authenticated is True
    assert ctx.token_id is not None


# ---------------------------------------------------------------------------
# REG-TOK-002: Valid Keycloak-shaped RS256 token
# ---------------------------------------------------------------------------
def test_reg_tok_002_valid_keycloak_rs256_token(rsa_test_keypair: dict[str, Any]) -> None:
    """REG-TOK-002: valid Keycloak-shaped RS256 token -> context with issuer='keycloak'."""
    jwks_client.set_cached_keys({rsa_test_keypair["kid"]: rsa_test_keypair["jwk_dict"]})

    user_sub = "kc-user-8c3b01a2"
    token = _mint_test_rs256_token(
        rsa_test_keypair,
        payload_overrides={
            "sub": user_sub,
            "email": "dpo.pune@gov.in",
            "realm_access": {"roles": ["DISTRICT_OFFICER"]},
            "district_id": 14,
        },
    )

    ctx = resolve_security_context(token)
    assert ctx.issuer == "keycloak"
    assert ctx.user_id == user_sub
    assert ctx.roles == ["DISTRICT_OFFICER"]
    assert ctx.email == "dpo.pune@gov.in"
    assert ctx.district_id == 14
    assert ctx.is_authenticated is True


# ---------------------------------------------------------------------------
# REG-TOK-003: Local token carrying ADMIN -> 401 (ADR-001 guard)
# ---------------------------------------------------------------------------
def test_reg_tok_003_local_token_carrying_admin_rejected() -> None:
    """REG-TOK-003: local token carrying ADMIN -> 401 (the ADR-001 privilege escalation guard)."""
    token = _mint_test_hs256_token(payload_overrides={"realm_access": {"roles": ["ADMIN"]}})

    with pytest.raises(HTTPException) as exc_info:
        resolve_security_context(token)

    assert exc_info.value.status_code == 401
    assert exc_info.value.detail.get("code") == "ROLE_NOT_PERMITTED"


@pytest.mark.parametrize("staff_role", list(STAFF_ROLES))
def test_reg_tok_003_b_all_staff_roles_rejected_on_local_token(staff_role: str) -> None:
    """Verify that every single staff role is rejected when presented via the local issuer."""
    token = _mint_test_hs256_token(payload_overrides={"realm_access": {"roles": [staff_role]}})

    with pytest.raises(HTTPException) as exc_info:
        resolve_security_context(token)

    assert exc_info.value.status_code == 401
    assert exc_info.value.detail.get("code") == "ROLE_NOT_PERMITTED"


# ---------------------------------------------------------------------------
# REG-TOK-004: create_access_token refuses to mint staff-role local token
# ---------------------------------------------------------------------------
@pytest.mark.parametrize("staff_role", list(STAFF_ROLES))
def test_reg_tok_004_create_access_token_refuses_staff_role(staff_role: str) -> None:
    """REG-TOK-004: create_access_token refuses to mint a staff-role local token."""
    with pytest.raises((ValueError, StaffRoleNotPermittedError)):
        create_access_token(user="user-123", roles=[staff_role])


# ---------------------------------------------------------------------------
# REG-TOK-005: Expired token -> 401 TOKEN_EXPIRED
# ---------------------------------------------------------------------------
def test_reg_tok_005_expired_token_rejected() -> None:
    """REG-TOK-005: expired token -> 401 TOKEN_EXPIRED."""
    now = int(time.time())
    # Expired 120s ago (> 60s leeway)
    token = _mint_test_hs256_token(
        payload_overrides={
            "exp": now - 120,
            "iat": now - 1000,
            "nbf": now - 1000,
        }
    )

    with pytest.raises(HTTPException) as exc_info:
        resolve_security_context(token)

    assert exc_info.value.status_code == 401
    assert exc_info.value.detail.get("code") == "TOKEN_EXPIRED"


# ---------------------------------------------------------------------------
# REG-TOK-006: Bad signature -> 401
# ---------------------------------------------------------------------------
def test_reg_tok_006_bad_signature_rejected() -> None:
    """REG-TOK-006: bad signature -> 401 TOKEN_INVALID."""
    wrong_secret = "invalid_secret_key_wrong_signature_32_bytes!"
    token = _mint_test_hs256_token(secret=wrong_secret)

    with pytest.raises(HTTPException) as exc_info:
        resolve_security_context(token)

    assert exc_info.value.status_code == 401
    assert exc_info.value.detail.get("code") == "TOKEN_INVALID"


# ---------------------------------------------------------------------------
# REG-TOK-007: alg: none -> 401
# ---------------------------------------------------------------------------
def test_reg_tok_007_alg_none_rejected() -> None:
    """REG-TOK-007: alg: none -> 401 TOKEN_INVALID."""
    now = int(time.time())
    claims = {
        "iss": settings.AUTH_JWT_ISSUER,
        "aud": settings.keycloak_audience,
        "sub": "user-none",
        "exp": now + 900,
        "iat": now,
        "nbf": now,
        "realm_access": {"roles": ["CANDIDATE"]},
    }
    header_b64 = "eyJhbGciOiJub25lIiwidHlwIjoiSldUIn0"  # {"alg":"none","typ":"JWT"}
    import base64

    claims_b64 = base64.urlsafe_b64encode(json.dumps(claims).encode()).decode("utf-8").rstrip("=")
    token = f"{header_b64}.{claims_b64}."

    with pytest.raises(HTTPException) as exc_info:
        resolve_security_context(token)

    assert exc_info.value.status_code == 401
    assert exc_info.value.detail.get("code") == "TOKEN_INVALID"


# ---------------------------------------------------------------------------
# REG-TOK-008: Algorithm confusion -> 401
# ---------------------------------------------------------------------------
def test_reg_tok_008_algorithm_confusion_rejected(rsa_test_keypair: dict[str, Any]) -> None:
    """REG-TOK-008: algorithm confusion (RS256 public key used as an HS256 secret) -> 401."""
    import base64
    import hashlib
    import hmac

    now = int(time.time())
    header = {"alg": "HS256", "typ": "JWT"}
    payload = {
        "iss": settings.keycloak_issuer,
        "aud": settings.keycloak_audience,
        "sub": "attacker-confused",
        "exp": now + 900,
        "iat": now,
        "nbf": now,
        "realm_access": {"roles": ["ADMIN"]},
    }
    header_b64 = base64.urlsafe_b64encode(json.dumps(header).encode()).decode("utf-8").rstrip("=")
    payload_b64 = base64.urlsafe_b64encode(json.dumps(payload).encode()).decode("utf-8").rstrip("=")
    signing_input = f"{header_b64}.{payload_b64}".encode()
    sig = (
        base64.urlsafe_b64encode(
            hmac.new(
                rsa_test_keypair["public_pem"].encode(),
                signing_input,
                hashlib.sha256,
            ).digest()
        )
        .decode("utf-8")
        .rstrip("=")
    )
    token = f"{header_b64}.{payload_b64}.{sig}"

    with pytest.raises(HTTPException) as exc_info:
        resolve_security_context(token)

    assert exc_info.value.status_code == 401
    assert exc_info.value.detail.get("code") == "TOKEN_INVALID"


# ---------------------------------------------------------------------------
# REG-TOK-009: Unknown issuer -> 401
# ---------------------------------------------------------------------------
def test_reg_tok_009_unknown_issuer_rejected() -> None:
    """REG-TOK-009: unknown issuer -> 401 ISSUER_UNKNOWN."""
    token = _mint_test_hs256_token(payload_overrides={"iss": "https://attacker.example.com/auth"})

    with pytest.raises(HTTPException) as exc_info:
        resolve_security_context(token)

    assert exc_info.value.status_code == 401
    assert exc_info.value.detail.get("code") == "ISSUER_UNKNOWN"


# ---------------------------------------------------------------------------
# REG-TOK-010: No credentials -> 401 from get_current_security_context
# ---------------------------------------------------------------------------
def test_reg_tok_010_no_credentials_current_context_raises_401() -> None:
    """REG-TOK-010: no credentials -> 401 from get_current_security_context."""
    with pytest.raises(HTTPException) as exc_info:
        get_current_security_context(credentials=None)

    assert exc_info.value.status_code == 401
    assert exc_info.value.detail.get("code") == "TOKEN_MISSING"


# ---------------------------------------------------------------------------
# REG-TOK-011: No credentials -> None from get_optional_security_context
# ---------------------------------------------------------------------------
def test_reg_tok_011_no_credentials_optional_context_returns_none() -> None:
    """REG-TOK-011: no credentials -> None from get_optional_security_context."""
    ctx = get_optional_security_context(credentials=None)
    assert ctx is None


def test_reg_tok_011_b_invalid_credentials_optional_context_raises_401() -> None:
    """Providing invalid credentials to get_optional_security_context must still raise 401."""
    bad_credentials = HTTPAuthorizationCredentials(
        scheme="Bearer", credentials="invalid.token.here"
    )
    with pytest.raises(HTTPException) as exc_info:
        get_optional_security_context(credentials=bad_credentials)

    assert exc_info.value.status_code == 401


# ---------------------------------------------------------------------------
# REG-TOK-012: Wrong audience -> 401
# ---------------------------------------------------------------------------
def test_reg_tok_012_wrong_audience_rejected() -> None:
    """REG-TOK-012: wrong audience -> 401 TOKEN_INVALID."""
    token = _mint_test_hs256_token(payload_overrides={"aud": "unauthorized-service-api"})

    with pytest.raises(HTTPException) as exc_info:
        resolve_security_context(token)

    assert exc_info.value.status_code == 401
    assert exc_info.value.detail.get("code") == "TOKEN_INVALID"


# ---------------------------------------------------------------------------
# REG-TOK-013: Role outside the 7 -> 401
# ---------------------------------------------------------------------------
def test_reg_tok_013_role_outside_platform_roles_rejected() -> None:
    """REG-TOK-013: role outside the 7 -> 401 ROLE_NOT_PERMITTED."""
    token = _mint_test_hs256_token(payload_overrides={"realm_access": {"roles": ["SUPERUSER"]}})

    with pytest.raises(HTTPException) as exc_info:
        resolve_security_context(token)

    assert exc_info.value.status_code == 401
    assert exc_info.value.detail.get("code") == "ROLE_NOT_PERMITTED"


def test_reg_tok_013_b_empty_roles_list_rejected() -> None:
    """Token with an empty roles list must be rejected with 401."""
    token = _mint_test_hs256_token(payload_overrides={"realm_access": {"roles": []}})

    with pytest.raises(HTTPException) as exc_info:
        resolve_security_context(token)

    assert exc_info.value.status_code == 401
    assert exc_info.value.detail.get("code") == "ROLE_NOT_PERMITTED"


# ---------------------------------------------------------------------------
# REG-TOK-014: JWKS unreachable -> 503, not 401
# ---------------------------------------------------------------------------
def test_reg_tok_014_jwks_unreachable_returns_503(
    rsa_test_keypair: dict[str, Any], monkeypatch: pytest.MonkeyPatch
) -> None:
    """REG-TOK-014: JWKS unreachable -> 503, not 401."""
    jwks_client.reset_cache()

    def mock_httpx_get_fail(*args: Any, **kwargs: Any) -> Any:
        raise httpx.ConnectTimeout("Connection to Keycloak timed out")

    monkeypatch.setattr(httpx.Client, "get", mock_httpx_get_fail)

    token = _mint_test_rs256_token(rsa_test_keypair)

    with pytest.raises(HTTPException) as exc_info:
        resolve_security_context(token)

    assert exc_info.value.status_code == 503
    assert exc_info.value.detail.get("code") == "IDP_UNAVAILABLE"


# ---------------------------------------------------------------------------
# REG-TOK-015: Refresh token hashing stability and raw value protection
# ---------------------------------------------------------------------------
def test_reg_tok_015_refresh_token_hashing_stability_and_raw_value() -> None:
    """REG-TOK-015: refresh token hashing is stable and the raw value never equals the stored hash."""
    raw, token_hash, family_id = create_refresh_token()

    assert raw != token_hash
    assert hash_refresh_token(raw) == token_hash
    assert hash_refresh_token(raw) == token_hash  # Deterministic
    assert len(token_hash) == 64  # SHA-256 hex string length
    assert isinstance(family_id, uuid.UUID)


# ---------------------------------------------------------------------------
# Additional Edge Case Tests
# ---------------------------------------------------------------------------
def test_edge_case_sector_ids_json_string_coercion() -> None:
    """Coerce sector_ids serialized as a JSON string rather than crashing."""
    token = _mint_test_hs256_token(payload_overrides={"sector_ids": "[10, 20, 30]"})
    ctx = resolve_security_context(token)
    assert ctx.sector_ids == [10, 20, 30]


def test_edge_case_kid_missing_from_rs256_header(rsa_test_keypair: dict[str, Any]) -> None:
    """RS256 Keycloak token with missing kid in header -> 401 TOKEN_INVALID."""
    now = int(time.time())
    payload = {
        "iss": settings.keycloak_issuer,
        "aud": settings.keycloak_audience,
        "sub": "user-nokid",
        "exp": now + 900,
        "iat": now,
        "nbf": now,
        "realm_access": {"roles": ["DISTRICT_OFFICER"]},
    }
    token = jwt.encode(payload, rsa_test_keypair["private_pem"], algorithm="RS256")

    with pytest.raises(HTTPException) as exc_info:
        resolve_security_context(token)

    assert exc_info.value.status_code == 401
    assert exc_info.value.detail.get("code") == "TOKEN_INVALID"


def test_edge_case_clock_skew_leeway_tolerance() -> None:
    """Clock skew up to 60 seconds is tolerated; beyond 60 seconds is rejected."""
    now = int(time.time())
    # 30 seconds ago (< 60s leeway)
    token_skew_ok = _mint_test_hs256_token(
        payload_overrides={
            "exp": now - 30,
            "iat": now - 900,
            "nbf": now - 900,
        }
    )
    ctx = resolve_security_context(token_skew_ok)
    assert ctx.is_authenticated is True

    # 90 seconds ago (> 60s leeway)
    token_skew_fail = _mint_test_hs256_token(
        payload_overrides={
            "exp": now - 90,
            "iat": now - 900,
            "nbf": now - 900,
        }
    )
    with pytest.raises(HTTPException) as exc_info:
        resolve_security_context(token_skew_fail)
    assert exc_info.value.status_code == 401
    assert exc_info.value.detail.get("code") == "TOKEN_EXPIRED"


def test_edge_case_invalid_auth_scheme() -> None:
    """Credentials with a non-Bearer scheme are rejected with 401."""
    creds = HTTPAuthorizationCredentials(scheme="Basic", credentials="username:password")
    with pytest.raises(HTTPException) as exc_info:
        get_current_security_context(credentials=creds)

    assert exc_info.value.status_code == 401
    assert exc_info.value.detail.get("code") == "TOKEN_INVALID"


def test_all_roles_constant_matches_seven_canonical_roles() -> None:
    """Verify that the ALL_ROLES constant matches the 7 canonical roles."""
    expected_7_roles = {
        "POLICY_MAKER",
        "DISTRICT_OFFICER",
        "ITI_PRINCIPAL",
        "EMPLOYER",
        "SSC_REVIEWER",
        "ADMIN",
        "CANDIDATE",
    }
    assert ALL_ROLES == expected_7_roles
    assert len(ALL_ROLES) == 7


@pytest.mark.asyncio
async def test_endpoint_auth_me_unauthenticated_returns_401(client: httpx.AsyncClient) -> None:
    """Deliberate behavior change: /v1/auth/me unauthenticated requests now return 401."""
    response = await client.get("/v1/auth/me")
    assert response.status_code == 401
    assert response.json()["detail"]["code"] == "TOKEN_MISSING"


@pytest.mark.asyncio
async def test_endpoint_auth_me_authenticated_returns_200(client: httpx.AsyncClient) -> None:
    """Authenticated /v1/auth/me request returns 200 with resolved user context."""
    token = create_access_token(
        user={"id": "cand-user-uuid", "email": "cand@mahaskills.gov.in"},
        roles=["CANDIDATE"],
        scopes={"district_id": 14},
    )
    headers = {"Authorization": f"Bearer {token}"}
    response = await client.get("/v1/auth/me", headers=headers)
    assert response.status_code == 200
    data = response.json()
    assert data["success"] is True
    assert data["data"]["id"] == "cand-user-uuid"
    assert data["data"]["email"] == "cand@mahaskills.gov.in"
