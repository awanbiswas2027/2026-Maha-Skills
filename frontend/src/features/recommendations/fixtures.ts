import { Dossier, Recommendation } from './model';

export const SAMPLE_DATA = true;

/**
 * 12 synthetic recommendations covering all 6 states, all 4 types, 3 sectors,
 * explicit SLA cases (on time, due in 2 days, overdue), stale case, and withdrawn example.
 * Compliant with DPDP Act 2023 (no candidate identifiers, synthetic enterprise names).
 */
export const MOCK_RECOMMENDATIONS: Recommendation[] = [
  // 1. ADD_MODULE in SSC_REVIEW - On Time (SLA ~10 working days)
  {
    id: 'rec-001-add-mod-ssc-ontime',
    recommendation_code: 'REC-AUTO-2026-001',
    type: 'ADD_MODULE',
    target_course_id: 'crs-auto-01',
    target_course_title: 'Electric Vehicle Service Technician',
    target_job_role: 'EV Powertrain Diagnostic Specialist',
    trigger_rule:
      'Gap score 74 for EV Diagnostics in Pune sustained 4 weeks; no active course covers regenerative braking at NSQF 4',
    reasons: [
      { code: 'GAP_PERSISTENT', weight: 40, params: { gap_score: 74, weeks: 4 } },
      { code: 'HIGH_DEMAND_GROWTH', weight: 35, params: { yoy_growth: 28 } },
      { code: 'EMPLOYER_CONSENSUS', weight: 25, params: { employer_count: 14 } },
    ],
    sources: [
      { kind: 'JOB_POSTINGS', ref: 'RUN-2026-W34-AUTO', contribution: 45 },
      { kind: 'EMPLOYER_SURVEY', ref: 'SRV-PUNE-AUTO-Q2', contribution: 35 },
      { kind: 'GAP_ENGINE', ref: 'GS-20260901-PUNE', contribution: 20 },
    ],
    estimated_uplift_pct: 18.5,
    uplift_basis:
      'Regression model trained on FY24-25 technician placement outcomes with certified EV modules across Chakan automotive cluster',
    gap_score_run_id: 'GSR-2026-09-01-A1',
    generated_at: '2026-09-05T08:30:00.000Z',
    state: 'SSC_REVIEW',
    current_step_role: 'SSC_REVIEWER',
    version: 1,
    sla_due_at: '2026-09-25T17:00:00.000Z', // On time (~8-10 working days)
    sector_id: 101,
    sector_name: 'Automotive',
    district_ids: [25, 26], // Pune, Satara
  },

  // 2. UPDATE_UNIT in SSC_REVIEW - Due in 2 days (Warning SLA)
  {
    id: 'rec-002-upd-unit-ssc-warning',
    recommendation_code: 'REC-ELEC-2026-002',
    type: 'UPDATE_UNIT',
    target_course_id: 'crs-elec-04',
    target_course_title: 'Industrial Automation Specialist',
    target_job_role: 'PLC & SCADA Maintenance Programmer',
    trigger_rule:
      'Gap score 68 for Siemens S7-1200 PLC in Aurangabad cluster; legacy curriculum covers obsolete relay logic',
    reasons: [
      { code: 'TECH_OBSOLESCENCE', weight: 45, params: { obsolete_module: 'Relay Logic v2' } },
      { code: 'VACANCY_BACKLOG', weight: 35, params: { open_vacancies: 310 } },
      { code: 'CURRICULUM_AGE', weight: 20, params: { years_since_update: 4 } },
    ],
    sources: [
      { kind: 'JOB_POSTINGS', ref: 'RUN-2026-W35-ELEC', contribution: 50 },
      { kind: 'INDUSTRY_FEEDBACK', ref: 'FDB-AUR-MFG-09', contribution: 50 },
    ],
    estimated_uplift_pct: 14.0,
    uplift_basis:
      'Comparative placement rate in Nashik ITI modernised cohort (78%) versus legacy cohort (61%)',
    gap_score_run_id: 'GSR-2026-09-05-E2',
    generated_at: '2026-09-02T10:00:00.000Z',
    state: 'SSC_REVIEW',
    current_step_role: 'SSC_REVIEWER',
    version: 1,
    sla_due_at: '2026-09-21T17:00:00.000Z', // Due in 2 working days relative to Sep 17
    sector_id: 102,
    sector_name: 'Electronics & Hardware',
    district_ids: [19, 20], // Chhatrapati Sambhajinagar, Jalna
  },

  // 3. DEVELOP_QUALIFICATION in SSC_REVIEW - Overdue (Danger SLA)
  {
    id: 'rec-003-dev-qual-ssc-overdue',
    recommendation_code: 'REC-IT-2026-003',
    type: 'DEVELOP_QUALIFICATION',
    target_job_role: 'Cloud Infrastructure & DevOps Associate',
    trigger_rule:
      'Statewide demand spike for entry-level Cloud Administrators (>1,200 openings); zero ITI trades aligned at NSQF 5',
    reasons: [
      { code: 'STRUCTURAL_DEFICIT', weight: 50, params: { statewide_vacancies: 1240 } },
      { code: 'SALARY_PREMIUM', weight: 30, params: { premium_pct: 35 } },
      { code: 'NEW_INDUSTRY_DEMAND', weight: 20, params: { cloud_growth: 42 } },
    ],
    sources: [
      { kind: 'JOB_POSTINGS', ref: 'RUN-2026-W32-IT', contribution: 60 },
      { kind: 'SECTOR_COUNCIL_BRIEF', ref: 'SCB-NASSCOM-2026', contribution: 40 },
    ],
    estimated_uplift_pct: 32.0,
    uplift_basis:
      'Starting compensation uplift based on IT-ITeS benchmark salaries across Hinjawadi and Airoli tech parks',
    gap_score_run_id: 'GSR-2026-08-20-IT1',
    generated_at: '2026-08-20T09:00:00.000Z',
    state: 'SSC_REVIEW',
    current_step_role: 'SSC_REVIEWER',
    version: 1,
    sla_due_at: '2026-09-10T17:00:00.000Z', // Overdue (Sep 10 was 5 working days ago)
    sector_id: 103,
    sector_name: 'IT-ITeS',
    district_ids: [21, 25, 30], // Thane, Pune, Nagpur
  },

  // 4. RETIRE_COURSE in DSEEI_APPROVAL - On Time
  {
    id: 'rec-004-ret-crs-dseei-ontime',
    recommendation_code: 'REC-AUTO-2026-004',
    type: 'RETIRE_COURSE',
    target_course_id: 'crs-auto-09',
    target_course_title: 'Carburettor Tuning & Maintenance',
    target_job_role: 'Carburettor Mechanic',
    trigger_rule:
      'Under-placement below 20% for 6 consecutive quarters statewide; BS-VI emission standards eliminated carburettors',
    reasons: [
      { code: 'REGULATORY_PHASEOUT', weight: 60, params: { standard: 'BS-VI' } },
      { code: 'PLACEMENT_COLLAPSE', weight: 40, params: { six_quarter_avg: 16.4 } },
    ],
    sources: [
      { kind: 'PLACEMENT_RETURNS', ref: 'PL-MAHA-2024-25', contribution: 70 },
      { kind: 'REGULATORY_GAZETTE', ref: 'MORTH-BSVI-NOTIF', contribution: 30 },
    ],
    estimated_uplift_pct: 22.0,
    uplift_basis:
      'Redeployment of institute lab space and intake capacity to Fuel Injection and Hybrid Powertrain courses',
    gap_score_run_id: 'GSR-2026-08-28-A2',
    generated_at: '2026-08-28T11:00:00.000Z',
    state: 'DSEEI_APPROVAL',
    current_step_role: 'POLICY_MAKER',
    version: 2,
    sla_due_at: '2026-09-23T17:00:00.000Z', // 5 working days left
    sector_id: 101,
    sector_name: 'Automotive',
    district_ids: [1, 2, 25, 30], // Mumbai, Pune, Nagpur
  },

  // 5. DEVELOP_QUALIFICATION in DSEEI_APPROVAL - Due in 2 days (Warning)
  {
    id: 'rec-005-dev-qual-dseei-warning',
    recommendation_code: 'REC-ELEC-2026-005',
    type: 'DEVELOP_QUALIFICATION',
    target_job_role: 'Solar Microgrid & Energy Storage Installer',
    trigger_rule:
      'State renewable target demands 4,000 distributed storage technicians; PM-Surya Ghar rollout in rural districts',
    reasons: [
      { code: 'STATE_POLICY_MANDATE', weight: 50, params: { policy: 'PM-Surya Ghar' } },
      { code: 'UNMET_DISTRICT_NEED', weight: 30, params: { districts_reporting: 18 } },
      { code: 'HIGH_ABSORPTION_RATE', weight: 20, params: { projected_absorption: 85 } },
    ],
    sources: [
      { kind: 'GOVT_MISSION', ref: 'MAHADISCOM-SOLAR-2026', contribution: 50 },
      { kind: 'DISTRICT_PLANS', ref: 'DP-2026-AGGREGATE', contribution: 50 },
    ],
    estimated_uplift_pct: 26.5,
    uplift_basis:
      'Placement guarantee tie-ups with state solar contractors and DISCOM empaneled installers',
    gap_score_run_id: 'GSR-2026-09-02-E1',
    generated_at: '2026-09-02T14:00:00.000Z',
    state: 'DSEEI_APPROVAL',
    current_step_role: 'POLICY_MAKER',
    version: 2,
    sla_due_at: '2026-09-19T17:00:00.000Z', // Due in 2 working days relative to Sep 17
    sector_id: 102,
    sector_name: 'Electronics & Hardware',
    district_ids: [10, 11, 12, 13], // Nashik, Dhule, Jalgaon
  },

  // 6. UPDATE_UNIT in DSEEI_APPROVAL - Overdue (Danger)
  {
    id: 'rec-006-upd-unit-dseei-overdue',
    recommendation_code: 'REC-IT-2026-006',
    type: 'UPDATE_UNIT',
    target_course_id: 'crs-it-02',
    target_course_title: 'Computer Operator and Programming Assistant (COPA)',
    target_job_role: 'Data Protection & Cybersecurity Assistant',
    trigger_rule:
      'Digital Personal Data Protection (DPDP) Act compliance requires foundational cybersecurity unit in COPA',
    reasons: [
      { code: 'COMPLIANCE_REQUIREMENT', weight: 55, params: { legislation: 'DPDP Act 2023' } },
      { code: 'ENTRY_LEVEL_DEMAND', weight: 45, params: { hiring_volume: 480 } },
    ],
    sources: [
      { kind: 'LEGAL_AUDIT', ref: 'DPDP-2023-COMPLIANCE', contribution: 60 },
      { kind: 'JOB_POSTINGS', ref: 'RUN-2026-W33-IT', contribution: 40 },
    ],
    estimated_uplift_pct: 12.0,
    uplift_basis:
      'Mandatory IT security clearance required for government IT contractors and BFSI service vendors',
    gap_score_run_id: 'GSR-2026-08-25-IT2',
    generated_at: '2026-08-25T10:00:00.000Z',
    state: 'DSEEI_APPROVAL',
    current_step_role: 'POLICY_MAKER',
    version: 2,
    sla_due_at: '2026-09-11T17:00:00.000Z', // 4 working days overdue
    sector_id: 103,
    sector_name: 'IT-ITeS',
    district_ids: [21, 22, 25], // Thane, Raigad, Pune
  },

  // 7. ADD_MODULE in DRAFT - Freshly generated
  {
    id: 'rec-007-add-mod-draft',
    recommendation_code: 'REC-AUTO-2026-007',
    type: 'ADD_MODULE',
    target_course_id: 'crs-auto-03',
    target_course_title: 'Mechanic Diesel',
    target_job_role: 'CNG & Dual-Fuel Engine Technician',
    trigger_rule:
      'Commercial fleet transition to CNG in Pune and Thane municipal corporations shows 40% unserved postings',
    reasons: [
      { code: 'FLEET_FUEL_SHIFT', weight: 60, params: { cng_conversion_pct: 42 } },
      { code: 'LOCAL_SKILL_SHORTAGE', weight: 40, params: { shortage_ratio: 2.4 } },
    ],
    sources: [
      { kind: 'MUNICIPAL_TRANSPORT', ref: 'PMPML-FLEET-2026', contribution: 50 },
      { kind: 'JOB_POSTINGS', ref: 'RUN-2026-W36-AUTO', contribution: 50 },
    ],
    estimated_uplift_pct: 15.0,
    uplift_basis:
      'Guaranteed apprenticeship intake by municipal transport undertakings and fleet operators',
    gap_score_run_id: 'GSR-2026-09-12-A1',
    generated_at: '2026-09-12T08:00:00.000Z',
    state: 'DRAFT',
    current_step_role: null,
    version: 1,
    sla_due_at: '2026-10-02T17:00:00.000Z',
    sector_id: 101,
    sector_name: 'Automotive',
    district_ids: [21, 25], // Thane, Pune
  },

  // 8. UPDATE_UNIT in CHANGES_REQUESTED - Returned by SSC
  {
    id: 'rec-008-upd-unit-changes-req',
    recommendation_code: 'REC-ELEC-2026-008',
    type: 'UPDATE_UNIT',
    target_course_id: 'crs-elec-02',
    target_course_title: 'Wireman',
    target_job_role: 'Building Energy Management Wireman',
    trigger_rule:
      'Smart meter installation mandate across MSEDCL consumer base requires smart relay wiring modules',
    reasons: [
      { code: 'UTILITY_MANDATE', weight: 60, params: { meter_target_lakhs: 50 } },
      { code: 'SAFETY_STANDARDS', weight: 40, params: { standard: 'IS 16444' } },
    ],
    sources: [
      { kind: 'DISCOM_DIRECTIVE', ref: 'MSEDCL-AMI-2026', contribution: 70 },
      { kind: 'GAP_ENGINE', ref: 'GS-20260901-NASHIK', contribution: 30 },
    ],
    estimated_uplift_pct: 11.0,
    uplift_basis: 'Direct contractor empanelment upon passing certified IS 16444 unit test',
    gap_score_run_id: 'GSR-2026-09-01-E3',
    generated_at: '2026-09-01T09:30:00.000Z',
    state: 'CHANGES_REQUESTED',
    current_step_role: null,
    version: 2,
    sla_due_at: '2026-09-22T17:00:00.000Z',
    sector_id: 102,
    sector_name: 'Electronics & Hardware',
    district_ids: [10, 11], // Nashik, Dhule
  },

  // 9. ADD_MODULE in PUBLISHED - Approved via SSC Ratification
  {
    id: 'rec-009-add-mod-published',
    recommendation_code: 'REC-IT-2026-009',
    type: 'ADD_MODULE',
    target_course_id: 'crs-it-01',
    target_course_title: 'Information Technology (IT) Essentials',
    target_job_role: 'Generative AI Prompt Engineering for Office Automation',
    trigger_rule:
      'Over 600 office assistant postings require LLM prompt workflow competence across Pune & Mumbai',
    reasons: [
      { code: 'PRODUCTIVITY_TECH', weight: 50, params: { prompt_tooling: 'Copilot/ChatGPT' } },
      { code: 'EMPLOYER_PRIORITY', weight: 50, params: { survey_priority: 1 } },
    ],
    sources: [
      { kind: 'EMPLOYER_SURVEY', ref: 'SRV-MAHA-IT-Q2', contribution: 60 },
      { kind: 'JOB_POSTINGS', ref: 'RUN-2026-W30-IT', contribution: 40 },
    ],
    estimated_uplift_pct: 19.5,
    uplift_basis:
      'Measured salary premium in pilot batches conducted in Chhatrapati Sambhajinagar ITI',
    gap_score_run_id: 'GSR-2026-08-10-IT1',
    generated_at: '2026-08-10T10:00:00.000Z',
    state: 'PUBLISHED',
    current_step_role: null,
    version: 2,
    sla_due_at: '2026-08-28T17:00:00.000Z',
    sector_id: 103,
    sector_name: 'IT-ITeS',
    district_ids: [1, 2, 25],
  },

  // 10. DEVELOP_QUALIFICATION in PUBLISHED - Approved by DSEEI
  {
    id: 'rec-010-dev-qual-published',
    recommendation_code: 'REC-AUTO-2026-010',
    type: 'DEVELOP_QUALIFICATION',
    target_job_role: 'Precision CNC 5-Axis Machinist',
    trigger_rule:
      'Defense and aerospace corridor investments in Nagpur and Pune demand 800 multi-axis CNC operators',
    reasons: [
      { code: 'STRATEGIC_CORRIDOR', weight: 55, params: { sector: 'Defense Electronics' } },
      { code: 'WAGE_INDEX', weight: 45, params: { median_wage_inr: 28000 } },
    ],
    sources: [
      { kind: 'INVEST_MAHARASHTRA', ref: 'MIDC-DEFENSE-CORRIDOR', contribution: 60 },
      { kind: 'EMPLOYER_PARTNERSHIP', ref: 'MOU-AERO-NAGPUR', contribution: 40 },
    ],
    estimated_uplift_pct: 35.0,
    uplift_basis:
      'Guaranteed placement MOUs signed with 6 defense tier-1 vendors at Nagpur MIHAN SEZ',
    gap_score_run_id: 'GSR-2026-07-20-A1',
    generated_at: '2026-07-20T09:00:00.000Z',
    state: 'PUBLISHED',
    current_step_role: null,
    version: 3,
    sla_due_at: '2026-08-15T17:00:00.000Z',
    sector_id: 101,
    sector_name: 'Automotive',
    district_ids: [25, 30], // Pune, Nagpur
  },

  // 11. RETIRE_COURSE in REJECTED - Rejected by DSEEI with comment
  {
    id: 'rec-011-ret-crs-rejected',
    recommendation_code: 'REC-ELEC-2026-011',
    type: 'RETIRE_COURSE',
    target_course_id: 'crs-elec-08',
    target_course_title: 'CRT Television Repair',
    target_job_role: 'Display Hardware Servicing Technician',
    trigger_rule:
      'Zero new job listings for cathode-ray tubes statewide; recommendation drafted to decommission trade completely',
    reasons: [
      { code: 'ZERO_DEMAND', weight: 70, params: { posting_count_90d: 0 } },
      { code: 'EQUIPMENT_REDEPLOY', weight: 30, params: { reclaimable_sqft: 1400 } },
    ],
    sources: [
      { kind: 'JOB_POSTINGS', ref: 'RUN-2026-W28-ELEC', contribution: 80 },
      { kind: 'PLACEMENT_RETURNS', ref: 'PL-MAHA-2024-25', contribution: 20 },
    ],
    estimated_uplift_pct: 8.0,
    uplift_basis: 'Reclaimed floor capacity allocated to PCB surface-mount technology line',
    gap_score_run_id: 'GSR-2026-07-15-E1',
    generated_at: '2026-07-15T11:00:00.000Z',
    state: 'REJECTED',
    current_step_role: null,
    version: 2,
    sla_due_at: '2026-08-04T17:00:00.000Z',
    sector_id: 102,
    sector_name: 'Electronics & Hardware',
    district_ids: [10, 19, 25],
  },

  // 12. STALE + WITHDRAWN EXAMPLE - Generated > 56 days ago, withdrawn with explicit reason
  {
    id: 'rec-012-stale-withdrawn',
    recommendation_code: 'REC-IT-2026-012',
    type: 'ADD_MODULE',
    target_course_id: 'crs-it-03',
    target_course_title: 'Web Design and Development',
    target_job_role: 'Full Stack JavaScript Junior Developer',
    trigger_rule:
      'Gap score 68 for React/Node.js sustained 5 weeks in Nashik industrial belt',
    reasons: [
      { code: 'GAP_PERSISTENT', weight: 50, params: { gap_score: 68 } },
      { code: 'LOCAL_CLUSTER_DEMAND', weight: 50, params: { cluster: 'Ambad IT Hub' } },
    ],
    sources: [
      { kind: 'JOB_POSTINGS', ref: 'RUN-2026-W24-IT', contribution: 70 },
      { kind: 'EMPLOYER_FEEDBACK', ref: 'FDB-NASHIK-IT-01', contribution: 30 },
    ],
    estimated_uplift_pct: 16.0,
    uplift_basis: 'Tech park hiring intake for junior frontend developers',
    gap_score_run_id: 'GSR-2026-06-10-IT1',
    generated_at: '2026-06-10T08:00:00.000Z', // > 90 days ago (>56 days stale)
    state: 'REJECTED',
    current_step_role: null,
    version: 2,
    sla_due_at: '2026-06-30T17:00:00.000Z',
    sector_id: 103,
    sector_name: 'IT-ITeS',
    district_ids: [10], // Nashik
    withdrawal_reason:
      'Gap closed: Local employer hiring satisfied by expanded ITI batch; deficit dropped from 68 to 24',
  },
];

