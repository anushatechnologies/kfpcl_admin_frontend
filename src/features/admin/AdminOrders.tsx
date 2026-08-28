import React, { useState } from 'react';
import { useOrderStore } from '../../store/useOrderStore';
import { OrderItem } from '../../types';
import {
  ShoppingCart,
  Search,
  Truck,
  ShieldCheck,
  Package,
  CheckCircle2,
  Clock,
  AlertCircle,
  Download,
  Filter,
  Eye,
  Edit,
  ExternalLink,
} from 'lucide-react';

export const AdminOrders: React.FC = () => {
  const { orders, updateOrderStatus } = useOrderStore();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'ALL' | OrderItem['status']>('ALL');
  const [paymentFilter, setPaymentFilter] = useState<'ALL' | OrderItem['paymentStatus']>('ALL');
  const [selectedOrder, setSelectedOrder] = useState<OrderItem | null>(null);
  const [newTracking, setNewTracking] = useState('');

  const filteredOrders = orders.filter((o) => {
    const matchesSearch =
      o.orderNumber.toLowerCase().includes(search.toLowerCase()) ||
      o.productTitle.toLowerCase().includes(search.toLowerCase()) ||
      o.buyerName.toLowerCase().includes(search.toLowerCase()) ||
      o.supplierName.toLowerCase().includes(search.toLowerCase()) ||
      (o.trackingNumber && o.trackingNumber.toLowerCase().includes(search.toLowerCase()));
    const matchesStatus = statusFilter === 'ALL' || o.status === statusFilter;
    const matchesPayment = paymentFilter === 'ALL' || o.paymentStatus === paymentFilter;
    return matchesSearch && matchesStatus && matchesPayment;
  });

  const handleStatusChange = (orderId: string, newStatus: OrderItem['status']) => {
    updateOrderStatus(orderId, newStatus);
    if (selectedOrder && selectedOrder.id === orderId) {
      setSelectedOrder({ ...selectedOrder, status: newStatus });
    }
  };

  const handleUpdateTracking = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedOrder || !newTracking) return;
    updateOrderStatus(selectedOrder.id, selectedOrder.status, newTracking);
    setSelectedOrder({ ...selectedOrder, trackingNumber: newTracking });
    setNewTracking('');
  };

  const exportOrdersCSV = () => {
    const headers = ['Order #', 'Date', 'Product', 'Buyer', 'Supplier', 'Qty', 'Unit Price', 'Total Amount', 'Status', 'Payment', 'Tracking', 'Address'];
    const rows = filteredOrders.map((o) => [
      o.orderNumber,
      o.orderDate,
      `"${o.productTitle.replace(/"/g, '""')}"`,
      `"${o.buyerName}"`,
      `"${o.supplierName}"`,
      o.quantity,
      o.unitPrice,
      o.totalAmount,
      o.status,
      o.paymentStatus,
      o.trackingNumber || 'N/A',
      `"${o.deliveryAddress.replace(/"/g, '""')}"`,
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `kfpl_orders_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <h1 style={{ fontSize: 24, fontWeight: 800, color: '#F9FAFB' }}>Enterprise Orders & Escrow Ledger</h1>
          <p style={{ fontSize: 13, color: '#9CA3AF', marginTop: 2 }}>
            Manage wholesale purchase orders, escrow fulfillment releases, and carrier tracking updates
          </p>
        </div>

        <button
          onClick={exportOrdersCSV}
          style={{
            background: 'rgba(31, 41, 55, 0.8)',
            border: '1px solid rgba(255, 255, 255, 0.12)',
            borderRadius: 10,
            padding: '8px 14px',
            color: '#D1D5DB',
            fontSize: 12,
            fontWeight: 700,
            display: 'flex',
            alignItems: 'center',
            gap: 6,
            cursor: 'pointer',
          }}
        >
          <Download size={14} />
          <span>Export Orders CSV</span>
        </button>
      </div>

      {/* Filters Bar */}
      <div
        style={{
          background: 'rgba(17, 24, 39, 0.75)',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          borderRadius: 14,
          padding: 14,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 12,
          flexWrap: 'wrap',
        }}
      >
        <div
          style={{
            flex: 1,
            minWidth: 260,
            background: 'rgba(31, 41, 55, 0.8)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: 10,
            padding: '8px 12px',
            display: 'flex',
            alignItems: 'center',
            gap: 8,
          }}
        >
          <Search size={16} color="#3B82F6" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by order #, product, buyer, tracking..."
            style={{
              background: 'transparent',
              border: 'none',
              color: '#FFF',
              fontSize: 13,
              outline: 'none',
              width: '100%',
            }}
          />
        </div>

        {/* Order Status Filters */}
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
          {(['ALL', 'CONFIRMED', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED'] as const).map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st as any)}
              style={{
                background: statusFilter === st ? '#2563EB' : 'rgba(31, 41, 55, 0.6)',
                border: statusFilter === st ? '1px solid #3B82F6' : '1px solid rgba(255, 255, 255, 0.08)',
                color: statusFilter === st ? '#FFF' : '#9CA3AF',
                borderRadius: 8,
                padding: '5px 10px',
                fontSize: 11,
                fontWeight: 700,
                cursor: 'pointer',
              }}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Orders Table */}
      <div
        style={{
          background: 'rgba(17, 24, 39, 0.75)',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          borderRadius: 16,
          overflow: 'hidden',
        }}
      >
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: 'rgba(15, 23, 42, 0.6)' }}>
              {['Order Details', 'Parties Involved', 'Amount & Qty', 'Carrier Tracking', 'Order Stage', 'Escrow Payment', 'Admin Action'].map((h) => (
                <th
                  key={h}
                  style={{
                    textAlign: 'left',
                    padding: '12px 14px',
                    fontSize: 11,
                    fontWeight: 700,
                    color: '#9CA3AF',
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
            {filteredOrders.length === 0 ? (
              <tr>
                <td colSpan={7} style={{ textAlign: 'center', padding: 40, color: '#9CA3AF' }}>
                  No orders found.
                </td>
              </tr>
            ) : (
              filteredOrders.map((order) => {
                const statusStyles: Record<string, { bg: string; text: string; border: string }> = {
                  DELIVERED: { bg: 'rgba(16, 185, 129, 0.15)', text: '#34D399', border: 'rgba(16, 185, 129, 0.3)' },
                  SHIPPED: { bg: 'rgba(59, 130, 246, 0.15)', text: '#60A5FA', border: 'rgba(59, 130, 246, 0.3)' },
                  PROCESSING: { bg: 'rgba(245, 158, 11, 0.15)', text: '#FBBF24', border: 'rgba(245, 158, 11, 0.3)' },
                  CONFIRMED: { bg: 'rgba(167, 139, 250, 0.15)', text: '#C084FC', border: 'rgba(167, 139, 250, 0.3)' },
                  PENDING: { bg: 'rgba(156, 163, 175, 0.15)', text: '#D1D5DB', border: 'rgba(156, 163, 175, 0.3)' },
                  CANCELLED: { bg: 'rgba(239, 68, 68, 0.15)', text: '#F87171', border: 'rgba(239, 68, 68, 0.3)' },
                };

                const ss = statusStyles[order.status] || statusStyles.PENDING;

                return (
                  <tr
                    key={order.id}
                    style={{
                      borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
                      transition: 'background 0.15s ease',
                    }}
                    onMouseEnter={(e) => {
                      (e.currentTarget as HTMLTableRowElement).style.background = 'rgba(31, 41, 55, 0.4)';
                    }}
                    onMouseLeave={(e) => {
                      (e.currentTarget as HTMLTableRowElement).style.background = 'transparent';
                    }}
                  >
                    {/* Order Details */}
                    <td style={{ padding: '12px 14px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <img
                          src={order.productImage}
                          alt={order.productTitle}
                          style={{ width: 40, height: 40, borderRadius: 8, objectFit: 'cover', background: '#111827' }}
                        />
                        <div>
                          <div style={{ fontSize: 13, fontWeight: 800, color: '#F9FAFB' }}>{order.orderNumber}</div>
                          <div style={{ fontSize: 11, color: '#9CA3AF', maxWidth: 180, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                            {order.productTitle}
                          </div>
                          <div style={{ fontSize: 10, color: '#6B7280' }}>Date: {order.orderDate}</div>
                        </div>
                      </div>
                    </td>

                    {/* Parties */}
                    <td style={{ padding: '12px 14px' }}>
                      <div style={{ fontSize: 12, color: '#D1D5DB' }}>
                        Buyer: <strong style={{ color: '#FFF' }}>{order.buyerName}</strong>
                      </div>
                      <div style={{ fontSize: 11, color: '#9CA3AF', marginTop: 2 }}>
                        Supplier: <strong style={{ color: '#E5E7EB' }}>{order.supplierName}</strong>
                      </div>
                    </td>

                    {/* Amount & Qty */}
                    <td style={{ padding: '12px 14px' }}>
                      <div style={{ fontSize: 14, fontWeight: 800, color: '#10B981' }}>
                        ${order.totalAmount.toLocaleString()}
                      </div>
                      <div style={{ fontSize: 11, color: '#9CA3AF', marginTop: 2 }}>
                        {order.quantity} units @ ${order.unitPrice}/ea
                      </div>
                    </td>

                    {/* Carrier Tracking */}
                    <td style={{ padding: '12px 14px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: '#60A5FA' }}>
                        <Truck size={13} />
                        <span>{order.trackingNumber || 'Pending pickup'}</span>
                      </div>
                    </td>

                    {/* Status Dropdown */}
                    <td style={{ padding: '12px 14px' }}>
                      <select
                        value={order.status}
                        onChange={(e) => handleStatusChange(order.id, e.target.value as any)}
                        style={{
                          background: ss.bg,
                          border: `1px solid ${ss.border}`,
                          color: ss.text,
                          borderRadius: 8,
                          padding: '4px 8px',
                          fontSize: 11,
                          fontWeight: 700,
                          cursor: 'pointer',
                        }}
                      >
                        <option value="CONFIRMED">CONFIRMED</option>
                        <option value="PROCESSING">PROCESSING</option>
                        <option value="SHIPPED">SHIPPED</option>
                        <option value="DELIVERED">DELIVERED</option>
                        <option value="CANCELLED">CANCELLED</option>
                      </select>
                    </td>

                    {/* Escrow Status */}
                    <td style={{ padding: '12px 14px' }}>
                      <div
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: 4,
                          fontSize: 11,
                          fontWeight: 700,
                          padding: '3px 8px',
                          borderRadius: 6,
                          background:
                            order.paymentStatus === 'PAID'
                              ? 'rgba(16, 185, 129, 0.15)'
                              : 'rgba(59, 130, 246, 0.15)',
                          color: order.paymentStatus === 'PAID' ? '#34D399' : '#60A5FA',
                          border: `1px solid ${
                            order.paymentStatus === 'PAID' ? 'rgba(16, 185, 129, 0.3)' : 'rgba(59, 130, 246, 0.3)'
                          }`,
                        }}
                      >
                        <ShieldCheck size={12} />
                        <span>{order.paymentStatus.replace('_', ' ')}</span>
                      </div>
                    </td>

                    {/* Actions */}
                    <td style={{ padding: '12px 14px' }}>
                      <button
                        onClick={() => setSelectedOrder(order)}
                        style={{
                          background: 'rgba(31, 41, 55, 0.8)',
                          border: '1px solid rgba(255, 255, 255, 0.1)',
                          borderRadius: 6,
                          color: '#60A5FA',
                          padding: '4px 8px',
                          fontSize: 11,
                          fontWeight: 700,
                          display: 'flex',
                          alignItems: 'center',
                          gap: 4,
                          cursor: 'pointer',
                        }}
                      >
                        <Eye size={12} />
                        <span>Inspect</span>
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Order Inspection Modal */}
      {selectedOrder && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 9999,
            background: 'rgba(0,0,0,0.75)',
            backdropFilter: 'blur(8px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: 20,
          }}
        >
          <div
            style={{
              width: '100%',
              maxWidth: 520,
              background: '#0F172A',
              borderRadius: 16,
              border: '1px solid rgba(255,255,255,0.15)',
              padding: 24,
              boxShadow: '0 20px 50px rgba(0,0,0,0.8)',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <div>
                <h3 style={{ fontSize: 18, fontWeight: 800, color: '#F9FAFB' }}>Order #{selectedOrder.orderNumber}</h3>
                <span style={{ fontSize: 11, color: '#9CA3AF' }}>Placed on {selectedOrder.orderDate}</span>
              </div>
              <span
                style={{
                  fontSize: 11,
                  fontWeight: 800,
                  padding: '4px 10px',
                  borderRadius: 8,
                  background: 'rgba(59, 130, 246, 0.2)',
                  color: '#60A5FA',
                }}
              >
                {selectedOrder.status}
              </span>
            </div>

            <div style={{ background: 'rgba(31, 41, 55, 0.6)', padding: 14, borderRadius: 12, marginBottom: 14 }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: '#FFF' }}>{selectedOrder.productTitle}</div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 6, fontSize: 12, color: '#D1D5DB' }}>
                <span>Quantity: {selectedOrder.quantity} units</span>
                <span style={{ color: '#10B981', fontWeight: 700 }}>Total: ${selectedOrder.totalAmount.toLocaleString()}</span>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 14 }}>
              <div style={{ background: 'rgba(31, 41, 55, 0.4)', padding: 10, borderRadius: 8 }}>
                <div style={{ fontSize: 11, color: '#9CA3AF' }}>Buyer Name</div>
                <div style={{ fontSize: 13, fontWeight: 700, color: '#FFF', marginTop: 2 }}>{selectedOrder.buyerName}</div>
              </div>
              <div style={{ background: 'rgba(31, 41, 55, 0.4)', padding: 10, borderRadius: 8 }}>
                <div style={{ fontSize: 11, color: '#9CA3AF' }}>Supplier Name</div>
                <div style={{ fontSize: 13, fontWeight: 700, color: '#FFF', marginTop: 2 }}>{selectedOrder.supplierName}</div>
              </div>
            </div>

            <div style={{ marginBottom: 14 }}>
              <div style={{ fontSize: 11, color: '#9CA3AF', marginBottom: 4 }}>Delivery Destination</div>
              <div style={{ fontSize: 12, color: '#E5E7EB', background: 'rgba(31, 41, 55, 0.4)', padding: 8, borderRadius: 8 }}>
                {selectedOrder.deliveryAddress}
              </div>
            </div>

            {/* Carrier Tracking Form */}
            <form onSubmit={handleUpdateTracking} style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
              <input
                type="text"
                value={newTracking}
                onChange={(e) => setNewTracking(e.target.value)}
                placeholder={`Current: ${selectedOrder.trackingNumber || 'No tracking'}`}
                style={{
                  flex: 1,
                  background: 'rgba(31, 41, 55, 0.8)',
                  border: '1px solid rgba(255, 255, 255, 0.15)',
                  borderRadius: 8,
                  padding: '8px 12px',
                  color: '#FFF',
                  fontSize: 12,
                }}
              />
              <button
                type="submit"
                style={{
                  background: '#2563EB',
                  color: '#FFF',
                  border: 'none',
                  borderRadius: 8,
                  padding: '8px 14px',
                  fontSize: 12,
                  fontWeight: 700,
                  cursor: 'pointer',
                }}
              >
                Set Tracking
              </button>
            </form>

            <button
              onClick={() => setSelectedOrder(null)}
              style={{
                width: '100%',
                background: 'rgba(255, 255, 255, 0.1)',
                color: '#FFF',
                border: 'none',
                borderRadius: 8,
                padding: '10px 0',
                fontSize: 13,
                fontWeight: 700,
                cursor: 'pointer',
              }}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
