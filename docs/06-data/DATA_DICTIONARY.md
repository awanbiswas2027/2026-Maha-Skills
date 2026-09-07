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
