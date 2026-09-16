import React from 'react';
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
