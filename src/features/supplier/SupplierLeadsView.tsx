import React from 'react';
import { useRFQStore } from '../../store/useRFQStore';
import { LeadCard } from '../../components/shared/LeadCard';
import { RFQItem } from '../../types';
import { Target, Sparkles } from 'lucide-react';

interface Props {
  onOpenQuotationBuilder: (lead: RFQItem) => void;
}

export const SupplierLeadsView: React.FC<Props> = ({ onOpenQuotationBuilder }) => {
  const { rfqs } = useRFQStore();

  return (
    <div style={{ paddingBottom: 90, display: 'flex', flexDirection: 'column', gap: 16 }}>
      {/* Header */}
      <div>
        <h2 style={{ fontSize: 20, fontWeight: 800, color: '#F9FAFB' }}>Incoming RFQ Leads Desk</h2>
        <p style={{ fontSize: 12, color: '#9CA3AF' }}>Direct high-intent buyer inquiries ready for supplier quotations</p>
      </div>

      {/* Banner */}
      <div
        style={{
          background: 'rgba(16, 185, 129, 0.12)',
          border: '1px solid rgba(16, 185, 129, 0.3)',
          borderRadius: 14,
          padding: 12,
          display: 'flex',
          alignItems: 'center',
          gap: 10,
          color: '#34D399',
          fontSize: 12,
        }}
      >
        <Sparkles size={18} />
        <span>Suppliers who respond within 2 hours win 74% more contract awards!</span>
      </div>

      {/* Feed */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        {rfqs.map((lead) => (
          <LeadCard key={lead.id} lead={lead} onSendQuotation={onOpenQuotationBuilder} />
        ))}
      </div>
    </div>
  );
};
