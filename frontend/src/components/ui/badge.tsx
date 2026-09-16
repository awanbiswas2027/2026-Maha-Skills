import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../../lib/utils';

const badgeVariants = cva(
  'inline-flex items-center rounded-sm px-2 py-0.5 text-xs font-medium h-5 transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 [html[lang=mr]_&]:text-sm [html[lang=hi]_&]:text-sm',
  {
    variants: {
      variant: {
        neutral: 'bg-muted text-muted-foreground border border-border',
        outline: 'text-foreground border border-border',
        info: 'bg-info-subtle text-info-foreground border border-info/20',
      },
    },
    defaultVariants: {
      variant: 'neutral',
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}

export { Badge, badgeVariants };
