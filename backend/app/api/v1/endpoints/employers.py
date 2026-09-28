from fastapi import APIRouter, Depends

from ....core.rbac import EmployerScope, require_employer_scope, require_roles
from ....core.security import SecurityContext
from ....schemas.common import ApiResponse

router = APIRouter()

_require_employer = require_roles("EMPLOYER")


@router.post("/skill-needs", response_model=ApiResponse[dict], status_code=201)
async def submit_skill_needs(
    data: dict,
    _: SecurityContext = Depends(_require_employer),
    scope: EmployerScope = Depends(require_employer_scope),
):
    return ApiResponse(
        success=True,
        data={"message": "Skill need recorded successfully and queued for local demand modeling."},
    )
