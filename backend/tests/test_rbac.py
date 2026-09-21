import io
from typing import Any

import pytest
from fastapi import Request
from fastapi.routing import APIRoute
from fastapi.security import HTTPAuthorizationCredentials
from httpx import AsyncClient

from app.core.rbac import (
    PUBLIC_ROUTES,
    is_rbac_guarded,
    require_district_scope,
    require_sector_scope,
)
from app.core.security import SecurityContext, get_optional_security_context
from app.main import app


# ---------------------------------------------------------------------------
# REG-RBAC-001 / REG-R3-008: Correct role -> not 401 / 403 across all routes
# ---------------------------------------------------------------------------
@pytest.mark.asyncio
async def test_reg_rbac_001_authorized_roles_access_routes(
    client: AsyncClient, mint_token: Any
) -> None:
    """REG-RBAC-001 / REG-R3-008: Caller with correct role and scope receives non-auth success."""
    # 1. GET /v1/admin/health -> ADMIN
    token_admin = mint_token(roles=["ADMIN"])
    resp = await client.get("/v1/admin/health", headers={"Authorization": f"Bearer {token_admin}"})
    assert resp.status_code == 200
    assert resp.json()["success"] is True

    # 2. GET /v1/lmi/aggregates -> DISTRICT_OFFICER (own district 14)
    token_do = mint_token(roles=["DISTRICT_OFFICER"], district_id=14)
    resp = await client.get(
        "/v1/lmi/aggregates?district_id=14", headers={"Authorization": f"Bearer {token_do}"}
    )
    assert resp.status_code == 200

    # 3. GET /v1/gap-scores -> POLICY_MAKER
    token_pm = mint_token(roles=["POLICY_MAKER"])
    resp = await client.get("/v1/gap-scores", headers={"Authorization": f"Bearer {token_pm}"})
    assert resp.status_code == 200

    # 4. GET /v1/gap-scores/oversupply -> DISTRICT_OFFICER
    resp = await client.get(
        "/v1/gap-scores/oversupply", headers={"Authorization": f"Bearer {token_do}"}
    )
    assert resp.status_code == 200

    # 5. GET /v1/recommendations -> any authenticated ACTIVE role (e.g. ITI_PRINCIPAL)
    token_princ = mint_token(roles=["ITI_PRINCIPAL"], district_id=14, institute_id="INST-PUNE-01")
    resp = await client.get(
        "/v1/recommendations", headers={"Authorization": f"Bearer {token_princ}"}
    )
    assert resp.status_code == 200

    # 6. GET /v1/recommendations/{id}/dossier -> any authenticated ACTIVE role
    resp = await client.get(
        "/v1/recommendations/REC-001/dossier",
        headers={"Authorization": f"Bearer {token_princ}"},
    )
    assert resp.status_code == 200

    # 7. POST /v1/ingestion/placements/upload -> ITI_PRINCIPAL
    csv_content = b"candidate_id,course_code,batch_year,placed,monthly_salary,employer_name\n"
    files = {"file": ("test.csv", io.BytesIO(csv_content), "text/csv")}
    resp = await client.post(
        "/v1/ingestion/placements/upload",
        files=files,
        data={"academic_year": "2025-2026", "batch_month": "8", "institute_id": "INST-PUNE-01"},
        headers={"Authorization": f"Bearer {token_princ}"},
    )
    assert resp.status_code == 202

    # 8. GET /v1/district-plans -> DISTRICT_OFFICER on own district
    resp = await client.get(
        "/v1/district-plans?district_id=14", headers={"Authorization": f"Bearer {token_do}"}
    )
    assert resp.status_code == 200

    # 9. POST /v1/employers/skill-needs -> EMPLOYER on own employer_id
    token_emp = mint_token(roles=["EMPLOYER"], employer_id="EMP-TATA-01")
    resp = await client.post(
        "/v1/employers/skill-needs",
        json={"employer_id": "EMP-TATA-01", "job_role": "EV Technician", "vacancies": 25},
        headers={"Authorization": f"Bearer {token_emp}"},
    )
    assert resp.status_code == 201


