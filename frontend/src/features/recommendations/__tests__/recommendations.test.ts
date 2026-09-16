import { beforeEach, describe, expect, it } from 'vitest';
import {
  MOCK_DOSSIERS,
  MOCK_RECOMMENDATIONS,
  SAMPLE_DATA,
} from '../fixtures';
import {
  allowedDecisions,
  applyDecision,
  calculateWorkingDaysLeft,
  governanceTier,
  hasCompleteEvidence,
  isStale,
  slaStatus,
  workflowSteps,
} from '../logic';
import {
  DecisionInput,
  Recommendation,
} from '../model';
import {
  decisionInputSchema,
  dossierSchema,
  recommendationSchema,
} from '../schemas';
import {
  executeDecisionMutation,
  getFilteredRecommendations,
  resetInMemoryRecommendations,
  resolveMock,
  useDecisionMutation,
  useDossier,
  useRecommendation,
  useRecommendations,
} from '../api';

describe('Curriculum Recommendations Logic & Workflow (Ant K - SLK-v1)', () => {
  beforeEach(() => {
    resetInMemoryRecommendations();
  });

  describe('1. Fixtures & Schema Conformance', () => {
    it('fixture flag SAMPLE_DATA is true and exports exactly 12 recommendations', () => {
      expect(SAMPLE_DATA).toBe(true);
      expect(MOCK_RECOMMENDATIONS).toHaveLength(12);
    });

    it('every mock recommendation adheres to recommendationSchema', () => {
      MOCK_RECOMMENDATIONS.forEach((rec) => {
        const parseResult = recommendationSchema.safeParse(rec);
        expect(parseResult.success, `Schema validation failed for ${rec.id}`).toBe(true);
      });
    });

    it('mock dossiers cover recommendations and adhere to dossierSchema', () => {
      const dossierKeys = Object.keys(MOCK_DOSSIERS);
      expect(dossierKeys.length).toBeGreaterThanOrEqual(12);

      dossierKeys.forEach((key) => {
        const parseResult = dossierSchema.safeParse(MOCK_DOSSIERS[key]);
        expect(parseResult.success, `Schema validation failed for dossier ${key}`).toBe(true);
      });
    });

    it('decisionInputSchema validates proper inputs and rejects invalid structures', () => {
      const valid: DecisionInput = {
        role: 'SSC_REVIEWER',
        comment: 'Detailed curriculum revisions required for module 4',
        ifMatchVersion: 1,
        userSectorIds: [101, 102],
      };
      expect(decisionInputSchema.safeParse(valid).success).toBe(true);

      const invalid = {
        role: '',
        ifMatchVersion: -1,
      };
      expect(decisionInputSchema.safeParse(invalid).success).toBe(false);
    });
  });

  describe('2. Tiered Governance & Transitions (OQ-05 & BE §H.1)', () => {
    it('governanceTier correctly assigns SSC_RATIFICATION for ADD_MODULE and DSEEI_APPROVAL for others', () => {
      expect(governanceTier('ADD_MODULE')).toBe('SSC_RATIFICATION');
      expect(governanceTier('UPDATE_UNIT')).toBe('DSEEI_APPROVAL');
      expect(governanceTier('DEVELOP_QUALIFICATION')).toBe('DSEEI_APPROVAL');
      expect(governanceTier('RETIRE_COURSE')).toBe('DSEEI_APPROVAL');
    });

    it('SSC approval on ADD_MODULE transitions directly to PUBLISHED (SSC ratification tier)', () => {
      const rec = MOCK_RECOMMENDATIONS.find((r) => r.id === 'rec-001-add-mod-ssc-ontime')!;
      const dossier = MOCK_DOSSIERS[rec.id];
      const result = applyDecision(
        rec,
        'APPROVE',
        {
          role: 'SSC_REVIEWER',
          ifMatchVersion: rec.version,
          userSectorIds: [rec.sector_id],
        },
        dossier
      );

      expect(result.ok).toBe(true);
      if (result.ok) {
        expect(result.next.state).toBe('PUBLISHED');
        expect(result.next.current_step_role).toBeNull();
        expect(result.next.version).toBe(rec.version + 1);
        expect(result.transition.from_state).toBe('SSC_REVIEW');
        expect(result.transition.to_state).toBe('PUBLISHED');
        expect(result.transition.decision).toBe('APPROVE');
      }
    });

    it('SSC approval on DEVELOP_QUALIFICATION transitions to DSEEI_APPROVAL', () => {
      const rec = MOCK_RECOMMENDATIONS.find((r) => r.id === 'rec-003-dev-qual-ssc-overdue')!;
      const dossier = MOCK_DOSSIERS[rec.id];
      const result = applyDecision(
        rec,
        'APPROVE',
        {
          role: 'SSC_REVIEWER',
          ifMatchVersion: rec.version,
          userSectorIds: [rec.sector_id],
        },
        dossier
      );

      expect(result.ok).toBe(true);
      if (result.ok) {
        expect(result.next.state).toBe('DSEEI_APPROVAL');
        expect(result.next.current_step_role).toBe('POLICY_MAKER');
        expect(result.next.version).toBe(rec.version + 1);
      }
    });

    it('DSEEI approval on DEVELOP_QUALIFICATION transitions to PUBLISHED', () => {
      const rec = MOCK_RECOMMENDATIONS.find((r) => r.id === 'rec-005-dev-qual-dseei-warning')!;
      const dossier = MOCK_DOSSIERS[rec.id];
      const result = applyDecision(
        rec,
        'APPROVE',
        {
          role: 'POLICY_MAKER',
          ifMatchVersion: rec.version,
        },
        dossier
      );

      expect(result.ok).toBe(true);
      if (result.ok) {
        expect(result.next.state).toBe('PUBLISHED');
        expect(result.next.current_step_role).toBeNull();
        expect(result.next.version).toBe(rec.version + 1);
      }
    });
  });

  describe('3. Role & Sector Authorization Guards', () => {
    it('SSC reviewer cannot decide on recommendation outside their assigned sectors', () => {
      const rec = MOCK_RECOMMENDATIONS.find((r) => r.id === 'rec-001-add-mod-ssc-ontime')!;
      // rec has sector_id: 101
      const allowed = allowedDecisions(rec, 'SSC_REVIEWER', [102, 103]);
      expect(allowed).toEqual([]);

      const result = applyDecision(
        rec,
        'APPROVE',
        {
          role: 'SSC_REVIEWER',
          ifMatchVersion: rec.version,
          userSectorIds: [102, 103],
        }
      );
      expect(result.ok).toBe(false);
      if (!result.ok) {
        expect(result.error).toBe('NOT_YOUR_STEP');
      }
    });

    it('SSC reviewer can decide when sector matches', () => {
      const rec = MOCK_RECOMMENDATIONS.find((r) => r.id === 'rec-001-add-mod-ssc-ontime')!;
      const allowed = allowedDecisions(rec, 'SSC_REVIEWER', [101]);
      expect(allowed).toEqual(['APPROVE', 'REQUEST_CHANGES', 'REJECT']);
    });

    it('POLICY_MAKER cannot decide at SSC_REVIEW step', () => {
      const rec = MOCK_RECOMMENDATIONS.find((r) => r.id === 'rec-001-add-mod-ssc-ontime')!;
      const allowed = allowedDecisions(rec, 'POLICY_MAKER');
      expect(allowed).toEqual([]);

      const result = applyDecision(
        rec,
        'APPROVE',
        {
          role: 'POLICY_MAKER',
          ifMatchVersion: rec.version,
        }
      );
      expect(result.ok).toBe(false);
      if (!result.ok) {
        expect(result.error).toBe('NOT_YOUR_STEP');
      }
    });

    it('SSC_REVIEWER cannot decide at DSEEI_APPROVAL step', () => {
      const rec = MOCK_RECOMMENDATIONS.find((r) => r.id === 'rec-004-ret-crs-dseei-ontime')!;
      const allowed = allowedDecisions(rec, 'SSC_REVIEWER', [rec.sector_id]);
      expect(allowed).toEqual([]);

      const result = applyDecision(
        rec,
        'APPROVE',
        {
          role: 'SSC_REVIEWER',
          ifMatchVersion: rec.version,
          userSectorIds: [rec.sector_id],
        }
      );
      expect(result.ok).toBe(false);
      if (!result.ok) {
        expect(result.error).toBe('NOT_YOUR_STEP');
      }
    });
  });

  describe('4. Comment Rules (REJECT and REQUEST_CHANGES)', () => {
    it('rejecting without substantive comment returns COMMENT_REQUIRED', () => {
      const rec = MOCK_RECOMMENDATIONS.find((r) => r.id === 'rec-001-add-mod-ssc-ontime')!;
      const dossier = MOCK_DOSSIERS[rec.id];

      const resEmpty = applyDecision(
        rec,
        'REJECT',
        {
          role: 'SSC_REVIEWER',
          ifMatchVersion: rec.version,
          userSectorIds: [rec.sector_id],
          comment: '',
        },
        dossier
      );
      expect(resEmpty.ok).toBe(false);
      if (!resEmpty.ok) {
        expect(resEmpty.error).toBe('COMMENT_REQUIRED');
      }

      const resWhitespace = applyDecision(
        rec,
        'REJECT',
        {
          role: 'SSC_REVIEWER',
          ifMatchVersion: rec.version,
          userSectorIds: [rec.sector_id],
          comment: '    \n   ',
        },
        dossier
      );
      expect(resWhitespace.ok).toBe(false);
      if (!resWhitespace.ok) {
        expect(resWhitespace.error).toBe('COMMENT_REQUIRED');
      }
    });

    it('requesting changes without comment returns COMMENT_REQUIRED', () => {
      const rec = MOCK_RECOMMENDATIONS.find((r) => r.id === 'rec-001-add-mod-ssc-ontime')!;
      const dossier = MOCK_DOSSIERS[rec.id];

      const res = applyDecision(
        rec,
        'REQUEST_CHANGES',
        {
          role: 'SSC_REVIEWER',
          ifMatchVersion: rec.version,
          userSectorIds: [rec.sector_id],
        },
        dossier
      );
      expect(res.ok).toBe(false);
      if (!res.ok) {
        expect(res.error).toBe('COMMENT_REQUIRED');
      }
    });

    it('rejecting or requesting changes with valid comment succeeds and transitions to CHANGES_REQUESTED / REJECTED', () => {
      const rec = MOCK_RECOMMENDATIONS.find((r) => r.id === 'rec-001-add-mod-ssc-ontime')!;
      const dossier = MOCK_DOSSIERS[rec.id];

      const resChanges = applyDecision(
        rec,
        'REQUEST_CHANGES',
        {
          role: 'SSC_REVIEWER',
          ifMatchVersion: rec.version,
          userSectorIds: [rec.sector_id],
          comment: 'Please adjust practical workshop hours from 20h to 40h',
        },
        dossier
      );
      expect(resChanges.ok).toBe(true);
      if (resChanges.ok) {
        expect(resChanges.next.state).toBe('CHANGES_REQUESTED');
        expect(resChanges.transition.comment).toBe(
          'Please adjust practical workshop hours from 20h to 40h'
        );
      }

      const resReject = applyDecision(
        rec,
        'REJECT',
        {
          role: 'SSC_REVIEWER',
          ifMatchVersion: rec.version,
          userSectorIds: [rec.sector_id],
          comment: 'Overlaps existing private apprenticeship programme in Pune',
        },
        dossier
      );
      expect(resReject.ok).toBe(true);
      if (resReject.ok) {
        expect(resReject.next.state).toBe('REJECTED');
      }
    });
  });

  describe('5. Concurrency Conflict (If-Match)', () => {
    it('version mismatch produces CONFLICT error', () => {
      const rec = MOCK_RECOMMENDATIONS.find((r) => r.id === 'rec-001-add-mod-ssc-ontime')!;
      const dossier = MOCK_DOSSIERS[rec.id];

      const res = applyDecision(
        rec,
        'APPROVE',
        {
          role: 'SSC_REVIEWER',
          ifMatchVersion: rec.version + 1, // Stale client version
          userSectorIds: [rec.sector_id],
        },
        dossier
      );

      expect(res.ok).toBe(false);
      if (!res.ok) {
        expect(res.error).toBe('CONFLICT');
      }
    });
  });

  describe('6. Terminal State Invariance', () => {
    it('terminal states (PUBLISHED and REJECTED) accept no transitions and yield ALREADY_DECIDED', () => {
      const pubRec = MOCK_RECOMMENDATIONS.find((r) => r.state === 'PUBLISHED')!;
      const rejRec = MOCK_RECOMMENDATIONS.find((r) => r.state === 'REJECTED')!;

      expect(allowedDecisions(pubRec, 'POLICY_MAKER')).toEqual([]);
      expect(allowedDecisions(rejRec, 'POLICY_MAKER')).toEqual([]);

      const pubRes = applyDecision(pubRec, 'APPROVE', {
        role: 'POLICY_MAKER',
        ifMatchVersion: pubRec.version,
      });
      expect(pubRes.ok).toBe(false);
      if (!pubRes.ok) {
        expect(pubRes.error).toBe('ALREADY_DECIDED');
      }

      const rejRes = applyDecision(rejRec, 'APPROVE', {
        role: 'POLICY_MAKER',
        ifMatchVersion: rejRec.version,
      });
      expect(rejRes.ok).toBe(false);
      if (!rejRes.ok) {
        expect(rejRes.error).toBe('ALREADY_DECIDED');
      }
    });
  });

  describe('7. Evidence Completeness Guard', () => {
    it('returns EVIDENCE_INCOMPLETE if required evidence fields are missing', () => {
      const rec = MOCK_RECOMMENDATIONS.find((r) => r.id === 'rec-001-add-mod-ssc-ontime')!;
      const invalidRec: Recommendation = {
        ...rec,
        trigger_rule: '   ', // empty trigger rule
      };

      expect(hasCompleteEvidence(invalidRec)).toBe(false);

      const res = applyDecision(invalidRec, 'APPROVE', {
        role: 'SSC_REVIEWER',
        ifMatchVersion: invalidRec.version,
        userSectorIds: [invalidRec.sector_id],
      });

      expect(res.ok).toBe(false);
      if (!res.ok) {
        expect(res.error).toBe('EVIDENCE_INCOMPLETE');
      }
    });

    it('returns EVIDENCE_INCOMPLETE if dossier is provided but has missing sections', () => {
      const rec = MOCK_RECOMMENDATIONS.find((r) => r.id === 'rec-001-add-mod-ssc-ontime')!;
      const incompleteDossier = {
        ...MOCK_DOSSIERS[rec.id],
        demand_trend_12m: [],
      };

      expect(hasCompleteEvidence(rec, incompleteDossier)).toBe(false);

      const res = applyDecision(
        rec,
        'APPROVE',
        {
          role: 'SSC_REVIEWER',
          ifMatchVersion: rec.version,
          userSectorIds: [rec.sector_id],
        },
        incompleteDossier
      );

      expect(res.ok).toBe(false);
      if (!res.ok) {
        expect(res.error).toBe('EVIDENCE_INCOMPLETE');
      }
    });
  });

  describe('8. SLA Calculation & Weekend Maths', () => {
    it('correctly calculates working days skipping Saturday and Sunday', () => {
      // 2026-09-18 is Friday, 2026-09-21 is Monday -> 1 working day
      const friday = new Date('2026-09-18T10:00:00.000Z');
      const monday = new Date('2026-09-21T17:00:00.000Z');
      expect(calculateWorkingDaysLeft(monday, friday)).toBe(1);

      // Friday to Tuesday -> 2 working days
      const tuesday = new Date('2026-09-22T17:00:00.000Z');
      expect(calculateWorkingDaysLeft(tuesday, friday)).toBe(2);

      // Wednesday to next Wednesday -> 5 working days
      const wednesday1 = new Date('2026-09-16T10:00:00.000Z');
      const wednesday2 = new Date('2026-09-23T10:00:00.000Z');
      expect(calculateWorkingDaysLeft(wednesday2, wednesday1)).toBe(5);
    });

    it('correctly computes negative working days when overdue', () => {
      // Overdue: now is Monday 2026-09-21, due was Friday 2026-09-18
      const monday = new Date('2026-09-21T10:00:00.000Z');
      const dueFriday = new Date('2026-09-18T17:00:00.000Z');
      expect(calculateWorkingDaysLeft(dueFriday, monday)).toBeLessThan(0);
    });

    it('slaStatus assigns proper semantic tone', () => {
      const onTimeRec = MOCK_RECOMMENDATIONS.find((r) => r.id === 'rec-001-add-mod-ssc-ontime')!;
      const warningRec = MOCK_RECOMMENDATIONS.find((r) => r.id === 'rec-002-upd-unit-ssc-warning')!;
      const overdueRec = MOCK_RECOMMENDATIONS.find((r) => r.id === 'rec-003-dev-qual-ssc-overdue')!;

      // Reference date: 2026-09-17
      const refDate = new Date('2026-09-17T10:00:00.000Z');

      const onTimeStatus = slaStatus(onTimeRec, refDate);
      expect(onTimeStatus.tone).toBe('neutral');
      expect(onTimeStatus.workingDaysLeft).toBeGreaterThan(2);

      const warningStatus = slaStatus(warningRec, refDate);
      expect(warningStatus.tone).toBe('warning');
      expect(warningStatus.workingDaysLeft).toBe(2);

      const overdueStatus = slaStatus(overdueRec, refDate);
      expect(overdueStatus.tone).toBe('danger');
      expect(overdueStatus.workingDaysLeft).toBeLessThan(0);
    });
  });

  describe('9. Staleness Window Detection', () => {
    it('identifies recommendations older than 56 days as stale', () => {
      const now = new Date('2026-09-17T10:00:00.000Z');

      const recentRec = MOCK_RECOMMENDATIONS.find((r) => r.id === 'rec-001-add-mod-ssc-ontime')!;
      expect(isStale(recentRec, now, 56)).toBe(false);

      const staleRec = MOCK_RECOMMENDATIONS.find((r) => r.id === 'rec-012-stale-withdrawn')!;
      expect(isStale(staleRec, now, 56)).toBe(true);
    });
  });

  describe('10. Stepper Progression Structure', () => {
    it('produces 3 steps for SSC_RATIFICATION tier and 4 steps for DSEEI_APPROVAL tier', () => {
      const addModRec = MOCK_RECOMMENDATIONS.find((r) => r.type === 'ADD_MODULE')!;
      const devQualRec = MOCK_RECOMMENDATIONS.find((r) => r.type === 'DEVELOP_QUALIFICATION')!;

      const steps3 = workflowSteps(addModRec);
      expect(steps3).toHaveLength(3);
      expect(steps3.map((s) => s.id)).toEqual(['draft', 'ssc_review', 'published']);

      const steps4 = workflowSteps(devQualRec);
      expect(steps4).toHaveLength(4);
      expect(steps4.map((s) => s.id)).toEqual(['draft', 'ssc_review', 'dseei_approval', 'published']);
    });

    it('marks steps as done, current, or upcoming matching workflow state', () => {
      const sscRec = MOCK_RECOMMENDATIONS.find((r) => r.id === 'rec-001-add-mod-ssc-ontime')!;
      const steps = workflowSteps(sscRec);
      expect(steps[0].state).toBe('done'); // Draft is done
      expect(steps[1].state).toBe('current'); // SSC Review is current
      expect(steps[2].state).toBe('upcoming'); // Published is upcoming
    });
  });

  describe('11. Query Filters & Mock Resolution', () => {
    it('filters recommendations by state, sector, and search query', () => {
      const sscOnly = getFilteredRecommendations({ status: 'SSC_REVIEW' });
      expect(sscOnly.every((r) => r.state === 'SSC_REVIEW')).toBe(true);

      const sector101 = getFilteredRecommendations({ sector_id: 101 });
      expect(sector101.every((r) => r.sector_id === 101)).toBe(true);

      const searchEv = getFilteredRecommendations({ search: 'Electric Vehicle' });
      expect(searchEv.length).toBeGreaterThanOrEqual(1);
    });

    it('resolveMock returns empty array for ?mock=empty and rejects for ?mock=error', async () => {
      const data = [{ id: '1' }];
      const emptyRes = await resolveMock('?mock=empty', data);
      expect(emptyRes).toEqual([]);

      await expect(resolveMock('?mock=error', data)).rejects.toMatchObject({
        error: { code: 'INTERNAL_ERROR' },
      });
    });

    it('executeDecisionMutation simulates 409 conflict when mockMode is conflict', async () => {
      await expect(
        executeDecisionMutation(
          {
            id: 'rec-001-add-mod-ssc-ontime',
            decision: 'APPROVE',
            input: { role: 'SSC_REVIEWER', ifMatchVersion: 1, userSectorIds: [101] },
          },
          'conflict'
        )
      ).rejects.toMatchObject({
        error: { code: 'CONFLICT' },
      });
    });

    it('executeDecisionMutation successfully mutates in-memory store and updates recommendation state', async () => {
      const targetId = 'rec-001-add-mod-ssc-ontime';
      const before = getFilteredRecommendations().find((r) => r.id === targetId)!;
      expect(before.state).toBe('SSC_REVIEW');
      expect(before.version).toBe(1);

      const result = await executeDecisionMutation({
        id: targetId,
        decision: 'APPROVE',
        input: {
          role: 'SSC_REVIEWER',
          ifMatchVersion: 1,
          userSectorIds: [101],
        },
      });

      expect(result.ok).toBe(true);
      if (result.ok) {
        expect(result.next.state).toBe('PUBLISHED');
        expect(result.next.version).toBe(2);
      }

      // Check in-memory store reflected the update
      const after = getFilteredRecommendations().find((r) => r.id === targetId)!;
      expect(after.state).toBe('PUBLISHED');
      expect(after.version).toBe(2);
    });

    it('exports all standard TanStack query and mutation hooks', () => {
      expect(typeof useRecommendations).toBe('function');
      expect(typeof useRecommendation).toBe('function');
      expect(typeof useDossier).toBe('function');
      expect(typeof useDecisionMutation).toBe('function');
    });
  });
});
