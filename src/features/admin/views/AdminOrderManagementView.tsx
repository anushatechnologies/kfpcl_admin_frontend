import React, { useState } from 'react';
import { useAdminStore } from '../../../store/useAdminStore';
import { useOrderStore } from '../../../store/useOrderStore';
import { OrderItem } from '../../../types';
import { PageTabs, TabItem } from '../../../components/common/PageTabs';
import {
  ShoppingCart,
  Search,
  Truck,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  X,
  MapPin,
  Package,
  Clock,
} from 'lucide-react';

export const AdminOrderManagementView: React.FC = () => {
  const { activeSubSection, setActiveSubSection, formatCurrency, theme = 'dark' } = useAdminStore();
  const { orders = [] } = useOrderStore();
  const [search, setSearch] = useState('');
  const [selectedOrder, setSelectedOrder] = useState<OrderItem | null>(null);

  const isDark = theme === 'dark';

  const getFilterFromSubSection = () => {
    switch (activeSubSection) {
      case 'ORDERS_PENDING': return 'PENDING';
      case 'ORDERS_PROCESSING': return 'PROCESSING';
      case 'ORDERS_SHIPPED': return 'SHIPPED';
      case 'ORDERS_DELIVERED': return 'DELIVERED';
      case 'ORDERS_CANCELLED': return 'CANCELLED';
      default: return 'ALL';
    }
  };

  const statusFilter = getFilterFromSubSection();

  const filteredOrders = orders.filter((o) => {
    const matchesSearch =
      o.orderNumber.toLowerCase().includes(search.toLowerCase()) ||
      o.productTitle.toLowerCase().includes(search.toLowerCase()) ||
      o.buyerName.toLowerCase().includes(search.toLowerCase()) ||
      o.supplierName.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === 'ALL' || o.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const subTabs: TabItem[] = [
    { id: 'ORDERS_ALL', label: 'All Orders', badge: orders.length },
    { id: 'ORDERS_PENDING', label: 'Pending', badge: orders.filter((o) => o.status === 'PENDING').length || undefined },
    { id: 'ORDERS_PROCESSING', label: 'Processing', badge: orders.filter((o) => o.status === 'PROCESSING').length || undefined },
    { id: 'ORDERS_SHIPPED', label: 'Shipped', badge: orders.filter((o) => o.status === 'SHIPPED').length || undefined },
    { id: 'ORDERS_DELIVERED', label: 'Delivered', badge: orders.filter((o) => o.status === 'DELIVERED').length || undefined },
    { id: 'ORDERS_CANCELLED', label: 'Cancelled', badge: orders.filter((o) => o.status === 'CANCELLED').length || undefined },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
      {/* Sub Navigation via PageTabs */}
      <PageTabs
        tabs={subTabs}
        activeTabId={activeSubSection === 'ROOT' ? 'ORDERS_ALL' : activeSubSection}
        onChangeTab={(id) => setActiveSubSection(id as any)}
        theme={theme}
      />

      {/* Filter and Search */}
      <div
        style={{
          background: isDark ? 'rgba(17, 24, 39, 0.75)' : '#FFFFFF',
          border: `1px solid ${isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.08)'}`,
          borderRadius: 12,
          padding: 10,
          display: 'flex',
          alignItems: 'center',
          gap: 8,
        }}
      >
        <Search size={16} color="#60A5FA" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Filter orders by Order #, product name, buyer, supplier..."
          style={{
            flex: 1,
            background: 'transparent',
            border: 'none',
            color: isDark ? '#FFF' : '#111827',
            fontSize: 13,
            outline: 'none',
          }}
        />
      </div>

      {/* Orders Grid Table */}
      <div style={{ background: isDark ? 'rgba(17, 24, 39, 0.75)' : '#FFFFFF', border: `1px solid ${isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.08)'}`, borderRadius: 14, overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: isDark ? 'rgba(15, 23, 42, 0.6)' : '#F3F4F6' }}>
              {['Order # / Date', 'Procured Product', 'Supplier / Buyer', 'Amount', 'Escrow Hold Status', 'Action'].map((h) => (
                <th key={h} style={{ textAlign: 'left', padding: '12px 14px', fontSize: 11, fontWeight: 700, color: '#9CA3AF', textTransform: 'uppercase' }}>
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filteredOrders.map((o) => (
              <tr key={o.id} style={{ borderBottom: `1px solid ${isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.05)'}` }}>
                <td style={{ padding: '12px 14px' }}>
                  <div style={{ fontSize: 13, fontWeight: 700, color: isDark ? '#FFF' : '#111827' }}>#{o.orderNumber}</div>
                  <div style={{ fontSize: 11, color: '#9CA3AF' }}>{o.orderDate}</div>
                </td>
                <td style={{ padding: '12px 14px' }}>
                  <div style={{ fontSize: 12, fontWeight: 600, color: isDark ? '#E5E7EB' : '#374151' }}>{o.productTitle}</div>
                  <div style={{ fontSize: 11, color: '#9CA3AF' }}>Quantity: {o.quantity} units</div>
                </td>
                <td style={{ padding: '12px 14px' }}>
                  <div style={{ fontSize: 12, color: isDark ? '#FFF' : '#111827' }}>Seller: <strong>{o.supplierName}</strong></div>
                  <div style={{ fontSize: 11, color: '#9CA3AF' }}>Buyer: <strong>{o.buyerName}</strong></div>
                </td>
                <td style={{ padding: '12px 14px', fontSize: 12, fontWeight: 800, color: '#10B981' }}>
                  {formatCurrency(o.totalAmount)}
                </td>
                <td style={{ padding: '12px 14px' }}>
                  <span
                    style={{
                      fontSize: 10,
                      fontWeight: 800,
                      padding: '2px 8px',
                      borderRadius: 6,
                      background: o.status === 'DELIVERED'
                        ? 'rgba(16, 185, 129, 0.15)'
                        : o.status === 'CANCELLED'
                        ? 'rgba(239, 68, 68, 0.15)'
                        : 'rgba(245, 158, 11, 0.15)',
                      color: o.status === 'DELIVERED' ? '#34D399' : o.status === 'CANCELLED' ? '#F87171' : '#FBBF24',
                    }}
                  >
                    {o.status === 'DELIVERED' ? 'ESCROW SETTLED' : o.status === 'CANCELLED' ? 'REFUNDED' : 'ESCROW HOLD'}
                  </span>
                </td>
                <td style={{ padding: '12px 14px' }}>
                  <button
                    onClick={() => setSelectedOrder(o)}
                    style={{
                      background: 'rgba(37, 99, 235, 0.15)',
                      border: '1px solid rgba(37, 99, 235, 0.3)',
                      color: '#60A5FA',
                      borderRadius: 8,
                      padding: '5px 10px',
                      fontSize: 11,
                      fontWeight: 700,
                      cursor: 'pointer',
                    }}
                  >
                    Tracking details
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Tracking Modal */}
      {selectedOrder && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 9999, background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
          <div onClick={(event) => event.stopPropagation()} style={{ width: '100%', maxWidth: 680, maxHeight: '90vh', overflowY: 'auto', background: isDark ? '#0F172A' : '#FFFFFF', borderRadius: 16, border: `1px solid ${isDark ? 'rgba(37, 99, 235, 0.3)' : 'rgba(37, 99, 235, 0.15)'}`, padding: 24, boxShadow: '0 24px 70px rgba(0,0,0,.35)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 16 }}><div><div style={{ color: '#60A5FA', fontSize: 10, fontWeight: 800, letterSpacing: '.08em' }}>FULFILLMENT TRACKING</div><h3 style={{ fontSize: 21, fontWeight: 800, color: isDark ? '#FFF' : '#111827', margin: '7px 0 4px' }}>Order #{selectedOrder.orderNumber}</h3><div style={{ fontSize: 12, color: '#9CA3AF' }}>Placed on {selectedOrder.orderDate}</div></div><button type="button" onClick={() => setSelectedOrder(null)} aria-label="Close tracking details" style={{ border: 0, borderRadius: 8, width: 32, height: 32, background: isDark ? 'rgba(255,255,255,.08)' : '#F1F5F9', color: '#94A3B8', cursor: 'pointer' }}><X size={15} /></button></div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 9, marginTop: 20 }}>
              {[['Current status', selectedOrder.status, selectedOrder.status === 'DELIVERED' ? '#34D399' : '#FBBF24'], ['Tracking code', selectedOrder.trackingNumber || 'Not assigned', '#60A5FA'], ['Quantity', `${selectedOrder.quantity} units`, isDark ? '#FFF' : '#111827']].map(([label, value, color]) => <div key={String(label)} style={{ background: isDark ? 'rgba(30,41,59,.72)' : '#F8FAFC', borderRadius: 10, padding: 11 }}><div style={{ color: '#94A3B8', fontSize: 10 }}>{label}</div><strong style={{ display: 'block', marginTop: 4, color: String(color), fontSize: 12, lineHeight: 1.35 }}>{value}</strong></div>)}
            </div>

            <div style={{ marginTop: 22, padding: 16, borderRadius: 12, background: isDark ? 'rgba(30,41,59,.5)' : '#F8FAFC', border: `1px solid ${isDark ? 'rgba(148,163,184,.14)' : '#E2E8F0'}` }}><div style={{ display: 'flex', alignItems: 'center', gap: 7, color: isDark ? '#FFF' : '#111827', fontSize: 13, fontWeight: 800, marginBottom: 16 }}><Package size={15} color="#60A5FA" />Shipment progress</div><div style={{ display: 'flex', alignItems: 'flex-start' }}>{['Order confirmed', 'Processing', 'Shipped', 'Delivered'].map((step, index) => { const orderStep = ['CONFIRMED', 'PROCESSING', 'SHIPPED', 'DELIVERED'].indexOf(selectedOrder.status); const complete = index <= orderStep; return <React.Fragment key={step}><div style={{ flex: 1, textAlign: 'center' }}><div style={{ width: 24, height: 24, margin: '0 auto 7px', borderRadius: 12, display: 'grid', placeItems: 'center', background: complete ? '#2563EB' : (isDark ? '#334155' : '#CBD5E1'), color: '#FFF', fontSize: 11, fontWeight: 800 }}>{complete ? '✓' : index + 1}</div><div style={{ color: complete ? (isDark ? '#E2E8F0' : '#334155') : '#94A3B8', fontSize: 10, fontWeight: complete ? 800 : 600 }}>{step}</div></div>{index < 3 && <div style={{ height: 2, flex: 1, marginTop: 11, background: index < orderStep ? '#2563EB' : (isDark ? '#334155' : '#CBD5E1') }} />}</React.Fragment>; })}</div></div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginTop: 18 }}><div style={{ padding: 13, borderRadius: 10, border: `1px solid ${isDark ? 'rgba(148,163,184,.14)' : '#E2E8F0'}` }}><div style={{ color: '#94A3B8', fontSize: 10, fontWeight: 800, marginBottom: 9 }}>ORDER DETAILS</div><div style={{ color: isDark ? '#E2E8F0' : '#334155', fontSize: 12, lineHeight: 1.7 }}><strong>{selectedOrder.productTitle}</strong><br />Supplier: {selectedOrder.supplierName}<br />Buyer: {selectedOrder.buyerName}<br />Amount: ₹{(selectedOrder.totalAmount * 82).toLocaleString('en-IN')}</div></div><div style={{ padding: 13, borderRadius: 10, border: `1px solid ${isDark ? 'rgba(148,163,184,.14)' : '#E2E8F0'}` }}><div style={{ display: 'flex', alignItems: 'center', gap: 5, color: '#94A3B8', fontSize: 10, fontWeight: 800, marginBottom: 9 }}><MapPin size={12} /> DELIVERY ADDRESS</div><div style={{ color: isDark ? '#E2E8F0' : '#334155', fontSize: 12, lineHeight: 1.55 }}>{selectedOrder.deliveryAddress}</div><div style={{ display: 'flex', alignItems: 'center', gap: 5, color: '#94A3B8', fontSize: 10, marginTop: 10 }}><Clock size={12} /> Payment: {selectedOrder.paymentStatus.replace('_', ' ')}</div></div></div>

            <button type="button" onClick={() => setSelectedOrder(null)} style={{ width: '100%', marginTop: 22, background: '#2563EB', color: '#FFF', border: 'none', borderRadius: 8, padding: '11px 16px', fontSize: 13, fontWeight: 800, cursor: 'pointer' }}>Close details</button>
          </div>
        </div>
      )}
    </div>
  );
};
