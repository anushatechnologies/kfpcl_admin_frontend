import React, { useState } from 'react';
import { useProductStore } from '../../store/useProductStore';
import { CATEGORIES } from '../../constants/mockData';
import { Search, Mic, Camera, X, Filter, Check, Zap, Sparkles, SlidersHorizontal } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSelectProduct: (product: any) => void;
}

export const GlobalSearchModal: React.FC<Props> = ({ isOpen, onClose, onSelectProduct }) => {
  const { searchQuery, setSearchQuery, filters, setFilters, resetFilters, getFilteredProducts } = useProductStore();
  const [isVoiceActive, setIsVoiceActive] = useState(false);
  const [showFilterDrawer, setShowFilterDrawer] = useState(false);

  if (!isOpen) return null;

  const filteredProducts = getFilteredProducts();

  const handleVoiceSimulate = () => {
    setIsVoiceActive(true);
    setTimeout(() => {
      setSearchQuery('Solar Inverter 50kW');
      setIsVoiceActive(false);
    }, 1500);
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9999,
        background: '#090D16',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* Search Header Bar */}
      <div
        style={{
          padding: '12px 16px',
          borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
          background: 'rgba(17, 24, 39, 0.9)',
          backdropFilter: 'blur(16px)',
          display: 'flex',
          alignItems: 'center',
          gap: 10,
        }}
      >
        <div
          style={{
            flex: 1,
            background: 'rgba(31, 41, 55, 0.8)',
            border: '1px solid rgba(255, 255, 255, 0.15)',
            borderRadius: 14,
            padding: '8px 12px',
            display: 'flex',
            alignItems: 'center',
            gap: 10,
          }}
        >
          <Search size={18} color="#60A5FA" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search Machinery, Solar, Metals, Chemicals..."
            autoFocus
            style={{
              width: '100%',
              background: 'transparent',
              border: 'none',
              color: '#FFF',
              fontSize: 14,
              outline: 'none',
            }}
          />
          {searchQuery && (
            <button onClick={() => setSearchQuery('')} style={{ background: 'none', border: 'none', color: '#9CA3AF', cursor: 'pointer' }}>
              <X size={16} />
            </button>
          )}
          <button
            onClick={handleVoiceSimulate}
            style={{
              background: isVoiceActive ? 'rgba(239, 68, 68, 0.2)' : 'transparent',
              border: 'none',
              color: isVoiceActive ? '#EF4444' : '#9CA3AF',
              cursor: 'pointer',
            }}
          >
            <Mic size={18} />
          </button>
          <button
            onClick={() => setSearchQuery('CNC Milling Machine')}
            style={{ background: 'none', border: 'none', color: '#9CA3AF', cursor: 'pointer' }}
          >
            <Camera size={18} />
          </button>
        </div>

        <button
          onClick={() => setShowFilterDrawer(!showFilterDrawer)}
          style={{
            background: showFilterDrawer ? '#2563EB' : 'rgba(31, 41, 55, 0.8)',
            border: '1px solid rgba(255, 255, 255, 0.15)',
            borderRadius: 12,
            width: 40,
            height: 40,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#FFF',
            cursor: 'pointer',
          }}
        >
          <SlidersHorizontal size={18} />
        </button>

        <button
          onClick={onClose}
          style={{ background: 'none', border: 'none', color: '#9CA3AF', fontSize: 14, fontWeight: 600, cursor: 'pointer' }}
        >
          Cancel
        </button>
      </div>

      {/* Voice Assistant Banner */}
      {isVoiceActive && (
        <div
          style={{
            background: 'linear-gradient(135deg, rgba(239, 68, 68, 0.2) 0%, rgba(220, 38, 38, 0.1) 100%)',
            padding: 12,
            textAlign: 'center',
            color: '#F87171',
            fontSize: 13,
            fontWeight: 700,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 8,
          }}
        >
          <Sparkles size={16} />
          Listening for B2B Voice Query...
        </div>
      )}

      {/* Filter Drawer Option Row */}
      {showFilterDrawer && (
        <div
          style={{
            background: '#111827',
            padding: 14,
            borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
            display: 'flex',
            flexDirection: 'column',
            gap: 10,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontSize: 13, fontWeight: 700, color: '#F3F4F6' }}>Quick Filters</span>
            <button
              onClick={resetFilters}
              style={{ background: 'none', border: 'none', color: '#60A5FA', fontSize: 12, cursor: 'pointer' }}
            >
              Reset Filters
            </button>
          </div>

          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            <button
              onClick={() => setFilters({ gstOnly: !filters.gstOnly })}
              style={{
                background: filters.gstOnly ? 'rgba(16, 185, 129, 0.2)' : 'rgba(31, 41, 55, 0.8)',
                border: filters.gstOnly ? '1px solid #10B981' : '1px solid rgba(255, 255, 255, 0.1)',
                color: filters.gstOnly ? '#34D399' : '#9CA3AF',
                borderRadius: 8,
                padding: '6px 12px',
                fontSize: 12,
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              GST Verified Only
            </button>

            <button
              onClick={() => setFilters({ verifiedOnly: !filters.verifiedOnly })}
              style={{
                background: filters.verifiedOnly ? 'rgba(59, 130, 246, 0.2)' : 'rgba(31, 41, 55, 0.8)',
                border: filters.verifiedOnly ? '1px solid #3B82F6' : '1px solid rgba(255, 255, 255, 0.1)',
                color: filters.verifiedOnly ? '#60A5FA' : '#9CA3AF',
                borderRadius: 8,
                padding: '6px 12px',
                fontSize: 12,
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              Verified Suppliers
            </button>

            <select
              value={filters.sortBy}
              onChange={(e) => setFilters({ sortBy: e.target.value as any })}
              style={{
                background: '#1F2937',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                color: '#FFF',
                borderRadius: 8,
                padding: '6px 10px',
                fontSize: 12,
              }}
            >
              <option value="relevance">Sort by: Relevance</option>
              <option value="price_low">Price: Low to High</option>
              <option value="price_high">Price: High to Low</option>
              <option value="rating">Supplier Rating</option>
            </select>
          </div>
        </div>
      )}

      {/* Category Pills Slider */}
      <div style={{ padding: '10px 16px', display: 'flex', gap: 8, overflowX: 'auto', background: '#0B0F17' }}>
        <button
          onClick={() => setFilters({ category: null })}
          style={{
            background: !filters.category ? '#2563EB' : 'rgba(31, 41, 55, 0.8)',
            border: 'none',
            color: '#FFF',
            borderRadius: 20,
            padding: '6px 14px',
            fontSize: 12,
            fontWeight: 600,
            whiteSpace: 'nowrap',
            cursor: 'pointer',
          }}
        >
          All Categories
        </button>
        {CATEGORIES.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setFilters({ category: cat.name })}
            style={{
              background: filters.category === cat.name ? '#2563EB' : 'rgba(31, 41, 55, 0.8)',
              border: 'none',
              color: '#FFF',
              borderRadius: 20,
              padding: '6px 14px',
              fontSize: 12,
              fontWeight: 600,
              whiteSpace: 'nowrap',
              cursor: 'pointer',
            }}
          >
            {cat.name}
          </button>
        ))}
      </div>

      {/* Product Results List */}
      <div style={{ flex: 1, overflowY: 'auto', padding: 16, display: 'flex', flexDirection: 'column', gap: 12 }}>
        <div style={{ fontSize: 12, fontWeight: 700, color: '#9CA3AF' }}>
          {filteredProducts.length} Wholesale Items Found
        </div>

        {filteredProducts.map((product) => (
          <div
            key={product.id}
            onClick={() => {
              onSelectProduct(product);
              onClose();
            }}
            style={{
              background: 'rgba(17, 24, 39, 0.8)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: 14,
              padding: 12,
              display: 'flex',
              gap: 12,
              cursor: 'pointer',
            }}
          >
            <img
              src={product.images[0]}
              alt={product.title}
              style={{ width: 70, height: 70, borderRadius: 10, objectFit: 'cover' }}
            />
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 10, color: '#60A5FA', fontWeight: 700 }}>{product.category}</div>
              <h5 style={{ fontSize: 13, fontWeight: 700, color: '#FFF', marginBottom: 4 }}>{product.title}</h5>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ fontSize: 14, fontWeight: 800, color: '#10B981' }}>
                  ${product.tierPricing[0].pricePerUnit} / {product.unit}
                </span>
                <span style={{ fontSize: 10, color: '#9CA3AF' }}>MOQ: {product.moq}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
