import json
import logging
from collections.abc import Callable
from typing import Any

from fastapi import Depends, Query, Request, status
from fastapi.routing import APIRoute
from pydantic import BaseModel

from .security import (
    AuthException,
    SecurityContext,
    get_current_security_context,
)

logger = logging.getLogger(__name__)

# Explicit, commented allowlist of routes reachable anonymously per PRD and RBAC Matrix §2.
# All other /v1 routes must carry an explicit RBAC dependency.
PUBLIC_ROUTES: frozenset[str] = frozenset(
    [
        "/v1/taxonomy/tree",
        "/v1/candidates/courses",
        "/v1/candidates/pathway/recommend",
    ]
)


class DistrictScope(BaseModel):
    """Resolved effective scope for district-level resources."""

    district_id: int | None = None
    is_statewide: bool = False


class InstituteScope(BaseModel):
    """Resolved effective scope for institute-level resources."""

    institute_id: str | None = None
    is_statewide: bool = False


class SectorScope(BaseModel):
    """Resolved effective scope for sector-level resources."""

    sector_ids: list[int] = []
    is_all_sectors: bool = False


class EmployerScope(BaseModel):
    """Resolved effective scope for employer-specific resources."""

    employer_id: str | None = None
    is_all_employers: bool = False


def require_auth(
    ctx: SecurityContext = Depends(get_current_security_context),
) -> SecurityContext:
    """FastAPI dependency: Caller must be authenticated and have account_status == 'ACTIVE'.

    - Unauthenticated -> 401 (handled by get_current_security_context).
    - Empty roles list -> 403 ROLE_NOT_PERMITTED.
    - Non-ACTIVE account (e.g. SUSPENDED, PENDING_VERIFICATION) -> 403 with distinct code.
    """
    if not ctx.is_authenticated:
        raise AuthException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            code="AUTH_UNAUTHORIZED",
            message="Authentication credentials required",
        )

    if not ctx.roles:
        raise AuthException(
            status_code=status.HTTP_403_FORBIDDEN,
            code="ROLE_NOT_PERMITTED",
            message="Caller has no assigned roles",
        )

    if ctx.account_status != "ACTIVE":
        raw_status = ctx.account_status or "INACTIVE"
        raise AuthException(
            status_code=status.HTTP_403_FORBIDDEN,
            code=f"ACCOUNT_{raw_status}",
            message=f"Account is not active (status: {raw_status})",
        )

    return ctx


require_auth.__rbac_guard__ = True  # type: ignore[attr-defined]


def require_roles(*allowed_roles: str) -> Callable[..., SecurityContext]:
    """FastAPI dependency factory: Caller must hold at least one of the specified roles.

    Implies require_auth(). Raises 403 ROLE_NOT_PERMITTED when none of the caller's roles match.
    """

    def _role_checker(ctx: SecurityContext = Depends(require_auth)) -> SecurityContext:
        if not any(role in ctx.roles for role in allowed_roles):
            raise AuthException(
                status_code=status.HTTP_403_FORBIDDEN,
                code="ROLE_NOT_PERMITTED",
                message=f"Caller lacks required role(s): {list(allowed_roles)}",
            )
        return ctx

    _role_checker.__rbac_guard__ = True  # type: ignore[attr-defined]
    _role_checker.__allowed_roles__ = allowed_roles  # type: ignore[attr-defined]
    return _role_checker


def require_district_scope(
    district_id: int | None = Query(None),
    ctx: SecurityContext = Depends(require_auth),
) -> DistrictScope:
    """FastAPI dependency resolving effective district scope.

    - POLICY_MAKER / ADMIN: statewide. A requested district_id is honoured; omission means all districts.
    - DISTRICT_OFFICER / ITI_PRINCIPAL: requested id must equal ctx.district_id or 403.
      Omission is not statewide: it resolves to ctx.district_id.
    - Dual-role caller (e.g. ADMIN + DISTRICT_OFFICER) gets the broader (statewide) scope.
    - district_id=0 is treated as supplied, not omitted.
    """
    # Dual-role / broader scope precedence: ADMIN or POLICY_MAKER confers statewide privileges
    if "ADMIN" in ctx.roles or "POLICY_MAKER" in ctx.roles:
        if district_id is not None:
            return DistrictScope(district_id=district_id, is_statewide=False)
        return DistrictScope(district_id=None, is_statewide=True)

    if "DISTRICT_OFFICER" in ctx.roles or "ITI_PRINCIPAL" in ctx.roles:
        if ctx.district_id is None:
            raise AuthException(
                status_code=status.HTTP_403_FORBIDDEN,
                code="AUTH_SCOPE_RESTRICTED",
                message="Caller has no assigned district jurisdiction",
            )
        if district_id is not None:
            if district_id != ctx.district_id:
                raise AuthException(
                    status_code=status.HTTP_403_FORBIDDEN,
                    code="AUTH_SCOPE_RESTRICTED",
                    message=f"Access denied: Requested district {district_id} is outside assigned district {ctx.district_id}",
                )
            return DistrictScope(district_id=district_id, is_statewide=False)
        # Omission resolves to own district
        return DistrictScope(district_id=ctx.district_id, is_statewide=False)

    if "CANDIDATE" in ctx.roles or "EMPLOYER" in ctx.roles:
        if ctx.district_id is not None:
            if district_id is not None:
                if district_id != ctx.district_id:
                    raise AuthException(
                        status_code=status.HTTP_403_FORBIDDEN,
                        code="AUTH_SCOPE_RESTRICTED",
                        message=f"Access denied: Requested district {district_id} is outside assigned district {ctx.district_id}",
                    )
                return DistrictScope(district_id=district_id, is_statewide=False)
            return DistrictScope(district_id=ctx.district_id, is_statewide=False)
        if district_id is not None:
            return DistrictScope(district_id=district_id, is_statewide=False)
        return DistrictScope(district_id=None, is_statewide=True)

    raise AuthException(
        status_code=status.HTTP_403_FORBIDDEN,
        code="AUTH_SCOPE_RESTRICTED",
        message="Access denied: Outside jurisdictional district boundary",
    )


