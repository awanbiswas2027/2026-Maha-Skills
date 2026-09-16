import * as React from 'react';
import { cn } from '../../lib/utils';

export interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  shape?: 'line' | 'kpi' | 'row' | 'chart';
}

const shapeClasses: Record<NonNullable<SkeletonProps['shape']>, string> = {
  line: 'h-4 w-full rounded-md',
  kpi: 'h-24 w-full rounded-lg',
  row: 'h-10 w-full rounded-md',
  chart: 'h-64 w-full rounded-lg',
};

function Skeleton({ className, shape = 'line', ...props }: SkeletonProps) {
  return (
    <div
      className={cn(
        'bg-muted motion-safe:animate-pulse',
        shapeClasses[shape],
        className
      )}
      aria-hidden="true"
      {...props}
    />
  );
}

export interface DelayedSkeletonProps extends SkeletonProps {
  delayMs?: number;
}

/**
 * DelayedSkeleton helper (STA-01)
 * Suppresses skeleton flicker by rendering nothing for the first 300ms.
 */
function DelayedSkeleton({ delayMs = 300, ...props }: DelayedSkeletonProps) {
  const [visible, setVisible] = React.useState(false);

  React.useEffect(() => {
    const timer = setTimeout(() => setVisible(true), delayMs);
    return () => clearTimeout(timer);
  }, [delayMs]);

  if (!visible) {
    return null;
  }

  return <Skeleton {...props} />;
}

export { Skeleton, DelayedSkeleton };
