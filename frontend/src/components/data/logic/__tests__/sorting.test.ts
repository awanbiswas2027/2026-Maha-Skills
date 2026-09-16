import { describe, it, expect } from 'vitest';
import { nextSort, ariaSort } from '../sorting';

describe('sorting logic', () => {
  describe('nextSort', () => {
    it('cycles numeric columns: desc -> asc -> none', () => {
      // none -> desc
      expect(nextSort(null, 'numeric')).toBe('desc');
      expect(nextSort(undefined, 'numeric')).toBe('desc');
      expect(nextSort('none', 'numeric')).toBe('desc');

      // desc -> asc
      expect(nextSort('desc', 'numeric')).toBe('asc');

      // asc -> none (null)
      expect(nextSort('asc', 'numeric')).toBeNull();
    });

    it('cycles text columns: asc -> desc -> none', () => {
      // none -> asc
      expect(nextSort(null, 'text')).toBe('asc');
      expect(nextSort(undefined, 'text')).toBe('asc');
      expect(nextSort('none', 'text')).toBe('asc');

      // asc -> desc
      expect(nextSort('asc', 'text')).toBe('desc');

      // desc -> none (null)
      expect(nextSort('desc', 'text')).toBeNull();
    });

    it('handles object input with desc boolean flag', () => {
      expect(nextSort({ desc: true }, 'numeric')).toBe('asc');
      expect(nextSort({ desc: false }, 'numeric')).toBeNull();
      expect(nextSort({ desc: false }, 'text')).toBe('desc');
      expect(nextSort({ desc: true }, 'text')).toBeNull();
    });
  });

  describe('ariaSort', () => {
    it('maps sort values to ARIA attribute strings', () => {
      expect(ariaSort('asc')).toBe('ascending');
      expect(ariaSort('desc')).toBe('descending');
      expect(ariaSort(null)).toBe('none');
      expect(ariaSort(undefined)).toBe('none');
      expect(ariaSort('none')).toBe('none');
    });

    it('maps object inputs with desc property', () => {
      expect(ariaSort({ desc: true })).toBe('descending');
      expect(ariaSort({ desc: false })).toBe('ascending');
    });
  });
});
