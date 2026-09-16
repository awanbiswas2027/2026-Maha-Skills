import React from 'react';
import { useTranslation } from 'react-i18next';
import { Badge } from '../ui/badge';
import { X } from 'lucide-react';

export interface FilterChipsProps {
  filters: Record<string, string | string[]>;
  onRemove: (key: string, value?: string) => void;
  onClear: () => void;
}

export const FilterChips: React.FC<FilterChipsProps> = ({ filters, onRemove, onClear }) => {
  const { t } = useTranslation('data');
  const activeCount = Object.values(filters).reduce((acc, val) => acc + (Array.isArray(val) ? val.length : val ? 1 : 0), 0);

  if (activeCount === 0) return null;

  return (
    <div className="flex flex-wrap items-center gap-2 mt-2">
      {Object.entries(filters).map(([key, value]) => {
        if (!value) return null;
        if (Array.isArray(value)) {
          return value.map((v) => (
            <Badge key={`${key}-${v}`} variant="neutral" className="px-2 py-0.5 font-normal flex items-center gap-1">
              <span>{key}: {v}</span>
              <button
                type="button"
                className="hover:bg-muted p-0.5 rounded"
                onClick={() => onRemove(key, v)}
                aria-label={`Remove ${key} filter`}
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          ));
        }
        return (
          <Badge key={key} variant="neutral" className="px-2 py-0.5 font-normal flex items-center gap-1">
            <span>{key}: {value}</span>
            <button
              type="button"
              className="hover:bg-muted p-0.5 rounded"
              onClick={() => onRemove(key)}
              aria-label={`Remove ${key} filter`}
            >
              <X className="h-3 w-3" />
            </button>
          </Badge>
        );
      })}
      {activeCount > 1 && (
        <button
          type="button"
          className="text-xs text-muted-foreground hover:text-foreground transition-colors px-2 py-1"
          onClick={onClear}
        >
          {t('filters.clear')}
        </button>
      )}
    </div>
  );
};
