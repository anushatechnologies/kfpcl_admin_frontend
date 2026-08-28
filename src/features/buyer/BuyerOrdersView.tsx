import React, { useState } from 'react';
import { useOrderStore } from '../../store/useOrderStore';
import { OrderCard } from '../../components/shared/OrderCard';
import { OrderItem } from '../../types';
import { Package, ShieldCheck, Download, Truck } from 'lucide-react';

interface Props {
  onSelectOrder: (order: OrderItem) => void;
}

export const BuyerOrdersView: React.FC<Props> = ({ onSelectOrder }) => {
  const { orders } = useOrderStore();
  const [activeFilter, setActiveFilter] = useState<'ALL' | 'SHIPPED' | 'DELIVERED'>('ALL');

  const filteredOrders = orders.filter((o) => {
    if (activeFilter === 'ALL') return true;
    return o.status === activeFilter;
  });

  return (
    <div style={{ paddingBottom: 90, display: 'flex', flexDirection: 'column', gap: 16 }}>
      {/* Top Header */}
      <div>
        <h2 style={{ fontSize: 20, fontWeight: 800, color: '#F9FAFB' }}>Buyer Wholesale Orders</h2>
        <p style={{ fontSize: 12, color: '#9CA3AF' }}>Escrow protected orders, invoices and tracking</p>
      </div>

      {/* Filter Tabs */}
      <div style={{ display: 'flex', gap: 8 }}>
        {(['ALL', 'SHIPPED', 'DELIVERED'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveFilter(tab)}
            style={{
              background: activeFilter === tab ? '#2563EB' : 'rgba(31, 41, 55, 0.8)',
              border: 'none',
              borderRadius: 20,
              padding: '6px 16px',
              color: '#FFF',
              fontSize: 12,
              fontWeight: 700,
              cursor: 'pointer',
            }}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Orders List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        {filteredOrders.map((order) => (
          <OrderCard key={order.id} order={order} onPress={onSelectOrder} />
        ))}
      </div>
    </div>
  );
};
