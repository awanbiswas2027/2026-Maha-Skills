# -*- coding: utf-8 -*-
"""
Diagrams 5 to 8 for MahaSkills Master Guide.
"""

DIAGRAM_5_DPDP_PIPELINE = """
<div class="diagram-container">
  <div class="diagram-title-row">
    <span class="diagram-heading">Diagram 5: DPDP Act 2023 Cryptographic Pseudonymization Pipeline</span>
    <span class="diagram-source">Source: docs/05-security/DATA_PRIVACY.md</span>
  </div>
  <svg width="100%" height="80" viewBox="0 0 740 80" xmlns="http://www.w3.org/2000/svg">
    <rect width="740" height="80" fill="#f8fafc" rx="5" />
    <g transform="translate(20, 15)">
      <rect width="140" height="50" rx="4" fill="#dc2626" />
      <text x="70" y="18" fill="#ffffff" font-size="8" font-weight="bold" text-anchor="middle">Raw Placement CSV</text>
      <text x="70" y="30" fill="#fecaca" font-size="7" text-anchor="middle">student_roll_no: MH-4029</text>
      <text x="70" y="42" fill="#fecaca" font-size="6.5" text-anchor="middle">Contains Direct PII</text>
    </g>
    <path d="M 160 40 L 195 40" stroke="#0284c7" stroke-width="1.5" />
    <g transform="translate(195, 15)">
      <rect width="160" height="50" rx="4" fill="#0284c7" />
      <text x="80" y="18" fill="#ffffff" font-size="8" font-weight="bold" text-anchor="middle">STREAMING PARSER</text>
      <text x="80" y="30" fill="#e0f2fe" font-size="7.5" font-weight="600" text-anchor="middle">Celery Ingestion Worker</text>
      <text x="80" y="42" fill="#bae6fd" font-size="6.5" text-anchor="middle">In-Memory (No Disk Write)</text>
    </g>
    <path d="M 355 40 L 390 40" stroke="#0284c7" stroke-width="1.5" />
    <g transform="translate(390, 15)">
      <rect width="160" height="50" rx="4" fill="#0369a1" />
      <text x="80" y="18" fill="#ffffff" font-size="8" font-weight="bold" text-anchor="middle">CRYPTO ENCLAVE (HSM)</text>
      <text x="80" y="30" fill="#e0f2fe" font-size="7.5" font-weight="600" text-anchor="middle">HMAC-SHA256 Engine</text>
      <text x="80" y="42" fill="#bae6fd" font-size="6.5" text-anchor="middle">Salt: DPDP_TENANT_SALT</text>
    </g>
    <path d="M 550 40 L 585 40" stroke="#0284c7" stroke-width="1.5" />
    <g transform="translate(585, 15)">
      <rect width="135" height="50" rx="4" fill="#059669" />
      <text x="67" y="18" fill="#ffffff" font-size="8" font-weight="bold" text-anchor="middle">SECURE RELATIONAL DB</text>
      <text x="67" y="30" fill="#a7f3d0" font-size="7.5" font-weight="600" text-anchor="middle">candidate_hash</text>
      <text x="67" y="42" fill="#ecfdf5" font-size="6.5" text-anchor="middle">e3b0c442... (Non-reversible)</text>
    </g>
  </svg>
  <div class="diagram-caption">Data privacy pipeline: Raw student roll numbers are converted to irreversible cryptographic hashes in volatile memory prior to database insertion. Raw PII touches zero disk blocks.</div>
</div>
"""

