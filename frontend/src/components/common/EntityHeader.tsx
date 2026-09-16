
import { MoreVertical } from 'lucide-react';
import { cn } from '../../lib/utils';
import { Button } from '../ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';

export interface EntityCode {
  label: string;
  value: string;
}

export interface EntityHeaderProps {
  title: string;
  breadcrumb?: React.ReactNode;
  codes?: EntityCode[];
  status?: React.ReactNode;
  scope?: string;
  updatedAt?: string;
  primaryAction?: React.ReactNode;
  secondaryActions?: React.ReactNode[];
  overflowActions?: React.ReactNode[];
  className?: string;
}

export const EntityHeader: React.FC<EntityHeaderProps> = ({
  title,
  breadcrumb,
  codes,
  status,
  scope,
  updatedAt,
  primaryAction,
  secondaryActions = [],
  overflowActions = [],
  className,
}) => {
  return (
    <div className={cn('flex flex-col gap-4 pb-4 border-b border-border', className)}>
      {breadcrumb && <div className="mb-1">{breadcrumb}</div>}

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Title and metadata */}
        <div className="flex flex-col gap-2">
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="text-2xl font-semibold leading-tight text-foreground tracking-tight">
              {title}
            </h1>
            {status}
          </div>

          <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
            {codes && codes.map((c, i) => (
              <span key={i} className="font-mono bg-muted px-1.5 py-0.5 rounded text-foreground">
                {c.label}: {c.value}
              </span>
            ))}
            {scope && <span>Scope: {scope}</span>}
            {updatedAt && <span>Updated: {updatedAt}</span>}
          </div>
        </div>

        {/* Actions bar */}
        <div className="flex flex-wrap items-center gap-2 max-md:w-full">
          {/* Below md: primary action is full width */}
          {primaryAction && (
            <div className="max-md:w-full flex-1 sm:flex-initial">
              {primaryAction}
            </div>
          )}

          {secondaryActions.map((action, i) => (
            <div key={i}>{action}</div>
          ))}

          {overflowActions.length > 0 && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="icon" aria-label="More actions">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {overflowActions.map((item, idx) => (
                  <div key={idx}>{item}</div>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </div>
    </div>
  );
};
