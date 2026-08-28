import React, { useState } from 'react';
import {
  Settings,
  Shield,
  CreditCard,
  Bell,
  Globe,
  Lock,
  Database,
  CheckCircle2,
  Save,
  Server,
  Zap,
} from 'lucide-react';

export const AdminSettings: React.FC = () => {
  const [platformFee, setPlatformFee] = useState('2.5');
  const [escrowHoldDays, setEscrowHoldDays] = useState('7');
  const [autoApproveGst, setAutoApproveGst] = useState(true);
  const [allowGuestBrowse, setAllowGuestBrowse] = useState(true);
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [smsAlerts, setSmsAlerts] = useState(true);
  const [maintenanceMode, setMaintenanceMode] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2000);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <h1 style={{ fontSize: 24, fontWeight: 800, color: '#F9FAFB' }}>Platform Administration & Policies</h1>
          <p style={{ fontSize: 13, color: '#9CA3AF', marginTop: 2 }}>
            Configure escrow commissions, KYC compliance requirements, integrations, and server status
          </p>
        </div>

        {savedSuccess && (
          <div
            style={{
              background: 'rgba(16, 185, 129, 0.2)',
              border: '1px solid rgba(16, 185, 129, 0.4)',
              color: '#34D399',
              padding: '6px 14px',
              borderRadius: 8,
              fontSize: 12,
              fontWeight: 700,
              display: 'flex',
              alignItems: 'center',
              gap: 6,
            }}
          >
            <CheckCircle2 size={14} />
            <span>Settings Saved Successfully!</span>
          </div>
        )}
      </div>

      <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        {/* Marketplace Commission & Escrow */}
        <div
          style={{
            background: 'rgba(17, 24, 39, 0.75)',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            borderRadius: 16,
            padding: 20,
            display: 'flex',
            flexDirection: 'column',
            gap: 14,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <CreditCard size={20} color="#3B82F6" />
            <h3 style={{ fontSize: 16, fontWeight: 800, color: '#F9FAFB' }}>Commission & Escrow Protocol</h3>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
            <div>
              <label style={{ fontSize: 12, fontWeight: 700, color: '#9CA3AF', marginBottom: 4, display: 'block' }}>
                Platform Take-Rate Fee (%)
              </label>
              <input
                type="number"
                step="0.1"
                value={platformFee}
                onChange={(e) => setPlatformFee(e.target.value)}
                style={{
                  width: '100%',
                  background: 'rgba(31, 41, 55, 0.8)',
                  border: '1px solid rgba(255, 255, 255, 0.12)',
                  borderRadius: 10,
                  padding: 10,
                  color: '#FFF',
                  fontSize: 14,
                }}
              />
              <span style={{ fontSize: 11, color: '#6B7280', marginTop: 4, display: 'block' }}>
                Deducted automatically from supplier payout upon buyer delivery sign-off.
              </span>
            </div>

            <div>
              <label style={{ fontSize: 12, fontWeight: 700, color: '#9CA3AF', marginBottom: 4, display: 'block' }}>
                Escrow Auto-Release Window (Days)
              </label>
              <input
                type="number"
                value={escrowHoldDays}
                onChange={(e) => setEscrowHoldDays(e.target.value)}
                style={{
                  width: '100%',
                  background: 'rgba(31, 41, 55, 0.8)',
                  border: '1px solid rgba(255, 255, 255, 0.12)',
                  borderRadius: 10,
                  padding: 10,
                  color: '#FFF',
                  fontSize: 14,
                }}
              />
              <span style={{ fontSize: 11, color: '#6B7280', marginTop: 4, display: 'block' }}>
                Days after carrier delivery confirmation before funds disburse if no dispute is opened.
              </span>
            </div>
          </div>
        </div>

        {/* KYC Compliance & Verification */}
        <div
          style={{
            background: 'rgba(17, 24, 39, 0.75)',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            borderRadius: 16,
            padding: 20,
            display: 'flex',
            flexDirection: 'column',
            gap: 14,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <Shield size={20} color="#10B981" />
            <h3 style={{ fontSize: 16, fontWeight: 800, color: '#F9FAFB' }}>KYC & GST Onboarding Governance</h3>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: 12, cursor: 'pointer' }}>
              <input
                type="checkbox"
                checked={autoApproveGst}
                onChange={(e) => setAutoApproveGst(e.target.checked)}
                style={{ width: 18, height: 18, accentColor: '#10B981' }}
              />
              <div>
                <div style={{ fontSize: 13, fontWeight: 700, color: '#FFF' }}>Instant GST Verification API</div>
                <div style={{ fontSize: 11, color: '#9CA3AF' }}>Validate GSTIN format and state active filing via official portal hook.</div>
              </div>
            </label>

            <label style={{ display: 'flex', alignItems: 'center', gap: 12, cursor: 'pointer' }}>
              <input
                type="checkbox"
                checked={allowGuestBrowse}
                onChange={(e) => setAllowGuestBrowse(e.target.checked)}
                style={{ width: 18, height: 18, accentColor: '#10B981' }}
              />
              <div>
                <div style={{ fontSize: 13, fontWeight: 700, color: '#FFF' }}>Allow Unauthenticated Catalog Exploration</div>
                <div style={{ fontSize: 11, color: '#9CA3AF' }}>Allow guest users to browse catalog before OTP registration prompt.</div>
              </div>
            </label>
          </div>
        </div>

        {/* System & Notification Alerts */}
        <div
          style={{
            background: 'rgba(17, 24, 39, 0.75)',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            borderRadius: 16,
            padding: 20,
            display: 'flex',
            flexDirection: 'column',
            gap: 14,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <Bell size={20} color="#F59E0B" />
            <h3 style={{ fontSize: 16, fontWeight: 800, color: '#F9FAFB' }}>Notification & Dispatch Rules</h3>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer' }}>
              <input
                type="checkbox"
                checked={emailAlerts}
                onChange={(e) => setEmailAlerts(e.target.checked)}
                style={{ width: 18, height: 18, accentColor: '#F59E0B' }}
              />
              <span style={{ fontSize: 13, color: '#E5E7EB', fontWeight: 600 }}>Send Email Alerts on New Quotations</span>
            </label>

            <label style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer' }}>
              <input
                type="checkbox"
                checked={smsAlerts}
                onChange={(e) => setSmsAlerts(e.target.checked)}
                style={{ width: 18, height: 18, accentColor: '#F59E0B' }}
              />
              <span style={{ fontSize: 13, color: '#E5E7EB', fontWeight: 600 }}>Send SMS Alerts on High Value POs ($10K+)</span>
            </label>
          </div>
        </div>

        {/* Server & Environment Status */}
        <div
          style={{
            background: 'rgba(17, 24, 39, 0.75)',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            borderRadius: 16,
            padding: 20,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div
              style={{
                width: 38,
                height: 38,
                borderRadius: 10,
                background: 'rgba(16, 185, 129, 0.15)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#10B981',
              }}
            >
              <Server size={18} />
            </div>
            <div>
              <div style={{ fontSize: 13, fontWeight: 700, color: '#FFF' }}>KFPL Edge Gateway: Healthy (99.98% uptime)</div>
              <div style={{ fontSize: 11, color: '#9CA3AF' }}>Vite React + TypeScript + Zustand Store Synchronized</div>
            </div>
          </div>

          <button
            type="submit"
            style={{
              background: 'linear-gradient(135deg, #2563EB 0%, #1D4ED8 100%)',
              border: 'none',
              borderRadius: 10,
              padding: '10px 20px',
              color: '#FFF',
              fontSize: 13,
              fontWeight: 800,
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              cursor: 'pointer',
              boxShadow: '0 4px 14px rgba(37, 99, 235, 0.4)',
            }}
          >
            <Save size={15} />
            <span>Save Configuration</span>
          </button>
        </div>
      </form>
    </div>
  );
};
