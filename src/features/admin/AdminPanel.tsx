import React, { useEffect } from 'react';
import { useAdminStore } from '../../store/useAdminStore';
import { AdminSidebar } from './components/AdminSidebar';
import { AdminTopHeader } from './components/AdminTopHeader';

// 14 Module Subviews
import { AdminDashboardView } from './views/AdminDashboardView';
import { AdminUserManagementView } from './views/AdminUserManagementView';
import { AdminSellerManagementView } from './views/AdminSellerManagementView';
import { AdminBuyerManagementView } from './views/AdminBuyerManagementView';
import { AdminCatalogManagementView } from './views/AdminCatalogManagementView';
import { AdminOrderManagementView } from './views/AdminOrderManagementView';
import { AdminRFQManagementView } from './views/AdminRFQManagementView';
import { AdminInventoryView } from './views/AdminInventoryView';
import { AdminPaymentsView } from './views/AdminPaymentsView';
import { AdminReviewsView } from './views/AdminReviewsView';
import { AdminSupportView } from './views/AdminSupportView';
import { AdminNotificationsView } from './views/AdminNotificationsView';
import { AdminAnalyticsView } from './views/AdminAnalyticsView';
import { AdminProfileView } from './views/AdminProfileView';
import { AdminGlobalSearchModal } from './components/AdminGlobalSearchModal';
import { AdminAuthView } from './auth/AdminAuthView';

interface AdminPanelProps {
  onSwitchToMobile: (role: 'BUYER' | 'SUPPLIER') => void;
}

