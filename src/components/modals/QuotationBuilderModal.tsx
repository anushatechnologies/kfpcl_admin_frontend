import React, { useState } from 'react';
import { useRFQStore } from '../../store/useRFQStore';
import { useAuthStore } from '../../store/useAuthStore';
import { RFQItem } from '../../types';
import { X, Send, CheckCircle2, DollarSign, Truck, ShieldCheck } from 'lucide-react';

interface Props {
  lead: RFQItem | null;
  isOpen: boolean;
  onClose: () => void;
}

export const QuotationBuilderModal: React.FC<Props> = ({ lead, isOpen, onClose }) => {
  const { createQuotation } = useRFQStore();
  const { user } = useAuthStore();

  const [unitPrice, setUnitPrice] = useState('36.00');
  const [shippingCost, setShippingCost] = useState('400');
  const [gstPercent, setGstPercent] = useState('18');
  const [deliveryDays, setDeliveryDays] = useState('12');
  const [notes, setNotes] = useState('Includes EN 10204 3.1 mill test certificates and door-to-door delivery.');
  const [submitted, setSubmitted] = useState(false);

  if (!isOpen || !lead) return null;

  const calculatedTotal =
    Number(unitPrice) * lead.quantity + Number(shippingCost) * (1 + Number(gstPercent) / 100);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    createQuotation({
      rfqId: lead.id,
      supplierId: user?.id || 'sup_99',
      supplierName: user?.companyName || 'PrecisionTech Dynamics',
      supplierLogo: user?.avatar || 'https://images.unsplash.com/photo-1560179707-f14e90ef3623?w=100&auto=format&fit=crop&q=80',
      unitPrice: Number(unitPrice),
      totalPrice: Math.round(calculatedTotal),
      moq: lead.quantity,
      estimatedDeliveryDays: Number(deliveryDays),
      shippingCost: Number(shippingCost),
      gstPercent: Number(gstPercent),
      notes,
      validUntil: '2026-08-20',
    });

    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      onClose();
    }, 1500);
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 999,
        background: 'rgba(0, 0, 0, 0.8)',
        backdropFilter: 'blur(12px)',
        display: 'flex',
        alignItems: 'flex-end',
        justifyContent: 'center',
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: 500,
          background: '#0F172A',
          borderTopLeftRadius: 24,
          borderTopRightRadius: 24,
          border: '1px solid rgba(16, 185, 129, 0.3)',
          padding: 20,
          maxHeight: '90vh',
          overflowY: 'auto',
          boxShadow: '0 -10px 40px rgba(0, 0, 0, 0.6)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
          <div>
            <h3 style={{ fontSize: 17, fontWeight: 800, color: '#F9FAFB' }}>B2B Quotation Generator</h3>
            <span style={{ fontSize: 11, color: '#10B981' }}>RFQ: {lead.productTitle}</span>
          </div>
          <button
            onClick={onClose}
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

        {submitted ? (
          <div style={{ textAlign: 'center', padding: '40px 0', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}>
            <CheckCircle2 size={48} color="#10B981" />
            <h4 style={{ fontSize: 18, fontWeight: 800, color: '#F9FAFB' }}>Quotation Sent to Buyer!</h4>
            <p style={{ fontSize: 13, color: '#9CA3AF' }}>The buyer will be notified to review and accept your quotation.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div
              style={{
                background: 'rgba(31, 41, 55, 0.6)',
                padding: 12,
                borderRadius: 12,
                fontSize: 12,
                display: 'flex',
                justifyContent: 'space-between',
              }}
            >
              <span>Target Qty: <strong>{lead.quantity} {lead.unit}</strong></span>
              <span>Buyer Target: <strong style={{ color: '#10B981' }}>${lead.targetPrice}/unit</strong></span>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
              <div>
                <label style={{ fontSize: 12, fontWeight: 700, color: '#9CA3AF', marginBottom: 4, display: 'block' }}>
                  Offered Unit Price ($)
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={unitPrice}
                  onChange={(e) => setUnitPrice(e.target.value)}
                  required
                  style={{
                    width: '100%',
                    background: 'rgba(31, 41, 55, 0.8)',
                    border: '1px solid rgba(255, 255, 255, 0.15)',
                    borderRadius: 10,
                    padding: '10px 14px',
                    color: '#FFF',
                    fontSize: 14,
                  }}
                />
              </div>

              <div>
                <label style={{ fontSize: 12, fontWeight: 700, color: '#9CA3AF', marginBottom: 4, display: 'block' }}>
                  Shipping & Freight ($)
                </label>
                <input
                  type="number"
                  value={shippingCost}
                  onChange={(e) => setShippingCost(e.target.value)}
                  style={{
                    width: '100%',
                    background: 'rgba(31, 41, 55, 0.8)',
                    border: '1px solid rgba(255, 255, 255, 0.15)',
                    borderRadius: 10,
                    padding: '10px 14px',
                    color: '#FFF',
                    fontSize: 14,
                  }}
                />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
              <div>
                <label style={{ fontSize: 12, fontWeight: 700, color: '#9CA3AF', marginBottom: 4, display: 'block' }}>
                  GST Tax Rate (%)
                </label>
                <input
                  type="number"
                  value={gstPercent}
                  onChange={(e) => setGstPercent(e.target.value)}
                  style={{
                    width: '100%',
                    background: 'rgba(31, 41, 55, 0.8)',
                    border: '1px solid rgba(255, 255, 255, 0.15)',
                    borderRadius: 10,
                    padding: '10px 14px',
                    color: '#FFF',
                    fontSize: 14,
                  }}
                />
              </div>

              <div>
                <label style={{ fontSize: 12, fontWeight: 700, color: '#9CA3AF', marginBottom: 4, display: 'block' }}>
                  Delivery Lead Time (Days)
                </label>
                <input
                  type="number"
                  value={deliveryDays}
                  onChange={(e) => setDeliveryDays(e.target.value)}
                  style={{
                    width: '100%',
                    background: 'rgba(31, 41, 55, 0.8)',
                    border: '1px solid rgba(255, 255, 255, 0.15)',
                    borderRadius: 10,
                    padding: '10px 14px',
                    color: '#FFF',
                    fontSize: 14,
                  }}
                />
              </div>
            </div>

            {/* Calculated summary */}
            <div
              style={{
                background: 'rgba(16, 185, 129, 0.12)',
                border: '1px solid rgba(16, 185, 129, 0.3)',
                padding: 12,
                borderRadius: 10,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <span style={{ fontSize: 12, color: '#D1D5DB' }}>Calculated Quote Total</span>
              <span style={{ fontSize: 18, fontWeight: 800, color: '#10B981' }}>
                ${Math.round(calculatedTotal).toLocaleString()}
              </span>
            </div>

            <div>
              <label style={{ fontSize: 12, fontWeight: 700, color: '#9CA3AF', marginBottom: 4, display: 'block' }}>
                Quotation Terms & Certifications
              </label>
              <textarea
                rows={2}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                style={{
                  width: '100%',
                  background: 'rgba(31, 41, 55, 0.8)',
                  border: '1px solid rgba(255, 255, 255, 0.15)',
                  borderRadius: 10,
                  padding: '10px 14px',
                  color: '#FFF',
                  fontSize: 12,
                  outline: 'none',
                }}
              />
            </div>

            <button
              type="submit"
              style={{
                width: '100%',
                background: 'linear-gradient(135deg, #059669 0%, #10B981 100%)',
                color: '#FFF',
                border: 'none',
                borderRadius: 12,
                padding: '12px 0',
                fontSize: 14,
                fontWeight: 800,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 8,
                cursor: 'pointer',
                marginTop: 6,
                boxShadow: '0 4px 16px rgba(16, 185, 129, 0.4)',
              }}
            >
              <Send size={16} />
              <span>Submit Binding Quotation</span>
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
