import React from 'react';
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
