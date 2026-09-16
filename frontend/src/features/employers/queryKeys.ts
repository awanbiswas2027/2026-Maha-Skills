/**
 * MahaSkills — Employer Portal TanStack Query Keys
 * Problem Statement ID: 26134
 */

export const employerKeys = {
  all: ['employers'] as const,
  skillNeeds: (filters?: Record<string, unknown>) => [...employerKeys.all, 'skill-needs', filters] as const,
  surveys: (filters?: Record<string, unknown>) => [...employerKeys.all, 'surveys', filters] as const,
  surveyDetail: (id: string) => [...employerKeys.all, 'survey', id] as const,
  curriculumReviews: () => [...employerKeys.all, 'curriculum-reviews'] as const,
  profile: () => [...employerKeys.all, 'profile'] as const,
};
