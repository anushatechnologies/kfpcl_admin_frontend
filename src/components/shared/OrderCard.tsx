import React from 'react';
import { OrderItem } from '../../types';
import { Truck, CheckCircle2, Clock, Package, FileText, ChevronRight, ShieldCheck } from 'lucide-react';

interface Props {
  order: OrderItem;
  onPress: (order: OrderItem) => void;
  onUpdateStatus?: (orderId: string, status: OrderItem['status'], trackingNumber?: string) => void;
  isSupplierView?: boolean;
}

export const OrderCard: React.FC<Props> = ({ order, onPress, onUpdateStatus, isSupplierView = false }) => {
  const getStatusColor = (status: OrderItem['status']) => {
    switch (status) {
      case 'DELIVERED':
        return { bg: 'rgba(16, 185, 129, 0.2)', text: '#34D399', border: 'rgba(16, 185, 129, 0.3)' };
      case 'SHIPPED':
        return { bg: 'rgba(59, 130, 246, 0.2)', text: '#60A5FA', border: 'rgba(59, 130, 246, 0.3)' };
      case 'PROCESSING':
        return { bg: 'rgba(245, 158, 11, 0.2)', text: '#FBBF24', border: 'rgba(245, 158, 11, 0.3)' };
      case 'CONFIRMED':
        return { bg: 'rgba(167, 139, 250, 0.2)', text: '#C084FC', border: 'rgba(167, 139, 250, 0.3)' };
      default:
        return { bg: 'rgba(156, 163, 175, 0.2)', text: '#D1D5DB', border: 'rgba(156, 163, 175, 0.3)' };
    }
  };

  const statusStyle = getStatusColor(order.status);

  return (
    <div
      onClick={() => onPress(order)}
      style={{
        background: 'rgba(17, 24, 39, 0.75)',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        borderRadius: 16,
        padding: 16,
        display: 'flex',
        flexDirection: 'column',
        gap: 12,
        boxShadow: '0 4px 16px rgba(0, 0, 0, 0.25)',
        cursor: 'pointer',
      }}
    >
      {/* Top Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <div style={{ fontSize: 13, fontWeight: 800, color: '#F9FAFB' }}>{order.orderNumber}</div>
          <div style={{ fontSize: 11, color: '#9CA3AF' }}>Ordered on {order.orderDate}</div>
        </div>

        <div
          style={{
            fontSize: 10,
            fontWeight: 800,
            padding: '3px 8px',
            borderRadius: 6,
            background: statusStyle.bg,
            color: statusStyle.text,
            border: `1px solid ${statusStyle.border}`,
            textTransform: 'uppercase',
          }}
        >
          {order.status}
        </div>
      </div>

      {/* Product Row */}
      <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
        <img
          src={order.productImage}
          alt={order.productTitle}
          style={{ width: 54, height: 54, borderRadius: 10, objectFit: 'cover', background: '#111827' }}
        />
        <div style={{ flex: 1 }}>
          <h5 style={{ fontSize: 13, fontWeight: 700, color: '#F3F4F6', marginBottom: 2 }}>
            {order.productTitle}
          </h5>
          <div style={{ fontSize: 11, color: '#9CA3AF' }}>
            {isSupplierView ? `Buyer: ${order.buyerName}` : `Supplier: ${order.supplierName}`}
          </div>
          <div style={{ fontSize: 11, color: '#D1D5DB', marginTop: 2 }}>
            Qty: {order.quantity} | Total: <strong style={{ color: '#10B981' }}>${order.totalAmount.toLocaleString()}</strong>
          </div>
        </div>
      </div>

      {/* Tracking and Escrow Tag */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          background: 'rgba(31, 41, 55, 0.5)',
          padding: '8px 10px',
          borderRadius: 8,
          fontSize: 11,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#60A5FA' }}>
          <Truck size={13} />
          <span>{order.trackingNumber || 'Tracking ID pending'}</span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 4, color: '#34D399', fontWeight: 600 }}>
          <ShieldCheck size={12} />
          <span>Escrow Protection</span>
        </div>
      </div>

      {/* Supplier action bar if supplier view */}
      {isSupplierView && onUpdateStatus && order.status !== 'DELIVERED' && (
        <div style={{ display: 'flex', gap: 8, marginTop: 4 }}>
          {order.status === 'CONFIRMED' && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onUpdateStatus(order.id, 'PROCESSING');
              }}
              style={{
                flex: 1,
                background: 'linear-gradient(135deg, #059669 0%, #10B981 100%)',
                color: '#FFF',
                border: 'none',
                borderRadius: 8,
                padding: '6px 0',
                fontSize: 11,
                fontWeight: 700,
                cursor: 'pointer',
              }}
            >
              Start Packing
            </button>
          )}

          {order.status === 'PROCESSING' && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onUpdateStatus(order.id, 'SHIPPED', 'TRK-FEDEX-881920');
              }}
              style={{
                flex: 1,
                background: 'linear-gradient(135deg, #2563EB 0%, #1D4ED8 100%)',
                color: '#FFF',
                border: 'none',
                borderRadius: 8,
                padding: '6px 0',
                fontSize: 11,
                fontWeight: 700,
                cursor: 'pointer',
              }}
            >
              Mark Shipped
            </button>
          )}
        </div>
      )}
    </div>
  );
};
