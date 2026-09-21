import logging
import secrets
import uuid
from datetime import UTC, datetime, timedelta

from fastapi import HTTPException
from sqlalchemy import and_, select, update
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.config import settings
from app.models.auth import AccountStatus, EmailVerification, RefreshToken, VerificationPurpose
from app.models.user import AuditLog, User, UserScope
from app.schemas.auth import (
    ForgotPasswordRequest,
    LoginRequest,
    RegisterRequest,
    ResendVerificationRequest,
    ResetPasswordRequest,
    VerifyEmailRequest,
)
from app.services.auth_token_service import (
    create_access_token,
    create_refresh_token,
    hash_refresh_token,
)
from app.services.password_service import DUMMY_HASH, hash_password, verify_password

logger = logging.getLogger(__name__)


def get_utc_now():
    return datetime.now(UTC)


def ensure_utc(dt: datetime) -> datetime:
    if dt.tzinfo is None:
        return dt.replace(tzinfo=UTC)
    return dt


async def register_user(db: AsyncSession, req: RegisterRequest):
    if req.role not in ["CANDIDATE", "EMPLOYER"]:
        raise HTTPException(status_code=400, detail="Invalid role")

    stmt = select(User).where(User.email == req.email.lower())
    result = await db.execute(stmt)
    existing_user = result.scalar_one_or_none()

    if existing_user:
        logger.info(f"User {req.email.lower()} already exists. Sending account exists notice.")
        return

    hashed_pwd = hash_password(req.password)
    new_user = User(
        email=req.email.lower(),
        password_hash=hashed_pwd,
        full_name=req.full_name,
        phone=req.phone,
        account_status=AccountStatus.PENDING_VERIFICATION.value,
        email_verified=False,
    )
    db.add(new_user)
    await db.flush()

    new_scope = UserScope(user_id=new_user.id, role_name=req.role)
    db.add(new_scope)
    await db.flush()

    code = secrets.token_urlsafe(32)
    code_hash = hash_password(code)

    ev = EmailVerification(
        user_id=new_user.id,
        code_hash=code_hash,
        purpose=VerificationPurpose.VERIFY_EMAIL.value,
        expires_at=get_utc_now() + timedelta(seconds=settings.AUTH_VERIFICATION_CODE_TTL_SECONDS),
    )
    db.add(ev)
    await db.commit()
    logger.info(f"Generated verification code for {req.email.lower()}")


async def verify_email_code(db: AsyncSession, req: VerifyEmailRequest):
    stmt = select(User).where(User.email == req.email.lower())
    user = (await db.execute(stmt)).scalar_one_or_none()

    if not user:
        raise HTTPException(status_code=400, detail="Invalid code")

    ev_stmt = (
        select(EmailVerification)
        .where(
            and_(
                EmailVerification.user_id == user.id,
                EmailVerification.purpose == VerificationPurpose.VERIFY_EMAIL.value,
                EmailVerification.consumed_at.is_(None),
            )
        )
        .order_by(EmailVerification.created_at.desc())
    )

    ev = (await db.execute(ev_stmt)).scalars().first()
    if not ev:
        raise HTTPException(status_code=400, detail="Invalid code")

    if ev.attempts >= settings.AUTH_MAX_VERIFICATION_ATTEMPTS:
        raise HTTPException(status_code=400, detail="Too many attempts")

    if not verify_password(req.code, ev.code_hash):
        ev.attempts += 1
        await db.commit()
        raise HTTPException(status_code=400, detail="Invalid code")

    if ensure_utc(ev.expires_at) < get_utc_now():
        raise HTTPException(status_code=400, detail="Code expired")

    ev.consumed_at = get_utc_now()
    user.email_verified = True

    scope_stmt = select(UserScope).where(UserScope.user_id == user.id)
    scope = (await db.execute(scope_stmt)).scalars().first()

    if scope and scope.role_name == "CANDIDATE":
        user.account_status = AccountStatus.ACTIVE.value
    elif scope and scope.role_name == "EMPLOYER":
        user.account_status = AccountStatus.PENDING_APPROVAL.value

    await db.commit()


