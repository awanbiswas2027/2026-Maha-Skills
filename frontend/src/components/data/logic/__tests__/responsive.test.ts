import { describe, it, expect } from 'vitest';
import { shouldRenderCards, chartHeight } from '../responsive';

describe('responsive data logic', () => {
  describe('shouldRenderCards', () => {
    it('evaluates viewport threshold at 767px vs 768px (TBL-21)', () => {
      // At 767px (< 768) with card renderer, switch to cards
      expect(shouldRenderCards(767, true)).toBe(true);

      // At 768px (>= 768) with card renderer, keep table
      expect(shouldRenderCards(768, true)).toBe(false);

      // Without card renderer, never switch to cards
      expect(shouldRenderCards(767, false)).toBe(false);
      expect(shouldRenderCards(768, false)).toBe(false);

      // Common mobile and tablet viewports
      expect(shouldRenderCards(360, true)).toBe(true);
      expect(shouldRenderCards(1024, true)).toBe(false);
      expect(shouldRenderCards(1366, true)).toBe(false);
    });
  });

  describe('chartHeight', () => {
    it('returns 240px below 768px for all variants', () => {
      expect(chartHeight(360, 'default')).toBe(240);
      expect(chartHeight(360, 'lead')).toBe(240);
      expect(chartHeight(767, 'default')).toBe(240);
      expect(chartHeight(767, 'lead')).toBe(240);
    });

    it('returns 280px for default variant at 768px and above', () => {
      expect(chartHeight(768, 'default')).toBe(280);
      expect(chartHeight(1024, 'default')).toBe(280);
      expect(chartHeight(1366, 'default')).toBe(280);
      expect(chartHeight(1440)).toBe(280); // defaults to 'default'
    });

    it('returns 360px for lead variant at 768px and above', () => {
      expect(chartHeight(768, 'lead')).toBe(360);
      expect(chartHeight(1024, 'lead')).toBe(360);
      expect(chartHeight(1366, 'lead')).toBe(360);
    });
  });
});
