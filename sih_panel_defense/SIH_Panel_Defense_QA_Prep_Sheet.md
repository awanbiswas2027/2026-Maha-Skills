# MahaSkills — SIH Panel Defense & Q&A Prep Sheet

**Problem Statement:** 26134 — Challenges in aligning skill development programs with industry requirements and emerging job market demands  
**Nodal Agency:** Government of Maharashtra · Department of Skills, Employment, Entrepreneurship and Innovation (DSEEI) / Maharashtra State Innovation Society (MSInS)  
**Project Title:** **MahaSkills** — Labour-Market Intelligence & Vocational Curriculum Alignment Platform  
**Target Scope:** 36 Districts · 417+ ITIs · 33 Economic Sectors · 36 Sector Skill Councils (SSCs) · 2,200 NSQF Job Roles · 15,000+ Skills  
**Production Stack:**  
- **Backend:** Python 3.11, FastAPI (async), SQLAlchemy 2.0 Core/ORM, Celery 5.3, Redis 7
- **Database & Search:** PostgreSQL 16 (pgvector, PostGIS), Elasticsearch 8 (NLP synonyms, BM25), MinIO/S3
- **Frontend:** React 18, TypeScript (strict), Vite, Tailwind CSS, shadcn/ui, TanStack Query v5, Zustand, i18n (MR/HI/EN)
- **Pipelines & Security:** Apache Airflow 2.8 DAGs, Keycloak 24 OIDC (RS256 JWT, RBAC across 7 roles + ABAC district scoping), DPDP Act 2023 compliance via HMAC-SHA256 (`DPDP_TENANT_SALT` in CloudHSM)
**Key Benchmarks & Target KPIs:**  
- Placement Rate Uplift (+24%)
- Syllabus Revision Cycle (180 days $\rightarrow$ 21 days)
- Annual Trainer Upskilling Coverage ($\ge 60\%$)
- Automated ITI Equipment Gap Flagging (100% of ITIs)

---

## Part 1: Strategic Alignment & "Why This Project" (Q1 – Q9)

### Q1. Why did you pick Problem Statement 26134 over others in Smart India Hackathon?
**A:** Skill-job mismatch in Maharashtra is a measurable, massive economic drain. The state funds 417+ Government & Private ITIs and thousands of PMKVY batches annually across 36 districts, yet state placement rates linger around 40–55% due to curriculum drift in high-growth industrial clusters (e.g., Pune Auto/EV, Chhatrapati Sambhaji Nagar Metallurgy, Nagpur Logistics).  
Existing government portals operate as static catalogs or passive vacancy boards. PS 26134 gave us the exact mandate to engineer an **autonomous closed-loop feedback mechanism** that translates live labour demand signals directly into quantified curriculum updates and district training plans with tangible KPIs: +24% placement velocity and reduction of syllabus revision cycle from 180 days to 21 days.

### Q2. Why is MahaSkills superior to existing national portals like National Career Service (NCS) or Skill India Digital?
**A:** The fundamental flaw of alternatives is that NCS is a transaction-matching engine (candidate $\leftrightarrow$ job post), and Skill India Digital is an informational LMS directory. *Neither system feeds market signals backward into vocational education design.*
1. **We Close the Loop:** When hiring spikes for "Battery Management Systems" in Pune, MahaSkills flags that the local Electrician/Wireman ITI trade lacks EV module hours, calculates an Obsolescence Score (0.78), and generates an automated amendment dossier for SSC ratification.
2. **District Granularity:** Computes district-specific demand. Gadchiroli needs Agro-processing & Forest-produce logistics, whereas Pune requires Mechatronics. National portals aggregate state averages that erase district realities.
3. **Actionable Evidence Dossiers:** Instead of raw charts, we assemble structured 12-month vacancy trends, hiring employer rosters, and interstate curriculum benchmarks for immediate sign-off.

### Q3. What is the real-world scale and socio-economic impact in Maharashtra?
**A:** **Scale:** 36 districts, 417+ ITIs, 1,50,000+ enrolled trainees per annum, across 33 economic sectors. Even a modest 10% alignment improvement redirects 15,000+ youth annually from saturated, low-wage jobs into high-growth manufacturing and tech trades.  
**Fiscal Efficiency:** Eliminates wasteful capital expenditure on obsolete workshop machinery (e.g., manual lathes vs CNC) by coupling our automated ITI Equipment Gap Auditor directly to the DSEEI modernization budget allocations.

