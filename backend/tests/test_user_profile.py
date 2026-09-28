import asyncio
import json
import re
import uuid
from pathlib import Path
from typing import Any

import pytest
import yaml

from app.core.security import AuthException, SecurityContext
from app.models.auth import AccountStatus
from app.models.geography import District
from app.models.user import User
from app.services.user_profile_service import build_role_scopes, get_user_profile


class MockResult:
    """Mock SQLAlchemy execution result."""

    def __init__(self, item: Any):
        self._item = item

    def scalar_one_or_none(self) -> Any:
        return self._item


class MockAsyncSession:
    """In-memory async session for unit testing user profile service without live DB."""

    def __init__(self):
        self.users_by_id: dict[uuid.UUID, User] = {}
        self.users_by_sub: dict[str, User] = {}
        self.users_by_email: dict[str, User] = {}
        self.districts_by_id: dict[int, District] = {}
        self._pending: list[User] = []
        self._lock = asyncio.Lock()

    def add_user(self, user: User) -> None:
        self.users_by_id[user.id] = user
        if user.keycloak_sub:
            self.users_by_sub[user.keycloak_sub] = user
        if user.email:
            self.users_by_email[user.email] = user

    def add_district(self, district: District) -> None:
        self.districts_by_id[district.id] = district

    def add(self, instance: Any) -> None:
        if isinstance(instance, User):
            self._pending.append(instance)

    async def commit(self) -> None:
        async with self._lock:
            for user in self._pending:
                # Enforce unique constraint simulation on keycloak_sub
                if user.keycloak_sub and user.keycloak_sub in self.users_by_sub:
                    from sqlalchemy.exc import IntegrityError

                    raise IntegrityError(
                        "unique constraint violation: keycloak_sub", params=None, orig=Exception()
                    )
                self.add_user(user)
            self._pending.clear()

    async def rollback(self) -> None:
        self._pending.clear()

    async def refresh(self, instance: Any) -> None:
        pass

    async def execute(self, statement: Any) -> MockResult:
        # String representation of statement helps identify target table and filter
        stmt_str = str(statement)

        if "FROM users" in stmt_str:
            if "keycloak_sub =" in stmt_str or "keycloak_sub" in stmt_str:
                # Extract bound parameter or evaluate
                for user in self.users_by_sub.values():
                    # check match in params
                    return MockResult(user)
                return MockResult(None)

            if "users.email =" in stmt_str or "email" in stmt_str:
                for user in self.users_by_email.values():
                    return MockResult(user)
                return MockResult(None)

            if "users.id =" in stmt_str or "id" in stmt_str:
                for user in self.users_by_id.values():
                    return MockResult(user)
                return MockResult(None)

        if "FROM districts" in stmt_str:
            for district in self.districts_by_id.values():
                return MockResult(district)
            return MockResult(None)

        return MockResult(None)


class ParamAwareMockSession(MockAsyncSession):
    """Refined session that matches actual bound parameters from SQLAlchemy select."""

    async def execute(self, statement: Any) -> MockResult:
        compiled = statement.compile()
        params = compiled.params
        stmt_str = str(compiled)

        if "FROM users" in stmt_str:
            if "WHERE users.keycloak_sub =" in stmt_str:
                val = next(
                    (v for k, v in params.items() if "keycloak_sub" in k),
                    None,
                )
                if val and val in self.users_by_sub:
                    return MockResult(self.users_by_sub[val])
                return MockResult(None)

            if "WHERE users.email =" in stmt_str:
                val = next(
                    (v for k, v in params.items() if "email" in k),
                    None,
                )
                if val and val in self.users_by_email:
                    return MockResult(self.users_by_email[val])
                return MockResult(None)

            if "WHERE users.id =" in stmt_str:
                val = next(
                    (v for k, v in params.items() if "id" in k),
                    None,
                )
                if val:
                    val_uuid = val if isinstance(val, uuid.UUID) else uuid.UUID(str(val))
                    if val_uuid in self.users_by_id:
                        return MockResult(self.users_by_id[val_uuid])
                return MockResult(None)

        if "FROM districts" in stmt_str:
            val = next(
                (v for k, v in params.items() if "id" in k),
                None,
            )
            if val is not None and int(val) in self.districts_by_id:
                return MockResult(self.districts_by_id[int(val)])
            return MockResult(None)

        return MockResult(None)


