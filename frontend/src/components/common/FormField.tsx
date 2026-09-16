import React from 'react';
import { OctagonAlert } from 'lucide-react';
import { cn } from '../../lib/utils';
import { Label } from '../ui/label';

export interface FieldAriaResult {
  id: string;
  'aria-describedby'?: string;
  'aria-invalid'?: boolean;
  'aria-required'?: boolean;
}

export function fieldAria(
  id: string,
  options: { error?: string; helper?: string; required?: boolean }
): FieldAriaResult {
  const describedByParts: string[] = [];
  if (options.error) describedByParts.push(`${id}-error`);
  if (options.helper) describedByParts.push(`${id}-helper`);

  return {
    id,
    'aria-describedby': describedByParts.length > 0 ? describedByParts.join(' ') : undefined,
    'aria-invalid': options.error ? true : undefined,
    'aria-required': options.required ? true : undefined,
  };
}

export interface FormFieldProps {
  id: string;
  label: string;
  helper?: string;
  error?: string;
  required?: boolean;
  children:
    | React.ReactNode
    | ((props: FieldAriaResult) => React.ReactNode);
  className?: string;
}

export const FormField: React.FC<FormFieldProps> = ({
  id,
  label,
  helper,
  error,
  required,
  children,
  className,
}) => {
  const ariaProps = fieldAria(id, { error, helper, required });

  return (
    <div className={cn('flex flex-col space-y-1.5', className)}>
      <div className="flex items-center justify-between">
        <Label htmlFor={id} className="text-sm font-medium text-foreground">
          {label}
          {required && (
            <span className="text-destructive ml-1" aria-hidden="true">
              *
            </span>
          )}
        </Label>
      </div>

      {helper && (
        <p id={`${id}-helper`} className="text-xs text-muted-foreground leading-normal">
          {helper}
        </p>
      )}

      <div>
        {typeof children === 'function' ? children(ariaProps) : children}
      </div>

      {error && (
        <p
          id={`${id}-error`}
          role="alert"
          className="flex items-center gap-1 text-xs font-medium text-destructive mt-1"
        >
          <OctagonAlert className="h-3.5 w-3.5 shrink-0" />
          <span>{error}</span>
        </p>
      )}
    </div>
  );
};
