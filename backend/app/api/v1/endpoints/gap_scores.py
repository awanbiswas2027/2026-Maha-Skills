from fastapi import APIRouter, Depends, Query

from ....core.rbac import DistrictScope, require_district_scope, require_roles
from ....core.security import SecurityContext
from ....schemas.auth import GapScoreOut
from ....schemas.common import ApiResponse, PaginationMeta

router = APIRouter()

_require_gap_roles = require_roles("POLICY_MAKER", "ADMIN", "DISTRICT_OFFICER")


@router.get("", response_model=ApiResponse[list[GapScoreOut]])
async def list_gap_scores(
    district_id: int | None = Query(None),
    sector_id: int | None = Query(None),
    nsqf_level: int | None = Query(None),
    page: int = Query(1, ge=1),
    limit: int = Query(20, ge=1, le=100),
    _: SecurityContext = Depends(_require_gap_roles),
    scope: DistrictScope = Depends(require_district_scope),
):
    mock_items = [
        GapScoreOut(
            id="c4d10928-1039-4412-a102-120938491029",
            district_name="Pune",
            sector_name="Automotive & EV",
            job_role_title="EV Assembly Technician",
            nsqf_level=4,
            demand_count=1420,
            trained_capacity=450,
            placement_rate=84.5,
            gap_score=76.40,
            severity_level="CRITICAL",
        ),
        GapScoreOut(
            id="b2e10928-1039-4412-a102-120938491030",
            district_name="Nashik",
            sector_name="Auto Ancillaries",
            job_role_title="CNC Operator",
            nsqf_level=3,
            demand_count=820,
            trained_capacity=520,
            placement_rate=68.0,
            gap_score=52.10,
            severity_level="MODERATE",
        ),
    ]
    return ApiResponse(
        success=True,
        data=mock_items,
        meta=PaginationMeta(page=page, limit=limit, total_count=len(mock_items), total_pages=1),
    )


@router.get("/oversupply", response_model=ApiResponse[list[dict]])
async def get_oversupply_alerts(
    district_id: int | None = Query(None),
    _: SecurityContext = Depends(_require_gap_roles),
    scope: DistrictScope = Depends(require_district_scope),
):
    alerts = [
        {
            "course_id": "e2a40192-4912-421b-8192-381920194812",
            "course_code": "CTS-WLD-01",
            "course_title": "Conventional Oxy-Acetylene Welder",
            "placement_rate": 18.2,
            "local_demand_percentile": 12,
            "recommendation": "RETIRE_OR_UPGRADE_TO_TIG_MIG",
        }
    ]
    return ApiResponse(success=True, data=alerts)
