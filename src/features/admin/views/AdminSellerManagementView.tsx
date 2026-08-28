import React, { useState } from 'react';
import { useAdminStore } from '../../../store/useAdminStore';
import { AdminUser, SellerApplication } from '../../../constants/mockData';
import { PageTabs, TabItem } from '../../../components/common/PageTabs';
import {
  Store,
  CheckCircle2,
  XCircle,
  Eye,
  Building2,
  FileText,
  AlertTriangle,
  Award,
  Download,
  Search,
} from 'lucide-react';

export const AdminSellerManagementView: React.FC = () => {
  const {
    activeSubSection,
    setActiveSubSection,
    sellerApplications = [],
    approveSellerApplication,
    rejectSellerApplication,
    theme = 'dark',
  } = useAdminStore();

  const [search, setSearch] = useState('');
  const [selectedApp, setSelectedApp] = useState<SellerApplication | null>(null);
  const [selectedSeller, setSelectedSeller] = useState<AdminUser | null>(null);
  const [selectedDocument, setSelectedDocument] = useState<{ label: string; image: string } | null>(null);
  const [selectedStore, setSelectedStore] = useState<{ name: string; listings: number; badge: string; rate: string } | null>(null);
  const [sellerApprovalOverrides, setSellerApprovalOverrides] = useState<Record<string, 'APPROVED' | 'REJECTED'>>({});
  const [reviewNote, setReviewNote] = useState('');

  const isDark = theme === 'dark';
  const getSellerApproval = (seller: AdminUser): 'APPROVED' | 'REJECTED' => sellerApprovalOverrides[seller.id] || (seller.kycStatus === 'REJECTED' ? 'REJECTED' : 'APPROVED');
  const updateSellerApproval = (status: 'APPROVED' | 'REJECTED') => {
    if (!selectedSeller) return;
    setSellerApprovalOverrides((current) => ({ ...current, [selectedSeller.id]: status }));
    setSelectedSeller((current) => current ? { ...current, kycStatus: status === 'APPROVED' ? 'VERIFIED' : 'REJECTED' } : current);
    setSelectedSeller(null);
  };

  const currentTab =
    activeSubSection === 'SELLERS_APPLICATIONS'
      ? 'SELLERS_APPLICATIONS'
      : activeSubSection === 'SELLERS_STORES'
      ? 'SELLERS_STORES'
      : 'SELLERS_LIST';

  const pendingCount = (sellerApplications || []).filter((a) => a.status === 'PENDING').length;
  const sellers: AdminUser[] = [];

  const handleApprove = (id: string) => {
    approveSellerApplication(id, reviewNote || 'Approved after audit inspection');
    setSelectedApp(null);
    setReviewNote('');
  };

  const handleReject = (id: string) => {
    rejectSellerApplication(id, reviewNote || 'Documentation incomplete');
    setSelectedApp(null);
    setReviewNote('');
  };

  const sellerTabs: TabItem[] = [
    { id: 'SELLERS_LIST', label: 'Seller List' },
    { id: 'SELLERS_STORES', label: 'Store Management' },
  ];

  return (
    <div className="seller-management-scope" style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
      <style>{`table[style*="min-width"] { display: none !important; } div[style*="overflow: 'hidden'"]:has(> div > table[style*="min-width"]) { display: none !important; } div[style*="font-size: 13px"][style*="#9CA3AF"] { display: none !important; } div[style*="margin-bottom: 20px"]:has(> div > span[style*="#34D399"]) { display: none !important; }
        .seller-directory-row { transition: background .18s ease, box-shadow .18s ease, transform .18s ease; }
        .seller-directory-row:hover { background: ${isDark ? 'rgba(59,130,246,.12)' : '#EFF6FF'} !important; box-shadow: inset 3px 0 0 ${isDark ? '#60A5FA' : '#3B82F6'}; }
        .seller-management-scope tbody tr { transition: background .18s ease, box-shadow .18s ease; }
        .seller-management-scope tbody tr:hover { background: ${isDark ? 'rgba(59,130,246,.12)' : '#EFF6FF'} !important; box-shadow: inset 3px 0 0 ${isDark ? '#60A5FA' : '#3B82F6'}; }
        .seller-store-card { transition: transform .18s ease, box-shadow .18s ease, border-color .18s ease; }
        .seller-store-card:hover { transform: translateY(-3px); border-color: ${isDark ? '#60A5FA' : '#93C5FD'} !important; box-shadow: ${isDark ? '0 14px 32px rgba(2,6,23,.32)' : '0 14px 30px rgba(37,99,235,.14)'}; }
        .seller-management-scope div[style*="cursor: pointer"] { transition: transform .18s ease, box-shadow .18s ease, border-color .18s ease; }
        .seller-management-scope div[style*="cursor: pointer"]:hover { transform: translateY(-3px); border-color: ${isDark ? '#60A5FA' : '#93C5FD'} !important; box-shadow: ${isDark ? '0 14px 32px rgba(2,6,23,.32)' : '0 14px 30px rgba(37,99,235,.14)'}; }
      `}</style>
      {/* Sub Navigation via PageTabs */}
      <PageTabs
        tabs={sellerTabs}
        activeTabId={currentTab}
        onChangeTab={(id) => setActiveSubSection(id as any)}
        theme={theme}
      />

      {/* ─── TAB: SELLER APPLICATIONS ───────────────────────────────────── */}
      {currentTab === 'SELLERS_LIST' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {currentTab === 'SELLERS_LIST' && (
          <div style={{ background: isDark ? 'rgba(17,24,39,.75)' : '#FFF', border: `1px solid ${isDark ? 'rgba(255,255,255,.08)' : 'rgba(0,0,0,.08)'}`, borderRadius: 14, overflow: 'hidden' }}>
            <div style={{ display: 'none', padding: '14px 16px', color: '#9CA3AF', fontSize: 13 }}>Mock seller directory · {sellers.length} registered suppliers</div>
            <div style={{ display: 'none', overflowX: 'auto' }}><table style={{ width: '100%', minWidth: 860, borderCollapse: 'collapse' }}>
              <thead><tr style={{ background: isDark ? 'rgba(15,23,42,.6)' : '#F3F4F6' }}>{['Supplier Firm', 'Contact Representative', 'GST Verification', 'Rating', 'Fulfilled GMV', 'Orders', 'Account Status'].map((header) => <th key={header} style={{ textAlign: 'left', padding: '12px 14px', color: '#9CA3AF', fontSize: 11, textTransform: 'uppercase' }}>{header}</th>)}</tr></thead>
              <tbody>{sellers.map((seller) => <tr key={`table-${seller.id}`} style={{ borderTop: `1px solid ${isDark ? 'rgba(255,255,255,.06)' : '#E5E7EB'}` }}>
                <td style={{ padding: '13px 14px' }}><div style={{ display: 'flex', alignItems: 'center', gap: 10 }}><img src={seller.avatar} alt={seller.name} style={{ width: 38, height: 38, borderRadius: 19, objectFit: 'cover' }} /><div><div style={{ color: isDark ? '#FFF' : '#111827', fontWeight: 800, fontSize: 13 }}>{seller.company}</div><div style={{ color: '#9CA3AF', fontSize: 11 }}>{seller.location}</div></div></div></td>
                <td style={{ padding: '13px 14px' }}><div style={{ color: isDark ? '#E5E7EB' : '#374151', fontWeight: 700, fontSize: 12 }}>{seller.name}</div><div style={{ color: '#9CA3AF', fontSize: 11 }}>{seller.phone}</div></td>
                <td style={{ padding: '13px 14px', color: seller.kycStatus === 'VERIFIED' ? '#10B981' : '#F59E0B', fontSize: 11, fontWeight: 800 }}>{seller.kycStatus === 'VERIFIED' ? '✓ Verified GSTIN' : 'Pending verification'}</td>
                <td style={{ padding: '13px 14px', color: '#F59E0B', fontSize: 12, fontWeight: 800 }}>★ {seller.rating || 'New'}</td><td style={{ padding: '13px 14px', color: '#10B981', fontSize: 13, fontWeight: 800 }}>₹{(seller.totalRevenue * 82).toLocaleString('en-IN')}</td><td style={{ padding: '13px 14px', color: isDark ? '#FFF' : '#111827', fontSize: 12, fontWeight: 700 }}>{seller.totalOrders}</td>
                <td style={{ padding: '13px 14px' }}><span style={{ borderRadius: 14, padding: '4px 9px', fontSize: 10, fontWeight: 800, background: seller.kycStatus === 'VERIFIED' ? 'rgba(16,185,129,.15)' : seller.kycStatus === 'REJECTED' ? 'rgba(239,68,68,.15)' : 'rgba(245,158,11,.15)', color: seller.kycStatus === 'VERIFIED' ? '#34D399' : seller.kycStatus === 'REJECTED' ? '#F87171' : '#FBBF24' }}>{seller.kycStatus === 'VERIFIED' ? 'Approved' : seller.kycStatus === 'REJECTED' ? 'Rejected' : 'Pending'}</span></td>
              </tr>)}</tbody>
            </table></div>
          </div>
          )}
          <div style={{ fontSize: 13, color: '#9CA3AF' }}>
            Review pending manufacturer registrations and audit factory certifications.
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 14 }}>
            {sellerApplications.map((app) => (
              <div
                key={app.id}
                style={{
                  background: isDark ? 'rgba(17, 24, 39, 0.75)' : '#FFFFFF',
                  border: app.status === 'PENDING'
                    ? '1px solid rgba(245, 158, 11, 0.4)'
                    : `1px solid ${isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.08)'}`,
                  borderRadius: 14,
                  padding: 16,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 10,
                  boxShadow: isDark ? 'none' : '0 4px 12px rgba(0,0,0,0.03)',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: 10, fontWeight: 800, padding: '2px 8px', borderRadius: 6, background: app.status === 'PENDING' ? 'rgba(245, 158, 11, 0.2)' : 'rgba(16, 185, 129, 0.2)', color: app.status === 'PENDING' ? '#FBBF24' : '#34D399' }}>
                    {app.status}
                  </span>
                  <span style={{ fontSize: 11, color: '#9CA3AF' }}>Submitted {app.submittedAt}</span>
                </div>

                <div>
                  <h4 style={{ fontSize: 15, fontWeight: 800, color: isDark ? '#FFF' : '#111827' }}>{app.companyName}</h4>
                  <div style={{ fontSize: 12, color: '#9CA3AF' }}>Contact: {app.contactPerson} ({app.phone})</div>
                  <div style={{ fontSize: 11, color: '#2563EB', marginTop: 2, fontWeight: 600 }}>GSTIN: {app.gstNumber} · Category: {app.category}</div>
                </div>

                <div style={{ background: isDark ? 'rgba(31, 41, 55, 0.5)' : '#F3F4F6', padding: 8, borderRadius: 8, fontSize: 11, color: isDark ? '#D1D5DB' : '#4B5563' }}>
                  <div>Experience: <strong>{app.yearsInBusiness} Years</strong> · Turnover: <strong>{app.expectedAnnualTurnover}</strong></div>
                  <div style={{ marginTop: 4 }}>Documents Attached: <strong>{app.documents.length} verified files</strong></div>
                </div>

                {app.status === 'PENDING' && (
                  <div style={{ display: 'flex', gap: 8, marginTop: 4 }}>
                    <button
                      onClick={() => setSelectedApp(app)}
                      style={{
                        flex: 1,
                        background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
                        color: '#FFF',
                        border: 'none',
                        borderRadius: 8,
                        padding: '8px 0',
                        fontSize: 12,
                        fontWeight: 700,
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: 4,
                      }}
                    >
                      <CheckCircle2 size={13} />
                      <span>Approve / Review</span>
                    </button>

                    <button
                      onClick={() => handleReject(app.id)}
                      style={{
                        background: 'rgba(239, 68, 68, 0.12)',
                        border: '1px solid rgba(239, 68, 68, 0.25)',
                        color: '#EF4444',
                        borderRadius: 8,
                        padding: '8px 12px',
                        fontSize: 12,
                        fontWeight: 700,
                        cursor: 'pointer',
                      }}
                    >
                      Reject
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ─── TAB: SELLER LIST ────────────────────────────────────────────── */}
      {currentTab === 'SELLERS_LIST' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div style={{ background: isDark ? 'rgba(17,24,39,.75)' : '#FFF', border: `1px solid ${isDark ? 'rgba(255,255,255,.08)' : 'rgba(0,0,0,.08)'}`, borderRadius: 14, overflow: 'hidden' }}>
            <div style={{ padding: 14, color: '#9CA3AF', fontSize: 13 }}>Seller directory · {sellers.length} registered sellers</div>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}><thead><tr style={{ background: isDark ? 'rgba(15,23,42,.6)' : '#F3F4F6' }}>{['Seller', 'Contact', 'GST / KYC', 'Rating', 'GMV', 'Orders', 'Status', 'Actions'].map((h) => <th key={h} style={{ textAlign: 'left', padding: '12px 14px', color: '#9CA3AF', fontSize: 11 }}>{h}</th>)}</tr></thead><tbody>{sellers.map((seller) => <tr key={`view-${seller.id}`} style={{ borderTop: `1px solid ${isDark ? 'rgba(255,255,255,.06)' : '#E5E7EB'}` }}><td style={{ padding: '12px 14px' }}><div style={{ display: 'flex', alignItems: 'center', gap: 9 }}><img src={seller.avatar} alt={seller.name} style={{ width: 38, height: 38, borderRadius: 19, objectFit: 'cover' }} /><div style={{ color: isDark ? '#FFF' : '#111827', fontWeight: 800 }}>{seller.name}<div style={{ color: '#9CA3AF', fontSize: 11, fontWeight: 500 }}>{seller.company}</div></div></div></td><td style={{ padding: '12px 14px', color: isDark ? '#E5E7EB' : '#374151' }}>{seller.phone}<div style={{ color: '#9CA3AF', fontSize: 11 }}>{seller.location}</div></td><td style={{ padding: '12px 14px', color: seller.kycStatus === 'VERIFIED' ? '#10B981' : seller.kycStatus === 'REJECTED' ? '#EF4444' : '#F59E0B', fontWeight: 800 }}>{seller.kycStatus === 'VERIFIED' ? 'Verified' : seller.kycStatus === 'REJECTED' ? 'Rejected' : 'Pending'}</td><td style={{ padding: '12px 14px', color: '#F59E0B', fontWeight: 800 }}>★ {seller.rating || 'New'}</td><td style={{ padding: '12px 14px', color: '#10B981', fontWeight: 800 }}>₹{(seller.totalRevenue * 82).toLocaleString('en-IN')}</td><td style={{ padding: '12px 14px', color: isDark ? '#FFF' : '#111827' }}>{seller.totalOrders}</td><td style={{ padding: '12px 14px', color: seller.kycStatus === 'VERIFIED' ? '#34D399' : seller.kycStatus === 'REJECTED' ? '#EF4444' : '#FBBF24', fontWeight: 800 }}>{seller.kycStatus === 'VERIFIED' ? 'Approved' : seller.kycStatus === 'REJECTED' ? 'Rejected' : 'Pending'}</td><td style={{ padding: '12px 14px' }}><button onClick={() => setSelectedSeller(seller)} style={{ display: 'inline-flex', alignItems: 'center', gap: 5, border: '1px solid #60A5FA', borderRadius: 8, padding: '6px 10px', background: 'rgba(96,165,250,.12)', color: '#60A5FA', fontWeight: 700, cursor: 'pointer' }}><Eye size={13} /> View</button></td></tr>)}</tbody></table>
          </div>
          <div style={{ background: isDark ? 'rgba(17,24,39,.75)' : '#FFF', border: `1px solid ${isDark ? 'rgba(255,255,255,.08)' : 'rgba(0,0,0,.08)'}`, borderRadius: 14, overflow: 'hidden' }}>
            <div style={{ display: 'none', padding: '14px 16px', color: '#9CA3AF', fontSize: 13 }}>Mock seller directory · {sellers.length} registered suppliers</div>
            <div style={{ overflowX: 'auto' }}><table style={{ width: '100%', minWidth: 860, borderCollapse: 'collapse' }}><thead><tr style={{ background: isDark ? 'rgba(15,23,42,.6)' : '#F3F4F6' }}>{['Supplier Firm', 'Contact Representative', 'GST Verification', 'Rating', 'Fulfilled GMV', 'Orders', 'Account Status'].map((header) => <th key={header} style={{ textAlign: 'left', padding: '12px 14px', color: '#9CA3AF', fontSize: 11 }}>{header}</th>)}</tr></thead><tbody>{sellers.map((seller) => <tr key={`directory-${seller.id}`} style={{ borderTop: `1px solid ${isDark ? 'rgba(255,255,255,.06)' : '#E5E7EB'}` }}><td style={{ padding: '13px 14px', color: isDark ? '#FFF' : '#111827', fontWeight: 800 }}>{seller.company}<div style={{ color: '#9CA3AF', fontSize: 11, fontWeight: 500 }}>{seller.location}</div></td><td style={{ padding: '13px 14px', color: isDark ? '#E5E7EB' : '#374151' }}>{seller.name}<div style={{ color: '#9CA3AF', fontSize: 11 }}>{seller.phone}</div></td><td style={{ padding: '13px 14px', color: seller.kycStatus === 'VERIFIED' ? '#10B981' : '#F59E0B', fontWeight: 800 }}>{seller.kycStatus === 'VERIFIED' ? 'Verified GSTIN' : 'Pending'}</td><td style={{ padding: '13px 14px', color: '#F59E0B', fontWeight: 800 }}>★ {seller.rating || 'New'}</td><td style={{ padding: '13px 14px', color: '#10B981', fontWeight: 800 }}>₹{(seller.totalRevenue * 82).toLocaleString('en-IN')}</td><td style={{ padding: '13px 14px', color: isDark ? '#FFF' : '#111827' }}>{seller.totalOrders}</td><td style={{ padding: '13px 14px' }}><span style={{ color: seller.kycStatus === 'VERIFIED' ? '#34D399' : '#FBBF24', fontWeight: 800 }}>{seller.kycStatus === 'VERIFIED' ? 'Approved' : 'Pending'}</span></td></tr>)}</tbody></table></div>
          </div>
          <div style={{ display: 'none', fontSize: 13, color: '#9CA3AF' }}>Mock seller directory · {sellers.length} registered suppliers</div>
          <div style={{ display: 'none', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 14 }}>
            {sellers.map((seller) => (
              <div key={seller.id} style={{ background: isDark ? 'rgba(17, 24, 39, .75)' : '#FFF', border: `1px solid ${isDark ? 'rgba(255,255,255,.08)' : 'rgba(0,0,0,.08)'}`, borderRadius: 14, padding: 16 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <img src={seller.avatar} alt={seller.name} style={{ width: 42, height: 42, borderRadius: 21, objectFit: 'cover' }} />
                  <div><div style={{ color: isDark ? '#FFF' : '#111827', fontWeight: 800, fontSize: 14 }}>{seller.company}</div><div style={{ color: '#9CA3AF', fontSize: 11 }}>{seller.name} · {seller.location}</div></div>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginTop: 14 }}>
                  <div style={{ background: isDark ? 'rgba(31,41,55,.55)' : '#F3F4F6', borderRadius: 8, padding: 9 }}><div style={{ color: '#9CA3AF', fontSize: 10 }}>Fulfilled GMV</div><strong style={{ color: '#10B981', fontSize: 13 }}>₹{(seller.totalRevenue * 82).toLocaleString('en-IN')}</strong></div>
                  <div style={{ background: isDark ? 'rgba(31,41,55,.55)' : '#F3F4F6', borderRadius: 8, padding: 9 }}><div style={{ color: '#9CA3AF', fontSize: 10 }}>Rating</div><strong style={{ color: '#F59E0B', fontSize: 13 }}>★ {seller.rating || 'New'}</strong></div>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 14 }}><span style={{ color: seller.kycStatus === 'VERIFIED' ? '#34D399' : '#FBBF24', fontSize: 11, fontWeight: 800 }}>{seller.kycStatus}</span><span style={{ color: '#9CA3AF', fontSize: 11 }}>{seller.totalOrders} orders</span></div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ─── TAB: STORE MANAGEMENT ───────────────────────────────────────── */}
      {currentTab === 'SELLERS_STORES' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 14 }}>
          <div style={{ gridColumn: '1 / -1', padding: 24, textAlign: 'center', color: '#94A3B8', border: `1px dashed ${isDark ? '#334155' : '#CBD5E1'}`, borderRadius: 14 }}>
            No store data available.
          </div>
        </div>
      )}

      {selectedSeller && (
        <div onClick={() => setSelectedSeller(null)} style={{ position: 'fixed', inset: 0, zIndex: 9998, background: 'rgba(15,23,42,.58)', backdropFilter: 'blur(5px)', display: 'flex', justifyContent: 'flex-end' }}>
          <div onClick={(e) => e.stopPropagation()} style={{ width: 'min(480px, 100%)', height: '100%', overflowY: 'auto', background: isDark ? '#0F172A' : '#FFF', padding: 26, boxShadow: '-12px 0 35px rgba(0,0,0,.2)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 22 }}><div><div style={{ color: '#60A5FA', fontSize: 11, fontWeight: 800, textTransform: 'uppercase' }}>Seller details</div><h2 style={{ margin: '6px 0 4px', color: isDark ? '#FFF' : '#111827' }}>{selectedSeller.name}</h2><div style={{ color: '#9CA3AF', fontSize: 12 }}>{selectedSeller.company}</div></div><button onClick={() => setSelectedSeller(null)} style={{ border: 0, borderRadius: 8, padding: 9, cursor: 'pointer' }}>×</button></div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: 14, borderRadius: 12, background: isDark ? 'rgba(30,41,59,.65)' : '#F8FAFC', marginBottom: 20 }}><img src={selectedSeller.avatar} alt={selectedSeller.name} style={{ width: 64, height: 64, borderRadius: 32, objectFit: 'cover' }} /><div><div style={{ color: isDark ? '#FFF' : '#111827', fontWeight: 800 }}>{selectedSeller.company}</div><div style={{ color: '#9CA3AF', fontSize: 12 }}>{selectedSeller.location}</div><div style={{ color: selectedSeller.kycStatus === 'VERIFIED' ? '#34D399' : '#FBBF24', fontSize: 11, fontWeight: 800, marginTop: 6 }}>{selectedSeller.kycStatus === 'VERIFIED' ? 'APPROVED / VERIFIED' : 'PENDING VERIFICATION'}</div></div></div>
            <h3 style={{ color: isDark ? '#FFF' : '#111827', fontSize: 15, marginBottom: 10 }}>Uploaded documents</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 10, marginBottom: 12 }}>{[
              ['PAN Card', 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=240&q=80'],
              ['Address Proof', 'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=240&q=80'],
              ['GSTIN Certificate', 'https://images.unsplash.com/photo-1554224154-26032ffc0d07?w=240&q=80'],
              ['Bank Proof', 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=240&q=80'],
            ].map(([label, image]) => <button key={label} onClick={() => setSelectedDocument({ label, image })} style={{ padding: 0, textAlign: 'left', borderRadius: 9, overflow: 'hidden', border: `1px solid ${isDark ? 'rgba(255,255,255,.08)' : '#E5E7EB'}`, background: isDark ? 'rgba(31,41,55,.65)' : '#F8FAFC', cursor: 'pointer' }}><img src={image} alt={label} style={{ width: '100%', height: 72, objectFit: 'cover', display: 'block' }} /><div style={{ padding: 8, color: isDark ? '#E5E7EB' : '#374151', fontSize: 11, fontWeight: 700 }}>{label}</div></button>)}</div>
            <div style={{ display: 'grid', gap: 0, borderTop: `1px solid ${isDark ? 'rgba(255,255,255,.08)' : '#E5E7EB'}` }}>{[['Email', selectedSeller.email], ['Phone', selectedSeller.phone], ['Location', selectedSeller.location], ['KYC Status', selectedSeller.kycStatus], ['Fulfilled GMV', `₹${(selectedSeller.totalRevenue * 82).toLocaleString('en-IN')}`], ['Orders', String(selectedSeller.totalOrders)], ['Rating', selectedSeller.rating ? `★ ${selectedSeller.rating}` : 'New'], ['Joined', selectedSeller.joinDate], ['Last active', selectedSeller.lastActive]].map(([label, value]) => <div key={label} style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 0', borderBottom: `1px solid ${isDark ? 'rgba(255,255,255,.08)' : '#E5E7EB'}` }}><span style={{ color: '#9CA3AF', fontSize: 12 }}>{label}</span><strong style={{ color: isDark ? '#E5E7EB' : '#374151', fontSize: 12 }}>{value}</strong></div>)}</div>
            <div style={{ marginTop: 20 }}>
              <div style={{ display: 'flex', gap: 10 }}>
                <button onClick={() => updateSellerApproval('APPROVED')} style={{ flex: 1, border: 0, borderRadius: 9, padding: '11px 8px', background: '#10B981', color: '#FFF', fontWeight: 800, cursor: 'pointer' }}>Approve seller</button>
                <button onClick={() => updateSellerApproval('REJECTED')} style={{ flex: 1, border: '1px solid #EF4444', borderRadius: 9, padding: '11px 8px', background: 'rgba(239,68,68,.12)', color: '#F87171', fontWeight: 800, cursor: 'pointer' }}>Reject seller</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {selectedStore && (
        <div onClick={() => setSelectedStore(null)} style={{ position: 'fixed', inset: 0, zIndex: 9997, background: 'rgba(15,23,42,.58)', backdropFilter: 'blur(5px)', display: 'flex', justifyContent: 'flex-end' }}>
          <div onClick={(e) => e.stopPropagation()} style={{ width: 'min(460px, 100%)', height: '100%', overflowY: 'auto', background: isDark ? '#0F172A' : '#FFF', padding: 26, boxShadow: '-12px 0 35px rgba(0,0,0,.2)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24 }}><div><div style={{ color: '#60A5FA', fontSize: 11, fontWeight: 800, textTransform: 'uppercase' }}>Store details</div><h2 style={{ margin: '6px 0 4px', color: isDark ? '#FFF' : '#111827' }}>{selectedStore.name}</h2><div style={{ color: '#10B981', fontSize: 11, fontWeight: 800 }}>{selectedStore.badge}</div></div><button onClick={() => setSelectedStore(null)} style={{ border: 0, borderRadius: 8, padding: 9, cursor: 'pointer' }}>×</button></div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 20 }}>{[['Active Products', String(selectedStore.listings)], ['Commission Tier', selectedStore.rate], ['Store Status', 'Active'], ['Verification', 'Verified seller']].map(([label, value]) => <div key={label} style={{ padding: 14, borderRadius: 10, background: isDark ? 'rgba(31,41,55,.65)' : '#F8FAFC', border: `1px solid ${isDark ? 'rgba(255,255,255,.08)' : '#E5E7EB'}` }}><div style={{ color: '#9CA3AF', fontSize: 11 }}>{label}</div><strong style={{ display: 'block', marginTop: 5, color: label === 'Store Status' || label === 'Verification' ? '#34D399' : isDark ? '#FFF' : '#111827', fontSize: 14 }}>{value}</strong></div>)}</div>
            <div style={{ borderTop: `1px solid ${isDark ? 'rgba(255,255,255,.08)' : '#E5E7EB'}` }}>{[['Store owner', selectedStore.name.replace(' Store', '')], ['Store type', selectedStore.badge], ['Commission', selectedStore.rate], ['Catalog coverage', `${selectedStore.listings} active products`], ['Last audit', '2026-08-22']].map(([label, value]) => <div key={label} style={{ display: 'flex', justifyContent: 'space-between', padding: '13px 0', borderBottom: `1px solid ${isDark ? 'rgba(255,255,255,.08)' : '#E5E7EB'}` }}><span style={{ color: '#9CA3AF', fontSize: 12 }}>{label}</span><strong style={{ color: isDark ? '#E5E7EB' : '#374151', fontSize: 12 }}>{value}</strong></div>)}</div>
            <button onClick={() => setSelectedStore(null)} style={{ width: '100%', marginTop: 20, border: '1px solid #94A3B8', borderRadius: 9, padding: '11px 8px', background: 'transparent', color: isDark ? '#CBD5E1' : '#475569', fontWeight: 800, cursor: 'pointer' }}>Close</button>
          </div>
        </div>
      )}

      {selectedDocument && (
        <div onClick={() => setSelectedDocument(null)} style={{ position: 'fixed', inset: 0, zIndex: 10002, background: 'rgba(0,0,0,.82)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
          <div onClick={(e) => e.stopPropagation()} style={{ width: 'min(760px, 100%)', background: isDark ? '#0F172A' : '#FFF', borderRadius: 14, padding: 16 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}><strong style={{ color: isDark ? '#FFF' : '#111827' }}>{selectedDocument.label}</strong><button onClick={() => setSelectedDocument(null)} style={{ border: 0, borderRadius: 8, padding: '7px 11px', cursor: 'pointer' }}>Close</button></div>
            <img src={selectedDocument.image} alt={selectedDocument.label} style={{ width: '100%', maxHeight: '70vh', objectFit: 'contain', borderRadius: 9, background: '#111827' }} />
          </div>
        </div>
      )}

      {/* Application Approval Modal */}
      {selectedApp && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 9999, background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
          <div style={{ width: '100%', maxWidth: 480, background: isDark ? '#0F172A' : '#FFFFFF', borderRadius: 16, border: `1px solid ${isDark ? 'rgba(16, 185, 129, 0.3)' : 'rgba(16, 185, 129, 0.15)'}`, padding: 24 }}>
            <h3 style={{ fontSize: 18, fontWeight: 800, color: isDark ? '#FFF' : '#111827', marginBottom: 12 }}>Approve Seller Application</h3>
            <div style={{ fontSize: 13, color: isDark ? '#FFF' : '#111827', fontWeight: 700 }}>{selectedApp.companyName}</div>
            <div style={{ fontSize: 11, color: '#9CA3AF', marginBottom: 14 }}>GST: {selectedApp.gstNumber}</div>

            <div style={{ marginBottom: 14 }}>
              <label style={{ fontSize: 11, fontWeight: 700, color: '#9CA3AF', display: 'block', marginBottom: 4 }}>Audit Review Notes</label>
              <textarea rows={3} value={reviewNote} onChange={(e) => setReviewNote(e.target.value)} placeholder="e.g. Verified factory registration and bank statements." style={{ width: '100%', background: isDark ? 'rgba(31, 41, 55, 0.8)' : '#F3F4F6', border: `1px solid ${isDark ? 'rgba(255, 255, 255, 0.15)' : 'rgba(0, 0, 0, 0.08)'}`, borderRadius: 8, padding: 8, color: isDark ? '#FFF' : '#111827', fontSize: 12 }} />
            </div>

            <div style={{ display: 'flex', gap: 10 }}>
              <button onClick={() => handleApprove(selectedApp.id)} style={{ flex: 1, background: '#10B981', color: '#FFF', border: 'none', borderRadius: 8, padding: '10px 0', fontSize: 13, fontWeight: 800, cursor: 'pointer' }}>Grant Verified Store Status</button>
              <button onClick={() => setSelectedApp(null)} style={{ background: 'rgba(255, 255, 255, 0.1)', color: '#D1D5DB', border: 'none', borderRadius: 8, padding: '10px 16px', fontSize: 13, fontWeight: 700, cursor: 'pointer' }}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
