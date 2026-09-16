import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { MOCK_DOSSIERS, MOCK_RECOMMENDATIONS } from './fixtures';
import { applyDecision } from './logic';
import {
  Decision,
  DecisionInput,
  DecisionResult,
  Dossier,
  Recommendation,
  RecommendationFilters,
} from './model';
import { recommendationKeys } from './queryKeys';

export interface MockApiErrorEnvelope {
  success: false;
  data: null;
  error: {
    code: string;
    message: string;
  };
  traceId: string;
}

export interface DecisionMutationVariables {
  id: string;
  decision: Decision;
  input: DecisionInput;
}

// Module-level in-memory store for recommendations to allow mutation during runtime/mocking
let inMemoryRecommendations: Recommendation[] = [...MOCK_RECOMMENDATIONS];

/**
 * Reset in-memory recommendations store (useful for test isolation)
 */
export function resetInMemoryRecommendations(): void {
  inMemoryRecommendations = [...MOCK_RECOMMENDATIONS];
}

/**
 * Filter recommendations based on query parameters.
 */
export function getFilteredRecommendations(
  filters?: RecommendationFilters
): Recommendation[] {
  let list = [...inMemoryRecommendations];

  if (filters?.status) {
    list = list.filter((r) => r.state === filters.status);
  }

  if (filters?.sector_id !== undefined && filters.sector_id !== '') {
    const sId = Number(filters.sector_id);
    list = list.filter((r) => r.sector_id === sId);
  }

  if (filters?.district_id !== undefined && filters.district_id !== '') {
    const dId = Number(filters.district_id);
    list = list.filter((r) => r.district_ids.includes(dId));
  }

  if (filters?.type) {
    list = list.filter((r) => r.type === filters.type);
  }

  if (filters?.search) {
    const q = filters.search.toLowerCase().trim();
    list = list.filter(
      (r) =>
        r.recommendation_code.toLowerCase().includes(q) ||
        r.target_job_role.toLowerCase().includes(q) ||
        (r.target_course_title && r.target_course_title.toLowerCase().includes(q)) ||
        r.trigger_rule.toLowerCase().includes(q)
    );
  }

  return list;
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

/**
 * Hook to retrieve filtered curriculum recommendations.
 */
export function useRecommendations(filters?: RecommendationFilters) {
  return useQuery({
    queryKey: recommendationKeys.list(filters),
    queryFn: async (): Promise<Recommendation[]> => {
      const data = getFilteredRecommendations(filters);
      if (import.meta.env.DEV) {
        if (typeof window !== 'undefined' && window.location) {
          return resolveMock(window.location.search, data) as Promise<Recommendation[]>;
        }
      }
      return data;
    },
  });
}

/**
 * Hook to retrieve single recommendation detail by ID.
 */
export function useRecommendation(id: string) {
  return useQuery({
    queryKey: recommendationKeys.detail(id),
    queryFn: async (): Promise<Recommendation | null> => {
      const item = inMemoryRecommendations.find((r) => r.id === id) || null;
      if (import.meta.env.DEV) {
        if (typeof window !== 'undefined' && window.location) {
          return resolveMock(window.location.search, item) as Promise<Recommendation | null>;
        }
      }
      return item;
    },
    enabled: Boolean(id),
  });
}

/**
 * Hook to retrieve empirical evidence dossier by recommendation ID.
 */
export function useDossier(id: string) {
  return useQuery({
    queryKey: recommendationKeys.dossier(id),
    queryFn: async (): Promise<Dossier | null> => {
      const dossier = MOCK_DOSSIERS[id] || null;
      if (import.meta.env.DEV) {
        if (typeof window !== 'undefined' && window.location) {
          return resolveMock(window.location.search, dossier) as Promise<Dossier | null>;
        }
      }
      return dossier;
    },
    enabled: Boolean(id),
  });
}

/**
 * Core decision mutation execution logic.
 * Updates the in-memory recommendations store and handles mock mode simulations.
 */
export async function executeDecisionMutation(
  { id, decision, input }: DecisionMutationVariables,
  mockParam?: string
): Promise<DecisionResult> {
  const mockMode =
    mockParam ??
    (typeof window !== 'undefined' && window.location
      ? new URLSearchParams(window.location.search).get('mock')
      : null);

  if (mockMode === 'conflict') {
    const errorEnvelope: MockApiErrorEnvelope = {
      success: false,
      data: null,
      error: {
        code: 'CONFLICT',
        message:
          'Recommendation version conflict (HTTP 409). The recommendation was modified by another approver.',
      },
      traceId: '01J9MOCKCONFLICT',
    };
    return Promise.reject(errorEnvelope);
  }

  if (mockMode === 'error') {
    const errorEnvelope: MockApiErrorEnvelope = {
      success: false,
      data: null,
      error: {
        code: 'INTERNAL_ERROR',
        message: 'Mock server failure during decision submission (?mock=error)',
      },
      traceId: '01J9MOCKMUTATIONERR',
    };
    return Promise.reject(errorEnvelope);
  }

  const recIndex = inMemoryRecommendations.findIndex((r) => r.id === id);
  if (recIndex === -1) {
    return Promise.reject({
      success: false,
      data: null,
      error: {
        code: 'NOT_FOUND',
        message: `Recommendation ${id} not found`,
      },
      traceId: '01J9MOCKNOTFOUND',
    });
  }

  const rec = inMemoryRecommendations[recIndex];
  const dossier = MOCK_DOSSIERS[id];

  const result = applyDecision(rec, decision, input, dossier);
  if (!result.ok) {
    return Promise.reject({
      success: false,
      data: null,
      error: {
        code: result.error,
        message: `Decision application failed: ${result.error}`,
      },
      traceId: '01J9MOCKLOGICFAIL',
    });
  }

  // Update in-memory store
  inMemoryRecommendations[recIndex] = result.next;

  return result;
}

/**
 * Hook to submit a review decision mutation.
 * Applies applyDecision in-memory and simulates 409 conflict when ?mock=conflict is active.
 */
export function useDecisionMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (variables: DecisionMutationVariables) => executeDecisionMutation(variables),
    onSuccess: (data, variables) => {
      if (data.ok) {
        queryClient.setQueryData(
          recommendationKeys.detail(variables.id),
          data.next
        );
        queryClient.invalidateQueries({ queryKey: recommendationKeys.lists() });
      }
    },
  });
}
