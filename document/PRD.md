**PRODUCT REQUIREMENTS DOCUMENT**

**MahaSkills**

Labour-Market Intelligence & Curriculum Alignment Platform

Government of Maharashtra · DSEEI / Maharashtra State Innovation Society

Problem Statement ID: 26134

Version 1.0 · July 2025

# Executive Summary

Maharashtra's skill development ecosystem trains over 5 lakh candidates annually across ITIs, polytechnics, and private training partners — yet placement rates hover around 38%, and employers consistently report a mismatch between course outputs and their actual hiring needs. The MahaSkills platform addresses this by creating a continuous, evidence-based feedback loop between industry demand and curriculum design.

The platform ingests live job-market signals (job postings, employer surveys, placement outcomes, sector growth data), maps them against the existing qualification framework (NSQF / SSC job roles), and automatically surfaces prioritized curriculum update recommendations, district-level training plans, and personalized candidate guidance.

Built on a simple three-tier web architecture with open-source components, MahaSkills will be delivered in four phased releases over 20 months — starting with a data pipeline and gap dashboard, and scaling to predictive analytics and a mobile-first candidate app. Success is measured by lifting district placement rates to 62%+ and cutting curriculum revision cycles from 3–5 years to under 12 months.

# 1. Problem Statement

## 1.1 Core Misalignment

- Curricula built on outdated occupational categories — Electrician trade still teaches fuse-box techniques while employers need PLC/SCADA and EV battery skills.
- No continuous feedback loop between industry and course designers; SSC reviews happen every 3–5 years.

- Placement data is siloed per institute with no aggregation or benchmarking.
- Employers find candidates job-unready; trainees cannot assess which courses lead to real employment.

## 1.2 Affected Districts & Sectors (Priority)

- Pune, Pimpri-Chinchwad — Auto, EV, IT/ITeS, pharma
- Nashik — Auto ancillaries, agri-processing, wine & beverages

- Sambhajinagar (Aurangabad) — Auto, MSME manufacturing, defence
- Nagpur — Logistics, mining, MIHAN aerospace SEZ

- Kolhapur — Foundry, textiles, agri-machinery
- Konkan / Ratnagiri — Agri-tech, fisheries, tourism

# 2. Product Goals & Success Metrics

## Expected Outcomes



| **Goal** | **Current State** | **Target (Year 2)** | **KPI Owner** |
| --- | --- | --- | --- |
| Placement rate (ITI avg) | 38% | 62% | District Officer |
| Employer satisfaction score | No baseline | ≥ 3.8 / 5 | Employer Module |
| Curriculum revision cycle time | 3–5 years | ≤ 12 months | SSC / DSEEI |
| Skill gap closure rate | Not measured | 40% gaps closed/yr | Intelligence Engine |
| Trainer upskilling coverage | ~20% | ≥ 60% per year | District Plans |
| Equipment gap flagging | Manual / ad-hoc | Automated alerts | Dashboard |
| Candidate career clarity score | Not measured | ≥ 4 / 5 (survey) | Candidate Module |



# 3. Users & Roles



| **Role** | **Access Level** | **Key Actions** |
| --- | --- | --- |
| Policy Maker (DSEEI) | State-wide read + approve | View state dashboards, approve curriculum changes, allocate budgets |
| District Officer | District read + plan | Generate district plans, assign training targets, view alerts |
| ITI / Training Principal | Institute read + upload | Upload placement data, view curriculum recs, respond to reviews |
| Employer / HR | Employer portal | Post skill needs, validate draft curricula, rate candidates |
| Candidate | Public (authenticated) | Browse courses, see placement stats, get personalized pathways |
| Admin / Data Steward | Full system | Manage taxonomy, configure pipelines, audit logs |



# 4. System Architecture (Simple Three-Tier)

The platform uses a classic, proven three-tier web architecture kept deliberately simple to ease government procurement, audit, and long-term maintenance.