/**
 * Empirical evidence dossiers for each of the 12 recommendations.
 * Contains 12-month demand trend, top employers, comparable courses (sample size >= 30),
 * and affected districts with localized gap scores.
 */
export const MOCK_DOSSIERS: Record<string, Dossier> = {
  'rec-001-add-mod-ssc-ontime': {
    recommendation_id: 'rec-001-add-mod-ssc-ontime',
    recommendation_code: 'REC-AUTO-2026-001',
    demand_trend_12m: [
      { month: '2025-10', demand_count: 85 },
      { month: '2025-11', demand_count: 92 },
      { month: '2025-12', demand_count: 108 },
      { month: '2026-01', demand_count: 115 },
      { month: '2026-02', demand_count: 124 },
      { month: '2026-03', demand_count: 140 },
      { month: '2026-04', demand_count: 155 },
      { month: '2026-05', demand_count: 168 },
      { month: '2026-06', demand_count: 182 },
      { month: '2026-07', demand_count: 195 },
      { month: '2026-08', demand_count: 210 },
      { month: '2026-09', demand_count: 232 },
    ],
    top_employers: [
      { name: 'Maharashtra EV Motors Pvt Ltd', active_postings: 58, share_pct: 25.0 },
      { name: 'Sahyadri Powertrain Components', active_postings: 42, share_pct: 18.1 },
      { name: 'Chakan Electric Drive Systems', active_postings: 36, share_pct: 15.5 },
      { name: 'Western India Battery Solutions', active_postings: 28, share_pct: 12.1 },
    ],
    comparable_courses: [
      {
        course_id: 'cmp-01-ev',
        course_name: 'Automotive Electrical Systems (NSQF 4)',
        institute_count: 12,
        placement_rate: 76.5,
        median_salary_inr: 18500,
        sample_size: 148,
      },
      {
        course_id: 'cmp-02-mech',
        course_name: 'Mechanic Motor Vehicle (NSQF 4)',
        institute_count: 24,
        placement_rate: 64.0,
        median_salary_inr: 15200,
        sample_size: 420,
      },
    ],
    affected_districts: [
      { district_id: 25, district_name: 'Pune', gap_score: 74, demand_count: 180 },
      { district_id: 26, district_name: 'Satara', gap_score: 66, demand_count: 52 },
    ],
    dossier_pdf_url: 'https://cdn.mahaskills.gov.in/dossiers/REC-AUTO-2026-001.pdf',
  },

  'rec-002-upd-unit-ssc-warning': {
    recommendation_id: 'rec-002-upd-unit-ssc-warning',
    recommendation_code: 'REC-ELEC-2026-002',
    demand_trend_12m: [
      { month: '2025-10', demand_count: 45 },
      { month: '2025-11', demand_count: 50 },
      { month: '2025-12', demand_count: 52 },
      { month: '2026-01', demand_count: 61 },
      { month: '2026-02', demand_count: 68 },
      { month: '2026-03', demand_count: 75 },
      { month: '2026-04', demand_count: 82 },
      { month: '2026-05', demand_count: 90 },
      { month: '2026-06', demand_count: 98 },
      { month: '2026-07', demand_count: 104 },
      { month: '2026-08', demand_count: 112 },
      { month: '2026-09', demand_count: 120 },
    ],
    top_employers: [
      { name: 'Aurangabad Industrial Automation Ltd', active_postings: 34, share_pct: 28.3 },
      { name: 'Marathwada Precision Controls', active_postings: 28, share_pct: 23.3 },
      { name: 'Deccan Switchgears & Systems', active_postings: 22, share_pct: 18.3 },
    ],
    comparable_courses: [
      {
        course_id: 'cmp-03-elec',
        course_name: 'Electrician (NSQF 4)',
        institute_count: 18,
        placement_rate: 68.2,
        median_salary_inr: 16500,
        sample_size: 260,
      },
    ],
    affected_districts: [
      { district_id: 19, district_name: 'Chhatrapati Sambhajinagar', gap_score: 68, demand_count: 86 },
      { district_id: 20, district_name: 'Jalna', gap_score: 62, demand_count: 34 },
    ],
    dossier_pdf_url: 'https://cdn.mahaskills.gov.in/dossiers/REC-ELEC-2026-002.pdf',
  },

  'rec-003-dev-qual-ssc-overdue': {
    recommendation_id: 'rec-003-dev-qual-ssc-overdue',
    recommendation_code: 'REC-IT-2026-003',
    demand_trend_12m: [
      { month: '2025-10', demand_count: 310 },
      { month: '2025-11', demand_count: 340 },
      { month: '2025-12', demand_count: 380 },
      { month: '2026-01', demand_count: 420 },
      { month: '2026-02', demand_count: 490 },
      { month: '2026-03', demand_count: 560 },
      { month: '2026-04', demand_count: 650 },
      { month: '2026-05', demand_count: 740 },
      { month: '2026-06', demand_count: 850 },
      { month: '2026-07', demand_count: 980 },
      { month: '2026-08', demand_count: 1100 },
      { month: '2026-09', demand_count: 1240 },
    ],
    top_employers: [
      { name: 'MahaNet Cloud Solutions', active_postings: 210, share_pct: 16.9 },
      { name: 'Apex Digital Infrastructure', active_postings: 185, share_pct: 14.9 },
      { name: 'Vanguard Enterprise DevOps', active_postings: 140, share_pct: 11.3 },
    ],
    comparable_courses: [
      {
        course_id: 'cmp-04-copa',
        course_name: 'COPA (NSQF 3)',
        institute_count: 35,
        placement_rate: 54.0,
        median_salary_inr: 14000,
        sample_size: 890,
      },
    ],
    affected_districts: [
      { district_id: 25, district_name: 'Pune', gap_score: 82, demand_count: 720 },
      { district_id: 21, district_name: 'Thane', gap_score: 75, demand_count: 340 },
      { district_id: 30, district_name: 'Nagpur', gap_score: 69, demand_count: 180 },
    ],
    dossier_pdf_url: 'https://cdn.mahaskills.gov.in/dossiers/REC-IT-2026-003.pdf',
  },

  'rec-004-ret-crs-dseei-ontime': {
    recommendation_id: 'rec-004-ret-crs-dseei-ontime',
    recommendation_code: 'REC-AUTO-2026-004',
    demand_trend_12m: [
      { month: '2025-10', demand_count: 18 },
      { month: '2025-11', demand_count: 14 },
      { month: '2025-12', demand_count: 11 },
      { month: '2026-01', demand_count: 8 },
      { month: '2026-02', demand_count: 6 },
      { month: '2026-03', demand_count: 5 },
      { month: '2026-04', demand_count: 4 },
      { month: '2026-05', demand_count: 3 },
      { month: '2026-06', demand_count: 2 },
      { month: '2026-07', demand_count: 1 },
      { month: '2026-08', demand_count: 1 },
      { month: '2026-09', demand_count: 0 },
    ],
    top_employers: [
      { name: 'State Retrofit Services', active_postings: 1, share_pct: 100.0 },
    ],
    comparable_courses: [
      {
        course_id: 'cmp-05-efi',
        course_name: 'Electronic Fuel Injection Service (NSQF 4)',
        institute_count: 16,
        placement_rate: 81.0,
        median_salary_inr: 19000,
        sample_size: 210,
      },
    ],
    affected_districts: [
      { district_id: 1, district_name: 'Mumbai City', gap_score: 18, demand_count: 2 },
      { district_id: 25, district_name: 'Pune', gap_score: 22, demand_count: 4 },
    ],
    dossier_pdf_url: 'https://cdn.mahaskills.gov.in/dossiers/REC-AUTO-2026-004.pdf',
  },

  'rec-005-dev-qual-dseei-warning': {
    recommendation_id: 'rec-005-dev-qual-dseei-warning',
    recommendation_code: 'REC-ELEC-2026-005',
    demand_trend_12m: [
      { month: '2025-10', demand_count: 110 },
      { month: '2025-11', demand_count: 140 },
      { month: '2025-12', demand_count: 185 },
      { month: '2026-01', demand_count: 230 },
      { month: '2026-02', demand_count: 290 },
      { month: '2026-03', demand_count: 360 },
      { month: '2026-04', demand_count: 440 },
      { month: '2026-05', demand_count: 530 },
      { month: '2026-06', demand_count: 620 },
      { month: '2026-07', demand_count: 730 },
      { month: '2026-08', demand_count: 850 },
      { month: '2026-09', demand_count: 980 },
    ],
    top_employers: [
      { name: 'Maharashtra Green Energy Infra', active_postings: 190, share_pct: 19.4 },
      { name: 'Surya Solar Installations', active_postings: 145, share_pct: 14.8 },
      { name: 'Khandesh Microgrid Systems', active_postings: 110, share_pct: 11.2 },
    ],
    comparable_courses: [
      {
        course_id: 'cmp-06-solar',
        course_name: 'Solar Technician (Electrical)',
        institute_count: 22,
        placement_rate: 74.0,
        median_salary_inr: 17200,
        sample_size: 310,
      },
    ],
    affected_districts: [
      { district_id: 10, district_name: 'Nashik', gap_score: 79, demand_count: 410 },
      { district_id: 11, district_name: 'Dhule', gap_score: 71, demand_count: 280 },
      { district_id: 12, district_name: 'Jalgaon', gap_score: 68, demand_count: 290 },
    ],
    dossier_pdf_url: 'https://cdn.mahaskills.gov.in/dossiers/REC-ELEC-2026-005.pdf',
  },

  'rec-006-upd-unit-dseei-overdue': {
    recommendation_id: 'rec-006-upd-unit-dseei-overdue',
    recommendation_code: 'REC-IT-2026-006',
    demand_trend_12m: [
      { month: '2025-10', demand_count: 90 },
      { month: '2025-11', demand_count: 105 },
      { month: '2025-12', demand_count: 120 },
      { month: '2026-01', demand_count: 145 },
      { month: '2026-02', demand_count: 170 },
      { month: '2026-03', demand_count: 210 },
      { month: '2026-04', demand_count: 260 },
      { month: '2026-05', demand_count: 310 },
      { month: '2026-06', demand_count: 360 },
      { month: '2026-07', demand_count: 405 },
      { month: '2026-08', demand_count: 440 },
      { month: '2026-09', demand_count: 480 },
    ],
    top_employers: [
      { name: 'FinSecure Audit Services', active_postings: 88, share_pct: 18.3 },
      { name: 'MahaGov Tech Support Center', active_postings: 72, share_pct: 15.0 },
      { name: 'Sahyadri Cyber Defenses', active_postings: 54, share_pct: 11.3 },
    ],
    comparable_courses: [
      {
        course_id: 'cmp-07-copa-sec',
        course_name: 'COPA (Standard)',
        institute_count: 42,
        placement_rate: 56.0,
        median_salary_inr: 14500,
        sample_size: 940,
      },
    ],
    affected_districts: [
      { district_id: 25, district_name: 'Pune', gap_score: 72, demand_count: 240 },
      { district_id: 21, district_name: 'Thane', gap_score: 68, demand_count: 180 },
      { district_id: 22, district_name: 'Raigad', gap_score: 60, demand_count: 60 },
    ],
    dossier_pdf_url: 'https://cdn.mahaskills.gov.in/dossiers/REC-IT-2026-006.pdf',
  },

  'rec-007-add-mod-draft': {
    recommendation_id: 'rec-007-add-mod-draft',
    recommendation_code: 'REC-AUTO-2026-007',
    demand_trend_12m: [
      { month: '2025-10', demand_count: 40 },
      { month: '2025-11', demand_count: 48 },
      { month: '2025-12', demand_count: 55 },
      { month: '2026-01', demand_count: 62 },
      { month: '2026-02', demand_count: 70 },
      { month: '2026-03', demand_count: 78 },
      { month: '2026-04', demand_count: 85 },
      { month: '2026-05', demand_count: 94 },
      { month: '2026-06', demand_count: 105 },
      { month: '2026-07', demand_count: 115 },
      { month: '2026-08', demand_count: 125 },
      { month: '2026-09', demand_count: 138 },
    ],
    top_employers: [
      { name: 'Metropolitan Fleet CNG Retrofits', active_postings: 42, share_pct: 30.4 },
      { name: 'Western Transport Fuels Ltd', active_postings: 32, share_pct: 23.2 },
    ],
    comparable_courses: [
      {
        course_id: 'cmp-08-diesel',
        course_name: 'Mechanic Diesel (NSQF 4)',
        institute_count: 15,
        placement_rate: 62.0,
        median_salary_inr: 15500,
        sample_size: 280,
      },
    ],
    affected_districts: [
      { district_id: 25, district_name: 'Pune', gap_score: 65, demand_count: 88 },
      { district_id: 21, district_name: 'Thane', gap_score: 63, demand_count: 50 },
    ],
  },

  'rec-008-upd-unit-changes-req': {
    recommendation_id: 'rec-008-upd-unit-changes-req',
    recommendation_code: 'REC-ELEC-2026-008',
    demand_trend_12m: [
      { month: '2025-10', demand_count: 60 },
      { month: '2025-11', demand_count: 65 },
      { month: '2025-12', demand_count: 72 },
      { month: '2026-01', demand_count: 80 },
      { month: '2026-02', demand_count: 88 },
      { month: '2026-03', demand_count: 95 },
      { month: '2026-04', demand_count: 104 },
      { month: '2026-05', demand_count: 112 },
      { month: '2026-06', demand_count: 120 },
      { month: '2026-07', demand_count: 130 },
      { month: '2026-08', demand_count: 142 },
      { month: '2026-09', demand_count: 155 },
    ],
    top_employers: [
      { name: 'Khandesh Power & Smart Meters', active_postings: 45, share_pct: 29.0 },
      { name: 'Godavari Electrical Services', active_postings: 35, share_pct: 22.6 },
    ],
    comparable_courses: [
      {
        course_id: 'cmp-09-wire',
        course_name: 'Wireman (NSQF 3)',
        institute_count: 20,
        placement_rate: 61.5,
        median_salary_inr: 14800,
        sample_size: 340,
      },
    ],
    affected_districts: [
      { district_id: 10, district_name: 'Nashik', gap_score: 67, demand_count: 95 },
      { district_id: 11, district_name: 'Dhule', gap_score: 62, demand_count: 60 },
    ],
  },

  'rec-009-add-mod-published': {
    recommendation_id: 'rec-009-add-mod-published',
    recommendation_code: 'REC-IT-2026-009',
    demand_trend_12m: [
      { month: '2025-10', demand_count: 120 },
      { month: '2025-11', demand_count: 160 },
      { month: '2025-12', demand_count: 210 },
      { month: '2026-01', demand_count: 270 },
      { month: '2026-02', demand_count: 340 },
      { month: '2026-03', demand_count: 420 },
      { month: '2026-04', demand_count: 490 },
      { month: '2026-05', demand_count: 550 },
      { month: '2026-06', demand_count: 590 },
      { month: '2026-07', demand_count: 620 },
      { month: '2026-08', demand_count: 650 },
      { month: '2026-09', demand_count: 680 },
    ],
    top_employers: [
      { name: 'Deccan Business Automations', active_postings: 115, share_pct: 16.9 },
      { name: 'Sahyadri Tech Outsourcing', active_postings: 95, share_pct: 14.0 },
    ],
    comparable_courses: [
      {
        course_id: 'cmp-10-it-ess',
        course_name: 'IT Essentials',
        institute_count: 28,
        placement_rate: 71.0,
        median_salary_inr: 16800,
        sample_size: 510,
      },
    ],
    affected_districts: [
      { district_id: 1, district_name: 'Mumbai City', gap_score: 75, demand_count: 280 },
      { district_id: 25, district_name: 'Pune', gap_score: 78, demand_count: 320 },
      { district_id: 2, district_name: 'Mumbai Suburban', gap_score: 72, demand_count: 80 },
    ],
  },

  'rec-010-dev-qual-published': {
    recommendation_id: 'rec-010-dev-qual-published',
    recommendation_code: 'REC-AUTO-2026-010',
    demand_trend_12m: [
      { month: '2025-10', demand_count: 180 },
      { month: '2025-11', demand_count: 220 },
      { month: '2025-12', demand_count: 270 },
      { month: '2026-01', demand_count: 340 },
      { month: '2026-02', demand_count: 420 },
      { month: '2026-03', demand_count: 510 },
      { month: '2026-04', demand_count: 590 },
      { month: '2026-05', demand_count: 670 },
      { month: '2026-06', demand_count: 730 },
      { month: '2026-07', demand_count: 780 },
      { month: '2026-08', demand_count: 810 },
      { month: '2026-09', demand_count: 850 },
    ],
    top_employers: [
      { name: 'Vidarbha Defense Components Ltd', active_postings: 180, share_pct: 21.2 },
      { name: 'Nagpur Aerospace Precision Tools', active_postings: 140, share_pct: 16.5 },
    ],
    comparable_courses: [
      {
        course_id: 'cmp-11-mach',
        course_name: 'Machinist (NSQF 4)',
        institute_count: 18,
        placement_rate: 69.5,
        median_salary_inr: 17500,
        sample_size: 380,
      },
    ],
    affected_districts: [
      { district_id: 30, district_name: 'Nagpur', gap_score: 84, demand_count: 490 },
      { district_id: 25, district_name: 'Pune', gap_score: 79, demand_count: 360 },
    ],
  },

  'rec-011-ret-crs-rejected': {
    recommendation_id: 'rec-011-ret-crs-rejected',
    recommendation_code: 'REC-ELEC-2026-011',
    demand_trend_12m: [
      { month: '2025-10', demand_count: 5 },
      { month: '2025-11', demand_count: 3 },
      { month: '2025-12', demand_count: 2 },
      { month: '2026-01', demand_count: 1 },
      { month: '2026-02', demand_count: 0 },
      { month: '2026-03', demand_count: 0 },
      { month: '2026-04', demand_count: 0 },
      { month: '2026-05', demand_count: 0 },
      { month: '2026-06', demand_count: 0 },
      { month: '2026-07', demand_count: 0 },
      { month: '2026-08', demand_count: 0 },
      { month: '2026-09', demand_count: 0 },
    ],
    top_employers: [
      { name: 'Marathwada Electronic Recyclers', active_postings: 0, share_pct: 0 },
    ],
    comparable_courses: [
      {
        course_id: 'cmp-12-smd',
        course_name: 'SMD Soldering & Repair Technician',
        institute_count: 10,
        placement_rate: 73.0,
        median_salary_inr: 16000,
        sample_size: 110,
      },
    ],
    affected_districts: [
      { district_id: 19, district_name: 'Chhatrapati Sambhajinagar', gap_score: 12, demand_count: 0 },
      { district_id: 10, district_name: 'Nashik', gap_score: 10, demand_count: 0 },
    ],
  },

  'rec-012-stale-withdrawn': {
    recommendation_id: 'rec-012-stale-withdrawn',
    recommendation_code: 'REC-IT-2026-012',
    demand_trend_12m: [
      { month: '2025-10', demand_count: 80 },
      { month: '2025-11', demand_count: 90 },
      { month: '2025-12', demand_count: 95 },
      { month: '2026-01', demand_count: 85 },
      { month: '2026-02', demand_count: 75 },
      { month: '2026-03', demand_count: 60 },
      { month: '2026-04', demand_count: 45 },
      { month: '2026-05', demand_count: 35 },
      { month: '2026-06', demand_count: 30 },
      { month: '2026-07', demand_count: 28 },
      { month: '2026-08', demand_count: 25 },
      { month: '2026-09', demand_count: 24 },
    ],
    top_employers: [
      { name: 'Khandesh Software Park', active_postings: 12, share_pct: 50.0 },
      { name: 'Ambad Web Studio', active_postings: 12, share_pct: 50.0 },
    ],
    comparable_courses: [
      {
        course_id: 'cmp-13-web',
        course_name: 'Web Designer & Developer',
        institute_count: 14,
        placement_rate: 66.0,
        median_salary_inr: 16500,
        sample_size: 210,
      },
    ],
    affected_districts: [
      { district_id: 10, district_name: 'Nashik', gap_score: 24, demand_count: 24 },
    ],
  },
};
