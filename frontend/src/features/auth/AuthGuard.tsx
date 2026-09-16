
import { Navigate, useLocation } from 'react-router-dom';
import { useAuthStore } from './useAuthStore';

export const AuthGuard = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated } = useAuthStore();
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/" state={{ from: location }} replace />;
  }
  return <>{children}</>;
};
