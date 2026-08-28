import React from 'react';
import { Product } from '../../types';
import { ShieldCheck, Star, MapPin, Heart, FileText, MessageSquare, CheckCircle } from 'lucide-react';
import { useProductStore } from '../../store/useProductStore';

interface Props {
  product: Product;
  onPress: (product: Product) => void;
  onRFQPress?: (product: Product) => void;
  onChatPress?: (product: Product) => void;
}

export const ProductCard: React.FC<Props> = ({ product, onPress, onRFQPress, onChatPress }) => {
  const { wishlistIds, toggleWishlist } = useProductStore();
  const isWishlisted = wishlistIds.includes(product.id);

  const lowestPrice = product.tierPricing[product.tierPricing.length - 1]?.pricePerUnit;
  const highestPrice = product.tierPricing[0]?.pricePerUnit;

  return (
    <div
      onClick={() => onPress(product)}
      style={{
        background: 'rgba(17, 24, 39, 0.75)',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        borderRadius: 18,
        overflow: 'hidden',
        boxShadow: '0 8px 24px rgba(0, 0, 0, 0.3)',
        transition: 'transform 0.2s ease, border-color 0.2s ease',
        cursor: 'pointer',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* Thumbnail Area */}
      <div style={{ position: 'relative', width: '100%', height: 160, backgroundColor: '#111827' }}>
        <img
          src={product.images[0]}
          alt={product.title}
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />

        {/* Wishlist Toggle Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            toggleWishlist(product.id);
          }}
          style={{
            position: 'absolute',
            top: 10,
            right: 10,
            width: 32,
            height: 32,
            borderRadius: 16,
            background: 'rgba(0, 0, 0, 0.55)',
            backdropFilter: 'blur(8px)',
            border: 'none',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
          }}
        >
          <Heart size={16} color={isWishlisted ? '#EF4444' : '#FFF'} fill={isWishlisted ? '#EF4444' : 'none'} />
        </button>

        {/* MOQ Badge Overlay */}
        <div
          style={{
            position: 'absolute',
            bottom: 10,
            left: 10,
            background: 'rgba(9, 13, 22, 0.85)',
            backdropFilter: 'blur(8px)',
            color: '#38BDF8',
            fontSize: 11,
            fontWeight: 700,
            padding: '3px 8px',
            borderRadius: 8,
            border: '1px solid rgba(56, 189, 248, 0.3)',
          }}
        >
          MOQ: {product.moq} {product.unit}
        </div>
      </div>

      {/* Product Content Details */}
      <div style={{ padding: 14, display: 'flex', flexDirection: 'column', gap: 8, flex: 1 }}>
        <div style={{ fontSize: 11, fontWeight: 700, color: '#9CA3AF', textTransform: 'uppercase' }}>
          {product.category}
        </div>

        <h4
          style={{
            fontSize: 14,
            fontWeight: 700,
            color: '#F9FAFB',
            lineHeight: '1.3',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
          }}
        >
          {product.title}
        </h4>

        {/* Tier Price Preview */}
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 6, marginTop: 2 }}>
          <span style={{ fontSize: 18, fontWeight: 800, color: '#10B981' }}>
            ${lowestPrice ? lowestPrice.toLocaleString() : highestPrice.toLocaleString()}
          </span>
          {lowestPrice && lowestPrice !== highestPrice && (
            <span style={{ fontSize: 12, color: '#9CA3AF' }}>- ${highestPrice.toLocaleString()} / {product.unit}</span>
          )}
        </div>

        {/* Supplier Identity */}
        <div
          style={{
            borderTop: '1px solid rgba(255, 255, 255, 0.08)',
            paddingTop: 8,
            marginTop: 4,
            display: 'flex',
            flexDirection: 'column',
            gap: 4,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontSize: 12, fontWeight: 600, color: '#E5E7EB' }}>{product.supplierName}</span>
            {product.isGstVerified && (
              <div style={{ display: 'flex', alignItems: 'center', gap: 2, color: '#34D399', fontSize: 10, fontWeight: 700 }}>
                <CheckCircle size={11} />
                GST Verified
              </div>
            )}
          </div>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: 11, color: '#9CA3AF' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
              <MapPin size={11} />
              <span>{product.supplierLocation}</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 3, color: '#F59E0B', fontWeight: 700 }}>
              <Star size={11} fill="#F59E0B" />
              <span>{product.supplierRating}</span>
            </div>
          </div>
        </div>

        {/* Quick Action Buttons */}
        <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onRFQPress ? onRFQPress(product) : onPress(product);
            }}
            style={{
              flex: 1,
              background: 'linear-gradient(135deg, #2563EB 0%, #1D4ED8 100%)',
              color: '#FFF',
              border: 'none',
              borderRadius: 10,
              padding: '8px 0',
              fontSize: 12,
              fontWeight: 700,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 6,
              cursor: 'pointer',
            }}
          >
            <FileText size={13} />
            <span>Send RFQ</span>
          </button>

          <button
            onClick={(e) => {
              e.stopPropagation();
              onChatPress ? onChatPress(product) : onPress(product);
            }}
            style={{
              background: 'rgba(31, 41, 55, 0.8)',
              border: '1px solid rgba(255, 255, 255, 0.15)',
              color: '#F3F4F6',
              borderRadius: 10,
              width: 36,
              height: 34,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
            }}
          >
            <MessageSquare size={14} />
          </button>
        </div>
      </div>
    </div>
  );
};