DIAGRAM_6_INGESTION_AIRFLOW = """
<div class="diagram-container">
  <div class="diagram-title-row">
    <span class="diagram-heading">Diagram 6: Automated Ingestion & Pipeline Orchestration (Apache Airflow)</span>
    <span class="diagram-source">Source: docs/06-data/DATA_INGESTION.md</span>
  </div>
  <svg width="100%" height="85" viewBox="0 0 740 85" xmlns="http://www.w3.org/2000/svg">
    <rect width="740" height="85" fill="#f8fafc" rx="5" />
    <g transform="translate(15, 12)">
      <rect width="155" height="60" rx="4" fill="#1e293b" />
      <text x="77" y="18" fill="#38bdf8" font-size="8" font-weight="bold" text-anchor="middle">EXTERNAL DATA FEEDS</text>
      <text x="77" y="32" fill="#ffffff" font-size="7" text-anchor="middle">&bull; NCS Open API / Job Portals</text>
      <text x="77" y="44" fill="#ffffff" font-size="7" text-anchor="middle">&bull; Monthly ITI Placement CSVs</text>
      <text x="77" y="56" fill="#ffffff" font-size="7" text-anchor="middle">&bull; Employer Skill Demand Forms</text>
    </g>
    <path d="M 170 42 L 205 42" stroke="#0284c7" stroke-width="1.5" />
    <g transform="translate(205, 12)">
      <rect width="265" height="60" rx="4" fill="#0369a1" />
      <text x="132" y="18" fill="#ffffff" font-size="8.5" font-weight="bold" text-anchor="middle">AIRFLOW 2.8 PIPELINE ORCHESTRATION</text>
      <text x="132" y="32" fill="#e0f2fe" font-size="7" text-anchor="middle">DAG 1: lmi_nightly_job_scraping (02:00 IST &middot; SLA &le; 120m)</text>
      <text x="132" y="44" fill="#e0f2fe" font-size="7" text-anchor="middle">DAG 2: placement_validation_worker (Streaming Celery)</text>
      <text x="132" y="56" fill="#e0f2fe" font-size="7" text-anchor="middle">DAG 3: taxonomy_nlp_enrichment (04:00 IST &middot; SLA &le; 60m)</text>
    </g>
    <path d="M 470 42 L 505 42" stroke="#0284c7" stroke-width="1.5" />
    <g transform="translate(505, 12)">
      <rect width="220" height="60" rx="4" fill="#065f46" />
      <text x="110" y="18" fill="#a7f3d0" font-size="8.5" font-weight="bold" text-anchor="middle">STORAGE &amp; ANALYTICS</text>
      <text x="110" y="32" fill="#ffffff" font-size="7" text-anchor="middle">&bull; MinIO/S3 (Raw Dumps &amp; Dossiers)</text>
      <text x="110" y="44" fill="#ffffff" font-size="7" text-anchor="middle">&bull; PostgreSQL 16 (Relational &amp; Vector)</text>
      <text x="110" y="56" fill="#ffffff" font-size="7" text-anchor="middle">&bull; Elasticsearch 8 (BM25 Synonyms)</text>
    </g>
  </svg>
  <div class="diagram-caption">Data pipeline architecture: Scheduled Airflow DAGs isolate batch processing and scraping workloads, guaranteeing zero latency interference with the live user-facing FastAPI application.</div>
</div>
"""

