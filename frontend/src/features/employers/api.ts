/**
 * MahaSkills — Employer Portal API & TanStack Query Hooks
 * Problem Statement ID: 26134
 *
 * Provides data-fetching and mutation hooks for employer skill needs declarations,
 * 2-minute pulse surveys, curriculum reviews, and GSTIN verification.
 * Includes dev ?mock=loading|empty|error|partial QA switch.
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type {
  SkillNeed,
  Survey,
  CurriculumReview,
  GSTINValidationResult,
  SkillNeedUrgency,
} from './model';
import {
  MOCK_SKILL_NEEDS,
  MOCK_SURVEYS,
  MOCK_CURRICULUM_REVIEWS,
} from './fixtures';
import { employerKeys } from './queryKeys';
import { validateGSTIN } from './schemas';

export interface MockApiErrorEnvelope {
  success: false;
  data: null;
  error: {
    code: string;
    message: string;
  };
  traceId: string;
}

export interface SkillNeedFilters {
  quarter?: string;
  district?: string;
  districtId?: number;
  urgency?: SkillNeedUrgency;
  search?: string;
  [key: string]: unknown;
}

export interface SurveyFilters {
  sectorId?: number;
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
        code: 'EMPLOYER_MOCK_ERROR',
        message: 'Mock error triggered via ?mock=error',
      },
      traceId: '01J9EMP_MOCKTRACE',
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
 * Filter mock skill needs based on query parameters.
 */
export function getFilteredSkillNeeds(filters?: SkillNeedFilters): SkillNeed[] {
  let result = [...MOCK_SKILL_NEEDS];

  if (filters?.quarter) {
    result = result.filter((sn) => sn.quarter === filters.quarter);
  }
  if (filters?.district) {
    result = result.filter((sn) => sn.district.toLowerCase() === filters.district?.toLowerCase());
  }
  if (filters?.districtId !== undefined) {
    result = result.filter((sn) => sn.districtId === Number(filters.districtId));
  }
  if (filters?.urgency) {
    result = result.filter((sn) => sn.urgency === filters.urgency);
  }
  if (filters?.search) {
    const term = filters.search.toLowerCase().trim();
    result = result.filter(
      (sn) =>
        sn.jobRole.toLowerCase().includes(term) ||
        sn.skills.some((s) => s.toLowerCase().includes(term))
    );
  }

  return result;
}

/**
 * Hook to retrieve upcoming skill needs declared by employers.
 */
export function useSkillNeeds(filters?: SkillNeedFilters) {
  return useQuery({
    queryKey: employerKeys.skillNeeds(filters),
    queryFn: async (): Promise<SkillNeed[]> => {
      const data = getFilteredSkillNeeds(filters);
      if (import.meta.env.DEV) {
        if (typeof window !== 'undefined' && window.location) {
          return resolveMock(window.location.search, data) as Promise<SkillNeed[]>;
        }
      }
      return data;
    },
  });
}

/**
 * Mutation hook to declare a new industrial skill need.
 */
export function useSubmitSkillNeedMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: Omit<SkillNeed, 'id' | 'createdAt'>): Promise<SkillNeed> => {
      const newNeed: SkillNeed = {
        ...payload,
        id: `sn_usr_${Date.now()}`,
        createdAt: new Date().toISOString(),
      };
      return newNeed;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: employerKeys.skillNeeds() });
    },
  });
}

/**
 * Hook to retrieve active 2-minute rapid industry pulse surveys.
 */
export function useSurveys(filters?: SurveyFilters) {
  return useQuery({
    queryKey: employerKeys.surveys(filters),
    queryFn: async (): Promise<Survey[]> => {
      let data = [...MOCK_SURVEYS];
      if (filters?.sectorId !== undefined) {
        data = data.filter((s) => s.sectorId === Number(filters.sectorId));
      }
      if (filters?.search) {
        const term = filters.search.toLowerCase().trim();
        data = data.filter((s) => s.title.toLowerCase().includes(term));
      }

      if (import.meta.env.DEV) {
        if (typeof window !== 'undefined' && window.location) {
          return resolveMock(window.location.search, data) as Promise<Survey[]>;
        }
      }
      return data;
    },
  });
}

/**
 * Hook to retrieve a single pulse survey by ID.
 */
export function useSurvey(id: string) {
  return useQuery({
    queryKey: employerKeys.surveyDetail(id),
    queryFn: async (): Promise<Survey | null> => {
      const found = MOCK_SURVEYS.find((s) => s.id === id) || null;
      if (import.meta.env.DEV) {
        if (typeof window !== 'undefined' && window.location) {
          return resolveMock(window.location.search, found) as Promise<Survey | null>;
        }
      }
      return found;
    },
    enabled: Boolean(id),
  });
}

export interface SubmitSurveyPayload {
  surveyId: string;
  answers: Record<string, unknown>;
}

/**
 * Mutation hook to submit answers to a rapid pulse survey.
 */
export function useSubmitSurveyMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: SubmitSurveyPayload): Promise<{ success: boolean; recordedCount: number }> => {
      return {
        success: true,
        recordedCount: Object.keys(payload.answers).length,
      };
    },
    onSuccess: (_, vars) => {
      queryClient.invalidateQueries({ queryKey: employerKeys.surveyDetail(vars.surveyId) });
      queryClient.invalidateQueries({ queryKey: employerKeys.surveys() });
    },
  });
}

/**
 * Hook to retrieve draft syllabi reviews assigned to the employer.
 */
export function useCurriculumReviews() {
  return useQuery({
    queryKey: employerKeys.curriculumReviews(),
    queryFn: async (): Promise<CurriculumReview[]> => {
      const data = [...MOCK_CURRICULUM_REVIEWS];
      if (import.meta.env.DEV) {
        if (typeof window !== 'undefined' && window.location) {
          return resolveMock(window.location.search, data) as Promise<CurriculumReview[]>;
        }
      }
      return data;
    },
  });
}

/**
 * Mutation hook to submit curriculum validation review.
 */
export function useSubmitCurriculumReviewMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: CurriculumReview): Promise<CurriculumReview> => {
      const result: CurriculumReview = {
        ...payload,
        id: payload.id || `rev_usr_${Date.now()}`,
        submittedAt: new Date().toISOString(),
      };
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: employerKeys.curriculumReviews() });
    },
  });
}

/**
 * Mutation hook to validate GSTIN structure and Luhn checksum.
 */
export function useVerifyGstinMutation() {
  return useMutation({
    mutationFn: async (gstin: string): Promise<GSTINValidationResult> => {
      return validateGSTIN(gstin);
    },
  });
}