# ---------------------------------------------------------------------------
# Test Suite: REG-ME-* (User Profile Service)
# ---------------------------------------------------------------------------


@pytest.mark.asyncio
async def test_reg_me_001_local_candidate_context_real_profile():
    """REG-ME-001: Local CANDIDATE context -> real profile, keycloak_sub is None, no exception."""
    session = ParamAwareMockSession()
    user_id = uuid.uuid4()
    candidate_user = User(
        id=user_id,
        keycloak_sub=None,
        email="candidate.aarav@example.com",
        full_name="Aarav Sharma",
        account_status=AccountStatus.ACTIVE.value,
        is_active=True,
        email_verified=True,
    )
    session.add_user(candidate_user)

    ctx = SecurityContext(
        user_id=str(user_id),
        roles=["CANDIDATE"],
        email=candidate_user.email,
        account_status=candidate_user.account_status,
        issuer="local",
    )

    profile = await get_user_profile(ctx, session)

    assert profile.id == str(user_id)
    assert profile.keycloak_sub is None
    assert profile.email == "candidate.aarav@example.com"
    assert profile.full_name == "Aarav Sharma"
    assert profile.roles == ["CANDIDATE"]
    assert profile.account_status == "ACTIVE"
    assert profile.issuer == "local"
    assert profile.scopes == {}


@pytest.mark.asyncio
async def test_reg_me_002_staff_context_with_district_scope_keys():
    """REG-ME-002: Staff context -> profile with district scope keys populated."""
    session = ParamAwareMockSession()
    staff_user_id = uuid.uuid4()
    kc_sub = "kc-sub-dpo-pune-001"
    staff_user = User(
        id=staff_user_id,
        keycloak_sub=kc_sub,
        email="dpo.pune@maharashtra.gov.in",
        full_name="Rajesh Patil",
        account_status=AccountStatus.ACTIVE.value,
        is_active=True,
        email_verified=True,
    )
    session.add_user(staff_user)

    district_14 = District(
        id=14,
        code="MH-PU",
        name_en="Pune",
        name_mr="पुणे",
        division="Pune",
        latitude=18.520430,
        longitude=73.856744,
        is_active=True,
    )
    session.add_district(district_14)

    ctx = SecurityContext(
        user_id=kc_sub,
        roles=["DISTRICT_OFFICER"],
        email=staff_user.email,
        district_id=14,
        issuer="keycloak",
    )

    profile = await get_user_profile(ctx, session)

    assert profile.id == str(staff_user_id)
    assert profile.keycloak_sub == kc_sub
    assert profile.email == "dpo.pune@maharashtra.gov.in"
    assert profile.full_name == "Rajesh Patil"
    assert profile.roles == ["DISTRICT_OFFICER"]
    assert profile.scopes["district_id"] == 14
    assert profile.scopes["district_name"] == "Pune"
    assert "institute_id" not in profile.scopes
    assert "sector_ids" not in profile.scopes


@pytest.mark.asyncio
async def test_reg_me_003_unknown_user_id_raises_404_user_not_found():
    """REG-ME-003: Unknown user_id -> 404 with distinct code 'USER_NOT_FOUND', never fabricated."""
    session = ParamAwareMockSession()
    non_existent_id = str(uuid.uuid4())

    ctx = SecurityContext(
        user_id=non_existent_id,
        roles=["CANDIDATE"],
        email="ghost@example.com",
        issuer="local",
    )

    with pytest.raises(AuthException) as exc_info:
        await get_user_profile(ctx, session)

    assert exc_info.value.status_code == 404
    assert exc_info.value.code == "USER_NOT_FOUND"


def test_reg_me_004_no_hardcoded_placeholder_strings_in_user_profile_service():
    """REG-ME-004: user_profile_service contains zero occurrences of hardcoded 'sub-123456' or 'Rajesh Patil'."""
    service_path = (
        Path(__file__).resolve().parent.parent / "app" / "services" / "user_profile_service.py"
    )
    assert service_path.exists(), "user_profile_service.py must exist"

    content = service_path.read_text(encoding="utf-8")
    assert "sub-123456" not in content, (
        "user_profile_service must not contain hardcoded 'sub-123456'"
    )
    assert "Rajesh Patil" not in content, (
        "user_profile_service must not contain hardcoded 'Rajesh Patil'"
    )