# ---------------------------------------------------------------------------
# REG-RBAC-002 / REG-R3-006: Every non-public row: no token -> 401
# ---------------------------------------------------------------------------
@pytest.mark.asyncio
async def test_reg_rbac_002_unauthenticated_requests_return_401(client: AsyncClient) -> None:
    """REG-RBAC-002 / REG-R3-006: Non-public endpoints return 401 when accessed anonymously."""
    routes_to_test = [
        ("GET", "/v1/admin/health"),
        ("GET", "/v1/lmi/aggregates"),
        ("GET", "/v1/gap-scores"),
        ("GET", "/v1/gap-scores/oversupply"),
        ("GET", "/v1/recommendations"),
        ("GET", "/v1/recommendations/REC-001/dossier"),
        ("GET", "/v1/district-plans?district_id=14"),
        ("POST", "/v1/employers/skill-needs"),
    ]

    for method, path in routes_to_test:
        if method == "GET":
            resp = await client.get(path)
        else:
            resp = await client.post(path, json={})
        assert resp.status_code == 401, f"{method} {path} expected 401, got {resp.status_code}"
        body = resp.json()
        assert body["detail"]["code"] in ("TOKEN_MISSING", "AUTH_UNAUTHORIZED")

    # Placement upload endpoint multipart without token
    csv_content = b"candidate_id,course_code\n"
    files = {"file": ("test.csv", io.BytesIO(csv_content), "text/csv")}
    resp = await client.post("/v1/ingestion/placements/upload", files=files)
    assert resp.status_code == 401


# ---------------------------------------------------------------------------
# REG-RBAC-003 / REG-R3-007: Every role-restricted row: wrong role -> 403
# ---------------------------------------------------------------------------
@pytest.mark.asyncio
async def test_reg_rbac_003_wrong_role_returns_403(client: AsyncClient, mint_token: Any) -> None:
    """REG-RBAC-003 / REG-R3-007: Caller holding an active token with unpermitted role gets 403."""
    token_candidate = mint_token(roles=["CANDIDATE"])
    token_do = mint_token(roles=["DISTRICT_OFFICER"], district_id=14)

    # ADMIN route with DISTRICT_OFFICER
    resp = await client.get("/v1/admin/health", headers={"Authorization": f"Bearer {token_do}"})
    assert resp.status_code == 403
    assert resp.json()["detail"]["code"] == "ROLE_NOT_PERMITTED"

    # Gap scores with CANDIDATE
    resp = await client.get(
        "/v1/gap-scores", headers={"Authorization": f"Bearer {token_candidate}"}
    )
    assert resp.status_code == 403
    assert resp.json()["detail"]["code"] == "ROLE_NOT_PERMITTED"

    # Gap scores oversupply with ITI_PRINCIPAL
    token_princ = mint_token(roles=["ITI_PRINCIPAL"], district_id=14, institute_id="INST-01")
    resp = await client.get(
        "/v1/gap-scores/oversupply", headers={"Authorization": f"Bearer {token_princ}"}
    )
    assert resp.status_code == 403
    assert resp.json()["detail"]["code"] == "ROLE_NOT_PERMITTED"

    # Placement upload with DISTRICT_OFFICER
    csv_content = b"header\n"
    files = {"file": ("test.csv", io.BytesIO(csv_content), "text/csv")}
    resp = await client.post(
        "/v1/ingestion/placements/upload",
        files=files,
        headers={"Authorization": f"Bearer {token_do}"},
    )
    assert resp.status_code == 403
    assert resp.json()["detail"]["code"] == "ROLE_NOT_PERMITTED"

    # District plans with CANDIDATE
    resp = await client.get(
        "/v1/district-plans?district_id=14",
        headers={"Authorization": f"Bearer {token_candidate}"},
    )
    assert resp.status_code == 403
    assert resp.json()["detail"]["code"] == "ROLE_NOT_PERMITTED"

    # Skill needs with POLICY_MAKER
    token_pm = mint_token(roles=["POLICY_MAKER"])
    resp = await client.post(
        "/v1/employers/skill-needs",
        json={"job_role": "Fitter"},
        headers={"Authorization": f"Bearer {token_pm}"},
    )
    assert resp.status_code == 403
    assert resp.json()["detail"]["code"] == "ROLE_NOT_PERMITTED"


