from datetime import UTC, datetime, timedelta
from unittest.mock import patch

import pytest
from httpx import AsyncClient
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.auth import AccountStatus, EmailVerification, VerificationPurpose
from app.models.user import AuditLog, User, UserScope
from app.services.auth_token_service import create_access_token
from app.services.password_service import DUMMY_HASH, hash_password, verify_password


@pytest.mark.asyncio
async def test_reg_auth_001(client: AsyncClient, db_session: AsyncSession):
    res = await client.post(
        "/v1/auth/register",
        json={
            "email": "candidate1@test.com",
            "password": "Password123!",
            "full_name": "Test Candidate",
            "role": "CANDIDATE",
        },
    )
    assert res.status_code == 201
    data = res.json()
    assert data["success"] == True
    assert "access_token" not in data


@pytest.mark.asyncio
async def test_reg_auth_002(client: AsyncClient, db_session: AsyncSession):
    res = await client.post(
        "/v1/auth/register",
        json={
            "email": "staff@test.com",
            "password": "Password123!",
            "full_name": "Test Staff",
            "role": "ADMIN",
        },
    )
    assert res.status_code == 400


@pytest.mark.asyncio
async def test_reg_auth_003(client: AsyncClient, db_session: AsyncSession):
    req_data = {
        "email": "duplicate@test.com",
        "password": "Password123!",
        "full_name": "Test Duplicate",
        "role": "CANDIDATE",
    }
    res1 = await client.post("/v1/auth/register", json=req_data)
    assert res1.status_code == 201
    res2 = await client.post("/v1/auth/register", json=req_data)
    assert res2.status_code == 201
    assert res1.content == res2.content


@pytest.mark.asyncio
async def test_reg_auth_004(client: AsyncClient, db_session: AsyncSession):
    email = "cand_verify@test.com"
    code = "secret_code"
    u = User(
        email=email,
        full_name="cand",
        password_hash="dummy",
        account_status=AccountStatus.PENDING_VERIFICATION.value,
    )
    db_session.add(u)
    await db_session.flush()
    db_session.add(UserScope(user_id=u.id, role_name="CANDIDATE"))
    ev = EmailVerification(
        user_id=u.id,
        code_hash=hash_password(code),
        purpose=VerificationPurpose.VERIFY_EMAIL.value,
        expires_at=datetime.now(UTC) + timedelta(days=1),
    )
    db_session.add(ev)
    await db_session.commit()

    res = await client.post("/v1/auth/verify-email", json={"email": email, "code": code})
    assert res.status_code == 200
    user = (await db_session.execute(select(User).where(User.email == email))).scalar_one()
    assert user.account_status == "ACTIVE"


@pytest.mark.asyncio
async def test_reg_auth_005(client: AsyncClient, db_session: AsyncSession):
    email = "emp_verify@test.com"
    code = "secret_code"
    u = User(
        email=email,
        full_name="emp",
        password_hash="dummy",
        account_status=AccountStatus.PENDING_VERIFICATION.value,
    )
    db_session.add(u)
    await db_session.flush()
    db_session.add(UserScope(user_id=u.id, role_name="EMPLOYER"))
    ev = EmailVerification(
        user_id=u.id,
        code_hash=hash_password(code),
        purpose=VerificationPurpose.VERIFY_EMAIL.value,
        expires_at=datetime.now(UTC) + timedelta(days=1),
    )
    db_session.add(ev)
    await db_session.commit()

    res = await client.post("/v1/auth/verify-email", json={"email": email, "code": code})
    assert res.status_code == 200
    user = (await db_session.execute(select(User).where(User.email == email))).scalar_one()
    assert user.account_status == "PENDING_APPROVAL"


