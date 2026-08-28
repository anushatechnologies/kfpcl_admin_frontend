import React from 'react';
import { RFQItem } from '../../types';
import { Building2, MapPin, Calendar, Send, FileText, CheckCircle2 } from 'lucide-react';

interface Props {
  lead: RFQItem;
  onSendQuotation: (lead: RFQItem) => void;
}

export const LeadCard: React.FC<Props> = ({ lead, onSendQuotation }) => {
  return (
    <div
      style={{
        background: 'rgba(17, 24, 39, 0.8)',
        border: '1px solid rgba(16, 185, 129, 0.2)',
        borderRadius: 16,
        padding: 16,
        display: 'flex',
        flexDirection: 'column',
        gap: 12,
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.3)',
      }}
    >
      {/* Top Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div
            style={{
              width: 32,
              height: 32,
              borderRadius: 8,
              background: 'rgba(16, 185, 129, 0.15)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#10B981',
            }}
          >
            <Building2 size={16} />
          </div>
          <div>
            <div style={{ fontSize: 13, fontWeight: 700, color: '#F9FAFB' }}>{lead.buyerCompany}</div>
            <div style={{ fontSize: 10, color: '#9CA3AF', display: 'flex', alignItems: 'center', gap: 4 }}>
              <MapPin size={10} />
              <span>{lead.buyerLocation}</span>
            </div>
          </div>
        </div>

        <span
          style={{
            fontSize: 10,
            fontWeight: 800,
            padding: '3px 8px',
            borderRadius: 6,
            background: 'rgba(16, 185, 129, 0.15)',
            color: '#34D399',
            border: '1px solid rgba(16, 185, 129, 0.3)',
          }}
        >
          HIGH MATCH
        </span>
      </div>

      {/* Requirement Info */}
      <div>
        <h4 style={{ fontSize: 14, fontWeight: 700, color: '#F3F4F6', marginBottom: 4 }}>
          {lead.productTitle}
        </h4>
        <p style={{ fontSize: 12, color: '#9CA3AF', lineHeight: '1.4' }}>{lead.description}</p>
      </div>

      {/* Stats Bar */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          background: 'rgba(31, 41, 55, 0.6)',
          padding: '8px 12px',
          borderRadius: 8,
          fontSize: 11,
        }}
      >
        <div>
          <span style={{ color: '#9CA3AF' }}>Qty: </span>
          <strong style={{ color: '#F9FAFB' }}>
            {lead.quantity} {lead.unit}
          </strong>
        </div>
        <div>
          <span style={{ color: '#9CA3AF' }}>Target Price: </span>
          <strong style={{ color: '#10B981' }}>${lead.targetPrice}</strong>
        </div>
        <div>
          <span style={{ color: '#9CA3AF' }}>Needed: </span>
          <strong style={{ color: '#F59E0B' }}>{lead.expectedDeliveryDate}</strong>
        </div>
      </div>

      {/* Action button */}
      <button
        onClick={() => onSendQuotation(lead)}
        style={{
          width: '100%',
          background: 'linear-gradient(135deg, #059669 0%, #10B981 100%)',
          color: '#FFF',
          border: 'none',
          borderRadius: 10,
          padding: '10px 0',
          fontSize: 13,
          fontWeight: 700,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 6,
          cursor: 'pointer',
          boxShadow: '0 4px 12px rgba(16, 185, 129, 0.3)',
        }}
      >
        <Send size={14} />
        <span>Create Official Quotation</span>
      </button>
    </div>
  );
};
