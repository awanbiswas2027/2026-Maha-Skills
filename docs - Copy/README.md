# MahaSkills — Connected Documentation System Index

**Platform:** MahaSkills · Labour-Market Intelligence & Curriculum Alignment Platform  
**Owner:** Government of Maharashtra · DSEEI / Maharashtra State Innovation Society (MSInS)  
**Problem Statement ID:** 26134  
**Architecture Model:** Multi-Artifact Connected Documentation System  
**Version:** 1.0  

---

## 1. Documentation Architecture & Dependency Chain

The MahaSkills documentation is organized as an interconnected, bidirectional system of artifacts rather than a single monolithic document. The documentation hierarchy follows a strict dependency chain from statutory requirements down to operational runbooks:

```text
PRD (01-product)
 └── Requirements Traceability Matrix (01-product)
      ├── System Architecture (02-architecture)
      │    ├── Backend Architecture (02-architecture)
      │    ├── Frontend Architecture (02-architecture)
      │    └── Database Schema & DDL (02-architecture)
      ├── Data Architecture & Dictionary (06-data)
      ├── REST & OpenAPI Contracts (03-api)
      ├── UI/UX & Design System (04-design)
      ├── Security, RBAC & DPDP 2023 Privacy (05-security)
      ├── Implementation Plan & Testing Strategy (07-development)
      ├── Cloud Deployment & CI/CD (08-deployment)
      ├── Operations, Monitoring & Runbooks (09-operations)
      └── Architecture Decisions & Open Questions (10-decisions)
```

---

## 2. Directory Tree & Master Artifact Index

