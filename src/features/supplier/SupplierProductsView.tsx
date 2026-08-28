import React from 'react';
import { useProductStore } from '../../store/useProductStore';
import { Plus, Boxes, Trash2, Edit3, Eye } from 'lucide-react';
import { Product } from '../../types';

interface Props {
  onOpenAddProduct: () => void;
  onSelectProduct: (product: Product) => void;
}

export const SupplierProductsView: React.FC<Props> = ({ onOpenAddProduct, onSelectProduct }) => {
  const { products, deleteProduct } = useProductStore();

  return (
    <div style={{ paddingBottom: 90, display: 'flex', flexDirection: 'column', gap: 16 }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <h2 style={{ fontSize: 20, fontWeight: 800, color: '#F9FAFB' }}>My Product Catalog</h2>
          <p style={{ fontSize: 12, color: '#9CA3AF' }}>Manage wholesale listings, stock levels and volume pricing</p>
        </div>

        <button
          onClick={onOpenAddProduct}
          style={{
            background: 'linear-gradient(135deg, #059669 0%, #10B981 100%)',
            color: '#FFF',
            border: 'none',
            borderRadius: 12,
            padding: '8px 14px',
            fontSize: 12,
            fontWeight: 800,
            display: 'flex',
            alignItems: 'center',
            gap: 6,
            cursor: 'pointer',
            boxShadow: '0 4px 14px rgba(16, 185, 129, 0.4)',
          }}
        >
          <Plus size={16} />
          <span>Add Product</span>
        </button>
      </div>

      {/* Catalog items list */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {products.map((item) => (
          <div
            key={item.id}
            style={{
              background: 'rgba(17, 24, 39, 0.8)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: 16,
              padding: 14,
              display: 'flex',
              gap: 12,
              alignItems: 'center',
            }}
          >
            <img
              src={item.images[0]}
              alt={item.title}
              style={{ width: 64, height: 64, borderRadius: 12, objectFit: 'cover', background: '#111827' }}
            />
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 10, fontWeight: 700, color: '#10B981', textTransform: 'uppercase' }}>
                {item.category}
              </div>
              <h5 style={{ fontSize: 13, fontWeight: 700, color: '#F9FAFB', margin: '2px 0' }}>{item.title}</h5>
              <div style={{ fontSize: 12, color: '#9CA3AF' }}>
                Stock: <strong>{item.stock} {item.unit}</strong> | Base Price:{' '}
                <strong style={{ color: '#10B981' }}>${item.tierPricing[0].pricePerUnit}</strong>
              </div>
            </div>

            <div style={{ display: 'flex', gap: 6 }}>
              <button
                onClick={() => onSelectProduct(item)}
                style={{
                  background: 'rgba(31, 41, 55, 0.8)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  color: '#60A5FA',
                  borderRadius: 8,
                  width: 32,
                  height: 32,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                }}
              >
                <Eye size={15} />
              </button>

              <button
                onClick={() => deleteProduct(item.id)}
                style={{
                  background: 'rgba(239, 68, 68, 0.15)',
                  border: '1px solid rgba(239, 68, 68, 0.3)',
                  color: '#F87171',
                  borderRadius: 8,
                  width: 32,
                  height: 32,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                }}
              >
                <Trash2 size={15} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
