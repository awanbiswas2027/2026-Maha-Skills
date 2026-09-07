export const queryKeys = {
  auth: {
    me: ['auth', 'me'] as const,
    permissions: ['auth', 'permissions'] as const,
  },
  lmi: {
    aggregates: (filters: Record<string, unknown> = {}) => ['lmi', 'aggregates', filters] as const,
    trends: (sectorId?: number) => ['lmi', 'trends', sectorId] as const,
  },
  taxonomy: {
    tree: ['taxonomy', 'tree'] as const,
    roles: (sectorId?: number) => ['taxonomy', 'roles', sectorId] as const,
  },
  gapScores: {
    list: (filters: Record<string, unknown> = {}) => ['gap-scores', 'list', filters] as const,
    detail: (id: string) => ['gap-scores', 'detail', id] as const,
    oversupply: (districtId?: number) => ['gap-scores', 'oversupply', districtId] as const,
  },
  recommendations: {
    list: (status?: string, sscId?: number) => ['recommendations', 'list', { status, sscId }] as const,
    detail: (id: string) => ['recommendations', 'detail', id] as const,
    dossier: (id: string) => ['recommendations', 'dossier', id] as const,
  },
  placements: {
    batches: (instituteId: string) => ['placements', 'batches', instituteId] as const,
    errors: (batchId: string) => ['placements', 'errors', batchId] as const,
  },
  districtPlans: {
    annual: (districtId: number, fiscalYear: string) => ['district-plans', districtId, fiscalYear] as const,
    equipmentGaps: (planId: string) => ['district-plans', planId, 'equipment-gaps'] as const,
  },
  candidates: {
    courses: (filters: Record<string, unknown> = {}) => ['candidates', 'courses', filters] as const,
  },
};
