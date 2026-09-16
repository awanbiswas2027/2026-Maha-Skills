import { RecommendationFilters } from './model';

export const recommendationKeys = {
  all: ['recommendations'] as const,
  lists: () => [...recommendationKeys.all, 'list'] as const,
  list: (filters?: RecommendationFilters) =>
    [...recommendationKeys.lists(), filters] as const,
  details: () => [...recommendationKeys.all, 'detail'] as const,
  detail: (id: string) => [...recommendationKeys.details(), id] as const,
  dossiers: () => [...recommendationKeys.all, 'dossier'] as const,
  dossier: (id: string) => [...recommendationKeys.dossiers(), id] as const,
};
