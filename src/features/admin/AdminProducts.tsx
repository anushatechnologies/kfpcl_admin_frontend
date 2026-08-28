import React, { useState } from 'react';
import { useProductStore } from '../../store/useProductStore';
import { CATEGORIES } from '../../constants/mockData';
import { Product } from '../../types';
import {
  Package,
  Search,
  Plus,
  Edit3,
  Trash2,
  Eye,
  ShieldCheck,
  Star,
  Layers,
  CheckCircle2,
  AlertCircle,
  Download,
  Filter,
  DollarSign,
  Boxes,
} from 'lucide-react';

export const AdminProducts: React.FC = () => {
  const { products, addProduct, deleteProduct } = useProductStore();
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [selectedStatus, setSelectedStatus] = useState<'ALL' | 'PUBLISHED' | 'DRAFT' | 'OUT_OF_STOCK'>('ALL');
  const [viewProduct, setViewProduct] = useState<Product | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);

  // New product form
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState(CATEGORIES[0]?.name || '');
  const [newBrand, setNewBrand] = useState('ApexCorp');
  const [newMoq, setNewMoq] = useState('5');
  const [newUnit, setNewUnit] = useState('Units');
  const [newPrice, setNewPrice] = useState('1500');
  const [newStock, setNewStock] = useState('50');
  const [newDescription, setNewDescription] = useState('');

  const filteredProducts = products.filter((p) => {
    const matchesSearch =
      p.title.toLowerCase().includes(search.toLowerCase()) ||
      p.category.toLowerCase().includes(search.toLowerCase()) ||
      p.supplierName.toLowerCase().includes(search.toLowerCase()) ||
      p.brand.toLowerCase().includes(search.toLowerCase());
    const matchesCat = selectedCategory === 'ALL' || p.category === selectedCategory;
    const matchesStatus = selectedStatus === 'ALL' || (p.status || 'PUBLISHED') === selectedStatus;
    return matchesSearch && matchesCat && matchesStatus;
  });

  const handleCreateProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle) return;

    addProduct({
      title: newTitle,
      category: newCategory,
      brand: newBrand,
      images: [
        'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=800&auto=format&fit=crop&q=80',
      ],
      description: newDescription || 'Premium commercial wholesale grade product.',
      moq: Number(newMoq),
      unit: newUnit,
      tierPricing: [
        { minQty: Number(newMoq), maxQty: Number(newMoq) * 4, pricePerUnit: Number(newPrice) },
        { minQty: Number(newMoq) * 4 + 1, maxQty: null, pricePerUnit: Math.round(Number(newPrice) * 0.88) },
      ],
      supplierId: 'usr_101',
      supplierName: 'Apex Industrial Solutions',
      supplierLocation: 'San Francisco, CA, USA',
      supplierRating: 4.9,
      isGstVerified: true,
      verifiedSupplier: true,
      specifications: {
        'Quality Standard': 'ISO 9001:2015',
        'Warranty Period': '2 Years Manufacturer',
      },
      stock: Number(newStock),
      status: 'PUBLISHED',
    });

    setShowAddModal(false);
    setNewTitle('');
    setNewDescription('');
  };

  const exportProductsCSV = () => {
    const headers = ['ID', 'Title', 'Category', 'Brand', 'Supplier', 'Base Price', 'MOQ', 'Stock', 'Status'];
    const rows = filteredProducts.map((p) => [
      p.id,
      `"${p.title.replace(/"/g, '""')}"`,
      p.category,
      p.brand,
      `"${p.supplierName}"`,
      p.tierPricing[0]?.pricePerUnit || 0,
      p.moq,
      p.stock,
      p.status || 'PUBLISHED',
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `kfpl_products_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      {/* Header Bar */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <h1 style={{ fontSize: 24, fontWeight: 800, color: '#F9FAFB' }}>Global Product Catalog</h1>
          <p style={{ fontSize: 13, color: '#9CA3AF', marginTop: 2 }}>
            Manage published wholesale inventories, pricing tiers, MOQ standards, and specifications
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <button
            onClick={exportProductsCSV}
            style={{
              background: 'rgba(31, 41, 55, 0.8)',
              border: '1px solid rgba(255, 255, 255, 0.12)',
              borderRadius: 10,
              padding: '8px 14px',
              color: '#D1D5DB',
              fontSize: 12,
              fontWeight: 700,
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              cursor: 'pointer',
            }}
          >
            <Download size={14} />
            <span>Export Catalog</span>
          </button>

          <button
            onClick={() => setShowAddModal(true)}
            style={{
              background: 'linear-gradient(135deg, #059669 0%, #10B981 100%)',
              border: 'none',
              borderRadius: 10,
              padding: '8px 16px',
              color: '#FFF',
              fontSize: 13,
              fontWeight: 800,
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              cursor: 'pointer',
              boxShadow: '0 4px 14px rgba(16, 185, 129, 0.35)',
            }}
          >
            <Plus size={15} />
            <span>Add Wholesale Product</span>
          </button>
        </div>
      </div>

      {/* Filter Row */}
      <div
        style={{
          background: 'rgba(17, 24, 39, 0.75)',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          borderRadius: 14,
          padding: 14,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 12,
          flexWrap: 'wrap',
        }}
      >
        <div
          style={{
            flex: 1,
            minWidth: 260,
            background: 'rgba(31, 41, 55, 0.8)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: 10,
            padding: '8px 12px',
            display: 'flex',
            alignItems: 'center',
            gap: 8,
          }}
        >
          <Search size={16} color="#10B981" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search products by title, category, brand, supplier..."
            style={{
              background: 'transparent',
              border: 'none',
              color: '#FFF',
              fontSize: 13,
              outline: 'none',
              width: '100%',
            }}
          />
        </div>

        {/* Category Selector */}
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          style={{
            background: '#1F2937',
            border: '1px solid rgba(255, 255, 255, 0.15)',
            borderRadius: 8,
            padding: '8px 12px',
            color: '#FFF',
            fontSize: 12,
            fontWeight: 600,
          }}
        >
          <option value="ALL">All Categories ({products.length})</option>
          {CATEGORIES.map((c) => (
            <option key={c.id} value={c.name}>
              {c.name}
            </option>
          ))}
        </select>

        {/* Status Filter */}
        <div style={{ display: 'flex', gap: 6 }}>
          {(['ALL', 'PUBLISHED', 'DRAFT', 'OUT_OF_STOCK'] as const).map((st) => (
            <button
              key={st}
              onClick={() => setSelectedStatus(st)}
              style={{
                background: selectedStatus === st ? '#10B981' : 'rgba(31, 41, 55, 0.6)',
                border: selectedStatus === st ? '1px solid #34D399' : '1px solid rgba(255, 255, 255, 0.08)',
                color: selectedStatus === st ? '#FFF' : '#9CA3AF',
                borderRadius: 8,
                padding: '5px 10px',
                fontSize: 11,
                fontWeight: 700,
                cursor: 'pointer',
              }}
            >
              {st.replace('_', ' ')}
            </button>
          ))}
        </div>
      </div>

      {/* Product List Table */}
      <div
        style={{
          background: 'rgba(17, 24, 39, 0.75)',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          borderRadius: 16,
          overflow: 'hidden',
        }}
      >
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: 'rgba(15, 23, 42, 0.6)' }}>
              {['Product Info', 'Category & Brand', 'Supplier / Location', 'Volume Tier Pricing', 'Stock & MOQ', 'Status', 'Actions'].map((h) => (
                <th
                  key={h}
                  style={{
                    textAlign: 'left',
                    padding: '12px 14px',
                    fontSize: 11,
                    fontWeight: 700,
                    color: '#9CA3AF',
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px',
                    borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
                  }}
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filteredProducts.length === 0 ? (
              <tr>
                <td colSpan={7} style={{ textAlign: 'center', padding: 40, color: '#9CA3AF' }}>
                  No wholesale products found.
                </td>
              </tr>
            ) : (
              filteredProducts.map((p) => {
                const lowest = p.tierPricing[p.tierPricing.length - 1]?.pricePerUnit;
                const highest = p.tierPricing[0]?.pricePerUnit;

                return (
                  <tr
                    key={p.id}
                    style={{
                      borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
                      transition: 'background 0.15s ease',
                    }}
                    onMouseEnter={(e) => {
                      (e.currentTarget as HTMLTableRowElement).style.background = 'rgba(31, 41, 55, 0.4)';
                    }}
                    onMouseLeave={(e) => {
                      (e.currentTarget as HTMLTableRowElement).style.background = 'transparent';
                    }}
                  >
                    {/* Product Info */}
                    <td style={{ padding: '12px 14px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                        <img
                          src={p.images[0]}
                          alt={p.title}
                          style={{ width: 44, height: 44, borderRadius: 10, objectFit: 'cover', background: '#111827' }}
                        />
                        <div style={{ maxWidth: 220 }}>
                          <div style={{ fontSize: 13, fontWeight: 700, color: '#F9FAFB', lineHeight: '1.3' }}>
                            {p.title}
                          </div>
                          <div style={{ fontSize: 10, color: '#6B7280', marginTop: 2 }}>ID: {p.id}</div>
                        </div>
                      </div>
                    </td>

                    {/* Category & Brand */}
                    <td style={{ padding: '12px 14px' }}>
                      <div style={{ fontSize: 12, fontWeight: 700, color: '#60A5FA' }}>{p.category}</div>
                      <div style={{ fontSize: 11, color: '#9CA3AF', marginTop: 2 }}>Brand: {p.brand}</div>
                    </td>

                    {/* Supplier */}
                    <td style={{ padding: '12px 14px' }}>
                      <div style={{ fontSize: 12, fontWeight: 600, color: '#E5E7EB' }}>{p.supplierName}</div>
                      <div style={{ fontSize: 10, color: '#9CA3AF', marginTop: 2 }}>{p.supplierLocation}</div>
                      <div style={{ fontSize: 10, color: '#F59E0B', display: 'flex', alignItems: 'center', gap: 3, marginTop: 2 }}>
                        <Star size={10} fill="#F59E0B" />
                        <span>{p.supplierRating} Rating</span>
                      </div>
                    </td>

                    {/* Tier Pricing */}
                    <td style={{ padding: '12px 14px' }}>
                      <div style={{ fontSize: 13, fontWeight: 800, color: '#10B981' }}>
                        ${lowest ? lowest.toLocaleString() : highest.toLocaleString()}
                        {lowest !== highest && ` - $${highest.toLocaleString()}`}
                      </div>
                      <div style={{ fontSize: 10, color: '#9CA3AF', marginTop: 2 }}>
                        {p.tierPricing.length} pricing tiers configured
                      </div>
                    </td>

                    {/* Stock & MOQ */}
                    <td style={{ padding: '12px 14px' }}>
                      <div style={{ fontSize: 12, color: '#D1D5DB' }}>
                        Stock: <strong style={{ color: '#FFF' }}>{p.stock.toLocaleString()} {p.unit}</strong>
                      </div>
                      <div style={{ fontSize: 11, color: '#38BDF8', marginTop: 2 }}>
                        MOQ: {p.moq} {p.unit}
                      </div>
                    </td>

                    {/* Status */}
                    <td style={{ padding: '12px 14px' }}>
                      <span
                        style={{
                          fontSize: 10,
                          fontWeight: 800,
                          padding: '3px 8px',
                          borderRadius: 6,
                          background:
                            p.status === 'PUBLISHED' || !p.status
                              ? 'rgba(16, 185, 129, 0.15)'
                              : p.status === 'OUT_OF_STOCK'
                              ? 'rgba(239, 68, 68, 0.15)'
                              : 'rgba(245, 158, 11, 0.15)',
                          color:
                            p.status === 'PUBLISHED' || !p.status
                              ? '#34D399'
                              : p.status === 'OUT_OF_STOCK'
                              ? '#F87171'
                              : '#FBBF24',
                          border: `1px solid ${
                            p.status === 'PUBLISHED' || !p.status
                              ? 'rgba(16, 185, 129, 0.3)'
                              : p.status === 'OUT_OF_STOCK'
                              ? 'rgba(239, 68, 68, 0.3)'
                              : 'rgba(245, 158, 11, 0.3)'
                          }`,
                        }}
                      >
                        {p.status || 'PUBLISHED'}
                      </span>
                    </td>

                    {/* Actions */}
                    <td style={{ padding: '12px 14px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                        <button
                          onClick={() => setViewProduct(p)}
                          title="View Details"
                          style={{
                            background: 'rgba(31, 41, 55, 0.8)',
                            border: '1px solid rgba(255, 255, 255, 0.1)',
                            borderRadius: 6,
                            color: '#60A5FA',
                            width: 28,
                            height: 28,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            cursor: 'pointer',
                          }}
                        >
                          <Eye size={13} />
                        </button>
                        <button
                          onClick={() => deleteProduct(p.id)}
                          title="Delete Product"
                          style={{
                            background: 'rgba(239, 68, 68, 0.15)',
                            border: '1px solid rgba(239, 68, 68, 0.3)',
                            borderRadius: 6,
                            color: '#F87171',
                            width: 28,
                            height: 28,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            cursor: 'pointer',
                          }}
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Product View Modal */}
      {viewProduct && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 9999,
            background: 'rgba(0,0,0,0.75)',
            backdropFilter: 'blur(8px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: 20,
          }}
        >
          <div
            style={{
              width: '100%',
              maxWidth: 550,
              background: '#0F172A',
              borderRadius: 16,
              border: '1px solid rgba(255,255,255,0.15)',
              padding: 24,
              boxShadow: '0 20px 50px rgba(0,0,0,0.8)',
              maxHeight: '90vh',
              overflowY: 'auto',
            }}
          >
            <div style={{ display: 'flex', gap: 16, marginBottom: 16 }}>
              <img
                src={viewProduct.images[0]}
                alt={viewProduct.title}
                style={{ width: 120, height: 120, borderRadius: 12, objectFit: 'cover' }}
              />
              <div>
                <span style={{ fontSize: 11, fontWeight: 700, color: '#10B981' }}>{viewProduct.category}</span>
                <h3 style={{ fontSize: 16, fontWeight: 800, color: '#F9FAFB', margin: '4px 0' }}>
                  {viewProduct.title}
                </h3>
                <div style={{ fontSize: 12, color: '#9CA3AF' }}>Brand: {viewProduct.brand}</div>
                <div style={{ fontSize: 12, color: '#9CA3AF' }}>Supplier: {viewProduct.supplierName}</div>
              </div>
            </div>

            <div style={{ marginBottom: 14 }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: '#9CA3AF', marginBottom: 4 }}>Description</div>
              <p style={{ fontSize: 12, color: '#D1D5DB', lineHeight: '1.5' }}>{viewProduct.description}</p>
            </div>

            <div style={{ marginBottom: 14 }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: '#9CA3AF', marginBottom: 6 }}>Tier Pricing</div>
              <div style={{ display: 'flex', gap: 8 }}>
                {viewProduct.tierPricing.map((t, idx) => (
                  <div
                    key={idx}
                    style={{
                      flex: 1,
                      background: 'rgba(31, 41, 55, 0.7)',
                      padding: 10,
                      borderRadius: 8,
                      textAlign: 'center',
                    }}
                  >
                    <div style={{ fontSize: 11, color: '#9CA3AF' }}>
                      {t.minQty} {t.maxQty ? `- ${t.maxQty}` : '+'} {viewProduct.unit}
                    </div>
                    <div style={{ fontSize: 14, fontWeight: 800, color: '#10B981', marginTop: 2 }}>
                      ${t.pricePerUnit}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div style={{ marginBottom: 16 }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: '#9CA3AF', marginBottom: 6 }}>Specifications</div>
              <div style={{ background: 'rgba(31, 41, 55, 0.5)', borderRadius: 8, padding: 10 }}>
                {Object.entries(viewProduct.specifications).map(([k, v]) => (
                  <div key={k} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, padding: '3px 0' }}>
                    <span style={{ color: '#9CA3AF' }}>{k}:</span>
                    <strong style={{ color: '#F3F4F6' }}>{v}</strong>
                  </div>
                ))}
              </div>
            </div>

            <button
              onClick={() => setViewProduct(null)}
              style={{
                width: '100%',
                background: 'rgba(255, 255, 255, 0.1)',
                color: '#FFF',
                border: 'none',
                borderRadius: 8,
                padding: '10px 0',
                fontSize: 13,
                fontWeight: 700,
                cursor: 'pointer',
              }}
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Add Wholesale Product Modal */}
      {showAddModal && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 9999,
            background: 'rgba(0,0,0,0.75)',
            backdropFilter: 'blur(8px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: 20,
          }}
        >
          <div
            style={{
              width: '100%',
              maxWidth: 500,
              background: '#0F172A',
              borderRadius: 16,
              border: '1px solid rgba(16, 185, 129, 0.3)',
              padding: 24,
              boxShadow: '0 20px 50px rgba(0,0,0,0.8)',
            }}
          >
            <h3 style={{ fontSize: 18, fontWeight: 800, color: '#F9FAFB', marginBottom: 16 }}>
              Add Wholesale Product to Marketplace
            </h3>
            <form onSubmit={handleCreateProduct} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <div>
                <label style={{ fontSize: 11, fontWeight: 700, color: '#9CA3AF', display: 'block', marginBottom: 4 }}>
                  Product Title *
                </label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g. Industrial Automation PLC Controller"
                  style={{
                    width: '100%',
                    background: 'rgba(31, 41, 55, 0.8)',
                    border: '1px solid rgba(255, 255, 255, 0.15)',
                    borderRadius: 8,
                    padding: 8,
                    color: '#FFF',
                  }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                <div>
                  <label style={{ fontSize: 11, fontWeight: 700, color: '#9CA3AF', display: 'block', marginBottom: 4 }}>
                    Category
                  </label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    style={{
                      width: '100%',
                      background: '#1F2937',
                      border: '1px solid rgba(255, 255, 255, 0.15)',
                      borderRadius: 8,
                      padding: 8,
                      color: '#FFF',
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
                  <label style={{ fontSize: 11, fontWeight: 700, color: '#9CA3AF', display: 'block', marginBottom: 4 }}>
                    Brand
                  </label>
                  <input
                    type="text"
                    value={newBrand}
                    onChange={(e) => setNewBrand(e.target.value)}
                    style={{
                      width: '100%',
                      background: 'rgba(31, 41, 55, 0.8)',
                      border: '1px solid rgba(255, 255, 255, 0.15)',
                      borderRadius: 8,
                      padding: 8,
                      color: '#FFF',
                    }}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10 }}>
                <div>
                  <label style={{ fontSize: 11, fontWeight: 700, color: '#9CA3AF', display: 'block', marginBottom: 4 }}>
                    Base MOQ
                  </label>
                  <input
                    type="number"
                    value={newMoq}
                    onChange={(e) => setNewMoq(e.target.value)}
                    style={{
                      width: '100%',
                      background: 'rgba(31, 41, 55, 0.8)',
                      border: '1px solid rgba(255, 255, 255, 0.15)',
                      borderRadius: 8,
                      padding: 8,
                      color: '#FFF',
                    }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: 11, fontWeight: 700, color: '#9CA3AF', display: 'block', marginBottom: 4 }}>
                    Unit
                  </label>
                  <input
                    type="text"
                    value={newUnit}
                    onChange={(e) => setNewUnit(e.target.value)}
                    style={{
                      width: '100%',
                      background: 'rgba(31, 41, 55, 0.8)',
                      border: '1px solid rgba(255, 255, 255, 0.15)',
                      borderRadius: 8,
                      padding: 8,
                      color: '#FFF',
                    }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: 11, fontWeight: 700, color: '#9CA3AF', display: 'block', marginBottom: 4 }}>
                    Price ($)
                  </label>
                  <input
                    type="number"
                    value={newPrice}
                    onChange={(e) => setNewPrice(e.target.value)}
                    style={{
                      width: '100%',
                      background: 'rgba(31, 41, 55, 0.8)',
                      border: '1px solid rgba(255, 255, 255, 0.15)',
                      borderRadius: 8,
                      padding: 8,
                      color: '#FFF',
                    }}
                  />
                </div>
              </div>

              <div>
                <label style={{ fontSize: 11, fontWeight: 700, color: '#9CA3AF', display: 'block', marginBottom: 4 }}>
                  Description
                </label>
                <textarea
                  rows={2}
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                  placeholder="Overview and specifications..."
                  style={{
                    width: '100%',
                    background: 'rgba(31, 41, 55, 0.8)',
                    border: '1px solid rgba(255, 255, 255, 0.15)',
                    borderRadius: 8,
                    padding: 8,
                    color: '#FFF',
                  }}
                />
              </div>

              <div style={{ display: 'flex', gap: 10, marginTop: 10 }}>
                <button
                  type="submit"
                  style={{
                    flex: 1,
                    background: 'linear-gradient(135deg, #059669 0%, #10B981 100%)',
                    color: '#FFF',
                    border: 'none',
                    borderRadius: 8,
                    padding: '10px 0',
                    fontSize: 13,
                    fontWeight: 800,
                    cursor: 'pointer',
                  }}
                >
                  Publish Product
                </button>
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  style={{
                    background: 'rgba(255, 255, 255, 0.1)',
                    color: '#D1D5DB',
                    border: 'none',
                    borderRadius: 8,
                    padding: '10px 16px',
                    fontSize: 13,
                    fontWeight: 700,
                    cursor: 'pointer',
                  }}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
