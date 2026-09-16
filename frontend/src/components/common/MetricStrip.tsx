import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowUp, ArrowDown } from 'lucide-react';
import { cn } from '../../lib/utils';
import { formatDelta, type SupportedLang } from '../../lib/format';
import { useTranslation } from 'react-i18next';
import { Skeleton } from '../ui/skeleton';
import type { GoodDirection } from '../../types/ui';

export function deltaTone(
  delta: number,
  goodDirection: GoodDirection = 'up'
): 'success' | 'destructive' | 'neutral' {
  if (delta === 0) return 'neutral';
  const isUp = delta > 0;
  if (goodDirection === 'up') {
    return isUp ? 'success' : 'destructive';
  } else {
    return isUp ? 'destructive' : 'success';
  }
}

export interface MetricItem {
  label: string;
  value: string | number;
  unit?: string;
  delta?: number;
  comparisonLabel?: string;
  goodDirection?: GoodDirection;
  href?: string;
  loading?: boolean;
  partial?: boolean;
}

export interface MetricStripProps {
  metrics: MetricItem[];
  className?: string;
}

export const MetricStrip: React.FC<MetricStripProps> = ({ metrics, className }) => {
  const { i18n } = useTranslation();
  const lang = (i18n.language?.slice(0, 2) as SupportedLang) || 'en';
  return (
    <div
      className={cn(
        'grid w-full rounded-lg border border-border bg-card shadow-xs overflow-hidden',
        metrics.length === 2 && 'grid-cols-1 sm:grid-cols-2 divide-y sm:divide-y-0 sm:divide-x divide-border',
        metrics.length === 3 && 'grid-cols-1 sm:grid-cols-3 divide-y sm:divide-y-0 sm:divide-x divide-border',
        metrics.length >= 4 && 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 divide-y sm:divide-y-0 sm:divide-x divide-border',
        className
      )}
    >
      {metrics.map((metric, idx) => {
        const isPrimary = idx === 0;

        if (metric.loading) {
          return (
            <div key={idx} className="p-5 flex flex-col gap-2">
              <Skeleton className="h-4 w-24" />
              <Skeleton className={isPrimary ? 'h-9 w-32' : 'h-8 w-28'} />
              <Skeleton className="h-3 w-20" />
            </div>
          );
        }

        const tone = metric.delta !== undefined ? deltaTone(metric.delta, metric.goodDirection) : 'neutral';
        const toneClasses = {
          success: 'text-success-subtle-foreground font-medium',
          destructive: 'text-danger-subtle-foreground font-medium',
          neutral: 'text-muted-foreground',
        };

        const content = (
          <div className="flex flex-col justify-between h-full p-5 hover:bg-muted/30 transition-colors">
            <div className="flex items-center justify-between text-sm text-muted-foreground mb-1">
              <span className="font-medium truncate">{metric.label}</span>
              {metric.partial && (
                <span className="text-xs text-warning" title="Partial data">*</span>
              )}
            </div>

            <div className="flex items-baseline gap-1.5 my-1">
              <span
                className={cn(
                  'font-semibold tabular-nums text-foreground tracking-tight',
                  isPrimary ? 'text-3xl' : 'text-2xl'
                )}
              >
                {metric.value}
              </span>
              {metric.unit && (
                <span className="text-sm font-normal text-muted-foreground">{metric.unit}</span>
              )}
            </div>

            {metric.delta !== undefined && (
              <div className="flex items-center gap-1.5 text-xs mt-2">
                <span className={cn('inline-flex items-center gap-0.5', toneClasses[tone])}>
                  {metric.delta > 0 ? (
                    <ArrowUp className="h-3.5 w-3.5" />
                  ) : metric.delta < 0 ? (
                    <ArrowDown className="h-3.5 w-3.5" />
                  ) : null}
                  <span>{formatDelta(metric.delta, lang)}</span>
                </span>
                {metric.comparisonLabel && (
                  <span className="text-muted-foreground">{metric.comparisonLabel}</span>
                )}
              </div>
            )}
          </div>
        );

        if (metric.href) {
          return (
            <Link
              key={idx}
              to={metric.href}
              className="block h-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded-sm"
              aria-label={`${metric.label}: ${metric.value} ${metric.unit || ''}`}
            >
              {content}
            </Link>
          );
        }

        return <div key={idx}>{content}</div>;
      })}
    </div>
  );
};
