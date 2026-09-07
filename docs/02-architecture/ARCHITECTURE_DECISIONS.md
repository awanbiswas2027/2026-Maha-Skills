# MahaSkills — Architecture Decisions Overview

**Platform:** MahaSkills · Government of Maharashtra (DSEEI / MSInS)  
**Problem Statement ID:** 26134  
**Version:** 1.0  
**Status:** Architecture Decision Index  

---

## 1. Architectural Decision Records (ADRs) Index

MahaSkills maintains formal Architecture Decision Records (ADRs) to document significant architectural choices, context, evaluated alternatives, and consequences.

| ADR ID | Decision Title | Status | Primary Impact Area | Linked Document |
|:---|:---|:---|:---|:---|
| **ADR-001** | React 18 with TypeScript & Vite for Web Client | Accepted | Frontend Presentation Tier | [ADR-001](file:///e:/CODING/Projects/new%20sih2026/docs/10-decisions/ADR/ADR-001-react-typescript-frontend.md) |
| **ADR-002** | Centralized Keycloak OIDC with PKCE for IAM | Accepted | Security & Identity Management | [ADR-002](file:///e:/CODING/Projects/new%20sih2026/docs/10-decisions/ADR/ADR-002-keycloak-oidc.md) |
| **ADR-003** | TanStack Query for Server State & Zustand for UI State | Accepted | Frontend State Management | [ADR-003](file:///e:/CODING/Projects/new%20sih2026/docs/10-decisions/ADR/ADR-003-tanstack-query-server-state.md) |
| **ADR-004** | PostgreSQL 16 as Canonical Relational Store | Accepted | Data Persistence Tier | [ADR-004](file:///e:/CODING/Projects/new%20sih2026/docs/10-decisions/ADR/ADR-004-postgresql-relational-store.md) |
| **ADR-005** | Candidate PII Anonymization & DPDP 2023 Compliance | Accepted | Data Privacy & Legal Compliance | [ADR-005](file:///e:/CODING/Projects/new%20sih2026/docs/10-decisions/ADR/ADR-005-candidate-pii-anonymisation-dpdp.md) |
| **ADR-006** | Contract-First API Design via OpenAPI 3.1 | Accepted | API Integration & Testing | [ADR-006](file:///e:/CODING/Projects/new%20sih2026/docs/10-decisions/ADR/ADR-006-openapi-contract-first.md) |

---

## 2. Key Architectural Resolutions

### 2.1 Resolution of Brief vs. PRD Misalignments
As established in PRD §1 and the frontend architecture review:
1. **No ATS or Job Board:** MahaSkills is an **intelligence and curriculum-governance platform**. Employers author *Skill Needs*, not job vacancies. Job postings are ingested read-only.
2. **Candidate Anonymity:** DPDP 2023 mandates zero candidate directories or employer candidate search in v1. Employers rate *courses and institutional cohorts*, not individual candidates.
3. **Retrospective Outcomes:** Placement data is uploaded retrospectively by ITI principals, driving automated gap scoring and institutional benchmarking.

---

## 3. Related Decision Registers
* Central Register of Open Architectural Questions: [OPEN_QUESTIONS.md](file:///e:/CODING/Projects/new%20sih2026/docs/10-decisions/OPEN_QUESTIONS.md)
* Technical & Operational Assumptions: [ASSUMPTIONS.md](file:///e:/CODING/Projects/new%20sih2026/docs/10-decisions/ASSUMPTIONS.md)
