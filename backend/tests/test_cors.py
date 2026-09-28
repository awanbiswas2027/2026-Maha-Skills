import importlib

import pytest
from httpx import AsyncClient

from app.core.config import settings


@pytest.mark.asyncio
async def test_reg_cors_001_allowed_origin_echoed(client: AsyncClient) -> None:
    """REG-CORS-001: request with Origin: http://localhost:3000 gets origin echoed back."""
    response = await client.get("/health", headers={"Origin": "http://localhost:3000"})
    assert response.status_code == 200
    assert response.headers.get("access-control-allow-origin") == "http://localhost:3000"


@pytest.mark.asyncio
async def test_reg_cors_002_disallowed_origin_no_allow_header(client: AsyncClient) -> None:
    """REG-CORS-002: request from origin not in allow-list gets no allow-origin header."""
    response = await client.get("/health", headers={"Origin": "http://untrusted-site.com"})
    assert response.status_code == 200
    assert "access-control-allow-origin" not in response.headers


@pytest.mark.asyncio
async def test_reg_cors_003_custom_cors_origins_from_settings(
    monkeypatch: pytest.MonkeyPatch,
) -> None:
    """REG-CORS-003: app built with custom CORS_ORIGINS echoes custom origin, proving settings read."""
    custom_origin = "https://custom.mahaskills.gov.in"
    monkeypatch.setattr(settings, "CORS_ORIGINS", [custom_origin])

    import app.main

    reloaded_module = importlib.reload(app.main)
    try:
        async with AsyncClient(app=reloaded_module.app, base_url="http://test") as custom_client:
            # Custom origin is accepted
            res = await custom_client.get("/health", headers={"Origin": custom_origin})
            assert res.status_code == 200
            assert res.headers.get("access-control-allow-origin") == custom_origin

            # Default origin is not accepted
            res_default = await custom_client.get(
                "/health", headers={"Origin": "http://localhost:3000"}
            )
            assert "access-control-allow-origin" not in res_default.headers
    finally:
        monkeypatch.undo()
        importlib.reload(app.main)


@pytest.mark.asyncio
async def test_reg_cors_004_preflight_options_narrowed_methods(client: AsyncClient) -> None:
    """REG-CORS-004: preflight OPTIONS returns narrowed method list and does not advertise *."""
    response = await client.options(
        "/health",
        headers={
            "Origin": "http://localhost:3000",
            "Access-Control-Request-Method": "POST",
            "Access-Control-Request-Headers": "Authorization, Content-Type",
        },
    )
    assert response.status_code == 200
    allow_methods = response.headers.get("access-control-allow-methods", "")
    assert "*" not in allow_methods
    for method in ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"]:
        assert method in allow_methods

    allow_headers = response.headers.get("access-control-allow-headers", "")
    assert "*" not in allow_headers
    for header in ["Authorization", "Content-Type"]:
        assert header.lower() in allow_headers.lower()


@pytest.mark.asyncio
async def test_reg_cors_005_allow_credentials_is_true(client: AsyncClient) -> None:
    """REG-CORS-005: access-control-allow-credentials is true."""
    response = await client.get("/health", headers={"Origin": "http://localhost:3000"})
    assert response.status_code == 200
    assert response.headers.get("access-control-allow-credentials") == "true"

    preflight = await client.options(
        "/health",
        headers={
            "Origin": "http://localhost:3000",
            "Access-Control-Request-Method": "GET",
        },
    )
    assert preflight.status_code == 200
    assert preflight.headers.get("access-control-allow-credentials") == "true"
