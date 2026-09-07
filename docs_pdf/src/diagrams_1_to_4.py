# -*- coding: utf-8 -*-
"""
Diagrams 1 to 4 for MahaSkills Master Guide.
"""

DIAGRAM_1_CLOSED_LOOP = """
<div class="diagram-container">
  <div class="diagram-title-row">
    <span class="diagram-heading">Diagram 1: End-to-End Closed-Loop Alignment Architecture</span>
    <span class="diagram-source">Source: docs/01-product/PRD.md & docs/02-architecture/SYSTEM_ARCHITECTURE.md</span>
  </div>
  <svg width="100%" height="110" viewBox="0 0 740 110" xmlns="http://www.w3.org/2000/svg">
    <rect width="740" height="110" fill="#f8fafc" rx="5" />
    <defs>
      <marker id="arr1" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
        <path d="M 0 1 L 10 5 L 0 9 z" fill="#0284c7" />
      </marker>
    </defs>
    
    <!-- Step 1 -->
    <g transform="translate(10, 10)">
      <rect width="105" height="50" rx="4" fill="#0f172a" />
      <text x="52" y="16" fill="#38bdf8" font-size="7.5" font-weight="bold" text-anchor="middle">STEP 1: INGEST</text>
      <text x="52" y="28" fill="#ffffff" font-size="8" font-weight="600" text-anchor="middle">Live Job Signals</text>
      <text x="52" y="38" fill="#94a3b8" font-size="6.5" text-anchor="middle">NCS, Naukri, LinkedIn</text>
    </g>
    <line x1="115" y1="35" x2="130" y2="35" stroke="#0284c7" stroke-width="2" marker-end="url(#arr1)" />

    <!-- Step 2 -->
    <g transform="translate(133, 10)">
      <rect width="105" height="50" rx="4" fill="#1e293b" />
      <text x="52" y="16" fill="#38bdf8" font-size="7.5" font-weight="bold" text-anchor="middle">STEP 2: MAP</text>
      <text x="52" y="28" fill="#ffffff" font-size="8" font-weight="600" text-anchor="middle">NLP Taxonomy</text>
      <text x="52" y="38" fill="#94a3b8" font-size="6.5" text-anchor="middle">spaCy / 2,200 NSQF</text>
    </g>
    <line x1="238" y1="35" x2="253" y2="35" stroke="#0284c7" stroke-width="2" marker-end="url(#arr1)" />

    <!-- Step 3 -->
    <g transform="translate(256, 10)">
      <rect width="105" height="50" rx="4" fill="#0369a1" />
      <text x="52" y="16" fill="#e0f2fe" font-size="7.5" font-weight="bold" text-anchor="middle">STEP 3: SCORE</text>
      <text x="52" y="28" fill="#ffffff" font-size="8" font-weight="600" text-anchor="middle">Quant Gap Engine</text>
      <text x="52" y="38" fill="#bae6fd" font-size="6.5" text-anchor="middle">0.00 – 1.00 Index</text>
    </g>
    <line x1="361" y1="35" x2="376" y2="35" stroke="#0284c7" stroke-width="2" marker-end="url(#arr1)" />

    <!-- Step 4 -->
    <g transform="translate(379, 10)">
      <rect width="105" height="50" rx="4" fill="#0284c7" />
      <text x="52" y="16" fill="#f0f9ff" font-size="7.5" font-weight="bold" text-anchor="middle">STEP 4: DOSSIER</text>
      <text x="52" y="28" fill="#ffffff" font-size="8" font-weight="600" text-anchor="middle">Curriculum Rec</text>
      <text x="52" y="38" fill="#e0f2fe" font-size="6.5" text-anchor="middle">12-Mo Evidence Graph</text>
    </g>
    <line x1="484" y1="35" x2="499" y2="35" stroke="#0284c7" stroke-width="2" marker-end="url(#arr1)" />

    <!-- Step 5 -->
    <g transform="translate(502, 10)">
      <rect width="105" height="50" rx="4" fill="#047857" />
      <text x="52" y="16" fill="#a7f3d0" font-size="7.5" font-weight="bold" text-anchor="middle">STEP 5: RATIFY</text>
      <text x="52" y="28" fill="#ffffff" font-size="8" font-weight="600" text-anchor="middle">SSC & DSEEI</text>
      <text x="52" y="38" fill="#ecfdf5" font-size="6.5" text-anchor="middle">State Review Machine</text>
    </g>
    <line x1="607" y1="35" x2="622" y2="35" stroke="#0284c7" stroke-width="2" marker-end="url(#arr1)" />

    <!-- Step 6 -->
    <g transform="translate(625, 10)">
      <rect width="105" height="50" rx="4" fill="#065f46" />
      <text x="52" y="16" fill="#a7f3d0" font-size="7.5" font-weight="bold" text-anchor="middle">STEP 6: ACT</text>
      <text x="52" y="28" fill="#ffffff" font-size="8" font-weight="600" text-anchor="middle">District Plans</text>
      <text x="52" y="38" fill="#ecfdf5" font-size="6.5" text-anchor="middle">ITI Seats & Capex</text>
    </g>

    <!-- Feedback Loop -->
    <path d="M 677 65 L 677 82 L 62 82 L 62 65" stroke="#d97706" stroke-width="1.8" stroke-dasharray="4,3" fill="none" />
    <text x="370" y="93" fill="#b45309" font-size="7" font-weight="bold" text-anchor="middle">&larr;&larr;&larr; Continuous Feedback Loop: Monthly ITI Placement Returns Validate Outcome Uplift &amp; Recalibrate Scoring Weights &larr;&larr;&larr;</text>
  </svg>
  <div class="diagram-caption">The complete closed-loop lifecycle: market signals are parsed, scored, synthesized into curriculum modifications, ratified by state review bodies, executed across 417+ ITIs, and continually evaluated via verified placement returns.</div>
</div>
"""

