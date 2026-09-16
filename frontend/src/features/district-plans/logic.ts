import {
  ApplyEditResult,
  CourseTarget,
  DistrictPlan,
  EquipmentDeficit,
  PlanAction,
  PlanFieldDiff,
  PlanStage,
  StageState,
  StageStatusResult,
  TrainerUpskilling,
  UserRoleScope,
} from './model';
import { FactorBreakdownResult, FactorRow, FactorTotal } from '../../components/data/logic/factors';

export interface EquipmentTotalsResult {
  totalItems: number;
  totalQuantity: number;
  totalCostPaise: number;
  totalCostInr: number;
  byIti: Record<
    string,
    {
      itiName?: string;
      quantity: number;
      costInr: number;
      costPaise: number;
    }
  >;
}

/**
 * Evaluates the status of all 4 stages for a district plan.
 * Stages: DEMAND_EXTRACTION -> ITI_CAPACITY -> EQUIPMENT_REVIEW -> SUBMISSION
 */
export function stageStatus(plan: DistrictPlan): Record<PlanStage, StageStatusResult> {
  const isPublishedOrSubmitted = plan.status === 'PUBLISHED' || plan.status === 'SUBMITTED';

  // 1. Demand Extraction
  const demandDone = plan.districtId > 0 && Boolean(plan.fiscalYear);
  const demandStatus: StageState = demandDone ? 'done' : 'current';
  const demandReasons: string[] = demandDone ? [] : ['plans:stages.reasons.demand_extraction_incomplete'];

  // 2. ITI Capacity Allocation
  let capacityDone = false;
  let capacityStatus: StageState = 'blocked';
  const capacityReasons: string[] = [];

  if (!demandDone) {
    capacityReasons.push('plans:stages.reasons.demand_extraction_incomplete');
  } else {
    const hasTargets = Boolean(plan.intakeTargets && plan.intakeTargets.length > 0);
    if (!hasTargets) {
      capacityReasons.push('plans:validation.at_least_one_target_required');
    }

    let allTargetsValid = hasTargets;
    if (hasTargets) {
      for (const t of plan.intakeTargets) {
        if (t.currentSeats < 0 || t.proposedSeats < 0) {
          allTargetsValid = false;
          capacityReasons.push('plans:validation.seat_count_min');
          break;
        }
        let needsJustification = false;
        if (t.currentSeats === 0) {
          if (t.proposedSeats > 0) needsJustification = true;
        } else {
          const changePct = Math.abs(t.proposedSeats - t.currentSeats) / t.currentSeats;
          if (changePct > 0.5) needsJustification = true;
        }
        if (needsJustification && (!t.justification || t.justification.trim().length < 20)) {
          allTargetsValid = false;
          capacityReasons.push('plans:validation.justification_min_length');
          break;
        }
      }
    }

    if (isPublishedOrSubmitted) {
      capacityDone = true;
      capacityStatus = 'done';
    } else if (allTargetsValid && (plan.currentStage === 'EQUIPMENT_REVIEW' || plan.currentStage === 'SUBMISSION')) {
      capacityDone = true;
      capacityStatus = 'done';
    } else {
      capacityStatus = 'current';
      capacityDone = allTargetsValid && plan.currentStage !== 'ITI_CAPACITY';
    }
  }

  // 3. Equipment Review
  let equipmentDone = false;
  let equipmentStatus: StageState = 'blocked';
  const equipmentReasons: string[] = [];

  if (!capacityDone) {
    equipmentReasons.push('plans:stages.reasons.capacity_incomplete');
  } else {
    if (isPublishedOrSubmitted) {
      equipmentDone = true;
      equipmentStatus = 'done';
    } else if (plan.currentStage === 'SUBMISSION') {
      equipmentDone = true;
      equipmentStatus = 'done';
    } else {
      equipmentStatus = 'current';
      equipmentDone = false;
    }
  }

  // 4. Submission
  let submissionStatus: StageState = 'blocked';
  const submissionReasons: string[] = [];

  if (!equipmentDone) {
    submissionReasons.push('plans:stages.reasons.equipment_incomplete');
  } else {
    if (isPublishedOrSubmitted) {
      submissionStatus = 'done';
    } else {
      submissionStatus = 'current';
    }
  }

  return {
    DEMAND_EXTRACTION: {
      stage: 'DEMAND_EXTRACTION',
      status: demandStatus,
      reasons: demandReasons,
    },
    ITI_CAPACITY: {
      stage: 'ITI_CAPACITY',
      status: capacityStatus,
      reasons: capacityReasons,
    },
    EQUIPMENT_REVIEW: {
      stage: 'EQUIPMENT_REVIEW',
      status: equipmentStatus,
      reasons: equipmentReasons,
    },
    SUBMISSION: {
      stage: 'SUBMISSION',
      status: submissionStatus,
      reasons: submissionReasons,
    },
  };
}

