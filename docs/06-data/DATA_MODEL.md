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
