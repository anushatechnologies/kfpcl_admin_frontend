import React, { useState } from 'react';
import { useProductStore } from '../../store/useProductStore';
import { useAuthStore } from '../../store/useAuthStore';
import { useAdminStore } from '../../store/useAdminStore';
import { CATEGORIES } from '../../constants/mockData';
import { X, Plus, CheckCircle2, Upload } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export const AddProductModal: React.FC<Props> = ({ isOpen, onClose }) => {
  const { addProduct } = useProductStore();
  const { addProductApproval } = useAdminStore();
  const { user } = useAuthStore();

  const [title, setTitle] = useState('');
  const [category, setCategory] = useState(CATEGORIES[0]?.name || '');
  const [brand, setBrand] = useState('ApexCorp');
  const [moq, setMoq] = useState('10');
  const [unit, setUnit] = useState('Pieces');
  const [price1, setPrice1] = useState('120');
  const [price2, setPrice2] = useState('95');
  const [description, setDescription] = useState('');
  const [submitted, setSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !moq) return;

    const productId = addProduct({
      title,
      category,
      brand,
      images: [
        'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=800&auto=format&fit=crop&q=80',
      ],
      description: description || 'High-grade commercial wholesale equipment produced in ISO-certified facilities.',
      moq: Number(moq),
      unit,
      tierPricing: [
        { minQty: Number(moq), maxQty: 49, pricePerUnit: Number(price1) },
        { minQty: 50, maxQty: null, pricePerUnit: Number(price2) },
      ],
      supplierId: user?.id || 'sup_99',
      supplierName: user?.companyName || 'Apex Industrial Solutions',
      supplierLocation: `${user?.location.city}, ${user?.location.country}`,
      supplierRating: 5.0,
      isGstVerified: true,
      verifiedSupplier: true,
      specifications: {
        'Quality Standard': 'ISO 9001 Certificated',
        'Warranty': '2 Years Manufacturer',
      },
      stock: 500,
      status: 'PENDING_APPROVAL',
    });
    addProductApproval({
      id: productId,
      title,
      supplierName: user?.companyName || 'Apex Industrial Solutions',
      category,
      brand,
      basePrice: Number(price1),
      moq: Number(moq),
      unit,
      submittedAt: new Date().toLocaleString(),
      image: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=400&auto=format&fit=crop&q=80',
      status: 'PENDING',
      complianceStatus: 'PASSED',
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
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
          <h3 style={{ fontSize: 18, fontWeight: 800, color: '#F9FAFB' }}>Add New Product to Inventory</h3>
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
            <h4 style={{ fontSize: 18, fontWeight: 800, color: '#F9FAFB' }}>Product Added Successfully!</h4>
            <p style={{ fontSize: 13, color: '#9CA3AF' }}>Your product is live for global buyers to inspect and send RFQs.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div>
              <label style={{ fontSize: 12, fontWeight: 700, color: '#9CA3AF', marginBottom: 4, display: 'block' }}>
                Product Title
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Heavy Duty Servo Motor Drive 10kW"
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

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
              <div>
                <label style={{ fontSize: 12, fontWeight: 700, color: '#9CA3AF', marginBottom: 4, display: 'block' }}>
                  Category
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
                  Brand Name
                </label>
                <input
                  type="text"
                  value={brand}
                  onChange={(e) => setBrand(e.target.value)}
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
                  Base MOQ
                </label>
                <input
                  type="number"
                  value={moq}
                  onChange={(e) => setMoq(e.target.value)}
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
                  Unit
                </label>
                <input
                  type="text"
                  value={unit}
                  onChange={(e) => setUnit(e.target.value)}
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
                  Tier 1 Price ($/unit)
                </label>
                <input
                  type="number"
                  value={price1}
                  onChange={(e) => setPrice1(e.target.value)}
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
                  Bulk Tier 2 Price ($/unit)
                </label>
                <input
                  type="number"
                  value={price2}
                  onChange={(e) => setPrice2(e.target.value)}
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
              <Plus size={16} />
              <span>Publish to B2B Catalog</span>
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
