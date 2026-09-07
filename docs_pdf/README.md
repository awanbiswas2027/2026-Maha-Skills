# MahaSkills — Comprehensive Master Architecture Guide & System Manual

This folder contains the complete, authoritative **14-Page Master Architecture Guide & System Manual** synthesized from the 51 canonical specification documents in `docs/` and `docs - Copy/`.

It is specifically authored for **anyone who does not know anything about this project** (evaluators, jury panelists, new software engineers, government officials, and non-technical stakeholders) while providing complete technical, algorithmic, and architectural rigor.

---

## 📁 Deliverables & File Overview

| File | Description | Format / Size |
| :--- | :--- | :--- |
| [`MahaSkills_Comprehensive_Master_Architecture_Guide.pdf`](./MahaSkills_Comprehensive_Master_Architecture_Guide.pdf) | **Authoritative 14-Page Publication PDF** with 14 self-contained chapters, beginner-friendly analogies, technical mechanics, regulatory guardrails, and 12 embedded vector SVG diagrams. | PDF (Vector, ~770 KB) |
| [`MahaSkills_Comprehensive_Master_Architecture_Guide.html`](./MahaSkills_Comprehensive_Master_Architecture_Guide.html) | Standalone, print-optimized HTML source with inline CSS styles and SVG vector graphics (opens in any browser). | HTML (~94 KB) |
| [`MahaSkills_Comprehensive_Master_Architecture_Guide.md`](./MahaSkills_Comprehensive_Master_Architecture_Guide.md) | Complete companion Markdown document for reading on GitHub or offline markdown viewers. | Markdown (~21 KB) |
| [`build_guide.py`](./src/build_guide.py) | Master automation script (in `src/`) that combines all chapter modules and invokes headless Chromium/Edge (`--headless=new --print-to-pdf`) to compile the 14-page PDF. | Python (~23 KB) |
| [`src/`](./src/) | Source directory containing modular python generators (`chapters_*.py`, `diagrams_*.py`, `styles.py`, `diagrams.py`). | Directory |

---

## 🚀 How to Rebuild the PDF

To regenerate the PDF at any time:

```powershell
python docs_pdf/src/build_guide.py
```

*Prerequisites: Microsoft Edge or Google Chrome installed on Windows.*

---

## 📑 The 14 Chapters & 12 Embedded Diagrams

1. **Chapter 1: The Maharashtra Crisis & Problem Statement #26134 (Page 1)**  
   The vocational mismatch crisis across 417+ ITIs and 1.5 lakh students; glossary of terms (ITI, DSEEI, DVET, NSQF, SSC, LMI).
2. **Chapter 2: The Core Innovation — Closed-Loop Alignment Architecture (Page 2)**  
   Why open-loop portals fail and how MahaSkills closes the loop in 6 stages.  
   *(Diagram 1: End-to-End Closed-Loop Alignment Architecture)*
3. **Chapter 3: System Architecture & The 3-Tier Decoupled Platform (Page 3)**  
   Decoupled presentation, application/API, intelligence/data, and pipeline tiers.  
   *(Diagram 2: C4 Level 1 System Context Architecture)*
4. **Chapter 4: The Mathematical Core — Gap Scoring & Obsolescence Engine (Page 4)**  
   The composite formula combining vacancy velocity, wage premium, cosine drift, and placement rate over an 8-week streak.  
   *(Diagram 3: Algorithmic Gap & Obsolescence Scoring Pipeline)*
5. **Chapter 5: Semantic Taxonomy Normalization & NLP Processing (Page 5)**  
   Translating messy job titles ("React Ninja") into canonical NSQF competence units.  
   *(Diagram 4: 3-Stage Semantic Taxonomy Normalization Flow)*
6. **Chapter 6: Data Privacy & Legal Compliance (DPDP Act 2023) (Page 6)**  
   Streaming HMAC-SHA256 candidate pseudonymization and zero-disk PII storage.  
   *(Diagram 5: DPDP Act 2023 Cryptographic Pseudonymization Pipeline)*
7. **Chapter 7: Data Engineering, Ingestion & 10M-Record Table Partitioning (Page 7)**  
   Airflow 2.8 DAG orchestration and PostgreSQL 16 annual range table partitioning.  
   *(Diagram 6: Automated Ingestion & Pipeline Orchestration)*
8. **Chapter 8: Deterministic RAG AI Assistant & Marathi-First Interface (Page 8)**  
   A hallucination-free retrieval engine providing Marathi spoken/written guidance for rural ITI officers.  
   *(Diagram 7: Deterministic Grounded RAG Pipeline Architecture)*
9. **Chapter 9: Multi-Tenant Security, RBAC/ABAC & STRIDE Cyber Defense (Page 9)**  
   7 platform roles, Keycloak JWT realm scoping, and complete STRIDE attack defense perimeter.  
   *(Diagram 8: STRIDE Threat Assessment & Security Defense Perimeter)*
10. **Chapter 10: Curriculum Governance State Machine & Faculty Protection (Page 10)**  
    5-stage statutory state machine, two-tier materiality thresholds, $\ge 60\%$ mandatory faculty retraining, and automated equipment capex auditing.  
    *(Diagram 9: Curriculum Recommendation Governance State Machine)*
11. **Chapter 11: Database Architecture & Core Entity-Relationship Model (Page 11)**  
    Comprehensive schema walkthrough of PostGIS districts, ITIs, pgvector courses, gap scores, and immutable audit logs.  
    *(Diagram 10: Core Relational & Vector Entity-Relationship Model)*
12. **Chapter 12: Quality Engineering, Testing Strategy & Verification Pyramid (Page 12)**  
    Contract-first OpenAPI linting and the 6-tier quality pyramid from unit tests ($\ge 85\%$) to 1,000 VU load tests.  
    *(Diagram 11: MahaSkills Multi-Layer Quality & Verification Pyramid)*
13. **Chapter 13: Production Deployment, Air-Gapped Cloud & Disaster Recovery (Page 13)**  
    Sovereign deployment on Maharashtra State Data Centre (MahaGovCloud), local AI execution, and RPO $\le 15$m / RTO $\le 30$m disaster recovery.  
    *(Diagram 12: Production Infrastructure & Cloud Deployment Topology)*
14. **Chapter 14: Architectural Decision Records (ADRs) & Executive Summary (Page 14)**  
    Summary of ADR-001 through ADR-006, and the executive ROI value proposition for the Government of Maharashtra (+24% placement uplift, 180 $\rightarrow$ 21 days syllabus revision cycle).
