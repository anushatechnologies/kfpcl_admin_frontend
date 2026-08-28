import React, { useState } from 'react';
import { useAdminStore } from '../../../store/useAdminStore';
import {
  Settings,
  CreditCard,
  ShieldCheck,
  Bell,
  Save,
  Server,
  Globe,
  CheckCircle2,
} from 'lucide-react';

export const AdminSettingsView: React.FC = () => {
  const { currency, setCurrency } = useAdminStore();
  const [platformFee, setPlatformFee] = useState('2.5');
  const [escrowDays, setEscrowDays] = useState('7');
  const [autoApproveGst, setAutoApproveGst] = useState(true);
  const [allowGuestExplore, setAllowGuestExplore] = useState(true);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2000);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h3 style={{ fontSize: 18, fontWeight: 800, color: '#FFF' }}>Platform Policies & Marketplace Configuration</h3>
          <p style={{ fontSize: 12, color: '#9CA3AF', marginTop: 2 }}>
            Manage escrow take-rates, default currency standards, KYC rules, and payment integrations.
          </p>
        </div>

        {savedSuccess && (
          <div style={{ background: 'rgba(16, 185, 129, 0.2)', color: '#34D399', padding: '6px 12px', borderRadius: 8, fontSize: 12, fontWeight: 700, display: 'flex', alignItems: 'center', gap: 6 }}>
            <CheckCircle2 size={14} />
            <span>Settings Saved!</span>
          </div>
        )}
      </div>

      <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        {/* Commission & Escrow */}
        <div style={{ background: 'rgba(17, 24, 39, 0.75)', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: 14, padding: 18, display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <CreditCard size={18} color="#3B82F6" />
            <h4 style={{ fontSize: 15, fontWeight: 800, color: '#FFF' }}>Commission & Currency Engine</h4>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12 }}>
            <div>
              <label style={{ fontSize: 11, fontWeight: 700, color: '#9CA3AF', marginBottom: 4, display: 'block' }}>Default Marketplace Currency</label>
              <select value={currency} onChange={(e) => setCurrency(e.target.value as any)} style={{ width: '100%', background: '#1F2937', border: '1px solid rgba(255, 255, 255, 0.15)', borderRadius: 8, padding: 8, color: '#FFF', fontSize: 12, fontWeight: 700 }}>
                <option value="INR">₹ INR (Indian Rupee)</option>
                <option value="USD">$ USD (US Dollar)</option>
              </select>
            </div>

            <div>
              <label style={{ fontSize: 11, fontWeight: 700, color: '#9CA3AF', marginBottom: 4, display: 'block' }}>Platform Take-Rate Fee (%)</label>
              <input type="number" step="0.1" value={platformFee} onChange={(e) => setPlatformFee(e.target.value)} style={{ width: '100%', background: 'rgba(31, 41, 55, 0.8)', border: '1px solid rgba(255, 255, 255, 0.15)', borderRadius: 8, padding: 8, color: '#FFF', fontSize: 12 }} />
            </div>

            <div>
              <label style={{ fontSize: 11, fontWeight: 700, color: '#9CA3AF', marginBottom: 4, display: 'block' }}>Escrow Release Window (Days)</label>
              <input type="number" value={escrowDays} onChange={(e) => setEscrowDays(e.target.value)} style={{ width: '100%', background: 'rgba(31, 41, 55, 0.8)', border: '1px solid rgba(255, 255, 255, 0.15)', borderRadius: 8, padding: 8, color: '#FFF', fontSize: 12 }} />
            </div>
          </div>
        </div>

        {/* KYC Compliance */}
        <div style={{ background: 'rgba(17, 24, 39, 0.75)', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: 14, padding: 18, display: 'flex', flexDirection: 'column', gap: 10 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <ShieldCheck size={18} color="#10B981" />
            <h4 style={{ fontSize: 15, fontWeight: 800, color: '#FFF' }}>GSTIN & KYC Compliance Governance</h4>
          </div>

          <label style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer' }}>
            <input type="checkbox" checked={autoApproveGst} onChange={(e) => setAutoApproveGst(e.target.checked)} style={{ accentColor: '#10B981', width: 16, height: 16 }} />
            <span style={{ fontSize: 12, color: '#E5E7EB' }}>Auto-verify GSTIN numbers against GST Portal Public API</span>
          </label>

          <label style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer' }}>
            <input type="checkbox" checked={allowGuestExplore} onChange={(e) => setAllowGuestExplore(e.target.checked)} style={{ accentColor: '#10B981', width: 16, height: 16 }} />
            <span style={{ fontSize: 12, color: '#E5E7EB' }}>Allow unauthenticated buyers to browse wholesale prices</span>
          </label>
        </div>

        <button
          type="submit"
          style={{
            background: 'linear-gradient(135deg, #2563EB 0%, #1D4ED8 100%)',
            color: '#FFF',
            border: 'none',
            borderRadius: 10,
            padding: '12px 20px',
            fontSize: 13,
            fontWeight: 800,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 8,
          }}
        >
          <Save size={15} />
          <span>Save Marketplace Configuration</span>
        </button>
      </form>
    </div>
  );
};
