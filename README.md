# MahaSkills — Labour-Market Intelligence & Curriculum Alignment Platform

**Government of Maharashtra**  
Department of Skills, Employment, Entrepreneurship and Innovation (DSEEI) / Maharashtra State Innovation Society (MSInS)  
**Problem Statement ID:** 26134  

---

## 1. Project Overview

MahaSkills creates an empirical feedback loop between live industrial demand and vocational curriculum design across Maharashtra's 36 districts and 417+ ITIs. The platform automatically aggregates multi-source labour market signals, algorithmically identifies localized skill-demand deficits, generates actionable curriculum revision proposals with evidence dossiers, and empowers prospective candidates with verified placement statistics.

* **Documentation Index:** [`docs/README.md`](docs/README.md)
* **Product Requirements:** [`docs/01-product/PRD.md`](docs/01-product/PRD.md)
* **Traceability Matrix:** [`docs/01-product/REQUIREMENTS_TRACEABILITY.md`](docs/01-product/REQUIREMENTS_TRACEABILITY.md)
* **API Specification:** [`docs/03-api/API_SPECIFICATION.md`](docs/03-api/API_SPECIFICATION.md) & [`docs/03-api/openapi.yaml`](docs/03-api/openapi.yaml)
* **Database Schema:** [`docs/02-architecture/DATABASE_SCHEMA.md`](docs/02-architecture/DATABASE_SCHEMA.md)

---

## 2. Monorepo Structure

```text
.
├── docs/               # Canonical 10-domain connected documentation system
├── frontend/           # React 18 + TypeScript + Vite + Tailwind CSS + shadcn/ui
├── backend/            # Python 3.11 + FastAPI + SQLAlchemy 2.0 Async + Celery
├── pipelines/          # Apache Airflow Ingestion DAGs
├── scripts/            # Database initialization & taxonomy seeding scripts
├── docker-compose.yml  # Local multi-container development environment
├── AGENTS.md           # Agent contract: how Antigravity/Claude Code implement architect specs
└── .antigravity/       # Antigravity workspace rules, knowledge base & handoff workflow
```

---

## 3. Delivery Model — Chief Architect + Antigravity

Architecture is authored in [`docs/`](docs/README.md) by the Chief Architect (human + Claude Code).
Implementation is executed by **Google Antigravity** agents against self-contained handoff specs in
[`docs/11-agent-delivery/`](docs/11-agent-delivery/README.md). Every agent reads [`AGENTS.md`](AGENTS.md)
and [`.antigravity/rules.md`](.antigravity/rules.md), plans before coding, stays in declared scope, and
attaches verification Artifacts (gates, tests, browser recordings) to each PR.

---

## 4. Quickstart & Local Development

### Prerequisites
* Docker & Docker Compose
* Node.js $\ge 20$ & npm
* Python $\ge 3.11$

### Running with Docker Compose
```bash
# 1. Clone the repository and configure environment variables
cp .env.example .env

# 2. Start PostgreSQL, Redis, Backend API, and Frontend Web Client
docker compose up --build -d

# 3. Access applications:
# - Frontend Web:    http://localhost:3000
# - Backend API:     http://localhost:8000/docs (Swagger UI)
# - PostgreSQL:      localhost:5432 (Database: mahaskills)
```
