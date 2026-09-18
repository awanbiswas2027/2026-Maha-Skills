from fastapi import APIRouter

from ....schemas.common import ApiResponse

router = APIRouter()


@router.get("/health", response_model=ApiResponse[dict])
async def get_system_health():
    health = {
        "status": "HEALTHY",
        "database": "CONNECTED",
        "redis": "CONNECTED",
        "active_workers": 4,
        "pending_validation_jobs": 0,
    }
    return ApiResponse(success=True, data=health)
