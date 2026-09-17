
import { createBrowserRouter } from 'react-router-dom';
import { PublicShell } from '../components/layout/PublicShell';
import { AppShell } from '../components/layout/AppShell';
import { CandidateShell } from '../components/layout/CandidateShell';

import { LandingPage } from '../features/landing/LandingPage';
import { CourseFinder, PathwayQuiz } from '../features/candidates';
import { DashboardView, GapAnalysisView } from '../features/gap-scoring';

import { RoleGuard } from '../features/auth/RoleGuard';
import { TenantScopeGuard } from '../features/auth/TenantScopeGuard';

import { NotFoundPage } from '../features/errors/NotFoundPage';
import { ForbiddenPage } from '../features/errors/ForbiddenPage';
import { ScopeDeniedPage } from '../features/errors/ScopeDeniedPage';
import { ComingSoonPage } from '../features/errors/ComingSoonPage';
import { DashboardRedirect, RecommendationsRedirect } from './RoleRedirects';

export const router = createBrowserRouter([
  // Public Shell
  {
    path: '/',
    element: <PublicShell />,
    children: [
      { index: true, element: <LandingPage /> },
      { path: 'accessibility', element: <ComingSoonPage /> },
      { path: 'privacy', element: <ComingSoonPage /> },
      { path: 'terms', element: <ComingSoonPage /> },
      { path: 'contact', element: <ComingSoonPage /> },
      { path: 'sitemap', element: <ComingSoonPage /> },
    ],
  },
  // Candidate Shell
  {
    path: '/candidate',
    element: <CandidateShell />,
    children: [
      { path: 'courses', element: <CourseFinder /> },
      { path: 'pathway', element: <PathwayQuiz /> },
      { path: 'dashboard', element: <ComingSoonPage /> },
    ],
  },
  // Government / Authenticated App Shell
  {
    path: '/',
    element: <AppShell />,
    children: [
      { path: 'dashboard', element: <DashboardRedirect /> },
      { path: 'dashboard/policy-maker', element: <RoleGuard allowedRoles={['POLICY_MAKER']}><DashboardView /></RoleGuard> },
      { path: 'dashboard/district-officer', element: <RoleGuard allowedRoles={['DISTRICT_OFFICER']}><DashboardView /></RoleGuard> },
      { path: 'dashboard/iti', element: <RoleGuard allowedRoles={['ITI_PRINCIPAL']}><ComingSoonPage /></RoleGuard> },
      { path: 'gap-analysis', element: <RoleGuard allowedRoles={['POLICY_MAKER', 'DISTRICT_OFFICER']}><GapAnalysisView /></RoleGuard> },
      { path: 'recommendations', element: <RecommendationsRedirect /> },
      { path: 'recommendations/approvals', element: <RoleGuard allowedRoles={['POLICY_MAKER']}><ComingSoonPage /></RoleGuard> },
      { path: 'recommendations/review-queue', element: <RoleGuard allowedRoles={['SSC_REVIEWER']}><ComingSoonPage /></RoleGuard> },
      { path: 'recommendations/:id/dossier', element: <RoleGuard allowedRoles={['SSC_REVIEWER']}><ComingSoonPage /></RoleGuard> },
      { path: 'taxonomy', element: <RoleGuard allowedRoles={['ADMIN']}><ComingSoonPage /></RoleGuard> },
      { path: 'taxonomy/roles', element: <RoleGuard allowedRoles={['SSC_REVIEWER']}><ComingSoonPage /></RoleGuard> },
      { path: 'placements/upload', element: <RoleGuard allowedRoles={['ITI_PRINCIPAL']}><ComingSoonPage /></RoleGuard> },
      { path: 'placements/benchmarks', element: <RoleGuard allowedRoles={['DISTRICT_OFFICER']}><ComingSoonPage /></RoleGuard> },
      { path: 'district-plans', element: <RoleGuard allowedRoles={['DISTRICT_OFFICER']}><ComingSoonPage /></RoleGuard> },
      { path: 'district-plans/budget-model', element: <RoleGuard allowedRoles={['POLICY_MAKER']}><ComingSoonPage /></RoleGuard> },
      { path: 'district-plans/equipment-deficits', element: <RoleGuard allowedRoles={['DISTRICT_OFFICER']}><ComingSoonPage /></RoleGuard> },
      { path: 'employer/dashboard', element: <RoleGuard allowedRoles={['EMPLOYER']}><ComingSoonPage /></RoleGuard> },
      { path: 'employer/skill-needs', element: <RoleGuard allowedRoles={['EMPLOYER']}><ComingSoonPage /></RoleGuard> },
      { path: 'employer/curriculum-reviews', element: <RoleGuard allowedRoles={['EMPLOYER']}><ComingSoonPage /></RoleGuard> },
      { path: 'employer/surveys', element: <RoleGuard allowedRoles={['EMPLOYER']}><ComingSoonPage /></RoleGuard> },
      { path: 'admin', element: <RoleGuard allowedRoles={['ADMIN']}><ComingSoonPage /></RoleGuard> },
      { path: 'admin/audit-logs', element: <RoleGuard allowedRoles={['ADMIN']}><ComingSoonPage /></RoleGuard> },
      { path: 'analytics/lmi', element: <RoleGuard allowedRoles={['POLICY_MAKER']}><ComingSoonPage /></RoleGuard> },
      { path: 'courses/performance', element: <RoleGuard allowedRoles={['ITI_PRINCIPAL']}><ComingSoonPage /></RoleGuard> },
      { path: 'iti/assets', element: <RoleGuard allowedRoles={['ITI_PRINCIPAL']}><ComingSoonPage /></RoleGuard> },
      { path: 'districts/:id', element: <TenantScopeGuard><ComingSoonPage /></TenantScopeGuard> },
    ],
  },
  ...(import.meta.env.DEV
    ? [
        {
          path: '/__ui',
          lazy: async () => {
            const { UiGalleryPage } = await import('../pages/UiGalleryPage');
            return { Component: UiGalleryPage };
          },
        },
      ]
    : []),
  { path: '/forbidden', element: <PublicShell><ForbiddenPage /></PublicShell> },
  { path: '/scope-denied', element: <PublicShell><ScopeDeniedPage /></PublicShell> },
  {
    path: '*',
    element: <PublicShell><NotFoundPage /></PublicShell>,
  },
]);