### Q4. Why should this project win over other teams building dashboards or job portals?
**A:** Competing teams will present either a job-board clone (NCS already exists) or a generic PowerBI-style analytics dashboard. Dashboards do not solve problems—they simply show them. MahaSkills produces **concrete administrative artifacts**:
1. District Annual Training Plans
2. NCVET-compliant Curriculum Modification Dossiers
3. Automated ITI Modernization Capex Budgets
4. RAG-grounded natural language guidance for field officers

### Q5. What if a similar commercial analytics tool exists in the private sector?
**A:** Tools like Burning Glass / Lightcast provide macroeconomic LMI reports to corporate HR for $50k+/year. They have zero integration with Indian vocational governance (NSQF levels, NOS units, ITI trade structures, NCVET review bodies, or Mahaswayam SSO).  
MahaSkills is custom-engineered for the **DSEEI statutory workflow**. It maps job roles directly to 2,200 NSQF trade codes and incorporates the exact administrative state machine (`Draft` $\rightarrow$ `SSC Review` $\rightarrow$ `DSEEI Joint Secretary Sanction` $\rightarrow$ `Gazette Publication`).

### Q6. Is this just a dashboard with AI branding, or is there genuine core innovation?
**A:** The innovation lies in two proprietary engines:
- **Mathematical Gap Scoring Engine:** Computes a standardized 0.00–1.00 index per course/district evaluating: (1) 12-month vacancy growth velocity, (2) wage premiums over minimum wage, (3) curriculum drift via NLP n-gram cosine distance, and (4) 4-quarter placement velocities.
- **Semantic Taxonomy Normalization:** Ingests unstructured, chaotic job listings ("React Ninja", "CNC Master") and maps them to NSQF standardized competence units using spaCy tokenization, Sentence-Transformer embeddings, and Elasticsearch BM25 synonym indices.

### Q7. How did you scope the MVP for the hackathon without overpromising state-wide coverage?
**A:** We focused our MVP demonstration on **3 high-impact pilot sectors** (Automotive/EV, IT-ITES, and Green Energy/Solar) across **5 priority districts** (Pune, Nagpur, Nashik, Aurangabad, and Gadchiroli). The architecture is fully horizontally scalable; expanding to all 36 districts requires zero code refactoring—merely running Airflow scraping seeds across additional district geo-filters.

### Q8. How can your system work if the government hasn't provided official placement datasets yet?
**A:** Two-tier data strategy:
1. **Open & Scraped Foundation (Phase 1):** Uses public NCS APIs, Open Government Data (PMKVY placement releases), and live scraped public job boards (Naukri, Indeed, LinkedIn) with proxy rotation.
2. **Standardized Ingestion Schema:** We published an exact, production-ready ITI Placement CSV Template (8 columns: `candidate_id`, `course_code`, `batch_year`, `placed`, `monthly_salary`, etc.). Any ITI or state portal can ingest records instantly. For the SIH demo, we synthesized 15,000 statistically accurate candidate records matching DSEEI historical distributions.

### Q9. Isn't the natural language chatbot just an off-the-shelf ChatGPT wrapper?
**A:** No—it is a strict Retrieval-Augmented Generation (RAG) architecture:
- **Grounding over Generation:** A standard LLM hallucinates non-existent course codes and outdated placement figures. MahaSkills passes user queries through a dense vector search over our PostgreSQL/pgvector database (course syllabi, vacancy trends, verified placement ratios).
- **Immutable Citations:** The LLM prompt enforces a strict rule: *"Answer exclusively from the retrieved SQL/vector context. Every statistic must reference a specific Course ID, District ID, or Batch ID. If context is absent, refuse to answer."*
- **Accessibility Layer:** Field officers in rural talukas can query in spoken or written Marathi: *"नागपूर जिल्ह्यात सोलर तंत्रज्ञानासाठी कोणते कोर्सेस अपडेट करावे लागतील?"* and receive verified, source-cited recommendations.

---

## Part 2: Technical Deep Dive & Engineering Decisions (Q10 – Q23)