/**
 * Helper returning an ordered array of stage statuses.
 */
export function stageStatusList(plan: DistrictPlan): StageStatusResult[] {
  const map = stageStatus(plan);
  return [
    map.DEMAND_EXTRACTION,
    map.ITI_CAPACITY,
    map.EQUIPMENT_REVIEW,
    map.SUBMISSION,
  ];
}

/**
 * Checks whether the user in the given role/scope can edit the district plan.
 * RBAC:
 * - PUBLISHED plans are strictly immutable.
 * - DISTRICT_OFFICER can edit only if scope.districtId matches plan.districtId and plan is DRAFT.
 * - POLICY_MAKER and ADMIN have statewide jurisdiction.
 */
export function canEdit(
  plan: DistrictPlan,
  role?: string | null,
  scope?: UserRoleScope | null
): boolean {
  if (!role) return false;
  if (plan.status === 'PUBLISHED') return false;

  const normalizedRole = role.toUpperCase();

  if (normalizedRole === 'POLICY_MAKER' || normalizedRole === 'ADMIN') {
    return true;
  }

  if (normalizedRole === 'DISTRICT_OFFICER') {
    if (plan.status !== 'DRAFT') return false;
    if (scope && scope.districtId !== undefined && scope.districtId !== plan.districtId) {
      return false;
    }
    return true;
  }

  return false;
}

/**
 * Determines next available user actions for the given plan and role per RBAC.
 */
export function nextActions(
  plan: DistrictPlan,
  role?: string | null,
  scope?: UserRoleScope | null
): PlanAction[] {
  if (!role) return [];
  if (plan.status === 'PUBLISHED') return [];

  const normalizedRole = role.toUpperCase();
  const actions: PlanAction[] = [];

  if (normalizedRole === 'DISTRICT_OFFICER') {
    if (scope && scope.districtId !== undefined && scope.districtId !== plan.districtId) {
      return [];
    }

    if (plan.status === 'DRAFT') {
      actions.push({
        action: 'SAVE_DRAFT',
        labelKey: 'plans:actions.save_draft',
        enabled: true,
      });

      const stages = stageStatus(plan);
      const canSubmit =
        stages.DEMAND_EXTRACTION.status === 'done' &&
        stages.ITI_CAPACITY.status === 'done' &&
        stages.EQUIPMENT_REVIEW.status === 'done' &&
        Boolean(plan.intakeTargets && plan.intakeTargets.length >= 1);

      actions.push({
        action: 'SUBMIT',
        labelKey: 'plans:actions.submit_plan',
        enabled: canSubmit,
        disabledReasonKey: canSubmit ? undefined : 'plans:actions.reasons.stages_incomplete',
      });
    }
    return actions;
  }

  if (normalizedRole === 'POLICY_MAKER' || normalizedRole === 'ADMIN') {
    if (plan.status === 'SUBMITTED') {
      actions.push({
        action: 'SANCTION',
        labelKey: 'plans:actions.sanction_plan',
        enabled: true,
      });
      actions.push({
        action: 'REVISE',
        labelKey: 'plans:actions.request_revisions',
        enabled: true,
      });
    } else if (plan.status === 'DRAFT') {
      actions.push({
        action: 'SAVE_DRAFT',
        labelKey: 'plans:actions.save_draft',
        enabled: true,
      });
      actions.push({
        action: 'SANCTION',
        labelKey: 'plans:actions.sanction_plan',
        enabled: Boolean(plan.intakeTargets && plan.intakeTargets.length >= 1),
        disabledReasonKey:
          plan.intakeTargets && plan.intakeTargets.length >= 1
            ? undefined
            : 'plans:actions.reasons.no_targets',
      });
    }
    return actions;
  }

  return [];
}

/**
 * Computes equipment deficits totals using integer paise-safe mathematics.
 */