DIAGRAM_2_C4_SYSTEM = """
<div class="diagram-container">
  <div class="diagram-title-row">
    <span class="diagram-heading">Diagram 2: C4 Level 1 System Context Architecture</span>
    <span class="diagram-source">Source: docs/02-architecture/SYSTEM_ARCHITECTURE.md</span>
  </div>
  <svg width="100%" height="150" viewBox="0 0 740 150" xmlns="http://www.w3.org/2000/svg">
    <rect width="740" height="150" fill="#f8fafc" rx="5" />
    <!-- Actors Top -->
    <g transform="translate(10, 8)">
      <rect width="130" height="34" rx="4" fill="#1e293b" />
      <text x="65" y="14" fill="#ffffff" font-size="8.5" font-weight="bold" text-anchor="middle">Candidate / Trainee</text>
      <text x="65" y="25" fill="#94a3b8" font-size="7" text-anchor="middle">Pathway Quiz &amp; SSO</text>
    </g>
    <g transform="translate(155, 8)">
      <rect width="135" height="34" rx="4" fill="#1e293b" />
      <text x="67" y="14" fill="#ffffff" font-size="8.5" font-weight="bold" text-anchor="middle">Govt Official (DSEEI)</text>
      <text x="67" y="25" fill="#94a3b8" font-size="7" text-anchor="middle">Policy &amp; District Plans</text>
    </g>
    <g transform="translate(305, 8)">
      <rect width="130" height="34" rx="4" fill="#1e293b" />
      <text x="65" y="14" fill="#ffffff" font-size="8.5" font-weight="bold" text-anchor="middle">ITI Principal (417+)</text>
      <text x="65" y="25" fill="#94a3b8" font-size="7" text-anchor="middle">Placement CSV Returns</text>
    </g>
    <g transform="translate(450, 8)">
      <rect width="135" height="34" rx="4" fill="#1e293b" />
      <text x="67" y="14" fill="#ffffff" font-size="8.5" font-weight="bold" text-anchor="middle">Industry / Employer</text>
      <text x="67" y="25" fill="#94a3b8" font-size="7" text-anchor="middle">Hiring Demand Signals</text>
    </g>
    <g transform="translate(600, 8)">
      <rect width="130" height="34" rx="4" fill="#1e293b" />
      <text x="65" y="14" fill="#ffffff" font-size="8.5" font-weight="bold" text-anchor="middle">SSC Tech Reviewer</text>
      <text x="65" y="25" fill="#94a3b8" font-size="7" text-anchor="middle">Curriculum Dossiers</text>
    </g>
    <!-- Connectors -->
    <path d="M 75 42 L 75 54 L 370 54 L 370 62" stroke="#0284c7" stroke-width="1.2" fill="none" />
    <path d="M 222 42 L 222 54" stroke="#0284c7" stroke-width="1.2" fill="none" />
    <path d="M 370 42 L 370 62" stroke="#0284c7" stroke-width="1.2" fill="none" />
    <path d="M 517 42 L 517 54" stroke="#0284c7" stroke-width="1.2" fill="none" />
    <path d="M 665 42 L 665 54 L 370 54" stroke="#0284c7" stroke-width="1.2" fill="none" />
    <!-- Center Core System -->
    <g transform="translate(180, 60)">
      <rect width="380" height="36" rx="4" fill="#0284c7" stroke="#0369a1" stroke-width="1" />
      <text x="190" y="15" fill="#ffffff" font-size="11" font-weight="800" text-anchor="middle">MahaSkills Platform Core</text>
      <text x="190" y="27" fill="#e0f2fe" font-size="7.5" text-anchor="middle">FastAPI REST /v1 &middot; Gap Scoring Engine &middot; Celery Workers &middot; React 18 UI</text>
    </g>
    <!-- Bottom Connectors -->
    <path d="M 370 96 L 370 106" stroke="#059669" stroke-width="1.2" fill="none" />
    <path d="M 80 106 L 660 106" stroke="#059669" stroke-width="1.2" fill="none" />
    <path d="M 80 106 L 80 114" stroke="#059669" stroke-width="1.2" fill="none" />
    <path d="M 225 106 L 225 114" stroke="#059669" stroke-width="1.2" fill="none" />
    <path d="M 370 106 L 370 114" stroke="#059669" stroke-width="1.2" fill="none" />
    <path d="M 515 106 L 515 114" stroke="#059669" stroke-width="1.2" fill="none" />
    <path d="M 660 106 L 660 114" stroke="#059669" stroke-width="1.2" fill="none" />
    <!-- External Systems Bottom -->
    <g transform="translate(15, 114)">
      <rect width="130" height="30" rx="3" fill="#065f46" />
      <text x="65" y="13" fill="#ffffff" font-size="8" font-weight="bold" text-anchor="middle">Keycloak 24 IAM</text>
      <text x="65" y="23" fill="#a7f3d0" font-size="6.5" text-anchor="middle">OIDC / RS256 / RBAC</text>
    </g>
    <g transform="translate(160, 114)">
      <rect width="130" height="30" rx="3" fill="#065f46" />
      <text x="65" y="13" fill="#ffffff" font-size="8" font-weight="bold" text-anchor="middle">Mahaswayam Portal</text>
      <text x="65" y="23" fill="#a7f3d0" font-size="6.5" text-anchor="middle">State Training SSO</text>
    </g>
    <g transform="translate(305, 114)">
      <rect width="130" height="30" rx="3" fill="#065f46" />
      <text x="65" y="13" fill="#ffffff" font-size="8" font-weight="bold" text-anchor="middle">NCS Open API</text>
      <text x="65" y="23" fill="#a7f3d0" font-size="6.5" text-anchor="middle">National Vacancies</text>
    </g>
    <g transform="translate(450, 114)">
      <rect width="130" height="30" rx="3" fill="#065f46" />
      <text x="65" y="13" fill="#ffffff" font-size="8" font-weight="bold" text-anchor="middle">Job Aggregators</text>
      <text x="65" y="23" fill="#a7f3d0" font-size="6.5" text-anchor="middle">Naukri / LinkedIn / Indeed</text>
    </g>
    <g transform="translate(595, 114)">
      <rect width="130" height="30" rx="3" fill="#065f46" />
      <text x="65" y="13" fill="#ffffff" font-size="8" font-weight="bold" text-anchor="middle">NCVET / NSDC</text>
      <text x="65" y="23" fill="#a7f3d0" font-size="6.5" text-anchor="middle">National Qual Registers</text>
    </g>
  </svg>
  <div class="diagram-caption">C4 Level 1 context model: Ingesting high-frequency vacancy feeds & institutional returns into MahaSkills, feeding policy makers, ITIs, and SSC reviewers while federating identity via Keycloak and Mahaswayam.</div>
</div>
"""

