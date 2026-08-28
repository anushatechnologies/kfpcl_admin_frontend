import React from 'react';

export interface TabItem {
  id: string;
  label: string;
  badge?: number | string;
  disabled?: boolean;
}

interface PageTabsProps {
  tabs: TabItem[];
  activeTabId: string;
  onChangeTab: (id: string) => void;
  theme?: 'light' | 'dark';
}

export const PageTabs: React.FC<PageTabsProps> = ({
  tabs,
  activeTabId,
  onChangeTab,
  theme = 'dark',
}) => {
  const isDark = theme === 'dark';

  return (
    <div
      style={{
        display: 'flex',
        gap: 6,
        background: isDark ? 'rgba(31, 41, 55, 0.8)' : 'rgba(229, 231, 235, 0.8)',
        padding: 4,
        borderRadius: 12,
        border: `1px solid ${isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.08)'}`,
        overflowX: 'auto',
        width: 'fit-content',
        maxWidth: '100%',
        scrollbarWidth: 'none', // hide firefox scrollbar
        msOverflowStyle: 'none', // hide ie scrollbar
      }}
      className="hide-scrollbar"
    >
      {tabs.map((tab) => {
        const isActive = activeTabId === tab.id;
        const isDisabled = tab.disabled;

        return (
          <button
            key={tab.id}
            onClick={() => {
              if (!isDisabled) onChangeTab(tab.id);
            }}
            disabled={isDisabled}
            style={{
              background: isActive
                ? isDark
                  ? '#2563EB'
                  : '#1D4ED8'
                : 'transparent',
              color: isActive
                ? '#FFF'
                : isDisabled
                ? isDark
                  ? '#4B5563'
                  : '#9CA3AF'
                : isDark
                ? '#9CA3AF'
                : '#4B5563',
              border: 'none',
              borderRadius: 8,
              padding: '7px 16px',
              fontSize: 12,
              fontWeight: 700,
              cursor: isDisabled ? 'not-allowed' : 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              whiteSpace: 'nowrap',
              transition: 'all 0.15s ease',
              opacity: isDisabled ? 0.5 : 1,
            }}
          >
            <span>{tab.label}</span>
            {tab.badge !== undefined && tab.badge !== '' && (
              <span
                style={{
                  fontSize: 10,
                  fontWeight: 800,
                  padding: '1px 6px',
                  borderRadius: 10,
                  background: isActive
                    ? 'rgba(255, 255, 255, 0.25)'
                    : isDark
                    ? 'rgba(255, 255, 255, 0.1)'
                    : 'rgba(0, 0, 0, 0.08)',
                  color: isActive
                    ? '#FFF'
                    : isDark
                    ? '#9CA3AF'
                    : '#4B5563',
                }}
              >
                {tab.badge}
              </span>
            )}
          </button>
        );
      })}

      <style>{`
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  );
};
