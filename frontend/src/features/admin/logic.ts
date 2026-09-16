/**
 * MahaSkills — Admin Console Pure Domain Logic
 * Problem Statement ID: 26134
 *
 * Implements pipeline health calculation with SLA thresholds (nightly > 26h, weekly > 8d),
 * run summary metrics, DPDP-compliant audit event filtering, taxonomy tree path resolution,
 * and bilingual diacritics-insensitive taxonomy search.
 */

import type {
  PipelineRun,
  PipelineHealthSummary,
  PipelineHealthInfo,
  PipelineRunSummary,
  AuditEvent,
  AuditFilters,
  TaxonomyNode,
  DagSchedule,
  HealthStatus,
  HealthTone,
} from './model';

/**
 * Normalizes text for search by stripping Latin diacritics and converting to lowercase.
 * Preserves Devanagari script intact.
 */
export function normalizeSearchTerm(text: string): string {
  if (!text) return '';
  return text
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim();
}

/**
 * Infers execution schedule from DAG ID naming conventions.
 */
export function inferDagSchedule(dagId: string): DagSchedule {
  const lower = dagId.toLowerCase();
  if (lower.includes('nightly') || lower.includes('daily') || lower.includes('scrape') || lower.includes('ncs')) {
    return 'nightly';
  }
  if (lower.includes('weekly') || lower.includes('gap') || lower.includes('audit') || lower.includes('recommendation')) {
    return 'weekly';
  }
  if (lower.includes('monthly') || lower.includes('taxonomy')) {
    return 'monthly';
  }
  return 'nightly';
}

/**
 * Returns SLA staleness threshold in hours based on DAG schedule:
 * - Nightly DAGs: 26 hours (24h SLA + 2h margin for scrape queue completion)
 * - Weekly DAGs: 192 hours (8 days: 7d + 24h margin)
 * - Monthly DAGs: 768 hours (32 days)
 */
export function getScheduleStalenessHours(schedule: DagSchedule): number {
  switch (schedule) {
    case 'nightly':
      return 26;
    case 'weekly':
      return 192; // 8 days * 24 hours
    case 'monthly':
      return 768; // 32 days * 24 hours
    default:
      return 26;
  }
}

/**
 * Computes pipeline health per DAG and statewide summary against SLA thresholds.
 */
