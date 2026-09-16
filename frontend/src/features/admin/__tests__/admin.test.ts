/**
 * MahaSkills — Admin Console Logic & Validation Test Suite
 * Problem Statement ID: 26134
 *
 * Tests Airflow pipeline SLA health monitoring (26h nightly, 8d weekly),
 * execution summary aggregations, DPDP-compliant audit log filtering,
 * taxonomy breadcrumb path resolution, bilingual taxonomy search, and Zod schemas.
 */

import { describe, it, expect } from 'vitest';
import {
  pipelineHealth,
  summariseRuns,
  filterAudit,
  taxonomyPath,
  searchTaxonomy,
  inferDagSchedule,
  getScheduleStalenessHours,
  normalizeSearchTerm,
} from '../logic';
import {
  pipelineRunSchema,
  auditEventSchema,
  taxonomyNodeSchema,
  auditFilterSchema,
} from '../schemas';
import {
  MOCK_PIPELINE_RUNS,
  MOCK_AUDIT_EVENTS,
  MOCK_TAXONOMY_TREE,
} from '../fixtures';
import type { PipelineRun } from '../model';

describe('Search Normalization & Diacritics Utility', () => {
  it('strips Latin diacritics and converts to lowercase', () => {
    expect(normalizeSearchTerm('Crème Brûlée')).toBe('creme brulee');
    expect(normalizeSearchTerm('  RÉACT  ')).toBe('react');
    expect(normalizeSearchTerm('')).toBe('');
  });
});

