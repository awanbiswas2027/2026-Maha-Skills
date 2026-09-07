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