## 4.1 Architecture Layers

- Presentation Layer — React web app (Marathi / Hindi / English). Role-based dashboards. No native mobile in Phase 1–3; PWA in Phase 3, native app in Phase 4.
- Application Layer — REST API (Node.js / Python FastAPI microservices, one per major domain). API Gateway handles auth, rate-limiting, versioning.

- Data Layer — PostgreSQL (primary store), Elasticsearch (skill taxonomy + job search), Redis (cache), S3-compatible object store (documents, reports).
- ETL / Pipeline — Apache Airflow orchestrates nightly and real-time data ingestion from job portals, surveys, and placement uploads.

## 4.2 Component Stack



| **Layer** | **Component** | **Tech / Tool** | **Notes** |
| --- | --- | --- | --- |
| Frontend | Web App (React) | React + Tailwind CSS | Marathi / Hindi / English i18n |
| Frontend | Mobile App (Phase 4) | React Native | Candidate-facing, offline-first |
| API Gateway | REST + GraphQL | Kong / AWS API GW | Rate limiting, auth, versioning |
| Backend | Core Services | Node.js / Python (FastAPI) | Microservices per domain |
| Backend | Gap Scoring Engine | Python + scikit-learn | ML scoring, NLP taxonomy |
| Database | Relational | PostgreSQL | Jobs, courses, placements |
| Database | Vector / Search | Elasticsearch | Skill taxonomy search |
| Database | Cache | Redis | Sessions, computed scores |
| Data Pipeline | ETL / Ingestion | Apache Airflow | Scheduled + event-driven |
| Data Pipeline | Job Scraping | Scrapy + Playwright | Naukri, LinkedIn, Indeed |
| Infra | Cloud | AWS / GovCloud | Mumbai region preferred |
| Infra | Auth | Keycloak (OIDC) | Role-based: Govt, Employer, ITI, Candidate |



## 4.3 Integrations

- Mahaswayam (enrollment) — REST API for course enrollment handoff and candidate profile sync.
- NCS Portal — Bidirectional job-matching feed via NCS Open API.

- Mahadbt — Scholarship and stipend data for candidate verification.
- NSDC/SSC portals — Qualification and job-role taxonomy updates (monthly sync).

- PM Vishwakarma / PMKVY — Enrollment and outcome data via MoU-based data sharing.

# 5. Phased Implementation Plan



| **Phase** | **Name** | **Key Deliverables** | **Duration** | **Team** |
| --- | --- | --- | --- | --- |
| 1 | Foundation & Data | Data ingestion pipelines, taxonomy DB, gap dashboard (read-only) | 0–4 months | 3–4 engineers |
| 2 | Intelligence Engine | Gap scoring engine, curriculum recommendation module, employer portal | 4–9 months | 4–5 engineers |
| 3 | Planning & Guidance | District training plans, candidate interface, Mahaswayam integration | 9–14 months | 3–4 engineers |
| 4 | Prediction & Scale | Predictive analytics, mobile app, full automation, statewide rollout | 14–20 months | 4–6 engineers |



## Phase 1 — Foundation & Data (Months 0–4)

Goal: Get clean data flowing and a live gap-visibility dashboard in front of decision-makers. No recommendations yet — just truth.

### What we build

- Data ingestion pipelines
- Job scraper: Naukri, LinkedIn, Indeed, NCS — nightly, extracting role, skills, location, salary

- Manual upload portal for ITI placement CSVs (structured template)
- Employer survey module (Google Forms-level simplicity, embedded in portal)

- Sector growth feed: manual upload of govt investment announcements, PLI data
- Skill taxonomy database

- Seed from NSQF/SSC published job roles (~2,200 roles)
- NLP enrichment: map free-text job-posting skills to taxonomy terms

- Gap Dashboard (read-only)
- State and district views: top demanded skills, top offered courses, mismatch heatmap

- User roles: DSEEI admin, district officer — no employer or candidate access yet

