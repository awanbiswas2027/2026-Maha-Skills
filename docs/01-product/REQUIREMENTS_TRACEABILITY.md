# MahaSkills — Requirements Traceability Matrix (RTM)

**Platform:** MahaSkills · Government of Maharashtra (DSEEI / MSInS)  
**Problem Statement ID:** 26134  
**Version:** 1.0  
**Status:** Canonical Traceability Baseline  

The Requirements Traceability Matrix (RTM) establishes a bidirectional chain connecting high-level policy objectives to architectural subsystems, database schema definitions, API contracts, frontend interfaces, and verification test suites. Every functional and non-functional requirement must maintain forward and backward traceability across the lifecycle.

---

## 1. Traceability Schema & Taxonomy

* **Requirement ID Notation:** `REQ-[DOMAIN]-[SEQ]` (e.g., `REQ-GAP-01`)
* **Domains:**
  * `AUTH`: Authentication, Authorization & Identity Management
  * `LMI`: Labour Market Intelligence & External Data Ingestion
  * `TAX`: Skills & Occupational Taxonomy
  * `GAP`: Algorithmic Skill-Demand Gap Scoring
  * `REC`: Curriculum Update Recommendation & Review Workflow
  * `EMP`: Industry Partner & Employer Engagement Portal
  * `PLA`: ITI Placement Returns & Graduate Tracking
  * `DTP`: District Training Plan Synthesis & Equipment Audits
  * `CAN`: Public Candidate Guidance, Search & Career Pathways
  * `ADM`: Platform Administration, Audit Trails & Operations
  * `SEC`: Security, Governance & DPDP 2023 Compliance
  * `NFR`: Non-Functional Performance & Architectural Constraints

---

## 2. Master Requirements Traceability Matrix

