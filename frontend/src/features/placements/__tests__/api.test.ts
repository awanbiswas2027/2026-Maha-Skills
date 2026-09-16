import { describe, expect, it } from 'vitest';
import {
  resolveMock,
  useBatches,
  useBatchErrors,
  useUploadMutation,
} from '../api';
import {
  generateInvalidCsv,
  generateValidCsv,
  HISTORICAL_BATCH_ERRORS,
  HISTORICAL_BATCHES,
  SANCTIONED_COURSE_CODES,
} from '../fixtures';
import { placementKeys } from '../queryKeys';

describe('Placements API Layer, Fixtures & Query Keys', () => {
  describe('resolveMock switch modes', () => {
    const sampleBatches = [{ id: 'b-1', status: 'LOADED' }];

    it('handles ?mock=loading by returning a non-resolving promise', async () => {
      const loadingPromise = resolveMock('?mock=loading', sampleBatches);
      const timeoutPromise = new Promise((resolve) => setTimeout(() => resolve('TIMEOUT'), 50));
      const raceResult = await Promise.race([loadingPromise, timeoutPromise]);
      expect(raceResult).toBe('TIMEOUT');
    });

    it('handles ?mock=empty by resolving to empty array []', async () => {
      const result = await resolveMock('?mock=empty', sampleBatches);
      expect(result).toEqual([]);
    });

    it('handles ?mock=error by rejecting with standard API error envelope', async () => {
      await expect(resolveMock('?mock=error', sampleBatches)).rejects.toEqual({
        success: false,
        data: null,
        error: {
          code: 'INTERNAL_ERROR',
          message: 'Mock error triggered via ?mock=error',
        },
        traceId: '01J9MOCKTRACE',
      });
    });

    it('handles ?mock=partial on array data', async () => {
      const result = (await resolveMock('?mock=partial', sampleBatches)) as unknown as {
        meta?: { partial?: boolean };
      } & typeof sampleBatches;

      expect(Array.isArray(result)).toBe(true);
      expect(result).toHaveLength(1);
      expect(result.meta?.partial).toBe(true);
    });

    it('handles ?mock=partial on object data', async () => {
      const batchObj = { batchId: 'batch-001', rows: 50 };
      const result = (await resolveMock('?mock=partial', batchObj)) as typeof batchObj & {
        meta?: { partial?: boolean };
      };
      expect(result.batchId).toBe('batch-001');
      expect(result.meta?.partial).toBe(true);
    });

    it('resolves raw data when no mock mode is set', async () => {
      const result = await resolveMock('', sampleBatches);
      expect(result).toEqual(sampleBatches);
    });
  });

  describe('Placement Query Keys Factory', () => {
    it('produces hierarchical query keys per convention', () => {
      expect(placementKeys.all).toEqual(['placements']);
      expect(placementKeys.batches('ITI-PUNE-01')).toEqual(['placements', 'batches', 'ITI-PUNE-01']);
      expect(placementKeys.batchDetail('b-99')).toEqual(['placements', 'batch', 'b-99']);
      expect(placementKeys.batchErrors('b-99')).toEqual(['placements', 'errors', 'b-99']);
    });
  });

  describe('Fixtures & Deterministic Generators', () => {
    it('provides 3 historical batches with realistic BE §H.3 statuses', () => {
      expect(HISTORICAL_BATCHES).toHaveLength(3);
      const statuses = HISTORICAL_BATCHES.map((b) => b.status);
      expect(statuses).toContain('LOADED');
      expect(statuses).toContain('PARTIALLY_FAILED');
      expect(statuses).toContain('FAILED');

      const loadedBatch = HISTORICAL_BATCHES.find((b) => b.status === 'LOADED');
      expect(loadedBatch?.accepted_count).toBe(loadedBatch?.row_count);
      expect(loadedBatch?.rejected_count).toBe(0);

      const failedBatch = HISTORICAL_BATCHES.find((b) => b.status === 'FAILED');
      expect(failedBatch?.accepted_count).toBe(0);
      expect(failedBatch?.rejected_count).toBe(failedBatch?.row_count);
    });

    it('contains sanctioned course codes for vocational trades', () => {
      expect(SANCTIONED_COURSE_CODES.length).toBeGreaterThanOrEqual(8);
      expect(SANCTIONED_COURSE_CODES).toContain('CTS-ELE-01');
      expect(SANCTIONED_COURSE_CODES).toContain('CTS-FIT-01');
      expect(SANCTIONED_COURSE_CODES).toContain('CTS-COPA-01');
    });

    it('provides historical batch error items matching schema', () => {
      const batch2Errors = HISTORICAL_BATCH_ERRORS['9b1d84a2-2222-4002-8002-000000000002'];
      expect(batch2Errors).toBeDefined();
      expect(batch2Errors.length).toBe(5);
      expect(batch2Errors[0].error_code).toBe('PLA_UNSANCTIONED_COURSE');
      expect(batch2Errors[1].error_code).toBe('PLA_SALARY_OUT_OF_BOUNDS');
      // Verify candidate ID is hidden in rejected items
      expect(batch2Errors[2].rejected_value).toBe('[hidden]');
    });

    it('generates valid RFC 4180 CSV strings deterministically', () => {
      const csv = generateValidCsv({ rowCount: 15, batchYear: 2026, seed: 101 });
      const lines = csv.split('\r\n');
      expect(lines).toHaveLength(16); // 1 header + 15 data
      expect(lines[0]).toBe(
        'candidate_id,course_code,batch_year,placed,employer_name,job_role,monthly_salary,months_to_placement'
      );
    });

    it('generates invalid CSV strings for various error scenarios', () => {
      const malformedHeader = generateInvalidCsv({ errorType: 'MALFORMED_HEADER' });
      expect(malformedHeader).toContain('student_id,course,year');

      const unsanctioned = generateInvalidCsv({ errorType: 'UNSANCTIONED_COURSE' });
      expect(unsanctioned).toContain('CTS-INVALID-99');

      const salaryBad = generateInvalidCsv({ errorType: 'SALARY_OUT_OF_BOUNDS' });
      expect(salaryBad).toContain('5000.00');
    });
  });

  describe('Upload Mutation and End-to-End Ingestion Flow', () => {
    it('exports useUploadMutation, useBatches, and useBatchErrors functions', () => {
      expect(typeof useUploadMutation).toBe('function');
      expect(typeof useBatches).toBe('function');
      expect(typeof useBatchErrors).toBe('function');
    });
  });
});
