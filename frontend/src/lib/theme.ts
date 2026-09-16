export type ThemePreference = 'system' | 'light' | 'dark';

export const STORAGE_KEY = 'mahaskills.theme';

export function getStoredPreference(): ThemePreference {
  try {
    const val = localStorage.getItem(STORAGE_KEY);
    if (val === 'light' || val === 'dark' || val === 'system') {
      return val;
    }
  } catch {
    // Handle private mode or localStorage errors
  }
  return 'system';
}

export function setStoredPreference(pref: ThemePreference): void {
  try {
    localStorage.setItem(STORAGE_KEY, pref);
  } catch {
    // Handle private mode or localStorage errors
  }
}

export function resolveTheme(pref: ThemePreference, prefersDark: boolean): 'light' | 'dark' {
  if (pref === 'dark') return 'dark';
  if (pref === 'light') return 'light';
  return prefersDark ? 'dark' : 'light';
}

export function applyTheme(pref: ThemePreference): void {
  const prefersDark = typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  const resolved = resolveTheme(pref, Boolean(prefersDark));
  if (typeof document !== 'undefined') {
    if (resolved === 'dark') {
      document.documentElement.classList.add('dark');
      document.documentElement.style.colorScheme = 'dark';
    } else {
      document.documentElement.classList.remove('dark');
      document.documentElement.style.colorScheme = 'light';
    }
  }
}

export function subscribeToSystemTheme(callback: (resolved: 'light' | 'dark') => void): () => void {
  if (typeof window === 'undefined' || !window.matchMedia) {
    return () => {};
  }
  const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
  const listener = (e: MediaQueryListEvent) => {
    callback(e.matches ? 'dark' : 'light');
  };
  mediaQuery.addEventListener('change', listener);
  return () => {
    mediaQuery.removeEventListener('change', listener);
  };
}
