const fs = require('fs');
const path = require('path');
const dir = path.join(process.cwd(), 'frontend', 'src', 'components', 'data');
const files = {
  'FactorBreakdown.tsx': `import React from 'react';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '../ui/collapsible';
import { Button } from '../ui/button';
import { ChevronDown } from 'lucide-react';
import { factorRows, FactorInput } from './logic/factors';

export interface FactorBreakdownProps {
  factors: FactorInput[];
  defaultOpen?: boolean;
}

export const FactorBreakdown: React.FC<FactorBreakdownProps> = ({ factors, defaultOpen }) => {
  const { rows, total } = factorRows(factors);
  
  return (
    <Collapsible defaultOpen={defaultOpen} className="border rounded-md w-full text-sm">
      <div className="flex items-center justify-between p-3">
        <div className="font-semibold">Factor Breakdown</div>
        <CollapsibleTrigger asChild>
          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
            <ChevronDown className="h-4 w-4" />
          </Button>
        </CollapsibleTrigger>
      </div>
      <CollapsibleContent>
        <table className="w-full text-left border-t border-border">
          <caption className="sr-only">Factor contributions to gap score</caption>
          <thead className="bg-muted text-muted-foreground font-medium">
            <tr>
              <th className="py-2 px-3">Factor</th>
              <th className="py-2 px-3 text-right">Score</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.factor} className="border-b border-border last:border-0 hover:bg-muted/50">
                <td className="py-2 px-3">{row.label}</td>
                <td className="py-2 px-3 text-right tabular-nums">{row.contribution} / {row.weight}</td>
              </tr>
            ))}
          </tbody>
          <tfoot className="bg-muted font-medium">
            <tr>
              <td className="py-2 px-3">{total.label}</td>
              <td className="py-2 px-3 text-right tabular-nums">{total.contribution} / {total.weight}</td>
            </tr>
          </tfoot>
        </table>
      </CollapsibleContent>
    </Collapsible>
  );
};
`,
  'ChartCard.tsx': `import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../ui/card';
import { Button } from '../ui/button';
import { Skeleton } from '../ui/skeleton';
import { ErrorState, EmptyState } from '../common';
import { TableIcon, BarChartIcon, DownloadIcon } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { chartHeight } from './logic/responsive';

export interface ChartCardProps {
  title: string;
  subtitle?: string;
  insight?: string;
  footnote?: string;
  state?: 'loading' | 'error' | 'empty' | 'ready';
  variant?: 'default' | 'lead';
  onRetry?: () => void;
  children: React.ReactNode;
  tableView?: React.ReactNode;
  summaryLabel?: string;
}

export const ChartCard: React.FC<ChartCardProps> = ({
  title, subtitle, insight, footnote, state = 'ready', variant = 'default',
  onRetry, children, tableView, summaryLabel
}) => {
  const { t } = useTranslation('data');
  const [showTable, setShowTable] = useState(false);
  const height = chartHeight(typeof window !== 'undefined' ? window.innerWidth : 1024, variant);

  return (
    <Card className="flex flex-col overflow-hidden">
      <CardHeader className="flex flex-row items-start justify-between pb-2">
        <div className="space-y-1">
          <CardTitle className="text-base">{title}</CardTitle>
          {subtitle && <CardDescription className="text-xs">{subtitle}</CardDescription>}
          {insight && <p className="text-sm font-medium mt-2">{insight}</p>}
        </div>
        <div className="flex items-center gap-1">
          {tableView && (
            <Button
              variant="ghost"
              size="sm"
              className="h-8 px-2"
              onClick={() => setShowTable(!showTable)}
              aria-pressed={showTable}
              aria-label={showTable ? t('chart.view_chart') : t('chart.view_table')}
            >
              {showTable ? <BarChartIcon className="h-4 w-4" /> : <TableIcon className="h-4 w-4" />}
            </Button>
          )}
          <Button variant="ghost" size="sm" className="h-8 px-2" aria-label={t('chart.export')}>
            <DownloadIcon className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="flex-1 pb-4">
        {state === 'loading' && <Skeleton style={{ height }} className="w-full rounded-md" />}
        {state === 'error' && <div style={{ height }} className="flex items-center justify-center"><ErrorState error={{code:'DATA_ERROR', traceId:''}} onRetry={onRetry} /></div>}
        {state === 'empty' && <div style={{ height }} className="flex items-center justify-center"><EmptyState type="no-results" title="No data available" /></div>}
        {state === 'ready' && (
          <div style={{ height }} className="w-full relative">
            {showTable && tableView ? (
              <div className="h-full overflow-auto">{tableView}</div>
            ) : (
              <figure aria-label={summaryLabel} className="h-full w-full m-0">{children}</figure>
            )}
          </div>
        )}
        {footnote && <p className="text-xs text-muted-foreground mt-4">{footnote}</p>}
      </CardContent>
    </Card>
  );
};
`,
  'LineChartCard.tsx': `import React from 'react';
import { ChartCard, ChartCardProps } from './ChartCard';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, Legend, ReferenceLine, Area } from 'recharts';
import { useChartTheme } from './chartTheme';
import { assignSeriesColors, splitPartialSegments, forecastBands, MAX_SERIES } from './logic/series';
import { useTranslation } from 'react-i18next';

export interface LineSeriesDef {
  key: string;
  name: string;
  isBenchmark?: boolean;
}

export interface LineChartCardProps extends Omit<ChartCardProps, 'children'> {
  data: any[];
  series: LineSeriesDef[];
  xAxisKey: string;
  focalKey?: string;
  showForecast?: boolean;
}

export const LineChartCard: React.FC<LineChartCardProps> = ({ data, series, xAxisKey, focalKey, showForecast, ...props }) => {
  const theme = useChartTheme();
  const { t } = useTranslation('data');
  
  const colors = assignSeriesColors(series.map(s => s.key), {
    focalKey,
    benchmarkKeys: series.filter(s => s.isBenchmark).map(s => s.key)
  });

  const chartData = showForecast ? forecastBands(data) : data;

  return (
    <ChartCard {...props}>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={theme.grid} />
          <XAxis dataKey={xAxisKey} tick={{ fill: theme.text, fontSize: 12 }} axisLine={false} tickLine={false} />
          <YAxis tick={{ fill: theme.text, fontSize: 12 }} axisLine={false} tickLine={false} />
          <RechartsTooltip contentStyle={{ backgroundColor: 'var(--background)', borderColor: theme.grid, color: 'var(--foreground)' }} />
          <Legend wrapperStyle={{ fontSize: '12px' }} />
          
          {series.map(s => {
            const assignment = colors[s.key];
            const colorIndex = parseInt(assignment.token.replace('chart-', '')) - 1;
            const color = theme.colors[colorIndex] || theme.colors[0];
            return (
              <Line
                key={s.key}
                type="monotone"
                dataKey={s.key}
                name={s.name}
                stroke={color}
                strokeWidth={assignment.dashed ? 1.5 : 2}
                strokeDasharray={assignment.dashed ? '4 4' : undefined}
                dot={false}
                activeDot={{ r: 4 }}
                connectNulls={false}
                isAnimationActive={false}
              />
            );
          })}
        </LineChart>
      </ResponsiveContainer>
    </ChartCard>
  );
};
`,
  'BarChartCard.tsx': `import React from 'react';
import { ChartCard, ChartCardProps } from './ChartCard';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, Legend, ReferenceLine, LabelList } from 'recharts';
import { useChartTheme } from './chartTheme';
import { assignSeriesColors } from './logic/series';

export interface BarChartCardProps extends Omit<ChartCardProps, 'children'> {
  data: any[];
  series: { key: string; name: string; isBenchmark?: boolean }[];
  yAxisKey: string;
  focalKey?: string;
  targets?: { value: number; label: string }[];
}

export const BarChartCard: React.FC<BarChartCardProps> = ({ data, series, yAxisKey, focalKey, targets, ...props }) => {
  const theme = useChartTheme();
  
  const colors = assignSeriesColors(series.map(s => s.key), {
    focalKey,
    benchmarkKeys: series.filter(s => s.isBenchmark).map(s => s.key)
  });

  return (
    <ChartCard {...props}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} layout="vertical" margin={{ top: 10, right: 30, left: 10, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke={theme.grid} />
          <XAxis type="number" tick={{ fill: theme.text, fontSize: 12 }} axisLine={false} tickLine={false} />
          <YAxis dataKey={yAxisKey} type="category" tick={{ fill: theme.text, fontSize: 12 }} axisLine={false} tickLine={false} width={100} />
          <RechartsTooltip contentStyle={{ backgroundColor: 'var(--background)', borderColor: theme.grid, color: 'var(--foreground)' }} />
          <Legend wrapperStyle={{ fontSize: '12px' }} />
          
          {targets && targets.map((t, i) => (
            <ReferenceLine key={i} x={t.value} stroke={theme.colors[5]} strokeDasharray="3 3">
              <span className="text-xs absolute top-0">{t.label}</span>
            </ReferenceLine>
          ))}

          {series.map(s => {
            const assignment = colors[s.key];
            const colorIndex = parseInt(assignment.token.replace('chart-', '')) - 1;
            const color = theme.colors[colorIndex] || theme.colors[0];
            return (
              <Bar key={s.key} dataKey={s.key} name={s.name} fill={color} isAnimationActive={false}>
                {series.length <= 3 && <LabelList dataKey={s.key} position="right" fill={theme.text} fontSize={12} />}
              </Bar>
            );
          })}
        </BarChart>
      </ResponsiveContainer>
    </ChartCard>
  );
};
`,
  'DataTableToolbar.tsx': `import React from 'react';
import { Input } from '../ui/input';

export const DataTableToolbar: React.FC<{
  globalFilter?: string;
  setGlobalFilter?: (val: string) => void;
  children?: React.ReactNode;
}> = ({ globalFilter, setGlobalFilter, children }) => {
  return (
    <div className="flex items-center justify-between py-4">
      <div className="flex flex-1 items-center space-x-2">
        {setGlobalFilter && (
          <Input
            placeholder="Search..."
            value={globalFilter ?? ''}
            onChange={(e) => setGlobalFilter(e.target.value)}
            className="h-8 w-[150px] lg:w-[250px]"
          />
        )}
      </div>
      <div className="flex items-center space-x-2">
        {children}
      </div>
    </div>
  );
};
`,
  'ColumnToggle.tsx': `import React from 'react';
import { DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '../ui/dropdown-menu';
import { Button } from '../ui/button';
import { SlidersHorizontal } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export const ColumnToggle: React.FC<{
  columns: { id: string; isVisible: boolean; toggleVisibility: (val: boolean) => void; header?: string }[];
}> = ({ columns }) => {
  const { t } = useTranslation('data');
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="ml-auto hidden h-8 lg:flex">
          <SlidersHorizontal className="mr-2 h-4 w-4" />
          {t('table.columns')}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[150px]">
        <DropdownMenuLabel>Toggle columns</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {columns.map((column) => (
          <DropdownMenuCheckboxItem
            key={column.id}
            className="capitalize"
            checked={column.isVisible}
            onCheckedChange={(value) => column.toggleVisibility(!!value)}
          >
            {column.header || column.id}
          </DropdownMenuCheckboxItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
`,
  'BulkActionBar.tsx': `import React from 'react';
import { Button } from '../ui/button';
import { useTranslation } from 'react-i18next';

export const BulkActionBar: React.FC<{
  selectedCount: number;
  onClear: () => void;
  actions: React.ReactNode;
}> = ({ selectedCount, onClear, actions }) => {
  const { t } = useTranslation('data');
  if (selectedCount === 0) return null;
  
  return (
    <div className="bg-primary/5 border border-primary/20 rounded-md p-2 flex items-center justify-between mb-4">
      <div className="flex items-center gap-4 text-sm">
        <span className="font-medium">{t('table.selected', { count: selectedCount })}</span>
        <Button variant="ghost" size="sm" onClick={onClear} className="h-6 px-2 text-xs">
          {t('table.clear_selection')}
        </Button>
      </div>
      <div className="flex items-center gap-2">
        {actions}
      </div>
    </div>
  );
};
`,
  'FilterBar.tsx': `import React, { useState } from 'react';
import { Button } from '../ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '../ui/sheet';
import { Filter } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { FilterChips } from './FilterChips';

export interface FilterBarProps {
  filters: Record<string, string | string[]>;
  onRemove: (key: string, value?: string) => void;
  onClear: () => void;
  children: React.ReactNode; // The inline form controls
  resultCount?: number;
}

export const FilterBar: React.FC<FilterBarProps> = ({ filters, onRemove, onClear, children, resultCount }) => {
  const { t } = useTranslation('data');
  const [open, setOpen] = useState(false);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="hidden md:flex flex-1 items-center gap-2 flex-wrap">
          {children}
        </div>
        
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <Button variant="outline" size="sm" className="md:hidden flex gap-2">
              <Filter className="h-4 w-4" />
              {t('filters.more')}
            </Button>
          </SheetTrigger>
          <SheetContent side="right">
            <SheetHeader>
              <SheetTitle>{t('filters.more')}</SheetTitle>
            </SheetHeader>
            <div className="mt-4 flex flex-col gap-4">
              {children}
            </div>
          </SheetContent>
        </Sheet>
      </div>

      <FilterChips filters={filters} onRemove={onRemove} onClear={onClear} />
      
      {resultCount !== undefined && (
        <div className="text-sm text-muted-foreground" aria-live="polite">
          {t('filters.results', { count: resultCount })}
        </div>
      )}
    </div>
  );
};
`,
  'DataTable.tsx': `import React from 'react';
import { flexRender, getCoreRowModel, useReactTable, getSortedRowModel, SortingState, ColumnDef } from '@tanstack/react-table';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Skeleton } from '../ui/skeleton';
import { ErrorState, EmptyState } from '../common';
import { useTranslation } from 'react-i18next';
import { shouldRenderCards } from './logic/responsive';
import { ariaSort } from './logic/sorting';
import { ArrowUpDown, ArrowUp, ArrowDown } from 'lucide-react';

export interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  state?: 'loading' | 'refetching' | 'empty' | 'no-results' | 'error' | 'ready';
  error?: any;
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
  const { t } = useTranslation('data');

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
                const meta = header.column.columnDef.meta as any;
                const align = meta?.align || 'left';
                const isSticky = meta?.sticky;
                
                return (
                  <TableHead 
                    key={header.id} 
                    className={\`
                      \${align === 'right' ? 'text-right tabular-nums' : align === 'center' ? 'text-center' : 'text-left'}
                      \${isSticky ? 'sticky left-0 bg-muted z-20 shadow-[1px_0_0_rgba(0,0,0,0.1)]' : ''}
                    \`}
                    scope="col"
                    aria-sort={header.column.getCanSort() ? ariaSort(header.column.getIsSorted() || 'none') : undefined}
                  >
                    {header.isPlaceholder ? null : (
                      <div className={\`flex items-center \${align === 'right' ? 'justify-end' : align === 'center' ? 'justify-center' : 'justify-start'}\`}>
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
                {columns.map((c, j) => (
                  <TableCell key={j}><Skeleton className="h-4 w-full" /></TableCell>
                ))}
              </TableRow>
            ))
          ) : table.getRowModel().rows?.length ? (
            table.getRowModel().rows.map((row) => (
              <TableRow
                key={row.id}
                data-state={row.getIsSelected() && "selected"}
                className={\`\${rowHeight} hover:bg-muted/50 transition-colors\`}
                aria-selected={row.getIsSelected()}
              >
                {row.getVisibleCells().map((cell) => {
                  const meta = cell.column.columnDef.meta as any;
                  const align = meta?.align || 'left';
                  const isSticky = meta?.sticky;
                  
                  return (
                    <TableCell 
                      key={cell.id}
                      className={\`
                        \${align === 'right' ? 'text-right tabular-nums' : align === 'center' ? 'text-center' : 'text-left'}
                        \${isSticky ? 'sticky left-0 bg-background z-10 shadow-[1px_0_0_rgba(0,0,0,0.1)]' : ''}
                        \${row.getIsSelected() && isSticky ? 'bg-primary/5' : ''}
                      \`}
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
        <div className="absolute top-0 left-0 w-full h-[2px] bg-primary animate-pulse" aria-busy="true" />
      )}
    </div>
  );
}
`,
  'index.ts': `export * from './DataTable';
export * from './DataTableToolbar';
export * from './ColumnToggle';
export * from './BulkActionBar';
export * from './Pagination';
export * from './FilterBar';
export * from './FilterChips';
export * from './ChartCard';
export * from './LineChartCard';
export * from './BarChartCard';
export * from './ProgressToTarget';
export * from './FactorBreakdown';
export * from './MapLegend';
export * from './chartTheme';
`
};

for (const [name, content] of Object.entries(files)) {
  fs.writeFileSync(path.join(dir, name), content);
}
console.log('Files created.');
