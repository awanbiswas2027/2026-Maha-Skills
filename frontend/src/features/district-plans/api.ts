import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { MOCK_DISTRICT_PLANS } from './fixtures';
import { applyEdit } from './logic';
import { DistrictPlan, PlanStatus } from './model';
import { planKeys } from './queryKeys';

export interface MockApiErrorEnvelope {
  success: false;
  data: null;
  error: {
    code: string;
    message: string;
    details?: unknown;
  };
  traceId: string;
}

export interface DistrictPlanFilters {
  district_id?: number | string;
  fiscal_year?: string;
  status?: PlanStatus | string;
  search?: string;
  [key: string]: unknown;
}

/**
 * Pure mock resolution logic for dev testing and QA states.
 * - loading: returns a never-resolving Promise
 * - empty: returns [] or null
 * - error: rejects with an API error envelope
 * - partial: returns data with meta.partial = true attached
 * - conflict: rejects with a 409 CONFLICT error envelope
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
    if (Array.isArray(data)) {
      return Promise.resolve([] as unknown as T);
    }
    return Promise.resolve(null as unknown as T);
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

  if (mockMode === 'conflict') {
    const conflictEnvelope: MockApiErrorEnvelope = {
      success: false,
      data: null,
      error: {
        code: 'CONFLICT',
        message: 'Version conflict: this plan was modified by another user.',
        details: { serverTime: '14:20' },
      },
      traceId: '01J9CONFLICTTRACE',
    };
    return Promise.reject(conflictEnvelope);
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

// In-memory working copy of plans for mutations in dev session
let livePlans = [...MOCK_DISTRICT_PLANS];

export function resetLivePlans(): void {
  livePlans = [...MOCK_DISTRICT_PLANS];
}

/**
 * Hook to retrieve a single district training plan by district and fiscal year.
 */
export function usePlan(districtId?: number | string, fy: string = '2026-27') {
  return useQuery({
    queryKey: planKeys.detail(districtId, fy),
    queryFn: async (): Promise<DistrictPlan | null> => {
      if (districtId === undefined || districtId === '') return null;
      const targetId = Number(districtId);
      const found =
        livePlans.find(
          (p) =>
            p.districtId === targetId &&
            (!fy || p.fiscalYear.toLowerCase() === fy.toLowerCase())
        ) || null;

      if (import.meta.env.DEV) {
        if (typeof window !== 'undefined' && window.location) {
          return resolveMock(window.location.search, found);
        }
      }
      return found;
    },
    enabled: districtId !== undefined && districtId !== '',
  });
}

/**
 * Hook to retrieve a list of district plans matching filters.
 */
export function usePlans(filters?: DistrictPlanFilters) {
  return useQuery({
    queryKey: planKeys.list(filters),
    queryFn: async (): Promise<DistrictPlan[]> => {
      let result = [...livePlans];

      if (filters?.district_id !== undefined && filters.district_id !== '') {
        const dId = Number(filters.district_id);
        result = result.filter((p) => p.districtId === dId);
      }
      if (filters?.fiscal_year) {
        result = result.filter(
          (p) => p.fiscalYear.toLowerCase() === String(filters.fiscal_year).toLowerCase()
        );
      }
      if (filters?.status) {
        result = result.filter(
          (p) => p.status.toLowerCase() === String(filters.status).toLowerCase()
        );
      }
      if (filters?.search) {
        const term = String(filters.search).toLowerCase().trim();
        result = result.filter(
          (p) =>
            p.districtName.toLowerCase().includes(term) ||
            p.id.toLowerCase().includes(term)
        );
      }

      if (import.meta.env.DEV) {
        if (typeof window !== 'undefined' && window.location) {
          return resolveMock(window.location.search, result);
        }
      }
      return result;
    },
  });
}

export interface SavePlanVariables {
  planId: string;
  patch: Partial<DistrictPlan>;
  ifMatchVersion: number;
}

/**
 * Mutation hook to save a draft district plan with optimistic concurrency support.
 */
