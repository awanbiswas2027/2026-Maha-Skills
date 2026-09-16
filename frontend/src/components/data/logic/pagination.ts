export const PAGE_SIZES = [25, 50, 100] as const;
export type PageSize = (typeof PAGE_SIZES)[number];

export interface PageRangeResult {
  from: number;
  to: number;
  total: number;
}

/**
 * Calculates the display range for pagination (e.g. 1-25 of 214).
 * If total is 0, from and to are 0.
 */
export function pageRange(
  page: number,
  size: number,
  total: number
): PageRangeResult {
  if (total <= 0) {
    return { from: 0, to: 0, total: Math.max(0, total) };
  }

  const safeSize = Math.max(1, size);
  const safePage = Math.max(1, page);
  const from = Math.min((safePage - 1) * safeSize + 1, total);
  const to = Math.min(safePage * safeSize, total);

  return { from, to, total };
}

/**
 * Clamps a 1-based page number to the valid range [1, totalPages].
 * Supports calling as clampPage(page, totalPages) or clampPage(page, size, total).
 */
export function clampPage(
  page: number,
  sizeOrTotalPages: number,
  total?: number
): number {
  const totalPages =
    total !== undefined
      ? Math.max(1, Math.ceil(Math.max(0, total) / Math.max(1, sizeOrTotalPages)))
      : Math.max(1, sizeOrTotalPages);

  const safePage = Number.isFinite(page) ? Math.floor(page) : 1;
  return Math.min(Math.max(1, safePage), totalPages);
}