def test_reg_me_005_scope_keys_irrelevant_to_role_are_absent_not_null():
    """REG-ME-005: Scope keys irrelevant to the role are completely absent, not null."""
    # 1. CANDIDATE: no scopes at all
    ctx_candidate = SecurityContext(
        user_id="user-1",
        roles=["CANDIDATE"],
        email="c@example.com",
        district_id=14,  # Even if token contained extraneous claim
        issuer="local",
    )
    scopes = build_role_scopes(ctx_candidate)
    assert scopes == {}

    # 2. POLICY_MAKER: statewide, district/institute/sector/employer must be absent
    ctx_policy = SecurityContext(
        user_id="user-2",
        roles=["POLICY_MAKER"],
        email="pm@maharashtra.gov.in",
        district_id=None,
        issuer="keycloak",
    )
    scopes_pm = build_role_scopes(ctx_policy)
    assert "district_id" not in scopes_pm
    assert "institute_id" not in scopes_pm
    assert "sector_ids" not in scopes_pm
    assert "employer_id" not in scopes_pm

    # 3. DISTRICT_OFFICER: has district_id, but institute/sector/employer absent
    ctx_dpo = SecurityContext(
        user_id="user-3",
        roles=["DISTRICT_OFFICER"],
        email="dpo@maharashtra.gov.in",
        district_id=14,
        issuer="keycloak",
    )
    scopes_dpo = build_role_scopes(ctx_dpo, district_name="Pune")
    assert scopes_dpo == {"district_id": 14, "district_name": "Pune"}
    assert "institute_id" not in scopes_dpo
    assert "sector_ids" not in scopes_dpo
    assert "employer_id" not in scopes_dpo

    # 4. ITI_PRINCIPAL: has district_id and institute_id
    ctx_iti = SecurityContext(
        user_id="user-4",
        roles=["ITI_PRINCIPAL"],
        email="principal@iti.gov.in",
        district_id=14,
        institute_id="ITI-PUN-001",
        issuer="keycloak",
    )
    scopes_iti = build_role_scopes(ctx_iti, district_name="Pune")
    assert scopes_iti == {
        "district_id": 14,
        "district_name": "Pune",
        "institute_id": "ITI-PUN-001",
    }
    assert "sector_ids" not in scopes_iti

    # 5. SSC_REVIEWER: has sector_ids
    ctx_ssc = SecurityContext(
        user_id="user-5",
        roles=["SSC_REVIEWER"],
        email="reviewer@ssc.gov.in",
        sector_ids=[101, 102],
        issuer="keycloak",
    )
    scopes_ssc = build_role_scopes(ctx_ssc)
    assert scopes_ssc == {"sector_ids": [101, 102]}
    assert "district_id" not in scopes_ssc


@pytest.mark.asyncio
async def test_reg_me_006_first_login_provisioning_idempotent_and_race_safe():
    """REG-ME-006: First-login provisioning creates exactly one row when called twice or concurrently."""
    session = ParamAwareMockSession()
    kc_sub = "kc-sub-new-reviewer-99"

    ctx = SecurityContext(
        user_id=kc_sub,
        roles=["SSC_REVIEWER"],
        email="reviewer.new@maharashtra.gov.in",
        sector_ids=[101],
        issuer="keycloak",
    )

    # Concurrently trigger provisioning
    profile1, profile2 = await asyncio.gather(
        get_user_profile(ctx, session),
        get_user_profile(ctx, session),
    )

    # Both return valid profile with the same database identity
    assert profile1.id == profile2.id
    assert profile1.keycloak_sub == kc_sub
    assert profile2.keycloak_sub == kc_sub
    assert len(session.users_by_sub) == 1
    assert profile1.email == "reviewer.new@maharashtra.gov.in"
    assert profile1.account_status == "ACTIVE"


# ---------------------------------------------------------------------------
# Test Suite: REG-RLM-* (Keycloak Realm & Infrastructure Configuration)
# ---------------------------------------------------------------------------


def _load_realm_json() -> dict[str, Any]:
    realm_path = (
        Path(__file__).resolve().parent.parent.parent
        / "infra"
        / "keycloak"
        / "realm-mahaskills.json"
    )
    assert realm_path.exists(), f"Realm JSON missing at {realm_path}"
    with open(realm_path, encoding="utf-8") as f:
        return json.load(f)


