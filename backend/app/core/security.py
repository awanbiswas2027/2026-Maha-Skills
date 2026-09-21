import hashlib
import hmac
import json
import logging
from typing import Any

from fastapi import HTTPException, Security, status
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from jose import ExpiredSignatureError, JWTError, jwt
from pydantic import BaseModel

from ..services.auth_token_service import ALL_ROLES, STAFF_ROLES
from .config import settings
from .jwks import get_jwks_client

logger = logging.getLogger(__name__)

security_scheme = HTTPBearer(auto_error=False)


class SecurityContext(BaseModel):
    user_id: str
    roles: list[str]
    email: str
    district_id: int | None = None
    institute_id: str | None = None
    sector_ids: list[int] = []
    employer_id: str | None = None
    account_status: str | None = None
    issuer: str  # "keycloak" or "local"
    token_id: str | None = None  # jti
    is_authenticated: bool = True


class AuthException(HTTPException):
    """Domain authentication exception formatted per error taxonomy standards."""

    def __init__(
        self,
        status_code: int,
        code: str,
        message: str,
        headers: dict[str, str] | None = None,
    ) -> None:
        default_headers = {"WWW-Authenticate": "Bearer"} if status_code == 401 else None
        super().__init__(
            status_code=status_code,
            detail={"code": code, "message": message},
            headers=headers or default_headers,
        )
        self.code = code
        self.message = message


def resolve_security_context(token: str) -> SecurityContext:
    """Validate token from either local or Keycloak issuer and resolve into SecurityContext.

    1. Read 'iss' from unverified payload purely to choose verifier.
    2. Local issuer ('settings.AUTH_JWT_ISSUER'): verified with HS256 and secret. Staff roles rejected.
    3. Keycloak issuer: verified with RS256 against cached JWKS.
    4. Reject unknown issuers and malformed/expired/unauthorized tokens with 401.
    """
    if not token or not isinstance(token, str) or not token.strip():
        raise AuthException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            code="TOKEN_INVALID",
            message="Token is missing or malformed",
        )

    try:
        unverified_headers = jwt.get_unverified_header(token)
        # Read iss from unverified claims solely to select the appropriate verifier.
        # Nothing else from an unverified token may be trusted.
        unverified_claims = jwt.get_unverified_claims(token)
    except JWTError as exc:
        logger.warning("Failed to decode unverified JWT claims: %s", exc)
        raise AuthException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            code="TOKEN_INVALID",
            message="Malformed authentication token",
        ) from exc

    iss = unverified_claims.get("iss")
    alg = unverified_headers.get("alg")

    # Algorithm pinning check: reject alg 'none' or missing
    if not alg or alg.lower() == "none":
        raise AuthException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            code="TOKEN_INVALID",
            message="Algorithm 'none' is not permitted",
        )

    # Dispatch based on issuer
    claims: dict[str, Any]
    issuer_name: str
    expected_aud = settings.keycloak_audience

    if iss == settings.AUTH_JWT_ISSUER:
        # Local issuer path: strictly HS256
        if alg != "HS256":
            raise AuthException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                code="TOKEN_INVALID",
                message="Invalid algorithm for local token issuer",
            )
        try:
            claims = jwt.decode(
                token,
                settings.AUTH_JWT_SECRET,
                algorithms=["HS256"],
                audience=expected_aud,
                options={"leeway": 60, "verify_exp": True, "verify_nbf": True},
            )
        except ExpiredSignatureError as exc:
            logger.info("Local access token expired (jti=%s)", unverified_claims.get("jti"))
            raise AuthException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                code="TOKEN_EXPIRED",
                message="Authentication token has expired",
            ) from exc
        except JWTError as exc:
            logger.warning("Local token verification failed: %s", exc)
            raise AuthException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                code="TOKEN_INVALID",
                message=f"Token verification failed: {exc}",
            ) from exc

        if claims.get("iss") != settings.AUTH_JWT_ISSUER:
            raise AuthException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                code="ISSUER_UNKNOWN",
                message="Token issuer claim mismatch",
            )

        # Enforce ADR-001 staff-role guard
        token_roles = (
            claims.get("realm_access", {}).get("roles", [])
            if isinstance(claims.get("realm_access"), dict)
            else []
        )
        if any(r in STAFF_ROLES for r in token_roles):
            logger.warning(
                "Local token attempted privilege escalation with staff role (jti=%s, sub=%s)",
                claims.get("jti"),
                claims.get("sub"),
            )
            raise AuthException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                code="ROLE_NOT_PERMITTED",
                message="Local tokens cannot carry staff roles",
            )

        issuer_name = "local"

    elif isinstance(iss, str) and (
        iss == settings.keycloak_issuer
        or iss.startswith(f"{settings.KEYCLOAK_URL.rstrip('/')}/realms/{settings.KEYCLOAK_REALM}")
    ):
        # Keycloak issuer path: strictly RS256
        if alg != "RS256":
            raise AuthException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                code="TOKEN_INVALID",
                message="Invalid algorithm for Keycloak token issuer",
            )

        kid = unverified_headers.get("kid")
        if not kid:
            raise AuthException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                code="TOKEN_INVALID",
                message="Token header missing kid claim",
            )

        jwk_key = get_jwks_client().get_key(kid)

        try:
            claims = jwt.decode(
                token,
                jwk_key,
                algorithms=["RS256"],
                audience=expected_aud,
                options={"leeway": 60, "verify_exp": True, "verify_nbf": True},
            )
        except ExpiredSignatureError as exc:
            logger.info("Keycloak access token expired (jti=%s)", unverified_claims.get("jti"))
            raise AuthException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                code="TOKEN_EXPIRED",
                message="Authentication token has expired",
            ) from exc
        except JWTError as exc:
            logger.warning("Keycloak token verification failed: %s", exc)
            raise AuthException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                code="TOKEN_INVALID",
                message=f"Token verification failed: {exc}",
            ) from exc

        verified_iss = claims.get("iss", "")
        if not (
            verified_iss == settings.keycloak_issuer
            or (
                isinstance(verified_iss, str)
                and verified_iss.startswith(
                    f"{settings.KEYCLOAK_URL.rstrip('/')}/realms/{settings.KEYCLOAK_REALM}"
                )
            )
        ):
            raise AuthException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                code="ISSUER_UNKNOWN",
                message="Verified token issuer does not match Keycloak realm",
            )

        issuer_name = "keycloak"

    else:
        raise AuthException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            code="ISSUER_UNKNOWN",
            message=f"Untrusted token issuer: '{iss}'",
        )

    # Required claims checks
    if "exp" not in claims or "nbf" not in claims:
        raise AuthException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            code="TOKEN_INVALID",
            message="Token missing required exp or nbf claim",
        )

    if "aud" not in claims:
        raise AuthException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            code="TOKEN_INVALID",
            message="Token missing required aud claim",
        )

    # Roles validation: must be non-empty and subset of ALL_ROLES
    realm_access = claims.get("realm_access")
    roles = realm_access.get("roles") if isinstance(realm_access, dict) else None
    if not roles or not isinstance(roles, list):
        raise AuthException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            code="ROLE_NOT_PERMITTED",
            message="Token does not contain valid realm_access roles",
        )

    if not set(roles).issubset(ALL_ROLES):
        raise AuthException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            code="ROLE_NOT_PERMITTED",
            message=f"Token contains unrecognized role(s): {set(roles) - ALL_ROLES}",
        )

    # Scopes parsing and coercion
    raw_sectors = claims.get("sector_ids")
    if isinstance(raw_sectors, str):
        try:
            raw_sectors = json.loads(raw_sectors)
        except (json.JSONDecodeError, TypeError, ValueError):
            raw_sectors = []
    if not isinstance(raw_sectors, list):
        raw_sectors = []

    sector_ids: list[int] = []
    for s in raw_sectors:
        try:
            sector_ids.append(int(s))
        except (ValueError, TypeError):
            pass

    raw_district = claims.get("district_id")
    district_id: int | None = None
    if raw_district is not None:
        try:
            district_id = int(raw_district)
        except (ValueError, TypeError):
            district_id = None

    raw_institute = claims.get("institute_id")
    institute_id = str(raw_institute) if raw_institute is not None else None

    raw_employer = claims.get("employer_id")
    employer_id = str(raw_employer) if raw_employer is not None else None

    raw_status = claims.get("account_status")
    account_status = str(raw_status) if raw_status is not None else None

    raw_jti = claims.get("jti")
    token_id = str(raw_jti) if raw_jti is not None else None

    user_id = str(claims.get("sub") or claims.get("user_id") or "")
    if not user_id:
        raise AuthException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            code="TOKEN_INVALID",
            message="Token missing subject identifier",
        )

    return SecurityContext(
        user_id=user_id,
        roles=roles,
        email=claims.get("email", ""),
        district_id=district_id,
        institute_id=institute_id,
        sector_ids=sector_ids,
        employer_id=employer_id,
        account_status=account_status,
        issuer=issuer_name,
        token_id=token_id,
        is_authenticated=True,
    )


