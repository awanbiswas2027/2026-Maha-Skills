from fastapi import APIRouter

from .endpoints import (
    admin,
    auth,
    candidates,
    district_plans,
    employers,
    gap_scores,
    lmi,
    placements,
    recommendations,
    taxonomy,
)

api_router = APIRouter()

api_router.include_router(auth.router, prefix="/auth", tags=["Authentication"])
api_router.include_router(lmi.router, prefix="/lmi", tags=["Labour Market Intelligence"])
api_router.include_router(taxonomy.router, prefix="/taxonomy", tags=["Skill Taxonomy"])
api_router.include_router(gap_scores.router, prefix="/gap-scores", tags=["Gap Scoring"])
api_router.include_router(
    recommendations.router, prefix="/recommendations", tags=["Curriculum Recommendations"]
)
api_router.include_router(employers.router, prefix="/employers", tags=["Employer Engagement"])
api_router.include_router(
    placements.router, prefix="/ingestion/placements", tags=["Placement Ingestion"]
)
api_router.include_router(
    district_plans.router, prefix="/district-plans", tags=["District Planning"]
)
api_router.include_router(candidates.router, prefix="/candidates", tags=["Candidate Guidance"])
api_router.include_router(admin.router, prefix="/admin", tags=["System Administration"])
