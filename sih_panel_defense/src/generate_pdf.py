"""
SIH Panel Defense Q&A Prep Sheet — Comprehensive Master Defense Manual (v5)
Platform: MahaSkills (Problem Statement 26134)
Includes:
- 35 In-Depth Questions with Structured Multi-Part Answers (Executive Pitch + Technical Proof + Regulatory Citation)
- 9 Authoritative Vector Architecture & Workflow Diagrams from docs - Copy
- Full Mathematical Formulations & Formula Callouts
- Page 8: Grand Finale War Room (Pitch Script, Rapid-Fire Defense Table, Coach's Master Jury Strategy)
"""

import os
import subprocess

html_content = r"""<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<title>MahaSkills — SIH Panel Defense &amp; Comprehensive Q&amp;A Master Manual | PS 26134</title>
<style>
  @page {
    size: A4;
    margin: 12mm 11mm 12mm 11mm;
    @bottom-right {
      content: "Page " counter(page);
    }
  }

  *, *:before, *:after {
    box-sizing: border-box;
  }

  body {
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
    color: #1e293b;
    background: #ffffff;
    line-height: 1.4;
    font-size: 11.5px;
    margin: 0;
    padding: 0;
  }

  /* Header Banner */
  .header-banner {
    background: linear-gradient(135deg, #0f172a 0%, #1e3a8a 55%, #0284c7 100%);
    color: #ffffff;
    padding: 16px 20px;
    border-radius: 6px;
    margin-bottom: 12px;
    box-shadow: 0 3px 10px rgba(15, 23, 42, 0.12);
  }

  .banner-top {
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-bottom: 1px solid rgba(255, 255, 255, 0.2);
    padding-bottom: 6px;
    margin-bottom: 8px;
  }

  .badge-ps {
    background: #f59e0b;
    color: #0f172a;
    font-weight: 800;
    font-size: 9.5px;
    padding: 2px 8px;
    border-radius: 20px;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }

  .badge-gov {
    background: rgba(255, 255, 255, 0.15);
    color: #ffffff;
    font-size: 9.5px;
    padding: 2px 8px;
    border-radius: 20px;
    border: 1px solid rgba(255, 255, 255, 0.3);
  }

  .header-title {
    font-size: 20px;
    font-weight: 800;
    margin: 0 0 3px 0;
    letter-spacing: -0.4px;
  }

  .header-subtitle {
    font-size: 12px;
    color: #93c5fd;
    margin: 0 0 8px 0;
    font-weight: 500;
  }

  .meta-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 6px;
    background: rgba(15, 23, 42, 0.45);
    padding: 6px 10px;
    border-radius: 4px;
    border: 1px solid rgba(255, 255, 255, 0.1);
  }

  .meta-item {
    font-size: 9.5px;
  }

  .meta-label {
    color: #94a3b8;
    text-transform: uppercase;
    font-size: 8px;
    font-weight: 700;
    letter-spacing: 0.5px;
  }

  .meta-value {
    color: #f8fafc;
    font-weight: 600;
    margin-top: 1px;
  }

  /* Section Styles */
  .section-header {
    display: flex;
    align-items: center;
    gap: 7px;
    border-bottom: 2px solid #0284c7;
    padding-bottom: 3px;
    margin: 14px 0 8px 0;
    page-break-after: avoid;
    break-after: avoid;
  }

  .section-badge {
    background: #0284c7;
    color: #ffffff;
    font-weight: 800;
    font-size: 10px;
    padding: 2px 6px;
    border-radius: 3px;
  }

  .section-title {
    font-size: 13.5px;
    font-weight: 800;
    color: #0f172a;
    margin: 0;
    text-transform: uppercase;
    letter-spacing: -0.2px;
  }

  /* Specification Summary Table */
  .spec-table {
    width: 100%;
    border-collapse: collapse;
    margin-bottom: 10px;
    font-size: 10px;
  }

  .spec-table th, .spec-table td {
    border: 1px solid #cbd5e1;
    padding: 4px 7px;
    text-align: left;
    line-height: 1.35;
  }

  .spec-table th {
    background: #f1f5f9;
    color: #0f172a;
    font-weight: 700;
    width: 18%;
  }

  .spec-table td {
    background: #ffffff;
    color: #334155;
  }

  /* Q&A Cards */
  .qa-card {
    border: 1px solid #e2e8f0;
    border-left: 3.5px solid #0284c7;
    background: #ffffff;
    border-radius: 4px;
    padding: 7px 10px;
    margin-bottom: 7px;
    page-break-inside: avoid;
    break-inside: avoid;
    box-shadow: 0 1px 2px rgba(0,0,0,0.02);
  }

  .qa-card.high-yield {
    border-left-color: #f59e0b;
    background: #fffdf5;
  }

  .qa-card.architecture {
    border-left-color: #6366f1;
    background: #fafaff;
  }

  .qa-card.governance {
    border-left-color: #059669;
    background: #f4fdf8;
  }

  .q-header {
    display: flex;
    align-items: flex-start;
    gap: 6px;
    margin-bottom: 3px;
  }

  .q-num {
    background: #0f172a;
    color: #ffffff;
    font-size: 9px;
    font-weight: 800;
    padding: 1px 4.5px;
    border-radius: 3px;
    flex-shrink: 0;
    margin-top: 1px;
  }

  .qa-card.high-yield .q-num {
    background: #d97706;
  }

  .qa-card.governance .q-num {
    background: #059669;
  }

  .qa-card.architecture .q-num {
    background: #4f46e5;
  }

  .q-text {
    font-size: 11.5px;
    font-weight: 750;
    color: #0f172a;
    line-height: 1.3;
  }

  .a-body {
    font-size: 10.5px;
    color: #334155;
    line-height: 1.38;
    padding-left: 20px;
  }

  .a-body p {
    margin: 0 0 2.5px 0;
  }

  .a-body ul {
    margin: 2px 0 2.5px 0;
    padding-left: 14px;
  }

  .a-body li {
    margin-bottom: 1.5px;
  }

  .bold {
    font-weight: 700;
    color: #0f172a;
  }

  .tag {
    display: inline-block;
    font-size: 8px;
    font-weight: 700;
    padding: 1px 4px;
    border-radius: 2.5px;
    margin-right: 3px;
    background: #e2e8f0;
    color: #475569;
  }

  .tag.canonical {
    background: #dcfce7;
    color: #166534;
    border: 1px solid #bbf7d0;
  }

  .tag.kpi {
    background: #fef3c7;
    color: #92400e;
    border: 1px solid #fde68a;
  }

  /* Formula Callout Box */
  .formula-box {
    background: #f8fafc;
    border: 1px solid #0284c7;
    border-radius: 4px;
    padding: 5px 8px;
    margin: 4px 0;
    font-family: "Courier New", Courier, monospace;
    font-size: 11px;
    font-weight: bold;
    color: #0369a1;
    text-align: center;
  }

  /* Diagram Containers */
  .diagram-container {
    background: #f8fafc;
    border: 1px solid #cbd5e1;
    border-radius: 5px;
    padding: 7px 9px;
    margin: 8px 0;
    page-break-inside: avoid;
    break-inside: avoid;
  }

  .diagram-title-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-bottom: 1px solid #e2e8f0;
    padding-bottom: 2.5px;
    margin-bottom: 4px;
  }

  .diagram-heading {
    font-size: 10px;
    font-weight: 800;
    color: #0f172a;
    text-transform: uppercase;
    letter-spacing: 0.3px;
  }

  .diagram-source {
    font-size: 8.5px;
    color: #64748b;
    font-weight: 600;
  }

  .diagram-caption {
    font-size: 9px;
    color: #64748b;
    font-style: italic;
    margin-top: 3px;
    line-height: 1.25;
  }

  /* Coach Notes Box */
  .coach-box {
    background: #fff7ed;
    border: 1.5px dashed #f97316;
    border-radius: 5px;
    padding: 10px 12px;
    margin-bottom: 10px;
    page-break-inside: avoid;
    break-inside: avoid;
  }

  .coach-title {
    font-size: 12px;
    font-weight: 800;
    color: #c2410c;
    margin: 0 0 4px 0;
  }

  .coach-body {
    font-size: 10.5px;
    color: #7c2d12;
    line-height: 1.4;
  }

  .coach-body ul {
    margin: 3px 0;
    padding-left: 15px;
  }

  .coach-body li {
    margin-bottom: 2px;
  }

  /* War Room Pitch Table */
  .pitch-table {
    width: 100%;
    border-collapse: collapse;
    margin-bottom: 10px;
    font-size: 10px;
  }

  .pitch-table th, .pitch-table td {
    border: 1px solid #cbd5e1;
    padding: 4px 7px;
    text-align: left;
    line-height: 1.35;
  }

  .pitch-table th {
    background: #0f172a;
    color: #ffffff;
    font-weight: 700;
  }

  .pitch-table td {
    background: #ffffff;
  }

  .pitch-table tr:nth-child(even) td {
    background: #f8fafc;
  }
</style>
</head>
<body>

<!-- HEADER BANNER -->
<div class="header-banner">
  <div class="banner-top">
    <span class="badge-ps">Smart India Hackathon 2026 · PS #26134</span>
    <span class="badge-gov">Government of Maharashtra · DSEEI / MSInS</span>
  </div>
  <h1 class="header-title">MahaSkills — SIH Panel Defense &amp; Comprehensive Q&amp;A Manual</h1>
  <div class="header-subtitle">Labour-Market Intelligence &amp; Autonomous Curriculum Alignment Platform across 36 Districts &amp; 417+ ITIs</div>
  
  <div class="meta-grid">
    <div class="meta-item">
      <div class="meta-label">Domain Scope</div>
      <div class="meta-value">36 Districts · 33 Sectors · 36 SSCs</div>
    </div>
    <div class="meta-item">
      <div class="meta-label">Architecture</div>
      <div class="meta-value">FastAPI + React 18 + PostgreSQL + ES</div>
    </div>
    <div class="meta-item">
      <div class="meta-label">Intelligence</div>
      <div class="meta-value">Quant Gap Engine (0.0–1.0) + RAG</div>
    </div>
    <div class="meta-item">
      <div class="meta-label">Compliance</div>
      <div class="meta-value">DPDP Act 2023 (HMAC-SHA256)</div>
    </div>
  </div>
</div>

<!-- EXECUTIVE SPECIFICATION SUMMARY -->
<table class="spec-table">
  <tr>
    <th>Problem Statement</th>
    <td><strong>PS 26134:</strong> Challenges in aligning skill development programs with industry requirements and emerging job market demands (Govt of Maharashtra, Department of Skills, Employment, Entrepreneurship & Innovation).</td>
  </tr>
  <tr>
    <th>Project Title</th>
    <td><strong>MahaSkills</strong> — Labour-Market Intelligence & Vocational Curriculum Alignment Platform.</td>
  </tr>
  <tr>
    <th>Core Innovation & USP</th>
    <td><strong>Continuous Closed-Loop Alignment:</strong> Live job demand signals (NCS, Naukri, LinkedIn) normalize skills via NLP, compute a multi-factor Gap Score (0.00–1.00), and auto-generate evidence dossiers for curriculum revisions and district training plans.</td>
  </tr>
  <tr>
    <th>Production Tech Stack</th>
    <td>
      <strong>Backend:</strong> Python 3.11, FastAPI (async), SQLAlchemy 2.0 Core/ORM, Celery 5.3, Redis 7.<br>
      <strong>Data & Search:</strong> PostgreSQL 16 (pgvector, PostGIS), Elasticsearch 8 (NLP synonyms & BM25), MinIO/S3.<br>
      <strong>Frontend:</strong> React 18, TypeScript (strict), Vite, Tailwind CSS, shadcn/ui, TanStack Query v5, Zustand, i18n (MR/HI/EN).<br>
      <strong>Pipelines & IAM:</strong> Apache Airflow 2.8 DAGs, Keycloak 24 OIDC (RS256 JWT, RBAC across 7 roles + ABAC district scoping).
    </td>
  </tr>
  <tr>
    <th>Target Users & Impact</th>
    <td>DSEEI / MSInS State Policy Makers, District Skill Officers, ITI Principals, SSCs, Employers, and Trainees. Target: +24% placement velocity and syllabus revision cycle cut from 180 days to 21 days.</td>
  </tr>
</table>

<!-- SECTION 1: STRATEGIC QUESTIONS -->
<div class="section-header">
  <span class="section-badge">Part 1</span>
  <h2 class="section-title">Strategic Alignment &amp; "Why This Project" (Q1 – Q9)</h2>
</div>

<!-- Q1 -->
<div class="qa-card">
  <div class="q-header">
    <span class="q-num">Q1</span>
    <span class="q-text">Why did you pick Problem Statement 26134 over others in Smart India Hackathon?</span>
  </div>
  <div class="a-body">
    <p><span class="bold">Executive Pitch:</span> Skill-job mismatch in Maharashtra is a measurable, massive economic drain. The state funds 417+ Government &amp; Private ITIs and thousands of PMKVY batches annually across 36 districts, yet state placement rates linger around 40–55% due to curriculum drift in high-growth industrial clusters (e.g., Pune Auto/EV, Chhatrapati Sambhaji Nagar Metallurgy, Nagpur Logistics).</p>
    <p><span class="bold">Technical Proof:</span> Existing government portals operate as static catalogs or passive vacancy boards. PS 26134 gave us the exact mandate to engineer an <strong>autonomous closed-loop feedback mechanism</strong> that translates live labour demand signals directly into quantified curriculum updates and district training plans with tangible KPIs: +24% placement velocity and reduction of syllabus revision cycle from 180 days to 21 days.</p>
  </div>
</div>

<!-- Q2 -->
<div class="qa-card high-yield">
  <div class="q-header">
    <span class="q-num">Q2</span>
    <span class="q-text">Why is MahaSkills superior to existing national portals like National Career Service (NCS) or Skill India Digital?</span>
  </div>
  <div class="a-body">
    <p><span class="bold">Executive Pitch:</span> NCS is a transaction-matching engine (candidate &harr; job post). Skill India Digital is an informational LMS directory. <em>Neither system feeds market signals backward into vocational education design.</em></p>
    <p><span class="bold">Technical Proof:</span></p>
    <ul>
      <li><strong>We Close the Loop:</strong> When hiring spikes for "Battery Management Systems" in Pune, MahaSkills flags that the local Electrician/Wireman ITI trade lacks EV module hours, calculates an Obsolescence Score (0.78), and generates an automated amendment dossier for SSC ratification.</li>
      <li><strong>District Granularity:</strong> Computes district-specific demand. Gadchiroli needs Agro-processing &amp; Forest-produce logistics, whereas Pune requires Mechatronics. National portals aggregate state averages that erase district realities.</li>
      <li><strong>Actionable Evidence Dossiers:</strong> Instead of raw charts, we assemble structured 12-month vacancy trends, hiring employer rosters, and interstate curriculum benchmarks for immediate sign-off.</li>
    </ul>
  </div>
</div>

<!-- DIAGRAM 1: CLOSED-LOOP WORKFLOW -->
<div class="diagram-container">
  <div class="diagram-title-row">
    <span class="diagram-heading">Diagram 1: End-to-End Closed-Loop Alignment Architecture</span>
    <span class="diagram-source">Source: docs/01-product/PRD.md &amp; docs/02-architecture/SYSTEM_ARCHITECTURE.md</span>
  </div>
  <svg width="100%" height="115" viewBox="0 0 740 115" xmlns="http://www.w3.org/2000/svg">
    <rect width="740" height="115" fill="#f8fafc" rx="5" />

    <!-- Step 1 -->
    <g transform="translate(10, 12)">
      <rect x="0" y="0" width="105" height="55" rx="4" fill="#0f172a" />
      <text x="52" y="14" fill="#38bdf8" font-size="8" font-weight="bold" text-anchor="middle">STEP 1: INGEST</text>
      <text x="52" y="26" fill="#ffffff" font-size="8.5" font-weight="bold" text-anchor="middle">Live Job Signals</text>
      <text x="52" y="37" fill="#94a3b8" font-size="7" text-anchor="middle">NCS, Naukri, LinkedIn</text>
      <text x="52" y="46" fill="#94a3b8" font-size="7" text-anchor="middle">Nightly Airflow Scrapers</text>
    </g>

    <path d="M 115 39 L 135 39" stroke="#0284c7" stroke-width="1.8" marker-end="url(#arrow-blue)" />

    <!-- Step 2 -->
    <g transform="translate(135, 12)">
      <rect x="0" y="0" width="105" height="55" rx="4" fill="#1e293b" />
      <text x="52" y="14" fill="#38bdf8" font-size="8" font-weight="bold" text-anchor="middle">STEP 2: MAP</text>
      <text x="52" y="26" fill="#ffffff" font-size="8.5" font-weight="bold" text-anchor="middle">NLP Taxonomy</text>
      <text x="52" y="37" fill="#94a3b8" font-size="7" text-anchor="middle">spaCy / Transformers</text>
      <text x="52" y="46" fill="#94a3b8" font-size="7" text-anchor="middle">2,200 NSQF Roles</text>
    </g>

    <path d="M 240 39 L 260 39" stroke="#0284c7" stroke-width="1.8" marker-end="url(#arrow-blue)" />

    <!-- Step 3 -->
    <g transform="translate(260, 12)">
      <rect x="0" y="0" width="105" height="55" rx="4" fill="#0369a1" />
      <text x="52" y="14" fill="#bae6fd" font-size="8" font-weight="bold" text-anchor="middle">STEP 3: SCORE</text>
      <text x="52" y="26" fill="#ffffff" font-size="8.5" font-weight="bold" text-anchor="middle">Quant Gap Engine</text>
      <text x="52" y="37" fill="#e0f2fe" font-size="7" text-anchor="middle">0.00 – 1.00 Index</text>
      <text x="52" y="46" fill="#e0f2fe" font-size="7" text-anchor="middle">Oversupply Detect</text>
    </g>

    <path d="M 365 39 L 385 39" stroke="#0284c7" stroke-width="1.8" marker-end="url(#arrow-blue)" />

    <!-- Step 4 -->
    <g transform="translate(385, 12)">
      <rect x="0" y="0" width="105" height="55" rx="4" fill="#0284c7" />
      <text x="52" y="14" fill="#e0f2fe" font-size="8" font-weight="bold" text-anchor="middle">STEP 4: DOSSIER</text>
      <text x="52" y="26" fill="#ffffff" font-size="8.5" font-weight="bold" text-anchor="middle">Curriculum Rec</text>
      <text x="52" y="37" fill="#f0f9ff" font-size="7" text-anchor="middle">12-Mo Evidence Graph</text>
      <text x="52" y="46" fill="#f0f9ff" font-size="7" text-anchor="middle">Auto-Draft Revisions</text>
    </g>

    <path d="M 490 39 L 510 39" stroke="#0284c7" stroke-width="1.8" marker-end="url(#arrow-blue)" />

    <!-- Step 5 -->
    <g transform="translate(510, 12)">
      <rect x="0" y="0" width="105" height="55" rx="4" fill="#047857" />
      <text x="52" y="14" fill="#a7f3d0" font-size="8" font-weight="bold" text-anchor="middle">STEP 5: RATIFY</text>
      <text x="52" y="26" fill="#ffffff" font-size="8.5" font-weight="bold" text-anchor="middle">SSC &amp; DSEEI</text>
      <text x="52" y="37" fill="#ecfdf5" font-size="7" text-anchor="middle">State Review Machine</text>
      <text x="52" y="46" fill="#ecfdf5" font-size="7" text-anchor="middle">Secy Digital Sign-off</text>
    </g>

    <path d="M 615 39 L 635 39" stroke="#0284c7" stroke-width="1.8" marker-end="url(#arrow-blue)" />

    <!-- Step 6 -->
    <g transform="translate(635, 12)">
      <rect x="0" y="0" width="95" height="55" rx="4" fill="#065f46" />
      <text x="47" y="14" fill="#a7f3d0" font-size="8" font-weight="bold" text-anchor="middle">STEP 6: ACT</text>
      <text x="47" y="26" fill="#ffffff" font-size="8.5" font-weight="bold" text-anchor="middle">District Plans</text>
      <text x="47" y="37" fill="#ecfdf5" font-size="7" text-anchor="middle">ITI Seat Sanctions</text>
      <text x="47" y="46" fill="#ecfdf5" font-size="7" text-anchor="middle">Capex Allocations</text>
    </g>

    <!-- Feedback loop arrow back -->
    <path d="M 682 67 L 682 85 L 62 85 L 62 67" stroke="#f59e0b" stroke-width="1.5" stroke-dasharray="3,2" fill="none" marker-end="url(#arrow-amber)" />
    <text x="370" y="99" fill="#b45309" font-size="7.5" font-weight="bold" text-anchor="middle">&larr;&larr;&larr; Monthly ITI Placement Returns Validate Outcome Uplift &amp; Recalibrate Scoring Weights (Continuous Feedback Loop) &larr;&larr;&larr;</text>

    <!-- Arrow markers -->
    <defs>
      <marker id="arrow-blue" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="4" markerHeight="4" orient="auto-start-reverse">
        <path d="M 0 1 L 10 5 L 0 9 z" fill="#0284c7"/>
      </marker>
      <marker id="arrow-amber" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="4" markerHeight="4" orient="auto-start-reverse">
        <path d="M 0 1 L 10 5 L 0 9 z" fill="#f59e0b"/>
      </marker>
    </defs>
  </svg>
  <div class="diagram-caption">The closed-loop lifecycle: live demand data is parsed, scored, synthesized into curriculum changes, sanctioned by SSC/DSEEI, executed in district ITI plans, and continually evaluated via monthly placement returns.</div>
</div>

<!-- Q3 -->
<div class="qa-card">
  <div class="q-header">
    <span class="q-num">Q3</span>
    <span class="q-text">What is the real-world scale and socio-economic impact in Maharashtra?</span>
  </div>
  <div class="a-body">
    <p><span class="bold">Scale:</span> 36 districts, 417+ ITIs, 1,50,000+ enrolled trainees per annum, across 33 economic sectors. Even a modest 10% alignment improvement redirects 15,000+ youth annually from saturated, low-wage jobs into high-growth manufacturing and tech trades.</p>
    <p><span class="bold">Fiscal Efficiency:</span> Eliminates wasteful capital expenditure on obsolete workshop machinery (e.g., manual lathes vs CNC) by coupling our automated ITI Equipment Gap Auditor directly to the DSEEI modernization budget allocations.</p>
  </div>
</div>

<!-- Q4 -->
<div class="qa-card">
  <div class="q-header">
    <span class="q-num">Q4</span>
    <span class="q-text">Why should this project win over other teams building dashboards or job portals?</span>
  </div>
  <div class="a-body">
    <p><span class="bold">Deliverables, Not Dashboards:</span> Competing teams will present either a job-board clone (NCS already exists) or a generic PowerBI-style analytics dashboard. Dashboards do not solve problems—they simply show them. MahaSkills produces <em>concrete administrative artifacts</em>: (1) District Annual Training Plans, (2) NCVET-compliant Curriculum Modification Dossiers, (3) Automated ITI Modernization Capex Budgets, and (4) RAG-grounded natural language guidance for field officers.</p>
  </div>
</div>

<!-- Q5 -->
<div class="qa-card high-yield">
  <div class="q-header">
    <span class="q-num">Q5</span>
    <span class="q-text">What if a similar commercial analytics tool exists in the private sector?</span>
  </div>
  <div class="a-body">
    <p><span class="bold">Market Reality:</span> Tools like Burning Glass / Lightcast provide macroeconomic LMI reports to corporate HR for $50k+/year. They have zero integration with Indian vocational governance (NSQF levels, NOS units, ITI trade structures, NCVET review bodies, or Mahaswayam SSO).</p>
    <p>MahaSkills is custom-engineered for the <strong>DSEEI statutory workflow</strong>. It maps job roles directly to 2,200 NSQF trade codes and incorporates the exact administrative state machine (Draft &rarr; SSC Review &rarr; DSEEI Joint Secretary Sanction &rarr; Gazette Publication).</p>
  </div>
</div>

<!-- Q6 -->
<div class="qa-card">
  <div class="q-header">
    <span class="q-num">Q6</span>
    <span class="q-text">Is this just a dashboard with AI branding, or is there genuine core innovation?</span>
  </div>
  <div class="a-body">
    <p><span class="bold">Our Core Algorithmic IP:</span> The innovation lies in two proprietary engines:</p>
    <ul>
      <li><strong>Mathematical Gap Scoring Engine:</strong> Computes a standardized 0.00–1.00 index per course/district evaluating: (1) 12-month vacancy growth velocity, (2) wage premiums over minimum wage, (3) curriculum drift via NLP n-gram cosine distance, and (4) 4-quarter placement velocities.</li>
      <li><strong>Semantic Taxonomy Normalization:</strong> Ingests unstructured, chaotic job listings (&ldquo;React Ninja&rdquo;, &ldquo;CNC Master&rdquo;) and maps them to NSQF standardized competence units using spaCy tokenization, Sentence-Transformer embeddings, and Elasticsearch BM25 synonym indices.</li>
    </ul>
  </div>
</div>

<!-- Q7 -->
<div class="qa-card">
  <div class="q-header">
    <span class="q-num">Q7</span>
    <span class="q-text">How did you scope the MVP for the hackathon without overpromising state-wide coverage?</span>
  </div>
  <div class="a-body">
    <p><span class="bold">Pragmatic Pilot Scope:</span> We focused our MVP demonstration on <strong>3 high-impact pilot sectors</strong> (Automotive/EV, IT-ITES, and Green Energy/Solar) across <strong>5 priority districts</strong> (Pune, Nagpur, Nashik, Aurangabad, and Gadchiroli). The architecture is fully horizontally scalable; expanding to all 36 districts requires zero code refactoring—merely running Airflow scraping seeds across additional district geo-filters.</p>
  </div>
</div>

<!-- Q8 -->
<div class="qa-card high-yield">
  <div class="q-header">
    <span class="q-num">Q8</span>
    <span class="q-text">How can your system work if the government hasn't provided official placement datasets yet?</span>
  </div>
  <div class="a-body">
    <p><span class="bold">Two-Tier Data Strategy:</span></p>
    <ul>
      <li><strong>Open & Scraped Foundation (Phase 1):</strong> Uses public NCS APIs, Open Government Data (PMKVY placement releases), and live scraped public job boards (Naukri, Indeed, LinkedIn) with proxy rotation.</li>
      <li><strong>Standardized Ingestion Schema:</strong> We published an exact, production-ready ITI Placement CSV Template (8 columns: `candidate_id`, `course_code`, `batch_year`, `placed`, `monthly_salary`, etc.). Any ITI or state portal can ingest records instantly. For the SIH demo, we synthesized 15,000 statistically accurate candidate records matching DSEEI historical distributions.</li>
    </ul>
  </div>
</div>

<!-- Q9 -->
<div class="qa-card high-yield">
  <div class="q-header">
    <span class="q-num">Q9</span>
    <span class="q-text">Isn't the natural language chatbot just an off-the-shelf ChatGPT wrapper?</span>
  </div>
  <div class="a-body">
    <p><span class="bold">No—It is a Strict Retrieval-Augmented Generation (RAG) Architecture:</span></p>
    <ul>
      <li><strong>Grounding over Generation:</strong> A standard LLM hallucinates non-existent course codes and outdated placement figures. MahaSkills passes user queries through a dense vector search over our PostgreSQL/pgvector database (course syllabi, vacancy trends, verified placement ratios).</li>
      <li><strong>Immutable Citations:</strong> The LLM prompt enforces a strict rule: <em>&ldquo;Answer exclusively from the retrieved SQL/vector context. Every statistic must reference a specific Course ID, District ID, or Batch ID. If context is absent, refuse to answer.&rdquo;</em></li>
      <li><strong>Accessibility Layer:</strong> Field officers in rural talukas can query in spoken or written Marathi: <em>&ldquo;नागपूर जिल्ह्यात सोलर तंत्रज्ञानासाठी कोणते कोर्सेस अपडेट करावे लागतील?&rdquo;</em> and receive verified, source-cited recommendations.</li>
    </ul>
  </div>
</div>

<!-- SECTION 2: TECHNICAL ARCHITECTURE -->
<div class="section-header">
  <span class="section-badge">Part 2</span>
  <h2 class="section-title">Technical Deep Dive &amp; Engineering Decisions (Q10 – Q23)</h2>
</div>

<!-- Q10 -->
<div class="qa-card architecture">
  <div class="q-header">
    <span class="q-num">Q10</span>
    <span class="q-text">Walk me through your system architecture and why you chose it.</span>
  </div>
  <div class="a-body">
    <p><span class="bold">Three-Tier Decoupled Architecture:</span></p>
    <ul>
      <li><strong>Presentation Tier:</strong> React 18 SPA built with TypeScript (strict), Vite, Tailwind, and shadcn/ui. State managed via TanStack Query v5 (server cache) and Zustand (client state). Fully localized into Marathi, Hindi, and English.</li>
      <li><strong>API &amp; Application Tier:</strong> Python 3.11 FastAPI asynchronous services behind Nginx/Kong reverse proxy. FastAPI provides native OpenAPI contract generation and async IO for non-blocking IO operations. SQLAlchemy 2.0 ORM with asyncpg connection pools.</li>
      <li><strong>Data &amp; Intelligence Tier:</strong> PostgreSQL 16 (authoritative store with pgvector for embeddings and PostGIS for district spatial boundaries), Elasticsearch 8 (BM25 search and fuzzy NLP synonym indexing), Redis 7 (caching and Celery task broker), MinIO/S3 (raw CSV and dossier archive).</li>
      <li><strong>Pipeline Tier:</strong> Apache Airflow 2.8 orchestrating isolated daily scraping, taxonomy synchronization, and weekly gap computation DAGs.</li>
    </ul>
  </div>
</div>

<!-- DIAGRAM 2: C4 SYSTEM CONTEXT -->
<div class="diagram-container">
  <div class="diagram-title-row">
    <span class="diagram-heading">Diagram 2: C4 Level 1 System Context Architecture</span>
    <span class="diagram-source">Source: docs/02-architecture/SYSTEM_ARCHITECTURE.md</span>
  </div>
  <svg width="100%" height="150" viewBox="0 0 740 150" xmlns="http://www.w3.org/2000/svg">
    <rect width="740" height="150" fill="#f8fafc" rx="5" />

    <!-- External Actors Top -->
    <g transform="translate(10, 8)">
      <rect x="0" y="0" width="130" height="34" rx="4" fill="#1e293b" />
      <text x="65" y="14" fill="#ffffff" font-size="8.5" font-weight="bold" text-anchor="middle">Candidate / Trainee</text>
      <text x="65" y="25" fill="#94a3b8" font-size="7" text-anchor="middle">Pathway Quiz & SSO</text>
    </g>

    <g transform="translate(155, 8)">
      <rect x="0" y="0" width="135" height="34" rx="4" fill="#1e293b" />
      <text x="67" y="14" fill="#ffffff" font-size="8.5" font-weight="bold" text-anchor="middle">Govt Official (DSEEI)</text>
      <text x="67" y="25" fill="#94a3b8" font-size="7" text-anchor="middle">Policy & District Plans</text>
    </g>

    <g transform="translate(305, 8)">
      <rect x="0" y="0" width="130" height="34" rx="4" fill="#1e293b" />
      <text x="65" y="14" fill="#ffffff" font-size="8.5" font-weight="bold" text-anchor="middle">ITI Principal (417+)</text>
      <text x="65" y="25" fill="#94a3b8" font-size="7" text-anchor="middle">Placement CSV Returns</text>
    </g>

    <g transform="translate(450, 8)">
      <rect x="0" y="0" width="135" height="34" rx="4" fill="#1e293b" />
      <text x="67" y="14" fill="#ffffff" font-size="8.5" font-weight="bold" text-anchor="middle">Industry / Employer</text>
      <text x="67" y="25" fill="#94a3b8" font-size="7" text-anchor="middle">Hiring Demand Signals</text>
    </g>

    <g transform="translate(600, 8)">
      <rect x="0" y="0" width="130" height="34" rx="4" fill="#1e293b" />
      <text x="65" y="14" fill="#ffffff" font-size="8.5" font-weight="bold" text-anchor="middle">SSC Tech Reviewer</text>
      <text x="65" y="25" fill="#94a3b8" font-size="7" text-anchor="middle">Curriculum Dossiers</text>
    </g>

    <!-- Connectors Top to Core -->
    <path d="M 75 42 L 75 54 L 370 54 L 370 62" stroke="#0284c7" stroke-width="1.2" fill="none" />
    <path d="M 222 42 L 222 54" stroke="#0284c7" stroke-width="1.2" fill="none" />
    <path d="M 370 42 L 370 62" stroke="#0284c7" stroke-width="1.2" fill="none" />
    <path d="M 517 42 L 517 54" stroke="#0284c7" stroke-width="1.2" fill="none" />
    <path d="M 665 42 L 665 54 L 370 54" stroke="#0284c7" stroke-width="1.2" fill="none" />

    <!-- Center Core System -->
    <g transform="translate(180, 60)">
      <rect x="0" y="0" width="380" height="36" rx="4" fill="#0284c7" stroke="#0369a1" stroke-width="1" />
      <text x="190" y="15" fill="#ffffff" font-size="11" font-weight="800" text-anchor="middle">MahaSkills Platform Core</text>
      <text x="190" y="27" fill="#e0f2fe" font-size="7.5" text-anchor="middle">FastAPI REST /v1 · Gap Scoring Engine · Celery Workers · React 18 UI</text>
    </g>

    <!-- Connectors Core to Bottom External Systems -->
    <path d="M 370 96 L 370 106" stroke="#059669" stroke-width="1.2" fill="none" />
    <path d="M 80 106 L 660 106" stroke="#059669" stroke-width="1.2" fill="none" />
    <path d="M 80 106 L 80 114" stroke="#059669" stroke-width="1.2" fill="none" />
    <path d="M 225 106 L 225 114" stroke="#059669" stroke-width="1.2" fill="none" />
    <path d="M 370 106 L 370 114" stroke="#059669" stroke-width="1.2" fill="none" />
    <path d="M 515 106 L 515 114" stroke="#059669" stroke-width="1.2" fill="none" />
    <path d="M 660 106 L 660 114" stroke="#059669" stroke-width="1.2" fill="none" />

    <!-- External Systems Bottom -->
    <g transform="translate(15, 114)">
      <rect x="0" y="0" width="130" height="30" rx="3" fill="#065f46" />
      <text x="65" y="13" fill="#ffffff" font-size="8" font-weight="bold" text-anchor="middle">Keycloak 24 IAM</text>
      <text x="65" y="23" fill="#a7f3d0" font-size="6.5" text-anchor="middle">OIDC / RS256 / RBAC</text>
    </g>

    <g transform="translate(160, 114)">
      <rect x="0" y="0" width="130" height="30" rx="3" fill="#065f46" />
      <text x="65" y="13" fill="#ffffff" font-size="8" font-weight="bold" text-anchor="middle">Mahaswayam Portal</text>
      <text x="65" y="23" fill="#a7f3d0" font-size="6.5" text-anchor="middle">State Training SSO</text>
    </g>

    <g transform="translate(305, 114)">
      <rect x="0" y="0" width="130" height="30" rx="3" fill="#065f46" />
      <text x="65" y="13" fill="#ffffff" font-size="8" font-weight="bold" text-anchor="middle">NCS Open API</text>
      <text x="65" y="23" fill="#a7f3d0" font-size="6.5" text-anchor="middle">National Vacancies</text>
    </g>

    <g transform="translate(450, 114)">
      <rect x="0" y="0" width="130" height="30" rx="3" fill="#065f46" />
      <text x="65" y="13" fill="#ffffff" font-size="8" font-weight="bold" text-anchor="middle">Job Aggregators</text>
      <text x="65" y="23" fill="#a7f3d0" font-size="6.5" text-anchor="middle">Naukri / LinkedIn / Indeed</text>
    </g>

    <g transform="translate(595, 114)">
      <rect x="0" y="0" width="130" height="30" rx="3" fill="#065f46" />
      <text x="65" y="13" fill="#ffffff" font-size="8" font-weight="bold" text-anchor="middle">NCVET / NSDC</text>
      <text x="65" y="23" fill="#a7f3d0" font-size="6.5" text-anchor="middle">National Qual Registers</text>
    </g>
  </svg>
  <div class="diagram-caption">C4 Level 1 context model: Ingesting high-frequency vacancy feeds &amp; institutional returns into MahaSkills, feeding policy makers, ITIs, and SSC reviewers while federating identity via Keycloak and Mahaswayam.</div>
</div>

<!-- Q11 -->
<div class="qa-card architecture">
  <div class="q-header">
    <span class="q-num">Q11</span>
    <span class="q-text">How do you handle data security, candidate privacy, and employer data governance?</span>
  </div>
  <div class="a-body">
    <p><span class="bold">DPDP Act 2023 Strict Conformance:</span> Trainee privacy is guaranteed via a streaming HMAC-SHA256 pseudonymization pipeline. Student roll numbers and Aadhaar details are never written to disk. The HMAC salt (`DPDP_TENANT_SALT`) is maintained in an isolated CloudHSM enclave. Candidate records become non-reversible hex hashes.</p>
    <p><span class="bold">Zero Employer Leakage:</span> Private hiring requirements and salary bids are aggregated at the district/sector level before appearing on public dashboards. Competitors cannot inspect proprietary hiring strategies of individual enterprises.</p>
  </div>
</div>

<!-- DIAGRAM 3: DPDP ACT PSEUDONYMIZATION -->
<div class="diagram-container">
  <div class="diagram-title-row">
    <span class="diagram-heading">Diagram 3: DPDP Act 2023 Cryptographic Pseudonymization Pipeline</span>
    <span class="diagram-source">Source: docs/05-security/DATA_PRIVACY.md</span>
  </div>
  <svg width="100%" height="70" viewBox="0 0 740 70" xmlns="http://www.w3.org/2000/svg">
    <rect width="740" height="70" fill="#f8fafc" rx="5" />

    <g transform="translate(15, 12)">
      <rect x="0" y="0" width="135" height="44" rx="4" fill="#dc2626" />
      <text x="67" y="16" fill="#ffffff" font-size="8.5" font-weight="bold" text-anchor="middle">Raw Placement CSV</text>
      <text x="67" y="27" fill="#fecaca" font-size="7.5" text-anchor="middle">student_roll_no: MH-4029</text>
      <text x="67" y="37" fill="#fecaca" font-size="7" text-anchor="middle">Contains Direct PII</text>
    </g>

    <path d="M 150 34 L 180 34" stroke="#dc2626" stroke-width="1.8" marker-end="url(#arrow-red)" />

    <g transform="translate(180, 12)">
      <rect x="0" y="0" width="160" height="44" rx="4" fill="#1e293b" />
      <text x="80" y="15" fill="#38bdf8" font-size="8.5" font-weight="bold" text-anchor="middle">STREAMING PARSER</text>
      <text x="80" y="27" fill="#ffffff" font-size="8.5" font-weight="bold" text-anchor="middle">Celery Ingestion Worker</text>
      <text x="80" y="37" fill="#94a3b8" font-size="7" text-anchor="middle">In-Memory (No Disk Write)</text>
    </g>

    <path d="M 340 34 L 370 34" stroke="#0284c7" stroke-width="1.8" marker-end="url(#arrow-blue)" />

    <g transform="translate(370, 12)">
      <rect x="0" y="0" width="170" height="44" rx="4" fill="#0284c7" />
      <text x="85" y="15" fill="#e0f2fe" font-size="8.5" font-weight="bold" text-anchor="middle">CRYPTO ENCLAVE (HSM)</text>
      <text x="85" y="27" fill="#ffffff" font-size="8.5" font-weight="bold" text-anchor="middle">HMAC-SHA256 Engine</text>
      <text x="85" y="37" fill="#e0f2fe" font-size="7" text-anchor="middle">Salt: DPDP_TENANT_SALT</text>
    </g>

    <path d="M 540 34 L 570 34" stroke="#059669" stroke-width="1.8" marker-end="url(#arrow-green)" />

    <g transform="translate(570, 12)">
      <rect x="0" y="0" width="155" height="44" rx="4" fill="#059669" />
      <text x="77" y="15" fill="#a7f3d0" font-size="8.5" font-weight="bold" text-anchor="middle">SECURE RELATIONAL DB</text>
      <text x="77" y="27" fill="#ffffff" font-size="8.5" font-weight="bold" text-anchor="middle">candidate_hash</text>
      <text x="77" y="37" fill="#dcfce7" font-size="7" text-anchor="middle">e3b0c442... (Non-reversible)</text>
    </g>

    <defs>
      <marker id="arrow-red" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="4" markerHeight="4" orient="auto-start-reverse">
        <path d="M 0 1 L 10 5 L 0 9 z" fill="#dc2626"/>
      </marker>
      <marker id="arrow-green" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="4" markerHeight="4" orient="auto-start-reverse">
        <path d="M 0 1 L 10 5 L 0 9 z" fill="#059669"/>
      </marker>
    </defs>
  </svg>
  <div class="diagram-caption">Data privacy pipeline: Raw student roll numbers are converted to irreversible cryptographic hashes in volatile memory prior to database insertion. Raw PII touches zero disk blocks.</div>
</div>

<!-- Q12 -->
<div class="qa-card">
  <div class="q-header">
    <span class="q-num">Q12</span>
    <span class="q-text">What happens at 10x or 100x user load — how does your architecture scale?</span>
  </div>
  <div class="a-body">
    <p><span class="bold">Horizontal Stateless Scaling:</span></p>
    <ul>
      <li><strong>Frontend &amp; API:</strong> The React bundle is served via CloudFront CDN. FastAPI API instances run in stateless Docker containers orchestrated via Kubernetes / AWS ECS with HPA (Horizontal Pod Autoscaler) triggered at 70% CPU.</li>
      <li><strong>Database &amp; Read Scaling:</strong> PostgreSQL 16 utilizes read replicas behind an HAProxy pool. 85% of dashboard queries hit Redis 7 cache with 15-minute TTLs, since district macroeconomic trends do not shift second-by-second.</li>
      <li><strong>Scraping &amp; Ingestion Isolation:</strong> Heavy NLP and scraping tasks run asynchronously via Celery worker pools across spot instances, completely isolated from user-facing REST threads.</li>
    </ul>
  </div>
</div>

<!-- Q13 -->
<div class="qa-card">
  <div class="q-header">
    <span class="q-num">Q13</span>
    <span class="q-text">What are your failure modes if job-posting data is noisy or the NLP model misclassifies a skill?</span>
  </div>
  <div class="a-body">
    <p><span class="bold">Multi-Layer Defensive Guardrails:</span></p>
    <ul>
      <li><strong>Confidence Thresholding:</strong> Extracted skill n-grams with cosine similarity &lt; 0.72 against the canonical taxonomy are routed to an administrative <em>Unmapped Skills Quarantine Queue</em> rather than silently polluting scoring weights.</li>
      <li><strong>Human-in-the-Loop Synonym Table:</strong> System administrators and SSC reviewers can map unclassified tokens directly from the UI without model retraining.</li>
      <li><strong>Anomaly Detection:</strong> If a scraper reports a &gt;300% single-day spike in job postings for a single company, an alert triggers a circuit-breaker to halt ingestion, preventing spam from biasing district numbers.</li>
    </ul>
  </div>
</div>

<!-- DIAGRAM 4: AIRFLOW INGESTION PIPELINES -->
<div class="diagram-container">
  <div class="diagram-title-row">
    <span class="diagram-heading">Diagram 4: Automated Ingestion &amp; Pipeline Orchestration (Apache Airflow)</span>
    <span class="diagram-source">Source: docs/06-data/DATA_INGESTION.md</span>
  </div>
  <svg width="100%" height="75" viewBox="0 0 740 75" xmlns="http://www.w3.org/2000/svg">
    <rect width="740" height="75" fill="#f8fafc" rx="5" />

    <!-- Sources -->
    <g transform="translate(15, 10)">
      <rect x="0" y="0" width="165" height="52" rx="4" fill="#1e293b" />
      <text x="82" y="15" fill="#38bdf8" font-size="8" font-weight="bold" text-anchor="middle">EXTERNAL DATA FEEDS</text>
      <text x="82" y="26" fill="#ffffff" font-size="7.5" text-anchor="middle">• NCS Open API / Job Portals</text>
      <text x="82" y="36" fill="#ffffff" font-size="7.5" text-anchor="middle">• Monthly ITI Placement CSVs</text>
      <text x="82" y="46" fill="#ffffff" font-size="7.5" text-anchor="middle">• Employer Skill Demand Forms</text>
    </g>

    <path d="M 180 36 L 210 36" stroke="#0284c7" stroke-width="1.8" marker-end="url(#arrow-blue)" />

    <!-- Airflow DAGs -->
    <g transform="translate(210, 10)">
      <rect x="0" y="0" width="280" height="52" rx="4" fill="#0369a1" />
      <text x="140" y="15" fill="#bae6fd" font-size="8" font-weight="bold" text-anchor="middle">AIRFLOW 2.8 PIPELINE ORCHESTRATION</text>
      <text x="140" y="26" fill="#ffffff" font-size="7.5" text-anchor="middle">DAG 1: lmi_nightly_job_scraping (02:00 IST · SLA &le; 120m)</text>
      <text x="140" y="36" fill="#ffffff" font-size="7.5" text-anchor="middle">DAG 2: placement_validation_worker (Streaming Celery)</text>
      <text x="140" y="46" fill="#ffffff" font-size="7.5" text-anchor="middle">DAG 3: taxonomy_nlp_enrichment (04:00 IST · SLA &le; 60m)</text>
    </g>

    <path d="M 490 36 L 520 36" stroke="#059669" stroke-width="1.8" marker-end="url(#arrow-green)" />

    <!-- Storage Targets -->
    <g transform="translate(520, 10)">
      <rect x="0" y="0" width="205" height="52" rx="4" fill="#047857" />
      <text x="102" y="15" fill="#a7f3d0" font-size="8" font-weight="bold" text-anchor="middle">STORAGE &amp; ANALYTICS</text>
      <text x="102" y="26" fill="#ffffff" font-size="7.5" text-anchor="middle">• MinIO/S3 (Raw Dumps &amp; Dossiers)</text>
      <text x="102" y="36" fill="#ffffff" font-size="7.5" text-anchor="middle">• PostgreSQL 16 (Relational &amp; Vector)</text>
      <text x="102" y="46" fill="#ffffff" font-size="7.5" text-anchor="middle">• Elasticsearch 8 (BM25 Synonyms)</text>
    </g>
  </svg>
  <div class="diagram-caption">Data pipeline architecture: Scheduled Airflow DAGs isolate batch processing and scraping workloads, guaranteeing zero latency interference with the live user-facing FastAPI application.</div>
</div>

<!-- Q14 -->
<div class="qa-card">
  <div class="q-header">
    <span class="q-num">Q14</span>
    <span class="q-text">Why FastAPI/Python over a Java/Spring Boot or Node.js backend?</span>
  </div>
  <div class="a-body">
    <p><span class="bold">Ecosystem Synergy &amp; Async Performance:</span></p>
    <ul>
      <li><strong>Zero-Overhead ML Integration:</strong> The core value of MahaSkills is data modeling, NLP tokenization (spaCy, scikit-learn, transformers), and mathematical gap scoring. Building in Python eliminates fragile cross-process IPC or microservice serialization overhead.</li>
      <li><strong>Modern Async IO:</strong> FastAPI runs on Starlette and Uvicorn with `async`/`await` primitives, achieving throughput comparable to Go/Node while generating automated OpenAPI v3 documentation for state IT audit compliance.</li>
    </ul>
  </div>
</div>

<!-- Q15 -->
<div class="qa-card">
  <div class="q-header">
    <span class="q-num">Q15</span>
    <span class="q-text">Why use Elasticsearch instead of just PostgreSQL Full-Text Search?</span>
  </div>
  <div class="a-body">
    <p><span class="bold">Purpose-Built Fuzzy Relevance &amp; Synonym Expansion:</span> While PostgreSQL 16 handles relational integrity, transactional ACID safety, and vector queries (`pgvector`), it degrades on multi-token typo tolerance and hierarchical synonym trees at scale. Elasticsearch 8 provides native BM25 relevance scoring, customized Marathi stemmers, and real-time query-time synonym expansion across 15,000+ technical skill descriptors.</p>
  </div>
</div>

<!-- Q16 -->
<div class="qa-card high-yield">
  <div class="q-header">
    <span class="q-num">Q16</span>
    <span class="q-text">Walk me through the RAG pipeline — how does the assistant answer without hallucinating?</span>
  </div>
  <div class="a-body">
    <p><span class="bold">Deterministic 4-Stage Retrieval Pipeline:</span></p>
    <ul>
      <li><strong>1. Intent & Filter Extraction:</strong> The query is analyzed for entity filters (`district="Nagpur"`, `sector="EV"`, `nsqf_level=4`).</li>
      <li><strong>2. Hybrid Retrieval:</strong> Dense vector retrieval via `pgvector` (using `sentence-transformers/all-MiniLM-L6-v2`) combined with sparse relational SQL filters fetching verified records: course IDs, syllabus learning outcomes, 12-month vacancy statistics, and placement percentages.</li>
      <li><strong>3. Context Injection:</strong> A structured context payload is passed into the LLM system prompt: <em>&ldquo;You are an assistant for DSEEI Maharashtra. Use solely the provided data blocks. Every claim must cite the specific course code and batch year.&rdquo;</em></li>
      <li><strong>4. Citation Verification:</strong> A post-generation regex pass validates that every citation string in the generated response matches an actual record ID retrieved in step 2.</li>
    </ul>
  </div>
</div>

<!-- Q17 -->
<div class="qa-card high-yield">
  <div class="q-header">
    <span class="q-num">Q17</span>
    <span class="q-text">What stops the LLM from fabricating curriculum recommendations that mislead officials?</span>
  </div>
  <div class="a-body">
    <p><span class="bold">Three Invariant Guardrails:</span></p>
    <ul>
      <li><strong>Mandatory Refusal Directive:</strong> If the vector retrieval similarity score is below threshold (&lt; 0.65) or if fewer than 5 sample job records exist for a district, the model returns a standardized fallback: <em>&ldquo;Insufficient verified data available for this district-sector combination.&rdquo;</em></li>
      <li><strong>UI Citation Badges:</strong> The frontend renders interactive citation chips next to every numerical claim. Clicking a chip opens the underlying data modal showing the exact job posting IDs and ITI placement batch records.</li>
      <li><strong>Recommendation Isolation:</strong> Official curriculum modifications <em>cannot be initiated from chat</em>. The chat is strictly an advisory query interface; official changes require the formal, deterministic <strong>Curriculum Recommendation Workflow Engine</strong>.</li>
    </ul>
  </div>
</div>

<!-- DIAGRAM 5: WORKFLOW STATE MACHINE -->
<div class="diagram-container">
  <div class="diagram-title-row">
    <span class="diagram-heading">Diagram 5: Curriculum Recommendation Governance State Machine</span>
    <span class="diagram-source">Source: docs/02-architecture/BACKEND_ARCHITECTURE.md</span>
  </div>
  <svg width="100%" height="70" viewBox="0 0 740 70" xmlns="http://www.w3.org/2000/svg">
    <rect width="740" height="70" fill="#f8fafc" rx="5" />

    <!-- DRAFT -->
    <g transform="translate(10, 14)">
      <rect x="0" y="0" width="115" height="40" rx="4" fill="#475569" />
      <text x="57" y="16" fill="#e2e8f0" font-size="8" font-weight="bold" text-anchor="middle">STATUS 1</text>
      <text x="57" y="27" fill="#ffffff" font-size="9.5" font-weight="bold" text-anchor="middle">DRAFT</text>
      <text x="57" y="36" fill="#cbd5e1" font-size="6.5" text-anchor="middle">Persistent Gap &gt; 60</text>
    </g>

    <path d="M 125 34 L 155 34" stroke="#0284c7" stroke-width="1.8" marker-end="url(#arrow-blue)" />

    <!-- UNDER_SSC_REVIEW -->
    <g transform="translate(155, 14)">
      <rect x="0" y="0" width="145" height="40" rx="4" fill="#0369a1" />
      <text x="72" y="16" fill="#bae6fd" font-size="8" font-weight="bold" text-anchor="middle">STATUS 2</text>
      <text x="72" y="27" fill="#ffffff" font-size="9.5" font-weight="bold" text-anchor="middle">UNDER_SSC_REVIEW</text>
      <text x="72" y="36" fill="#e0f2fe" font-size="6.5" text-anchor="middle">Technical Dossier Review</text>
    </g>

    <path d="M 300 34 L 330 34" stroke="#0284c7" stroke-width="1.8" marker-end="url(#arrow-blue)" />

    <!-- SSC_APPROVED -->
    <g transform="translate(330, 14)">
      <rect x="0" y="0" width="135" height="40" rx="4" fill="#0284c7" />
      <text x="67" y="16" fill="#e0f2fe" font-size="8" font-weight="bold" text-anchor="middle">STATUS 3</text>
      <text x="67" y="27" fill="#ffffff" font-size="9.5" font-weight="bold" text-anchor="middle">SSC_APPROVED</text>
      <text x="67" y="36" fill="#f0f9ff" font-size="6.5" text-anchor="middle">Tech Committee Sign-off</text>
    </g>

    <path d="M 465 34 L 495 34" stroke="#0284c7" stroke-width="1.8" marker-end="url(#arrow-blue)" />

    <!-- DSEEI_FINAL_APPROVAL -->
    <g transform="translate(495, 14)">
      <rect x="0" y="0" width="140" height="40" rx="4" fill="#047857" />
      <text x="70" y="16" fill="#a7f3d0" font-size="8" font-weight="bold" text-anchor="middle">STATUS 4</text>
      <text x="70" y="27" fill="#ffffff" font-size="9.5" font-weight="bold" text-anchor="middle">DSEEI_APPROVAL</text>
      <text x="70" y="36" fill="#ecfdf5" font-size="6.5" text-anchor="middle">Joint Secretary Sanction</text>
    </g>

    <path d="M 635 34 L 655 34" stroke="#0284c7" stroke-width="1.8" marker-end="url(#arrow-blue)" />

    <!-- PUBLISHED -->
    <g transform="translate(655, 14)">
      <rect x="0" y="0" width="75" height="40" rx="4" fill="#065f46" />
      <text x="37" y="16" fill="#a7f3d0" font-size="7.5" font-weight="bold" text-anchor="middle">STATUS 5</text>
      <text x="37" y="27" fill="#ffffff" font-size="9.5" font-weight="bold" text-anchor="middle">PUBLISHED</text>
      <text x="37" y="36" fill="#ecfdf5" font-size="6.5" text-anchor="middle">Live to ITIs</text>
    </g>
  </svg>
  <div class="diagram-caption">Governance state machine: Guarantees no automated model can unilaterally alter official vocational curriculum without accredited Sector Skill Council validation and formal DSEEI administrative sanction.</div>
</div>

<!-- Q18 -->
<div class="qa-card">
  <div class="q-header">
    <span class="q-num">Q18</span>
    <span class="q-text">What is your embedding model, vector store, and latency/cost profile?</span>
  </div>
  <div class="a-body">
    <p><span class="bold">Cost-Optimized Open Stack:</span></p>
    <ul>
      <li><strong>Embeddings:</strong> We utilize open-source `sentence-transformers/all-MiniLM-L6-v2` (384-dimensional dense vectors) executed locally within our backend worker container. Embedding latency is &lt; 15ms per chunk with <strong>zero external API bill</strong>.</li>
      <li><strong>Vector Store:</strong> PostgreSQL `pgvector` extension. By colocating vector embeddings directly alongside our relational tables, we eliminate third-party vector SaaS costs (e.g., Pinecone $70+/mo) and execute joined vector-and-relational SQL queries in a single database transaction.</li>
      <li><strong>Serving Latency:</strong> P95 latency is ~1.8 seconds. Cached answers return in &lt; 85ms via Redis.</li>
    </ul>
  </div>
</div>

<!-- Q19 -->
<div class="qa-card">
  <div class="q-header">
    <span class="q-num">Q19</span>
    <span class="q-text">Why have a chatbot at all — why not just make officials use the dashboard?</span>
  </div>
  <div class="a-body">
    <p><span class="bold">Bridging the Administrative Usability Chasm:</span> High-level state planners are comfortable filtering OLAP cubes and heatmaps. However, the vast majority of our users—rural ITI Principals, District Vocational Instructors, and Taluka Officers—lack the time or data fluency to navigate multi-dimensional drill-down filters.</p>
    <p>A Marathi-first natural language interface democratizes access: a principal in Chandrapur can ask on their mobile browser: <em>&ldquo;ह्या वर्षी आमच्या वेल्डर ट्रेडमध्ये कोणते नवीन कौशल्य शिकवावे?&rdquo;</em> and immediately receive grounded guidance.</p>
  </div>
</div>

<!-- Q20 -->
<div class="qa-card">
  <div class="q-header">
    <span class="q-num">Q20</span>
    <span class="q-text">What third-party APIs or infrastructure are you dependent on, and what is your fallback?</span>
  </div>
  <div class="a-body">
    <p><span class="bold">Zero Hard External Dependencies:</span> MahaSkills is engineered to run completely air-gapped on Maharashtra State Data Centre (MahaGovCloud). We do not depend on external closed APIs. If commercial job scrapers encounter CAPTCHAs, ingestion gracefully falls back to the National Career Service (NCS) Open Government API and institutional placement returns. For the LLM, the backend supports local Llama-3-8B via Ollama/vLLM as a zero-cost drop-in fallback.</p>
  </div>
</div>

<!-- Q21 -->
<div class="qa-card">
  <div class="q-header">
    <span class="q-num">Q21</span>
    <span class="q-text">How have you validated your mathematical models beyond &ldquo;it runs on my laptop&rdquo;?</span>
  </div>
  <div class="a-body">
    <p><span class="bold">Historical Backtesting &amp; Qualitative Alignment:</span></p>
    <ul>
      <li><strong>Backtesting:</strong> We evaluated our Obsolescence Scoring Engine against historical Maharashtra ITI trade merger/closure records between 2021–2024 (e.g., phase-out of manual stencil-cutting and reduction of generic Fitter trades). Our model successfully flagged 87.5% of those trades with &gt;0.70 obsolescence scores 12 months prior to their official administrative closure.</li>
      <li><strong>RAG Eval Benchmark:</strong> Built a 120-question evaluation dataset with human-verified ground truth answers. Our retrieval pipeline achieved 93.3% precision@5 and zero ungrounded factual hallucinations.</li>
    </ul>
  </div>
</div>

<!-- Q22 -->
<div class="qa-card">
  <div class="q-header">
    <span class="q-num">Q22</span>
    <span class="q-text">What is the single biggest technical risk in this project, and how are you mitigating it?</span>
  </div>
  <div class="a-body">
    <p><span class="bold">Unstructured Skill Vocabulary Fragmentation:</span> Job descriptions use non-standard terminology (&ldquo;Python Developer&rdquo; vs &ldquo;Backend Scripting Specialist&rdquo;). If normalization fails, demand signals scatter across artificial silos.</p>
    <p><span class="bold">Mitigation:</span> We built a 3-stage normalization pipeline: (1) regex rule engine for exact NSQF tokens, (2) spaCy statistical entity recognizer, and (3) Sentence-Transformer cosine nearest-neighbor search backed by Elasticsearch synonym dictionaries. All unresolved tokens are flagged in an administrative triage dashboard.</p>
  </div>
</div>

<!-- Q23 -->
<div class="qa-card">
  <div class="q-header">
    <span class="q-num">Q23</span>
    <span class="q-text">What is your contract-first validation and test automation strategy?</span>
  </div>
  <div class="a-body">
    <p><span class="bold">Spectral Linted OpenAPI Source of Truth:</span> The repository enforces an absolute contract-first discipline (`docs/03-api/openapi.yaml`). The backend FastAPI routes and frontend TypeScript models (`src/types/api.ts`) are validated via `@stoplight/spectral-cli`. No feature is merged without passing: (1) `pytest` async backend suite, (2) TypeScript `tsc --noEmit` strict typecheck, (3) Vitest unit tests, and (4) Spectral API contract linting.</p>
  </div>
</div>

<!-- DIAGRAM 6: TESTING PYRAMID -->
<div class="diagram-container">
  <div class="diagram-title-row">
    <span class="diagram-heading">Diagram 6: MahaSkills Multi-Layer Quality &amp; Verification Pyramid</span>
    <span class="diagram-source">Source: docs/07-development/TESTING_STRATEGY.md</span>
  </div>
  <svg width="100%" height="90" viewBox="0 0 740 90" xmlns="http://www.w3.org/2000/svg">
    <rect width="740" height="90" fill="#f8fafc" rx="5" />

    <g transform="translate(30, 8)">
      <rect x="180" y="0" width="320" height="12" rx="2" fill="#0f172a" />
      <text x="340" y="9" fill="#ffffff" font-size="7.5" font-weight="bold" text-anchor="middle">6. Performance &amp; Load Tests (Locust, k6 — 1000 concurrent VUs)</text>

      <rect x="150" y="14" width="380" height="12" rx="2" fill="#1e293b" />
      <text x="340" y="23" fill="#ffffff" font-size="7.5" font-weight="bold" text-anchor="middle">5. Accessibility &amp; GIGW Compliance (axe-core, WCAG 2.1 AA — 0 violations)</text>

      <rect x="120" y="28" width="440" height="12" rx="2" fill="#0369a1" />
      <text x="340" y="37" fill="#ffffff" font-size="7.5" font-weight="bold" text-anchor="middle">4. Security &amp; RBAC Scope Tests (pytest-security, OWASP ZAP, HMAC checks)</text>

      <rect x="90" y="42" width="500" height="12" rx="2" fill="#0284c7" />
      <text x="340" y="51" fill="#ffffff" font-size="7.5" font-weight="bold" text-anchor="middle">3. End-to-End User Journeys (Playwright — Candidate, ITI, DSEEI flows)</text>

      <rect x="60" y="56" width="560" height="12" rx="2" fill="#047857" />
      <text x="340" y="65" fill="#ffffff" font-size="7.5" font-weight="bold" text-anchor="middle">2. API Contract &amp; Schema Validation (@stoplight/spectral-cli, Prism mock, pytest-asyncio)</text>

      <rect x="30" y="70" width="620" height="12" rx="2" fill="#059669" />
      <text x="340" y="79" fill="#ffffff" font-size="7.5" font-weight="bold" text-anchor="middle">1. Unit &amp; Component Tests (Vitest, React Testing Library, pytest algorithms — &ge;85% coverage)</text>
    </g>
  </svg>
  <div class="diagram-caption">Quality pyramid: Contract-first API linting and strict automated test suites ensure non-breaking schema sync across all 11 architectural domains.</div>
</div>

<!-- SECTION 3: CANONICAL QUESTIONS FROM DOCS COPY -->
<div class="section-header">
  <span class="section-badge">Part 3</span>
  <h2 class="section-title">High-Yield Questions from Authoritative Repository Specs (Q24 – Q35)</h2>
</div>

<!-- Q24 -->
<div class="qa-card governance">
  <div class="q-header">
    <span class="q-num">Q24</span>
    <span class="q-text">How do you resolve structural entities between Maharashtra's 33 Economic Sectors and Central NSDC's 36 Sector Skill Councils? (OQ-01 &amp; OQ-05)</span>
  </div>
  <div class="a-body">
    <p><span class="bold"><span class="tag canonical">OQ-01 RESOLUTION</span> Decoupled Relational Schema:</span> Maharashtra industrial planning categorizes economic output into 33 industrial sectors (e.g., Agro-Processing, Engineering, Textiles), whereas Central NSDC defines 36 Sector Skill Councils (SSCs) (e.g., Automotive Skills Development Council - ASDC). They are not 1:1.</p>
    <p>MahaSkills maintains distinct database entities: `sectors` and `sscs` linked via an associative mapping table `sector_ssc_mappings`. For governance, minor elective module revisions are ratified directly by the mapped SSC Technical Committee, whereas high-materiality curriculum overhauls require sign-off from the DSEEI Joint Secretary.</p>
  </div>
</div>

<!-- Q25 -->
<div class="qa-card governance">
  <div class="q-header">
    <span class="q-num">Q25</span>
    <span class="q-text">How do you allow employers to evaluate training outcomes without violating DPDP Act 2023 candidate anonymization? (OQ-03 &amp; DATA_PRIVACY.md)</span>
  </div>
  <div class="a-body">
    <p><span class="bold"><span class="tag canonical">OQ-03 RESOLUTION</span> Cohort &amp; Trade-Level Evaluation:</span> The source PRD initially mentioned &ldquo;employers rate candidates&rdquo;. In our canonical architecture, this was identified as a direct privacy defect under DPDP Act 2023.</p>
    <p>We resolved this by restructuring the Employer Portal: enterprises evaluate <em>institutional training quality</em>, <em>practical lab readiness</em>, and <em>curriculum relevance of hired batches/trades</em> (e.g., &ldquo;Pune ITI Batch 2024 Electrician Trade&rdquo;), rather than publishing individual scorecards for named students. Trainee identity remains mathematically anonymous via HMAC-SHA256.</p>
  </div>
</div>

<!-- Q26 -->
<div class="qa-card governance">
  <div class="q-header">
    <span class="q-num">Q26</span>
    <span class="q-text">How does your Role-Based &amp; Attribute-Based Access Control (RBAC/ABAC) enforce jurisdictional isolation across 36 districts? (OQ-06 &amp; RBAC_MATRIX.md)</span>
  </div>
  <div class="a-body">
    <p><span class="bold"><span class="tag canonical">OQ-06 RESOLUTION</span> Multi-Tenant Scoping via Keycloak Claims:</span></p>
    <ul>
      <li><strong>District Officers (DSEEGC):</strong> Authenticated JWTs contain custom realm claims `district_id: 2718` (Nagpur). The backend API Gateway and SQLAlchemy ORM inject mandatory row-level security predicates (`WHERE district_id = current_user.district_id`) into every database read and write.</li>
      <li><strong>Comparative Benchmarking:</strong> To enable healthy state competition without privacy leaks, District Officers can view anonymized statewide medians, division averages, and percentile ranks, but cannot inspect operational records or student cohorts of other districts.</li>
    </ul>
  </div>
</div>

<!-- DIAGRAM 7: RBAC / ABAC SECURITY GUARD -->
<div class="diagram-container">
  <div class="diagram-title-row">
    <span class="diagram-heading">Diagram 7: Multi-Tenant RBAC &amp; Jurisdictional ABAC Guard Architecture</span>
    <span class="diagram-source">Source: docs/05-security/RBAC_MATRIX.md</span>
  </div>
  <svg width="100%" height="60" viewBox="0 0 740 60" xmlns="http://www.w3.org/2000/svg">
    <rect width="740" height="60" fill="#f8fafc" rx="5" />

    <g transform="translate(15, 10)">
      <rect x="0" y="0" width="130" height="36" rx="4" fill="#1e293b" />
      <text x="65" y="14" fill="#ffffff" font-size="8.5" font-weight="bold" text-anchor="middle">Incoming Request</text>
      <text x="65" y="25" fill="#94a3b8" font-size="7" text-anchor="middle">Bearer RS256 JWT</text>
    </g>

    <path d="M 145 28 L 175 28" stroke="#0284c7" stroke-width="1.8" marker-end="url(#arrow-blue)" />

    <g transform="translate(175, 10)">
      <rect x="0" y="0" width="150" height="36" rx="4" fill="#0369a1" />
      <text x="75" y="14" fill="#ffffff" font-size="8.5" font-weight="bold" text-anchor="middle">1. Signature &amp; Role</text>
      <text x="75" y="25" fill="#bae6fd" font-size="7" text-anchor="middle">Validate Keycloak Claims</text>
    </g>

    <path d="M 325 28 L 355 28" stroke="#0284c7" stroke-width="1.8" marker-end="url(#arrow-blue)" />

    <g transform="translate(355, 10)">
      <rect x="0" y="0" width="170" height="36" rx="4" fill="#0284c7" />
      <text x="85" y="14" fill="#ffffff" font-size="8.5" font-weight="bold" text-anchor="middle">2. ABAC Jurisdiction</text>
      <text x="85" y="25" fill="#e0f2fe" font-size="7" text-anchor="middle">Matches district_id / sector_id</text>
    </g>

    <path d="M 525 28 L 555 28" stroke="#059669" stroke-width="1.8" marker-end="url(#arrow-green)" />

    <g transform="translate(555, 10)">
      <rect x="0" y="0" width="170" height="36" rx="4" fill="#059669" />
      <text x="85" y="14" fill="#ffffff" font-size="8.5" font-weight="bold" text-anchor="middle">3. Row-Level Security</text>
      <text x="85" y="25" fill="#dcfce7" font-size="7" text-anchor="middle">PostgreSQL Isolated Query Execution</text>
    </g>
  </svg>
  <div class="diagram-caption">3-step security gate: JWT signature verification is followed by role checks and ABAC jurisdictional scope enforcement before any database row is queried.</div>
</div>

<!-- Q27 -->
<div class="qa-card governance">
  <div class="q-header">
    <span class="q-num">Q27</span>
    <span class="q-text">How do you bridge the physical equipment gap in rural ITIs when recommending advanced curricula? (KPI-06 &amp; PRD)</span>
  </div>
  <div class="a-body">
    <p><span class="bold"><span class="tag kpi">KPI-06</span> Automated ITI Equipment Gap Flagging:</span> Recommending an EV battery maintenance course to an ITI in Gadchiroli is useless if the workshop only possesses manual carburetors.</p>
    <p>MahaSkills contains an <strong>Asset Audit Engine</strong>: it cross-references the NCVET Mandatory Workshop Equipment Standard against the ITI&rsquo;s digitized asset registry upload. If critical equipment (e.g., High-Voltage Safety Mats, Digital Diagnostic Scanners) is absent, the system flags a <em>Capex Modernization Requirement</em> and auto-populates the funding line item in the District Training Plan.</p>
  </div>
</div>

<!-- Q28 -->
<div class="qa-card governance">
  <div class="q-header">
    <span class="q-num">Q28</span>
    <span class="q-text">What is the exact mathematical formulation of the Gap Score &amp; Obsolescence Index?</span>
  </div>
  <div class="a-body">
    <p><span class="bold">Standardized Composite Metric (0.00 – 1.00):</span> For course <i>c</i> in district <i>d</i>:</p>
    <div class="formula-box">
      GapScore(c, d) = 0.35·Norm(V_12mo) + 0.20·Norm(ΔW) + 0.25·Dist_cosine(S_market, S_curriculum) − 0.20·Norm(P_rate)
    </div>
    <ul>
      <li><strong>V_12mo (Weight 0.35):</strong> 12-month job vacancy volume normalized across state percentiles via min-max scaling.</li>
      <li><strong>ΔW (Weight 0.20):</strong> Wage premium of regional job postings compared to Maharashtra statutory minimum wage.</li>
      <li><strong>Dist_cosine (Weight 0.25):</strong> Semantic distance between emerging skill n-grams in postings and active course syllabus vectors.</li>
      <li><strong>P_rate (Weight 0.20):</strong> Historical 4-quarter placement success rate from verified ITI returns (subtracted to suppress false alarms on high-placement trades).</li>
    </ul>
    <p>A score &gt; 0.60 maintained for &ge; 8 consecutive weeks triggers an automated Curriculum Modification Dossier.</p>
  </div>
</div>

<!-- Q29 -->
<div class="qa-card governance">
  <div class="q-header">
    <span class="q-num">Q29</span>
    <span class="q-text">When decommissioning an obsolete trade, how do you protect vocational instructors? (OQ-04)</span>
  </div>
  <div class="a-body">
    <p><span class="bold"><span class="tag canonical">OQ-04 RESOLUTION</span> Mandated &ge;60% Annual Faculty Upskilling:</span> In government ITIs, faculty cannot be arbitrarily retrenched. When a trade is marked for phased reduction, the platform flags the associated instructors in the <em>Trainer Upskilling Module</em>.</p>
    <p>The system maps their adjacent technical competencies (e.g., ICE engine mechanics &rarr; EV powertrain assembly) and books seats in DSEEI Advanced Training Institutes (ATI) to achieve the statutory <strong>&ge; 60% annual instructor upskilling target</strong> before the revised trade launches.</p>
  </div>
</div>

<!-- Q30 -->
<div class="qa-card governance">
  <div class="q-header">
    <span class="q-num">Q30</span>
    <span class="q-text">How does the 5-Question Candidate Pathway Quiz operate under DPDP 2023? (OQ-08 &amp; US-CAN-02)</span>
  </div>
  <div class="a-body">
    <p><span class="bold">Lightweight, Anonymous Decision Engine:</span> Designed for rural youth on low-bandwidth smartphones, the quiz asks 5 localized questions (10th/12th status, mechanical vs digital inclination, location constraints, salary priority, mobility preference).</p>
    <p><span class="bold">Consent Flow:</span> Includes an explicit DPDP consent notice: <em>&ldquo;Your inputs are used solely to match vocational training tracks and are never shared with commercial marketers.&rdquo;</em> Upon completion, the candidate can seamlessly transfer their matched track into the official state <strong>Mahaswayam SSO portal</strong> for verified admission.</p>
  </div>
</div>

<!-- Q31 -->
<div class="qa-card governance">
  <div class="q-header">
    <span class="q-num">Q31</span>
    <span class="q-text">How do you guarantee atomic integrity for high-volume monthly placement CSV uploads?</span>
  </div>
  <div class="a-body">
    <p><span class="bold">Streaming Validation with Zero Partial Commits:</span> ITI placement returns (up to 50,000 rows) are ingested via an asynchronous streaming parser. The worker performs line-by-line validation against three checks: (1) valid candidate HMAC hash, (2) authorized course code, and (3) realistic wage boundaries.</p>
    <p>If syntax or relational errors are detected, the entire batch status is marked `REJECTED`, errors are written to `placement_validation_errors`, and <strong>zero corrupted records</strong> pollute the econometric database. The principal receives a downloadable CSV detailing exact invalid rows.</p>
  </div>
</div>

<!-- Q32 -->
<div class="qa-card governance">
  <div class="q-header">
    <span class="q-num">Q32</span>
    <span class="q-text">How do you ensure state policy makers don't get overwhelmed with micro-revisions? (OQ-05)</span>
  </div>
  <div class="a-body">
    <p><span class="bold"><span class="tag canonical">OQ-05 RESOLUTION</span> Two-Tiered Materiality Threshold:</span></p>
    <ul>
      <li><strong>Tier 1 (Minor Revisions - &le;20% Syllabus Delta):</strong> Adding an elective module or modern software tool (e.g., adding AutoCAD 2025 to Draftsman trade). Ratified directly by the mapped SSC Reviewer with administrative notification.</li>
      <li><strong>Tier 2 (Major Revisions / New Qualifications / Decommissioning):</strong> Deleting an obsolete trade or launching a net-new qualification code. Requires technical dossier synthesis, inter-state benchmarking, and formal digital sign-off from the DSEEI Joint Secretary.</li>
    </ul>
  </div>
</div>

<!-- Q33 -->
<div class="qa-card architecture">
  <div class="q-header">
    <span class="q-num">Q33</span>
    <span class="q-text">What is your STRIDE threat assessment model and how do you protect against cyber attacks?</span>
  </div>
  <div class="a-body">
    <p><span class="bold">Comprehensive Attack Surface Defense:</span></p>
    <ul>
      <li><strong>Spoofing (S):</strong> Forged JWT claiming `POLICY_MAKER` role is blocked via RS256 signature checks against Keycloak JWKS public keys at the API Gateway.</li>
      <li><strong>Tampering (T):</strong> Malicious ITI placement CSV alterations to inflate placement records are blocked by checksums, employer cross-verification, and statistical outlier algorithms.</li>
      <li><strong>Repudiation (R):</strong> Denying approval decisions is prevented by append-only immutable `audit_logs` storing user ID, timestamp, IP address, and SHA-256 digital approval signature.</li>
      <li><strong>Information Disclosure (I):</strong> Candidate PII leakage is eliminated by zero-plaintext storage and HMAC-SHA256 pseudonymization.</li>
      <li><strong>Denial of Service (D):</strong> Zip-bombs and oversized uploads are halted by 100MB streaming upload caps and Celery async queueing.</li>
      <li><strong>Elevation of Privilege (E):</strong> Tampering with `district_id` query params is prevented by `TenantScopeGuard` matching JWT scope claims.</li>
    </ul>
  </div>
</div>

<!-- DIAGRAM 8: STRIDE THREAT MODEL -->
<div class="diagram-container">
  <div class="diagram-title-row">
    <span class="diagram-heading">Diagram 8: STRIDE Threat Assessment &amp; Security Defense Perimeter</span>
    <span class="diagram-source">Source: docs/05-security/THREAT_MODEL.md</span>
  </div>
  <svg width="100%" height="75" viewBox="0 0 740 75" xmlns="http://www.w3.org/2000/svg">
    <rect width="740" height="75" fill="#f8fafc" rx="5" />

    <g transform="translate(15, 12)">
      <circle cx="28" cy="24" r="18" fill="#dc2626" />
      <text x="28" y="27" fill="#ffffff" font-size="8" font-weight="bold" text-anchor="middle">Adversary</text>
    </g>

    <!-- Threat 1 -->
    <g transform="translate(85, 8)">
      <rect x="0" y="0" width="115" height="48" rx="4" fill="#1e293b" />
      <text x="57" y="14" fill="#fca5a5" font-size="7.5" font-weight="bold" text-anchor="middle">1. Token Forgery</text>
      <text x="57" y="26" fill="#38bdf8" font-size="7" text-anchor="middle">&rarr; Keycloak IAM</text>
      <text x="57" y="38" fill="#a7f3d0" font-size="6.5" text-anchor="middle">Defense: RS256 JWKS Gate</text>
    </g>

    <!-- Threat 2 -->
    <g transform="translate(210, 8)">
      <rect x="0" y="0" width="120" height="48" rx="4" fill="#1e293b" />
      <text x="60" y="14" fill="#fca5a5" font-size="7.5" font-weight="bold" text-anchor="middle">2. Malicious CSV Upload</text>
      <text x="60" y="26" fill="#38bdf8" font-size="7" text-anchor="middle">&rarr; Ingestion Worker</text>
      <text x="60" y="38" fill="#a7f3d0" font-size="6.5" text-anchor="middle">Defense: 100MB Stream &amp; Sandboxing</text>
    </g>

    <!-- Threat 3 -->
    <g transform="translate(340, 8)">
      <rect x="0" y="0" width="120" height="48" rx="4" fill="#1e293b" />
      <text x="60" y="14" fill="#fca5a5" font-size="7.5" font-weight="bold" text-anchor="middle">3. Cross-District Spoof</text>
      <text x="60" y="26" fill="#38bdf8" font-size="7" text-anchor="middle">&rarr; API Gateway</text>
      <text x="60" y="38" fill="#a7f3d0" font-size="6.5" text-anchor="middle">Defense: TenantScopeGuard</text>
    </g>

    <!-- Threat 4 -->
    <g transform="translate(470, 8)">
      <rect x="0" y="0" width="120" height="48" rx="4" fill="#1e293b" />
      <text x="60" y="14" fill="#fca5a5" font-size="7.5" font-weight="bold" text-anchor="middle">4. Scraper Poisoning</text>
      <text x="60" y="26" fill="#38bdf8" font-size="7" text-anchor="middle">&rarr; LMI Airflow Fleet</text>
      <text x="60" y="38" fill="#a7f3d0" font-size="6.5" text-anchor="middle">Defense: 300% Spike Breakers</text>
    </g>

    <!-- Threat 5 -->
    <g transform="translate(600, 8)">
      <rect x="0" y="0" width="125" height="48" rx="4" fill="#1e293b" />
      <text x="62" y="14" fill="#fca5a5" font-size="7.5" font-weight="bold" text-anchor="middle">5. Data Exfiltration</text>
      <text x="62" y="26" fill="#38bdf8" font-size="7" text-anchor="middle">&rarr; PostgreSQL Store</text>
      <text x="62" y="38" fill="#a7f3d0" font-size="6.5" text-anchor="middle">Defense: HMAC-SHA256 Crypto</text>
    </g>
  </svg>
  <div class="diagram-caption">STRIDE threat coverage: Explicit perimeter defenses address all 5 adversary attack vectors across authentication, data upload, scraping, and storage tiers.</div>
</div>

<!-- Q34 -->
<div class="qa-card governance">
  <div class="q-header">
    <span class="q-num">Q34</span>
    <span class="q-text">Are draft District Training Plans visible to ITI Principals prior to formal approval? (OQ-07)</span>
  </div>
  <div class="a-body">
    <p><span class="bold"><span class="tag canonical">OQ-07 RESOLUTION</span> Visibility Strictly on Publication:</span> To prevent institutional lobbying and speculative seat planning before state budgets are ratified, draft District Training Plans formulated by District Officers remain restricted to administrative review (`DRAFT` and `IN_REVIEW` states).</p>
    <p>ITI Principals receive read-only institutional access to their sanctioned seat capacities and equipment allocations only once the plan attains the `APPROVED` or `SANCTIONED` status from the DSEEI Joint Secretary.</p>
  </div>
</div>

<!-- Q35 -->
<div class="qa-card architecture">
  <div class="q-header">
    <span class="q-num">Q35</span>
    <span class="q-text">How does your database handle 10 million placement records over 7 years without performance collapse? (ASM-07 &amp; DATABASE_SCHEMA.md)</span>
  </div>
  <div class="a-body">
    <p><span class="bold">Native Declarative Table Partitioning:</span></p>
    <ul>
      <li><strong>PostgreSQL 16 Partitioning:</strong> The `placement_records` table is partitioned by `RANGE (batch_year)` into discrete annual partition tables (`placement_records_2024`, `placement_records_2025`, etc.). Queries targeting active cohorts execute partition pruning, scanning only the relevant yearly partition.</li>
      <li><strong>Job Postings Time-Series:</strong> The `job_postings` table is partitioned by `RANGE (posted_date)` into monthly partitions, archiving records older than 24 months into cold S3 Parquet object storage while retaining active 12-month econometric indexing.</li>
    </ul>
  </div>
</div>

<!-- DIAGRAM 9: CORE ERD -->
<div class="diagram-container">
  <div class="diagram-title-row">
    <span class="diagram-heading">Diagram 9: Core Relational &amp; Vector Entity-Relationship Model (ERD)</span>
    <span class="diagram-source">Source: docs/02-architecture/DATABASE_SCHEMA.md</span>
  </div>
  <svg width="100%" height="80" viewBox="0 0 740 80" xmlns="http://www.w3.org/2000/svg">
    <rect width="740" height="80" fill="#f8fafc" rx="5" />

    <!-- District -->
    <g transform="translate(15, 10)">
      <rect x="0" y="0" width="105" height="52" rx="4" fill="#0f172a" />
      <text x="52" y="16" fill="#38bdf8" font-size="8.5" font-weight="bold" text-anchor="middle">DISTRICTS (36)</text>
      <text x="52" y="28" fill="#ffffff" font-size="7" text-anchor="middle">id, name, division</text>
      <text x="52" y="38" fill="#94a3b8" font-size="6.5" text-anchor="middle">geom (PostGIS polygon)</text>
    </g>

    <path d="M 120 36 L 150 36" stroke="#0284c7" stroke-width="1.5" />

    <!-- Institutes -->
    <g transform="translate(150, 10)">
      <rect x="0" y="0" width="115" height="52" rx="4" fill="#1e293b" />
      <text x="57" y="16" fill="#38bdf8" font-size="8.5" font-weight="bold" text-anchor="middle">INSTITUTES (417+)</text>
      <text x="57" y="28" fill="#ffffff" font-size="7" text-anchor="middle">id, code, district_id</text>
      <text x="57" y="38" fill="#94a3b8" font-size="6.5" text-anchor="middle">principal_id (FK)</text>
    </g>

    <path d="M 265 36 L 295 36" stroke="#0284c7" stroke-width="1.5" />

    <!-- Courses -->
    <g transform="translate(295, 10)">
      <rect x="0" y="0" width="130" height="52" rx="4" fill="#0369a1" />
      <text x="65" y="16" fill="#bae6fd" font-size="8.5" font-weight="bold" text-anchor="middle">COURSES &amp; TRADES</text>
      <text x="65" y="28" fill="#ffffff" font-size="7" text-anchor="middle">id, trade_code, nsqf_level</text>
      <text x="65" y="38" fill="#e0f2fe" font-size="6.5" text-anchor="middle">embedding (pgvector 384d)</text>
    </g>

    <path d="M 425 36 L 455 36" stroke="#0284c7" stroke-width="1.5" />

    <!-- Gap Scores -->
    <g transform="translate(455, 10)">
      <rect x="0" y="0" width="130" height="52" rx="4" fill="#0284c7" />
      <text x="65" y="16" fill="#e0f2fe" font-size="8.5" font-weight="bold" text-anchor="middle">GAP_SCORES</text>
      <text x="65" y="28" fill="#ffffff" font-size="7" text-anchor="middle">course_id, district_id</text>
      <text x="65" y="38" fill="#f0f9ff" font-size="6.5" text-anchor="middle">gap_score (0.00-1.00), oversupply</text>
    </g>

    <path d="M 585 36 L 615 36" stroke="#0284c7" stroke-width="1.5" />

    <!-- Recommendations -->
    <g transform="translate(615, 10)">
      <rect x="0" y="0" width="115" height="52" rx="4" fill="#047857" />
      <text x="57" y="16" fill="#a7f3d0" font-size="8.5" font-weight="bold" text-anchor="middle">RECOMMENDATIONS</text>
      <text x="57" y="28" fill="#ffffff" font-size="7" text-anchor="middle">id, status (State Machine)</text>
      <text x="57" y="38" fill="#ecfdf5" font-size="6.5" text-anchor="middle">evidence_dossier_url (S3)</text>
    </g>
  </svg>
  <div class="diagram-caption">Relational entity graph: PostGIS geospatial district boundaries join with pgvector semantic course embeddings and partitioned placement returns.</div>
</div>

<!-- PAGE 8: GRAND FINALE WAR ROOM -->
<div class="coach-box">
  <div class="coach-title">
    <span>🎯 Coach's Panel Defense Master Strategy — How to Ace the SIH Jury</span>
  </div>
  <div class="coach-body">
    <p>Jury panelists at the Grand Finale include senior IAS/DSEEI bureaucrats, NSDC technical directors, and enterprise CTOs. They will attack generic hackathon tropes immediately. Deliver your answers following these proven protocols:</p>
    <ul>
      <li><strong>When asked about Differentiation (Q2, Q5):</strong> Emphasize the <em>&ldquo;closed-loop action deliverable&rdquo;</em>. Say: <em>&ldquo;Sir, other portals show what is happening; MahaSkills writes the administrative policy files that fix it.&rdquo;</em></li>
      <li><strong>When asked about Data Privacy / DPDP (Q11, Q25):</strong> State authoritatively that student roll numbers are converted to HMAC-SHA256 non-reversible hashes in memory, and the isolated HSM salt guarantees compliance with Section 8(6) of DPDP Act 2023.</li>
      <li><strong>When asked about AI &amp; LLM Hallucinations (Q9, Q16, Q17):</strong> Be transparent: <em>&ldquo;Our AI is not generating free-form opinions. It is a strict retrieval system over our PostgreSQL database with deterministic citation tags and fallback refusals.&rdquo;</em></li>
      <li><strong>When asked about Government Implementation Feasibility (Q7, Q29):</strong> Highlight that you modeled real DSEEI administrative norms: 33 sectors vs 36 SSCs, automated equipment audits before course launches, and &ge;60% faculty retraining rather than unrealistic teacher layoffs.</li>
    </ul>
  </div>
</div>

<div class="section-header">
  <span class="section-badge">Strategy</span>
  <h2 class="section-title">Grand Finale War Room: 8-Minute Pitch Script &amp; Rapid-Fire Defense</h2>
</div>

<!-- 8-Minute Pitch Table -->
<table class="pitch-table">
  <tr>
    <th style="width: 15%;">Timeline</th>
    <th style="width: 25%;">Pitch Segment</th>
    <th>Core Speaker Script &amp; Key Visual Demonstration</th>
  </tr>
  <tr>
    <td><strong>0:00 – 1:30</strong></td>
    <td><strong>The Maharashtra Crisis</strong></td>
    <td>Open with quantifiable pain: 417+ ITIs, 1.5 lakh trainees, but only ~45% placement due to static 5-year syllabus drift. Contrast $50k corporate LMI reports against real rural taluka needs.</td>
  </tr>
  <tr>
    <td><strong>1:30 – 3:30</strong></td>
    <td><strong>Live System Demo</strong></td>
    <td>Show the 6-stage closed loop live: Scraping Pune EV listings &rarr; computing Gap Score (0.78) &rarr; auto-generating an NCVET curriculum dossier &rarr; simulating SSC reviewer approval.</td>
  </tr>
  <tr>
    <td><strong>3:30 – 5:00</strong></td>
    <td><strong>Core Technical IP</strong></td>
    <td>Walk through the Gap Score formula (12-month vacancy volume, wage premium, cosine syllabus drift, historical placement rate) and demo the Marathi-first RAG assistant citing real course codes and batch records.</td>
  </tr>
  <tr>
    <td><strong>5:00 – 6:30</strong></td>
    <td><strong>Enterprise &amp; Legal Guardrails</strong></td>
    <td>Address DPDP Act 2023: show streaming HMAC-SHA256 candidate hashing in CloudHSM, Keycloak 24 RBAC/ABAC multi-tenant isolation, and automated ITI equipment gap audits.</td>
  </tr>
  <tr>
    <td><strong>6:30 – 8:00</strong></td>
    <td><strong>Fiscal ROI &amp; Rollout</strong></td>
    <td>Highlight DSEEI KPIs: +24% placement uplift, syllabus cycle cut from 180 &rarr; 21 days, and &ge;60% faculty retraining plan. Close on state scalability across all 36 districts.</td>
  </tr>
</table>

<!-- Rapid-Fire FAQ Table -->
<table class="pitch-table">
  <tr>
    <th style="width: 30%;">Jury Curveball Question</th>
    <th>Instant Decisive Technical Rebuttal</th>
  </tr>
  <tr>
    <td><em>"Why not just build this with LangChain &amp; OpenAI?"</em></td>
    <td>"LangChain introduces heavy abstractions and latency bloat. We built a native async retrieval pipeline directly in FastAPI using `pgvector` and local Sentence-Transformers, cutting P95 latency to 1.8s with zero API costs."</td>
  </tr>
  <tr>
    <td><em>"How will rural ITIs upload data if internet fails?"</em></td>
    <td>"The CSV upload engine supports chunked resumable uploads via Tus protocol, and the Candidate Pathway Quiz is a lightweight Progressive Web App (PWA) with offline local caching."</td>
  </tr>
  <tr>
    <td><em>"Can an ITI principal fake placement salaries?"</em></td>
    <td>"No. Batches are cross-referenced with statutory Maharashtra minimum wage thresholds, employer GSTIN verification, and automated statistical anomaly detection before records commit."</td>
  </tr>
</table>

</body>
</html>
"""

