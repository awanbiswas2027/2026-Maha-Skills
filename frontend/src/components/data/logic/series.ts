export const MAX_SERIES = 6;

export type ChartToken =
  | 'chart-1'
  | 'chart-2'
  | 'chart-3'
  | 'chart-4'
  | 'chart-5'
  | 'chart-6';

export const CHART_TOKENS: readonly ChartToken[] = [
  'chart-1',
  'chart-2',
  'chart-3',
  'chart-4',
  'chart-5',
  'chart-6',
] as const;

export interface SeriesColorAssignment {
  key: string;
  token: ChartToken;
  color: string;
  dashed: boolean;
}

export interface AssignSeriesColorsOptions {
  focalKey?: string;
  benchmarkKeys?: string[];
}

/**
 * Assigns color tokens (chart-1..6) to series keys in accordance with CHT-01 / VIZ-15:
 * - Focal entity is always chart-1 (solid)
 * - Benchmarks are always chart-6 (dashed)
 * - Remaining series receive chart-1..5 in order
 * - Throws in development if series count exceeds MAX_SERIES (6).
 */
export function assignSeriesColors(
  keys: string[],
  options?: AssignSeriesColorsOptions
): Record<string, SeriesColorAssignment> {
  if (keys.length > MAX_SERIES) {
    const isDev =
      (typeof process !== 'undefined' &&
        process.env &&
        process.env.NODE_ENV !== 'production') ||
      (typeof import.meta !== 'undefined' && Boolean(import.meta.env?.DEV));

    if (isDev) {
      throw new Error(
        `[series] Cannot display more than ${MAX_SERIES} series (received ${keys.length})`
      );
    }
  }

  const benchmarkSet = new Set(options?.benchmarkKeys ?? []);
  const focalKey = options?.focalKey;
  const result: Record<string, SeriesColorAssignment> = {};

  // 1. Benchmarks are always chart-6 with dashed stroke
  for (const key of keys) {
    if (benchmarkSet.has(key)) {
      result[key] = {
        key,
        token: 'chart-6',
        color: 'chart-6',
        dashed: true,
      };
    }
  }

  // 2. Focal key is always chart-1 if present and not a benchmark
  if (focalKey && keys.includes(focalKey) && !result[focalKey]) {
    result[focalKey] = {
      key: focalKey,
      token: 'chart-1',
      color: 'chart-1',
      dashed: false,
    };
  }

  // 3. Assign remaining regular keys
  const usedTokens = new Set(Object.values(result).map((r) => r.token));
  let tokenIdx = 0;

  for (const key of keys) {
    if (result[key]) continue;

    while (tokenIdx < CHART_TOKENS.length) {
      const candidate = CHART_TOKENS[tokenIdx++];
      // If benchmarks exist, chart-6 is reserved for them
      if (candidate === 'chart-6' && benchmarkSet.size > 0) {
        continue;
      }
      if (!usedTokens.has(candidate)) {
        usedTokens.add(candidate);
        result[key] = {
          key,
          token: candidate,
          color: candidate,
          dashed: false,
        };
        break;
      }
    }

    if (!result[key]) {
      result[key] = {
        key,
        token: 'chart-6',
        color: 'chart-6',
        dashed: false,
      };
    }
  }

  return result;
}

export interface Segment<T> {
  isPartial: boolean;
  points: T[];
}

export type SplitSegmentsResult<T> = [T[], T[]] & {
  complete: T[];
  partial: T[];
  segments: Segment<T>[];
};

/**
 * Splits time-series points into complete and partial segments (VIZ-19).
 * Partial segments include the preceding complete point so lines connect without a visual gap.
 */
