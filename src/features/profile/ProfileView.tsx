import React from 'react';
import { useAuthStore } from '../../store/useAuthStore';
import { useRoleStore } from '../../store/useRoleStore';
import { RoleSwitcherToggle } from '../../components/common/RoleSwitcherToggle';
import {
  User,
  Building2,
  ShieldCheck,
  Wallet,
  Globe,
  Settings,
  HelpCircle,
  LogOut,
  FileCheck,
  ChevronRight,
  Sparkles,
} from 'lucide-react';

export const ProfileView: React.FC = () => {
  const { user, currentLanguage, logout } = useAuthStore();
  const { activeRole, switchRole } = useRoleStore();

  const isBuyer = activeRole === 'BUYER';

  return (
    <div style={{ paddingBottom: 90, display: 'flex', flexDirection: 'column', gap: 16 }}>
      {/* User & Company Header Card */}
      <div
        style={{
          background: 'rgba(17, 24, 39, 0.85)',
          border: '1px solid rgba(255, 255, 255, 0.12)',
          borderRadius: 20,
          padding: 18,
          display: 'flex',
          flexDirection: 'column',
          gap: 14,
          boxShadow: '0 8px 30px rgba(0, 0, 0, 0.4)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <img
            src={user?.avatar}
            alt={user?.name}
            style={{
              width: 60,
              height: 60,
              borderRadius: 30,
              objectFit: 'cover',
              border: '2px solid #2563EB',
            }}
          />
          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <h3 style={{ fontSize: 18, fontWeight: 800, color: '#F9FAFB' }}>{user?.name}</h3>
              <span
                style={{
                  fontSize: 10,
                  fontWeight: 800,
                  padding: '2px 6px',
                  borderRadius: 6,
                  background: 'rgba(16, 185, 129, 0.2)',
                  color: '#34D399',
                  border: '1px solid rgba(16, 185, 129, 0.3)',
                }}
              >
                {user?.kycStatus}
              </span>
            </div>
            <div style={{ fontSize: 13, color: '#9CA3AF', marginTop: 2 }}>{user?.companyName}</div>
            <div style={{ fontSize: 11, color: '#6B7280', marginTop: 2 }}>GST: {user?.gstNumber}</div>
          </div>
        </div>

        {/* Unified Dynamic Role Switcher Section */}
        <div
          style={{
            background: 'rgba(31, 41, 55, 0.6)',
            borderRadius: 14,
            padding: 12,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <div>
            <div style={{ fontSize: 11, fontWeight: 700, color: '#9CA3AF', textTransform: 'uppercase' }}>
              Active Operating Mode
            </div>
            <div style={{ fontSize: 13, fontWeight: 800, color: isBuyer ? '#60A5FA' : '#34D399' }}>
              {isBuyer ? 'Buyer Account Active' : 'Supplier Account Active'}
            </div>
          </div>

          <RoleSwitcherToggle />
        </div>
      </div>

      {/* Escrow Wallet Card */}
      <div
        style={{
          background: 'linear-gradient(135deg, rgba(37, 99, 235, 0.2) 0%, rgba(16, 185, 129, 0.15) 100%)',
          border: '1px solid rgba(255, 255, 255, 0.15)',
          borderRadius: 18,
          padding: 16,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div
            style={{
              width: 42,
              height: 42,
              borderRadius: 12,
              background: '#2563EB',
              color: '#FFF',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Wallet size={20} />
          </div>
          <div>
            <div style={{ fontSize: 11, color: '#9CA3AF' }}>Escrow Protected Wallet</div>
            <div style={{ fontSize: 20, fontWeight: 800, color: '#F9FAFB' }}>
              ${user?.walletBalance.toLocaleString()}
            </div>
          </div>
        </div>

        <button
          style={{
            background: '#FFF',
            color: '#1E40AF',
            border: 'none',
            borderRadius: 10,
            padding: '8px 14px',
            fontSize: 12,
            fontWeight: 800,
            cursor: 'pointer',
          }}
        >
          Add Funds
        </button>
      </div>

      {/* Account Settings List */}
      <div
        style={{
          background: 'rgba(17, 24, 39, 0.8)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          borderRadius: 18,
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        {[
          { label: 'KYC & GST Documentation', sub: 'Verified Tier 1 Corporate', icon: FileCheck },
          { label: 'App Language', sub: currentLanguage, icon: Globe },
          { label: 'Security & Biometrics', sub: '2FA Enabled', icon: Settings },
          { label: 'Enterprise Help & Support', sub: '24/7 B2B Concierge', icon: HelpCircle },
        ].map((item, idx) => {
          const Icon = item.icon;
          return (
            <div
              key={idx}
              style={{
                padding: 14,
                borderBottom: idx !== 3 ? '1px solid rgba(255, 255, 255, 0.08)' : 'none',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                cursor: 'pointer',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <Icon size={18} color="#60A5FA" />
                <div>
                  <div style={{ fontSize: 13, fontWeight: 700, color: '#F3F4F6' }}>{item.label}</div>
                  <div style={{ fontSize: 11, color: '#9CA3AF' }}>{item.sub}</div>
                </div>
              </div>
              <ChevronRight size={16} color="#6B7280" />
            </div>
          );
        })}
      </div>

      {/* Logout Button */}
      <button
        onClick={logout}
        style={{
          background: 'rgba(239, 68, 68, 0.15)',
          border: '1px solid rgba(239, 68, 68, 0.3)',
          color: '#F87171',
          borderRadius: 14,
          padding: '12px 0',
          fontSize: 13,
          fontWeight: 800,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 8,
          cursor: 'pointer',
        }}
      >
        <LogOut size={16} />
        <span>Log Out Account</span>
      </button>
    </div>
  );
};
