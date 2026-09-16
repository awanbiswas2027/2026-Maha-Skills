import { useCallback, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { z } from 'zod';

export interface UseUrlStateOptions<T> {
  pushKeys?: (keyof T)[];
  history?: 'replace' | 'push';
}

export type SetUrlState<T> = (
  patch: Partial<T> | ((prev: T) => Partial<T>),
  options?: { history?: 'replace' | 'push' }
) => void;

function isEqualValue(a: unknown, b: unknown): boolean {
  if (a === b) return true;
  if (Array.isArray(a) && Array.isArray(b)) {
    if (a.length !== b.length) return false;
    for (let i = 0; i < a.length; i++) {
      if (a[i] !== b[i]) return false;
    }
    return true;
  }
  return false;
}

/**
 * Pure helper to parse URL search parameters using Zod with per-key fallback.
 * Invalid keys fall back to defaults, preserving valid fields.
 */
export function parseSearch<S extends z.ZodTypeAny>(
  schema: S,
  defaults: z.infer<S>,
  search: string | URLSearchParams
): z.infer<S> {
  const params =
    typeof search === 'string'
      ? new URLSearchParams(search.startsWith('?') ? search.slice(1) : search)
      : search;

  const candidate: Record<string, unknown> = {};

  for (const key of Object.keys(defaults)) {
    if (!params.has(key)) {
      candidate[key] = defaults[key];
      continue;
    }

    const raw = params.get(key);
    if (raw === null) {
      candidate[key] = defaults[key];
      continue;
    }

    const defaultVal = defaults[key];
    if (Array.isArray(defaultVal)) {
      candidate[key] =
        raw === '' ? [] : raw.split(',').map((item) => item.trim());
    } else if (typeof defaultVal === 'number') {
      const num = Number(raw);
      candidate[key] = Number.isNaN(num) ? raw : num;
    } else if (typeof defaultVal === 'boolean') {
      candidate[key] =
        raw === 'true' || raw === '1'
          ? true
          : raw === 'false' || raw === '0'
          ? false
          : raw;
    } else {
      candidate[key] = raw;
    }
  }

  // Attempt full validation
  const fullResult = schema.safeParse(candidate);
  if (fullResult.success) {
    return fullResult.data;
  }

  // Per-key fallback for ZodObject schemas
  if (schema instanceof z.ZodObject) {
    const shape = schema.shape as Record<string, z.ZodTypeAny>;
    const result: Record<string, unknown> = { ...defaults };

    for (const key of Object.keys(defaults)) {
      const fieldSchema = shape[key];
      if (fieldSchema) {
        const fieldResult = fieldSchema.safeParse(candidate[key]);
        result[key] = fieldResult.success ? fieldResult.data : defaults[key];
      } else {
        result[key] = candidate[key] ?? defaults[key];
      }
    }
    return result as z.infer<S>;
  }

  // General fallback for wrapped schemas (effects/refinements)
  const failingKeys = new Set(
    fullResult.error.issues.map((i) => i.path[0]).filter(Boolean)
  );
  const patched: Record<string, unknown> = { ...candidate };
  for (const k of failingKeys) {
    patched[k as string] = defaults[k as string];
  }
  const retryResult = schema.safeParse(patched);
  return retryResult.success ? retryResult.data : defaults;
}

/**
 * Pure helper to serialize state into URLSearchParams.
 * - Omits values matching defaults
 * - Serializes arrays as comma-delimited strings
 * - Preserves unknown parameters existing in the source URL
 */
export function serializeState<T extends Record<string, unknown>>(
  state: T,
  defaults: T,
  existing?: string | URLSearchParams
): URLSearchParams {
  const resultParams = new URLSearchParams(
    typeof existing === 'string'
      ? existing.startsWith('?')
        ? existing.slice(1)
        : existing
      : existing
  );

  const allKeys = new Set([...Object.keys(defaults), ...Object.keys(state)]);

  for (const key of allKeys) {
    const currentVal = state[key];
    const defaultVal = defaults[key];

    if (isEqualValue(currentVal, defaultVal)) {
      resultParams.delete(key);
    } else if (Array.isArray(currentVal)) {
      if (currentVal.length === 0) {
        resultParams.delete(key);
      } else {
        resultParams.set(key, currentVal.join(','));
      }
    } else if (
      currentVal !== undefined &&
      currentVal !== null &&
      currentVal !== ''
    ) {
      resultParams.set(key, String(currentVal));
    } else {
      resultParams.delete(key);
    }
  }

  return resultParams;
}

/**
 * React hook built on react-router-dom useSearchParams to manage typed state in the URL.
 * Returns [state, setState, reset].
 */
export function useUrlState<S extends z.ZodTypeAny>(
  schema: S,
  defaults: z.infer<S>,
  options?: UseUrlStateOptions<z.infer<S>>
): [z.infer<S>, SetUrlState<z.infer<S>>, () => void] {
  const [searchParams, setSearchParams] = useSearchParams();

  const state = useMemo(() => {
    return parseSearch(schema, defaults, searchParams);
  }, [schema, defaults, searchParams]);

  const setState: SetUrlState<z.infer<S>> = useCallback(
    (patch, opts) => {
      const partial = typeof patch === 'function' ? patch(state) : patch;
      const nextState = { ...state, ...partial };

      const pushKeys =
        options?.pushKeys ??
        (('page' in defaults ? ['page'] : []) as (keyof z.infer<S>)[]);

      let historyMode = opts?.history ?? options?.history;
      if (!historyMode) {
        const updatedKeys = Object.keys(partial) as (keyof z.infer<S>)[];
        const shouldPush = updatedKeys.some((k) => pushKeys.includes(k));
        historyMode = shouldPush ? 'push' : 'replace';
      }

      const nextParams = serializeState(
        nextState,
        defaults,
        searchParams
      );

      setSearchParams(nextParams, { replace: historyMode === 'replace' });
    },
    [state, searchParams, defaults, options, setSearchParams]
  );

  const reset = useCallback(() => {
    const nextParams = serializeState(
      defaults,
      defaults,
      searchParams
    );
    setSearchParams(nextParams, { replace: true });
  }, [defaults, searchParams, setSearchParams]);

  return [state, setState, reset];
}
