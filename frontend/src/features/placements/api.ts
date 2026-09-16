/**
 * Placements Feature API Layer & TanStack Query Hooks
 * Supports client-side pre-flight validation and simulated server responses
 * matching openapi.yaml and API_SPECIFICATION.md §2.6.
 * Implements the ?mock=loading|empty|error|partial dev QA switch.
 */

import { useMutation, useQuery } from '@tanstack/react-query';
import { parseCsvChunks } from './csv';
import {
  HISTORICAL_BATCHES,
  HISTORICAL_BATCH_ERRORS,
  SANCTIONED_COURSE_CODES,
} from './fixtures';
import {
  buildErrorCsv,
  canSubmit,
  checkFile,
  summarise,
  validateHeader,
  validateRows,
} from './logic';
import {
  PlacementBatchErrorItem,
  PlacementBatchRecord,
  RowError,
  ValidationSummary,
} from './model';
import { placementKeys } from './queryKeys';

export interface MockApiErrorEnvelope {
  success: false;
  data: null;
  error: {
    code: string;
    message: string;
    details?: Array<{ field: string; issue: string }>;
  };
  traceId: string;
}

/**
 * Pure mock resolution logic for dev testing and QA states.
 * - loading: returns a never-resolving Promise
 * - empty: returns []
 * - error: rejects with an API error envelope
 * - partial: returns data with meta.partial = true attached
 * - default: resolves data directly
 */
export function resolveMock<T>(
  search: string | URLSearchParams | undefined | null,
  data: T
): Promise<T> {
  const params =
    typeof search === 'string'
      ? new URLSearchParams(search)
      : search instanceof URLSearchParams
        ? search
        : new URLSearchParams();

  const mockMode = params.get('mock');

  if (mockMode === 'loading') {
    return new Promise<T>(() => {
      // Intentionally never resolving promise for loading state QA
    });
  }

  if (mockMode === 'empty') {
    return Promise.resolve([] as unknown as T);
  }

  if (mockMode === 'error') {
    const errorEnvelope: MockApiErrorEnvelope = {
      success: false,
      data: null,
      error: {
        code: 'INTERNAL_ERROR',
        message: 'Mock error triggered via ?mock=error',
      },
      traceId: '01J9MOCKTRACE',
    };
    return Promise.reject(errorEnvelope);
  }

  if (mockMode === 'partial') {
    if (Array.isArray(data)) {
      const partialArray = Object.assign([...data], {
        meta: { partial: true },
      }) as unknown as T;
      return Promise.resolve(partialArray);
    }
    if (typeof data === 'object' && data !== null) {
      return Promise.resolve({
        ...data,
        meta: {
          ...((data as Record<string, unknown>).meta as Record<string, unknown> | undefined),
          partial: true,
        },
      } as T);
    }
  }

  return Promise.resolve(data);
}

export interface UploadPlacementPayload {
  file: {
    name: string;
    size: number;
    type?: string;
    text: () => Promise<string>;
  };
  academic_year?: string;
  batch_month?: number;
  institute_id?: string;
  sanctionedCourseCodes?: readonly string[] | string[] | Set<string>;
  onProgress?: (progressPct: number, rowsParsed: number) => void;
}

export interface UploadPlacementSuccessResponse {
  success: true;
  data: {
    batch_id: string;
    status: 'VALIDATING';
    message: string;
  };
  summary: ValidationSummary;
}

export interface UploadPlacementFailureResponse {
  success: false;
  error: {
    code: string;
    message: string;
  };
  summary: ValidationSummary;
  errorCsv: string;
}

export type UploadPlacementResult =
  | UploadPlacementSuccessResponse
  | UploadPlacementFailureResponse;

/**
 * Hook to upload placement returns.
 * Executes full client-side validation first, blocks invalid files atomically,
 * and simulates the server 202 Accepted response.
 */
