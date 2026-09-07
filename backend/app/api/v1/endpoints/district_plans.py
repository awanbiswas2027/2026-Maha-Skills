from fastapi import APIRouter, Query
from ....schemas.common import ApiResponse

router = APIRouter()

@router.get("", response_model=ApiResponse[dict])
async def get_district_plan(
    district_id: int = Query(...),
    fiscal_year: str = Query("2026-2027"),
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
