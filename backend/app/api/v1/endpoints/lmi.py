from typing import Optional
from fastapi import APIRouter, Query
from ....schemas.common import ApiResponse

router = APIRouter()

@router.get("/aggregates", response_model=ApiResponse[dict])
async def get_lmi_aggregates(
    district_id: Optional[int] = Query(None),
    sector_id: Optional[int] = Query(None),
):
    data = {
        "total_vacancies": 48250,
        "top_sectors": [
            {"sector_id": 3, "name": "Automotive & EV", "openings": 14200, "growth_rate": 18.4},
            {"sector_id": 12, "name": "IT & ITeS", "openings": 12100, "growth_rate": 12.1},
        ],
    }
    return ApiResponse(success=True, data=data)
