import React from 'react';
import { useAdminStore } from '../../../store/useAdminStore';
import { DashboardOrderStatus } from '../../../services/adminDashboardApi';

interface Props { data: DashboardOrderStatus[]; }
export const OrderStatusBreakdown: React.FC<Props> = ({ data }) => {
  const { theme = 'dark', setActiveSection } = useAdminStore();
  const isDark = theme === 'dark';

  const orderStatusCounts = data.map((item) => ({ ...item, label: item.status.charAt(0) + item.status.slice(1).toLowerCase(), color: ({ PENDING: '#F59E0B', PROCESSING: '#60A5FA', SHIPPED: '#3B82F6', DELIVERED: '#10B981', CANCELLED: '#EF4444' } as Record<string, string>)[item.status], sub: `ORDERS_${item.status}` as any }));

  const totalSum = orderStatusCounts.reduce((acc, c) => acc + c.count, 0);

  return (
    <div
      style={{
        background: isDark ? 'rgba(17, 24, 39, 0.75)' : '#FFFFFF',
        border: `1px solid ${isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.08)'}`,
        borderRadius: 16,
        padding: 20,
        display: 'flex',
        flexDirection: 'column',
        gap: 14,
        transition: 'all 0.2s ease',
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h3 style={{ fontSize: 16, fontWeight: 800, color: isDark ? '#FFF' : '#111827' }}>Order Status Breakdown</h3>
        <span style={{ fontSize: 11, color: '#9CA3AF' }}>Total: <strong>{totalSum}</strong></span>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 10, flex: 1, justifyContent: 'center' }}>
        {orderStatusCounts.length === 0 && <div style={{ color: isDark ? '#94A3B8' : '#64748B', padding: 25, textAlign: 'center' }}>No order status data available.</div>}
        {orderStatusCounts.map((item, idx) => {
          const pct = totalSum === 0 ? '0.0' : ((item.count / totalSum) * 100).toFixed(1);
          return (
            <div
              key={idx}
              onClick={() => setActiveSection('ORDER_MGMT', item.sub)}
              style={{ display: 'flex', flexDirection: 'column', gap: 4, cursor: 'pointer' }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <span style={{ width: 8, height: 8, borderRadius: 4, background: item.color }} />
                  <span style={{ color: isDark ? '#E5E7EB' : '#374151', fontWeight: 600 }}>{item.label}</span>
                </div>
                <strong style={{ color: isDark ? '#FFF' : '#111827' }}>
                  {item.count} <span style={{ color: '#6B7280', fontSize: 10 }}>({pct}%)</span>
                </strong>
              </div>
              <div style={{ width: '100%', height: 6, background: isDark ? 'rgba(31, 41, 55, 0.8)' : '#E5E7EB', borderRadius: 3, overflow: 'hidden' }}>
                <div style={{ width: `${pct}%`, height: '100%', background: item.color, borderRadius: 3 }} />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
