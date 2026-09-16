/**
 * Placement Return Validation Engine
 * Enforces DATA_INGESTION.md §2, PRD §7.1, ERROR_CODES.md §2.2, uiux FRM-28..31,
 * and DPDP 2023 Candidate Privacy Guarantees.
 */

import {
  CANONICAL_PLACEMENT_HEADERS,
  FileCheckResult,
  HeaderValidationResult,
  RowError,
  ValidationContext,
  ValidationSummary,
} from './model';

/**
 * Maximum upload size: 10 MB (10,485,760 bytes).
 * Note OQ: File size is not explicitly enumerated in openapi.yaml; default to 10 MB.
 */
export const MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024;

/**
 * Upper bound batch limit: 50,000 records.
 */
export const MAX_BATCH_ROWS = 50000;

/**
 * Salary range constraints in INR (₹8,000.00 to ₹2,00,000.00).
 */
export const MIN_MONTHLY_SALARY = 8000;
export const MAX_MONTHLY_SALARY = 200000;

/**
 * Months to placement bounds (0 to 36 months).
 */
export const MIN_MONTHS_TO_HIRE = 0;
export const MAX_MONTHS_TO_HIRE = 36;

/**
 * Candidate ID validation:
 * Either 6-32 alphanumeric characters or a 64-character HMAC-SHA256 hexadecimal digest.
 */
const CANDIDATE_ID_REGEX = /^(?:[a-fA-F0-9]{64}|[a-zA-Z0-9_-]{6,32})$/;

/**
 * Helper to safely escape RFC 4180 CSV fields.
 */
function escapeCsvField(val: string | number): string {
  const str = String(val);
  if (str.includes(',') || str.includes('"') || str.includes('\n') || str.includes('\r')) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
}

/**
 * Validates the uploaded file container (name, size, mime type).
 */
export function checkFile(file: { name: string; size: number; type?: string }): FileCheckResult {
  if (!file) {
    return {
      ok: false,
      errorCode: 'PLA_CSV_EMPTY',
      messageKey: 'placements:errors.PLA_CSV_EMPTY',
      fixKey: 'placements:fixes.PLA_CSV_EMPTY',
    };
  }

  // 1. File extension check
  const isCsvExt = file.name.toLowerCase().endsWith('.csv');
  if (!isCsvExt) {
    return {
      ok: false,
      errorCode: 'INVALID_FILE_TYPE',
      messageKey: 'placements:errors.INVALID_FILE_TYPE',
      fixKey: 'placements:fixes.INVALID_FILE_TYPE',
    };
  }

  // 2. File size bounds
  if (file.size <= 0) {
    return {
      ok: false,
      errorCode: 'PLA_CSV_EMPTY',
      messageKey: 'placements:errors.PLA_CSV_EMPTY',
      fixKey: 'placements:fixes.PLA_CSV_EMPTY',
    };
  }

  if (file.size > MAX_FILE_SIZE_BYTES) {
    return {
      ok: false,
      errorCode: 'FILE_TOO_LARGE',
      messageKey: 'placements:errors.FILE_TOO_LARGE',
      fixKey: 'placements:fixes.FILE_TOO_LARGE',
    };
  }

  return { ok: true };
}

/**
 * Validates header row against CANONICAL_PLACEMENT_HEADERS.
 */
export function validateHeader(rawHeaders: string[]): HeaderValidationResult {
  const cleanHeaders = rawHeaders.map((h) => h.trim().toLowerCase());
  const canonical = CANONICAL_PLACEMENT_HEADERS as readonly string[];

  const missingHeaders = canonical.filter((h) => !cleanHeaders.includes(h));
  const extraHeaders = cleanHeaders.filter((h) => !canonical.includes(h));

  let misordered = false;
  if (missingHeaders.length === 0 && extraHeaders.length === 0) {
    for (let i = 0; i < canonical.length; i++) {
      if (cleanHeaders[i] !== canonical[i]) {
        misordered = true;
        break;
      }
    }
  }

  const isExactMatch =
    missingHeaders.length === 0 && extraHeaders.length === 0 && !misordered;

  if (!isExactMatch) {
    return {
      ok: false,
      missingHeaders,
      extraHeaders,
      misordered,
      error: {
        row: 1,
        column: 'header',
        value: cleanHeaders.join(','),
        code: 'PLA_CSV_MALFORMED_HEADER',
        messageKey: 'placements:errors.PLA_CSV_MALFORMED_HEADER',
        fixKey: 'placements:fixes.PLA_CSV_MALFORMED_HEADER',
      },
    };
  }

  return {
    ok: true,
    missingHeaders: [],
    extraHeaders: [],
    misordered: false,
  };
}

