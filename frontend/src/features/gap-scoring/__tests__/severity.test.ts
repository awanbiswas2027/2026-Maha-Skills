import { describe, it, expect, vi } from 'vitest';
import {
  severityFromScore,
  toGapSeverity,
  SEVERITY_ORDER,
  severityGlyph,
  severityLabelKey,
} from '../severity';

describe('Gap Severity Logic (Slice 1B)', () => {
  describe('severityFromScore thresholds (0 / 39 / 40 / 59 / 60 / 100)', () => {
    it('maps 0 to LOW', () => {
      expect(severityFromScore(0)).toBe('LOW');
    });

    it('maps 39 to LOW', () => {
      expect(severityFromScore(39)).toBe('LOW');
    });

    it('maps boundary decimals below 40 to LOW', () => {
      expect(severityFromScore(39.99)).toBe('LOW');
    });

    it('maps 40 to MEDIUM', () => {
      expect(severityFromScore(40)).toBe('MEDIUM');
    });

    it('maps 59 to MEDIUM', () => {
      expect(severityFromScore(59)).toBe('MEDIUM');
    });

    it('maps boundary decimals below 60 to MEDIUM', () => {
      expect(severityFromScore(59.99)).toBe('MEDIUM');
    });

    it('maps 60 to HIGH', () => {
      expect(severityFromScore(60)).toBe('HIGH');
    });

    it('maps 100 to HIGH', () => {
      expect(severityFromScore(100)).toBe('HIGH');
    });

    it('handles out of bounds numbers correctly', () => {
      expect(severityFromScore(-10)).toBe('LOW');
      expect(severityFromScore(125)).toBe('HIGH');
    });

    it('throws TypeError in dev environment when passed NaN', () => {
      expect(() => severityFromScore(NaN)).toThrow(TypeError);
    });

    it('throws TypeError in dev environment when passed non-number', () => {
      // @ts-expect-error testing invalid argument type
      expect(() => severityFromScore('invalid')).toThrow(TypeError);
    });
  });

  describe('toGapSeverity legacy mapping table', () => {
    it('maps LOW -> LOW', () => {
      expect(toGapSeverity('LOW')).toBe('LOW');
    });

    it('maps MODERATE -> MEDIUM', () => {
      expect(toGapSeverity('MODERATE')).toBe('MEDIUM');
    });

    it('maps MEDIUM -> MEDIUM', () => {
      expect(toGapSeverity('MEDIUM')).toBe('MEDIUM');
    });

    it('maps HIGH -> HIGH', () => {
      expect(toGapSeverity('HIGH')).toBe('HIGH');
    });

    it('maps CRITICAL -> HIGH', () => {
      expect(toGapSeverity('CRITICAL')).toBe('HIGH');
    });

    it('handles case-insensitivity and leading/trailing whitespace', () => {
      expect(toGapSeverity('critical')).toBe('HIGH');
      expect(toGapSeverity('  moderate  ')).toBe('MEDIUM');
      expect(toGapSeverity('low')).toBe('LOW');
      expect(toGapSeverity('high')).toBe('HIGH');
    });
  });

  describe('toGapSeverity unknown values', () => {
    it('derives from score argument when raw string is unknown', () => {
      expect(toGapSeverity('UNKNOWN', 75)).toBe('HIGH');
      expect(toGapSeverity('CUSTOM', 45)).toBe('MEDIUM');
      expect(toGapSeverity('OTHER', 20)).toBe('LOW');
    });

    it('defaults to LOW and warns in dev when raw is unknown and no score given', () => {
      const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
      const result = toGapSeverity('UNRECOGNIZED_LEVEL');
      expect(result).toBe('LOW');
      expect(warnSpy).toHaveBeenCalledWith(
        expect.stringContaining('[toGapSeverity] Unknown severity value "UNRECOGNIZED_LEVEL"')
      );
      warnSpy.mockRestore();
    });
  });

  describe('SEVERITY_ORDER', () => {
    it('exports the canonical 3-level order [LOW, MEDIUM, HIGH]', () => {
      expect(SEVERITY_ORDER).toEqual(['LOW', 'MEDIUM', 'HIGH']);
    });
  });

  describe('severityGlyph per GAP-01', () => {
    it('returns null for LOW', () => {
      expect(severityGlyph('LOW')).toBeNull();
    });

    it('returns TriangleAlert for MEDIUM', () => {
      expect(severityGlyph('MEDIUM')).toBe('TriangleAlert');
    });

    it('returns OctagonAlert for HIGH', () => {
      expect(severityGlyph('HIGH')).toBe('OctagonAlert');
    });
  });

  describe('severityLabelKey', () => {
    it('returns gap:severity.low for LOW', () => {
      expect(severityLabelKey('LOW')).toBe('gap:severity.low');
    });

    it('returns gap:severity.medium for MEDIUM', () => {
      expect(severityLabelKey('MEDIUM')).toBe('gap:severity.medium');
    });

    it('returns gap:severity.high for HIGH', () => {
      expect(severityLabelKey('HIGH')).toBe('gap:severity.high');
    });
  });
});
