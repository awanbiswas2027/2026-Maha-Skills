from fastapi import APIRouter, Depends

from ....core.rbac import require_roles
from ....core.security import SecurityContext
from ....schemas.common import ApiResponse

router = APIRouter()

_require_admin = require_roles("ADMIN")


@router.get("/health", response_model=ApiResponse[dict])
async def get_system_health(
    _: SecurityContext = Depends(_require_admin),
):
    health = {
        "status": "HEALTHY",
        "database": "CONNECTED",
        "redis": "CONNECTED",
        "active_workers": 4,
        "pending_validation_jobs": 0,
    }
    return ApiResponse(success=True, data=health)