DIAGRAM_3_GAP_ENGINE = """
<div class="diagram-container">
  <div class="diagram-title-row">
    <span class="diagram-heading">Diagram 3: Algorithmic Gap & Obsolescence Scoring Pipeline</span>
    <span class="diagram-source">Source: docs/01-product/PRD.md & docs/02-architecture/BACKEND_ARCHITECTURE.md</span>
  </div>
  <svg width="100%" height="110" viewBox="0 0 740 110" xmlns="http://www.w3.org/2000/svg">
    <rect width="740" height="110" fill="#f8fafc" rx="5" />
    <defs>
      <marker id="arr3" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
        <path d="M 0 1 L 10 5 L 0 9 z" fill="#0284c7" />
      </marker>
    </defs>
    <!-- Inputs -->
    <g transform="translate(10, 10)">
      <rect width="150" height="20" rx="3" fill="#0f172a" />
      <text x="75" y="14" fill="#ffffff" font-size="7.5" font-weight="bold" text-anchor="middle">12-Mo Vacancy Volume (V_12mo)</text>
    </g>
    <g transform="translate(10, 34)">
      <rect width="150" height="20" rx="3" fill="#0f172a" />
      <text x="75" y="14" fill="#ffffff" font-size="7.5" font-weight="bold" text-anchor="middle">Regional Wage Premium (ΔW)</text>
    </g>
    <g transform="translate(10, 58)">
      <rect width="150" height="20" rx="3" fill="#0f172a" />
      <text x="75" y="14" fill="#ffffff" font-size="7.5" font-weight="bold" text-anchor="middle">Cosine Syllabus Drift (Dist_cos)</text>
    </g>
    <g transform="translate(10, 82)">
      <rect width="150" height="20" rx="3" fill="#0f172a" />
      <text x="75" y="14" fill="#ffffff" font-size="7.5" font-weight="bold" text-anchor="middle">Historical Placement Rate (P_rate)</text>
    </g>

    <!-- Connectors to Weights -->
    <path d="M 160 20 L 195 40" stroke="#0284c7" stroke-width="1.5" />
    <path d="M 160 44 L 195 48" stroke="#0284c7" stroke-width="1.5" />
    <path d="M 160 68 L 195 62" stroke="#0284c7" stroke-width="1.5" />
    <path d="M 160 92 L 195 70" stroke="#0284c7" stroke-width="1.5" />

    <!-- Weights & Normalization Engine -->
    <g transform="translate(195, 22)">
      <rect width="160" height="66" rx="4" fill="#0369a1" />
      <text x="80" y="18" fill="#ffffff" font-size="8.5" font-weight="bold" text-anchor="middle">NORMALIZATION ENGINE</text>
      <text x="80" y="32" fill="#e0f2fe" font-size="7" text-anchor="middle">0.35·Norm(V) + 0.20·Norm(ΔW)</text>
      <text x="80" y="44" fill="#e0f2fe" font-size="7" text-anchor="middle">+ 0.25·Dist_cos − 0.20·Norm(P)</text>
      <text x="80" y="58" fill="#93c5fd" font-size="6.5" text-anchor="middle">Min-Max Scaled [0.00 – 1.00]</text>
    </g>
    <line x1="355" y1="55" x2="385" y2="55" stroke="#0284c7" stroke-width="2" marker-end="url(#arr3)" />

    <!-- Decision / Evaluation -->
    <g transform="translate(390, 22)">
      <rect width="150" height="66" rx="4" fill="#0284c7" />
      <text x="75" y="18" fill="#ffffff" font-size="8.5" font-weight="bold" text-anchor="middle">PERSISTENCE EVALUATOR</text>
      <text x="75" y="32" fill="#e0f2fe" font-size="7" text-anchor="middle">Checks 8-Week Streak</text>
      <text x="75" y="46" fill="#ffffff" font-size="7.5" font-weight="bold" text-anchor="middle">GapScore &gt; 0.60 ?</text>
      <text x="75" y="58" fill="#e0f2fe" font-size="6.5" text-anchor="middle">Eliminates 1-off Spikes</text>
    </g>
    <line x1="540" y1="55" x2="570" y2="55" stroke="#0284c7" stroke-width="2" marker-end="url(#arr3)" />

    <!-- Action Trigger -->
    <g transform="translate(575, 22)">
      <rect width="155" height="66" rx="4" fill="#059669" />
      <text x="77" y="18" fill="#ffffff" font-size="8.5" font-weight="bold" text-anchor="middle">ACTION DOSSIER GENERATOR</text>
      <text x="77" y="32" fill="#a7f3d0" font-size="7" text-anchor="middle">&bull; Auto-Drafts NCVET Revision</text>
      <text x="77" y="44" fill="#a7f3d0" font-size="7" text-anchor="middle">&bull; Flags Capex Equipment Needs</text>
      <text x="77" y="58" fill="#a7f3d0" font-size="7" text-anchor="middle">&bull; Initiates Faculty Retraining</text>
    </g>
  </svg>
  <div class="diagram-caption">Mathematical scoring pipeline: 4 empirical inputs are normalized, weighted, and evaluated over an 8-week persistence window to trigger automated curriculum revision dossiers.</div>
</div>
"""