### APIs & Data Flows

- Scraper → Airflow → PostgreSQL (raw) → ETL transform → PostgreSQL (clean)
- Upload portal → validation → PostgreSQL

- Dashboard → REST API → PostgreSQL + Redis cache

### Team

- 1 × Backend engineer (pipelines + API)
- 1 × Data engineer (Airflow, ETL, taxonomy)

- 1 × Frontend engineer (dashboard)
- 1 × Product / program manager (stakeholder, data MoUs)

### Phase 1 Exit Criteria

- Data from ≥ 5 districts flowing daily
- ≥ 10 ITIs uploading placement data

- Gap dashboard live for DSEEI and 5 pilot districts

## Phase 2 — Intelligence Engine (Months 4–9)

Goal: Turn the data into actionable recommendations. Add the employer portal so recommendations are grounded in validation.

### What we build

- Gap Scoring Engine
- Computes gap score per skill × district × NSQF level × sector

- Flags oversupplied courses (high seat fill, low placement)
- Weekly refresh cycle

- Curriculum Recommendation Module
- Generates ranked recommendations: add module, retire course, develop new course

- Each recommendation shows evidence: job count, gap score, affected districts
- Validation workflow: SSC reviewer → DSEEI approver → published

- Employer Portal (MVP)
- Employer self-registration (Aadhaar-linked GSTIN verification)

- Skill needs form + draft curriculum review interface
- Micro-survey triggers: auto-sent when gap score for employer's sector spikes

- Trainer Capacity Module (basic)
- Upload trainer qualifications per institute

- Flag trainer gaps vs. recommended new modules

### New Roles Added

- 1 × ML / data scientist (gap scoring, NLP)
- 1 × Backend engineer (recommendation engine, workflow)

- 1 × Frontend engineer (employer portal, validation UI)

### Phase 2 Exit Criteria

- Gap scores live for all 36 districts
- ≥ 20 curriculum recommendations generated and reviewed by SSCs

- ≥ 50 employers registered on portal

## Phase 3 — Planning & Candidate Guidance (Months 9–14)

Goal: Close the loop with district-level planning and give candidates the information they need to make better enrollment decisions.

### What we build

- District Training Plan Generator
- Auto-generates annual and 3-year plans per district

- Specifies: recommended courses, target intake, priority sectors, projected placements
- Equipment gap flagging: compares course syllabus equipment list vs. ITI asset register

- Budget allocation scoring for DSEEI fund distribution
- Candidate Interface

- Searchable course finder with real placement stats (median salary, time-to-placement)
- Personalized pathway quiz: education level + location + interest → top 3 course recommendations

- High-demand / high-growth badges on course cards
- Mahaswayam enrollment handoff (SSO)

- Alert & Notification System
- Email / SMS alerts to district officers when placement rate drops below threshold

- In-app alerts to ITI principals when a new curriculum recommendation is published

### Phase 3 Exit Criteria

- District plans generated for all 36 districts
- Candidate interface live on Mahaswayam (or standalone portal)

- ≥ 500 candidates using pathway tool in first month

## Phase 4 — Prediction & Scale (Months 14–20)

Goal: Move from reactive gap-reporting to predictive workforce planning. Add mobile access and automate the annual review cycle.

### What we build

- Predictive Demand Forecasting
- 12-month ahead skill demand forecast using ARIMA / Prophet on job-posting time series

- Investment announcement signals (PLI, new plants) fed into forecast model
- Automated Annual Curriculum Review

- Platform auto-generates a pre-filled annual review report for each course
- SSC reviewer receives report with evidence and recommendation — approves/rejects in-app

- Mobile App (React Native)
- Candidate-facing: course search, pathway quiz, enrollment, job alerts

- Offline mode for low-connectivity rural districts
- Statewide Rollout & Scale

- All 36 districts, all ITIs and polytechnics onboarded
- Employer network: target 500+ active employers

# 6. Feature Specifications by Module

