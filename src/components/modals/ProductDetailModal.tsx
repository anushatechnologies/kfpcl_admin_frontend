import React from 'react';
import { Product } from '../../types';
import { PriceTierTable } from '../shared/PriceTierTable';
import { useRFQStore } from '../../store/useRFQStore';
import { useChatStore } from '../../store/useChatStore';
import { X, ShieldCheck, MapPin, Star, FileText, MessageSquare, CheckCircle2, Download, Building2 } from 'lucide-react';

interface Props {
  product: Product | null;
  onClose: () => void;
}

export const ProductDetailModal: React.FC<Props> = ({ product, onClose }) => {
  const { setCreateRFQModalOpen } = useRFQStore();
  const { startOrOpenConversation, setActiveConversationId } = useChatStore();

  if (!product) return null;

  const handleStartChat = () => {
    const convId = startOrOpenConversation({
      id: product.supplierId,
      name: product.supplierName,
      avatar: 'https://images.unsplash.com/photo-1560179707-f14e90ef3623?w=120&auto=format&fit=crop&q=80',
      company: product.supplierName,
      role: 'SUPPLIER',
    });
    setActiveConversationId(convId);
    onClose();
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9999,
        background: 'rgba(0, 0, 0, 0.85)',
        backdropFilter: 'blur(16px)',
        display: 'flex',
        alignItems: 'flex-end',
        justifyContent: 'center',
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: 500,
          background: '#0B0F17',
          borderTopLeftRadius: 24,
          borderTopRightRadius: 24,
          border: '1px solid rgba(255, 255, 255, 0.15)',
          maxHeight: '92vh',
          overflowY: 'auto',
          boxShadow: '0 -10px 40px rgba(0, 0, 0, 0.7)',
        }}
      >
        {/* Gallery Image Header */}
        <div style={{ position: 'relative', width: '100%', height: 240, background: '#111827' }}>
          <img
            src={product.images[0]}
            alt={product.title}
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />

          <button
            onClick={onClose}
            style={{
              position: 'absolute',
              top: 14,
              right: 14,
              width: 36,
              height: 36,
              borderRadius: 18,
              background: 'rgba(0, 0, 0, 0.6)',
              backdropFilter: 'blur(8px)',
              border: 'none',
              color: '#FFF',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
            }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Details Container */}
        <div style={{ padding: 20, display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: '#60A5FA', textTransform: 'uppercase' }}>
            {product.category} • {product.brand}
          </div>

          <h2 style={{ fontSize: 18, fontWeight: 800, color: '#F9FAFB', lineHeight: '1.3' }}>
            {product.title}
          </h2>

          {/* Tier Price Breakdown Table */}
          <PriceTierTable tierPricing={product.tierPricing} unit={product.unit} />

          {/* Supplier Card */}
          <div
            style={{
              background: 'rgba(17, 24, 39, 0.8)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: 14,
              padding: 14,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: 10,
                  background: 'rgba(59, 130, 246, 0.15)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#60A5FA',
                }}
              >
                <Building2 size={20} />
              </div>
              <div>
                <div style={{ fontSize: 14, fontWeight: 800, color: '#F9FAFB' }}>{product.supplierName}</div>
                <div style={{ fontSize: 11, color: '#9CA3AF', display: 'flex', alignItems: 'center', gap: 6 }}>
                  <MapPin size={11} />
                  <span>{product.supplierLocation}</span>
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: 3, color: '#F59E0B', fontWeight: 800, fontSize: 13 }}>
              <Star size={14} fill="#F59E0B" />
              <span>{product.supplierRating}</span>
            </div>
          </div>

          {/* Description */}
          <div>
            <h4 style={{ fontSize: 13, fontWeight: 700, color: '#F3F4F6', marginBottom: 4 }}>Product Overview</h4>
            <p style={{ fontSize: 12, color: '#9CA3AF', lineHeight: '1.5' }}>{product.description}</p>
          </div>

          {/* Technical Specifications */}
          <div>
            <h4 style={{ fontSize: 13, fontWeight: 700, color: '#F3F4F6', marginBottom: 8 }}>Technical Specifications</h4>
            <div
              style={{
                background: 'rgba(31, 41, 55, 0.5)',
                borderRadius: 10,
                padding: 10,
                display: 'flex',
                flexDirection: 'column',
                gap: 6,
                fontSize: 12,
              }}
            >
              {Object.entries(product.specifications).map(([key, val]) => (
                <div key={key} style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(255, 255, 255, 0.05)', paddingBottom: 4 }}>
                  <span style={{ color: '#9CA3AF' }}>{key}</span>
                  <strong style={{ color: '#F3F4F6' }}>{val}</strong>
                </div>
              ))}
            </div>
          </div>

          {/* Action CTAs */}
          <div style={{ display: 'flex', gap: 10, marginTop: 10 }}>
            <button
              onClick={() => {
                onClose();
                setCreateRFQModalOpen(true);
              }}
              style={{
                flex: 1,
                background: 'linear-gradient(135deg, #2563EB 0%, #1D4ED8 100%)',
                color: '#FFF',
                border: 'none',
                borderRadius: 12,
                padding: '12px 0',
                fontSize: 13,
                fontWeight: 800,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 8,
                cursor: 'pointer',
                boxShadow: '0 4px 14px rgba(37, 99, 235, 0.4)',
              }}
            >
              <FileText size={16} />
              <span>Send RFQ to Supplier</span>
            </button>

            <button
              onClick={handleStartChat}
              style={{
                background: 'rgba(31, 41, 55, 0.8)',
                border: '1px solid rgba(255, 255, 255, 0.15)',
                color: '#FFF',
                borderRadius: 12,
                width: 48,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
              }}
            >
              <MessageSquare size={18} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
