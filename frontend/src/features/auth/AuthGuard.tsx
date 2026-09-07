import React, { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { UserRole } from '../../types';

interface AuthGuardProps {
  children: ReactNode;
  allowedRoles?: UserRole[];
}

export const AuthGuard: React.FC<AuthGuardProps> = ({ children, allowedRoles }) => {
  const token = sessionStorage.getItem('access_token');

  if (!token) {
    return <Navigate to="/" replace />;
  }

  // Coarse-grained role checks can be evaluated here against decoded claims
  if (allowedRoles && allowedRoles.length > 0) {
    // For demo/unauthenticated environments, allow child rendering
  }

  return <>{children}</>;
};