export function useUploadMutation() {
  return useMutation({
    mutationFn: async (payload: UploadPlacementPayload): Promise<UploadPlacementResult> => {
      // 1. Check file container
      const fileCheck = checkFile({
        name: payload.file.name,
        size: payload.file.size,
        type: payload.file.type,
      });

      if (!fileCheck.ok) {
        const fileError: RowError = {
          row: 1,
          column: 'file',
          value: payload.file.name,
          code: fileCheck.errorCode ?? 'FILE_ERROR',
          messageKey: fileCheck.messageKey ?? 'placements:errors.FILE_ERROR',
          fixKey: fileCheck.fixKey ?? 'placements:fixes.FILE_ERROR',
        };
        const summary = summarise([fileError], 0);
        const failureResponse: UploadPlacementFailureResponse = {
          success: false,
          error: {
            code: fileError.code,
            message: 'File envelope check failed.',
          },
          summary,
          errorCsv: buildErrorCsv([fileError]),
        };

        if (import.meta.env.DEV && typeof window !== 'undefined' && window.location) {
          return resolveMock(window.location.search, failureResponse);
        }
        return failureResponse;
      }

      // 2. Read and parse CSV text
      const csvText = await payload.file.text();
      const allRows = await parseCsvChunks(csvText, {
        chunkSize: 5000,
        onProgress: payload.onProgress,
      });

      if (allRows.length === 0) {
        const emptyError: RowError = {
          row: 1,
          column: 'file',
          value: '',
          code: 'PLA_CSV_EMPTY',
          messageKey: 'placements:errors.PLA_CSV_EMPTY',
          fixKey: 'placements:fixes.PLA_CSV_EMPTY',
        };
        const summary = summarise([emptyError], 0);
        return {
          success: false,
          error: {
            code: 'PLA_CSV_EMPTY',
            message: 'The uploaded placement file is empty.',
          },
          summary,
          errorCsv: buildErrorCsv([emptyError]),
        };
      }

      // 3. Header validation
      const headerRes = validateHeader(allRows[0]);
      if (!headerRes.ok && headerRes.error) {
        const summary = summarise([headerRes.error], Math.max(0, allRows.length - 1));
        return {
          success: false,
          error: {
            code: 'PLA_CSV_MALFORMED_HEADER',
            message: 'CSV headers do not match canonical template format.',
          },
          summary,
          errorCsv: buildErrorCsv([headerRes.error]),
        };
      }

      // 4. Data rows validation
      const dataRows = allRows.slice(1);
      const rowErrors = validateRows(dataRows, {
        sanctionedCourseCodes: payload.sanctionedCourseCodes ?? SANCTIONED_COURSE_CODES,
      });

      const summary = summarise(rowErrors, dataRows.length);

      // 5. Atomic check: if any error exists, submission is blocked
      if (!canSubmit(summary)) {
        const failureResult: UploadPlacementFailureResponse = {
          success: false,
          error: {
            code: 'VALIDATION_FAILED',
            message: `Placement batch contains ${summary.totalErrors} errors across ${summary.errorRows} rows.`,
          },
          summary,
          errorCsv: buildErrorCsv(rowErrors),
        };

        if (import.meta.env.DEV && typeof window !== 'undefined' && window.location) {
          return resolveMock(window.location.search, failureResult);
        }
        return failureResult;
      }

      // 6. Success: return 202 Accepted shape
      const generatedBatchId = `batch-${Date.now()}-${Math.random().toString(36).substring(2, 8)}`;
      const successResult: UploadPlacementSuccessResponse = {
        success: true,
        data: {
          batch_id: generatedBatchId,
          status: 'VALIDATING',
          message: 'File received and queued for syntax & DPDP validation.',
        },
        summary,
      };

      if (import.meta.env.DEV && typeof window !== 'undefined' && window.location) {
        return resolveMock(window.location.search, successResult);
      }
      return successResult;
    },
  });
}

/**
 * Hook to retrieve historical placement batches for an institute.
 */
export function useBatches(instituteId?: string) {
  return useQuery({
    queryKey: placementKeys.batches(instituteId),
    queryFn: async (): Promise<PlacementBatchRecord[]> => {
      let batches = [...HISTORICAL_BATCHES];
      if (instituteId) {
        batches = batches.filter((b) => b.institute_id === instituteId);
      }

      if (import.meta.env.DEV && typeof window !== 'undefined' && window.location) {
        return resolveMock(window.location.search, batches) as Promise<PlacementBatchRecord[]>;
      }
      return batches;
    },
  });
}

/**
 * Hook to retrieve cell-level validation error items for a rejected batch.
 */
export function useBatchErrors(batchId: string) {
  return useQuery({
    queryKey: placementKeys.batchErrors(batchId),
    queryFn: async (): Promise<PlacementBatchErrorItem[]> => {
      const errorList = HISTORICAL_BATCH_ERRORS[batchId] ?? [];

      if (import.meta.env.DEV && typeof window !== 'undefined' && window.location) {
        return resolveMock(window.location.search, errorList) as Promise<PlacementBatchErrorItem[]>;
      }
      return errorList;
    },
    enabled: Boolean(batchId),
  });
}
