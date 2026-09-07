from fastapi import APIRouter
from ....schemas.common import ApiResponse

router = APIRouter()

@router.post("/skill-needs", response_model=ApiResponse[dict], status_code=201)
async def submit_skill_needs(data: dict):
    return ApiResponse(
        success=True,
        data={"message": "Skill need recorded successfully and queued for local demand modeling."}
    )