async def resend_verification_email(db: AsyncSession, req: ResendVerificationRequest):
    stmt = select(User).where(User.email == req.email.lower())
    user = (await db.execute(stmt)).scalar_one_or_none()

    if user and user.account_status == AccountStatus.PENDING_VERIFICATION.value:
        code = secrets.token_urlsafe(32)
        code_hash = hash_password(code)

        ev = EmailVerification(
            user_id=user.id,
            code_hash=code_hash,
            purpose=VerificationPurpose.VERIFY_EMAIL.value,
            expires_at=get_utc_now()
            + timedelta(seconds=settings.AUTH_VERIFICATION_CODE_TTL_SECONDS),
        )
        db.add(ev)
        await db.commit()


async def login_user(
    db: AsyncSession,
    req: LoginRequest,
    ip_address: str | None = None,
    user_agent: str | None = None,
):
    stmt = select(User).where(User.email == req.email.lower())
    user = (await db.execute(stmt)).scalar_one_or_none()

    if not user:
        verify_password(req.password, DUMMY_HASH)
        raise HTTPException(status_code=401, detail="Invalid credentials")

    if user.password_hash is None:
        raise HTTPException(status_code=403, detail="USE_SSO")

    if not verify_password(req.password, user.password_hash):
        raise HTTPException(status_code=401, detail="Invalid credentials")

    if user.account_status != AccountStatus.ACTIVE.value:
        raise HTTPException(status_code=403, detail=f"ACCOUNT_{user.account_status}")

    user.last_login_at = get_utc_now()

    scope_stmt = select(UserScope).where(UserScope.user_id == user.id)
    scopes = (await db.execute(scope_stmt)).scalars().all()
    roles = [s.role_name for s in scopes]

    access_token = create_access_token(
        user=user,
        roles=roles,
    )

    refresh_token, token_hash, family_id = create_refresh_token()

    rt = RefreshToken(
        user_id=user.id,
        token_hash=token_hash,
        family_id=family_id,
        expires_at=get_utc_now() + timedelta(seconds=settings.AUTH_REFRESH_TOKEN_TTL_SECONDS),
        ip_address=ip_address,
        user_agent=user_agent,
    )
    db.add(rt)
    await db.commit()

    return access_token, refresh_token


async def refresh_token_rotation(
    db: AsyncSession,
    refresh_token: str,
    ip_address: str | None = None,
    user_agent: str | None = None,
):
    token_hash = hash_refresh_token(refresh_token)
    stmt = select(RefreshToken).where(RefreshToken.token_hash == token_hash)
    rt = (await db.execute(stmt)).scalar_one_or_none()

    if not rt:
        raise HTTPException(status_code=401, detail="Invalid token")

    if rt.revoked_at:
        # Revoke family
        revoke_stmt = (
            update(RefreshToken)
            .where(RefreshToken.family_id == rt.family_id)
            .values(revoked_at=get_utc_now())
        )
        await db.execute(revoke_stmt)
        await db.commit()
        raise HTTPException(status_code=401, detail="Token revoked")

    if ensure_utc(rt.expires_at) < get_utc_now():
        raise HTTPException(status_code=401, detail="Token expired")

    rt.revoked_at = get_utc_now()

    user_stmt = select(User).where(User.id == rt.user_id)
    user = (await db.execute(user_stmt)).scalar_one()

    if user.account_status != AccountStatus.ACTIVE.value:
        await db.commit()
        raise HTTPException(status_code=403, detail="Account not active")

    scope_stmt = select(UserScope).where(UserScope.user_id == user.id)
    scopes = (await db.execute(scope_stmt)).scalars().all()
    roles = [s.role_name for s in scopes]

    access_token = create_access_token(
        user=user,
        roles=roles,
    )

    new_refresh, new_hash, _ = create_refresh_token()

    new_rt = RefreshToken(
        user_id=user.id,
        token_hash=new_hash,
        family_id=rt.family_id,
        expires_at=get_utc_now() + timedelta(seconds=settings.AUTH_REFRESH_TOKEN_TTL_SECONDS),
        ip_address=ip_address,
        user_agent=user_agent,
    )
    db.add(new_rt)
    await db.commit()

    return access_token, new_refresh


