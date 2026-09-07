import { createBrowserRouter, Navigate } from 'react-router-dom';
import { PublicShell } from '../components/layout/PublicShell';
import { AppShell } from '../components/layout/AppShell';
import { CandidateShell } from '../components/layout/CandidateShell';

import { LandingPage } from '../features/landing/LandingPage';
import { CourseFinder, PathwayQuiz } from '../features/candidates';
import { DashboardView, GapAnalysisView } from '../features/gap-scoring';

// Placeholder Views for Vertical Slices
const RecommendationsView = () => <div className="text-xl font-bold">Curriculum Update Recommendations & Reviews</div>;
const TaxonomyView = () => <div className="text-xl font-bold">NSQF Skills & Occupational Taxonomy Tree</div>;
const PlacementsView = () => <div className="text-xl font-bold">ITI Monthly Placement Return Upload Portal</div>;
const DistrictPlansView = () => <div className="text-xl font-bold">Annual District Training Plans & Equipment Deficits</div>;
const EmployerView = () => <div className="text-xl font-bold">Industry Partner Skill Needs & Validation</div>;
const AdminView = () => <div className="text-xl font-bold">System Administration, Pipelines & Audit Logs</div>;

export const router = createBrowserRouter([
  // Public Shell
  {
    path: '/',
    element: <PublicShell />,
    children: [
      { index: true, element: <LandingPage /> },
    ],
  },
  // Candidate Shell
  {
    path: '/candidate',
    element: <CandidateShell />,
    children: [
      { path: 'courses', element: <CourseFinder /> },
      { path: 'pathway', element: <PathwayQuiz /> },
      { path: 'dashboard', element: <div className="font-bold text-xl">My Enrolled Pathways (Mahaswayam SSO)</div> },
    ],
  },
  // Government / Authenticated App Shell
  {
    path: '/',
    element: <AppShell />,
    children: [
      { path: 'dashboard', element: <DashboardView /> },
      { path: 'gap-analysis', element: <GapAnalysisView /> },
      { path: 'recommendations', element: <RecommendationsView /> },
      { path: 'taxonomy', element: <TaxonomyView /> },
      { path: 'placements/upload', element: <PlacementsView /> },
      { path: 'district-plans', element: <DistrictPlansView /> },
      { path: 'employer', element: <EmployerView /> },
      { path: 'admin', element: <AdminView /> },
    ],
  },
  {
    path: '*',
    element: <Navigate to="/" replace />,
  },
]);
