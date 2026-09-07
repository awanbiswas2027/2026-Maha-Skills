# MahaSkills — Comprehensive Master Architecture Guide
## Autonomous Labour-Market Intelligence & Dynamic Vocational Curriculum Alignment Platform

**Smart India Hackathon 2026 · Problem Statement #26134**  
**Nodal Agency:** Government of Maharashtra · Department of Skills, Employment, Entrepreneurship and Innovation (DSEEI) / Maharashtra State Innovation Society (MSInS)  
**Territorial Scope:** 36 Districts · 417+ Government & Private ITIs · 33 Economic Sectors · 36 Sector Skill Councils (SSCs) · 2,200 NSQF Job Roles · 15,000+ Skills  
**Production Stack:** Python 3.11 FastAPI (async), React 18 + TS (strict), PostgreSQL 16 (pgvector, PostGIS), Elasticsearch 8, Apache Airflow 2.8, Keycloak 24 OIDC  
**Target KPIs:** +24% Placement Velocity Uplift · Syllabus Revision Cycle cut from 180 days to 21 days · $\ge 60\%$ Annual Faculty Retraining · 100% ITI Equipment Gap Auditing · 100% DPDP Act 2023 Candidate Pseudonymization

---

## Table of Contents
1. [Chapter 1: The Maharashtra Vocational Crisis & Problem Statement #26134](#chapter-1-the-maharashtra-vocational-crisis--problem-statement-26134)
2. [Chapter 2: The Core Innovation — Closed-Loop Alignment Architecture](#chapter-2-the-core-innovation--closed-loop-alignment-architecture)
3. [Chapter 3: System Architecture & The 3-Tier Decoupled Platform](#chapter-3-system-architecture--the-3-tier-decoupled-platform)
4. [Chapter 4: The Mathematical Core — Gap Scoring & Obsolescence Engine](#chapter-4-the-mathematical-core--gap-scoring--obsolescence-engine)
5. [Chapter 5: Semantic Taxonomy Normalization & NLP Processing](#chapter-5-semantic-taxonomy-normalization--nlp-processing)
6. [Chapter 6: Data Privacy & Legal Compliance (DPDP Act 2023)](#chapter-6-data-privacy--legal-compliance-dpdp-act-2023)
7. [Chapter 7: Data Engineering, Ingestion & 10M-Record Table Partitioning](#chapter-7-data-engineering-ingestion--10m-record-table-partitioning)
8. [Chapter 8: Deterministic RAG AI Assistant & Marathi-First Interface](#chapter-8-deterministic-rag-ai-assistant--marathi-first-interface)
9. [Chapter 9: Multi-Tenant Security, RBAC/ABAC & STRIDE Cyber Defense](#chapter-9-multi-tenant-security-rbacabac--stride-cyber-defense)
10. [Chapter 10: Curriculum Governance State Machine & Faculty Protection](#chapter-10-curriculum-governance-state-machine--faculty-protection)
11. [Chapter 11: Database Architecture & Core Entity-Relationship Model](#chapter-11-database-architecture--core-entity-relationship-model)
12. [Chapter 12: Quality Engineering, Testing Strategy & Verification Pyramid](#chapter-12-quality-engineering-testing-strategy--verification-pyramid)
13. [Chapter 13: Production Deployment, Air-Gapped Cloud & Disaster Recovery](#chapter-13-production-deployment-air-gapped-cloud--disaster-recovery)
14. [Chapter 14: Architectural Decision Records (ADRs) & Executive Summary](#chapter-14-architectural-decision-records-adrs--executive-summary)

---

## Chapter 1: The Maharashtra Vocational Crisis & Problem Statement #26134

### 💡 Plain English Concept — What is this project and why is it desperately needed?
Imagine going to a government vocational school for two years to learn how to fix petrol engines, only to graduate and discover that every automotive factory in your district (like Tata Motors or Bajaj in Pune) has switched entirely to electric vehicles and robotic assembly lines! This is the exact crisis facing youth in Maharashtra today.

The state operates over **417 Industrial Training Institutes (ITIs)** training 1.5 lakh students every year. But their syllabi are revised manually only once every 5 years by government committees. Meanwhile, modern industry introduces new software, tools, and machines every few months. Because of this massive "curriculum drift," more than half of all vocational graduates cannot find jobs, while employers complain they cannot find skilled workers.

**MahaSkills** is an autonomous digital platform that acts as a real-time bridge. It automatically reads live job listings across the state, calculates exactly which skills are needed in each district, and generates the exact administrative paperwork for government officials to update courses in **21 days instead of 5 years**.

### ⚙️ Terminology & Key Governance Entities
- **ITI (Industrial Training Institute):** State-run post-secondary vocational training institutes delivering certificate trades (Fitter, Electrician, Welder, Machinist, COPA).
- **DSEEI & DVET:** Department of Skills, Employment, Entrepreneurship and Innovation; and Directorate of Vocational Education and Training (Government of Maharashtra).
- **MSInS:** Maharashtra State Innovation Society, driving technological entrepreneurship and hackathon deployment.
- **NSQF (National Skills Qualification Framework):** A competency-based framework organizing qualifications from levels 1 to 10 based on knowledge, skills, and aptitude.
- **SSC (Sector Skill Council):** Industry-led autonomous bodies (e.g., ASDC for Automotive, NASSCOM for IT) that set occupational standards.
- **LMI (Labour Market Intelligence):** Real-time quantitative aggregation of job vacancies, hiring velocities, wage premiums, and skill demand signals.

---

## Chapter 2: The Core Innovation — Closed-Loop Alignment Architecture

### 💡 Plain English Concept — What does "Closing the Loop" mean?
Traditional government portals like National Career Service (NCS) or job boards operate as an "open loop": they show job listings, candidates apply, but the vocational schools never learn anything from those job ads! The schools keep teaching the same outdated 2018 syllabus forever.

MahaSkills **"closes the loop"**: when hiring for "Battery Management Systems" or "Solar PV Inverters" spikes in Pune or Nagpur, our system automatically traces backward into the relevant ITI trade, flags that the current syllabus lacks these modules, drafts the revised lesson plans, routes them to officials for digital sign-off, updates the classroom curriculum, and tracks whether the next batch of students gets hired at higher salaries!

*(See Diagram 1: End-to-End Closed-Loop Alignment Architecture in the PDF)*

### ⚙️ Step-by-Step Technical Execution of the 6 Stages
1. **Step 1 (Ingest):** Nightly Apache Airflow scrapers ingest public postings from NCS, Naukri, and LinkedIn across 36 district geo-bounds, alongside monthly ITI placement CSV uploads.
2. **Step 2 (Map):** Natural Language Processing tokenizes unstructured job text and maps messy titles ("CNC Specialist") to canonical NSQF job roles and NOS units.
3. **Step 3 (Score):** Proprietary mathematical Gap Engine calculates a 0.00–1.00 score combining vacancy velocity, wage premiums, curriculum semantic drift, and historical placement rates.
4. **Step 4 (Dossier):** Automatically synthesizes an NCVET-compliant Curriculum Modification Dossier complete with 12-month vacancy trends, hiring employer rosters, and syllabus diffs.
5. **Step 5 (Ratify):** Routes through an administrative state machine: Sector Skill Council (SSC) technical validation $\rightarrow$ DSEEI Joint Secretary digital approval.
6. **Step 6 (Act & Evaluate):** Sanctions updated ITI seat quotas, allocates workshop capex budgets, schedules faculty retraining, and measures outcome uplift via subsequent placement returns.

---

## Chapter 3: System Architecture & The 3-Tier Decoupled Platform

### 💡 Plain English Concept — How is the platform engineered under the hood?
MahaSkills is designed like a modern, enterprise banking application. Instead of one giant, fragile program where a single bug crashes everything, the platform is divided into three completely decoupled tiers: a lightweight frontend for rural mobile phones, a high-throughput async backend API, and a unified relational and vector database.

*(See Diagram 2: C4 Level 1 System Context Architecture in the PDF)*

### ⚙️ The 3-Tier Production Stack Breakdown
- **Presentation Tier (React 18 + Vite + TypeScript Strict):** Tailwind CSS + shadcn/ui. State managed via TanStack Query v5 (server cache) and Zustand (client state). Trilingual i18n localization (Marathi, Hindi, English).
- **Application & API Tier (Python 3.11 + FastAPI + Celery):** Async IO on Starlette/Uvicorn. OpenAPI v3 contracts. Celery 5.3 worker pools process heavy background tasks via Redis 7.
- **Intelligence & Data Tier (PostgreSQL 16 + pgvector + PostGIS + Elasticsearch 8):** ACID safety, 384d syllabus embeddings, district spatial boundary polygons, BM25 Marathi synonym search, and MinIO/S3 object storage.
- **Pipeline Tier (Apache Airflow 2.8):** Isolated scheduled batch ETL workflows.

---

## Chapter 4: The Mathematical Core — Gap Scoring & Obsolescence Engine

### 💡 Plain English Concept — How do we mathematically detect an obsolete course without human bias?
If a human committee decides which vocational courses to shut down or fund, personal politics and lobbying can influence decisions. MahaSkills removes subjective guesswork by using an empirical formula combining 12-month vacancy growth, wage premiums, curriculum semantic distance, and verified placement returns.

### ⚙️ Standardized Composite Gap Score Formula

$$\text{GapScore}(c, d) = 0.35 \cdot \mathcal{N}(V_{12\text{mo}}) + 0.20 \cdot \mathcal{N}(\Delta W) + 0.25 \cdot \mathcal{D}_{\text{cosine}}(S_{\text{market}}, S_{\text{curriculum}}) - 0.20 \cdot \mathcal{N}(P_{\text{rate}})$$

- **$V_{12\text{mo}}$ (Weight 0.35):** 12-month job vacancy volume normalized via min-max scaling across state percentiles.
- **$\Delta W$ (Weight 0.20):** Wage premium over Maharashtra statutory minimum wage ($\approx$ ₹12,500/mo).
- **$\mathcal{D}_{\text{cosine}}$ (Weight 0.25):** Semantic cosine distance between emerging market skills and active course syllabus vectors.
- **$P_{\text{rate}}$ (Weight 0.20):** Historical 4-quarter verified placement success rate (subtracted to prevent false alarms).
- **8-Week Persistence Window:** A Gap Score $> 0.60$ must be maintained for $\ge 8$ consecutive weeks before an automated Curriculum Modification Dossier triggers.

---

## Chapter 5: Semantic Taxonomy Normalization & NLP Processing

### 💡 Plain English Concept — How do we make sense of messy, chaotic job postings?
Every company invents their own creative titles in job ads ("Welding Rock Star", "TIG/MIG Fabricator"). MahaSkills strips buzzwords, extracts technical competencies, and maps them to official government NSQF qualification packs.

*(See Diagram 4: 3-Stage Semantic Taxonomy Normalization Flow in the PDF)*

### ⚙️ 3-Stage Pipeline Mechanics
1. **Stage 1 (Exact Regex Matching):** Fast-path scan for 2,200 canonical NSQF codes (resolves ~40% of standard listings in < 1ms).
2. **Stage 2 (spaCy Statistical NER):** Extracts technical skills, machinery names, and certifications while removing noise words.
3. **Stage 3 (Dense Vectors & BM25 Synonyms):** Dense 384d vector similarity (`all-MiniLM-L6-v2`) matched against Elasticsearch BM25 synonym dictionaries (15,000+ terms).
4. **Quarantine Triage Queue:** Tokens scoring cosine $< 0.72$ route to an administrative queue for single-click human-in-the-loop mapping without model retraining.

---

## Chapter 6: Data Privacy & Legal Compliance (DPDP Act 2023)

### 💡 Plain English Concept — How do we protect student privacy and employer secrets?
Under the Digital Personal Data Protection Act 2023, leaking citizen data incurs fines up to ₹250 Crore. MahaSkills implements a **zero-disk privacy enclave**: student roll numbers are converted to irreversible cryptographic hashes in memory before touching disk.

*(See Diagram 5: DPDP Act 2023 Cryptographic Pseudonymization Pipeline in the PDF)*

### ⚙️ Streaming HMAC-SHA256 Cryptographic Architecture
- **In-Memory Streaming:** Roll numbers and Aadhaar details are hashed in RAM via `HMAC-SHA256(student_id, DPDP_TENANT_SALT)`. Unencrypted PII touches zero disk blocks.
- **CloudHSM Enclave:** The tenant salt is secured in an isolated Hardware Security Module.
- **Zero Employer Leakage:** Enterprise salary bids and hiring volumes are aggregated into district/sector medians, preventing competitors from inspecting private business strategies.

---

## Chapter 7: Data Engineering, Ingestion & 10M-Record Table Partitioning

### 💡 Plain English Concept — How does the system handle millions of records over years?
Over 7 years across 36 districts and 417+ ITIs, MahaSkills processes over 10 million placement records and vacancies. Declarative table partitioning organizes records into annual partitions, allowing queries to scan only relevant years in milliseconds.

*(See Diagram 6: Automated Ingestion & Pipeline Orchestration in the PDF)*

### ⚙️ Ingestion & Partitioning Architecture
- **Airflow 2.8 DAGs:** `lmi_nightly_job_scraping` (02:00 IST), `placement_validation_worker` (Streaming Celery), `taxonomy_nlp_enrichment` (04:00 IST).
- **Atomic CSV Streaming:** Line-by-line validation against candidate HMAC, course code, and wage ranges. Corrupt batches are marked `REJECTED` with zero partial database pollution.
- **PostgreSQL Declarative Partitioning:** `placement_records` partitioned by `RANGE (batch_year)`. Queries targeting active cohorts execute partition pruning.
- **Parquet Cold Archive:** Vacancies older than 24 months convert to columnar Parquet files in cold S3 storage.

---

## Chapter 8: Deterministic RAG AI Assistant & Marathi-First Interface

### 💡 Plain English Concept — Why a Marathi chatbot, and why can't it make things up?
Rural ITI principals in Gadchiroli or Beed need instant guidance in Marathi without learning complex dashboards. MahaSkills uses a Retrieval-Augmented Generation (RAG) assistant that is legally bound to answer solely from verified database records with zero hallucination.

*(See Diagram 7: Deterministic Grounded RAG Pipeline Architecture in the PDF)*

### ⚙️ 4-Stage Deterministic Pipeline
1. **Filter Extraction:** Extracts discrete SQL filters (`district="Nagpur"`, `sector="EV"`).
2. **Hybrid Retrieval:** Dense vector search via `pgvector` + sparse relational SQL filters fetching verified records.
3. **Context Injection:** Formats retrieved records into a strict system prompt for local Llama-3-8B.
4. **Citation Regex Check:** Rejects responses lacking verifiable citation IDs from step 2; falls back gracefully if data is insufficient.

---

## Chapter 9: Multi-Tenant Security, RBAC/ABAC & STRIDE Cyber Defense

### 💡 Plain English Concept — Who is allowed to see and change what?
A District Officer in Nagpur must not alter budgets in Pune, and an ITI principal cannot edit placement figures. MahaSkills enforces 7 platform roles and ABAC jurisdictional locks.

*(See Diagram 8: STRIDE Threat Assessment & Security Defense Perimeter in the PDF)*

### ⚙️ Security Matrix & STRIDE Defense
- **7 Roles:** State Policy Maker, District Skill Officer, ITI Principal, ITI Instructor, SSC Reviewer, Employer, Candidate.
- **ABAC Isolation:** Keycloak JWT claims (`district_id: 2718`) enforce mandatory row-level security (`WHERE district_id = current_user.district_id`).
- **STRIDE Perimeter:** RS256 JWKS gates (Spoofing), CSV checksums (Tampering), immutable append-only audit logs (Repudiation), HMAC-SHA256 crypto (Information Disclosure), 100MB stream caps (DoS), and `TenantScopeGuard` (Elevation of Privilege).

---

## Chapter 10: Curriculum Governance State Machine & Faculty Protection

### 💡 Plain English Concept — How does an AI recommendation become official policy?
Algorithms cannot unilaterally change state textbooks. MahaSkills enforces a statutory 5-stage approval state machine, protects government teachers through mandatory annual upskilling ($\ge 60\%$), and audits workshop equipment before courses launch.

*(See Diagram 9: Curriculum Recommendation Governance State Machine in the PDF)*

### ⚙️ Governance State Machine & Operational Safeguards
- **5 States:** `DRAFT` $\rightarrow$ `UNDER_SSC_REVIEW` $\rightarrow$ `SSC_APPROVED` $\rightarrow$ `DSEEI_APPROVAL` $\rightarrow$ `PUBLISHED`.
- **Two Materiality Tiers:** Tier 1 Minor ($\le 20\%$ syllabus delta) ratified by SSC Reviewer; Tier 2 Major (trade phase-outs/new qualifications) requires DSEEI Joint Secretary sign-off.
- **Faculty Retraining ($\ge 60\%$ Annual Mandate):** Automatically books seats in Advanced Training Institutes (ATIs) to transition teachers from obsolete trades (ICE mechanics) to emerging ones (EV powertrains).
- **Automated Equipment Gap Auditor:** Identifies missing workshop equipment from NCVET standards and auto-populates capex line items in the District Plan.

---

## Chapter 11: Database Architecture & Core Entity-Relationship Model

### 💡 Plain English Concept — How is all information structured?
The database stores 36 district boundary polygons, 417+ ITIs, 2,200 NSQF qualifications, 10M+ student records, econometric gap scores, and immutable audit logs.

*(See Diagram 10: Core Relational & Vector Entity-Relationship Model in the PDF)*

### ⚙️ Relational & Vector Tables
- `districts`: 36 districts with PostGIS `GEOMETRY` boundary polygons.
- `institutes`: 417+ ITIs with principal foreign keys and workshop capex records.
- `courses_trades`: 2,200 NSQF qualifications with 384d `pgvector` embeddings.
- `gap_scores`: Weekly composite scores (0.00–1.00) and oversupply flags.
- `recommendations`: Curriculum amendment proposals with MinIO S3 dossier URLs.
- `placement_records`: Range-partitioned annual tables storing HMAC candidate hashes and wages.
- `audit_logs`: Append-only immutable log with SHA-256 digital approval signatures.

---

## Chapter 12: Quality Engineering, Testing Strategy & Verification Pyramid

### 💡 Plain English Concept — How do we prove the software is bulletproof?
Before any code is accepted, it passes through an automated testing pyramid with 6 distinct tiers.

*(See Diagram 11: MahaSkills Multi-Layer Quality & Verification Pyramid in the PDF)*

### ⚙️ Contract-First Architecture & The 6 Tiers
- **Contract-First:** `docs/03-api/openapi.yaml` linted with `@stoplight/spectral-cli`.
- **Tier 1:** Vitest & pytest unit tests ($\ge 85\%$ coverage).
- **Tier 2:** API contract tests via Prism and `pytest-asyncio`.
- **Tier 3:** Playwright end-to-end user journeys.
- **Tier 4:** Security & RBAC tests (OWASP ZAP).
- **Tier 5:** Accessibility tests (axe-core, WCAG 2.1 AA, GIGW).
- **Tier 6:** Load tests with Locust / k6 (1,000 concurrent virtual users).

---

## Chapter 13: Production Deployment, Air-Gapped Cloud & Disaster Recovery

### 💡 Plain English Concept — Where does the software live?
MahaSkills is engineered for sovereign, air-gapped deployment on the Maharashtra State Data Centre (MahaGovCloud) with zero external closed API bills.

*(See Diagram 12: Production Infrastructure & Cloud Deployment Topology in the PDF)*

### ⚙️ SRE & Cloud Architecture
- **Stateless Pods:** FastAPI Docker containers auto-scaled via Kubernetes HPA at 70% CPU.
- **Database HA:** PostgreSQL 16 primary-replica cluster behind HAProxy, with 85% of reads cached in Redis 7 (15m TTL).
- **Air-Gapped AI:** Local Sentence-Transformers and local Ollama/vLLM instances ensure 100% data residency and zero third-party API costs.
- **Disaster Recovery:** RPO $\le 15$ min, RTO $\le 30$ min via nightly snapshots and WAL-G streaming replication.

---

## Chapter 14: Architectural Decision Records (ADRs) & Executive Summary

### ⚙️ Key Architecture Decision Records
- **ADR-001 (React 18 + TS Strict):** Compile-time safety across 36 district dashboards.
- **ADR-002 (Keycloak 24 OIDC):** Sovereign self-hosted IAM federating with Mahaswayam SSO.
- **ADR-003 (TanStack Query v5):** Server cache deduplication and optimistic UI updates.
- **ADR-004 (PostgreSQL 16 + pgvector):** Colocated ACID relational data and dense vector search in one database.
- **ADR-005 (HMAC-SHA256 Pseudonymization):** Zero-plaintext student PII under DPDP Act 2023.
- **ADR-006 (OpenAPI Contract-First):** Single source of truth for backend and frontend.

### 🏛️ Executive ROI for the Government of Maharashtra
1. **+24% Placement Velocity:** Lifts state placement from ~45% to over 69%, redirecting 15,000+ youth into high-growth industries annually.
2. **Fiscal Efficiency:** Eliminates wasteful capex on obsolete workshop equipment by tying ITI capex approvals to real market demand.
3. **Syllabus Cycle (180 $ightarrow$ 21 Days):** Replaces slow 5-year committee cycles with dynamic, data-driven alignment synchronized with Maharashtra's industrial growth clusters.
