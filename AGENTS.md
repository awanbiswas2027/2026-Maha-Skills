# AGENTS.md — MahaSkills

> Primary context file for autonomous coding agents (Google Antigravity, Claude Code, Cursor, etc.).
> **Chief Architect** authors specs; **Antigravity agents** implement them. This file is the contract.

---

## 1. What this repo is

MahaSkills — Labour-Market Intelligence & Curriculum Alignment Platform for the Government of
Maharashtra (DSEEI / MSInS). Problem Statement **26134**. A three-tier web platform that closes the
loop between live industry demand and vocational curriculum design across 36 districts and 417+ ITIs.

Canonical documentation lives in [`docs/`](docs/README.md) and is **authoritative** — when code and
docs disagree, treat it as a defect and raise it, do not silently pick one.

## 2. Monorepo layout

| Path | Stack | Role |
| --- | --- | --- |
| `frontend/` | React 18 + TS (strict) + Vite + Tailwind + shadcn/ui + TanStack Query | Role-based dashboards, i18n mr/hi/en |
| `backend/` | Python 3.11 + FastAPI + SQLAlchemy 2.0 async + Celery + Pydantic v2 | REST `/v1` API, gap-scoring & recommendation engines |
| `pipelines/` | Apache Airflow DAGs | Nightly scraping, weekly gap scoring, recommendation audit |
| `scripts/` | SQL + Python | DB init, taxonomy seed |
| `docs/` | Markdown (10 connected domains) | Canonical PRD, architecture, API, security, data, ops |
| `docs/11-agent-delivery/` | Markdown | **Architect → agent handoff specs, DoD, guardrails** |

## 3. Golden path commands

```bash
# Full stack
docker compose up --build -d          # postgres:5432 redis:6379 backend:8000 frontend:3000

# Backend (from backend/)
ruff check . && black --check .        # lint + format gate
pytest -q                             # test gate
uvicorn app.main:app --reload         # local API

# Frontend (from frontend/)
npm run lint && npm run typecheck     # eslint + tsc --noEmit
npm test                              # unit/contract tests
npm run build                         # must pass before "done"
npm run dev                           # vite dev server

# Contract validation (from repo root)
npx @stoplight/spectral-cli lint docs/03-api/openapi.yaml
```

If a command above does not yet exist in `package.json` / `pyproject.toml`, adding it is in scope for
Slice 0 work and must be flagged, not worked around.

## 4. Non-negotiable rules

1. **Contract-first.** `docs/03-api/openapi.yaml` is the source of truth. Backend routes and frontend
   `src/types/api.ts` are generated/validated against it. Change the spec in the same PR as the code.
2. **No `any` (TS) / no untyped defs (Python).** `strict` TS and 100% type-hinted Python signatures.
3. **No raw SQL string concatenation.** SQLAlchemy 2.0 ORM or parameterized Core only.
4. **No hard-coded user-visible strings.** Every string goes through `t('domain.key')`; add keys to all
   three locale files (`frontend/public/locales/{mr,hi,en}`).
5. **DPDP Act 2023.** Candidate PII is pseudonymized with HMAC-SHA256 (`DPDP_TENANT_SALT`) at ingest.
   Never log, return, or store raw candidate identifiers. See `docs/05-security/DATA_PRIVACY.md`.
6. **RBAC on every endpoint.** Enforce role + scope per `docs/05-security/RBAC_MATRIX.md`.
7. **Conventional Commits**, branch `feat/REQ-ID-short-title`. Reference the `REQ-xxx` / `TEST-xxx` id.
8. **Secrets never leave `.env`.** `.env` is git-ignored; use `.env.example` for new keys.
9. **Every slice is vertical:** DB migration → FastAPI service → OpenAPI sync → TS types → React →
   tests. A PR that touches only one tier of a feature is incomplete.

## 5. How work is assigned — the handoff protocol

The Chief Architect drops a spec in [`docs/11-agent-delivery/handoffs/`](docs/11-agent-delivery/)
using [`HANDOFF_SPEC_TEMPLATE.md`](docs/11-agent-delivery/HANDOFF_SPEC_TEMPLATE.md). Each spec is
self-contained and names: scope, the exact files to touch, the API delta, data-model delta, test
gates, and the Definition of Done.

An agent picking up a handoff MUST:

1. Read the handoff + every doc it links + this file.
2. Produce an **implementation plan artifact** and stop for architect review before writing code
   (Antigravity: the plan Artifact in Agent Manager; others: post the plan and wait).
3. Implement strictly within the declared scope. Anything out of scope → note it in the PR, do not do it.
4. Run **all** gates in §3 locally. Paste the output in the PR.
5. Attach verification artifacts (test output, `npm run build` log, screenshots / browser recording of
   the working UI, Spectral lint result).
6. Open a PR titled `feat(<domain>): <slice title> (REQ-xxx)` linking the handoff file.

See [`docs/11-agent-delivery/DEFINITION_OF_DONE.md`](docs/11-agent-delivery/DEFINITION_OF_DONE.md) and
[`GUARDRAILS.md`](docs/11-agent-delivery/GUARDRAILS.md).

## 6. Current build order

Vertical slices 0–11 in [`docs/07-development/IMPLEMENTATION_PLAN.md`](docs/07-development/IMPLEMENTATION_PLAN.md).
Do not start slice N+1 until slice N's test gate is green.
