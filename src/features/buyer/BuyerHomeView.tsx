import React from 'react';
import { useProductStore } from '../../store/useProductStore';
import { useRFQStore } from '../../store/useRFQStore';
import { useChatStore } from '../../store/useChatStore';
import { useAdminStore } from '../../store/useAdminStore';
import { ProductCard } from '../../components/shared/ProductCard';
import { Product } from '../../types';
import { FileText, Zap, ShieldCheck, TrendingUp, Sparkles, Building2, ChevronRight, Award } from 'lucide-react';

interface Props {
  onSelectProduct: (product: Product) => void;
  onOpenRFQModal: () => void;
  onOpenChat: () => void;
}

export const BuyerHomeView: React.FC<Props> = ({ onSelectProduct, onOpenRFQModal, onOpenChat }) => {
  const { products } = useProductStore();
  const { categories } = useAdminStore();
  const { setCreateRFQModalOpen } = useRFQStore();

  return (
    <div style={{ paddingBottom: 90, display: 'flex', flexDirection: 'column', gap: 18 }}>
      {/* Hero RFQ Broadcasting Callout Banner */}
      <div
        style={{
          background: 'linear-gradient(135deg, #1E3A8A 0%, #2563EB 50%, #1D4ED8 100%)',
          borderRadius: 20,
          padding: 18,
          position: 'relative',
          overflow: 'hidden',
          boxShadow: '0 8px 30px rgba(37, 99, 235, 0.35)',
        }}
      >
        <div style={{ position: 'relative', zIndex: 2 }}>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6,
              background: 'rgba(255, 255, 255, 0.18)',
              backdropFilter: 'blur(8px)',
              padding: '4px 10px',
              borderRadius: 20,
              color: '#FFF',
              fontSize: 11,
              fontWeight: 700,
              marginBottom: 8,
            }}
          >
            <Sparkles size={13} color="#FBBF24" />
            <span>GLOBAL B2B SOURCING</span>
          </div>

          <h2 style={{ fontSize: 20, fontWeight: 800, color: '#FFF', lineHeight: '1.25', marginBottom: 6 }}>
            Cannot Find Exact Material? Broadcast an RFQ
          </h2>
          <p style={{ fontSize: 12, color: '#DBEAFE', lineHeight: '1.4', marginBottom: 14 }}>
            Get competitive wholesale quotes from 5,000+ verified factories within 24 hours.
          </p>

          <button
            onClick={() => setCreateRFQModalOpen(true)}
            style={{
              background: '#FFF',
              color: '#1E40AF',
              border: 'none',
              borderRadius: 12,
              padding: '10px 18px',
              fontSize: 13,
              fontWeight: 800,
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
              cursor: 'pointer',
              boxShadow: '0 4px 14px rgba(0, 0, 0, 0.2)',
            }}
          >
            <FileText size={16} />
            <span>Post Custom RFQ Now</span>
          </button>
        </div>
      </div>

      {/* Categories Horizontal Carousel */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10, padding: '0 4px' }}>
          <h3 style={{ fontSize: 15, fontWeight: 800, color: '#F9FAFB' }}>Featured B2B Categories</h3>
          <span style={{ fontSize: 12, color: '#60A5FA', fontWeight: 600, cursor: 'pointer' }}>View All</span>
        </div>

        <div style={{ display: 'flex', gap: 10, overflowX: 'auto', paddingBottom: 6 }}>
          {categories.slice(0, 5).map((cat) => (
            <div
              key={cat.id}
              style={{
                minWidth: 120,
                background: 'rgba(17, 24, 39, 0.75)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: 14,
                padding: 12,
                display: 'flex',
                flexDirection: 'column',
                gap: 6,
                cursor: 'pointer',
              }}
            >
              <div
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: 8,
                  background: 'rgba(59, 130, 246, 0.15)',
                  color: '#60A5FA',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 700,
                  fontSize: 14,
                }}
              >
                {cat.name[0]}
              </div>
              <span style={{ fontSize: 12, fontWeight: 700, color: '#F3F4F6', lineHeight: '1.2' }}>{cat.name}</span>
              <span style={{ fontSize: 10, color: '#9CA3AF' }}>{cat.count}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Verified Suppliers Strip */}
      <div
        style={{
          background: 'rgba(17, 24, 39, 0.6)',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          borderRadius: 16,
          padding: 14,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div
            style={{
              width: 38,
              height: 38,
              borderRadius: 10,
              background: 'rgba(16, 185, 129, 0.15)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#10B981',
            }}
          >
            <Award size={20} />
          </div>
          <div>
            <div style={{ fontSize: 13, fontWeight: 700, color: '#F9FAFB' }}>GST & ISO Verified Suppliers</div>
            <div style={{ fontSize: 11, color: '#9CA3AF' }}>Guaranteed factory direct wholesale prices</div>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 4, color: '#34D399', fontSize: 12, fontWeight: 700 }}>
          <span>100% Inspected</span>
          <ShieldCheck size={14} />
        </div>
      </div>

      {/* Trending Wholesale Products Grid */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12, padding: '0 4px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <TrendingUp size={18} color="#10B981" />
            <h3 style={{ fontSize: 16, fontWeight: 800, color: '#F9FAFB' }}>Trending B2B Catalog</h3>
          </div>
          <span style={{ fontSize: 12, color: '#60A5FA', fontWeight: 600 }}>Explore All</span>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 14 }}>
          {products.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onPress={onSelectProduct}
              onRFQPress={() => setCreateRFQModalOpen(true)}
              onChatPress={onOpenChat}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
