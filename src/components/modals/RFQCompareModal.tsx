import React from 'react';
import { useRFQStore } from '../../store/useRFQStore';
import { QuotationCard } from '../shared/QuotationCard';
import { X, CheckCircle2, ShieldCheck } from 'lucide-react';

export const RFQCompareModal: React.FC = () => {
  const { compareModalOpen, setCompareModalOpen, selectedRFQ, getQuotesForRFQ } = useRFQStore();

  if (!compareModalOpen || !selectedRFQ) return null;

  const quotes = getQuotesForRFQ(selectedRFQ.id);

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 999,
        background: 'rgba(0, 0, 0, 0.85)',
        backdropFilter: 'blur(16px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 16,
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: 480,
          background: '#0B0F17',
          borderRadius: 24,
          border: '1px solid rgba(255, 255, 255, 0.15)',
          padding: 20,
          maxHeight: '85vh',
          overflowY: 'auto',
          boxShadow: '0 20px 50px rgba(0, 0, 0, 0.8)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
          <div>
            <h3 style={{ fontSize: 17, fontWeight: 800, color: '#F9FAFB' }}>Compare Supplier Quotations</h3>
            <span style={{ fontSize: 11, color: '#60A5FA' }}>{selectedRFQ.productTitle}</span>
          </div>
          <button
            onClick={() => setCompareModalOpen(false)}
            style={{
              background: 'rgba(255, 255, 255, 0.1)',
              border: 'none',
              borderRadius: 20,
              width: 32,
              height: 32,
              color: '#FFF',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
            }}
          >
            <X size={16} />
          </button>
        </div>

        {quotes.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px 0', color: '#9CA3AF' }}>
            No quotations received yet for this RFQ.
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {quotes.map((quote) => (
              <QuotationCard
                key={quote.id}
                quotation={quote}
                onAccept={() => setCompareModalOpen(false)}
                isBuyer={true}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
