import React from 'react';
import { AlertCircle, FileQuestion, RefreshCw } from 'lucide-react';

// Central Theme-Aware Skeletons & Feedback States

interface StateProps {
  theme?: 'light' | 'dark';
}

export const PageLoader: React.FC<StateProps> = ({ theme = 'dark' }) => {
  const isDark = theme === 'dark';
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 40,
        height: '100%',
        minHeight: 300,
        gap: 12,
      }}
    >
      <div
        className="animate-spin"
        style={{
          width: 32,
          height: 32,
          borderRadius: '50%',
          border: '3px solid rgba(59, 130, 246, 0.2)',
          borderTopColor: '#2563EB',
          animation: 'spin 1s linear infinite',
        }}
      />
      <span style={{ fontSize: 13, color: isDark ? '#9CA3AF' : '#4B5563', fontWeight: 600 }}>
        Synchronizing Platform Ledger...
      </span>
      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export const CardSkeleton: React.FC<StateProps> = ({ theme = 'dark' }) => {
  const isDark = theme === 'dark';
  return (
    <div
      style={{
        background: isDark ? 'rgba(31, 41, 55, 0.6)' : 'rgba(243, 244, 246, 0.8)',
        border: `1px solid ${isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.08)'}`,
        borderRadius: 14,
        padding: 16,
        display: 'flex',
        flexDirection: 'column',
        gap: 10,
        animation: 'pulse 1.8s infinite ease-in-out',
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ width: 80, height: 12, background: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)', borderRadius: 4 }} />
        <div style={{ width: 24, height: 24, background: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)', borderRadius: 6 }} />
      </div>
      <div style={{ width: 120, height: 24, background: isDark ? 'rgba(255,255,255,0.12)' : 'rgba(0,0,0,0.12)', borderRadius: 6 }} />
      <div style={{ width: 60, height: 10, background: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)', borderRadius: 4 }} />
      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 0.6; }
          50% { opacity: 1; }
        }
      `}</style>
    </div>
  );
};

export const TableSkeleton: React.FC<StateProps> = ({ theme = 'dark' }) => {
  const isDark = theme === 'dark';
  return (
    <div
      style={{
        background: isDark ? 'rgba(17, 24, 39, 0.75)' : 'rgba(255, 255, 255, 0.85)',
        border: `1px solid ${isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.08)'}`,
        borderRadius: 16,
        padding: 16,
        display: 'flex',
        flexDirection: 'column',
        gap: 12,
        animation: 'pulse 1.8s infinite ease-in-out',
      }}
    >
      <div style={{ display: 'flex', gap: 12, borderBottom: `1px solid ${isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)'}`, paddingBottom: 10 }}>
        {[...Array(5)].map((_, i) => (
          <div key={i} style={{ flex: 1, height: 12, background: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)', borderRadius: 4 }} />
        ))}
      </div>
      {[...Array(4)].map((_, idx) => (
        <div key={idx} style={{ display: 'flex', gap: 12, alignItems: 'center', padding: '6px 0' }}>
          {[...Array(5)].map((_, cellIdx) => (
            <div key={cellIdx} style={{ flex: 1, height: 14, background: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)', borderRadius: 4 }} />
          ))}
        </div>
      ))}
    </div>
  );
};

export const ChartSkeleton: React.FC<StateProps> = ({ theme = 'dark' }) => {
  const isDark = theme === 'dark';
  return (
    <div
      style={{
        background: isDark ? 'rgba(17, 24, 39, 0.75)' : 'rgba(255, 255, 255, 0.85)',
        border: `1px solid ${isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.08)'}`,
        borderRadius: 16,
        padding: 20,
        height: 260,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        animation: 'pulse 1.8s infinite ease-in-out',
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <div style={{ width: 140, height: 14, background: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)', borderRadius: 4 }} />
        <div style={{ width: 80, height: 12, background: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)', borderRadius: 4 }} />
      </div>
      <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', height: 140 }}>
        {[...Array(6)].map((_, i) => (
          <div key={i} style={{ width: 32, height: `${20 + i * 15}%`, background: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)', borderRadius: '4px 4px 0 0' }} />
        ))}
      </div>
    </div>
  );
};

export const ContentSkeleton: React.FC<StateProps> = ({ theme = 'dark' }) => {
  const isDark = theme === 'dark';
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 14, animation: 'pulse 1.8s infinite ease-in-out' }}>
      <div style={{ width: '40%', height: 20, background: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)', borderRadius: 6 }} />
      <div style={{ width: '80%', height: 14, background: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)', borderRadius: 4 }} />
      <div style={{ width: '60%', height: 14, background: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)', borderRadius: 4 }} />
    </div>
  );
};

interface ErrorProps extends StateProps {
  message?: string;
  onRetry?: () => void;
}

export const ErrorState: React.FC<ErrorProps> = ({ theme = 'dark', message = "We couldn't load this information.", onRetry }) => {
  const isDark = theme === 'dark';
  return (
    <div
      style={{
        background: isDark ? 'rgba(239, 68, 68, 0.08)' : 'rgba(239, 68, 68, 0.05)',
        border: `1px solid ${isDark ? 'rgba(239, 68, 68, 0.25)' : 'rgba(239, 68, 68, 0.15)'}`,
        borderRadius: 14,
        padding: 24,
        textAlign: 'center',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 12,
        maxWidth: 400,
        margin: '20px auto',
      }}
    >
      <AlertCircle size={32} color="#EF4444" />
      <div>
        <h4 style={{ fontSize: 15, fontWeight: 800, color: isDark ? '#FFF' : '#111827' }}>Something went wrong</h4>
        <p style={{ fontSize: 12, color: isDark ? '#9CA3AF' : '#4B5563', marginTop: 4, lineHeight: '1.4' }}>{message}</p>
      </div>
      {onRetry && (
        <button
          onClick={onRetry}
          style={{
            background: '#EF4444',
            color: '#FFF',
            border: 'none',
            borderRadius: 8,
            padding: '8px 16px',
            fontSize: 12,
            fontWeight: 700,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: 6,
          }}
        >
          <RefreshCw size={13} />
          <span>Try Again</span>
        </button>
      )}
    </div>
  );
};

interface EmptyProps extends StateProps {
  message?: string;
}

export const EmptyState: React.FC<EmptyProps> = ({ theme = 'dark', message = 'No data available for the current filters.' }) => {
  const isDark = theme === 'dark';
  return (
    <div
      style={{
        background: isDark ? 'rgba(17, 24, 39, 0.5)' : 'rgba(243, 244, 246, 0.6)',
        border: `1px solid ${isDark ? 'rgba(255, 255, 255, 0.06)' : 'rgba(0, 0, 0, 0.06)'}`,
        borderRadius: 14,
        padding: 30,
        textAlign: 'center',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 10,
        maxWidth: 380,
        margin: '20px auto',
      }}
    >
      <FileQuestion size={32} color={isDark ? '#4B5563' : '#9CA3AF'} />
      <div>
        <h4 style={{ fontSize: 14, fontWeight: 700, color: isDark ? '#E5E7EB' : '#374151' }}>No Records Found</h4>
        <p style={{ fontSize: 12, color: isDark ? '#9CA3AF' : '#6B7280', marginTop: 4 }}>{message}</p>
      </div>
    </div>
  );
};