export function pipelineHealth(runs: PipelineRun[], now: Date = new Date()): PipelineHealthSummary {
  if (!Array.isArray(runs) || runs.length === 0) {
    return {
      overallStatus: 'UNKNOWN',
      overallTone: 'neutral',
      staleDags: [],
      dagHealth: {},
    };
  }

  // Group runs by dagId
  const dagRunsMap = new Map<string, PipelineRun[]>();
  for (const run of runs) {
    const list = dagRunsMap.get(run.dagId) || [];
    list.push(run);
    dagRunsMap.set(run.dagId, list);
  }

  const dagHealth: Record<string, PipelineHealthInfo> = {};
  const staleDags: string[] = [];
  let hasCritical = false;
  let hasWarning = false;

  for (const [dagId, dRuns] of dagRunsMap.entries()) {
    const schedule = inferDagSchedule(dagId);
    const thresholdHours = getScheduleStalenessHours(schedule);

    // Sort by startedAt desc
    const sorted = [...dRuns].sort((a, b) => {
      const timeA = a.startedAt ? new Date(a.startedAt).getTime() : 0;
      const timeB = b.startedAt ? new Date(b.startedAt).getTime() : 0;
      return timeB - timeA;
    });

    const latestRun = sorted[0];
    const latestSuccess = sorted.find((r) => r.state === 'SUCCESS');

    let hoursSinceLastSuccess: number | null;
    let isStale: boolean;

    if (latestSuccess && (latestSuccess.finishedAt || latestSuccess.startedAt)) {
      const successTime = new Date(latestSuccess.finishedAt || latestSuccess.startedAt!).getTime();
      const diffMs = Math.max(0, now.getTime() - successTime);
      hoursSinceLastSuccess = Math.round((diffMs / (1000 * 60 * 60)) * 10) / 10;
      isStale = hoursSinceLastSuccess > thresholdHours;
    } else {
      // Never had a successful run
      isStale = true;
      hoursSinceLastSuccess = null;
    }

    if (isStale) {
      staleDags.push(dagId);
    }

    let status: HealthStatus = 'HEALTHY';
    let tone: HealthTone = 'success';
    let messageKey = 'admin:health.status_healthy';

    if (latestRun.state === 'FAILED') {
      status = 'CRITICAL';
      tone = 'danger';
      messageKey = 'admin:health.status_failed';
      hasCritical = true;
    } else if (isStale) {
      status = 'STALE';
      tone = hoursSinceLastSuccess && hoursSinceLastSuccess > thresholdHours * 1.5 ? 'danger' : 'warning';
      messageKey = 'admin:health.status_stale';
      if (tone === 'danger') {
        hasCritical = true;
      } else {
        hasWarning = true;
      }
    } else if (latestRun.state === 'RUNNING') {
      status = 'HEALTHY';
      tone = 'neutral';
      messageKey = 'admin:health.status_running';
    } else if (latestRun.state === 'SUCCESS') {
      status = 'HEALTHY';
      tone = 'success';
      messageKey = 'admin:health.status_healthy';
    }

    dagHealth[dagId] = {
      dagId,
      schedule,
      lastRunState: latestRun.state,
      lastRunAt: latestRun.startedAt,
      lastSuccessAt: latestSuccess?.finishedAt || latestSuccess?.startedAt || null,
      hoursSinceLastSuccess,
      isStale,
      status,
      tone,
      messageKey,
    };
  }

  let overallStatus: HealthStatus = 'HEALTHY';
  let overallTone: HealthTone = 'success';

  if (hasCritical) {
    overallStatus = 'CRITICAL';
    overallTone = 'danger';
  } else if (hasWarning || staleDags.length > 0) {
    overallStatus = 'WARNING';
    overallTone = 'warning';
  }

  return {
    overallStatus,
    overallTone,
    staleDags,
    dagHealth,
  };
}

/**
 * Computes run aggregate metrics including success rate, average run duration,
 * and total records processed across ingestion tasks.
 */
export function summariseRuns(runs: PipelineRun[]): PipelineRunSummary {
  if (!Array.isArray(runs) || runs.length === 0) {
    return {
      total: 0,
      success: 0,
      failed: 0,
      running: 0,
      queued: 0,
      skipped: 0,
      successRate: 0,
      avgDurationSeconds: 0,
      totalRecordsIn: 0,
      totalRecordsOut: 0,
    };
  }

  let success = 0;
  let failed = 0;
  let running = 0;
  let queued = 0;
  let skipped = 0;
  let totalDuration = 0;
  let durationCount = 0;
  let totalRecordsIn = 0;
  let totalRecordsOut = 0;

  for (const r of runs) {
    if (r.state === 'SUCCESS') success++;
    else if (r.state === 'FAILED') failed++;
    else if (r.state === 'RUNNING') running++;
    else if (r.state === 'QUEUED') queued++;
    else if (r.state === 'SKIPPED') skipped++;

    if (typeof r.durationSeconds === 'number' && !isNaN(r.durationSeconds) && r.durationSeconds >= 0) {
      totalDuration += r.durationSeconds;
      durationCount++;
    }

    if (typeof r.recordsIn === 'number') totalRecordsIn += r.recordsIn;
    if (typeof r.recordsOut === 'number') totalRecordsOut += r.recordsOut;
  }

  const total = runs.length;
  const successRate = total > 0 ? Math.round((success / total) * 100) : 0;
  const avgDurationSeconds = durationCount > 0 ? Math.round(totalDuration / durationCount) : 0;

  return {
    total,
    success,
    failed,
    running,
    queued,
    skipped,
    successRate,
    avgDurationSeconds,
    totalRecordsIn,
    totalRecordsOut,
  };
}

