import React, { useState } from 'react';
import { useRFQStore } from '../../store/useRFQStore';
import { useAuthStore } from '../../store/useAuthStore';
import { CATEGORIES } from '../../constants/mockData';
import { X, Send, Paperclip, CheckCircle2 } from 'lucide-react';

export const RFQCreateModal: React.FC = () => {
  const { createRFQModalOpen, setCreateRFQModalOpen, createRFQ } = useRFQStore();
  const { user } = useAuthStore();

  const [productTitle, setProductTitle] = useState('');
  const [category, setCategory] = useState(CATEGORIES[0]?.name || '');
  const [quantity, setQuantity] = useState('500');
  const [unit, setUnit] = useState('Pieces');
  const [targetPrice, setTargetPrice] = useState('45');
  const [expectedDeliveryDate, setExpectedDeliveryDate] = useState('2026-08-30');
  const [description, setDescription] = useState('');
  const [submitted, setSubmitted] = useState(false);

  if (!createRFQModalOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!productTitle || !quantity) return;

    createRFQ({
      buyerId: user?.id || 'usr_101',
      buyerName: user?.name || 'Alex Vance',
      buyerCompany: user?.companyName || 'Apex Industrial Solutions',
      buyerLocation: `${user?.location.city}, ${user?.location.country}`,
      productTitle,
      category,
      quantity: Number(quantity),
      unit,
      targetPrice: Number(targetPrice),
      expectedDeliveryDate,
      description,
    });

    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setCreateRFQModalOpen(false);
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
          border: '1px solid rgba(255, 255, 255, 0.15)',
          padding: 20,
          maxHeight: '90vh',
          overflowY: 'auto',
          boxShadow: '0 -10px 40px rgba(0, 0, 0, 0.6)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
          <h3 style={{ fontSize: 18, fontWeight: 800, color: '#F9FAFB' }}>Post Custom RFQ Requirement</h3>
          <button
            onClick={() => setCreateRFQModalOpen(false)}
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
            <h4 style={{ fontSize: 18, fontWeight: 800, color: '#F9FAFB' }}>RFQ Posted Successfully!</h4>
            <p style={{ fontSize: 13, color: '#9CA3AF' }}>Verified suppliers will submit quotations to your RFQ desk shortly.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div>
              <label style={{ fontSize: 12, fontWeight: 700, color: '#9CA3AF', marginBottom: 4, display: 'block' }}>
                Product / Material Name
              </label>
              <input
                type="text"
                value={productTitle}
                onChange={(e) => setProductTitle(e.target.value)}
                placeholder="e.g. Stainless Steel Pipe Flanges 316L"
                required
                style={{
                  width: '100%',
                  background: 'rgba(31, 41, 55, 0.8)',
                  border: '1px solid rgba(255, 255, 255, 0.15)',
                  borderRadius: 10,
                  padding: '10px 14px',
                  color: '#FFF',
                  fontSize: 14,
                  outline: 'none',
                }}
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
              <div>
                <label style={{ fontSize: 12, fontWeight: 700, color: '#9CA3AF', marginBottom: 4, display: 'block' }}>
                  Industry Category
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  style={{
                    width: '100%',
                    background: '#1F2937',
                    border: '1px solid rgba(255, 255, 255, 0.15)',
                    borderRadius: 10,
                    padding: '10px',
                    color: '#FFF',
                    fontSize: 13,
                  }}
                >
                  {CATEGORIES.map((c) => (
                    <option key={c.id} value={c.name}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label style={{ fontSize: 12, fontWeight: 700, color: '#9CA3AF', marginBottom: 4, display: 'block' }}>
                  Required Quantity
                </label>
                <input
                  type="number"
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
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
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
              <div>
                <label style={{ fontSize: 12, fontWeight: 700, color: '#9CA3AF', marginBottom: 4, display: 'block' }}>
                  Target Price ($ / unit)
                </label>
                <input
                  type="number"
                  value={targetPrice}
                  onChange={(e) => setTargetPrice(e.target.value)}
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
                  Expected Delivery Date
                </label>
                <input
                  type="date"
                  value={expectedDeliveryDate}
                  onChange={(e) => setExpectedDeliveryDate(e.target.value)}
                  style={{
                    width: '100%',
                    background: 'rgba(31, 41, 55, 0.8)',
                    border: '1px solid rgba(255, 255, 255, 0.15)',
                    borderRadius: 10,
                    padding: '10px 14px',
                    color: '#FFF',
                    fontSize: 13,
                  }}
                />
              </div>
            </div>

            <div>
              <label style={{ fontSize: 12, fontWeight: 700, color: '#9CA3AF', marginBottom: 4, display: 'block' }}>
                Detailed Specifications & Requirements
              </label>
              <textarea
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Include material grade, size tolerances, certification requirements..."
                style={{
                  width: '100%',
                  background: 'rgba(31, 41, 55, 0.8)',
                  border: '1px solid rgba(255, 255, 255, 0.15)',
                  borderRadius: 10,
                  padding: '10px 14px',
                  color: '#FFF',
                  fontSize: 13,
                  outline: 'none',
                }}
              />
            </div>

            <button
              type="submit"
              style={{
                width: '100%',
                background: 'linear-gradient(135deg, #2563EB 0%, #1D4ED8 100%)',
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
                boxShadow: '0 4px 16px rgba(37, 99, 235, 0.4)',
              }}
            >
              <Send size={16} />
              <span>Broadcast RFQ to Suppliers</span>
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
