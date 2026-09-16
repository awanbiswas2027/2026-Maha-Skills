import { UserRole } from '../../types';

export type RecommendationType =
  | 'ADD_MODULE'
  | 'UPDATE_UNIT'
  | 'DEVELOP_QUALIFICATION'
  | 'RETIRE_COURSE';

export type WorkflowState =
  | 'DRAFT'
  | 'SSC_REVIEW'
  | 'CHANGES_REQUESTED'
  | 'DSEEI_APPROVAL'
  | 'PUBLISHED'
  | 'REJECTED';

export type Decision = 'APPROVE' | 'REQUEST_CHANGES' | 'REJECT';

export type GovernanceTier = 'DSEEI_APPROVAL' | 'SSC_RATIFICATION';

export interface RecommendationReason {
  code: string;
  weight: number;
  params?: Record<string, unknown>;
}

export interface RecommendationSource {
  kind: string;
  ref: string;
  contribution: number;
}

export interface Recommendation {
  id: string;
  recommendation_code: string;
  type: RecommendationType;
  target_course_id?: string;
  target_course_title?: string;
  target_job_role: string;
  trigger_rule: string;
  reasons: RecommendationReason[];
  sources: RecommendationSource[];
  estimated_uplift_pct: number;
  uplift_basis: string;
  gap_score_run_id: string;
  generated_at: string;
  state: WorkflowState;
  current_step_role: 'SSC_REVIEWER' | 'POLICY_MAKER' | null;
  version: number;
  sla_due_at: string;
  sector_id: number;
  sector_name?: string;
  district_ids: number[];
  withdrawal_reason?: string;
}

export interface DossierDemandPoint {
  month: string;
  demand_count: number;
}

export interface DossierEmployer {
  name: string;
  active_postings: number;
  share_pct: number;
}

export interface DossierComparableCourse {
  course_id: string;
  course_name: string;
  institute_count: number;
  placement_rate: number;
  median_salary_inr: number;
  sample_size: number;
}

export interface DossierAffectedDistrict {
  district_id: number;
  district_name: string;
  gap_score: number;
  demand_count: number;
}

export interface Dossier {
  recommendation_id: string;
  recommendation_code: string;
  demand_trend_12m: DossierDemandPoint[];
  top_employers: DossierEmployer[];
  comparable_courses: DossierComparableCourse[];
  affected_districts: DossierAffectedDistrict[];
  dossier_pdf_url?: string;
}

export interface TransitionRecord {
  id: string;
  recommendation_id: string;
  from_state: WorkflowState;
  to_state: WorkflowState;
  decision?: Decision;
  actor_role: UserRole | 'SYSTEM';
  actor_id?: string;
  comment?: string;
  transitioned_at: string;
}

export interface DecisionInput {
  role: UserRole | string;
  comment?: string;
  ifMatchVersion: number;
  userSectorIds?: number[];
  actorId?: string;
}

export type DecisionError =
  | 'COMMENT_REQUIRED'
  | 'NOT_YOUR_STEP'
  | 'ALREADY_DECIDED'
  | 'CONFLICT'
  | 'EVIDENCE_INCOMPLETE';

export type DecisionResult =
  | {
      ok: true;
      next: Recommendation;
      transition: TransitionRecord;
    }
  | {
      ok: false;
      error: DecisionError;
    };

export interface SlaStatusResult {
  tone: 'neutral' | 'warning' | 'danger';
  workingDaysLeft: number;
}

export interface WorkflowStepItem {
  id: string;
  labelKey: string;
  state: 'current' | 'done' | 'upcoming';
}

export interface RecommendationFilters {
  status?: WorkflowState | string;
  sector_id?: number | string;
  district_id?: number | string;
  type?: RecommendationType | string;
  search?: string;
  page?: number;
  limit?: number;
  [key: string]: unknown;
}

/**
 * i18n keys for recommendation domain models
 */
export const RECOMMENDATION_TYPE_KEYS: Record<RecommendationType, string> = {
  ADD_MODULE: 'recommendations:type.add_module',
  UPDATE_UNIT: 'recommendations:type.update_unit',
  DEVELOP_QUALIFICATION: 'recommendations:type.develop_qualification',
  RETIRE_COURSE: 'recommendations:type.retire_course',
};

export const WORKFLOW_STATE_KEYS: Record<WorkflowState, string> = {
  DRAFT: 'recommendations:status.draft',
  SSC_REVIEW: 'recommendations:status.ssc_review',
  CHANGES_REQUESTED: 'recommendations:status.changes_requested',
  DSEEI_APPROVAL: 'recommendations:status.dseei_approval',
  PUBLISHED: 'recommendations:status.published',
  REJECTED: 'recommendations:status.rejected',
};

export const DECISION_KEYS: Record<Decision, string> = {
  APPROVE: 'recommendations:decision.approve',
  REQUEST_CHANGES: 'recommendations:decision.request_changes',
  REJECT: 'recommendations:decision.reject',
};

export const DECISION_ERROR_KEYS: Record<DecisionError, string> = {
  COMMENT_REQUIRED: 'recommendations:errors.comment_required',
  NOT_YOUR_STEP: 'recommendations:errors.not_your_step',
  ALREADY_DECIDED: 'recommendations:errors.already_decided',
  CONFLICT: 'recommendations:errors.conflict',
  EVIDENCE_INCOMPLETE: 'recommendations:errors.evidence_incomplete',
};