DIAGRAM_4_TAXONOMY_FLOW = """
<div class="diagram-container">
  <div class="diagram-title-row">
    <span class="diagram-heading">Diagram 4: 3-Stage Semantic Taxonomy Normalization Flow</span>
    <span class="diagram-source">Source: docs/04-taxonomy/ & docs/06-data/DATA_MODEL.md</span>
  </div>
  <svg width="100%" height="95" viewBox="0 0 740 95" xmlns="http://www.w3.org/2000/svg">
    <rect width="740" height="95" fill="#f8fafc" rx="5" />
    <defs>
      <marker id="arr4" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
        <path d="M 0 1 L 10 5 L 0 9 z" fill="#0284c7" />
      </marker>
    </defs>
    <!-- Raw Input -->
    <g transform="translate(10, 20)">
      <rect width="120" height="55" rx="4" fill="#0f172a" />
      <text x="60" y="18" fill="#38bdf8" font-size="8" font-weight="bold" text-anchor="middle">RAW JOB POSTINGS</text>
      <text x="60" y="30" fill="#ffffff" font-size="7" text-anchor="middle">Unstructured Text</text>
      <text x="60" y="42" fill="#94a3b8" font-size="6.5" text-anchor="middle">"React Ninja", "EV Tech"</text>
    </g>
    <line x1="130" y1="47" x2="155" y2="47" stroke="#0284c7" stroke-width="2" marker-end="url(#arr4)" />

    <!-- Stage 1 -->
    <g transform="translate(160, 20)">
      <rect width="125" height="55" rx="4" fill="#1e293b" />
      <text x="62" y="16" fill="#38bdf8" font-size="7.5" font-weight="bold" text-anchor="middle">STAGE 1: REGEX</text>
      <text x="62" y="28" fill="#ffffff" font-size="7.5" font-weight="600" text-anchor="middle">Exact NSQF Matching</text>
      <text x="62" y="40" fill="#94a3b8" font-size="6.5" text-anchor="middle">Fast-path lookup for</text>
      <text x="62" y="50" fill="#94a3b8" font-size="6.5" text-anchor="middle">standard trade titles</text>
    </g>
    <line x1="285" y1="47" x2="310" y2="47" stroke="#0284c7" stroke-width="2" marker-end="url(#arr4)" />

    <!-- Stage 2 -->
    <g transform="translate(315, 20)">
      <rect width="125" height="55" rx="4" fill="#0369a1" />
      <text x="62" y="16" fill="#e0f2fe" font-size="7.5" font-weight="bold" text-anchor="middle">STAGE 2: SPACY NER</text>
      <text x="62" y="28" fill="#ffffff" font-size="7.5" font-weight="600" text-anchor="middle">Entity Extraction</text>
      <text x="62" y="40" fill="#bae6fd" font-size="6.5" text-anchor="middle">Tokenizes noun phrases</text>
      <text x="62" y="50" fill="#bae6fd" font-size="6.5" text-anchor="middle">&amp; technical skills</text>
    </g>
    <line x1="440" y1="47" x2="465" y2="47" stroke="#0284c7" stroke-width="2" marker-end="url(#arr4)" />

    <!-- Stage 3 -->
    <g transform="translate(470, 20)">
      <rect width="130" height="55" rx="4" fill="#0284c7" />
      <text x="65" y="16" fill="#f0f9ff" font-size="7.5" font-weight="bold" text-anchor="middle">STAGE 3: EMBEDDINGS</text>
      <text x="65" y="28" fill="#ffffff" font-size="7.5" font-weight="600" text-anchor="middle">Sentence-Transformers</text>
      <text x="65" y="40" fill="#e0f2fe" font-size="6.5" text-anchor="middle">384d Dense Vector Search</text>
      <text x="65" y="50" fill="#e0f2fe" font-size="6.5" text-anchor="middle">+ ES BM25 Synonyms</text>
    </g>

    <!-- Split Outputs -->
    <path d="M 600 37 L 625 25" stroke="#059669" stroke-width="1.5" marker-end="url(#arr4)" />
    <path d="M 600 57 L 625 69" stroke="#d97706" stroke-width="1.5" marker-end="url(#arr4)" />

    <!-- Output Match -->
    <g transform="translate(630, 8)">
      <rect width="100" height="34" rx="3" fill="#065f46" />
      <text x="50" y="14" fill="#a7f3d0" font-size="7" font-weight="bold" text-anchor="middle">COSINE &ge; 0.72</text>
      <text x="50" y="25" fill="#ffffff" font-size="6.5" text-anchor="middle">Mapped to NSQF Unit</text>
    </g>
    <!-- Output Quarantine -->
    <g transform="translate(630, 52)">
      <rect width="100" height="34" rx="3" fill="#b45309" />
      <text x="50" y="14" fill="#fef3c7" font-size="7" font-weight="bold" text-anchor="middle">COSINE &lt; 0.72</text>
      <text x="50" y="25" fill="#ffffff" font-size="6.5" text-anchor="middle">Quarantine Queue</text>
    </g>
  </svg>
  <div class="diagram-caption">3-stage taxonomy normalization pipeline: Regex fast-path &rarr; spaCy entity extraction &rarr; dense vector similarity + Elasticsearch BM25 synonym expansion.</div>
</div>
"""
