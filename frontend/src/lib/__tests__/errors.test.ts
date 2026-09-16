import { describe, it, expect } from 'vitest';
import { mapApiError, KNOWN_ERROR_CODES } from '../errors';

describe('mapApiError (STA-08/09)', () => {
  it('maps every documented error code to its i18n keys', () => {
    for (const code of KNOWN_ERROR_CODES) {
      const result = mapApiError({ code });
      expect(result.code).toBe(code);
      expect(result.titleKey).toBe(`errors.${code}.title`);
      expect(result.descriptionKey).toBe(`errors.${code}.description`);
    }
  });

  it('maps unknown error code to UNKNOWN', () => {
    const result = mapApiError({ code: 'SOME_WEIRD_ERROR_CODE' });
    expect(result.code).toBe('UNKNOWN');
    expect(result.titleKey).toBe('errors.UNKNOWN.title');
    expect(result.descriptionKey).toBe('errors.UNKNOWN.description');
  });

  it('handles null and primitive errors safely', () => {
    expect(mapApiError(null).code).toBe('UNKNOWN');
    expect(mapApiError(undefined).code).toBe('UNKNOWN');
    expect(mapApiError('Network Error').code).toBe('UNKNOWN');
    expect(mapApiError(500).code).toBe('UNKNOWN');
  });

  it('extracts traceId from error object', () => {
    const res1 = mapApiError({ code: 'RESOURCE_NOT_FOUND', traceId: 'tr-abc-123' });
    expect(res1.traceId).toBe('tr-abc-123');

    const res2 = mapApiError({ code: 'RESOURCE_NOT_FOUND', trace_id: 'tr-xyz-789' });
    expect(res2.traceId).toBe('tr-xyz-789');
  });

  it('extracts traceId from axios-like response.data', () => {
    const axiosErr = {
      response: {
        data: {
          code: 'RATE_LIMITED',
          trace_id: 'tr-rate-limit-42',
          message: 'Raw english internal detail',
        },
      },
    };
    const res = mapApiError(axiosErr);
    expect(res.code).toBe('RATE_LIMITED');
    expect(res.traceId).toBe('tr-rate-limit-42');
  });

  it('never leaks raw server message in mapped output', () => {
    const res = mapApiError({
      code: 'AUTH_FORBIDDEN',
      message: 'Sensitive database stack trace or internal info',
    });
    expect(JSON.stringify(res)).not.toContain('Sensitive database stack trace');
  });
});
