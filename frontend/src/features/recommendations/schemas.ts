import { z } from 'zod';

export const recommendationTypeSchema = z.enum([
  'ADD_MODULE',
  'UPDATE_UNIT',
  'DEVELOP_QUALIFICATION',
  'RETIRE_COURSE',
]);

export const workflowStateSchema = z.enum([
  'DRAFT',
  'SSC_REVIEW',
  'CHANGES_REQUESTED',
  'DSEEI_APPROVAL',
  'PUBLISHED',
  'REJECTED',
]);

export const decisionSchema = z.enum(['APPROVE', 'REQUEST_CHANGES', 'REJECT']);

export const governanceTierSchema = z.enum(['DSEEI_APPROVAL', 'SSC_RATIFICATION']);

export const recommendationReasonSchema = z.object({
  code: z.string().min(1),
  weight: z.number().min(0).max(100),
  params: z.record(z.unknown()).optional(),
});

export const recommendationSourceSchema = z.object({
  kind: z.string().min(1),
  ref: z.string().min(1),
  contribution: z.number().min(0).max(100),
});

export const recommendationSchema = z.object({
  id: z.string().min(1),
  recommendation_code: z.string().min(1),
  type: recommendationTypeSchema,
  target_course_id: z.string().optional(),
  target_course_title: z.string().optional(),
  target_job_role: z.string().min(1),
  trigger_rule: z.string().min(1),
  reasons: z.array(recommendationReasonSchema).min(1),
  sources: z.array(recommendationSourceSchema).min(1),
  estimated_uplift_pct: z.number().min(0),
  uplift_basis: z.string().min(1),
  gap_score_run_id: z.string().min(1),
  generated_at: z.string().datetime(),
  state: workflowStateSchema,
  current_step_role: z.enum(['SSC_REVIEWER', 'POLICY_MAKER']).nullable(),
  version: z.number().int().min(1),
  sla_due_at: z.string().datetime(),
  sector_id: z.number().int().positive(),
  sector_name: z.string().optional(),
  district_ids: z.array(z.number().int()).min(1),
  withdrawal_reason: z.string().optional(),
});

export const dossierDemandPointSchema = z.object({
  month: z.string().min(1),
  demand_count: z.number().int().min(0),
});

export const dossierEmployerSchema = z.object({
  name: z.string().min(1),
  active_postings: z.number().int().min(0),
  share_pct: z.number().min(0).max(100),
});

export const dossierComparableCourseSchema = z.object({
  course_id: z.string().min(1),
  course_name: z.string().min(1),
  institute_count: z.number().int().min(0),
  placement_rate: z.number().min(0).max(100),
  median_salary_inr: z.number().min(0),
  sample_size: z.number().int().min(0),
});

export const dossierAffectedDistrictSchema = z.object({
  district_id: z.number().int().positive(),
  district_name: z.string().min(1),
  gap_score: z.number().min(0).max(100),
  demand_count: z.number().int().min(0),
});

export const dossierSchema = z.object({
  recommendation_id: z.string().min(1),
  recommendation_code: z.string().min(1),
  demand_trend_12m: z.array(dossierDemandPointSchema).min(1),
  top_employers: z.array(dossierEmployerSchema).min(1),
  comparable_courses: z.array(dossierComparableCourseSchema),
  affected_districts: z.array(dossierAffectedDistrictSchema).min(1),
  dossier_pdf_url: z.string().url().optional(),
});

export const decisionInputSchema = z.object({
  role: z.string().min(1),
  comment: z.string().optional(),
  ifMatchVersion: z.number().int().min(1),
  userSectorIds: z.array(z.number().int()).optional(),
  actorId: z.string().optional(),
});

export const recommendationFilterSchema = z.object({
  status: workflowStateSchema.optional(),
  sector_id: z.union([z.number().int(), z.string()]).optional(),
  district_id: z.union([z.number().int(), z.string()]).optional(),
  type: recommendationTypeSchema.optional(),
  search: z.string().optional(),
  page: z.number().int().min(1).default(1).optional(),
  limit: z.number().int().min(1).default(20).optional(),
});