DIAGRAM_7_RAG_PIPELINE = """
<div class="diagram-container">
  <div class="diagram-title-row">
    <span class="diagram-heading">Diagram 7: Deterministic Grounded RAG Pipeline Architecture</span>
    <span class="diagram-source">Source: docs/01-product/USER_STORIES.md & docs/02-architecture/SYSTEM_ARCHITECTURE.md</span>
  </div>
  <svg width="100%" height="95" viewBox="0 0 740 95" xmlns="http://www.w3.org/2000/svg">
    <rect width="740" height="95" fill="#f8fafc" rx="5" />
    <defs>
      <marker id="arr7" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
        <path d="M 0 1 L 10 5 L 0 9 z" fill="#0284c7" />
      </marker>
    </defs>
    <!-- User Query -->
    <g transform="translate(10, 20)">
      <rect width="115" height="55" rx="4" fill="#0f172a" />
      <text x="57" y="16" fill="#38bdf8" font-size="7.5" font-weight="bold" text-anchor="middle">USER QUERY</text>
      <text x="57" y="28" fill="#ffffff" font-size="7" text-anchor="middle">Marathi / English</text>
      <text x="57" y="40" fill="#94a3b8" font-size="6.5" text-anchor="middle">"नागपूर सोलर कोर्सेस"</text>
    </g>
    <line x1="125" y1="47" x2="148" y2="47" stroke="#0284c7" stroke-width="2" marker-end="url(#arr7)" />

    <!-- Step 1 Intent -->
    <g transform="translate(150, 20)">
      <rect width="125" height="55" rx="4" fill="#1e293b" />
      <text x="62" y="16" fill="#38bdf8" font-size="7.5" font-weight="bold" text-anchor="middle">1. FILTER EXTRACTION</text>
      <text x="62" y="28" fill="#ffffff" font-size="7" text-anchor="middle">Entity Parsing</text>
      <text x="62" y="40" fill="#94a3b8" font-size="6.5" text-anchor="middle">district = "Nagpur"</text>
      <text x="62" y="50" fill="#94a3b8" font-size="6.5" text-anchor="middle">sector = "Green Energy"</text>
    </g>
    <line x1="275" y1="47" x2="298" y2="47" stroke="#0284c7" stroke-width="2" marker-end="url(#arr7)" />

    <!-- Step 2 Hybrid Retrieval -->
    <g transform="translate(300, 20)">
      <rect width="135" height="55" rx="4" fill="#0369a1" />
      <text x="67" y="16" fill="#e0f2fe" font-size="7.5" font-weight="bold" text-anchor="middle">2. HYBRID RETRIEVAL</text>
      <text x="67" y="28" fill="#ffffff" font-size="7" text-anchor="middle">pgvector Dense (384d)</text>
      <text x="67" y="40" fill="#bae6fd" font-size="6.5" text-anchor="middle">+ Relational SQL Filters</text>
      <text x="67" y="50" fill="#bae6fd" font-size="6.5" text-anchor="middle">Verified Course/Batch DB</text>
    </g>
    <line x1="435" y1="47" x2="458" y2="47" stroke="#0284c7" stroke-width="2" marker-end="url(#arr7)" />

    <!-- Step 3 Injected Prompt -->
    <g transform="translate(460, 20)">
      <rect width="135" height="55" rx="4" fill="#0284c7" />
      <text x="67" y="16" fill="#f0f9ff" font-size="7.5" font-weight="bold" text-anchor="middle">3. CONTEXT INJECTION</text>
      <text x="67" y="28" fill="#ffffff" font-size="7" text-anchor="middle">Mandatory Grounding</text>
      <text x="67" y="40" fill="#e0f2fe" font-size="6.5" text-anchor="middle">Local Llama-3 / Ollama</text>
      <text x="67" y="50" fill="#e0f2fe" font-size="6.5" text-anchor="middle">"Answer ONLY from context"</text>
    </g>
    <line x1="595" y1="47" x2="618" y2="47" stroke="#0284c7" stroke-width="2" marker-end="url(#arr7)" />

    <!-- Step 4 Citation Check -->
    <g transform="translate(620, 20)">
      <rect width="110" height="55" rx="4" fill="#059669" />
      <text x="55" y="16" fill="#a7f3d0" font-size="7.5" font-weight="bold" text-anchor="middle">4. CITATION VERIFY</text>
      <text x="55" y="28" fill="#ffffff" font-size="7" text-anchor="middle">Regex Claim Validation</text>
      <text x="55" y="40" fill="#ecfdf5" font-size="6.5" text-anchor="middle">Refuses if unverified</text>
      <text x="55" y="50" fill="#ecfdf5" font-size="6.5" text-anchor="middle">Source Clickable Chips</text>
    </g>
  </svg>
  <div class="diagram-caption">Deterministic RAG pipeline: Eliminates hallucinations by extracting relational filters, executing hybrid SQL/vector lookups, and enforcing post-generation citation verification.</div>
</div>
"""

