import React from 'react';
import { useAuthStore } from '../../store/useAuthStore';
import { useRoleStore } from '../../store/useRoleStore';
import { RoleSwitcherToggle } from './RoleSwitcherToggle';
import { MapPin, Bell, Search, ShieldCheck, Zap } from 'lucide-react';
import { COLORS } from '../../theme/tokens';

interface HeaderBarProps {
  onOpenNotifications: () => void;
  onOpenSearch: () => void;
}

export const HeaderBar: React.FC<HeaderBarProps> = ({ onOpenNotifications, onOpenSearch }) => {
  const { user } = useAuthStore();
  const { activeRole } = useRoleStore();

  const isBuyer = activeRole === 'BUYER';

  return (
    <header
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 90,
        background: 'rgba(9, 13, 22, 0.88)',
        backdropFilter: 'blur(16px)',
        borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
        padding: '12px 16px',
        display: 'flex',
        flexDirection: 'column',
        gap: 10,
      }}
    >
      {/* Top Header Row */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        {/* Brand & Role Badge */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div
            style={{
              width: 38,
              height: 38,
              borderRadius: 12,
              background: isBuyer
                ? 'linear-gradient(135deg, #2563EB 0%, #1E40AF 100%)'
                : 'linear-gradient(135deg, #059669 0%, #047857 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: isBuyer ? '0 0 16px rgba(37, 99, 235, 0.4)' : '0 0 16px rgba(16, 185, 129, 0.4)',
              color: '#FFF',
              fontWeight: 800,
              fontSize: 18,
            }}
          >
            K
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <span style={{ fontSize: 16, fontWeight: 800, color: '#F9FAFB', letterSpacing: '-0.3px' }}>
                KFPL Marketplace
              </span>
              <span
                style={{
                  fontSize: 10,
                  fontWeight: 700,
                  padding: '2px 6px',
                  borderRadius: 6,
                  background: isBuyer ? 'rgba(59, 130, 246, 0.2)' : 'rgba(16, 185, 129, 0.2)',
                  color: isBuyer ? '#60A5FA' : '#34D399',
                  border: isBuyer ? '1px solid rgba(59, 130, 246, 0.3)' : '1px solid rgba(16, 185, 129, 0.3)',
                }}
              >
                {isBuyer ? 'BUYER' : 'SUPPLIER'}
              </span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginTop: 2 }}>
              <MapPin size={11} color="#9CA3AF" />
              <span style={{ fontSize: 11, color: '#9CA3AF' }}>
                {user?.location.city}, {user?.location.country}
              </span>
            </div>
          </div>
        </div>

        {/* Right Header Actions */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <RoleSwitcherToggle compact />

          <button
            onClick={onOpenNotifications}
            style={{
              width: 36,
              height: 36,
              borderRadius: 18,
              background: 'rgba(31, 41, 55, 0.7)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              position: 'relative',
              cursor: 'pointer',
              color: '#F3F4F6',
            }}
          >
            <Bell size={18} />
            <span
              style={{
                position: 'absolute',
                top: 6,
                right: 6,
                width: 8,
                height: 8,
                borderRadius: 4,
                background: '#EF4444',
              }}
            />
          </button>
        </div>
      </div>

      {/* Global Quick Search Bar Trigger (Only in Buyer view) */}
      {isBuyer && (
        <div
          onClick={onOpenSearch}
          style={{
            background: 'rgba(17, 24, 39, 0.75)',
            border: '1px solid rgba(255, 255, 255, 0.12)',
            borderRadius: 14,
            padding: '10px 14px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            cursor: 'pointer',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <Search size={16} color="#60A5FA" />
            <span style={{ fontSize: 13, color: '#9CA3AF' }}>
              Search 200,000+ Verified Machinery, Solar & Metals...
            </span>
          </div>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 4,
              fontSize: 10,
              background: 'rgba(59, 130, 246, 0.15)',
              color: '#60A5FA',
              padding: '3px 8px',
              borderRadius: 6,
              fontWeight: 600,
            }}
          >
            <Zap size={10} />
            AI Search
          </div>
        </div>
      )}
    </header>
  );
};
