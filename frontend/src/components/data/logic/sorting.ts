export type ColumnKind = 'numeric' | 'text';
export type SortDirection = 'asc' | 'desc';
export type SortOrder = SortDirection | null;
export type AriaSortValue = 'ascending' | 'descending' | 'none';

export type SortInput =
  | SortOrder
  | 'none'
  | boolean
  | { desc?: boolean }
  | undefined;

/**
 * Computes the next sort state in the cycle.
 * Numeric columns cycle: desc -> asc -> none (null)
 * Text columns cycle: asc -> desc -> none (null)
 */
export function nextSort(
  current: SortInput,
  columnKind: ColumnKind
): SortOrder {
  let normalized: SortOrder = null;
  if (current === 'asc') {
    normalized = 'asc';
  } else if (current === 'desc') {
    normalized = 'desc';
  } else if (typeof current === 'object' && current !== null && 'desc' in current) {
    normalized = current.desc ? 'desc' : 'asc';
  }

  if (columnKind === 'numeric') {
    if (normalized === null) {
      return 'desc';
    }
    if (normalized === 'desc') {
      return 'asc';
    }
    return null;
  }

  if (normalized === null) {
    return 'asc';
  }
  if (normalized === 'asc') {
    return 'desc';
  }
  return null;
}

/**
 * Returns the ARIA attribute value corresponding to a sort state.
 */
export function ariaSort(state: SortInput): AriaSortValue {
  if (state === 'asc') {
    return 'ascending';
  }
  if (state === 'desc') {
    return 'descending';
  }
  if (typeof state === 'object' && state !== null && 'desc' in state) {
    return state.desc ? 'descending' : 'ascending';
  }
  return 'none';
}