# ---------------------------------------------------------------------------
# REG-RBAC-004 / REG-R3-012: DISTRICT_OFFICER requesting another district -> 403
# ---------------------------------------------------------------------------
@pytest.mark.asyncio
async def test_reg_rbac_004_district_officer_cross_district_rejected(
    client: AsyncClient, mint_token: Any
) -> None:
    """REG-RBAC-004 / REG-R3-012: DISTRICT_OFFICER accessing another district gets 403 AUTH_SCOPE_RESTRICTED."""
    token_do_pune = mint_token(roles=["DISTRICT_OFFICER"], district_id=14)

    # Attempt cross-district access to district 99
    endpoints = [
        "/v1/gap-scores?district_id=99",
        "/v1/gap-scores/oversupply?district_id=99",
        "/v1/lmi/aggregates?district_id=99",
        "/v1/district-plans?district_id=99",
    ]

    for path in endpoints:
        resp = await client.get(path, headers={"Authorization": f"Bearer {token_do_pune}"})
        assert resp.status_code == 403, f"{path} expected 403, got {resp.status_code}"
        assert resp.json()["detail"]["code"] == "AUTH_SCOPE_RESTRICTED"


# ---------------------------------------------------------------------------
# REG-RBAC-005 / REG-R3-011: DISTRICT_OFFICER omitting district_id -> own district
# ---------------------------------------------------------------------------
@pytest.mark.asyncio
async def test_reg_rbac_005_district_officer_omission_resolves_own_district(
    client: AsyncClient, mint_token: Any
) -> None:
    """REG-RBAC-005 / REG-R3-011: Closing omission hole: omitting district_id scopes to own district, not statewide."""
    token_do = mint_token(roles=["DISTRICT_OFFICER"], district_id=14)

    # /v1/gap-scores with omitted district_id -> 200
    resp = await client.get("/v1/gap-scores", headers={"Authorization": f"Bearer {token_do}"})
    assert resp.status_code == 200

    # /v1/lmi/aggregates with omitted district_id -> 200
    resp = await client.get("/v1/lmi/aggregates", headers={"Authorization": f"Bearer {token_do}"})
    assert resp.status_code == 200

    # Direct unit test of dependency resolution:
    ctx = SecurityContext(
        user_id="user-do-14",
        roles=["DISTRICT_OFFICER"],
        email="do@pune.gov.in",
        district_id=14,
        account_status="ACTIVE",
        issuer="keycloak",
        is_authenticated=True,
    )
    resolved_scope = require_district_scope(district_id=None, ctx=ctx)
    assert resolved_scope.district_id == 14
    assert resolved_scope.is_statewide is False


# ---------------------------------------------------------------------------
# REG-RBAC-006 / REG-R3-014: ITI_PRINCIPAL uploading for another institute -> 403
# ---------------------------------------------------------------------------
@pytest.mark.asyncio
async def test_reg_rbac_006_iti_principal_wrong_institute_rejected(
    client: AsyncClient, mint_token: Any
) -> None:
    """REG-RBAC-006 / REG-R3-014: ITI_PRINCIPAL uploading for another institute gets 403 AUTH_SCOPE_RESTRICTED."""
    token_princ = mint_token(roles=["ITI_PRINCIPAL"], district_id=14, institute_id="INST-PUNE-01")

    csv_content = b"candidate_id,course_code\n"
    files = {"file": ("test.csv", io.BytesIO(csv_content), "text/csv")}

    # Send mismatching institute_id via query param
    resp = await client.post(
        "/v1/ingestion/placements/upload?institute_id=INST-NASHIK-99",
        files=files,
        headers={"Authorization": f"Bearer {token_princ}"},
    )
    assert resp.status_code == 403
    assert resp.json()["detail"]["code"] == "AUTH_SCOPE_RESTRICTED"

    # Send mismatching institute_id via form data
    files2 = {"file": ("test.csv", io.BytesIO(csv_content), "text/csv")}
    resp = await client.post(
        "/v1/ingestion/placements/upload",
        files=files2,
        data={"institute_id": "INST-OTHER-99"},
        headers={"Authorization": f"Bearer {token_princ}"},
    )
    assert resp.status_code == 403
    assert resp.json()["detail"]["code"] == "AUTH_SCOPE_RESTRICTED"


