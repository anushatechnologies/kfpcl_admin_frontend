import React from 'react';
import { useAuthStore } from '../../store/useAuthStore';
import { useProductStore } from '../../store/useProductStore';
import { useRFQStore } from '../../store/useRFQStore';
import {
  TrendingUp,
  Target,
  DollarSign,
  Package,
  Users,
  Plus,
  Send,
  Award,
  ArrowUpRight,
  ChevronRight,
  Boxes,
} from 'lucide-react';

interface Props {
  onOpenAddProduct: () => void;
  onOpenLeads: () => void;
}

export const SupplierDashboardView: React.FC<Props> = ({ onOpenAddProduct, onOpenLeads }) => {
  const { user } = useAuthStore();
  const { products } = useProductStore();
  const { rfqs } = useRFQStore();

  return (
    <div style={{ paddingBottom: 90, display: 'flex', flexDirection: 'column', gap: 16 }}>
      {/* Supplier Store Banner Card */}
      <div
        style={{
          background: 'linear-gradient(135deg, #065F46 0%, #059669 50%, #10B981 100%)',
          borderRadius: 20,
          padding: 18,
          position: 'relative',
          overflow: 'hidden',
          boxShadow: '0 8px 30px rgba(16, 185, 129, 0.35)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <span style={{ fontSize: 11, fontWeight: 800, color: '#A7F3D0', textTransform: 'uppercase' }}>
              SUPPLIER COMMAND CENTER
            </span>
            <h2 style={{ fontSize: 20, fontWeight: 800, color: '#FFF', marginTop: 2 }}>{user?.companyName}</h2>
            <div style={{ fontSize: 11, color: '#D1FAE5', marginTop: 4 }}>
              GST Verified | Rating: <strong>{user?.rating} ★</strong> | KYC: <strong>{user?.kycStatus}</strong>
            </div>
          </div>

          <div
            style={{
              width: 44,
              height: 44,
              borderRadius: 12,
              background: 'rgba(255, 255, 255, 0.2)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#FFF',
            }}
          >
            <Award size={24} />
          </div>
        </div>

        <div style={{ display: 'flex', gap: 10, marginTop: 14 }}>
          <button
            onClick={onOpenAddProduct}
            style={{
              background: '#FFF',
              color: '#047857',
              border: 'none',
              borderRadius: 10,
              padding: '8px 14px',
              fontSize: 12,
              fontWeight: 800,
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              cursor: 'pointer',
            }}
          >
            <Plus size={14} />
            <span>Add Product</span>
          </button>

          <button
            onClick={onOpenLeads}
            style={{
              background: 'rgba(0, 0, 0, 0.3)',
              color: '#FFF',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              borderRadius: 10,
              padding: '8px 14px',
              fontSize: 12,
              fontWeight: 800,
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              cursor: 'pointer',
            }}
          >
            <Send size={14} />
            <span>Respond to RFQs</span>
          </button>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
        <div
          style={{
            background: 'rgba(17, 24, 39, 0.75)',
            border: '1px solid rgba(16, 185, 129, 0.3)',
            borderRadius: 16,
            padding: 14,
            display: 'flex',
            flexDirection: 'column',
            gap: 6,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontSize: 11, color: '#9CA3AF', fontWeight: 600 }}>Monthly Revenue</span>
            <div style={{ color: '#10B981' }}>
              <ArrowUpRight size={16} />
            </div>
          </div>
          <span style={{ fontSize: 22, fontWeight: 800, color: '#10B981' }}>
            ${user?.totalRevenue.toLocaleString()}
          </span>
          <span style={{ fontSize: 10, color: '#34D399' }}>+18.4% vs last month</span>
        </div>

        <div
          style={{
            background: 'rgba(17, 24, 39, 0.75)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: 16,
            padding: 14,
            display: 'flex',
            flexDirection: 'column',
            gap: 6,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontSize: 11, color: '#9CA3AF', fontWeight: 600 }}>Incoming RFQ Leads</span>
            <div style={{ color: '#60A5FA' }}>
              <Target size={16} />
            </div>
          </div>
          <span style={{ fontSize: 22, fontWeight: 800, color: '#60A5FA' }}>{rfqs.length} Leads</span>
          <span style={{ fontSize: 10, color: '#9CA3AF' }}>3 Pending Quote</span>
        </div>

        <div
          style={{
            background: 'rgba(17, 24, 39, 0.75)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: 16,
            padding: 14,
            display: 'flex',
            flexDirection: 'column',
            gap: 6,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontSize: 11, color: '#9CA3AF', fontWeight: 600 }}>Active Catalog</span>
            <div style={{ color: '#FBBF24' }}>
              <Boxes size={16} />
            </div>
          </div>
          <span style={{ fontSize: 22, fontWeight: 800, color: '#FBBF24' }}>{products.length} Items</span>
          <span style={{ fontSize: 10, color: '#9CA3AF' }}>All ISO Verified</span>
        </div>

        <div
          style={{
            background: 'rgba(17, 24, 39, 0.75)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: 16,
            padding: 14,
            display: 'flex',
            flexDirection: 'column',
            gap: 6,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontSize: 11, color: '#9CA3AF', fontWeight: 600 }}>Store Visitors</span>
            <div style={{ color: '#C084FC' }}>
              <Users size={16} />
            </div>
          </div>
          <span style={{ fontSize: 22, fontWeight: 800, color: '#C084FC' }}>4,280</span>
          <span style={{ fontSize: 10, color: '#9CA3AF' }}>High Conversion</span>
        </div>
      </div>

      {/* Supplier Revenue Analytics Bar Chart Simulation */}
      <div
        style={{
          background: 'rgba(17, 24, 39, 0.75)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          borderRadius: 18,
          padding: 16,
          display: 'flex',
          flexDirection: 'column',
          gap: 12,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <TrendingUp size={18} color="#10B981" />
            <h4 style={{ fontSize: 15, fontWeight: 800, color: '#F9FAFB' }}>Revenue Performance Chart</h4>
          </div>
          <span style={{ fontSize: 11, color: '#9CA3AF' }}>2026 Q3</span>
        </div>

        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', height: 110, paddingTop: 10 }}>
          {[
            { month: 'Mar', val: 40 },
            { month: 'Apr', val: 65 },
            { month: 'May', val: 50 },
            { month: 'Jun', val: 85 },
            { month: 'Jul', val: 100 },
          ].map((bar, i) => (
            <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, flex: 1 }}>
              <div
                style={{
                  width: 24,
                  height: `${bar.val}%`,
                  background: i === 4 ? 'linear-gradient(180deg, #10B981 0%, #059669 100%)' : 'rgba(59, 130, 246, 0.4)',
                  borderRadius: 6,
                }}
              />
              <span style={{ fontSize: 10, color: '#9CA3AF' }}>{bar.month}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
