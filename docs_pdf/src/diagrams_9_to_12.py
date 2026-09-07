# -*- coding: utf-8 -*-
"""
Diagrams 9 to 12 for MahaSkills Master Guide.
"""

DIAGRAM_9_STATE_MACHINE = """
<div class="diagram-container">
  <div class="diagram-title-row">
    <span class="diagram-heading">Diagram 9: Curriculum Recommendation Governance State Machine</span>
    <span class="diagram-source">Source: docs/02-architecture/BACKEND_ARCHITECTURE.md</span>
  </div>
  <svg width="100%" height="75" viewBox="0 0 740 75" xmlns="http://www.w3.org/2000/svg">
    <rect width="740" height="75" fill="#f8fafc" rx="5" />
    <g transform="translate(15, 12)">
      <rect width="125" height="50" rx="4" fill="#0f172a" />
      <text x="62" y="20" fill="#94a3b8" font-size="7" font-weight="bold" text-anchor="middle">STATUS 1</text>
      <text x="62" y="33" fill="#ffffff" font-size="8.5" font-weight="bold" text-anchor="middle">DRAFT</text>
      <text x="62" y="45" fill="#38bdf8" font-size="6.5" text-anchor="middle">Persistent Gap &gt; 60</text>
    </g>
    <path d="M 140 37 L 170 37" stroke="#0284c7" stroke-width="1.5" />
    <g transform="translate(170, 12)">
      <rect width="135" height="50" rx="4" fill="#0369a1" />
      <text x="67" y="20" fill="#bae6fd" font-size="7" font-weight="bold" text-anchor="middle">STATUS 2</text>
      <text x="67" y="33" fill="#ffffff" font-size="8.5" font-weight="bold" text-anchor="middle">UNDER_SSC_REVIEW</text>
      <text x="67" y="45" fill="#e0f2fe" font-size="6.5" text-anchor="middle">Technical Dossier Review</text>
    </g>
    <path d="M 305 37 L 335 37" stroke="#0284c7" stroke-width="1.5" />
    <g transform="translate(335, 12)">
      <rect width="130" height="50" rx="4" fill="#0284c7" />
      <text x="65" y="20" fill="#e0f2fe" font-size="7" font-weight="bold" text-anchor="middle">STATUS 3</text>
      <text x="65" y="33" fill="#ffffff" font-size="8.5" font-weight="bold" text-anchor="middle">SSC_APPROVED</text>
      <text x="65" y="45" fill="#f0f9ff" font-size="6.5" text-anchor="middle">Tech Committee Sign-off</text>
    </g>
    <path d="M 465 37 L 495 37" stroke="#0284c7" stroke-width="1.5" />
    <g transform="translate(495, 12)">
      <rect width="135" height="50" rx="4" fill="#047857" />
      <text x="67" y="20" fill="#a7f3d0" font-size="7" font-weight="bold" text-anchor="middle">STATUS 4</text>
      <text x="67" y="33" fill="#ffffff" font-size="8.5" font-weight="bold" text-anchor="middle">DSEEI_APPROVAL</text>
      <text x="67" y="45" fill="#ecfdf5" font-size="6.5" text-anchor="middle">Joint Secretary Sanction</text>
    </g>
    <path d="M 630 37 L 650 37" stroke="#0284c7" stroke-width="1.5" />
    <g transform="translate(650, 12)">
      <rect width="75" height="50" rx="4" fill="#065f46" />
      <text x="37" y="20" fill="#a7f3d0" font-size="7" font-weight="bold" text-anchor="middle">STATUS 5</text>
      <text x="37" y="33" fill="#ffffff" font-size="7.5" font-weight="bold" text-anchor="middle">PUBLISHED</text>
      <text x="37" y="45" fill="#ecfdf5" font-size="6.5" text-anchor="middle">Live to ITIs</text>
    </g>
  </svg>
  <div class="diagram-caption">Governance state machine: Guarantees no automated model can unilaterally alter official vocational curriculum without accredited Sector Skill Council validation and formal DSEEI administrative sanction.</div>
</div>
"""

