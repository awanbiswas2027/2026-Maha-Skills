import { useQuery } from '@tanstack/react-query';
import { DistrictGapAggregate, GapScoreItem } from '../../types/api';
import { MAHARASHTRA_DISTRICTS, MOCK_GAP_SCORES } from './gapScoringData';
import { GapRunMeta, getGapRunMeta } from './mockMeta';
import { gapKeys } from './queryKeys';
import { GapSeverity, toGapSeverity } from './severity';

export interface MappedDistrictGapAggregate extends DistrictGapAggregate {
  severity: GapSeverity;
}

export interface MappedGapScoreItem extends GapScoreItem {
  severity: GapSeverity;
}

export interface MockApiErrorEnvelope {
  success: false;
  data: null;
  error: {
    code: string;
    message: string;
  };
  traceId: string;
}

export interface DistrictFilters {
  division?: string;
  severity?: GapSeverity | string;
  [key: string]: unknown;
}

export interface GapScoreFilters {
  district_id?: number | string;
  sector_id?: number | string;
  division?: string;
  severity?: GapSeverity | string;
  search?: string;
  [key: string]: unknown;
}

/**
 * Maps existing district mock aggregates to 3 severity levels without mutating original array.
 */
export function getMappedDistricts(filters?: DistrictFilters): MappedDistrictGapAggregate[] {
  let mapped: MappedDistrictGapAggregate[] = MAHARASHTRA_DISTRICTS.map((district) => ({
    ...district,
    severity: toGapSeverity(district.severity_level, district.average_gap_score),
  }));

  if (filters?.division) {
    mapped = mapped.filter(
      (d) => d.division.toLowerCase() === String(filters.division).toLowerCase()
    );
  }
  if (filters?.severity) {
    const targetSev = toGapSeverity(String(filters.severity));
    mapped = mapped.filter((d) => d.severity === targetSev);
  }

  return mapped;
}

/**
 * Maps existing gap score mock items to 3 severity levels without mutating original array.
 */
export function getMappedGapScores(filters?: GapScoreFilters): MappedGapScoreItem[] {
  let mapped: MappedGapScoreItem[] = MOCK_GAP_SCORES.map((score) => ({
    ...score,
    severity: toGapSeverity(score.severity_level, score.gap_score),
  }));

  if (filters?.district_id !== undefined && filters.district_id !== '') {
    const targetId = Number(filters.district_id);
    mapped = mapped.filter((s) => s.district_id === targetId);
  }
  if (filters?.sector_id !== undefined && filters.sector_id !== '') {
    const targetSector = Number(filters.sector_id);
    mapped = mapped.filter((s) => s.sector_id === targetSector);
  }
  if (filters?.severity) {
    const targetSev = toGapSeverity(String(filters.severity));
    mapped = mapped.filter((s) => s.severity === targetSev);
  }
  if (filters?.search) {
    const term = String(filters.search).toLowerCase().trim();
    mapped = mapped.filter(
      (s) =>
        s.job_role_title_en.toLowerCase().includes(term) ||
        s.job_role_title_mr.toLowerCase().includes(term) ||
        s.job_role_title_hi.toLowerCase().includes(term) ||
        s.qp_code.toLowerCase().includes(term)
    );
  }

  return mapped;
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
 * Hook to retrieve district-level gap aggregates mapped to 3 severity levels.
 */
export function useDistrictAggregates(filters?: DistrictFilters) {
  return useQuery({
    queryKey: gapKeys.districts(filters),
    queryFn: async (): Promise<MappedDistrictGapAggregate[]> => {
      const data = getMappedDistricts(filters);
      if (import.meta.env.DEV) {
        if (typeof window !== 'undefined' && window.location) {
          return resolveMock(window.location.search, data) as Promise<MappedDistrictGapAggregate[]>;
        }
      }
      return data;
    },
  });
}

/**
 * Hook to retrieve detailed trade gap scores mapped to 3 severity levels.
 */
export function useGapScores(filters?: GapScoreFilters) {
  return useQuery({
    queryKey: gapKeys.scores(filters),
    queryFn: async (): Promise<MappedGapScoreItem[]> => {
      const data = getMappedGapScores(filters);
      if (import.meta.env.DEV) {
        if (typeof window !== 'undefined' && window.location) {
          return resolveMock(window.location.search, data) as Promise<MappedGapScoreItem[]>;
        }
      }
      return data;
    },
  });
}

/**
 * Hook to retrieve gap scoring engine run metadata (state or district scope).
 */
export function useGapRunMeta(scope?: unknown) {
  return useQuery({
    queryKey: gapKeys.runMeta(scope),
    queryFn: async (): Promise<GapRunMeta> => {
      const data = getGapRunMeta(scope);
      if (import.meta.env.DEV) {
        if (typeof window !== 'undefined' && window.location) {
          return resolveMock(window.location.search, data) as Promise<GapRunMeta>;
        }
      }
      return data;
    },
  });
}
