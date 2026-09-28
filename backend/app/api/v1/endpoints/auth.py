import uuid

from fastapi import APIRouter, Cookie, Depends, HTTPException, Request, Response
from sqlalchemy.ext.asyncio import AsyncSession

from ....core.config import settings
from ....core.database import get_db_session
from ....core.security import (
    SecurityContext,
    get_current_security_context,
    get_optional_security_context,
)
from ....schemas.auth import (
    ForgotPasswordRequest,
    LoginRequest,
    LoginResponse,
    RegisterRequest,
    ResendVerificationRequest,
    ResetPasswordRequest,
    UserProfileOut,
    VerifyEmailRequest,
)
from ....schemas.common import ApiResponse
from ....services.auth_service import (
    approve_employer,
    forgot_password_email,
    login_user,
    logout_user,
    refresh_token_rotation,
    register_user,
    reject_employer,
    resend_verification_email,
    reset_password_code,
    verify_email_code,
)

router = APIRouter()


# TODO(P003-merge): replace with require_roles("ADMIN")
def _require_admin(ctx: SecurityContext = Depends(get_current_security_context)):
    if "ADMIN" not in ctx.roles:
        raise HTTPException(status_code=403, detail="Forbidden")
    return ctx


@router.get("/me", response_model=ApiResponse[UserProfileOut])
async def get_me(ctx: SecurityContext = Depends(get_current_security_context)):
    profile = UserProfileOut(
        id=ctx.user_id,
        keycloak_sub="sub-123456",
        email=ctx.email,
        full_name="Dr. Rajesh Patil",
        roles=ctx.roles,
        scopes={"district_id": ctx.district_id, "district_name": "Pune"},
    )
    return ApiResponse(success=True, data=profile)


@router.post("/register", status_code=201, response_model=ApiResponse[dict])
async def register(req: RegisterRequest, db: AsyncSession = Depends(get_db_session)):
    await register_user(db, req)
    return ApiResponse(success=True, data={"message": "Registered successfully"})


@router.post("/verify-email", response_model=ApiResponse[dict])
async def verify_email(req: VerifyEmailRequest, db: AsyncSession = Depends(get_db_session)):
    await verify_email_code(db, req)
    return ApiResponse(success=True, data={"message": "Email verified"})


@router.post("/resend-verification", response_model=ApiResponse[dict])
async def resend_verification(
    req: ResendVerificationRequest, db: AsyncSession = Depends(get_db_session)
):
    await resend_verification_email(db, req)
    return ApiResponse(success=True, data={"message": "Verification email resent"})


@router.post("/login", response_model=ApiResponse[LoginResponse])
async def login(
    req: LoginRequest,
    response: Response,
    request: Request,
    db: AsyncSession = Depends(get_db_session),
):
    ip_address = request.client.host if request.client else None
    user_agent = request.headers.get("user-agent")

    access_token, refresh_token = await login_user(
        db, req, ip_address=ip_address, user_agent=user_agent
    )

    response.set_cookie(
        key="refresh_token",
        value=refresh_token,
        httponly=True,
        samesite="strict",
        path="/v1/auth",
        secure=(settings.ENVIRONMENT != "development"),
        max_age=settings.AUTH_REFRESH_TOKEN_TTL_SECONDS,
    )
    return ApiResponse(success=True, data=LoginResponse(access_token=access_token))


@router.post("/refresh", response_model=ApiResponse[LoginResponse])
async def refresh(
    response: Response,
    request: Request,
    refresh_token: str | None = Cookie(None),
    db: AsyncSession = Depends(get_db_session),
):
    if not refresh_token:
        raise HTTPException(status_code=401, detail="No refresh token")

    ip_address = request.client.host if request.client else None
    user_agent = request.headers.get("user-agent")

    access_token, new_refresh = await refresh_token_rotation(
        db, refresh_token, ip_address=ip_address, user_agent=user_agent
    )

    response.set_cookie(
        key="refresh_token",
        value=new_refresh,
        httponly=True,
        samesite="strict",
        path="/v1/auth",
        secure=(settings.ENVIRONMENT != "development"),
        max_age=settings.AUTH_REFRESH_TOKEN_TTL_SECONDS,
    )
    return ApiResponse(success=True, data=LoginResponse(access_token=access_token))


@router.post("/logout", status_code=204)
async def logout(
    response: Response,
    refresh_token: str | None = Cookie(None),
    db: AsyncSession = Depends(get_db_session),
    ctx: SecurityContext | None = Depends(get_optional_security_context),
):
    await logout_user(db, refresh_token)
    response.delete_cookie(
        key="refresh_token",
        path="/v1/auth",
        secure=(settings.ENVIRONMENT != "development"),
        httponly=True,
        samesite="strict",
    )
    if ctx and ctx.issuer != "local":
        url = f"{settings.KEYCLOAK_URL.rstrip('/')}/realms/{settings.KEYCLOAK_REALM}/protocol/openid-connect/logout"
        return ApiResponse(success=True, data={"keycloak_logout_url": url})
    return Response(status_code=204)


@router.post("/password/forgot", response_model=ApiResponse[dict])
async def forgot_password(req: ForgotPasswordRequest, db: AsyncSession = Depends(get_db_session)):
    await forgot_password_email(db, req)
    return ApiResponse(success=True, data={"message": "Password reset email sent"})


@router.post("/password/reset", response_model=ApiResponse[dict])
async def reset_password(req: ResetPasswordRequest, db: AsyncSession = Depends(get_db_session)):
    await reset_password_code(db, req)
    return ApiResponse(success=True, data={"message": "Password reset successfully"})


@router.post("/admin/employers/{user_id}/approve", response_model=ApiResponse[dict])
async def admin_approve_employer(
    user_id: uuid.UUID,
    db: AsyncSession = Depends(get_db_session),
    ctx: SecurityContext = Depends(_require_admin),
):
    await approve_employer(db, user_id, uuid.UUID(ctx.user_id), ctx.roles[0])
    return ApiResponse(success=True, data={"message": "Employer approved"})


@router.post("/admin/employers/{user_id}/reject", response_model=ApiResponse[dict])
async def admin_reject_employer(
    user_id: uuid.UUID,
    db: AsyncSession = Depends(get_db_session),
    ctx: SecurityContext = Depends(_require_admin),
):
    await reject_employer(db, user_id, uuid.UUID(ctx.user_id), ctx.roles[0])
    return ApiResponse(success=True, data={"message": "Employer rejected"})