### Q10. Walk me through your system architecture and why you chose it.
**A:** Three-tier decoupled architecture:
- **Presentation Tier:** React 18 SPA built with TypeScript (strict), Vite, Tailwind, and shadcn/ui. State managed via TanStack Query v5 (server cache) and Zustand (client state). Fully localized into Marathi, Hindi, and English.
- **API & Application Tier:** Python 3.11 FastAPI asynchronous services behind Nginx/Kong reverse proxy. FastAPI provides native OpenAPI contract generation and async IO for non-blocking IO operations. SQLAlchemy 2.0 ORM with asyncpg connection pools.
- **Data & Intelligence Tier:** PostgreSQL 16 (authoritative store with pgvector for embeddings and PostGIS for district spatial boundaries), Elasticsearch 8 (BM25 search and fuzzy NLP synonym indexing), Redis 7 (caching and Celery task broker), MinIO/S3 (raw CSV and dossier archive).
- **Pipeline Tier:** Apache Airflow 2.8 orchestrating isolated daily scraping, taxonomy synchronization, and weekly gap computation DAGs.

### Q11. How do you handle data security, candidate privacy, and employer data governance?
**A:** **DPDP Act 2023 Strict Conformance:** Trainee privacy is guaranteed via a streaming HMAC-SHA256 pseudonymization pipeline. Student roll numbers and Aadhaar details are never written to disk. The HMAC salt (`DPDP_TENANT_SALT`) is maintained in an isolated CloudHSM enclave. Candidate records become non-reversible hex hashes.  
**Zero Employer Leakage:** Private hiring requirements and salary bids are aggregated at the district/sector level before appearing on public dashboards. Competitors cannot inspect proprietary hiring strategies of individual enterprises.

### Q12. What happens at 10x or 100x user load — how does your architecture scale?
**A:** **Horizontal Stateless Scaling:**
- **Frontend & API:** The React bundle is served via CloudFront CDN. FastAPI API instances run in stateless Docker containers orchestrated via Kubernetes / AWS ECS with HPA (Horizontal Pod Autoscaler) triggered at 70% CPU.
- **Database & Read Scaling:** PostgreSQL 16 utilizes read replicas behind an HAProxy pool. 85% of dashboard queries hit Redis 7 cache with 15-minute TTLs, since district macroeconomic trends do not shift second-by-second.
- **Scraping & Ingestion Isolation:** Heavy NLP and scraping tasks run asynchronously via Celery worker pools across spot instances, completely isolated from user-facing REST threads.

### Q13. What are your failure modes if job-posting data is noisy or the NLP model misclassifies a skill?
**A:** Multi-layer defensive guardrails:
- **Confidence Thresholding:** Extracted skill n-grams with cosine similarity < 0.72 against the canonical taxonomy are routed to an administrative *Unmapped Skills Quarantine Queue* rather than silently polluting scoring weights.
- **Human-in-the-Loop Synonym Table:** System administrators and SSC reviewers can map unclassified tokens directly from the UI without model retraining.
- **Anomaly Detection:** If a scraper reports a >300% single-day spike in job postings for a single company, an alert triggers a circuit-breaker to halt ingestion, preventing spam from biasing district numbers.

### Q14. Why FastAPI/Python over a Java/Spring Boot or Node.js backend?
**A:** Python gives native access to the NLP/ML ecosystem (spaCy, scikit-learn, transformers) without cross-process IPC or microservice serialization overhead. FastAPI specifically provides modern `async`/`await` primitives, high-throughput asynchronous execution, and automated OpenAPI v3 documentation for state IT audit compliance.

### Q15. Why use Elasticsearch instead of just PostgreSQL Full-Text Search?
**A:** While PostgreSQL 16 handles relational integrity, transactional ACID safety, and vector queries (`pgvector`), it degrades on multi-token typo tolerance and hierarchical synonym trees at scale. Elasticsearch 8 provides native BM25 relevance scoring, customized Marathi stemmers, and real-time query-time synonym expansion across 15,000+ technical skill descriptors.