## 6.1 Data Ingestion

**Job Postings:**Naukri API (licensed), LinkedIn scraping (ToS-compliant), Indeed RSS, NCS Open API. Fields: title, skills, exp, location, salary, date. Nightly.

**Placement Data:**Structured CSV upload (ITIs) — fields: candidate ID (anonymised), course, batch, placed Y/N, employer, role, salary, months-to-placement. Monthly.

**Employer Surveys:**In-portal survey builder. Short (5–8 questions). Triggered by gap-score spike. Results auto-tagged to sector/district.

**Sector Growth:**Manual upload by DSEEI data steward: investment MoUs, PLI disbursements, MSME registration counts. Quarterly.

**Tech Trends:**WEF Future of Jobs API / manual report ingestion. Annual refresh.

## 6.2 Skill Taxonomy

**Seed Source:**NSDC published SSC job roles (CSV). ~2,200 roles across 38 sectors.

**Enrichment:**NLP entity extraction on job postings → map to taxonomy nodes. Human review for new terms.

**Extension:**"Emerging roles" bucket for skills not yet in any SSC framework (e.g., EV battery management, AI quality inspector).

**Update Cycle:**Automated weekly for job-posting signals; manual quarterly for framework changes.

## 6.3 Gap Scoring Engine

**Gap Score Formula:**Gap Score = (Demand Count × Trend Weight) − (Trained Seats × Placement Rate). Normalised 0–100 per district.

**Oversupply Flag:**Course flagged if placement rate < 25% AND demand score < 20th percentile for 2+ consecutive quarters.

**Output:**Ranked list of skills by gap score: district × sector × NSQF level. Refreshed weekly.

## 6.4 Curriculum Recommendation Engine

**Trigger:**Skill gap score > 60 sustained for 8+ weeks with no existing course covering it.

**Recommendation Types:**Add elective module | Update existing unit of competency | Develop new qualification | Retire / consolidate course.

**Evidence Package:**Each recommendation auto-generates: job count trend chart, top hiring employers, comparable courses in other states, estimated placement uplift.

**Validation Workflow:**Draft → SSC Technical Review (14 days) → DSEEI Approval (7 days) → Published to ITIs.

## 6.5 District Training Plans

**Plan Contents:**Recommended courses (with seat targets), trainer requirements, equipment needs, budget priority score.

**Generation:**Auto-generated from gap scores + historical placement data + district industrial composition.

**Cycle:**Annual plan (April) + rolling 3-year view. District officer can adjust and publish.

**Equipment Gap:**Each course has an "industry-standard equipment list" (maintained by SSC). Compared against ITI asset register upload. Gaps flagged with cost estimate.

## 6.6 Candidate Interface

**Course Cards:**Show: duration, NSQF level, fees, median salary post-placement, time-to-placement (p50), top 5 hiring employers, demand trend badge.

**Pathway Quiz:**5-question flow: district, education level, sector interest, language preference, mobility. Output: top 3 personalized course recommendations.

**Integrations:**Mahaswayam SSO for enrollment. NCS Portal for job alerts post-completion.

**Languages:**Marathi (primary), Hindi, English.

# 7. Dashboard Design by Role

- Policy Maker (DSEEI) — State heatmap of skill gaps, top 10 courses to add/retire, employer satisfaction trend, budget allocation model.
- District Officer — District-level gap scores, training plan status, ITI performance leaderboard, alert inbox.

- ITI Principal — Course-level placement stats vs. district average, pending curriculum updates, trainer gap list, equipment gaps.
- Employer — Posted skill needs status, draft curricula for review, employer satisfaction survey history, institute ratings.

- Candidate — Course search, personalized recommendations, saved courses, enrollment status.

# 8. Governance Model

## Platform Owner

Maharashtra State Innovation Society (MSINS) under DSEEI. A dedicated Platform PMO of 3–4 people manages vendor, data MoUs, and stakeholder coordination.

## Decision Authority