export function useSavePlanMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ planId, patch, ifMatchVersion }: SavePlanVariables): Promise<DistrictPlan> => {
      if (import.meta.env.DEV && typeof window !== 'undefined' && window.location) {
        const params = new URLSearchParams(window.location.search);
        if (params.get('mock') === 'conflict') {
          const conflictEnvelope: MockApiErrorEnvelope = {
            success: false,
            data: null,
            error: {
              code: 'CONFLICT',
              message: 'This plan was changed by someone else at 14:20. Your edits are kept below.',
              details: { serverTime: '14:20' },
            },
            traceId: '01J9CONFLICTTRACE',
          };
          throw conflictEnvelope;
        }
      }

      const existingIndex = livePlans.findIndex((p) => p.id === planId);
      if (existingIndex === -1) {
        throw new Error('Plan not found');
      }

      const existingPlan = livePlans[existingIndex];
      const editResult = applyEdit(existingPlan, patch, ifMatchVersion);

      if (!editResult.ok) {
        const errorEnvelope: MockApiErrorEnvelope = {
          success: false,
          data: null,
          error: {
            code: editResult.error,
            message: editResult.messageKey,
            details: editResult.details,
          },
          traceId: '01J9ERRORTRACE',
        };
        throw errorEnvelope;
      }

      livePlans[existingIndex] = editResult.plan;
      return editResult.plan;
    },
    onSuccess: (savedPlan) => {
      queryClient.invalidateQueries({ queryKey: planKeys.all });
      queryClient.setQueryData(
        planKeys.detail(savedPlan.districtId, savedPlan.fiscalYear),
        savedPlan
      );
    },
  });
}

export interface SubmitPlanVariables {
  planId: string;
  ifMatchVersion: number;
  submissionNotes?: string;
}

/**
 * Mutation hook for District Officer to submit a plan for sanction.
 */
export function useSubmitPlanMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ planId, ifMatchVersion }: SubmitPlanVariables): Promise<DistrictPlan> => {
      const existingIndex = livePlans.findIndex((p) => p.id === planId);
      if (existingIndex === -1) throw new Error('Plan not found');

      const plan = livePlans[existingIndex];
      const editResult = applyEdit(
        plan,
        {
          status: 'SUBMITTED',
          submittedAt: new Date().toISOString(),
          currentStage: 'SUBMISSION',
        },
        ifMatchVersion
      );

      if (!editResult.ok) {
        throw new Error(editResult.messageKey);
      }

      livePlans[existingIndex] = editResult.plan;
      return editResult.plan;
    },
    onSuccess: (submittedPlan) => {
      queryClient.invalidateQueries({ queryKey: planKeys.all });
      queryClient.setQueryData(
        planKeys.detail(submittedPlan.districtId, submittedPlan.fiscalYear),
        submittedPlan
      );
    },
  });
}

export interface SanctionPlanVariables {
  planId: string;
  ifMatchVersion: number;
}

/**
 * Mutation hook for Policy Maker to sanction and publish a district training plan.
 */
export function useSanctionMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ planId, ifMatchVersion }: SanctionPlanVariables): Promise<DistrictPlan> => {
      const existingIndex = livePlans.findIndex((p) => p.id === planId);
      if (existingIndex === -1) throw new Error('Plan not found');

      const plan = livePlans[existingIndex];
      const editResult = applyEdit(
        plan,
        {
          status: 'PUBLISHED',
          publishedAt: new Date().toISOString(),
          currentStage: 'SUBMISSION',
        },
        ifMatchVersion
      );

      if (!editResult.ok) {
        throw new Error(editResult.messageKey);
      }

      livePlans[existingIndex] = editResult.plan;
      return editResult.plan;
    },
    onSuccess: (publishedPlan) => {
      queryClient.invalidateQueries({ queryKey: planKeys.all });
      queryClient.setQueryData(
        planKeys.detail(publishedPlan.districtId, publishedPlan.fiscalYear),
        publishedPlan
      );
    },
  });
}