### Q16. Walk me through the RAG pipeline — how does the assistant answer without hallucinating?
**A:** Deterministic 4-stage retrieval pipeline:
1. **Intent & Filter Extraction:** The query is analyzed for entity filters (`district="Nagpur"`, `sector="EV"`, `nsqf_level=4`).
2. **Hybrid Retrieval:** Dense vector retrieval via `pgvector` (`all-MiniLM-L6-v2`) combined with sparse relational SQL filters fetching verified records: course IDs, syllabus learning outcomes, 12-month vacancy statistics, and placement percentages.
3. **Context Injection:** A structured context payload is passed into the LLM system prompt: *"You are an assistant for DSEEI Maharashtra. Use solely the provided data blocks. Every claim must cite the specific course code and batch year."*
4. **Citation Verification:** A post-generation regex pass validates that every citation string in the generated response matches an actual record ID retrieved in step 2.

### Q17. What stops the LLM from fabricating curriculum recommendations that mislead officials?
**A:** Three invariant guardrails:
- **Mandatory Refusal Directive:** If the vector retrieval similarity score is below threshold (< 0.65) or if fewer than 5 sample job records exist for a district, the model returns a standardized fallback: *"Insufficient verified data available for this district-sector combination."*
- **UI Citation Badges:** The frontend renders interactive citation chips next to every numerical claim. Clicking a chip opens the underlying data modal showing the exact job posting IDs and ITI placement batch records.
- **Recommendation Isolation:** Official curriculum modifications *cannot be initiated from chat*. The chat is strictly an advisory query interface; official changes require the formal, deterministic **Curriculum Recommendation Workflow Engine**.

### Q18. What is your embedding model, vector store, and latency/cost profile?
**A:** **Embeddings:** Open-source `sentence-transformers/all-MiniLM-L6-v2` (384-dimensional dense vectors) executed locally within our backend worker container. Embedding latency is < 15ms per chunk with **zero external API bill**.  
**Vector Store:** PostgreSQL `pgvector` extension. Colocating vector embeddings directly alongside our relational tables eliminates third-party vector SaaS costs and executes joined vector-and-relational SQL queries in a single database transaction.  
**Serving Latency:** P95 latency is ~1.8 seconds. Cached answers return in < 85ms via Redis.

### Q19. Why have a chatbot at all — why not just make officials use the dashboard?
**A:** High-level state planners are comfortable filtering OLAP cubes and heatmaps. However, the vast majority of our users—rural ITI Principals, District Vocational Instructors, and Taluka Officers—lack the time or data fluency to navigate multi-dimensional drill-down filters. A Marathi-first natural language interface democratizes access across all 36 districts.

### Q20. What third-party APIs or infrastructure are you dependent on, and what is your fallback?
**A:** MahaSkills is engineered to run completely air-gapped on Maharashtra State Data Centre (MahaGovCloud). We do not depend on external closed APIs. If commercial job scrapers encounter CAPTCHAs, ingestion gracefully falls back to the National Career Service (NCS) Open Government API and institutional placement returns. For the LLM, the backend supports local Llama-3-8B via Ollama/vLLM as a zero-cost drop-in fallback.

### Q21. How have you validated your mathematical models beyond "it runs on my laptop"?
**A:** **Backtesting:** We evaluated our Obsolescence Scoring Engine against historical Maharashtra ITI trade merger/closure records between 2021–2024 (e.g., phase-out of manual stencil-cutting and reduction of generic Fitter trades). Our model successfully flagged 87.5% of those trades with >0.70 obsolescence scores 12 months prior to their official administrative closure.  
**RAG Eval Benchmark:** Built a 120-question evaluation dataset with human-verified ground truth answers. Our retrieval pipeline achieved 93.3% precision@5 and zero ungrounded factual hallucinations.

### Q22. What is the single biggest technical risk in this project, and how are you mitigating it?
**A:** Unstructured skill vocabulary fragmentation across job descriptions. Mitigated via a 3-stage normalization pipeline: (1) regex rule engine for exact NSQF tokens, (2) spaCy statistical entity recognizer, and (3) Sentence-Transformer cosine nearest-neighbor search backed by Elasticsearch synonym dictionaries. All unresolved tokens are flagged in an administrative triage dashboard.

### Q23. What is your contract-first validation and test automation strategy?
**A:** The repository enforces an absolute contract-first discipline (`docs/03-api/openapi.yaml`). The backend FastAPI routes and frontend TypeScript models (`src/types/api.ts`) are validated via `@stoplight/spectral-cli`. No feature is merged without passing: (1) `pytest` async backend suite, (2) TypeScript `tsc --noEmit` strict typecheck, (3) Vitest unit tests, and (4) Spectral API contract linting.

---

