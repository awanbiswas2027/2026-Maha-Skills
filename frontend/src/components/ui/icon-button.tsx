import * as React from 'react';
import { Button, type ButtonProps } from './button';
import { Tooltip, TooltipContent, TooltipTrigger } from './tooltip';
import { cn } from '../../lib/utils';

export interface IconButtonProps extends Omit<ButtonProps, 'size'> {
  label: string;
  icon?: React.ReactNode;
  size?: 'default' | 'sm' | 'lg';
  tooltipSide?: 'top' | 'right' | 'bottom' | 'left';
}

export const IconButton = React.forwardRef<HTMLButtonElement, IconButtonProps>(
  ({ label, icon, className, size = 'default', tooltipSide = 'top', children, ...props }, ref) => {
    const sizeClasses = {
      sm: 'h-9 w-9 min-h-[36px] min-w-[36px]',
      default: 'h-10 w-10 min-h-[40px] min-w-[40px]',
      lg: 'h-11 w-11 min-h-[44px] min-w-[44px]',
    };

    const button = (
      <Button
        ref={ref}
        size="icon"
        aria-label={label}
        className={cn(sizeClasses[size], className)}
        {...props}
      >
        {icon ?? children}
      </Button>
    );

    return (
      <Tooltip>
        <TooltipTrigger asChild>{button}</TooltipTrigger>
        <TooltipContent side={tooltipSide}>{label}</TooltipContent>
      </Tooltip>
    );
  }
);
IconButton.displayName = 'IconButton';
