import React from 'react';
import { useProductStore } from '../../store/useProductStore';
import { useRFQStore } from '../../store/useRFQStore';
import { useOrderStore } from '../../store/useOrderStore';
import {
  MOCK_ADMIN_USERS,
  MOCK_ADMIN_ACTIVITIES,
  ADMIN_REVENUE_DATA,
} from '../../constants/mockData';
import {
  Users,
  Package,
  FileText,
  DollarSign,
  TrendingUp,
  ShoppingCart,
  ArrowUpRight,
  ArrowDownRight,
  Activity,
  Boxes,
  Clock,
  CheckCircle2,
  AlertCircle,
  Truck,
  User,
  Send,
} from 'lucide-react';

export const AdminDashboard: React.FC = () => {
  const { products } = useProductStore();
  const { rfqs, quotations } = useRFQStore();
  const { orders } = useOrderStore();

  const totalRevenue = ADMIN_REVENUE_DATA.reduce((sum, d) => sum + d.revenue, 0);
  const totalOrders = ADMIN_REVENUE_DATA.reduce((sum, d) => sum + d.orders, 0);
  const maxRevenue = Math.max(...ADMIN_REVENUE_DATA.map((d) => d.revenue));

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'ORDER': return <Truck size={14} />;
      case 'RFQ': return <FileText size={14} />;
      case 'USER': return <User size={14} />;
      case 'PRODUCT': return <Boxes size={14} />;
      case 'QUOTATION': return <Send size={14} />;
      default: return <Activity size={14} />;
    }
  };

  const getActivityColor = (type: string) => {
    switch (type) {
      case 'ORDER': return '#3B82F6';
      case 'RFQ': return '#F59E0B';
      case 'USER': return '#8B5CF6';
      case 'PRODUCT': return '#10B981';
      case 'QUOTATION': return '#06B6D4';
      default: return '#9CA3AF';
    }
  };

  const kpiCards = [
    {
      label: 'Total Revenue',
      value: `$${(totalRevenue / 1000).toFixed(0)}K`,
      change: '+18.4%',
      isPositive: true,
      icon: DollarSign,
      color: '#10B981',
      bgColor: 'rgba(16, 185, 129, 0.12)',
      borderColor: 'rgba(16, 185, 129, 0.25)',
    },
    {
      label: 'Total Orders',
      value: totalOrders.toString(),
      change: '+12.6%',
      isPositive: true,
      icon: ShoppingCart,
      color: '#3B82F6',
      bgColor: 'rgba(59, 130, 246, 0.12)',
      borderColor: 'rgba(59, 130, 246, 0.25)',
    },
    {
      label: 'Active Users',
      value: MOCK_ADMIN_USERS.filter((u) => u.isActive).length.toString(),
      change: '+3 this week',
      isPositive: true,
      icon: Users,
      color: '#8B5CF6',
      bgColor: 'rgba(139, 92, 246, 0.12)',
      borderColor: 'rgba(139, 92, 246, 0.25)',
    },
    {
      label: 'Active RFQs',
      value: rfqs.filter((r) => r.status === 'OPEN').length.toString(),
      change: `${quotations.length} quotes`,
      isPositive: true,
      icon: FileText,
      color: '#F59E0B',
      bgColor: 'rgba(245, 158, 11, 0.12)',
      borderColor: 'rgba(245, 158, 11, 0.25)',
    },
    {
      label: 'Products Listed',
      value: products.length.toString(),
      change: '100% published',
      isPositive: true,
      icon: Package,
      color: '#06B6D4',
      bgColor: 'rgba(6, 182, 212, 0.12)',
      borderColor: 'rgba(6, 182, 212, 0.25)',
    },
    {
      label: 'Avg. Order Value',
      value: `$${Math.round(totalRevenue / totalOrders).toLocaleString()}`,
      change: '+8.2%',
      isPositive: true,
      icon: TrendingUp,
      color: '#EC4899',
      bgColor: 'rgba(236, 72, 153, 0.12)',
      borderColor: 'rgba(236, 72, 153, 0.25)',
    },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      {/* Page Header */}
      <div>
        <h1 style={{ fontSize: 26, fontWeight: 800, color: '#F9FAFB', marginBottom: 4 }}>
          Platform Dashboard
        </h1>
        <p style={{ fontSize: 14, color: '#9CA3AF' }}>
          Real-time overview of the KFPL B2B Marketplace performance
        </p>
      </div>

      {/* KPI Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
        {kpiCards.map((kpi, i) => {
          const Icon = kpi.icon;
          return (
            <div
              key={i}
              style={{
                background: 'rgba(17, 24, 39, 0.7)',
                border: `1px solid ${kpi.borderColor}`,
                borderRadius: 16,
                padding: '20px 18px',
                display: 'flex',
                flexDirection: 'column',
                gap: 12,
                transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                cursor: 'default',
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLDivElement).style.transform = 'translateY(-2px)';
                (e.currentTarget as HTMLDivElement).style.boxShadow = `0 8px 24px ${kpi.bgColor}`;
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLDivElement).style.transform = 'translateY(0)';
                (e.currentTarget as HTMLDivElement).style.boxShadow = 'none';
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: 12,
                    background: kpi.bgColor,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: kpi.color,
                  }}
                >
                  <Icon size={20} />
                </div>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 4,
                    fontSize: 11,
                    fontWeight: 700,
                    color: kpi.isPositive ? '#34D399' : '#F87171',
                  }}
                >
                  {kpi.isPositive ? <ArrowUpRight size={13} /> : <ArrowDownRight size={13} />}
                  <span>{kpi.change}</span>
                </div>
              </div>
              <div>
                <div style={{ fontSize: 28, fontWeight: 800, color: '#F9FAFB', lineHeight: 1 }}>
                  {kpi.value}
                </div>
                <div style={{ fontSize: 12, color: '#9CA3AF', marginTop: 4, fontWeight: 600 }}>
                  {kpi.label}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Revenue Chart + Activity Feed */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.6fr 1fr', gap: 16 }}>
        {/* Revenue Chart */}
        <div
          style={{
            background: 'rgba(17, 24, 39, 0.7)',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            borderRadius: 16,
            padding: 20,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <TrendingUp size={20} color="#10B981" />
              <h3 style={{ fontSize: 16, fontWeight: 800, color: '#F9FAFB' }}>Revenue Performance</h3>
            </div>
            <span style={{ fontSize: 12, color: '#9CA3AF', fontWeight: 600 }}>2026 YTD</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', height: 180, paddingTop: 10 }}>
            {ADMIN_REVENUE_DATA.map((bar, i) => {
              const height = (bar.revenue / maxRevenue) * 100;
              const isLast = i === ADMIN_REVENUE_DATA.length - 1;
              return (
                <div
                  key={i}
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: 8,
                    flex: 1,
                  }}
                >
                  <span style={{ fontSize: 10, color: '#9CA3AF', fontWeight: 600 }}>
                    ${(bar.revenue / 1000).toFixed(0)}K
                  </span>
                  <div
                    style={{
                      width: 32,
                      height: `${height}%`,
                      background: isLast
                        ? 'linear-gradient(180deg, #F59E0B 0%, #D97706 100%)'
                        : `linear-gradient(180deg, rgba(59, 130, 246, ${0.4 + i * 0.08}) 0%, rgba(37, 99, 235, ${0.3 + i * 0.06}) 100%)`,
                      borderRadius: 8,
                      transition: 'height 0.6s ease',
                      minHeight: 8,
                    }}
                  />
                  <span style={{ fontSize: 11, color: '#9CA3AF', fontWeight: 600 }}>{bar.month}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Activity Feed */}
        <div
          style={{
            background: 'rgba(17, 24, 39, 0.7)',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            borderRadius: 16,
            padding: 20,
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
            <Activity size={20} color="#8B5CF6" />
            <h3 style={{ fontSize: 16, fontWeight: 800, color: '#F9FAFB' }}>Live Activity Feed</h3>
          </div>
          <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 2 }}>
            {MOCK_ADMIN_ACTIVITIES.map((act) => (
              <div
                key={act.id}
                style={{
                  padding: '10px 12px',
                  borderRadius: 10,
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: 10,
                  transition: 'background 0.15s ease',
                  cursor: 'default',
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLDivElement).style.background = 'rgba(31, 41, 55, 0.5)';
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLDivElement).style.background = 'transparent';
                }}
              >
                <div
                  style={{
                    width: 28,
                    height: 28,
                    borderRadius: 8,
                    background: `${getActivityColor(act.type)}18`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: getActivityColor(act.type),
                    flexShrink: 0,
                    marginTop: 1,
                  }}
                >
                  {getActivityIcon(act.type)}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 12, color: '#E5E7EB', fontWeight: 600, lineHeight: '1.4' }}>
                    {act.message}
                  </div>
                  <div style={{ fontSize: 10, color: '#6B7280', marginTop: 2 }}>
                    {act.actor} · {act.timestamp}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Orders Table */}
      <div
        style={{
          background: 'rgba(17, 24, 39, 0.7)',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          borderRadius: 16,
          padding: 20,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <ShoppingCart size={20} color="#3B82F6" />
            <h3 style={{ fontSize: 16, fontWeight: 800, color: '#F9FAFB' }}>Recent Orders</h3>
          </div>
          <span style={{ fontSize: 12, color: '#60A5FA', fontWeight: 600, cursor: 'pointer' }}>View All →</span>
        </div>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              {['Order #', 'Product', 'Buyer', 'Supplier', 'Amount', 'Status', 'Payment'].map((h) => (
                <th
                  key={h}
                  style={{
                    textAlign: 'left',
                    padding: '10px 12px',
                    fontSize: 11,
                    fontWeight: 700,
                    color: '#6B7280',
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px',
                    borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
                  }}
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => {
              const statusColors: Record<string, { bg: string; text: string }> = {
                SHIPPED: { bg: 'rgba(59, 130, 246, 0.15)', text: '#60A5FA' },
                DELIVERED: { bg: 'rgba(16, 185, 129, 0.15)', text: '#34D399' },
                CONFIRMED: { bg: 'rgba(167, 139, 250, 0.15)', text: '#C084FC' },
                PROCESSING: { bg: 'rgba(245, 158, 11, 0.15)', text: '#FBBF24' },
                PENDING: { bg: 'rgba(156, 163, 175, 0.15)', text: '#D1D5DB' },
                CANCELLED: { bg: 'rgba(239, 68, 68, 0.15)', text: '#F87171' },
              };
              const paymentColors: Record<string, { bg: string; text: string }> = {
                PAID: { bg: 'rgba(16, 185, 129, 0.15)', text: '#34D399' },
                PENDING: { bg: 'rgba(245, 158, 11, 0.15)', text: '#FBBF24' },
                ESCROW_HOLD: { bg: 'rgba(59, 130, 246, 0.15)', text: '#60A5FA' },
              };
              const sc = statusColors[order.status] || statusColors.PENDING;
              const pc = paymentColors[order.paymentStatus] || paymentColors.PENDING;

              return (
                <tr
                  key={order.id}
                  style={{ transition: 'background 0.15s ease', cursor: 'pointer' }}
                  onMouseEnter={(e) => { (e.currentTarget as HTMLTableRowElement).style.background = 'rgba(31, 41, 55, 0.4)'; }}
                  onMouseLeave={(e) => { (e.currentTarget as HTMLTableRowElement).style.background = 'transparent'; }}
                >
                  <td style={{ padding: '12px', fontSize: 13, fontWeight: 700, color: '#F9FAFB', borderBottom: '1px solid rgba(255, 255, 255, 0.05)' }}>
                    {order.orderNumber}
                  </td>
                  <td style={{ padding: '12px', fontSize: 12, color: '#D1D5DB', borderBottom: '1px solid rgba(255, 255, 255, 0.05)', maxWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {order.productTitle}
                  </td>
                  <td style={{ padding: '12px', fontSize: 12, color: '#D1D5DB', borderBottom: '1px solid rgba(255, 255, 255, 0.05)' }}>
                    {order.buyerName}
                  </td>
                  <td style={{ padding: '12px', fontSize: 12, color: '#D1D5DB', borderBottom: '1px solid rgba(255, 255, 255, 0.05)' }}>
                    {order.supplierName}
                  </td>
                  <td style={{ padding: '12px', fontSize: 13, fontWeight: 700, color: '#10B981', borderBottom: '1px solid rgba(255, 255, 255, 0.05)' }}>
                    ${order.totalAmount.toLocaleString()}
                  </td>
                  <td style={{ padding: '12px', borderBottom: '1px solid rgba(255, 255, 255, 0.05)' }}>
                    <span style={{ fontSize: 10, fontWeight: 700, padding: '3px 10px', borderRadius: 6, background: sc.bg, color: sc.text }}>
                      {order.status}
                    </span>
                  </td>
                  <td style={{ padding: '12px', borderBottom: '1px solid rgba(255, 255, 255, 0.05)' }}>
                    <span style={{ fontSize: 10, fontWeight: 700, padding: '3px 10px', borderRadius: 6, background: pc.bg, color: pc.text }}>
                      {order.paymentStatus.replace('_', ' ')}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
