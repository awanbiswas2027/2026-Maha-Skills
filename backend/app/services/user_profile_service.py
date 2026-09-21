import logging
import uuid
from typing import Any

from fastapi import status
from sqlalchemy import select
from sqlalchemy.exc import IntegrityError, SQLAlchemyError
from sqlalchemy.ext.asyncio import AsyncSession

from ..core.security import AuthException, SecurityContext
from ..models.auth import AccountStatus
from ..models.geography import District
from ..models.user import User
from ..schemas.auth import UserProfileOut

logger = logging.getLogger(__name__)


def build_role_scopes(ctx: SecurityContext, district_name: str | None = None) -> dict[str, Any]:
    """Build scoped dictionary strictly conforming to role permissions.

    Omits irrelevant keys rather than returning nulls.
    """
    scopes: dict[str, Any] = {}
    user_roles = set(ctx.roles)

    # DISTRICT_OFFICER / ITI_PRINCIPAL: district scoping
    if (
        user_roles.intersection({"DISTRICT_OFFICER", "ITI_PRINCIPAL"})
        and ctx.district_id is not None
    ):
        scopes["district_id"] = ctx.district_id
        if district_name:
            scopes["district_name"] = district_name

    # ITI_PRINCIPAL: institute scoping
    if "ITI_PRINCIPAL" in user_roles and ctx.institute_id is not None:
        scopes["institute_id"] = ctx.institute_id

    # SSC_REVIEWER: sector scoping
    if "SSC_REVIEWER" in user_roles and ctx.sector_ids:
        scopes["sector_ids"] = ctx.sector_ids

    # EMPLOYER: employer scoping
    if "EMPLOYER" in user_roles and ctx.employer_id is not None:
        scopes["employer_id"] = ctx.employer_id

    return scopes


async def get_user_profile(
    ctx: SecurityContext,
    session: AsyncSession,
) -> UserProfileOut:
    """Fetch the real database-backed profile for an authenticated SecurityContext.

    1. Keycloak staff users: looked up by keycloak_sub, with idempotent first-login provisioning.
    2. Local users: looked up by user UUID (keycloak_sub is None).
    3. Strict 404 on unknown local user; never returns a fabricated profile.
    4. Scopes formatted per role without irrelevant null keys.
    """
    user: User | None = None

    if ctx.issuer == "keycloak":
        # 1. Look up existing staff user by keycloak_sub
        stmt = select(User).where(User.keycloak_sub == ctx.user_id)
        result = await session.execute(stmt)
        user = result.scalar_one_or_none()

        if user is None:
            # Prevent silently binding to an unlinked local account with the same email
            if ctx.email:
                email_stmt = select(User).where(User.email == ctx.email)
                email_res = await session.execute(email_stmt)
                existing_local = email_res.scalar_one_or_none()
                if existing_local is not None and existing_local.keycloak_sub is None:
                    logger.warning(
                        "Keycloak token sub '%s' presents email '%s' belonging to unlinked local user '%s'",
                        ctx.user_id,
                        ctx.email,
                        existing_local.id,
                    )
                    raise AuthException(
                        status_code=status.HTTP_403_FORBIDDEN,
                        code="ACCOUNT_MISMATCH",
                        message="Keycloak identity cannot be bound to existing local account without pre-linking",
                    )

            # First-login JIT provisioning for staff
            logger.info(
                "First-login provisioning for Keycloak user: sub=%s, email=%s",
                ctx.user_id,
                ctx.email,
            )
            fallback_name = (
                ctx.email.split("@")[0].replace(".", " ").title() if ctx.email else "Staff Member"
            )
            new_user = User(
                id=uuid.uuid4(),
                keycloak_sub=ctx.user_id,
                email=ctx.email,
                full_name=fallback_name,
                is_active=True,
                account_status=AccountStatus.ACTIVE.value,
                email_verified=True,
            )
            session.add(new_user)
            try:
                await session.commit()
                await session.refresh(new_user)
                user = new_user
            except IntegrityError as exc:
                await session.rollback()
                # Race condition handling: re-fetch concurrently inserted row
                retry_res = await session.execute(stmt)
                user = retry_res.scalar_one_or_none()
                if user is None:
                    raise AuthException(
                        status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                        code="PROVISIONING_FAILED",
                        message="Failed to provision user profile during first login",
                    ) from exc
    else:
        # Local user lookup by user_id
        try:
            user_uuid = (
                uuid.UUID(str(ctx.user_id))
                if not isinstance(ctx.user_id, uuid.UUID)
                else ctx.user_id
            )
        except (ValueError, AttributeError) as exc:
            raise AuthException(
                status_code=status.HTTP_404_NOT_FOUND,
                code="USER_NOT_FOUND",
                message=f"User profile '{ctx.user_id}' not found",
            ) from exc

        stmt = select(User).where(User.id == user_uuid)
        result = await session.execute(stmt)
        user = result.scalar_one_or_none()

        if user is None:
            raise AuthException(
                status_code=status.HTTP_404_NOT_FOUND,
                code="USER_NOT_FOUND",
                message=f"User profile '{ctx.user_id}' not found",
            )

    # Resolve district name if district_id is present
    district_name: str | None = None
    if ctx.district_id is not None:
        try:
            d_stmt = select(District).where(District.id == ctx.district_id)
            d_res = await session.execute(d_stmt)
            district_obj = d_res.scalar_one_or_none()
            if district_obj:
                district_name = district_obj.name_en
        except SQLAlchemyError as exc:
            logger.debug("District lookup failed for district_id=%s: %s", ctx.district_id, exc)

    scopes = build_role_scopes(ctx, district_name=district_name)

    return UserProfileOut(
        id=str(user.id),
        keycloak_sub=user.keycloak_sub,
        email=user.email,
        full_name=user.full_name,
        roles=ctx.roles,
        account_status=user.account_status,
        issuer=ctx.issuer,
        scopes=scopes,
    )
