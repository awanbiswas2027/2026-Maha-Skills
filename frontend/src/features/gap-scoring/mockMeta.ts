/**
 * MahaSkills Gap-Scoring Run Metadata Mock
 * Provides typed run metadata for state and district-level dashboards.
 */

export interface GapRunMeta {
  runId: string;
  completedAt: string;
  previousRunId: string;
  sources: string[];
  itiReporting: {
    reported: number;
    total: number;
  };
  previous: {
    netShortage: number;
    vacancies: number;
    intake: number;
    highTrades: number;
  };
}

export const SAMPLE_DATA = true;

/**
 * Synthetic metadata for Maharashtra state scope.
 * Reflects state-wide 36 districts and 417 government/private ITIs.
 * Values are realistic and non-round.
 */
export const STATE_GAP_RUN_META: GapRunMeta = {
  runId: 'RUN-2026-09-14-03',
  completedAt: '2026-09-14T04:12:38Z',
  previousRunId: 'RUN-2026-09-07-02',
  sources: [
    'NCS',
    'Private Job Portals',
    'DVET ITI Portal',
    'Maharashtra Apprenticeship Portal',
    'Employer Survey 2026',
  ],
  itiReporting: {
    reported: 384,
    total: 417,
  },
  previous: {
    netShortage: 48320,
    vacancies: 124650,
    intake: 76330,
    highTrades: 63,
  },
};

/**
 * Synthetic metadata for District 14 (Pune).
 * Matches P007 spec: 34 of 38 reporting ITIs with realistic previous run metrics.
 */
export const PUNE_GAP_RUN_META: GapRunMeta = {
  runId: 'RUN-2026-09-14-03',
  completedAt: '2026-09-14T04:12:38Z',
  previousRunId: 'RUN-2026-09-07-02',
  sources: [
    'NCS',
    'Private Job Portals',
    'DVET ITI Portal',
    'Industry Survey Q2',
  ],
  itiReporting: {
    reported: 34,
    total: 38,
  },
  previous: {
    netShortage: 5824,
    vacancies: 13940,
    intake: 8116,
    highTrades: 7,
  },
};

export const DISTRICT_GAP_RUN_META: Record<number, GapRunMeta> = {
  14: PUNE_GAP_RUN_META,
};

/**
 * Resolves run metadata for a given dashboard scope (state, district ID, or filter object).
 */
export function getGapRunMeta(scope?: unknown): GapRunMeta {
  if (scope === 14 || scope === '14') {
    return PUNE_GAP_RUN_META;
  }
  if (typeof scope === 'object' && scope !== null) {
    const obj = scope as Record<string, unknown>;
    if (obj.district_id === 14 || obj.districtId === 14 || obj.district_id === '14' || obj.districtId === '14') {
      return PUNE_GAP_RUN_META;
    }
  }
  if (typeof scope === 'number' && DISTRICT_GAP_RUN_META[scope]) {
    return DISTRICT_GAP_RUN_META[scope];
  }
  return STATE_GAP_RUN_META;
}
