import { Navigate, Outlet } from 'react-router-dom';
import { getStoredAccessToken, getStoredRefreshToken } from '@features/auth/authCookies';

const PublicRoute = () => {
  const frontendOnly = import.meta.env.VITE_FRONTEND_ONLY === 'true';
  const token = getStoredAccessToken();
  const refreshToken = getStoredRefreshToken();

  return frontendOnly || token || refreshToken ? <Navigate to="/" replace /> : <Outlet />;
};

export default PublicRoute;
