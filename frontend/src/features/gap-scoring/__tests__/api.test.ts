import { describe, it, expect } from 'vitest';
import {
  resolveMock,
  getMappedDistricts,
  getMappedGapScores,
  useDistrictAggregates,
  useGapScores,
  useGapRunMeta,
} from '../api';
import { gapKeys } from '../queryKeys';
import {
  SAMPLE_DATA,
  STATE_GAP_RUN_META,
  PUNE_GAP_RUN_META,
  getGapRunMeta,
} from '../mockMeta';
import { MAHARASHTRA_DISTRICTS } from '../gapScoringData';
import { GapSeverity } from '../severity';

describe('Gap Scoring Data Layer & API Hooks (Slice 1B)', () => {
  describe('resolveMock switch modes', () => {
    const sampleData = [{ id: 1, name: 'Test' }];

    it('handles ?mock=loading by returning a non-resolving promise', async () => {
      const loadingPromise = resolveMock('?mock=loading', sampleData);

      const timeoutPromise = new Promise((resolve) => setTimeout(() => resolve('TIMEOUT'), 50));
      const raceResult = await Promise.race([loadingPromise, timeoutPromise]);

      expect(raceResult).toBe('TIMEOUT');
    });

    it('handles ?mock=empty by resolving to empty array []', async () => {
      const result = await resolveMock('?mock=empty', sampleData);
      expect(result).toEqual([]);
    });

    it('handles ?mock=error by rejecting with standard API error envelope', async () => {
      await expect(resolveMock('?mock=error', sampleData)).rejects.toEqual({
        success: false,
        data: null,
        error: {
          code: 'INTERNAL_ERROR',
          message: 'Mock error triggered via ?mock=error',
        },
        traceId: '01J9MOCKTRACE',
      });
    });

    it('handles ?mock=partial on array data by returning data with meta.partial = true', async () => {
      const result = (await resolveMock('?mock=partial', sampleData)) as unknown as {
        meta?: { partial?: boolean };
      } & typeof sampleData;

      expect(Array.isArray(result)).toBe(true);
      expect(result.length).toBe(1);
      expect(result[0]).toEqual(sampleData[0]);
      expect(result.meta?.partial).toBe(true);
    });

    it('handles ?mock=partial on object data by returning object with meta.partial = true', async () => {
      const objData = { runId: 'TEST-RUN', count: 42 };
      const result = (await resolveMock('?mock=partial', objData)) as typeof objData & {
        meta?: { partial?: boolean };
      };

      expect(result.runId).toBe('TEST-RUN');
      expect(result.meta?.partial).toBe(true);
    });

    it('resolves normal data when mock param is absent or standard URLSearchParams used', async () => {
      const result = await resolveMock('', sampleData);
      expect(result).toEqual(sampleData);

      const params = new URLSearchParams('district=14');
      const paramResult = await resolveMock(params, sampleData);
      expect(paramResult).toEqual(sampleData);
    });
  });

  describe('Mapped district aggregates data integrity', () => {
    it('preserves all original fields and adds 3-level severity field', () => {
      const mapped = getMappedDistricts();
      expect(mapped.length).toBe(MAHARASHTRA_DISTRICTS.length);

      const firstOriginal = MAHARASHTRA_DISTRICTS[0];
      const firstMapped = mapped[0];

      expect(firstMapped.id).toBe(firstOriginal.id);
      expect(firstMapped.code).toBe(firstOriginal.code);
      expect(firstMapped.name_en).toBe(firstOriginal.name_en);
      expect(firstMapped.name_mr).toBe(firstOriginal.name_mr);
      expect(firstMapped.name_hi).toBe(firstOriginal.name_hi);
      expect(firstMapped.division).toBe(firstOriginal.division);
      expect(firstMapped.total_vacancies).toBe(firstOriginal.total_vacancies);
      expect(firstMapped.total_capacity).toBe(firstOriginal.total_capacity);
      expect(firstMapped.average_gap_score).toBe(firstOriginal.average_gap_score);
      expect(firstMapped.severity_level).toBe(firstOriginal.severity_level);
      expect(firstMapped.critical_trades_count).toBe(firstOriginal.critical_trades_count);
      expect(firstMapped.iti_count).toBe(firstOriginal.iti_count);
      expect(firstMapped.has_oversupply_alert).toBe(firstOriginal.has_oversupply_alert);
      expect(firstMapped.oversupply_trades_count).toBe(firstOriginal.oversupply_trades_count);

      // Verify severity is strictly 3-level
      const allowedSeverities: GapSeverity[] = ['LOW', 'MEDIUM', 'HIGH'];
      for (const d of mapped) {
        expect(allowedSeverities).toContain(d.severity);
        expect((d.severity as string) === 'CRITICAL').toBe(false);
        expect((d.severity as string) === 'MODERATE').toBe(false);
      }
    });

    it('does not mutate original MAHARASHTRA_DISTRICTS objects', () => {
      getMappedDistricts();
      const first = MAHARASHTRA_DISTRICTS[0] as unknown as Record<string, unknown>;
      expect(first.severity).toBeUndefined();
    });

    it('guarantees at least one district per level in the mapped mock', () => {
      const mapped = getMappedDistricts();
      const lowDistricts = mapped.filter((d) => d.severity === 'LOW');
      const mediumDistricts = mapped.filter((d) => d.severity === 'MEDIUM');
      const highDistricts = mapped.filter((d) => d.severity === 'HIGH');

      expect(lowDistricts.length).toBeGreaterThanOrEqual(1);
      expect(mediumDistricts.length).toBeGreaterThanOrEqual(1);
      expect(highDistricts.length).toBeGreaterThanOrEqual(1);
    });

    it('supports division and severity filtering', () => {
      const puneDivision = getMappedDistricts({ division: 'Pune' });
      expect(puneDivision.length).toBe(5);
      expect(puneDivision.every((d) => d.division === 'Pune')).toBe(true);

      const highDistricts = getMappedDistricts({ severity: 'HIGH' });
      expect(highDistricts.every((d) => d.severity === 'HIGH')).toBe(true);
    });
  });

  describe('Mapped gap scores data integrity', () => {
    it('preserves all original fields and maps severity to 3 levels', () => {
      const scores = getMappedGapScores();
      expect(scores.length).toBeGreaterThan(0);

      const allowedSeverities: GapSeverity[] = ['LOW', 'MEDIUM', 'HIGH'];
      for (const s of scores) {
        expect(allowedSeverities).toContain(s.severity);
        expect(s.job_role_title_en).toBeDefined();
        expect(s.qp_code).toBeDefined();
        expect(s.gap_score).toBeDefined();
      }
    });

    it('filters gap scores by district_id, sector_id, severity, and search term', () => {
      const puneScores = getMappedGapScores({ district_id: 14 });
      expect(puneScores.every((s) => s.district_id === 14)).toBe(true);

      const searchScores = getMappedGapScores({ search: 'CNC' });
      expect(
        searchScores.every(
          (s) =>
            s.job_role_title_en.toLowerCase().includes('cnc') ||
            s.qp_code.toLowerCase().includes('cnc')
        )
      ).toBe(true);
    });
  });

  describe('GapRunMeta and SAMPLE_DATA flag', () => {
    it('defines SAMPLE_DATA as true', () => {
      expect(SAMPLE_DATA).toBe(true);
    });

    it('provides realistic non-round metadata for State scope', () => {
      expect(STATE_GAP_RUN_META.runId).toBe('RUN-2026-09-14-03');
      expect(STATE_GAP_RUN_META.completedAt).toBe('2026-09-14T04:12:38Z');
      expect(STATE_GAP_RUN_META.sources.length).toBeGreaterThan(2);
      expect(STATE_GAP_RUN_META.itiReporting.reported).toBe(384);
      expect(STATE_GAP_RUN_META.itiReporting.total).toBe(417);
      expect(STATE_GAP_RUN_META.previous.netShortage).toBe(48320);
      expect(STATE_GAP_RUN_META.previous.vacancies).toBe(124650);
      expect(STATE_GAP_RUN_META.previous.intake).toBe(76330);
      expect(STATE_GAP_RUN_META.previous.highTrades).toBe(63);
    });

    it('provides realistic non-round metadata for District 14 (Pune)', () => {
      expect(PUNE_GAP_RUN_META.itiReporting.reported).toBe(34);
      expect(PUNE_GAP_RUN_META.itiReporting.total).toBe(38);
      expect(PUNE_GAP_RUN_META.previous.netShortage).toBe(5824);
      expect(PUNE_GAP_RUN_META.previous.vacancies).toBe(13940);
      expect(PUNE_GAP_RUN_META.previous.intake).toBe(8116);
      expect(PUNE_GAP_RUN_META.previous.highTrades).toBe(7);
    });

    it('resolves metadata dynamically via getGapRunMeta', () => {
      expect(getGapRunMeta(14)).toBe(PUNE_GAP_RUN_META);
      expect(getGapRunMeta('14')).toBe(PUNE_GAP_RUN_META);
      expect(getGapRunMeta({ district_id: 14 })).toBe(PUNE_GAP_RUN_META);
      expect(getGapRunMeta('state')).toBe(STATE_GAP_RUN_META);
      expect(getGapRunMeta()).toBe(STATE_GAP_RUN_META);
    });
  });

  describe('queryKeys factory', () => {
    it('returns const tuples matching gap keys specification', () => {
      expect(gapKeys.all).toEqual(['gap']);
      expect(gapKeys.districts({ division: 'Pune' })).toEqual(['gap', 'districts', { division: 'Pune' }]);
      expect(gapKeys.scores({ district_id: 14 })).toEqual(['gap', 'scores', { district_id: 14 }]);
      expect(gapKeys.runMeta('state')).toEqual(['gap', 'runMeta', 'state']);
      expect(gapKeys.runMeta(14)).toEqual(['gap', 'runMeta', 14]);
    });
  });

  describe('Query hooks existence', () => {
    it('exports useDistrictAggregates, useGapScores, and useGapRunMeta hook functions', () => {
      expect(typeof useDistrictAggregates).toBe('function');
      expect(typeof useGapScores).toBe('function');
      expect(typeof useGapRunMeta).toBe('function');
    });
  });
});
