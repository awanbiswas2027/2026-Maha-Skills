import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { Info, CheckCircle2, AlertTriangle, AlertOctagon } from 'lucide-react';
import { cn } from '../../lib/utils';
import type { AlertVariant } from '../../types/ui';

const alertVariants = cva(
  'relative w-full rounded-lg border p-4 text-sm [&>svg+div]:translate-y-[-3px] [&>svg]:absolute [&>svg]:left-4 [&>svg]:top-4 [&>svg]:text-foreground [&>svg~*]:pl-7',
  {
    variants: {
      variant: {
        info: 'bg-info-subtle text-info-foreground border-info/20 [&>svg]:text-info-foreground',
        success: 'bg-success-subtle text-success-foreground border-success/20 [&>svg]:text-success-foreground',
        warning: 'bg-warning-subtle text-warning-foreground border-warning/20 [&>svg]:text-warning-foreground',
        danger: 'bg-danger-subtle text-danger-foreground border-danger/20 [&>svg]:text-danger-foreground',
      },
    },
    defaultVariants: {
      variant: 'info',
    },
  }
);

export interface AlertProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, 'title'>,
    VariantProps<typeof alertVariants> {
  variant?: AlertVariant;
  title?: React.ReactNode;
  action?: React.ReactNode;
  blocking?: boolean;
}

const iconMap: Record<AlertVariant, React.ComponentType<{ className?: string }>> = {
  info: Info,
  success: CheckCircle2,
  warning: AlertTriangle,
  danger: AlertOctagon,
};

const Alert = React.forwardRef<HTMLDivElement, AlertProps>(
  ({ className, variant = 'info', title, action, blocking = false, children, ...props }, ref) => {
    const Icon = iconMap[variant ?? 'info'];
    const role = variant === 'danger' && blocking ? 'alert' : 'status';

    return (
      <div
        ref={ref}
        role={role}
        aria-live={variant === 'danger' && blocking ? 'assertive' : 'polite'}
        className={cn(alertVariants({ variant }), className)}
        {...props}
      >
        <Icon className="h-4 w-4" />
        <div className="flex flex-col gap-1">
          {title && <h5 className="font-semibold leading-none tracking-tight">{title}</h5>}
          {children && <div className="text-sm leading-relaxed opacity-90">{children}</div>}
          {action && <div className="mt-2">{action}</div>}
        </div>
      </div>
    );
  }
);
Alert.displayName = 'Alert';

export { Alert, alertVariants };
