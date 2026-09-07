# -*- coding: utf-8 -*-
"""
Chapters 1 to 4 for MahaSkills Master Architecture Guide.
Each chapter is strictly 1 clean page.
"""
from diagrams import DIAGRAM_1_CLOSED_LOOP, DIAGRAM_2_C4_SYSTEM, DIAGRAM_3_GAP_ENGINE

CHAPTERS_1_TO_4_HTML = f"""
<!-- PAGE 1: TITLE & CHAPTER 1 -->
<div class="doc-header">
  <div class="doc-badge-row">
    <span class="doc-badge">SMART INDIA HACKATHON 2026 &middot; PS #26134</span>
    <span class="doc-dept">Government of Maharashtra &middot; DSEEI / MSInS</span>
  </div>
  <h1 class="doc-title">MahaSkills &mdash; Project Master Architecture &amp; System Manual</h1>
  <p class="doc-subtitle">Autonomous Labour-Market Intelligence &amp; Dynamic Vocational Curriculum Alignment Platform across 36 Districts and 417+ ITIs</p>
</div>

<!-- EXECUTIVE STATS -->
<div class="stats-grid">
  <div class="stat-card">
    <div class="stat-label">Territorial Scope</div>
    <div class="stat-val">36 Districts</div>
    <div class="stat-sub">417+ ITIs &middot; 33 Sectors &middot; 36 SSCs</div>
  </div>
  <div class="stat-card">
    <div class="stat-label">Trainee Scale</div>
    <div class="stat-val">1,50,000+</div>
    <div class="stat-sub">Annual Vocational Enrolment</div>
  </div>
  <div class="stat-card">
    <div class="stat-label">Placement Target</div>
    <div class="stat-val">+24% Uplift</div>
    <div class="stat-sub">From ~45% to &gt;69% State Average</div>
  </div>
  <div class="stat-card">
    <div class="stat-label">Syllabus Cycle</div>
    <div class="stat-val">21 Days</div>
    <div class="stat-sub">Down from 180 Days (5-Yr Static)</div>
  </div>
</div>

<!-- CHAPTER 1 -->
<div class="chapter-header">
  <h2 class="chapter-title">Chapter 1: The Maharashtra Vocational Crisis &amp; Problem Statement #26134</h2>
  <span class="chapter-badge">Product Domain</span>
</div>

<div class="concept-box">
  <div class="concept-title">💡 Plain English Concept &mdash; What is this project and why is it desperately needed?</div>
  <div class="concept-body">
    Imagine going to a government vocational school for two years to learn how to fix petrol engines, only to graduate and discover that every automotive factory in your district (like Tata Motors or Bajaj in Pune) has switched entirely to electric vehicles and robotic assembly lines! This is the exact crisis facing youth in Maharashtra today.<br><br>
    The state operates over <strong>417 Industrial Training Institutes (ITIs)</strong> training 1.5 lakh students every year. But their syllabi are revised manually only once every 5 years by government committees. Meanwhile, modern industry introduces new software, tools, and machines every few months. Because of this massive &ldquo;curriculum drift,&rdquo; more than half of all vocational graduates cannot find jobs, while employers complain they cannot find skilled workers.<br><br>
    <strong>MahaSkills</strong> is an autonomous digital platform that acts as a real-time bridge. It automatically reads live job listings across the state, calculates exactly which skills are needed in each district, and generates the exact administrative paperwork for government officials to update courses in <strong>21 days instead of 5 years</strong>.
  </div>
</div>

<div class="tech-box">
  <div class="tech-title">⚙️ Terminology &amp; Key Governance Entities</div>
  <div class="tech-body">
    <ul>
      <li><strong>ITI (Industrial Training Institute):</strong> State-run post-secondary vocational training institutes delivering certificate trades (Fitter, Electrician, Welder, Machinist, COPA).</li>
      <li><strong>DSEEI &amp; DVET:</strong> Department of Skills, Employment, Entrepreneurship and Innovation; and Directorate of Vocational Education and Training (Government of Maharashtra).</li>
      <li><strong>MSInS:</strong> Maharashtra State Innovation Society, driving technological entrepreneurship and hackathon deployment.</li>
      <li><strong>NSQF (National Skills Qualification Framework):</strong> A competency-based framework organizing qualifications from levels 1 to 10 based on knowledge, skills, and aptitude.</li>
      <li><strong>SSC (Sector Skill Council):</strong> Industry-led autonomous bodies (e.g., ASDC for Automotive, NASSCOM for IT) that set occupational standards.</li>
      <li><strong>LMI (Labour Market Intelligence):</strong> Real-time quantitative aggregation of job vacancies, hiring velocities, wage premiums, and skill demand signals.</li>
    </ul>
  </div>
</div>

<div class="policy-box">
  <div class="policy-title">🏛️ The Administrative Mandate (Problem Statement #26134)</div>
  <div class="policy-body">
    Issued directly by DSEEI / MSInS, Problem Statement 26134 mandates the creation of a closed-loop platform that detects emerging skill demand at the district level, identifies obsolete training courses, and auto-generates evidence-grounded curriculum dossiers and annual district training plans.
  </div>
</div>

<div class="page-break"></div>

<!-- PAGE 2: CHAPTER 2 -->
<div class="chapter-header">
  <h2 class="chapter-title">Chapter 2: The Core Innovation &mdash; Closed-Loop Alignment Architecture</h2>
  <span class="chapter-badge">End-to-End Lifecycle</span>
</div>

<div class="concept-box">
  <div class="concept-title">💡 Plain English Concept &mdash; What does &ldquo;Closing the Loop&rdquo; mean?</div>
  <div class="concept-body">
    Traditional government portals like National Career Service (NCS) or job boards operate as an &ldquo;open loop&rdquo;: they show job listings, candidates apply, but the vocational schools never learn anything from those job ads! The schools keep teaching the same outdated 2018 syllabus forever.<br><br>
    MahaSkills <strong>&ldquo;closes the loop&rdquo;</strong>: when hiring for &ldquo;Battery Management Systems&rdquo; or &ldquo;Solar PV Inverters&rdquo; spikes in Pune or Nagpur, our system automatically traces backward into the relevant ITI trade, flags that the current syllabus lacks these modules, drafts the revised lesson plans, routes them to officials for digital sign-off, updates the classroom curriculum, and tracks whether the next batch of students gets hired at higher salaries!
  </div>
</div>

{DIAGRAM_1_CLOSED_LOOP}

<div class="tech-box">
  <div class="tech-title">⚙️ Step-by-Step Technical Execution of the 6 Stages</div>
  <div class="tech-body">
    <ol>
      <li><strong>Step 1 (Ingest):</strong> Nightly Apache Airflow scrapers ingest public postings from NCS, Naukri, and LinkedIn across 36 district geo-bounds, alongside monthly ITI placement CSV uploads.</li>
      <li><strong>Step 2 (Map):</strong> Natural Language Processing tokenizes unstructured job text and maps messy titles (&ldquo;CNC Specialist&rdquo;) to canonical NSQF job roles and NOS (National Occupational Standard) units.</li>
      <li><strong>Step 3 (Score):</strong> Proprietary mathematical Gap Engine calculates a 0.00–1.00 score combining vacancy velocity, wage premiums, curriculum semantic drift, and historical placement rates.</li>
      <li><strong>Step 4 (Dossier):</strong> Automatically synthesizes an NCVET-compliant Curriculum Modification Dossier complete with 12-month vacancy trends, hiring employer rosters, and syllabus diffs.</li>
      <li><strong>Step 5 (Ratify):</strong> Routes through an administrative state machine: Sector Skill Council (SSC) technical validation &rarr; DSEEI Joint Secretary digital approval.</li>
      <li><strong>Step 6 (Act &amp; Evaluate):</strong> Sanctions updated ITI seat quotas, allocates workshop capex budgets, schedules faculty retraining, and measures outcome uplift via subsequent placement returns.</li>
    </ol>
  </div>
</div>

<div class="policy-box">
  <div class="policy-title">🏛️ Continuous Evaluation &amp; Governance Feedback Loop</div>
  <div class="policy-body">
    The feedback loop does not terminate at syllabus publication. Every month, verified ITI placement returns feed back into the scoring engine to evaluate whether the curriculum revision produced actual wage uplift and higher hiring velocity. If placement falls short, scoring weights recalibrate automatically.
  </div>
</div>

<div class="page-break"></div>

<!-- PAGE 3: CHAPTER 3 -->
<div class="chapter-header">
  <h2 class="chapter-title">Chapter 3: System Architecture &amp; The 3-Tier Decoupled Platform</h2>
  <span class="chapter-badge">Engineering &amp; Stack</span>
</div>

<div class="concept-box">
  <div class="concept-title">💡 Plain English Concept &mdash; How is the platform engineered under the hood?</div>
  <div class="concept-body">
    MahaSkills is designed like a modern, enterprise banking application. Instead of one giant, fragile program where a single bug crashes everything, the platform is divided into three completely decoupled tiers: a lightweight, lightning-fast frontend that works on mobile phones in rural talukas; a high-performance backend API that processes data asynchronously; and an intelligent database layer that combines regular data tables with AI vector search.
  </div>
</div>

{DIAGRAM_2_C4_SYSTEM}

<div class="tech-box">
  <div class="tech-title">⚙️ The 3-Tier Production Stack Breakdown</div>
  <div class="tech-body">
    <ul>
      <li><strong>Presentation Tier (React 18 + Vite + TypeScript):</strong> Strict typing ensures zero <code>any</code> leaks. Styled with Tailwind CSS and accessible shadcn/ui components. State managed via TanStack Query v5 for server data deduplication and Zustand for client UI state. Native internationalization (i18n) supports Marathi, Hindi, and English.</li>
      <li><strong>Application &amp; API Tier (Python 3.11 + FastAPI + Celery):</strong> Built with non-blocking async IO on Starlette/Uvicorn. Handles RESTful <code>/v1</code> endpoints, automated OpenAPI v3 contracts, and RBAC authorization guards. Celery 5.3 worker pools process heavy background tasks (scraping, vectorization, CSV parsing) via Redis 7.</li>
      <li><strong>Intelligence &amp; Data Tier (PostgreSQL 16 + pgvector + PostGIS + Elasticsearch 8):</strong> PostgreSQL provides ACID transaction safety. The <code>pgvector</code> extension stores 384-dimensional syllabus embeddings for instant semantic search. PostGIS stores geospatial boundaries for 36 districts. Elasticsearch 8 provides BM25 relevance scoring and Marathi synonym dictionaries. MinIO/S3 stores raw CSV returns and immutable PDF dossiers.</li>
      <li><strong>Pipeline Tier (Apache Airflow 2.8):</strong> Orchestrates scheduled batch workflows isolated from user-facing REST servers.</li>
    </ul>
  </div>
</div>

<div class="page-break"></div>

<!-- PAGE 4: CHAPTER 4 -->
<div class="chapter-header">
  <h2 class="chapter-title">Chapter 4: The Mathematical Core &mdash; Gap Scoring &amp; Obsolescence Engine</h2>
  <span class="chapter-badge">Algorithmic IP</span>
</div>

<div class="concept-box">
  <div class="concept-title">💡 Plain English Concept &mdash; How do we mathematically detect an obsolete course without human bias?</div>
  <div class="concept-body">
    If a human committee decides which vocational courses to shut down or fund, personal politics and lobbying can influence decisions. MahaSkills removes subjective guesswork by using an empirical formula. It looks at four hard facts: Are employers actively posting jobs for this trade? Are wages rising above minimum wage? Does the current syllabus match modern job descriptions? Are students actually getting hired?<br><br>
    If job postings are high and wages are soaring, but the syllabus is far behind and placements are dropping, the course receives a high <strong>Gap Score</strong>. If this score stays high for 8 weeks in a row, the platform automatically triggers an administrative intervention.
  </div>
</div>

<div class="formula-callout">
  GapScore(c, d) = 0.35 &middot; Norm(V_12mo) + 0.20 &middot; Norm(&Delta;W) + 0.25 &middot; Dist_cosine(S_market, S_curriculum) &minus; 0.20 &middot; Norm(P_rate)
</div>

{DIAGRAM_3_GAP_ENGINE}

<div class="tech-box">
  <div class="tech-title">⚙️ Mathematical Formulation &amp; Parameter Weights</div>
  <div class="tech-body">
    <ul>
      <li><strong>V_12mo (Weight 0.35 &mdash; 12-Month Vacancy Volume):</strong> Total deduplicated job vacancies in district d for course c over the past 12 months, normalized across statewide percentiles using min-max scaling: <code>(V - V_min) / (V_max - V_min)</code>.</li>
      <li><strong>&Delta;W (Weight 0.20 &mdash; Regional Wage Premium):</strong> Average offered monthly wage relative to the Maharashtra statutory unskilled minimum wage (&approx; &#8377;12,500/mo). High wage premiums indicate high-productivity, high-demand technical roles.</li>
      <li><strong>Dist_cosine (Weight 0.25 &mdash; Semantic Syllabus Drift):</strong> Cosine distance <code>1 - cos(&theta;)</code> between the 384-dimensional vector embedding of emerging skill n-grams in job postings and the embedding of active course syllabus learning outcomes.</li>
      <li><strong>P_rate (Weight 0.20 &mdash; Historical Placement Rate):</strong> 4-quarter rolling placement rate verified from ITI CSV returns. This parameter is <em>subtracted</em> from the score to prevent false alarms on trades that still boast near-100% placement.</li>
      <li><strong>8-Week Persistence Evaluator:</strong> To prevent momentary market noise from disrupting state education, a Gap Score &gt; 0.60 must be maintained for <strong>&ge; 8 consecutive weekly runs</strong> before an automated Curriculum Modification Dossier is generated.</li>
    </ul>
  </div>
</div>
"""
