import React, { useState } from 'react';
import { useAdminStore } from '../../../store/useAdminStore';
import { useAuthStore } from '../../../store/useAuthStore';
import { AdminUser, AdminRoleUser } from '../../../constants/mockData';
import { PageTabs, TabItem } from '../../../components/common/PageTabs';
import {
  Users,
  Search,
  ShieldCheck,
  Building2,
  Mail,
  Phone,
  MapPin,
  Star,
  Trash2,
  UserPlus,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Download,
  Eye,
} from 'lucide-react';

export const AdminUserManagementView: React.FC = () => {
  const { activeSubSection, setActiveSubSection, adminRolesList = [], addAdminRoleUser, theme = 'dark' } = useAdminStore();
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [selectedUser, setSelectedUser] = useState<AdminUser | null>(null);
  const [approvalNotice, setApprovalNotice] = useState<{ status: 'APPROVED' | 'REJECTED'; name: string } | null>(null);
  const [search, setSearch] = useState('');
  // Kept for backwards-compatible store data; admin roles are no longer exposed in this directory.
  const [showAddRoleModal, setShowAddRoleModal] = useState(false);
  const [newAdminName, setNewAdminName] = useState('');
  const [newAdminEmail, setNewAdminEmail] = useState('');
  const [newAdminRole, setNewAdminRole] = useState<AdminRoleUser['role']>('Catalog Manager');
  const [newAdminDept, setNewAdminDept] = useState('Merchandising');

  const isDark = theme === 'dark';

  const getApprovalStatus = (user: AdminUser): 'APPROVED' | 'PENDING' | 'REJECTED' => {
    if (user.approvalStatus) return user.approvalStatus;
    if (user.kycStatus === 'VERIFIED') return 'APPROVED';
    if (user.kycStatus === 'REJECTED') return 'REJECTED';
    return 'PENDING';
  };

  const updateApproval = (status: 'APPROVED' | 'REJECTED') => {
    if (!selectedUser) return;
    setUsers((prev) => prev.map((user) => user.id === selectedUser.id ? { ...user, approvalStatus: status, kycStatus: status === 'APPROVED' ? 'VERIFIED' : 'REJECTED', isActive: status === 'APPROVED' } : user));
    setSelectedUser((current) => current ? { ...current, approvalStatus: status, kycStatus: status === 'APPROVED' ? 'VERIFIED' : 'REJECTED', isActive: status === 'APPROVED' } : current);
    setApprovalNotice({ status, name: selectedUser.name });
    window.setTimeout(() => setApprovalNotice(null), 3500);
  };

  const approvalStyle = (status: 'APPROVED' | 'PENDING' | 'REJECTED') => ({
    background: status === 'APPROVED' ? 'rgba(16, 185, 129, 0.15)' : status === 'REJECTED' ? 'rgba(239, 68, 68, 0.15)' : 'rgba(245, 158, 11, 0.15)',
    border: `1px solid ${status === 'APPROVED' ? '#10B981' : status === 'REJECTED' ? '#EF4444' : '#F59E0B'}`,
    color: status === 'APPROVED' ? '#34D399' : status === 'REJECTED' ? '#F87171' : '#FBBF24',
  });

  // Determine current active subtab
  const currentTab: string =
    activeSubSection === 'USERS_SELLERS'
      ? 'USERS_SELLERS'
      : activeSubSection === 'ROOT' || activeSubSection === 'USERS_BUYERS'
      ? 'USERS_BUYERS'
      : 'ALL_USERS';

  const buyers = users.filter((u) => u.role === 'BUYER' || u.role === 'BUYER_SUPPLIER');
  const sellers = users.filter((u) => u.role === 'SUPPLIER' || u.role === 'BUYER_SUPPLIER');

  const filteredAll = users.filter(
    (u) =>
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.company.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase()) ||
      u.location.toLowerCase().includes(search.toLowerCase())
  );

  const filteredBuyers = buyers.filter(
    (b) =>
      b.name.toLowerCase().includes(search.toLowerCase()) ||
      b.company.toLowerCase().includes(search.toLowerCase()) ||
      b.email.toLowerCase().includes(search.toLowerCase()) ||
      b.location.toLowerCase().includes(search.toLowerCase())
  );

  const filteredSellers = sellers.filter(
    (s) =>
      s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.company.toLowerCase().includes(search.toLowerCase()) ||
      s.email.toLowerCase().includes(search.toLowerCase()) ||
      s.location.toLowerCase().includes(search.toLowerCase())
  );

  const toggleUserStatus = (id: string) => {
    setUsers((prev) => prev.map((u) => (u.id === id ? { ...u, isActive: !u.isActive } : u)));
  };

  const handleCreateAdminRole = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAdminName || !newAdminEmail) return;
    addAdminRoleUser({ name: newAdminName, email: newAdminEmail, role: newAdminRole, department: newAdminDept, status: 'ACTIVE', permissions: ['PORTAL_ACCESS', 'MODULE_MGMT'] });
    setShowAddRoleModal(false);
    setNewAdminName('');
    setNewAdminEmail('');
  };

  const userTabs: TabItem[] = [
    { id: 'USERS_BUYERS', label: 'Buyers', badge: buyers.length },
    { id: 'USERS_SELLERS', label: 'Sellers', badge: sellers.length },
    { id: 'ALL_USERS', label: 'All Users', badge: users.length },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
      {approvalNotice && (
        <div style={{ position: 'fixed', top: 82, right: 28, zIndex: 10001, display: 'flex', alignItems: 'center', gap: 10, padding: '12px 16px', borderRadius: 10, background: approvalNotice.status === 'APPROVED' ? '#ECFDF5' : '#FEF2F2', border: `1px solid ${approvalNotice.status === 'APPROVED' ? '#10B981' : '#EF4444'}`, color: approvalNotice.status === 'APPROVED' ? '#047857' : '#B91C1C', boxShadow: '0 12px 30px rgba(15,23,42,.18)', fontSize: 13, fontWeight: 800 }}>
          <span style={{ width: 22, height: 22, borderRadius: 11, display: 'grid', placeItems: 'center', background: approvalNotice.status === 'APPROVED' ? '#10B981' : '#EF4444', color: '#FFF' }}>{approvalNotice.status === 'APPROVED' ? '✓' : '!'}</span>
          {approvalNotice.name} account {approvalNotice.status === 'APPROVED' ? 'approved' : 'rejected'} successfully
        </div>
      )}
      <style>{`\n        .admin-data-row { transition: background .18s ease, box-shadow .18s ease, transform .18s ease; }\n        .admin-data-row:hover { transform: translateY(-1px); }\n        .admin-data-row-light:hover { background: #EFF6FF !important; box-shadow: inset 3px 0 0 #3B82F6; }\n        .admin-data-row-dark:hover { background: rgba(59, 130, 246, .12) !important; box-shadow: inset 3px 0 0 #60A5FA; }\n        .admin-data-row td { transition: color .18s ease; }\n      `}</style>
      {/* PageTabs Integration */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
        <PageTabs
          tabs={userTabs}
          activeTabId={currentTab}
          onChangeTab={(id) => setActiveSubSection(id as any)}
          theme={theme}
        />

      </div>

      {/* Search Filter Bar */}
      {(
        <div
          style={{
            background: isDark ? 'rgba(17, 24, 39, 0.75)' : '#FFFFFF',
            border: `1px solid ${isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.08)'}`,
            borderRadius: 12,
            padding: 10,
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
            placeholder={`Search directory by name, firm, email, GST, city...`}
            style={{
              flex: 1,
              background: 'transparent',
              border: 'none',
              color: isDark ? '#FFF' : '#111827',
              fontSize: 13,
              outline: 'none',
            }}
          />
        </div>
      )}

      {/* ─── TAB 1: BUYERS TABLE ────────────────────────────────────────── */}
      {currentTab === 'USERS_BUYERS' && (
        <div style={{ background: isDark ? 'rgba(17, 24, 39, 0.75)' : '#FFFFFF', border: `1px solid ${isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.08)'}`, borderRadius: 14, overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: isDark ? 'rgba(15, 23, 42, 0.6)' : '#F3F4F6' }}>
                {['Buyer Profile', 'Company & Location', 'KYC & GST', 'Orders Placed', 'Gross Spend', 'Account Status', 'Actions'].map((h) => (
                  <th key={h} style={{ textAlign: 'left', padding: '12px 14px', fontSize: 11, fontWeight: 700, color: '#9CA3AF', textTransform: 'uppercase' }}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filteredBuyers.map((b) => (
                <tr key={b.id} className={`admin-data-row ${isDark ? 'admin-data-row-dark' : 'admin-data-row-light'}`} style={{ borderBottom: `1px solid ${isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.05)'}` }}>
                  <td style={{ padding: '12px 14px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <img src={b.avatar} alt={b.name} style={{ width: 36, height: 36, borderRadius: 18, objectFit: 'cover' }} />
                      <div>
                        <div style={{ fontSize: 13, fontWeight: 700, color: isDark ? '#FFF' : '#111827' }}>{b.name}</div>
                        <div style={{ fontSize: 11, color: '#9CA3AF' }}>{b.email}</div>
                      </div>
                    </div>
                  </td>
                  <td style={{ padding: '12px 14px' }}>
                    <div style={{ fontSize: 12, fontWeight: 600, color: isDark ? '#E5E7EB' : '#374151' }}>{b.company}</div>
                    <div style={{ fontSize: 11, color: '#9CA3AF' }}>{b.location}</div>
                  </td>
                  <td style={{ padding: '12px 14px' }}>
                    <span style={{ fontSize: 10, fontWeight: 700, padding: '2px 6px', borderRadius: 4, background: b.kycStatus === 'VERIFIED' ? 'rgba(16, 185, 129, 0.15)' : 'rgba(245, 158, 11, 0.15)', color: b.kycStatus === 'VERIFIED' ? '#34D399' : '#FBBF24' }}>
                      {b.kycStatus}
                    </span>
                  </td>
                  <td style={{ padding: '12px 14px', fontSize: 12, color: isDark ? '#FFF' : '#111827', fontWeight: 700 }}>
                    {b.totalOrders} Orders
                  </td>
                  <td style={{ padding: '12px 14px', fontSize: 13, color: '#10B981', fontWeight: 800 }}>
                    ₹{(b.totalRevenue * 82).toLocaleString('en-IN')}
                  </td>
                  <td style={{ padding: '12px 14px' }}><span style={{ ...approvalStyle(getApprovalStatus(b)), borderRadius: 14, padding: '3px 8px', fontSize: 10, fontWeight: 700 }}>{getApprovalStatus(b)[0] + getApprovalStatus(b).slice(1).toLowerCase()}</span></td>
                  <td style={{ padding: '12px 14px' }}><button onClick={() => setSelectedUser(b)} style={{ display: 'inline-flex', alignItems: 'center', gap: 5, border: '1px solid #60A5FA', borderRadius: 8, padding: '6px 10px', background: 'rgba(96,165,250,.12)', color: '#60A5FA', fontSize: 11, fontWeight: 700, cursor: 'pointer' }}><Eye size={13} /> View</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* ─── TAB 2: SELLERS TABLE ───────────────────────────────────────── */}
      {currentTab === 'USERS_SELLERS' && (
        <div style={{ background: isDark ? 'rgba(17, 24, 39, 0.75)' : '#FFFFFF', border: `1px solid ${isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.08)'}`, borderRadius: 14, overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: isDark ? 'rgba(15, 23, 42, 0.6)' : '#F3F4F6' }}>
                {['Supplier Firm', 'Contact Representative', 'GST Verification', 'Rating', 'Fulfilled GMV', 'Account Status', 'Actions'].map((h) => (
                  <th key={h} style={{ textAlign: 'left', padding: '12px 14px', fontSize: 11, fontWeight: 700, color: '#9CA3AF', textTransform: 'uppercase' }}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filteredSellers.map((s) => (
                <tr key={s.id} className={`admin-data-row ${isDark ? 'admin-data-row-dark' : 'admin-data-row-light'}`} style={{ borderBottom: `1px solid ${isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.05)'}` }}>
                  <td style={{ padding: '12px 14px' }}>
                    <div style={{ fontSize: 13, fontWeight: 700, color: isDark ? '#FFF' : '#111827' }}>{s.company}</div>
                    <div style={{ fontSize: 11, color: '#9CA3AF' }}>{s.location}</div>
                  </td>
                  <td style={{ padding: '12px 14px' }}>
                    <div style={{ fontSize: 12, fontWeight: 600, color: isDark ? '#E5E7EB' : '#374151' }}>{s.name}</div>
                    <div style={{ fontSize: 11, color: '#9CA3AF' }}>{s.phone}</div>
                  </td>
                  <td style={{ padding: '12px 14px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 4, color: '#10B981', fontSize: 11, fontWeight: 700 }}>
                      <ShieldCheck size={13} />
                      <span>Verified GSTIN</span>
                    </div>
                  </td>
                  <td style={{ padding: '12px 14px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 4, color: '#F59E0B', fontWeight: 800, fontSize: 12 }}>
                      <Star size={12} fill="#F59E0B" />
                      <span>{s.rating} ★</span>
                    </div>
                  </td>
                  <td style={{ padding: '12px 14px', fontSize: 13, color: '#10B981', fontWeight: 800 }}>
                    ₹{(s.totalRevenue * 82).toLocaleString('en-IN')}
                  </td>
                  <td style={{ padding: '12px 14px' }}><span style={{ ...approvalStyle(getApprovalStatus(s)), borderRadius: 14, padding: '3px 8px', fontSize: 10, fontWeight: 700 }}>{getApprovalStatus(s)[0] + getApprovalStatus(s).slice(1).toLowerCase()}</span></td>
                  <td style={{ padding: '12px 14px' }}><button onClick={() => setSelectedUser(s)} style={{ display: 'inline-flex', alignItems: 'center', gap: 5, border: '1px solid #60A5FA', borderRadius: 8, padding: '6px 10px', background: 'rgba(96,165,250,.12)', color: '#60A5FA', fontSize: 11, fontWeight: 700, cursor: 'pointer' }}><Eye size={13} /> View</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* ─── TAB 3: ALL USERS TABLE ─────────────────────────────────────── */}
      {currentTab === 'ALL_USERS' && (
        <div style={{ background: isDark ? 'rgba(17, 24, 39, 0.75)' : '#FFFFFF', border: `1px solid ${isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.08)'}`, borderRadius: 14, overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: isDark ? 'rgba(15, 23, 42, 0.6)' : '#F3F4F6' }}>
                {['User Profile', 'Company & Role', 'Fulfillment Value', 'Account Status', 'Actions'].map((h) => (
                  <th key={h} style={{ textAlign: 'left', padding: '12px 14px', fontSize: 11, fontWeight: 700, color: '#9CA3AF', textTransform: 'uppercase' }}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filteredAll.map((u) => (
                <tr key={u.id} className={`admin-data-row ${isDark ? 'admin-data-row-dark' : 'admin-data-row-light'}`} style={{ borderBottom: `1px solid ${isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.05)'}` }}>
                  <td style={{ padding: '12px 14px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <img src={u.avatar} alt={u.name} style={{ width: 36, height: 36, borderRadius: 18, objectFit: 'cover' }} />
                      <div>
                        <div style={{ fontSize: 13, fontWeight: 700, color: isDark ? '#FFF' : '#111827' }}>{u.name}</div>
                        <div style={{ fontSize: 11, color: '#9CA3AF' }}>{u.email}</div>
                      </div>
                    </div>
                  </td>
                  <td style={{ padding: '12px 14px' }}>
                    <div style={{ fontSize: 12, fontWeight: 600, color: isDark ? '#E5E7EB' : '#374151' }}>{u.company}</div>
                    <span style={{ fontSize: 9, fontWeight: 800, padding: '2px 6px', borderRadius: 4, background: 'rgba(59, 130, 246, 0.15)', color: '#60A5FA' }}>
                      {u.role}
                    </span>
                  </td>
                  <td style={{ padding: '12px 14px', fontSize: 13, color: '#10B981', fontWeight: 800 }}>
                    ₹{(u.totalRevenue * 82).toLocaleString('en-IN')}
                  </td>
                  <td style={{ padding: '12px 14px' }}><span style={{ ...approvalStyle(getApprovalStatus(u)), borderRadius: 14, padding: '3px 8px', fontSize: 10, fontWeight: 700 }}>{getApprovalStatus(u)[0] + getApprovalStatus(u).slice(1).toLowerCase()}</span></td>
                  <td style={{ padding: '12px 14px' }}><button onClick={() => setSelectedUser(u)} style={{ display: 'inline-flex', alignItems: 'center', gap: 5, border: '1px solid #60A5FA', borderRadius: 8, padding: '6px 10px', background: 'rgba(96,165,250,.12)', color: '#60A5FA', fontSize: 11, fontWeight: 700, cursor: 'pointer' }}><Eye size={13} /> View</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {selectedUser && (
        <div onClick={() => setSelectedUser(null)} style={{ position: 'fixed', inset: 0, zIndex: 9998, background: 'rgba(15, 23, 42, 0.55)', backdropFilter: 'blur(5px)', display: 'flex', justifyContent: 'flex-end' }}>
          <div onClick={(e) => e.stopPropagation()} style={{ width: 'min(440px, 100%)', height: '100%', overflowY: 'auto', background: isDark ? '#0F172A' : '#FFFFFF', padding: 26, boxShadow: '-12px 0 35px rgba(0,0,0,0.18)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24 }}>
              <div>
                <div style={{ color: '#60A5FA', fontSize: 11, fontWeight: 800, textTransform: 'uppercase', letterSpacing: 1 }}>User details</div>
                <h2 style={{ margin: '6px 0 4px', color: isDark ? '#FFF' : '#111827', fontSize: 22 }}>{selectedUser.name}</h2>
                <div style={{ color: '#9CA3AF', fontSize: 12 }}>{selectedUser.id}</div>
              </div>
              <button onClick={() => setSelectedUser(null)} aria-label="Close details" style={{ border: 'none', background: isDark ? 'rgba(255,255,255,.08)' : '#F3F4F6', color: isDark ? '#FFF' : '#374151', borderRadius: 8, padding: 8, cursor: 'pointer' }}>×</button>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 14, padding: 14, borderRadius: 12, background: isDark ? 'rgba(30,41,59,.65)' : '#F8FAFC', marginBottom: 20 }}>
              <img src={selectedUser.avatar} alt={selectedUser.name} style={{ width: 64, height: 64, borderRadius: 32, objectFit: 'cover' }} />
              <div>
                <div style={{ color: isDark ? '#FFF' : '#111827', fontSize: 15, fontWeight: 800 }}>{selectedUser.company}</div>
                <div style={{ color: '#9CA3AF', fontSize: 12, marginTop: 4 }}>{selectedUser.role.replace('_', ' ')}</div>
                <div style={{ display: 'flex', gap: 6, marginTop: 8, flexWrap: 'wrap' }}>
                  <span style={{ ...approvalStyle(getApprovalStatus(selectedUser)), borderRadius: 14, padding: '3px 8px', fontSize: 10, fontWeight: 700 }}>{getApprovalStatus(selectedUser)}</span>
                  <span style={{ borderRadius: 14, padding: '3px 8px', fontSize: 10, fontWeight: 700, background: selectedUser.isActive ? 'rgba(16,185,129,.15)' : 'rgba(239,68,68,.15)', color: selectedUser.isActive ? '#34D399' : '#F87171' }}>{selectedUser.isActive ? 'ACTIVE' : 'SUSPENDED'}</span>
                </div>
              </div>
            </div>
            <div style={{ display: 'grid', gap: 0, borderTop: `1px solid ${isDark ? 'rgba(255,255,255,.08)' : '#E5E7EB'}` }}>
              {[
                ['Email', selectedUser.email], ['Phone', selectedUser.phone], ['Location', selectedUser.location],
                ['KYC status', selectedUser.kycStatus], ['GST verification', selectedUser.gstVerified ? 'Verified' : 'Not verified'],
                ['Orders placed', String(selectedUser.totalOrders)], ['Gross spend', `₹${(selectedUser.totalRevenue * 82).toLocaleString('en-IN')}`],
                ['Rating', selectedUser.rating ? `${selectedUser.rating} ★` : 'Not rated'], ['Joined', selectedUser.joinDate], ['Last active', selectedUser.lastActive],
              ].map(([label, value]) => (
                <div key={label} style={{ display: 'flex', justifyContent: 'space-between', gap: 16, padding: '13px 0', borderBottom: `1px solid ${isDark ? 'rgba(255,255,255,.08)' : '#E5E7EB'}` }}>
                  <span style={{ color: '#9CA3AF', fontSize: 12 }}>{label}</span>
                  <span style={{ color: isDark ? '#E5E7EB' : '#374151', fontSize: 12, fontWeight: 700, textAlign: 'right' }}>{value}</span>
                </div>
              ))}
            </div>
            <div style={{ display: 'flex', gap: 10, marginTop: 20 }}>
              <button onClick={() => setSelectedUser(null)} style={{ width: '100%', border: '1px solid #94A3B8', borderRadius: 9, padding: '11px 8px', background: 'transparent', color: isDark ? '#CBD5E1' : '#475569', fontWeight: 800, cursor: 'pointer' }}>Close</button>
            </div>
          </div>
        </div>
      )}

      {/* ─── TAB 4: ADMIN USERS & ROLES ─────────────────────────────────── */}
      {currentTab === 'USERS_ROLES' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 14 }}>
          {adminRolesList.map((adm) => (
            <div
              key={adm.id}
              style={{
                background: isDark ? 'rgba(17, 24, 39, 0.75)' : '#FFFFFF',
                border: `1px solid ${isDark ? 'rgba(139, 92, 246, 0.25)' : 'rgba(139, 92, 246, 0.15)'}`,
                borderRadius: 14,
                padding: 16,
                display: 'flex',
                flexDirection: 'column',
                gap: 10,
                boxShadow: isDark ? 'none' : '0 4px 12px rgba(0,0,0,0.03)',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: 10, fontWeight: 800, padding: '2px 8px', borderRadius: 6, background: 'rgba(139, 92, 246, 0.2)', color: '#C084FC' }}>
                  {adm.role}
                </span>
                <span style={{ fontSize: 10, color: '#10B981', fontWeight: 700 }}>● {adm.status}</span>
              </div>

              <div>
                <h4 style={{ fontSize: 15, fontWeight: 800, color: isDark ? '#FFF' : '#111827' }}>{adm.name}</h4>
                <div style={{ fontSize: 12, color: '#9CA3AF' }}>{adm.email}</div>
                <div style={{ fontSize: 11, color: '#60A5FA', marginTop: 2 }}>{adm.department}</div>
              </div>

              <div style={{ borderTop: `1px solid ${isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.08)'}`, paddingTop: 8 }}>
                <div style={{ fontSize: 10, color: '#9CA3AF', fontWeight: 700, marginBottom: 4 }}>PERMISSIONS:</div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
                  {adm.permissions.map((p) => (
                    <span key={p} style={{ fontSize: 9, background: isDark ? 'rgba(31, 41, 55, 0.8)' : '#F3F4F6', padding: '2px 6px', borderRadius: 4, color: isDark ? '#D1D5DB' : '#4B5563' }}>
                      {p}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add Admin Role Modal */}
      {showAddRoleModal && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 9999, background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
          <div style={{ width: '100%', maxWidth: 460, background: isDark ? '#0F172A' : '#FFFFFF', borderRadius: 16, border: `1px solid ${isDark ? 'rgba(139, 92, 246, 0.3)' : 'rgba(139, 92, 246, 0.15)'}`, padding: 24, boxShadow: '0 20px 45px rgba(0,0,0,0.25)' }}>
            <h3 style={{ fontSize: 18, fontWeight: 800, color: isDark ? '#FFF' : '#111827', marginBottom: 14 }}>Assign New Admin Role</h3>
            <form onSubmit={handleCreateAdminRole} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <div>
                <label style={{ fontSize: 11, fontWeight: 700, color: '#9CA3AF', display: 'block', marginBottom: 4 }}>Admin Name</label>
                <input type="text" required value={newAdminName} onChange={(e) => setNewAdminName(e.target.value)} placeholder="e.g. Sumanth Rao" style={{ width: '100%', background: isDark ? 'rgba(31, 41, 55, 0.8)' : '#F3F4F6', border: `1px solid ${isDark ? 'rgba(255, 255, 255, 0.15)' : 'rgba(0, 0, 0, 0.08)'}`, borderRadius: 8, padding: 8, color: isDark ? '#FFF' : '#111827' }} />
              </div>
              <div>
                <label style={{ fontSize: 11, fontWeight: 700, color: '#9CA3AF', display: 'block', marginBottom: 4 }}>Official Email</label>
                <input type="email" required value={newAdminEmail} onChange={(e) => setNewAdminEmail(e.target.value)} placeholder="sumanth@kfpl.in" style={{ width: '100%', background: isDark ? 'rgba(31, 41, 55, 0.8)' : '#F3F4F6', border: `1px solid ${isDark ? 'rgba(255, 255, 255, 0.15)' : 'rgba(0, 0, 0, 0.08)'}`, borderRadius: 8, padding: 8, color: isDark ? '#FFF' : '#111827' }} />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                <div>
                  <label style={{ fontSize: 11, fontWeight: 700, color: '#9CA3AF', display: 'block', marginBottom: 4 }}>Role Designation</label>
                  <select value={newAdminRole} onChange={(e) => setNewAdminRole(e.target.value as any)} style={{ width: '100%', background: isDark ? '#1F2937' : '#F3F4F6', border: `1px solid ${isDark ? 'rgba(255, 255, 255, 0.15)' : 'rgba(0, 0, 0, 0.08)'}`, borderRadius: 8, padding: 8, color: isDark ? '#FFF' : '#111827' }}>
                    <option value="Super Admin">Super Admin</option>
                    <option value="Catalog Manager">Catalog Manager</option>
                    <option value="Order & Escrow Lead">Order & Escrow Lead</option>
                    <option value="Finance Admin">Finance Admin</option>
                    <option value="Support Lead">Support Lead</option>
                  </select>
                </div>
                <div>
                  <label style={{ fontSize: 11, fontWeight: 700, color: '#9CA3AF', display: 'block', marginBottom: 4 }}>Department</label>
                  <input type="text" value={newAdminDept} onChange={(e) => setNewAdminDept(e.target.value)} style={{ width: '100%', background: isDark ? 'rgba(31, 41, 55, 0.8)' : '#F3F4F6', border: `1px solid ${isDark ? 'rgba(255, 255, 255, 0.15)' : 'rgba(0, 0, 0, 0.08)'}`, borderRadius: 8, padding: 8, color: isDark ? '#FFF' : '#111827' }} />
                </div>
              </div>
              <div style={{ display: 'flex', gap: 10, marginTop: 10 }}>
                <button type="submit" style={{ flex: 1, background: 'linear-gradient(135deg, #8B5CF6 0%, #6D28D9 100%)', color: '#FFF', border: 'none', borderRadius: 8, padding: '10px 0', fontSize: 13, fontWeight: 800, cursor: 'pointer' }}>Create Admin Account</button>
                <button type="button" onClick={() => setShowAddRoleModal(false)} style={{ background: 'rgba(255, 255, 255, 0.1)', color: '#D1D5DB', border: 'none', borderRadius: 8, padding: '10px 16px', fontSize: 13, fontWeight: 700, cursor: 'pointer' }}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