| Req ID | Requirement Summary | PRD § | Architecture Component | Primary DB Table | API Endpoint / Contract | Frontend Route / Component | Test Suite ID | Phase | Status |
|:---|:---|:---|:---|:---|:---|:---|:---|:---|:---|
| **REQ-AUTH-01** | Keycloak OIDC Authentication with Authorization Code + PKCE | §4.2, §10 | `AuthService` | `users`, `user_roles` | `/v1/auth/login`, `/v1/auth/token` | `/auth/login`, `AuthGuard` | `TEST-SEC-001` | 1 | Complete |
| **REQ-AUTH-02** | Role-Based Access Control (RBAC) across 7 discrete stakeholder tiers | §3, §4 | `APIGateway`, `RBACMiddleware` | `roles`, `permissions` | `/v1/auth/me`, `/v1/auth/permissions` | `RoleGuard`, `PermissionGate` | `TEST-SEC-002` | 1 | Complete |
| **REQ-AUTH-03** | Contextual district, institute, and sector scope isolation | §3, §8 | `TenantScopeGuard` | `user_scopes` | All scoped `/v1/*` endpoints | `ScopeContext`, `AppShell` | `TEST-SEC-003` | 1 | Complete |
| **REQ-LMI-01** | Automated multi-source job posting ingestion (Naukri, LinkedIn, Indeed, NCS) | §6.1 | `IngestionWorker` (Airflow) | `raw_job_postings`, `clean_job_postings` | `/v1/lmi/jobs`, `/v1/lmi/trends` | `/lmi/market-overview`, `JobTrendChart` | `TEST-ING-001` | 1 | In Progress |
| **REQ-LMI-02** | State & district-level labour demand aggregation and trend analytics | §6.1, §7 | `LmiAnalyticsService` | `lmi_aggregates_district` | `/v1/lmi/aggregates` | `/analytics/lmi`, `DemandTrendCard` | `TEST-LMI-001` | 1 | In Progress |
| **REQ-TAX-01** | NSQF & SSC occupational taxonomy hierarchy (~2,200 job roles, 33 sectors) | §6.2 | `TaxonomyService` | `sectors`, `sscs`, `job_roles`, `skills` | `/v1/taxonomy/roles`, `/v1/taxonomy/tree` | `/taxonomy`, `TaxonomyTreeView` | `TEST-TAX-001` | 1 | Complete |
| **REQ-TAX-02** | NLP enrichment & entity extraction for unstructured job posting skills | §6.2 | `NlpTaxonomyEngine` | `skill_synonyms`, `emerging_skills` | `/v1/taxonomy/extract`, `/v1/taxonomy/emerging` | `/admin/taxonomy/emerging`, `SkillBadge` | `TEST-TAX-002` | 2 | Planned |
| **REQ-GAP-01** | Weekly algorithmic gap scoring: District $\times$ Sector $\times$ Role $\times$ NSQF level | §6.3 | `GapScoringEngine` (Celery) | `gap_scores`, `gap_score_history` | `/v1/gap-scores`, `/v1/gap-scores/{id}` | `/gap-analysis`, `GapHeatmap` | `TEST-GAP-001` | 2 | In Progress |
| **REQ-GAP-02** | Automated oversupply flagging (placement $< 25\%$ & demand $< 20\text{th}$ percentile) | §6.3 | `GapScoringEngine` | `oversupply_alerts` | `/v1/gap-scores/oversupply` | `/gap-analysis/oversupply`, `OversupplyTable` | `TEST-GAP-002` | 2 | Planned |
| **REQ-REC-01** | Automated curriculum modification trigger on sustained gap ($> 60$ for 8 wks) | §6.4 | `RecommendationEngine` | `recommendations`, `recommendation_evidence` | `/v1/recommendations` | `/recommendations`, `RecommendationCard` | `TEST-REC-001` | 2 | In Progress |
| **REQ-REC-02** | Auto-compiled evidence dossier (trend chart, employers, interstate benchmarks) | §6.4 | `DossierGenerator` | `recommendation_evidence` | `/v1/recommendations/{id}/dossier` | `/recommendations/:id`, `DossierViewer` | `TEST-REC-002` | 2 | Planned |
| **REQ-REC-03** | Multi-tier review workflow: Draft $\rightarrow$ SSC Review $\rightarrow$ DSEEI Approval $\rightarrow$ Published | §6.4, §8 | `WorkflowService` | `recommendation_audits` | `/v1/recommendations/{id}/review` | `/recommendations/:id/review`, `ApprovalStepper` | `TEST-REC-003` | 2 | In Progress |
| **REQ-EMP-01** | Employer self-onboarding with GSTIN & MCA verification | §6, §7 | `EmployerService` | `employers`, `employer_verifications` | `/v1/employers/register`, `/v1/employers/verify` | `/employer/register`, `GstinLookup` | `TEST-EMP-001` | 2 | Planned |
| **REQ-EMP-02** | Structured skill needs submission (headcount, urgency, tech specs) | §6, §7 | `EmployerService` | `skill_needs`, `skill_need_items` | `/v1/employers/skill-needs` | `/employer/skill-needs`, `SkillNeedsForm` | `TEST-EMP-002` | 2 | In Progress |
| **REQ-EMP-03** | Sector-triggered micro-surveys on localized skill gap spikes | §6.1, §7 | `SurveyEngine` | `surveys`, `survey_responses` | `/v1/surveys/active`, `/v1/surveys/submit` | `/employer/surveys`, `MicroSurveyDialog` | `TEST-EMP-003` | 2 | Planned |
| **REQ-PLA-01** | Structured monthly placement CSV upload with cell-level validation | §6.1 | `PlacementIngestionService` | `placement_batches`, `placement_records` | `/v1/ingestion/placements/upload` | `/placements/upload`, `CsvDropzone` | `TEST-PLA-001` | 1 | Complete |
| **REQ-PLA-02** | Placement validation reporting with immediate row-level rejection feedback | §6.1 | `CsvValidationWorker` | `placement_validation_errors` | `/v1/ingestion/placements/{batchId}/errors` | `/placements/batches/:id`, `ValidationErrorTable` | `TEST-PLA-002` | 1 | Complete |
| **REQ-PLA-03** | Institutional placement benchmarking against district and state medians | §6.1, §7 | `PlacementAnalyticsService` | `placement_aggregates_institute` | `/v1/placements/benchmarks` | `/placements/benchmarks`, `PlacementChart` | `TEST-PLA-003` | 1 | Planned |
| **REQ-DTP-01** | Automated synthesis of Annual & 3-Year District Training Plans | §6.5, §7 | `DistrictPlanningService` | `district_plans`, `district_plan_items` | `/v1/district-plans`, `/v1/district-plans/{id}` | `/district-plans`, `PlanBuilder` | `TEST-DTP-001` | 3 | Planned |
| **REQ-DTP-02** | ITI equipment gap assessment against syllabus specifications | §6.5 | `EquipmentAuditService` | `iti_assets`, `course_equipment_standards` | `/v1/district-plans/{id}/equipment-gaps` | `/district-plans/:id/equipment`, `EquipmentGapList` | `TEST-DTP-002` | 3 | Planned |
| **REQ-DTP-03** | DSEEI capital budget allocation priority scoring | §6.5, §7 | `BudgetModelingService` | `district_budget_allocations` | `/v1/district-plans/budget-model` | `/district-plans/budget`, `BudgetPriorityCard` | `TEST-DTP-003` | 3 | Planned |
| **REQ-CAN-01** | Public course directory with verified placement rates and median starting salary | §6.6, §7 | `CandidateService` | `courses`, `course_placement_stats` | `/v1/candidates/courses`, `/v1/candidates/courses/{id}` | `/candidate/courses`, `CourseCard` | `TEST-CAN-001` | 3 | Planned |
| **REQ-CAN-02** | 5-question adaptive Pathway Quiz generating top 3 recommendations | §6.6 | `PathwayRecommendationEngine`| `pathway_quiz_logs` | `/v1/candidates/pathway/recommend` | `/candidate/pathway`, `PathwayQuizWizard` | `TEST-CAN-002` | 3 | Planned |
| **REQ-CAN-03** | Mahaswayam SSO enrollment handoff and status synchronization | §4.3, §6.6 | `MahaswayamAdapter` | `candidate_enrollments` | `/v1/candidates/enrollment-handoff` | `/candidate/courses/:id/enroll`, `SsoRedirect` | `TEST-CAN-003` | 3 | Planned |
| **REQ-ADM-01** | Comprehensive administrative audit logging for all transactional updates | §10 | `AuditLoggingMiddleware` | `audit_logs` | `/v1/admin/audit-logs` | `/admin/audit-logs`, `AuditLogTable` | `TEST-ADM-001` | 1 | Complete |
| **REQ-ADM-02** | System health, pipeline run status, and queue depth observability | §7, §10 | `ObservabilityService` | Redis / Celery Inspect | `/v1/admin/health`, `/v1/admin/pipelines` | `/admin/system-health`, `HealthDashboard` | `TEST-ADM-002` | 1 | In Progress |
| **REQ-SEC-01** | DPDP Act 2023 candidate pseudonymization & data minimization | §9, §10 | `DataSanitizationService` | `placement_records` (candidate_hash) | All placement ingestion APIs | `CandidateIdCell` | `TEST-SEC-004` | 1 | Complete |
| **REQ-SEC-02** | Strict role-based URL, component, action, and API route security gates | §3, §10 | `SecurityInterceptor` | `permissions` | All protected endpoints | All protected React routes | `TEST-SEC-005` | 1 | Complete |
| **REQ-NFR-01** | Sub-300ms p95 API response times and sub-2.0s analytical page loads | §10 | Redis Cache, DB Indexes | Materialized views | All GET queries | Performance audit | `TEST-NFR-001` | All | In Progress |
| **REQ-NFR-02** | Trilingual localization (Marathi, Hindi, English) with zero hardcoded strings | §10 | `I18nEngine` (`react-i18next`)| JSON translation bundles | `/v1/i18n/{locale}` | `LanguageSelector`, `t('key')` | `TEST-NFR-002` | 1 | In Progress |
| **REQ-NFR-03** | WCAG 2.1 AA accessibility compliance across all public & administrative pages | §10 | Accessibility Design Tokens | N/A | Static HTML/ARIA compliance | High-contrast theme, ARIA trees | `TEST-NFR-003` | 1 | In Progress |