export const AdminPanel: React.FC<AdminPanelProps> = ({ onSwitchToMobile }) => {
  const { isAdminAuthenticated, activeSection, activeSubSection, setActiveSection, theme = 'dark' } = useAdminStore();
  const [adminSearchOpen, setAdminSearchOpen] = React.useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = React.useState(false);

  useEffect(() => {
    const handleSearchShortcut = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault();
        setAdminSearchOpen(true);
      }
    };
    window.addEventListener('keydown', handleSearchShortcut);
    return () => window.removeEventListener('keydown', handleSearchShortcut);
  }, []);

  const routeForState = () => {
    if (activeSection === 'CATALOG_MGMT') {
      if (activeSubSection === 'CATALOG_SUBCATEGORIES') return '/admin/subcategories';
      if (activeSubSection === 'CATALOG_PRODUCTS') return '/admin/products';
      if (activeSubSection === 'CATALOG_ADD_PRODUCT') return '/admin/add-product';
      return '/admin/categories';
    }
    const routes: Record<string, string> = {
      DASHBOARD: '/admin/dashboard', USER_MGMT: '/admin/users', SELLER_MGMT: '/admin/sellers', BUYER_MGMT: '/admin/buyers',
      ORDER_MGMT: '/admin/orders', RFQ_MGMT: '/admin/rfqs', INVENTORY: '/admin/inventory', PAYMENTS: '/admin/payments',
      REVIEWS: '/admin/reviews', SUPPORT: '/admin/support', NOTIFICATIONS: '/admin/notifications', ANALYTICS: '/admin/analytics', SETTINGS: '/admin/settings',
    };
    return routes[activeSection] || '/admin/dashboard';
  };

  const stateForRoute = (pathname: string): { section: any; subSection: any } | null => {
    const route = pathname.replace(/\/$/, '') || '/admin/dashboard';
    const catalogRoutes: Record<string, string> = {
      '/admin/categories': 'CATALOG_CATEGORIES', '/admin/catalog/categories': 'CATALOG_CATEGORIES',
      '/admin/subcategories': 'CATALOG_SUBCATEGORIES', '/admin/catalog/subcategories': 'CATALOG_SUBCATEGORIES',
      '/admin/products': 'CATALOG_PRODUCTS', '/admin/catalog/products': 'CATALOG_PRODUCTS',
      '/admin/add-product': 'CATALOG_ADD_PRODUCT', '/admin/catalog/add-product': 'CATALOG_ADD_PRODUCT',
    };
    if (catalogRoutes[route]) return { section: 'CATALOG_MGMT', subSection: catalogRoutes[route] };
    const sections: Record<string, string> = {
      '/admin/dashboard': 'DASHBOARD', '/admin/users': 'USER_MGMT', '/admin/sellers': 'SELLER_MGMT', '/admin/buyers': 'BUYER_MGMT',
      '/admin/orders': 'ORDER_MGMT', '/admin/rfqs': 'RFQ_MGMT', '/admin/inventory': 'INVENTORY', '/admin/payments': 'PAYMENTS',
      '/admin/reviews': 'REVIEWS', '/admin/support': 'SUPPORT', '/admin/notifications': 'NOTIFICATIONS', '/admin/analytics': 'ANALYTICS', '/admin/settings': 'SETTINGS',
    };
    return sections[route] ? { section: sections[route], subSection: 'ROOT' } : null;
  };

  useEffect(() => {
    const initial = stateForRoute(window.location.pathname);
    if (initial) setActiveSection(initial.section, initial.subSection);
    else window.history.replaceState({}, '', routeForState());

    const handlePopState = () => {
      const next = stateForRoute(window.location.pathname);
      if (next) setActiveSection(next.section, next.subSection);
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  useEffect(() => {
    if (!isAdminAuthenticated) return;
    const nextRoute = routeForState();
    if (window.location.pathname !== nextRoute) window.history.pushState({}, '', nextRoute);
  }, [activeSection, activeSubSection, isAdminAuthenticated]);

  if (!isAdminAuthenticated) return <AdminAuthView />;

  const isDark = theme === 'dark';

  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        background: isDark ? '#0B1220' : '#F3F4F6',
        color: isDark ? '#F9FAFB' : '#111827',
        display: 'flex',
        overflow: 'hidden',
        fontFamily: "'Plus Jakarta Sans', sans-serif",
        transition: 'background 0.2s ease, color 0.2s ease',
      }}
    >
      {/* Flat Top-Level Only Sidebar */}
      <AdminSidebar onSwitchToMobile={onSwitchToMobile} collapsed={sidebarCollapsed} onToggleCollapse={() => setSidebarCollapsed((value) => !value)} />

      {/* Main Workspace */}
      <div
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          background: isDark ? '#0F172A' : '#F8FAFC',
          transition: 'background 0.2s ease',
        }}
      >
        <AdminTopHeader onOpenSearch={() => setAdminSearchOpen(true)} />

        {/* Dynamic Subview Router */}
        <main
          style={{
            flex: 1,
            overflowY: 'auto',
            padding: '28px clamp(18px, 3vw, 42px) 40px',
            WebkitOverflowScrolling: 'touch',
          }}
        >
          {activeSection === 'DASHBOARD' && <AdminDashboardView />}
          {activeSection === 'USER_MGMT' && <AdminUserManagementView />}
          {activeSection === 'SELLER_MGMT' && <AdminSellerManagementView />}
          {activeSection === 'BUYER_MGMT' && <AdminBuyerManagementView />}
          {activeSection === 'CATALOG_MGMT' && <AdminCatalogManagementView />}
          {activeSection === 'ORDER_MGMT' && <AdminOrderManagementView />}
          {activeSection === 'RFQ_MGMT' && <AdminRFQManagementView />}
          {activeSection === 'INVENTORY' && <AdminInventoryView />}
          {activeSection === 'PAYMENTS' && <AdminPaymentsView />}
          {activeSection === 'REVIEWS' && <AdminReviewsView />}
          {activeSection === 'SUPPORT' && <AdminSupportView />}
          {activeSection === 'NOTIFICATIONS' && <AdminNotificationsView />}
          {activeSection === 'ANALYTICS' && <AdminAnalyticsView />}
          {activeSection === 'SETTINGS' && <AdminProfileView />}
        </main>
        <AdminGlobalSearchModal isOpen={adminSearchOpen} onClose={() => setAdminSearchOpen(false)} />
      </div>
    </div>
  );
};
