import React from 'react';
import { useRFQStore } from '../../store/useRFQStore';
import { RFQCard } from '../../components/shared/RFQCard';
import { RFQItem } from '../../types';
import { FileText, Plus, ShieldCheck, Sparkles } from 'lucide-react';

export const BuyerRFQDeskView: React.FC = () => {
  const { rfqs, setCreateRFQModalOpen, setSelectedRFQ, setCompareModalOpen } = useRFQStore();

  const handleViewQuotes = (rfq: RFQItem) => {
    setSelectedRFQ(rfq);
    setCompareModalOpen(true);
  };

  return (
    <div style={{ paddingBottom: 90, display: 'flex', flexDirection: 'column', gap: 16 }}>
      {/* Top Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <h2 style={{ fontSize: 20, fontWeight: 800, color: '#F9FAFB' }}>Buyer RFQ Desk</h2>
          <p style={{ fontSize: 12, color: '#9CA3AF' }}>Track your active custom material requests & compare supplier quotes</p>
        </div>

        <button
          onClick={() => setCreateRFQModalOpen(true)}
          style={{
            background: 'linear-gradient(135deg, #2563EB 0%, #1D4ED8 100%)',
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
            boxShadow: '0 4px 14px rgba(37, 99, 235, 0.4)',
          }}
        >
          <Plus size={16} />
          <span>New RFQ</span>
        </button>
      </div>

      {/* RFQ Stats Bar */}
      <div
        style={{
          background: 'rgba(17, 24, 39, 0.75)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          borderRadius: 14,
          padding: 14,
          display: 'grid',
          gridTemplateColumns: '1fr 1fr 1fr',
          textAlign: 'center',
        }}
      >
        <div>
          <div style={{ fontSize: 18, fontWeight: 800, color: '#60A5FA' }}>{rfqs.length}</div>
          <div style={{ fontSize: 11, color: '#9CA3AF' }}>Active RFQs</div>
        </div>

        <div style={{ borderLeft: '1px solid rgba(255, 255, 255, 0.1)', borderRight: '1px solid rgba(255, 255, 255, 0.1)' }}>
          <div style={{ fontSize: 18, fontWeight: 800, color: '#34D399' }}>
            {rfqs.reduce((acc, r) => acc + r.quotesCount, 0)}
          </div>
          <div style={{ fontSize: 11, color: '#9CA3AF' }}>Quotes Received</div>
        </div>

        <div>
          <div style={{ fontSize: 18, fontWeight: 800, color: '#FBBF24' }}>24h</div>
          <div style={{ fontSize: 11, color: '#9CA3AF' }}>Avg Response</div>
        </div>
      </div>

      {/* RFQs List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        {rfqs.map((rfq) => (
          <RFQCard key={rfq.id} rfq={rfq} onViewQuotes={handleViewQuotes} />
        ))}
      </div>
    </div>
  );
};
