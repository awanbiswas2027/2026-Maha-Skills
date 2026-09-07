# MahaSkills — Environment Configuration Matrix

**Platform:** MahaSkills · Government of Maharashtra (DSEEI / MSInS)  
**Problem Statement ID:** 26134  
**Version:** 1.0  
**Status:** Canonical Configuration Baseline  

---

## 1. Environment Variable Matrix

| Variable Name | Description | Development | Staging | Production | Secret? |
|:---|:---|:---|:---|:---|:---|
| `ENVIRONMENT` | Deployment environment tier | `development` | `staging` | `production` | No |
| `DATABASE_URL` | PostgreSQL asyncpg connection string | `postgresql+asyncpg://app:dev@localhost:5432/mahaskills` | Managed RDS endpoint | Managed Multi-AZ RDS | **Yes** |
| `DATABASE_POOL_SIZE` | SQLAlchemy connection pool size | `5` | `15` | `25` | No |
| `REDIS_URL` | Redis broker and cache endpoint | `redis://localhost:6379/0` | Managed ElastiCache | Multi-AZ ElastiCache | **Yes** |
| `KEYCLOAK_URL` | Base URL of Keycloak IAM server | `http://localhost:8080` | `https://staging-auth.mahaskills...` | `https://auth.mahaskills...` | No |
| `KEYCLOAK_REALM` | Target Keycloak realm name | `mahaskills-dev` | `mahaskills-staging` | `mahaskills` | No |
| `KEYCLOAK_CLIENT_ID`| OAuth2 Client ID for API Gateway | `mahaskills-api` | `mahaskills-api` | `mahaskills-api` | No |
| `KEYCLOAK_CLIENT_SECRET`| Client secret for token validation | Mock secret | Vault secret | Vault secret | **Yes** |
| `DPDP_TENANT_SALT` | Cryptographic HMAC salt for PII hashing | Dev static salt | KMS-managed salt | KMS HSM hardware key | **Yes** |
| `S3_BUCKET_PLACEMENTS`| S3 bucket for placement CSV storage | `mahaskills-dev-placements`| `mahaskills-staging-placements` | `mahaskills-prod-placements`| No |
| `S3_BUCKET_DOSSIERS` | S3 bucket for compiled evidence PDFs | `mahaskills-dev-dossiers` | `mahaskills-staging-dossiers` | `mahaskills-prod-dossiers` | No |
| `FEATURE_FORECASTING`| Feature flag for ML demand forecasting | `false` | `true` (QA testing) | `false` (until Phase 4) | No |
| `CORS_ORIGINS` | Permitted browser origins | `http://localhost:3000` | `https://staging.mahaskills...` | `https://mahaskills...` | No |