```text
docs/
├── 01-product/
│   ├── PRD.md                             # Canonical Product Requirements Document
│   ├── REQUIREMENTS_TRACEABILITY.md       # Master bidirectional traceability matrix (REQ-xxx)
│   └── USER_STORIES.md                    # Epics & Gherkin acceptance criteria across 7 roles
│
├── 02-architecture/
│   ├── SYSTEM_ARCHITECTURE.md             # C4 Context, Container & Service topologies
│   ├── FRONTEND_ARCHITECTURE.md           # React 18, TanStack Query, shells & stores
│   ├── BACKEND_ARCHITECTURE.md            # FastAPI services, Celery workers & algorithms
│   ├── DATABASE_SCHEMA.md                 # PostgreSQL 16 schema, ERD, tables & partitioning
│   └── ARCHITECTURE_DECISIONS.md          # Architecture decisions index & resolutions
│
├── 03-api/
│   ├── API_SPECIFICATION.md               # REST /v1 endpoint catalog, envelopes & queries
│   ├── openapi.yaml                       # Formal OpenAPI 3.1 machine-readable contract
│   ├── API_CONTRACTS.md                   # Client generation (TypeScript) & MSW mocks
│   ├── ERROR_CODES.md                     # Domain error taxonomy (AUTH_, PLA_, REC_, etc.)
│   └── AUTHENTICATION.md                  # Keycloak OIDC, PKCE, token anatomy & scopes
│
├── 04-design/
│   ├── UI_UX_SPECIFICATION.md             # Screen specifications, 3 shells & state patterns
│   ├── DESIGN_SYSTEM.md                   # Color palette, spacing, typography & tokens
│   ├── INFORMATION_ARCHITECTURE.md        # Navigation trees per role & global search rules
│   └── ACCESSIBILITY.md                   # WCAG 2.1 AA & GIGW 3.0 compliance guidelines
│
├── 05-security/
│   ├── SECURITY_ARCHITECTURE.md           # Defense-in-depth, OWASP Top 10 & TLS/CSP
│   ├── RBAC_MATRIX.md                     # Role × Resource × Action × Scope matrix
│   ├── DATA_PRIVACY.md                    # DPDP Act 2023 compliance & pseudonymization
│   └── THREAT_MODEL.md                    # STRIDE threat model & attack surface mitigations
│
├── 06-data/
│   ├── DATA_MODEL.md                      # Conceptual/logical models & domain state machines
│   ├── DATA_DICTIONARY.md                 # Comprehensive field catalog & sensitivity levels
│   ├── DATA_INGESTION.md                  # Scraping, CSV upload validation & Airflow DAGs
│   └── DATA_GOVERNANCE.md                 # Data ownership RACI, retention & disposal rules
│
├── 07-development/
│   ├── PROJECT_BREAKDOWN.md               # 20-month phased delivery roadmap (Phases 1–4)
│   ├── IMPLEMENTATION_PLAN.md             # Vertical slices 0–11 execution plan & gates
│   ├── CODING_STANDARDS.md                # TypeScript, React, Python, Linting & Git norms
│   └── TESTING_STRATEGY.md                # Quality pyramid: unit, contract, E2E & WCAG tests
│
├── 08-deployment/
│   ├── DEPLOYMENT.md                      # Cloud infrastructure on AWS Mumbai (EKS, RDS)
│   ├── CI_CD.md                           # GitHub Actions automated test & deploy pipelines
│   ├── ENVIRONMENT_CONFIGURATION.md       # Dev, Staging, UAT & Prod configuration matrix
│   └── DISASTER_RECOVERY.md               # Multi-AZ & cross-region failover (RTO/RPO)
│
├── 09-operations/
│   ├── RUNBOOK.md                         # Operational playbooks for critical failures
│   ├── MONITORING.md                      # Prometheus metrics, Grafana & product health UI
│   ├── INCIDENT_RESPONSE.md               # Severity classification & incident response protocol
│   └── MAINTENANCE.md                     # Routine vacuuming, partition creation & archiving
│
├── 11-agent-delivery/                    # Architect → Antigravity agent handoff protocol
│   ├── README.md                         # Delivery model & how to assign work
│   ├── HANDOFF_SPEC_TEMPLATE.md           # Template every work assignment copies
│   ├── DEFINITION_OF_DONE.md              # Single merge checklist
│   ├── GUARDRAILS.md                      # Limits on agent autonomy
│   └── handoffs/                          # One spec per unit of work (HANDOFF-slice-N-*.md)
│
└── 10-decisions/
    ├── ASSUMPTIONS.md                     # Technical & operational assumptions register
    ├── OPEN_QUESTIONS.md                  # Detailed register for OQ-01..10 and G-01..08
    └── ADR/                               # Architecture Decision Records
        ├── ADR-001-react-typescript-frontend.md
        ├── ADR-002-keycloak-oidc.md
        ├── ADR-003-tanstack-query-server-state.md
        ├── ADR-004-postgresql-relational-store.md
        ├── ADR-005-candidate-pii-anonymisation-dpdp.md
        └── ADR-006-openapi-contract-first.md
```

---

## 3. How to Navigate and Maintain

1. **Adding a New Requirement:** Start at [`01-product/PRD.md`](file:///e:/CODING/Projects/new%20sih2026/docs/01-product/PRD.md), assign a requirement code (`REQ-xxx`) in [`REQUIREMENTS_TRACEABILITY.md`](file:///e:/CODING/Projects/new%20sih2026/docs/01-product/REQUIREMENTS_TRACEABILITY.md), update the corresponding service in [`02-architecture/`](file:///e:/CODING/Projects/new%20sih2026/docs/02-architecture/), update [`03-api/openapi.yaml`](file:///e:/CODING/Projects/new%20sih2026/docs/03-api/openapi.yaml), and register verification tests in [`07-development/TESTING_STRATEGY.md`](file:///e:/CODING/Projects/new%20sih2026/docs/07-development/TESTING_STRATEGY.md).
2. **Making Architectural Decisions:** Create a new sequential record `ADR-00X-*.md` in [`10-decisions/ADR/`](file:///e:/CODING/Projects/new%20sih2026/docs/10-decisions/ADR/) and register it in [`02-architecture/ARCHITECTURE_DECISIONS.md`](file:///e:/CODING/Projects/new%20sih2026/docs/02-architecture/ARCHITECTURE_DECISIONS.md).
3. **Validating Contracts:** Run `npx @stoplight/spectral-cli lint docs/03-api/openapi.yaml` to ensure schema integrity.
