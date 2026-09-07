# -*- coding: utf-8 -*-
"""
Chapters 10 to 14 for MahaSkills Master Architecture Guide.
Each chapter is strictly 1 clean page.
"""
from diagrams import (
    DIAGRAM_9_STATE_MACHINE,
    DIAGRAM_10_ERD,
    DIAGRAM_11_TESTING_PYRAMID,
    DIAGRAM_12_CLOUD_TOPOLOGY
)

CHAPTERS_10_TO_14_HTML = f"""
<div class="page-break"></div>

<!-- PAGE 10: CHAPTER 10 -->
<div class="chapter-header">
  <h2 class="chapter-title">Chapter 10: Curriculum Governance State Machine &amp; Faculty Protection</h2>
  <span class="chapter-badge">Administrative Workflow</span>
</div>

<div class="concept-box">
  <div class="concept-title">💡 Plain English Concept &mdash; How does a computer recommendation become official government policy?</div>
  <div class="concept-body">
    In the government, an algorithm cannot simply change classroom textbooks overnight without democratic accountability. Official curriculum changes require technical validation by national experts and administrative sanction by senior IAS officers.<br><br>
    Furthermore, when an obsolete trade is phased out, what happens to the government teachers who have taught it for 20 years? In government ITIs, teachers cannot be laid off! MahaSkills models the real administrative reality: it provides a <strong>5-stage approval state machine</strong>, and automatically schedules affected faculty into government Advanced Training Institutes (ATIs) to learn new technologies before the updated courses launch.
  </div>
</div>

{DIAGRAM_9_STATE_MACHINE}

<div class="tech-box">
  <div class="tech-title">⚙️ Statutory Approval Workflow &amp; Operational Safeguards</div>
  <div class="tech-body">
    <ul>
      <li><strong>5-Stage Statutory State Machine:</strong>
        <ol>
          <li><code>DRAFT</code>: Generated automatically when a trade maintains a persistent Gap Score &gt; 0.60 for &ge; 8 consecutive weeks.</li>
          <li><code>UNDER_SSC_REVIEW</code>: Assigned to accredited Sector Skill Council technical evaluators for syllabus modification review.</li>
          <li><code>SSC_APPROVED</code>: Formal technical sign-off by the SSC Technical Review Committee.</li>
          <li><code>DSEEI_APPROVAL</code>: Administrative review and cryptographic digital sign-off by the DSEEI Joint Secretary.</li>
          <li><code>PUBLISHED</code>: Released statewide to all 417+ ITIs, updating classroom timetables and equipment requisitions.</li>
        </ol>
      </li>
      <li><strong>Two-Tiered Materiality Threshold:</strong>
        <ul>
          <li><strong>Tier 1 (Minor Revisions &mdash; &le;20% Syllabus Delta):</strong> Adding an elective module or modern CAD software version. Signed off directly by the SSC Reviewer with administrative notification.</li>
          <li><strong>Tier 2 (Major Revisions / New Qualifications):</strong> Decommissioning an obsolete trade or introducing an entirely new NSQF qualification. Requires comprehensive evidence dossiers, interstate benchmarking, and DSEEI Joint Secretary sanction.</li>
        </ul>
      </li>
      <li><strong>Mandated &ge;60% Annual Faculty Retraining:</strong> When a trade is modified, the platform identifies affected faculty, maps their existing technical competencies to adjacent modern skills (e.g., ICE engine mechanics &rarr; EV battery assembly), and reserves seats in DSEEI Advanced Training Institutes (ATI) to hit the statutory <strong>&ge; 60% annual retraining coverage</strong>.</li>
      <li><strong>Automated ITI Equipment Gap Auditor:</strong> Cross-references NCVET Mandatory Workshop Equipment Standards against the ITI's uploaded asset registry. If critical equipment (e.g., High-Voltage Safety Mats, Digital Diagnostic Scanners) is absent, the system flags a <em>Capex Modernization Line Item</em> and inserts it into the District Annual Training Plan.</li>
    </ul>
  </div>
</div>

<div class="page-break"></div>

<!-- PAGE 11: CHAPTER 11 -->
<div class="chapter-header">
  <h2 class="chapter-title">Chapter 11: Database Architecture &amp; Core Entity-Relationship Model</h2>
  <span class="chapter-badge">Data Modeling</span>
</div>

<div class="concept-box">
  <div class="concept-title">💡 Plain English Concept &mdash; How is all the information organized in the database?</div>
  <div class="concept-body">
    The database is the permanent memory of MahaSkills. It stores everything: the geographic boundaries of all 36 districts of Maharashtra, records for every one of the 417+ vocational institutes, descriptions of 2,200 qualification packs, millions of job postings, and every official approval signature.
  </div>
</div>

{DIAGRAM_10_ERD}

<div class="tech-box">
  <div class="tech-title">⚙️ Relational &amp; Vector Database Entities Breakdown</div>
  <div class="tech-body">
    <table class="spec-table">
      <tr>
        <th style="width: 22%;">Table Entity</th>
        <th style="width: 25%;">Primary Keys / Ext</th>
        <th>Description &amp; Architectural Role</th>
      </tr>
      <tr>
        <td><strong>districts</strong></td>
        <td><code>id (UUID)</code><br>PostGIS <code>GEOMETRY</code></td>
        <td>36 administrative districts of Maharashtra, storing administrative division metadata and spatial boundary polygons for map-based querying.</td>
      </tr>
      <tr>
        <td><strong>institutes</strong></td>
        <td><code>id (UUID)</code><br><code>district_id (FK)</code></td>
        <td>417+ Government and Private ITIs across Maharashtra, storing principal user foreign keys, trade affiliations, and workshop capex records.</td>
      </tr>
      <tr>
        <td><strong>courses_trades</strong></td>
        <td><code>id (UUID)</code><br><code>pgvector (384d)</code></td>
        <td>2,200 NSQF-aligned qualifications, storing syllabus learning outcomes, elective modules, and dense 384-dimensional vector embeddings for semantic search.</td>
      </tr>
      <tr>
        <td><strong>gap_scores</strong></td>
        <td><code>course_id (FK)</code><br><code>district_id (FK)</code></td>
        <td>Weekly computed econometric scores (0.00–1.00), vacancy velocity metrics, wage premiums, and oversupply warning flags.</td>
      </tr>
      <tr>
        <td><strong>recommendations</strong></td>
        <td><code>id (UUID)</code><br>State Machine Enum</td>
        <td>Curriculum modification proposals tracking status (<code>DRAFT</code> to <code>PUBLISHED</code>), SSC reviewer comments, and MinIO S3 evidence dossier URLs.</td>
      </tr>
      <tr>
        <td><strong>placement_records</strong></td>
        <td>Partitioned by<br><code>batch_year (INT)</code></td>
        <td>Longitudinal student placement records stored via HMAC-SHA256 candidate hashes, monthly wages, and verified hiring employer GSTINs.</td>
      </tr>
      <tr>
        <td><strong>audit_logs</strong></td>
        <td><code>id (BIGSERIAL)</code><br>Immutable Append</td>
        <td>Permanent cryptographic audit trail recording user ID, action type, IP address, timestamp, and SHA-256 digital approval signature.</td>
      </tr>
    </table>
  </div>
</div>

<div class="page-break"></div>

<!-- PAGE 12: CHAPTER 12 -->
<div class="chapter-header">
  <h2 class="chapter-title">Chapter 12: Quality Engineering, Testing Strategy &amp; Verification Pyramid</h2>
  <span class="chapter-badge">Quality Assurance</span>
</div>

<div class="concept-box">
  <div class="concept-title">💡 Plain English Concept &mdash; How do we prove the software is bulletproof and production-ready?</div>
  <div class="concept-body">
    Before any piece of code is accepted into MahaSkills, it must pass through an automated testing obstacle course with six distinct levels. We test individual calculations, verify that the frontend and backend talk to each other without errors, run simulated tests where digital robots pretend to be students and officials using the website, test for cyber vulnerabilities, and verify that the system can handle 1,000 users at the exact same second without crashing.
  </div>
</div>

{DIAGRAM_11_TESTING_PYRAMID}

<div class="tech-box">
  <div class="tech-title">⚙️ Contract-First Discipline &amp; The 6 Quality Tiers</div>
  <div class="tech-body">
    <ul>
      <li><strong>Contract-First Architecture:</strong> <code>docs/03-api/openapi.yaml</code> is the single source of truth. Both backend FastAPI routes and frontend TypeScript types (<code>src/types/api.ts</code>) are validated using <code>@stoplight/spectral-cli</code>. Any pull request with schema divergence is rejected immediately.</li>
      <li><strong>Tier 1 (Unit &amp; Component Tests):</strong> Vitest for React components and <code>pytest</code> for algorithmic math engines, achieving &ge; 85% code coverage.</li>
      <li><strong>Tier 2 (API Contract Validation):</strong> Schema adherence tests via Prism mock servers and <code>pytest-asyncio</code> testing all 24 REST endpoints.</li>
      <li><strong>Tier 3 (End-to-End User Journeys):</strong> Playwright browser test suites validating candidate quiz flows, ITI placement CSV uploads, and DSEEI approval journeys.</li>
      <li><strong>Tier 4 (Security &amp; RBAC Scope Tests):</strong> Automated OWASP ZAP vulnerability scans and penetration checks enforcing cross-district jurisdictional isolation.</li>
      <li><strong>Tier 5 (Accessibility &amp; GIGW Compliance):</strong> Automated <code>axe-core</code> testing achieving 100% compliance with WCAG 2.1 AA and Government of India Guidelines for Websites (GIGW).</li>
      <li><strong>Tier 6 (Performance &amp; Load Tests):</strong> Locust and k6 simulations running 1,000 concurrent virtual users under peak dashboard and API load.</li>
    </ul>
  </div>
</div>

<div class="page-break"></div>

<!-- PAGE 13: CHAPTER 13 -->
<div class="chapter-header">
  <h2 class="chapter-title">Chapter 13: Production Deployment, Air-Gapped Cloud &amp; Disaster Recovery</h2>
  <span class="chapter-badge">DevOps &amp; SRE</span>
</div>

<div class="concept-box">
  <div class="concept-title">💡 Plain English Concept &mdash; Where does the software live, and what happens if a server dies?</div>
  <div class="concept-body">
    MahaSkills is designed to run completely inside the Maharashtra State Data Centre (MahaGovCloud). It does not rely on third-party commercial APIs (like OpenAI or cloud databases in foreign countries) that can be blocked or charge unpredictable fees. Even if internet connectivity between the state data centre and the outside world is temporarily severed, all local analytics, databases, and AI models continue running smoothly.
  </div>
</div>

{DIAGRAM_12_CLOUD_TOPOLOGY}

<div class="tech-box">
  <div class="tech-title">⚙️ Cloud Topology, Auto-Scaling &amp; Recovery RTO/RPO Metrics</div>
  <div class="tech-body">
    <ul>
      <li><strong>Stateless Horizontal Auto-Scaling:</strong> FastAPI backend instances run inside stateless Docker containers orchestrated via Kubernetes / AWS ECS with Horizontal Pod Autoscaler (HPA) triggered at 70% CPU threshold.</li>
      <li><strong>Database High Availability:</strong> PostgreSQL 16 operates in a primary-replica topology behind an HAProxy pool. 85% of read queries hit Redis 7 in-memory cache with 15-minute TTLs.</li>
      <li><strong>Air-Gapped Sovereign AI Execution:</strong> Embeddings run locally via <code>sentence-transformers</code> inside Python workers; natural language queries run via local Llama-3-8B on Ollama/vLLM with <strong>zero external API bill</strong> and 100% data residency.</li>
      <li><strong>Disaster Recovery Standards:</strong> Automated nightly database snapshots and WAL-G streaming replication to cold S3 object storage guarantee a <strong>Recovery Point Objective (RPO) &le; 15 minutes</strong> and a <strong>Recovery Time Objective (RTO) &le; 30 minutes</strong>.</li>
    </ul>
  </div>
</div>

<div class="page-break"></div>

<!-- PAGE 14: CHAPTER 14 -->
<div class="chapter-header">
  <h2 class="chapter-title">Chapter 14: Architectural Decision Records (ADRs) &amp; Executive Summary</h2>
  <span class="chapter-badge">Governance &amp; ROI</span>
</div>

<div class="tech-box">
  <div class="tech-title">⚙️ Canonical Architecture Decision Records (ADR Summary)</div>
  <div class="tech-body">
    <table class="spec-table">
      <tr>
        <th style="width: 15%;">ADR Code</th>
        <th style="width: 25%;">Decision</th>
        <th>Rationale &amp; Trade-Off Analysis</th>
      </tr>
      <tr>
        <td><strong>ADR-001</strong></td>
        <td>React 18 + TypeScript Strict</td>
        <td>Guarantees compile-time type safety across all 36 district dashboards, preventing runtime UI crashes and enforcing clean frontend architecture.</td>
      </tr>
      <tr>
        <td><strong>ADR-002</strong></td>
        <td>Keycloak 24 OIDC (RS256)</td>
        <td>Provides self-hosted, sovereign IAM federating with state Mahaswayam SSO while enforcing multi-tenant RBAC across 7 platform roles.</td>
      </tr>
      <tr>
        <td><strong>ADR-003</strong></td>
        <td>TanStack Query v5</td>
        <td>Eliminates duplicate network round-trips for high-volume district statistics via automatic cache invalidation and background optimistic updates.</td>
      </tr>
      <tr>
        <td><strong>ADR-004</strong></td>
        <td>PostgreSQL 16 + pgvector</td>
        <td>Colocates relational transactional data with dense AI vector embeddings in a single ACID engine, avoiding costly third-party SaaS vector databases.</td>
      </tr>
      <tr>
        <td><strong>ADR-005</strong></td>
        <td>HMAC-SHA256 Pseudonymization</td>
        <td>Enforces zero-plaintext candidate PII storage in compliance with Section 8(6) of the Digital Personal Data Protection (DPDP) Act 2023.</td>
      </tr>
      <tr>
        <td><strong>ADR-006</strong></td>
        <td>OpenAPI Contract-First</td>
        <td>Makes <code>openapi.yaml</code> the immutable contract between backend and frontend, eliminating integration defects before code is merged.</td>
      </tr>
    </table>
  </div>
</div>

<div class="policy-box">
  <div class="policy-title">🏛️ Executive ROI &amp; Value Proposition for the Government of Maharashtra</div>
  <div class="policy-body">
    MahaSkills delivers a transformational socio-economic return on investment for the state:<br>
    <strong>1. Placement Acceleration (+24%):</strong> Redirects over 15,000 trainees annually from low-wage, saturated jobs into high-paying modern manufacturing and tech trades.<br>
    <strong>2. Fiscal Efficiency:</strong> Eliminates wasteful public capex on obsolete workshop equipment by coupling the Automated ITI Equipment Gap Auditor directly to DSEEI budget sanctions.<br>
    <strong>3. Syllabus Agility (180 &rarr; 21 Days):</strong> Transforms vocational education in Maharashtra from a slow 5-year committee cycle into an agile, dynamic system synchronized with real industry hiring demand across all 36 districts.
  </div>
</div>
"""
