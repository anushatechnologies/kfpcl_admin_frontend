import React from 'react';
import { RFQItem } from '../../types';
import { Clock, Tag, Calendar, Layers, ChevronRight } from 'lucide-react';

interface Props {
  rfq: RFQItem;
  onViewQuotes: (rfq: RFQItem) => void;
}

export const RFQCard: React.FC<Props> = ({ rfq, onViewQuotes }) => {
  const isQuoted = rfq.quotesCount > 0;

  return (
    <div
      style={{
        background: 'rgba(17, 24, 39, 0.75)',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        borderRadius: 16,
        padding: 16,
        display: 'flex',
        flexDirection: 'column',
        gap: 10,
        boxShadow: '0 4px 16px rgba(0, 0, 0, 0.25)',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <span
          style={{
            fontSize: 10,
            fontWeight: 800,
            padding: '3px 8px',
            borderRadius: 6,
            background: rfq.status === 'QUOTED' ? 'rgba(16, 185, 129, 0.2)' : 'rgba(59, 130, 246, 0.2)',
            color: rfq.status === 'QUOTED' ? '#34D399' : '#60A5FA',
            border: rfq.status === 'QUOTED' ? '1px solid rgba(16, 185, 129, 0.3)' : '1px solid rgba(59, 130, 246, 0.3)',
          }}
        >
          {rfq.status}
        </span>
        <span style={{ fontSize: 11, color: '#9CA3AF' }}>Posted on {rfq.createdAt}</span>
      </div>

      <h4 style={{ fontSize: 15, fontWeight: 700, color: '#F9FAFB', lineHeight: '1.3' }}>
        {rfq.productTitle}
      </h4>

      <p style={{ fontSize: 12, color: '#9CA3AF', lineHeight: '1.4' }}>
        {rfq.description}
      </p>

      {/* Details Grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: 8,
          background: 'rgba(31, 41, 55, 0.5)',
          padding: 10,
          borderRadius: 10,
          border: '1px solid rgba(255, 255, 255, 0.05)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <Layers size={13} color="#60A5FA" />
          <span style={{ fontSize: 11, color: '#D1D5DB' }}>
            Qty: <strong>{rfq.quantity} {rfq.unit}</strong>
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <Tag size={13} color="#10B981" />
          <span style={{ fontSize: 11, color: '#D1D5DB' }}>
            Target: <strong>${rfq.targetPrice} / unit</strong>
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <Calendar size={13} color="#F59E0B" />
          <span style={{ fontSize: 11, color: '#D1D5DB' }}>
            Deadline: <strong>{rfq.expectedDeliveryDate}</strong>
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <Clock size={13} color="#A78BFA" />
          <span style={{ fontSize: 11, color: '#D1D5DB' }}>
            Category: <strong>{rfq.category}</strong>
          </span>
        </div>
      </div>

      {/* Footer Action */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: 4 }}>
        <div style={{ fontSize: 12, fontWeight: 700, color: isQuoted ? '#34D399' : '#9CA3AF' }}>
          {rfq.quotesCount} Quotations Received
        </div>

        <button
          onClick={() => onViewQuotes(rfq)}
          style={{
            background: 'linear-gradient(135deg, #2563EB 0%, #1D4ED8 100%)',
            color: '#FFF',
            border: 'none',
            borderRadius: 10,
            padding: '7px 14px',
            fontSize: 12,
            fontWeight: 700,
            display: 'flex',
            alignItems: 'center',
            gap: 4,
            cursor: 'pointer',
          }}
        >
          <span>Compare Quotes</span>
          <ChevronRight size={14} />
        </button>
      </div>
    </div>
  );
};