- Curriculum recommendations — SSC Technical Committee review → DSEEI Joint Secretary approval
- District training plans — District Skill Development Employment & Entrepreneurship Guidance Centre (DSEEGC) head

- Taxonomy updates — MSINS Data Steward + NCVET concurrence for formal qualification changes
- Employer credentials / ratings — Auto-computed; disputes resolved by MSINS PMO

## Key Bodies Integrated

- 38 Sector Skill Councils (SSCs) — taxonomy owners and curriculum validators
- NCVET — qualification framework alignment

- MCCIA, CII Maharashtra, MSSIA — employer network and survey distribution
- National Skill Development Corporation — data sharing and funding alignment

# 9. Risk Register



| **Risk** | **Likelihood** | **Impact** | **Mitigation** |
| --- | --- | --- | --- |
| Poor data quality from ITIs | **High** | **High** | Mandatory structured upload templates; data steward role per district |
| Low employer participation | **Medium** | **High** | Incentive badges; MoU with CII, MCCIA, MSSIA; micro-surveys (<2 min) |
| Resistance to curriculum change | **High** | **Medium** | SSC co-ownership; pilot in 3 districts before statewide rollout |
| Scraping bans / API changes | **Medium** | **Medium** | Dual-source strategy; licensed data feed from aggregators |
| Budget & sustanability | **Medium** | **High** | Embed in existing DSEEI IT budget; open-source stack to reduce licensing |
| Privacy / data sharing | **Low** | **High** | Candidate PII anonymized; comply with PDPB 2023; data sharing MoUs |



# 10. Non-Functional Requirements

**Availability:**99.5% uptime (excluding planned maintenance windows)

**Response Time:**Dashboard pages < 2s; recommendation engine results < 5s

**Languages:**Marathi, Hindi, English — all UI strings externalised (i18n)

**Accessibility:**WCAG 2.1 AA; screen-reader compatible

**Data Retention:**Job posting raw data: 2 years. Placement data: 7 years. PII: anonymised after 3 years.

**Security:**OWASP Top 10 hardening; Keycloak RBAC; audit log for all data writes; SSL/TLS everywhere

**Scalability:**Stateless API services; auto-scaling on AWS; Elasticsearch cluster can grow horizontally

**Open Source:**All core components open-source (React, FastAPI, PostgreSQL, Airflow, Elasticsearch, Keycloak)

# 11. Assumptions & Dependencies

- DSEEI will execute data-sharing MoUs with ITIs, polytechnics, and at least 3 major job portals within Phase 1.
- At least 2 SSCs (auto and IT sectors) will assign a technical reviewer by end of Phase 1.

- Mahaswayam API documentation is accessible; SSO integration approved by NIC.
- Cloud hosting approved by Maharashtra IT Department (GovCloud or AWS Mumbai region).

- Budget allocated for Phase 1 before project kickoff; subsequent phases funded based on Phase 1 outcomes.

# 12. Key Milestones

**M0 — Project****Kickoff****:**Month 0: vendor onboarded, PMO formed, data MoUs drafted

**M1 — First Data Flow:**Month 2: job scraper running, 5 ITIs uploading placement data

**M2 — Gap Dashboard Live:**Month 4: Phase 1 complete, dashboard shown to DSEEI leadership

**M3 — First Recommendations:**Month 7: 10 curriculum recommendations in SSC review

**M4 — Employer Portal Launch:**Month 9: 50 employers registered, Phase 2 complete

**M5 — Candidate Interface:**Month 12: Candidate tool live on Mahaswayam

**M6 — District Plans:**Month 14: All 36 district plans auto-generated, Phase 3 complete

**M7 — Predictive Analytics:**Month 18: Demand forecasting live, mobile app beta

**M8 — Full Statewide:**Month 20: All districts, all ITIs, 500+ employers, Phase 4 complete

MahaSkills PRD v1.0 · DSEEI / MSINS · Confidential
