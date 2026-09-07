# MahaSkills — Complete Merged Documentation

> Merged documentation compiled from `docs - Copy` across all 11 architectural domains.

## Table of Contents

- [README.md](#readme-md)
- [01-product/PRD.md](#01-product-prd-md)
- [01-product/REQUIREMENTS_TRACEABILITY.md](#01-product-requirements_traceability-md)
- [01-product/USER_STORIES.md](#01-product-user_stories-md)
- [02-architecture/ARCHITECTURE_DECISIONS.md](#02-architecture-architecture_decisions-md)
- [02-architecture/BACKEND_ARCHITECTURE.md](#02-architecture-backend_architecture-md)
- [02-architecture/DATABASE_SCHEMA.md](#02-architecture-database_schema-md)
- [02-architecture/FRONTEND_ARCHITECTURE.md](#02-architecture-frontend_architecture-md)
- [02-architecture/SYSTEM_ARCHITECTURE.md](#02-architecture-system_architecture-md)
- [03-api/API_CONTRACTS.md](#03-api-api_contracts-md)
- [03-api/API_SPECIFICATION.md](#03-api-api_specification-md)
- [03-api/AUTHENTICATION.md](#03-api-authentication-md)
- [03-api/ERROR_CODES.md](#03-api-error_codes-md)
- [03-api/openapi.yaml](#03-api-openapi-yaml)
- [04-design/ACCESSIBILITY.md](#04-design-accessibility-md)
- [04-design/DESIGN_SYSTEM.md](#04-design-design_system-md)
- [04-design/INFORMATION_ARCHITECTURE.md](#04-design-information_architecture-md)
- [04-design/UI_UX_SPECIFICATION.md](#04-design-ui_ux_specification-md)
- [05-security/DATA_PRIVACY.md](#05-security-data_privacy-md)
- [05-security/RBAC_MATRIX.md](#05-security-rbac_matrix-md)
- [05-security/SECURITY_ARCHITECTURE.md](#05-security-security_architecture-md)
- [05-security/THREAT_MODEL.md](#05-security-threat_model-md)
- [06-data/DATA_DICTIONARY.md](#06-data-data_dictionary-md)
- [06-data/DATA_GOVERNANCE.md](#06-data-data_governance-md)
- [06-data/DATA_INGESTION.md](#06-data-data_ingestion-md)
- [06-data/DATA_MODEL.md](#06-data-data_model-md)
- [07-development/CODING_STANDARDS.md](#07-development-coding_standards-md)
- [07-development/IMPLEMENTATION_PLAN.md](#07-development-implementation_plan-md)
- [07-development/PROJECT_BREAKDOWN.md](#07-development-project_breakdown-md)
- [07-development/TESTING_STRATEGY.md](#07-development-testing_strategy-md)
- [08-deployment/CI_CD.md](#08-deployment-ci_cd-md)
- [08-deployment/DEPLOYMENT.md](#08-deployment-deployment-md)
- [08-deployment/DISASTER_RECOVERY.md](#08-deployment-disaster_recovery-md)
- [08-deployment/ENVIRONMENT_CONFIGURATION.md](#08-deployment-environment_configuration-md)
- [09-operations/INCIDENT_RESPONSE.md](#09-operations-incident_response-md)
- [09-operations/MAINTENANCE.md](#09-operations-maintenance-md)
- [09-operations/MONITORING.md](#09-operations-monitoring-md)
- [09-operations/RUNBOOK.md](#09-operations-runbook-md)
- [10-decisions/ADR/ADR-001-react-typescript-frontend.md](#10-decisions-adr-adr-001-react-typescript-frontend-md)
- [10-decisions/ADR/ADR-002-keycloak-oidc.md](#10-decisions-adr-adr-002-keycloak-oidc-md)
- [10-decisions/ADR/ADR-003-tanstack-query-server-state.md](#10-decisions-adr-adr-003-tanstack-query-server-state-md)
- [10-decisions/ADR/ADR-004-postgresql-relational-store.md](#10-decisions-adr-adr-004-postgresql-relational-store-md)
- [10-decisions/ADR/ADR-005-candidate-pii-anonymisation-dpdp.md](#10-decisions-adr-adr-005-candidate-pii-anonymisation-dpdp-md)
- [10-decisions/ADR/ADR-006-openapi-contract-first.md](#10-decisions-adr-adr-006-openapi-contract-first-md)
- [10-decisions/ASSUMPTIONS.md](#10-decisions-assumptions-md)
- [10-decisions/OPEN_QUESTIONS.md](#10-decisions-open_questions-md)
- [11-agent-delivery/DEFINITION_OF_DONE.md](#11-agent-delivery-definition_of_done-md)
- [11-agent-delivery/GUARDRAILS.md](#11-agent-delivery-guardrails-md)
- [11-agent-delivery/HANDOFF_SPEC_TEMPLATE.md](#11-agent-delivery-handoff_spec_template-md)
- [11-agent-delivery/README.md](#11-agent-delivery-readme-md)
- [11-agent-delivery/handoffs/HANDOFF-slice-2-taxonomy.md](#11-agent-delivery-handoffs-handoff-slice-2-taxonomy-md)

---

<a id="readme-md"></a>

<!-- ======================================================== -->
<!-- FILE: README.md -->
<!-- ======================================================== -->

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


---

<a id="01-product-prd-md"></a>

<!-- ======================================================== -->
<!-- FILE: 01-product/PRD.md -->
<!-- ======================================================== -->

# MahaSkills — Product Requirements Document (PRD)

**Platform:** MahaSkills — Labour-Market Intelligence & Curriculum Alignment Platform  
**Owner:** Government of Maharashtra · Department of Skills, Employment, Entrepreneurship and Innovation (DSEEI) / Maharashtra State Innovation Society (MSInS)  
**Problem Statement ID:** 26134  
**Version:** 1.0  
**Status:** Approved for Implementation  
**Last Updated:** July 2025  

---

## 1. Executive Summary

Maharashtra's skill development ecosystem trains over 5 lakh candidates annually across Industrial Training Institutes (ITIs), polytechnics, and government-approved private training providers. Despite substantial public investment, average post-training placement rates hover around 38%, and industrial employers consistently report severe qualification mismatches between curriculum outcomes and active workplace requirements.

**MahaSkills** bridges this systemic misalignment by establishing a continuous, evidence-backed feedback loop between real-time industry demand and vocational curriculum design. The platform continuously ingests labour market signals (job postings, employer surveys, placement returns, industrial investment data), cross-references them with the National Skills Qualification Framework (NSQF) and Sector Skill Council (SSC) occupational profiles, and algorithmically generates:

1. **Prioritized curriculum update recommendations** with verifiable market evidence packages.
2. **Dynamic district-level training plans** calibrated against local industrial clusters and ITI equipment capacities.
3. **Transparent, personalized candidate guidance** highlighting true placement outcomes and median post-training earnings.

Delivered across four phased milestones over 20 months, MahaSkills aims to lift average statewide vocational placement rates to 62%+ and compress curriculum revision cycles from 3–5 years down to under 12 months.

---

## 2. Problem Statement & Regional Context

### 2.1 Core Systemic Deficiencies
* **Static, Outdated Curricula:** Vocational curricula reflect historical job descriptions rather than contemporary industrial processes (e.g., Electrician trades focusing on legacy domestic fuse boxes rather than industrial PLC/SCADA or EV battery assembly).
* **Extended Revision Latency:** Sector Skill Council (SSC) and National Council for Vocational Education and Training (NCVET) curriculum reviews occur at 3–5 year intervals, failing to keep pace with rapid industrial modernization.
* **Fragmented, Siloed Placement Records:** Graduate outcomes are tracked independently at the institute level on paper or isolated spreadsheets, preventing statewide benchmarking, outcome verification, or trend analysis.
* **Information Asymmetry:** Candidates lack visibility into actual employer demand and salary baselines, while employers cannot communicate emerging competency needs directly to training administrators.

### 2.2 Priority Industrial Districts & Focus Sectors
| District / Cluster | Dominant Industrial Sectors | Target Transformation Focus |
|:---|:---|:---|
| **Pune & Pimpri-Chinchwad** | Automotive, Electric Vehicles (EV), IT/ITeS, Pharmaceuticals | Automation, EV battery diagnostics, software validation |
| **Nashik** | Auto ancillaries, Agro-processing, Wine & Beverage production | Modern CNC operations, automated packaging, quality assurance |
| **Chhatrapati Sambhajinagar** | Automotive manufacturing, MSME engineering, Defence components | Precision tooling, robotics maintenance, metallurgy |
| **Nagpur (MIHAN SEZ)** | Logistics & Warehousing, Aviation maintenance, Mining machinery | Automated inventory systems, avionics servicing, heavy equipment |
| **Kolhapur** | Foundry & Casting, Textiles, Agricultural machinery | CAD/CAM casting design, sustainable processing, hydraulic systems |
| **Konkan / Ratnagiri** | Marine processing, Fisheries, Agri-tech, Eco-tourism | Cold chain logistics, marine bio-processing, hospitality tech |

---

## 3. Product Goals & Key Performance Indicators (KPIs)

| Metric Code | Goal Description | Baseline | Target (Year 2) | Responsible Stakeholder |
|:---|:---|:---|:---|:---|
| **KPI-01** | Statewide ITI Placement Rate | 38% | $\ge 62\%$ | District Officers & ITI Principals |
| **KPI-02** | Employer Satisfaction Score | Unmeasured | $\ge 3.8\ /\ 5.0$ | DSEEI & Industry Liaisons |
| **KPI-03** | Curriculum Revision Latency | 36–60 months | $\le 12$ months | SSC Technical Committees & DSEEI |
| **KPI-04** | Annual Skill Gap Closure Rate | Unmeasured | $\ge 40\%$ | Labour Market Intelligence Engine |
| **KPI-05** | Annual Trainer Upskilling Coverage | ~20% | $\ge 60\%$ | Directorate of Vocational Education & Training |
| **KPI-06** | Automated ITI Equipment Gap Flagging | Manual / None | 100% of ITIs | DSEEI Asset Audit Division |
| **KPI-07** | Candidate Career Decision Clarity | Unmeasured | $\ge 4.0\ /\ 5.0$ | Candidate Portal & Guidance Team |

---

## 4. User Personas & Role Matrix

MahaSkills defines seven distinct authenticated roles plus unauthenticated public access:

```mermaid
graph TD
    Public[Unauthenticated Public] --> CandidateShell[Candidate Public Shell]
    User[Authenticated User via Keycloak] --> RoleCheck{Keycloak Realm Role}
    RoleCheck -->|POLICY_MAKER| DSEEI[DSEEI State Dashboard]
    RoleCheck -->|DISTRICT_OFFICER| District[District Skill Office]
    RoleCheck -->|ITI_PRINCIPAL| ITI[Institute Administration]
    RoleCheck -->|EMPLOYER| Emp[Employer Portal]
    RoleCheck -->|SSC_REVIEWER| SSC[SSC Review Workbench]
    RoleCheck -->|ADMIN| Admin[Taxonomy & System Operations]
    RoleCheck -->|CANDIDATE| Cand[Candidate Guidance Portal]
```

| Role Key | Role Title | Access Scope | Core Responsibilities |
|:---|:---|:---|:---|
| `POLICY_MAKER` | Policy Maker (DSEEI / MSInS) | Statewide (All 36 Districts) | Review macroeconomic gap heatmaps, sanction district budget allocations, approve published curriculum modifications. |
| `DISTRICT_OFFICER` | District Skill Officer (DSEEGC) | Single Assigned District | Formulate annual District Training Plans, monitor ITI placement compliance, manage operational alerts. |
| `ITI_PRINCIPAL` | ITI / Polytechnic Principal | Single Assigned Institute | Submit monthly validated placement returns, track institutional skill gap alignment, monitor trainer qualifications. |
| `EMPLOYER` | Industry Partner / HR | Registered Enterprise | Submit structured skill needs, participate in pulse gap surveys, validate proposed curriculum drafts. |
| `SSC_REVIEWER` | Sector Skill Council Reviewer | Assigned Sector(s) | Review automated curriculum recommendation dossiers, perform technical validation, issue approval/revision decisions. |
| `ADMIN` | System Administrator / Data Steward | System-Wide | Manage skill taxonomy, monitor Airflow ingestion DAGs, review security audit logs, manage user provisioning. |
| `CANDIDATE` | Trainee / Prospective Student | Individual Profile | Explore verified course placement statistics, complete career pathway assessment, initiate Mahaswayam SSO enrollment. |

---

## 5. System Architecture & External Integrations

### 5.1 Three-Tier Architecture Overview
* **Presentation Tier:** Modern React 18 single-page application with TypeScript, Tailwind CSS, and shadcn/ui. Fully localized into Marathi (primary), Hindi, and English.
* **Application & Intelligence Tier:** RESTful microservices built using Python FastAPI and Node.js behind a unified API Gateway. Python scikit-learn analytics engine for gap scoring and recommendation heuristics.
* **Data Tier:** PostgreSQL 16 relational database for transactional integrity, Elasticsearch 8 for full-text taxonomy search and job role matching, Redis 7 for distributed caching and rate-limiting, and S3-compatible object storage for CSV uploads and PDF dossiers.
* **Data Pipeline Tier:** Apache Airflow 2.8 orchestrating automated nightly scrapers, monthly placement validation routines, and weekly gap recalculation pipelines.

### 5.2 External System Integrations
1. **Mahaswayam (DSEEI Portal):** Bi-directional REST API integration and Keycloak OIDC Single Sign-On (SSO) for direct enrollment handoff and candidate record reconciliation.
2. **National Career Service (NCS) Open API:** Scheduled ingestion of government-verified job opportunities and employer postings.
3. **MahaDBT:** Verification interface for government scholarship and post-matric training stipend distributions.
4. **NSDC / NCVET Portals:** Quarterly synchronization of National Qualification Register (NQR) entries and National Occupational Standards (NOS).
5. **Commercial Job Portals:** Nightly compliant ingestion of public postings from Naukri (licensed API), LinkedIn, and Indeed RSS feeds.

---

## 6. Phased Implementation Roadmap

```mermaid
gantt
    title MahaSkills Statewide Implementation Roadmap
    dateFormat  YYYY-MM
    section Phase 1
    Data Ingestion & Taxonomy Pipeline :2025-08, 2025-11
    Read-only Gap Dashboard             :2025-09, 2025-11
    section Phase 2
    Gap Scoring & Recommendation Engine:2025-12, 2026-04
    Employer Portal & Survey Module     :2026-01, 2026-04
    section Phase 3
    District Training Plan Generator   :2026-05, 2026-09
    Candidate Guidance & Mahaswayam SSO :2026-06, 2026-09
    section Phase 4
    Predictive Demand Forecasting (ML)  :2026-10, 2027-03
    Mobile App & Statewide Scale        :2026-11, 2027-03
```

### Phase 1: Foundation & Data Flow (Months 0–4)
* Establish Apache Airflow ingestion pipelines for job postings and placement CSVs.
* Seed the core PostgreSQL taxonomy with ~2,200 NSQF-aligned job roles across 33 sectors.
* Deliver read-only executive gap dashboards for DSEEI policy makers and pilot District Officers across 5 focus districts.
* **Exit Gate:** Uninterrupted daily ingestion feeds active; $\ge 10$ ITIs uploading monthly placement returns; pilot gap heatmap operational.

### Phase 2: Intelligence & Recommendation Engine (Months 4–9)
* Implement the algorithmic Gap Scoring Engine operating across district, sector, and NSQF levels.
* Deploy the Curriculum Recommendation Engine with multi-stage approval workflows (`Draft` $\rightarrow$ `SSC Review` $\rightarrow$ `DSEEI Approval` $\rightarrow$ `Published`).
* Release Employer Portal MVP featuring Aadhaar/GSTIN-verified onboarding, skill needs submissions, and micro-surveys.
* **Exit Gate:** Gap scores calculated for all 36 districts; $\ge 20$ validated curriculum recommendations reviewed by SSCs; $\ge 50$ enterprise employers onboarded.

### Phase 3: District Planning & Candidate Guidance (Months 9–14)
* Launch automated District Training Plan generation with institutional equipment gap analysis and budget scoring.
* Deploy Candidate Portal featuring verified course placement metrics (median salary, time-to-placement) and 5-step Pathway Quiz.
* Integrate automated SMS and email alerting for placement thresholds and curriculum publication events.
* **Exit Gate:** Annual training plans generated for all 36 districts; Mahaswayam SSO enrollment operational; $\ge 500$ candidates guided in initial month.

### Phase 4: Prediction & Statewide Scale (Months 14–20)
* Deploy ARIMA/Prophet predictive forecasting models projecting 12-month forward skill demand based on macroeconomic trends and PLI announcements.
* Launch offline-first candidate mobile application (React Native) for low-bandwidth rural talukas.
* Onboard 100% of government ITIs and polytechnics across Maharashtra, backed by an active network of 500+ verified employers.
* **Exit Gate:** Predictive demand module active statewide; 36-district coverage operational; revision latency demonstrably under 12 months.

---

## 7. Detailed Feature Specifications

### 7.1 Data Ingestion & Ingestion Validation
* **Job Market Signals:** Ingest posting title, required skills, experience bounds, location coordinates, salary indicators, and publication date.
* **Placement Returns:** Structured CSV upload for ITIs containing anonymized candidate hashes, course IDs, batch completion year, placement verification flag, hiring enterprise name, job title, starting salary, and months elapsed to placement.
* **Validation Engine:** Strict schema validation with instant cell-level error flagging, header verification, and atomic batch isolation.

### 7.2 Skill Taxonomy Management
* Standardized representation of 33 economic sectors, 36 Sector Skill Councils, ~2,200 Job Roles, and discrete Skills.
* Natural Language Processing (NLP) tokenization and entity extraction to map unstructured job ad terminology onto formal NSQF taxonomy nodes.
* Dynamic staging repository for "Emerging Skills" pending formal SSC qualification standardization.

### 7.3 Gap Scoring Engine
* **Mathematical Model:**
  $$\text{Gap Score} = \min\left(100, \max\left(0, \frac{\text{Demand Count} \times \text{Trend Factor} - \text{Trained Capacity} \times \text{Placement Rate}}{\text{Normalisation Constant}} \times 100\right)\right)$$
* **Oversupply Detection:** Automatically flag courses where placement rate $< 25\%$ AND demand falls below the 20th percentile for $\ge 2$ consecutive quarters.
* **Aggregation Granularity:** Computations refreshed weekly at District $\times$ Sector $\times$ Job Role $\times$ NSQF level.

### 7.4 Curriculum Recommendation & Review Workflow
* **Trigger Threshold:** Sustained skill gap score $> 60$ over an 8-week observation window with zero aligned local course offerings.
* **Recommendation Typology:**
  1. *Add Elective Module:* Augment existing trade course with emerging skill module.
  2. *Revise Unit of Competency:* Modernize outdated syllabus components.
  3. *Formulate New Qualification:* Initiate NCVET development for net-new job roles.
  4. *Consolidate / Decommission Course:* Phased phase-out of structurally oversupplied trades.
* **Dossier Package:** Auto-compiled evidence dossier containing 12-month demand trajectory, hiring employer listings, interstate course benchmarks, and projected placement uplift.
* **Workflow SLA:** SSC Review: 14 business days; DSEEI Final Approval: 7 business days.

### 7.5 District Training Plan Synthesis
* Compiles recommended course matrices, target intake quotas, trainer upskilling mandates, and capital equipment requirements for every district.
* Evaluates course syllabus equipment specifications against uploaded ITI asset inventories to generate priced infrastructure deficiency reports.

### 7.6 Candidate Career Decision Engine
* Course directory exposing real-world placement metrics: verified median starting salary, 50th percentile time-to-hire, and active hiring employers.
* 5-question adaptive Pathway Quiz evaluating educational qualification, geographic constraints, sector interest, language preference, and relocation mobility to recommend the top 3 optimal vocational pathways.

---

## 8. Governance & Administrative Authority

* **Platform Stewardship:** Maharashtra State Innovation Society (MSInS) under the administrative oversight of DSEEI.
* **PMO Operations:** Dedicated 4-person Project Management Office directing vendor execution, data MoUs, and inter-departmental protocols.
* **Statutory Bodies Integrated:**
  * 36 Sector Skill Councils (SSCs)
  * National Council for Vocational Education and Training (NCVET)
  * Directorate of Vocational Education and Training (DVET), Maharashtra
  * Maharashtra State Council for Vocational Training (MSCVT)
  * Industry Chambers: MCCIA, CII Maharashtra, MSSIA

---

## 9. Non-Functional Requirements (NFRs)

* **Availability & Resilience:** 99.5% operational uptime with High Availability multi-AZ deployment in AWS Mumbai / GovCloud.
* **Latency & Performance:** API response p95 $< 300\text{ms}$; complex analytical dashboard rendering $< 2.0\text{s}$; gap calculation pipeline batch run $< 45\text{min}$.
* **Localization:** 100% externalized strings supporting Marathi (primary), Hindi, and English with dynamic runtime locale switching.
* **Accessibility:** Full compliance with WCAG 2.1 AA and Government of India Guidelines for Indian Government Websites (GIGW 3.0).
* **Data Retention & Privacy:** Comply with Digital Personal Data Protection (DPDP) Act 2023. Raw job postings retained for 2 years; placement records retained for 7 years; candidate records strictly pseudonymized.


---

<a id="01-product-requirements_traceability-md"></a>

<!-- ======================================================== -->
<!-- FILE: 01-product/REQUIREMENTS_TRACEABILITY.md -->
<!-- ======================================================== -->

# MahaSkills — Requirements Traceability Matrix (RTM)

**Platform:** MahaSkills · Government of Maharashtra (DSEEI / MSInS)  
**Problem Statement ID:** 26134  
**Version:** 1.0  
**Status:** Canonical Traceability Baseline  

The Requirements Traceability Matrix (RTM) establishes a bidirectional chain connecting high-level policy objectives to architectural subsystems, database schema definitions, API contracts, frontend interfaces, and verification test suites. Every functional and non-functional requirement must maintain forward and backward traceability across the lifecycle.

---

## 1. Traceability Schema & Taxonomy

* **Requirement ID Notation:** `REQ-[DOMAIN]-[SEQ]` (e.g., `REQ-GAP-01`)
* **Domains:**
  * `AUTH`: Authentication, Authorization & Identity Management
  * `LMI`: Labour Market Intelligence & External Data Ingestion
  * `TAX`: Skills & Occupational Taxonomy
  * `GAP`: Algorithmic Skill-Demand Gap Scoring
  * `REC`: Curriculum Update Recommendation & Review Workflow
  * `EMP`: Industry Partner & Employer Engagement Portal
  * `PLA`: ITI Placement Returns & Graduate Tracking
  * `DTP`: District Training Plan Synthesis & Equipment Audits
  * `CAN`: Public Candidate Guidance, Search & Career Pathways
  * `ADM`: Platform Administration, Audit Trails & Operations
  * `SEC`: Security, Governance & DPDP 2023 Compliance
  * `NFR`: Non-Functional Performance & Architectural Constraints

---

## 2. Master Requirements Traceability Matrix

| Req ID | Requirement Summary | PRD § | Architecture Component | Primary DB Table | API Endpoint / Contract | Frontend Route / Component | Test Suite ID | Phase | Status |
|:---|:---|:---|:---|:---|:---|:---|:---|:---|:---|
| **REQ-AUTH-01** | Keycloak OIDC Authentication with Authorization Code + PKCE | §4.2, §10 | `AuthService` | `users`, `user_roles` | `/v1/auth/login`, `/v1/auth/token` | `/auth/login`, `AuthGuard` | `TEST-SEC-001` | 1 | Complete |
| **REQ-AUTH-02** | Role-Based Access Control (RBAC) across 7 discrete stakeholder tiers | §3, §4 | `APIGateway`, `RBACMiddleware` | `roles`, `permissions` | `/v1/auth/me`, `/v1/auth/permissions` | `RoleGuard`, `PermissionGate` | `TEST-SEC-002` | 1 | Complete |
| **REQ-AUTH-03** | Contextual district, institute, and sector scope isolation | §3, §8 | `TenantScopeGuard` | `user_scopes` | All scoped `/v1/*` endpoints | `ScopeContext`, `AppShell` | `TEST-SEC-003` | 1 | Complete |
| **REQ-LMI-01** | Automated multi-source job posting ingestion (Naukri, LinkedIn, Indeed, NCS) | §6.1 | `IngestionWorker` (Airflow) | `raw_job_postings`, `clean_job_postings` | `/v1/lmi/jobs`, `/v1/lmi/trends` | `/lmi/market-overview`, `JobTrendChart` | `TEST-ING-001` | 1 | In Progress |
| **REQ-LMI-02** | State & district-level labour demand aggregation and trend analytics | §6.1, §7 | `LmiAnalyticsService` | `lmi_aggregates_district` | `/v1/lmi/aggregates` | `/analytics/lmi`, `DemandTrendCard` | `TEST-LMI-001` | 1 | In Progress |
| **REQ-TAX-01** | NSQF & SSC occupational taxonomy hierarchy (~2,200 job roles, 33 sectors) | §6.2 | `TaxonomyService` | `sectors`, `sscs`, `job_roles`, `skills` | `/v1/taxonomy/roles`, `/v1/taxonomy/tree` | `/taxonomy`, `TaxonomyTreeView` | `TEST-TAX-001` | 1 | Complete |
| **REQ-TAX-02** | NLP enrichment & entity extraction for unstructured job posting skills | §6.2 | `NlpTaxonomyEngine` | `skill_synonyms`, `emerging_skills` | `/v1/taxonomy/extract`, `/v1/taxonomy/emerging` | `/admin/taxonomy/emerging`, `SkillBadge` | `TEST-TAX-002` | 2 | Planned |
| **REQ-GAP-01** | Weekly algorithmic gap scoring: District $\times$ Sector $\times$ Role $\times$ NSQF level | §6.3 | `GapScoringEngine` (Celery) | `gap_scores`, `gap_score_history` | `/v1/gap-scores`, `/v1/gap-scores/{id}` | `/gap-analysis`, `GapHeatmap` | `TEST-GAP-001` | 2 | In Progress |
| **REQ-GAP-02** | Automated oversupply flagging (placement $< 25\%$ & demand $< 20\text{th}$ percentile) | §6.3 | `GapScoringEngine` | `oversupply_alerts` | `/v1/gap-scores/oversupply` | `/gap-analysis/oversupply`, `OversupplyTable` | `TEST-GAP-002` | 2 | Planned |
| **REQ-REC-01** | Automated curriculum modification trigger on sustained gap ($> 60$ for 8 wks) | §6.4 | `RecommendationEngine` | `recommendations`, `recommendation_evidence` | `/v1/recommendations` | `/recommendations`, `RecommendationCard` | `TEST-REC-001` | 2 | In Progress |
| **REQ-REC-02** | Auto-compiled evidence dossier (trend chart, employers, interstate benchmarks) | §6.4 | `DossierGenerator` | `recommendation_evidence` | `/v1/recommendations/{id}/dossier` | `/recommendations/:id`, `DossierViewer` | `TEST-REC-002` | 2 | Planned |
| **REQ-REC-03** | Multi-tier review workflow: Draft $\rightarrow$ SSC Review $\rightarrow$ DSEEI Approval $\rightarrow$ Published | §6.4, §8 | `WorkflowService` | `recommendation_audits` | `/v1/recommendations/{id}/review` | `/recommendations/:id/review`, `ApprovalStepper` | `TEST-REC-003` | 2 | In Progress |
| **REQ-EMP-01** | Employer self-onboarding with GSTIN & MCA verification | §6, §7 | `EmployerService` | `employers`, `employer_verifications` | `/v1/employers/register`, `/v1/employers/verify` | `/employer/register`, `GstinLookup` | `TEST-EMP-001` | 2 | Planned |
| **REQ-EMP-02** | Structured skill needs submission (headcount, urgency, tech specs) | §6, §7 | `EmployerService` | `skill_needs`, `skill_need_items` | `/v1/employers/skill-needs` | `/employer/skill-needs`, `SkillNeedsForm` | `TEST-EMP-002` | 2 | In Progress |
| **REQ-EMP-03** | Sector-triggered micro-surveys on localized skill gap spikes | §6.1, §7 | `SurveyEngine` | `surveys`, `survey_responses` | `/v1/surveys/active`, `/v1/surveys/submit` | `/employer/surveys`, `MicroSurveyDialog` | `TEST-EMP-003` | 2 | Planned |
| **REQ-PLA-01** | Structured monthly placement CSV upload with cell-level validation | §6.1 | `PlacementIngestionService` | `placement_batches`, `placement_records` | `/v1/ingestion/placements/upload` | `/placements/upload`, `CsvDropzone` | `TEST-PLA-001` | 1 | Complete |
| **REQ-PLA-02** | Placement validation reporting with immediate row-level rejection feedback | §6.1 | `CsvValidationWorker` | `placement_validation_errors` | `/v1/ingestion/placements/{batchId}/errors` | `/placements/batches/:id`, `ValidationErrorTable` | `TEST-PLA-002` | 1 | Complete |
| **REQ-PLA-03** | Institutional placement benchmarking against district and state medians | §6.1, §7 | `PlacementAnalyticsService` | `placement_aggregates_institute` | `/v1/placements/benchmarks` | `/placements/benchmarks`, `PlacementChart` | `TEST-PLA-003` | 1 | Planned |
| **REQ-DTP-01** | Automated synthesis of Annual & 3-Year District Training Plans | §6.5, §7 | `DistrictPlanningService` | `district_plans`, `district_plan_items` | `/v1/district-plans`, `/v1/district-plans/{id}` | `/district-plans`, `PlanBuilder` | `TEST-DTP-001` | 3 | Planned |
| **REQ-DTP-02** | ITI equipment gap assessment against syllabus specifications | §6.5 | `EquipmentAuditService` | `iti_assets`, `course_equipment_standards` | `/v1/district-plans/{id}/equipment-gaps` | `/district-plans/:id/equipment`, `EquipmentGapList` | `TEST-DTP-002` | 3 | Planned |
| **REQ-DTP-03** | DSEEI capital budget allocation priority scoring | §6.5, §7 | `BudgetModelingService` | `district_budget_allocations` | `/v1/district-plans/budget-model` | `/district-plans/budget`, `BudgetPriorityCard` | `TEST-DTP-003` | 3 | Planned |
| **REQ-CAN-01** | Public course directory with verified placement rates and median starting salary | §6.6, §7 | `CandidateService` | `courses`, `course_placement_stats` | `/v1/candidates/courses`, `/v1/candidates/courses/{id}` | `/candidate/courses`, `CourseCard` | `TEST-CAN-001` | 3 | Planned |
| **REQ-CAN-02** | 5-question adaptive Pathway Quiz generating top 3 recommendations | §6.6 | `PathwayRecommendationEngine`| `pathway_quiz_logs` | `/v1/candidates/pathway/recommend` | `/candidate/pathway`, `PathwayQuizWizard` | `TEST-CAN-002` | 3 | Planned |
| **REQ-CAN-03** | Mahaswayam SSO enrollment handoff and status synchronization | §4.3, §6.6 | `MahaswayamAdapter` | `candidate_enrollments` | `/v1/candidates/enrollment-handoff` | `/candidate/courses/:id/enroll`, `SsoRedirect` | `TEST-CAN-003` | 3 | Planned |
| **REQ-ADM-01** | Comprehensive administrative audit logging for all transactional updates | §10 | `AuditLoggingMiddleware` | `audit_logs` | `/v1/admin/audit-logs` | `/admin/audit-logs`, `AuditLogTable` | `TEST-ADM-001` | 1 | Complete |
| **REQ-ADM-02** | System health, pipeline run status, and queue depth observability | §7, §10 | `ObservabilityService` | Redis / Celery Inspect | `/v1/admin/health`, `/v1/admin/pipelines` | `/admin/system-health`, `HealthDashboard` | `TEST-ADM-002` | 1 | In Progress |
| **REQ-SEC-01** | DPDP Act 2023 candidate pseudonymization & data minimization | §9, §10 | `DataSanitizationService` | `placement_records` (candidate_hash) | All placement ingestion APIs | `CandidateIdCell` | `TEST-SEC-004` | 1 | Complete |
| **REQ-SEC-02** | Strict role-based URL, component, action, and API route security gates | §3, §10 | `SecurityInterceptor` | `permissions` | All protected endpoints | All protected React routes | `TEST-SEC-005` | 1 | Complete |
| **REQ-NFR-01** | Sub-300ms p95 API response times and sub-2.0s analytical page loads | §10 | Redis Cache, DB Indexes | Materialized views | All GET queries | Performance audit | `TEST-NFR-001` | All | In Progress |
| **REQ-NFR-02** | Trilingual localization (Marathi, Hindi, English) with zero hardcoded strings | §10 | `I18nEngine` (`react-i18next`)| JSON translation bundles | `/v1/i18n/{locale}` | `LanguageSelector`, `t('key')` | `TEST-NFR-002` | 1 | In Progress |
| **REQ-NFR-03** | WCAG 2.1 AA accessibility compliance across all public & administrative pages | §10 | Accessibility Design Tokens | N/A | Static HTML/ARIA compliance | High-contrast theme, ARIA trees | `TEST-NFR-003` | 1 | In Progress |

---

## 3. Upstream & Downstream Verification Checklist

When any requirement is modified:
1. **Upstream PRD Review:** Confirm that change aligns with Department objectives in [PRD.md](file:///e:/CODING/Projects/new%20sih2026/docs/01-product/PRD.md).
2. **Architecture Assessment:** Verify service boundary impact in [SYSTEM_ARCHITECTURE.md](file:///e:/CODING/Projects/new%20sih2026/docs/02-architecture/SYSTEM_ARCHITECTURE.md) and [BACKEND_ARCHITECTURE.md](file:///e:/CODING/Projects/new%20sih2026/docs/02-architecture/BACKEND_ARCHITECTURE.md).
3. **Data Integrity:** Update entity models in [DATABASE_SCHEMA.md](file:///e:/CODING/Projects/new%20sih2026/docs/02-architecture/DATABASE_SCHEMA.md) and attributes in [DATA_DICTIONARY.md](file:///e:/CODING/Projects/new%20sih2026/docs/06-data/DATA_DICTIONARY.md).
4. **Contract Synchronization:** Regenerate schemas in [openapi.yaml](file:///e:/CODING/Projects/new%20sih2026/docs/03-api/openapi.yaml) and [API_SPECIFICATION.md](file:///e:/CODING/Projects/new%20sih2026/docs/03-api/API_SPECIFICATION.md).
5. **Frontend Alignment:** Update routing guards and components in [FRONTEND_ARCHITECTURE.md](file:///e:/CODING/Projects/new%20sih2026/docs/02-architecture/FRONTEND_ARCHITECTURE.md).
6. **Test Verification:** Validate automated assertions in [TESTING_STRATEGY.md](file:///e:/CODING/Projects/new%20sih2026/docs/07-development/TESTING_STRATEGY.md).


---

<a id="01-product-user_stories-md"></a>

<!-- ======================================================== -->
<!-- FILE: 01-product/USER_STORIES.md -->
<!-- ======================================================== -->

# MahaSkills — User Stories & Acceptance Criteria

**Platform:** MahaSkills · Government of Maharashtra (DSEEI / MSInS)  
**Problem Statement ID:** 26134  
**Version:** 1.0  
**Status:** Product Specification Baseline  

---

## Epic 1: Identity, Authentication & Tenant Scoping

### US-AUTH-01: Keycloak OIDC Authentication with PKCE
* **As an** authenticated official or stakeholder,  
* **I want to** log in securely via Keycloak using standard OIDC with PKCE,  
* **So that** my credentials and state administrative actions are protected by state-grade security standards.

```gherkin
Scenario: Successful government official login
  Given the user is on the MahaSkills login screen
  When the user initiates login and provides valid state credentials via Keycloak
  Then the platform receives an OIDC authorization code
  And exchanges it via PKCE for a signed JWT access token containing realm roles and user scopes
  And redirects the user to their designated role dashboard
```

### US-AUTH-02: Scoped Administrative Data Isolation
* **As a** District Skill Officer for Pune,  
* **I want to** be restricted strictly to Pune district data and ITI institutions,  
* **So that** cross-district privacy, institutional confidentiality, and administrative jurisdiction are strictly maintained.

```gherkin
Scenario: Enforcing district boundary restriction
  Given a District Officer authenticated with scope "district_id=27" (Pune)
  When the officer requests placement records or district plans for district "28" (Nashik)
  Then the API Gateway intercepts the request and responds with HTTP 403 Forbidden
  And an unauthorized access event is recorded in the administrative audit log
```

---

## Epic 2: Labour Market Ingestion & Demand Analysis

### US-LMI-01: Multi-Source Job Market Signal Scraping
* **As a** DSEEI Data Analyst,  
* **I want** the platform to ingest job vacancy signals nightly from Naukri, LinkedIn, Indeed, and the NCS Portal,  
* **So that** curriculum decisions reflect live, real-time employer demand rather than multi-year survey lag.

```gherkin
Scenario: Automated nightly scraping and deduplication
  Given the scheduled Airflow DAG triggers at 02:00 IST
  When job posting records are ingested across active job portals
  Then duplicate postings matching (company, standardized_title, district, date_window) are deduplicated
  And unstandardized skill strings are queued for NLP taxonomy enrichment
  And clean records are committed to the PostgreSQL operational store
```

### US-LMI-02: Macroeconomic Demand Trend Heatmap
* **As a** DSEEI Policy Maker,  
* **I want to** view a dynamic statewide heatmap of demand intensity across all 36 districts,  
* **So that** I can instantly identify industrial clusters experiencing acute skill shortages.

```gherkin
Scenario: Visualizing statewide demand intensity
  Given a Policy Maker accesses the State Overview Dashboard
  When the Policy Maker selects the "Automotive & EV" sector filter
  Then the map of Maharashtra dynamically highlights districts by vacancy count and quarterly growth rate
  And displays comparative bar charts contrasting top in-demand skills against current trainee output
```

---

## Epic 3: Skill Taxonomy & NLP Standardization

### US-TAX-01: Unified NSQF Taxonomy Navigation
* **As an** SSC Reviewer or Training Administrator,  
* **I want to** browse the canonical hierarchy of Sectors, Job Roles, and Competency Skills,  
* **So that** curriculum adjustments align exactly with NCVET qualification files and NSQF levels.

```gherkin
Scenario: Navigating taxonomy tree
  Given a user is exploring the Skills Taxonomy module
  When the user selects "Electronics & Hardware" sector and NSQF Level 4
  Then the platform displays all published job roles (e.g., "Solar Panel Installation Technician")
  And lists associated core skills, tool proficiencies, and syllabus competency units
```

### US-TAX-02: Emerging Skill Entity Extraction
* **As a** Taxonomy Data Steward,  
* **I want** the system to automatically identify emerging skill keywords in job postings that do not yet exist in the formal NSQF catalog,  
* **So that** we can proactively initiate new curriculum modules before shortages choke industry growth.

```gherkin
Scenario: Surfacing emerging skill candidates
  Given an influx of job postings containing the term "Solid-State Battery Assembly"
  When the NLP extraction pipeline identifies this term occurring > 50 times across 3 distinct tier-1 employers
  Then the term is automatically promoted to the "Emerging Skills Review" workbench
  And flagged with an alert to the Automotive Sector Skill Council
```

---

## Epic 4: Gap Scoring Engine & Oversupply Detection

### US-GAP-01: Weekly Algorithmic Skill-Demand Gap Calculation
* **As a** District Skill Officer,  
* **I want** the platform to compute an objective 0–100 Gap Score for every skill trade in my district,  
* **So that** training resource allocation is strictly evidence-driven.

```gherkin
Scenario: Calculating district skill gap score
  Given the weekly gap scoring pipeline executes on Sunday night
  When it evaluates Pune district for "CNC Milling Machinist"
  And calculates Demand Count (1,200), Trend Multiplier (1.25), Trained Seats (600), and Historical Placement Rate (0.42)
  Then the formula normalizes the result and yields a Gap Score of 74.5/100
  And categorizes the trade as "Severe Shortage — High Priority"
```

### US-GAP-02: Automated Course Oversupply Flagging
* **As a** DSEEI Joint Secretary,  
* **I want to** be automatically alerted when an ITI trade exhibits low placement rates alongside stagnant market demand,  
* **So that** public funds are not wasted training students for non-existent jobs.

```gherkin
Scenario: Flagging redundant vocational courses
  Given an ITI trade demonstrates placement rate < 25% over 4 consecutive quarters
  And local district job postings for that role fall below the 20th percentile
  Then the system flags the trade as "Structurally Oversupplied"
  And generates a recommendation proposal to decommission or repurpose the batch capacity
```

---

## Epic 5: Curriculum Update Recommendations & Review Workflow

### US-REC-01: Automated Recommendation Proposal Generation
* **As an** SSC Technical Officer,  
* **I want** the system to automatically package an evidence dossier when a high gap persists for 8+ weeks,  
* **So that** I have all empirical market backing required to initiate a curriculum revision.

```gherkin
Scenario: Automated dossier compilation
  Given a persistent gap score > 60 for "Robotics Cell Operator" in Chhatrapati Sambhajinagar
  When the recommendation engine triggers proposal synthesis
  Then it generates a comprehensive dossier containing 12-month vacancy growth curves, hiring employers (e.g., Bajaj, Skoda), and comparable interstate curricula
  And routes the proposal to the Automotive SSC review queue with a 14-day review SLA
```

### US-REC-02: Multi-Tier Formal Curriculum Approval
* **As a** DSEEI Policy Approver,  
* **I want to** review SSC-validated curriculum adjustments and formally approve them for statewide publication,  
* **So that** ITI syllabi are legally synchronized and notified across all institutes.

```gherkin
Scenario: Approving curriculum modification
  Given an SSC Reviewer has attached an updated competency unit draft and approved a recommendation
  When the DSEEI Approver reviews the evidence package and signs off with an administrative digital signature
  Then the recommendation status advances to "Published"
  And notifications are dispatched to all relevant ITI Principals and District Officers
```

---

## Epic 6: Employer Engagement & Structured Needs Ingestion

### US-EMP-01: Enterprise Registration & GSTIN Verification
* **As an** Industrial Employer HR Director,  
* **I want to** register our company using our GSTIN and Aadhaar-based OTP verification,  
* **So that** our talent demands directly influence government vocational training.

```gherkin
Scenario: Verified employer onboarding
  Given an employer enters GSTIN "27AAAAA0000A1Z5"
  When the system queries the GST API and validates registered legal name and manufacturing address
  Then an authorized corporate account is created
  And the employer gains immediate access to post skill needs and participate in curriculum reviews
```

### US-EMP-02: Structured Skill Needs Submission
* **As an** Employer,  
* **I want to** specify upcoming quarterly hiring needs by trade, required skills, and headcount,  
* **So that** local ITIs can prepare batches specifically matched to our hiring timelines.

```gherkin
Scenario: Submitting quarterly skill requirement
  Given a verified employer accesses the Skill Needs portal
  When the employer selects "Tool & Die Maker", specifies 45 openings in Kolhapur, and sets urgency to "Immediate (30-60 days)"
  Then the requirement is incorporated into the Kolhapur District Skill Demand model
  And nearby ITIs receive an aggregated notification of upcoming local industrial demand
```

---

## Epic 7: ITI Placement Returns & Institutional Benchmarking

### US-PLA-01: Monthly Placement Return CSV Upload
* **As an** ITI Principal,  
* **I want to** upload our monthly student placement return via a standardized CSV template,  
* **So that** our institute meets compliance mandates and contributes to accurate gap calculations.

```gherkin
Scenario: Uploading placement returns with error validation
  Given an ITI Principal uploads a monthly CSV file with 120 placement records
  When the validation worker processes the file
  Then it verifies all mandatory fields (anonymized_id, trade_code, employer_name, salary)
  And flags 3 rows containing invalid salary formats with exact line numbers
  And allows the Principal to fix and re-commit the validated batch atomically
```

### US-PLA-02: Candidate Anonymization & DPDP 2023 Compliance
* **As a** Government Data Protection Officer,  
* **I want** all student placement submissions to utilize irreversible one-way salted hashes for student IDs,  
* **So that** candidate PII is never stored or exposed in the central intelligence warehouse.

```gherkin
Scenario: Enforcing student PII anonymization
  Given an uploaded CSV containing student roll numbers or identity markers
  When the ingestion pipeline ingests the record
  Then it applies an HMAC-SHA256 hash using an isolated tenant salt
  And purges the raw identifier from memory before database persistence
```

---

## Epic 8: District Training Plans & Infrastructure Audits

### US-DTP-01: Automated Annual District Training Plan Generation
* **As a** District Skill Officer,  
* **I want** the system to auto-generate an Annual District Training Plan synthesizing local industrial demand and ITI capacities,  
* **So that** our district's training targets are directly aligned with economic growth.

```gherkin
Scenario: Generating district training plan
  Given it is the annual planning cycle (April)
  When the District Officer clicks "Generate District Plan for FY 2026-27"
  Then the system compiles recommended course intakes across all district ITIs
  And calculates target placement counts, required trainer upskilling quotas, and budget estimates
  And allows the District Officer to fine-tune seat allocations before final submission
```

### US-DTP-02: ITI Equipment Gap & Capital Expenditure Auditing
* **As a** DVET Director,  
* **I want** the platform to cross-reference course syllabus equipment requirements against actual ITI asset registers,  
* **So that** capital modernization grants are allocated strictly where machinery deficits prevent practical training.

```gherkin
Scenario: Flagging equipment deficits
  Given an ITI proposes to introduce an "EV Powertrain Diagnostics" course
  When the system compares the NCVET mandatory equipment list with the ITI's uploaded asset register
  Then it flags missing diagnostic scanners and battery safety rigs
  And estimates a capital deficit of ₹14.5 Lakhs in the District Training Plan budget section
```

---

## Epic 9: Candidate Guidance, Pathway Quiz & Mahaswayam SSO

### US-CAN-01: Transparent Course Search with Verified Outcomes
* **As a** Prospective Trainee,  
* **I want to** search vocational courses and view verified median salaries and average time-to-hire,  
* **So that** I can make informed educational investments backed by real government data.

```gherkin
Scenario: Exploring course placement outcomes
  Given a candidate searches for "Electrician" in Nashik
  When the search results are rendered
  Then each course card clearly displays: 72% Verified Placement Rate, ₹22,500 Median Starting Salary, and 45-day Average Time-to-Placement
  And displays badges for "High Local Demand" and "State Scholarship Eligible"
```

### US-CAN-02: Adaptive 5-Question Career Pathway Quiz
* **As a** Rural Candidate seeking career guidance,  
* **I want to** answer 5 simple questions in Marathi about my education, interests, and relocation preferences,  
* **So that** the platform recommends the top 3 best-fitting vocational courses for me.

```gherkin
Scenario: Completing career pathway assessment
  Given a candidate accesses the Pathway Quiz in Marathi
  When the candidate completes questions regarding 10th pass status, mechanical interest, and Pune proximity
  Then the algorithm ranks and displays the top 3 recommended trades with detailed reasoning
  And provides a direct "Enroll via Mahaswayam" action button
```

---

## Epic 10: Platform Administration, Observability & DPDP Compliance

### US-ADM-01: Comprehensive Security Audit Trail
* **As a** System Auditor,  
* **I want** every administrative update, curriculum signoff, and user role modification to be recorded in an immutable audit log,  
* **So that** the platform satisfies strict state IT audit compliance.

```gherkin
Scenario: Recording administrative actions
  Given an Admin modifies a user's district assignment
  When the change is committed
  Then an immutable audit entry is appended with timestamp, actor_id, IP address, previous state, and updated state
```


---

<a id="02-architecture-architecture_decisions-md"></a>

<!-- ======================================================== -->
<!-- FILE: 02-architecture/ARCHITECTURE_DECISIONS.md -->
<!-- ======================================================== -->

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


---

<a id="02-architecture-backend_architecture-md"></a>

<!-- ======================================================== -->
<!-- FILE: 02-architecture/BACKEND_ARCHITECTURE.md -->
<!-- ======================================================== -->

# MahaSkills — Backend Architecture Specification

**Platform:** MahaSkills · Government of Maharashtra (DSEEI / MSInS)  
**Problem Statement ID:** 26134  
**Version:** 1.0  
**Status:** Canonical Backend Architecture Baseline  

---

## 1. Architectural Style & Tech Stack

MahaSkills implements a high-performance **modular monolith** evolving into domain-isolated microservices. The backend combines the asynchronous high-concurrency capabilities of **Python FastAPI** (for the core API, ML analytics, and recommendation workflows) with **Apache Airflow** and **Celery** (for asynchronous data pipelines and background tasks).

```text
               ┌────────────────────────────────────────────────────────┐
               │              API Gateway (Kong / Nginx)                │
               └───────────────────────────┬────────────────────────────┘
                                           │
 ┌─────────────────────────────────────────┼─────────────────────────────────────────┐
 │                                         ▼                                         │
 │                      FastAPI Modular Application Server                           │
 │  ┌─────────────────────────────────────────────────────────────────────────────┐  │
 │  │ Domain Routers: /v1/auth, /v1/lmi, /v1/gap-scores, /v1/recommendations, ...  │  │
 │  └──────────────────────────────────────┬──────────────────────────────────────┘  │
 │                                         ▼                                         │
 │  ┌─────────────────────────────────────────────────────────────────────────────┐  │
 │  │ Cross-Cutting Middleware: Keycloak JWT, TenantScope, RateLimiter, AuditLog  │  │
 │  └──────────────────────────────────────┬──────────────────────────────────────┘  │
 │                                         ▼                                         │
 │  ┌─────────────────────────────────────────────────────────────────────────────┐  │
 │  │ Service Domain Layer:                                                       │  │
 │  │  • AuthService        • TaxonomyService   • LmiAnalyticsService             │  │
 │  │  • GapScoringService  • WorkflowService   • DistrictPlanService             │  │
 │  │  • PlacementService   • EmployerService   • CandidateGuidanceService        │  │
 │  └──────────────────────────────────────┬──────────────────────────────────────┘  │
 │                                         ▼                                         │
 │  ┌─────────────────────────────────────────────────────────────────────────────┐  │
 │  │ Persistence Layer (SQLAlchemy 2.0 Async + asyncpg connection pool)          │  │
 │  └─────────────────────────────────────────────────────────────────────────────┘  │
 └─────────────────────────────────────────┬─────────────────────────────────────────┘
                                           │
 ┌─────────────────────────────────────────┴─────────────────────────────────────────┐
 │ Asynchronous Worker Fleet (Celery 5.3 + Redis 7 Broker + Apache Airflow 2.8)      │
 │  • nightly_job_scraper_dag      • validate_placement_batch_task                   │
 │  • weekly_gap_recalculation_dag • compile_recommendation_dossier_task             │
 └───────────────────────────────────────────────────────────────────────────────────┘
```

---

## 2. Domain Services & Responsibilities

### 2.1 Identity & Scoping Service (`app.services.auth`)
* **Keycloak Integration:** Decodes and validates RS256 JWT tokens against Keycloak JWKS (`/auth/realms/mahaskills/protocol/openid-connect/certs`).
* **Tenant Scoping Guard:** Injects security context into request dependency injection:
  ```python
  class SecurityContext:
      user_id: UUID
      roles: list[str]
      district_id: Optional[int]    # Set for DISTRICT_OFFICER, ITI_PRINCIPAL
      institute_id: Optional[UUID]   # Set for ITI_PRINCIPAL
      sector_ids: list[int]          # Set for SSC_REVIEWER
  ```

### 2.2 Skill Taxonomy Service (`app.services.taxonomy`)
* Maintains standardized hierarchies across 33 sectors, 36 SSCs, ~2,200 NSQF-aligned job roles, and over 15,000 discrete skills.
* Integrates spaCy/Transformers entity extraction pipeline to parse raw job posting strings into standardized skill nodes.
* Manages an "Emerging Skills" staging pool for novel market technologies not yet codified into official NCVET qualifications.

### 2.3 Algorithmic Gap Scoring Engine (`app.services.gap_scoring`)

The Gap Scoring Engine executes the core business logic defining labour-market misalignment:

#### Mathematical Formulation
For any given tuple $(\text{District } d, \text{Sector } s, \text{Job Role } r, \text{NSQF Level } l)$:

$$\text{Gross Demand} = \sum_{p \in \text{Postings}} w(p.\text{date}) \cdot p.\text{vacancies} + \sum_{n \in \text{SkillNeeds}} n.\text{headcount} \cdot u(n.\text{urgency})$$

where $w(t) = e^{-\lambda t}$ represents temporal decay and $u(\text{urgency}) \in \{1.5 \text{ (immediate)}, 1.0 \text{ (quarterly)}, 0.5 \text{ (future)}\}$.

$$\text{Effective Supply} = \sum_{c \in \text{Courses}(r, d)} c.\text{intake\_capacity} \cdot \bar{P}_{c}$$

where $\bar{P}_c$ represents the 3-year historical average placement rate for course $c$.

$$\text{Raw Gap} = \text{Gross Demand} - \text{Effective Supply}$$

$$\text{Normalized Gap Score} = \min\left(100, \max\left(0, \frac{\text{Raw Gap}}{\text{ScalingFactor}(s)} \times 100\right)\right)$$

#### Oversupply Flagging Algorithm
A course $c$ is automatically flagged as **Structurally Oversupplied** when:
$$\bar{P}_{c} < 0.25 \quad \text{AND} \quad \text{Percentile}_{\text{district}}(\text{Gross Demand}) < 20$$
sustained across $\ge 2$ consecutive quarterly reporting cycles.

---

### 2.4 Curriculum Recommendation & Dossier Compiler (`app.services.recommendation`)

#### Recommendation Trigger Condition
A formal recommendation proposal is generated automatically when:
$$\text{Gap Score}(d, s, r) \ge 60 \quad \text{sustained for } \ge 8 \text{ consecutive weekly calculations}$$
AND no existing active course syllabus in district $d$ covers the required emerging skills.

#### Automated Dossier Compilation
When triggered, a Celery worker compiles an immutable evidence package comprising:
1. **Demand Trajectory:** 12-month historical job vacancy counts and quarterly growth vectors.
2. **Key Hiring Employers:** Top 5 industrial employers hiring for the skill profile within a 150 km radius.
3. **Interstate Syllabus Benchmarks:** Cross-references with curricula from Karnataka, Tamil Nadu, and Gujarat state skill councils.
4. **Projected Impact:** Estimated placement uplift ($\Delta \ge 24\%$) based on unfilled vacancy counts.

#### Workflow State Machine
```mermaid
stateDiagram-v2
    [*] --> DRAFT: Trigger Threshold Met
    DRAFT --> UNDER_SSC_REVIEW: PMO Assigns to SSC
    UNDER_SSC_REVIEW --> SSC_REVISIONS_REQUESTED: SSC Requests More Evidence
    SSC_REVISIONS_REQUESTED --> UNDER_SSC_REVIEW: Revisions Provided
    UNDER_SSC_REVIEW --> SSC_APPROVED: SSC Technical Committee Approves
    UNDER_SSC_REVIEW --> REJECTED: SSC Deems Unviable
    SSC_APPROVED --> DSEEI_FINAL_APPROVAL: Forwarded to Joint Secretary
    DSEEI_FINAL_APPROVAL --> PUBLISHED: Official Digital Sanction
    DSEEI_FINAL_APPROVAL --> REJECTED: Sanction Denied
    PUBLISHED --> [*]
```

---

### 2.5 Placement Ingestion & Validation Pipeline (`app.services.placement`)

Handles high-volume monthly placement returns from ITI principals:
1. **Streaming Parsing:** Uses Python `ijson` / streaming CSV reader to process files up to 100MB without memory exhaustion.
2. **Validation Rules:**
   * Valid `candidate_hash` format (SHA-256 hex string).
   * `course_id` exists in institute's active sanctioned courses.
   * `salary` $\ge \text{Minimum Wage (Maharashtra Zone 1/2)}$ and $\le ₹2,00,000/\text{month}$.
   * `batch_year` within valid reporting windows ($T-2$ to $T$).
3. **Atomic Commit:** Validation errors are captured line-by-line. If error count exceeds 0, the batch is set to `REJECTED`, error entries are written to `placement_validation_errors`, and zero raw placement records are committed.

---

## 3. Asynchronous Pipeline Schedules (Apache Airflow)

| DAG ID | Schedule | Trigger / Input | Target Output | SLA |
|:---|:---|:---|:---|:---|
| `lmi_nightly_job_scraping` | `0 2 * * *` (02:00 IST) | Naukri, LinkedIn, Indeed, NCS | `raw_job_postings`, `clean_job_postings` | $\le 120\text{ mins}$ |
| `taxonomy_nlp_enrichment` | `0 4 * * *` (04:00 IST) | New unmapped job posting skills | `skill_synonyms`, `emerging_skills` | $\le 60\text{ mins}$ |
| `weekly_gap_score_computation`| `0 1 * * 0` (Sun 01:00) | 7-day LMI + Placement returns | `gap_scores`, `gap_score_history` | $\le 45\text{ mins}$ |
| `recommendation_trigger_audit`| `0 3 * * 0` (Sun 03:00) | Updated gap score tables | `recommendations` (status=DRAFT) | $\le 15\text{ mins}$ |
| `quarterly_oversupply_audit` | `0 0 1 1,4,7,10 *` | 2-quarter placement & demand | `oversupply_alerts` | $\le 30\text{ mins}$ |

---

## 4. Database Connection & Transaction Management

* **Connection Pool:** SQLAlchemy 2.0 async engine powered by `asyncpg` with:
  * `pool_size = 25` per API worker.
  * `max_overflow = 15`.
  * `pool_recycle = 1800` (recycle connections every 30 minutes).
  * `pool_pre_ping = True` (health-check connections before checkout).
* **Transaction Isolation:** Read Committed (Postgres default) for analytical queries; Repeatable Read for financial/budget allocations and multi-step curriculum signoff transitions.


---

<a id="02-architecture-database_schema-md"></a>

<!-- ======================================================== -->
<!-- FILE: 02-architecture/DATABASE_SCHEMA.md -->
<!-- ======================================================== -->

# MahaSkills — Database Schema & DDL Specification

**Platform:** MahaSkills · Government of Maharashtra (DSEEI / MSInS)  
**Database Engine:** PostgreSQL 16  
**Problem Statement ID:** 26134  
**Version:** 1.0  
**Status:** Canonical Database Schema Baseline  

---

## 1. Entity-Relationship Diagram (ERD)

```mermaid
erDiagram
    DISTRICTS ||--o{ INSTITUTES : contains
    DISTRICTS ||--o{ GAP_SCORES : computes_for
    DISTRICTS ||--o{ DISTRICT_PLANS : formulates
    DISTRICTS ||--o{ JOB_POSTINGS : localized_in

    SECTORS ||--o{ SSCS : governed_by
    SECTORS ||--o{ JOB_ROLES : categorizes
    SSCS ||--o{ RECOMMENDATIONS : reviews

    JOB_ROLES ||--o{ JOB_ROLE_SKILLS : requires
    SKILLS ||--o{ JOB_ROLE_SKILLS : linked_to
    JOB_ROLES ||--o{ COURSES : aligns_to
    COURSES ||--o{ COURSE_SKILLS : teaches
    SKILLS ||--o{ COURSE_SKILLS : taught_by

    INSTITUTES ||--o{ INSTITUTE_COURSES : offers
    COURSES ||--o{ INSTITUTE_COURSES : offered_at
    INSTITUTES ||--o{ PLACEMENT_BATCHES : uploads
    PLACEMENT_BATCHES ||--o{ PLACEMENT_RECORDS : contains
    PLACEMENT_BATCHES ||--o{ PLACEMENT_VALIDATION_ERRORS : flags

    EMPLOYERS ||--o{ SKILL_NEEDS : submits
    SKILL_NEEDS ||--o{ SKILL_NEED_ITEMS : details
    SKILLS ||--o{ SKILL_NEED_ITEMS : specifies

    JOB_ROLES ||--o{ GAP_SCORES : evaluated_in
    GAP_SCORES ||--o{ RECOMMENDATIONS : triggers
    RECOMMENDATIONS ||--o{ RECOMMENDATION_EVIDENCE : bundles
    RECOMMENDATIONS ||--o{ RECOMMENDATION_AUDITS : logs

    DISTRICT_PLANS ||--o{ DISTRICT_PLAN_ITEMS : contains
    COURSES ||--o{ DISTRICT_PLAN_ITEMS : targets

    USERS ||--o{ USER_ROLES : assigned
    USERS ||--o{ AUDIT_LOGS : performs
```

---

## 2. Core Relational Tables & PostgreSQL DDL

### 2.1 Geographic & Administrative Foundations

```sql
-- 36 Administrative Districts of Maharashtra
CREATE TABLE districts (
    id SERIAL PRIMARY KEY,
    code VARCHAR(10) UNIQUE NOT NULL,              -- e.g. "MH-PU", "MH-NS"
    name_en VARCHAR(100) NOT NULL,
    name_mr VARCHAR(100) NOT NULL,
    division VARCHAR(50) NOT NULL,                 -- Pune, Nashik, Konkan, etc.
    latitude NUMERIC(9, 6) NOT NULL,
    longitude NUMERIC(9, 6) NOT NULL,
    is_active BOOLEAN DEFAULT TRUE NOT NULL,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL
);

CREATE INDEX idx_districts_division ON districts(division);
```

---

### 2.2 Taxonomy: Sectors, SSCs, Job Roles & Skills

```sql
-- 33 Economic Sectors
CREATE TABLE sectors (
    id SERIAL PRIMARY KEY,
    code VARCHAR(20) UNIQUE NOT NULL,              -- e.g. "AUTO", "IT_ITES"
    name_en VARCHAR(150) NOT NULL,
    name_mr VARCHAR(150) NOT NULL,
    description TEXT,
    is_active BOOLEAN DEFAULT TRUE NOT NULL,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL
);

-- 36 Sector Skill Councils (SSCs)
CREATE TABLE sscs (
    id SERIAL PRIMARY KEY,
    code VARCHAR(30) UNIQUE NOT NULL,              -- e.g. "ASDC", "NASSCOM"
    name VARCHAR(200) NOT NULL,
    sector_id INT NOT NULL REFERENCES sectors(id) ON DELETE RESTRICT,
    contact_email VARCHAR(255) NOT NULL,
    portal_url VARCHAR(255),
    is_active BOOLEAN DEFAULT TRUE NOT NULL,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL
);

-- ~2,200 NSQF-Aligned Job Roles
CREATE TABLE job_roles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    sector_id INT NOT NULL REFERENCES sectors(id) ON DELETE RESTRICT,
    ssc_id INT REFERENCES sscs(id) ON DELETE SET NULL,
    qp_code VARCHAR(50) UNIQUE NOT NULL,           -- Qualification Pack Code e.g. "ASC/Q1402"
    title_en VARCHAR(200) NOT NULL,
    title_mr VARCHAR(200) NOT NULL,
    nsqf_level INT NOT NULL CHECK (nsqf_level BETWEEN 1 AND 10),
    description TEXT,
    version VARCHAR(20) DEFAULT '1.0' NOT NULL,
    is_active BOOLEAN DEFAULT TRUE NOT NULL,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL
);

CREATE INDEX idx_job_roles_sector_nsqf ON job_roles(sector_id, nsqf_level);

-- Competency Skills
CREATE TABLE skills (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    sector_id INT NOT NULL REFERENCES sectors(id) ON DELETE RESTRICT,
    name_en VARCHAR(150) NOT NULL,
    name_mr VARCHAR(150) NOT NULL,
    skill_type VARCHAR(50) NOT NULL,               -- 'TECHNICAL', 'OPERATIONAL', 'SOFT'
    is_emerging BOOLEAN DEFAULT FALSE NOT NULL,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL
);

CREATE UNIQUE INDEX uq_skills_name_sector ON skills(lower(name_en), sector_id);

-- Job Role ↔ Skill Mapping
CREATE TABLE job_role_skills (
    job_role_id UUID NOT NULL REFERENCES job_roles(id) ON DELETE CASCADE,
    skill_id UUID NOT NULL REFERENCES skills(id) ON DELETE CASCADE,
    is_mandatory BOOLEAN DEFAULT TRUE NOT NULL,
    proficiency_level VARCHAR(30) DEFAULT 'INTERMEDIATE' NOT NULL,
    PRIMARY KEY (job_role_id, skill_id)
);
```

---

### 2.3 Training Institutes & Vocational Courses

```sql
-- ITIs & Polytechnics across Maharashtra
CREATE TABLE institutes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    mis_code VARCHAR(50) UNIQUE NOT NULL,          -- Government MIS Registration Code
    name VARCHAR(255) NOT NULL,
    district_id INT NOT NULL REFERENCES districts(id) ON DELETE RESTRICT,
    taluka VARCHAR(100) NOT NULL,
    institute_type VARCHAR(50) NOT NULL,           -- 'GOVT_ITI', 'PVT_ITI', 'POLYTECHNIC'
    address TEXT NOT NULL,
    pincode VARCHAR(6) NOT NULL,
    principal_name VARCHAR(150) NOT NULL,
    principal_email VARCHAR(255) NOT NULL,
    principal_phone VARCHAR(20) NOT NULL,
    is_active BOOLEAN DEFAULT TRUE NOT NULL,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL
);

CREATE INDEX idx_institutes_district ON institutes(district_id);

-- Vocational Courses (Trades)
CREATE TABLE courses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    job_role_id UUID NOT NULL REFERENCES job_roles(id) ON DELETE RESTRICT,
    course_code VARCHAR(50) UNIQUE NOT NULL,       -- e.g. "CTS-ELE-01"
    title_en VARCHAR(200) NOT NULL,
    title_mr VARCHAR(200) NOT NULL,
    duration_months INT NOT NULL CHECK (duration_months > 0),
    nsqf_level INT NOT NULL CHECK (nsqf_level BETWEEN 1 AND 10),
    tuition_fee_inr NUMERIC(10, 2) DEFAULT 0.00 NOT NULL,
    curriculum_version VARCHAR(20) DEFAULT '1.0' NOT NULL,
    status VARCHAR(30) DEFAULT 'ACTIVE' NOT NULL,  -- 'ACTIVE', 'UNDER_REVIEW', 'RETIRED'
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL
);

-- Institute Course Sanctions & Capacity
CREATE TABLE institute_courses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    institute_id UUID NOT NULL REFERENCES institutes(id) ON DELETE CASCADE,
    course_id UUID NOT NULL REFERENCES courses(id) ON DELETE RESTRICT,
    sanctioned_intake INT NOT NULL CHECK (sanctioned_intake > 0),
    enrolled_count INT DEFAULT 0 NOT NULL,
    academic_year VARCHAR(9) NOT NULL,             -- e.g. "2025-2026"
    is_active BOOLEAN DEFAULT TRUE NOT NULL,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL,
    UNIQUE(institute_id, course_id, academic_year)
);
```

---

### 2.4 Placement Ingestion & Outcomes (DPDP 2023 Compliant)

```sql
-- Monthly Placement Ingestion Batches
CREATE TABLE placement_batches (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    institute_id UUID NOT NULL REFERENCES institutes(id) ON DELETE RESTRICT,
    academic_year VARCHAR(9) NOT NULL,
    batch_month INT NOT NULL CHECK (batch_month BETWEEN 1 AND 12),
    file_name VARCHAR(255) NOT NULL,
    s3_object_key VARCHAR(500) NOT NULL,
    total_records INT DEFAULT 0 NOT NULL,
    valid_records INT DEFAULT 0 NOT NULL,
    error_records INT DEFAULT 0 NOT NULL,
    status VARCHAR(30) DEFAULT 'PENDING' NOT NULL, -- 'PENDING', 'VALIDATING', 'COMPLETED', 'REJECTED'
    uploaded_by UUID NOT NULL,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL
);

-- Validated Placement Records (Partitioned by batch_year)
CREATE TABLE placement_records (
    id UUID DEFAULT gen_random_uuid(),
    batch_id UUID NOT NULL REFERENCES placement_batches(id) ON DELETE CASCADE,
    institute_id UUID NOT NULL REFERENCES institutes(id) ON DELETE RESTRICT,
    course_id UUID NOT NULL REFERENCES courses(id) ON DELETE RESTRICT,
    candidate_hash VARCHAR(64) NOT NULL,           -- HMAC-SHA256 Anonymized Candidate ID
    batch_year INT NOT NULL,
    is_placed BOOLEAN NOT NULL,
    employer_name VARCHAR(200),
    job_role_title VARCHAR(200),
    monthly_salary NUMERIC(10, 2),
    months_to_placement INT,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL,
    PRIMARY KEY (id, batch_year)
) PARTITION BY RANGE (batch_year);

-- Create initial partitions
CREATE TABLE placement_records_2024 PARTITION OF placement_records
    FOR VALUES FROM (2024) TO (2025);
CREATE TABLE placement_records_2025 PARTITION OF placement_records
    FOR VALUES FROM (2025) TO (2026);
CREATE TABLE placement_records_2026 PARTITION OF placement_records
    FOR VALUES FROM (2026) TO (2027);

CREATE INDEX idx_placement_lookup ON placement_records(institute_id, course_id, is_placed);

-- Row-Level Ingestion Validation Errors
CREATE TABLE placement_validation_errors (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    batch_id UUID NOT NULL REFERENCES placement_batches(id) ON DELETE CASCADE,
    row_number INT NOT NULL,
    column_name VARCHAR(100) NOT NULL,
    rejected_value TEXT,
    error_code VARCHAR(50) NOT NULL,
    error_message_en TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL
);

CREATE INDEX idx_validation_batch ON placement_validation_errors(batch_id);
```

---

### 2.5 Labour Market Signals & Gap Scoring

```sql
-- Ingested Job Vacancies (Partitioned by created_at)
CREATE TABLE job_postings (
    id UUID DEFAULT gen_random_uuid(),
    source_portal VARCHAR(50) NOT NULL,            -- 'NAUKRI', 'LINKEDIN', 'INDEED', 'NCS'
    external_job_id VARCHAR(150) NOT NULL,
    title VARCHAR(255) NOT NULL,
    district_id INT REFERENCES districts(id) ON DELETE SET NULL,
    job_role_id UUID REFERENCES job_roles(id) ON DELETE SET NULL,
    company_name VARCHAR(255) NOT NULL,
    vacancies_count INT DEFAULT 1 NOT NULL,
    salary_min NUMERIC(10, 2),
    salary_max NUMERIC(10, 2),
    raw_skills_text TEXT,
    posted_date DATE NOT NULL,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL,
    PRIMARY KEY (id, created_at)
) PARTITION BY RANGE (created_at);

-- Gap Scores Computed Weekly
CREATE TABLE gap_scores (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    district_id INT NOT NULL REFERENCES districts(id) ON DELETE CASCADE,
    sector_id INT NOT NULL REFERENCES sectors(id) ON DELETE CASCADE,
    job_role_id UUID NOT NULL REFERENCES job_roles(id) ON DELETE CASCADE,
    nsqf_level INT NOT NULL,
    demand_count INT NOT NULL,
    trained_capacity INT NOT NULL,
    placement_rate NUMERIC(5, 2) NOT NULL,
    gap_score NUMERIC(5, 2) NOT NULL CHECK (gap_score BETWEEN 0.00 AND 100.00),
    severity_level VARCHAR(30) NOT NULL,           -- 'LOW', 'MODERATE', 'HIGH', 'CRITICAL'
    calculation_date DATE NOT NULL,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL,
    UNIQUE(district_id, job_role_id, calculation_date)
);

CREATE INDEX idx_gap_heatmap ON gap_scores(district_id, sector_id, gap_score DESC);
```

---

### 2.6 Curriculum Recommendations & Governance

```sql
-- Curriculum Modification Recommendations
CREATE TABLE recommendations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    recommendation_code VARCHAR(30) UNIQUE NOT NULL, -- e.g. "REC-2026-0042"
    job_role_id UUID NOT NULL REFERENCES job_roles(id) ON DELETE RESTRICT,
    district_id INT NOT NULL REFERENCES districts(id) ON DELETE RESTRICT,
    recommendation_type VARCHAR(50) NOT NULL,        -- 'ADD_MODULE', 'UPDATE_UNIT', 'NEW_QUALIFICATION', 'RETIRE_COURSE'
    title_en VARCHAR(255) NOT NULL,
    rationale_en TEXT NOT NULL,
    status VARCHAR(50) DEFAULT 'DRAFT' NOT NULL,     -- 'DRAFT', 'UNDER_SSC_REVIEW', 'SSC_REVISIONS_REQUESTED', 'SSC_APPROVED', 'DSEEI_FINAL_APPROVAL', 'PUBLISHED', 'REJECTED'
    assigned_ssc_id INT REFERENCES sscs(id),
    current_assignee_id UUID,
    submitted_at TIMESTAMPTZ,
    published_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL
);

CREATE INDEX idx_recommendations_status ON recommendations(status, assigned_ssc_id);

-- Recommendation Evidence Dossiers
CREATE TABLE recommendation_evidence (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    recommendation_id UUID NOT NULL REFERENCES recommendations(id) ON DELETE CASCADE,
    evidence_type VARCHAR(50) NOT NULL,              -- 'DEMAND_TREND_SERIES', 'TOP_HIRING_EMPLOYERS', 'INTERSTATE_BENCHMARK'
    payload JSONB NOT NULL,
    dossier_pdf_s3_key VARCHAR(500),
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL
);

-- Audit History for Curriculum Approvals
CREATE TABLE recommendation_audits (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    recommendation_id UUID NOT NULL REFERENCES recommendations(id) ON DELETE CASCADE,
    from_status VARCHAR(50) NOT NULL,
    to_status VARCHAR(50) NOT NULL,
    performed_by UUID NOT NULL,
    comments TEXT,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL
);
```

---

### 2.7 District Training Plans & Infrastructure Audits

```sql
-- Annual & 3-Year District Training Plans
CREATE TABLE district_plans (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    district_id INT NOT NULL REFERENCES districts(id) ON DELETE RESTRICT,
    fiscal_year VARCHAR(9) NOT NULL,                 -- e.g. "2026-2027"
    plan_type VARCHAR(30) DEFAULT 'ANNUAL' NOT NULL, -- 'ANNUAL', 'THREE_YEAR'
    status VARCHAR(30) DEFAULT 'DRAFT' NOT NULL,     -- 'DRAFT', 'SUBMITTED', 'APPROVED', 'SANCTIONED'
    total_target_intake INT DEFAULT 0 NOT NULL,
    total_projected_placements INT DEFAULT 0 NOT NULL,
    total_estimated_budget NUMERIC(14, 2) DEFAULT 0.00 NOT NULL,
    created_by UUID NOT NULL,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL,
    UNIQUE(district_id, fiscal_year, plan_type)
);

-- Course-Level Items in District Plan
CREATE TABLE district_plan_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    plan_id UUID NOT NULL REFERENCES district_plans(id) ON DELETE CASCADE,
    course_id UUID NOT NULL REFERENCES courses(id) ON DELETE RESTRICT,
    target_intake INT NOT NULL CHECK (target_intake > 0),
    target_placement_rate NUMERIC(5, 2) NOT NULL,
    trainer_upskilling_quota INT DEFAULT 0 NOT NULL,
    equipment_capex_required NUMERIC(12, 2) DEFAULT 0.00 NOT NULL,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL
);
```

---

### 2.8 Users, Roles & Immutable System Audit Logs

```sql
-- Platform User Accounts (Synchronized with Keycloak sub)
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    keycloak_sub VARCHAR(100) UNIQUE NOT NULL,       -- OIDC Subject Identifier
    email VARCHAR(255) UNIQUE NOT NULL,
    full_name VARCHAR(150) NOT NULL,
    phone_number VARCHAR(20),
    is_active BOOLEAN DEFAULT TRUE NOT NULL,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL
);

-- User Scope Scoping (District / Institute / Sector constraints)
CREATE TABLE user_scopes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    role_name VARCHAR(50) NOT NULL,                  -- 'POLICY_MAKER', 'DISTRICT_OFFICER', etc.
    district_id INT REFERENCES districts(id) ON DELETE CASCADE,
    institute_id UUID REFERENCES institutes(id) ON DELETE CASCADE,
    sector_id INT REFERENCES sectors(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL
);

-- Immutable Security & Operational Audit Log
CREATE TABLE audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    actor_id UUID REFERENCES users(id) ON DELETE SET NULL,
    actor_role VARCHAR(50) NOT NULL,
    ip_address INET,
    action VARCHAR(100) NOT NULL,                    -- e.g. "RECOMMENDATION_APPROVED", "BATCH_UPLOADED"
    resource_type VARCHAR(100) NOT NULL,             -- e.g. "recommendation", "placement_batch"
    resource_id VARCHAR(100) NOT NULL,
    old_values JSONB,
    new_values JSONB,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL
);

CREATE INDEX idx_audit_resource ON audit_logs(resource_type, resource_id, created_at DESC);
```


---

<a id="02-architecture-frontend_architecture-md"></a>

<!-- ======================================================== -->
<!-- FILE: 02-architecture/FRONTEND_ARCHITECTURE.md -->
<!-- ======================================================== -->

# MahaSkills — Frontend Architecture Specification

**Platform:** MahaSkills · Government of Maharashtra (DSEEI / MSInS)  
**Problem Statement ID:** 26134  
**Primary Tech Stack:** React 18, TypeScript, Vite, Tailwind CSS, shadcn/ui, TanStack Query v5, Zustand, `react-i18next`  
**Version:** 1.0  
**Status:** Canonical Frontend Architecture Baseline  

---

## 1. Architectural Principles & Shell Topology

The MahaSkills frontend is structured around **three distinct layout shells**, ensuring security isolation, accessibility, and clean user experience:

```mermaid
graph TD
    App[MahaSkills Client Application] --> Router[React Router v6]
    Router --> PublicShell[1. Public Shell: Unauthenticated]
    Router --> AppShell[2. App Shell: Authenticated Stakeholders]
    Router --> CandidateShell[3. Candidate Shell: Trainee Guidance]

    PublicShell --> LandingPage[Landing / Public Home]
    PublicShell --> PublicCourseFinder[Course Search & Details]
    PublicShell --> PublicPathway[Pathway Assessment Quiz]

    AppShell --> DSEEIDashboard[Policy Maker Dashboard]
    AppShell --> DistrictDashboard[District Officer Portal]
    AppShell --> ITIDashboard[ITI Principal Portal]
    AppShell --> SSCWorkbench[SSC Review Workbench]
    AppShell --> EmployerPortal[Employer Portal]
    AppShell --> AdminPortal[Taxonomy & System Operations]

    CandidateShell --> CandidateDashboard[My Learning & Saved Courses]
    CandidateShell --> MahaswayamSSO[Mahaswayam Handoff]
```

### 1.1 Shell Responsibilities
1. **`PublicShell`**: Anonymous public access. No authentication required. Fast initial load, SEO-optimized static assets, trilingual toggle (Marathi, Hindi, English).
2. **`AppShell`**: Role-gated administrative interface for Government Officials, ITI Principals, SSC Reviewers, and Employers. Enforces Keycloak session guards, persistent role sidebar, breadcrumb navigation, and jurisdictional scope selector.
3. **`CandidateShell`**: Mobile-optimized, distraction-free portal for registered candidates tracking personalized pathways and Mahaswayam course enrollments.

---

## 2. State Management Architecture

MahaSkills maintains strict separation of concerns across state layers:

```text
┌────────────────────────────────────────────────────────────────────────┐
│                        Server State (Async)                            │
│  • Handled exclusively by TanStack Query v5                           │
│  • Stale-while-revalidate caching, query key factories, deduplication   │
│  • Mutation hooks with optimistic updates and cache invalidation       │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │
┌───────────────────────────────────┴────────────────────────────────────┐
│                          UI State (Client)                             │
│  • Handled by lightweight Zustand stores                               │
│  • Active language / locale (`i18nStore`)                              │
│  • Navigation collapse, theme, active drawer (`uiStore`)               │
│  • Course comparison tray (`comparisonStore`)                          │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │
┌───────────────────────────────────┴────────────────────────────────────┐
│                         URL State (Parametric)                         │
│  • Controlled via React Router query parameters (`useSearchParams`)    │
│  • Faceted filters (district, sector, nsqf_level, search keyword)      │
│  • Pagination (`page=1&limit=20`), active tabs, drawer IDs             │
└────────────────────────────────────────────────────────────────────────┘
```

---

## 3. Directory & Component Hierarchy

```text
src/
├── app/                        # Application entry, router, providers
│   ├── routes.tsx              # Central declarative route configuration
│   ├── providers.tsx           # QueryClient, KeycloakAuthProvider, I18nProvider
│   └── App.tsx                 # Root component
├── components/
│   ├── ui/                     # shadcn/ui primitives (Button, Dialog, Table, etc.)
│   ├── common/                 # Reusable cross-module widgets
│   │   ├── LanguageSwitcher.tsx
│   │   ├── ScopeIndicator.tsx
│   │   ├── DataExportButton.tsx
│   │   └── StatusBadge.tsx
│   └── layout/                 # Shells and navigation
│       ├── PublicShell.tsx
│       ├── AppShell.tsx
│       ├── CandidateShell.tsx
│       └── Header.tsx
├── features/                   # Domain-driven vertical slices
│   ├── auth/                   # Keycloak hooks, guards, token refresh
│   ├── lmi/                    # Labour market heatmap, vacancy trends
│   ├── taxonomy/               # NSQF tree viewer, role details, skill picker
│   ├── gap-scoring/            # Gap score cards, oversupply alert tables
│   ├── recommendations/        # Recommendation stepper, dossier viewer, review form
│   ├── employers/              # Skill needs authoring, survey responder
│   ├── placements/             # CSV upload dropzone, validation error grid
│   ├── district-plans/         # Plan builder, intake targets, equipment audits
│   ├── candidates/             # Course finder, 5-question pathway quiz
│   └── admin/                  # Pipeline monitor, audit log table, user management
├── hooks/                      # Shared utility hooks (useDebounce, usePermission)
├── lib/                        # Client libraries (axios client, query-keys, utils)
├── locales/                    # Externalized i18n JSON bundles (en, mr, hi)
└── types/                      # TypeScript domain models generated from OpenAPI
```

---

## 4. Query Key Factory & API Data Integration

To ensure predictable cache invalidation, all queries use centralized query-key factories:

```typescript
export const queryKeys = {
  auth: {
    me: ['auth', 'me'] as const,
    permissions: ['auth', 'permissions'] as const,
  },
  lmi: {
    aggregates: (filters: Record<string, unknown>) => ['lmi', 'aggregates', filters] as const,
    trends: (sectorId?: number) => ['lmi', 'trends', sectorId] as const,
  },
  gapScores: {
    all: ['gap-scores'] as const,
    list: (filters: Record<string, unknown>) => ['gap-scores', 'list', filters] as const,
    detail: (id: string) => ['gap-scores', 'detail', id] as const,
    oversupply: (districtId?: number) => ['gap-scores', 'oversupply', districtId] as const,
  },
  recommendations: {
    all: ['recommendations'] as const,
    list: (status?: string, sscId?: number) => ['recommendations', 'list', { status, sscId }] as const,
    detail: (id: string) => ['recommendations', 'detail', id] as const,
    dossier: (id: string) => ['recommendations', 'dossier', id] as const,
  },
  placements: {
    batches: (instituteId: string) => ['placements', 'batches', instituteId] as const,
    errors: (batchId: string) => ['placements', 'errors', batchId] as const,
  },
  districtPlans: {
    annual: (districtId: number, fiscalYear: string) => ['district-plans', districtId, fiscalYear] as const,
    equipmentGaps: (planId: string) => ['district-plans', planId, 'equipment-gaps'] as const,
  },
};
```

---

## 5. Role-Based Navigation & Access Control

Frontend access is gated across four levels:

1. **Route Level (`RoleGuard.tsx`):** Unauthenticated users are redirected to Keycloak OIDC login. Authenticated users lacking required roles receive an HTTP 403 Access Denied screen.
2. **Scope Level (`TenantScopeGuard.tsx`):** District officers cannot view routes parameterized for other districts.
3. **Component Level (`<PermissionGate>`):** Elements such as "Approve Curriculum" or "Upload CSV" are hidden or disabled if the user lacks granular action permissions.
4. **Action Level:** All form submissions verify permissions before dispatching API mutations.

---

## 6. Trilingual Internationalization (i18n)

* **Primary Language:** Marathi (`mr`) — Default for regional and candidate interfaces.
* **Secondary Languages:** Hindi (`hi`), English (`en`).
* **Zero Hardcoded Strings:** Every visual label, tooltip, table header, and error message is fetched via `useTranslation()`.
* **Font Scaling:** The layout accommodates Devanagari typography with a $+15\%$ vertical line-height buffer and dynamic font-family switching (`Noto Sans Devanagari` / `Inter`).


---

<a id="02-architecture-system_architecture-md"></a>

<!-- ======================================================== -->
<!-- FILE: 02-architecture/SYSTEM_ARCHITECTURE.md -->
<!-- ======================================================== -->

# MahaSkills — System Architecture Specification

**Platform:** MahaSkills · Government of Maharashtra (DSEEI / MSInS)  
**Problem Statement ID:** 26134  
**Version:** 1.0  
**Status:** Canonical Architectural Baseline  

---

## 1. Architectural Vision & Principles

MahaSkills is designed as an enterprise-grade, distributed, cloud-native intelligence platform. The architecture is engineered to satisfy the following foundational design principles:

1. **Traceable Evidence Loops:** Every curriculum update or budget allocation recommendation must be programmatically backed by verifiable market data trails.
2. **Strict Multi-Tenant Scoping:** Government officials, district officers, and institute principals operate within cryptographically enforced jurisdictional boundaries (`district_id`, `institute_id`).
3. **Privacy by Design (DPDP 2023):** Zero storage of unencrypted student Personally Identifiable Information (PII); placement data is anonymized at the ingestion perimeter.
4. **Resilient Asynchrony:** Intensive web crawling, NLP parsing, placement batch validation, and analytical gap recalculations are completely decoupled from user-facing synchronous API transactions.
5. **Contract-First Development:** Strict OpenAPI 3.1 contracts serve as the single source of truth for both backend service implementations and frontend client generation.

---

## 2. C4 Architecture Models

### 2.1 C4 Level 1: System Context Diagram

The System Context diagram illustrates MahaSkills in relation to external users, government systems, and data providers:

```mermaid
C4Context
    title System Context Diagram for MahaSkills Platform

    Person(public_user, "Candidate / Trainee", "Prospective student seeking verified vocational course guidance and outcomes.")
    Person(govt_official, "Government Official", "Policy makers (DSEEI) and District Officers (DSEEGC) planning vocational training.")
    Person(iti_principal, "ITI Principal", "Institutional administrator uploading placement returns and auditing equipment.")
    Person(employer, "Industry Partner / HR", "Enterprise employer providing hiring signals, skill needs, and curriculum reviews.")
    Person(ssc_reviewer, "SSC Technical Reviewer", "Sector Skill Council expert assessing curriculum recommendations.")

    System(mahaskills, "MahaSkills Platform", "Ingests market signals, models skill gaps, generates district training plans, and automates curriculum alignment.")

    System_Ext(keycloak, "Keycloak IAM", "Centralized OIDC identity provider managing authentication, realm roles, and user scopes.")
    System_Ext(mahaswayam, "Mahaswayam Portal", "State training portal for course enrollment handoff and candidate verification.")
    System_Ext(ncs_portal, "NCS Portal", "National Career Service open API providing verified job postings.")
    System_Ext(job_portals, "Job Aggregators", "Naukri, LinkedIn, and Indeed RSS providing real-time vacancy demand signals.")
    System_Ext(nsdc_ncvet, "NSDC / NCVET Portals", "National qualification registers and occupational standards repository.")

    Rel(public_user, mahaskills, "Explores courses, takes pathway quiz, initiates enrollment", "HTTPS / REST")
    Rel(govt_official, mahaskills, "Monitors gap heatmaps, approves curriculum, generates district plans", "HTTPS / REST")
    Rel(iti_principal, mahaskills, "Submits monthly placement returns, reviews trainer gaps", "HTTPS / REST")
    Rel(employer, mahaskills, "Submits skill needs, reviews draft curricula", "HTTPS / REST")
    Rel(ssc_reviewer, mahaskills, "Evaluates curriculum modification dossiers", "HTTPS / REST")

    Rel(mahaskills, keycloak, "Delegates user authentication and token issuance", "OIDC / PKCE")
    Rel(mahaskills, mahaswayam, "Hands off candidate enrollment via SSO", "REST / JWT")
    Rel(mahaskills, ncs_portal, "Ingests national vacancy feeds", "REST")
    Rel(mahaskills, job_portals, "Crawls public job postings nightly", "REST / RSS / Scrapy")
    Rel(mahaskills, nsdc_ncvet, "Synchronizes qualification frameworks", "Batch Sync")
```

---

### 2.2 C4 Level 2: Container Diagram

The Container diagram decomposes MahaSkills into its high-level technical runtime environments:

```mermaid
C4Container
    title Container Diagram for MahaSkills Platform

    Person(user, "Platform User", "Authenticated official, employer, or candidate.")

    Container(frontend_app, "Single Page Application (SPA)", "React 18, TypeScript, Tailwind, shadcn/ui", "Delivers responsive, localized (MR/HI/EN) accessible interfaces across Public, App, and Candidate shells.")
    Container(api_gateway, "API Gateway / Reverse Proxy", "Kong / Nginx", "Handles TLS termination, rate limiting, request routing, and Keycloak JWT validation.")
    
    Container_Boundary(backend_services, "Application & Intelligence Services")
        Container(core_api, "Core Application API", "Python FastAPI / Node.js", "Manages CRUD, RBAC scope enforcement, district planning, and workflow state machines.")
        Container(analytics_engine, "Gap & Recommendation Engine", "Python, Celery, scikit-learn", "Asynchronously computes gap scores, oversupply alerts, and compiles curriculum evidence dossiers.")
        Container(ingestion_workers, "Data Ingestion & Scrapers", "Apache Airflow, Scrapy, Playwright", "Scheduled scraping of job boards, deduplication, and ITI placement CSV batch processing.")
    Container_Boundary_End()

    ContainerDb(relational_db, "Relational Database", "PostgreSQL 16", "Authoritative transactional data store for users, taxonomy, placements, gap scores, and audit trails.")
    ContainerDb(search_db, "Taxonomy & Job Search Index", "Elasticsearch 8", "High-speed full-text search, NLP synonym mapping, and fuzzy taxonomy role matching.")
    ContainerDb(cache_store, "Cache & Broker", "Redis 7", "Distributed session storage, query caching, API rate limit counters, and Celery task broker.")
    ContainerDb(object_store, "Object Storage", "MinIO / AWS S3", "Secure storage for raw placement CSVs, curriculum PDF dossiers, and evidence artifacts.")

    Rel(user, frontend_app, "Interacts via Web Browser", "HTTPS")
    Rel(frontend_app, api_gateway, "Makes authenticated REST calls", "HTTPS / JSON")
    Rel(api_gateway, core_api, "Proxies validated requests", "HTTP / JSON")
    Rel(core_api, relational_db, "Queries and updates transactional state", "TCP / PostgreSQL Wire Protocol")
    Rel(core_api, search_db, "Executes full-text taxonomy searches", "HTTP / JSON")
    Rel(core_api, cache_store, "Fetches cached stats and verifies sessions", "TCP / Redis Protocol")
    Rel(core_api, object_store, "Generates pre-signed upload/download URLs", "S3 API")
    Rel(core_api, cache_store, "Dispatches background tasks to Celery", "Redis Queue")

    Rel(analytics_engine, relational_db, "Reads aggregated data, writes gap scores", "SQL")
    Rel(analytics_engine, cache_store, "Pulls computation tasks and invalidates caches", "Redis")
    Rel(analytics_engine, object_store, "Persists generated PDF evidence dossiers", "S3 API")

    Rel(ingestion_workers, relational_db, "Persists validated postings and placement batches", "SQL")
    Rel(ingestion_workers, search_db, "Indexes new job vacancies and extracted skills", "HTTP")
    Rel(ingestion_workers, object_store, "Archives raw CSVs and scrape dumps", "S3 API")
```

---

## 3. Core Subsystems & Service Boundaries

MahaSkills partitions business responsibilities across clean domain modules:

```text
                               ┌─────────────────────────┐
                               │       API Gateway       │
                               └────────────┬────────────┘
                                            │
        ┌───────────────┬───────────────────┼───────────────────┬───────────────┐
        │               │                   │                   │               │
        ▼               ▼                   ▼                   ▼               ▼
┌──────────────┐ ┌──────────────┐    ┌──────────────┐    ┌──────────────┐ ┌──────────────┐
│ Auth & Scope │ │ Taxonomy &   │    │ Gap Scoring  │    │ Curriculum   │ │ District     │
│ Service      │ │ NLP Service  │    │ Engine       │    │ Review Flow  │ │ Plans & Asset│
└──────────────┘ └──────────────┘    └──────────────┘    └──────────────┘ └──────────────┘
        │               │                   │                   │               │
        ▼               ▼                   ▼                   ▼               ▼
┌──────────────┐ ┌──────────────┐    ┌──────────────┐    ┌──────────────┐ ┌──────────────┐
│ Ingestion &  │ │ Employer     │    │ Candidate    │    │ Audit Log &  │ │ Notification │
│ Placements   │ │ Engagement   │    │ Guidance     │    │ Observability│ │ Engine       │
└──────────────┘ └──────────────┘    └──────────────┘    └──────────────┘ └──────────────┘
```

### 3.1 Auth & Scope Service
* **Keycloak Integration:** Validates RS256 JWT access tokens, extracts realm roles (`POLICY_MAKER`, `DISTRICT_OFFICER`, etc.), and populates tenant context (`district_id`, `institute_id`, `sector_id`).
* **Enforcement:** Executes coarse-grained endpoint authorization and fine-grained row-level security (RLS) filters.

### 3.2 Skill Taxonomy & NLP Engine
* **Taxonomy Registry:** Maintains canonical hierarchy: 33 Sectors $\rightarrow$ 36 SSCs $\rightarrow$ 2,200 Job Roles $\rightarrow$ 15,000+ Skills.
* **NLP Pipeline:** Tokenizes raw job descriptions using spaCy/Transformers, extracts entity n-grams, and executes cosine similarity matching against taxonomy embeddings stored in Elasticsearch.

### 3.3 Gap Scoring & Oversupply Engine
* **Computation Worker:** Scheduled weekly batch execution computing standardized gap scores across all 36 districts and 33 sectors.
* **Oversupply Detector:** Continuously cross-references 4-quarter placement trends against local demand percentiles to generate decommission flags.

### 3.4 Curriculum Recommendation & Evidence Workflow
* **Proposal Engine:** Evaluates persistent gap scores ($> 60$ for $\ge 8$ weeks) and synthesizes actionable recommendations.
* **Evidence Compiler:** Automatically bundles 12-month demand graphs, hiring enterprise lists, and interstate syllabus comparisons into an immutable evidence dossier.
* **State Machine:** Governs transitions: `Draft` $\rightarrow$ `Under SSC Review` $\rightarrow$ `SSC Approved / Revisions Requested` $\rightarrow$ `DSEEI Final Approval` $\rightarrow$ `Published`.

### 3.5 Ingestion & Placement Processing
* **Scraper Fleet:** Multi-threaded scrapers with rotating proxy pools ingesting job vacancies nightly.
* **CSV Validation Engine:** Streaming parser handling 50,000-row placement CSVs with sub-second header checks, cell validation, and student PII pseudonymization.

### 3.6 District Training Plan & Asset Audit
* **Plan Synthesizer:** Aggregates macroeconomic gap projections, historical training throughput, and local industrial needs into unified district annual plans.
* **Asset Auditor:** Performs automated diffs between NCVET syllabus mandatory tool registers and ITI asset uploads to compute precise modernization budgets.

---

## 4. Asynchronous Data Pipelines & Background Tasks

```mermaid
sequenceDiagram
    autonumber
    actor Principal as ITI Principal
    participant GW as API Gateway
    participant Svc as Core API
    participant S3 as Object Storage (S3)
    participant Broker as Redis Task Broker
    participant Worker as Celery Validation Worker
    participant DB as PostgreSQL

    Principal->>GW: POST /v1/ingestion/placements/upload (CSV)
    GW->>Svc: Forward authorized stream
    Svc->>S3: Stream raw file to s3://placements-raw/{batchId}.csv
    Svc->>DB: Insert placement_batches (status="PENDING_VALIDATION")
    Svc->>Broker: Enqueue validate_placement_batch(batchId)
    Svc-->>Principal: HTTP 202 Accepted {batch_id, status: "PROCESSING"}

    Broker->>Worker: Dispatch task
    Worker->>S3: Stream CSV rows
    Worker->>Worker: Validate syntax, types, and anonymize candidate hashes
    alt Validation Errors Encountered
        Worker->>DB: Insert placement_validation_errors
        Worker->>DB: Update placement_batches (status="REJECTED")
    else Validation Succeeded
        Worker->>DB: Bulk insert placement_records
        Worker->>DB: Update placement_batches (status="COMPLETED")
        Worker->>Broker: Enqueue trigger_gap_recalculation(district_id)
    end
```

---

## 5. Caching & Performance Strategy

To satisfy NFR-01 (sub-300ms API response, sub-2.0s analytical page loads):

| Cache Level | Technology | Target Data | TTL | Invalidation Trigger |
|:---|:---|:---|:---|:---|
| **L1 (Client Query)** | TanStack Query | Active user view, filter states, taxonomy subtrees | 5 mins | Route change, explicit mutation |
| **L2 (Edge / Gateway)** | Nginx / CloudFront | Static localized JSON translation files, asset images | 24 hours | Release deployment |
| **L3 (Application)** | Redis 7 | District gap score heatmaps, macroeconomic totals | 1 hour | Weekly gap engine completion |
| **L4 (Database)** | Postgres Materialized Views | Heavy multi-table placement analytics, annual trends | 6 hours | Nightly ingestion batch refresh |

---

## 6. Resilience, Fault Tolerance & Disaster Recovery

1. **Circuit Breakers:** External API integrations (e.g., Mahaswayam SSO, GSTIN verification) utilize Resilience4j/PyBreaker patterns. If downstream endpoints fail, requests gracefully degrade or queue for retry.
2. **Stateless API Services:** All application containers are strictly stateless, enabling seamless horizontal auto-scaling in Kubernetes based on CPU and request latency triggers.
3. **Database Multi-AZ Replication:** PostgreSQL utilizes synchronous streaming replication to a hot standby in an alternate Availability Zone in the AWS Mumbai region, ensuring an RTO $< 15$ minutes and RPO $< 1$ minute.


---

<a id="03-api-api_contracts-md"></a>

<!-- ======================================================== -->
<!-- FILE: 03-api/API_CONTRACTS.md -->
<!-- ======================================================== -->

# MahaSkills — API Contracts & Client Code Generation

**Platform:** MahaSkills · Government of Maharashtra (DSEEI / MSInS)  
**Contract Source:** [`openapi.yaml`](file:///e:/CODING/Projects/new%20sih2026/docs/03-api/openapi.yaml)  
**Version:** 1.0  
**Status:** Canonical Contract Guide Baseline  

---

## 1. Single Source of Truth Principle

The OpenAPI specification at [`docs/03-api/openapi.yaml`](file:///e:/CODING/Projects/new%20sih2026/docs/03-api/openapi.yaml) is the non-negotiable contract between backend service implementations and frontend consumers. Neither team should manually write API schemas or data interfaces.

```mermaid
graph LR
    OAS[openapi.yaml] --> GenTS[openapi-typescript]
    OAS --> GenMock[Prism / MSW Mock Server]
    OAS --> GenDoc[Swagger UI / Redoc]
    OAS --> GenTest[Contract Verification Tests]

    GenTS --> FrontendTypes[src/types/api.ts]
    GenMock --> LocalDev[Frontend Local Dev without Backend]
    GenTest --> CIPipeline[GitHub Actions CI]
```

---

## 2. Generating TypeScript Interfaces

To synchronize the frontend TypeScript types directly from the OpenAPI contract:

```bash
# Generate types from the local OpenAPI schema
npx openapi-typescript docs/03-api/openapi.yaml -o src/types/api.ts
```

This generates strictly typed schemas for all entities and API endpoints:
```typescript
import { paths, components } from '@/types/api';

export type UserProfile = components['schemas']['UserResponse']['data'];
export type GapScoreItem = components['schemas']['GapScoreListResponse']['data'][number];
export type PathwayQuizInput = components['schemas']['PathwayQuizRequest'];
```

---

## 3. Mocking & Local Development (Mock Service Worker / Prism)

Frontend developers can build against the API contract even before backend endpoints are deployed:

### 3.1 Running Prism Mock Server
```bash
# Spin up an instantaneous local mock server on port 4010
npx @stoplight/prism-cli mock docs/03-api/openapi.yaml -p 4010
```

### 3.2 Mock Service Worker (MSW) Integration
MSW handlers in `src/mocks/handlers.ts` adhere to `paths` defined in the contract:
```typescript
import { http, HttpResponse } from 'msw';

export const handlers = [
  http.get('*/v1/auth/me', () => {
    return HttpResponse.json({
      success: true,
      data: {
        id: 'f3a18b72-2d10-4491-a189-9e1201ab78c1',
        email: 'dpo.pune@gov.in',
        full_name: 'Dr. Rajesh Patil',
        roles: ['DISTRICT_OFFICER'],
        scopes: { district_id: 14, district_name: 'Pune' }
      }
    });
  }),
];
```

---

## 4. Contract Linting & CI Verification

In CI pipelines, OpenAPI contracts are validated using Spectral to catch breaking schema modifications:
```bash
npx @stoplight/spectral-cli lint docs/03-api/openapi.yaml
```
Breaking changes (e.g. removing fields, altering types, or adding non-nullable parameters) fail the PR verification gate automatically.


---

<a id="03-api-api_specification-md"></a>

<!-- ======================================================== -->
<!-- FILE: 03-api/API_SPECIFICATION.md -->
<!-- ======================================================== -->

# MahaSkills — REST API Specification

**Platform:** MahaSkills · Government of Maharashtra (DSEEI / MSInS)  
**API Version:** `v1`  
**Base URL:** `https://api.mahaskills.maharashtra.gov.in/v1`  
**Status:** Canonical REST Specification Baseline  

---

## 1. Global API Conventions & Protocol Standards

### 1.1 Standard JSON Response Envelope
All API endpoints return a unified response envelope:

```json
{
  "success": true,
  "data": {},
  "meta": {
    "page": 1,
    "limit": 20,
    "total_count": 142,
    "total_pages": 8
  },
  "error": null
}
```

When an error occurs:
```json
{
  "success": false,
  "data": null,
  "meta": null,
  "error": {
    "code": "REC_INVALID_STATE_TRANSITION",
    "message": "Cannot transition recommendation from DRAFT directly to PUBLISHED.",
    "details": [
      { "field": "status", "issue": "Must pass through UNDER_SSC_REVIEW first." }
    ]
  }
}
```

### 1.2 Pagination, Filtering & Sorting Conventions
* **Pagination:** `?page=1&limit=20` (maximum limit: 100).
* **Sorting:** `?sort=gap_score:desc` or `?sort=created_at:asc`.
* **Filtering:** Direct query parameters (e.g. `?district_id=14&sector_id=3&nsqf_level=4`).

---

## 2. Core Endpoint Specifications

### 2.1 Identity & Authentication (`/v1/auth`)

#### `GET /v1/auth/me`
* **Description:** Retrieves the authenticated user's profile and active jurisdictional scopes.
* **Security:** Bearer JWT (All authenticated roles).
* **Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "id": "f3a18b72-2d10-4491-a189-9e1201ab78c1",
    "keycloak_sub": "8c3b01a2-9b98-4b71-9f20-8012bcfe1430",
    "email": "dpo.pune@gov.in",
    "full_name": "Dr. Rajesh Patil",
    "roles": ["DISTRICT_OFFICER"],
    "scopes": {
      "district_id": 14,
      "district_name": "Pune",
      "division": "Pune"
    }
  }
}
```

---

### 2.2 Labour Market Intelligence (`/v1/lmi`)

#### `GET /v1/lmi/aggregates`
* **Description:** Returns high-level vacancy totals, trending sectors, and regional demand heatmaps.
* **Query Params:** `district_id` (optional), `sector_id` (optional), `start_date`, `end_date`.
* **Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "total_vacancies": 48250,
    "top_sectors": [
      { "sector_id": 3, "name": "Automotive & EV", "openings": 14200, "growth_rate": 18.4 },
      { "sector_id": 12, "name": "IT & ITeS", "openings": 12100, "growth_rate": 12.1 }
    ],
    "district_intensity": [
      { "district_id": 14, "district_name": "Pune", "vacancies": 18400, "intensity": "CRITICAL" },
      { "district_id": 20, "district_name": "Nashik", "vacancies": 6200, "intensity": "HIGH" }
    ]
  }
}
```

---

### 2.3 Skill Taxonomy (`/v1/taxonomy`)

#### `GET /v1/taxonomy/tree`
* **Description:** Returns the hierarchical taxonomy tree (Sectors $\rightarrow$ SSCs $\rightarrow$ Job Roles).
* **Response (200 OK):**
```json
{
  "success": true,
  "data": [
    {
      "sector_id": 3,
      "name_en": "Automotive",
      "sscs": [
        {
          "ssc_id": 5,
          "name": "Automotive Skills Development Council (ASDC)",
          "job_roles": [
            {
              "id": "a3b89012-...",
              "qp_code": "ASC/Q1402",
              "title_en": "Automotive EV Battery Technician",
              "nsqf_level": 4
            }
          ]
        }
      ]
    }
  ]
}
```

---

### 2.4 Gap Scoring Engine (`/v1/gap-scores`)

#### `GET /v1/gap-scores`
* **Description:** Lists calculated skill gap scores across districts and sectors.
* **Query Params:** `district_id`, `sector_id`, `nsqf_level`, `severity`, `page`, `limit`.
* **Response (200 OK):**
```json
{
  "success": true,
  "data": [
    {
      "id": "c4d10928-...",
      "district_id": 14,
      "district_name": "Pune",
      "sector_name": "Automotive & EV",
      "job_role_title": "EV Assembly Technician",
      "nsqf_level": 4,
      "demand_count": 1420,
      "trained_capacity": 450,
      "placement_rate": 84.5,
      "gap_score": 76.40,
      "severity_level": "CRITICAL",
      "calculation_date": "2026-09-01"
    }
  ],
  "meta": { "page": 1, "limit": 20, "total_count": 340, "total_pages": 17 }
}
```

#### `GET /v1/gap-scores/oversupply`
* **Description:** Retrieves courses flagged as structurally oversupplied ($P_c < 25\%$ & low demand).
* **Response (200 OK):**
```json
{
  "success": true,
  "data": [
    {
      "course_id": "e2a40192-...",
      "course_code": "CTS-WLD-01",
      "course_title": "Conventional Oxy-Acetylene Welder",
      "district_name": "Kolhapur",
      "placement_rate": 18.2,
      "local_demand_percentile": 12,
      "consecutive_quarters_oversupplied": 3,
      "recommendation": "RETIRE_OR_UPGRADE_TO_TIG_MIG"
    }
  ]
}
```

---

### 2.5 Curriculum Recommendations (`/v1/recommendations`)

#### `GET /v1/recommendations`
* **Description:** Retrieves curriculum recommendations filtered by status and assigned SSC.
* **Query Params:** `status`, `ssc_id`, `district_id`, `page`, `limit`.

#### `GET /v1/recommendations/{id}/dossier`
* **Description:** Returns the complete empirical evidence dossier for a recommendation.
* **Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "recommendation_id": "d9e80124-...",
    "recommendation_code": "REC-2026-0042",
    "job_role": "Robotics Welding Cell Specialist",
    "evidence": {
      "demand_trend_12m": [
        { "month": "2025-10", "vacancies": 80 },
        { "month": "2026-08", "vacancies": 340 }
      ],
      "top_hiring_employers": [
        { "company": "Tata Motors Ltd", "active_openings": 120 },
        { "company": "Bajaj Auto Ltd", "active_openings": 85 }
      ],
      "interstate_benchmarks": [
        { "state": "Tamil Nadu", "course_name": "Robotic Welding Tech", "placement_rate": 89.0 }
      ],
      "projected_placement_uplift": "+34.5%"
    },
    "dossier_pdf_url": "https://s3.ap-south-1.amazonaws.com/mahaskills-dossiers/REC-2026-0042.pdf"
  }
}
```

#### `POST /v1/recommendations/{id}/review`
* **Description:** Submits an SSC technical review or DSEEI final approval action.
* **Request Body:**
```json
{
  "action": "APPROVE",
  "comments": "Technical syllabus module for PLC controls verified against ASDC standards.",
  "revised_syllabus_attachment_s3_key": "syllabi/drafts/ASC_Q1402_v2.pdf"
}
```

---

### 2.6 ITI Placement Ingestion (`/v1/ingestion/placements`)

#### `POST /v1/ingestion/placements/upload`
* **Description:** Uploads a monthly placement return CSV.
* **Content-Type:** `multipart/form-data`
* **Response (202 Accepted):**
```json
{
  "success": true,
  "data": {
    "batch_id": "9b1d84a2-...",
    "status": "VALIDATING",
    "message": "File received and queued for syntax & DPDP validation."
  }
}
```

#### `GET /v1/ingestion/placements/{batchId}/errors`
* **Description:** Retrieves row-level rejection logs if batch validation failed.
* **Response (200 OK):**
```json
{
  "success": true,
  "data": [
    {
      "row_number": 42,
      "column_name": "monthly_salary",
      "rejected_value": "ABC",
      "error_code": "ERR_SALARY_OUT_OF_BOUNDS",
      "error_message": "Monthly salary must be a decimal value between ₹8,000 and ₹2,00,000."
    }
  ]
}
```

---

### 2.7 Candidate Guidance & Course Finder (`/v1/candidates`)

#### `GET /v1/candidates/courses`
* **Description:** Public course discovery endpoint exposing real-world placement statistics.
* **Query Params:** `search`, `district_id`, `sector_id`, `nsqf_level`, `sort`.
* **Response (200 OK):**
```json
{
  "success": true,
  "data": [
    {
      "id": "e2a40192-...",
      "course_code": "CTS-EVT-01",
      "title_mr": "इलेक्ट्रिक वाहन तंत्रज्ञ",
      "title_en": "Electric Vehicle Technician",
      "duration_months": 12,
      "nsqf_level": 4,
      "verified_placement_rate": 81.5,
      "median_salary_inr": 24000.00,
      "p50_months_to_placement": 2,
      "hiring_employers": ["Tata AutoComp", "Mahindra Electric", "Flash Electronics"]
    }
  ]
}
```

#### `POST /v1/candidates/pathway/recommend`
* **Description:** Computes personalized course recommendations based on 5-question quiz input.
* **Request Body:**
```json
{
  "district_id": 14,
  "education_level": "10TH_PASS",
  "sector_interest_ids": [3, 12],
  "language_preference": "mr",
  "willing_to_relocate": false
}
```


---

<a id="03-api-authentication-md"></a>

<!-- ======================================================== -->
<!-- FILE: 03-api/AUTHENTICATION.md -->
<!-- ======================================================== -->

# MahaSkills — Authentication & Identity Architecture

**Platform:** MahaSkills · Government of Maharashtra (DSEEI / MSInS)  
**IAM Provider:** Keycloak 24 (OIDC 1.0 & OAuth 2.0)  
**Version:** 1.0  
**Status:** Canonical Identity & Authentication Baseline  

---

## 1. Authentication Topology & Protocols

MahaSkills uses **Keycloak** as the centralized Identity and Access Management (IAM) provider for all authenticated roles. Public candidates can access exploratory tools anonymously or authenticate for personalized pathways via Mahaswayam Single Sign-On (SSO).

```mermaid
sequenceDiagram
    autonumber
    actor User as Government Official / Principal / Employer
    participant SPA as React Frontend (SPA)
    participant KC as Keycloak IAM Server
    participant GW as API Gateway (Kong)
    participant API as Core Backend API

    User->>SPA: Click "Sign In with MahaSkills SSO"
    SPA->>SPA: Generate code_verifier and code_challenge (S256)
    SPA->>KC: Redirect /auth/realms/mahaskills/protocol/openid-connect/auth (PKCE)
    User->>KC: Enter credentials & MFA OTP
    KC-->>SPA: Redirect to redirect_uri with ?code=AUTHORIZATION_CODE
    SPA->>KC: POST /token with code + code_verifier
    KC-->>SPA: Return JWT { access_token, refresh_token, id_token }
    
    SPA->>GW: API Request: Authorization: Bearer <access_token>
    GW->>GW: Verify RS256 signature against Keycloak JWKS
    GW->>API: Forward request with validated claims headers
    API-->>SPA: HTTP 200 OK Response
```

---

## 2. Token Anatomy & Claims Structure

Keycloak issues RS256-signed JSON Web Tokens (JWT). The platform injects jurisdictional scoping claims into the token payload:

```json
{
  "exp": 1788739200,
  "iat": 1788735600,
  "jti": "d3b07384-91f2-482a-a92c-7b41e9b28312",
  "iss": "https://auth.mahaskills.maharashtra.gov.in/realms/mahaskills",
  "aud": "mahaskills-api",
  "sub": "8c3b01a2-9b98-4b71-9f20-8012bcfe1430",
  "typ": "Bearer",
  "azp": "mahaskills-web",
  "preferred_username": "rajesh.patil",
  "email": "dpo.pune@gov.in",
  "email_verified": true,
  "realm_access": {
    "roles": [
      "DISTRICT_OFFICER"
    ]
  },
  "district_id": 14,
  "district_name": "Pune",
  "division": "Pune",
  "institute_id": null,
  "sector_ids": []
}
```

### 2.1 Role-Specific Scoping Attributes
* **`POLICY_MAKER`**: `district_id = null` (Statewide visibility across all 36 districts).
* **`DISTRICT_OFFICER`**: `district_id = [Integer]` (Strictly scoped to designated district).
* **`ITI_PRINCIPAL`**: `district_id = [Integer]`, `institute_id = [UUID]` (Scoped to individual ITI).
* **`SSC_REVIEWER`**: `sector_ids = [Array of Sector IDs]` (Scoped to assigned Sector Skill Council domains).
* **`EMPLOYER`**: `employer_id = [UUID]`, `gstin = [String]`.

---

## 3. Token Lifecycle & Session Management

| Token Type | Lifetime | Storage Location | Rotation / Revocation |
|:---|:---|:---|:---|
| **Access Token** | 15 minutes | In-memory JavaScript closure | Ephemeral; never saved to `localStorage` |
| **Refresh Token** | 8 hours | `HttpOnly`, `Secure`, `SameSite=Strict` Cookie | Rotated on every token refresh request |
| **Silent Refresh** | Before expiry | Background iframe / timer | Automatically refreshed at $T - 60\text{s}$ |

---

## 4. Backend Security Middleware Verification

1. **Signature Verification:** The API Gateway validates tokens against Keycloak's JSON Web Key Set (`JWKS`) endpoint, cached with an hourly TTL.
2. **Audience & Issuer Check:** `iss` must match the official realm URI, and `aud` must include `mahaskills-api`.
3. **Scope Enforcement Filter:** FastAPI dependency `get_current_security_context()` enforces that `district_id` in path or query parameters matches the claim in the JWT:
```python
def verify_district_scope(requested_district_id: int, ctx: SecurityContext = Depends(get_security_context)):
    if "POLICY_MAKER" in ctx.roles or "ADMIN" in ctx.roles:
        return
    if ctx.district_id != requested_district_id:
        raise HTTPException(status_code=403, detail="Cross-district access forbidden.")
```


---

<a id="03-api-error_codes-md"></a>

<!-- ======================================================== -->
<!-- FILE: 03-api/ERROR_CODES.md -->
<!-- ======================================================== -->

# MahaSkills — Unified API Error Codes Specification

**Platform:** MahaSkills · Government of Maharashtra (DSEEI / MSInS)  
**Problem Statement ID:** 26134  
**Version:** 1.0  
**Status:** Canonical Error Taxonomy Baseline  

---

## 1. Standard Error Envelope Structure

Whenever an HTTP request results in a $4xx$ or $5xx$ status code, the response body adheres strictly to this contract:

```json
{
  "success": false,
  "data": null,
  "meta": null,
  "error": {
    "code": "ERROR_CODE_CONSTANT",
    "message": "Human-readable English summary of the issue.",
    "details": [
      {
        "field": "parameter_or_column_name",
        "issue": "Specific failure rationale."
      }
    ]
  }
}
```

---

## 2. Master Domain Error Taxonomy

### 2.1 Identity, Authentication & Scopes (`AUTH_*`)

| Error Code | HTTP Status | Meaning / Trigger | English Message |
|:---|:---|:---|:---|
| `AUTH_UNAUTHORIZED` | 401 | Missing or malformed Bearer token | Authentication token is missing or malformed. |
| `AUTH_TOKEN_EXPIRED` | 401 | JWT expired | Your session has expired. Please log in again. |
| `AUTH_FORBIDDEN` | 403 | User role lacks required permission | You do not possess the required role to execute this action. |
| `AUTH_SCOPE_RESTRICTED`| 403 | User attempted cross-district access | You are not authorized to access data outside your assigned district. |

---

### 2.2 Placement Ingestion & CSV Parsing (`PLA_*`)

| Error Code | HTTP Status | Meaning / Trigger | English Message |
|:---|:---|:---|:---|
| `PLA_CSV_EMPTY` | 400 | File contains 0 rows | The uploaded placement file is empty. |
| `PLA_CSV_MALFORMED_HEADER` | 400 | Headers do not match template | CSV headers do not match the canonical template format. |
| `PLA_CSV_MAX_ROWS_EXCEEDED`| 400 | More than 50,000 rows | File exceeds maximum batch limit of 50,000 records. |
| `PLA_INVALID_CANDIDATE_ID` | 422 | Candidate ID format invalid | Candidate identifier is missing or malformed. |
| `PLA_UNSANCTIONED_COURSE` | 422 | Course not offered by institute | The specified course code is not sanctioned for this institute. |
| `PLA_SALARY_OUT_OF_BOUNDS` | 422 | Salary outside ₹8,000–₹2,00,000 | Monthly salary must be between ₹8,000 and ₹2,00,000. |

---

### 2.3 Curriculum Recommendations & Workflow (`REC_*`)

| Error Code | HTTP Status | Meaning / Trigger | English Message |
|:---|:---|:---|:---|
| `REC_NOT_FOUND` | 404 | Recommendation ID does not exist | Curriculum recommendation could not be found. |
| `REC_INVALID_STATE_TRANSITION` | 409 | Illegal lifecycle transition | The proposed workflow state transition is not permitted. |
| `REC_MISSING_EVIDENCE` | 422 | Review submitted without rationale | Cannot approve recommendation without an attached rationale. |
| `REC_UNAUTHORIZED_REVIEWER` | 403 | User's SSC does not match target | Only appointed reviewers from the assigned SSC may review this draft. |

---

### 2.4 Skill Taxonomy & NLP (`TAX_*`)

| Error Code | HTTP Status | Meaning / Trigger | English Message |
|:---|:---|:---|:---|
| `TAX_SECTOR_NOT_FOUND` | 404 | Sector ID not found | Specified industrial sector does not exist. |
| `TAX_JOB_ROLE_EXISTS` | 409 | Duplicate QP code | A job role with this Qualification Pack code already exists. |
| `TAX_INVALID_NSQF_LEVEL` | 422 | NSQF level $< 1$ or $> 10$ | NSQF qualification level must be an integer between 1 and 10. |

---

### 2.5 District Planning & Infrastructure (`DTP_*`)

| Error Code | HTTP Status | Meaning / Trigger | English Message |
|:---|:---|:---|:---|
| `DTP_PLAN_LOCKED` | 409 | Modifying sanctioned plan | Cannot modify a district training plan that has already been sanctioned. |
| `DTP_INVALID_FISCAL_YEAR`| 422 | Format not YYYY-YYYY | Fiscal year must adhere to the standard YYYY-YYYY format. |
| `DTP_EQUIPMENT_AUDIT_STALE`| 412 | ITI asset register $> 1$ yr old | Plan cannot be finalized until ITI asset registers are refreshed. |


---

<a id="03-api-openapi-yaml"></a>

<!-- ======================================================== -->
<!-- FILE: 03-api/openapi.yaml -->
<!-- ======================================================== -->

openapi: 3.1.0
info:
  title: MahaSkills Core API Contract
  description: Canonical OpenAPI specification for the MahaSkills Labour-Market Intelligence & Curriculum Alignment Platform (Government of Maharashtra).
  version: 1.0.0
servers:
  - url: https://api.mahaskills.maharashtra.gov.in/v1
    description: Production API Gateway
  - url: https://staging-api.mahaskills.maharashtra.gov.in/v1
    description: Staging Environment
  - url: http://localhost:8000/v1
    description: Local Development Environment

security:
  - KeycloakBearer: []

paths:
  /auth/me:
    get:
      summary: Get current authenticated user profile and scopes
      operationId: getCurrentUser
      tags: [Authentication]
      responses:
        '200':
          description: User profile and jurisdictional scopes
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/UserResponse'
        '401':
          $ref: '#/components/responses/Unauthorized'

  /lmi/aggregates:
    get:
      summary: Get aggregated labour market demand and vacancy metrics
      operationId: getLmiAggregates
      tags: [Labour Market Intelligence]
      parameters:
        - name: district_id
          in: query
          schema: { type: integer }
        - name: sector_id
          in: query
          schema: { type: integer }
      responses:
        '200':
          description: Aggregated vacancy metrics
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/LmiAggregateResponse'

  /taxonomy/tree:
    get:
      summary: Retrieve complete hierarchical skill taxonomy
      operationId: getTaxonomyTree
      tags: [Skill Taxonomy]
      responses:
        '200':
          description: Hierarchical tree of sectors, SSCs, and job roles
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/TaxonomyTreeResponse'

  /gap-scores:
    get:
      summary: List calculated skill gap scores
      operationId: listGapScores
      tags: [Gap Scoring]
      parameters:
        - name: district_id
          in: query
          schema: { type: integer }
        - name: sector_id
          in: query
          schema: { type: integer }
        - name: nsqf_level
          in: query
          schema: { type: integer }
        - name: page
          in: query
          schema: { type: integer, default: 1 }
        - name: limit
          in: query
          schema: { type: integer, default: 20 }
      responses:
        '200':
          description: Paginated gap scores
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/GapScoreListResponse'

  /gap-scores/oversupply:
    get:
      summary: Retrieve courses flagged as structurally oversupplied
      operationId: getOversupplyAlerts
      tags: [Gap Scoring]
      parameters:
        - name: district_id
          in: query
          schema: { type: integer }
      responses:
        '200':
          description: List of oversupplied vocational courses
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/OversupplyListResponse'

  /recommendations:
    get:
      summary: List curriculum update recommendations
      operationId: listRecommendations
      tags: [Curriculum Recommendations]
      parameters:
        - name: status
          in: query
          schema: { type: string }
        - name: ssc_id
          in: query
          schema: { type: integer }
        - name: page
          in: query
          schema: { type: integer, default: 1 }
        - name: limit
          in: query
          schema: { type: integer, default: 20 }
      responses:
        '200':
          description: Paginated recommendation list
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/RecommendationListResponse'

  /recommendations/{id}/dossier:
    get:
      summary: Retrieve empirical evidence dossier for a recommendation
      operationId: getRecommendationDossier
      tags: [Curriculum Recommendations]
      parameters:
        - name: id
          in: path
          required: true
          schema: { type: string, format: uuid }
      responses:
        '200':
          description: Evidence dossier details
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/RecommendationDossierResponse'

  /recommendations/{id}/review:
    post:
      summary: Submit technical review or approval decision
      operationId: reviewRecommendation
      tags: [Curriculum Recommendations]
      parameters:
        - name: id
          in: path
          required: true
          schema: { type: string, format: uuid }
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/ReviewActionRequest'
      responses:
        '200':
          description: Action recorded and workflow advanced
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/GenericSuccessResponse'

  /employers/skill-needs:
    post:
      summary: Submit structured upcoming industrial skill needs
      operationId: submitSkillNeeds
      tags: [Employer Engagement]
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/SkillNeedSubmissionRequest'
      responses:
        '201':
          description: Skill need recorded
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/GenericSuccessResponse'

  /ingestion/placements/upload:
    post:
      summary: Upload monthly ITI placement CSV return
      operationId: uploadPlacementCsv
      tags: [Placement Returns]
      requestBody:
        required: true
        content:
          multipart/form-data:
            schema:
              type: object
              properties:
                file:
                  type: string
                  format: binary
                academic_year:
                  type: string
                batch_month:
                  type: integer
      responses:
        '202':
          description: Batch queued for validation
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/PlacementUploadResponse'

  /ingestion/placements/{batchId}/errors:
    get:
      summary: Retrieve validation error items for a rejected placement batch
      operationId: getPlacementBatchErrors
      tags: [Placement Returns]
      parameters:
        - name: batchId
          in: path
          required: true
          schema: { type: string, format: uuid }
      responses:
        '200':
          description: Cell-level error records
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/ValidationErrorListResponse'

  /district-plans:
    get:
      summary: Get Annual District Training Plan
      operationId: getDistrictPlan
      tags: [District Planning]
      parameters:
        - name: district_id
          in: query
          required: true
          schema: { type: integer }
        - name: fiscal_year
          in: query
          required: true
          schema: { type: string }
      responses:
        '200':
          description: Complete district plan
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/DistrictPlanResponse'

  /candidates/courses:
    get:
      summary: Public course directory with verified placement metrics
      operationId: searchCourses
      tags: [Candidate Guidance]
      security: []
      parameters:
        - name: search
          in: query
          schema: { type: string }
        - name: district_id
          in: query
          schema: { type: integer }
        - name: sector_id
          in: query
          schema: { type: integer }
        - name: page
          in: query
          schema: { type: integer, default: 1 }
        - name: limit
          in: query
          schema: { type: integer, default: 20 }
      responses:
        '200':
          description: Verified course catalog
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/CourseSearchResponse'

  /candidates/pathway/recommend:
    post:
      summary: Personalized vocational recommendations based on 5-step quiz
      operationId: recommendPathway
      tags: [Candidate Guidance]
      security: []
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/PathwayQuizRequest'
      responses:
        '200':
          description: Top 3 recommended courses with rationale
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/PathwayRecommendationResponse'

components:
  securitySchemes:
    KeycloakBearer:
      type: http
      scheme: bearer
      bearerFormat: JWT
      description: Keycloak OIDC RS256 Bearer Token

  responses:
    Unauthorized:
      description: Authentication missing or expired
      content:
        application/json:
          schema:
            $ref: '#/components/schemas/ErrorResponse'

  schemas:
    GenericSuccessResponse:
      type: object
      properties:
        success: { type: boolean, example: true }
        data: { type: object, nullable: true }
        meta: { type: object, nullable: true }
        error: { type: object, nullable: true }

    ErrorResponse:
      type: object
      properties:
        success: { type: boolean, example: false }
        data: { type: object, nullable: true }
        meta: { type: object, nullable: true }
        error:
          type: object
          properties:
            code: { type: string, example: "AUTH_UNAUTHORIZED" }
            message: { type: string, example: "Invalid or expired session token." }
            details:
              type: array
              items: { type: object }

    UserResponse:
      type: object
      properties:
        success: { type: boolean }
        data:
          type: object
          properties:
            id: { type: string, format: uuid }
            keycloak_sub: { type: string }
            email: { type: string, format: email }
            full_name: { type: string }
            roles:
              type: array
              items: { type: string }
            scopes: { type: object }

    LmiAggregateResponse:
      type: object
      properties:
        success: { type: boolean }
        data:
          type: object
          properties:
            total_vacancies: { type: integer }
            top_sectors:
              type: array
              items:
                type: object
                properties:
                  sector_id: { type: integer }
                  name: { type: string }
                  openings: { type: integer }
                  growth_rate: { type: number }

    TaxonomyTreeResponse:
      type: object
      properties:
        success: { type: boolean }
        data:
          type: array
          items:
            type: object
            properties:
              sector_id: { type: integer }
              name_en: { type: string }
              sscs: { type: array, items: { type: object } }

    GapScoreListResponse:
      type: object
      properties:
        success: { type: boolean }
        data:
          type: array
          items:
            type: object
            properties:
              id: { type: string, format: uuid }
              district_name: { type: string }
              sector_name: { type: string }
              job_role_title: { type: string }
              nsqf_level: { type: integer }
              gap_score: { type: number }
              severity_level: { type: string }
        meta:
          $ref: '#/components/schemas/PaginationMeta'

    OversupplyListResponse:
      type: object
      properties:
        success: { type: boolean }
        data:
          type: array
          items:
            type: object
            properties:
              course_id: { type: string, format: uuid }
              course_code: { type: string }
              course_title: { type: string }
              placement_rate: { type: number }
              local_demand_percentile: { type: integer }
              recommendation: { type: string }

    RecommendationListResponse:
      type: object
      properties:
        success: { type: boolean }
        data:
          type: array
          items:
            type: object
            properties:
              id: { type: string, format: uuid }
              recommendation_code: { type: string }
              job_role: { type: string }
              recommendation_type: { type: string }
              status: { type: string }
        meta:
          $ref: '#/components/schemas/PaginationMeta'

    RecommendationDossierResponse:
      type: object
      properties:
        success: { type: boolean }
        data:
          type: object
          properties:
            recommendation_id: { type: string, format: uuid }
            recommendation_code: { type: string }
            evidence: { type: object }
            dossier_pdf_url: { type: string, format: uri }

    ReviewActionRequest:
      type: object
      required: [action]
      properties:
        action:
          type: string
          enum: [APPROVE, REJECT, REQUEST_REVISIONS]
        comments: { type: string }
        revised_syllabus_attachment_s3_key: { type: string }

    SkillNeedSubmissionRequest:
      type: object
      required: [sector_id, items]
      properties:
        sector_id: { type: integer }
        items:
          type: array
          items:
            type: object
            required: [job_role_title, headcount, urgency, district_id]
            properties:
              job_role_title: { type: string }
              headcount: { type: integer }
              urgency: { type: string, enum: [IMMEDIATE, QUARTERLY, FUTURE] }
              district_id: { type: integer }

    PlacementUploadResponse:
      type: object
      properties:
        success: { type: boolean }
        data:
          type: object
          properties:
            batch_id: { type: string, format: uuid }
            status: { type: string }

    ValidationErrorListResponse:
      type: object
      properties:
        success: { type: boolean }
        data:
          type: array
          items:
            type: object
            properties:
              row_number: { type: integer }
              column_name: { type: string }
              rejected_value: { type: string }
              error_code: { type: string }
              error_message: { type: string }

    DistrictPlanResponse:
      type: object
      properties:
        success: { type: boolean }
        data:
          type: object
          properties:
            plan_id: { type: string, format: uuid }
            district_name: { type: string }
            fiscal_year: { type: string }
            status: { type: string }
            total_target_intake: { type: integer }
            total_estimated_budget: { type: number }

    CourseSearchResponse:
      type: object
      properties:
        success: { type: boolean }
        data:
          type: array
          items:
            type: object
            properties:
              id: { type: string, format: uuid }
              course_code: { type: string }
              title_en: { type: string }
              title_mr: { type: string }
              duration_months: { type: integer }
              nsqf_level: { type: integer }
              verified_placement_rate: { type: number }
              median_salary_inr: { type: number }

    PathwayQuizRequest:
      type: object
      required: [district_id, education_level, sector_interest_ids]
      properties:
        district_id: { type: integer }
        education_level: { type: string }
        sector_interest_ids:
          type: array
          items: { type: integer }
        language_preference: { type: string, default: "mr" }
        willing_to_relocate: { type: boolean, default: false }

    PathwayRecommendationResponse:
      type: object
      properties:
        success: { type: boolean }
        data:
          type: array
          items:
            type: object
            properties:
              course_id: { type: string, format: uuid }
              course_title: { type: string }
              match_score: { type: integer }
              reason_en: { type: string }
              reason_mr: { type: string }

    PaginationMeta:
      type: object
      properties:
        page: { type: integer }
        limit: { type: integer }
        total_count: { type: integer }
        total_pages: { type: integer }


---

<a id="04-design-accessibility-md"></a>

<!-- ======================================================== -->
<!-- FILE: 04-design/ACCESSIBILITY.md -->
<!-- ======================================================== -->

# MahaSkills — Accessibility Specification (WCAG 2.1 AA & GIGW 3.0)

**Platform:** MahaSkills · Government of Maharashtra (DSEEI / MSInS)  
**Problem Statement ID:** 26134  
**Compliance Standards:** W3C WCAG 2.1 Level AA · Government of India Guidelines for Indian Government Websites (GIGW 3.0)  
**Version:** 1.0  
**Status:** Canonical Accessibility Baseline  

---

## 1. Statutory Compliance Requirements

Under India's **Rights of Persons with Disabilities Act, 2016** and **GIGW 3.0**, all digital platforms deployed by the Government of Maharashtra must adhere strictly to WCAG 2.1 Level AA guidelines. MahaSkills ensures complete accessibility across all citizen-facing and administrative portals.

---

## 2. Core Accessibility Pillars

### 2.1 Keyboard Navigation & Focus Management
* **Skip to Main Content:** Every page renders a hidden skip link (`#main-content`) as the first focusable element.
* **Visible Focus Indicator:** All interactive elements (links, buttons, form inputs) exhibit a distinct 2px solid primary focus ring with a 2px offset (`focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2`).
* **Modal Traps:** Dialogs, sidebars, and slide-overs trap keyboard focus using Radix UI primitives. Pressing `Escape` closes the overlay and restores focus to the triggering element.

### 2.2 Screen Reader Support & ARIA Semantics
* **Semantic Landmarks:** Pages use `<header>`, `<nav>`, `<main id="main-content">`, `<aside>`, and `<footer>` landmarks.
* **Dynamic Content Announcements:** Live regions (`aria-live="polite"`) announce filter updates, CSV validation progress, and pathway quiz transitions.
* **Icon Buttons:** All icon-only triggers (e.g. search icons, language toggles, export buttons) include an explicit `aria-label` or visually hidden screen reader text (`<span className="sr-only">`).

### 2.3 Contrast & Color Independence
* **Text Contrast:** Normal body text satisfies a minimum contrast ratio of $4.5:1$ against the background; bold or large text ($\ge 18\text{pt}$) satisfies $3:1$.
* **Information Independence:** Information is never conveyed by color alone. Heatmaps and gap status badges pair color fills with descriptive text (`Critical`, `High`, `Moderate`, `Low`) and distinct icon glyphs.

### 2.4 Multilingual Pronunciation & Language Attributes
* **HTML `lang` Attribute:** Dynamically updates on the root `<html>` element (`lang="mr"`, `lang="hi"`, `lang="en"`) to instruct screen readers to load the correct speech synthesis phoneme engine.
* **Inline Language Switches:** Any mixed text (e.g., an English technical term within a Marathi description) is wrapped in `<span lang="en">` to ensure accurate pronunciation.

### 2.5 Accessible Data Visualizations & Charts
* **Accessible Tables:** Every graphical chart (e.g. Recharts gap heatmaps, vacancy trend lines) provides an immediately adjacent "View as Accessible Data Table" toggle.
* **Keyboard Navigation in Charts:** Chart points and bar columns support keyboard navigation with tooltips exposed via `aria-describedby`.


---

<a id="04-design-design_system-md"></a>

<!-- ======================================================== -->
<!-- FILE: 04-design/DESIGN_SYSTEM.md -->
<!-- ======================================================== -->

# MahaSkills — Design System & Tokens Specification

**Platform:** MahaSkills · Government of Maharashtra (DSEEI / MSInS)  
**Problem Statement ID:** 26134  
**Framework:** Tailwind CSS + Radix UI / shadcn/ui  
**Version:** 1.0  
**Status:** Canonical Design Tokens Baseline  

---

## 1. Color Tokens & Semantic Palette

The MahaSkills color system combines authoritative government aesthetics with accessible contrast ratios ($\ge 4.5:1$ for normal text, $\ge 3:1$ for large text):

```mermaid
graph LR
    Primary[Govt Navy: #1E3A8A]
    Accent[Maharashtra Saffron: #D97706]
    Success[Emerald Green: #059669]
    Destructive[Crimson Red: #DC2626]
    Warning[Amber: #D97706]
    Background[Slate 50: #F8FAFC]
```

### 1.1 CSS Variable Tokens
```css
:root {
  /* Brand Foundations */
  --primary: 221.2 83.2% 32.5%;             /* Deep Maharashtra Navy #1E3A8A */
  --primary-foreground: 210 40% 98%;
  --accent: 37.7 92.1% 44.1%;               /* State Saffron Accent #D97706 */
  --accent-foreground: 210 40% 98%;

  /* Neutral Backgrounds & Text */
  --background: 210 40% 98%;               /* Slate 50 */
  --foreground: 222.2 84% 4.9%;            /* Slate 950 */
  --card: 0 0% 100%;                       /* Pure White */
  --card-foreground: 222.2 84% 4.9%;
  --muted: 210 40% 96.1%;
  --muted-foreground: 215.4 16.3% 46.9%;
  --border: 214.3 31.8% 91.4%;

  /* Semantic Feedback */
  --destructive: 0 84.2% 60.2%;            /* Crimson Red */
  --destructive-foreground: 210 40% 98%;
  --success: 152 76% 36%;                  /* Emerald Green */
  --warning: 38 92% 50%;                   /* Amber */

  /* Gap Severity Scale */
  --gap-low: 152 76% 36%;                  /* Low Gap / Balanced */
  --gap-moderate: 45 93% 47%;              /* Moderate Gap */
  --gap-high: 25 95% 53%;                  /* High Deficit */
  --gap-critical: 0 84% 60%;               /* Critical Shortage */
}
```

---

## 2. Typography & Bilingual Font Scale

* **Latin Typography:** `Inter`, system-ui, sans-serif.
* **Devanagari Typography (Marathi & Hindi):** `Noto Sans Devanagari`, sans-serif.
* **Devanagari Line-Height Compensation:** All headings and body blocks apply a $+15\%$ line-height modifier when `lang="mr"` or `lang="hi"` to avoid clipping Devanagari matras (vowel diacritics).

| Token | Size | Line Height | Weight | Usage |
|:---|:---|:---|:---|:---|
| `text-xs` | 12px (0.75rem) | 16px | 400 / 500 | Metadata, timestamps, badge labels |
| `text-sm` | 14px (0.875rem)| 20px | 400 / 500 | Table cell content, form hints |
| `text-base` | 16px (1.0rem) | 24px | 400 / 500 | Body prose, input field text |
| `text-lg` | 18px (1.125rem)| 28px | 600 | Card titles, navigation items |
| `text-xl` | 20px (1.25rem) | 28px | 600 / 700 | Subsection headers, modal titles |
| `text-2xl` | 24px (1.5rem) | 32px | 700 | Primary screen headers |
| `text-3xl` | 30px (1.875rem)| 36px | 800 | Hero headlines, large KPI values |

---

## 3. Spacing & Layout Tokens

* **Base Grid:** 4px baseline unit.
* **Spacing Scale:**
  * `space-1`: 4px | `space-2`: 8px | `space-3`: 12px | `space-4`: 16px
  * `space-6`: 24px | `space-8`: 32px | `space-12`: 48px | `space-16`: 64px
* **Card Elevation:**
  * Standard: `shadow-sm` (`0 1px 2px 0 rgb(0 0 0 / 0.05)`)
  * Hover: `hover:shadow-md` (`0 4px 6px -1px rgb(0 0 0 / 0.1)`)
  * Modal: `shadow-xl` (`0 20px 25px -5px rgb(0 0 0 / 0.1)`)


---

<a id="04-design-information_architecture-md"></a>

<!-- ======================================================== -->
<!-- FILE: 04-design/INFORMATION_ARCHITECTURE.md -->
<!-- ======================================================== -->

# MahaSkills — Information Architecture & Navigation

**Platform:** MahaSkills · Government of Maharashtra (DSEEI / MSInS)  
**Problem Statement ID:** 26134  
**Version:** 1.0  
**Status:** Canonical Information Architecture Baseline  

---

## 1. Global Sitemap & Navigation Hierarchies by Role

```mermaid
graph TD
    Root[MahaSkills Root]
    
    Root --> PublicNav[Public / Candidate Nav]
    PublicNav --> Home[Home / Overview]
    PublicNav --> CourseFinder[Course Directory]
    PublicNav --> PathwayQuiz[Pathway Guidance Quiz]
    PublicNav --> InstituteDirectory[ITI Directory]

    Root --> GovtNav[Government & Institutional AppShell]
    GovtNav --> PMNav[Policy Maker: State Heatmap, Budget Allocations, Approvals]
    GovtNav --> DONav[District Officer: District Plans, ITI Benchmarks, Alerts]
    GovtNav --> ITINav[ITI Principal: Placement Uploads, Equipment Audits, Trainer Gaps]
    GovtNav --> SSCNav[SSC Reviewer: Recommendation Queue, Technical Review]
    GovtNav --> EmpNav[Employer: Skill Needs Form, Micro-Surveys, Reviews]
    GovtNav --> AdminNav[Admin: Taxonomy Tree, Ingestion DAGs, Audit Logs]
```

---

## 2. Detailed Navigation Trees

### 2.1 Policy Maker (`POLICY_MAKER`)
* **State Overview (`/dashboard/policy-maker`):** Statewide gap heatmap, top 10 demanded trades, macro placement rates.
* **Curriculum Approvals (`/recommendations/approvals`):** Dossier queue awaiting Joint Secretary sign-off.
* **Budget Allocation (`/district-plans/budget-model`):** Capital grant allocation modeling across districts.
* **LMI Analytics (`/analytics/lmi`):** Vacancy trend projections and sector growth curves.

### 2.2 District Officer (`DISTRICT_OFFICER`)
* **District Workbench (`/dashboard/district-officer`):** Local trade gap scores and operational alerts.
* **District Training Plans (`/district-plans`):** Annual plan builder, target intake synthesizer.
* **ITI Monitoring (`/placements/benchmarks`):** Institute placement rates vs. district median.
* **Equipment Audits (`/district-plans/equipment-deficits`):** Machinery gaps across local ITIs.

### 2.3 ITI Principal (`ITI_PRINCIPAL`)
* **Institute Overview (`/dashboard/iti`):** Institute placement status and sanctioned courses.
* **Monthly Placement Upload (`/placements/upload`):** CSV upload dropzone and error validator.
* **Course Performance (`/courses/performance`):** Course-by-course placement rates vs. district benchmarks.
* **Asset Register (`/iti/assets`):** Workshop machinery inventory and deficit flags.

### 2.4 Sector Skill Council Reviewer (`SSC_REVIEWER`)
* **Review Workbench (`/recommendations/review-queue`):** Incoming curriculum update proposals.
* **Evidence Dossier Viewer (`/recommendations/:id/dossier`):** Real-time empirical market data package.
* **Taxonomy Alignment (`/taxonomy/roles`):** National Occupational Standards (NOS) mapping.

### 2.5 Industry Partner / Employer (`EMPLOYER`)
* **Employer Dashboard (`/employer/dashboard`):** Active hiring signals and submissions.
* **Submit Skill Needs (`/employer/skill-needs`):** Quarterly trade demand specification.
* **Curriculum Validation (`/employer/curriculum-reviews`):** Industry feedback on draft syllabi.
* **Micro-Surveys (`/employer/surveys`):** Rapid 2-minute sector skill pulse surveys.

### 2.6 Trainee / Candidate (`CANDIDATE` & Public)
* **Explore Courses (`/candidate/courses`):** Verified placement statistics and salary benchmarks.
* **Pathway Quiz (`/candidate/pathway`):** 5-step adaptive career guidance flow.
* **My Enrolled Courses (`/candidate/dashboard`):** Mahaswayam course handoff and status.

---

## 3. Global Search Scope & Exclusions

In accordance with **DPDP Act 2023** and architectural decision **ADR-005**:
* **Included in Global Search:** Job Roles, Competency Skills, Vocational Courses, ITI Institutes, Sectors, Curriculum Recommendations.
* **Strictly Excluded from Global Search:** Candidate names, roll numbers, student records, and placement identifiers. There is **zero candidate search** across the entire platform.


---

<a id="04-design-ui_ux_specification-md"></a>

<!-- ======================================================== -->
<!-- FILE: 04-design/UI_UX_SPECIFICATION.md -->
<!-- ======================================================== -->

# MahaSkills — UI/UX Design Specification

**Platform:** MahaSkills · Government of Maharashtra (DSEEI / MSInS)  
**Problem Statement ID:** 26134  
**Primary Design System:** Radix UI / shadcn/ui + Tailwind CSS  
**Version:** 1.0  
**Status:** Canonical UI/UX Specification Baseline  

---

## 1. Shell Design & Navigation Framework

MahaSkills partitions user experience across **three core application shells**:

```mermaid
graph TD
    App[MahaSkills Web Platform]
    App --> PublicShell[1. PublicShell: High-performance public portal]
    App --> AppShell[2. AppShell: Multi-tier government & institutional portal]
    App --> CandidateShell[3. CandidateShell: Distraction-free trainee experience]
```

### 1.1 Shell Topologies & Responsive Breakpoints
* **Desktop ($> 1280\text{px}$):** Persistent 260px collapsible sidebar in `AppShell`, sticky header with jurisdictional scope badge and language selector.
* **Tablet ($768\text{px} - 1279\text{px}$):** Collapsible off-canvas drawer navigation, responsive table scroll containers with frozen primary columns.
* **Mobile ($< 768\text{px}$):** Candidate-first layout; bottom navigation bar for candidates, stacked cards replacing multi-column analytical tables.

---

## 2. Key Screen & Interface Specifications

### 2.1 Policy Maker State Dashboard (`/dashboard/policy-maker`)
* **Statewide Choropleth Heatmap:** Interactive map of Maharashtra highlighting all 36 districts colored by aggregated Skill Gap Intensity (`LOW`, `MODERATE`, `HIGH`, `CRITICAL`). Tooltip exposes active vacancies and ITI placement rates.
* **Top 10 Priority Interventions:** Ranked tabular cards displaying trades requiring urgent curriculum update or seat expansion.
* **Budget Model Visualizer:** Interactive bar charts contrasting proposed capital grant allocations against local industrial growth rates.

### 2.2 District Officer Workbench (`/dashboard/district-officer`)
* **District Plan Stepper:** 4-stage progress tracker for annual training plan generation:
  1. *Demand Extraction* $\rightarrow$ 2. *ITI Capacity Allocation* $\rightarrow$ 3. *Equipment Deficit Review* $\rightarrow$ 4. *Submission*.
* **ITI Compliance Monitor:** Real-time leaderboard tracking monthly placement return submissions across all district ITIs.

### 2.3 ITI Placement Upload Portal (`/placements/upload`)
* **Drag-and-Drop CSV Dropzone:** Visual drag zone with instant client-side file size and header check.
* **Inline Validation Error Grid:** Virtualized error table detailing exact row numbers, erroneous column values, and bilingual correction guidance.

### 2.4 SSC Curriculum Review Workbench (`/recommendations/:id/review`)
* **Dual-Pane Evaluation Layout:** Left pane displays the auto-compiled Evidence Dossier (12-month vacancy trend curves, top hiring companies, interstate benchmark comparisons). Right pane provides the formal technical review action form (`Approve`, `Request Revisions`, `Reject`).

### 2.5 Candidate Guidance & Pathway Quiz (`/candidate/pathway`)
* **5-Step Adaptive Career Quiz:** Wizard UI asking:
  1. *Current Educational Qualification*
  2. *Geographic District / Taluka*
  3. *Primary Sector Interests*
  4. *Language Preference*
  5. *Relocation Mobility*.
* **Outcome Cards:** Top 3 recommended courses featuring Verified Placement Rate, Median Starting Salary ($₹$), and "Enroll via Mahaswayam" primary CTA.

---

## 3. Universal State Patterns

| State | Visual Treatment & User Guidance |
|:---|:---|
| **Loading** | Accessible pulse skeletons replicating table/card layout. Zero blocking full-page spinners. |
| **Empty** | Contextual SVG illustration, clear descriptive heading, and a direct primary action button (e.g., "Upload First Placement Return"). |
| **Error** | Non-destructive alert banners with distinct error codes, retry buttons, and helpdesk contact details. |
| **Form Error** | Inline red border highlighting (`border-destructive`), ARIA `aria-invalid="true"`, and specific error text below the input. |


---

<a id="05-security-data_privacy-md"></a>

<!-- ======================================================== -->
<!-- FILE: 05-security/DATA_PRIVACY.md -->
<!-- ======================================================== -->

# MahaSkills — Data Privacy & DPDP Act 2023 Compliance

**Platform:** MahaSkills · Government of Maharashtra (DSEEI / MSInS)  
**Problem Statement ID:** 26134  
**Primary Regulatory Framework:** Digital Personal Data Protection (DPDP) Act 2023 (India)  
**Version:** 1.0  
**Status:** Canonical Data Privacy Baseline  

---

## 1. Statutory Context & Principles

MahaSkills processes vocational education and post-training employment returns on behalf of the Government of Maharashtra. Under the **Digital Personal Data Protection (DPDP) Act 2023**, the platform functions as a **Data Fiduciary** committed to:

1. **Lawful & Specified Purpose:** Personal data is collected solely to evaluate vocational curriculum effectiveness and calculate empirical skill gap scores.
2. **Data Minimization:** No unnecessary personal attributes (Aadhaar numbers, caste/religion identifiers, home addresses) are ingested or stored.
3. **Pseudonymization at Ingestion:** Candidate identities are cryptographically hashed before crossing into transactional databases.
4. **Zero Public Searchability:** The platform provides **zero candidate directory** and **zero employer-facing candidate search** in v1.
5. **Right to Erasure & Shredding:** Candidate pseudonymization keys are rotated and purged after 36 months, rendering records permanently de-linked.

---

## 2. Personal Data Inventory & Collection Justification

| Data Element | Source | Purpose of Processing | DPDP Justification | Storage State |
|:---|:---|:---|:---|:---|
| **Student Roll Number / Enrollment ID** | ITI Monthly Placement CSV | Verifying graduate employment status | Performance auditing of public vocational funds | Converted immediately to HMAC-SHA256; raw string purged |
| **Monthly Placement Salary** | ITI Monthly Placement CSV | Calculating median starting salaries per trade | Public transparency for prospective candidates | Persisted as aggregate statistics; individual records restricted |
| **Hiring Employer Name** | ITI Monthly Placement CSV | Measuring industry placement absorption | Curriculum alignment evidence | Persisted in placement returns |
| **Govt Official Name & Email** | Keycloak IAM | System authentication & audit logging | Legitimate state administrative operations | Plaintext with RBAC access gates |
| **Employer GSTIN & Contact** | Employer Registration | Verifying legal corporate identity | Preventing fraudulent skill demand submissions | Plaintext verified via MCA/GST portal |

---

## 3. Cryptographic Anonymization Pipeline

```mermaid
graph LR
    RawCSV[Raw Placement CSV: student_roll_no] --> IngestionWorker[Validation Worker Stream]
    IngestionWorker --> CryptoEngine[HMAC-SHA256 with HSM Salt]
    CryptoEngine --> HashOnly[candidate_hash: e3b0c442...]
    HashOnly --> PostgresDB[(PostgreSQL placement_records)]
    
    IngestionWorker -.->|Raw Identifier Purged| MemoryPurge[Zero Plaintext Disk Writes]
```

* **Tenant-Isolated Salt:** The HMAC salt is generated within an AWS CloudHSM / KMS enclave and is never accessible to database administrators.
* **Non-Reversibility:** Even in the event of a full database breach, candidate records cannot be converted back into student roll numbers or real-world names without access to the isolated HSM key.

---

## 4. Candidate Rights & DPDP Workflows

1. **Right to Confirmation & Correction:** Candidates may verify their training and placement record through their secure Mahaswayam SSO portal.
2. **Right to Grievance Redressal:** An in-app Data Protection Officer (DPO) ticketing workflow allows citizens to report data inaccuracies or unauthorized record submissions.
3. **Right to Erasure (Crypto-Shredding):** Upon completion of the statutory 3-year observation window, candidate pseudonymization salts are rotated. Historical placement records become mathematically impossible to re-identify, preserving aggregate econometric counts while fulfilling absolute right-to-erasure.

---

## 5. Data Breach Notification Protocol

In compliance with DPDP Act Section 8(6) and CERT-In directions:
1. **Detection & Containment:** SecOps isolates affected network segments within 60 minutes of alert trigger.
2. **Regulatory Notice:** Formal notification to the Data Protection Board of India and CERT-In within 6 hours.
3. **Citizen Notification:** Impacted Data Principals notified via registered SMS/email with mitigation advisories.


---

<a id="05-security-rbac_matrix-md"></a>

<!-- ======================================================== -->
<!-- FILE: 05-security/RBAC_MATRIX.md -->
<!-- ======================================================== -->

# MahaSkills — Role-Based Access Control (RBAC) Matrix

**Platform:** MahaSkills · Government of Maharashtra (DSEEI / MSInS)  
**Problem Statement ID:** 26134  
**Version:** 1.0  
**Status:** Canonical RBAC Matrix Baseline  

---

## 1. Access Control Model Overview

MahaSkills implements an enterprise **Role-Based Access Control (RBAC)** architecture coupled with **Attribute-Based Access Control (ABAC)** for jurisdictional scoping (`district_id`, `institute_id`, `sector_id`). 

* **Frontend Role:** Route guards, component rendering conditions, and UI action disabling provide user feedback.
* **Backend Role:** The backend API Gateway and service dependency injection act as the non-bypassable security boundary.

```mermaid
graph TD
    Request[Incoming Request with JWT] --> TokenVal[1. Validate RS256 Signature]
    TokenVal --> RoleVal{2. Has Required Role?}
    RoleVal -->|No| DenyRole[403 Forbidden: Missing Role]
    RoleVal -->|Yes| ScopeVal{3. Matches Scope Attribute?}
    ScopeVal -->|No| DenyScope[403 Forbidden: Outside Jurisdiction]
    ScopeVal -->|Yes| Allow[Allow Execution & Query Database]
```

---

## 2. Master Role × Resource × Action × Scope Matrix

| Resource | Action | Role | Jurisdictional Scope Constraint | Backend Guard Rule | Frontend Guard |
|:---|:---|:---|:---|:---|:---|
| **LMI Analytics** | `READ` | `POLICY_MAKER`, `ADMIN` | Statewide (All 36 Districts) | Unrestricted read | `/analytics/lmi` |
| **LMI Analytics** | `READ` | `DISTRICT_OFFICER` | Assigned district only | `district_id == user.district_id` | District Filter locked |
| **LMI Analytics** | `READ` | `ITI_PRINCIPAL` | Assigned district only | `district_id == user.district_id` | District Filter locked |
| **LMI Analytics** | `READ` | `EMPLOYER`, `CANDIDATE` | Aggregated state summaries only | Strip raw posting metadata | Public summary view |
| **Taxonomy** | `READ` | All Authenticated & Public | Global | Public read | `/taxonomy` |
| **Taxonomy** | `CREATE`, `UPDATE` | `ADMIN` | Global | Full write permission | `/admin/taxonomy` |
| **Gap Scores** | `READ` | `POLICY_MAKER`, `ADMIN` | Statewide (All 36 Districts) | Full read | `/gap-analysis` |
| **Gap Scores** | `READ` | `DISTRICT_OFFICER` | Assigned district only | `district_id == user.district_id` | Scoped to own district |
| **Gap Scores** | `RECALCULATE` | `ADMIN` | System-wide trigger | Admin role required | Admin maintenance panel |
| **Recommendations** | `READ` | All Roles | Statewide / Sector scoped | Public & internal summaries | `/recommendations` |
| **Recommendations** | `REVIEW` | `SSC_REVIEWER` | Assigned Sector SSCs only | `rec.sector_id in user.sector_ids` | Review button active |
| **Recommendations** | `APPROVE` | `POLICY_MAKER` | Statewide | DSEEI sign-off role | Approve button active |
| **Placement Returns**| `UPLOAD` | `ITI_PRINCIPAL` | Own Institute only | `institute_id == user.institute_id`| `/placements/upload` |
| **Placement Returns**| `READ_ERRORS` | `ITI_PRINCIPAL` | Own Institute only | `institute_id == user.institute_id`| View error grid |
| **Placement Returns**| `READ_RECORDS`| `DISTRICT_OFFICER` | Own District ITIs (anonymized) | `inst.district_id == user.district_id`| District benchmark view |
| **Placement Returns**| `READ_RECORDS`| `POLICY_MAKER`, `ADMIN` | Statewide (anonymized) | Read all anonymized returns | State benchmark view |
| **District Plans** | `CREATE`, `UPDATE`| `DISTRICT_OFFICER` | Own District only | `district_id == user.district_id` | `/district-plans/builder` |
| **District Plans** | `SANCTION` | `POLICY_MAKER` | Statewide | DSEEI Director role required | Sanction budget button |
| **District Plans** | `READ` | `ITI_PRINCIPAL` | Own District targets only | `district_id == user.district_id` | View assigned quotas |
| **Skill Needs** | `CREATE`, `UPDATE`| `EMPLOYER` | Registered enterprise profile | `employer_id == user.employer_id` | `/employer/skill-needs` |
| **Candidate Guidance**| `READ`, `QUIZ`| `CANDIDATE`, `ANONYMOUS`| Public | Open endpoints | `/candidate/pathway` |
| **Audit Logs** | `READ` | `ADMIN` | System-wide | Superadmin role required | `/admin/audit-logs` |
| **System Health** | `READ` | `ADMIN` | System-wide | Ops role required | `/admin/health` |

---

## 3. Scope Verification Implementation Details

### 3.1 Backend Security Middleware (FastAPI)
```python
def require_district_scope(requested_district_id: int, user: UserClaims = Depends(get_current_user)):
    if "POLICY_MAKER" in user.roles or "ADMIN" in user.roles:
        return  # Statewide override
    if "DISTRICT_OFFICER" in user.roles and user.district_id == requested_district_id:
        return  # Authorized district scope
    raise HTTPException(
        status_code=status.HTTP_403_FORBIDDEN,
        detail="Access denied: Resource outside jurisdictional district boundary."
    )
```

### 3.2 Frontend Route Guard (`TenantScopeGuard.tsx`)
```tsx
export const TenantScopeGuard = ({ requiredDistrictId, children }: Props) => {
  const { user } = useAuth();
  if (user.roles.includes('POLICY_MAKER') || user.roles.includes('ADMIN')) {
    return <>{children}</>;
  }
  if (user.district_id !== requiredDistrictId) {
    return <Navigate to="/unauthorized-scope" replace />;
  }
  return <>{children}</>;
};
```


---

<a id="05-security-security_architecture-md"></a>

<!-- ======================================================== -->
<!-- FILE: 05-security/SECURITY_ARCHITECTURE.md -->
<!-- ======================================================== -->

# MahaSkills — Security Architecture Specification

**Platform:** MahaSkills · Government of Maharashtra (DSEEI / MSInS)  
**Problem Statement ID:** 26134  
**Compliance Standard:** CERT-In Guidelines · ISO/IEC 27001 · OWASP ASVS Level 2  
**Version:** 1.0  
**Status:** Canonical Security Baseline  

---

## 1. Defense-in-Depth Security Model

MahaSkills applies a layered security defense model across all architectural planes:

```mermaid
graph TD
    subgraph Perimeter["1. Perimeter & Edge"]
        CloudFlare[Cloudflare / AWS WAF: DDoS, Geo-IP, TLS 1.3]
        KongGW[Kong API Gateway: Rate Limiting & Auth Validation]
    end

    subgraph Network["2. Network & Transport"]
        VPC[Isolated VPC in AWS Mumbai / GovCloud]
        PrivateSubnet[Private Subnets for App & Databases]
    end

    subgraph Application["3. Application Tier"]
        RBAC[Keycloak OIDC & RBAC Scoping Middleware]
        InputValidation[Pydantic v2 & Zod Strict Schema Sanitization]
    end

    subgraph Data["4. Data Tier"]
        TDE[PostgreSQL TDE AES-256 Storage Encryption]
        KMS[AWS KMS / HashiCorp Vault Secrets Rotation]
        Audit[Tamper-Evident Immutable Audit Logs]
    end

    Perimeter --> Network
    Network --> Application
    Application --> Data
```

---

## 2. OWASP Top 10 Countermeasures

| Vulnerability Category | Risk Scenario in MahaSkills | Technical Countermeasure |
|:---|:---|:---|
| **A01: Broken Access Control** | District Officer queries records belonging to an unauthorized district. | Strict jurisdictional claim validation in `TenantScopeGuard` at both API gateway and database query levels. |
| **A02: Cryptographic Failures** | Student PII exposed during placement CSV ingestion. | Immediate one-way HMAC-SHA256 pseudonymization before database write; TLS 1.3 in transit; AES-256 at rest. |
| **A03: Injection** | SQL injection via unvalidated filter parameters or CSV values. | Parameterized queries enforced across 100% of database access via SQLAlchemy 2.0 async ORM. |
| **A04: Insecure Design** | Premature curriculum publication bypassing SSC review. | Enforced state-machine transitions with digital administrative approval verification. |
| **A05: Security Misconfiguration** | Default Keycloak admin credentials or open CORS. | Keycloak administrative consoles restricted to internal VPC VPN; strict CORS allowing only registered domains. |
| **A06: Vulnerable Components** | Outdated npm packages or Python dependencies. | Automated dependency scanning via Dependabot, Snyk, and GitHub Actions security gates. |
| **A07: Identification & Auth Failures**| Session hijacking or brute force on login. | Keycloak multi-factor authentication (MFA) for government roles, OAuth 2.0 PKCE, and ephemeral in-memory access tokens. |
| **A08: Software & Data Integrity** | Tampered CSV files or forged evidence dossiers. | SHA-256 checksum verification on file upload; immutable S3 versioning with Object Lock. |
| **A09: Security Logging Failures** | Unauthorized data deletion goes undetected. | Centralized immutable audit logs written on all transactional writes; forwarded to CloudWatch / Loki. |
| **A10: Server-Side Request Forgery**| Scraper tricked into hitting internal metadata endpoints. | Scrapers execute in an isolated sandbox VPC with zero network route access to internal microservices. |

---

## 3. HTTP Security Headers Specification

Every response issued by the API Gateway or frontend CDN enforces these HTTP security headers:

```http
Strict-Transport-Security: max-age=63072000; includeSubDomains; preload
X-Content-Type-Options: nosniff
X-Frame-Options: DENY
Referrer-Policy: strict-origin-when-cross-origin
Permissions-Policy: geolocation=(), camera=(), microphone=(), payment=()
Content-Security-Policy: default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self'; connect-src 'self' https://api.mahaskills.maharashtra.gov.in https://auth.mahaskills.maharashtra.gov.in; frame-ancestors 'none';
```

---

## 4. Secrets Management & Key Lifecycle

* **Secrets Storage:** Zero secrets, database passwords, or JWT signing keys are stored in source code or unencrypted configuration files. All secrets reside in AWS Secrets Manager / HashiCorp Vault.
* **Key Rotation:**
  * Keycloak RS256 signing keys are rotated automatically every 90 days.
  * DPDP tenant pseudonymization salts are managed within AWS KMS Hardware Security Modules (HSMs) with strict access logging.


---

<a id="05-security-threat_model-md"></a>

<!-- ======================================================== -->
<!-- FILE: 05-security/THREAT_MODEL.md -->
<!-- ======================================================== -->

# MahaSkills — STRIDE Threat Model

**Platform:** MahaSkills · Government of Maharashtra (DSEEI / MSInS)  
**Problem Statement ID:** 26134  
**Methodology:** Microsoft STRIDE Threat Modeling  
**Version:** 1.0  
**Status:** Canonical Threat Model Baseline  

---

## 1. Attack Surfaces & Threat Analysis

```mermaid
graph LR
    Attacker((Adversary))
    
    Attacker -->|Threat 1: Token Forgery| Keycloak[Keycloak IAM]
    Attacker -->|Threat 2: Malicious CSV Payload| UploadEndpoint[CSV Ingestion Endpoint]
    Attacker -->|Threat 3: Cross-District Elevation| Gateway[API Gateway]
    Attacker -->|Threat 4: Scraper Poisoning| Scrapers[LMI Scraper Fleet]
    Attacker -->|Threat 5: Data Exfiltration| Database[(PostgreSQL Store)]
```

---

## 2. STRIDE Threat Assessment & Mitigation Matrix

| Threat Category | Threat Scenario | Impact | Likelihood | Architectural Mitigation | Status |
|:---|:---|:---|:---|:---|:---|
| **Spoofing (S)** | Attacker crafts a forged JWT claiming `POLICY_MAKER` role. | Critical | Low | RS256 cryptographic signature validation against Keycloak JWKS public keys at API Gateway. | Mitigated |
| **Tampering (T)** | ITI Principal modifies CSV placement file to inflate historical placement percentages. | High | Medium | Checksum verification; mandatory employer confirmation; automated statistical outlier detection. | Mitigated |
| **Repudiation (R)**| SSC reviewer approves controversial syllabus revision and denies having signed off. | Medium | Low | Append-only immutable `audit_logs` storing user ID, timestamp, IP address, and digital approval hash. | Mitigated |
| **Information Disclosure (I)**| Candidate PII leaked via database backup or SQL injection. | Critical | Low | Full HMAC-SHA256 pseudonymization of candidate IDs at upload perimeter; zero plaintext storage. | Mitigated |
| **Denial of Service (D)**| Attacker floods CSV upload endpoint with 500MB zip-bombs or nested files. | High | Medium | 100MB streaming upload cap; strict MIME-type checks; asynchronous queueing outside HTTP workers. | Mitigated |
| **Elevation of Privilege (E)**| District Officer alters URL parameter `district_id=14` to `20` to view other districts. | High | Medium | `TenantScopeGuard` enforces JWT scope claim against all requested route and query parameters. | Mitigated |

---

## 3. High-Risk Scenarios & Security Controls

### 3.1 Malicious CSV Upload & Zip-Bomb Prevention
* All placement uploads are inspected via streaming parsers with hard record limits (50,000 rows max).
* Uploaded files are stored in isolated S3 buckets with restricted IAM roles; no executable permissions or shell interpretations are permitted.

### 3.2 Cross-District Jurisdictional Boundary Enforcement
* All database queries issued on behalf of `DISTRICT_OFFICER` or `ITI_PRINCIPAL` automatically inject SQL predicates:
  ```sql
  WHERE district_id = :authenticated_user_district_id
  ```
  ensuring that even if an attacker tampers with client-side parameters, database row-level security denies execution.


---

<a id="06-data-data_dictionary-md"></a>

<!-- ======================================================== -->
<!-- FILE: 06-data/DATA_DICTIONARY.md -->
<!-- ======================================================== -->

# MahaSkills — Comprehensive Data Dictionary

**Platform:** MahaSkills · Government of Maharashtra (DSEEI / MSInS)  
**Problem Statement ID:** 26134  
**Compliance Standard:** Digital Personal Data Protection (DPDP) Act 2023  
**Version:** 1.0  
**Status:** Canonical Data Dictionary Baseline  

---

## 1. Sensitivity Classification Standard

Under the DPDP Act 2023 and Government of Maharashtra Information Security Guidelines, all data attributes within MahaSkills are classified into four privacy levels:

1. **`PUBLIC`**: Information accessible to unauthenticated citizens (course directories, qualification definitions, aggregated district statistics).
2. **`INTERNAL`**: Operational metadata accessible across authenticated government and institutional roles (training plans, sector taxonomy mappings, institutional MIS codes).
3. **`RESTRICTED`**: Sensitive administrative or financial data restricted to authorized jurisdictional scopes (audit logs, institutional placement returns, capital expenditure allocations).
4. **`PII_ANONYMIZED`**: Individual identifiers processed strictly via one-way cryptographic pseudonymization (student candidate records, placement hashes). Raw plaintext PII is **never persisted**.

---

## 2. Master Data Dictionary by Entity

### 2.1 Geographic & Administrative Entities (`districts`)

| Field Name | Entity | Type | Nullable | Business Definition | Constraints / Formats | Example | Sensitivity |
|:---|:---|:---|:---|:---|:---|:---|:---|
| `id` | `districts` | Integer | No | Primary synthetic identifier for the administrative district | Auto-incrementing primary key | `14` | `PUBLIC` |
| `code` | `districts` | String(10) | No | Standardized state geographic code | Unique, alphanumeric | `"MH-PU"` | `PUBLIC` |
| `name_en` | `districts` | String(100) | No | Official district name in English | Standard Maharashtra gazetteer name | `"Pune"` | `PUBLIC` |
| `name_mr` | `districts` | String(100) | No | Official district name in Marathi | Unicode Devanagari string | `"पुणे"` | `PUBLIC` |
| `division` | `districts` | String(50) | No | Administrative revenue division of Maharashtra | `Pune`, `Konkan`, `Nashik`, `Aurangabad`, `Amravati`, `Nagpur` | `"Pune"` | `PUBLIC` |
| `latitude` | `districts` | Decimal(9,6) | No | Geographic centroid latitude coordinate | $-90.000000$ to $+90.000000$ | `18.520430` | `PUBLIC` |
| `longitude` | `districts` | Decimal(9,6) | No | Geographic centroid longitude coordinate | $-180.000000$ to $+180.000000$ | `73.856744` | `PUBLIC` |

---

### 2.2 Taxonomy: Sectors, SSCs, Job Roles & Skills

| Field Name | Entity | Type | Nullable | Business Definition | Constraints / Formats | Example | Sensitivity |
|:---|:---|:---|:---|:---|:---|:---|:---|
| `sector_id` | `sectors` | Integer | No | Synthetic identifier for industrial sector | Foreign key | `3` | `PUBLIC` |
| `sector_code` | `sectors` | String(20) | No | Industry sector acronym | Unique | `"AUTO"` | `PUBLIC` |
| `ssc_id` | `sscs` | Integer | No | Identifier for Sector Skill Council body | Distinct from `sector_id` | `5` | `PUBLIC` |
| `ssc_code` | `sscs` | String(30) | No | National SSC code assigned by NSDC | Unique | `"ASDC"` | `PUBLIC` |
| `job_role_id` | `job_roles` | UUID | No | Canonical identifier for occupational role | UUID v4 | `a3b8...` | `PUBLIC` |
| `qp_code` | `job_roles` | String(50) | No | National Qualification Pack identifier code | Format: `[A-Z]{3}/Q[0-9]{4}` | `"ASC/Q1402"` | `PUBLIC` |
| `nsqf_level` | `job_roles` | Integer | No | Skill qualification competency level | Discrete integer between $1$ and $10$ | `4` | `PUBLIC` |
| `skill_id` | `skills` | UUID | No | Canonical competency skill identifier | UUID v4 | `c1d9...` | `PUBLIC` |
| `is_emerging` | `skills` | Boolean | No | Flag indicating skill detected by NLP not yet codified by SSC | Default `FALSE` | `TRUE` | `INTERNAL` |

---

### 2.3 Institutes & Vocational Courses

| Field Name | Entity | Type | Nullable | Business Definition | Constraints / Formats | Example | Sensitivity |
|:---|:---|:---|:---|:---|:---|:---|:---|
| `institute_id` | `institutes` | UUID | No | Unique identifier for ITI / Polytechnic | UUID v4 | `f4a1...` | `PUBLIC` |
| `mis_code` | `institutes` | String(50) | No | Directorate of Vocational Education code | Unique | `"ITI-PUN-001"` | `PUBLIC` |
| `institute_type`| `institutes` | String(50) | No | Institutional governance classification | `GOVT_ITI`, `PVT_ITI`, `POLYTECHNIC` | `"GOVT_ITI"` | `PUBLIC` |
| `course_id` | `courses` | UUID | No | Unique identifier for vocational trade | UUID v4 | `e2a4...` | `PUBLIC` |
| `duration_months`| `courses` | Integer | No | Formal syllabus training duration | Greater than 0 | `24` | `PUBLIC` |
| `tuition_fee_inr`| `courses` | Decimal(10,2)| No | Standard tuition fee charged to candidates | $\ge 0.00$ | `2400.00` | `PUBLIC` |
| `sanctioned_intake`| `institute_courses` | Integer | No | Approved candidate intake per academic batch | $\ge 1$ | `40` | `INTERNAL` |

---

### 2.4 Placement Ingestion & Candidate Tracking (DPDP Act 2023)

| Field Name | Entity | Type | Nullable | Business Definition | Constraints / Formats | Example | Sensitivity |
|:---|:---|:---|:---|:---|:---|:---|:---|
| `batch_id` | `placement_batches` | UUID | No | Synthetic identifier for monthly CSV submission | UUID v4 | `9b1d...` | `INTERNAL` |
| `candidate_hash` | `placement_records` | String(64) | No | Irreversible HMAC-SHA256 salted hash of trainee identity | 64-character lowercase hex string | `e3b0c44298fc...` | `PII_ANONYMIZED` |
| `batch_year` | `placement_records` | Integer | No | Calendar completion year of training cohort | $2020$ to $2035$ | `2025` | `INTERNAL` |
| `is_placed` | `placement_records` | Boolean | No | Verification flag indicating gainful employment outcome | `TRUE` or `FALSE` | `TRUE` | `INTERNAL` |
| `employer_name` | `placement_records` | String(200) | Yes | Name of enterprise offering employment | Required if `is_placed = TRUE` | `"Tata Motors Ltd"` | `INTERNAL` |
| `monthly_salary` | `placement_records` | Decimal(10,2)| Yes | Starting gross monthly compensation | Between ₹8,000 and ₹2,00,000 | `24500.00` | `RESTRICTED` |
| `months_to_placement` | `placement_records` | Integer | Yes | Months elapsed between course completion and job offer | $\ge 0$ | `2` | `INTERNAL` |

---

### 2.5 Gap Scoring & Recommendation Engines

| Field Name | Entity | Type | Nullable | Business Definition | Constraints / Formats | Example | Sensitivity |
|:---|:---|:---|:---|:---|:---|:---|:---|
| `gap_score` | `gap_scores` | Decimal(5,2) | No | Normalized labour-market deficit index | $0.00$ to $100.00$ | `74.50` | `PUBLIC` |
| `demand_count` | `gap_scores` | Integer | No | Aggregated active vacancies over calculation window | $\ge 0$ | `1420` | `PUBLIC` |
| `placement_rate`| `gap_scores` | Decimal(5,2) | No | Historical percentage of graduates placed | $0.00$ to $100.00$ | `41.20` | `PUBLIC` |
| `severity_level`| `gap_scores` | String(30) | No | Categorical classification of skill deficit | `LOW`, `MODERATE`, `HIGH`, `CRITICAL` | `"HIGH"` | `PUBLIC` |
| `recommendation_code` | `recommendations` | String(30) | No | Human-readable curriculum recommendation ID | Format: `REC-[YYYY]-[SEQ]` | `"REC-2026-0042"`| `PUBLIC` |
| `recommendation_type` | `recommendations` | String(50) | No | Typology of proposed curriculum intervention | `ADD_MODULE`, `UPDATE_UNIT`, `NEW_QUALIFICATION`, `RETIRE_COURSE` | `"ADD_MODULE"` | `PUBLIC` |
| `status` | `recommendations` | String(50) | No | Workflow approval lifecycle status | `DRAFT`, `UNDER_SSC_REVIEW`, `SSC_APPROVED`, `DSEEI_FINAL_APPROVAL`, `PUBLISHED`, `REJECTED` | `"UNDER_SSC_REVIEW"` | `INTERNAL` |

---

### 2.6 District Training Plans & Infrastructure Audits

| Field Name | Entity | Type | Nullable | Business Definition | Constraints / Formats | Example | Sensitivity |
|:---|:---|:---|:---|:---|:---|:---|:---|
| `plan_id` | `district_plans` | UUID | No | Unique identifier for annual district training plan | UUID v4 | `7f1e...` | `INTERNAL` |
| `fiscal_year` | `district_plans` | String(9) | No | Target government fiscal year | Format: `YYYY-YYYY` | `"2026-2027"` | `INTERNAL` |
| `total_target_intake` | `district_plans` | Integer | No | Aggregated target student capacity across all district ITIs | $\ge 0$ | `12400` | `INTERNAL` |
| `equipment_capex_required` | `district_plan_items` | Decimal(12,2)| No | Estimated modernization expenditure to bridge workshop tool gap | In Indian Rupees ($\ge 0.00$) | `1450000.00` | `RESTRICTED` |
| `trainer_upskilling_quota` | `district_plan_items` | Integer | No | Target number of instructors mandated for technical retraining | $\ge 0$ | `18` | `INTERNAL` |

---

### 2.7 Identity & Security Audit Trails

| Field Name | Entity | Type | Nullable | Business Definition | Constraints / Formats | Example | Sensitivity |
|:---|:---|:---|:---|:---|:---|:---|:---|
| `keycloak_sub` | `users` | String(100) | No | Immutable unique OIDC subject identifier from Keycloak | Non-empty string | `"f3a18b72-..."` | `INTERNAL` |
| `email` | `users` | String(255) | No | Authorized official email address | Valid email format | `"dpo.pune@gov.in"` | `INTERNAL` |
| `action` | `audit_logs` | String(100) | No | Standardized administrative operation identifier | Upper snake_case | `"CURRICULUM_APPROVED"` | `RESTRICTED` |
| `ip_address` | `audit_logs` | INET | Yes | Source IPv4 or IPv6 client address | Valid network IP | `"103.21.144.2"` | `RESTRICTED` |
| `old_values` | `audit_logs` | JSONB | Yes | Pre-mutation database state snapshot | JSON object | `{"status": "DRAFT"}` | `RESTRICTED` |
| `new_values` | `audit_logs` | JSONB | Yes | Post-mutation database state snapshot | JSON object | `{"status": "REVIEW"}`| `RESTRICTED` |


---

<a id="06-data-data_governance-md"></a>

<!-- ======================================================== -->
<!-- FILE: 06-data/DATA_GOVERNANCE.md -->
<!-- ======================================================== -->

# MahaSkills — Data Governance & Lifecycle Policy

**Platform:** MahaSkills · Government of Maharashtra (DSEEI / MSInS)  
**Problem Statement ID:** 26134  
**Compliance Mandate:** Digital Personal Data Protection (DPDP) Act 2023  
**Version:** 1.0  
**Status:** Canonical Governance Baseline  

---

## 1. Data Ownership & Stewardship RACI

| Data Domain | Responsible (R) | Accountable (A) | Consulted (C) | Informed (I) |
|:---|:---|:---|:---|:---|
| **Skill Taxonomy & NSQF Roles** | State Data Steward | MSInS CEO | 36 Sector Skill Councils | Training Institutes |
| **Job Market Vacancy Signals** | LMI Pipeline Lead | DSEEI Joint Secretary | Industry Associations (MCCIA/CII) | Public |
| **Institutional Placement Records**| ITI Principal | District Skill Officer | DVET Directorate | Candidate Trainees |
| **Curriculum Update Proposals** | SSC Technical Committee | DSEEI Approval Authority | NCVET Council | ITI Principals |
| **District Training Plans** | District Skill Officer | District Collector | Local MSME Associations | DSEEI Planning |
| **System Security & Audit Logs** | SecOps Lead | CISO Maharashtra | CERT-In | PMO Directorate |

---

## 2. Statutory Data Retention & Disposal Schedules

In compliance with DPDP 2023 and Maharashtra State Public Records Rules:

```mermaid
timeline
    title MahaSkills Data Lifecycle & Archival Timeline
    Ingestion Perimeter : Raw Student PII instantly hashed via HMAC-SHA256
    2 Years : Job Vacancy Postings Purged from Operational Database
    3 Years : Candidate Pseudonym Salt Shuffled (Irreversible Cryptographic Erasure)
    7 Years : Placement Outcomes & Audit Logs Transition to Cold Archival Storage
    Permanent : Anonymized Macroeconomic Gap Trends Retained for Policy Modeling
```

| Record Classification | Operational Retention | Archival Tier | Final Disposal Action | Regulatory Requirement |
|:---|:---|:---|:---|:---|
| **Raw Web Scrape Dumps** | 90 days (S3 Standard) | S3 Glacier (1 year) | Cryptographic Deletion | Platform Optimization |
| **Processed Job Postings** | 24 months (PostgreSQL) | None | Automated Partition Drop | Storage Optimization |
| **Placement Records** | 36 months (PostgreSQL) | S3 Coldline (48 months) | Permanent Cold Storage | ITI Audit Statutory Rules (7 yrs) |
| **Candidate Pseudonym Keys**| 36 months (KMS Vault) | None | Key Shredding (Crypto-Erase)| DPDP Act 2023 Data Minimization |
| **Administrative Audit Logs**| 84 months (PostgreSQL) | WORM S3 Storage | Immutable Archive | State IT Audit Guidelines |

---

## 3. Data Freshness Service Level Objectives (SLOs)

* **Labour Market Intelligence:** Live vacancy index updated daily by 06:00 IST ($< 24\text{h}$ freshness).
* **Placement Returns:** Institutional monthly returns validated and ingested within 48 hours of monthly upload cutoff.
* **Skill Gap Recalculation:** Statewide 36-district gap score refreshed every Sunday by 03:00 IST ($< 7\text{d}$ freshness).
* **Curriculum Dossiers:** Evidence dossiers re-synthesized within 15 minutes of any official recommendation stage transition.


---

<a id="06-data-data_ingestion-md"></a>

<!-- ======================================================== -->
<!-- FILE: 06-data/DATA_INGESTION.md -->
<!-- ======================================================== -->

# MahaSkills — Data Ingestion & Pipeline Specification

**Platform:** MahaSkills · Government of Maharashtra (DSEEI / MSInS)  
**Problem Statement ID:** 26134  
**Version:** 1.0  
**Status:** Canonical Ingestion Baseline  

---

## 1. Ingestion Architecture & Data Sources

MahaSkills ingests high-frequency labour demand and institutional outcome signals through four dedicated ingestion channels:

```mermaid
graph TD
    subgraph Sources["External Sources"]
        Naukri[Naukri Licensed API]
        LinkedIn[LinkedIn Scraper]
        Indeed[Indeed RSS Feed]
        NCS[NCS Open API]
        ITICsV[ITI Monthly Placement CSV]
        EmployerForms[Employer Skill Needs Portal]
    end

    subgraph Airflow["Apache Airflow Pipeline & Validation"]
        DAG1[Nightly Scraper DAG]
        DAG2[Placement Validation Worker]
        DAG3[NLP Taxonomy Mapper]
    end

    subgraph Targets["Storage & Analytics"]
        S3[S3 Raw Archive]
        PG[(PostgreSQL 16)]
        ES[(Elasticsearch 8)]
    end

    Naukri --> DAG1
    LinkedIn --> DAG1
    Indeed --> DAG1
    NCS --> DAG1
    ITICsV --> DAG2
    EmployerForms --> PG

    DAG1 --> S3
    DAG1 --> DAG3
    DAG2 --> S3
    DAG2 --> PG
    DAG3 --> PG
    DAG3 --> ES
```

---

## 2. ITI Placement CSV Upload Specification

ITIs must submit placement returns on or before the 5th of each calendar month using the standardized template below.

### 2.1 Standardized CSV Header Format
```csv
candidate_id,course_code,batch_year,placed,employer_name,job_role,monthly_salary,months_to_placement
```

### 2.2 Row Validation Schema & Business Constraints

| Header Field | Type / Format | Mandatory? | Validation Rule | Error Code on Failure |
|:---|:---|:---|:---|:---|
| `candidate_id` | Alphanumeric (String) | **Yes** | 6 to 32 characters; converted immediately to HMAC-SHA256 | `ERR_INVALID_CANDIDATE_ID` |
| `course_code` | String (e.g. `CTS-ELE-01`) | **Yes** | Must match an active course sanctioned for the uploading institute | `ERR_UNSANCTIONED_COURSE` |
| `batch_year` | Integer ($YYYY$) | **Yes** | Current year or preceding 2 years ($2024 \le \text{Year} \le 2026$) | `ERR_OUT_OF_RANGE_BATCH_YEAR` |
| `placed` | `Y` or `N` | **Yes** | Case-insensitive single character; converts to boolean | `ERR_INVALID_BOOLEAN_FLAG` |
| `employer_name` | String (1–200 chars) | Cond. | Mandatory if `placed = Y`; must be blank/NA if `placed = N` | `ERR_MISSING_EMPLOYER_NAME` |
| `job_role` | String (1–200 chars) | Cond. | Mandatory if `placed = Y`; must be blank/NA if `placed = N` | `ERR_MISSING_JOB_ROLE` |
| `monthly_salary`| Decimal ($₹$) | Cond. | Mandatory if `placed = Y`. Constraint: $8,000.00 \le \text{Salary} \le 2,00,000.00$ | `ERR_SALARY_OUT_OF_BOUNDS` |
| `months_to_placement` | Integer | Cond. | Mandatory if `placed = Y`. Constraint: $0 \le \text{Months} \le 36$ | `ERR_INVALID_MONTHS_TO_HIRE` |

### 2.3 Pseudonymization Pipeline (DPDP 2023)
```python
import hmac
import hashlib
import os

TENANT_PEPPER = os.environ["DPDP_TENANT_SALT"].encode("utf-8")

def pseudonymize_candidate_id(raw_id: str) -> str:
    """Generates irreversible HMAC-SHA256 hash for student identity."""
    normalized = raw_id.strip().upper().encode("utf-8")
    return hmac.new(TENANT_PEPPER, normalized, hashlib.sha256).hexdigest()
```

---

## 3. Web Scraping & External Feed Engine

### 3.1 Scraping Politeness, Concurrency & Proxy Strategy
* **Scraping Framework:** Python Scrapy + Playwright headless engine for dynamic JavaScript-rendered postings.
* **Rate Limits:** Maximum 2 requests/second per target domain; randomized delay jitter ($\pm 400\text{ms}$).
* **User-Agent & Proxies:** Residential proxy rotation with Maharashtra/India IP exit nodes; compliant `User-Agent: MahaSkillsBot/1.0 (+https://mahaskills.maharashtra.gov.in/bot)`.
* **Retry Protocol:** Exponential backoff with jitter up to 3 retries. Transient 429/503 errors trigger circuit breaker pauses.

### 3.2 Deduplication Key Formulation
Before inserting into `job_postings`, duplicates are filtered via a composite hash:
$$\text{Deduplication Hash} = \text{MD5}\left(\text{clean}(company\_name) + "|" + \text{clean}(title) + "|" + district\_id + "|" + posted\_date\right)$$
Duplicate postings update the `vacancies_count` rather than creating redundant records.

---

## 4. Pipeline Execution SLA & Alerting Rules

| Pipeline Component | Frequency | Max Processing Duration | Failure Alert Destination |
|:---|:---|:---|:---|
| `lmi_nightly_job_scraping` | Daily at 02:00 IST | 120 minutes | PagerDuty / Slack #ops-alerts |
| `placement_csv_validation` | On-demand (Upload) | 30 seconds (per 10k rows) | In-app notification to ITI Principal |
| `weekly_gap_score_computation` | Sunday at 01:00 IST | 45 minutes | PMO Lead & Data Steward |


---

<a id="06-data-data_model-md"></a>

<!-- ======================================================== -->
<!-- FILE: 06-data/DATA_MODEL.md -->
<!-- ======================================================== -->

# MahaSkills — Data Model Specification

**Platform:** MahaSkills · Government of Maharashtra (DSEEI / MSInS)  
**Problem Statement ID:** 26134  
**Version:** 1.0  
**Status:** Canonical Logical Data Model Baseline  

---

## 1. Conceptual Domain Boundaries

The MahaSkills domain model is divided into five core business bounded contexts:

1. **Taxonomy & Standards Context:** Standardizes skills, job roles, qualification packs (QPs), sectors, and Sector Skill Councils (SSCs).
2. **Labour Market Intelligence (LMI) Context:** Aggregates external labour demand signals from scrapers, APIs, and employer skill needs.
3. **Institutional Capacity & Outcomes Context:** Represents ITIs, polytechnics, sanctioned seat capacities, and verified placement returns.
4. **Intelligence & Decision Context:** Computes gap scores, identifies oversupply, compiles evidence dossiers, and orchestrates curriculum recommendation workflows.
5. **Operational Governance Context:** Manages annual District Training Plans, equipment gap audits, Keycloak identity mappings, and immutable audit logs.

```mermaid
graph LR
    subgraph LMI_Context["Labour Market Intelligence"]
        JP[Job Postings]
        SN[Employer Skill Needs]
        SRV[Surveys]
    end

    subgraph Taxonomy_Context["Taxonomy & Qualifications"]
        SEC[Sectors]
        SSC[SSCs]
        JR[Job Roles]
        SK[Skills]
    end

    subgraph Institutional_Context["Institutional Outcomes"]
        INST[Institutes]
        CRS[Courses]
        PLC[Placement Records]
    end

    subgraph Intelligence_Context["Intelligence & Decision"]
        GAP[Gap Scores]
        REC[Recommendations]
        EVD[Evidence Dossiers]
    end

    subgraph Governance_Context["Governance & Planning"]
        DTP[District Plans]
        EQP[Equipment Audits]
        USR[Users & Scopes]
    end

    LMI_Context --> Intelligence_Context
    Taxonomy_Context --> Intelligence_Context
    Institutional_Context --> Intelligence_Context
    Taxonomy_Context --> Institutional_Context
    Intelligence_Context --> Governance_Context
    Institutional_Context --> Governance_Context
```

---

## 2. Core State Machines & Lifecycle Dynamics

### 2.1 Placement Ingestion Batch Lifecycle
```mermaid
stateDiagram-v2
    [*] --> PENDING: CSV File Streamed to S3
    PENDING --> VALIDATING: Ingestion Worker Claims Batch
    VALIDATING --> REJECTED: Header Mismatch or Syntax Errors
    VALIDATING --> REJECTED: Row-Level Validation Errors Detected
    VALIDATING --> COMPLETED: 100% Records Valid & Pseudonymized
    REJECTED --> [*]: Error Log Exported to Principal
    COMPLETED --> [*]: Trigger Gap Recalculation
```

### 2.2 Curriculum Recommendation Lifecycle
```mermaid
stateDiagram-v2
    [*] --> DRAFT: Auto-Triggered by Gap Score > 60 for 8 Wks
    DRAFT --> UNDER_SSC_REVIEW: PMO Assigns to Relevant SSC
    UNDER_SSC_REVIEW --> SSC_REVISIONS_REQUESTED: Evidence Package Insufficient
    SSC_REVISIONS_REQUESTED --> UNDER_SSC_REVIEW: PMO Updates Dossier
    UNDER_SSC_REVIEW --> SSC_APPROVED: SSC Technical Committee Approves
    UNDER_SSC_REVIEW --> REJECTED: SSC Determines Trade Unviable
    SSC_APPROVED --> DSEEI_FINAL_APPROVAL: Forwarded to Joint Secretary
    DSEEI_FINAL_APPROVAL --> PUBLISHED: Official Digital Sanction
    DSEEI_FINAL_APPROVAL --> REJECTED: Sanction Denied
    PUBLISHED --> [*]: Distributed to ITI Principals
```

### 2.3 District Training Plan Lifecycle
```mermaid
stateDiagram-v2
    [*] --> DRAFT: Synthesized Annually in April
    DRAFT --> IN_REVIEW: District Officer Fine-Tunes Targets
    IN_REVIEW --> SUBMITTED: Submitted to DSEEI Directorate
    SUBMITTED --> REVISIONS_REQUESTED: DVET Recommends Capacity Shifts
    REVISIONS_REQUESTED --> IN_REVIEW: District Officer Adjusts
    SUBMITTED --> APPROVED: State Council Ratifies Targets
    APPROVED --> SANCTIONED: Budget & Capex Disbursed
    SANCTIONED --> [*]
```

---

## 3. Cardinality & Cascade Integrity Rules

| Primary Entity | Related Entity | Cardinality | Deletion Policy | Business Rule Justification |
|:---|:---|:---|:---|:---|
| `sectors` | `job_roles` | $1 : N$ | `RESTRICT` | A sector cannot be deleted if active qualification packs reference it. |
| `sectors` | `sscs` | $1 : N$ | `RESTRICT` | An SSC cannot exist without an overarching sector mapping. |
| `job_roles` | `courses` | $1 : N$ | `RESTRICT` | Cannot delete an official job role while active institute courses teach it. |
| `courses` | `institute_courses` | $1 : N$ | `RESTRICT` | Prevents orphan courses with active student enrollments. |
| `institutes` | `placement_batches` | $1 : N$ | `RESTRICT` | Placement historical returns must persist for 7 years under statutory audit rules. |
| `placement_batches` | `placement_records` | $1 : N$ | `CASCADE` | If a corrupted batch is deleted, its constituent staging records are removed. |
| `recommendations` | `recommendation_evidence` | $1 : N$ | `CASCADE` | Evidence packages are intrinsically tied to their parent recommendation dossier. |
| `recommendations` | `recommendation_audits` | $1 : N$ | `CASCADE` | Approval audit records belong to the recommendation entity lifecycle. |


---

<a id="07-development-coding_standards-md"></a>

<!-- ======================================================== -->
<!-- FILE: 07-development/CODING_STANDARDS.md -->
<!-- ======================================================== -->

# MahaSkills — Engineering & Coding Standards

**Platform:** MahaSkills · Government of Maharashtra (DSEEI / MSInS)  
**Problem Statement ID:** 26134  
**Version:** 1.0  
**Status:** Canonical Coding Standards Baseline  

---

## 1. Frontend Development Standards (React & TypeScript)

* **TypeScript Strictness:** `"strict": true`, `"noImplicitAny": true`, `"exactOptionalPropertyTypes": true`. The use of `any` is strictly banned in production code; use `unknown` with runtime type narrowing or generic type parameters.
* **Component Architecture:** Functional components exclusively, using named exports:
  ```tsx
  export const GapHeatmapCard: React.FC<GapHeatmapCardProps> = ({ districtId, sectorId }) => { ... };
  ```
* **Styling:** Tailwind CSS utility classes organized via `prettier-plugin-tailwindcss`. Dynamic class combinations must use `cn()` (`clsx` + `tailwind-merge`).
* **Forms & Validation:** All forms utilize `react-hook-form` coupled with `zod` schema resolvers. Form state must be validated client-side before dispatching network requests.
* **Internationalization:** Never embed raw English or Marathi strings in JSX. Every user-visible text string must use `t('domain.key')` from `react-i18next`.

---

## 2. Backend Development Standards (Python & FastAPI)

* **Type Hinting:** 100% of function signatures must include Python type annotations (`typing.Annotated`, `typing.Optional`, `list`, `dict`).
* **Data Validation:** All request bodies and query parameters must be validated via **Pydantic v2** models with explicit field descriptions and validation constraints.
* **Async IO:** All database access, external HTTP requests, and Redis operations must use non-blocking asynchronous calls (`async/await`) with `asyncpg` and `httpx`.
* **Database Queries:** Raw string SQL concatenation is forbidden. All queries must utilize SQLAlchemy 2.0 ORM or parameterized Core statements.
* **Code Formatting:** Code style enforced via `ruff` and `black` with a line-length limit of 100 characters.

---

## 3. Git Workflow & Commit Conventions

* **Branching Strategy:** GitHub Flow with short-lived feature branches: `feat/REQ-ID-short-title`, `fix/issue-id-short-title`.
* **Conventional Commits:** All commit messages must follow the Conventional Commits specification:
  ```text
  feat(lmi): add nightly deduplication task for naukri scraper (REQ-LMI-01)
  fix(placements): correct salary range validation bounds (REQ-PLA-01)
  test(gap-scoring): add unit tests for oversupply heuristic (TEST-GAP-002)
  ```
* **Pre-Commit Hooks:** Husky runs `lint-staged`, type-checking (`tsc --noEmit`), and secrets scanning (`gitleaks`) prior to any commit.


---

<a id="07-development-implementation_plan-md"></a>

<!-- ======================================================== -->
<!-- FILE: 07-development/IMPLEMENTATION_PLAN.md -->
<!-- ======================================================== -->

# MahaSkills — Technical Implementation Plan (Vertical Slices 0–11)

**Platform:** MahaSkills · Government of Maharashtra (DSEEI / MSInS)  
**Problem Statement ID:** 26134  
**Strategy:** Domain-Driven Vertical Slices with Strict Quality Gates  
**Version:** 1.0  
**Status:** Canonical Implementation Plan Baseline  

---

## 1. Vertical Slice Engineering Strategy

Every vertical slice delivers an end-to-end operable slice across all tiers: **Database DDL $\rightarrow$ Backend API $\rightarrow$ Mock Server $\rightarrow$ TypeScript Types $\rightarrow$ React Components $\rightarrow$ State Stores $\rightarrow$ Automated Tests**.

```mermaid
graph LR
    Slice[Vertical Slice N]
    Slice --> DB[Database Migrations]
    Slice --> API[FastAPI Routers & Services]
    Slice --> Types[OpenAPI Type Sync]
    Slice --> UI[React Routes & Components]
    Slice --> Test[E2E & Contract Tests]
```

---

## 2. Vertical Slices Breakdown

### Slice 0: Foundation & Core Infrastructure
* **Scope:** Setup monorepo/workspace, PostgreSQL 16 migrations base, Redis connection, Docker Compose, Tailwind design tokens, base routing, and CI/CD pipelines.
* **Deliverables:** Working shell, database connectivity, OpenAPI validator.
* **Test Gate:** `TEST-INFRA-001` (DB health check, Docker build passes).

### Slice 1: Shell, Authentication & RBAC Access Gates
* **Scope:** Keycloak OIDC integration with PKCE, JWT decoding, `TenantScopeGuard`, `RoleGuard`, public vs authenticated shell layouts.
* **Deliverables:** `/auth/login`, `/auth/callback`, `AppShell`, role-based sidebar switching.
* **Test Gate:** `TEST-SEC-001`, `TEST-SEC-002`, `TEST-SEC-003`.

### Slice 2: Data Primitives & Taxonomy Hierarchy
* **Scope:** NSQF taxonomy seed (~2,200 job roles, 33 sectors, 36 SSCs), Elasticsearch indexing, interactive taxonomy tree view.
* **Deliverables:** `/taxonomy`, `TaxonomyTreeView`, `SkillBadge`, `GET /v1/taxonomy/tree`.
* **Test Gate:** `TEST-TAX-001`, `TEST-TAX-002`.

### Slice 3: Labour Market Intelligence & External Data Feeds
* **Scope:** Nightly Airflow job scraper DAGs, raw posting storage, deduplication, vacancy aggregation endpoints.
* **Deliverables:** `/analytics/lmi`, `DemandTrendChart`, `GET /v1/lmi/aggregates`.
* **Test Gate:** `TEST-ING-001`, `TEST-LMI-001`.

### Slice 4: Algorithmic Gap Scoring & State Dashboards
* **Scope:** Weekly gap scoring engine Celery tasks, oversupply detection heuristic, interactive state and district choropleth heatmap.
* **Deliverables:** `/gap-analysis`, `GapHeatmap`, `OversupplyTable`, `GET /v1/gap-scores`.
* **Test Gate:** `TEST-GAP-001`, `TEST-GAP-002`.

### Slice 5: ITI Placement Ingestion & DPDP Anonymization
* **Scope:** Monthly placement CSV drag-and-drop upload, streaming parser, HMAC-SHA256 candidate pseudonymization, cell-level validation grid.
* **Deliverables:** `/placements/upload`, `CsvDropzone`, `ValidationErrorTable`, `POST /v1/ingestion/placements/upload`.
* **Test Gate:** `TEST-PLA-001`, `TEST-PLA-002`, `TEST-PLA-003`.

### Slice 6: Curriculum Recommendations & Multi-Stage Review Workflow
* **Scope:** Automated recommendation triggering ($> 60$ gap for 8 wks), evidence dossier auto-compiler, SSC review workbench, DSEEI approval flow.
* **Deliverables:** `/recommendations`, `DossierViewer`, `ApprovalStepper`, `POST /v1/recommendations/{id}/review`.
* **Test Gate:** `TEST-REC-001`, `TEST-REC-002`, `TEST-REC-003`.

### Slice 7: Employer Portal & Structured Skill Needs
* **Scope:** GSTIN-verified registration, quarterly skill needs submission form, sector-triggered micro-surveys.
* **Deliverables:** `/employer/skill-needs`, `GstinLookup`, `MicroSurveyDialog`.
* **Test Gate:** `TEST-EMP-001`, `TEST-EMP-002`, `TEST-EMP-003`.

### Slice 8: Candidate Guidance, Course Finder & Pathway Quiz
* **Scope:** Public course catalog with verified placement statistics (median salary, time-to-hire), 5-step adaptive pathway quiz, Mahaswayam SSO handoff.
* **Deliverables:** `/candidate/courses`, `/candidate/pathway`, `PathwayQuizWizard`.
* **Test Gate:** `TEST-CAN-001`, `TEST-CAN-002`, `TEST-CAN-003`.

### Slice 9: District Training Plan Synthesis & Equipment Deficit Auditing
* **Scope:** Automated annual training plan compiler, course intake targets, ITI equipment inventory comparison.
* **Deliverables:** `/district-plans`, `PlanBuilder`, `EquipmentGapList`.
* **Test Gate:** `TEST-DTP-001`, `TEST-DTP-002`, `TEST-DTP-003`.

### Slice 10: Administration, Observability & Security Audit Trails
* **Scope:** Immutable security audit logging, system health status, pipeline queue monitoring, user scope management.
* **Deliverables:** `/admin/audit-logs`, `/admin/system-health`.
* **Test Gate:** `TEST-ADM-001`, `TEST-ADM-002`.

### Slice 11: Predictive Demand Forecasting & Advanced Analytics (Phase 4)
* **Scope:** ARIMA/Prophet time-series models for 12-month forward vacancy forecasting, hidden behind feature flag `features.forecasting`.
* **Deliverables:** Predictive forecast charts, confidence intervals, planned empty states for Phase 1–3.
* **Test Gate:** `TEST-PRED-001`.


---

<a id="07-development-project_breakdown-md"></a>

<!-- ======================================================== -->
<!-- FILE: 07-development/PROJECT_BREAKDOWN.md -->
<!-- ======================================================== -->

# MahaSkills — Project Breakdown & Delivery Milestones

**Platform:** MahaSkills · Government of Maharashtra (DSEEI / MSInS)  
**Problem Statement ID:** 26134  
**Duration:** 20 Months (Four Delivery Phases)  
**Version:** 1.0  
**Status:** Canonical Project Breakdown Baseline  

---

## 1. 20-Month Statewide Delivery Roadmap

```mermaid
gantt
    title MahaSkills 20-Month Delivery Schedule
    dateFormat  YYYY-MM
    section Phase 1 (Foundation)
    M0 Kickoff & Data MoUs          :2025-08, 2025-09
    M1 First Job Scrapes & ITI CSVs :2025-09, 2025-10
    M2 Gap Dashboard Live           :2025-10, 2025-11
    section Phase 2 (Intelligence)
    Gap Scoring Engine & Celery     :2025-12, 2026-02
    M3 First Curriculum Recs        :2026-02, 2026-03
    M4 Employer Portal MVP Launch   :2026-03, 2026-04
    section Phase 3 (Planning)
    M5 Candidate Guidance & SSO     :2026-05, 2026-07
    M6 All 36 District Plans        :2026-07, 2026-09
    section Phase 4 (Prediction)
    M7 ML Demand Forecasting Beta  :2026-10, 2027-01
    M8 Full Statewide Scale         :2027-01, 2027-03
```

---

## 2. Phased Milestone Breakdown

### Phase 1: Foundation & Data Flow (Months 0–4)
* **Milestone M0 (Month 0):** Vendor onboarded, PMO constituted, data MoUs drafted with job aggregators and pilot ITIs.
* **Milestone M1 (Month 2):** Scraper fleet operational; 5 pilot districts and 10 ITIs uploading placement data.
* **Milestone M2 (Month 4):** Read-only Gap Dashboard live for DSEEI leadership; taxonomy database seeded with ~2,200 job roles.
* **Team:** 1 PM, 1 Backend Engineer, 1 Data Engineer, 1 Frontend Engineer.

### Phase 2: Intelligence Engine & Employer Portal (Months 4–9)
* **Milestone M3 (Month 7):** First 10 automated curriculum recommendations reviewed by Automotive and IT SSCs.
* **Milestone M4 (Month 9):** Employer Portal launched; $\ge 50$ enterprise employers onboarded with GSTIN verification.
* **Team:** +1 ML / Data Scientist, +1 Backend Engineer, +1 Frontend Engineer (6 total).

### Phase 3: District Planning & Candidate Guidance (Months 9–14)
* **Milestone M5 (Month 12):** Candidate Course Finder and 5-question Pathway Quiz live; Mahaswayam SSO enrollment operational.
* **Milestone M6 (Month 14):** Automated District Training Plans generated for all 36 districts of Maharashtra.
* **Team:** 4 Full-stack engineers, 1 Data Engineer, 1 PM.

### Phase 4: Prediction & Statewide Scale (Months 14–20)
* **Milestone M7 (Month 18):** ARIMA/Prophet 12-month demand forecasting active; candidate mobile app beta released.
* **Milestone M8 (Month 20):** 100% of government ITIs onboarded; 500+ verified active employers; curriculum revision cycles reduced to $\le 12$ months.
* **Team:** 5 Engineers, 1 ML Engineer, 1 SecOps, 1 PM.


---

<a id="07-development-testing_strategy-md"></a>

<!-- ======================================================== -->
<!-- FILE: 07-development/TESTING_STRATEGY.md -->
<!-- ======================================================== -->

# MahaSkills — Comprehensive Testing Strategy

**Platform:** MahaSkills · Government of Maharashtra (DSEEI / MSInS)  
**Problem Statement ID:** 26134  
**Coverage Target:** $\ge 85\%$ Branch Coverage  
**Version:** 1.0  
**Status:** Canonical Testing Baseline  

---

## 1. Testing Pyramid & Verification Layers

```mermaid
graph TD
    Pyramid[MahaSkills Quality Pyramid]
    Pyramid --> L1[1. Unit & Component Tests: Vitest, React Testing Library, pytest]
    Pyramid --> L2[2. API Contract & Integration Tests: Prism, pytest-asyncio, MSW]
    Pyramid --> L3[3. End-to-End E2E Tests: Playwright]
    Pyramid --> L4[4. Security & RBAC Isolation Tests: pytest-security, OWASP ZAP]
    Pyramid --> L5[5. Accessibility & GIGW Tests: axe-core, Pa11y, WCAG 2.1 AA]
    Pyramid --> L6[6. Performance & Load Tests: Locust, k6]
```

---

## 2. Test Suites Mapped to Core Requirements

| Test Suite ID | Test Category | Target Component | Core Assertions & Test Criteria | Requirement Trace |
|:---|:---|:---|:---|:---|
| `TEST-SEC-001` | Integration / Unit | `AuthService`, `Keycloak` | OIDC Authorization Code + PKCE token exchange; RS256 signature verification. | `REQ-AUTH-01` |
| `TEST-SEC-002` | Unit / RBAC | `RoleGuard`, `RBACMiddleware` | 7 roles correctly restricted from unassigned endpoints and UI routes. | `REQ-AUTH-02` |
| `TEST-SEC-003` | Integration / Scope | `TenantScopeGuard` | Cross-district parameter tampering returns HTTP 403 Forbidden. | `REQ-AUTH-03` |
| `TEST-ING-001` | Integration | Airflow Ingestion Scraper | Web scraping parser handles HTML changes and deduplicates records. | `REQ-LMI-01` |
| `TEST-TAX-001` | Unit | `TaxonomyService` | Canonical hierarchy loads 33 sectors, 36 SSCs, and ~2,200 roles. | `REQ-TAX-01` |
| `TEST-GAP-001` | Unit / Algorithm | `GapScoringEngine` | Mathematical formula matches expected gap scores across edge cases. | `REQ-GAP-01` |
| `TEST-GAP-002` | Integration | Oversupply Flagging Task | Correctly flags courses with placement $< 25\%$ and low demand over 2 quarters. | `REQ-GAP-02` |
| `TEST-PLA-001` | Unit / Validation | CSV Streaming Parser | Validates headers, mandatory fields, salary bounds, and date windows. | `REQ-PLA-01` |
| `TEST-PLA-002` | Integration | Validation Error Logger | Generates line-by-line rejection logs with bilingual error messages. | `REQ-PLA-02` |
| `TEST-SEC-004` | Unit / Privacy | `DataSanitizationService` | HMAC-SHA256 candidate ID hashing with zero plaintext disk persistence (DPDP). | `REQ-SEC-01` |
| `TEST-REC-001` | Integration | Recommendation Engine | Triggers recommendation proposal when gap $> 60$ for $\ge 8$ weeks. | `REQ-REC-01` |
| `TEST-REC-003` | Integration / E2E | Workflow State Machine | Enforces linear lifecycle: Draft $\rightarrow$ SSC Review $\rightarrow$ DSEEI Approval $\rightarrow$ Published. | `REQ-REC-03` |
| `TEST-CAN-002` | Unit / Algorithm | Pathway Quiz Wizard | Adaptive algorithm ranks top 3 courses with personalized rationales. | `REQ-CAN-02` |
| `TEST-NFR-002` | E2E / i18n | `react-i18next` | Marathi, Hindi, and English strings load dynamically with zero missing keys. | `REQ-NFR-02` |
| `TEST-NFR-003` | Automated Audit | `axe-core` / Playwright | 100% of public and administrative pages pass WCAG 2.1 AA audit with 0 violations. | `REQ-NFR-03` |

---

## 3. Specialized Testing Protocols

### 3.1 Role & Cross-District Scope Isolation Testing
```python
@pytest.mark.asyncio
async def test_district_officer_cross_district_isolation(client, pune_officer_token):
    # Pune officer attempts to access Nashik district plan (district_id = 20)
    response = await client.get(
        "/v1/district-plans?district_id=20&fiscal_year=2026-2027",
        headers={"Authorization": f"Bearer {pune_officer_token}"}
    )
    assert response.status_code == 403
    assert response.json()["error"]["code"] == "AUTH_SCOPE_RESTRICTED"
```

### 3.2 Automated Accessibility (WCAG 2.1 AA) Testing with Playwright
```typescript
import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test('landing page meets WCAG 2.1 AA accessibility standards', async ({ page }) => {
  await page.goto('/');
  const accessibilityScanResults = await new AxeBuilder({ page })
    .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
    .analyze();

  expect(accessibilityScanResults.violations).toEqual([]);
});
```

### 3.3 CSV Ingestion Fuzzing & Boundary Testing
* **Salary Boundaries:** Test records with salaries at ₹7,999 (rejected), ₹8,000 (accepted), ₹2,00,000 (accepted), ₹2,00,001 (rejected).
* **Malicious Payloads:** Inject SQL statements (`'; DROP TABLE placement_records;--`) and script tags into student names; verify that parameterized queries and pseudonymization render payloads harmless.


---

<a id="08-deployment-ci_cd-md"></a>

<!-- ======================================================== -->
<!-- FILE: 08-deployment/CI_CD.md -->
<!-- ======================================================== -->

# MahaSkills — Continuous Integration & Deployment (CI/CD)

**Platform:** MahaSkills · Government of Maharashtra (DSEEI / MSInS)  
**CI/CD Engine:** GitHub Actions · AWS CodeDeploy / ArgoCD  
**Version:** 1.0  
**Status:** Canonical CI/CD Pipeline Baseline  

---

## 1. Automated Pipeline Architecture

```mermaid
graph TD
    PR[Pull Request Created] --> Lint[1. Lint & Format: ESLint, Ruff, Prettier]
    Lint --> TypeCheck[2. Static Typecheck: tsc, mypy]
    TypeCheck --> Contract[3. OpenAPI Contract Lint: Spectral]
    Contract --> Tests[4. Automated Tests: Vitest, Pytest, Axe-core]
    Tests --> SecScan[5. Security Scans: Gitleaks, Trivy, Snyk]
    
    SecScan -->|All Checks Pass| Merge[Merge to main branch]
    Merge --> DockerBuild[6. Docker Build & ECR Push]
    DockerBuild --> StagingDeploy[7. Deploy to Staging Cluster]
    StagingDeploy --> E2ETests[8. Playwright E2E Verification]
    E2ETests --> ProdApproval[9. Manual PMO Approval Gate]
    ProdApproval --> ProdDeploy[10. Blue/Green Production Deployment]
```

---

## 2. GitHub Actions Workflow Configuration

```yaml
name: MahaSkills CI/CD Pipeline

on:
  push:
    branches: [main, staging]
  pull_request:
    branches: [main]

jobs:
  validate:
    name: Code Quality, Contracts & Security
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Setup Node.js & Python
        uses: actions/setup-node@v4
        with: { node-version: 20 }
      - uses: actions/setup-python@v5
        with: { python-version: "3.11" }

      - name: Validate OpenAPI Contract
        run: npx @stoplight/spectral-cli lint docs/03-api/openapi.yaml

      - name: Secrets Detection
        uses: gitleaks/gitleaks-action@v2

      - name: Frontend Typecheck & Tests
        run: |
          npm ci
          npm run typecheck
          npm run test:unit
          npm run test:a11y

      - name: Backend Tests & Coverage
        run: |
          pip install -r requirements-dev.txt
          pytest --cov=app --cov-fail-under=85
```

---

## 3. Production Deployment Strategy (Blue/Green)

* **Zero-Downtime Blue/Green Rollout:** ArgoCD manages Kubernetes deployments. A new release is deployed as a green replica set. Once health checks verify 100% pass rates, traffic is cut over at the Application Load Balancer.
* **Automated Rollback:** If 5xx error rates exceed $0.5\%$ or latency p95 spikes above $500\text{ms}$ within 5 minutes of cutover, traffic immediately reverts to the blue replica set.


---

<a id="08-deployment-deployment-md"></a>

<!-- ======================================================== -->
<!-- FILE: 08-deployment/DEPLOYMENT.md -->
<!-- ======================================================== -->

# MahaSkills — Deployment & Cloud Infrastructure Specification

**Platform:** MahaSkills · Government of Maharashtra (DSEEI / MSInS)  
**Problem Statement ID:** 26134  
**Hosting Environment:** AWS Mumbai Region (`ap-south-1`) / MeitY-Empaneled GovCloud  
**Version:** 1.0  
**Status:** Canonical Infrastructure Baseline  

---

## 1. Cloud Infrastructure Topology

```mermaid
graph TD
    Client[End Users: Citizens & Government Officials] --> CloudFront[CloudFront CDN & AWS WAF]
    CloudFront --> S3Frontend[S3 Static Bucket: React SPA]
    CloudFront --> ALB[Application Load Balancer]

    subgraph VPC["MahaSkills Virtual Private Cloud (VPC)"]
        subgraph PublicSubnets["Public Subnets (Multi-AZ)"]
            ALB
            NAT[NAT Gateways]
        end

        subgraph AppSubnets["Private Application Subnets"]
            EKS[Amazon EKS Cluster]
            EKS --> PodAPI[FastAPI Core Pods]
            EKS --> PodWorker[Celery Analytics Pods]
            EKS --> PodAirflow[Airflow DAG Pods]
        end

        subgraph DataSubnets["Isolated Data Subnets"]
            RDS[(Amazon RDS PostgreSQL 16 Multi-AZ)]
            Redis[(Amazon ElastiCache Redis 7)]
            ES[(Amazon OpenSearch Service)]
        end
    end

    ALB --> PodAPI
    PodAPI --> RDS
    PodAPI --> Redis
    PodAPI --> ES
    PodWorker --> RDS
    PodWorker --> Redis
```

---

## 2. Containerization & Orchestration (Docker & Kubernetes)

### 2.1 Multi-Stage Dockerfile (FastAPI Backend)
```dockerfile
FROM python:3.11-slim AS builder
WORKDIR /app
RUN apt-get update && apt-get install -y --no-install-recommends build-essential libpq-dev
COPY requirements.txt .
RUN pip install --no-cache-dir --user -r requirements.txt

FROM python:3.11-slim AS runner
WORKDIR /app
RUN apt-get update && apt-get install -y --no-install-recommends libpq5 curl && rm -rf /var/lib/apt/lists/*
COPY --from=builder /root/.local /root/.local
COPY ./app ./app
ENV PATH=/root/.local/bin:$PATH
EXPOSE 8000
HEALTHCHECK --interval=30s --timeout=5s CMD curl -f http://localhost:8000/v1/admin/health || exit 1
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000", "--workers", "4"]
```

### 2.2 Kubernetes Horizontal Pod Autoscaling (HPA)
* **API Service:** Minimum 3 pods, maximum 15 pods. Scale trigger: CPU utilization $> 70\%$ or HTTP request rate $> 500\text{ req/sec}$.
* **Celery Analytics Workers:** Minimum 2 pods, maximum 8 pods. Scale trigger: Redis queue length $> 100$ tasks.

---

## 3. Database & Storage Provisioning

| Component | Service | Instance Sizing | High Availability Configuration |
|:---|:---|:---|:---|
| **Transactional DB** | Amazon RDS PostgreSQL 16 | `db.r6g.xlarge` (32GB RAM, 4 vCPU) | Multi-AZ synchronous standby; automated daily snapshots with 30-day retention. |
| **Distributed Cache**| Amazon ElastiCache Redis 7| `cache.r6g.large` (13GB RAM) | Multi-AZ cluster with auto-failover; Redis AUTH enabled. |
| **Search Index** | Amazon OpenSearch | 3 $\times$ `m6g.large.search` | Multi-AZ with dedicated cluster manager nodes. |
| **Object Storage** | Amazon S3 Standard | Infinite auto-scaling | Server-side encryption (SSE-KMS); Versioning enabled; Object Lock for audit logs. |


---

<a id="08-deployment-disaster_recovery-md"></a>

<!-- ======================================================== -->
<!-- FILE: 08-deployment/DISASTER_RECOVERY.md -->
<!-- ======================================================== -->

# MahaSkills — Disaster Recovery & Business Continuity Plan

**Platform:** MahaSkills · Government of Maharashtra (DSEEI / MSInS)  
**Problem Statement ID:** 26134  
**Primary Region:** AWS Mumbai (`ap-south-1`)  
**Secondary DR Region:** AWS Hyderabad (`ap-south-2`)  
**Version:** 1.0  
**Status:** Canonical Disaster Recovery Baseline  

---

## 1. RTO & RPO Objectives

| Metric | Target SLA | Strategy to Achieve |
|:---|:---|:---|
| **Recovery Point Objective (RPO)** | **$< 1$ minute** | PostgreSQL continuous Write-Ahead Log (WAL) archiving to S3 and synchronous multi-AZ replica. |
| **Recovery Time Objective (RTO)** | **$< 15$ minutes** | Automated Aurora/RDS failover and Route 53 health-checked DNS switching. |

---

## 2. Backup & Replication Architecture

```mermaid
graph LR
    subgraph PrimaryRegion["Primary: AWS Mumbai (ap-south-1)"]
        RDSPrimary[(RDS Postgres Primary)]
        S3Primary[S3 Standard Buckets]
    end

    subgraph SecondaryRegion["DR: AWS Hyderabad (ap-south-2)"]
        RDSStandby[(RDS Cross-Region Read Replica)]
        S3Replica[S3 Cross-Region Replicated]
    end

    RDSPrimary -->|Async Cross-Region Replication| RDSStandby
    S3Primary -->|S3 Cross-Region Replication CRR| S3Replica
```

---

## 3. Disaster Recovery Failover Runbook

1. **Failure Confirmation:** AWS CloudWatch synthetic alarms confirm complete regional outage in Mumbai for $\ge 3$ consecutive minutes.
2. **Promote DR Database:**
   ```bash
   aws rds promote-read-replica --db-instance-identifier mahaskills-prod-hyderabad
   ```
3. **Route 53 DNS Switchover:** Failover routing policy detects unhealthy status on Mumbai ALB and directs 100% of traffic to Hyderabad ingress gateway.
4. **Scale Up DR EKS Workloads:** ArgoCD syncs manifests to Hyderabad EKS cluster; pods spin up within 4 minutes.
5. **Post-Failover Health Check:** Automated smoke test suite executes synthetic transactions (`/v1/auth/me`, `/v1/gap-scores`) before public traffic release.


---

<a id="08-deployment-environment_configuration-md"></a>

<!-- ======================================================== -->
<!-- FILE: 08-deployment/ENVIRONMENT_CONFIGURATION.md -->
<!-- ======================================================== -->

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


---

<a id="09-operations-incident_response-md"></a>

<!-- ======================================================== -->
<!-- FILE: 09-operations/INCIDENT_RESPONSE.md -->
<!-- ======================================================== -->

# MahaSkills — Incident Response Framework

**Platform:** MahaSkills · Government of Maharashtra (DSEEI / MSInS)  
**Problem Statement ID:** 26134  
**Version:** 1.0  
**Status:** Canonical Incident Response Baseline  

---

## 1. Severity Classification Matrix

| Severity Level | Definition & Criteria | Target Response SLA | Target Resolution SLA | Escalation Target |
|:---|:---|:---|:---|:---|
| **SEV-1 (Critical)** | Statewide platform outage; data breach involving candidate records; Keycloak authentication failure blocking all users. | **15 minutes** | **$< 2$ hours** | PMO Director, CISO, Vendor Tech Lead |
| **SEV-2 (Major)** | Major module failure (e.g., CSV placement upload blocked; Airflow gap calculation crashed); API latency degraded for $> 20\%$ users. | **30 minutes** | **$< 6$ hours** | Lead SRE, Lead Backend Engineer |
| **SEV-3 (Minor)** | Non-blocking UI glitch; localized report export failure; minor styling or translation bug. | **4 hours** | Next scheduled patch | Engineering Squad Lead |

---

## 2. Incident Response Workflow

```mermaid
graph LR
    Detect[1. Detection: Alert or User Report] --> Triage[2. Triage & Sev Assessment]
    Triage --> Command[3. Mobilize Incident Commander]
    Command --> Contain[4. Containment & Mitigation]
    Contain --> Remediate[5. Permanent Fix Deployed]
    Remediate --> PostMortem[6. Blameless Post-Mortem within 48h]
```

### 2.1 Incident Roles & Responsibilities
* **Incident Commander (IC):** Directs triage, owns decision-making, delegates investigation tasks, and authorizes emergency rollbacks.
* **Technical Lead (TL):** Coordinates engineering diagnosis, logs analysis, and writes targeted hotfixes.
* **Communications Lead (CL):** Prepares official stakeholder updates for DSEEI leadership and public status page banners.

---

## 3. Post-Mortem Protocol

Within 48 hours of resolving any SEV-1 or SEV-2 incident, a blameless post-mortem must be published:
1. **Executive Summary:** Incident duration, affected user cohorts, root cause.
2. **Timeline of Events (IST):** Minute-by-minute breakdown from trigger to resolution.
3. **5 Whys Analysis:** Root cause deduction.
4. **Preventive Action Items:** Tracked JIRA issues with designated owners and due dates to prevent recurrence.


---

<a id="09-operations-maintenance-md"></a>

<!-- ======================================================== -->
<!-- FILE: 09-operations/MAINTENANCE.md -->
<!-- ======================================================== -->

# MahaSkills — Maintenance & Operational Housekeeping

**Platform:** MahaSkills · Government of Maharashtra (DSEEI / MSInS)  
**Problem Statement ID:** 26134  
**Maintenance Window:** Sundays 01:00 – 04:00 IST (Lowest traffic window)  
**Version:** 1.0  
**Status:** Canonical Maintenance Baseline  

---

## 1. Routine Maintenance Schedule

```mermaid
timeline
    title MahaSkills Routine Maintenance Cadence
    Weekly : Database VACUUM ANALYZE & Cache Purge
    Monthly : Automated Partition Creation for Postings & Placements
    Quarterly : Keycloak JWKS Signing Key Rotation & Penetration Test
    Annual : Statutory Audit Log Cold Archival & DPDP Salt Rotation
```

---

## 2. Database Housekeeping Procedures

### 2.1 Automated Vacuuming & Statistics Refresh
While PostgreSQL autovacuum runs continuously, a targeted weekly analyze updates planner statistics for heavy analytics tables:
```sql
VACUUM ANALYZE job_postings;
VACUUM ANALYZE placement_records;
VACUUM ANALYZE gap_scores;
```

### 2.2 Dynamic Table Partition Management
To prevent table bloat, partitions are pre-created 30 days in advance via an automated cron function:
```sql
-- Create upcoming annual placement partition
CREATE TABLE IF NOT EXISTS placement_records_2027 PARTITION OF placement_records
    FOR VALUES FROM (2027) TO (2028);
```

### 2.3 Index Reindexing
High-churn indexes on `job_postings` and `placement_records` are reindexed concurrently without table locking:
```sql
REINDEX TABLE CONCURRENTLY job_postings;
```

---

## 3. Storage & Audit Log Archival

* **S3 Raw Archive Transition:** Raw placement CSV files older than 90 days transition automatically to S3 Glacier Flexible Retrieval via S3 Lifecycle Rules.
* **Audit Log Immutability:** Audit log tables are archived annually into AWS S3 Object Lock (WORM - Write Once Read Many) compliant storage to satisfy Maharashtra State IT audit mandates.


---

<a id="09-operations-monitoring-md"></a>

<!-- ======================================================== -->
<!-- FILE: 09-operations/MONITORING.md -->
<!-- ======================================================== -->

# MahaSkills — Monitoring & Observability Specification

**Platform:** MahaSkills · Government of Maharashtra (DSEEI / MSInS)  
**Problem Statement ID:** 26134  
**Observability Stack:** Prometheus · Grafana · OpenTelemetry · Loki / CloudWatch  
**Version:** 1.0  
**Status:** Canonical Monitoring Baseline  

---

## 1. Observability Architecture (Metrics, Logs, Traces)

```mermaid
graph TD
    App[FastAPI Pods & Celery Workers] --> OTel[OpenTelemetry Collector]
    OTel --> Prom[Prometheus: Time-Series Metrics]
    OTel --> Tempo[Grafana Tempo: Distributed Traces]
    App --> Promtail[Promtail / Fluentbit]
    Promtail --> Loki[Grafana Loki: Centralized Logs]

    Prom --> Grafana[Grafana Dashboards & Alertmanager]
    Tempo --> Grafana
    Loki --> Grafana

    Grafana --> PagerDuty[PagerDuty / SMS Alerts]
    Prom --> AdminUI[MahaSkills Admin System-Health Screen]
```

---

## 2. Service Level Objectives (SLOs) & Service Level Indicators (SLIs)

| Objective | Target SLI | Measurement Method | Alert Threshold |
|:---|:---|:---|:---|
| **API Availability** | $\ge 99.5\%$ Uptime | Ratio of HTTP $2xx/3xx/4xx$ vs. total requests over 30 days | Availability $< 99.5\%$ over 5 mins |
| **API Latency (p95)** | $< 300\text{ms}$ | Latency for non-analytical endpoints measured at API Gateway | $\text{p95} > 500\text{ms}$ over 5 mins |
| **Dashboard Load Time**| $< 2.0\text{s}$ | Synthetic browser transaction measuring time to interactive (TTI) | TTI $> 3.0\text{s}$ over 10 mins |
| **Ingestion Pipeline SLA**| Completed by 06:00 IST | Scheduled Airflow run completion timestamp | Uncompleted at 06:15 IST |

---

## 3. Core Operational Alert Rules (Prometheus Alertmanager)

```yaml
groups:
  - name: mahaskills_critical_alerts
    rules:
      - alert: HighHttp5xxRate
        expr: sum(rate(http_requests_total{status=~"5.."}[5m])) / sum(rate(http_requests_total[5m])) > 0.01
        for: 2m
        labels:
          severity: critical
        annotations:
          summary: "API 5xx error rate exceeds 1% in production."

      - alert: DatabaseConnectionSaturation
        expr: pg_stat_database_numbackends / pg_settings_max_connections > 0.85
        for: 3m
        labels:
          severity: critical
        annotations:
          summary: "PostgreSQL active connections exceed 85% of pool capacity."

      - alert: CeleryQueueStalled
        expr: redis_queue_length{queue="placements"} > 50
        for: 10m
        labels:
          severity: warning
        annotations:
          summary: "Placement CSV validation queue stalled with > 50 pending batches."
```

---

## 4. Product-Integrated Admin Observability Screen

In accordance with product specifications, the MahaSkills Administrative UI exposes live system health at `/admin/system-health` querying `/v1/admin/health`:
* **Pipeline Status Grid:** Nightly scraper status, last completion time, scraped record count.
* **Queue Depths:** Celery worker concurrency, active vs pending validation jobs.
* **Database & Cache Health:** PostgreSQL latency ($< 5\text{ms}$ baseline), Redis memory utilization percentage.


---

<a id="09-operations-runbook-md"></a>

<!-- ======================================================== -->
<!-- FILE: 09-operations/RUNBOOK.md -->
<!-- ======================================================== -->

# MahaSkills — Operational Troubleshooting Runbook

**Platform:** MahaSkills · Government of Maharashtra (DSEEI / MSInS)  
**Problem Statement ID:** 26134  
**Audience:** Site Reliability Engineers (SRE), SysOps & On-Call Engineers  
**Version:** 1.0  
**Status:** Canonical Operations Runbook Baseline  

---

## 1. Incident Scenarios & Action Playbooks

```mermaid
graph TD
    Alert[Critical PagerDuty Alert Triggered] --> CheckType{Failure Domain}
    CheckType -->|API 5xx Spikes| PB1[Playbook 1: API Outage]
    CheckType -->|Database Deadlocks| PB2[Playbook 2: RDS Unavailable]
    CheckType -->|Keycloak Auth Fails| PB3[Playbook 3: Keycloak Down]
    CheckType -->|Ingestion DAG Stuck| PB4[Playbook 4: Airflow Stalled]
    CheckType -->|Redis Evictions| PB5[Playbook 5: Redis Outage]
    CheckType -->|CSV Validation Queue| PB6[Playbook 6: CSV Ingestion Queue Stalled]
```

---

### Playbook 1: API Gateway / Backend Unresponsive (502 / 504 / 5xx Spikes)
1. **Check Pod Health & Logs:**
   ```bash
   kubectl get pods -n mahaskills -l app=mahaskills-api
   kubectl logs -n mahaskills -l app=mahaskills-api --tail=100 --prefix
   ```
2. **Diagnose Database Connection Saturation:**
   Check if asyncpg pool exhausted (`asyncpg.exceptions.TooManyConnectionsError`). If saturated, scale connection pool or increase RDS `max_connections`.
3. **Execute Emergency Rolling Restart:**
   ```bash
   kubectl rollout restart deployment/mahaskills-api -n mahaskills
   ```

---

### Playbook 2: Primary Database (PostgreSQL) Unavailable
1. **Verify RDS Failover Status:** Check AWS RDS console for automatic multi-AZ failover events.
2. **Identify Long-Running Queries / Deadlocks:**
   ```sql
   SELECT pid, now() - query_start AS duration, query, state 
   FROM pg_stat_activity 
   WHERE state != 'idle' AND now() - query_start > interval '2 minutes';
   ```
3. **Terminate Blocking Queries:**
   ```sql
   SELECT pg_terminate_backend(pid) FROM pg_stat_activity WHERE pid = <BLOCKING_PID>;
   ```

---

### Playbook 3: Keycloak IAM Outage
1. **Symptoms:** Users unable to log in; API returns widespread `401 Unauthorized` or `500 JWKS Fetch Failed`.
2. **Action Steps:**
   * Verify Keycloak container status: `kubectl get pods -n keycloak`.
   * Verify JWKS endpoint reachability: `curl -I https://auth.mahaskills.maharashtra.gov.in/realms/mahaskills/protocol/openid-connect/certs`.
   * API Gateway incorporates a 60-minute in-memory JWKS cache, preventing immediate outage for existing active JWT tokens.
   * If Keycloak database lock is detected, restart Keycloak pods: `kubectl rollout restart statefulset/keycloak -n keycloak`.

---

### Playbook 4: Airflow Scraping or Gap Recalculation DAG Failure
1. **Symptoms:** Job postings not updated; weekly gap scores not refreshed on Sunday morning.
2. **Inspection:**
   * Open Airflow UI (`https://airflow.mahaskills.maharashtra.gov.in`).
   * Inspect task log for `weekly_gap_score_computation`.
3. **Clear & Rerun Task:**
   ```bash
   airflow tasks clear weekly_gap_score_computation --start-date 2026-09-01 --end-date 2026-09-07 -y
   ```

---

### Playbook 5: Redis Cache / Celery Broker Failure
1. **Symptoms:** Asynchronous placement validation stalls; API responses experience latency degradation.
2. **Action Steps:**
   * Check memory usage: `redis-cli -u $REDIS_URL info memory`.
   * If `used_memory` reaches `maxmemory`, check eviction policy: `CONFIG GET maxmemory-policy` (must be `volatile-lru`).
   * Flush volatile cache keys without clearing Celery task queues:
     ```bash
     redis-cli -u $REDIS_URL --scan --pattern "cache:*" | xargs redis-cli -u $REDIS_URL del
     ```

---

### Playbook 6: CSV Ingestion Queue Stuck
1. **Symptoms:** ITI Principal reports uploaded CSV remains in `PENDING_VALIDATION` for $> 10$ minutes.
2. **Action Steps:**
   * Inspect Celery validation workers: `celery -A app.worker inspect active`.
   * Check if worker was OOM-killed by a massive CSV file.
   * Scale Celery validation deployment:
     ```bash
     kubectl scale deployment/placement-worker --replicas=6 -n mahaskills
     ```


---

<a id="10-decisions-adr-adr-001-react-typescript-frontend-md"></a>

<!-- ======================================================== -->
<!-- FILE: 10-decisions/ADR/ADR-001-react-typescript-frontend.md -->
<!-- ======================================================== -->

# ADR-001: React 18 with TypeScript & Vite for Client Applications

## Status
Accepted

## Context
MahaSkills requires a high-performance, accessible, and trilingual (Marathi, Hindi, English) web client serving both government officials, institutional administrators, employers, and prospective student candidates across diverse network environments (including 3G/4G connections in rural Maharashtra).

## Decision
We adopt **React 18** with **TypeScript** and **Vite** as the standard frontend engineering foundation. The UI is built using **Tailwind CSS** with **Radix UI / shadcn/ui** primitives to ensure WCAG 2.1 AA and GIGW 3.0 compliance.

## Consequences
### Positive
* Fast development iteration and sub-second HMR with Vite.
* Strict compile-time type safety preventing runtime undefined errors.
* Uncompromised accessibility foundations via headless Radix UI primitives.
* Excellent bundle size optimization ($< 250\text{KB}$ initial gzipped JavaScript).

### Negative / Trade-offs
* Requires careful code-splitting for heavy analytical assets (e.g., SVG choropleth maps, Recharts).


---

<a id="10-decisions-adr-adr-002-keycloak-oidc-md"></a>

<!-- ======================================================== -->
<!-- FILE: 10-decisions/ADR/ADR-002-keycloak-oidc.md -->
<!-- ======================================================== -->

# ADR-002: Keycloak OIDC with PKCE for Centralized Identity & Access Management

## Status
Accepted

## Context
MahaSkills serves 7 distinct roles across multiple government departments (DSEEI, DVET), Sector Skill Councils (SSCs), 417+ ITIs, and thousands of industrial employers. Building custom authentication creates substantial compliance, audit, and security risks.

## Decision
We adopt **Keycloak 24** as the centralized Identity and Access Management (IAM) provider, using the **OAuth 2.0 Authorization Code Flow with PKCE** for all authenticated sessions. Keycloak realm roles map to platform permissions, while custom JWT claims inject jurisdictional scopes (`district_id`, `institute_id`, `sector_ids`).

## Consequences
### Positive
* Enterprise-grade identity management with out-of-the-box Multi-Factor Authentication (MFA).
* Interoperable OIDC federation with existing state government portals (Mahaswayam SSO).
* Centralized session revocation and audit logging.

### Negative / Trade-offs
* Introduces a critical infrastructure dependency requiring multi-AZ high-availability deployment.


---

<a id="10-decisions-adr-adr-003-tanstack-query-server-state-md"></a>

<!-- ======================================================== -->
<!-- FILE: 10-decisions/ADR/ADR-003-tanstack-query-server-state.md -->
<!-- ======================================================== -->

# ADR-003: TanStack Query for Server State & Zustand for Client State

## Status
Accepted

## Context
Previous project documentation contained conflicting state management recommendations (`Zustand + Axios` in `PROJECT_BREAKDOWN.md` vs. `TanStack Query + shadcn/ui` in the frontend brief). Storing asynchronous server data in manual client-side stores introduces stale caches, race conditions, and boilerplate.

## Decision
We cleanly separate server and client state:
1. **Server State:** Managed exclusively by **TanStack Query v5** (stale-while-revalidate caching, query key factories, automated background deduplication, and optimistic updates).
2. **Client State:** Managed by lightweight **Zustand** stores strictly for transient UI state (sidebar collapse, active language/locale, course comparison tray).

## Consequences
### Positive
* Eliminates thousands of lines of boilerplate async actions, loading flags, and error reducers.
* Automatic background refetching and cache synchronization across analytical dashboards.
* Clean separation of concerns between remote API state and local interface state.


---

<a id="10-decisions-adr-adr-004-postgresql-relational-store-md"></a>

<!-- ======================================================== -->
<!-- FILE: 10-decisions/ADR/ADR-004-postgresql-relational-store.md -->
<!-- ======================================================== -->

# ADR-004: PostgreSQL 16 as Canonical Relational Store

## Status
Accepted

## Context
MahaSkills requires ACID transactional guarantees for curriculum approval workflows, monthly placement return audits, and capital budget distributions, alongside rich relational modeling for skills hierarchies and spatial district coordinates.

## Decision
We select **PostgreSQL 16** as the central relational transactional store, leveraging:
* Native declarative table partitioning for high-churn tables (`job_postings` partitioned by month, `placement_records` partitioned by batch year).
* JSONB columns for flexible empirical evidence packages and audit snapshots.
* PostGIS geospatial extensions for district centroid distance calculations.

## Consequences
### Positive
* Proven enterprise reliability, ACID compliance, and open-source licensing without vendor lock-in.
* Partitioning ensures high query throughput as placement records scale to millions over 7 years.
* Seamless pairing with Redis for caching and Elasticsearch for fuzzy taxonomy search.


---

<a id="10-decisions-adr-adr-005-candidate-pii-anonymisation-dpdp-md"></a>

<!-- ======================================================== -->
<!-- FILE: 10-decisions/ADR/ADR-005-candidate-pii-anonymisation-dpdp.md -->
<!-- ======================================================== -->

# ADR-005: Candidate PII Anonymization & DPDP Act 2023 Compliance

## Status
Accepted

## Context
Under India's Digital Personal Data Protection (DPDP) Act 2023, platforms collecting student data are legally required to practice strict purpose limitation and data minimization. The PRD specifies tracking placement outcomes while safeguarding candidate privacy.

## Decision
1. **Perimeter Pseudonymization:** ITI placement CSV uploads convert student enrollment IDs / roll numbers into irreversible one-way HMAC-SHA256 hashes immediately at the ingestion perimeter. Raw student identifiers are purged from memory before database writes.
2. **Zero Candidate Directory:** MahaSkills provides **no candidate directory**, **no candidate profiles**, and **no candidate search** in v1.
3. **Aggregate Salary Exposure:** Salaries are calculated and displayed to candidates and officials strictly as aggregated statistical metrics (median salary, IQR range, trends), never as individual records.

## Consequences
### Positive
* Absolute statutory compliance with DPDP 2023; zero risk of student PII exfiltration.
* Allows empirical outcome benchmarking without legal or privacy exposure.


---

<a id="10-decisions-adr-adr-006-openapi-contract-first-md"></a>

<!-- ======================================================== -->
<!-- FILE: 10-decisions/ADR/ADR-006-openapi-contract-first.md -->
<!-- ======================================================== -->

# ADR-006: Contract-First API Development with OpenAPI 3.1

## Status
Accepted

## Context
In complex multi-tier projects where frontend and backend are developed across distributed teams, hand-written markdown API specifications drift rapidly from actual server implementations, causing integration delays, type mismatches, and broken contracts.

## Decision
We enforce a **Contract-First development model** anchored on a canonical **OpenAPI 3.1 YAML** file (`docs/03-api/openapi.yaml`). 
* **Frontend:** Generates TypeScript interfaces using `openapi-typescript` and seeds local development mocks via Mock Service Worker (MSW) or Prism.
* **Backend:** FastAPI routes validate payloads against schemas derived directly from the OpenAPI contract.
* **CI Gates:** Breaking schema modifications fail automated PR gates verified via Spectral linting.

## Consequences
### Positive
* Perfect type synchronization between frontend and backend.
* Frontend slices can be developed and tested against mock servers independently of backend deployment.
* Living, interactive API documentation (Swagger UI / Redoc) generated automatically.


---

<a id="10-decisions-assumptions-md"></a>

<!-- ======================================================== -->
<!-- FILE: 10-decisions/ASSUMPTIONS.md -->
<!-- ======================================================== -->

# MahaSkills — Platform Assumptions Register

**Platform:** MahaSkills · Government of Maharashtra (DSEEI / MSInS)  
**Problem Statement ID:** 26134  
**Version:** 1.0  
**Status:** Canonical Assumptions Baseline  

---

## 1. Operational & Inter-Departmental Assumptions

1. **Data-Sharing MoUs (ASM-01):** The Department of Skills, Employment, Entrepreneurship and Innovation (DSEEI) will successfully execute legal data-sharing agreements with at least two major commercial job aggregators and ensure mandatory placement reporting compliance from all 417+ government ITIs within Phase 1.
2. **SSC Technical Reviewer Appointments (ASM-02):** Sector Skill Councils (specifically ASDC for Automotive and NASSCOM/IT-ITeS SSC) will formally nominate accredited technical reviewers to participate in the curriculum recommendation workflow within 14-day SLA review windows.
3. **Mahaswayam SSO Integration (ASM-03):** National Informatics Centre (NIC) and Maharashtra IT Corporation (MahaIT) will provide standard OIDC/SAML federated identity endpoints and REST APIs for course enrollment handoff without requiring bespoke middleware.
4. **Cloud Infrastructure Sanction (ASM-04):** Directorate of Information Technology (DIT), Maharashtra will grant approval for hosting within MeitY-empaneled cloud providers (AWS Mumbai Region / GovCloud) with dedicated Virtual Private Cloud (VPC) isolation.

---

## 2. Technical & Architectural Assumptions

1. **Fixed Geographic Cardinality (ASM-05):** Maharashtra's 36 administrative districts and 6 revenue divisions remain fixed for data modeling, heatmap rendering, and filtering components.
2. **Taxonomy Baseline (ASM-06):** The initial taxonomy seed consists of 33 economic sectors and ~2,200 NSQF-aligned Qualification Packs (QPs). Emerging skills detected by NLP pipelines will be staged separately until formal SSC ratification.
3. **Database Performance & Scale (ASM-07):** PostgreSQL 16 with native declarative table partitioning (partitioned by batch year for placements and month for job postings) will comfortably sustain projected data volumes ($\approx 10\text{ million}$ placement returns over 7 years and $\approx 5\text{ million}$ annual job postings) without requiring distributed NoSQL data stores in early phases.
4. **Candidate Identity Pseudonymization (ASM-08):** In compliance with DPDP 2023, student roll numbers are hashed via one-way HMAC-SHA256 at the ingestion perimeter. Candidates never maintain long-term unauthenticated profiles on the platform; enrollment transitions directly to Mahaswayam.


---

<a id="10-decisions-open_questions-md"></a>

<!-- ======================================================== -->
<!-- FILE: 10-decisions/OPEN_QUESTIONS.md -->
<!-- ======================================================== -->

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


---

<a id="11-agent-delivery-definition_of_done-md"></a>

<!-- ======================================================== -->
<!-- FILE: 11-agent-delivery/DEFINITION_OF_DONE.md -->
<!-- ======================================================== -->

# Definition of Done

A handoff PR is merged only when **every** applicable box is checked. The Chief Architect reviews
against this list — nothing else.

## Correctness

- [ ] Implements 100% of the handoff §3 scope; 0% of §4 out-of-scope.
- [ ] All acceptance criteria (handoff §8) demonstrably pass.
- [ ] Behaviour matches `docs/` — no silent contradictions; discrepancies raised as `OQ:` or ADR.

## Contract & types

- [ ] `docs/03-api/openapi.yaml` updated in this PR; `npx @stoplight/spectral-cli lint` passes.
- [ ] `frontend/src/types/api.ts` regenerated from the spec; no drift.
- [ ] TypeScript `strict`, no `any`, no unchecked non-null on network data.
- [ ] Python: full type hints, Pydantic v2 models for all request/response I/O.

## Quality gates (output pasted into PR)

- [ ] `ruff check . && black --check .` — clean (backend touched).
- [ ] `pytest -q` — green; new/changed logic has tests mapped to `TEST-xxx`.
- [ ] `npm run lint && npm run typecheck && npm test && npm run build` — green (frontend touched).

## Security & compliance

- [ ] RBAC role + scope guard on every new/changed endpoint (`docs/05-security/RBAC_MATRIX.md`).
- [ ] Candidate PII pseudonymized at ingest; not logged, returned, or persisted raw (DPDP 2023).
- [ ] No secrets in code, fixtures, or logs; new env keys only in `.env.example`.
- [ ] No raw SQL string building; parameterized/ORM only.

## i18n & accessibility

- [ ] No literal user-facing strings; keys added to `mr`, `hi`, and `en` together.
- [ ] New UI meets WCAG 2.1 AA basics: labels, focus order, contrast, keyboard operable.

## Verification artifacts attached

- [ ] Browser screenshot or recording of the feature working in the correct role context.
- [ ] For pipelines/engines: a run log against sample data.

## Hygiene

- [ ] Branch `feat/<REQ-ID>-<title>`; Conventional Commits; each commit cites a `REQ`/`TEST` id.
- [ ] PR title `feat(<domain>): <slice title> (REQ-xxx)`, links the handoff file.
- [ ] `docs/01-product/REQUIREMENTS_TRACEABILITY.md` row updated to `Implemented`.
- [ ] No unrelated file churn, no committed build output, no `.env`.


---

<a id="11-agent-delivery-guardrails-md"></a>

<!-- ======================================================== -->
<!-- FILE: 11-agent-delivery/GUARDRAILS.md -->
<!-- ======================================================== -->

# Agent Guardrails

Limits on autonomous-agent behaviour in this repo. Applies to Antigravity and any other agent.

## Autonomy boundary

| Agent may, without asking | Agent must get architect approval | Agent must never |
| --- | --- | --- |
| Read any file in the repo | Merge a PR | Commit or push to `main` |
| Create a `feat/*` branch | Change `docs/03-api/openapi.yaml` shape beyond the handoff fragment | Force-push, rewrite shared history |
| Run lint / typecheck / tests / build | Add a runtime dependency | Edit `.env`, print/commit secrets |
| Run `docker compose up`, local `uvicorn`/`vite` | Create or edit an ADR in `docs/10-decisions/` | Delete or rewrite `docs/01`–`docs/10` content |
| Generate `frontend/src/types/api.ts` from the spec | Change CI config, Dockerfiles, `docker-compose.yml` | Disable a test, lint rule, or type check to pass a gate |
| Write migrations additively | Any destructive migration (drop/rename column, data backfill) | Run migrations against a non-local database |
| Attach Artifacts, open a PR | Widen an RBAC scope or auth rule | Call external paid/production APIs or real scraper targets at scale |

## Command allowlist (safe to run unattended)

```
ruff, black, pytest, mypy
npm run lint | typecheck | test | build | dev
npx @stoplight/spectral-cli lint docs/03-api/openapi.yaml
docker compose up/down/logs/ps   (local only)
alembic upgrade head             (local DB only)
git checkout -b, git add, git commit, git push origin feat/*
```

Anything not listed → ask first.

## Scope creep

Out-of-scope improvements (refactors, unrelated bug fixes, "while I was here" changes) go in the PR
description under **Observations** as suggested follow-up handoffs. They do not go in the diff.

## Data & privacy

- Use only synthetic/sample fixtures. No real candidate, employer, or placement data in the repo.
- Scraper DAGs run against fixtures or a single throttled request in dev — never bulk-hit Naukri /
  LinkedIn / Indeed / NCS from an agent run.
- Any code touching candidate identifiers must route through the pseudonymization helper; a plain
  identifier reaching storage or a response is a blocking defect.

## Stop conditions

Halt and hand back to the architect if: the handoff contradicts a canonical doc; a gate can only be
passed by weakening it; the change needs a schema-breaking migration; or an `OQ:` blocks progress.


---

<a id="11-agent-delivery-handoff_spec_template-md"></a>

<!-- ======================================================== -->
<!-- FILE: 11-agent-delivery/HANDOFF_SPEC_TEMPLATE.md -->
<!-- ======================================================== -->

# HANDOFF-<slice>-<name>

| Field | Value |
| --- | --- |
| Slice | `<0–11 from IMPLEMENTATION_PLAN.md>` |
| Requirement(s) | `REQ-xxx`, `REQ-yyy` |
| Test gate(s) | `TEST-xxx`, `TEST-yyy` |
| Branch | `feat/<REQ-ID>-<short-title>` |
| Parallel-safe | `yes / no` (no shared files, migrations, or OpenAPI paths with other open handoffs) |
| Status | `Draft / Ready / In progress / In review / Done` |
| Assigned agent | `<Antigravity agent id / name>` |

## 1. Objective

_One paragraph: what capability exists after this is merged, and for which role._

## 2. Context to read first

- `docs/…` (list every doc section the agent must read)
- Prior handoffs this depends on: `HANDOFF-…`

## 3. Scope — in

- Bullet list of concrete, verifiable changes.

## 4. Scope — out (do NOT touch)

- Explicit exclusions. Anything not listed in §3 is out.

## 5. Files to create / modify

| Path | Action | Note |
| --- | --- | --- |
| `backend/app/api/v1/endpoints/<x>.py` | modify | add route `…` |
| `backend/app/services/<x>_service.py` | create | business logic |
| `backend/app/models/<x>.py` | modify | new column `…` |
| `docs/03-api/openapi.yaml` | modify | see §6 |
| `frontend/src/features/<x>/…` | create | components `…` |
| `frontend/src/types/api.ts` | regenerate | from openapi.yaml |
| `frontend/public/locales/{mr,hi,en}/<ns>.json` | modify | new keys |
| `backend/tests/test_<x>.py` | create | covers `TEST-xxx` |

## 6. API delta (OpenAPI fragment)

```yaml
# paste the exact paths/schemas to add or change in docs/03-api/openapi.yaml
```

## 7. Data-model delta

```sql
-- DDL or SQLAlchemy model sketch; migration file name
```

## 8. Acceptance criteria (Gherkin)

```gherkin
Scenario: <…>
  Given <role> …
  When …
  Then …
```

## 9. Verification required (attach as Artifacts)

- [ ] `ruff check . && black --check .` clean
- [ ] `pytest -q` green (new tests for `TEST-xxx`)
- [ ] `npm run lint && npm run typecheck && npm test && npm run build` green
- [ ] `npx @stoplight/spectral-cli lint docs/03-api/openapi.yaml` no errors
- [ ] Browser Artifact: `<role>` flow working against local stack
- [ ] (data/pipeline) DAG / Celery task run log on sample data

## 10. Definition of Done

Per [`DEFINITION_OF_DONE.md`](DEFINITION_OF_DONE.md). PR titled `feat(<domain>): <title> (REQ-xxx)`,
links this file, updates `docs/01-product/REQUIREMENTS_TRACEABILITY.md`.

## 11. Open questions

_Architect fills known ambiguities here. Agent appends `OQ:` items; do not guess past them._


---

<a id="11-agent-delivery-readme-md"></a>

<!-- ======================================================== -->
<!-- FILE: 11-agent-delivery/README.md -->
<!-- ======================================================== -->

# 11 — Agent Delivery

How architecture in `docs/01`–`docs/10` becomes shipped code, using **Google Antigravity** agents as
the implementation layer under a human + Claude Code **Chief Architect**.

## Contents

| File | Purpose |
| --- | --- |
| [`HANDOFF_SPEC_TEMPLATE.md`](HANDOFF_SPEC_TEMPLATE.md) | The template every work assignment copies. |
| [`DEFINITION_OF_DONE.md`](DEFINITION_OF_DONE.md) | The single checklist a PR is merged against. |
| [`GUARDRAILS.md`](GUARDRAILS.md) | Hard limits on agent autonomy (commands, scope, security). |
| `handoffs/` | One spec per unit of work, named `HANDOFF-<slice>-<name>.md`. |

## The model

```
          docs/01-10  (canonical: PRD, architecture, API, security, data, ops)
                │  Chief Architect distills into a self-contained spec
                ▼
   docs/11-agent-delivery/handoffs/HANDOFF-slice-N.md
                │  Antigravity agent: plan → approve → implement → verify
                ▼
        Pull Request  (gates green + verification Artifacts attached)
                │  Chief Architect reviews vs DEFINITION_OF_DONE.md
                ▼
             main  →  slice test gate ticked  →  next slice unblocked
```

## Why Antigravity specifically

- **Agent Manager** runs multiple implementation agents in parallel on `Parallel-safe` handoffs.
- **Artifacts** (plans, task lists, screenshots, browser recordings) are the review surface — they
  map 1:1 to the verification requirements in `DEFINITION_OF_DONE.md`.
- **Editor + terminal + browser** in one agent lets a single run implement a vertical slice and
  prove the UI works end-to-end.
- Config lives in `AGENTS.md` (root) and `.antigravity/` so the same specs also drive Claude Code,
  Cursor, or a human without change.

## Adding a new piece of work

1. Confirm the requirement exists in `docs/01-product/REQUIREMENTS_TRACEABILITY.md` (`REQ-xxx`).
2. Land the API/schema change in `docs/03-api/openapi.yaml` + `docs/02-architecture/DATABASE_SCHEMA.md`.
3. Copy `HANDOFF_SPEC_TEMPLATE.md` → `handoffs/HANDOFF-<slice>-<name>.md`, fill every section.
4. Assign it to an Antigravity agent (paste the file path as the task, or open it in the workspace).


---

<a id="11-agent-delivery-handoffs-handoff-slice-2-taxonomy-md"></a>

<!-- ======================================================== -->
<!-- FILE: 11-agent-delivery/handoffs/HANDOFF-slice-2-taxonomy.md -->
<!-- ======================================================== -->

# HANDOFF-slice-2-taxonomy

| Field | Value |
| --- | --- |
| Slice | 2 — Data Primitives & Taxonomy Hierarchy |
| Requirement(s) | `REQ-TAX-01`, `REQ-TAX-02` (see REQUIREMENTS_TRACEABILITY.md) |
| Test gate(s) | `TEST-TAX-001`, `TEST-TAX-002` |
| Branch | `feat/REQ-TAX-01-taxonomy-tree` |
| Parallel-safe | no (adds migrations + `taxonomy` OpenAPI paths) |
| Status | Ready |
| Assigned agent | _(unassigned — Antigravity)_ |

## 1. Objective

An Admin/Data Steward and any authenticated role can browse the full NSQF skill taxonomy
(Sector → SSC → Job Role → Skills) as an interactive, searchable tree at `/taxonomy`, backed by a
real database query instead of the current hard-coded stub in `endpoints/taxonomy.py`.

## 2. Context to read first

- `docs/02-architecture/DATABASE_SCHEMA.md` — taxonomy tables, partitioning, indexes.
- `docs/03-api/API_SPECIFICATION.md` §taxonomy + `docs/03-api/openapi.yaml`.
- `docs/04-design/UI_UX_SPECIFICATION.md` — tree view + `SkillBadge` spec.
- `docs/05-security/RBAC_MATRIX.md` — `taxonomy:read` (all authenticated), `taxonomy:write` (Admin).
- `docs/07-development/IMPLEMENTATION_PLAN.md` Slice 2.
- Existing: `backend/app/models/taxonomy.py`, `backend/app/api/v1/endpoints/taxonomy.py`,
  `scripts/seed_taxonomy.py`, `frontend/src/features/taxonomy/`.

## 3. Scope — in

- Alembic migration creating `sectors`, `sscs`, `job_roles`, `skills`, `job_role_skills` from the
  existing SQLAlchemy models (align any column gaps with `DATABASE_SCHEMA.md`; add indexes on
  `job_roles.sector_id`, `job_roles.ssc_id`, `skills.sector_id`, and a trigram/`ILIKE` index for
  title search).
- `taxonomy_service.py`: async query assembling the nested tree; `search(q, nsqf_level?, sector?)`.
- Replace the stub `GET /v1/taxonomy/tree` with the DB-backed version; add
  `GET /v1/taxonomy/search`.
- Extend `scripts/seed_taxonomy.py` to seed SSCs, job roles, skills, and role↔skill links for the
  5 seeded sectors (≥ 3 job roles + ≥ 5 skills per sector; include ≥ 1 `is_emerging` skill).
- OpenAPI update (§6) + regenerate `frontend/src/types/api.ts`.
- Frontend: `/taxonomy` route, `TaxonomyTreeView`, `SkillBadge`, search box; TanStack Query hook +
  query keys; i18n namespace `taxonomy` in `mr`/`hi`/`en`.
- Tests: backend service + endpoint tests (`TEST-TAX-001`), frontend tree render/expand/search test
  (`TEST-TAX-002`).

## 4. Scope — out (do NOT touch)

- Elasticsearch indexing (deferred to a later handoff — use PostgreSQL `ILIKE`/trigram for now).
- Taxonomy **editing** UI/endpoints (`taxonomy:write`).
- NLP enrichment / job-posting skill mapping (Slice 3).
- Auth/RBAC internals — only consume the existing guards.

## 5. Files to create / modify

| Path | Action | Note |
| --- | --- | --- |
| `backend/alembic/versions/<ts>_taxonomy_tables.py` | create | migration from models |
| `backend/app/models/taxonomy.py` | modify | reconcile columns/indexes with schema doc |
| `backend/app/services/taxonomy_service.py` | create | tree assembly + search |
| `backend/app/api/v1/endpoints/taxonomy.py` | modify | DB-backed `/tree`, new `/search` |
| `backend/app/schemas/taxonomy.py` | create | Pydantic v2 response models |
| `docs/03-api/openapi.yaml` | modify | see §6 |
| `scripts/seed_taxonomy.py` | modify | add sscs/job_roles/skills/links |
| `backend/tests/test_taxonomy.py` | create | `TEST-TAX-001` |
| `frontend/src/types/api.ts` | regenerate | from openapi.yaml |
| `frontend/src/features/taxonomy/TaxonomyTreeView.tsx` | create | recursive tree |
| `frontend/src/features/taxonomy/SkillBadge.tsx` | create | type + emerging variant |
| `frontend/src/features/taxonomy/useTaxonomyTree.ts` | create | TanStack Query hook |
| `frontend/src/features/taxonomy/index.ts` | modify | barrel exports |
| `frontend/src/app/routes.tsx` | modify | add `/taxonomy` (AuthGuard) |
| `frontend/src/lib/query-keys.ts` | modify | `taxonomy` keys |
| `frontend/public/locales/{mr,hi,en}/taxonomy.json` | create | UI strings |
| `frontend/src/features/taxonomy/TaxonomyTreeView.test.tsx` | create | `TEST-TAX-002` |

## 6. API delta (OpenAPI fragment)

```yaml
paths:
  /v1/taxonomy/tree:
    get:
      operationId: getTaxonomyTree
      tags: [taxonomy]
      security: [{ bearerAuth: [] }]
      responses:
        "200":
          description: Full Sector→SSC→JobRole→Skill tree
          content:
            application/json:
              schema: { $ref: "#/components/schemas/ApiResponse_TaxonomyTree" }
  /v1/taxonomy/search:
    get:
      operationId: searchTaxonomy
      tags: [taxonomy]
      security: [{ bearerAuth: [] }]
      parameters:
        - { name: q, in: query, required: true, schema: { type: string, minLength: 2 } }
        - { name: nsqf_level, in: query, schema: { type: integer, minimum: 1, maximum: 10 } }
        - { name: sector_code, in: query, schema: { type: string } }
      responses:
        "200":
          description: Flat list of matching job roles and skills
          content:
            application/json:
              schema: { $ref: "#/components/schemas/ApiResponse_TaxonomySearch" }
components:
  schemas:
    TaxonomyJobRole:
      type: object
      required: [id, qp_code, title_en, title_mr, nsqf_level, skills]
      properties:
        id: { type: string, format: uuid }
        qp_code: { type: string }
        title_en: { type: string }
        title_mr: { type: string }
        nsqf_level: { type: integer }
        skills:
          type: array
          items: { $ref: "#/components/schemas/TaxonomySkill" }
    TaxonomySkill:
      type: object
      required: [id, name_en, name_mr, skill_type, is_emerging]
      properties:
        id: { type: string, format: uuid }
        name_en: { type: string }
        name_mr: { type: string }
        skill_type: { type: string, enum: [TECHNICAL, CORE, PROFESSIONAL] }
        is_emerging: { type: boolean }
    # TaxonomySector / TaxonomySsc / TaxonomyTree + the two ApiResponse_* wrappers
    # follow the existing ApiResponse<T> envelope in this file.
```

## 7. Data-model delta

Tables already sketched in `backend/app/models/taxonomy.py`. Migration must:

```sql
-- create sectors, sscs, job_roles, skills, job_role_skills (per models + DATABASE_SCHEMA.md)
CREATE INDEX ix_job_roles_sector_id ON job_roles (sector_id);
CREATE INDEX ix_job_roles_ssc_id    ON job_roles (ssc_id);
CREATE INDEX ix_skills_sector_id    ON skills (sector_id);
CREATE EXTENSION IF NOT EXISTS pg_trgm;
CREATE INDEX ix_job_roles_title_en_trgm ON job_roles USING gin (title_en gin_trgm_ops);
CREATE INDEX ix_skills_name_en_trgm     ON skills    USING gin (name_en gin_trgm_ops);
```

## 8. Acceptance criteria (Gherkin)

```gherkin
Scenario: Authenticated user browses the taxonomy tree
  Given a seeded database and a logged-in District Officer
  When they open /taxonomy
  Then they see all seeded sectors collapsed
  And expanding "Automotive & Electric Vehicles" reveals its SSCs, then job roles, then skills
  And an emerging skill renders with the SkillBadge "emerging" variant

Scenario: Search filters the taxonomy
  Given the user is on /taxonomy
  When they type "battery" in the search box
  Then only job roles and skills matching "battery" are listed, each with its NSQF level

Scenario: Endpoint requires auth
  When GET /v1/taxonomy/tree is called without a bearer token
  Then the response status is 401 with error code AUTH_UNAUTHENTICATED
```

## 9. Verification required (attach as Artifacts)

- [ ] `ruff check . && black --check .` clean
- [ ] `pytest -q` green incl. `test_taxonomy.py` (`TEST-TAX-001`)
- [ ] `npm run lint && npm run typecheck && npm test && npm run build` green (`TEST-TAX-002`)
- [ ] `npx @stoplight/spectral-cli lint docs/03-api/openapi.yaml` no errors
- [ ] Browser recording: log in → `/taxonomy` → expand a sector to skills → search "battery"
- [ ] `python scripts/seed_taxonomy.py` run log showing seeded counts

## 10. Definition of Done

Per `../DEFINITION_OF_DONE.md`. PR: `feat(taxonomy): DB-backed NSQF taxonomy tree + search (REQ-TAX-01)`,
links this file, flips the `REQ-TAX-01` / `REQ-TAX-02` rows to `Implemented`.

## 11. Open questions

- `OQ-TAX-A`: Should `skill_type` enum include `PROFESSIONAL` or only `TECHNICAL`/`CORE`? Current
  model default is `TECHNICAL`. **Architect answer:** use `[TECHNICAL, CORE, PROFESSIONAL]`; keep DB
  default `TECHNICAL`.
- `OQ-TAX-B`: Tree payload size with full seed — if > 500 KB, add `?sector_code=` filtering to `/tree`
  and lazy-load per sector. Flag actual measured size in the PR.


---

