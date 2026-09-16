import React from 'react';
import { useTranslation } from 'react-i18next';

export interface BrandLogoProps {
  size?: number;
  variant?: 'mark' | 'lockup';
  showDepartment?: boolean;
  className?: string;
}

export const BrandLogo: React.FC<BrandLogoProps> = ({
  size = 32,
  variant = 'mark',
  showDepartment = true,
  className = '',
}) => {
  const { t } = useTranslation();
  const brandName = t('brand.name', 'MahaSkills');
  const deptName = t('app.dept', 'महाराष्ट्र शासन · कौशल्य विभाग');

  const mark = (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label={brandName}
      className="shrink-0"
    >
      <title>{brandName}</title>
      <rect x="4" y="18" width="6" height="12" rx="1.5" fill="hsl(var(--primary))" />
      <rect x="13" y="11" width="6" height="19" rx="1.5" fill="hsl(var(--primary))" />
      <rect x="22" y="6" width="6" height="24" rx="1.5" fill="hsl(var(--primary))" />
      <polygon points="25,0 28,3 25,6 22,3" fill="hsl(var(--accent))" />
    </svg>
  );

  if (variant === 'mark') {
    return <span className={`inline-flex items-center ${className}`}>{mark}</span>;
  }

  return (
    <div className={`inline-flex items-center gap-3 ${className}`}>
      {mark}
      <div className="flex flex-col">
        <span className="text-lg font-bold leading-tight text-foreground">{brandName}</span>
        {showDepartment && (
          <span className="text-xs text-muted-foreground hidden sm:block leading-tight">{deptName}</span>
        )}
      </div>
    </div>
  );
};
