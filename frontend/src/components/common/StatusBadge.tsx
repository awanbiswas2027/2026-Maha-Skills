
import { useTranslation } from 'react-i18next';
import { Info, TriangleAlert, CircleCheck, OctagonAlert } from 'lucide-react';
import { cn } from '../../lib/utils';
import type { WorkflowStatus } from '../../types/ui';

export interface StatusBadgeSpec {
  variant: 'neutral' | 'info' | 'warning' | 'success' | 'danger';
  glyph: 'none' | 'Info' | 'TriangleAlert' | 'CircleCheck' | 'OctagonAlert';
  labelKey: string;
  className: string;
}

export function statusBadgeSpec(status: WorkflowStatus): StatusBadgeSpec {
  const labelKey = `status.${status.toLowerCase()}`;
  switch (status) {
    case 'DRAFT':
      return {
        variant: 'neutral',
        glyph: 'none',
        labelKey,
        className: 'bg-muted text-muted-foreground border-border',
      };
    case 'SSC_REVIEW':
    case 'DSEEI_APPROVAL':
    case 'UNDER_REVIEW':
    case 'VALIDATING':
      return {
        variant: 'info',
        glyph: 'Info',
        labelKey,
        className: 'bg-info-subtle text-info-foreground border-info/30',
      };
    case 'CHANGES_REQUESTED':
      return {
        variant: 'warning',
        glyph: 'TriangleAlert',
        labelKey,
        className: 'bg-warning-subtle text-warning-foreground border-warning/30',
      };
    case 'APPROVED':
    case 'PUBLISHED':
    case 'COMPLETED':
    case 'ACTIVE':
      return {
        variant: 'success',
        glyph: 'CircleCheck',
        labelKey,
        className: 'bg-success-subtle text-success-foreground border-success/30',
      };
    case 'REJECTED':
    case 'FAILED':
      return {
        variant: 'danger',
        glyph: 'OctagonAlert',
        labelKey,
        className: 'bg-danger-subtle text-danger-foreground border-danger/30',
      };
    default:
      return {
        variant: 'neutral',
        glyph: 'none',
        labelKey,
        className: 'bg-muted text-muted-foreground border-border',
      };
  }
}

export interface StatusBadgeProps {
  status: WorkflowStatus | string;
  className?: string;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, className }) => {
  const { t } = useTranslation();
  const normalized = (status as WorkflowStatus) || 'DRAFT';
  const spec = statusBadgeSpec(normalized);

  const iconMap = {
    none: null,
    Info: <Info className="h-3 w-3 shrink-0" aria-hidden="true" />,
    TriangleAlert: <TriangleAlert className="h-3 w-3 shrink-0" aria-hidden="true" />,
    CircleCheck: <CircleCheck className="h-3 w-3 shrink-0" aria-hidden="true" />,
    OctagonAlert: <OctagonAlert className="h-3 w-3 shrink-0" aria-hidden="true" />,
  };

  const label = t(spec.labelKey, normalized);

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-sm border px-2 py-0.5 text-xs font-medium [html[lang=mr]_&]:text-sm [html[lang=hi]_&]:text-sm transition-colors',
        spec.className,
        className
      )}
      role="status"
    >
      {iconMap[spec.glyph]}
      <span>{label}</span>
    </span>
  );
};
