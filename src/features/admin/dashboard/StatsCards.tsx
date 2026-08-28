import React from 'react';
import { useAdminStore } from '../../../store/useAdminStore';
import { useOrderStore } from '../../../store/useOrderStore';
import { useProductStore } from '../../../store/useProductStore';
import { Users, Store, Package, ShoppingCart, ArrowUpRight } from 'lucide-react';
import { formatNumber } from '../../../utils/currency';

/* ─────────────────────────────────────────────────────────────────────────── */
/*  Skeleton Loader                                                             */
/* ─────────────────────────────────────────────────────────────────────────── */
const SkeletonCard: React.FC<{ isDark: boolean }> = ({ isDark }) => (
  <div
    style={{
      background: isDark ? 'rgba(17, 24, 39, 0.78)' : '#FFFFFF',
      border: `1px solid ${isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)'}`,
      borderRadius: 16,
      padding: '18px 20px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      minHeight: 96,
    }}
  >
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
      <div
        style={{
          width: 80,
          height: 11,
          borderRadius: 6,
          background: isDark ? 'rgba(255,255,255,0.07)' : '#E5E7EB',
          animation: 'pulse 1.4s ease-in-out infinite',
        }}
      />
      <div
        style={{
          width: 60,
          height: 22,
          borderRadius: 6,
          background: isDark ? 'rgba(255,255,255,0.07)' : '#E5E7EB',
          animation: 'pulse 1.4s ease-in-out infinite',
        }}
      />
    </div>
    <div
      style={{
        width: 44,
        height: 44,
        borderRadius: 10,
        background: isDark ? 'rgba(255,255,255,0.05)' : '#F3F4F6',
        animation: 'pulse 1.4s ease-in-out infinite',
      }}
    />
  </div>
);

/* ─────────────────────────────────────────────────────────────────────────── */
/*  Main Component                                                              */
/* ─────────────────────────────────────────────────────────────────────────── */
export const StatsCards: React.FC = () => {
  const { theme = 'dark', setActiveSection } = useAdminStore();
  const { orders = [] } = useOrderStore();
  const { products = [] } = useProductStore();

  const isDark = theme === 'dark';

  // Metrics are populated by the API-backed stores.
  const totalBuyers = 0;
  const totalSellers = 0;
  const totalProducts = products.length;
  const totalOrders = orders.length;

  const cards = [
    {
      id: 'buyers',
      label: 'Total Buyers',
      value: formatNumber(totalBuyers),
      change: 'No data available',
      icon: Users,
      color: '#3B82F6',
      bg: 'rgba(59, 130, 246, 0.12)',
      border: isDark ? 'rgba(59, 130, 246, 0.25)' : 'rgba(59, 130, 246, 0.15)',
      onClick: () => setActiveSection('BUYER_MGMT', 'BUYERS_LIST'),
    },
    {
      id: 'sellers',
      label: 'Total Sellers',
      value: formatNumber(totalSellers),
      change: 'No data available',
      icon: Store,
      color: '#10B981',
      bg: 'rgba(16, 185, 129, 0.12)',
      border: isDark ? 'rgba(16, 185, 129, 0.25)' : 'rgba(16, 185, 129, 0.15)',
      onClick: () => setActiveSection('SELLER_MGMT', 'SELLERS_LIST'),
    },
    {
      id: 'products',
      label: 'Total Products',
      value: formatNumber(totalProducts),
      change: 'No data available',
      icon: Package,
      color: '#A855F7',
      bg: 'rgba(168, 85, 247, 0.12)',
      border: isDark ? 'rgba(168, 85, 247, 0.25)' : 'rgba(168, 85, 247, 0.15)',
      onClick: () => setActiveSection('CATALOG_MGMT', 'CATALOG_PRODUCTS'),
    },
    {
      id: 'orders',
      label: 'Total Orders',
      value: formatNumber(totalOrders),
      change: 'No data available',
      icon: ShoppingCart,
      color: '#F59E0B',
      bg: 'rgba(245, 158, 11, 0.12)',
      border: isDark ? 'rgba(245, 158, 11, 0.25)' : 'rgba(245, 158, 11, 0.15)',
      onClick: () => setActiveSection('ORDER_MGMT', 'ORDERS_ALL'),
    },
  ];

  return (
    <>
      {/* Pulse animation for skeletons */}
      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.4; }
        }
        .stats-card { transition: transform 0.18s ease, box-shadow 0.18s ease; }
        .stats-card:hover { transform: translateY(-3px); }
      `}</style>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: 14,
        }}
        // Responsive via inline media queries aren't supported — handled via container class below
        className="stats-grid"
      >
        {cards.map((card) => {
          const Icon = card.icon;
          return (
            <div
              key={card.id}
              className="stats-card"
              onClick={card.onClick}
              style={{
                background: isDark ? 'rgba(17, 24, 39, 0.78)' : '#FFFFFF',
                border: `1px solid ${card.border}`,
                borderRadius: 16,
                padding: '18px 20px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                cursor: 'pointer',
                boxShadow: isDark ? 'none' : '0 4px 12px rgba(0,0,0,0.04)',
              }}
            >
              <div>
                <span
                  style={{
                    fontSize: 12,
                    color: '#9CA3AF',
                    fontWeight: 600,
                    letterSpacing: '0.01em',
                  }}
                >
                  {card.label}
                </span>
                <div
                  style={{
                    fontSize: 28,
                    fontWeight: 800,
                    color: isDark ? '#F9FAFB' : '#111827',
                    marginTop: 6,
                    lineHeight: 1,
                    letterSpacing: '-0.5px',
                  }}
                >
                  {card.value}
                </div>
                <div
                  style={{
                    fontSize: 11,
                    color: card.color,
                    fontWeight: 700,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 3,
                    marginTop: 8,
                  }}
                >
                  <ArrowUpRight size={12} />
                  <span>{card.change}</span>
                </div>
              </div>

              <div
                style={{
                  width: 48,
                  height: 48,
                  borderRadius: 12,
                  background: card.bg,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: card.color,
                  flexShrink: 0,
                }}
              >
                <Icon size={22} />
              </div>
            </div>
          );
        })}
      </div>

      {/* Responsive grid breakpoints via <style> tag */}
      <style>{`
        @media (max-width: 1024px) {
          .stats-grid { grid-template-columns: repeat(2, 1fr) !important; }
        }
        @media (max-width: 640px) {
          .stats-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </>
  );
};