export function equipmentTotals(plan: DistrictPlan): EquipmentTotalsResult {
  let totalCostPaise = 0;
  let totalQuantity = 0;
  const byIti: Record<
    string,
    {
      itiName?: string;
      quantity: number;
      costInr: number;
      costPaise: number;
    }
  > = {};

  const deficits = plan.equipmentDeficits || [];

  for (const def of deficits) {
    const qty = Math.max(0, Math.floor(def.qty || 0));
    const unitCostPaise = Math.round((def.unitCostInr || 0) * 100);
    const itemTotalPaise = qty * unitCostPaise;

    totalQuantity += qty;
    totalCostPaise += itemTotalPaise;

    const itiKey = String(def.itiId);
    if (!byIti[itiKey]) {
      byIti[itiKey] = {
        itiName: def.itiName,
        quantity: 0,
        costInr: 0,
        costPaise: 0,
      };
    }

    byIti[itiKey].quantity += qty;
    byIti[itiKey].costPaise += itemTotalPaise;
    byIti[itiKey].costInr = byIti[itiKey].costPaise / 100;
  }

  return {
    totalItems: deficits.length,
    totalQuantity,
    totalCostPaise,
    totalCostInr: totalCostPaise / 100,
    byIti,
  };
}

/**
 * Computes the budget score breakdown for a plan.
 * Returns factor rows summing to total, matching FactorBreakdownResult shape.
 */
export function budgetScore(plan: DistrictPlan): FactorBreakdownResult {
  const factors = plan.budgetFactors || [];

  const rows: FactorRow[] = factors.map((f) => {
    const weight = f.weight || 0;
    const contribution = f.contribution ?? f.rawValue * weight;
    const ratio = weight > 0 ? contribution / weight : 0;
    return {
      factor: String(f.factor),
      label: f.labelKey || String(f.factor),
      contribution,
      weight,
      ratio,
    };
  });

  const sumContributions = rows.reduce((acc, r) => acc + r.contribution, 0);
  const sumWeights = rows.reduce((acc, r) => acc + r.weight, 0);
  const totalRatio = sumWeights > 0 ? sumContributions / sumWeights : 0;

  const total: FactorTotal = {
    factor: 'TOTAL',
    label: 'plans:budget.total_score',
    contribution: Number(sumContributions.toFixed(3)),
    weight: Number(sumWeights.toFixed(3)),
    ratio: Number(totalRatio.toFixed(3)),
  };

  return {
    rows,
    total,
  };
}

/**
 * Computes deep differences between two plan instances for conflict review (FRM-17).
 */