DIAGRAM_8_STRIDE_SECURITY = """
<div class="diagram-container">
  <div class="diagram-title-row">
    <span class="diagram-heading">Diagram 8: STRIDE Threat Assessment & Security Defense Perimeter</span>
    <span class="diagram-source">Source: docs/05-security/THREAT_MODEL.md</span>
  </div>
  <svg width="100%" height="80" viewBox="0 0 740 80" xmlns="http://www.w3.org/2000/svg">
    <rect width="740" height="80" fill="#f8fafc" rx="5" />
    <g transform="translate(10, 15)">
      <rect width="70" height="50" rx="4" fill="#dc2626" />
      <text x="35" y="28" fill="#ffffff" font-size="8.5" font-weight="bold" text-anchor="middle">Adversary</text>
    </g>
    <path d="M 80 40 L 95 40" stroke="#64748b" stroke-width="1.5" />
    <g transform="translate(95, 15)">
      <rect width="120" height="50" rx="3" fill="#1e293b" />
      <text x="60" y="18" fill="#ffffff" font-size="7.5" font-weight="bold" text-anchor="middle">1. Token Forgery</text>
      <text x="60" y="30" fill="#94a3b8" font-size="6.5" text-anchor="middle">&rarr; Keycloak IAM</text>
      <text x="60" y="42" fill="#38bdf8" font-size="6" text-anchor="middle">Defense: RS256 JWKS Gate</text>
    </g>
    <g transform="translate(225, 15)">
      <rect width="120" height="50" rx="3" fill="#1e293b" />
      <text x="60" y="18" fill="#ffffff" font-size="7.5" font-weight="bold" text-anchor="middle">2. Malicious CSV Upload</text>
      <text x="60" y="30" fill="#94a3b8" font-size="6.5" text-anchor="middle">&rarr; Ingestion Worker</text>
      <text x="60" y="42" fill="#38bdf8" font-size="6" text-anchor="middle">Defense: 100MB Stream &amp; Sandboxing</text>
    </g>
    <g transform="translate(355, 15)">
      <rect width="120" height="50" rx="3" fill="#1e293b" />
      <text x="60" y="18" fill="#ffffff" font-size="7.5" font-weight="bold" text-anchor="middle">3. Cross-District Spoof</text>
      <text x="60" y="30" fill="#94a3b8" font-size="6.5" text-anchor="middle">&rarr; API Gateway</text>
      <text x="60" y="42" fill="#38bdf8" font-size="6" text-anchor="middle">Defense: TenantScopeGuard</text>
    </g>
    <g transform="translate(485, 15)">
      <rect width="120" height="50" rx="3" fill="#1e293b" />
      <text x="60" y="18" fill="#ffffff" font-size="7.5" font-weight="bold" text-anchor="middle">4. Scraper Poisoning</text>
      <text x="60" y="30" fill="#94a3b8" font-size="6.5" text-anchor="middle">&rarr; LMI Airflow Fleet</text>
      <text x="60" y="42" fill="#38bdf8" font-size="6" text-anchor="middle">Defense: 300% Spike Breakers</text>
    </g>
    <g transform="translate(615, 15)">
      <rect width="115" height="50" rx="3" fill="#1e293b" />
      <text x="57" y="18" fill="#ffffff" font-size="7.5" font-weight="bold" text-anchor="middle">5. Data Exfiltration</text>
      <text x="57" y="30" fill="#94a3b8" font-size="6.5" text-anchor="middle">&rarr; PostgreSQL Store</text>
      <text x="57" y="42" fill="#38bdf8" font-size="6" text-anchor="middle">Defense: HMAC-SHA256 Crypto</text>
    </g>
  </svg>
  <div class="diagram-caption">STRIDE threat coverage: Explicit perimeter defenses address all 5 adversary attack vectors across authentication, data upload, scraping, and storage tiers.</div>
</div>
"""
