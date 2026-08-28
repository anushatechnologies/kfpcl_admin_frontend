import React, { useState } from 'react';
import { useAdminStore } from '../../../store/useAdminStore';
import {
  Search,
  Bell,
  LogOut,
  ChevronDown,
  User,
  ExternalLink,
  Sparkles,
  X,
  CheckCircle2,
  AlertTriangle,
  Sun,
  Moon,
} from 'lucide-react';

interface Props { onOpenSearch?: () => void; }

export const AdminTopHeader: React.FC<Props> = ({ onOpenSearch }) => {
  const {
    adminUser,
    logout,
    activeSection,
    activeSubSection,
    currency,
    setCurrency,
    searchQuery,
    setSearchQuery,
    notificationsList,
    setActiveSection,
    theme = 'dark',
    toggleTheme,
  } = useAdminStore();

  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);

  const isDark = theme === 'dark';

  const getSectionTitle = () => {
    switch (activeSection) {
      case 'DASHBOARD': return 'Executive Dashboard';
      case 'USER_MGMT': return 'User Management Directory';
      case 'SELLER_MGMT': return 'Seller & Manufacturer Management';
      case 'BUYER_MGMT': return 'Buyer Account Directory';
      case 'CATALOG_MGMT': return 'Catalog & Product Governance';
      case 'ORDER_MGMT': return 'Order Fulfillment & Escrow Operations';
      case 'RFQ_MGMT': return 'RFQ & Quotation Bids Desk';
      case 'INVENTORY': return 'Inventory & Warehouse Stock';
      case 'PAYMENTS': return 'Payments & Escrow Settlements';
      case 'REVIEWS': return 'Reviews & Customer Ratings';
      case 'SUPPORT': return 'Customer Support & Dispute Mediation';
      case 'NOTIFICATIONS': return 'System Broadcasts & Alerts';
      case 'ANALYTICS': return 'Market Analytics & Intelligence Reports';
      case 'SETTINGS': return 'Admin Profile';
      default: return 'Admin Console';
    }
  };

  return (
    <header
      style={{
        minHeight: 72,
        background: isDark ? 'rgba(15, 23, 42, 0.88)' : '#FFFFFF',
        backdropFilter: 'blur(16px)',
        borderBottom: `1px solid ${isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.08)'}`,
        padding: '0 clamp(18px, 3vw, 42px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 18,
        position: 'relative',
        zIndex: 50,
        transition: 'background 0.2s ease, border-color 0.2s ease',
      }}
    >
      {/* Current page name */}
      <div style={{ minWidth: 190, fontSize: 14, fontWeight: 800, color: isDark ? '#F9FAFB' : '#111827', whiteSpace: 'nowrap' }}>
        {activeSubSection === 'CATALOG_CATEGORIES' ? 'Categories' : activeSubSection === 'CATALOG_SUBCATEGORIES' ? 'Subcategories' : activeSubSection === 'CATALOG_PRODUCTS' ? 'Products' : activeSubSection === 'CATALOG_ADD_PRODUCT' ? 'Add Product' : getSectionTitle()}
      </div>

      {/* Center / Global Search Bar */}
      <div
        style={{
          flex: '1 1 320px',
          maxWidth: 430,
          minWidth: 180,
          background: isDark ? 'rgba(31, 41, 55, 0.7)' : '#F3F4F6',
          border: `1px solid ${isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.08)'}`,
          borderRadius: 10,
          padding: '6px 12px',
          display: 'flex',
          alignItems: 'center',
          gap: 8,
        }}
      >
        <Search size={14} color="#6B7280" />
        <input
          type="text"
          value={searchQuery}
          readOnly
          onClick={onOpenSearch}
          onFocus={onOpenSearch}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Global search (Buyers, Orders, RFQs, SKU)..."
          style={{
            flex: 1,
            background: 'transparent',
            border: 'none',
            color: isDark ? '#FFF' : '#111827',
            fontSize: 12,
            outline: 'none',
          }}
        />
        <span
          style={{
            fontSize: 9,
            color: '#6B7280',
            background: isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.05)',
            padding: '2px 4px',
            borderRadius: 4,
            fontWeight: 700,
          }}
        >
          ⌘K
        </span>
      </div>

      {/* Right Controls */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        {/* Theme Switcher */}
        <button
          onClick={toggleTheme}
          title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          style={{
            background: isDark ? 'rgba(31, 41, 55, 0.8)' : '#F3F4F6',
            border: `1px solid ${isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.08)'}`,
            borderRadius: 8,
            width: 34,
            height: 34,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: isDark ? '#FBBF24' : '#4B5563',
            cursor: 'pointer',
          }}
        >
          {isDark ? <Sun size={15} /> : <Moon size={15} />}
        </button>

        {/* Currency Switcher */}
        <button
          onClick={() => setCurrency(currency === 'INR' ? 'USD' : 'INR')}
          title="Toggle Platform Currency Display"
          style={{
            background: isDark ? 'rgba(31, 41, 55, 0.8)' : '#F3F4F6',
            border: `1px solid ${isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.08)'}`,
            borderRadius: 8,
            padding: '5px 10px',
            color: isDark ? '#FBBF24' : '#1D4ED8',
            fontSize: 12,
            fontWeight: 800,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: 4,
          }}
        >
          <span>{currency === 'INR' ? '₹ INR' : '$ USD'}</span>
        </button>



        {/* Notifications Bell */}
        <div style={{ position: 'relative' }}>
          <button
            onClick={() => setNotificationsOpen(!notificationsOpen)}
            style={{
              background: isDark ? 'rgba(31, 41, 55, 0.8)' : '#F3F4F6',
              border: `1px solid ${isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.08)'}`,
              borderRadius: 8,
              width: 34,
              height: 34,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: isDark ? '#D1D5DB' : '#4B5563',
              cursor: 'pointer',
              position: 'relative',
            }}
          >
            <Bell size={15} />
            <span
              style={{
                position: 'absolute',
                top: 6,
                right: 6,
                width: 6,
                height: 6,
                borderRadius: 3,
                background: '#EF4444',
              }}
            />
          </button>

          {/* Notifications Flyout Tray */}
          {notificationsOpen && (
            <div
              style={{
                position: 'absolute',
                top: 42,
                right: 0,
                width: 320,
                background: isDark ? '#0F172A' : '#FFFFFF',
                border: `1px solid ${isDark ? 'rgba(255, 255, 255, 0.15)' : 'rgba(0, 0, 0, 0.1)'}`,
                borderRadius: 14,
                padding: 14,
                boxShadow: '0 20px 40px rgba(0, 0, 0, 0.3)',
                zIndex: 100,
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                <span style={{ fontSize: 13, fontWeight: 800, color: isDark ? '#FFF' : '#111827' }}>System Broadcasts</span>
                <button
                  onClick={() => setNotificationsOpen(false)}
                  style={{ background: 'none', border: 'none', color: '#9CA3AF', cursor: 'pointer' }}
                >
                  <X size={14} />
                </button>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 8, maxHeight: 220, overflowY: 'auto' }}>
                {(notificationsList || []).map((n) => (
                  <div
                    key={n.id}
                    style={{
                      background: isDark ? 'rgba(31, 41, 55, 0.6)' : '#F3F4F6',
                      padding: 8,
                      borderRadius: 8,
                      fontSize: 11,
                    }}
                  >
                    <div style={{ fontWeight: 700, color: '#2563EB' }}>{n.title}</div>
                    <div style={{ color: isDark ? '#9CA3AF' : '#4B5563', marginTop: 2, lineHeight: '1.3' }}>{n.message}</div>
                    <div style={{ fontSize: 9, color: '#6B7280', marginTop: 4 }}>Dispatched · {n.sentAt}</div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div style={{ width: 1, height: 22, background: isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.08)' }} />

        {/* Admin Profile Dropdown */}
        <div style={{ position: 'relative' }}>
          <button
            onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
            style={{
              background: 'transparent',
              border: 'none',
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              cursor: 'pointer',
              padding: '2px 6px',
              borderRadius: 8,
            }}
          >
            <img
              src={adminUser?.avatar || ''}
              alt={adminUser?.name || 'Admin'}
              style={{ width: 32, height: 32, borderRadius: 16, objectFit: 'cover', border: '1px solid #2563EB' }}
            />
            <div style={{ textAlign: 'left' }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: isDark ? '#FFF' : '#111827', lineHeight: '1.2' }}>
                {adminUser?.name || '—'}
              </div>
              <div style={{ fontSize: 10, color: '#10B981', fontWeight: 600 }}>{adminUser?.role || '—'}</div>
            </div>
            <ChevronDown size={14} color="#9CA3AF" />
          </button>

          {/* Profile Flyout */}
          {profileDropdownOpen && (
            <div
              style={{
                position: 'absolute',
                top: 44,
                right: 0,
                width: 220,
                background: isDark ? '#0F172A' : '#FFFFFF',
                border: `1px solid ${isDark ? 'rgba(255, 255, 255, 0.15)' : 'rgba(0, 0, 0, 0.1)'}`,
                borderRadius: 14,
                padding: 12,
                boxShadow: '0 20px 40px rgba(0, 0, 0, 0.25)',
                zIndex: 100,
                display: 'flex',
                flexDirection: 'column',
                gap: 8,
              }}
            >
              <div style={{ paddingBottom: 8, borderBottom: `1px solid ${isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.08)'}` }}>
                <div style={{ fontSize: 12, fontWeight: 700, color: isDark ? '#FFF' : '#111827' }}>{adminUser?.name}</div>
                <div style={{ fontSize: 10, color: '#6B7280' }}>{adminUser?.email}</div>
                <div style={{ fontSize: 10, color: '#2563EB', marginTop: 2 }}>Dept: {adminUser?.department}</div>
              </div>

              <button
                onClick={() => {
                  setProfileDropdownOpen(false);
                  setActiveSection('SETTINGS');
                }}
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: isDark ? '#D1D5DB' : '#4B5563',
                  fontSize: 12,
                  fontWeight: 600,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  padding: '6px 8px',
                  borderRadius: 6,
                  cursor: 'pointer',
                  textAlign: 'left',
                }}
              >
                <User size={14} />
                <span>Account Settings</span>
              </button>

              <button
                onClick={() => {
                  setProfileDropdownOpen(false);
                  logout();
                }}
                style={{
                  background: 'rgba(239, 68, 68, 0.12)',
                  border: '1px solid rgba(239, 68, 68, 0.25)',
                  color: '#EF4444',
                  fontSize: 12,
                  fontWeight: 700,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  padding: '6px 8px',
                  borderRadius: 6,
                  cursor: 'pointer',
                  textAlign: 'left',
                }}
              >
                <LogOut size={14} />
                <span>Sign Out / Lock</span>
              </button>
            </div>
          )}
        </div>
      </div>

    </header>
  );
};