/**
 * Validates parsed data rows against schema and referential constraints.
 * Strict DPDP Rule: Never echoes candidate identifiers in `RowError.value` (always "[hidden]").
 */
export function validateRows(rows: string[][], ctx: ValidationContext): RowError[] {
  const errors: RowError[] = [];

  // Empty file check
  if (!rows || rows.length === 0) {
    errors.push({
      row: 1,
      column: 'file',
      value: '',
      code: 'PLA_CSV_EMPTY',
      messageKey: 'placements:errors.PLA_CSV_EMPTY',
      fixKey: 'placements:fixes.PLA_CSV_EMPTY',
    });
    return errors;
  }

  // Maximum batch rows limit check
  if (rows.length > MAX_BATCH_ROWS) {
    errors.push({
      row: MAX_BATCH_ROWS + 1,
      column: 'file',
      value: `${rows.length} rows`,
      code: 'PLA_CSV_MAX_ROWS_EXCEEDED',
      messageKey: 'placements:errors.PLA_CSV_MAX_ROWS_EXCEEDED',
      fixKey: 'placements:fixes.PLA_CSV_MAX_ROWS_EXCEEDED',
    });
    return errors;
  }

  // Sanctioned courses set for O(1) referential checking
  const sanctionedSet = new Set(
    Array.isArray(ctx.sanctionedCourseCodes)
      ? ctx.sanctionedCourseCodes.map((c) => c.trim().toUpperCase())
      : Array.from(ctx.sanctionedCourseCodes).map((c) => c.trim().toUpperCase())
  );

  // Batch year range: default current year or preceding 2 years (e.g. 2024 to 2026)
  const currentYear = ctx.currentYear ?? 2026;
  const minBatchYear = ctx.batchYearRange?.min ?? currentYear - 2;
  const maxBatchYear = ctx.batchYearRange?.max ?? currentYear;

  for (let rowIndex = 0; rowIndex < rows.length; rowIndex++) {
    const row = rows[rowIndex];
    const rowNumber = rowIndex + 2; // Row 1 is header; data rows start at line 2

    // Check row column count
    if (row.length < CANONICAL_PLACEMENT_HEADERS.length) {
      errors.push({
        row: rowNumber,
        column: 'row_length',
        value: `${row.length} columns`,
        code: 'PLA_CSV_MALFORMED_HEADER',
        messageKey: 'placements:errors.PLA_CSV_MALFORMED_HEADER',
        fixKey: 'placements:fixes.PLA_CSV_MALFORMED_HEADER',
      });
      continue;
    }

    const rawCandidateId = (row[0] ?? '').trim();
    const rawCourseCode = (row[1] ?? '').trim().toUpperCase();
    const rawBatchYear = (row[2] ?? '').trim();
    const rawPlaced = (row[3] ?? '').trim().toUpperCase();
    const rawEmployer = (row[4] ?? '').trim();
    const rawJobRole = (row[5] ?? '').trim();
    const rawSalary = (row[6] ?? '').trim();
    const rawMonths = (row[7] ?? '').trim();

    // 1. Candidate ID validation (DPDP 2023: ALWAYS MASK VALUE AS "[hidden]")
    if (!rawCandidateId || !CANDIDATE_ID_REGEX.test(rawCandidateId)) {
      errors.push({
        row: rowNumber,
        column: 'candidate_id',
        value: '[hidden]', // DPDP: never expose candidate identifier
        code: 'PLA_INVALID_CANDIDATE_ID',
        messageKey: 'placements:errors.PLA_INVALID_CANDIDATE_ID',
        fixKey: 'placements:fixes.PLA_INVALID_CANDIDATE_ID',
      });
    }

    // 2. Course code validation (Referential existence check)
    if (!rawCourseCode || !sanctionedSet.has(rawCourseCode)) {
      errors.push({
        row: rowNumber,
        column: 'course_code',
        value: rawCourseCode || '[empty]',
        code: 'PLA_UNSANCTIONED_COURSE',
        messageKey: 'placements:errors.PLA_UNSANCTIONED_COURSE',
        fixKey: 'placements:fixes.PLA_UNSANCTIONED_COURSE',
      });
    }

    // 3. Batch year validation
    const parsedBatchYear = parseInt(rawBatchYear, 10);
    if (
      isNaN(parsedBatchYear) ||
      parsedBatchYear < minBatchYear ||
      parsedBatchYear > maxBatchYear ||
      String(parsedBatchYear) !== rawBatchYear
    ) {
      errors.push({
        row: rowNumber,
        column: 'batch_year',
        value: rawBatchYear || '[empty]',
        code: 'PLA_OUT_OF_RANGE_BATCH_YEAR',
        messageKey: 'placements:errors.PLA_OUT_OF_RANGE_BATCH_YEAR',
        fixKey: 'placements:fixes.PLA_OUT_OF_RANGE_BATCH_YEAR',
      });
    }

    // 4. Placed flag validation
    const isPlacedValid = rawPlaced === 'Y' || rawPlaced === 'N';
    if (!isPlacedValid) {
      errors.push({
        row: rowNumber,
        column: 'placed',
        value: rawPlaced || '[empty]',
        code: 'PLA_INVALID_BOOLEAN_FLAG',
        messageKey: 'placements:errors.PLA_INVALID_BOOLEAN_FLAG',
        fixKey: 'placements:fixes.PLA_INVALID_BOOLEAN_FLAG',
      });
    }

    // 5. Conditional validations when placed = 'Y'
    if (rawPlaced === 'Y') {
      // Employer name (mandatory, 1-200 characters)
      if (!rawEmployer || rawEmployer.length > 200) {
        errors.push({
          row: rowNumber,
          column: 'employer_name',
          value: rawEmployer || '[empty]',
          code: 'PLA_MISSING_EMPLOYER_NAME',
          messageKey: 'placements:errors.PLA_MISSING_EMPLOYER_NAME',
          fixKey: 'placements:fixes.PLA_MISSING_EMPLOYER_NAME',
        });
      }

      // Job role (mandatory, 1-200 characters)
      if (!rawJobRole || rawJobRole.length > 200) {
        errors.push({
          row: rowNumber,
          column: 'job_role',
          value: rawJobRole || '[empty]',
          code: 'PLA_MISSING_JOB_ROLE',
          messageKey: 'placements:errors.PLA_MISSING_JOB_ROLE',
          fixKey: 'placements:fixes.PLA_MISSING_JOB_ROLE',
        });
      }

      // Monthly salary (mandatory decimal ₹8,000.00 to ₹2,00,000.00)
      const parsedSalary = Number(rawSalary);
      if (
        !rawSalary ||
        isNaN(parsedSalary) ||
        parsedSalary < MIN_MONTHLY_SALARY ||
        parsedSalary > MAX_MONTHLY_SALARY
      ) {
        errors.push({
          row: rowNumber,
          column: 'monthly_salary',
          value: rawSalary || '[empty]',
          code: 'PLA_SALARY_OUT_OF_BOUNDS',
          messageKey: 'placements:errors.PLA_SALARY_OUT_OF_BOUNDS',
          fixKey: 'placements:fixes.PLA_SALARY_OUT_OF_BOUNDS',
        });
      }

      // Months to placement (mandatory integer 0 to 36)
      const parsedMonths = parseInt(rawMonths, 10);
      if (
        !rawMonths ||
        isNaN(parsedMonths) ||
        parsedMonths < MIN_MONTHS_TO_HIRE ||
        parsedMonths > MAX_MONTHS_TO_HIRE ||
        String(parsedMonths) !== rawMonths
      ) {
        errors.push({
          row: rowNumber,
          column: 'months_to_placement',
          value: rawMonths || '[empty]',
          code: 'PLA_INVALID_MONTHS_TO_HIRE',
          messageKey: 'placements:errors.PLA_INVALID_MONTHS_TO_HIRE',
          fixKey: 'placements:fixes.PLA_INVALID_MONTHS_TO_HIRE',
        });
      }
    }
  }

  return errors;
}

