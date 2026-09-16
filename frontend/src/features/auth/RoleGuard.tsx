
import { Navigate } from 'react-router-dom';
import { useAuthStore } from './useAuthStore';
import { UserRole } from '../../types';

export const RoleGuard = ({ allowedRoles, children }: { allowedRoles: UserRole[]; children: React.ReactNode }) => {
  const { currentPersona } = useAuthStore();

  if (!currentPersona.profile.roles.some(role => allowedRoles.includes(role as UserRole))) {
    return <Navigate to="/forbidden" replace />;
  }
  return <>{children}</>;
};