@pytest.mark.asyncio
async def test_reg_auth_006(client: AsyncClient, db_session: AsyncSession):
    email = "exp_verify@test.com"
    code = "secret_code"
    u = User(
        email=email,
        full_name="exp",
        password_hash="dummy",
        account_status=AccountStatus.PENDING_VERIFICATION.value,
    )
    db_session.add(u)
    await db_session.flush()
    ev = EmailVerification(
        user_id=u.id,
        code_hash=hash_password(code),
        purpose=VerificationPurpose.VERIFY_EMAIL.value,
        expires_at=datetime.now(UTC) - timedelta(days=1),
    )
    db_session.add(ev)
    await db_session.commit()

    res = await client.post("/v1/auth/verify-email", json={"email": email, "code": code})
    assert res.status_code == 400
    assert "Code expired" in res.json()["detail"]


@pytest.mark.asyncio
async def test_reg_auth_007(client: AsyncClient, db_session: AsyncSession):
    email = "max_verify@test.com"
    code = "secret_code"
    u = User(
        email=email,
        full_name="max",
        password_hash="dummy",
        account_status=AccountStatus.PENDING_VERIFICATION.value,
    )
    db_session.add(u)
    await db_session.flush()
    ev = EmailVerification(
        user_id=u.id,
        code_hash=hash_password(code),
        purpose=VerificationPurpose.VERIFY_EMAIL.value,
        expires_at=datetime.now(UTC) + timedelta(days=1),
        attempts=5,
    )
    db_session.add(ev)
    await db_session.commit()

    res = await client.post("/v1/auth/verify-email", json={"email": email, "code": code})
    assert res.status_code == 400
    assert "Too many attempts" in res.json()["detail"]


@pytest.mark.asyncio
async def test_reg_auth_008(client: AsyncClient, db_session: AsyncSession):
    email = "login@test.com"
    password = "Password123!"
    u = User(
        email=email,
        full_name="login",
        password_hash=hash_password(password),
        account_status=AccountStatus.ACTIVE.value,
    )
    db_session.add(u)
    await db_session.commit()

    res = await client.post("/v1/auth/login", json={"email": email, "password": password})
    assert res.status_code == 200
    assert "access_token" in res.json()["data"]
    cookies = res.headers.get_list("set-cookie")
    assert any(
        "refresh_token=" in c and "httponly" in c.lower() and "samesite=strict" in c.lower()
        for c in cookies
    )


@pytest.mark.asyncio
async def test_reg_auth_009(client: AsyncClient, db_session: AsyncSession):
    password = "Password123!"
    for status in [
        AccountStatus.PENDING_VERIFICATION.value,
        AccountStatus.PENDING_APPROVAL.value,
        AccountStatus.SUSPENDED.value,
        AccountStatus.REJECTED.value,
    ]:
        email = f"state_{status.lower()}@test.com"
        u = User(
            email=email,
            full_name="test",
            password_hash=hash_password(password),
            account_status=status,
        )
        db_session.add(u)
        await db_session.commit()

        res = await client.post("/v1/auth/login", json={"email": email, "password": password})
        assert res.status_code == 403
        assert res.json()["detail"] == f"ACCOUNT_{status}"


@pytest.mark.asyncio
async def test_reg_auth_010(client: AsyncClient, db_session: AsyncSession):
    res1 = await client.post(
        "/v1/auth/login", json={"email": "unknown@test.com", "password": "wrong"}
    )
    assert res1.status_code == 401
    assert res1.json()["detail"] == "Invalid credentials"

    email = "wrongpwd@test.com"
    u = User(
        email=email,
        full_name="wrong",
        password_hash=hash_password("correct"),
        account_status=AccountStatus.ACTIVE.value,
    )
    db_session.add(u)
    await db_session.commit()

    res2 = await client.post("/v1/auth/login", json={"email": email, "password": "wrong"})
    assert res2.status_code == 401
    assert res2.json()["detail"] == "Invalid credentials"


