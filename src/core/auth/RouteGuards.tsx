import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from './AuthContext';

export const ProtectedRouteGuard: React.FC = () => {
  const { session, pendingTwoFactorEmail } = useAuth();

  if (pendingTwoFactorEmail) {
    return <Navigate to="/verify-2fa" replace />;
  }

  if (!session) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};

export const PublicOnlyGuard: React.FC = () => {
  const { session, pendingTwoFactorEmail } = useAuth();

  if (pendingTwoFactorEmail) {
    return <Navigate to="/verify-2fa" replace />;
  }

  if (session) {
    return <Navigate to="/admin/users" replace />;
  }

  return <Outlet />;
};

