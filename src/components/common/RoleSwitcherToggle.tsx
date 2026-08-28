import React from 'react';
import { useRoleStore } from '../../store/useRoleStore';
import { ShoppingBag, Store, ArrowLeftRight } from 'lucide-react';
import { COLORS } from '../../theme/tokens';

interface Props {
  compact?: boolean;
}

export const RoleSwitcherToggle: React.FC<Props> = ({ compact = false }) => {
  const { activeRole, switchRole, userRoleType } = useRoleStore();

  if (userRoleType !== 'BUYER_SUPPLIER') {
    return null;
  }

  const isBuyer = activeRole === 'BUYER';

  return (
    <div
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        background: 'rgba(17, 24, 39, 0.85)',
        border: '1px solid rgba(255, 255, 255, 0.12)',
        borderRadius: 24,
        padding: 3,
        boxShadow: '0 4px 14px rgba(0, 0, 0, 0.35)',
        backdropFilter: 'blur(12px)',
      }}
    >
      <button
        onClick={() => switchRole('BUYER')}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 6,
          padding: compact ? '5px 10px' : '6px 14px',
          borderRadius: 20,
          border: 'none',
          background: isBuyer ? 'linear-gradient(135deg, #2563EB 0%, #1D4ED8 100%)' : 'transparent',
          color: isBuyer ? '#FFFFFF' : '#9CA3AF',
          fontSize: compact ? 12 : 13,
          fontWeight: 600,
          cursor: 'pointer',
          transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
        }}
      >
        <ShoppingBag size={14} color={isBuyer ? '#FFFFFF' : '#9CA3AF'} />
        <span>Buyer Mode</span>
      </button>

      <button
        onClick={() => switchRole('SUPPLIER')}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 6,
          padding: compact ? '5px 10px' : '6px 14px',
          borderRadius: 20,
          border: 'none',
          background: !isBuyer ? 'linear-gradient(135deg, #059669 0%, #10B981 100%)' : 'transparent',
          color: !isBuyer ? '#FFFFFF' : '#9CA3AF',
          fontSize: compact ? 12 : 13,
          fontWeight: 600,
          cursor: 'pointer',
          transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
        }}
      >
        <Store size={14} color={!isBuyer ? '#FFFFFF' : '#9CA3AF'} />
        <span>Supplier Mode</span>
      </button>
    </div>
  );
};