@pytest.mark.asyncio
async def test_reg_auth_011(client: AsyncClient, db_session: AsyncSession):
    email = "staff_login@test.com"
    u = User(
        email=email,
        full_name="staff",
        password_hash=None,
        account_status=AccountStatus.ACTIVE.value,
    )
    db_session.add(u)
    await db_session.commit()

    res = await client.post("/v1/auth/login", json={"email": email, "password": "any"})
    assert res.status_code == 403
    assert res.json()["detail"] == "USE_SSO"


@pytest.mark.asyncio
async def test_reg_auth_012(client: AsyncClient, db_session: AsyncSession):
    email = "refresh@test.com"
    password = "Password123!"
    u = User(
        email=email,
        full_name="refresh",
        password_hash=hash_password(password),
        account_status=AccountStatus.ACTIVE.value,
    )
    db_session.add(u)
    await db_session.commit()

    res = await client.post("/v1/auth/login", json={"email": email, "password": password})
    assert res.status_code == 200
    rt1 = res.cookies.get("refresh_token")

    res2 = await client.post("/v1/auth/refresh", cookies={"refresh_token": rt1})
    assert res2.status_code == 200
    rt2 = res2.cookies.get("refresh_token")
    assert rt1 != rt2

    res3 = await client.post("/v1/auth/refresh", cookies={"refresh_token": rt1})
    assert res3.status_code == 401


@pytest.mark.asyncio
async def test_reg_auth_013(client: AsyncClient, db_session: AsyncSession):
    email = "reuse@test.com"
    password = "Password123!"
    u = User(
        email=email,
        full_name="reuse",
        password_hash=hash_password(password),
        account_status=AccountStatus.ACTIVE.value,
    )
    db_session.add(u)
    await db_session.commit()

    res = await client.post("/v1/auth/login", json={"email": email, "password": password})
    rt1 = res.cookies.get("refresh_token")

    res2 = await client.post("/v1/auth/refresh", cookies={"refresh_token": rt1})
    rt2 = res2.cookies.get("refresh_token")

    res3 = await client.post("/v1/auth/refresh", cookies={"refresh_token": rt1})
    assert res3.status_code == 401

    res4 = await client.post("/v1/auth/refresh", cookies={"refresh_token": rt2})
    assert res4.status_code == 401


@pytest.mark.asyncio
async def test_reg_auth_014(client: AsyncClient, db_session: AsyncSession):
    res = await client.post("/v1/auth/refresh", json={"refresh_token": "some_token"})
    assert res.status_code == 401


@pytest.mark.asyncio
async def test_reg_auth_015(client: AsyncClient, db_session: AsyncSession):
    email = "logout@test.com"
    password = "Password123!"
    u = User(
        email=email,
        full_name="logout",
        password_hash=hash_password(password),
        account_status=AccountStatus.ACTIVE.value,
    )
    db_session.add(u)
    await db_session.commit()

    res = await client.post("/v1/auth/login", json={"email": email, "password": password})
    rt1 = res.cookies.get("refresh_token")

    res_logout = await client.post("/v1/auth/logout", cookies={"refresh_token": rt1})
    assert res_logout.status_code == 204

    res_logout2 = await client.post("/v1/auth/logout", cookies={"refresh_token": rt1})
    assert res_logout2.status_code == 204


@pytest.mark.asyncio
async def test_reg_auth_016(client: AsyncClient, db_session: AsyncSession):
    email = "reset_revokes@test.com"
    password = "Password123!"
    u = User(
        email=email,
        full_name="reset",
        password_hash=hash_password(password),
        account_status=AccountStatus.ACTIVE.value,
    )
    db_session.add(u)
    await db_session.flush()

    res_l1 = await client.post("/v1/auth/login", json={"email": email, "password": password})
    rt1 = res_l1.cookies.get("refresh_token")
    res_l2 = await client.post("/v1/auth/login", json={"email": email, "password": password})
    rt2 = res_l2.cookies.get("refresh_token")

    code = "resetcode"
    ev = EmailVerification(
        user_id=u.id,
        code_hash=hash_password(code),
        purpose=VerificationPurpose.RESET_PASSWORD.value,
        expires_at=datetime.now(UTC) + timedelta(days=1),
    )
    db_session.add(ev)
    await db_session.commit()

    res_reset = await client.post(
        "/v1/auth/password/reset",
        json={"email": email, "code": code, "new_password": "NewPassword123!"},
    )
    assert res_reset.status_code == 200

    res_r1 = await client.post("/v1/auth/refresh", cookies={"refresh_token": rt1})
    assert res_r1.status_code == 401
    res_r2 = await client.post("/v1/auth/refresh", cookies={"refresh_token": rt2})
    assert res_r2.status_code == 401


