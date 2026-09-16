import React from 'react';
import { flexRender, getCoreRowModel, useReactTable, getSortedRowModel, SortingState, ColumnDef } from '@tanstack/react-table';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Skeleton } from '../ui/skeleton';
import { ErrorState, EmptyState } from '../common';
import { shouldRenderCards } from './logic/responsive';
import { ariaSort } from './logic/sorting';
import { ArrowUpDown, ArrowUp, ArrowDown } from 'lucide-react';

export interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  state?: 'loading' | 'refetching' | 'empty' | 'no-results' | 'error' | 'ready';
  error?: unknown;
  onRetry?: () => void;
  caption: string;
  density?: 'compact' | 'default' | 'comfortable';
  virtualizeAbove?: number;
  renderMobileCard?: (row: TData) => React.ReactNode;
}

export function DataTable<TData, TValue>({
  columns,
  data,
  state = 'ready',
  error,
  onRetry,
  caption,
  density = 'default',
  renderMobileCard
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    state: { sorting },
  });

  const isMobileCards = typeof window !== 'undefined' && shouldRenderCards(window.innerWidth, !!renderMobileCard);
  const rowHeight = density === 'compact' ? 'h-8' : density === 'comfortable' ? 'h-12' : 'h-10';

  if (state === 'error') {
    return <ErrorState error={error || {code: 'TABLE_ERROR'}} onRetry={onRetry} />;
  }

  if (state === 'empty' || state === 'no-results') {
    return <EmptyState type="no-results" title="No data" />;
  }

  if (isMobileCards && renderMobileCard && data.length > 0) {
    return (
      <div className="flex flex-col gap-4">
        {data.map((row, i) => <div key={i}>{renderMobileCard(row)}</div>)}
      </div>
    );
  }

  return (
    <div className="rounded-md border overflow-hidden" role="region" tabIndex={0} aria-label={caption}>
      <Table>
        <caption className="sr-only">{caption}</caption>
        <TableHeader className="bg-muted text-sm font-medium text-muted-foreground sticky top-0 z-10">
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id} className="hover:bg-transparent">
              {headerGroup.headers.map((header) => {
                const meta = header.column.columnDef.meta as Record<string, unknown>;
                const align = meta?.align || 'left';
                const isSticky = meta?.sticky;
                
                return (
                  <TableHead 
                    key={header.id} 
                    className={`
                      ${align === 'right' ? 'text-right tabular-nums' : align === 'center' ? 'text-center' : 'text-left'}
                      ${isSticky ? 'sticky left-0 bg-muted z-20 shadow-[1px_0_0_rgba(0,0,0,0.1)]' : ''}
                    `}
                    scope="col"
                    aria-sort={header.column.getCanSort() ? ariaSort(header.column.getIsSorted() || 'none') : undefined}
                  >
                    {header.isPlaceholder ? null : (
                      <div className={`flex items-center ${align === 'right' ? 'justify-end' : align === 'center' ? 'justify-center' : 'justify-start'}`}>
                        {flexRender(header.column.columnDef.header, header.getContext())}
                        {header.column.getCanSort() && (
                          <button
                            onClick={header.column.getToggleSortingHandler()}
                            className="ml-2 bg-transparent border-0 p-0 text-muted-foreground cursor-pointer hover:text-foreground"
                          >
                            {{
                              asc: <ArrowUp className="h-4 w-4" />,
                              desc: <ArrowDown className="h-4 w-4" />,
                              false: <ArrowUpDown className="h-4 w-4 opacity-50" />
                            }[header.column.getIsSorted() as string || 'false']}
                          </button>
                        )}
                      </div>
                    )}
                  </TableHead>
                );
              })}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody className={state === 'refetching' ? 'opacity-60 relative' : ''}>
          {state === 'loading' ? (
            Array.from({ length: 5 }).map((_, i) => (
              <TableRow key={i} className={rowHeight}>
                {columns.map((_, j) => (
                  <TableCell key={j}><Skeleton className="h-4 w-full" /></TableCell>
                ))}
              </TableRow>
            ))
          ) : table.getRowModel().rows?.length ? (
            table.getRowModel().rows.map((row) => (
              <TableRow
                key={row.id}
                data-state={row.getIsSelected() && "selected"}
                className={`${rowHeight} hover:bg-muted/50 transition-colors`}
                aria-selected={row.getIsSelected()}
              >
                {row.getVisibleCells().map((cell) => {
                  const meta = cell.column.columnDef.meta as Record<string, unknown>;
                  const align = meta?.align || 'left';
                  const isSticky = meta?.sticky;
                  
                  return (
                    <TableCell 
                      key={cell.id}
                      className={`
                        ${align === 'right' ? 'text-right tabular-nums' : align === 'center' ? 'text-center' : 'text-left'}
                        ${isSticky ? 'sticky left-0 bg-background z-10 shadow-[1px_0_0_rgba(0,0,0,0.1)]' : ''}
                        ${row.getIsSelected() && isSticky ? 'bg-primary/5' : ''}
                      `}
                    >
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  );
                })}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length} className="h-24 text-center">
                No results.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
      {state === 'refetching' && (
        <div className="absolute top-0 left-0 w-full h-[2px] bg-primary opacity-50" aria-busy="true" />
      )}
    </div>
  );
}
