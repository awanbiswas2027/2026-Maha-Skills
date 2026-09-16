import React, { useState } from 'react';
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
          <SheetContent>
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
