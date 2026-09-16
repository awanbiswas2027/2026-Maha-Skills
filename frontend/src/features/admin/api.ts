/**
 * MahaSkills — Admin Console API & TanStack Query Hooks
 * Problem Statement ID: 26134
 *
 * Provides query and mutation hooks for Airflow pipeline runs, system health metrics,
 * DPDP-compliant audit event logs, and the 4-tier skill taxonomy tree.
 * Includes dev ?mock=loading|empty|error|partial QA switch.
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type {
  PipelineRun,
  PipelineHealthSummary,
  AuditEvent,
  AuditFilters,
  TaxonomyNode,
  PipelineRunState,
} from './model';
import {
  MOCK_PIPELINE_RUNS,
  MOCK_AUDIT_EVENTS,
  MOCK_TAXONOMY_TREE,
} from './fixtures';
import { adminKeys } from './queryKeys';
import { pipelineHealth, filterAudit } from './logic';

export interface MockApiErrorEnvelope {
  success: false;
  data: null;
  error: {
    code: string;
    message: string;
  };
  traceId: string;
}

export interface PipelineRunFilters {
  dagId?: string;
  state?: PipelineRunState;
  search?: string;
  [key: string]: unknown;
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
      // Intentionally never-resolving promise for loading state QA
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
        code: 'ADMIN_MOCK_ERROR',
        message: 'Mock error triggered via ?mock=error',
      },
      traceId: '01J9ADM_MOCKTRACE',
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

/**
 * Filter mock pipeline runs based on query parameters.
 */
export function getFilteredPipelineRuns(filters?: PipelineRunFilters): PipelineRun[] {
  let result = [...MOCK_PIPELINE_RUNS];

  if (filters?.dagId) {
    result = result.filter((r) => r.dagId === filters.dagId);
  }
  if (filters?.state) {
    result = result.filter((r) => r.state === filters.state);
  }
  if (filters?.search) {
    const term = filters.search.toLowerCase().trim();
    result = result.filter((r) => r.dagId.toLowerCase().includes(term) || r.runId.toLowerCase().includes(term));
  }

  return result;
}

/**
 * Hook to retrieve Airflow DAG pipeline execution runs.
 */
export function usePipelineRuns(filters?: PipelineRunFilters) {
  return useQuery({
    queryKey: adminKeys.pipelineRuns(filters),
    queryFn: async (): Promise<PipelineRun[]> => {
      const data = getFilteredPipelineRuns(filters);
      if (import.meta.env.DEV) {
        if (typeof window !== 'undefined' && window.location) {
          return resolveMock(window.location.search, data) as Promise<PipelineRun[]>;
        }
      }
      return data;
    },
  });
}

/**
 * Hook to retrieve pipeline health metrics computed against SLA windows.
 */
export function usePipelineHealth(now?: Date) {
  return useQuery({
    queryKey: adminKeys.pipelineHealth(),
    queryFn: async (): Promise<PipelineHealthSummary> => {
      const data = pipelineHealth(MOCK_PIPELINE_RUNS, now);
      if (import.meta.env.DEV) {
        if (typeof window !== 'undefined' && window.location) {
          return resolveMock(window.location.search, data) as Promise<PipelineHealthSummary>;
        }
      }
      return data;
    },
  });
}

/**
 * Hook to retrieve audit log events with DPDP filtering.
 */
export function useAuditLogs(filters?: AuditFilters) {
  return useQuery({
    queryKey: adminKeys.auditLogs(filters),
    queryFn: async (): Promise<AuditEvent[]> => {
      const data = filterAudit(MOCK_AUDIT_EVENTS, filters);
      if (import.meta.env.DEV) {
        if (typeof window !== 'undefined' && window.location) {
          return resolveMock(window.location.search, data) as Promise<AuditEvent[]>;
        }
      }
      return data;
    },
  });
}

/**
 * Hook to retrieve the complete 4-tier skill taxonomy hierarchy.
 */
export function useTaxonomyTree() {
  return useQuery({
    queryKey: adminKeys.taxonomyTree(),
    queryFn: async (): Promise<TaxonomyNode[]> => {
      const data = [...MOCK_TAXONOMY_TREE];
      if (import.meta.env.DEV) {
        if (typeof window !== 'undefined' && window.location) {
          return resolveMock(window.location.search, data) as Promise<TaxonomyNode[]>;
        }
      }
      return data;
    },
  });
}

export interface TriggerPipelinePayload {
  dagId: string;
  conf?: Record<string, unknown>;
}

/**
 * Mutation hook to trigger an Airflow DAG run.
 */
export function useTriggerPipelineMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: TriggerPipelinePayload): Promise<PipelineRun> => {
      const newRun: PipelineRun = {
        dagId: payload.dagId,
        runId: `manual_${Date.now()}`,
        state: 'QUEUED',
        startedAt: new Date().toISOString(),
        finishedAt: null,
        durationSeconds: null,
        recordsIn: 0,
        recordsOut: 0,
        errorSummary: null,
      };
      return newRun;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: adminKeys.pipelineRuns() });
      queryClient.invalidateQueries({ queryKey: adminKeys.pipelineHealth() });
    },
  });
}
