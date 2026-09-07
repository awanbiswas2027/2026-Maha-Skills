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
