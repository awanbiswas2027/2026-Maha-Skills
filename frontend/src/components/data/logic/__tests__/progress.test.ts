import { describe, it, expect } from 'vitest';
import { progressTone, meterAria } from '../progress';

describe('progress logic', () => {
  describe('progressTone', () => {
    it('evaluates threshold boundary values per COL-03', () => {
      // Below 25% is danger
      expect(progressTone(0)).toBe('danger');
      expect(progressTone(20)).toBe('danger');
      expect(progressTone(24.9)).toBe('danger');

      // 25% to < 62% is neutral
      expect(progressTone(25)).toBe('neutral');
      expect(progressTone(40)).toBe('neutral');
      expect(progressTone(61.9)).toBe('neutral');

      // >= 62% is success (target)
      expect(progressTone(62)).toBe('success');
      expect(progressTone(85)).toBe('success');
      expect(progressTone(100)).toBe('success');
    });
  });

  describe('meterAria', () => {
    it('generates complete ARIA attributes with target label', () => {
      const aria = meterAria(62.4, 62);
      expect(aria.role).toBe('meter');
      expect(aria['aria-valuenow']).toBe(62.4);
      expect(aria['aria-valuemin']).toBe(0);
      expect(aria['aria-valuemax']).toBe(100);
      expect(aria['aria-valuetext']).toBe('62.4% (target 62%)');
    });

    it('generates ARIA attributes without target label', () => {
      const aria = meterAria(45);
      expect(aria.role).toBe('meter');
      expect(aria['aria-valuenow']).toBe(45);
      expect(aria['aria-valuemin']).toBe(0);
      expect(aria['aria-valuemax']).toBe(100);
      expect(aria['aria-valuetext']).toBe('45%');
    });

    it('supports custom max value', () => {
      const aria = meterAria(150, 100, 200);
      expect(aria['aria-valuemax']).toBe(200);
    });
  });
});
