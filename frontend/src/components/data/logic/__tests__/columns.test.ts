import { describe, it, expect } from 'vitest';
import {
  defaultVisibleColumns,
  parseColsParam,
  ColumnLike,
} from '../columns';

describe('columns logic', () => {
  const columns: ColumnLike[] = [
    { id: 'code', accessorKey: 'code' },
    { id: 'name', accessorKey: 'name' },
    { id: 'district', accessorKey: 'district' },
    { id: 'sector', accessorKey: 'sector' },
    { id: 'intake', accessorKey: 'intake', meta: { hideBelow: 'sm' } },
    { id: 'enrolled', accessorKey: 'enrolled', meta: { hideBelow: 'md' } },
    { id: 'placed', accessorKey: 'placed', meta: { hideBelow: 'md' } },
    { id: 'rate', accessorKey: 'rate', meta: { hideBelow: 'lg' } },
    { id: 'salary', accessorKey: 'salary', meta: { hideBelow: 'lg' } },
    { id: 'gap_score', accessorKey: 'gap_score', meta: { hideBelow: 'xl' } },
    { id: 'action', accessorKey: 'action' },
    { id: 'extra', accessorKey: 'extra' },
  ];

  describe('defaultVisibleColumns', () => {
    it('honours hideBelow breakpoints', () => {
      // Below sm (e.g. 360px): only columns without hideBelow
      const mobileCols = defaultVisibleColumns(columns, 360);
      expect(mobileCols).toEqual(['code', 'name', 'district', 'sector', 'action', 'extra']);

      // At 700px (between sm and md): includes 'intake' (hideBelow: 'sm')
      const tabletCols = defaultVisibleColumns(columns, 700);
      expect(tabletCols).toContain('intake');
      expect(tabletCols).not.toContain('enrolled');
      expect(tabletCols).not.toContain('rate');

      // At 800px (between md and lg): includes md columns
      const mdCols = defaultVisibleColumns(columns, 800);
      expect(mdCols).toContain('enrolled');
      expect(mdCols).toContain('placed');
      expect(mdCols).not.toContain('rate');
    });

    it('caps default visible columns to at most 8 at desktop (>= 1280px)', () => {
      // At 1280px, all 12 columns would be eligible, but must cap at <= 8
      const desktopCols = defaultVisibleColumns(columns, 1280);
      expect(desktopCols.length).toBeLessThanOrEqual(8);
      expect(desktopCols).toHaveLength(8);
      expect(desktopCols).toEqual([
        'code',
        'name',
        'district',
        'sector',
        'intake',
        'enrolled',
        'placed',
        'rate',
      ]);
    });

    it('handles string array columns', () => {
      const stringCols = ['col1', 'col2', 'col3'];
      expect(defaultVisibleColumns(stringCols, 1024)).toEqual(['col1', 'col2', 'col3']);
    });
  });

  describe('parseColsParam', () => {
    it('returns empty array when param is missing or empty', () => {
      expect(parseColsParam(null)).toEqual([]);
      expect(parseColsParam(undefined)).toEqual([]);
      expect(parseColsParam('')).toEqual([]);
    });

    it('parses comma-separated column IDs', () => {
      const parsed = parseColsParam('code,name,rate');
      expect(parsed).toEqual(['code', 'name', 'rate']);
    });

    it('filters out unknown columns when allColumns is provided', () => {
      const parsed = parseColsParam('code,unknown_col,rate', columns);
      expect(parsed).toEqual(['code', 'rate']);
      expect(parsed).not.toContain('unknown_col');
    });
  });
});
