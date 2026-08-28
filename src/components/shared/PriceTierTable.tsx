import React from 'react';
import { ProductTierPrice } from '../../types';
import { Layers } from 'lucide-react';

interface Props {
  tierPricing: ProductTierPrice[];
  unit: string;
}

export const PriceTierTable: React.FC<Props> = ({ tierPricing, unit }) => {
  return (
    <div
      style={{
        background: 'rgba(17, 24, 39, 0.6)',
        border: '1px solid rgba(255, 255, 255, 0.08)',
        borderRadius: 12,
        padding: '12px 14px',
        margin: '10px 0',
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 6,
          fontSize: 12,
          fontWeight: 700,
          color: '#60A5FA',
          marginBottom: 8,
          textTransform: 'uppercase',
          letterSpacing: '0.5px',
        }}
      >
        <Layers size={13} />
        <span>Tiered Wholesale Pricing</span>
      </div>

      <div style={{ display: 'flex', gap: 8, overflowX: 'auto', paddingBottom: 4 }}>
        {tierPricing.map((tier, index) => (
          <div
            key={index}
            style={{
              flex: 1,
              minWidth: 100,
              background: 'rgba(31, 41, 55, 0.7)',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              borderRadius: 8,
              padding: '8px 10px',
              textAlign: 'center',
            }}
          >
            <div style={{ fontSize: 11, color: '#9CA3AF', fontWeight: 600 }}>
              {tier.minQty} {tier.maxQty ? `- ${tier.maxQty}` : '+'} {unit}
            </div>
            <div style={{ fontSize: 15, fontWeight: 800, color: '#10B981', marginTop: 2 }}>
              ${tier.pricePerUnit.toLocaleString()}
            </div>
            <div style={{ fontSize: 9, color: '#6B7280' }}>per {unit}</div>
          </div>
        ))}
      </div>
    </div>
  );
};
