import { Navigate } from 'react-router-dom';
import { useAuthStore } from '../features/auth/useAuthStore';

export const DashboardRedirect = () => {
  const { currentPersona } = useAuthStore();
  switch (currentPersona.role) {
    case 'DISTRICT_OFFICER':
      return <Navigate to="/dashboard/district-officer" replace />;
    case 'ITI_PRINCIPAL':
      return <Navigate to="/dashboard/iti" replace />;
    case 'EMPLOYER':
      return <Navigate to="/employer/dashboard" replace />;
    case 'SSC_REVIEWER':
      return <Navigate to="/recommendations/review-queue" replace />;
    case 'ADMIN':
      return <Navigate to="/admin" replace />;
    case 'CANDIDATE':
      return <Navigate to="/candidate/courses" replace />;
    case 'POLICY_MAKER':
    default:
      return <Navigate to="/dashboard/policy-maker" replace />;
  }
};

export const RecommendationsRedirect = () => {
  const { currentPersona } = useAuthStore();
  if (currentPersona.role === 'SSC_REVIEWER') {
    return <Navigate to="/recommendations/review-queue" replace />;
  }
  return <Navigate to="/recommendations/approvals" replace />;
};
