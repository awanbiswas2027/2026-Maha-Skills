import React from 'react';
import { useTranslation } from 'react-i18next';
import { AlertOctagon, RotateCcw, Copy, Check } from 'lucide-react';
import { cn } from '../../lib/utils';
import { mapApiError } from '../../lib/errors';
import { Button } from '../ui/button';

export interface ErrorStateProps {
  error: unknown;
  onRetry?: () => void;
  className?: string;
}

export const ErrorState: React.FC<ErrorStateProps> = ({
  error,
  onRetry,
  className,
}) => {
  const { t } = useTranslation();
  const [copied, setCopied] = React.useState(false);
  const mapped = mapApiError(error);

  const title = t(mapped.titleKey, t('errors.UNKNOWN.title', 'An error occurred'));
  const description = t(mapped.descriptionKey, t('errors.UNKNOWN.description', 'Please try again later.'));

  const handleCopyTrace = () => {
    if (mapped.traceId) {
      navigator.clipboard.writeText(mapped.traceId);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center p-8 text-center max-w-md mx-auto my-6 rounded-lg border border-destructive/30 bg-danger-subtle text-card-foreground',
        className
      )}
      role="alert"
    >
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-destructive/10 text-destructive mb-4">
        <AlertOctagon className="h-6 w-6" />
      </div>
      <h3 className="text-base font-semibold text-foreground mb-1">
        {title}
      </h3>
      <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
        {description}
      </p>

      {mapped.traceId && (
        <div className="flex items-center gap-2 mb-4 px-3 py-1.5 rounded-md bg-muted/70 text-xs font-mono text-muted-foreground border border-border">
          <span>Trace ID: {mapped.traceId}</span>
          <button
            type="button"
            onClick={handleCopyTrace}
            aria-label="Copy trace ID"
            className="hover:text-foreground p-0.5"
          >
            {copied ? <Check className="h-3.5 w-3.5 text-success" /> : <Copy className="h-3.5 w-3.5" />}
          </button>
        </div>
      )}

      {onRetry && (
        <Button
          variant="outline"
          onClick={onRetry}
          className="gap-2"
        >
          <RotateCcw className="h-4 w-4" />
          <span>{t('common.retry', 'Try again')}</span>
        </Button>
      )}
    </div>
  );
};