---

## 3. Upstream & Downstream Verification Checklist

When any requirement is modified:
1. **Upstream PRD Review:** Confirm that change aligns with Department objectives in [PRD.md](file:///e:/CODING/Projects/new%20sih2026/docs/01-product/PRD.md).
2. **Architecture Assessment:** Verify service boundary impact in [SYSTEM_ARCHITECTURE.md](file:///e:/CODING/Projects/new%20sih2026/docs/02-architecture/SYSTEM_ARCHITECTURE.md) and [BACKEND_ARCHITECTURE.md](file:///e:/CODING/Projects/new%20sih2026/docs/02-architecture/BACKEND_ARCHITECTURE.md).
3. **Data Integrity:** Update entity models in [DATABASE_SCHEMA.md](file:///e:/CODING/Projects/new%20sih2026/docs/02-architecture/DATABASE_SCHEMA.md) and attributes in [DATA_DICTIONARY.md](file:///e:/CODING/Projects/new%20sih2026/docs/06-data/DATA_DICTIONARY.md).
4. **Contract Synchronization:** Regenerate schemas in [openapi.yaml](file:///e:/CODING/Projects/new%20sih2026/docs/03-api/openapi.yaml) and [API_SPECIFICATION.md](file:///e:/CODING/Projects/new%20sih2026/docs/03-api/API_SPECIFICATION.md).
5. **Frontend Alignment:** Update routing guards and components in [FRONTEND_ARCHITECTURE.md](file:///e:/CODING/Projects/new%20sih2026/docs/02-architecture/FRONTEND_ARCHITECTURE.md).
6. **Test Verification:** Validate automated assertions in [TESTING_STRATEGY.md](file:///e:/CODING/Projects/new%20sih2026/docs/07-development/TESTING_STRATEGY.md).