describe('Airflow Pipeline Health & SLA Calculation', () => {
  it('correctly infers DAG schedules from naming patterns', () => {
    expect(inferDagSchedule('lmi_nightly_job_scraping')).toBe('nightly');
    expect(inferDagSchedule('dag_daily_ncs_scrape')).toBe('nightly');
    expect(inferDagSchedule('weekly_gap_score_computation')).toBe('weekly');
    expect(inferDagSchedule('recommendation_trigger_audit')).toBe('weekly');
    expect(inferDagSchedule('dag_nsdc_taxonomy_sync')).toBe('monthly');
  });

  it('provides correct SLA staleness thresholds in hours', () => {
    expect(getScheduleStalenessHours('nightly')).toBe(26);
    expect(getScheduleStalenessHours('weekly')).toBe(192); // 8 days
    expect(getScheduleStalenessHours('monthly')).toBe(768); // 32 days
  });

  it('handles empty runs array safely', () => {
    const health = pipelineHealth([]);
    expect(health.overallStatus).toBe('UNKNOWN');
    expect(health.overallTone).toBe('neutral');
    expect(health.staleDags).toEqual([]);
    expect(health.dagHealth).toEqual({});
  });

  it('evaluates nightly DAG as HEALTHY when last success is within 26 hours', () => {
    const now = new Date('2026-08-18T10:00:00Z');
    const runs: PipelineRun[] = [
      {
        dagId: 'lmi_nightly_job_scraping',
        runId: 'run_001',
        state: 'SUCCESS',
        startedAt: '2026-08-18T02:00:00Z',
        finishedAt: '2026-08-18T02:40:00Z', // 7.3 hours ago (< 26h)
        durationSeconds: 2400,
        recordsIn: 1000,
        recordsOut: 1000,
        errorSummary: null,
      },
    ];

    const health = pipelineHealth(runs, now);
    const dag = health.dagHealth['lmi_nightly_job_scraping'];

    expect(dag.isStale).toBe(false);
    expect(dag.status).toBe('HEALTHY');
    expect(dag.tone).toBe('success');
    expect(dag.hoursSinceLastSuccess).toBe(7.3);
    expect(health.overallStatus).toBe('HEALTHY');
    expect(health.overallTone).toBe('success');
  });

  it('flags nightly DAG as STALE when last success is older than 26 hours', () => {
    const now = new Date('2026-08-18T10:00:00Z');
    const runs: PipelineRun[] = [
      {
        dagId: 'lmi_nightly_job_scraping',
        runId: 'run_old',
        state: 'SUCCESS',
        startedAt: '2026-08-16T02:00:00Z',
        finishedAt: '2026-08-16T02:40:00Z', // ~55 hours ago (> 26h and > 1.5x)
        durationSeconds: 2400,
        recordsIn: 1000,
        recordsOut: 1000,
        errorSummary: null,
      },
    ];

    const health = pipelineHealth(runs, now);
    const dag = health.dagHealth['lmi_nightly_job_scraping'];

    expect(dag.isStale).toBe(true);
    expect(dag.status).toBe('STALE');
    expect(dag.tone).toBe('danger'); // > 1.5x threshold
    expect(health.staleDags).toContain('lmi_nightly_job_scraping');
    expect(health.overallStatus).toBe('CRITICAL');
  });

  it('evaluates weekly DAG as HEALTHY within 8 days and STALE after 8 days', () => {
    const now = new Date('2026-08-20T10:00:00Z');
    // Run 5 days ago (120h ago <= 192h threshold)
    const freshWeeklyRun: PipelineRun[] = [
      {
        dagId: 'weekly_gap_score_computation',
        runId: 'run_gap_01',
        state: 'SUCCESS',
        startedAt: '2026-08-15T01:00:00Z',
        finishedAt: '2026-08-15T02:00:00Z',
        durationSeconds: 3600,
        recordsIn: 36,
        recordsOut: 36,
        errorSummary: null,
      },
    ];

    const freshHealth = pipelineHealth(freshWeeklyRun, now);
    expect(freshHealth.dagHealth['weekly_gap_score_computation'].isStale).toBe(false);
    expect(freshHealth.dagHealth['weekly_gap_score_computation'].status).toBe('HEALTHY');

    // Run 10 days ago (240h ago > 192h threshold)
    const staleWeeklyRun: PipelineRun[] = [
      {
        dagId: 'weekly_gap_score_computation',
        runId: 'run_gap_02',
        state: 'SUCCESS',
        startedAt: '2026-08-10T01:00:00Z',
        finishedAt: '2026-08-10T02:00:00Z',
        durationSeconds: 3600,
        recordsIn: 36,
        recordsOut: 36,
        errorSummary: null,
      },
    ];

    const staleHealth = pipelineHealth(staleWeeklyRun, now);
    expect(staleHealth.dagHealth['weekly_gap_score_computation'].isStale).toBe(true);
    expect(staleHealth.dagHealth['weekly_gap_score_computation'].status).toBe('STALE');
    expect(staleHealth.staleDags).toContain('weekly_gap_score_computation');
  });

  it('marks DAG as CRITICAL with danger tone if latest run failed', () => {
    const now = new Date('2026-08-18T10:00:00Z');
    const runs: PipelineRun[] = [
      {
        dagId: 'dag_ncs_sync',
        runId: 'run_ncs_fail',
        state: 'FAILED',
        startedAt: '2026-08-18T03:30:00Z',
        finishedAt: '2026-08-18T03:35:00Z',
        durationSeconds: 300,
        recordsIn: 500,
        recordsOut: 0,
        errorSummary: 'Gateway Timeout',
      },
      {
        dagId: 'dag_ncs_sync',
        runId: 'run_ncs_ok',
        state: 'SUCCESS',
        startedAt: '2026-08-17T03:30:00Z',
        finishedAt: '2026-08-17T03:45:00Z',
        durationSeconds: 900,
        recordsIn: 500,
        recordsOut: 500,
        errorSummary: null,
      },
    ];

    const health = pipelineHealth(runs, now);
    const dag = health.dagHealth['dag_ncs_sync'];

    expect(dag.status).toBe('CRITICAL');
    expect(dag.tone).toBe('danger');
    expect(health.overallStatus).toBe('CRITICAL');
    expect(health.overallTone).toBe('danger');
  });
});

