import React, { Suspense, lazy } from 'react';
import { Routes, Route } from 'react-router-dom';
import ProtectedRoute from './ProtectedRoute';
import PublicRoute from './PublicRoute';
import WithAuthLayout from '@layouts/WithAuthLayout';
import WithoutAuthLayout from '@layouts/WithoutAuthLayout';
import { Toaster } from 'react-hot-toast';
// Import catalog components directly (can also be lazy if preferred)
import CategoryList from '@features/category/components/pages/CategoryList';
import SubCategoryList from '@features/category/components/subcategories/SubCategoryList';
import ProductList from '@features/products/pages/ProductList';

// Lazy load all other pages
const DashboardPage = lazy(() => import('@features/dashboard/pages/dashboard'));
const LoginPage = lazy(() => import('@features/auth/pages/LoginPage/LoginPage'));
const ForgotPasswordPage = lazy(
  () => import('@features/auth/pages/ForgotPasswordPage/ForgotPasswordPage'),
);
const NotFoundPage = lazy(() => import('@pages/NotFoundPage'));
const NotificationManagement = lazy(
  () => import('@features/notifications/pages/NotificationManagement'),
);
const StoreType = lazy(() => import('@features/store_type/pages/Store_type'));
const Users = lazy(() => import('@features/users/pages/users'));
const RfqManagementPage = lazy(() => import('@features/rfq/pages/RfqManagementPage'));
const ProfilePage = lazy(() => import('@features/profile/pages/ProfilePage'));

// Marketing
const BannersPage = lazy(() => import('@features/banners/pages/BannersPage'));

// Auth extras
const ChangePasswordPage = lazy(
  () => import('@features/auth/pages/ChangePasswordPage/ChangePasswordPage'),
);
const ResetPasswordPage = lazy(
  () => import('@features/auth/pages/ResetPasswordPage/ResetPasswordPage'),
);


const Loader: React.FC = () => (
  <div style={{ height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
    Loading...
  </div>
);

const AppRouter: React.FC = () => {
  return (
    <>
      <Toaster position="top-right" toastOptions={{ duration: 4000 }} />
      <Suspense fallback={<Loader />}>
        <Routes>
          {/* Public Routes */}
          <Route element={<PublicRoute />}>
            <Route element={<WithoutAuthLayout />}>
              <Route path="/login" element={<LoginPage />} />
              <Route path="/signin" element={<LoginPage />} />
              <Route path="/forgot-password" element={<ForgotPasswordPage />} />
              <Route path="/reset-password" element={<ResetPasswordPage />} />
            </Route>
          </Route>

          {/* First-login forced password change — needs to be logged in but no layout nav */}
          <Route element={<ProtectedRoute />}>
            <Route path="/change-password" element={<ChangePasswordPage />} />
          </Route>

          {/* Protected Routes */}
          <Route element={<ProtectedRoute />}>
            <Route element={<WithAuthLayout />}>
              <Route path="/" element={<DashboardPage />} />

              <Route path="/notifications" element={<NotificationManagement />} />
              <Route path="/store-type" element={<StoreType />} />

              <Route path="/categories" element={<CategoryList />} />
              <Route path="/subcategories" element={<SubCategoryList />} />
              <Route path="/subcategories/:categoryId" element={<SubCategoryList />} />
              <Route path="/products" element={<ProductList />} />
              <Route path="/buyer-management" element={<Users />} />
              <Route path="/rfq-management" element={<RfqManagementPage />} />
              <Route path="/users" element={<Users />} />
              <Route path="/profile" element={<ProfilePage />} />

              {/* Marketing */}
              <Route path="/marketing/banners" element={<BannersPage />} />
            </Route>
          </Route>

          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </Suspense>
    </>
  );
};

export default AppRouter;