export function diffPlans(a: DistrictPlan, b: DistrictPlan): PlanFieldDiff[] {
  const diffs: PlanFieldDiff[] = [];

  // Top-level scalars
  if (a.status !== b.status) {
    diffs.push({
      path: 'status',
      fieldLabelKey: 'plans:fields.status',
      changeType: 'MODIFIED',
      oldValue: b.status,
      newValue: a.status,
    });
  }

  if (a.fiscalYear !== b.fiscalYear) {
    diffs.push({
      path: 'fiscalYear',
      fieldLabelKey: 'plans:fields.fiscal_year',
      changeType: 'MODIFIED',
      oldValue: b.fiscalYear,
      newValue: a.fiscalYear,
    });
  }

  if (a.districtName !== b.districtName) {
    diffs.push({
      path: 'districtName',
      fieldLabelKey: 'plans:fields.district_name',
      changeType: 'MODIFIED',
      oldValue: b.districtName,
      newValue: a.districtName,
    });
  }

  // Intake Targets (keyed by courseCode)
  const aTargetsMap = new Map<string, CourseTarget>(
    (a.intakeTargets || []).map((t) => [t.courseCode, t])
  );
  const bTargetsMap = new Map<string, CourseTarget>(
    (b.intakeTargets || []).map((t) => [t.courseCode, t])
  );

  for (const [code, aT] of aTargetsMap.entries()) {
    const bT = bTargetsMap.get(code);
    if (!bT) {
      diffs.push({
        path: `intakeTargets[${code}]`,
        fieldLabelKey: 'plans:fields.intake_target',
        changeType: 'ADDED',
        oldValue: null,
        newValue: aT,
        description: `Added target for ${code}`,
      });
    } else {
      if (
        aT.proposedSeats !== bT.proposedSeats ||
        aT.currentSeats !== bT.currentSeats ||
        aT.demandBasis !== bT.demandBasis ||
        aT.justification !== bT.justification
      ) {
        diffs.push({
          path: `intakeTargets[${code}]`,
          fieldLabelKey: 'plans:fields.intake_target',
          changeType: 'MODIFIED',
          oldValue: bT,
          newValue: aT,
          description: `Modified target for ${code}`,
        });
      }
    }
  }

  for (const [code, bT] of bTargetsMap.entries()) {
    if (!aTargetsMap.has(code)) {
      diffs.push({
        path: `intakeTargets[${code}]`,
        fieldLabelKey: 'plans:fields.intake_target',
        changeType: 'REMOVED',
        oldValue: bT,
        newValue: null,
        description: `Removed target for ${code}`,
      });
    }
  }

  // Equipment Deficits (keyed by itiId:item)
  const deficitKey = (d: EquipmentDeficit) => `${d.itiId}:${d.item}`;
  const aDeficitsMap = new Map<string, EquipmentDeficit>(
    (a.equipmentDeficits || []).map((d) => [deficitKey(d), d])
  );
  const bDeficitsMap = new Map<string, EquipmentDeficit>(
    (b.equipmentDeficits || []).map((d) => [deficitKey(d), d])
  );

  for (const [key, aD] of aDeficitsMap.entries()) {
    const bD = bDeficitsMap.get(key);
    if (!bD) {
      diffs.push({
        path: `equipmentDeficits[${key}]`,
        fieldLabelKey: 'plans:fields.equipment_deficit',
        changeType: 'ADDED',
        oldValue: null,
        newValue: aD,
      });
    } else if (aD.qty !== bD.qty || aD.unitCostInr !== bD.unitCostInr) {
      diffs.push({
        path: `equipmentDeficits[${key}]`,
        fieldLabelKey: 'plans:fields.equipment_deficit',
        changeType: 'MODIFIED',
        oldValue: bD,
        newValue: aD,
      });
    }
  }

  for (const [key, bD] of bDeficitsMap.entries()) {
    if (!aDeficitsMap.has(key)) {
      diffs.push({
        path: `equipmentDeficits[${key}]`,
        fieldLabelKey: 'plans:fields.equipment_deficit',
        changeType: 'REMOVED',
        oldValue: bD,
        newValue: null,
      });
    }
  }

  // Trainer Upskilling (keyed by trade)
  const aTrainersMap = new Map<string, TrainerUpskilling>(
    (a.trainerUpskilling || []).map((t) => [t.trade, t])
  );
  const bTrainersMap = new Map<string, TrainerUpskilling>(
    (b.trainerUpskilling || []).map((t) => [t.trade, t])
  );

  for (const [trade, aT] of aTrainersMap.entries()) {
    const bT = bTrainersMap.get(trade);
    if (!bT) {
      diffs.push({
        path: `trainerUpskilling[${trade}]`,
        fieldLabelKey: 'plans:fields.trainer_upskilling',
        changeType: 'ADDED',
        oldValue: null,
        newValue: aT,
      });
    } else if (aT.count !== bT.count) {
      diffs.push({
        path: `trainerUpskilling[${trade}]`,
        fieldLabelKey: 'plans:fields.trainer_upskilling',
        changeType: 'MODIFIED',
        oldValue: bT,
        newValue: aT,
      });
    }
  }

  for (const [trade, bT] of bTrainersMap.entries()) {
    if (!aTrainersMap.has(trade)) {
      diffs.push({
        path: `trainerUpskilling[${trade}]`,
        fieldLabelKey: 'plans:fields.trainer_upskilling',
        changeType: 'REMOVED',
        oldValue: bT,
        newValue: null,
      });
    }
  }

  return diffs;
}

/**
 * Applies edits to a plan with optimistic concurrency checking.
 * Errors:
 * - PLAN_ALREADY_PUBLISHED if plan.status === 'PUBLISHED'
 * - CONFLICT if plan.version !== ifMatchVersion
 */
export function applyEdit(
  plan: DistrictPlan,
  patch: Partial<DistrictPlan>,
  ifMatchVersion: number
): ApplyEditResult {
  if (plan.status === 'PUBLISHED') {
    return {
      ok: false,
      error: 'PLAN_ALREADY_PUBLISHED',
      messageKey: 'plans:errors.plan_already_published',
    };
  }

  if (plan.version !== ifMatchVersion) {
    return {
      ok: false,
      error: 'CONFLICT',
      messageKey: 'plans:errors.conflict_version_mismatch',
      details: {
        currentVersion: plan.version,
        ifMatchVersion,
      },
    };
  }

  const updatedPlan: DistrictPlan = {
    ...plan,
    ...patch,
    version: plan.version + 1,
    updatedAt: new Date().toISOString(),
  };

  if (patch.intakeTargets) {
    updatedPlan.totalTargetIntake = patch.intakeTargets.reduce(
      (sum, t) => sum + (t.proposedSeats || 0),
      0
    );
  }

  if (patch.equipmentDeficits) {
    const totals = equipmentTotals(updatedPlan);
    updatedPlan.totalEstimatedBudget = totals.totalCostInr;
  }

  return {
    ok: true,
    plan: updatedPlan,
  };
}
