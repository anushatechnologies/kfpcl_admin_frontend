import React from 'react';
import { useAdminStore, AdminTopSection } from '../../../store/useAdminStore';
import { useOrderStore } from '../../../store/useOrderStore';
import { useRFQStore } from '../../../store/useRFQStore';
import { useProductStore } from '../../../store/useProductStore';
import {
  LayoutDashboard,
  Users,
  Store,
  ShoppingBag,
  Package,
  ShoppingCart,
  FileText,
  Boxes,
  CreditCard,
  Star,
  LifeBuoy,
  Bell,
  BarChart3,
  UserCircle2,
  ShieldCheck,
  PanelLeftClose,
  PanelLeftOpen,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

interface Props {
  onSwitchToMobile: (role: 'BUYER' | 'SUPPLIER') => void;
  collapsed: boolean;
  onToggleCollapse: () => void;
}

interface NavItem {
  id: AdminTopSection;
  subSection?: 'CATALOG_CATEGORIES' | 'CATALOG_SUBCATEGORIES' | 'CATALOG_PRODUCTS' | 'CATALOG_ADD_PRODUCT';
  label: string;
  icon: LucideIcon;
  badge?: number | string;
  badgeColor?: string;
}

export const AdminSidebar: React.FC<Props> = ({ onSwitchToMobile, collapsed, onToggleCollapse }) => {
  const {
    activeSection,
    activeSubSection,
    setActiveSection,
    sellerApplications = [],
    supportTickets = [],
    inventory = [],
    reviews = [],
    theme = 'dark',
  } = useAdminStore();

  const { orders = [] } = useOrderStore();
  const { rfqs = [] } = useRFQStore();
  const { products = [] } = useProductStore();
  const isDark = theme === 'dark';

  const pendingApps = (sellerApplications || []).filter((a) => a.status === 'PENDING').length;
  const openTickets = (supportTickets || []).filter((t) => t.status === 'OPEN').length;
  const criticalStock = (inventory || []).filter((i) => i.status === 'CRITICAL' || i.status === 'LOW_STOCK').length;
  const flaggedReviews = (reviews || []).filter((r) => r.status === 'FLAGGED').length;

  const navTree: NavItem[] = [
    { id: 'DASHBOARD', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'USER_MGMT', label: 'User Management', icon: Users },
    { id: 'SELLER_MGMT', label: 'Seller Management', icon: Store, badge: pendingApps > 0 ? pendingApps : undefined, badgeColor: '#F59E0B' },
    { id: 'BUYER_MGMT', label: 'Buyer Management', icon: ShoppingBag },
    { id: 'CATALOG_MGMT', subSection: 'CATALOG_CATEGORIES', label: 'Categories', icon: Package },
    { id: 'CATALOG_MGMT', subSection: 'CATALOG_SUBCATEGORIES', label: 'Subcategories', icon: Boxes },
    { id: 'CATALOG_MGMT', subSection: 'CATALOG_PRODUCTS', label: 'Products', icon: ShoppingBag, badge: products.length > 0 ? products.length : undefined },
    { id: 'ORDER_MGMT', label: 'Order Management', icon: ShoppingCart, badge: orders.length > 0 ? orders.length : undefined },
    { id: 'RFQ_MGMT', label: 'RFQ Management', icon: FileText, badge: rfqs.length > 0 ? rfqs.length : undefined },
    { id: 'INVENTORY', label: 'Inventory Management', icon: Boxes, badge: criticalStock > 0 ? criticalStock : undefined, badgeColor: '#EF4444' },
    { id: 'PAYMENTS', label: 'Payments', icon: CreditCard },
    { id: 'REVIEWS', label: 'Reviews & Ratings', icon: Star, badge: flaggedReviews > 0 ? flaggedReviews : undefined, badgeColor: '#F59E0B' },
    { id: 'SUPPORT', label: 'Support & Disputes', icon: LifeBuoy, badge: openTickets > 0 ? openTickets : undefined, badgeColor: '#EF4444' },
    { id: 'NOTIFICATIONS', label: 'Notifications', icon: Bell },
    { id: 'ANALYTICS', label: 'Reports & Analytics', icon: BarChart3 },
    { id: 'SETTINGS', label: 'Admin Profile', icon: UserCircle2 },
  ];

  return (
    <aside
      style={{
        width: collapsed ? 76 : 248,
        minWidth: collapsed ? 76 : 248,
        background: isDark ? 'rgba(11, 17, 30, 0.96)' : '#FFFFFF',
        borderRight: `1px solid ${isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.08)'}`,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        padding: '20px 10px 16px',
        zIndex: 10,
        height: '100%',
        overflowY: 'auto',
        scrollbarWidth: 'thin',
        transition: 'width 0.2s ease, min-width 0.2s ease, background 0.2s ease, border-color 0.2s ease',
      }}
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        {/* Brand Header */}
        <div
          style={{
            display: 'flex',
            flexDirection: collapsed ? 'column' : 'row',
            alignItems: 'center',
            gap: 10,
            padding: '2px 8px 18px',
            justifyContent: collapsed ? 'center' : 'flex-start',
            borderBottom: `1px solid ${isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.08)'}`,
          }}
        >
          <div
            style={{
              width: 38,
              height: 38,
              borderRadius: 10,
              background: 'linear-gradient(135deg, #2563EB 0%, #10B981 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#FFF',
              fontWeight: 800,
              fontSize: 18,
              boxShadow: '0 4px 14px rgba(37, 99, 235, 0.4)',
            }}
          >
            K
          </div>
          {!collapsed && <div>
            <div style={{ fontSize: 15, fontWeight: 800, color: isDark ? '#FFF' : '#111827', letterSpacing: '-0.2px' }}>
              KFPL Admin
            </div>
            <div style={{ fontSize: 10, color: '#10B981', fontWeight: 700, display: 'flex', alignItems: 'center', gap: 4, marginTop: 1 }}>
              <span style={{ width: 6, height: 6, borderRadius: 3, background: '#10B981' }} />
              <span>Superadmin Console</span>
            </div>
          </div>}
          <button type="button" onClick={onToggleCollapse} title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'} aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'} style={{ marginLeft: collapsed ? 0 : 'auto', flexShrink: 0, width: 32, height: 32, display: 'grid', placeItems: 'center', border: `1px solid ${isDark ? 'rgba(148,163,184,.2)' : '#E2E8F0'}`, borderRadius: 8, background: isDark ? 'rgba(30,41,59,.7)' : '#F8FAFC', color: isDark ? '#CBD5E1' : '#64748B', cursor: 'pointer' }}>
            {collapsed ? <PanelLeftOpen size={16} /> : <PanelLeftClose size={16} />}
          </button>
        </div>

        {/* Navigation List - TOP LEVEL ONLY (No nesting) */}
        <nav style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          {navTree.map((item) => {
            const Icon = item.icon;
            const isActive = item.subSection
              ? activeSection === item.id && activeSubSection === item.subSection
              : activeSection === item.id && (item.id !== 'CATALOG_MGMT' || activeSubSection === 'ROOT');

            return (
              <button
                key={`${item.id}-${item.subSection || 'ROOT'}`}
                onClick={() => setActiveSection(item.id, item.subSection || 'ROOT')}
                title={collapsed ? item.label : undefined}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: collapsed ? 'center' : 'space-between',
                  padding: collapsed ? '10px 0' : '10px 12px',
                  borderRadius: 10,
                  border: 'none',
                  background: isActive
                    ? isDark
                      ? 'linear-gradient(135deg, rgba(37, 99, 235, 0.25) 0%, rgba(37, 99, 235, 0.08) 100%)'
                      : 'rgba(37, 99, 235, 0.08)'
                    : 'transparent',
                  borderLeft: isActive ? '3px solid #3B82F6' : '3px solid transparent',
                  color: isActive
                    ? isDark
                      ? '#60A5FA'
                      : '#1D4ED8'
                    : isDark
                    ? '#9CA3AF'
                    : '#4B5563',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                  textAlign: 'left',
                }}
                onMouseEnter={(e) => {
                  if (!isActive) {
                    (e.currentTarget as HTMLButtonElement).style.background = isDark
                      ? 'rgba(255, 255, 255, 0.04)'
                      : 'rgba(0, 0, 0, 0.03)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isActive) {
                    (e.currentTarget as HTMLButtonElement).style.background = 'transparent';
                  }
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <Icon size={16} color={isActive ? (isDark ? '#60A5FA' : '#1D4ED8') : '#9CA3AF'} />
                  {!collapsed && <span style={{ fontSize: 13, fontWeight: isActive ? 700 : 600 }}>{item.label}</span>}
                </div>

                {!collapsed && item.badge !== undefined && (
                  <span
                    style={{
                      fontSize: 9,
                      fontWeight: 800,
                      padding: '1px 5px',
                      borderRadius: 8,
                      background: item.badgeColor ? `${item.badgeColor}25` : 'rgba(59, 130, 246, 0.2)',
                      color: item.badgeColor || '#93C5FD',
                      border: `1px solid ${item.badgeColor ? `${item.badgeColor}40` : 'rgba(59, 130, 246, 0.3)'}`,
                    }}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Mobile switcher removed from the administrator sidebar. */}
      {false && <div
        style={{
          background: isDark ? 'rgba(31, 41, 55, 0.6)' : 'rgba(243, 244, 246, 0.8)',
          border: `1px solid ${isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.08)'}`,
          borderRadius: 12,
          padding: collapsed ? 8 : 10,
          display: 'flex',
          flexDirection: 'column',
          gap: 8,
          marginTop: 14,
        }}
      >
        {!collapsed && <div style={{ fontSize: 10, fontWeight: 800, color: isDark ? '#9CA3AF' : '#4B5563', textTransform: 'uppercase' }}>
          Test Mobile App
        </div>}
        <div style={{ display: 'flex', gap: 6, flexDirection: collapsed ? 'column' : 'row' }}>
          <button
            onClick={() => onSwitchToMobile('BUYER')}
            style={{
              flex: 1,
              background: 'rgba(37, 99, 235, 0.15)',
              border: '1px solid rgba(37, 99, 235, 0.3)',
              color: '#60A5FA',
              borderRadius: 6,
              padding: '6px 4px',
              fontSize: 11,
              fontWeight: 700,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 4,
              cursor: 'pointer',
            }}
          >
              {!collapsed && <span>Buyer</span>}
          </button>

          <button
            onClick={() => onSwitchToMobile('SUPPLIER')}
            style={{
              flex: 1,
              background: 'rgba(16, 185, 129, 0.15)',
              border: '1px solid rgba(16, 185, 129, 0.3)',
              color: '#34D399',
              borderRadius: 6,
              padding: '6px 4px',
              fontSize: 11,
              fontWeight: 700,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 4,
              cursor: 'pointer',
            }}
          >
              {!collapsed && <span>Supplier</span>}
          </button>
        </div>
      </div>}
    </aside>
  );
};
