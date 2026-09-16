/**
 * MahaSkills — Admin Console TanStack Query Keys
 * Problem Statement ID: 26134
 */

export const adminKeys = {
  all: ['admin'] as const,
  pipelineRuns: (filters?: Record<string, unknown>) => [...adminKeys.all, 'pipelines', filters] as const,
  pipelineHealth: () => [...adminKeys.all, 'pipelines', 'health'] as const,
  auditLogs: (filters?: Record<string, unknown>) => [...adminKeys.all, 'audit', filters] as const,
  taxonomyTree: () => [...adminKeys.all, 'taxonomy', 'tree'] as const,
  systemHealth: () => [...adminKeys.all, 'system-health'] as const,
};
