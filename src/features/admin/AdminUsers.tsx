import React, { useState } from 'react';
import { AdminUser } from '../../constants/mockData';
import {
  Users,
  Search,
  Filter,
  CheckCircle2,
  XCircle,
  AlertCircle,
  ShieldCheck,
  Building2,
  Mail,
  Phone,
  MapPin,
  Star,
  Edit,
  Eye,
  Trash2,
  UserPlus,
  ArrowUpDown,
  Download,
} from 'lucide-react';

export const AdminUsers: React.FC = () => {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState<'ALL' | 'BUYER' | 'SUPPLIER' | 'BUYER_SUPPLIER'>('ALL');
  const [kycFilter, setKycFilter] = useState<'ALL' | 'VERIFIED' | 'PENDING' | 'REJECTED'>('ALL');
  const [selectedUser, setSelectedUser] = useState<AdminUser | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState<Partial<AdminUser>>({});
  const [showAddModal, setShowAddModal] = useState(false);
  const [newUser, setNewUser] = useState<Partial<AdminUser>>({
    name: '',
    email: '',
    phone: '',
    company: '',
    role: 'BUYER',
    kycStatus: 'VERIFIED',
    gstVerified: true,
    location: '',
  });

  const filteredUsers = users.filter((u) => {
    const matchesSearch =
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.company.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase()) ||
      u.phone.toLowerCase().includes(search.toLowerCase()) ||
      u.location.toLowerCase().includes(search.toLowerCase());
    const matchesRole = roleFilter === 'ALL' || u.role === roleFilter;
    const matchesKyc = kycFilter === 'ALL' || u.kycStatus === kycFilter;
    return matchesSearch && matchesRole && matchesKyc;
  });

  const toggleUserStatus = (id: string) => {
    setUsers((prev) =>
      prev.map((u) => (u.id === id ? { ...u, isActive: !u.isActive } : u))
    );
  };

  const handleEditClick = (u: AdminUser) => {
    setSelectedUser(u);
    setEditForm(u);
    setIsEditing(true);
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUser) return;
    setUsers((prev) =>
      prev.map((u) => (u.id === selectedUser.id ? ({ ...u, ...editForm } as AdminUser) : u))
    );
    setIsEditing(false);
    setSelectedUser(null);
  };

  const handleAddUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUser.name || !newUser.email) return;
    const created: AdminUser = {
      id: `usr_${Date.now()}`,
      name: newUser.name || '',
      email: newUser.email || '',
      phone: newUser.phone || '+1 (555) 000-0000',
      company: newUser.company || 'Enterprise Corp',
      role: newUser.role || 'BUYER',
      kycStatus: newUser.kycStatus || 'VERIFIED',
      gstVerified: !!newUser.gstVerified,
      totalOrders: 0,
      totalRevenue: 0,
      rating: 5.0,
      joinDate: new Date().toISOString().split('T')[0],
      lastActive: 'Just now',
      isActive: true,
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      location: newUser.location || 'New York, NY',
    };
    setUsers([created, ...users]);
    setShowAddModal(false);
    setNewUser({
      name: '',
      email: '',
      phone: '',
      company: '',
      role: 'BUYER',
      kycStatus: 'VERIFIED',
      gstVerified: true,
      location: '',
    });
  };

  const handleDeleteUser = (id: string) => {
    if (confirm('Are you sure you want to delete this user record?')) {
      setUsers((prev) => prev.filter((u) => u.id !== id));
      if (selectedUser?.id === id) {
        setSelectedUser(null);
        setIsEditing(false);
      }
    }
  };

  const exportCSV = () => {
    const headers = ['ID', 'Name', 'Email', 'Phone', 'Company', 'Role', 'KYC', 'GST', 'Orders', 'Revenue', 'Status'];
    const rows = filteredUsers.map((u) => [
      u.id,
      u.name,
      u.email,
      u.phone,
      u.company,
      u.role,
      u.kycStatus,
      u.gstVerified ? 'YES' : 'NO',
      u.totalOrders,
      u.totalRevenue,
      u.isActive ? 'ACTIVE' : 'INACTIVE',
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `kfpl_users_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      {/* Header & Action Toolbar */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <h1 style={{ fontSize: 24, fontWeight: 800, color: '#F9FAFB' }}>User & Account Directory</h1>
          <p style={{ fontSize: 13, color: '#9CA3AF', marginTop: 2 }}>
            Manage verified buyers, manufacturers, KYC approvals, and enterprise permissions
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <button
            onClick={exportCSV}
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
            <span>Export CSV</span>
          </button>

          <button
            onClick={() => setShowAddModal(true)}
            style={{
              background: 'linear-gradient(135deg, #2563EB 0%, #1D4ED8 100%)',
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
              boxShadow: '0 4px 14px rgba(37, 99, 235, 0.35)',
            }}
          >
            <UserPlus size={15} />
            <span>Add New User</span>
          </button>
        </div>
      </div>

      {/* Filters Bar */}
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
        {/* Search */}
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
            placeholder="Search by name, company, email, location..."
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

        {/* Role Filter */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <span style={{ fontSize: 12, color: '#9CA3AF', fontWeight: 600 }}>Role:</span>
          {(['ALL', 'BUYER', 'SUPPLIER', 'BUYER_SUPPLIER'] as const).map((r) => (
            <button
              key={r}
              onClick={() => setRoleFilter(r)}
              style={{
                background: roleFilter === r ? '#2563EB' : 'rgba(31, 41, 55, 0.6)',
                border: roleFilter === r ? '1px solid #3B82F6' : '1px solid rgba(255, 255, 255, 0.08)',
                color: roleFilter === r ? '#FFF' : '#9CA3AF',
                borderRadius: 8,
                padding: '5px 10px',
                fontSize: 11,
                fontWeight: 700,
                cursor: 'pointer',
              }}
            >
              {r === 'BUYER_SUPPLIER' ? 'Dual Role' : r}
            </button>
          ))}
        </div>

        {/* KYC Filter */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <span style={{ fontSize: 12, color: '#9CA3AF', fontWeight: 600 }}>KYC:</span>
          {(['ALL', 'VERIFIED', 'PENDING', 'REJECTED'] as const).map((k) => (
            <button
              key={k}
              onClick={() => setKycFilter(k)}
              style={{
                background: kycFilter === k ? '#10B981' : 'rgba(31, 41, 55, 0.6)',
                border: kycFilter === k ? '1px solid #34D399' : '1px solid rgba(255, 255, 255, 0.08)',
                color: kycFilter === k ? '#FFF' : '#9CA3AF',
                borderRadius: 8,
                padding: '5px 10px',
                fontSize: 11,
                fontWeight: 700,
                cursor: 'pointer',
              }}
            >
              {k}
            </button>
          ))}
        </div>
      </div>

      {/* Users Table */}
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
              {['User Profile', 'Company & Location', 'Role Type', 'KYC & GST', 'Performance', 'Account Status', 'Actions'].map((h) => (
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
            {filteredUsers.length === 0 ? (
              <tr>
                <td colSpan={7} style={{ textAlign: 'center', padding: 40, color: '#9CA3AF' }}>
                  No users found matching your filters.
                </td>
              </tr>
            ) : (
              filteredUsers.map((user) => {
                const isBuyer = user.role === 'BUYER';
                const isSupplier = user.role === 'SUPPLIER';
                const isDual = user.role === 'BUYER_SUPPLIER';

                return (
                  <tr
                    key={user.id}
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
                    {/* User Profile */}
                    <td style={{ padding: '12px 14px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <img
                          src={user.avatar}
                          alt={user.name}
                          style={{ width: 38, height: 38, borderRadius: 19, objectFit: 'cover' }}
                        />
                        <div>
                          <div style={{ fontSize: 13, fontWeight: 700, color: '#F9FAFB' }}>{user.name}</div>
                          <div style={{ fontSize: 11, color: '#9CA3AF' }}>{user.email}</div>
                          <div style={{ fontSize: 10, color: '#6B7280' }}>{user.phone}</div>
                        </div>
                      </div>
                    </td>

                    {/* Company & Location */}
                    <td style={{ padding: '12px 14px' }}>
                      <div style={{ fontSize: 13, fontWeight: 600, color: '#E5E7EB' }}>{user.company}</div>
                      <div style={{ fontSize: 11, color: '#9CA3AF', display: 'flex', alignItems: 'center', gap: 4, marginTop: 2 }}>
                        <MapPin size={11} color="#60A5FA" />
                        <span>{user.location}</span>
                      </div>
                      <div style={{ fontSize: 10, color: '#6B7280', marginTop: 2 }}>Joined {user.joinDate}</div>
                    </td>

                    {/* Role Type */}
                    <td style={{ padding: '12px 14px' }}>
                      <span
                        style={{
                          fontSize: 10,
                          fontWeight: 800,
                          padding: '3px 8px',
                          borderRadius: 6,
                          background: isBuyer
                            ? 'rgba(59, 130, 246, 0.15)'
                            : isSupplier
                            ? 'rgba(16, 185, 129, 0.15)'
                            : 'rgba(139, 92, 246, 0.15)',
                          color: isBuyer ? '#60A5FA' : isSupplier ? '#34D399' : '#C084FC',
                          border: `1px solid ${
                            isBuyer
                              ? 'rgba(59, 130, 246, 0.3)'
                              : isSupplier
                              ? 'rgba(16, 185, 129, 0.3)'
                              : 'rgba(139, 92, 246, 0.3)'
                          }`,
                        }}
                      >
                        {user.role}
                      </span>
                    </td>

                    {/* KYC & GST */}
                    <td style={{ padding: '12px 14px' }}>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                        <span
                          style={{
                            fontSize: 10,
                            fontWeight: 700,
                            padding: '2px 6px',
                            borderRadius: 4,
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: 3,
                            width: 'fit-content',
                            background:
                              user.kycStatus === 'VERIFIED'
                                ? 'rgba(16, 185, 129, 0.15)'
                                : user.kycStatus === 'PENDING'
                                ? 'rgba(245, 158, 11, 0.15)'
                                : 'rgba(239, 68, 68, 0.15)',
                            color:
                              user.kycStatus === 'VERIFIED'
                                ? '#34D399'
                                : user.kycStatus === 'PENDING'
                                ? '#FBBF24'
                                : '#F87171',
                          }}
                        >
                          {user.kycStatus === 'VERIFIED' ? (
                            <CheckCircle2 size={10} />
                          ) : (
                            <AlertCircle size={10} />
                          )}
                          KYC {user.kycStatus}
                        </span>

                        <span
                          style={{
                            fontSize: 10,
                            color: user.gstVerified ? '#34D399' : '#9CA3AF',
                            display: 'flex',
                            alignItems: 'center',
                            gap: 3,
                            fontWeight: 600,
                          }}
                        >
                          <ShieldCheck size={11} color={user.gstVerified ? '#34D399' : '#6B7280'} />
                          {user.gstVerified ? 'GST Registered' : 'Unregistered'}
                        </span>
                      </div>
                    </td>

                    {/* Performance */}
                    <td style={{ padding: '12px 14px' }}>
                      <div style={{ fontSize: 12, color: '#D1D5DB' }}>
                        Orders: <strong style={{ color: '#FFF' }}>{user.totalOrders}</strong>
                      </div>
                      <div style={{ fontSize: 12, color: '#10B981', fontWeight: 700, marginTop: 2 }}>
                        ${user.totalRevenue.toLocaleString()}
                      </div>
                      {user.rating > 0 && (
                        <div style={{ fontSize: 11, color: '#F59E0B', display: 'flex', alignItems: 'center', gap: 3, marginTop: 2 }}>
                          <Star size={10} fill="#F59E0B" />
                          <span>{user.rating} ★</span>
                        </div>
                      )}
                    </td>

                    {/* Account Status Toggle */}
                    <td style={{ padding: '12px 14px' }}>
                      <button
                        onClick={() => toggleUserStatus(user.id)}
                        style={{
                          background: user.isActive ? 'rgba(16, 185, 129, 0.15)' : 'rgba(239, 68, 68, 0.15)',
                          border: `1px solid ${user.isActive ? 'rgba(16, 185, 129, 0.3)' : 'rgba(239, 68, 68, 0.3)'}`,
                          color: user.isActive ? '#34D399' : '#F87171',
                          borderRadius: 20,
                          padding: '4px 10px',
                          fontSize: 11,
                          fontWeight: 700,
                          cursor: 'pointer',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: 4,
                        }}
                      >
                        {user.isActive ? <CheckCircle2 size={12} /> : <XCircle size={12} />}
                        <span>{user.isActive ? 'Active' : 'Suspended'}</span>
                      </button>
                    </td>

                    {/* Actions */}
                    <td style={{ padding: '12px 14px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                        <button
                          onClick={() => handleEditClick(user)}
                          title="Edit User"
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
                          <Edit size={13} />
                        </button>
                        <button
                          onClick={() => handleDeleteUser(user.id)}
                          title="Delete User"
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

      {/* Edit User Modal */}
      {isEditing && selectedUser && (
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
              border: '1px solid rgba(255,255,255,0.15)',
              padding: 24,
              boxShadow: '0 20px 50px rgba(0,0,0,0.8)',
            }}
          >
            <h3 style={{ fontSize: 18, fontWeight: 800, color: '#F9FAFB', marginBottom: 16 }}>
              Edit User Profile: {selectedUser.name}
            </h3>
            <form onSubmit={handleSaveEdit} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <div>
                <label style={{ fontSize: 11, fontWeight: 700, color: '#9CA3AF', display: 'block', marginBottom: 4 }}>
                  Full Name
                </label>
                <input
                  type="text"
                  value={editForm.name || ''}
                  onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
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
                    Email
                  </label>
                  <input
                    type="email"
                    value={editForm.email || ''}
                    onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
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
                    Phone
                  </label>
                  <input
                    type="text"
                    value={editForm.phone || ''}
                    onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
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
                  Company Name
                </label>
                <input
                  type="text"
                  value={editForm.company || ''}
                  onChange={(e) => setEditForm({ ...editForm, company: e.target.value })}
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
                    Role
                  </label>
                  <select
                    value={editForm.role || 'BUYER'}
                    onChange={(e) => setEditForm({ ...editForm, role: e.target.value as any })}
                    style={{
                      width: '100%',
                      background: '#1F2937',
                      border: '1px solid rgba(255, 255, 255, 0.15)',
                      borderRadius: 8,
                      padding: 8,
                      color: '#FFF',
                    }}
                  >
                    <option value="BUYER">BUYER</option>
                    <option value="SUPPLIER">SUPPLIER</option>
                    <option value="BUYER_SUPPLIER">BUYER_SUPPLIER</option>
                  </select>
                </div>
                <div>
                  <label style={{ fontSize: 11, fontWeight: 700, color: '#9CA3AF', display: 'block', marginBottom: 4 }}>
                    KYC Status
                  </label>
                  <select
                    value={editForm.kycStatus || 'VERIFIED'}
                    onChange={(e) => setEditForm({ ...editForm, kycStatus: e.target.value as any })}
                    style={{
                      width: '100%',
                      background: '#1F2937',
                      border: '1px solid rgba(255, 255, 255, 0.15)',
                      borderRadius: 8,
                      padding: 8,
                      color: '#FFF',
                    }}
                  >
                    <option value="VERIFIED">VERIFIED</option>
                    <option value="PENDING">PENDING</option>
                    <option value="REJECTED">REJECTED</option>
                  </select>
                </div>
              </div>

              <div style={{ display: 'flex', gap: 10, marginTop: 10 }}>
                <button
                  type="submit"
                  style={{
                    flex: 1,
                    background: 'linear-gradient(135deg, #2563EB 0%, #1D4ED8 100%)',
                    color: '#FFF',
                    border: 'none',
                    borderRadius: 8,
                    padding: '10px 0',
                    fontSize: 13,
                    fontWeight: 800,
                    cursor: 'pointer',
                  }}
                >
                  Save Changes
                </button>
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
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

      {/* Add New User Modal */}
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
              border: '1px solid rgba(37, 99, 235, 0.3)',
              padding: 24,
              boxShadow: '0 20px 50px rgba(0,0,0,0.8)',
            }}
          >
            <h3 style={{ fontSize: 18, fontWeight: 800, color: '#F9FAFB', marginBottom: 16 }}>
              Add New User / Enterprise Account
            </h3>
            <form onSubmit={handleAddUser} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <div>
                <label style={{ fontSize: 11, fontWeight: 700, color: '#9CA3AF', display: 'block', marginBottom: 4 }}>
                  Full Name *
                </label>
                <input
                  type="text"
                  required
                  value={newUser.name || ''}
                  onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                  placeholder="e.g. David Miller"
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
                    Email *
                  </label>
                  <input
                    type="email"
                    required
                    value={newUser.email || ''}
                    onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                    placeholder="david@company.com"
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
                    Phone
                  </label>
                  <input
                    type="text"
                    value={newUser.phone || ''}
                    onChange={(e) => setNewUser({ ...newUser, phone: e.target.value })}
                    placeholder="+1 (555) 123-4567"
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
                  Company Name
                </label>
                <input
                  type="text"
                  value={newUser.company || ''}
                  onChange={(e) => setNewUser({ ...newUser, company: e.target.value })}
                  placeholder="Miller Heavy Industries"
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
                    Role
                  </label>
                  <select
                    value={newUser.role || 'BUYER'}
                    onChange={(e) => setNewUser({ ...newUser, role: e.target.value as any })}
                    style={{
                      width: '100%',
                      background: '#1F2937',
                      border: '1px solid rgba(255, 255, 255, 0.15)',
                      borderRadius: 8,
                      padding: 8,
                      color: '#FFF',
                    }}
                  >
                    <option value="BUYER">BUYER</option>
                    <option value="SUPPLIER">SUPPLIER</option>
                    <option value="BUYER_SUPPLIER">BUYER_SUPPLIER</option>
                  </select>
                </div>
                <div>
                  <label style={{ fontSize: 11, fontWeight: 700, color: '#9CA3AF', display: 'block', marginBottom: 4 }}>
                    Location
                  </label>
                  <input
                    type="text"
                    value={newUser.location || ''}
                    onChange={(e) => setNewUser({ ...newUser, location: e.target.value })}
                    placeholder="Dallas, TX"
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

              <div style={{ display: 'flex', gap: 10, marginTop: 10 }}>
                <button
                  type="submit"
                  style={{
                    flex: 1,
                    background: 'linear-gradient(135deg, #2563EB 0%, #1D4ED8 100%)',
                    color: '#FFF',
                    border: 'none',
                    borderRadius: 8,
                    padding: '10px 0',
                    fontSize: 13,
                    fontWeight: 800,
                    cursor: 'pointer',
                  }}
                >
                  Create User
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
