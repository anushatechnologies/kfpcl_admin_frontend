import React, { useState } from 'react';
import { useRFQStore } from '../../store/useRFQStore';
import { Quotation } from '../../types';
import {
  FileText,
  Search,
  CheckCircle2,
  XCircle,
  Clock,
  Truck,
  DollarSign,
  Calendar,
  Building2,
  Percent,
  Download,
  Eye,
  Check,
  X,
} from 'lucide-react';

export const AdminQuotations: React.FC = () => {
  const { quotations, rfqs, acceptQuotation } = useRFQStore();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'PENDING' | 'ACCEPTED' | 'REJECTED'>('ALL');
  const [viewQuote, setViewQuote] = useState<Quotation | null>(null);

  const filteredQuotes = quotations.filter((q) => {
    const matchesSearch =
      q.supplierName.toLowerCase().includes(search.toLowerCase()) ||
      q.notes.toLowerCase().includes(search.toLowerCase()) ||
      q.rfqId.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === 'ALL' || q.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const exportQuotesCSV = () => {
    const headers = ['ID', 'RFQ ID', 'Supplier Name', 'Unit Price', 'MOQ', 'Shipping Cost', 'GST Rate', 'Total Price', 'Lead Time', 'Status', 'Valid Until'];
    const rows = filteredQuotes.map((q) => [
      q.id,
      q.rfqId,
      `"${q.supplierName}"`,
      q.unitPrice,
      q.moq,
      q.shippingCost,
      `${q.gstPercent}%`,
      q.totalPrice,
      `${q.estimatedDeliveryDays} days`,
      q.status,
      q.validUntil,
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `kfpl_quotations_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <h1 style={{ fontSize: 24, fontWeight: 800, color: '#F9FAFB' }}>Supplier Quotations & Bids</h1>
          <p style={{ fontSize: 13, color: '#9CA3AF', marginTop: 2 }}>
            Review supplier pricing bids, mill certificates, freight charges, and award statuses
          </p>
        </div>

        <button
          onClick={exportQuotesCSV}
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
          <span>Export Quotations</span>
        </button>
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
            placeholder="Search quotations by supplier, RFQ ID, notes..."
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

        <div style={{ display: 'flex', gap: 6 }}>
          {(['ALL', 'PENDING', 'ACCEPTED', 'REJECTED'] as const).map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              style={{
                background: statusFilter === st ? '#10B981' : 'rgba(31, 41, 55, 0.6)',
                border: statusFilter === st ? '1px solid #34D399' : '1px solid rgba(255, 255, 255, 0.08)',
                color: statusFilter === st ? '#FFF' : '#9CA3AF',
                borderRadius: 8,
                padding: '5px 10px',
                fontSize: 11,
                fontWeight: 700,
                cursor: 'pointer',
              }}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
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
              {['Quotation #', 'Supplier', 'Target RFQ', 'Pricing Breakdown', 'Delivery Lead Time', 'Quote Status', 'Actions'].map((h) => (
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
            {filteredQuotes.length === 0 ? (
              <tr>
                <td colSpan={7} style={{ textAlign: 'center', padding: 40, color: '#9CA3AF' }}>
                  No quotations submitted.
                </td>
              </tr>
            ) : (
              filteredQuotes.map((q) => {
                const targetRfq = rfqs.find((r) => r.id === q.rfqId);

                return (
                  <tr
                    key={q.id}
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
                    {/* Quotation ID */}
                    <td style={{ padding: '12px 14px' }}>
                      <div style={{ fontSize: 13, fontWeight: 800, color: '#F9FAFB' }}>{q.id}</div>
                      <div style={{ fontSize: 10, color: '#6B7280', marginTop: 2 }}>Issued {q.createdAt}</div>
                    </td>

                    {/* Supplier */}
                    <td style={{ padding: '12px 14px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <img
                          src={q.supplierLogo}
                          alt={q.supplierName}
                          style={{ width: 32, height: 32, borderRadius: 6, objectFit: 'cover' }}
                        />
                        <div>
                          <div style={{ fontSize: 13, fontWeight: 700, color: '#E5E7EB' }}>{q.supplierName}</div>
                          <div style={{ fontSize: 10, color: '#9CA3AF' }}>ID: {q.supplierId}</div>
                        </div>
                      </div>
                    </td>

                    {/* Target RFQ */}
                    <td style={{ padding: '12px 14px' }}>
                      <div style={{ fontSize: 12, fontWeight: 600, color: '#60A5FA', maxWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {targetRfq?.productTitle || q.rfqId}
                      </div>
                      <div style={{ fontSize: 10, color: '#9CA3AF', marginTop: 2 }}>
                        Target Qty: {q.moq} units
                      </div>
                    </td>

                    {/* Pricing Breakdown */}
                    <td style={{ padding: '12px 14px' }}>
                      <div style={{ fontSize: 14, fontWeight: 800, color: '#10B981' }}>
                        ${q.totalPrice.toLocaleString()}
                      </div>
                      <div style={{ fontSize: 10, color: '#9CA3AF', marginTop: 2 }}>
                        ${q.unitPrice}/ea · Freight: ${q.shippingCost} · GST: {q.gstPercent}%
                      </div>
                    </td>

                    {/* Delivery Lead Time */}
                    <td style={{ padding: '12px 14px' }}>
                      <div style={{ fontSize: 12, color: '#D1D5DB', display: 'flex', alignItems: 'center', gap: 4 }}>
                        <Truck size={12} color="#60A5FA" />
                        <span>{q.estimatedDeliveryDays} Days</span>
                      </div>
                      <div style={{ fontSize: 10, color: '#9CA3AF', marginTop: 2 }}>Valid: {q.validUntil}</div>
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
                            q.status === 'ACCEPTED'
                              ? 'rgba(16, 185, 129, 0.15)'
                              : q.status === 'REJECTED'
                              ? 'rgba(239, 68, 68, 0.15)'
                              : 'rgba(245, 158, 11, 0.15)',
                          color:
                            q.status === 'ACCEPTED'
                              ? '#34D399'
                              : q.status === 'REJECTED'
                              ? '#F87171'
                              : '#FBBF24',
                          border: `1px solid ${
                            q.status === 'ACCEPTED'
                              ? 'rgba(16, 185, 129, 0.3)'
                              : q.status === 'REJECTED'
                              ? 'rgba(239, 68, 68, 0.3)'
                              : 'rgba(245, 158, 11, 0.3)'
                          }`,
                        }}
                      >
                        {q.status}
                      </span>
                    </td>

                    {/* Actions */}
                    <td style={{ padding: '12px 14px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                        <button
                          onClick={() => setViewQuote(q)}
                          title="View Full Quotation"
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
                        {q.status === 'PENDING' && (
                          <button
                            onClick={() => acceptQuotation(q.id)}
                            title="Accept & Create PO"
                            style={{
                              background: 'rgba(16, 185, 129, 0.15)',
                              border: '1px solid rgba(16, 185, 129, 0.3)',
                              borderRadius: 6,
                              color: '#34D399',
                              width: 28,
                              height: 28,
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              cursor: 'pointer',
                            }}
                          >
                            <Check size={13} />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Quote Inspection Modal */}
      {viewQuote && (
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
              maxWidth: 480,
              background: '#0F172A',
              borderRadius: 16,
              border: '1px solid rgba(255,255,255,0.15)',
              padding: 24,
              boxShadow: '0 20px 50px rgba(0,0,0,0.8)',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <h3 style={{ fontSize: 18, fontWeight: 800, color: '#F9FAFB' }}>Quotation {viewQuote.id}</h3>
              <span
                style={{
                  fontSize: 11,
                  fontWeight: 800,
                  padding: '3px 8px',
                  borderRadius: 6,
                  background: 'rgba(16, 185, 129, 0.2)',
                  color: '#34D399',
                }}
              >
                {viewQuote.status}
              </span>
            </div>

            <div style={{ background: 'rgba(31, 41, 55, 0.6)', padding: 12, borderRadius: 10, marginBottom: 14 }}>
              <div style={{ fontSize: 12, color: '#9CA3AF' }}>Issued by Supplier:</div>
              <div style={{ fontSize: 14, fontWeight: 700, color: '#FFF', marginTop: 2 }}>{viewQuote.supplierName}</div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 8, background: 'rgba(31, 41, 55, 0.4)', padding: 12, borderRadius: 10, marginBottom: 14 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12 }}>
                <span style={{ color: '#9CA3AF' }}>Unit Price ({viewQuote.moq} units):</span>
                <strong style={{ color: '#FFF' }}>${viewQuote.unitPrice}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12 }}>
                <span style={{ color: '#9CA3AF' }}>Freight Shipping:</span>
                <strong style={{ color: '#FFF' }}>${viewQuote.shippingCost}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12 }}>
                <span style={{ color: '#9CA3AF' }}>Applicable GST:</span>
                <strong style={{ color: '#FFF' }}>{viewQuote.gstPercent}%</strong>
              </div>
              <div style={{ borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: 6, display: 'flex', justifyContent: 'space-between', fontSize: 14, fontWeight: 800 }}>
                <span style={{ color: '#FFF' }}>Total Quotation:</span>
                <span style={{ color: '#10B981' }}>${viewQuote.totalPrice.toLocaleString()}</span>
              </div>
            </div>

            <div style={{ fontSize: 11, color: '#9CA3AF', marginBottom: 16 }}>
              Notes: <span style={{ color: '#D1D5DB' }}>"{viewQuote.notes}"</span>
            </div>

            <button
              onClick={() => setViewQuote(null)}
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
    </div>
  );
};
