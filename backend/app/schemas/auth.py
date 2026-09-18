from pydantic import BaseModel, EmailStr


class UserProfileOut(BaseModel):
    id: str
    keycloak_sub: str
    email: EmailStr
    full_name: str
    roles: list[str]
    scopes: dict = {}


class GapScoreOut(BaseModel):
    id: str
    district_name: str
    sector_name: str
    job_role_title: str
    nsqf_level: int
    demand_count: int
    trained_capacity: int
    placement_rate: float
    gap_score: float
    severity_level: str


class PathwayQuizRequest(BaseModel):
    district_id: int
    education_level: str
    sector_interest_ids: list[int]
    language_preference: str = "mr"
    willing_to_relocate: bool = False


class PathwayRecommendationItem(BaseModel):
    course_id: str
    course_title: str
    match_score: int
    reason_en: str
    reason_mr: str
