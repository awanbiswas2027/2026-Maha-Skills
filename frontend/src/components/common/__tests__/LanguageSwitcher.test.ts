import { describe, it, expect } from 'vitest';
import { resolveHtmlLang } from '../LanguageSwitcher';

describe('resolveHtmlLang', () => {
  it('returns en when undefined', () => {
    expect(resolveHtmlLang(undefined)).toBe('en');
  });

  it('returns en when unknown language', () => {
    expect(resolveHtmlLang('fr')).toBe('en');
  });

  it('returns exact match for en, mr, hi', () => {
    expect(resolveHtmlLang('en')).toBe('en');
    expect(resolveHtmlLang('mr')).toBe('mr');
    expect(resolveHtmlLang('hi')).toBe('hi');
  });

  it('handles language with region code', () => {
    expect(resolveHtmlLang('en-US')).toBe('en');
    expect(resolveHtmlLang('mr-IN')).toBe('mr');
  });
});