require_district_scope.__rbac_guard__ = True  # type: ignore[attr-defined]


async def require_institute_scope(
    request: Request,
    institute_id: str | None = Query(None),
    ctx: SecurityContext = Depends(require_auth),
) -> InstituteScope:
    """FastAPI dependency resolving effective institute scope.

    - POLICY_MAKER / ADMIN: statewide. A requested institute_id is honoured; omission means all institutes.
    - ITI_PRINCIPAL: requested institute_id must equal ctx.institute_id or 403.
      Omission resolves to ctx.institute_id.
    - Inspects query params, multipart form data, and JSON bodies.
    """
    if institute_id is None:
        content_type = request.headers.get("content-type", "")
        if (
            "multipart/form-data" in content_type
            or "application/x-www-form-urlencoded" in content_type
        ):
            try:
                form_data = await request.form()
                form_inst = form_data.get("institute_id")
                if form_inst is not None and str(form_inst).strip():
                    institute_id = str(form_inst).strip()
            except (ValueError, TypeError, KeyError) as exc:
                logger.debug("Could not read institute_id from form data: %s", exc)
        elif "application/json" in content_type:
            try:
                json_data = await request.json()
                if isinstance(json_data, dict):
                    json_inst = json_data.get("institute_id")
                    if json_inst is not None and str(json_inst).strip():
                        institute_id = str(json_inst).strip()
            except (ValueError, TypeError, KeyError, json.JSONDecodeError) as exc:
                logger.debug("Could not read institute_id from JSON data: %s", exc)

    if "ADMIN" in ctx.roles or "POLICY_MAKER" in ctx.roles:
        if institute_id is not None:
            return InstituteScope(institute_id=institute_id, is_statewide=False)
        return InstituteScope(institute_id=None, is_statewide=True)

    if "ITI_PRINCIPAL" in ctx.roles:
        if not ctx.institute_id:
            raise AuthException(
                status_code=status.HTTP_403_FORBIDDEN,
                code="AUTH_SCOPE_RESTRICTED",
                message="Principal has no assigned institute jurisdiction",
            )
        if institute_id is not None:
            if str(institute_id).strip() != str(ctx.institute_id).strip():
                raise AuthException(
                    status_code=status.HTTP_403_FORBIDDEN,
                    code="AUTH_SCOPE_RESTRICTED",
                    message=f"Access denied: Requested institute {institute_id} is outside assigned institute {ctx.institute_id}",
                )
            return InstituteScope(institute_id=str(ctx.institute_id), is_statewide=False)
        return InstituteScope(institute_id=str(ctx.institute_id), is_statewide=False)

    raise AuthException(
        status_code=status.HTTP_403_FORBIDDEN,
        code="AUTH_SCOPE_RESTRICTED",
        message="Access denied: Outside jurisdictional institute boundary",
    )


require_institute_scope.__rbac_guard__ = True  # type: ignore[attr-defined]


