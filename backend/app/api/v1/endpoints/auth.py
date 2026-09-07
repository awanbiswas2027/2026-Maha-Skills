from fastapi import APIRouter, Depends
from ....core.security import get_current_security_context, SecurityContext
from ....schemas.common import ApiResponse
from ....schemas.auth import UserProfileOut

router = APIRouter()

@router.get("/me", response_model=ApiResponse[UserProfileOut])
async def get_me(ctx: SecurityContext = Depends(get_current_security_context)):
    profile = UserProfileOut(
        id=ctx.user_id,
        keycloak_sub="sub-123456",
        email=ctx.email,
        full_name="Dr. Rajesh Patil",
        roles=ctx.roles,
        scopes={"district_id": ctx.district_id, "district_name": "Pune"}
    )
    return ApiResponse(success=True, data=profile)
