/**
 * District Training Plans - Data Model & Enums
 * MahaSkills - Government of Maharashtra
 */

export type PlanStatus = 'DRAFT' | 'SUBMITTED' | 'PUBLISHED';

export type PlanStage =
  | 'DEMAND_EXTRACTION'
  | 'ITI_CAPACITY'
  | 'EQUIPMENT_REVIEW'
  | 'SUBMISSION';

export type StageState = 'done' | 'current' | 'blocked';

export interface StageStatusResult {
  stage: PlanStage;
  status: StageState;
  reasons: string[];
}

export interface CourseTarget {
  courseCode: string;
  courseTitle?: string;
  currentSeats: number;
  proposedSeats: number;
  demandBasis: string;
  justification?: string;
}

export interface EquipmentDeficit {
  id?: string;
  itiId: number | string;
  itiName?: string;
  item: string;
  qty: number;
  unitCostInr: number;
}

export interface TrainerUpskilling {
  id?: string;
  trade: string;
  count: number;
}

export type BudgetFactorKey = 'DEMAND' | 'CURRENT_CAPACITY' | 'HISTORICAL_PLACEMENT';

export interface BudgetFactor {
  factor: BudgetFactorKey | string;
  labelKey: string;
  rawValue: number;
  weight: number;
  contribution: number;
}

export interface DistrictPlan {
  id: string;
  districtId: number;
  districtName: string;
  fiscalYear: string;
  version: number;
  status: PlanStatus;
  planType: 'ANNUAL' | 'ROLLING_3Y';
  currentStage?: PlanStage;
  intakeTargets: CourseTarget[];
  equipmentDeficits: EquipmentDeficit[];
  trainerUpskilling: TrainerUpskilling[];
  budgetFactors: BudgetFactor[];
  totalTargetIntake?: number;
  totalEstimatedBudget?: number;
  submittedAt?: string | null;
  submittedBy?: string | null;
  publishedAt?: string | null;
  publishedBy?: string | null;
  createdAt?: string;
  updatedAt?: string;
  updatedBy?: string;
}

export type DiffChangeType = 'ADDED' | 'REMOVED' | 'MODIFIED';

export interface PlanFieldDiff {
  path: string;
  fieldLabelKey: string;
  changeType: DiffChangeType;
  oldValue: unknown;
  newValue: unknown;
  description?: string;
}

export type ApplyEditError = 'CONFLICT' | 'PLAN_ALREADY_PUBLISHED' | 'VALIDATION_FAILED';

export interface ApplyEditSuccess {
  ok: true;
  plan: DistrictPlan;
}

export interface ApplyEditFailure {
  ok: false;
  error: ApplyEditError;
  messageKey: string;
  details?: unknown;
}

export type ApplyEditResult = ApplyEditSuccess | ApplyEditFailure;

export type PlanActionType = 'SAVE_DRAFT' | 'SUBMIT' | 'SANCTION' | 'REVISE';

export interface PlanAction {
  action: PlanActionType;
  labelKey: string;
  enabled: boolean;
  disabledReasonKey?: string;
}

export interface UserRoleScope {
  role: string;
  districtId?: number;
  stateWide?: boolean;
}

export const PLAN_STATUS_I18N_KEYS: Record<PlanStatus, string> = {
  DRAFT: 'plans:status.draft',
  SUBMITTED: 'plans:status.submitted',
  PUBLISHED: 'plans:status.published',
};

export const PLAN_STAGE_I18N_KEYS: Record<PlanStage, string> = {
  DEMAND_EXTRACTION: 'plans:stages.demand_extraction',
  ITI_CAPACITY: 'plans:stages.iti_capacity',
  EQUIPMENT_REVIEW: 'plans:stages.equipment_review',
  SUBMISSION: 'plans:stages.submission',
};