# ---------------------------------------------------------------------------
# REG-RBAC-007 / REG-R3-016: EMPLOYER posting skill-needs for another employer -> 403
# ---------------------------------------------------------------------------
@pytest.mark.asyncio
async def test_reg_rbac_007_employer_wrong_profile_rejected(
    client: AsyncClient, mint_token: Any
) -> None:
    """REG-RBAC-007 / REG-R3-016: EMPLOYER posting skill-needs for another employer_id gets 403."""
    token_emp = mint_token(roles=["EMPLOYER"], employer_id="EMP-TATA-01")

    # Mismatched employer_id in request body
    resp = await client.post(
        "/v1/employers/skill-needs",
        json={"employer_id": "EMP-BAJAJ-02", "job_role": "Welder"},
        headers={"Authorization": f"Bearer {token_emp}"},
    )
    assert resp.status_code == 403
    assert resp.json()["detail"]["code"] == "AUTH_SCOPE_RESTRICTED"

    # Mismatched employer_id in query param
    resp = await client.post(
        "/v1/employers/skill-needs?employer_id=EMP-BAJAJ-02",
        json={"job_role": "Welder"},
        headers={"Authorization": f"Bearer {token_emp}"},
    )
    assert resp.status_code == 403
    assert resp.json()["detail"]["code"] == "AUTH_SCOPE_RESTRICTED"


# ---------------------------------------------------------------------------
# REG-RBAC-008 / REG-R3-015: SSC_REVIEWER outside sector_ids or empty sector_ids -> 403
# ---------------------------------------------------------------------------
@pytest.mark.asyncio
async def test_reg_rbac_008_ssc_reviewer_sector_scoping() -> None:
    """REG-RBAC-008 / REG-R3-015: SSC_REVIEWER outside assigned sectors gets 403; empty sector_ids gets 403."""
    dummy_req = Request({"type": "http", "headers": []})

    # Assigned sectors: [3, 5]
    ctx_ssc = SecurityContext(
        user_id="ssc-user-1",
        roles=["SSC_REVIEWER"],
        email="ssc@asdc.org",
        sector_ids=[3, 5],
        account_status="ACTIVE",
        issuer="keycloak",
        is_authenticated=True,
    )

    # Requested sector outside assignment -> 403
    with pytest.raises(Exception) as exc_info:
        await require_sector_scope(request=dummy_req, sector_id=12, ctx=ctx_ssc)
    assert exc_info.value.status_code == 403
    assert exc_info.value.code == "AUTH_SCOPE_RESTRICTED"

    # Requested sector within assignment -> SectorScope(sector_ids=[3])
    scope = await require_sector_scope(request=dummy_req, sector_id=3, ctx=ctx_ssc)
    assert scope.sector_ids == [3]
    assert scope.is_all_sectors is False

    # Omitted sector -> resolves to ctx.sector_ids [3, 5]
    scope_omitted = await require_sector_scope(request=dummy_req, sector_id=None, ctx=ctx_ssc)
    assert scope_omitted.sector_ids == [3, 5]
    assert scope_omitted.is_all_sectors is False

    # Empty sector_ids for SSC reviewer -> 403 (never all sectors!)
    ctx_empty_ssc = SecurityContext(
        user_id="ssc-user-2",
        roles=["SSC_REVIEWER"],
        email="ssc2@empty.org",
        sector_ids=[],
        account_status="ACTIVE",
        issuer="keycloak",
        is_authenticated=True,
    )
    with pytest.raises(Exception) as exc_info2:
        await require_sector_scope(request=dummy_req, sector_id=None, ctx=ctx_empty_ssc)
    assert exc_info2.value.status_code == 403
    assert exc_info2.value.code == "AUTH_SCOPE_RESTRICTED"


