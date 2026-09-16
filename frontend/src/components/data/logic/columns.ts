export interface ColumnMeta {
  align?: 'left' | 'right' | 'center';
  numeric?: boolean;
  sticky?: boolean;
  hideBelow?: 'sm' | 'md' | 'lg' | 'xl';
}

export interface ColumnLike {
  id?: string;
  accessorKey?: string;
  meta?: ColumnMeta;
  hideBelow?: 'sm' | 'md' | 'lg' | 'xl';
}

export const BREAKPOINTS = {
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
} as const;

/**
 * Computes default visible column IDs based on viewport width:
 * - Omits columns whose `hideBelow` breakpoint is greater than current width.
 * - At wide viewports (>= 1280px), limits default visible columns to at most 8.
 */
export function defaultVisibleColumns(
  columns: (ColumnLike | string)[],
  width: number
): string[] {
  const visible = columns
    .map((col) => {
      if (typeof col === 'string') {
        return { id: col, hideBelow: undefined };
      }
      const id = col.id ?? col.accessorKey ?? '';
      const hideBelow = col.meta?.hideBelow ?? col.hideBelow;
      return { id, hideBelow };
    })
    .filter(({ id, hideBelow }) => {
      if (!id) return false;
      if (!hideBelow) return true;
      const minWidth = BREAKPOINTS[hideBelow];
      if (minWidth !== undefined && width < minWidth) {
        return false;
      }
      return true;
    })
    .map(({ id }) => id);

  if (width >= 1280 && visible.length > 8) {
    return visible.slice(0, 8);
  }

  return visible;
}

/**
 * Parses a comma-separated list of column IDs from a URL parameter string (e.g. `cols=col1,col2`).
 * If `allColumns` is provided, filters out unknown column IDs.
 */
export function parseColsParam(
  param: string | null | undefined,
  allColumns?: (ColumnLike | string)[]
): string[] {
  if (!param || typeof param !== 'string') {
    return [];
  }

  const parsed = param
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean);

  if (allColumns && allColumns.length > 0) {
    const validIds = new Set(
      allColumns.map((col) =>
        typeof col === 'string' ? col : col.id ?? col.accessorKey ?? ''
      )
    );
    return parsed.filter((id) => validIds.has(id));
  }

  return parsed;
}
