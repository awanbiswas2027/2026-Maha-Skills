import type { TFunction } from 'i18next';

export type SupportedLang = 'mr' | 'hi' | 'en';

function isValidNumber(n: unknown): n is number {
  return typeof n === 'number' && !Number.isNaN(n) && Number.isFinite(n);
}

export function formatNumber(n: number | null | undefined, lang: SupportedLang): string | null {
  if (!isValidNumber(n)) return null;
  return new Intl.NumberFormat(`${lang}-IN`, {
    numberingSystem: 'latn',
    useGrouping: true,
  }).format(n);
}

export function formatPercent(
  n: number | null | undefined,
  lang: SupportedLang,
  options?: { decimals?: 0 | 1 }
): string | null {
  if (!isValidNumber(n)) return null;
  const decimals = options?.decimals ?? 0;
  const formatted = new Intl.NumberFormat(`${lang}-IN`, {
    numberingSystem: 'latn',
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(n);
  return `${formatted}%`;
}

export function formatCurrencyInr(
  n: number | null | undefined,
  lang: SupportedLang,
  options?: { perMonth?: boolean },
  t?: TFunction
): string | null {
  if (!isValidNumber(n)) return null;
  const formatted = new Intl.NumberFormat(`${lang}-IN`, {
    numberingSystem: 'latn',
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(n);

  if (options?.perMonth) {
    const suffix = t ? t('format.per_month') : '/ month';
    return `${formatted} ${suffix}`;
  }
  return formatted;
}

export function formatLakh(
  n: number | null | undefined,
  lang: SupportedLang,
  t?: TFunction
): string | null {
  if (!isValidNumber(n)) return null;
  const abs = Math.abs(n);
  const sign = n < 0 ? '\u2212' : '';

  if (abs >= 10000000) {
    const croreVal = (abs / 10000000).toFixed(1).replace(/\.0$/, '');
    const croreText = t ? t('format.crore') : 'crore';
    return `${sign}${croreVal} ${croreText}`;
  }

  if (abs >= 100000) {
    const lakhVal = (abs / 100000).toFixed(1).replace(/\.0$/, '');
    const lakhText = t ? t('format.lakh') : 'lakh';
    return `${sign}${lakhVal} ${lakhText}`;
  }

  return formatNumber(n, lang);
}

export function formatScore(n: number | null | undefined): string | null {
  if (!isValidNumber(n)) return null;
  const clamped = Math.min(100, Math.max(0, Math.round(n)));
  return String(clamped);
}

export function formatDelta(n: number | null | undefined, lang: SupportedLang): string | null {
  if (!isValidNumber(n)) return null;
  if (n === 0) return '0';
  if (n > 0) {
    return `+${formatNumber(n, lang)}`;
  }
  // U+2212 minus sign for negative
  return `\u2212${formatNumber(Math.abs(n), lang)}`;
}

export function formatDate(
  d: Date | string | number | null | undefined,
  lang: SupportedLang
): string | null {
  if (d == null) return null;
  const date = d instanceof Date ? d : new Date(d);
  if (Number.isNaN(date.getTime())) return null;

  return new Intl.DateTimeFormat(`${lang}-IN`, {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    numberingSystem: 'latn',
  }).format(date);
}
