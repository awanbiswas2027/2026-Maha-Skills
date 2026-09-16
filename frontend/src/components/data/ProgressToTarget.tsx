import React from 'react';
import { useTranslation } from 'react-i18next';
import { progressTone, meterAria } from './logic/progress';

export interface ProgressToTargetProps {
  value: number;
  target?: number;
  label?: string;
}

export const ProgressToTarget: React.FC<ProgressToTargetProps> = ({
  value,
  target,
  label,
}) => {
  const { t } = useTranslation('data');
  const tone = progressTone(value);
  const aria = meterAria(value, target);
  
  
  return (
    <div className="flex flex-col gap-1.5 w-full">
      <div className="flex items-center justify-between text-sm">
        <span className="font-medium text-foreground">{label}</span>
        <span className="tabular-nums text-muted-foreground">{value}%</span>
      </div>
      <div className="relative h-2 w-full overflow-hidden rounded-full bg-muted" {...aria}>
        <div
          className={`h-full transition-all ${tone === 'danger' ? 'bg-destructive' : tone === 'success' ? 'bg-[#10b981]' : 'bg-primary'}`}
          style={{ width: `${Math.min(100, Math.max(0, value))}%` }}
        />
        {target !== undefined && (
          <div
            className="absolute top-0 bottom-0 w-[2px] bg-foreground"
            style={{ left: `${Math.min(100, Math.max(0, target))}%` }}
            title={t('progress.target', { value: target })}
          />
        )}
      </div>
    </div>
  );
};
