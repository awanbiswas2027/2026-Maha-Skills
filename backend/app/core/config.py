import json
import logging
from typing import Any, Literal

from pydantic import Field, field_validator, model_validator
from pydantic_settings import BaseSettings, SettingsConfigDict

# Known compromised pepper committed to git history in earlier revisions.
# Rejected in non-development environments to prevent dictionary attacks over candidate IDs.
_COMPROMISED_SALT = "development_hmac_sha256_pepper_secret_key_32bytes!"

MIN_JWT_SECRET_BYTES = 32

logger = logging.getLogger(__name__)


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", extra="ignore")

    ENVIRONMENT: Literal["development", "staging", "production"] = "development"
    PROJECT_NAME: str = "MahaSkills Backend API"
    API_V1_STR: str = "/v1"

    # CORS
    CORS_ORIGINS: list[str] = ["http://localhost:3000", "http://localhost:5173"]

    # Database
    DATABASE_URL: str = Field(
        default="postgresql+asyncpg://mahaskills_user:mahaskills_secret@localhost:5432/mahaskills"
    )
    DATABASE_POOL_SIZE: int = 10
    DATABASE_MAX_OVERFLOW: int = 5

    # Redis & Celery
    REDIS_URL: str = "redis://localhost:6379/0"

    # Keycloak OIDC
    KEYCLOAK_URL: str = "http://localhost:8080"
    KEYCLOAK_REALM: str = "mahaskills"
    KEYCLOAK_CLIENT_ID: str = "mahaskills-api"
    KEYCLOAK_CLIENT_SECRET: str | None = None
    KEYCLOAK_AUDIENCE: str | None = None
    KEYCLOAK_JWKS_CACHE_SECONDS: int = 3600

    # Auth & JWT Settings
    AUTH_JWT_SECRET: str = ""
    AUTH_JWT_ISSUER: str = "mahaskills-api"
    AUTH_ACCESS_TOKEN_TTL_SECONDS: int = 900
    AUTH_REFRESH_TOKEN_TTL_SECONDS: int = 28800
    AUTH_VERIFICATION_CODE_TTL_SECONDS: int = 900
    AUTH_MAX_VERIFICATION_ATTEMPTS: int = 5

    # DPDP 2023 Pepper (Required, minimum 32 characters)
    DPDP_TENANT_SALT: str

    @field_validator("DPDP_TENANT_SALT")
    @classmethod
    def validate_dpdp_tenant_salt_length(cls, v: str) -> str:
        if len(v) < 32:
            raise ValueError("DPDP_TENANT_SALT must be at least 32 characters long")
        return v

    @field_validator("CORS_ORIGINS", mode="before")
    @classmethod
    def parse_cors_origins(cls, v: Any) -> list[str]:
        if isinstance(v, str):
            v = v.strip()
            if not v:
                return []
            if v.startswith("[") and v.endswith("]"):
                try:
                    parsed = json.loads(v)
                except (json.JSONDecodeError, TypeError, ValueError):
                    parsed = None
                if isinstance(parsed, list):
                    return [str(item).strip() for item in parsed if str(item).strip()]
            return [item.strip() for item in v.split(",") if item.strip()]
        if isinstance(v, list):
            return [str(item).strip() for item in v if str(item).strip()]
        return v

    @model_validator(mode="after")
    def validate_environment_constraints(self) -> "Settings":
        if self.ENVIRONMENT != "development":
            if self.DPDP_TENANT_SALT == _COMPROMISED_SALT:
                raise ValueError(
                    "DPDP_TENANT_SALT cannot use the known compromised salt outside of development"
                )
            if "*" in self.CORS_ORIGINS:
                raise ValueError(
                    "CORS_ORIGINS cannot contain '*' when ENVIRONMENT is not 'development'"
                )
            if not self.KEYCLOAK_URL.startswith("https://"):
                raise ValueError(
                    "KEYCLOAK_URL must use https:// when ENVIRONMENT is not 'development'"
                )
            if (
                not self.AUTH_JWT_SECRET
                or len(self.AUTH_JWT_SECRET.encode("utf-8")) < MIN_JWT_SECRET_BYTES
            ):
                raise ValueError(
                    "AUTH_JWT_SECRET must be at least 32 characters long when ENVIRONMENT is not 'development'"
                )
        else:
            if (
                not self.AUTH_JWT_SECRET
                or len(self.AUTH_JWT_SECRET.encode("utf-8")) < MIN_JWT_SECRET_BYTES
            ):
                logger.warning(
                    "local CANDIDATE/EMPLOYER sign-in is disabled until AUTH_JWT_SECRET is set"
                )
        return self

    @property
    def keycloak_issuer(self) -> str:
        return f"{self.KEYCLOAK_URL.rstrip('/')}/realms/{self.KEYCLOAK_REALM}"

    @property
    def keycloak_jwks_url(self) -> str:
        return f"{self.keycloak_issuer}/protocol/openid-connect/certs"

    @property
    def keycloak_audience(self) -> str:
        return self.KEYCLOAK_AUDIENCE or self.KEYCLOAK_CLIENT_ID

    @property
    def database_url_sync(self) -> str:
        if self.DATABASE_URL.startswith("postgresql+asyncpg://"):
            return self.DATABASE_URL.replace("postgresql+asyncpg://", "postgresql+psycopg2://", 1)
        return self.DATABASE_URL


settings = Settings()