/**
 * Filters audit events based on role, action, outcome, ISO date range, and free-text search.
 * Free-text search matches case-insensitively across resource and traceId.
 */
export function filterAudit(events: AuditEvent[], filters?: AuditFilters): AuditEvent[] {
  if (!Array.isArray(events)) return [];
  if (!filters) return [...events];

  let result = [...events];

  if (filters.role) {
    const roleUpper = String(filters.role).toUpperCase();
    result = result.filter((e) => e.actorRole === roleUpper);
  }

  if (filters.action) {
    const actionTerm = String(filters.action).toUpperCase();
    result = result.filter((e) => e.action.toUpperCase().includes(actionTerm));
  }

  if (filters.outcome) {
    const outcomeUpper = String(filters.outcome).toUpperCase();
    result = result.filter((e) => e.outcome === outcomeUpper);
  }

  if (filters.dateFrom) {
    const fromTime = new Date(filters.dateFrom).getTime();
    result = result.filter((e) => new Date(e.timestamp).getTime() >= fromTime);
  }

  if (filters.dateTo) {
    const toTime = new Date(filters.dateTo).getTime();
    result = result.filter((e) => new Date(e.timestamp).getTime() <= toTime);
  }

  if (filters.search) {
    const searchNormalized = normalizeSearchTerm(String(filters.search));
    result = result.filter((e) => {
      const resNorm = normalizeSearchTerm(e.resource);
      const traceNorm = normalizeSearchTerm(e.traceId);
      const actorNorm = normalizeSearchTerm(e.actorId);
      return resNorm.includes(searchNormalized) || traceNorm.includes(searchNormalized) || actorNorm.includes(searchNormalized);
    });
  }

  return result;
}

/**
 * Traverses a hierarchical taxonomy tree and resolves the path (breadcrumbs) from root to target node ID.
 * Returns empty array if target node does not exist.
 */
export function taxonomyPath(tree: TaxonomyNode[], targetId: string): TaxonomyNode[] {
  if (!Array.isArray(tree) || !targetId) return [];

  for (const node of tree) {
    if (node.id === targetId) {
      return [node];
    }

    if (node.children && node.children.length > 0) {
      const childPath = taxonomyPath(node.children, targetId);
      if (childPath.length > 0) {
        return [node, ...childPath];
      }
    }
  }

  return [];
}

/**
 * Searches a hierarchical taxonomy tree for matching nodes in English, Marathi, or Hindi.
 * Case-insensitive, and diacritics-insensitive for Latin.
 * Recursively visits all branches and returns flat array of unique matching nodes.
 */
export function searchTaxonomy(tree: TaxonomyNode[], query: string): TaxonomyNode[] {
  if (!Array.isArray(tree) || !query || query.trim() === '') {
    return [];
  }

  const normalizedQuery = normalizeSearchTerm(query);
  const matches: TaxonomyNode[] = [];
  const seenIds = new Set<string>();

  function traverse(nodes: TaxonomyNode[]) {
    for (const node of nodes) {
      const nameEnNorm = normalizeSearchTerm(node.nameEn);
      const nameMrNorm = (node.nameMr || '').trim();
      const nameHiNorm = (node.nameHi || '').trim();
      const codeNorm = (node.code || '').toLowerCase().trim();

      // Check Marathi or Hindi script match (direct substring)
      // or English Latin match (normalized diacritics and lowercase)
      const matchesEn = nameEnNorm.includes(normalizedQuery);
      const matchesMr = nameMrNorm.includes(query.trim());
      const matchesHi = nameHiNorm.includes(query.trim());
      const matchesCode = codeNorm.includes(normalizedQuery);

      if (matchesEn || matchesMr || matchesHi || matchesCode) {
        if (!seenIds.has(node.id)) {
          seenIds.add(node.id);
          matches.push(node);
        }
      }

      if (node.children && node.children.length > 0) {
        traverse(node.children);
      }
    }
  }

  traverse(tree);
  return matches;
}