describe('Pipeline Run Summary Statistics', () => {
  it('aggregates counts, success rate, and duration from runs', () => {
    const summary = summariseRuns(MOCK_PIPELINE_RUNS);

    expect(summary.total).toBe(6);
    expect(summary.success).toBe(5);
    expect(summary.failed).toBe(1);
    expect(summary.running).toBe(0);
    expect(summary.queued).toBe(0);
    expect(summary.skipped).toBe(0);
    // 5 out of 6 is ~83%
    expect(summary.successRate).toBe(83);
    expect(summary.avgDurationSeconds).toBeGreaterThan(0);
    expect(summary.totalRecordsIn).toBe(54200 + 52100 + 36 + 182 + 12000 + 4200);
  });

  it('handles empty run list safely', () => {
    const emptySummary = summariseRuns([]);
    expect(emptySummary.total).toBe(0);
    expect(emptySummary.successRate).toBe(0);
    expect(emptySummary.avgDurationSeconds).toBe(0);
    expect(emptySummary.totalRecordsIn).toBe(0);
  });
});

describe('Audit Event Filtering & DPDP Compliance', () => {
  it('confirms all mock audit events are DPDP Act 2023 compliant (zero raw candidate PII)', () => {
    for (const evt of MOCK_AUDIT_EVENTS) {
      expect(evt.actorRole).toBeDefined();
      expect(evt.actorId).toBeDefined();
      // Actor ID must be pseudonymous (e.g. prefix usr_ or sys_)
      expect(evt.actorId).toMatch(/^(usr|sys)_/);
      // Ensure no candidate roll numbers or 10-digit phone numbers
      expect(evt.actorId).not.toMatch(/^\d{10}$/);
      expect(evt.resource).not.toMatch(/^\d{10}$/);
      expect(evt.traceId).toBeDefined();
    }
  });

  it('filters audit events by actor role', () => {
    const adminEvents = filterAudit(MOCK_AUDIT_EVENTS, { role: 'ADMIN' });
    expect(adminEvents.length).toBeGreaterThan(0);
    expect(adminEvents.every((e) => e.actorRole === 'ADMIN')).toBe(true);

    const dpoEvents = filterAudit(MOCK_AUDIT_EVENTS, { role: 'DISTRICT_OFFICER' });
    expect(dpoEvents.length).toBe(1);
    expect(dpoEvents[0].actorRole).toBe('DISTRICT_OFFICER');
  });

  it('filters audit events by action and outcome', () => {
    const approves = filterAudit(MOCK_AUDIT_EVENTS, { action: 'RECOMMENDATION_APPROVE' });
    expect(approves).toHaveLength(1);
    expect(approves[0].action).toBe('RECOMMENDATION_APPROVE');

    const denied = filterAudit(MOCK_AUDIT_EVENTS, { outcome: 'DENIED' });
    expect(denied).toHaveLength(1);
    expect(denied[0].outcome).toBe('DENIED');
  });

  it('filters audit events by date range', () => {
    const filtered = filterAudit(MOCK_AUDIT_EVENTS, {
      dateFrom: '2026-08-18T00:00:00Z',
      dateTo: '2026-08-18T23:59:59Z',
    });
    expect(filtered.length).toBe(3);
    expect(filtered.every((e) => e.timestamp.startsWith('2026-08-18'))).toBe(true);
  });

  it('searches case-insensitively across resource, traceId, and actorId', () => {
    const searchRes = filterAudit(MOCK_AUDIT_EVENTS, { search: 'solid_state' });
    expect(searchRes).toHaveLength(1);
    expect(searchRes[0].resource).toContain('sk_solid_state_battery');

    const searchTrace = filterAudit(MOCK_AUDIT_EVENTS, { search: '01J9AUDIT002B' });
    expect(searchTrace).toHaveLength(1);
    expect(searchTrace[0].id).toBe('aud_evt_002');
  });
});

