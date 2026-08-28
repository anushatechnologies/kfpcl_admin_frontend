import React, { useState } from 'react';
import { useAdminStore } from '../../../store/useAdminStore';
import { AdminUser } from '../../../constants/mockData';
import { PageTabs, TabItem } from '../../../components/common/PageTabs';
import {
  ShoppingBag,
  Search,
  Building2,
  MapPin,
  Mail,
  Phone,
  FileText,
  CreditCard,
  Activity,
  Eye,
  ShieldCheck,
  CheckCircle2,
  Clock,
} from 'lucide-react';

export const AdminBuyerManagementView: React.FC = () => {
  const { activeSubSection, setActiveSubSection, theme = 'dark' } = useAdminStore();
  const [selectedBuyer, setSelectedBuyer] = useState<AdminUser | null>(null);
  const [search, setSearch] = useState('');

  const isDark = theme === 'dark';

  const currentTab =
    activeSubSection === 'BUYERS_DETAILS'
      ? 'BUYERS_DETAILS'
      : activeSubSection === 'BUYERS_ACTIVITY'
      ? 'BUYERS_ACTIVITY'
      : 'BUYERS_LIST';

  const buyers: AdminUser[] = [];
  const filteredBuyers = buyers.filter((buyer) => [buyer.name, buyer.company, buyer.email, buyer.location].some((value) => value.toLowerCase().includes(search.toLowerCase())));

  const buyerTabs: TabItem[] = [
    { id: 'BUYERS_LIST', label: 'Buyer List', badge: buyers.length },
    { id: 'BUYERS_DETAILS', label: 'Buyer Details & Credit' },
    { id: 'BUYERS_ACTIVITY', label: 'Buyer Activity Logs' },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
      {/* Subnav via PageTabs */}
      <PageTabs
        tabs={buyerTabs}
        activeTabId={currentTab}
        onChangeTab={(id) => setActiveSubSection(id as any)}
        theme={theme}
      />

      {/* ─── TAB 1: BUYER LIST ──────────────────────────────────────────── */}
      {currentTab === 'BUYERS_LIST' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div style={{ background: isDark ? 'rgba(17, 24, 39, .75)' : '#FFF', border: `1px solid ${isDark ? 'rgba(255,255,255,.08)' : 'rgba(0,0,0,.08)'}`, borderRadius: 12, padding: 10, display: 'flex', alignItems: 'center', gap: 8 }}>
            <Search size={16} color="#60A5FA" />
            <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search buyers by name, company, email, city..." style={{ flex: 1, border: 0, outline: 0, background: 'transparent', color: isDark ? '#FFF' : '#111827', fontSize: 13 }} />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 14 }}>
          {filteredBuyers.map((b) => (
            <div
              key={b.id}
              onClick={() => {
                setSelectedBuyer(b);
                setActiveSubSection('BUYERS_DETAILS');
              }}
              style={{
                background: isDark ? 'rgba(17, 24, 39, 0.75)' : '#FFFFFF',
                border: `1px solid ${isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.08)'}`,
                borderRadius: 14,
                padding: 16,
                cursor: 'pointer',
                display: 'flex',
                flexDirection: 'column',
                gap: 10,
                boxShadow: isDark ? 'none' : '0 4px 12px rgba(0,0,0,0.03)',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <img src={b.avatar} alt={b.name} style={{ width: 40, height: 40, borderRadius: 20, objectFit: 'cover' }} />
                <div>
                  <div style={{ fontSize: 14, fontWeight: 700, color: isDark ? '#FFF' : '#111827' }}>{b.name}</div>
                  <div style={{ fontSize: 11, color: '#9CA3AF' }}>{b.company}</div>
                </div>
              </div>

              <div style={{ background: isDark ? 'rgba(31, 41, 55, 0.5)' : '#F3F4F6', padding: 8, borderRadius: 8, fontSize: 11, color: isDark ? '#D1D5DB' : '#4B5563' }}>
                <div>Total Spend: <strong style={{ color: '#10B981' }}>₹{(b.totalRevenue * 82).toLocaleString('en-IN')}</strong></div>
                <div style={{ marginTop: 2 }}>Orders: <strong>{b.totalOrders} Wholesale POs</strong></div>
              </div>

              <button
                style={{
                  background: 'rgba(37, 99, 235, 0.15)',
                  border: '1px solid rgba(37, 99, 235, 0.3)',
                  color: '#2563EB',
                  borderRadius: 6,
                  padding: '6px 0',
                  fontSize: 11,
                  fontWeight: 700,
                  cursor: 'pointer',
                }}
              >
                Inspect Buyer Profile →
              </button>
            </div>
          ))}
          </div>
        </div>
      )}

      {/* ─── TAB 2: BUYER DETAILS ───────────────────────────────────────── */}
      {currentTab === 'BUYERS_DETAILS' && selectedBuyer && (
        <div style={{ background: isDark ? 'rgba(17, 24, 39, 0.75)' : '#FFFFFF', border: `1px solid ${isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.08)'}`, borderRadius: 16, padding: 24, display: 'flex', flexDirection: 'column', gap: 18, boxShadow: isDark ? 'none' : '0 4px 12px rgba(0,0,0,0.03)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
              <img src={selectedBuyer.avatar} alt={selectedBuyer.name} style={{ width: 56, height: 56, borderRadius: 28, border: '2px solid #2563EB' }} />
              <div>
                <h3 style={{ fontSize: 18, fontWeight: 800, color: isDark ? '#FFF' : '#111827' }}>{selectedBuyer.name}</h3>
                <div style={{ fontSize: 12, color: '#9CA3AF' }}>{selectedBuyer.company} · GSTIN: 27AAACA12341Z5</div>
              </div>
            </div>
            <span style={{ fontSize: 11, fontWeight: 800, padding: '4px 10px', borderRadius: 8, background: 'rgba(16, 185, 129, 0.15)', color: '#34D399' }}>
              KYC VERIFIED TIER 1
            </span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 14 }}>
            <div style={{ background: isDark ? 'rgba(31, 41, 55, 0.6)' : '#F3F4F6', padding: 14, borderRadius: 10 }}>
              <div style={{ fontSize: 11, color: '#9CA3AF' }}>Pre-Approved Escrow Credit</div>
              <div style={{ fontSize: 20, fontWeight: 800, color: '#10B981', marginTop: 2 }}>₹50,00,000</div>
            </div>
            <div style={{ background: isDark ? 'rgba(31, 41, 55, 0.6)' : '#F3F4F6', padding: 14, borderRadius: 10 }}>
              <div style={{ fontSize: 11, color: '#9CA3AF' }}>Total RFQs Broadcasted</div>
              <div style={{ fontSize: 20, fontWeight: 800, color: '#2563EB', marginTop: 2 }}>—</div>
            </div>
            <div style={{ background: isDark ? 'rgba(31, 41, 55, 0.6)' : '#F3F4F6', padding: 14, borderRadius: 10 }}>
              <div style={{ fontSize: 11, color: '#9CA3AF' }}>Fulfilled Wholesale Orders</div>
              <div style={{ fontSize: 20, fontWeight: 800, color: '#F59E0B', marginTop: 2 }}>{selectedBuyer.totalOrders} Orders</div>
            </div>
          </div>
        </div>
      )}

      {/* ─── TAB 3: BUYER ACTIVITY LOGS ─────────────────────────────────── */}
      {false && currentTab === 'BUYERS_ACTIVITY' && (
        <div style={{ background: isDark ? 'rgba(17, 24, 39, 0.75)' : '#FFFFFF', border: `1px solid ${isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.08)'}`, borderRadius: 14, padding: 18, boxShadow: isDark ? 'none' : '0 4px 12px rgba(0,0,0,0.03)' }}>
          <h4 style={{ fontSize: 15, fontWeight: 800, color: isDark ? '#FFF' : '#111827', marginBottom: 12 }}>Live Procurement Activity Audit</h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {[
              { text: 'Broadcasted RFQ #rfq_302 for Lithium Iron Phosphate (LiFePO4) Battery Cells', time: 'Today, 10:15 AM' },
              { text: 'Accepted Quotation #Q-501 from PrecisionTech Dynamics (₹14,55,500)', time: 'Yesterday, 04:30 PM' },
              { text: 'Downloaded Tax Invoice for Order #B2B-2026-7734', time: '2026-08-20' },
            ].map((log, i) => (
              <div key={i} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, padding: '8px 12px', background: isDark ? 'rgba(31, 41, 55, 0.4)' : '#F3F4F6', borderRadius: 8 }}>
                <span style={{ color: isDark ? '#E5E7EB' : '#374151' }}>{log.text}</span>
                <span style={{ color: '#6B7280' }}>{log.time}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