# ---------------------------------------------------------------------------
# REG-RBAC-009 / REG-R3-017: POLICY_MAKER statewide across all districts -> allowed
# ---------------------------------------------------------------------------
@pytest.mark.asyncio
async def test_reg_rbac_009_policy_maker_statewide_access(
    client: AsyncClient, mint_token: Any
) -> None:
    """REG-RBAC-009 / REG-R3-017: POLICY_MAKER has statewide access: unconstrained read across all districts."""
    token_pm = mint_token(roles=["POLICY_MAKER"])

    # Statewide without district param
    resp = await client.get("/v1/gap-scores", headers={"Authorization": f"Bearer {token_pm}"})
    assert resp.status_code == 200

    # Specific district 14 honoured
    resp = await client.get(
        "/v1/gap-scores?district_id=14", headers={"Authorization": f"Bearer {token_pm}"}
    )
    assert resp.status_code == 200

    # Arbitrary district 99 honoured
    resp = await client.get(
        "/v1/district-plans?district_id=99", headers={"Authorization": f"Bearer {token_pm}"}
    )
    assert resp.status_code == 200


# ---------------------------------------------------------------------------
# REG-RBAC-010 / REG-R3-019 / REG-R3-020: non-ACTIVE accounts -> 403 distinct code
# ---------------------------------------------------------------------------
@pytest.mark.asyncio
async def test_reg_rbac_010_non_active_accounts_rejected_with_403(
    client: AsyncClient, mint_token: Any
) -> None:
    """REG-RBAC-010 / REG-R3-019 / REG-R3-020: Valid token on non-ACTIVE account returns 403 with distinct code."""
    # PENDING_VERIFICATION -> 403 ACCOUNT_PENDING_VERIFICATION
    token_pending = mint_token(roles=["CANDIDATE"], account_status="PENDING_VERIFICATION")
    resp = await client.get(
        "/v1/lmi/aggregates", headers={"Authorization": f"Bearer {token_pending}"}
    )
    assert resp.status_code == 403
    assert resp.json()["detail"]["code"] == "ACCOUNT_PENDING_VERIFICATION"

    # SUSPENDED -> 403 ACCOUNT_SUSPENDED
    token_suspended = mint_token(roles=["DISTRICT_OFFICER"], account_status="SUSPENDED")
    resp = await client.get(
        "/v1/lmi/aggregates", headers={"Authorization": f"Bearer {token_suspended}"}
    )
    assert resp.status_code == 403
    assert resp.json()["detail"]["code"] == "ACCOUNT_SUSPENDED"

    # PENDING_APPROVAL -> 403 ACCOUNT_PENDING_APPROVAL
    token_approval = mint_token(roles=["EMPLOYER"], account_status="PENDING_APPROVAL")
    resp = await client.get(
        "/v1/lmi/aggregates", headers={"Authorization": f"Bearer {token_approval}"}
    )
    assert resp.status_code == 403
    assert resp.json()["detail"]["code"] == "ACCOUNT_PENDING_APPROVAL"


# ---------------------------------------------------------------------------
# REG-RBAC-011 / REG-R3-009: The three public routes answer with no token
# ---------------------------------------------------------------------------
@pytest.mark.asyncio
async def test_reg_rbac_011_public_routes_accessible_anonymously(client: AsyncClient) -> None:
    """REG-RBAC-011 / REG-R3-009: Public routes return 200 without Authorization header."""
    # 1. GET /v1/taxonomy/tree
    resp1 = await client.get("/v1/taxonomy/tree")
    assert resp1.status_code == 200
    assert resp1.json()["success"] is True

    # 2. GET /v1/candidates/courses
    resp2 = await client.get("/v1/candidates/courses")
    assert resp2.status_code == 200
    assert resp2.json()["success"] is True

    # 3. POST /v1/candidates/pathway/recommend
    quiz_data = {
        "district_id": 14,
        "education_level": "10th",
        "sector_interest_ids": [3, 12],
        "language_preference": "mr",
        "willing_to_relocate": False,
    }
    resp3 = await client.post("/v1/candidates/pathway/recommend", json=quiz_data)
    assert resp3.status_code == 200
    assert resp3.json()["success"] is True