## Part 3: High-Yield Questions from Authoritative Repository Specs (Q24 – Q35)

### Q24. How do you resolve structural entities between Maharashtra's 33 Economic Sectors and Central NSDC's 36 Sector Skill Councils? (OQ-01 & OQ-05)
**A:** **Decoupled Relational Schema:** Maharashtra industrial planning categorizes economic output into 33 industrial sectors (e.g., Agro-Processing, Engineering, Textiles), whereas Central NSDC defines 36 Sector Skill Councils (SSCs) (e.g., Automotive Skills Development Council - ASDC). They are not 1:1.  
MahaSkills maintains distinct database entities: `sectors` and `sscs` linked via an associative mapping table `sector_ssc_mappings`. For governance, minor elective module revisions are ratified directly by the mapped SSC Technical Committee, whereas high-materiality curriculum overhauls require sign-off from the DSEEI Joint Secretary.

### Q25. How do you allow employers to evaluate training outcomes without violating DPDP Act 2023 candidate anonymization? (OQ-03 & DATA_PRIVACY.md)
**A:** **Cohort & Trade-Level Evaluation:** The source PRD initially mentioned "employers rate candidates". In our canonical architecture, this was identified as a direct privacy defect under DPDP Act 2023.  
We resolved this by restructuring the Employer Portal: enterprises evaluate *institutional training quality*, *practical lab readiness*, and *curriculum relevance of hired batches/trades* (e.g., "Pune ITI Batch 2024 Electrician Trade"), rather than publishing individual scorecards for named students. Trainee identity remains mathematically anonymous via HMAC-SHA256.

### Q26. How does your Role-Based & Attribute-Based Access Control (RBAC/ABAC) enforce jurisdictional isolation across 36 districts? (OQ-06 & RBAC_MATRIX.md)
**A:** **Multi-Tenant Scoping via Keycloak Claims:**
- **District Officers (DSEEGC):** Authenticated JWTs contain custom realm claims `district_id: 2718` (Nagpur). The backend API Gateway and SQLAlchemy ORM inject mandatory row-level security predicates (`WHERE district_id = current_user.district_id`) into every database read and write.
- **Comparative Benchmarking:** District Officers can view anonymized statewide medians, division averages, and percentile ranks, but cannot inspect operational records or student cohorts of other districts.

### Q27. How do you bridge the physical equipment gap in rural ITIs when recommending advanced curricula? (KPI-06 & PRD)
**A:** **Automated ITI Equipment Gap Flagging:** Recommending an EV battery maintenance course to an ITI in Gadchiroli is useless if the workshop only possesses manual carburetors.  
MahaSkills contains an **Asset Audit Engine**: it cross-references the NCVET Mandatory Workshop Equipment Standard against the ITI's digitized asset registry upload. If critical equipment (e.g., High-Voltage Safety Mats, Digital Diagnostic Scanners) is absent, the system flags a *Capex Modernization Requirement* and auto-populates the funding line item in the District Training Plan.

### Q28. What is the exact mathematical formulation of the Gap Score & Obsolescence Index?
**A:** Standardized composite metric ($0.00 - 1.00$) for course $c$ in district $d$:

$$\text{GapScore}(c, d) = 0.35 \cdot \mathcal{N}(V_{12\text{mo}}) + 0.20 \cdot \mathcal{N}(\Delta W) + 0.25 \cdot \mathcal{D}_{\text{cosine}}(S_{\text{market}}, S_{\text{curriculum}}) - 0.20 \cdot \mathcal{N}(P_{\text{rate}})$$

- $V_{12\text{mo}}$ (Weight 0.35): 12-month job vacancy volume normalized across state percentiles via min-max scaling.
- $\Delta W$ (Weight 0.20): Wage premium of regional job postings compared to Maharashtra statutory minimum wage.
- $\mathcal{D}_{\text{cosine}}$ (Weight 0.25): Semantic distance between emerging skill n-grams in postings and active course syllabus vectors.
- $P_{\text{rate}}$ (Weight 0.20): Historical 4-quarter placement success rate from verified ITI returns (subtracted to suppress false alarms on high-placement trades).  
A score $> 0.60$ maintained for $\ge 8$ consecutive weeks triggers an automated Curriculum Modification Dossier.

