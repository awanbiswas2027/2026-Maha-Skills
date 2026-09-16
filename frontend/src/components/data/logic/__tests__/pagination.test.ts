import { describe, it, expect } from 'vitest';
import { PAGE_SIZES, pageRange, clampPage } from '../pagination';

describe('pagination logic', () => {
  it('defines allowed PAGE_SIZES matching uiux TBL-11', () => {
    expect(PAGE_SIZES).toEqual([25, 50, 100]);
  });

  describe('pageRange', () => {
    it('returns from=0, to=0 when total is 0', () => {
      const result = pageRange(1, 25, 0);
      expect(result).toEqual({ from: 0, to: 0, total: 0 });
    });

    it('returns from=0, to=0 when total is negative', () => {
      const result = pageRange(1, 25, -5);
      expect(result).toEqual({ from: 0, to: 0, total: 0 });
    });

    it('calculates range for first page', () => {
      const result = pageRange(1, 25, 214);
      expect(result).toEqual({ from: 1, to: 25, total: 214 });
    });

    it('calculates range for middle page', () => {
      const result = pageRange(2, 25, 214);
      expect(result).toEqual({ from: 26, to: 50, total: 214 });
    });

    it('calculates range for last page with remainder', () => {
      // 214 total with page size 25 -> 9th page has 201 to 214
      const result = pageRange(9, 25, 214);
      expect(result).toEqual({ from: 201, to: 214, total: 214 });
    });

    it('caps from and to to total when page exceeds bounds', () => {
      const result = pageRange(99, 25, 214);
      expect(result).toEqual({ from: 214, to: 214, total: 214 });
    });

    it('handles custom page sizes (e.g. 50, 100)', () => {
      expect(pageRange(1, 50, 120)).toEqual({ from: 1, to: 50, total: 120 });
      expect(pageRange(3, 50, 120)).toEqual({ from: 101, to: 120, total: 120 });
    });
  });

  describe('clampPage', () => {
    it('clamps page with explicit totalPages', () => {
      expect(clampPage(0, 10)).toBe(1);
      expect(clampPage(5, 10)).toBe(5);
      expect(clampPage(15, 10)).toBe(10);
      expect(clampPage(-1, 5)).toBe(1);
    });

    it('calculates totalPages and clamps with (page, size, total)', () => {
      // 214 total with size 25 = 9 pages
      expect(clampPage(1, 25, 214)).toBe(1);
      expect(clampPage(9, 25, 214)).toBe(9);
      expect(clampPage(15, 25, 214)).toBe(9);
      expect(clampPage(0, 25, 214)).toBe(1);
    });

    it('handles total = 0 gracefully', () => {
      expect(clampPage(1, 25, 0)).toBe(1);
      expect(clampPage(5, 25, 0)).toBe(1);
    });
  });
});