/**
 * Summarises row errors into a batch validation summary.
 */
export function summarise(errors: RowError[], totalRows: number): ValidationSummary {
  const errorRowIndices = new Set<number>();
  for (const err of errors) {
    errorRowIndices.add(err.row);
  }

  const errorRowsCount = errorRowIndices.size;
  const validRowsCount = Math.max(0, totalRows - errorRowsCount);
  const totalErrors = errors.length;
  const canSubmit = totalErrors === 0 && totalRows > 0;

  return {
    totalRows,
    validRows: validRowsCount,
    errorRows: errorRowsCount,
    totalErrors,
    errors,
    canSubmit,
  };
}

/**
 * Default English descriptions for error codes used in downloadable error CSV.
 */
const ERROR_DESCRIPTIONS: Record<string, { problem: string; howToFix: string }> = {
  PLA_CSV_EMPTY: {
    problem: 'The uploaded CSV file contains no data rows.',
    howToFix: 'Ensure your CSV file contains the header and at least one candidate record.',
  },
  PLA_CSV_MALFORMED_HEADER: {
    problem: 'CSV header does not match the canonical template format.',
    howToFix:
      'Download the standard template and ensure columns match: candidate_id,course_code,batch_year,placed,employer_name,job_role,monthly_salary,months_to_placement.',
  },
  PLA_CSV_MAX_ROWS_EXCEEDED: {
    problem: 'File exceeds maximum batch limit of 50,000 records.',
    howToFix: 'Split your placement returns into smaller monthly batches of up to 50,000 rows.',
  },
  PLA_INVALID_CANDIDATE_ID: {
    problem: 'Candidate ID is malformed or invalid.',
    howToFix:
      'Provide a 6-32 character alphanumeric ID or an irreversible 64-hex SHA-256 hash.',
  },
  PLA_UNSANCTIONED_COURSE: {
    problem: 'Course code is not sanctioned for this institute.',
    howToFix:
      'Verify that the course code matches an active vocational trade sanctioned for your ITI.',
  },
  PLA_OUT_OF_RANGE_BATCH_YEAR: {
    problem: 'Batch year is outside the permissible range.',
    howToFix: 'Batch year must be the current academic year or one of the preceding 2 years (YYYY).',
  },
  PLA_INVALID_BOOLEAN_FLAG: {
    problem: 'Placement status must be Y or N.',
    howToFix: 'Enter Y for placed candidates or N for unplaced candidates.',
  },
  PLA_MISSING_EMPLOYER_NAME: {
    problem: 'Employer name is mandatory for placed candidates.',
    howToFix: 'Provide the registered hiring company name (1-200 characters).',
  },
  PLA_MISSING_JOB_ROLE: {
    problem: 'Job role is mandatory for placed candidates.',
    howToFix: 'Provide the designated vocational job title (1-200 characters).',
  },
  PLA_SALARY_OUT_OF_BOUNDS: {
    problem: 'Monthly salary must be between 8,000 and 200,000 INR.',
    howToFix: 'Enter a valid gross monthly salary decimal figure between 8,000 and 200,000.',
  },
  PLA_INVALID_MONTHS_TO_HIRE: {
    problem: 'Months to placement must be an integer between 0 and 36.',
    howToFix: 'Enter the elapsed number of months between course completion and employment.',
  },
  FILE_TOO_LARGE: {
    problem: 'File size exceeds maximum permitted limit (10 MB).',
    howToFix: 'Compress or split your file to ensure it is under 10 MB.',
  },
  INVALID_FILE_TYPE: {
    problem: 'Only CSV files (.csv) are accepted.',
    howToFix: 'Export your spreadsheet as a comma-separated values (.csv) file.',
  },
};

/**
 * Builds downloadable error CSV content per uiux FRM-30 and TBL-12.
 * Strictly guarantees that candidate identifiers are NEVER present in the export.
 */
export function buildErrorCsv(errors: RowError[]): string {
  const header = 'row,column,code,problem,how_to_fix';
  const lines: string[] = [header];

  for (const err of errors) {
    const meta = ERROR_DESCRIPTIONS[err.code] ?? {
      problem: 'Validation rule failed on this field.',
      howToFix: 'Check the column format and submit updated data.',
    };

    const rowStr = escapeCsvField(err.row);
    const colStr = escapeCsvField(err.column);
    const codeStr = escapeCsvField(err.code);
    const problemStr = escapeCsvField(meta.problem);
    const fixStr = escapeCsvField(meta.howToFix);

    lines.push(`${rowStr},${colStr},${codeStr},${problemStr},${fixStr}`);
  }

  return lines.join('\r\n');
}

/**
 * Determines whether the upload can proceed (atomic batch rule).
 */
export function canSubmit(summary: ValidationSummary): boolean {
  return summary.canSubmit;
}
