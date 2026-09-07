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