@pytest.mark.asyncio
async def test_reg_auth_017(client: AsyncClient, db_session: AsyncSession, mint_token):
    email = "employer17@test.com"
    emp = User(
        email=email,
        full_name="emp17",
        password_hash="dummy",
        account_status=AccountStatus.PENDING_APPROVAL.value,
    )
    db_session.add(emp)
    await db_session.flush()
    db_session.add(UserScope(user_id=emp.id, role_name="EMPLOYER"))
    await db_session.commit()

    token_admin = mint_token(roles=["ADMIN"])
    res_good = await client.post(
        f"/v1/auth/admin/employers/{emp.id}/approve",
        headers={"Authorization": f"Bearer {token_admin}"},
    )
    assert res_good.status_code == 200

    updated_emp = (await db_session.execute(select(User).where(User.id == emp.id))).scalar_one()
    assert updated_emp.account_status == AccountStatus.ACTIVE.value

    audit = (
        (await db_session.execute(select(AuditLog).where(AuditLog.resource_id == str(emp.id))))
        .scalars()
        .first()
    )
    assert audit is not None
    assert audit.action == "APPROVE_EMPLOYER"


@pytest.mark.asyncio
async def test_reg_auth_018(client: AsyncClient, db_session: AsyncSession):
    email = "employer18@test.com"
    emp = User(
        email=email,
        full_name="emp18",
        password_hash="dummy",
        account_status=AccountStatus.PENDING_APPROVAL.value,
    )
    db_session.add(emp)
    await db_session.flush()
    db_session.add(UserScope(user_id=emp.id, role_name="EMPLOYER"))
    await db_session.commit()

    token_emp = create_access_token(emp, ["EMPLOYER"])
    res_bad = await client.post(
        f"/v1/auth/admin/employers/{emp.id}/approve",
        headers={"Authorization": f"Bearer {token_emp}"},
    )
    assert res_bad.status_code == 403


@pytest.mark.asyncio
async def test_reg_auth_019(client: AsyncClient, db_session: AsyncSession):
    email = "test19@test.com"
    password = "Password123!"
    u = User(
        email=email,
        full_name="test19",
        password_hash=hash_password(password),
        account_status=AccountStatus.ACTIVE.value,
    )
    db_session.add(u)
    await db_session.flush()
    db_session.add(UserScope(user_id=u.id, role_name="CANDIDATE"))
    await db_session.commit()

    res = await client.post("/v1/auth/login", json={"email": email, "password": password})
    token = res.json()["data"]["access_token"]

    from app.core.security import resolve_security_context

    ctx = resolve_security_context(token)
    assert ctx.issuer == "local"
    assert "CANDIDATE" in ctx.roles
    assert not any(
        r in ctx.roles
        for r in ["POLICY_MAKER", "DISTRICT_OFFICER", "ITI_PRINCIPAL", "SSC_REVIEWER", "ADMIN"]
    )


@pytest.mark.asyncio
@patch("app.services.auth_service.verify_password", wraps=verify_password)
async def test_reg_auth_020(mock_verify, client: AsyncClient, db_session: AsyncSession):
    res = await client.post(
        "/v1/auth/login", json={"email": "notfound@test.com", "password": "wrong"}
    )
    assert res.status_code == 401
    mock_verify.assert_called_with("wrong", DUMMY_HASH)
