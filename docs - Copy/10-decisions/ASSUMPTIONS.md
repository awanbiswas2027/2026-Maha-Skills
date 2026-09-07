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
