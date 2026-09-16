import { UserRole } from '../types';

export interface NavItem {
  key: string;
  href: string;
  icon: string;
  status?: 'planned';
}

export const NAV_CONFIG: Record<UserRole, NavItem[]> = {
  POLICY_MAKER: [
    { key: 'dashboard', href: '/dashboard/policy-maker', icon: 'LayoutDashboard' },
    { key: 'approvals', href: '/recommendations/approvals', icon: 'CheckSquare' },
    { key: 'budget', href: '/district-plans/budget-model', icon: 'IndianRupee', status: 'planned' },
    { key: 'analytics', href: '/analytics/lmi', icon: 'LineChart', status: 'planned' },
    { key: 'gap-analysis', href: '/gap-analysis', icon: 'AlertTriangle' },
  ],
  DISTRICT_OFFICER: [
    { key: 'workbench', href: '/dashboard/district-officer', icon: 'LayoutDashboard' },
    { key: 'plans', href: '/district-plans', icon: 'Map' },
    { key: 'monitoring', href: '/placements/benchmarks', icon: 'Activity', status: 'planned' },
    { key: 'equipment', href: '/district-plans/equipment-deficits', icon: 'Wrench', status: 'planned' },
    { key: 'gap-analysis', href: '/gap-analysis', icon: 'AlertTriangle' },
  ],
  ITI_PRINCIPAL: [
    { key: 'overview', href: '/dashboard/iti', icon: 'LayoutDashboard' },
    { key: 'upload', href: '/placements/upload', icon: 'Upload' },
    { key: 'performance', href: '/courses/performance', icon: 'TrendingUp', status: 'planned' },
    { key: 'assets', href: '/iti/assets', icon: 'Archive', status: 'planned' },
  ],
  SSC_REVIEWER: [
    { key: 'workbench', href: '/recommendations/review-queue', icon: 'Inbox' },
    { key: 'dossier', href: '/recommendations/1/dossier', icon: 'FileText', status: 'planned' },
    { key: 'taxonomy', href: '/taxonomy/roles', icon: 'Network', status: 'planned' },
  ],
  EMPLOYER: [
    { key: 'dashboard', href: '/employer/dashboard', icon: 'LayoutDashboard' },
    { key: 'needs', href: '/employer/skill-needs', icon: 'ClipboardList', status: 'planned' },
    { key: 'reviews', href: '/employer/curriculum-reviews', icon: 'MessageSquare', status: 'planned' },
    { key: 'surveys', href: '/employer/surveys', icon: 'PieChart', status: 'planned' },
  ],
  ADMIN: [
    { key: 'dashboard', href: '/admin', icon: 'Shield' },
    { key: 'taxonomy', href: '/taxonomy', icon: 'Network', status: 'planned' },
    { key: 'logs', href: '/admin/audit-logs', icon: 'FileCode', status: 'planned' },
  ],
  CANDIDATE: [
    { key: 'dashboard', href: '/candidate/dashboard', icon: 'LayoutDashboard' },
    { key: 'courses', href: '/candidate/courses', icon: 'Search' },
    { key: 'pathway', href: '/candidate/pathway', icon: 'Compass' },
  ]
};
