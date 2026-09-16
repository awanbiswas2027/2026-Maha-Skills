import { describe, it, expect } from 'vitest';
import type { TFunction } from 'i18next';
import {
  formatNumber,
  formatPercent,
  formatCurrencyInr,
  formatLakh,
  formatScore,
  formatDelta,
  formatDate,
} from '../format';

describe('format library (NUM-01..08)', () => {
  describe('formatNumber', () => {
    it('formats numbers with Indian grouping in en, mr, and hi using Latin digits', () => {
      expect(formatNumber(123456, 'en')).toBe('1,23,456');
      expect(formatNumber(123456, 'mr')).toBe('1,23,456');
      expect(formatNumber(123456, 'hi')).toBe('1,23,456');
    });

    it('returns null for null, undefined, and NaN inputs', () => {
      expect(formatNumber(null, 'en')).toBeNull();
      expect(formatNumber(undefined, 'en')).toBeNull();
      expect(formatNumber(NaN, 'en')).toBeNull();
    });
  });

  describe('formatPercent', () => {
    it('formats percentages with specified decimals', () => {
      expect(formatPercent(62, 'en')).toBe('62%');
      expect(formatPercent(62.45, 'en', { decimals: 1 })).toBe('62.5%');
      expect(formatPercent(62.45, 'en', { decimals: 0 })).toBe('62%');
    });

    it('returns null on invalid input', () => {
      expect(formatPercent(null, 'en')).toBeNull();
      expect(formatPercent(NaN, 'en')).toBeNull();
    });
  });

  describe('formatCurrencyInr', () => {
    it('formats currency without fraction digits', () => {
      const formatted = formatCurrencyInr(18500, 'en');
      expect(formatted).toContain('18,500');
      expect(formatted).toContain('₹');
    });

    it('appends per-month suffix when requested', () => {
      const mockT = ((key: string) =>
        key === 'format.per_month' ? '/ month' : key) as unknown as TFunction;
      const formatted = formatCurrencyInr(18500, 'en', { perMonth: true }, mockT);
      expect(formatted).toContain('18,500');
      expect(formatted).toContain('/ month');
    });

    it('returns null on invalid input', () => {
      expect(formatCurrencyInr(null, 'en')).toBeNull();
    });
  });

  describe('formatLakh', () => {
    it('formats lakh and crore thresholds', () => {
      const mockT = ((key: string) => {
        if (key === 'format.lakh') return 'lakh';
        if (key === 'format.crore') return 'crore';
        return key;
      }) as unknown as TFunction;

      expect(formatLakh(240000, 'en', mockT)).toBe('2.4 lakh');
      expect(formatLakh(15000000, 'en', mockT)).toBe('1.5 crore');
      expect(formatLakh(50000, 'en', mockT)).toBe('50,000');
    });

    it('handles negative lakh values using U+2212 minus', () => {
      const mockT = ((key: string) =>
        key === 'format.lakh' ? 'lakh' : key) as unknown as TFunction;
      expect(formatLakh(-240000, 'en', mockT)).toBe('\u22122.4 lakh');
    });

    it('returns null on invalid input', () => {
      expect(formatLakh(null, 'en')).toBeNull();
    });
  });

  describe('formatScore', () => {
    it('clamps scores between 0 and 100 as an integer string', () => {
      expect(formatScore(81.4)).toBe('81');
      expect(formatScore(81.6)).toBe('82');
      expect(formatScore(-5)).toBe('0');
      expect(formatScore(120)).toBe('100');
    });

    it('returns null on invalid input', () => {
      expect(formatScore(null)).toBeNull();
      expect(formatScore(NaN)).toBeNull();
    });
  });

  describe('formatDelta', () => {
    it('formats positive and negative deltas with U+2212 for negative', () => {
      expect(formatDelta(15, 'en')).toBe('+15');
      expect(formatDelta(-8, 'en')).toBe('\u22128');
      expect(formatDelta(0, 'en')).toBe('0');
    });

    it('returns null on invalid input', () => {
      expect(formatDelta(null, 'en')).toBeNull();
    });
  });

  describe('formatDate', () => {
    it('formats date to day, short month, year in Latin digits', () => {
      const d = new Date('2026-09-17T00:00:00Z');
      const formatted = formatDate(d, 'en');
      expect(formatted).toBeTruthy();
      expect(formatted).toContain('2026');
    });

    it('returns null for invalid dates', () => {
      expect(formatDate(null, 'en')).toBeNull();
      expect(formatDate('invalid-date', 'en')).toBeNull();
    });
  });
});