DIAGRAM_10_ERD = """
<div class="diagram-container">
  <div class="diagram-title-row">
    <span class="diagram-heading">Diagram 10: Core Relational &amp; Vector Entity-Relationship Model (ERD)</span>
    <span class="diagram-source">Source: docs/02-architecture/DATABASE_SCHEMA.md</span>
  </div>
  <svg width="100%" height="80" viewBox="0 0 740 80" xmlns="http://www.w3.org/2000/svg">
    <rect width="740" height="80" fill="#f8fafc" rx="5" />
    <!-- District -->
    <g transform="translate(15, 10)">
      <rect width="105" height="52" rx="4" fill="#0f172a" />
      <text x="52" y="16" fill="#38bdf8" font-size="8.5" font-weight="bold" text-anchor="middle">DISTRICTS (36)</text>
      <text x="52" y="28" fill="#ffffff" font-size="7" text-anchor="middle">id, name, division</text>
      <text x="52" y="38" fill="#94a3b8" font-size="6.5" text-anchor="middle">geom (PostGIS polygon)</text>
    </g>
    <path d="M 120 36 L 150 36" stroke="#0284c7" stroke-width="1.5" />
    <!-- Institutes -->
    <g transform="translate(150, 10)">
      <rect width="115" height="52" rx="4" fill="#1e293b" />
      <text x="57" y="16" fill="#38bdf8" font-size="8.5" font-weight="bold" text-anchor="middle">INSTITUTES (417+)</text>
      <text x="57" y="28" fill="#ffffff" font-size="7" text-anchor="middle">id, code, district_id</text>
      <text x="57" y="38" fill="#94a3b8" font-size="6.5" text-anchor="middle">principal_id (FK)</text>
    </g>
    <path d="M 265 36 L 295 36" stroke="#0284c7" stroke-width="1.5" />
    <!-- Courses -->
    <g transform="translate(295, 10)">
      <rect width="130" height="52" rx="4" fill="#0369a1" />
      <text x="65" y="16" fill="#bae6fd" font-size="8.5" font-weight="bold" text-anchor="middle">COURSES &amp; TRADES</text>
      <text x="65" y="28" fill="#ffffff" font-size="7" text-anchor="middle">id, trade_code, nsqf_level</text>
      <text x="65" y="38" fill="#e0f2fe" font-size="6.5" text-anchor="middle">embedding (pgvector 384d)</text>
    </g>
    <path d="M 425 36 L 455 36" stroke="#0284c7" stroke-width="1.5" />
    <!-- Gap Scores -->
    <g transform="translate(455, 10)">
      <rect width="130" height="52" rx="4" fill="#0284c7" />
      <text x="65" y="16" fill="#e0f2fe" font-size="8.5" font-weight="bold" text-anchor="middle">GAP_SCORES</text>
      <text x="65" y="28" fill="#ffffff" font-size="7" text-anchor="middle">course_id, district_id</text>
      <text x="65" y="38" fill="#f0f9ff" font-size="6.5" text-anchor="middle">gap_score (0.00-1.00), oversupply</text>
    </g>
    <path d="M 585 36 L 615 36" stroke="#0284c7" stroke-width="1.5" />
    <!-- Recommendations -->
    <g transform="translate(615, 10)">
      <rect width="115" height="52" rx="4" fill="#047857" />
      <text x="57" y="16" fill="#a7f3d0" font-size="8.5" font-weight="bold" text-anchor="middle">RECOMMENDATIONS</text>
      <text x="57" y="28" fill="#ffffff" font-size="7" text-anchor="middle">id, status (State Machine)</text>
      <text x="57" y="38" fill="#ecfdf5" font-size="6.5" text-anchor="middle">evidence_dossier_url (S3)</text>
    </g>
  </svg>
  <div class="diagram-caption">Relational entity graph: PostGIS geospatial district boundaries join with pgvector semantic course embeddings and partitioned placement returns.</div>
</div>
"""

