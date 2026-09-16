import { describe, it, expect, beforeEach, vi } from 'vitest';
import { resolveTheme, getStoredPreference, setStoredPreference, STORAGE_KEY } from '../theme';

class MockStorage implements Storage {
  private store: Record<string, string> = {};
  get length(): number {
    return Object.keys(this.store).length;
  }
  clear(): void {
    this.store = {};
  }
  getItem(key: string): string | null {
    return this.store[key] ?? null;
  }
  key(index: number): string | null {
    return Object.keys(this.store)[index] ?? null;
  }
  removeItem(key: string): void {
    delete this.store[key];
  }
  setItem(key: string, value: string): void {
    this.store[key] = String(value);
  }
}

describe('theme library', () => {
  beforeEach(() => {
    globalThis.localStorage = new MockStorage();
    vi.restoreAllMocks();
  });

  describe('resolveTheme truth table', () => {
    it('resolves light when preference is light, regardless of prefersDark', () => {
      expect(resolveTheme('light', true)).toBe('light');
      expect(resolveTheme('light', false)).toBe('light');
    });

    it('resolves dark when preference is dark, regardless of prefersDark', () => {
      expect(resolveTheme('dark', true)).toBe('dark');
      expect(resolveTheme('dark', false)).toBe('dark');
    });

    it('resolves following system preference when preference is system', () => {
      expect(resolveTheme('system', true)).toBe('dark');
      expect(resolveTheme('system', false)).toBe('light');
    });
  });

  describe('storage handling', () => {
    it('retrieves stored valid preference', () => {
      localStorage.setItem(STORAGE_KEY, 'dark');
      expect(getStoredPreference()).toBe('dark');

      localStorage.setItem(STORAGE_KEY, 'light');
      expect(getStoredPreference()).toBe('light');

      localStorage.setItem(STORAGE_KEY, 'system');
      expect(getStoredPreference()).toBe('system');
    });

    it('falls back to system when localStorage has invalid value or throws', () => {
      localStorage.setItem(STORAGE_KEY, 'invalid');
      expect(getStoredPreference()).toBe('system');

      vi.spyOn(globalThis.localStorage, 'getItem').mockImplementationOnce(() => {
        throw new Error('QuotaExceededError / SecurityError');
      });
      expect(getStoredPreference()).toBe('system');
    });

    it('handles localStorage setItem failure gracefully', () => {
      vi.spyOn(globalThis.localStorage, 'setItem').mockImplementationOnce(() => {
        throw new Error('SecurityError');
      });
      expect(() => setStoredPreference('dark')).not.toThrow();
    });
  });
});
