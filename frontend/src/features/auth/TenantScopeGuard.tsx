
import { Navigate, useParams } from 'react-router-dom';
import { useAuthStore } from './useAuthStore';

export const TenantScopeGuard = ({ children }: { children: React.ReactNode }) => {
  const { currentPersona } = useAuthStore();
  const { id } = useParams<{ id: string }>();
  const roles = currentPersona.profile.roles;
  
  if (roles.includes('POLICY_MAKER') || roles.includes('ADMIN')) {
    return <>{children}</>;
  }
  
  if (roles.includes('DISTRICT_OFFICER') && currentPersona.profile.scopes.district_id?.toString() !== id) {
    return <Navigate to="/scope-denied" replace />;
  }
  
  return <>{children}</>;
};
