
import { useTranslation } from 'react-i18next';
import { AlertTriangle, AlertOctagon } from 'lucide-react';
import { cn } from '../../lib/utils';
import type { GapSeverity } from '../../types/ui';

export interface SeveritySpec {
  badgeClass: string;
  bgClass: string;
  textClass: string;
  labelKey: string;
  glyph: 'none' | 'TriangleAlert' | 'OctagonAlert';
}

export function severitySpec(severity: GapSeverity): SeveritySpec {
  const lower = severity.toLowerCase();
  switch (severity) {
    case 'LOW':
      return {
        badgeClass: 'bg-gap-low text-gap-low-foreground border-gap-low/40',
        bgClass: 'bg-gap-low',
        textClass: 'text-gap-low-foreground',
        labelKey: `gap.severity.${lower}`,
        glyph: 'none',
      };
    case 'MEDIUM':
      return {
        badgeClass: 'bg-gap-medium text-gap-medium-foreground border-gap-medium/40',
        bgClass: 'bg-gap-medium',
        textClass: 'text-gap-medium-foreground',
        labelKey: `gap.severity.${lower}`,
        glyph: 'TriangleAlert',
      };
    case 'HIGH':
      return {
        badgeClass: 'bg-gap-high text-gap-high-foreground border-gap-high/40',
        bgClass: 'bg-gap-high',
        textClass: 'text-gap-high-foreground',
        labelKey: `gap.severity.${lower}`,
        glyph: 'OctagonAlert',
      };
  }
}

export interface SeverityBadgeProps {
  severity: GapSeverity;
  score?: number;
  className?: string;
}

export const SeverityBadge: React.FC<SeverityBadgeProps> = ({
  severity,
  score,
  className,
}) => {
  const { t } = useTranslation();
  const spec = severitySpec(severity);

  const iconMap = {
    none: null,
    TriangleAlert: <AlertTriangle className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />,
    OctagonAlert: <AlertOctagon className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />,
  };

  const label = t(spec.labelKey, severity);
  const displayText = score !== undefined ? `${score} · ${label}` : label;
  const ariaText = score !== undefined ? `${score}, ${label}` : label;

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-sm border px-2 py-0.5 text-xs font-semibold [html[lang=mr]_&]:text-sm [html[lang=hi]_&]:text-sm shadow-xs',
        spec.badgeClass,
        className
      )}
      aria-label={ariaText}
    >
      {iconMap[spec.glyph]}
      <span>{displayText}</span>
    </span>
  );
};
