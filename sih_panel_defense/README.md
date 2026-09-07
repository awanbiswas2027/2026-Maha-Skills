# MahaSkills — SIH Panel Defense Package

This folder contains the complete, authoritative **Smart India Hackathon (SIH 2026) Panel Defense & Q&A Prep Package** for **Problem Statement 26134** (Government of Maharashtra · DSEEI / MSInS).

---

## 📁 Folder Contents

| File | Description | Format / Size |
| :--- | :--- | :--- |
| [`SIH_Panel_Defense_QA_Prep_Sheet.pdf`](./SIH_Panel_Defense_QA_Prep_Sheet.pdf) | **Authoritative 8-Page Executive Defense PDF** with all 35 questions, comprehensive multi-part answers, 9 embedded vector SVG diagrams, and the Grand Finale War Room pitch strategy. | PDF (Vector, ~843 KB) |
| [`SIH_Panel_Defense_QA_Prep_Sheet.html`](./SIH_Panel_Defense_QA_Prep_Sheet.html) | Standalone, print-optimized HTML source with inline CSS and vector SVGs. Open directly in any modern browser. | HTML (~85 KB) |
| [`SIH_Panel_Defense_QA_Prep_Sheet.md`](./SIH_Panel_Defense_QA_Prep_Sheet.md) | Complete companion Markdown document containing all 35 questions and answers, mathematical formulas, and the 8-minute presentation timeline. | Markdown (~30 KB) |
| [`generate_pdf.py`](./src/generate_pdf.py) | Python automation script (in `src/`) that compiles the HTML template and renders the pixel-perfect 8-page PDF using headless Chromium/Edge (`--headless=new --print-to-pdf`). | Python (~85 KB) |
| [`src/`](./src/) | Source directory containing the generator script. | Directory |

---

## 🚀 How to Recompile the PDF

To regenerate the PDF at any time, execute:

```powershell
python sih_panel_defense/src/generate_pdf.py
```

Prerequisites: Microsoft Edge or Google Chrome installed in standard Windows program paths.

---

## 📑 Document Structure & Content Overview

- **Key Specifications Banner (Page 1):** Official SIH 2026 & DSEEI/MSInS branding, 36 Districts, 33 Sectors, 36 SSCs, 417+ ITIs, production tech stack.
- **Part 1: Strategic Alignment & "Why This Project" (Q1 – Q9):**
  - PS 26134 root causes, differentiation from national portals (NCS, Skill India Digital), economic impact in Maharashtra, deliverables vs dashboards, proprietary math IP, MVP pilot scoping, synthetic placement data strategy, and Marathi-first RAG accessibility.
  - **Diagram 1:** End-to-End Closed-Loop Alignment Architecture (`PRD.md`)
- **Part 2: Technical Deep Dive & Engineering Decisions (Q10 – Q23):**
  - Three-tier decoupled stack, streaming HMAC-SHA256 data privacy (DPDP Act 2023), stateless horizontal scaling, scraping guardrails, FastAPI vs Java/Node, Elasticsearch 8 BM25 vs Postgres FTS, deterministic 4-stage RAG pipeline, curriculum state machine, open embeddings stack, air-gapped MahaGovCloud deployment, backtesting validation, and Spectral OpenAPI contract linting.
  - **Diagram 2:** C4 Level 1 System Context Architecture (`SYSTEM_ARCHITECTURE.md`)
  - **Diagram 3:** DPDP Act 2023 Cryptographic Pseudonymization Pipeline (`DATA_PRIVACY.md`)
  - **Diagram 4:** Automated Ingestion & Airflow Pipeline Orchestration (`DATA_INGESTION.md`)
  - **Diagram 5:** Curriculum Recommendation Governance State Machine (`BACKEND_ARCHITECTURE.md`)
  - **Diagram 6:** MahaSkills Multi-Layer Quality & Verification Pyramid (`TESTING_STRATEGY.md`)
- **Part 3: High-Yield Questions from Authoritative Repository Specs (Q24 – Q35):**
  - 33 Economic Sectors vs 36 SSCs entity resolution, cohort-level employer evaluation under DPDP, Keycloak RS256 multi-tenant RBAC/ABAC isolation, automated ITI equipment gap flagging, standardized Gap Score composite formula, mandatory $\ge 60\%$ faculty upskilling, 5-question candidate pathway quiz, atomic CSV streaming validation, two-tiered syllabus revision thresholds, STRIDE threat model defense, draft plan visibility governance, and PostgreSQL 16 declarative table partitioning for 10M+ records.
  - **Diagram 7:** Multi-Tenant RBAC & Jurisdictional ABAC Guard Architecture (`RBAC_MATRIX.md`)
  - **Diagram 8:** STRIDE Threat Assessment & Security Defense Perimeter (`THREAT_MODEL.md`)
  - **Diagram 9:** Core Relational & Vector Entity-Relationship Model (`DATABASE_SCHEMA.md`)
- **Page 8 Grand Finale War Room:**
  - **Coach's Master Strategy:** 4 non-negotiable jury protocols for senior IAS/DSEEI bureaucrats, NSDC directors, and CTOs.
  - **8-Minute Minute-by-Minute Pitch Script:** Time-stamped 0:00 to 8:00 roadmap with visual demo cues.
  - **Rapid-Fire Jury Curveball Defense:** Decisive instant technical rebuttals covering LangChain overhead, offline rural ITIs, and fraudulent placement data prevention.
