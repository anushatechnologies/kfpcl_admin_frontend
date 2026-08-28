import React, { useState } from 'react';
import { useAuthStore } from './store/useAuthStore';
import { useRoleStore } from './store/useRoleStore';
import { useProductStore } from './store/useProductStore';
import { useRFQStore } from './store/useRFQStore';
import { useAdminStore } from './store/useAdminStore';
import { HeaderBar } from './components/common/HeaderBar';
import { BottomNavBar, TabType } from './components/common/BottomNavBar';

// Views
import { BuyerHomeView } from './features/buyer/BuyerHomeView';
import { BuyerExploreView } from './features/buyer/BuyerExploreView';
import { BuyerRFQDeskView } from './features/buyer/BuyerRFQDeskView';
import { BuyerOrdersView } from './features/buyer/BuyerOrdersView';
import { SupplierDashboardView } from './features/supplier/SupplierDashboardView';
import { SupplierProductsView } from './features/supplier/SupplierProductsView';
import { SupplierLeadsView } from './features/supplier/SupplierLeadsView';
import { ChatView } from './features/chat/ChatView';
import { ProfileView } from './features/profile/ProfileView';
import { OnboardingView } from './features/auth/OnboardingView';
import { AdminPanel } from './features/admin/AdminPanel';

// Modals
import { GlobalSearchModal } from './components/modals/GlobalSearchModal';
import { ProductDetailModal } from './components/modals/ProductDetailModal';
import { RFQCreateModal } from './components/modals/RFQCreateModal';
import { QuotationBuilderModal } from './components/modals/QuotationBuilderModal';
import { RFQCompareModal } from './components/modals/RFQCompareModal';
import { AddProductModal } from './components/modals/AddProductModal';

import { Product, RFQItem, OrderItem } from './types';
import { Smartphone, Monitor, Sparkles, RefreshCw, ShieldAlert, ShieldCheck } from 'lucide-react';

