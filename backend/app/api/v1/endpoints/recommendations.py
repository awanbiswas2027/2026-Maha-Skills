from fastapi import APIRouter, Path, Query

from ....schemas.common import ApiResponse, PaginationMeta

router = APIRouter()


@router.get("", response_model=ApiResponse[list[dict]])
async def list_recommendations(
    status: str | None = Query(None),
    ssc_id: int | None = Query(None),
    page: int = Query(1, ge=1),
    limit: int = Query(20, ge=1, le=100),
):
    recs = [
        {
            "id": "d9e80124-4819-412b-8910-128938192019",
            "recommendation_code": "REC-2026-0042",
            "job_role": "Robotics Welding Cell Specialist",
            "recommendation_type": "ADD_MODULE",
            "status": "UNDER_SSC_REVIEW",
        }
    ]
    return ApiResponse(
        success=True,
        data=recs,
        meta=PaginationMeta(page=page, limit=limit, total_count=len(recs), total_pages=1),
    )


@router.get("/{id}/dossier", response_model=ApiResponse[dict])
async def get_dossier(id: str = Path(...)):
    dossier = {
        "recommendation_id": id,
        "recommendation_code": "REC-2026-0042",
        "evidence": {
            "demand_growth_12m": "+42.5%",
            "top_hiring_employers": ["Tata Motors Ltd", "Bajaj Auto Ltd"],
        },
    }
    return ApiResponse(success=True, data=dossier)