DIAGRAM_11_TESTING_PYRAMID = """
<div class="diagram-container">
  <div class="diagram-title-row">
    <span class="diagram-heading">Diagram 11: MahaSkills Multi-Layer Quality &amp; Verification Pyramid</span>
    <span class="diagram-source">Source: docs/07-development/TESTING_STRATEGY.md</span>
  </div>
  <svg width="100%" height="95" viewBox="0 0 740 95" xmlns="http://www.w3.org/2000/svg">
    <rect width="740" height="95" fill="#f8fafc" rx="5" />
    <!-- Tier 6 -->
    <g transform="translate(230, 4)">
      <rect width="280" height="13" rx="2" fill="#0f172a" />
      <text x="140" y="10" fill="#ffffff" font-size="7" font-weight="bold" text-anchor="middle">6. Performance &amp; Load Tests (Locust, k6 &mdash; 1000 concurrent VUs)</text>
    </g>
    <!-- Tier 5 -->
    <g transform="translate(205, 19)">
      <rect width="330" height="13" rx="2" fill="#1e293b" />
      <text x="165" y="10" fill="#ffffff" font-size="7" font-weight="bold" text-anchor="middle">5. Accessibility &amp; GIGW Compliance (axe-core, WCAG 2.1 AA &mdash; 0 violations)</text>
    </g>
    <!-- Tier 4 -->
    <g transform="translate(180, 34)">
      <rect width="380" height="13" rx="2" fill="#0369a1" />
      <text x="190" y="10" fill="#ffffff" font-size="7" font-weight="bold" text-anchor="middle">4. Security &amp; RBAC Scope Tests (pytest-security, OWASP ZAP, HMAC checks)</text>
    </g>
    <!-- Tier 3 -->
    <g transform="translate(155, 49)">
      <rect width="430" height="13" rx="2" fill="#0284c7" />
      <text x="215" y="10" fill="#ffffff" font-size="7" font-weight="bold" text-anchor="middle">3. End-to-End User Journeys (Playwright &mdash; Candidate, ITI, DSEEI flows)</text>
    </g>
    <!-- Tier 2 -->
    <g transform="translate(130, 64)">
      <rect width="480" height="13" rx="2" fill="#059669" />
      <text x="240" y="10" fill="#ffffff" font-size="7" font-weight="bold" text-anchor="middle">2. API Contract &amp; Schema Validation (@stoplight/spectral-cli, Prism mock, pytest-asyncio)</text>
    </g>
    <!-- Tier 1 -->
    <g transform="translate(105, 79)">
      <rect width="530" height="13" rx="2" fill="#047857" />
      <text x="265" y="10" fill="#ffffff" font-size="7" font-weight="bold" text-anchor="middle">1. Unit &amp; Component Tests (Vitest, React Testing Library, pytest algorithms &mdash; &ge;85% coverage)</text>
    </g>
  </svg>
  <div class="diagram-caption">Quality pyramid: Contract-first API linting and strict automated test suites ensure non-breaking schema sync across all 11 architectural domains.</div>
</div>
"""