export const App: React.FC = () => {
  const { isAuthenticated, isOnboarded, user, logout } = useAuthStore();
  const { activeRole, switchRole } = useRoleStore();
  const { isSupplierApproved } = useAdminStore();
  const { selectedProduct, setSelectedProduct } = useProductStore();

  const [viewMode, setViewMode] = useState<'BUYER' | 'SUPPLIER' | 'ADMIN'>('ADMIN');
  const [activeTab, setActiveTab] = useState<TabType>('HOME');
  const [searchModalOpen, setSearchModalOpen] = useState(false);
  const [addProductModalOpen, setAddProductModalOpen] = useState(false);
  const [selectedLeadForQuote, setSelectedLeadForQuote] = useState<RFQItem | null>(null);
  const [deviceFrame, setDeviceFrame] = useState<'mobile' | 'full'>('mobile');
  const [showOnboarding, setShowOnboarding] = useState(false);

  const isBuyer = activeRole === 'BUYER';
  const supplierApproved = !!user?.id && isSupplierApproved(user.id);
  const buyerApproved = user?.approvalStatus === 'APPROVED';
  const accountApproved = isBuyer ? buyerApproved : supplierApproved;

  // Handle Tab Navigation based on active role
  const handleTabChange = (tab: TabType) => {
    setActiveTab(tab);
  };

  const handleRoleToggle = (role: 'BUYER' | 'SUPPLIER') => {
    setViewMode(role);
    switchRole(role);
    if (role === 'BUYER' && (activeTab === 'DASHBOARD' || activeTab === 'PRODUCTS' || activeTab === 'LEADS')) {
      setActiveTab('HOME');
    } else if (role === 'SUPPLIER' && (activeTab === 'HOME' || activeTab === 'EXPLORE' || activeTab === 'RFQ')) {
      setActiveTab('DASHBOARD');
    }
  };

  const handleSwitchToAdmin = () => {
    setViewMode('ADMIN');
  };

  return (
    <div
      style={{
        width: '100vw',
        height: '100vh',
        background: '#04070D',
        color: '#F9FAFB',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'flex-start',
        fontFamily: "'Plus Jakarta Sans', sans-serif",
        overflow: 'hidden',
      }}
    >
      {/* Outer Shell Control Toolbar */}
      <div
        style={{
          width: '100%',
          background: 'rgba(15, 23, 42, 0.95)',
          borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
          padding: '8px 16px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          zIndex: 100,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div
            style={{
              width: 28,
              height: 28,
              borderRadius: 8,
              background: 'linear-gradient(135deg, #2563EB 0%, #10B981 100%)',
              color: '#FFF',
              fontWeight: 800,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 14,
            }}
          >
            K
          </div>
          <span style={{ fontSize: 13, fontWeight: 800, color: '#FFF' }}>
            KFPL B2B Marketplace Platform
          </span>
          <span
            style={{
              fontSize: 10,
              background: viewMode === 'ADMIN' ? 'rgba(139, 92, 246, 0.2)' : 'rgba(59, 130, 246, 0.2)',
              color: viewMode === 'ADMIN' ? '#C084FC' : '#60A5FA',
              padding: '2px 8px',
              borderRadius: 6,
              fontWeight: 700,
            }}
          >
            {viewMode === 'ADMIN' ? 'SUPERADMIN CONSOLE' : 'MOBILE APP VIEW'}
          </span>
        </div>

        {/* Quick Outer Toolbar Actions */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              background: 'rgba(31, 41, 55, 0.8)',
              borderRadius: 16,
              padding: 2,
              border: '1px solid rgba(255, 255, 255, 0.1)',
            }}
          >
            <button
              onClick={handleSwitchToAdmin}
              style={{
                background: viewMode === 'ADMIN' ? 'linear-gradient(135deg, #7C3AED 0%, #6366F1 100%)' : 'transparent',
                border: 'none',
                color: '#FFF',
                padding: '4px 12px',
                borderRadius: 14,
                fontSize: 11,
                fontWeight: 800,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: 4,
                boxShadow: viewMode === 'ADMIN' ? '0 0 12px rgba(124, 58, 237, 0.5)' : 'none',
              }}
            >
              <ShieldCheck size={13} color={viewMode === 'ADMIN' ? '#F3E8FF' : '#C084FC'} />
              <span>Admin Panel</span>
            </button>
          </div>

          {viewMode !== 'ADMIN' && (
            <>
              <button
                onClick={() => setShowOnboarding(true)}
                style={{
                  background: 'rgba(255, 255, 255, 0.1)',
                  border: 'none',
                  color: '#D1D5DB',
                  borderRadius: 8,
                  padding: '4px 10px',
                  fontSize: 11,
                  fontWeight: 600,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 4,
                }}
              >
                <RefreshCw size={12} />
                <span>Replay Onboarding</span>
              </button>

              <div style={{ display: 'flex', gap: 4 }}>
                <button
                  onClick={() => setDeviceFrame('mobile')}
                  style={{
                    background: deviceFrame === 'mobile' ? 'rgba(59, 130, 246, 0.3)' : 'transparent',
                    border: 'none',
                    color: deviceFrame === 'mobile' ? '#60A5FA' : '#9CA3AF',
                    padding: 6,
                    borderRadius: 6,
                    cursor: 'pointer',
                  }}
                >
                  <Smartphone size={16} />
                </button>
                <button
                  onClick={() => setDeviceFrame('full')}
                  style={{
                    background: deviceFrame === 'full' ? 'rgba(59, 130, 246, 0.3)' : 'transparent',
                    border: 'none',
                    color: deviceFrame === 'full' ? '#60A5FA' : '#9CA3AF',
                    padding: 6,
                    borderRadius: 6,
                    cursor: 'pointer',
                  }}
                >
                  <Monitor size={16} />
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      {/* RENDER VIEW: ADMIN PANEL OR MOBILE APP */}
      {viewMode !== 'ADMIN' && !accountApproved && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 500, background: '#090D16', display: 'grid', placeItems: 'center', padding: 24 }}>
          <div style={{ width: 'min(100%, 440px)', textAlign: 'center', background: 'rgba(17,24,39,.92)', border: '1px solid rgba(245,158,11,.35)', borderRadius: 22, padding: 30, boxShadow: '0 24px 70px rgba(0,0,0,.4)' }}>
            <div style={{ width: 58, height: 58, margin: '0 auto 16px', borderRadius: 18, background: 'rgba(245,158,11,.14)', display: 'grid', placeItems: 'center', fontSize: 28 }}>⏳</div>
            <h2 style={{ color: '#F9FAFB', fontSize: 22, margin: '0 0 9px' }}>Seller approval pending</h2>
            <p style={{ color: '#9CA3AF', fontSize: 13, lineHeight: 1.6, margin: '0 auto 22px' }}>Your seller application has been submitted. You can access the Supplier Dashboard, Products, Leads, and Orders after an admin approves your account.</p>
            <button onClick={() => { logout(); setViewMode('ADMIN'); }} style={{ border: 0, borderRadius: 10, padding: '11px 18px', background: '#2563EB', color: '#FFF', fontWeight: 800, cursor: 'pointer' }}>Return to login</button>
          </div>
        </div>
      )}
      {viewMode === 'ADMIN' ? (
        <div style={{ flex: 1, width: '100%', height: 'calc(100vh - 46px)', overflow: 'hidden' }}>
          <AdminPanel onSwitchToMobile={handleRoleToggle} />
        </div>
      ) : (
        /* Main Mobile App Frame Container */
        <div
          style={{
            flex: 1,
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: deviceFrame === 'mobile' ? '12px 0' : 0,
            overflow: 'hidden',
          }}
        >
          <div
            style={{
              width: deviceFrame === 'mobile' ? '100%' : '100%',
              maxWidth: deviceFrame === 'mobile' ? 440 : '100%',
              height: deviceFrame === 'mobile' ? '96%' : '100%',
              maxHeight: deviceFrame === 'mobile' ? 880 : '100%',
              background: '#090D16',
              borderRadius: deviceFrame === 'mobile' ? 36 : 0,
              border: deviceFrame === 'mobile' ? '8px solid #1E293B' : 'none',
              boxShadow: deviceFrame === 'mobile' ? '0 25px 60px rgba(0, 0, 0, 0.8)' : 'none',
              display: 'flex',
              flexDirection: 'column',
              position: 'relative',
              overflow: 'hidden',
            }}
          >
            {/* Onboarding Overlay */}
            {showOnboarding && <OnboardingView onComplete={() => setShowOnboarding(false)} />}

            {/* Sticky Header Bar */}
            <HeaderBar
              onOpenNotifications={() => setActiveTab('MESSAGES')}
              onOpenSearch={() => setSearchModalOpen(true)}
            />

            {/* Dynamic Scrollable Screen Body */}
            <main
              style={{
                flex: 1,
                overflowY: 'auto',
                padding: 16,
                WebkitOverflowScrolling: 'touch',
              }}
            >
              {/* BUYER MODE VIEWS */}
              {isBuyer && activeTab === 'HOME' && (
                <BuyerHomeView
                  onSelectProduct={(p) => setSelectedProduct(p)}
                  onOpenRFQModal={() => {}}
                  onOpenChat={() => setActiveTab('MESSAGES')}
                />
              )}
              {isBuyer && activeTab === 'EXPLORE' && (
                <BuyerExploreView
                  onSelectProduct={(p) => setSelectedProduct(p)}
                  onOpenSearch={() => setSearchModalOpen(true)}
                />
              )}
              {isBuyer && activeTab === 'RFQ' && <BuyerRFQDeskView />}

              {/* SUPPLIER MODE VIEWS */}
              {!isBuyer && activeTab === 'DASHBOARD' && (
                <SupplierDashboardView
                  onOpenAddProduct={() => setAddProductModalOpen(true)}
                  onOpenLeads={() => setActiveTab('LEADS')}
                />
              )}
              {!isBuyer && activeTab === 'PRODUCTS' && (
                <SupplierProductsView
                  onOpenAddProduct={() => setAddProductModalOpen(true)}
                  onSelectProduct={(p) => setSelectedProduct(p)}
                />
              )}
              {!isBuyer && activeTab === 'LEADS' && (
                <SupplierLeadsView
                  onOpenQuotationBuilder={(lead) => setSelectedLeadForQuote(lead)}
                />
              )}

              {/* SHARED VIEWS */}
              {activeTab === 'ORDERS' && (
                <BuyerOrdersView onSelectOrder={() => {}} />
              )}
              {activeTab === 'MESSAGES' && <ChatView />}
              {activeTab === 'PROFILE' && <ProfileView />}
            </main>

            {/* Sticky Bottom Navigation Bar */}
            <BottomNavBar activeTab={activeTab} onTabChange={handleTabChange} />

            {/* Global Modals */}
            <GlobalSearchModal
              isOpen={searchModalOpen}
              onClose={() => setSearchModalOpen(false)}
              onSelectProduct={(p) => setSelectedProduct(p)}
            />

            <ProductDetailModal
              product={selectedProduct}
              onClose={() => setSelectedProduct(null)}
            />

            <RFQCreateModal />

            <QuotationBuilderModal
              lead={selectedLeadForQuote}
              isOpen={!!selectedLeadForQuote}
              onClose={() => setSelectedLeadForQuote(null)}
            />

            <RFQCompareModal />

            <AddProductModal
              isOpen={addProductModalOpen}
              onClose={() => setAddProductModalOpen(false)}
            />
          </div>
        </div>
      )}
    </div>
  );
};
