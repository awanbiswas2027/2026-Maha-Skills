import React from 'react';
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