# ---------------------------------------------------------------------------
# REG-RBAC-012 / REG-R3-010: Public route with valid token still populates context
# ---------------------------------------------------------------------------
@pytest.mark.asyncio
async def test_reg_rbac_012_public_route_with_token_populates_context(
    client: AsyncClient, mint_token: Any
) -> None:
    """REG-RBAC-012 / REG-R3-010: Public routes accept tokens and populate SecurityContext for personalisation."""
    token = mint_token(roles=["CANDIDATE"], district_id=14)
    resp = await client.get("/v1/candidates/courses", headers={"Authorization": f"Bearer {token}"})
    assert resp.status_code == 200

    # Direct test of get_optional_security_context
    creds = HTTPAuthorizationCredentials(scheme="Bearer", credentials=token)
    ctx = get_optional_security_context(creds)
    assert ctx is not None
    assert ctx.is_authenticated is True
    assert ctx.roles == ["CANDIDATE"]
    assert ctx.district_id == 14


# ---------------------------------------------------------------------------
# REG-RBAC-013: Meta-test: No unguarded /v1 route outside PUBLIC_ROUTES
# ---------------------------------------------------------------------------
def test_reg_rbac_013_meta_test_no_unguarded_routes() -> None:
    """REG-RBAC-013: Assert every /v1/** route carries an RBAC guard or appears in PUBLIC_ROUTES.

    Fails loudly with offending route path and methods in the failure message.
    """
    unguarded_routes: list[str] = []

    for route in app.routes:
        if not isinstance(route, APIRoute):
            continue
        if not route.path.startswith("/v1"):
            continue

        # EXCLUSION FOR P004: /v1/auth/** routes are owned by P004 and actively being edited.
        # This exclusion is temporary for the duration of P004 and must be removed at merge.
        if route.path.startswith("/v1/auth"):
            continue

        normalized_path = route.path.rstrip("/")
        if normalized_path in PUBLIC_ROUTES or route.path in PUBLIC_ROUTES:
            continue

        if not is_rbac_guarded(route):
            methods = ",".join(route.methods)
            unguarded_routes.append(f"{methods} {route.path}")

    assert not unguarded_routes, (
        f"Meta-test failed! Unguarded /v1 routes found outside PUBLIC_ROUTES: {unguarded_routes}"
    )


# ---------------------------------------------------------------------------
# REG-R3-022: Prove meta-test can fail when an unguarded route is introduced
# ---------------------------------------------------------------------------
def test_reg_r3_022_meta_test_fails_on_unguarded_route() -> None:
    """REG-R3-022: Prove the meta-test detects violations by mounting a throwaway unguarded route."""

    # Define a temporary unguarded route on app
    async def _throwaway_handler():
        return {"status": "unguarded"}

    temp_route = APIRoute(
        path="/v1/throwaway-unprotected-leak",
        endpoint=_throwaway_handler,
        methods=["GET"],
    )
    app.routes.append(temp_route)

    try:
        violation_detected = False
        for route in app.routes:
            if not isinstance(route, APIRoute):
                continue
            if not route.path.startswith("/v1"):
                continue
            if route.path.startswith("/v1/auth"):
                continue
            if route.path in PUBLIC_ROUTES:
                continue
            if not is_rbac_guarded(route) and route.path == "/v1/throwaway-unprotected-leak":
                violation_detected = True
                break

        assert violation_detected, "Meta-test failed to catch throwaway unguarded route!"
    finally:
        app.routes.remove(temp_route)


# ---------------------------------------------------------------------------
# REG-RBAC-014 / REG-R3-013: district_id=0 is treated as supplied, not omitted
# ---------------------------------------------------------------------------
def test_reg_rbac_014_district_id_zero_is_supplied() -> None:
    """REG-RBAC-014 / REG-R3-013: district_id=0 is treated as a supplied value, avoiding falsy-value bugs."""
    ctx_do = SecurityContext(
        user_id="do-user",
        roles=["DISTRICT_OFFICER"],
        email="do@pune.gov.in",
        district_id=14,
        account_status="ACTIVE",
        issuer="keycloak",
        is_authenticated=True,
    )

    # 0 does not match assigned district 14 -> must raise 403, NOT treat as omitted
    with pytest.raises(Exception) as exc_info:
        require_district_scope(district_id=0, ctx=ctx_do)
    assert exc_info.value.status_code == 403
    assert exc_info.value.code == "AUTH_SCOPE_RESTRICTED"

    # ADMIN with district_id=0 -> honours requested 0
    ctx_admin = SecurityContext(
        user_id="admin-user",
        roles=["ADMIN"],
        email="admin@mahaskills.gov.in",
        account_status="ACTIVE",
        issuer="keycloak",
        is_authenticated=True,
    )
    scope = require_district_scope(district_id=0, ctx=ctx_admin)
    assert scope.district_id == 0
    assert scope.is_statewide is False