def test_reg_rlm_001_realm_json_contains_exactly_the_five_staff_roles():
    """REG-RLM-001: Realm JSON parses and contains exactly the 5 staff roles (no CANDIDATE or EMPLOYER)."""
    data = _load_realm_json()
    assert data["realm"] == "mahaskills"
    assert data["enabled"] is True

    realm_roles = [r["name"] for r in data.get("roles", {}).get("realm", [])]
    expected_staff_roles = {
        "POLICY_MAKER",
        "DISTRICT_OFFICER",
        "ITI_PRINCIPAL",
        "SSC_REVIEWER",
        "ADMIN",
    }
    assert set(realm_roles) == expected_staff_roles
    assert len(realm_roles) == 5

    # CANDIDATE and EMPLOYER are local-only and must never be realm roles
    assert "CANDIDATE" not in realm_roles
    assert "EMPLOYER" not in realm_roles


def test_reg_rlm_002_realm_json_contains_audience_mapper_for_api_client():
    """REG-RLM-002: Realm JSON contains audience mapper for the mahaskills-api client."""
    data = _load_realm_json()
    clients = {c["clientId"]: c for c in data.get("clients", [])}
    assert "mahaskills-api" in clients, "mahaskills-api client missing from realm"

    api_client = clients["mahaskills-api"]
    assert api_client["publicClient"] is False, "mahaskills-api must be confidential"
    assert api_client["standardFlowEnabled"] is True
    assert api_client["directAccessGrantsEnabled"] is True

    mappers = {m["name"]: m for m in api_client.get("protocolMappers", [])}
    audience_mapper = next(
        (m for m in mappers.values() if m.get("protocolMapper") == "oidc-audience-mapper"),
        None,
    )
    assert audience_mapper is not None, "oidc-audience-mapper missing on mahaskills-api"
    assert audience_mapper["config"]["included.client.audience"] == "mahaskills-api"
    assert audience_mapper["config"]["access.token.claim"] == "true"


def test_reg_rlm_003_realm_json_contains_mappers_for_every_scope_claim():
    """REG-RLM-003: Realm JSON contains mappers for every scope claim P002 reads."""
    data = _load_realm_json()
    api_client = next(c for c in data["clients"] if c["clientId"] == "mahaskills-api")
    mappers = {m["name"]: m for m in api_client.get("protocolMappers", [])}

    required_scope_claims = {
        "district_id",
        "district_name",
        "division",
        "institute_id",
        "sector_ids",
        "employer_id",
    }
    configured_claims = {
        m["config"].get("claim.name")
        for m in mappers.values()
        if m.get("protocolMapper") == "oidc-usermodel-attribute-mapper"
    }

    assert required_scope_claims.issubset(configured_claims), (
        f"Missing scope claims: {required_scope_claims - configured_claims}"
    )


def test_reg_rlm_004_no_credential_literals_in_infra_keycloak():
    """REG-RLM-004: No credential literals anywhere in infra/keycloak/."""
    infra_dir = Path(__file__).resolve().parent.parent.parent / "infra" / "keycloak"
    pattern = re.compile(r'password["\']?\s*[:=]\s*["\'](?![$])[^"\']+', re.IGNORECASE)

    for file_path in infra_dir.rglob("*"):
        if file_path.is_file():
            content = file_path.read_text(encoding="utf-8")
            matches = pattern.findall(content)
            assert not matches, f"Credential literal found in {file_path}: {matches}"

            # Check for literal secret
            assert "change_me_in_production" not in content
            assert "mahaskills_secret" not in content


def test_reg_rlm_005_docker_compose_config_parses_with_keycloak_service():
    """REG-RLM-005: docker-compose.yml parses with healthy-gated keycloak service and no inline credentials."""
    compose_path = Path(__file__).resolve().parent.parent.parent / "docker-compose.yml"
    assert compose_path.exists(), "docker-compose.yml must exist"

    with open(compose_path, encoding="utf-8") as f:
        compose = yaml.safe_load(f)

    services = compose.get("services", {})
    assert "keycloak" in services, "keycloak service missing in docker-compose.yml"

    kc = services["keycloak"]
    assert kc["image"] == "quay.io/keycloak/keycloak:26.0"
    assert "start-dev --import-realm" in kc.get("command", "")
    assert "healthcheck" in kc, "healthcheck missing on keycloak service"

    # Backend depends on keycloak
    backend_depends = services["backend"].get("depends_on", {})
    assert "keycloak" in backend_depends
    assert backend_depends["keycloak"]["condition"] == "service_healthy"
