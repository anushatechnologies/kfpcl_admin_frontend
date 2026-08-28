import React, { useState } from 'react';
import { useRFQStore } from '../../store/useRFQStore';
import { RFQItem, Quotation } from '../../types';
import {
  FileText,
  Search,
  Filter,
  Layers,
  Tag,
  Calendar,
  Building2,
  MapPin,
  CheckCircle2,
  Clock,
  Send,
  Eye,
  Trash2,
  Download,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';

export const AdminRFQs: React.FC = () => {
  const { rfqs, quotations, setSelectedRFQ, setCompareModalOpen } = useRFQStore();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'OPEN' | 'QUOTED' | 'ACCEPTED' | 'EXPIRED'>('ALL');
  const [expandedRfqId, setExpandedRfqId] = useState<string | null>(null);

  const filteredRfqs = rfqs.filter((r) => {
    const matchesSearch =
      r.productTitle.toLowerCase().includes(search.toLowerCase()) ||
      r.buyerCompany.toLowerCase().includes(search.toLowerCase()) ||
      r.buyerName.toLowerCase().includes(search.toLowerCase()) ||
      r.category.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === 'ALL' || r.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const toggleExpand = (id: string) => {
    setExpandedRfqId(expandedRfqId === id ? null : id);
  };

  const exportRfqsCSV = () => {
    const headers = ['ID', 'Buyer Company', 'Buyer Name', 'Product Title', 'Category', 'Quantity', 'Unit', 'Target Price', 'Deadline', 'Status', 'Quotes Count'];
    const rows = filteredRfqs.map((r) => [
      r.id,
      `"${r.buyerCompany}"`,
      `"${r.buyerName}"`,
      `"${r.productTitle.replace(/"/g, '""')}"`,
      r.category,
      r.quantity,
      r.unit,
      r.targetPrice,
      r.expectedDeliveryDate,
      r.status,
      r.quotesCount,
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `kfpl_rfqs_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <h1 style={{ fontSize: 24, fontWeight: 800, color: '#F9FAFB' }}>Global RFQ Central Desk</h1>
          <p style={{ fontSize: 13, color: '#9CA3AF', marginTop: 2 }}>
            Track customized commercial material requests, quotation submissions, and factory award statuses
          </p>
        </div>

        <button
          onClick={exportRfqsCSV}
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
          <span>Export RFQ Log</span>
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
          <Search size={16} color="#60A5FA" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search RFQs by material, buyer company, category..."
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
          {(['ALL', 'OPEN', 'QUOTED', 'ACCEPTED', 'EXPIRED'] as const).map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              style={{
                background: statusFilter === st ? '#2563EB' : 'rgba(31, 41, 55, 0.6)',
                border: statusFilter === st ? '1px solid #3B82F6' : '1px solid rgba(255, 255, 255, 0.08)',
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

      {/* RFQ Table */}
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
              {['RFQ # / Title', 'Buyer Company', 'Category', 'Target Qty & Price', 'Delivery Date', 'Quotations', 'Status', 'Actions'].map((h) => (
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
            {filteredRfqs.length === 0 ? (
              <tr>
                <td colSpan={8} style={{ textAlign: 'center', padding: 40, color: '#9CA3AF' }}>
                  No RFQs found.
                </td>
              </tr>
            ) : (
              filteredRfqs.map((rfq) => {
                const isExpanded = expandedRfqId === rfq.id;
                const rfqQuotes = quotations.filter((q) => q.rfqId === rfq.id);

                return (
                  <React.Fragment key={rfq.id}>
                    <tr
                      style={{
                        borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
                        background: isExpanded ? 'rgba(31, 41, 55, 0.3)' : 'transparent',
                        transition: 'background 0.15s ease',
                      }}
                      onMouseEnter={(e) => {
                        if (!isExpanded) (e.currentTarget as HTMLTableRowElement).style.background = 'rgba(31, 41, 55, 0.2)';
                      }}
                      onMouseLeave={(e) => {
                        if (!isExpanded) (e.currentTarget as HTMLTableRowElement).style.background = 'transparent';
                      }}
                    >
                      {/* RFQ Title */}
                      <td style={{ padding: '12px 14px' }}>
                        <div style={{ fontSize: 13, fontWeight: 700, color: '#F9FAFB' }}>{rfq.productTitle}</div>
                        <div style={{ fontSize: 10, color: '#6B7280', marginTop: 2 }}>
                          {rfq.id} · Posted {rfq.createdAt}
                        </div>
                      </td>

                      {/* Buyer */}
                      <td style={{ padding: '12px 14px' }}>
                        <div style={{ fontSize: 12, fontWeight: 600, color: '#E5E7EB' }}>{rfq.buyerCompany}</div>
                        <div style={{ fontSize: 11, color: '#9CA3AF', marginTop: 2 }}>{rfq.buyerName}</div>
                      </td>

                      {/* Category */}
                      <td style={{ padding: '12px 14px' }}>
                        <span style={{ fontSize: 11, color: '#60A5FA', fontWeight: 600 }}>{rfq.category}</span>
                      </td>

                      {/* Target Qty & Price */}
                      <td style={{ padding: '12px 14px' }}>
                        <div style={{ fontSize: 12, color: '#D1D5DB' }}>
                          Qty: <strong>{rfq.quantity} {rfq.unit}</strong>
                        </div>
                        <div style={{ fontSize: 12, color: '#10B981', fontWeight: 700, marginTop: 2 }}>
                          Target: ${rfq.targetPrice} / {rfq.unit}
                        </div>
                      </td>

                      {/* Delivery Date */}
                      <td style={{ padding: '12px 14px' }}>
                        <div style={{ fontSize: 12, color: '#F59E0B', display: 'flex', alignItems: 'center', gap: 4 }}>
                          <Calendar size={12} />
                          <span>{rfq.expectedDeliveryDate}</span>
                        </div>
                      </td>

                      {/* Quotes */}
                      <td style={{ padding: '12px 14px' }}>
                        <button
                          onClick={() => toggleExpand(rfq.id)}
                          style={{
                            background: rfqQuotes.length > 0 ? 'rgba(59, 130, 246, 0.15)' : 'rgba(31, 41, 55, 0.5)',
                            border: `1px solid ${rfqQuotes.length > 0 ? 'rgba(59, 130, 246, 0.3)' : 'rgba(255, 255, 255, 0.08)'}`,
                            color: rfqQuotes.length > 0 ? '#60A5FA' : '#9CA3AF',
                            borderRadius: 8,
                            padding: '4px 8px',
                            fontSize: 11,
                            fontWeight: 700,
                            display: 'flex',
                            alignItems: 'center',
                            gap: 4,
                            cursor: 'pointer',
                          }}
                        >
                          <span>{rfqQuotes.length} Quotes</span>
                          {isExpanded ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
                        </button>
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
                              rfq.status === 'QUOTED'
                                ? 'rgba(59, 130, 246, 0.15)'
                                : rfq.status === 'ACCEPTED'
                                ? 'rgba(16, 185, 129, 0.15)'
                                : 'rgba(245, 158, 11, 0.15)',
                            color:
                              rfq.status === 'QUOTED'
                                ? '#60A5FA'
                                : rfq.status === 'ACCEPTED'
                                ? '#34D399'
                                : '#FBBF24',
                            border: `1px solid ${
                              rfq.status === 'QUOTED'
                                ? 'rgba(59, 130, 246, 0.3)'
                                : rfq.status === 'ACCEPTED'
                                ? 'rgba(16, 185, 129, 0.3)'
                                : 'rgba(245, 158, 11, 0.3)'
                            }`,
                          }}
                        >
                          {rfq.status}
                        </span>
                      </td>

                      {/* Actions */}
                      <td style={{ padding: '12px 14px' }}>
                        <button
                          onClick={() => {
                            setSelectedRFQ(rfq);
                            setCompareModalOpen(true);
                          }}
                          style={{
                            background: 'rgba(31, 41, 55, 0.8)',
                            border: '1px solid rgba(255, 255, 255, 0.1)',
                            borderRadius: 6,
                            color: '#60A5FA',
                            padding: '4px 8px',
                            fontSize: 11,
                            fontWeight: 700,
                            display: 'flex',
                            alignItems: 'center',
                            gap: 4,
                            cursor: 'pointer',
                          }}
                        >
                          <Eye size={12} />
                          <span>Compare</span>
                        </button>
                      </td>
                    </tr>

                    {/* Expandable Quotes Row */}
                    {isExpanded && (
                      <tr>
                        <td
                          colSpan={8}
                          style={{
                            padding: '14px 20px',
                            background: 'rgba(15, 23, 42, 0.7)',
                            borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
                          }}
                        >
                          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                            <div style={{ fontSize: 12, fontWeight: 700, color: '#9CA3AF' }}>
                              Detailed Description: <span style={{ color: '#E5E7EB', fontWeight: 400 }}>{rfq.description}</span>
                            </div>

                            <div style={{ fontSize: 12, fontWeight: 700, color: '#F9FAFB', marginTop: 4 }}>
                              Submitted Supplier Quotations ({rfqQuotes.length}):
                            </div>

                            {rfqQuotes.length === 0 ? (
                              <div style={{ fontSize: 11, color: '#9CA3AF', fontStyle: 'italic' }}>
                                No supplier quotations submitted yet for this requirement.
                              </div>
                            ) : (
                              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 10 }}>
                                {rfqQuotes.map((q) => (
                                  <div
                                    key={q.id}
                                    style={{
                                      background: 'rgba(31, 41, 55, 0.7)',
                                      border: '1px solid rgba(255, 255, 255, 0.1)',
                                      borderRadius: 10,
                                      padding: 12,
                                      display: 'flex',
                                      flexDirection: 'column',
                                      gap: 6,
                                    }}
                                  >
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                      <strong style={{ fontSize: 13, color: '#FFF' }}>{q.supplierName}</strong>
                                      <span style={{ fontSize: 10, color: '#10B981', fontWeight: 700 }}>
                                        ${q.totalPrice.toLocaleString()}
                                      </span>
                                    </div>
                                    <div style={{ fontSize: 11, color: '#9CA3AF' }}>
                                      Unit Price: ${q.unitPrice} · Shipping: ${q.shippingCost} · Lead Time: {q.estimatedDeliveryDays} days
                                    </div>
                                    <div style={{ fontSize: 10, color: '#6B7280' }}>Notes: "{q.notes}"</div>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
