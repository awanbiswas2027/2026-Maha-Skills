
import { useTranslation } from 'react-i18next';
import {
  FileSearch,
  Inbox,
  Clock,
  Ban,
  CheckCircle,
} from 'lucide-react';
import { cn } from '../../lib/utils';
import type { EmptyStateType } from '../../types/ui';

export interface EmptyStateProps {
  type?: EmptyStateType;
  title?: string;
  description?: string;
  action?: React.ReactNode;
  icon?: React.ComponentType<{ className?: string }>;
  className?: string;
}

const defaultIcons: Record<EmptyStateType, React.ComponentType<{ className?: string }>> = {
  'first-use': Inbox,
  'no-results': FileSearch,
  'not-ready': Clock,
  'not-applicable': Ban,
  cleared: CheckCircle,
};

export const EmptyState: React.FC<EmptyStateProps> = ({
  type = 'no-results',
  title,
  description,
  action,
  icon: CustomIcon,
  className,
}) => {
  const { t } = useTranslation();
  const Icon = CustomIcon ?? defaultIcons[type];

  const resolvedTitle = title ?? t(`empty.${type}.title`, 'No items found');
  const resolvedDesc = description ?? t(`empty.${type}.desc`, 'There is nothing to display here yet.');

  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center p-8 text-center max-w-sm mx-auto my-6 rounded-lg border border-dashed border-border bg-card/50',
        className
      )}
      role="status"
    >
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted text-muted-foreground mb-4">
        <Icon className="h-6 w-6" />
      </div>
      <h3 className="text-base font-semibold text-foreground mb-1">
        {resolvedTitle}
      </h3>
      <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
        {resolvedDesc}
      </p>
      {action && <div className="mt-1">{action}</div>}
    </div>
  );
};
