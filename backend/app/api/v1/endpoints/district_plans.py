from fastapi import APIRouter, Depends, Query

from ....core.rbac import DistrictScope, require_district_scope, require_roles
from ....core.security import SecurityContext
from ....schemas.common import ApiResponse

router = APIRouter()

_require_district_plan_roles = require_roles(
    "DISTRICT_OFFICER", "ITI_PRINCIPAL", "POLICY_MAKER", "ADMIN"
)


@router.get("", response_model=ApiResponse[dict])
async def get_district_plan(
    district_id: int = Query(...),
    fiscal_year: str = Query("2026-2027"),
    _: SecurityContext = Depends(_require_district_plan_roles),
    scope: DistrictScope = Depends(require_district_scope),
):
    plan = {
        "plan_id": "7f1e9012-4819-412b-8910-128938192019",
        "district_id": district_id,
        "district_name": "Pune",
        "fiscal_year": fiscal_year,
        "status": "DRAFT",
        "total_target_intake": 12400,
        "total_estimated_budget": 14500000.00,
    }
    return ApiResponse(success=True, data=plan)
