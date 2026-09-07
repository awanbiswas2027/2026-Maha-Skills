# -*- coding: utf-8 -*-
"""
Chapters 5 to 9 for MahaSkills Master Architecture Guide.
Each chapter is strictly 1 clean page.
"""
from diagrams import (
    DIAGRAM_4_TAXONOMY_FLOW,
    DIAGRAM_5_DPDP_PIPELINE,
    DIAGRAM_6_INGESTION_AIRFLOW,
    DIAGRAM_7_RAG_PIPELINE,
    DIAGRAM_8_STRIDE_SECURITY
)

CHAPTERS_5_TO_9_HTML = f"""
<div class="page-break"></div>

<!-- PAGE 5: CHAPTER 5 -->
<div class="chapter-header">
  <h2 class="chapter-title">Chapter 5: Semantic Taxonomy Normalization &amp; NLP Processing</h2>
  <span class="chapter-badge">Data Intelligence</span>
</div>

<div class="concept-box">
  <div class="concept-title">💡 Plain English Concept &mdash; How do we make sense of messy, chaotic job postings?</div>
  <div class="concept-body">
    Every company invents their own creative titles in job advertisements: one employer asks for a &ldquo;Welding Rock Star,&rdquo; another for a &ldquo;TIG/MIG Fabricator,&rdquo; and a third writes &ldquo;Junior Metal Jointer.&rdquo; If a computer system doesn't understand that these all refer to the same government qualification pack (<em>Welder &mdash; NSQF Level 3</em>), the demand data will be completely fragmented and useless!<br><br>
    MahaSkills acts like a multilingual universal translator. It takes chaotic job ads, strips out marketing buzzwords, extracts the underlying technical skill competencies, and matches them to official government qualification packs.
  </div>
</div>

{DIAGRAM_4_TAXONOMY_FLOW}

<div class="tech-box">
  <div class="tech-title">⚙️ 3-Stage Normalization Pipeline Mechanics</div>
  <div class="tech-body">
    <ul>
      <li><strong>Stage 1 (Exact Regex Matching):</strong> Fast-path deterministic regex engine scanning for 2,200 canonical NSQF trade codes and standard DGT trade titles (e.g., <code>ELE-01</code>, <code>FIT-02</code>). Resolves &approx; 40% of clean vacancy listings in &lt; 1ms.</li>
      <li><strong>Stage 2 (spaCy Statistical NER):</strong> Custom-trained statistical Named Entity Recognizer tokenizes job descriptions, extracts noun phrases, and identifies technical skills, machinery names, software packages, and certification requirements while filtering stop-words.</li>
      <li><strong>Stage 3 (Sentence-Transformer Embeddings &amp; BM25 Synonyms):</strong> Unmapped skills are converted into 384-dimensional dense vectors using open-source <code>all-MiniLM-L6-v2</code> and queried against the canonical skill taxonomy vector index, cross-referenced with Elasticsearch 8 BM25 synonym dictionaries containing 15,000+ technical descriptors.</li>
      <li><strong>Confidence Threshold &amp; Quarantine Queue:</strong> Matches with cosine similarity &ge; 0.72 are automatically assigned to the canonical NSQF competence unit. Tokens scoring &lt; 0.72 are safely routed to an administrative <em>Unmapped Skills Quarantine Queue</em>, where SSC analysts can map them via the UI with one click without needing model retraining.</li>
    </ul>
  </div>
</div>

<div class="page-break"></div>

<!-- PAGE 6: CHAPTER 6 -->
<div class="chapter-header">
  <h2 class="chapter-title">Chapter 6: Data Privacy &amp; Legal Compliance (DPDP Act 2023)</h2>
  <span class="chapter-badge">Cybersecurity &amp; Law</span>
</div>

<div class="concept-box">
  <div class="concept-title">💡 Plain English Concept &mdash; How do we protect student privacy and employer secrets?</div>
  <div class="concept-body">
    India's <strong>Digital Personal Data Protection (DPDP) Act 2023</strong> mandates strict criminal and financial penalties (up to &#8377;250 Crore) for leaking citizen personal information. Vocational students in rural ITIs must not have their roll numbers, names, or Aadhaar cards exposed online.<br><br>
    MahaSkills implements a <strong>zero-disk privacy enclave</strong>: the very instant an ITI principal uploads a placement report, student identification numbers are converted in computer memory into irreversible cryptographic codes. Even if a rogue hacker stole the entire database, they would see only random strings of letters and numbers with zero student identities.
  </div>
</div>

{DIAGRAM_5_DPDP_PIPELINE}

<div class="tech-box">
  <div class="tech-title">⚙️ Streaming HMAC-SHA256 Cryptographic Architecture</div>
  <div class="tech-body">
    <ul>
      <li><strong>Volatile Memory Ingestion:</strong> Celery ingestion workers read uploaded placement CSV streams line-by-line entirely within volatile RAM. Unencrypted student identifiers (roll numbers, registration codes) <em>never touch physical disk or database swap files</em>.</li>
      <li><strong>Hardware Security Module (CloudHSM) Salt:</strong> Hashes are computed via <code>HMAC-SHA256(student_id, DPDP_TENANT_SALT)</code>. The cryptographic salt is stored exclusively in an isolated CloudHSM enclave inaccessible to database administrators.</li>
      <li><strong>Non-Reversible Candidate Hashes:</strong> Database tables store only the resulting 64-character hex hash (<code>candidate_hash</code>), fully satisfying Section 8(6) of DPDP Act 2023.</li>
      <li><strong>Zero Employer Leakage:</strong> Enterprise hiring volumes, candidate requisitions, and salary offers are aggregated to district/sector medians before appearing on public analytics dashboards. Competitors cannot reverse-engineer proprietary corporate staffing strategies.</li>
    </ul>
  </div>
</div>

<div class="policy-box">
  <div class="policy-title">🏛️ DPDP Statutory Alignment Summary</div>
  <div class="policy-body">
    By mathematically eliminating direct identifiers at the streaming network layer and isolating the cryptographic salt in CloudHSM, MahaSkills operates as a fully pseudonymized platform exempt from citizen de-anonymization vulnerabilities.
  </div>
</div>

<div class="page-break"></div>

<!-- PAGE 7: CHAPTER 7 -->
<div class="chapter-header">
  <h2 class="chapter-title">Chapter 7: Data Engineering, Ingestion &amp; 10M-Record Table Partitioning</h2>
  <span class="chapter-badge">Data Engineering</span>
</div>

<div class="concept-box">
  <div class="concept-title">💡 Plain English Concept &mdash; How does the system handle millions of records over years without slowing down?</div>
  <div class="concept-body">
    Over 7 years across 36 districts and 417+ ITIs, the system accumulates more than 10 million individual student placement records and job listings. In an ordinary database, searching through 10 million rows takes minutes and eventually crashes the server.<br><br>
    MahaSkills organizes its database like a library with separate filing cabinets for each year: when an official asks for 2025 placement data, the database opens only the 2025 filing cabinet and completely ignores the other years. This keeps queries running in milliseconds forever.
  </div>
</div>

{DIAGRAM_6_INGESTION_AIRFLOW}

<div class="tech-box">
  <div class="tech-title">⚙️ Airflow DAG Orchestration &amp; Native Table Partitioning</div>
  <div class="tech-body">
    <ul>
      <li><strong>Apache Airflow 2.8 Orchestration:</strong> Isolated scheduled DAGs manage batch ETL pipelines:
        <ul>
          <li><code>lmi_nightly_job_scraping</code>: Executes daily at 02:00 IST (SLA &le; 120m) across NCS and job portals with automated rate-limiting and proxy rotation.</li>
          <li><code>placement_validation_worker</code>: Streaming worker validating monthly ITI placement CSV batches line-by-line against schema boundaries.</li>
          <li><code>taxonomy_nlp_enrichment</code>: Executes daily at 04:00 IST (SLA &le; 60m) to generate vector embeddings for newly ingested vacancies.</li>
        </ul>
      </li>
      <li><strong>Atomic CSV Streaming &amp; Zero Partial Commits:</strong> Placement uploads (up to 50,000 rows) are verified across candidate HMAC, course code validity, and wage ranges. If syntax or relational integrity errors occur, the entire batch status is marked <code>REJECTED</code>, corrupt rows are written to an error log, and zero corrupt data enters production tables.</li>
      <li><strong>PostgreSQL 16 Declarative Range Partitioning:</strong> The <code>placement_records</code> table is partitioned by <code>RANGE (batch_year)</code> into discrete annual tables (<code>placement_records_2024</code>, <code>placement_records_2025</code>). The query optimizer performs partition pruning, scanning only relevant cohorts.</li>
      <li><strong>Cold Data Parquet Archival:</strong> Job postings older than 24 months are automatically converted into compressed columnar Apache Parquet files and archived in cold S3 storage while active 12-month econometric data remains indexed.</li>
    </ul>
  </div>
</div>

<div class="page-break"></div>

<!-- PAGE 8: CHAPTER 8 -->
<div class="chapter-header">
  <h2 class="chapter-title">Chapter 8: Deterministic RAG AI Assistant &amp; Marathi-First Interface</h2>
  <span class="chapter-badge">Conversational AI</span>
</div>

<div class="concept-box">
  <div class="concept-title">💡 Plain English Concept &mdash; Why a Marathi chatbot, and why can't it make things up?</div>
  <div class="concept-body">
    Most vocational school principals in rural Maharashtra (in places like Gadchiroli, Nandurbar, or Beed) do not have time to learn complex data dashboards or write database queries. They need to ask simple questions in their mother tongue, Marathi: <em>&ldquo;Which courses in our district need updating for solar technology?&rdquo;</em><br><br>
    Generic AI tools like ChatGPT often make up fake statistics (called &ldquo;hallucination&rdquo;). MahaSkills uses a technology called <strong>Retrieval-Augmented Generation (RAG)</strong>. The AI is strictly forbidden from giving opinions; it is legally bound to act only as an audio-visual reader of our verified database, citing exact course codes and government batch numbers for every single sentence it speaks.
  </div>
</div>

{DIAGRAM_7_RAG_PIPELINE}

<div class="tech-box">
  <div class="tech-title">⚙️ Deterministic 4-Stage RAG Pipeline Architecture</div>
  <div class="tech-body">
    <ul>
      <li><strong>1. Intent &amp; Entity Extraction:</strong> Analyzes user queries (in Marathi or English) to extract discrete SQL relational filters: <code>district="Nagpur"</code>, <code>sector="Green Energy"</code>, <code>nsqf_level=4</code>.</li>
      <li><strong>2. Hybrid SQL &amp; Vector Retrieval:</strong> Combines dense semantic vector retrieval via <code>pgvector</code> (384-dimensional embeddings of course outcomes) with sparse relational SQL queries fetching verified 12-month vacancy stats and placement numbers.</li>
      <li><strong>3. Context-Constrained Injection:</strong> Retrieved facts are formatted into a strict system prompt for our local open-source LLM (Llama-3-8B executed via Ollama/vLLM): <em>&ldquo;You are an assistant for DSEEI Maharashtra. Answer exclusively from the provided database records. Every single statistic must cite the exact Course ID, District ID, and Batch Year.&rdquo;</em></li>
      <li><strong>4. Post-Generation Citation Regex Verification:</strong> A deterministic regex parser inspects the generated output before returning it to the user. If any claim lacks an exact verifiable citation ID from step 2, or if retrieval confidence is &lt; 0.65, the system automatically falls back to: <em>&ldquo;Insufficient verified data available for this district-sector combination.&rdquo;</em></li>
    </ul>
  </div>
</div>

<div class="page-break"></div>

<!-- PAGE 9: CHAPTER 9 -->
<div class="chapter-header">
  <h2 class="chapter-title">Chapter 9: Multi-Tenant Security, RBAC/ABAC &amp; STRIDE Cyber Defense</h2>
  <span class="chapter-badge">Platform Security</span>
</div>

<div class="concept-box">
  <div class="concept-title">💡 Plain English Concept &mdash; Who is allowed to see and change what?</div>
  <div class="concept-body">
    In a government system, a District Officer in Nagpur must not be able to secretly alter training budgets in Pune, and an ITI principal cannot artificially edit placement numbers to win awards. MahaSkills enforces strict digital identity badges and territorial locks so that every user sees only what they are legally authorized to manage.
  </div>
</div>

{DIAGRAM_8_STRIDE_SECURITY}

<div class="tech-box">
  <div class="tech-title">⚙️ 7 Platform Roles &amp; The STRIDE Threat Assessment Model</div>
  <div class="tech-body">
    <ul>
      <li><strong>7 Platform Roles:</strong> (1) State Policy Maker (DSEEI / MSInS), (2) District Skill Officer (DSEEGC), (3) ITI Principal, (4) ITI Vocational Instructor, (5) SSC Reviewer, (6) Industry Employer, (7) Candidate / Trainee.</li>
      <li><strong>Attribute-Based Access Control (ABAC):</strong> Authenticated Keycloak JWTs contain custom realm claims (e.g., <code>district_id: 2718</code>). The FastAPI API Gateway and SQLAlchemy ORM automatically inject mandatory row-level security predicates (<code>WHERE district_id = current_user.district_id</code>) on every database transaction.</li>
      <li><strong>STRIDE Threat Coverage:</strong>
        <ul>
          <li><strong>Spoofing (S):</strong> Forged identity tokens are blocked via RS256 signature verification against Keycloak JWKS public keys.</li>
          <li><strong>Tampering (T):</strong> Fraudulent ITI placement alterations are caught by SHA-256 batch checksums and statistical anomaly algorithms.</li>
          <li><strong>Repudiation (R):</strong> State approval decisions are permanently logged in an immutable, append-only <code>audit_logs</code> table with SHA-256 digital approval signatures.</li>
          <li><strong>Information Disclosure (I):</strong> Trainee PII is eliminated through zero-plaintext storage and HMAC-SHA256 pseudonymization.</li>
          <li><strong>Denial of Service (D):</strong> Upload zip-bombs are halted via 100MB streaming upload caps and Celery worker queue isolation.</li>
          <li><strong>Elevation of Privilege (E):</strong> Cross-district parameter tampering is blocked by <code>TenantScopeGuard</code>.</li>
        </ul>
      </li>
    </ul>
  </div>
</div>
"""
