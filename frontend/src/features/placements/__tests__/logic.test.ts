import { describe, expect, it } from 'vitest';
import { SANCTIONED_COURSE_CODES } from '../fixtures';
import {
  buildErrorCsv,
  canSubmit,
  checkFile,
  MAX_FILE_SIZE_BYTES,
  summarise,
  validateHeader,
  validateRows,
} from '../logic';
import { CANONICAL_PLACEMENT_HEADERS } from '../model';

describe('Placement Return Validation Logic', () => {
  const defaultCtx = {
    sanctionedCourseCodes: SANCTIONED_COURSE_CODES,
    currentYear: 2026,
    batchYearRange: { min: 2024, max: 2026 },
  };

  const validHash = 'a'.repeat(64);

  describe('checkFile', () => {
    it('accepts valid CSV file under 10 MB', () => {
      const result = checkFile({ name: 'placement_2026_07.csv', size: 1024 * 50 });
      expect(result.ok).toBe(true);
      expect(result.errorCode).toBeUndefined();
    });

    it('rejects files without .csv extension', () => {
      const result = checkFile({ name: 'placements.xlsx', size: 2048 });
      expect(result.ok).toBe(false);
      expect(result.errorCode).toBe('INVALID_FILE_TYPE');
      expect(result.messageKey).toBe('placements:errors.INVALID_FILE_TYPE');
    });

    it('rejects empty files (0 bytes)', () => {
      const result = checkFile({ name: 'placements.csv', size: 0 });
      expect(result.ok).toBe(false);
      expect(result.errorCode).toBe('PLA_CSV_EMPTY');
    });

    it('rejects files exceeding 10 MB limit', () => {
      const result = checkFile({ name: 'placements.csv', size: MAX_FILE_SIZE_BYTES + 1 });
      expect(result.ok).toBe(false);
      expect(result.errorCode).toBe('FILE_TOO_LARGE');
    });
  });

  describe('validateHeader', () => {
    it('passes exact canonical header match', () => {
      const result = validateHeader([...CANONICAL_PLACEMENT_HEADERS]);
      expect(result.ok).toBe(true);
      expect(result.missingHeaders).toHaveLength(0);
      expect(result.extraHeaders).toHaveLength(0);
      expect(result.misordered).toBe(false);
      expect(result.error).toBeUndefined();
    });

    it('handles headers with surrounding whitespace and case variation', () => {
      const mixedHeaders = [
        ' CANDIDATE_ID ',
        'course_code',
        'Batch_Year',
        'PLACED',
        'employer_name',
        'job_role',
        'monthly_salary',
        'months_to_placement',
      ];
      const result = validateHeader(mixedHeaders);
      expect(result.ok).toBe(true);
    });

    it('flags missing columns with PLA_CSV_MALFORMED_HEADER', () => {
      const partialHeaders = ['candidate_id', 'course_code', 'batch_year'];
      const result = validateHeader(partialHeaders);
      expect(result.ok).toBe(false);
      expect(result.missingHeaders).toContain('placed');
      expect(result.error?.code).toBe('PLA_CSV_MALFORMED_HEADER');
    });

    it('flags unexpected extra columns', () => {
      const extra = [...CANONICAL_PLACEMENT_HEADERS, 'extra_column'];
      const result = validateHeader(extra);
      expect(result.ok).toBe(false);
      expect(result.extraHeaders).toEqual(['extra_column']);
    });

    it('flags misordered columns even if all columns are present', () => {
      const reversed = [...CANONICAL_PLACEMENT_HEADERS].reverse();
      const result = validateHeader(reversed);
      expect(result.ok).toBe(false);
      expect(result.misordered).toBe(true);
      expect(result.missingHeaders).toHaveLength(0);
    });
  });

  describe('validateRows - Schema & Business Constraints', () => {
    it('flags empty row datasets with PLA_CSV_EMPTY', () => {
      const errors = validateRows([], defaultCtx);
      expect(errors).toHaveLength(1);
      expect(errors[0].code).toBe('PLA_CSV_EMPTY');
    });

    it('flags row counts exceeding 50,000 records with PLA_CSV_MAX_ROWS_EXCEEDED', () => {
      const fakeRows = new Array(50001).fill(['']);
      const errors = validateRows(fakeRows, defaultCtx);
      expect(errors).toHaveLength(1);
      expect(errors[0].code).toBe('PLA_CSV_MAX_ROWS_EXCEEDED');
    });

    it('validates a correct placed candidate row without errors', () => {
      const validRow = [
        validHash,
        'CTS-ELE-01',
        '2026',
        'Y',
        'Tata Motors Ltd',
        'Junior Electrical Technician',
        '25000.00',
        '3',
      ];
      const errors = validateRows([validRow], defaultCtx);
      expect(errors).toHaveLength(0);
    });

    it('validates a correct unplaced candidate row without errors', () => {
      const unplacedRow = [
        validHash,
        'CTS-FIT-01',
        '2025',
        'N',
        '',
        '',
        '',
        '',
      ];
      const errors = validateRows([unplacedRow], defaultCtx);
      expect(errors).toHaveLength(0);
    });

    it('enforces DPDP rule: NEVER echo candidate identifiers in RowError.value', () => {
      // Test with an ID that fails the regex
      const badIdRow = [
        'bad!', // fails regex due to punctuation
        'CTS-ELE-01',
        '2026',
        'Y',
        'Bajaj Auto',
        'Assembly Line Fitter',
        '20000.00',
        '2',
      ];

      const errors = validateRows([badIdRow], defaultCtx);
      const candidateError = errors.find((e) => e.column === 'candidate_id');
      expect(candidateError).toBeDefined();
      expect(candidateError?.code).toBe('PLA_INVALID_CANDIDATE_ID');
      expect(candidateError?.value).toBe('[hidden]');
      expect(candidateError?.value).not.toContain('bad!');
    });

    it('flags unsanctioned course codes with PLA_UNSANCTIONED_COURSE', () => {
      const row = [
        validHash,
        'CTS-UNKNOWN-999',
        '2026',
        'Y',
        'Tata Motors',
        'Fitter',
        '22000.00',
        '1',
      ];
      const errors = validateRows([row], defaultCtx);
      expect(errors).toHaveLength(1);
      expect(errors[0].code).toBe('PLA_UNSANCTIONED_COURSE');
      expect(errors[0].column).toBe('course_code');
      expect(errors[0].value).toBe('CTS-UNKNOWN-999');
    });

    it('flags out-of-range batch years with PLA_OUT_OF_RANGE_BATCH_YEAR', () => {
      const rowPast = [
        validHash,
        'CTS-ELE-01',
        '2020', // past allowable 2024
        'Y',
        'Tata Motors',
        'Fitter',
        '22000.00',
        '1',
      ];
      const errorsPast = validateRows([rowPast], defaultCtx);
      expect(errorsPast).toHaveLength(1);
      expect(errorsPast[0].code).toBe('PLA_OUT_OF_RANGE_BATCH_YEAR');

      const rowFuture = [
        validHash,
        'CTS-ELE-01',
        '2030', // future
        'Y',
        'Tata Motors',
        'Fitter',
        '22000.00',
        '1',
      ];
      const errorsFuture = validateRows([rowFuture], defaultCtx);
      expect(errorsFuture).toHaveLength(1);
      expect(errorsFuture[0].code).toBe('PLA_OUT_OF_RANGE_BATCH_YEAR');
    });

    it('flags invalid placement boolean flags with PLA_INVALID_BOOLEAN_FLAG', () => {
      const invalidBoolRow = [
        validHash,
        'CTS-ELE-01',
        '2026',
        'YES', // Must be Y or N
        'Tata Motors',
        'Fitter',
        '22000.00',
        '1',
      ];
      const errors = validateRows([invalidBoolRow], defaultCtx);
      expect(errors).toHaveLength(1);
      expect(errors[0].code).toBe('PLA_INVALID_BOOLEAN_FLAG');
      expect(errors[0].value).toBe('YES');
    });

    it('flags missing employer name for placed candidates with PLA_MISSING_EMPLOYER_NAME', () => {
      const missingEmployerRow = [
        validHash,
        'CTS-ELE-01',
        '2026',
        'Y',
        '', // missing
        'Junior Fitter',
        '22000.00',
        '1',
      ];
      const errors = validateRows([missingEmployerRow], defaultCtx);
      expect(errors).toHaveLength(1);
      expect(errors[0].code).toBe('PLA_MISSING_EMPLOYER_NAME');
      expect(errors[0].column).toBe('employer_name');
    });

    it('flags missing job role for placed candidates with PLA_MISSING_JOB_ROLE', () => {
      const missingJobRow = [
        validHash,
        'CTS-ELE-01',
        '2026',
        'Y',
        'Tata Motors',
        '', // missing
        '22000.00',
        '1',
      ];
      const errors = validateRows([missingJobRow], defaultCtx);
      expect(errors).toHaveLength(1);
      expect(errors[0].code).toBe('PLA_MISSING_JOB_ROLE');
      expect(errors[0].column).toBe('job_role');
    });

    it('flags salary out of bounds with PLA_SALARY_OUT_OF_BOUNDS', () => {
      // Below min ₹8,000
      const lowSalaryRow = [
        validHash,
        'CTS-ELE-01',
        '2026',
        'Y',
        'Tata Motors',
        'Technician',
        '7999.00',
        '2',
      ];
      const lowErrors = validateRows([lowSalaryRow], defaultCtx);
      expect(lowErrors).toHaveLength(1);
      expect(lowErrors[0].code).toBe('PLA_SALARY_OUT_OF_BOUNDS');

      // Above max ₹2,00,000
      const highSalaryRow = [
        validHash,
        'CTS-ELE-01',
        '2026',
        'Y',
        'Tata Motors',
        'Technician',
        '200001.00',
        '2',
      ];
      const highErrors = validateRows([highSalaryRow], defaultCtx);
      expect(highErrors).toHaveLength(1);
      expect(highErrors[0].code).toBe('PLA_SALARY_OUT_OF_BOUNDS');

      // Non-numeric
      const nonNumericSalaryRow = [
        validHash,
        'CTS-ELE-01',
        '2026',
        'Y',
        'Tata Motors',
        'Technician',
        'N/A',
        '2',
      ];
      const nonNumErrors = validateRows([nonNumericSalaryRow], defaultCtx);
      expect(nonNumErrors).toHaveLength(1);
      expect(nonNumErrors[0].code).toBe('PLA_SALARY_OUT_OF_BOUNDS');
    });

    it('flags invalid months to placement with PLA_INVALID_MONTHS_TO_HIRE', () => {
      // Negative
      const negMonthsRow = [
        validHash,
        'CTS-ELE-01',
        '2026',
        'Y',
        'Tata Motors',
        'Technician',
        '25000.00',
        '-1',
      ];
      const negErrors = validateRows([negMonthsRow], defaultCtx);
      expect(negErrors).toHaveLength(1);
      expect(negErrors[0].code).toBe('PLA_INVALID_MONTHS_TO_HIRE');

      // > 36 months
      const overMonthsRow = [
        validHash,
        'CTS-ELE-01',
        '2026',
        'Y',
        'Tata Motors',
        'Technician',
        '25000.00',
        '37',
      ];
      const overErrors = validateRows([overMonthsRow], defaultCtx);
      expect(overErrors).toHaveLength(1);
      expect(overErrors[0].code).toBe('PLA_INVALID_MONTHS_TO_HIRE');
    });

    it('accumulates multiple distinct errors on a single malformed row', () => {
      const multiErrorRow = [
        'bad!', // invalid ID
        'CTS-UNKNOWN', // unsanctioned course
        '2015', // out of range year
        'Y',
        '', // missing employer
        '', // missing role
        '3000.00', // salary out of bounds
        '50', // months out of bounds
      ];
      const errors = validateRows([multiErrorRow], defaultCtx);
      expect(errors.length).toBe(7);
      const codes = errors.map((e) => e.code);
      expect(codes).toContain('PLA_INVALID_CANDIDATE_ID');
      expect(codes).toContain('PLA_UNSANCTIONED_COURSE');
      expect(codes).toContain('PLA_OUT_OF_RANGE_BATCH_YEAR');
      expect(codes).toContain('PLA_MISSING_EMPLOYER_NAME');
      expect(codes).toContain('PLA_MISSING_JOB_ROLE');
      expect(codes).toContain('PLA_SALARY_OUT_OF_BOUNDS');
      expect(codes).toContain('PLA_INVALID_MONTHS_TO_HIRE');
    });
  });

  describe('summarise & canSubmit (Atomic Batch Isolation Rule)', () => {
    it('summarises clean batch as fully valid with canSubmit true', () => {
      const summary = summarise([], 100);
      expect(summary.totalRows).toBe(100);
      expect(summary.validRows).toBe(100);
      expect(summary.errorRows).toBe(0);
      expect(summary.totalErrors).toBe(0);
      expect(summary.canSubmit).toBe(true);
      expect(canSubmit(summary)).toBe(true);
    });

    it('blocks submission atomically if even one row has an error', () => {
      const mockError = {
        row: 5,
        column: 'monthly_salary',
        value: '4000',
        code: 'PLA_SALARY_OUT_OF_BOUNDS',
        messageKey: 'placements:errors.PLA_SALARY_OUT_OF_BOUNDS',
        fixKey: 'placements:fixes.PLA_SALARY_OUT_OF_BOUNDS',
      };
      const summary = summarise([mockError], 100);
      expect(summary.totalRows).toBe(100);
      expect(summary.validRows).toBe(99);
      expect(summary.errorRows).toBe(1);
      expect(summary.totalErrors).toBe(1);
      expect(summary.canSubmit).toBe(false);
      expect(canSubmit(summary)).toBe(false);
    });

    it('correctly aggregates multiple errors across the same row', () => {
      const err1 = {
        row: 10,
        column: 'employer_name',
        value: '',
        code: 'PLA_MISSING_EMPLOYER_NAME',
        messageKey: 'placements:errors.PLA_MISSING_EMPLOYER_NAME',
        fixKey: 'placements:fixes.PLA_MISSING_EMPLOYER_NAME',
      };
      const err2 = {
        row: 10,
        column: 'job_role',
        value: '',
        code: 'PLA_MISSING_JOB_ROLE',
        messageKey: 'placements:errors.PLA_MISSING_JOB_ROLE',
        fixKey: 'placements:fixes.PLA_MISSING_JOB_ROLE',
      };
      const summary = summarise([err1, err2], 50);
      expect(summary.totalRows).toBe(50);
      expect(summary.validRows).toBe(49);
      expect(summary.errorRows).toBe(1);
      expect(summary.totalErrors).toBe(2);
      expect(summary.canSubmit).toBe(false);
    });
  });

  describe('buildErrorCsv (Downloadable Error Export)', () => {
    it('produces RFC 4180 CSV with problem and remediation guidance without candidate IDs', () => {
      const errors = [
        {
          row: 12,
          column: 'candidate_id',
          value: '[hidden]',
          code: 'PLA_INVALID_CANDIDATE_ID',
          messageKey: 'placements:errors.PLA_INVALID_CANDIDATE_ID',
          fixKey: 'placements:fixes.PLA_INVALID_CANDIDATE_ID',
        },
        {
          row: 15,
          column: 'monthly_salary',
          value: '4500.00',
          code: 'PLA_SALARY_OUT_OF_BOUNDS',
          messageKey: 'placements:errors.PLA_SALARY_OUT_OF_BOUNDS',
          fixKey: 'placements:fixes.PLA_SALARY_OUT_OF_BOUNDS',
        },
      ];

      const csv = buildErrorCsv(errors);
      expect(csv).toContain('row,column,code,problem,how_to_fix');
      expect(csv).toContain('12,candidate_id,PLA_INVALID_CANDIDATE_ID');
      expect(csv).toContain('15,monthly_salary,PLA_SALARY_OUT_OF_BOUNDS');
      // Verify candidate ID is NEVER present
      expect(csv).not.toContain('validHash');
      expect(csv).not.toContain('bad!');
    });
  });
});
