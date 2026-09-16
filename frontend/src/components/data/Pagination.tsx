import React from 'react';
import { useTranslation } from 'react-i18next';
import { Button, Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui';
import { pageRange, PAGE_SIZES } from './logic/pagination';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export interface PaginationProps {
  page: number;
  size: number;
  total: number;
  onPageChange: (page: number) => void;
  onSizeChange: (size: number) => void;
}

export const Pagination: React.FC<PaginationProps> = ({
  page,
  size,
  total,
  onPageChange,
  onSizeChange,
}) => {
  const { t } = useTranslation('data');
  const { from, to, total: rangeTotal } = pageRange(page, size, total);
  
  const totalPages = Math.max(1, Math.ceil(total / size));
  const hasPrev = page > 1;
  const hasNext = page < totalPages;

  return (
    <nav className="flex items-center justify-between px-2" aria-label={t('pagination.page')}>
      <div className="flex-1 text-sm text-muted-foreground tabular-nums">
        {t('pagination.range', { from, to, total: rangeTotal })}
      </div>
      <div className="flex items-center space-x-6 lg:space-x-8">
        <div className="flex items-center space-x-2">
          <p className="text-sm font-medium">{t('pagination.size')}</p>
          <Select
            value={size.toString()}
            onValueChange={(value) => onSizeChange(Number(value))}
          >
            <SelectTrigger className="h-8 w-[70px]">
              <SelectValue placeholder={size.toString()} />
            </SelectTrigger>
            <SelectContent side="top">
              {PAGE_SIZES.map((pageSize) => (
                <SelectItem key={pageSize} value={pageSize.toString()}>
                  {pageSize}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="flex w-[100px] items-center justify-center text-sm font-medium">
          {page} / {totalPages}
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            className="h-8 w-8 p-0"
            onClick={() => onPageChange(page - 1)}
            disabled={!hasPrev}
            aria-label={t('pagination.prev')}
          >
            <span className="sr-only">{t('pagination.prev')}</span>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            className="h-8 w-8 p-0"
            onClick={() => onPageChange(page + 1)}
            disabled={!hasNext}
            aria-label={t('pagination.next')}
          >
            <span className="sr-only">{t('pagination.next')}</span>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </nav>
  );
};