export function splitPartialSegments<T>(
  points: T[],
  isPartial: ((point: T, index: number) => boolean) | keyof T
): SplitSegmentsResult<T> {
  if (points.length === 0) {
    const empty = [] as unknown as SplitSegmentsResult<T>;
    empty[0] = [];
    empty[1] = [];
    empty.complete = [];
    empty.partial = [];
    empty.segments = [];
    return empty;
  }

  const checkPartial: (point: T, index: number) => boolean =
    typeof isPartial === 'function'
      ? isPartial
      : (p: T) => Boolean(p[isPartial]);

  const flags = points.map((p, i) => checkPartial(p, i));
  const firstPartialIdx = flags.indexOf(true);

  let complete: T[];
  let partial: T[];

  if (firstPartialIdx === -1) {
    // All complete
    complete = [...points];
    partial = [];
  } else if (firstPartialIdx === 0) {
    // All partial
    complete = [];
    partial = [...points];
  } else {
    // Split with connection point: complete includes 0..firstPartialIdx-1,
    // partial includes (firstPartialIdx-1)..end so the dashed line connects smoothly
    complete = points.slice(0, firstPartialIdx);
    partial = points.slice(firstPartialIdx - 1);
  }

  // Build segments run-by-run
  const segments: Segment<T>[] = [];
  let currentRun: T[] = [];
  let currentIsPartial = flags[0];

  for (let i = 0; i < points.length; i++) {
    const p = points[i];
    const isP = flags[i];

    if (isP === currentIsPartial) {
      currentRun.push(p);
    } else {
      if (currentRun.length > 0) {
        segments.push({ isPartial: currentIsPartial, points: currentRun });
      }
      // If switching from complete to partial, include the last complete point for visual continuity
      currentRun = currentIsPartial ? [p] : [points[i - 1], p];
      currentIsPartial = isP;
    }
  }

  if (currentRun.length > 0) {
    segments.push({ isPartial: currentIsPartial, points: currentRun });
  }

  const result = [complete, partial] as unknown as SplitSegmentsResult<T>;
  result[0] = complete;
  result[1] = partial;
  result.complete = complete;
  result.partial = partial;
  result.segments = segments;

  return result;
}

export interface ForecastBandOptions<T> {
  interval?: number; // default 0.15 (15% per VIZ-20)
  valueKey?: keyof T;
  isForecastKey?: keyof T;
}

export type ForecastPoint<T> = T & {
  lower: number | null;
  upper: number | null;
  forecastLower: number | null;
  forecastUpper: number | null;
  forecastRange: [number, number] | null;
  band: [number, number] | null;
};

/**
 * Augments time-series points with prediction interval bands (VIZ-20).
 * Defaults to +/-15% interval for forecast points unless explicit lower/upper values are given.
 */
export function forecastBands<T extends Record<string, unknown> | number>(
  points: T[],
  options?: ForecastBandOptions<T extends Record<string, unknown> ? T : never>
): ForecastPoint<T extends Record<string, unknown> ? T : { value: number }>[] {
  const interval = options?.interval ?? 0.15;

  return points.map((pt) => {
    if (typeof pt === 'number') {
      const base = { value: pt } as unknown as ForecastPoint<
        T extends Record<string, unknown> ? T : { value: number }
      >;
      base.lower = null;
      base.upper = null;
      base.forecastLower = null;
      base.forecastUpper = null;
      base.forecastRange = null;
      base.band = null;
      return base;
    }

    const record = pt as Record<string, unknown>;
    const valKey = options?.valueKey ?? 'value';
    const isForecastKey = options?.isForecastKey ?? 'isForecast';

    const rawVal =
      record[valKey as string] ?? record['forecast'] ?? record['y'] ?? 0;
    const value = typeof rawVal === 'number' ? rawVal : Number(rawVal) || 0;

    const isForecast = Boolean(
      record[isForecastKey as string] ??
        (record['forecast'] !== undefined && record['value'] === undefined)
    );

    let lower: number | null = null;
    let upper: number | null = null;

    if (isForecast) {
      if (
        typeof record['lower'] === 'number' &&
        typeof record['upper'] === 'number'
      ) {
        lower = record['lower'];
        upper = record['upper'];
      } else {
        lower = Math.round(value * (1 - interval) * 100) / 100;
        upper = Math.round(value * (1 + interval) * 100) / 100;
      }
    }

    const band: [number, number] | null =
      lower !== null && upper !== null ? [lower, upper] : null;

    return {
      ...record,
      lower,
      upper,
      forecastLower: lower,
      forecastUpper: upper,
      forecastRange: band,
      band,
    } as unknown as ForecastPoint<
      T extends Record<string, unknown> ? T : { value: number }
    >;
  });
}
