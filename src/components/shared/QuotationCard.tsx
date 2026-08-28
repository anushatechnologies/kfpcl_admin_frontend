import React from 'react';
import { Quotation } from '../../types';
import { FileText, CheckCircle2, ShieldAlert, Truck, Calendar, ArrowRight } from 'lucide-react';
import { useRFQStore } from '../../store/useRFQStore';
import { useOrderStore } from '../../store/useOrderStore';

interface Props {
  quotation: Quotation;
  onAccept?: (quotation: Quotation) => void;
  isBuyer?: boolean;
}

export const QuotationCard: React.FC<Props> = ({ quotation, onAccept, isBuyer = true }) => {
  const { acceptQuotation } = useRFQStore();
  const { createOrderFromQuotation } = useOrderStore();

  const handleAccept = () => {
    acceptQuotation(quotation.id);
    createOrderFromQuotation(
      quotation.id,
      {
        supplierId: quotation.supplierId,
        supplierName: quotation.supplierName,
        moq: quotation.moq,
        unitPrice: quotation.unitPrice,
        totalPrice: quotation.totalPrice,
      },
      '450 Mission Street, Suite 1200, San Francisco, CA'
    );
    if (onAccept) onAccept(quotation);
  };

  const isAccepted = quotation.status === 'ACCEPTED';

  return (
    <div
      style={{
        background: 'linear-gradient(145deg, rgba(17, 24, 39, 0.95) 0%, rgba(31, 41, 55, 0.9) 100%)',
        border: isAccepted ? '2px solid #10B981' : '1px solid rgba(59, 130, 246, 0.3)',
        borderRadius: 16,
        padding: 16,
        display: 'flex',
        flexDirection: 'column',
        gap: 12,
        boxShadow: '0 8px 24px rgba(0, 0, 0, 0.4)',
        maxWidth: 340,
      }}
    >
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div
            style={{
              width: 28,
              height: 28,
              borderRadius: 6,
              background: 'rgba(59, 130, 246, 0.2)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#60A5FA',
            }}
          >
            <FileText size={14} />
          </div>
          <span style={{ fontSize: 12, fontWeight: 800, color: '#F9FAFB' }}>Official Quotation</span>
        </div>

        <span
          style={{
            fontSize: 10,
            fontWeight: 800,
            padding: '2px 8px',
            borderRadius: 6,
            background: isAccepted ? 'rgba(16, 185, 129, 0.2)' : 'rgba(59, 130, 246, 0.2)',
            color: isAccepted ? '#34D399' : '#60A5FA',
            border: isAccepted ? '1px solid rgba(16, 185, 129, 0.3)' : '1px solid rgba(59, 130, 246, 0.3)',
          }}
        >
          {quotation.status}
        </span>
      </div>

      {/* Supplier info */}
      <div style={{ fontSize: 12, color: '#9CA3AF' }}>
        Issued by: <strong style={{ color: '#E5E7EB' }}>{quotation.supplierName}</strong>
      </div>

      {/* Price breakdown block */}
      <div
        style={{
          background: 'rgba(15, 23, 42, 0.8)',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          borderRadius: 10,
          padding: 12,
          display: 'flex',
          flexDirection: 'column',
          gap: 6,
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: '#9CA3AF' }}>
          <span>Unit Price ({quotation.moq} pcs)</span>
          <strong style={{ color: '#F9FAFB' }}>${quotation.unitPrice} / unit</strong>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: '#9CA3AF' }}>
          <span>Shipping Freight</span>
          <strong style={{ color: '#F9FAFB' }}>${quotation.shippingCost}</strong>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: '#9CA3AF' }}>
          <span>Applicable GST</span>
          <strong style={{ color: '#F9FAFB' }}>{quotation.gstPercent}%</strong>
        </div>

        <div
          style={{
            borderTop: '1px solid rgba(255, 255, 255, 0.1)',
            paddingTop: 6,
            marginTop: 4,
            display: 'flex',
            justifyContent: 'space-between',
            fontSize: 14,
            fontWeight: 800,
          }}
        >
          <span style={{ color: '#F3F4F6' }}>Total Amount</span>
          <span style={{ color: '#10B981' }}>${quotation.totalPrice.toLocaleString()}</span>
        </div>
      </div>

      {/* Terms & Delivery */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 4, fontSize: 11, color: '#9CA3AF' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <Truck size={12} color="#60A5FA" />
          <span>Estimated Delivery: <strong>{quotation.estimatedDeliveryDays} days</strong></span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <Calendar size={12} color="#F59E0B" />
          <span>Quote Valid Until: <strong>{quotation.validUntil}</strong></span>
        </div>
      </div>

      {quotation.notes && (
        <p style={{ fontSize: 10, color: '#6B7280', fontStyle: 'italic' }}>"{quotation.notes}"</p>
      )}

      {/* Accept Action */}
      {isBuyer && !isAccepted && (
        <button
          onClick={handleAccept}
          style={{
            width: '100%',
            background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
            color: '#FFF',
            border: 'none',
            borderRadius: 10,
            padding: '10px 0',
            fontSize: 13,
            fontWeight: 800,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 6,
            cursor: 'pointer',
            boxShadow: '0 4px 14px rgba(16, 185, 129, 0.4)',
          }}
        >
          <CheckCircle2 size={15} />
          <span>Accept & Pay via Escrow</span>
        </button>
      )}

      {isAccepted && (
        <div
          style={{
            textAlign: 'center',
            fontSize: 12,
            fontWeight: 700,
            color: '#34D399',
            padding: '6px 0',
            background: 'rgba(16, 185, 129, 0.15)',
            borderRadius: 8,
          }}
        >
          Quotation Accepted! Order Created.
        </div>
      )}
    </div>
  );
};