DIAGRAM_12_CLOUD_TOPOLOGY = """
<div class="diagram-container">
  <div class="diagram-title-row">
    <span class="diagram-heading">Diagram 12: Production Infrastructure &amp; Cloud Deployment Topology</span>
    <span class="diagram-source">Source: docs/08-deployment/DEPLOYMENT.md & docs/02-architecture/SYSTEM_ARCHITECTURE.md</span>
  </div>
  <svg width="100%" height="95" viewBox="0 0 740 95" xmlns="http://www.w3.org/2000/svg">
    <rect width="740" height="95" fill="#f8fafc" rx="5" />
    <defs>
      <marker id="arr12" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
        <path d="M 0 1 L 10 5 L 0 9 z" fill="#0284c7" />
      </marker>
    </defs>
    <!-- Ingress -->
    <g transform="translate(10, 20)">
      <rect width="110" height="55" rx="4" fill="#0f172a" />
      <text x="55" y="16" fill="#38bdf8" font-size="7.5" font-weight="bold" text-anchor="middle">EDGE / CDN</text>
      <text x="55" y="28" fill="#ffffff" font-size="7" text-anchor="middle">CloudFront / Nginx</text>
      <text x="55" y="40" fill="#94a3b8" font-size="6.5" text-anchor="middle">TLS 1.3 / WAF</text>
      <text x="55" y="50" fill="#94a3b8" font-size="6.5" text-anchor="middle">React SPA Bundle</text>
    </g>
    <line x1="120" y1="47" x2="145" y2="47" stroke="#0284c7" stroke-width="2" marker-end="url(#arr12)" />

    <!-- Gateway -->
    <g transform="translate(150, 20)">
      <rect width="125" height="55" rx="4" fill="#1e293b" />
      <text x="62" y="16" fill="#38bdf8" font-size="7.5" font-weight="bold" text-anchor="middle">API GATEWAY</text>
      <text x="62" y="28" fill="#ffffff" font-size="7" text-anchor="middle">FastAPI Cluster</text>
      <text x="62" y="40" fill="#94a3b8" font-size="6.5" text-anchor="middle">Kubernetes HPA</text>
      <text x="62" y="50" fill="#94a3b8" font-size="6.5" text-anchor="middle">Stateless Docker Pods</text>
    </g>
    <line x1="275" y1="47" x2="300" y2="47" stroke="#0284c7" stroke-width="2" marker-end="url(#arr12)" />

    <!-- Workers & Cache -->
    <g transform="translate(305, 20)">
      <rect width="135" height="55" rx="4" fill="#0369a1" />
      <text x="67" y="16" fill="#e0f2fe" font-size="7.5" font-weight="bold" text-anchor="middle">ASYNC FLEET &amp; CACHE</text>
      <text x="67" y="28" fill="#ffffff" font-size="7" text-anchor="middle">Celery Spot Workers</text>
      <text x="67" y="40" fill="#bae6fd" font-size="6.5" text-anchor="middle">Redis 7 Cluster (Broker)</text>
      <text x="67" y="50" fill="#bae6fd" font-size="6.5" text-anchor="middle">Local Sentence-Transformers</text>
    </g>
    <line x1="440" y1="47" x2="465" y2="47" stroke="#0284c7" stroke-width="2" marker-end="url(#arr12)" />

    <!-- Data Tier -->
    <g transform="translate(470, 20)">
      <rect width="135" height="55" rx="4" fill="#0284c7" />
      <text x="67" y="16" fill="#f0f9ff" font-size="7.5" font-weight="bold" text-anchor="middle">PRIMARY DATA TIER</text>
      <text x="67" y="28" fill="#ffffff" font-size="7" text-anchor="middle">PostgreSQL 16 + pgvector</text>
      <text x="67" y="40" fill="#e0f2fe" font-size="6.5" text-anchor="middle">PostGIS Spatial Bounds</text>
      <text x="67" y="50" fill="#e0f2fe" font-size="6.5" text-anchor="middle">HAProxy Read Replicas</text>
    </g>
    <line x1="605" y1="47" x2="630" y2="47" stroke="#0284c7" stroke-width="2" marker-end="url(#arr12)" />

    <!-- Search & Storage -->
    <g transform="translate(635, 20)">
      <rect width="95" height="55" rx="4" fill="#059669" />
      <text x="47" y="16" fill="#a7f3d0" font-size="7.5" font-weight="bold" text-anchor="middle">SEARCH &amp; S3</text>
      <text x="47" y="28" fill="#ffffff" font-size="6.5" text-anchor="middle">Elasticsearch 8</text>
      <text x="47" y="40" fill="#ecfdf5" font-size="6.5" text-anchor="middle">MinIO / S3 Store</text>
      <text x="47" y="50" fill="#ecfdf5" font-size="6.5" text-anchor="middle">CloudHSM Salt</text>
    </g>
  </svg>
  <div class="diagram-caption">Production topology: Sovereign air-gapped architecture on MahaGovCloud with isolated worker spot instances, read replicas, and zero external closed API dependencies.</div>
</div>
"""
