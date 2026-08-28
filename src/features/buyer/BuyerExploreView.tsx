import React from 'react';
import { useProductStore } from '../../store/useProductStore';
import { useAdminStore } from '../../store/useAdminStore';
import { ProductCard } from '../../components/shared/ProductCard';
import { Product } from '../../types';
import { Compass, Filter, ShieldCheck, Search } from 'lucide-react';

interface Props {
  onSelectProduct: (product: Product) => void;
  onOpenSearch: () => void;
}

export const BuyerExploreView: React.FC<Props> = ({ onSelectProduct, onOpenSearch }) => {
  const { products } = useProductStore();
  const { categories } = useAdminStore();
  return (
    <div style={{ paddingBottom: 90, display: 'flex', flexDirection: 'column', gap: 16 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <h2 style={{ fontSize: 20, fontWeight: 800, color: '#F9FAFB' }}>Explore Industry Verticals</h2>
          <p style={{ fontSize: 12, color: '#9CA3AF' }}>Browse categories, verified plants and manufacturers</p>
        </div>

        <button
          onClick={onOpenSearch}
          style={{
            background: 'rgba(31, 41, 55, 0.8)',
            border: '1px solid rgba(255, 255, 255, 0.15)',
            borderRadius: 12,
            padding: '8px 12px',
            color: '#60A5FA',
            fontSize: 12,
            fontWeight: 700,
            display: 'flex',
            alignItems: 'center',
            gap: 6,
            cursor: 'pointer',
          }}
        >
          <Filter size={14} />
          <span>Filters</span>
        </button>
      </div>

      {/* Category Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
        {categories.map((cat) => (
          <div
            key={cat.id}
            onClick={onOpenSearch}
            style={{
              background: 'rgba(17, 24, 39, 0.8)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: 14,
              padding: 14,
              display: 'flex',
              flexDirection: 'column',
              gap: 8,
              cursor: 'pointer',
            }}
          >
            <div style={{ fontSize: 14, fontWeight: 800, color: '#F3F4F6' }}>{cat.name}</div>
            <div style={{ fontSize: 11, color: '#60A5FA', fontWeight: 600 }}>{cat.count}</div>
          </div>
        ))}
      </div>

      {/* All Products */}
      <div style={{ marginTop: 10 }}>
        <h3 style={{ fontSize: 16, fontWeight: 800, color: '#F9FAFB', marginBottom: 12 }}>All Wholesale Catalog</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {products.map((prod) => (
            <ProductCard key={prod.id} product={prod} onPress={onSelectProduct} />
          ))}
        </div>
        {products.length === 0 && <div style={{ padding: 24, textAlign: 'center', color: '#94A3B8', border: '1px dashed rgba(148,163,184,.25)', borderRadius: 14 }}>No products have been added yet.</div>}
      </div>
    </div>
  );
};
