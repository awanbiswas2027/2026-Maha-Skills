/**
 * Query key factory for the placements feature.
 * Avoids touching shared lib/query-keys.ts per _SWARM-v1.md.
 */

export const placementKeys = {
  all: ['placements'] as const,
  batches: (instituteId?: string) => [...placementKeys.all, 'batches', instituteId] as const,
  batchDetail: (batchId: string) => [...placementKeys.all, 'batch', batchId] as const,
  batchErrors: (batchId: string) => [...placementKeys.all, 'errors', batchId] as const,
};
