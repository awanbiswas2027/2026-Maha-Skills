/**
 * MahaSkills — Admin Console Validation Schemas
 * Problem Statement ID: 26134
 */

import { z } from 'zod';
import type { TaxonomyNode } from './model';

export const pipelineRunStateSchema = z.enum(['QUEUED', 'RUNNING', 'SUCCESS', 'FAILED', 'SKIPPED']);

export const pipelineRunSchema = z.object({
  dagId: z.string().min(1, 'admin:validation.dag_id_required'),
  runId: z.string().min(1, 'admin:validation.run_id_required'),
  state: pipelineRunStateSchema,
  startedAt: z.string().nullable(),
  finishedAt: z.string().nullable(),
  durationSeconds: z.number().nullable(),
  recordsIn: z.number().int().min(0),
  recordsOut: z.number().int().min(0),
  errorSummary: z.string().nullable().optional(),
});

export const auditEventRoleSchema = z.enum([
  'ADMIN',
  'POLICY_MAKER',
  'DISTRICT_OFFICER',
  'ITI_PRINCIPAL',
  'EMPLOYER',
  'SSC_REVIEWER',
  'CANDIDATE',
  'SYSTEM',
]);

export const auditEventOutcomeSchema = z.enum(['SUCCESS', 'FAILURE', 'DENIED']);

export const auditEventSchema = z.object({
  id: z.string().min(1),
  actorRole: auditEventRoleSchema,
  actorId: z.string().min(1, 'admin:validation.actor_id_required'),
  action: z.string().min(1, 'admin:validation.action_required'),
  resource: z.string().min(1, 'admin:validation.resource_required'),
  scope: z.string().min(1, 'admin:validation.scope_required'),
  timestamp: z.string().min(1),
  outcome: auditEventOutcomeSchema,
  traceId: z.string().min(1, 'admin:validation.trace_id_required'),
});

export const taxonomyLevelSchema = z.enum(['sector', 'ssc', 'job_role', 'skill']);

export const taxonomyNodeSchema: z.ZodType<TaxonomyNode> = z.lazy(() =>
  z.object({
    id: z.string().min(1),
    code: z.string().optional(),
    nameEn: z.string().min(1, 'admin:validation.name_en_required'),
    nameMr: z.string().min(1, 'admin:validation.name_mr_required'),
    nameHi: z.string().optional(),
    level: taxonomyLevelSchema,
    isEmerging: z.boolean().optional(),
    children: z.array(taxonomyNodeSchema).optional(),
    parentId: z.string().nullable().optional(),
    nsqfLevel: z.number().int().min(1).max(10).optional(),
  })
);

export const auditFilterSchema = z.object({
  role: z.string().optional(),
  action: z.string().optional(),
  outcome: z.string().optional(),
  dateFrom: z.string().optional(),
  dateTo: z.string().optional(),
  search: z.string().optional(),
});
