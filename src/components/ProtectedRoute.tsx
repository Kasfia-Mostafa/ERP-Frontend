import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

interface ProtectedRouteProps {
  requiredPermission?: string;
  redirectTo?: string;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  requiredPermission,
  redirectTo = '/login',
}) => {
  const { user, loading, hasPermission } = useAuth();

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-bgLight">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-orange-vibrant border-t-transparent"></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to={redirectTo} replace />;
  }

  if (requiredPermission && !hasPermission(requiredPermission)) {
    // Redirect to Products list since it is accessible to all roles
    return <Navigate to="/products" replace />;
  }

  return <Outlet />;
};