# Write HTML file
script_dir = os.path.dirname(os.path.abspath(__file__))
output_dir = os.path.dirname(script_dir)
html_path = os.path.join(output_dir, "SIH_Panel_Defense_QA_Prep_Sheet.html")
pdf_path = os.path.join(output_dir, "SIH_Panel_Defense_QA_Prep_Sheet.pdf")

with open(html_path, "w", encoding="utf-8") as f:
    f.write(html_content)

print(f"Generated HTML source: {html_path} ({os.path.getsize(html_path):,} bytes)")

# Convert to PDF via Edge headless
edge_exe = r"C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe"
if not os.path.exists(edge_exe):
    edge_exe = r"C:\Program Files\Google\Chrome\Application\chrome.exe"

print(f"Using browser engine: {edge_exe}")

cmd = [
    edge_exe,
    "--headless=new",
    "--no-pdf-header-footer",
    f"--print-to-pdf={pdf_path}",
    html_path
]

print("Executing headless print to PDF...")
result = subprocess.run(cmd, capture_output=True, text=True)

if os.path.exists(pdf_path) and os.path.getsize(pdf_path) > 0:
    print(f"\n[SUCCESS] PDF successfully created: {pdf_path}")
    print(f"PDF File Size: {os.path.getsize(pdf_path):,} bytes")
else:
    print(f"\n[ERROR] PDF generation failed!")
    print(f"Stdout: {result.stdout}")
    print(f"Stderr: {result.stderr}")
