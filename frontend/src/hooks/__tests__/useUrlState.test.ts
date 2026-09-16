import { describe, it, expect } from 'vitest';
import { z } from 'zod';
import { parseSearch, serializeState } from '../useUrlState';

describe('useUrlState pure helpers', () => {
  const schema = z.object({
    page: z.number().int().min(1),
    sort: z.enum(['asc', 'desc']).nullable(),
    search: z.string(),
    sectors: z.array(z.string()),
    active: z.boolean(),
  });

  type State = z.infer<typeof schema>;

  const defaults: State = {
    page: 1,
    sort: null,
    search: '',
    sectors: [],
    active: false,
  };

  describe('parseSearch', () => {
    it('returns defaults when search params are empty', () => {
      const parsed = parseSearch(schema, defaults, '');
      expect(parsed).toEqual(defaults);
    });

    it('parses valid search params into typed state', () => {
      const query = '?page=3&sort=desc&search=welder&sectors=automotive,manufacturing&active=true';
      const parsed = parseSearch(schema, defaults, query);

      expect(parsed.page).toBe(3);
      expect(parsed.sort).toBe('desc');
      expect(parsed.search).toBe('welder');
      expect(parsed.sectors).toEqual(['automotive', 'manufacturing']);
      expect(parsed.active).toBe(true);
    });

    it('handles per-key fallback when a parameter is invalid', () => {
      // page is not a valid int, sort is invalid enum, but search is valid
      const query = '?page=invalid_number&sort=invalid_sort&search=it_trade';
      const parsed = parseSearch(schema, defaults, query);

      expect(parsed.page).toBe(1); // fallback to default
      expect(parsed.sort).toBeNull(); // fallback to default
      expect(parsed.search).toBe('it_trade'); // preserved valid value
      expect(parsed.sectors).toEqual([]);
      expect(parsed.active).toBe(false);
    });

    it('parses empty array parameter as empty array', () => {
      const query = '?sectors=';
      const parsed = parseSearch(schema, defaults, query);
      expect(parsed.sectors).toEqual([]);
    });

    it('handles URLSearchParams object input', () => {
      const params = new URLSearchParams('page=2&active=1');
      const parsed = parseSearch(schema, defaults, params);
      expect(parsed.page).toBe(2);
      expect(parsed.active).toBe(true);
    });
  });

  describe('serializeState', () => {
    it('omits default values from the serialized URL', () => {
      const state: State = { ...defaults };
      const serialized = serializeState(state, defaults);
      expect(serialized.toString()).toBe('');
    });

    it('serializes arrays as comma lists and primitives as strings', () => {
      const state: State = {
        ...defaults,
        page: 2,
        sectors: ['eng', 'it'],
      };
      const serialized = serializeState(state, defaults);
      expect(serialized.get('page')).toBe('2');
      expect(serialized.get('sectors')).toBe('eng,it');
      expect(serialized.has('search')).toBe(false);
      expect(serialized.has('active')).toBe(false);
    });

    it('preserves unknown params from existing search query', () => {
      const existing = '?tab=overview&district=pune&page=1';
      const state: State = {
        ...defaults,
        page: 4,
        search: 'fitter',
      };
      const serialized = serializeState(state, defaults, existing);

      expect(serialized.get('tab')).toBe('overview');
      expect(serialized.get('district')).toBe('pune');
      expect(serialized.get('page')).toBe('4');
      expect(serialized.get('search')).toBe('fitter');
    });

    it('deletes keys when they are reverted back to defaults', () => {
      const existing = '?page=3&search=electrician';
      const state: State = {
        ...defaults,
        page: 1, // back to default
        search: 'electrician', // changed
      };
      const serialized = serializeState(state, defaults, existing);

      expect(serialized.has('page')).toBe(false);
      expect(serialized.get('search')).toBe('electrician');
    });

    it('performs round-trip parse and serialize', () => {
      const original: State = {
        page: 5,
        sort: 'asc',
        search: 'carpenter',
        sectors: ['construction', 'woodwork'],
        active: true,
      };

      const serialized = serializeState(original, defaults);
      const roundTripped = parseSearch(schema, defaults, serialized);

      expect(roundTripped).toEqual(original);
    });
  });
});
