import React, { useState } from 'react';
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
