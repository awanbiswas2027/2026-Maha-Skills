import hashlib
import hmac

from fastapi import Security
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from pydantic import BaseModel

from .config import settings

security_scheme = HTTPBearer(auto_error=False)


class SecurityContext(BaseModel):
    user_id: str
    roles: list[str]
    email: str
    district_id: int | None = None
    institute_id: str | None = None
    sector_ids: list[int] = []


def get_current_security_context(
    credentials: HTTPAuthorizationCredentials | None = Security(security_scheme),
) -> SecurityContext:
    if not credentials:
        # For public or mock dev usage, return default context
        return SecurityContext(
            user_id="anonymous", roles=["ANONYMOUS"], email="anonymous@mahaskills.gov.in"
        )

    # In production, verify RS256 token against Keycloak JWKS
    _token = credentials.credentials
    # Mock decoded claims for local testing
    return SecurityContext(
        user_id="8c3b01a2-9b98-4b71-9f20-8012bcfe1430",
        roles=["DISTRICT_OFFICER"],
        email="dpo.pune@gov.in",
        district_id=14,
    )


def pseudonymize_candidate_id(raw_candidate_id: str) -> str:
    """DPDP Act 2023 compliant one-way HMAC-SHA256 candidate pseudonymization."""
    pepper = settings.DPDP_TENANT_SALT.encode("utf-8")
    normalized = raw_candidate_id.strip().upper().encode("utf-8")
    return hmac.new(pepper, normalized, hashlib.sha256).hexdigest()
