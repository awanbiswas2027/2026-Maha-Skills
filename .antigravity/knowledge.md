# Antigravity Knowledge Base — MahaSkills

Durable, reusable facts for agents. Append resolved gotchas here; keep entries short. No secrets.

## Architecture facts

- Three-tier, deliberately simple for government procurement/audit. Open-source stack only:
  React, FastAPI, PostgreSQL 16, Redis, Airflow, Elasticsearch, Keycloak.
- Auth is Keycloak OIDC + PKCE. Frontend never holds a client secret. Roles: Policy Maker (DSEEI),
  District Officer, ITI Principal, Employer, Candidate, Admin/Data Steward.
- Scope model is geographic: state-wide / district / institute. `TenantScopeGuard` enforces it.
- Gap Score = (Demand Count × Trend Weight) − (Trained Seats × Placement Rate), normalized 0–100 per
  district. Weekly Celery refresh. Oversupply flag: placement rate < 25% AND demand < 20th pct for 2+ quarters.
- Recommendation trigger: gap score > 60 sustained 8+ weeks with no course covering the skill.
- Taxonomy seed: ~2,200 NSQF/SSC job roles, 33–38 sectors. See `scripts/seed_taxonomy.py`.

## Repo conventions

- Frontend feature-sliced: `frontend/src/features/<domain>/` with a barrel `index.ts`.
- Backend layering: `api/v1/endpoints/<domain>.py` (thin) → `services/<domain>_service.py` (logic)
  → `models/<domain>.py` (SQLAlchemy). Schemas in `schemas/`.
- API envelope + error taxonomy: `docs/03-api/API_SPECIFICATION.md`, `docs/03-api/ERROR_CODES.md`
  (prefixes `AUTH_`, `PLA_`, `REC_`, `GAP_`, `TAX_`, ...).
- Query keys centralised in `frontend/src/lib/query-keys.ts`; API client in `frontend/src/lib/api.ts`.
- Locale files: `frontend/public/locales/{mr,hi,en}/` — mr is primary.

## Environment

- Local: `docker compose up --build -d`. Ports: fe 3000, api 8000 (`/docs` Swagger), pg 5432, redis 6379.
- New env vars: add to `.env.example` (committed) only; real values in `.env` (git-ignored).
- DPDP pseudonymization pepper: `DPDP_TENANT_SALT` env var, HMAC-SHA256.

## Resolved gotchas

_(none yet — add as discovered)_