async def logout_user(db: AsyncSession, refresh_token: str):
    if not refresh_token:
        return

    token_hash = hash_refresh_token(refresh_token)
    stmt = select(RefreshToken).where(RefreshToken.token_hash == token_hash)
    rt = (await db.execute(stmt)).scalar_one_or_none()

    if rt:
        revoke_stmt = (
            update(RefreshToken)
            .where(RefreshToken.family_id == rt.family_id)
            .values(revoked_at=get_utc_now())
        )
        await db.execute(revoke_stmt)
        await db.commit()


async def forgot_password_email(db: AsyncSession, req: ForgotPasswordRequest):
    stmt = select(User).where(User.email == req.email.lower())
    user = (await db.execute(stmt)).scalar_one_or_none()

    if user and user.password_hash is not None:
        code = secrets.token_urlsafe(32)
        code_hash = hash_password(code)

        ev = EmailVerification(
            user_id=user.id,
            code_hash=code_hash,
            purpose=VerificationPurpose.RESET_PASSWORD.value,
            expires_at=get_utc_now()
            + timedelta(seconds=settings.AUTH_VERIFICATION_CODE_TTL_SECONDS),
        )
        db.add(ev)
        await db.commit()


async def reset_password_code(db: AsyncSession, req: ResetPasswordRequest):
    stmt = select(User).where(User.email == req.email.lower())
    user = (await db.execute(stmt)).scalar_one_or_none()

    if not user:
        raise HTTPException(status_code=400, detail="Invalid code")

    ev_stmt = (
        select(EmailVerification)
        .where(
            and_(
                EmailVerification.user_id == user.id,
                EmailVerification.purpose == VerificationPurpose.RESET_PASSWORD.value,
                EmailVerification.consumed_at.is_(None),
            )
        )
        .order_by(EmailVerification.created_at.desc())
    )

    ev = (await db.execute(ev_stmt)).scalars().first()
    if not ev:
        raise HTTPException(status_code=400, detail="Invalid code")

    if ev.attempts >= settings.AUTH_MAX_VERIFICATION_ATTEMPTS:
        raise HTTPException(status_code=400, detail="Too many attempts")

    if not verify_password(req.code, ev.code_hash):
        ev.attempts += 1
        await db.commit()
        raise HTTPException(status_code=400, detail="Invalid code")

    if ensure_utc(ev.expires_at) < get_utc_now():
        raise HTTPException(status_code=400, detail="Code expired")

    ev.consumed_at = get_utc_now()
    user.password_hash = hash_password(req.new_password)

    revoke_stmt = (
        update(RefreshToken).where(RefreshToken.user_id == user.id).values(revoked_at=get_utc_now())
    )
    await db.execute(revoke_stmt)
    await db.commit()


async def approve_employer(
    db: AsyncSession, user_id: uuid.UUID, actor_id: uuid.UUID, actor_role: str
):
    stmt = select(User).where(User.id == user_id)
    user = (await db.execute(stmt)).scalar_one_or_none()

    if not user or user.account_status != AccountStatus.PENDING_APPROVAL.value:
        raise HTTPException(status_code=409, detail="Invalid account state")

    user.account_status = AccountStatus.ACTIVE.value

    audit = AuditLog(
        actor_id=actor_id,
        actor_role=actor_role,
        action="APPROVE_EMPLOYER",
        resource_type="User",
        resource_id=str(user.id),
    )
    db.add(audit)
    await db.commit()


async def reject_employer(
    db: AsyncSession, user_id: uuid.UUID, actor_id: uuid.UUID, actor_role: str
):
    stmt = select(User).where(User.id == user_id)
    user = (await db.execute(stmt)).scalar_one_or_none()

    if not user or user.account_status != AccountStatus.PENDING_APPROVAL.value:
        raise HTTPException(status_code=409, detail="Invalid account state")

    user.account_status = AccountStatus.REJECTED.value

    audit = AuditLog(
        actor_id=actor_id,
        actor_role=actor_role,
        action="REJECT_EMPLOYER",
        resource_type="User",
        resource_id=str(user.id),
    )
    db.add(audit)
    await db.commit()