describe('Taxonomy Tree Path Resolution', () => {
  it('resolves the full hierarchical breadcrumb path from Sector down to Skill', () => {
    const path = taxonomyPath(MOCK_TAXONOMY_TREE, 'sk_solid_state_testing');
    expect(path).toHaveLength(4);

    expect(path[0].id).toBe('sec_auto');
    expect(path[0].level).toBe('sector');

    expect(path[1].id).toBe('ssc_asdc');
    expect(path[1].level).toBe('ssc');

    expect(path[2].id).toBe('role_ev_technician');
    expect(path[2].level).toBe('job_role');

    expect(path[3].id).toBe('sk_solid_state_testing');
    expect(path[3].level).toBe('skill');
    expect(path[3].isEmerging).toBe(true);
  });

  it('resolves path for root sector node', () => {
    const path = taxonomyPath(MOCK_TAXONOMY_TREE, 'sec_ites');
    expect(path).toHaveLength(1);
    expect(path[0].id).toBe('sec_ites');
  });

  it('returns empty array when target ID is not present in tree', () => {
    const path = taxonomyPath(MOCK_TAXONOMY_TREE, 'non_existent_node');
    expect(path).toEqual([]);
  });
});

describe('Bilingual & Diacritics-Insensitive Taxonomy Search', () => {
  it('searches taxonomy nodes in English', () => {
    const results = searchTaxonomy(MOCK_TAXONOMY_TREE, 'Powertrain');
    expect(results.length).toBeGreaterThan(0);
    expect(results[0].id).toBe('role_ev_technician');
  });

  it('searches taxonomy nodes in Marathi Devanagari script', () => {
    const results = searchTaxonomy(MOCK_TAXONOMY_TREE, 'वाहन');
    expect(results.length).toBeGreaterThan(0);
    expect(results.some((n) => n.id === 'sec_auto')).toBe(true);

    const skillResults = searchTaxonomy(MOCK_TAXONOMY_TREE, 'बॅटरी');
    expect(skillResults.length).toBeGreaterThan(0);
  });

  it('performs diacritics-insensitive search on Latin strings', () => {
    // Search with diacritics "tésting" should match "Testing"
    const results = searchTaxonomy(MOCK_TAXONOMY_TREE, 'tésting');
    expect(results.length).toBeGreaterThan(0);
    expect(results.some((n) => n.id === 'sk_solid_state_testing')).toBe(true);
  });

  it('searches by Qualification Pack / National Occupational Standard code', () => {
    const results = searchTaxonomy(MOCK_TAXONOMY_TREE, 'ASC/Q1402');
    expect(results).toHaveLength(1);
    expect(results[0].id).toBe('role_ev_technician');
  });

  it('correctly flags emerging skills in search results', () => {
    const results = searchTaxonomy(MOCK_TAXONOMY_TREE, 'Edge AI');
    expect(results).toHaveLength(1);
    expect(results[0].id).toBe('sk_edge_ai_optimization');
    expect(results[0].isEmerging).toBe(true);
  });

  it('returns empty array on blank query', () => {
    expect(searchTaxonomy(MOCK_TAXONOMY_TREE, '')).toEqual([]);
    expect(searchTaxonomy(MOCK_TAXONOMY_TREE, '   ')).toEqual([]);
  });
});

describe('Admin Zod Validation Schemas', () => {
  it('pipelineRunSchema validates valid run records', () => {
    const run = MOCK_PIPELINE_RUNS[0];
    const parsed = pipelineRunSchema.parse(run);
    expect(parsed.dagId).toBe(run.dagId);
    expect(parsed.state).toBe('SUCCESS');
  });

  it('auditEventSchema validates DPDP-compliant audit events', () => {
    const evt = MOCK_AUDIT_EVENTS[0];
    const parsed = auditEventSchema.parse(evt);
    expect(parsed.id).toBe(evt.id);
    expect(parsed.actorRole).toBe('ADMIN');
  });

  it('taxonomyNodeSchema validates recursive node trees', () => {
    const sector = MOCK_TAXONOMY_TREE[0];
    const parsed = taxonomyNodeSchema.parse(sector);
    expect(parsed.id).toBe('sec_auto');
    expect(parsed.children).toBeDefined();
    expect(parsed.children!.length).toBeGreaterThan(0);
  });

  it('auditFilterSchema validates filter payloads', () => {
    const filters = {
      role: 'ADMIN',
      outcome: 'SUCCESS',
      search: 'audit',
    };
    const parsed = auditFilterSchema.parse(filters);
    expect(parsed.role).toBe('ADMIN');
  });
});
