/**
 * MahaSkills — Admin Console Domain Models
 * Problem Statement ID: 26134
 *
 * Types for pipeline ingestion orchestration, Airflow DAG execution tracking,
 * DPDP-compliant audit logging (strict pseudonymity, zero PII), and 4-tier
 * hierarchical skill taxonomy trees (Sector -> SSC -> Job Role -> Skill).
 */

export type PipelineRunState = 'QUEUED' | 'RUNNING' | 'SUCCESS' | 'FAILED' | 'SKIPPED';

export interface PipelineRun {
  dagId: string;
  runId: string;
  state: PipelineRunState;
  startedAt: string | null;
  finishedAt: string | null;
  durationSeconds: number | null;
  recordsIn: number;
  recordsOut: number;
  errorSummary: string | null;
}

export type AuditEventRole =
  | 'ADMIN'
  | 'POLICY_MAKER'
  | 'DISTRICT_OFFICER'
  | 'ITI_PRINCIPAL'
  | 'EMPLOYER'
  | 'SSC_REVIEWER'
  | 'CANDIDATE'
  | 'SYSTEM';

export type AuditEventOutcome = 'SUCCESS' | 'FAILURE' | 'DENIED';

/**
 * Audit log event record.
 * IN COMPLIANCE WITH DPDP ACT 2023:
 * Contains actor role and pseudonymous actor identifier only.
 * No candidate roll numbers, student names, phone numbers, or unhashed PII.
 */
export interface AuditEvent {
  id: string;
  actorRole: AuditEventRole;
  actorId: string; // Strictly pseudonymous ID, e.g. "usr_anon_3f92", never raw PII
  action: string;
  resource: string;
  scope: string;
  timestamp: string; // ISO 8601
  outcome: AuditEventOutcome;
  traceId: string;
}

export type TaxonomyLevel = 'sector' | 'ssc' | 'job_role' | 'skill';

export interface TaxonomyNode {
  id: string;
  code?: string;
  nameEn: string;
  nameMr: string;
  nameHi?: string;
  level: TaxonomyLevel;
  isEmerging?: boolean;
  children?: TaxonomyNode[];
  parentId?: string | null;
  nsqfLevel?: number;
}

export type HealthStatus = 'HEALTHY' | 'WARNING' | 'CRITICAL' | 'STALE' | 'UNKNOWN';
export type HealthTone = 'neutral' | 'success' | 'warning' | 'danger';
export type DagSchedule = 'nightly' | 'weekly' | 'monthly' | 'custom';

export interface PipelineHealthInfo {
  dagId: string;
  schedule: DagSchedule;
  lastRunState: PipelineRunState | null;
  lastRunAt: string | null;
  lastSuccessAt: string | null;
  hoursSinceLastSuccess: number | null;
  isStale: boolean;
  status: HealthStatus;
  tone: HealthTone;
  messageKey: string;
}

export interface PipelineHealthSummary {
  overallStatus: HealthStatus;
  overallTone: HealthTone;
  staleDags: string[];
  dagHealth: Record<string, PipelineHealthInfo>;
}

export interface PipelineRunSummary {
  total: number;
  success: number;
  failed: number;
  running: number;
  queued: number;
  skipped: number;
  successRate: number; // 0 to 100 percentage
  avgDurationSeconds: number;
  totalRecordsIn: number;
  totalRecordsOut: number;
}

export interface AuditFilters {
  role?: AuditEventRole | string;
  action?: string;
  outcome?: AuditEventOutcome | string;
  dateFrom?: string;
  dateTo?: string;
  search?: string;
  [key: string]: unknown;
}

export const PIPELINE_RUN_STATE_I18N: Record<PipelineRunState, string> = {
  QUEUED: 'admin:pipeline.state_queued',
  RUNNING: 'admin:pipeline.state_running',
  SUCCESS: 'admin:pipeline.state_success',
  FAILED: 'admin:pipeline.state_failed',
  SKIPPED: 'admin:pipeline.state_skipped',
};

export const AUDIT_OUTCOME_I18N: Record<AuditEventOutcome, string> = {
  SUCCESS: 'admin:audit.outcome_success',
  FAILURE: 'admin:audit.outcome_failure',
  DENIED: 'admin:audit.outcome_denied',
};
