from pydantic_settings import BaseSettings, SettingsConfigDict
from pydantic import Field

class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", extra="ignore")

    ENVIRONMENT: str = "development"
    PROJECT_NAME: str = "MahaSkills Backend API"
    API_V1_STR: str = "/v1"

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

    # DPDP 2023 Pepper
    DPDP_TENANT_SALT: str = "development_hmac_sha256_pepper_secret_key_32bytes!"

settings = Settings()
