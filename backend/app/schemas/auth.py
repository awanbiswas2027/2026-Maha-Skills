from typing import Any

from pydantic import BaseModel, EmailStr


class UserProfileOut(BaseModel):
    id: str
    keycloak_sub: str | None = None
    email: EmailStr
    full_name: str
    roles: list[str]
    account_status: str | None = None
    issuer: str | None = None
    scopes: dict[str, Any] = {}


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


class RegisterRequest(BaseModel):
    email: EmailStr
    password: str
    full_name: str
    phone: str | None = None
    role: str
    organisation_name: str | None = None
    gstin: str | None = None


class VerifyEmailRequest(BaseModel):
    email: EmailStr
    code: str


class ResendVerificationRequest(BaseModel):
    email: EmailStr


class LoginRequest(BaseModel):
    email: EmailStr
    password: str


class LoginResponse(BaseModel):
    access_token: str


class ForgotPasswordRequest(BaseModel):
    email: EmailStr


class ResetPasswordRequest(BaseModel):
    email: EmailStr
    code: str
    new_password: str
