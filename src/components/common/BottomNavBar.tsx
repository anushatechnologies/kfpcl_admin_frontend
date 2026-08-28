import React from 'react';
import { useRoleStore } from '../../store/useRoleStore';
import { useRFQStore } from '../../store/useRFQStore';
import { useChatStore } from '../../store/useChatStore';
import {
  Home,
  Compass,
  FileText,
  MessageSquare,
  Package,
  User,
  LayoutDashboard,
  Boxes,
  Target,
  ClipboardList,
} from 'lucide-react';
import { COLORS } from '../../theme/tokens';

export type TabType =
  | 'HOME'
  | 'EXPLORE'
  | 'RFQ'
  | 'MESSAGES'
  | 'ORDERS'
  | 'PROFILE'
  | 'DASHBOARD'
  | 'PRODUCTS'
  | 'LEADS';

interface Props {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
}

export const BottomNavBar: React.FC<Props> = ({ activeTab, onTabChange }) => {
  const { activeRole } = useRoleStore();
  const { rfqs } = useRFQStore();
  const { conversations } = useChatStore();

  const isBuyer = activeRole === 'BUYER';

  // Calculate unread chat badge
  const unreadChatCount = conversations.reduce((acc, c) => acc + c.unreadCount, 0);

  // Buyer navigation tabs
  const buyerTabs = [
    { id: 'HOME' as TabType, label: 'Home', icon: Home },
    { id: 'EXPLORE' as TabType, label: 'Explore', icon: Compass },
    { id: 'RFQ' as TabType, label: 'RFQ Desk', icon: FileText, badge: rfqs.length },
    { id: 'MESSAGES' as TabType, label: 'Messages', icon: MessageSquare, badge: unreadChatCount },
    { id: 'ORDERS' as TabType, label: 'Orders', icon: Package },
    { id: 'PROFILE' as TabType, label: 'Profile', icon: User },
  ];

  // Supplier navigation tabs
  const supplierTabs = [
    { id: 'DASHBOARD' as TabType, label: 'Dashboard', icon: LayoutDashboard },
    { id: 'PRODUCTS' as TabType, label: 'Products', icon: Boxes },
    { id: 'LEADS' as TabType, label: 'Leads', icon: Target, badge: 3 },
    { id: 'ORDERS' as TabType, label: 'Orders', icon: ClipboardList },
    { id: 'MESSAGES' as TabType, label: 'Messages', icon: MessageSquare, badge: unreadChatCount },
    { id: 'PROFILE' as TabType, label: 'Profile', icon: User },
  ];

  const currentTabs = isBuyer ? buyerTabs : supplierTabs;

  return (
    <nav
      style={{
        position: 'fixed',
        bottom: 0,
        left: '50%',
        transform: 'translateX(-50%)',
        width: '100%',
        maxWidth: 500,
        zIndex: 99,
        background: 'rgba(11, 15, 23, 0.95)',
        backdropFilter: 'blur(20px)',
        borderTop: '1px solid rgba(255, 255, 255, 0.1)',
        padding: '8px 12px 14px 12px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-around',
        boxShadow: '0 -10px 30px rgba(0, 0, 0, 0.5)',
      }}
    >
      {currentTabs.map((tab) => {
        const IconComponent = tab.icon;
        const isActive = activeTab === tab.id;
        const accentColor = isBuyer ? '#3B82F6' : '#10B981';

        return (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            style={{
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 4,
              border: 'none',
              background: 'transparent',
              color: isActive ? accentColor : '#9CA3AF',
              cursor: 'pointer',
              position: 'relative',
              padding: '4px 0',
              transition: 'all 0.2s ease',
            }}
          >
            <div style={{ position: 'relative' }}>
              <IconComponent size={20} color={isActive ? accentColor : '#9CA3AF'} />
              {tab.badge !== undefined && tab.badge > 0 && (
                <span
                  style={{
                    position: 'absolute',
                    top: -4,
                    right: -8,
                    background: isBuyer ? '#EF4444' : '#F59E0B',
                    color: '#FFF',
                    fontSize: 9,
                    fontWeight: 700,
                    borderRadius: 10,
                    padding: '1px 5px',
                    minWidth: 14,
                    textAlign: 'center',
                  }}
                >
                  {tab.badge}
                </span>
              )}
            </div>

            <span
              style={{
                fontSize: 10,
                fontWeight: isActive ? 700 : 500,
                letterSpacing: '-0.2px',
              }}
            >
              {tab.label}
            </span>

            {/* Active Pill Indicator */}
            {isActive && (
              <div
                style={{
                  position: 'absolute',
                  bottom: -6,
                  width: 16,
                  height: 3,
                  borderRadius: 2,
                  background: accentColor,
                  boxShadow: `0 0 8px ${accentColor}`,
                }}
              />
            )}
          </button>
        );
      })}
    </nav>
  );
};
