/**
 * API Error Envelope to i18n Key Mapping
 * Spec: uiux.md §20.3 (STA-07..10)
 */

export interface ApiErrorEnvelope {
  code?: string;
  trace_id?: string;
  traceId?: string;
  sub_code?: string;
  details?: Record<string, unknown>;
  [key: string]: unknown;
}

export interface MappedError {
  code: string;
  titleKey: string;
  descriptionKey: string;
  traceId?: string;
}

export const KNOWN_ERROR_CODES = [
  'AUTHENTICATION_ERROR',
  'AUTH_TOKEN_EXPIRED',
  'AUTHORIZATION_ERROR',
  'AUTH_FORBIDDEN',
  'AUTH_SCOPE_RESTRICTED',
  'RESOURCE_NOT_FOUND',
  'VALIDATION_ERROR',
  'BUSINESS_RULE_VIOLATION',
  'CONFLICT',
  'RATE_LIMITED',
  'EXTERNAL_SERVICE_ERROR',
  'SERVICE_UNAVAILABLE',
] as const;

export type KnownErrorCode = (typeof KNOWN_ERROR_CODES)[number];

const KNOWN_CODES_SET = new Set<string>(KNOWN_ERROR_CODES);

/**
 * Maps any unknown error or API error envelope into a localized key pair.
 * Never exposes raw server messages per STA-08.
 * Extracts traceId per STA-09.
 */
export function mapApiError(error: unknown): MappedError {
  let code = 'UNKNOWN';
  let traceId: string | undefined;

  if (typeof error === 'object' && error !== null) {
    const errObj = error as Record<string, unknown>;

    // Handle Axios-like response wrappers
    const responseData =
      errObj.response &&
      typeof errObj.response === 'object' &&
      (errObj.response as Record<string, unknown>).data &&
      typeof (errObj.response as Record<string, unknown>).data === 'object'
        ? ((errObj.response as Record<string, unknown>).data as Record<string, unknown>)
        : undefined;

    const source = responseData ?? errObj;

    const rawCode =
      typeof source.code === 'string'
        ? source.code
        : typeof errObj.code === 'string'
          ? errObj.code
          : undefined;

    if (rawCode && KNOWN_CODES_SET.has(rawCode.toUpperCase())) {
      code = rawCode.toUpperCase();
    }

    const rawTrace = source.traceId ?? source.trace_id ?? errObj.traceId ?? errObj.trace_id;
    if (typeof rawTrace === 'string' && rawTrace.trim().length > 0) {
      traceId = rawTrace.trim();
    }
  }

  return {
    code,
    titleKey: `errors.${code}.title`,
    descriptionKey: `errors.${code}.description`,
    traceId,
  };
}
