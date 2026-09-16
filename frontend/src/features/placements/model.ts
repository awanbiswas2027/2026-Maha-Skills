/**
 * Placement Return Ingestion Domain Model
 * Based on DATA_INGESTION.md §2, PRD §7.1, ERROR_CODES.md §2.2,
 * API_SPECIFICATION.md §2.6, openapi.yaml, and BE §H.3.
 */

/**
 * Canonical CSV header list in strict order per DATA_INGESTION.md §2.1.
 */
export const CANONICAL_PLACEMENT_HEADERS = [
  'candidate_id',
  'course_code',
  'batch_year',
  'placed',
  'employer_name',
  'job_role',
  'monthly_salary',
  'months_to_placement',
] as const;

export type PlacementHeader = (typeof CANONICAL_PLACEMENT_HEADERS)[number];

/**
 * Row-level validation error contract.
 * Note: Under DPDP Act 2023, `value` MUST NEVER contain raw or identifiable candidate data.
 * When `column` is `candidate_id`, `value` must always be masked as `"[hidden]"`.
 */
export interface RowError {
  row: number; // 1-based index (header is row 1, data rows start at row 2)
  column: string;
  value: string;
  code: string;
  messageKey: string;
  fixKey: string;
}

/**
 * Overall batch validation summary.
 */
export interface ValidationSummary {
  totalRows: number;
  validRows: number;
  errorRows: number; // count of distinct rows with at least one error
  totalErrors: number; // total error count across all rows
  errors: RowError[];
  canSubmit: boolean; // atomic batch rule: false while any error exists
}

/**
 * Batch lifecycle status as defined in BE §H.3:
 * RECEIVED -> VALIDATING -> { VALIDATED -> LOADED | PARTIALLY_FAILED | FAILED }
 */
export type BatchStatus =
  | 'RECEIVED'
  | 'VALIDATING'
  | 'VALIDATED'
  | 'LOADED'
  | 'PARTIALLY_FAILED'
  | 'FAILED';

/**
 * Parsed row data dictionary before DB insertion.
 */
export interface PlacementRow {
  candidate_id: string;
  course_code: string;
  batch_year: number;
  placed: boolean;
  employer_name: string | null;
  job_role: string | null;
  monthly_salary: number | null;
  months_to_placement: number | null;
}

/**
 * Validation context providing external referential rules.
 */
export interface ValidationContext {
  sanctionedCourseCodes: readonly string[] | string[] | Set<string>;
  batchYearRange?: {
    min: number;
    max: number;
  };
  currentYear?: number;
}

/**
 * Result of client-side file envelope checks.
 */
export interface FileCheckResult {
  ok: boolean;
  errorCode?: string;
  messageKey?: string;
  fixKey?: string;
}

/**
 * Result of header validation.
 */
export interface HeaderValidationResult {
  ok: boolean;
  missingHeaders: string[];
  extraHeaders: string[];
  misordered: boolean;
  error?: RowError;
}

/**
 * Batch record stored in backend and returned from batch list endpoint.
 */
export interface PlacementBatchRecord {
  batch_id: string;
  institute_id: string;
  academic_year: string;
  batch_month: number;
  status: BatchStatus;
  row_count: number;
  accepted_count: number | null;
  rejected_count: number | null;
  error_csv_url?: string | null;
  created_at: string;
  updated_at: string;
}

/**
 * Error record item returned from GET /v1/ingestion/placements/{batchId}/errors.
 */
export interface PlacementBatchErrorItem {
  row_number: number;
  column_name: string;
  rejected_value: string;
  error_code: string;
  error_message: string;
}