# ---------------------------------------------------------------------------
# REG-RBAC-015 / REG-R3-018: Dual-role caller gets broader scope
# ---------------------------------------------------------------------------
def test_reg_rbac_015_dual_role_caller_gets_broader_scope() -> None:
    """REG-RBAC-015 / REG-R3-018: Caller holding ADMIN + DISTRICT_OFFICER receives statewide (broader) scope."""
    ctx_dual = SecurityContext(
        user_id="dual-user",
        roles=["ADMIN", "DISTRICT_OFFICER"],
        email="dual@gov.in",
        district_id=14,
        account_status="ACTIVE",
        issuer="keycloak",
        is_authenticated=True,
    )

    # Omission -> resolves to statewide (None), NOT confined to district 14
    scope_omitted = require_district_scope(district_id=None, ctx=ctx_dual)
    assert scope_omitted.district_id is None
    assert scope_omitted.is_statewide is True

    # Requesting another district (99) -> permitted because ADMIN confers statewide access
    scope_other = require_district_scope(district_id=99, ctx=ctx_dual)
    assert scope_other.district_id == 99
    assert scope_other.is_statewide is False


# ---------------------------------------------------------------------------
# Additional Edge Cases: empty roles, OPTIONS preflight, unknown route
# ---------------------------------------------------------------------------
@pytest.mark.asyncio
async def test_reg_r3_021_empty_roles_returns_403(client: AsyncClient) -> None:
    """REG-R3-021: Valid context with empty roles list returns 403 ROLE_NOT_PERMITTED."""
    from app.core.rbac import require_auth
    from app.core.security import get_current_security_context

    ctx_empty = SecurityContext(
        user_id="user-empty-roles",
        roles=[],
        email="empty@example.com",
        account_status="ACTIVE",
        issuer="local",
        is_authenticated=True,
    )

    # Unit verification of require_auth dependency
    with pytest.raises(Exception) as exc_info:
        require_auth(ctx_empty)
    assert exc_info.value.status_code == 403
    assert exc_info.value.code == "ROLE_NOT_PERMITTED"

    # Integration verification through endpoint
    app.dependency_overrides[get_current_security_context] = lambda: ctx_empty
    try:
        resp = await client.get("/v1/lmi/aggregates")
        assert resp.status_code == 403
        assert resp.json()["detail"]["code"] == "ROLE_NOT_PERMITTED"
    finally:
        app.dependency_overrides.pop(get_current_security_context, None)


@pytest.mark.asyncio
async def test_options_preflight_on_guarded_route_not_blocked(client: AsyncClient) -> None:
    """Edge Case: CORS OPTIONS preflight to guarded route succeeds without 401."""
    resp = await client.options(
        "/v1/admin/health",
        headers={
            "Origin": "http://localhost:3000",
            "Access-Control-Request-Method": "GET",
            "Access-Control-Request-Headers": "Authorization",
        },
    )
    assert resp.status_code == 200
    assert "access-control-allow-origin" in resp.headers


@pytest.mark.asyncio
async def test_unknown_route_returns_404_not_401(client: AsyncClient) -> None:
    """Edge Case: Unknown path returns 404 without leaking authentication state."""
    resp = await client.get("/v1/nonexistent-endpoint-xyz")
    assert resp.status_code == 404


@pytest.mark.asyncio
async def test_public_route_trailing_slash(client: AsyncClient) -> None:
    """Edge Case: Trailing slash variant of public route is accessible."""
    resp = await client.get("/v1/taxonomy/tree/")
    assert resp.status_code in (200, 307)
