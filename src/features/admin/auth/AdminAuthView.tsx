import React, { useState } from 'react';
import { useAdminStore, AdminAuthUser } from '../../../store/useAdminStore';
import {
  ShieldCheck,
  Lock,
  Mail,
  User,
  Phone,
  Eye,
  EyeOff,
  ArrowRight,
  Sparkles,
  Building2,
  KeyRound,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  X,
  Layers,
} from 'lucide-react';

interface Props {
  onSuccess?: () => void;
}

export const AdminAuthView: React.FC<Props> = ({ onSuccess }) => {
  const { login, signup } = useAdminStore();
  const [authMode, setAuthMode] = useState<'SIGN_IN' | 'SIGN_UP'>('SIGN_IN');

  // Sign In State
  const [signInEmail, setSignInEmail] = useState('rajesh.admin@kfpl.in');
  const [signInPassword, setSignInPassword] = useState('Admin@KFPL2026#');
  const [rememberMe, setRememberMe] = useState(true);
  const [showPassword, setShowPassword] = useState(false);

  // Sign Up State
  const [signUpName, setSignUpName] = useState('');
  const [signUpEmail, setSignUpEmail] = useState('');
  const [signUpPhone, setSignUpPhone] = useState('');
  const [signUpRole, setSignUpRole] = useState<AdminAuthUser['role']>('Super Admin');
  const [signUpDept, setSignUpDept] = useState('Executive Operations');
  const [signUpPassword, setSignUpPassword] = useState('');
  const [signUpConfirmPassword, setSignUpConfirmPassword] = useState('');
  const [securityKey, setSecurityKey] = useState('KFPL-ADMIN-2026');

  // UI state
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [forgotPasswordOpen, setForgotPasswordOpen] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const [resetSuccess, setResetSuccess] = useState(false);

  const handleSignIn = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    if (!signInEmail || !signInPassword) {
      setErrorMessage('Please fill in both email and password.');
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      login(signInEmail, signInPassword);
      if (onSuccess) onSuccess();
    }, 600);
  };

  const handleSignUp = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!signUpName || !signUpEmail || !signUpPassword) {
      setErrorMessage('Please complete all required fields.');
      return;
    }

    if (signUpPassword !== signUpConfirmPassword) {
      setErrorMessage('Passwords do not match. Please verify.');
      return;
    }

    if (securityKey.trim() !== 'KFPL-ADMIN-2026') {
      setErrorMessage('Invalid Master Authorization Security Key. (Demo key is KFPL-ADMIN-2026)');
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      signup({
        name: signUpName,
        email: signUpEmail,
        role: signUpRole,
        department: signUpDept,
      });
      if (onSuccess) onSuccess();
    }, 700);
  };

  const handleSendReset = (e: React.FormEvent) => {
    e.preventDefault();
    if (!resetEmail) return;
    setResetSuccess(true);
    setTimeout(() => {
      setResetSuccess(false);
      setForgotPasswordOpen(false);
    }, 2500);
  };

  return (
    <div
      style={{
        width: '100vw',
        height: '100vh',
        background: 'radial-gradient(ellipse at 50% 20%, #0F172A 0%, #060910 100%)',
        color: '#F9FAFB',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20,
        fontFamily: "'Plus Jakarta Sans', sans-serif",
        overflowY: 'auto',
      }}
    >
      {/* Background glowing orbs */}
      <div
        style={{
          position: 'fixed',
          top: '15%',
          left: '20%',
          width: 380,
          height: 380,
          borderRadius: 190,
          background: 'radial-gradient(circle, rgba(37, 99, 235, 0.18) 0%, rgba(37, 99, 235, 0) 70%)',
          filter: 'blur(50px)',
          pointerEvents: 'none',
        }}
      />
      <div
        style={{
          position: 'fixed',
          bottom: '15%',
          right: '20%',
          width: 400,
          height: 400,
          borderRadius: 200,
          background: 'radial-gradient(circle, rgba(16, 185, 129, 0.14) 0%, rgba(16, 185, 129, 0) 70%)',
          filter: 'blur(60px)',
          pointerEvents: 'none',
        }}
      />

      {/* Main Glassmorphic Auth Container */}
      <div
        style={{
          width: '100%',
          maxWidth: authMode === 'SIGN_IN' ? 480 : 540,
          background: 'rgba(15, 23, 42, 0.82)',
          backdropFilter: 'blur(24px)',
          border: '1px solid rgba(255, 255, 255, 0.12)',
          borderRadius: 24,
          padding: '32px 28px',
          boxShadow: '0 25px 60px rgba(0, 0, 0, 0.7)',
          position: 'relative',
          zIndex: 10,
          transition: 'all 0.3s ease',
        }}
      >
        {/* Brand Header */}
        <div style={{ textAlign: 'center', marginBottom: 24 }}>
          <div
            style={{
              width: 52,
              height: 52,
              borderRadius: 16,
              background: 'linear-gradient(135deg, #2563EB 0%, #10B981 100%)',
              color: '#FFF',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 26,
              fontWeight: 800,
              boxShadow: '0 8px 24px rgba(37, 99, 235, 0.45)',
              marginBottom: 12,
            }}
          >
            K
          </div>
          <h1 style={{ fontSize: 22, fontWeight: 800, color: '#F9FAFB', letterSpacing: '-0.3px' }}>
            KFPL Enterprise Admin Portal
          </h1>
          <p style={{ fontSize: 13, color: '#9CA3AF', marginTop: 4 }}>
            Secure B2B Marketplace Management & Governance
          </p>
        </div>

        {/* Tab Switcher: Sign In / Sign Up */}
        {false && <div
          style={{
            display: 'flex', background: 'rgba(31, 41, 55, 0.8)', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: 14, padding: 4, marginBottom: 20,
          }}
        >
          <button
            type="button"
            onClick={() => {
              setAuthMode('SIGN_IN');
              setErrorMessage('');
            }}
            style={{
              flex: 1,
              padding: '9px 0',
              borderRadius: 10,
              border: 'none',
              background: authMode === 'SIGN_IN' ? '#2563EB' : 'transparent',
              color: authMode === 'SIGN_IN' ? '#FFF' : '#9CA3AF',
              fontSize: 13,
              fontWeight: 700,
              cursor: 'pointer',
              transition: 'all 0.2s ease',
            }}
          >
            Sign In to Console
          </button>

          <button
            type="button"
            onClick={() => {
              setAuthMode('SIGN_UP');
              setErrorMessage('');
            }}
            style={{
              flex: 1,
              padding: '9px 0',
              borderRadius: 10,
              border: 'none',
              background: authMode === 'SIGN_UP' ? '#2563EB' : 'transparent',
              color: authMode === 'SIGN_UP' ? '#FFF' : '#9CA3AF',
              fontSize: 13,
              fontWeight: 700,
              cursor: 'pointer',
              transition: 'all 0.2s ease',
            }}
          >
            Register Administrator
          </button>
        </div>}

        {/* Error Notification */}
        {errorMessage && (
          <div
            style={{
              background: 'rgba(239, 68, 68, 0.15)',
              border: '1px solid rgba(239, 68, 68, 0.3)',
              borderRadius: 10,
              padding: '10px 14px',
              color: '#F87171',
              fontSize: 12,
              fontWeight: 600,
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              marginBottom: 16,
            }}
          >
            <AlertCircle size={15} />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* ─── TAB 1: SIGN IN FORM ────────────────────────────────────────── */}
        {authMode === 'SIGN_IN' && (
          <form onSubmit={handleSignIn} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div>
              <label style={{ fontSize: 12, fontWeight: 700, color: '#9CA3AF', marginBottom: 6, display: 'block' }}>
                Work Email / Admin ID
              </label>
              <div
                style={{
                  background: 'rgba(31, 41, 55, 0.8)',
                  border: '1px solid rgba(255, 255, 255, 0.12)',
                  borderRadius: 12,
                  padding: '10px 14px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 10,
                }}
              >
                <Mail size={16} color="#60A5FA" />
                <input
                  type="email"
                  value={signInEmail}
                  onChange={(e) => setSignInEmail(e.target.value)}
                  placeholder="admin@kfpl.in"
                  required
                  style={{
                    flex: 1,
                    background: 'transparent',
                    border: 'none',
                    color: '#FFF',
                    fontSize: 13,
                    outline: 'none',
                  }}
                />
              </div>
            </div>

            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                <label style={{ fontSize: 12, fontWeight: 700, color: '#9CA3AF' }}>Password</label>
                <button
                  type="button"
                  onClick={() => setForgotPasswordOpen(true)}
                  style={{ background: 'none', border: 'none', color: '#60A5FA', fontSize: 11, fontWeight: 600, cursor: 'pointer' }}
                >
                  Forgot Password?
                </button>
              </div>
              <div
                style={{
                  background: 'rgba(31, 41, 55, 0.8)',
                  border: '1px solid rgba(255, 255, 255, 0.12)',
                  borderRadius: 12,
                  padding: '10px 14px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 10,
                }}
              >
                <Lock size={16} color="#60A5FA" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={signInPassword}
                  onChange={(e) => setSignInPassword(e.target.value)}
                  placeholder="••••••••••••"
                  required
                  style={{
                    flex: 1,
                    background: 'transparent',
                    border: 'none',
                    color: '#FFF',
                    fontSize: 13,
                    outline: 'none',
                  }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{ background: 'none', border: 'none', color: '#9CA3AF', cursor: 'pointer', padding: 0 }}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 2 }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', fontSize: 12, color: '#D1D5DB' }}>
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  style={{ accentColor: '#2563EB', width: 15, height: 15 }}
                />
                <span>Remember session for 30 days</span>
              </label>

              <div style={{ display: 'flex', alignItems: 'center', gap: 4, color: '#10B981', fontSize: 11, fontWeight: 600 }}>
                <ShieldCheck size={13} />
                <span>2FA Protected</span>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              style={{
                width: '100%',
                background: 'linear-gradient(135deg, #2563EB 0%, #1D4ED8 100%)',
                color: '#FFF',
                border: 'none',
                borderRadius: 12,
                padding: '12px 0',
                fontSize: 14,
                fontWeight: 800,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 8,
                cursor: isLoading ? 'not-allowed' : 'pointer',
                boxShadow: '0 4px 18px rgba(37, 99, 235, 0.4)',
                marginTop: 6,
              }}
            >
              {isLoading ? (
                <span>Authenticating Credentials...</span>
              ) : (
                <>
                  <span>Sign In to Admin Console</span>
                  <ArrowRight size={16} />
                </>
              )}
            </button>

            {false && (<>
            {/* Demo login shortcuts removed. */}
            <div style={{ marginTop: 12 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                <div style={{ flex: 1, height: 1, background: 'rgba(255, 255, 255, 0.08)' }} />
                <span style={{ fontSize: 11, color: '#6B7280', fontWeight: 700, textTransform: 'uppercase' }}>
                  1-Click Demo Logins
                </span>
                <div style={{ flex: 1, height: 1, background: 'rgba(255, 255, 255, 0.08)' }} />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                <button
                  type="button"
                  onClick={() =>
                    undefined
                  }
                  style={{
                    background: 'rgba(37, 99, 235, 0.15)',
                    border: '1px solid rgba(37, 99, 235, 0.3)',
                    borderRadius: 10,
                    padding: '8px 10px',
                    color: '#93C5FD',
                    fontSize: 11,
                    fontWeight: 700,
                    cursor: 'pointer',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'flex-start',
                  }}
                >
                  <span>👑 Super Admin</span>
                  <span style={{ fontSize: 9, color: '#60A5FA', opacity: 0.8 }}>Full Control</span>
                </button>

                <button
                  type="button"
                  onClick={() =>
                    undefined
                  }
                  style={{
                    background: 'rgba(16, 185, 129, 0.15)',
                    border: '1px solid rgba(16, 185, 129, 0.3)',
                    borderRadius: 10,
                    padding: '8px 10px',
                    color: '#6EE7B7',
                    fontSize: 11,
                    fontWeight: 700,
                    cursor: 'pointer',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'flex-start',
                  }}
                >
                  <span>📦 Catalog Lead</span>
                  <span style={{ fontSize: 9, color: '#34D399', opacity: 0.8 }}>Approvals & Products</span>
                </button>

                <button
                  type="button"
                  onClick={() =>
                    undefined
                  }
                  style={{
                    background: 'rgba(245, 158, 11, 0.15)',
                    border: '1px solid rgba(245, 158, 11, 0.3)',
                    borderRadius: 10,
                    padding: '8px 10px',
                    color: '#FCD34D',
                    fontSize: 11,
                    fontWeight: 700,
                    cursor: 'pointer',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'flex-start',
                  }}
                >
                  <span>💼 Escrow & Orders</span>
                  <span style={{ fontSize: 9, color: '#FBBF24', opacity: 0.8 }}>Orders & Payouts</span>
                </button>

                <button
                  type="button"
                  onClick={() =>
                    undefined
                  }
                  style={{
                    background: 'rgba(139, 92, 246, 0.15)',
                    border: '1px solid rgba(139, 92, 246, 0.3)',
                    borderRadius: 10,
                    padding: '8px 10px',
                    color: '#C4B5FD',
                    fontSize: 11,
                    fontWeight: 700,
                    cursor: 'pointer',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'flex-start',
                  }}
                >
                  <span>💬 Support Lead</span>
                  <span style={{ fontSize: 9, color: '#A78BFA', opacity: 0.8 }}>Disputes & Tickets</span>
                </button>
              </div>
            </div>
            </>)}
          </form>
        )}

        {/* ─── TAB 2: SIGN UP FORM ────────────────────────────────────────── */}
        {authMode === 'SIGN_UP' && (
          <form onSubmit={handleSignUp} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <div>
              <label style={{ fontSize: 11, fontWeight: 700, color: '#9CA3AF', marginBottom: 4, display: 'block' }}>
                Full Legal Name *
              </label>
              <div
                style={{
                  background: 'rgba(31, 41, 55, 0.8)',
                  border: '1px solid rgba(255, 255, 255, 0.12)',
                  borderRadius: 10,
                  padding: '8px 12px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                }}
              >
                <User size={15} color="#60A5FA" />
                <input
                  type="text"
                  value={signUpName}
                  onChange={(e) => setSignUpName(e.target.value)}
                  placeholder="e.g. Ramesh Kulkarni"
                  required
                  style={{ flex: 1, background: 'transparent', border: 'none', color: '#FFF', fontSize: 13, outline: 'none' }}
                />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
              <div>
                <label style={{ fontSize: 11, fontWeight: 700, color: '#9CA3AF', marginBottom: 4, display: 'block' }}>
                  Official Email *
                </label>
                <div
                  style={{
                    background: 'rgba(31, 41, 55, 0.8)',
                    border: '1px solid rgba(255, 255, 255, 0.12)',
                    borderRadius: 10,
                    padding: '8px 12px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8,
                  }}
                >
                  <Mail size={15} color="#60A5FA" />
                  <input
                    type="email"
                    value={signUpEmail}
                    onChange={(e) => setSignUpEmail(e.target.value)}
                    placeholder="ramesh@kfpl.in"
                    required
                    style={{ flex: 1, background: 'transparent', border: 'none', color: '#FFF', fontSize: 12, outline: 'none' }}
                  />
                </div>
              </div>

              <div>
                <label style={{ fontSize: 11, fontWeight: 700, color: '#9CA3AF', marginBottom: 4, display: 'block' }}>
                  Mobile Phone
                </label>
                <div
                  style={{
                    background: 'rgba(31, 41, 55, 0.8)',
                    border: '1px solid rgba(255, 255, 255, 0.12)',
                    borderRadius: 10,
                    padding: '8px 12px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8,
                  }}
                >
                  <Phone size={15} color="#60A5FA" />
                  <input
                    type="text"
                    value={signUpPhone}
                    onChange={(e) => setSignUpPhone(e.target.value)}
                    placeholder="+91 98000 00000"
                    style={{ flex: 1, background: 'transparent', border: 'none', color: '#FFF', fontSize: 12, outline: 'none' }}
                  />
                </div>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
              <div>
                <label style={{ fontSize: 11, fontWeight: 700, color: '#9CA3AF', marginBottom: 4, display: 'block' }}>
                  Assigned Role *
                </label>
                <select
                  value={signUpRole}
                  onChange={(e) => setSignUpRole(e.target.value as any)}
                  style={{
                    width: '100%',
                    background: '#1F2937',
                    border: '1px solid rgba(255, 255, 255, 0.15)',
                    borderRadius: 10,
                    padding: '8px 10px',
                    color: '#FFF',
                    fontSize: 12,
                    fontWeight: 600,
                  }}
                >
                  <option value="Super Admin">Super Admin</option>
                  <option value="Catalog Manager">Catalog Manager</option>
                  <option value="Order & Escrow Lead">Order & Escrow Lead</option>
                  <option value="Finance Admin">Finance Admin</option>
                  <option value="Support Lead">Support Lead</option>
                </select>
              </div>

              <div>
                <label style={{ fontSize: 11, fontWeight: 700, color: '#9CA3AF', marginBottom: 4, display: 'block' }}>
                  Department
                </label>
                <input
                  type="text"
                  value={signUpDept}
                  onChange={(e) => setSignUpDept(e.target.value)}
                  style={{
                    width: '100%',
                    background: 'rgba(31, 41, 55, 0.8)',
                    border: '1px solid rgba(255, 255, 255, 0.12)',
                    borderRadius: 10,
                    padding: '8px 10px',
                    color: '#FFF',
                    fontSize: 12,
                  }}
                />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
              <div>
                <label style={{ fontSize: 11, fontWeight: 700, color: '#9CA3AF', marginBottom: 4, display: 'block' }}>
                  Set Password *
                </label>
                <input
                  type="password"
                  value={signUpPassword}
                  onChange={(e) => setSignUpPassword(e.target.value)}
                  placeholder="••••••••••••"
                  required
                  style={{
                    width: '100%',
                    background: 'rgba(31, 41, 55, 0.8)',
                    border: '1px solid rgba(255, 255, 255, 0.12)',
                    borderRadius: 10,
                    padding: '8px 10px',
                    color: '#FFF',
                    fontSize: 12,
                  }}
                />
              </div>

              <div>
                <label style={{ fontSize: 11, fontWeight: 700, color: '#9CA3AF', marginBottom: 4, display: 'block' }}>
                  Confirm Password *
                </label>
                <input
                  type="password"
                  value={signUpConfirmPassword}
                  onChange={(e) => setSignUpConfirmPassword(e.target.value)}
                  placeholder="••••••••••••"
                  required
                  style={{
                    width: '100%',
                    background: 'rgba(31, 41, 55, 0.8)',
                    border: '1px solid rgba(255, 255, 255, 0.12)',
                    borderRadius: 10,
                    padding: '8px 10px',
                    color: '#FFF',
                    fontSize: 12,
                  }}
                />
              </div>
            </div>

            <div>
              <label style={{ fontSize: 11, fontWeight: 700, color: '#FBBF24', marginBottom: 4, display: 'flex', alignItems: 'center', gap: 4 }}>
                <KeyRound size={13} />
                <span>Master Security Authorization Key *</span>
              </label>
              <input
                type="text"
                value={securityKey}
                onChange={(e) => setSecurityKey(e.target.value)}
                placeholder="KFPL-ADMIN-2026"
                required
                style={{
                  width: '100%',
                  background: 'rgba(31, 41, 55, 0.8)',
                  border: '1px solid rgba(245, 158, 11, 0.3)',
                  borderRadius: 10,
                  padding: '8px 10px',
                  color: '#FDE68A',
                  fontSize: 12,
                  fontWeight: 700,
                }}
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              style={{
                width: '100%',
                background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
                color: '#FFF',
                border: 'none',
                borderRadius: 12,
                padding: '12px 0',
                fontSize: 14,
                fontWeight: 800,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 8,
                cursor: isLoading ? 'not-allowed' : 'pointer',
                boxShadow: '0 4px 18px rgba(16, 185, 129, 0.4)',
                marginTop: 6,
              }}
            >
              {isLoading ? (
                <span>Registering Administrator...</span>
              ) : (
                <>
                  <span>Create Administrator Account</span>
                  <CheckCircle2 size={16} />
                </>
              )}
            </button>
          </form>
        )}
      </div>

      {/* Forgot Password Recovery Modal */}
      {forgotPasswordOpen && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 99999,
            background: 'rgba(0, 0, 0, 0.8)',
            backdropFilter: 'blur(10px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: 20,
          }}
        >
          <div
            style={{
              width: '100%',
              maxWidth: 440,
              background: '#0F172A',
              border: '1px solid rgba(255, 255, 255, 0.15)',
              borderRadius: 20,
              padding: 24,
              boxShadow: '0 25px 60px rgba(0, 0, 0, 0.9)',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <KeyRound size={20} color="#60A5FA" />
                <h3 style={{ fontSize: 17, fontWeight: 800, color: '#FFF' }}>Reset Admin Credentials</h3>
              </div>
              <button
                onClick={() => setForgotPasswordOpen(false)}
                style={{ background: 'none', border: 'none', color: '#9CA3AF', cursor: 'pointer' }}
              >
                <X size={18} />
              </button>
            </div>

            {resetSuccess ? (
              <div style={{ textAlign: 'center', padding: '20px 0' }}>
                <CheckCircle2 size={42} color="#10B981" style={{ margin: '0 auto 10px' }} />
                <h4 style={{ fontSize: 16, fontWeight: 700, color: '#FFF' }}>Recovery Instructions Sent!</h4>
                <p style={{ fontSize: 12, color: '#9CA3AF', marginTop: 4 }}>
                  Check your registered enterprise email for 2FA password reset token.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSendReset} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                <p style={{ fontSize: 12, color: '#9CA3AF', lineHeight: '1.4' }}>
                  Enter your registered KFPL administrator email. A secure verification link and temporary token will be dispatched.
                </p>

                <input
                  type="email"
                  required
                  value={resetEmail}
                  onChange={(e) => setResetEmail(e.target.value)}
                  placeholder="admin@kfpl.in"
                  style={{
                    background: 'rgba(31, 41, 55, 0.8)',
                    border: '1px solid rgba(255, 255, 255, 0.15)',
                    borderRadius: 10,
                    padding: '10px 14px',
                    color: '#FFF',
                    fontSize: 13,
                    outline: 'none',
                  }}
                />

                <button
                  type="submit"
                  style={{
                    background: 'linear-gradient(135deg, #2563EB 0%, #1D4ED8 100%)',
                    color: '#FFF',
                    border: 'none',
                    borderRadius: 10,
                    padding: '10px 0',
                    fontSize: 13,
                    fontWeight: 700,
                    cursor: 'pointer',
                  }}
                >
                  Send Recovery Link
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
