from typing import List, Optional
from fastapi import APIRouter, Query
from ....schemas.common import ApiResponse
from ....schemas.auth import PathwayQuizRequest, PathwayRecommendationItem

router = APIRouter()

@router.get("/courses", response_model=ApiResponse[List[dict]])
async def search_courses(
    search: Optional[str] = Query(None),
    district_id: Optional[int] = Query(None),
    sector_id: Optional[int] = Query(None),
):
    courses = [
        {
            "id": "e2a40192-4912-421b-8192-381920194812",
            "course_code": "CTS-EVT-01",
            "title_mr": "इलेक्ट्रिक वाहन तंत्रज्ञ",
            "title_en": "Electric Vehicle Technician",
            "duration_months": 12,
            "nsqf_level": 4,
            "verified_placement_rate": 81.5,
            "median_salary_inr": 24000.00,
        }
    ]
    return ApiResponse(success=True, data=courses)

@router.post("/pathway/recommend", response_model=ApiResponse[List[PathwayRecommendationItem]])
async def recommend_pathway(req: PathwayQuizRequest):
    recs = [
        PathwayRecommendationItem(
            course_id="e2a40192-4912-421b-8192-381920194812",
            course_title="Electric Vehicle Technician",
            match_score=92,
            reason_en="Strong industrial demand in Pune automotive belt matching your mechanical interest.",
            reason_mr="आपल्या यांत्रिकी आवडीनुसार पुणे ऑटोमोटिव्ह पट्ट्यात उच्च औद्योगिक मागणी."
        )
    ]
    return ApiResponse(success=True, data=recs)
