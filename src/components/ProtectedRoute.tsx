import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAppSelector } from '@/store';
import { selectIsAuthenticated, selectUser } from '@/store/authSlice';

interface ProtectedRouteProps {
  children: React.ReactNode;
  adminOnly?: boolean;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, adminOnly }) => {
  const isAuth = useAppSelector(selectIsAuthenticated);
  const user = useAppSelector(selectUser);

  if (!isAuth) return <Navigate to="/login" replace />;
  if (adminOnly && user?.role !== 'admin') return <Navigate to="/" replace />;
  return <>{children}</>;
};

export default ProtectedRoute;