async def require_sector_scope(
    request: Request,
    sector_id: int | None = Query(None),
    ctx: SecurityContext = Depends(require_auth),
) -> SectorScope:
    """FastAPI dependency resolving effective sector scope.

    - POLICY_MAKER / ADMIN: statewide. A requested sector_id is honoured; omission means all sectors.
    - SSC_REVIEWER: requested sector_id must be in ctx.sector_ids or 403.
      Omission resolves to ctx.sector_ids. Empty sector_ids raises 403.
    """
    if sector_id is None:
        content_type = request.headers.get("content-type", "")
        if "application/json" in content_type:
            try:
                json_data = await request.json()
                if (
                    isinstance(json_data, dict)
                    and "sector_id" in json_data
                    and json_data["sector_id"] is not None
                ):
                    sector_id = int(json_data["sector_id"])
            except (ValueError, TypeError, KeyError, json.JSONDecodeError) as exc:
                logger.debug("Could not read sector_id from JSON data: %s", exc)

    if "ADMIN" in ctx.roles or "POLICY_MAKER" in ctx.roles:
        if sector_id is not None:
            return SectorScope(sector_ids=[int(sector_id)], is_all_sectors=False)
        return SectorScope(sector_ids=[], is_all_sectors=True)

    if "SSC_REVIEWER" in ctx.roles:
        if not ctx.sector_ids:
            raise AuthException(
                status_code=status.HTTP_403_FORBIDDEN,
                code="AUTH_SCOPE_RESTRICTED",
                message="SSC reviewer has no assigned sector jurisdiction",
            )
        if sector_id is not None:
            if int(sector_id) not in ctx.sector_ids:
                raise AuthException(
                    status_code=status.HTTP_403_FORBIDDEN,
                    code="AUTH_SCOPE_RESTRICTED",
                    message=f"Access denied: Requested sector {sector_id} is outside assigned sectors {ctx.sector_ids}",
                )
            return SectorScope(sector_ids=[int(sector_id)], is_all_sectors=False)
        return SectorScope(sector_ids=list(ctx.sector_ids), is_all_sectors=False)

    if sector_id is not None:
        return SectorScope(sector_ids=[int(sector_id)], is_all_sectors=False)
    return SectorScope(sector_ids=[], is_all_sectors=True)


require_sector_scope.__rbac_guard__ = True  # type: ignore[attr-defined]


async def require_employer_scope(
    request: Request,
    employer_id: str | None = Query(None),
    ctx: SecurityContext = Depends(require_auth),
) -> EmployerScope:
    """FastAPI dependency resolving effective employer scope.

    - POLICY_MAKER / ADMIN: statewide. A requested employer_id is honoured; omission means all.
    - EMPLOYER: confined to ctx.employer_id; omission resolves to it; a different id is 403.
    """
    if employer_id is None:
        content_type = request.headers.get("content-type", "")
        if "application/json" in content_type:
            try:
                json_data = await request.json()
                if (
                    isinstance(json_data, dict)
                    and "employer_id" in json_data
                    and json_data["employer_id"] is not None
                ):
                    employer_id = str(json_data["employer_id"]).strip()
            except (ValueError, TypeError, KeyError, json.JSONDecodeError) as exc:
                logger.debug("Could not read employer_id from JSON data: %s", exc)
        elif (
            "multipart/form-data" in content_type
            or "application/x-www-form-urlencoded" in content_type
        ):
            try:
                form_data = await request.form()
                form_emp = form_data.get("employer_id")
                if form_emp is not None and str(form_emp).strip():
                    employer_id = str(form_emp).strip()
            except (ValueError, TypeError, KeyError) as exc:
                logger.debug("Could not read employer_id from form data: %s", exc)

    if "ADMIN" in ctx.roles or "POLICY_MAKER" in ctx.roles:
        if employer_id is not None:
            return EmployerScope(employer_id=employer_id, is_all_employers=False)
        return EmployerScope(employer_id=None, is_all_employers=True)

    if "EMPLOYER" in ctx.roles:
        if not ctx.employer_id:
            raise AuthException(
                status_code=status.HTTP_403_FORBIDDEN,
                code="AUTH_SCOPE_RESTRICTED",
                message="Employer user has no associated employer_id",
            )
        if employer_id is not None:
            if str(employer_id).strip() != str(ctx.employer_id).strip():
                raise AuthException(
                    status_code=status.HTTP_403_FORBIDDEN,
                    code="AUTH_SCOPE_RESTRICTED",
                    message=f"Access denied: Cannot access another employer profile ({employer_id})",
                )
            return EmployerScope(employer_id=str(ctx.employer_id), is_all_employers=False)
        return EmployerScope(employer_id=str(ctx.employer_id), is_all_employers=False)

    raise AuthException(
        status_code=status.HTTP_403_FORBIDDEN,
        code="AUTH_SCOPE_RESTRICTED",
        message="Access denied: Outside employer jurisdiction",
    )


require_employer_scope.__rbac_guard__ = True  # type: ignore[attr-defined]


def is_rbac_guarded(route: APIRoute) -> bool:
    """Inspect an APIRoute to determine if it carries an RBAC guard or require_auth in its dependency graph."""

    def _inspect_dependant(dependant: Any) -> bool:
        if not dependant:
            return False
        for dep in getattr(dependant, "dependencies", []):
            call = getattr(dep, "call", None)
            if call is not None:
                if getattr(call, "__rbac_guard__", False):
                    return True
                if call in (
                    require_auth,
                    require_district_scope,
                    require_institute_scope,
                    require_sector_scope,
                    require_employer_scope,
                ):
                    return True
            if _inspect_dependant(dep):
                return True
        return False

    return _inspect_dependant(getattr(route, "dependant", None))
