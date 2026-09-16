
import { useTranslation } from 'react-i18next';
import { Clock, AlertTriangle } from 'lucide-react';
import { cn } from '../../lib/utils';

export interface DataFreshnessProps {
  sources: string[];
  asOf: string;
  runId?: string;
  completeness?: string;
  staleDays?: number;
  className?: string;
}

export const DataFreshness: React.FC<DataFreshnessProps> = ({
  sources,
  asOf,
  runId,
  completeness,
  staleDays = 0,
  className,
}) => {
  const { t } = useTranslation();
  const isStale = staleDays > 8;

  return (
    <div
      className={cn(
        'flex flex-wrap items-center gap-2 text-xs py-1 px-2.5 rounded-md border transition-colors',
        isStale
          ? 'bg-warning-subtle text-warning-foreground border-warning/40'
          : 'bg-muted/50 text-muted-foreground border-border',
        className
      )}
    >
      <div className="flex items-center gap-1 font-medium">
        {isStale ? (
          <AlertTriangle className="h-3.5 w-3.5 text-warning shrink-0" />
        ) : (
          <Clock className="h-3.5 w-3.5 shrink-0" />
        )}
        <span>{t('common.asOf', 'As of')}: {asOf}</span>
      </div>

      <span className="text-border">|</span>

      <span>
        {t('common.sources', 'Sources')}: {sources.join(', ')}
      </span>

      {completeness && (
        <>
          <span className="text-border">|</span>
          <span>{completeness}</span>
        </>
      )}

      {runId && (
        <>
          <span className="text-border">|</span>
          <span className="font-mono text-[10px] opacity-75">ID: {runId}</span>
        </>
      )}

      {isStale && (
        <span className="font-semibold text-warning ml-auto">
          {t('common.staleWarning', 'Data stale (> 8 days)')}
        </span>
      )}
    </div>
  );
};
