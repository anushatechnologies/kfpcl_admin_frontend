import { Navigate, Outlet } from 'react-router-dom';
import { useAppSelector } from '@app/hooks';
import { getStoredAccessToken, getStoredRefreshToken } from '@features/auth/authCookies';

interface ProtectedRouteProps {
  allowedRoles?: string[];
}

const ProtectedRoute = ({ allowedRoles }: ProtectedRouteProps) => {
  const frontendOnly = import.meta.env.VITE_FRONTEND_ONLY === 'true';
  const isLoggedIn = useAppSelector((state: any) => state.auth?.isLoggedIn);
  const userRole = useAppSelector((state: any) => state.auth?.user?.role);

  const hasToken = !!getStoredAccessToken();
  const hasRefreshToken = !!getStoredRefreshToken();

  if (frontendOnly || isLoggedIn || hasToken || hasRefreshToken) {
    if (!frontendOnly && allowedRoles?.length && (!userRole || !allowedRoles.includes(userRole))) {
      return <Navigate to="/" replace />;
    }
    return <Outlet />;
  }

  return <Navigate to="/login" replace />;
};

export default ProtectedRoute;
