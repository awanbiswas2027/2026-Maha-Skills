import hashlib
import logging
import secrets
import time
import uuid
from typing import Any

from fastapi import HTTPException
from jose import jwt

from ..core.config import MIN_JWT_SECRET_BYTES, settings

logger = logging.getLogger(__name__)


class LocalSigningKeyUnavailableError(HTTPException):
    def __init__(self) -> None:
        super().__init__(
            status_code=503,
            detail={
                "code": "LOCAL_AUTH_UNAVAILABLE",
                "message": "Local sign-in is temporarily unavailable",
            },
        )


def require_local_signing_key() -> str:
    key = settings.AUTH_JWT_SECRET
    if not key or len(key.encode("utf-8")) < MIN_JWT_SECRET_BYTES:
        logger.error("local JWT signing key missing or too short")
        raise LocalSigningKeyUnavailableError()
    return key


STAFF_ROLES: frozenset[str] = frozenset(
    {
        "POLICY_MAKER",
        "DISTRICT_OFFICER",
        "ITI_PRINCIPAL",
        "SSC_REVIEWER",
        "ADMIN",
    }
)

ALL_ROLES: frozenset[str] = frozenset(
    {
        "POLICY_MAKER",
        "DISTRICT_OFFICER",
        "ITI_PRINCIPAL",
        "EMPLOYER",
        "SSC_REVIEWER",
        "ADMIN",
        "CANDIDATE",
    }
)

LOCAL_ROLES: frozenset[str] = frozenset({"CANDIDATE", "EMPLOYER"})


class StaffRoleNotPermittedError(ValueError):
    """Raised when attempting to issue or verify a local token carrying staff roles."""


def hash_refresh_token(raw: str) -> str:
    """Compute deterministic SHA-256 hex hash of a raw refresh token."""
    return hashlib.sha256(raw.encode("utf-8")).hexdigest()


def create_refresh_token() -> tuple[str, str, uuid.UUID]:
    """Generate a high-entropy opaque refresh token.

    Returns:
        tuple[str, str, uuid.UUID]: (raw_token, token_hash, family_id)
        The raw token must be returned to the client once and never persisted or logged.
    """
    raw = secrets.token_urlsafe(32)
    token_hash = hash_refresh_token(raw)
    family_id = uuid.uuid4()
    return raw, token_hash, family_id


def create_access_token(
    user: Any,
    roles: list[str],
    scopes: dict[str, Any] | None = None,
) -> str:
    """Issue a locally-signed HS256 access token for CANDIDATE or EMPLOYER.

    Enforces ADR-001: local tokens must never carry staff roles.
    The claim shape mirrors Keycloak tokens exactly for transparent downstream handling.
    """
    # Refuse to issue local tokens for staff roles
    invalid_staff_roles = [r for r in roles if r in STAFF_ROLES]
    if invalid_staff_roles:
        raise StaffRoleNotPermittedError(
            f"Cannot issue local token containing staff roles: {invalid_staff_roles}"
        )

    # Validate that roles belong to the recognized platform roles
    unknown_roles = [r for r in roles if r not in ALL_ROLES]
    if unknown_roles:
        raise ValueError(f"Cannot issue token containing unknown roles: {unknown_roles}")

    key = require_local_signing_key()

    # Extract user ID
    if hasattr(user, "id"):
        sub = str(user.id)
    elif isinstance(user, dict):
        sub = str(user.get("id") or user.get("sub") or "")
    else:
        sub = str(user)

    # Extract email
    if hasattr(user, "email"):
        email = str(user.email)
    elif isinstance(user, dict):
        email = str(user.get("email") or "")
    else:
        email = ""

    # Extract account status
    raw_status = getattr(user, "account_status", None)
    if raw_status is None and isinstance(user, dict):
        raw_status = user.get("account_status")

    if hasattr(raw_status, "value"):
        account_status = str(raw_status.value)
    elif raw_status is not None:
        account_status = str(raw_status)
    else:
        account_status = "ACTIVE"

    now = int(time.time())
    exp = now + settings.AUTH_ACCESS_TOKEN_TTL_SECONDS
    jti = str(uuid.uuid4())

    scopes = scopes or {}
    district_id = scopes.get("district_id")
    district_name = scopes.get("district_name")
    division = scopes.get("division")
    institute_id = scopes.get("institute_id")
    sector_ids = scopes.get("sector_ids", [])
    employer_id = scopes.get("employer_id")

    payload: dict[str, Any] = {
        "iss": settings.AUTH_JWT_ISSUER,
        "aud": settings.keycloak_audience,
        "sub": sub,
        "exp": exp,
        "iat": now,
        "nbf": now,
        "jti": jti,
        "typ": "Bearer",
        "email": email,
        "account_status": account_status,
        "realm_access": {
            "roles": list(roles),
        },
        "district_id": district_id,
        "district_name": district_name,
        "division": division,
        "institute_id": institute_id,
        "sector_ids": sector_ids,
        "employer_id": employer_id,
    }

    return jwt.encode(payload, key, algorithm="HS256")
