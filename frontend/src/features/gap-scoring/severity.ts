/**
 * MahaSkills Gap-Scoring Severity Module
 * Enforces 3-level gap severity ('LOW' | 'MEDIUM' | 'HIGH') per PRD & backend alignment.
 */

export type GapSeverity = 'LOW' | 'MEDIUM' | 'HIGH';

export const SEVERITY_ORDER: readonly GapSeverity[] = ['LOW', 'MEDIUM', 'HIGH'] as const;

/**
 * Maps a numeric gap score (0.0 to 100.0) to a 3-level GapSeverity:
 * - score < 40: 'LOW'
 * - 40 <= score < 60 (40 to 59): 'MEDIUM'
 * - score >= 60: 'HIGH'
 *
 * In development (import.meta.env.DEV), passing NaN or a non-number throws a TypeError.
 * In production, invalid or non-numeric scores safely return 'LOW'.
 */
export function severityFromScore(score: number): GapSeverity {
  if (typeof score !== 'number' || Number.isNaN(score)) {
    if (import.meta.env?.DEV) {
      throw new TypeError(`[severityFromScore] Invalid score: ${score}. Expected a valid number.`);
    }
    return 'LOW';
  }

  if (score < 40) {
    return 'LOW';
  }
  if (score < 60) {
    return 'MEDIUM';
  }
  return 'HIGH';
}

/**
 * Maps legacy 4-level or raw severity strings to canonical 3-level GapSeverity.
 * - 'LOW' -> 'LOW'
 * - 'MODERATE' | 'MEDIUM' -> 'MEDIUM'
 * - 'HIGH' | 'CRITICAL' -> 'HIGH'
 * - unknown -> derives from `score` argument if provided; otherwise defaults to 'LOW'
 *   with a console.warn in development.
 */
export function toGapSeverity(raw: string, score?: number): GapSeverity {
  const normalized = typeof raw === 'string' ? raw.trim().toUpperCase() : '';

  switch (normalized) {
    case 'LOW':
      return 'LOW';
    case 'MODERATE':
    case 'MEDIUM':
      return 'MEDIUM';
    case 'HIGH':
    case 'CRITICAL':
      return 'HIGH';
    default:
      if (typeof score === 'number' && !Number.isNaN(score)) {
        return severityFromScore(score);
      }
      if (import.meta.env?.DEV) {
        console.warn(`[toGapSeverity] Unknown severity value "${raw}", defaulting to LOW.`);
      }
      return 'LOW';
  }
}

/**
 * Returns the Lucide icon name string per GAP-01:
 * - 'LOW' -> null (no alert icon)
 * - 'MEDIUM' -> 'TriangleAlert'
 * - 'HIGH' -> 'OctagonAlert'
 */
export function severityGlyph(sev: GapSeverity): 'TriangleAlert' | 'OctagonAlert' | null {
  switch (sev) {
    case 'LOW':
      return null;
    case 'MEDIUM':
      return 'TriangleAlert';
    case 'HIGH':
      return 'OctagonAlert';
  }
}

/**
 * Returns the i18n translation key for a severity level.
 * Formatted with the gap namespace: 'gap:severity.low' etc.
 */
export function severityLabelKey(sev: GapSeverity): string {
  switch (sev) {
    case 'LOW':
      return 'gap:severity.low';
    case 'MEDIUM':
      return 'gap:severity.medium';
    case 'HIGH':
      return 'gap:severity.high';
  }
}
