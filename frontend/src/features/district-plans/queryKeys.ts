export const planKeys = {
  all: ['district-plans'] as const,
  lists: () => [...planKeys.all, 'list'] as const,
  list: (filters?: Record<string, unknown>) => [...planKeys.lists(), filters] as const,
  details: () => [...planKeys.all, 'detail'] as const,
  detail: (districtId?: number | string, fy?: string) =>
    [...planKeys.details(), districtId, fy] as const,
};