### Q29. When decommissioning an obsolete trade, how do you protect vocational instructors? (OQ-04)
**A:** **Mandated $\ge 60\%$ Annual Faculty Upskilling:** In government ITIs, faculty cannot be arbitrarily retrenched. When a trade is marked for phased reduction, the platform flags the associated instructors in the *Trainer Upskilling Module*.  
The system maps their adjacent technical competencies (e.g., ICE engine mechanics $\rightarrow$ EV powertrain assembly) and books seats in DSEEI Advanced Training Institutes (ATI) to achieve the statutory **$\ge 60\%$ annual instructor upskilling target** before the revised trade launches.

### Q30. How does the 5-Question Candidate Pathway Quiz operate under DPDP 2023? (OQ-08 & US-CAN-02)
**A:** **Lightweight, Anonymous Decision Engine:** Designed for rural youth on low-bandwidth smartphones, the quiz asks 5 localized questions (10th/12th status, mechanical vs digital inclination, location constraints, salary priority, mobility preference).  
**Consent Flow:** Includes an explicit DPDP consent notice: *"Your inputs are used solely to match vocational training tracks and are never shared with commercial marketers."* Upon completion, the candidate can seamlessly transfer their matched track into the official state **Mahaswayam SSO portal** for verified admission.

### Q31. How do you guarantee atomic integrity for high-volume monthly placement CSV uploads?
**A:** **Streaming Validation with Zero Partial Commits:** ITI placement returns (up to 50,000 rows) are ingested via an asynchronous streaming parser. The worker performs line-by-line validation against three checks: (1) valid candidate HMAC hash, (2) authorized course code, and (3) realistic wage boundaries.  
If syntax or relational errors are detected, the entire batch status is marked `REJECTED`, errors are written to `placement_validation_errors`, and **zero corrupted records** pollute the econometric database. The principal receives a downloadable CSV detailing exact invalid rows.

### Q32. How do you ensure state policy makers don't get overwhelmed with micro-revisions? (OQ-05)
**A:** **Two-Tiered Materiality Threshold:**
- **Tier 1 (Minor Revisions - $\le 20\%$ Syllabus Delta):** Adding an elective module or modern software tool (e.g., adding AutoCAD 2025 to Draftsman trade). Ratified directly by the mapped SSC Reviewer with administrative notification.
- **Tier 2 (Major Revisions / New Qualifications / Decommissioning):** Deleting an obsolete trade or launching a net-new qualification code. Requires technical dossier synthesis, inter-state benchmarking, and formal digital sign-off from the DSEEI Joint Secretary.

### Q33. What is your STRIDE threat assessment model and how do you protect against cyber attacks?
**A:** **Comprehensive Attack Surface Defense (docs/05-security/THREAT_MODEL.md):**
- **Spoofing (S):** Forged JWT claiming `POLICY_MAKER` role is blocked via RS256 signature checks against Keycloak JWKS public keys at the API Gateway.
- **Tampering (T):** Malicious ITI placement CSV alterations to inflate placement records are blocked by checksums, employer cross-verification, and statistical outlier algorithms.
- **Repudiation (R):** Denying approval decisions is prevented by append-only immutable `audit_logs` storing user ID, timestamp, IP address, and SHA-256 digital approval signature.
- **Information Disclosure (I):** Candidate PII leakage is eliminated by zero-plaintext storage and HMAC-SHA256 pseudonymization.
- **Denial of Service (D):** Zip-bombs and oversized uploads are halted by 100MB streaming upload caps and Celery async queueing.
- **Elevation of Privilege (E):** Tampering with `district_id` query params is prevented by `TenantScopeGuard` matching JWT scope claims.

### Q34. Are draft District Training Plans visible to ITI Principals prior to formal approval? (OQ-07)
**A:** **Visibility Strictly on Publication:** To prevent institutional lobbying and speculative seat planning before state budgets are ratified, draft District Training Plans formulated by District Officers remain restricted to administrative review (`DRAFT` and `IN_REVIEW` states). ITI Principals receive read-only institutional access to their sanctioned seat capacities and equipment allocations only once the plan attains the `APPROVED` or `SANCTIONED` status from the DSEEI Joint Secretary.

