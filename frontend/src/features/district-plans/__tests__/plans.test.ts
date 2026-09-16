import { describe, expect, it } from 'vitest';
import { resolveMock } from '../api';
import { MOCK_DISTRICT_PLANS } from '../fixtures';
import {
  applyEdit,
  budgetScore,
  canEdit,
  diffPlans,
  equipmentTotals,
  nextActions,
  stageStatus,
  stageStatusList,
} from '../logic';
import { DistrictPlan } from '../model';
import {
  courseTargetSchema,
  equipmentDeficitSchema,
  itiCapacitySchema,
} from '../schemas';

describe('District Plans - Pure Logic & Schema Suite', () => {
  const puneDraft = MOCK_DISTRICT_PLANS[0];
  const nagpurSubmitted = MOCK_DISTRICT_PLANS[1];
  const nashikPublished = MOCK_DISTRICT_PLANS[2];

  describe('1. Stage Gating (stageStatus)', () => {
    it('evaluates initialized draft stages correctly', () => {
      const status = stageStatus(puneDraft);
      expect(status.DEMAND_EXTRACTION.status).toBe('done');
      expect(status.DEMAND_EXTRACTION.reasons).toHaveLength(0);
      expect(status.ITI_CAPACITY.status).toBe('current');
      expect(status.EQUIPMENT_REVIEW.status).toBe('blocked');
      expect(status.EQUIPMENT_REVIEW.reasons).toContain('plans:stages.reasons.capacity_incomplete');
      expect(status.SUBMISSION.status).toBe('blocked');
    });

    it('blocks ITI capacity when demand extraction is not initialized', () => {
      const uninitialized: DistrictPlan = {
        ...puneDraft,
        districtId: 0,
        fiscalYear: '',
      };
      const status = stageStatus(uninitialized);
      expect(status.DEMAND_EXTRACTION.status).toBe('current');
      expect(status.ITI_CAPACITY.status).toBe('blocked');
      expect(status.ITI_CAPACITY.reasons).toContain(
        'plans:stages.reasons.demand_extraction_incomplete'
      );
    });

    it('marks all stages as done for submitted or published plans', () => {
      const submittedStages = stageStatusList(nagpurSubmitted);
      expect(submittedStages.every((s) => s.status === 'done')).toBe(true);

      const publishedStages = stageStatusList(nashikPublished);
      expect(publishedStages.every((s) => s.status === 'done')).toBe(true);
    });

    it('advances stages when currentStage is advanced and prerequisites are valid', () => {
      const advancedPlan: DistrictPlan = {
        ...puneDraft,
        currentStage: 'EQUIPMENT_REVIEW',
      };
      const status = stageStatus(advancedPlan);
      expect(status.DEMAND_EXTRACTION.status).toBe('done');
      expect(status.ITI_CAPACITY.status).toBe('done');
      expect(status.EQUIPMENT_REVIEW.status).toBe('current');
      expect(status.SUBMISSION.status).toBe('blocked');
    });
  });

  describe('2. Schemas & Validation Edges (Zod)', () => {
    it('accepts valid course target with change <= 50% without justification', () => {
      const res = courseTargetSchema.safeParse({
        courseCode: 'CRS-TEST-01',
        currentSeats: 100,
        proposedSeats: 120, // +20%
        demandBasis: 'Industrial cluster growth',
      });
      expect(res.success).toBe(true);
    });

    it('accepts course target with exactly 50% change without justification', () => {
      const res = courseTargetSchema.safeParse({
        courseCode: 'CRS-TEST-01',
        currentSeats: 100,
        proposedSeats: 150, // exactly +50%
        demandBasis: 'Capacity boost',
      });
      expect(res.success).toBe(true);
    });

    it('rejects course target with change > 50% when justification is missing', () => {
      const res = courseTargetSchema.safeParse({
        courseCode: 'CRS-TEST-01',
        currentSeats: 100,
        proposedSeats: 160, // +60%
        demandBasis: 'Surge demand',
      });
      expect(res.success).toBe(false);
      if (!res.success) {
        expect(res.error.issues[0].message).toBe('plans:validation.justification_min_length');
      }
    });

    it('rejects course target with change > 50% when justification is shorter than 20 chars', () => {
      const res = courseTargetSchema.safeParse({
        courseCode: 'CRS-TEST-01',
        currentSeats: 100,
        proposedSeats: 160,
        demandBasis: 'Surge demand',
        justification: 'Short note', // 10 chars < 20 chars
      });
      expect(res.success).toBe(false);
      if (!res.success) {
        expect(res.error.issues[0].path).toContain('justification');
      }
    });

    it('accepts course target with change > 50% when justification is at least 20 chars', () => {
      const res = courseTargetSchema.safeParse({
        courseCode: 'CRS-TEST-01',
        currentSeats: 100,
        proposedSeats: 180, // +80%
        demandBasis: 'Surge demand',
        justification: 'New regional manufacturing plant requires expanded operator intake cohort',
      });
      expect(res.success).toBe(true);
    });

    it('requires justification when introducing brand new course (currentSeats = 0)', () => {
      const invalidNew = courseTargetSchema.safeParse({
        courseCode: 'CRS-NEW-01',
        currentSeats: 0,
        proposedSeats: 40,
        demandBasis: 'New technology demand',
      });
      expect(invalidNew.success).toBe(false);

      const validNew = courseTargetSchema.safeParse({
        courseCode: 'CRS-NEW-01',
        currentSeats: 0,
        proposedSeats: 40,
        demandBasis: 'New technology demand',
        justification: 'New green energy EV technician program introduced for local auto corridor',
      });
      expect(validNew.success).toBe(true);
    });

    it('rejects negative seat counts and non-integer seat counts', () => {
      const neg = courseTargetSchema.safeParse({
        courseCode: 'CRS-ERR-01',
        currentSeats: -10,
        proposedSeats: 50,
        demandBasis: 'Test',
      });
      expect(neg.success).toBe(false);

      const float = courseTargetSchema.safeParse({
        courseCode: 'CRS-ERR-02',
        currentSeats: 10,
        proposedSeats: 50.5,
        demandBasis: 'Test',
      });
      expect(float.success).toBe(false);
    });

    it('validates itiCapacitySchema requiring at least one target', () => {
      const empty = itiCapacitySchema.safeParse({ intakeTargets: [] });
      expect(empty.success).toBe(false);
      if (!empty.success) {
        expect(empty.error.issues[0].message).toBe('plans:validation.at_least_one_target_required');
      }
    });

    it('validates equipment deficit schema values and enforces positive integers', () => {
      const valid = equipmentDeficitSchema.safeParse({
        itiId: 'ITI-01',
        item: '3D Printer',
        qty: 2,
        unitCostInr: 150000,
      });
      expect(valid.success).toBe(true);

      const invalidQty = equipmentDeficitSchema.safeParse({
        itiId: 'ITI-01',
        item: '3D Printer',
        qty: -1,
        unitCostInr: 150000,
      });
      expect(invalidQty.success).toBe(false);
    });
  });

  describe('3. Equipment Totals & Paise-Safe Arithmetic', () => {
    it('computes equipment totals using integer paise-safe arithmetic', () => {
      const totals = equipmentTotals(puneDraft);
      // Items:
      // 2 * 450,000 = 900,000
      // 4 * 85,000 = 340,000
      // 1 * 320,000 = 320,000
      // Total INR = 1,560,000
      // Total Paise = 156,000,000
      expect(totals.totalItems).toBe(3);
      expect(totals.totalQuantity).toBe(7);
      expect(totals.totalCostInr).toBe(1560000);
      expect(totals.totalCostPaise).toBe(156000000);
      expect(totals.byIti['ITI-PUN-01'].quantity).toBe(6);
      expect(totals.byIti['ITI-PUN-01'].costInr).toBe(1240000);
      expect(totals.byIti['ITI-PUN-02'].quantity).toBe(1);
      expect(totals.byIti['ITI-PUN-02'].costInr).toBe(320000);
    });

    it('avoids floating point drift on fractional INR amounts', () => {
      const planWithFractions: DistrictPlan = {
        ...puneDraft,
        equipmentDeficits: [
          { itiId: '1', item: 'Part A', qty: 3, unitCostInr: 199.99 },
          { itiId: '1', item: 'Part B', qty: 7, unitCostInr: 300.33 },
        ],
      };
      const totals = equipmentTotals(planWithFractions);
      // 3 * 19999 paise = 59997 paise
      // 7 * 30033 paise = 210231 paise
      // Total paise = 270228 paise
      // Total INR = 2702.28
      expect(totals.totalCostPaise).toBe(270228);
      expect(totals.totalCostInr).toBe(2702.28);
    });

    it('handles plans with empty deficits', () => {
      const emptyPlan: DistrictPlan = { ...puneDraft, equipmentDeficits: [] };
      const totals = equipmentTotals(emptyPlan);
      expect(totals.totalItems).toBe(0);
      expect(totals.totalQuantity).toBe(0);
      expect(totals.totalCostInr).toBe(0);
      expect(totals.totalCostPaise).toBe(0);
    });
  });

  describe('4. Budget Factors Sum (budgetScore)', () => {
    it('computes factor breakdown with factor rows summing exactly to total', () => {
      const score = budgetScore(puneDraft);
      expect(score.rows).toHaveLength(3);

      const sumOfRowContributions = score.rows.reduce((sum, r) => sum + r.contribution, 0);
      const sumOfRowWeights = score.rows.reduce((sum, r) => sum + r.weight, 0);

      expect(Number(sumOfRowContributions.toFixed(3))).toBe(score.total.contribution);
      expect(Number(sumOfRowWeights.toFixed(3))).toBe(score.total.weight);
      expect(score.total.ratio).toBe(
        Number((score.total.contribution / score.total.weight).toFixed(3))
      );

      // Verify each row has ratio matching rawValue
      for (const row of score.rows) {
        expect(row.ratio).toBeCloseTo(row.contribution / row.weight, 3);
      }
    });
  });

  describe('5. Plan Diffing (diffPlans)', () => {
    it('returns empty diff array when comparing identical plans', () => {
      const diffs = diffPlans(puneDraft, puneDraft);
      expect(diffs).toHaveLength(0);
    });

    it('identifies modified scalar fields and target changes', () => {
      const modifiedPlan: DistrictPlan = {
        ...puneDraft,
        status: 'SUBMITTED',
        intakeTargets: [
          ...puneDraft.intakeTargets.slice(0, 3),
          {
            courseCode: 'CRS-CNC-04',
            courseTitle: 'CNC Operator & Programmer',
            currentSeats: 60,
            proposedSeats: 80, // modified from 60
            demandBasis: 'Increased CNC automotive demand',
          },
          {
            courseCode: 'CRS-NEW-01',
            courseTitle: 'Additive Manufacturing Tech',
            currentSeats: 0,
            proposedSeats: 30,
            demandBasis: '3D printing expansion',
          },
        ],
      };

      const diffs = diffPlans(modifiedPlan, puneDraft);
      expect(diffs.some((d) => d.path === 'status' && d.changeType === 'MODIFIED')).toBe(true);
      expect(
        diffs.some((d) => d.path === 'intakeTargets[CRS-CNC-04]' && d.changeType === 'MODIFIED')
      ).toBe(true);
      expect(
        diffs.some((d) => d.path === 'intakeTargets[CRS-NEW-01]' && d.changeType === 'ADDED')
      ).toBe(true);
    });

    it('identifies removed intake targets and modified equipment deficits', () => {
      const reducedPlan: DistrictPlan = {
        ...puneDraft,
        intakeTargets: puneDraft.intakeTargets.slice(0, 2), // removed 2 targets
        equipmentDeficits: [
          {
            ...puneDraft.equipmentDeficits[0],
            qty: 5, // modified qty from 2
          },
        ],
      };

      const diffs = diffPlans(reducedPlan, puneDraft);
      expect(
        diffs.filter((d) => d.changeType === 'REMOVED' && d.path.startsWith('intakeTargets'))
      ).toHaveLength(2);
      expect(
        diffs.filter((d) => d.changeType === 'REMOVED' && d.path.startsWith('equipmentDeficits'))
      ).toHaveLength(2);
      expect(diffs.some((d) => d.changeType === 'MODIFIED' && d.path.includes('equipmentDeficits'))).toBe(true);
    });
  });

  describe('6. Conflict Handling & Immutability (applyEdit)', () => {
    it('rejects edits on published plans with PLAN_ALREADY_PUBLISHED', () => {
      const res = applyEdit(nashikPublished, { fiscalYear: '2027-28' }, 5);
      expect(res.ok).toBe(false);
      if (!res.ok) {
        expect(res.error).toBe('PLAN_ALREADY_PUBLISHED');
        expect(res.messageKey).toBe('plans:errors.plan_already_published');
      }
    });

    it('rejects edits with stale If-Match version with CONFLICT', () => {
      const res = applyEdit(puneDraft, { districtName: 'Pune Metro' }, 0); // version is 1, passed 0
      expect(res.ok).toBe(false);
      if (!res.ok) {
        expect(res.error).toBe('CONFLICT');
        expect(res.messageKey).toBe('plans:errors.conflict_version_mismatch');
      }
    });

    it('successfully applies edit on matching version and increments version', () => {
      const res = applyEdit(puneDraft, { planType: 'ROLLING_3Y' }, 1);
      expect(res.ok).toBe(true);
      if (res.ok) {
        expect(res.plan.version).toBe(2);
        expect(res.plan.planType).toBe('ROLLING_3Y');
        expect(res.plan.updatedAt).toBeDefined();
      }
    });
  });

  describe('7. RBAC & Next Actions Matrix (canEdit & nextActions)', () => {
    it('allows DISTRICT_OFFICER to edit DRAFT in own district only', () => {
      expect(
        canEdit(puneDraft, 'DISTRICT_OFFICER', { role: 'DISTRICT_OFFICER', districtId: 2712 })
      ).toBe(true);
      expect(
        canEdit(puneDraft, 'DISTRICT_OFFICER', { role: 'DISTRICT_OFFICER', districtId: 2709 })
      ).toBe(false);
    });

    it('prevents DISTRICT_OFFICER from editing SUBMITTED or PUBLISHED plans', () => {
      expect(
        canEdit(nagpurSubmitted, 'DISTRICT_OFFICER', {
          role: 'DISTRICT_OFFICER',
          districtId: 2709,
        })
      ).toBe(false);
      expect(
        canEdit(nashikPublished, 'DISTRICT_OFFICER', {
          role: 'DISTRICT_OFFICER',
          districtId: 2720,
        })
      ).toBe(false);
    });

    it('allows POLICY_MAKER and ADMIN statewide editing on DRAFT and SUBMITTED plans', () => {
      expect(canEdit(puneDraft, 'POLICY_MAKER', { role: 'POLICY_MAKER', stateWide: true })).toBe(
        true
      );
      expect(
        canEdit(nagpurSubmitted, 'POLICY_MAKER', { role: 'POLICY_MAKER', stateWide: true })
      ).toBe(true);
      expect(canEdit(puneDraft, 'ADMIN', { role: 'ADMIN', stateWide: true })).toBe(true);
    });

    it('prevents all roles from editing PUBLISHED plans (strictly immutable)', () => {
      expect(canEdit(nashikPublished, 'POLICY_MAKER')).toBe(false);
      expect(canEdit(nashikPublished, 'ADMIN')).toBe(false);
      expect(
        canEdit(nashikPublished, 'DISTRICT_OFFICER', {
          role: 'DISTRICT_OFFICER',
          districtId: 2720,
        })
      ).toBe(false);
    });

    it('disallows unauthorized roles from editing', () => {
      expect(canEdit(puneDraft, 'ITI_PRINCIPAL')).toBe(false);
      expect(canEdit(puneDraft, 'EMPLOYER')).toBe(false);
      expect(canEdit(puneDraft, null)).toBe(false);
    });

    it('returns appropriate next actions for DISTRICT_OFFICER on draft', () => {
      const actions = nextActions(puneDraft, 'DISTRICT_OFFICER', {
        role: 'DISTRICT_OFFICER',
        districtId: 2712,
      });
      expect(actions.some((a) => a.action === 'SAVE_DRAFT' && a.enabled)).toBe(true);
      expect(actions.some((a) => a.action === 'SUBMIT')).toBe(true);
    });

    it('returns sanction and revise actions for POLICY_MAKER on SUBMITTED plan', () => {
      const actions = nextActions(nagpurSubmitted, 'POLICY_MAKER', {
        role: 'POLICY_MAKER',
        stateWide: true,
      });
      expect(actions.some((a) => a.action === 'SANCTION' && a.enabled)).toBe(true);
      expect(actions.some((a) => a.action === 'REVISE' && a.enabled)).toBe(true);
    });

    it('returns no actions for published plans', () => {
      expect(nextActions(nashikPublished, 'POLICY_MAKER')).toHaveLength(0);
      expect(nextActions(nashikPublished, 'DISTRICT_OFFICER')).toHaveLength(0);
    });
  });

  describe('8. Mock Resolution (resolveMock)', () => {
    it('returns original data by default', async () => {
      const data = await resolveMock(null, puneDraft);
      expect(data).toBe(puneDraft);
    });

    it('handles empty mock switch', async () => {
      const emptyArr = await resolveMock('?mock=empty', [puneDraft]);
      expect(emptyArr).toEqual([]);

      const emptyObj = await resolveMock('?mock=empty', puneDraft);
      expect(emptyObj).toBeNull();
    });

    it('handles error mock switch', async () => {
      await expect(resolveMock('?mock=error', puneDraft)).rejects.toMatchObject({
        success: false,
        error: { code: 'INTERNAL_ERROR' },
      });
    });

    it('handles conflict mock switch', async () => {
      await expect(resolveMock('?mock=conflict', puneDraft)).rejects.toMatchObject({
        success: false,
        error: { code: 'CONFLICT' },
      });
    });

    it('handles partial mock switch', async () => {
      const partialArr = (await resolveMock('?mock=partial', [puneDraft])) as unknown as {
        meta: { partial: boolean };
      };
      expect(partialArr.meta.partial).toBe(true);
    });
  });
});