def get_current_security_context(
    credentials: HTTPAuthorizationCredentials | None = Security(security_scheme),
) -> SecurityContext:
    """FastAPI dependency: default-deny enforcement of authenticated SecurityContext.

    Raises 401 on absent credentials or invalid tokens.
    """
    if not credentials:
        raise AuthException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            code="TOKEN_MISSING",
            message="Authentication credentials were not provided",
        )
    if credentials.scheme.lower() != "bearer":
        raise AuthException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            code="TOKEN_INVALID",
            message="Invalid authentication scheme; Bearer token required",
        )
    return resolve_security_context(credentials.credentials)


def get_optional_security_context(
    credentials: HTTPAuthorizationCredentials | None = Security(security_scheme),
) -> SecurityContext | None:
    """FastAPI dependency: optional SecurityContext for exploratory public routes.

    Returns None when credentials are absent, but raises 401 if invalid credentials are provided.
    """
    if not credentials:
        return None
    if credentials.scheme.lower() != "bearer":
        raise AuthException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            code="TOKEN_INVALID",
            message="Invalid authentication scheme; Bearer token required",
        )
    return resolve_security_context(credentials.credentials)


def pseudonymize_candidate_id(raw_candidate_id: str) -> str:
    """DPDP Act 2023 compliant one-way HMAC-SHA256 candidate pseudonymization."""
    pepper = settings.DPDP_TENANT_SALT.encode("utf-8")
    normalized = raw_candidate_id.strip().upper().encode("utf-8")
    return hmac.new(pepper, normalized, hashlib.sha256).hexdigest()