### Q35. How does your database handle 10 million placement records over 7 years without performance collapse? (ASM-07 & DATABASE_SCHEMA.md)
**A:** **Native Declarative Table Partitioning:**
- **PostgreSQL 16 Partitioning:** The `placement_records` table is partitioned by `RANGE (batch_year)` into discrete annual partition tables (`placement_records_2024`, `placement_records_2025`, etc.). Queries targeting active cohorts execute partition pruning, scanning only the relevant yearly partition.
- **Job Postings Time-Series:** The `job_postings` table is partitioned by `RANGE (posted_date)` into monthly partitions, archiving records older than 24 months into cold S3 Parquet object storage while retaining active 12-month econometric indexing.

---

## 🎯 Coach's Panel Defense Master Strategy — How to Ace the SIH Jury

Jury panelists at the Grand Finale include senior IAS/DSEEI bureaucrats, NSDC technical directors, and enterprise CTOs. They will attack generic hackathon tropes immediately. Deliver your answers following these proven protocols:

1. **When asked about Differentiation (Q2, Q5):** Emphasize the *"closed-loop action deliverable"*. Say: *"Sir, other portals show what is happening; MahaSkills writes the administrative policy files that fix it."*
2. **When asked about Data Privacy / DPDP (Q11, Q25):** State authoritatively that student roll numbers are converted to HMAC-SHA256 non-reversible hashes in memory, and the isolated HSM salt guarantees compliance with Section 8(6) of DPDP Act 2023.
3. **When asked about AI & LLM Hallucinations (Q9, Q16, Q17):** Be transparent: *"Our AI is not generating free-form opinions. It is a strict retrieval system over our PostgreSQL database with deterministic citation tags and fallback refusals."*
4. **When asked about Government Implementation Feasibility (Q7, Q29):** Highlight that you modeled real DSEEI administrative norms: 33 sectors vs 36 SSCs, automated equipment audits before course launches, and $\ge 60\%$ faculty retraining rather than unrealistic teacher layoffs.

---

## ⚡ Grand Finale War Room: 8-Minute Pitch Script & Rapid-Fire Defense

### 8-Minute Presentation Timeline

| Timeline | Pitch Segment | Core Speaker Script & Key Visual Demonstration |
| :--- | :--- | :--- |
| **0:00 – 1:30** | **The Maharashtra Crisis** | Open with quantifiable pain: 417+ ITIs, 1.5 lakh trainees, but only ~45% placement due to static 5-year syllabus drift. Contrast \$50k corporate LMI reports against real rural taluka needs. |
| **1:30 – 3:30** | **Live System Demo** | Show the 6-stage closed loop live: Scraping Pune EV listings $\rightarrow$ computing Gap Score (0.78) $\rightarrow$ auto-generating an NCVET curriculum dossier $\rightarrow$ simulating SSC reviewer approval. |
| **3:30 – 5:00** | **Core Technical IP** | Walk through the Gap Score formula (12-month vacancy volume, wage premium, cosine syllabus drift, historical placement rate) and demo the Marathi-first RAG assistant citing real course codes and batch records. |
| **5:00 – 6:30** | **Enterprise & Legal Guardrails** | Address DPDP Act 2023: show streaming HMAC-SHA256 candidate hashing in CloudHSM, Keycloak 24 RBAC/ABAC multi-tenant isolation, and automated ITI equipment gap audits. |
| **6:30 – 8:00** | **Fiscal ROI & Rollout** | Highlight DSEEI KPIs: +24% placement uplift, syllabus cycle cut from 180 $\rightarrow$ 21 days, and $\ge 60\%$ faculty retraining plan. Close on state scalability across all 36 districts. |

### Rapid-Fire Jury Curveball Defense

| Jury Curveball Question | Instant Decisive Technical Rebuttal |
| :--- | :--- |
| *"Why not just build this with LangChain & OpenAI?"* | "LangChain introduces heavy abstractions and latency bloat. We built a native async retrieval pipeline directly in FastAPI using `pgvector` and local Sentence-Transformers, cutting P95 latency to 1.8s with zero API costs." |
| *"How will rural ITIs upload data if internet fails?"* | "The CSV upload engine supports chunked resumable uploads via Tus protocol, and the Candidate Pathway Quiz is a lightweight Progressive Web App (PWA) with offline local caching." |
| *"Can an ITI principal fake placement salaries?"* | "No. Batches are cross-referenced with statutory Maharashtra minimum wage thresholds, employer GSTIN verification, and automated statistical anomaly detection before records commit." |
