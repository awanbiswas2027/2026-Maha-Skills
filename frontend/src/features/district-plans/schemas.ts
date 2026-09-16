import { z } from 'zod';

/**
 * Course intake target schema.
 * Rule: seat counts must be integers >= 0.
 * Rule: change <= +-50% unless justification text >= 20 chars.
 */
export const courseTargetSchema = z
  .object({
    courseCode: z.string().min(1, 'plans:validation.course_code_required'),
    courseTitle: z.string().optional(),
    currentSeats: z
      .number({ required_error: 'plans:validation.seat_count_required' })
      .int('plans:validation.seat_count_integer')
      .min(0, 'plans:validation.seat_count_min'),
    proposedSeats: z
      .number({ required_error: 'plans:validation.seat_count_required' })
      .int('plans:validation.seat_count_integer')
      .min(0, 'plans:validation.seat_count_min'),
    demandBasis: z.string().min(1, 'plans:validation.demand_basis_required'),
    justification: z.string().optional(),
  })
  .superRefine((data, ctx) => {
    const { currentSeats, proposedSeats, justification } = data;
    let needsJustification = false;

    if (currentSeats === 0) {
      if (proposedSeats > 0) {
        needsJustification = true;
      }
    } else {
      const pctChange = Math.abs(proposedSeats - currentSeats) / currentSeats;
      if (pctChange > 0.5) {
        needsJustification = true;
      }
    }

    if (needsJustification) {
      const trimmed = (justification || '').trim();
      if (trimmed.length < 20) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'plans:validation.justification_min_length',
          path: ['justification'],
        });
      }
    }
  });

export type CourseTargetSchemaInput = z.input<typeof courseTargetSchema>;
export type CourseTargetSchemaOutput = z.output<typeof courseTargetSchema>;

/**
 * Equipment deficit schema.
 * Total cost is computed (qty * unitCostInr), never manually entered.
 */
export const equipmentDeficitSchema = z.object({
  id: z.string().optional(),
  itiId: z.union([z.number(), z.string()]),
  itiName: z.string().optional(),
  item: z.string().min(1, 'plans:validation.equipment_item_required'),
  qty: z
    .number({ required_error: 'plans:validation.qty_required' })
    .int('plans:validation.qty_integer')
    .min(0, 'plans:validation.qty_min'),
  unitCostInr: z
    .number({ required_error: 'plans:validation.unit_cost_required' })
    .min(0, 'plans:validation.unit_cost_min'),
});

export type EquipmentDeficitSchemaInput = z.input<typeof equipmentDeficitSchema>;
export type EquipmentDeficitSchemaOutput = z.output<typeof equipmentDeficitSchema>;

/**
 * Trainer upskilling schema.
 */
export const trainerUpskillingSchema = z.object({
  id: z.string().optional(),
  trade: z.string().min(1, 'plans:validation.trade_required'),
  count: z
    .number({ required_error: 'plans:validation.trainer_count_required' })
    .int('plans:validation.trainer_count_integer')
    .min(0, 'plans:validation.trainer_count_min'),
});

export type TrainerUpskillingSchemaInput = z.input<typeof trainerUpskillingSchema>;

/**
 * Budget factor schema.
 */
export const budgetFactorSchema = z.object({
  factor: z.string().min(1),
  labelKey: z.string().min(1),
  rawValue: z.number().min(0),
  weight: z.number().min(0).max(1),
  contribution: z.number().min(0),
});

/**
 * Stage 1: Demand Extraction schema.
 */
export const demandExtractionSchema = z.object({
  districtId: z.number().int().positive('plans:validation.district_required'),
  fiscalYear: z.string().regex(/^\d{4}-\d{2}$/, 'plans:validation.fy_format'),
  planType: z.enum(['ANNUAL', 'ROLLING_3Y']).default('ANNUAL'),
});

export type DemandExtractionSchemaInput = z.input<typeof demandExtractionSchema>;

/**
 * Stage 2: ITI Capacity Allocation schema.
 * Requires at least 1 course target (BE §H.2).
 */
export const itiCapacitySchema = z.object({
  intakeTargets: z
    .array(courseTargetSchema)
    .min(1, 'plans:validation.at_least_one_target_required'),
});

export type ItiCapacitySchemaInput = z.input<typeof itiCapacitySchema>;

/**
 * Stage 3: Equipment Deficit Review schema.
 */
export const equipmentReviewSchema = z.object({
  equipmentDeficits: z.array(equipmentDeficitSchema),
  trainerUpskilling: z.array(trainerUpskillingSchema),
});

export type EquipmentReviewSchemaInput = z.input<typeof equipmentReviewSchema>;

/**
 * Stage 4: Submission schema.
 */
export const submissionSchema = z.object({
  planId: z.string().min(1, 'plans:validation.plan_id_required'),
  confirmedByOfficer: z.boolean().refine((val) => val === true, {
    message: 'plans:validation.officer_confirmation_required',
  }),
  submissionNotes: z.string().optional(),
});

export type SubmissionSchemaInput = z.input<typeof submissionSchema>;

/**
 * Full District Plan aggregate validation schema.
 */
export const districtPlanSchema = z.object({
  id: z.string().min(1),
  districtId: z.number().int().positive(),
  districtName: z.string().min(1),
  fiscalYear: z.string().regex(/^\d{4}-\d{2}$/),
  version: z.number().int().min(1),
  status: z.enum(['DRAFT', 'SUBMITTED', 'PUBLISHED']),
  planType: z.enum(['ANNUAL', 'ROLLING_3Y']),
  intakeTargets: z.array(courseTargetSchema).min(1),
  equipmentDeficits: z.array(equipmentDeficitSchema),
  trainerUpskilling: z.array(trainerUpskillingSchema),
  budgetFactors: z.array(budgetFactorSchema),
});
