/**
 * MahaSkills Gap-Scoring Query Keys
 * Standardized query key factory returning const tuples for TanStack Query.
 */

export const gapKeys = {
  all: ['gap'] as const,
  districts: (filters?: Record<string, unknown>) => ['gap', 'districts', filters] as const,
  scores: (filters?: Record<string, unknown>) => ['gap', 'scores', filters] as const,
  runMeta: (scope?: unknown) => ['gap', 'runMeta', scope] as const,
};
