import React from 'react';
import { cn } from '../../lib/utils';

export interface StatusBadgeProps {
  status: string;
  className?: string;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, className }) => {
  const normalized = status.toUpperCase();

  let colorClasses = 'bg-muted text-muted-foreground border-border';
  if (normalized === 'ACTIVE' || normalized === 'APPROVED' || normalized === 'COMPLETED') {
    colorClasses = 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950 dark:text-emerald-300';
  } else if (normalized === 'CRITICAL' || normalized === 'REJECTED') {
    colorClasses = 'bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950 dark:text-rose-300';
  } else if (normalized === 'HIGH' || normalized === 'UNDER_REVIEW' || normalized === 'VALIDATING') {
    colorClasses = 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950 dark:text-amber-300';
  }

  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold',
        colorClasses,
        className
      )}
    >
      {status}
    </span>
  );
};
