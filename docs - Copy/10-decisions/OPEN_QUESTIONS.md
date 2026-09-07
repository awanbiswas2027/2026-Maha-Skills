# MahaSkills — Open Questions & Architectural Resolutions

**Platform:** MahaSkills · Government of Maharashtra (DSEEI / MSInS)  
**Problem Statement ID:** 26134  
**Version:** 1.0  
**Status:** Canonical Decision Register  

---

## 1. Master Open Questions Register (`OQ-01` to `OQ-10`)

| ID | Open Question | Impact Area | Status | Recommended Resolution |
|:---|:---|:---|:---|:---|
| **OQ-01** | Are `sector` and `SSC` identical entities, or does an economic sector map to distinct Sector Skill Councils? | Taxonomy, Filters, DB Schema | **Resolved** | **Separate Entities:** Maharashtra recognizes **33 economic sectors** in its industrial classification, whereas NSDC has **36 Sector Skill Councils (SSCs)**. Schema maintains `sectors` and `sscs` as separate relational tables with an optional foreign key `sscs.sector_id -> sectors.id`. |
| **OQ-02** | Is `SSC_REVIEWER` an independent Keycloak role or a sub-permission under Policy Maker? | IAM, RBAC, Review Workflow | **Resolved** | **Independent Realm Role:** `SSC_REVIEWER` is provisioned as an independent Keycloak role with an attribute `sector_ids: [INT]` restricting reviewer access strictly to their accredited industrial domain. |
| **OQ-03** | PRD roles table lists "rate candidates" for employers, which contradicts DPDP 2023 candidate anonymization. | Employer Portal, Privacy | **Resolved** | **Rate Course / Institutional Cohorts:** Employers evaluate *institutional training quality* and *trade course relevance* based on hired batches, not individual named student records. Candidate PII remains 100% pseudonymized. |
| **OQ-04** | What is the quantitative target for annual Trainer Upskilling Coverage (illegible in source PRD)? | KPI Dashboard, District Plans | **Resolved** | **Adopt $\ge 60\%$ Target:** Target established as $\ge 60\%$ of active vocational instructors receiving certified technical training annually, aligned with DSEEI DVET norms. |
| **OQ-05** | Does the Policy Maker formally approve *every* recommendation, or only above a materiality threshold? | Approvals Queue, Workflow | **Resolved** | **Tiered Governance:** High-impact recommendations (decommissioning courses, formulating net-new qualifications) require DSEEI Joint Secretary sign-off; minor elective module additions are ratified by the SSC Technical Committee with administrative notification. |
| **OQ-06** | Can a District Officer view data from other districts for regional benchmarking? | Scope Guard, Analytics | **Resolved** | **Anonymized Percentiles Only:** District Officers are strictly locked to their own district for operational records, but can view anonymized statewide medians and division percentiles. |
| **OQ-07** | Are draft District Training Plans visible to ITI Principals prior to formal approval? | Institutional Workbench | **Resolved** | **Visibility on Publication:** Draft plans remain in administrative review (`DRAFT` / `IN_REVIEW`); ITI Principals receive read-only access once the plan is formally `APPROVED` or `SANCTIONED`. |
| **OQ-08** | What consent language and data retention copy is required for the public Pathway Quiz? | Public Shell, DPDP 2023 | **Resolved** | **Explicit DPDP Consent Step:** The 5-step quiz includes an initial lightweight consent notice: *"Data collected is used strictly to recommend relevant vocational training courses and is not shared with commercial entities."* |
| **OQ-09** | What is the authoritative open-data boundary source for the Maharashtra 36-district SVG map? | Choropleth Heatmap | **Resolved** | **Survey of India / MahaGIS Boundary GeoJSON:** Converted to an optimized, topojson/SVG bundle loaded lazily behind the `MaharashtraMap` component. |
| **OQ-10** | Should `PROJECT_BREAKDOWN.md` be formally synchronized with the confirmed modern stack (TanStack Query, Zustand, Zod)? | Engineering Onboarding | **Resolved** | **Synchronized:** The delivery breakdown and implementation plans explicitly adopt the confirmed stack (React 18 + Vite + TanStack Query + Zustand + Zod + Tailwind). |

---

## 2. API Contract Alignments (`G-01` to `G-08`)

To resolve gaps identified during frontend architectural design, the following eight service endpoints have been formally incorporated into [`API_SPECIFICATION.md`](file:///e:/CODING/Projects/new%20sih2026/docs/03-api/API_SPECIFICATION.md) and [`openapi.yaml`](file:///e:/CODING/Projects/new%20sih2026/docs/03-api/openapi.yaml):

1. **`G-01` Notifications Domain:** `GET /v1/notifications`, `POST /v1/notifications/{id}/read`.
2. **`G-02` Reports & Export Service:** `POST /v1/reports/export` returning HTTP 202 with polling job ID.
3. **`G-03` Institute Directory:** `GET /v1/institutes`, `GET /v1/institutes/{id}/courses`.
4. **`G-04` Employer Verification:** `POST /v1/employers/verify-gstin`.
5. **`G-05` Public Dynamic Statistics:** `GET /v1/public/stats` (cacheable statewide counters).
6. **`G-06` Global Search:** `GET /v1/search?q=&types=` (excluding student candidates).
7. **`G-07` Predictive Forecasting Series:** `GET /v1/forecasts/demand` (Phase 4, behind feature flag).
8. **`G-08` Aggregate Placement Outcomes:** `GET /v1/placements/outcomes` (cohort median salaries and time-to-hire trends).
