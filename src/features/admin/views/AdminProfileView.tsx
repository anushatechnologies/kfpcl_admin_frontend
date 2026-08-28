import React, { useEffect, useRef, useState } from 'react';
import { useAdminStore, AdminAuthUser } from '../../../store/useAdminStore';
import {
  User,
  Mail,
  Phone,
  Shield,
  Edit3,
  Save,
  X,
  CheckCircle2,
  Calendar,
  Hash,
  Camera,
} from 'lucide-react';

const ROLE_COLORS: Record<AdminAuthUser['role'], { bg: string; color: string; border: string }> = {
  'Super Admin': { bg: 'rgba(239, 68, 68, 0.12)', color: '#EF4444', border: 'rgba(239, 68, 68, 0.25)' },
  'Catalog Manager': { bg: 'rgba(168, 85, 247, 0.12)', color: '#A855F7', border: 'rgba(168, 85, 247, 0.25)' },
  'Order & Escrow Lead': { bg: 'rgba(59, 130, 246, 0.12)', color: '#3B82F6', border: 'rgba(59, 130, 246, 0.25)' },
  'Finance Admin': { bg: 'rgba(16, 185, 129, 0.12)', color: '#10B981', border: 'rgba(16, 185, 129, 0.25)' },
  'Support Lead': { bg: 'rgba(245, 158, 11, 0.12)', color: '#F59E0B', border: 'rgba(245, 158, 11, 0.25)' },
};


export const AdminProfileView: React.FC = () => {
  const { adminUser, updateAdminUser, theme = 'dark' } = useAdminStore();
  const isDark = theme === 'dark';

  const [isEditing, setIsEditing] = useState(false);
  const [saved, setSaved] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState(adminUser?.avatar || '');
  const [cameraOpen, setCameraOpen] = useState(false);
  const [cameraError, setCameraError] = useState('');
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const [form, setForm] = useState({
    name: adminUser?.name || '',
    email: adminUser?.email || '',
    phone: '',
  });

  const roleStyle = adminUser ? (ROLE_COLORS[adminUser.role] || ROLE_COLORS['Super Admin']) : ROLE_COLORS['Super Admin'];
  const permissions: string[] = [];

  useEffect(() => { setAvatarPreview(adminUser?.avatar || ''); }, [adminUser?.avatar]);
  useEffect(() => () => { streamRef.current?.getTracks().forEach((track) => track.stop()); }, []);

  const openCamera = async () => {
    setCameraError('');
    if (!navigator.mediaDevices?.getUserMedia) { setCameraError('Camera access is not supported by this browser.'); setCameraOpen(true); return; }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'user' }, audio: false });
      streamRef.current = stream;
      setCameraOpen(true);
      requestAnimationFrame(() => { if (videoRef.current) { videoRef.current.srcObject = stream; videoRef.current.play(); } });
    } catch { setCameraError('Camera permission was denied or the camera is unavailable. You can browse for an image instead.'); setCameraOpen(true); }
  };
  const closeCamera = () => { streamRef.current?.getTracks().forEach((track) => track.stop()); streamRef.current = null; setCameraOpen(false); };
  const capturePhoto = () => { const video = videoRef.current; if (!video || !video.videoWidth) return; const canvas = document.createElement('canvas'); canvas.width = video.videoWidth; canvas.height = video.videoHeight; canvas.getContext('2d')?.drawImage(video, 0, 0); setAvatarPreview(canvas.toDataURL('image/jpeg', .88)); closeCamera(); };
  const handleAvatarFile = (file?: File) => { if (!file) return; if (!file.type.startsWith('image/')) return; const reader = new FileReader(); reader.onload = () => setAvatarPreview(String(reader.result)); reader.readAsDataURL(file); };

  const handleSave = () => {
    updateAdminUser({ name: form.name, avatar: avatarPreview || adminUser?.avatar });
    setIsEditing(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setForm({
      name: adminUser?.name || '',
      email: adminUser?.email || '',
      phone: '',
    });
  };

  const cardStyle: React.CSSProperties = {
    background: isDark ? 'rgba(17, 24, 39, 0.75)' : '#FFFFFF',
    border: `1px solid ${isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.08)'}`,
    borderRadius: 16,
    padding: 24,
    transition: 'all 0.2s ease',
  };

  const inputStyle: React.CSSProperties = {
    width: '100%',
    background: isDark ? 'rgba(31, 41, 55, 0.8)' : '#F3F4F6',
    border: `1px solid ${isDark ? 'rgba(255,255,255,0.12)' : 'rgba(0,0,0,0.1)'}`,
    borderRadius: 10,
    padding: '10px 14px',
    color: isDark ? '#F9FAFB' : '#111827',
    fontSize: 14,
    fontWeight: 500,
    outline: 'none',
    boxSizing: 'border-box',
    fontFamily: 'inherit',
  };

  const readonlyFieldStyle: React.CSSProperties = {
    ...inputStyle,
    background: isDark ? 'rgba(17, 24, 39, 0.5)' : '#F9FAFB',
    color: isDark ? '#9CA3AF' : '#6B7280',
    cursor: 'not-allowed',
  };

  const labelStyle: React.CSSProperties = {
    fontSize: 11,
    fontWeight: 700,
    color: '#9CA3AF',
    textTransform: 'uppercase',
    letterSpacing: '0.06em',
    marginBottom: 6,
    display: 'block',
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20, maxWidth: 900 }}>
      {/* ── Saved toast ──────────────────────────────────────────── */}
      {saved && (
        <div
          style={{
            background: 'rgba(16, 185, 129, 0.12)',
            border: '1px solid rgba(16, 185, 129, 0.3)',
            borderRadius: 12,
            padding: '12px 18px',
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            color: '#10B981',
            fontSize: 13,
            fontWeight: 700,
            animation: 'fadeIn 0.2s ease',
          }}
        >
          <CheckCircle2 size={16} />
          Profile changes saved successfully!
        </div>
      )}

      {/* ── Profile Hero Card ────────────────────────────────────── */}
      <div
        style={{
          ...cardStyle,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: 20,
          background: isDark
            ? 'linear-gradient(135deg, rgba(37,99,235,0.12) 0%, rgba(17,24,39,0.85) 100%)'
            : 'linear-gradient(135deg, rgba(37,99,235,0.06) 0%, #FFFFFF 100%)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
          {/* Avatar */}
          <div style={{ position: 'relative' }}>
            <img
              src={
                avatarPreview || adminUser?.avatar ||
                ''
              }
              alt="Admin avatar"
              style={{
                width: 80,
                height: 80,
                borderRadius: 20,
                objectFit: 'cover',
                border: '3px solid rgba(37,99,235,0.4)',
                boxShadow: '0 8px 24px rgba(37,99,235,0.25)',
              }}
              onError={(e) => {
                (e.target as HTMLImageElement).style.display = 'none';
              }}
            />
            <button
              type="button"
              aria-label="Change profile image"
              onClick={openCamera}
              style={{
                position: 'absolute',
                bottom: -4,
                right: -4,
                width: 22,
                height: 22,
                borderRadius: 8,
                background: '#2563EB',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: `2px solid ${isDark ? '#090D16' : '#F9FAFB'}`,
                cursor: 'pointer',
              }}
            >
              <Camera size={10} color="#FFF" />
            </button>
            <label style={{ display: 'block', marginTop: 10, color: '#2563EB', fontSize: 10, fontWeight: 800, cursor: 'pointer', textAlign: 'center' }}>Browse file<input type="file" accept="image/*" onChange={(e) => handleAvatarFile(e.target.files?.[0])} style={{ display: 'none' }} /></label>
          </div>

          <div>
            <h2
              style={{
                fontSize: 22,
                fontWeight: 800,
                color: isDark ? '#F9FAFB' : '#111827',
                letterSpacing: '-0.3px',
                marginBottom: 4,
              }}
            >
              {adminUser?.name || '—'}
            </h2>
            <div style={{ fontSize: 13, color: '#9CA3AF', marginBottom: 8 }}>
              {adminUser?.email}
            </div>
            <span
              style={{
                fontSize: 11,
                fontWeight: 800,
                padding: '3px 10px',
                borderRadius: 8,
                background: roleStyle.bg,
                color: roleStyle.color,
                border: `1px solid ${roleStyle.border}`,
              }}
            >
              {adminUser?.role || '—'}
            </span>
          </div>
        </div>

        <div style={{ display: 'flex', gap: 10 }}>
          {isEditing ? (
            <>
              <button
                onClick={handleCancel}
                style={{
                  padding: '9px 16px',
                  borderRadius: 10,
                  border: `1px solid ${isDark ? 'rgba(255,255,255,0.15)' : 'rgba(0,0,0,0.1)'}`,
                  background: 'transparent',
                  color: isDark ? '#9CA3AF' : '#6B7280',
                  fontSize: 13,
                  fontWeight: 700,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6,
                  fontFamily: 'inherit',
                }}
              >
                <X size={14} /> Cancel
              </button>
              <button
                onClick={handleSave}
                style={{
                  padding: '9px 18px',
                  borderRadius: 10,
                  border: 'none',
                  background: 'linear-gradient(135deg, #2563EB 0%, #1D4ED8 100%)',
                  color: '#FFF',
                  fontSize: 13,
                  fontWeight: 700,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6,
                  boxShadow: '0 4px 14px rgba(37,99,235,0.35)',
                  fontFamily: 'inherit',
                }}
              >
                <Save size={14} /> Save Changes
              </button>
            </>
          ) : (
            <button
              onClick={() => setIsEditing(true)}
              style={{
                padding: '9px 18px',
                borderRadius: 10,
                border: 'none',
                background: 'linear-gradient(135deg, #2563EB 0%, #1D4ED8 100%)',
                color: '#FFF',
                fontSize: 13,
                fontWeight: 700,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: 6,
                boxShadow: '0 4px 14px rgba(37,99,235,0.35)',
                fontFamily: 'inherit',
              }}
            >
              <Edit3 size={14} /> Edit Profile
            </button>
          )}
        </div>
      </div>

      {/* ── Two-column grid ──────────────────────────────────────── */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
        {/* Profile Information */}
        <div style={cardStyle}>
          <h3
            style={{
              fontSize: 14,
              fontWeight: 800,
              color: isDark ? '#FFF' : '#111827',
              marginBottom: 20,
              display: 'flex',
              alignItems: 'center',
              gap: 8,
            }}
          >
            <User size={16} color="#2563EB" />
            Profile Information
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div>
              <label style={labelStyle}>
                <Mail size={10} style={{ display: 'inline', marginRight: 4 }} />
                Full Name
              </label>
              {isEditing ? (
                <input
                  style={inputStyle}
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                />
              ) : (
                <div style={{ ...inputStyle, background: 'transparent', border: 'none', padding: '10px 0', color: isDark ? '#F9FAFB' : '#111827', fontWeight: 600 }}>
                  {form.name}
                </div>
              )}
            </div>

            <div>
              <label style={labelStyle}>
                <Mail size={10} style={{ display: 'inline', marginRight: 4 }} />
                Email Address
              </label>
              <input style={readonlyFieldStyle} value={form.email} readOnly />
            </div>

            {false && <div>
              <label style={labelStyle}>
                <Phone size={10} style={{ display: 'inline', marginRight: 4 }} />
                Phone Number
              </label>
              {isEditing ? (
                <input
                  style={inputStyle}
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                />
              ) : (
                <div style={{ ...inputStyle, background: 'transparent', border: 'none', padding: '10px 0', color: isDark ? '#F9FAFB' : '#111827', fontWeight: 600 }}>
                  {form.phone}
                </div>
              )}
            </div>}

          </div>
        </div>

        {/* Account Information */}
        <div style={cardStyle}>
          <h3
            style={{
              fontSize: 14,
              fontWeight: 800,
              color: isDark ? '#FFF' : '#111827',
              marginBottom: 20,
              display: 'flex',
              alignItems: 'center',
              gap: 8,
            }}
          >
            <Shield size={16} color="#10B981" />
            Account Information
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {[
              { icon: Hash, label: 'Admin ID', value: adminUser?.id || '—' },
              { icon: Shield, label: 'Admin Role', value: adminUser?.role || '—' },
            ].map(({ icon: Icon, label, value }) => (
              <div
                key={label}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '10px 0',
                  borderBottom: `1px solid ${isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)'}`,
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <Icon size={13} color="#6B7280" />
                  <span style={{ fontSize: 12, color: '#9CA3AF', fontWeight: 600 }}>{label}</span>
                </div>
                <span
                  style={{
                    fontSize: 12,
                    fontWeight: 700,
                    color: label === 'Account Status' ? '#10B981' : isDark ? '#F9FAFB' : '#111827',
                  }}
                >
                  {value}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Permissions ──────────────────────────────────────────── */}
      {false && <div style={cardStyle}>
        <h3
          style={{
            fontSize: 14,
            fontWeight: 800,
            color: isDark ? '#FFF' : '#111827',
            marginBottom: 16,
            display: 'flex',
            alignItems: 'center',
            gap: 8,
          }}
        >
          <Shield size={16} color="#A855F7" />
          Role & Permissions Summary
        </h3>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
          {permissions.map((perm) => (
            <span
              key={perm}
              style={{
                fontSize: 12,
                fontWeight: 700,
                padding: '5px 12px',
                borderRadius: 8,
                background: isDark ? 'rgba(37,99,235,0.12)' : 'rgba(37,99,235,0.06)',
                color: '#3B82F6',
                border: '1px solid rgba(37,99,235,0.2)',
                display: 'flex',
                alignItems: 'center',
                gap: 6,
              }}
            >
              <CheckCircle2 size={11} />
              {perm}
            </span>
          ))}
        </div>
      </div>}

      {cameraOpen && (
        <div onClick={closeCamera} style={{ position: 'fixed', inset: 0, zIndex: 10000, background: 'rgba(2,6,23,.78)', backdropFilter: 'blur(8px)', display: 'grid', placeItems: 'center', padding: 20 }}>
          <div onClick={(e) => e.stopPropagation()} style={{ width: 'min(100%, 460px)', background: isDark ? '#0F172A' : '#FFF', borderRadius: 18, padding: 20, border: `1px solid ${isDark ? 'rgba(96,165,250,.3)' : '#DBEAFE'}`, boxShadow: '0 28px 90px rgba(2,6,23,.45)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}><h3 style={{ margin: 0, color: isDark ? '#FFF' : '#0F172A', fontSize: 18 }}>Update profile image</h3><button type="button" onClick={closeCamera} style={{ border: 0, background: isDark ? 'rgba(255,255,255,.08)' : '#F1F5F9', color: '#94A3B8', borderRadius: 8, width: 30, height: 30, cursor: 'pointer' }}><X size={15} /></button></div>
            {cameraError ? <div style={{ padding: 16, borderRadius: 10, background: 'rgba(239,68,68,.1)', color: '#F87171', fontSize: 12, lineHeight: 1.5 }}>{cameraError}</div> : <video ref={videoRef} autoPlay playsInline muted style={{ width: '100%', aspectRatio: '4/3', objectFit: 'cover', borderRadius: 12, background: '#020617' }} />}
            <div style={{ display: 'flex', gap: 10, marginTop: 15 }}><button type="button" onClick={capturePhoto} disabled={!!cameraError} style={{ flex: 1, border: 0, borderRadius: 10, padding: 11, background: cameraError ? '#475569' : '#2563EB', color: '#FFF', fontWeight: 800, cursor: cameraError ? 'not-allowed' : 'pointer' }}><Camera size={15} style={{ verticalAlign: 'middle', marginRight: 6 }} />Take photo</button><label style={{ flex: 1, border: `1px solid ${isDark ? '#334155' : '#CBD5E1'}`, borderRadius: 10, padding: 10, color: isDark ? '#CBD5E1' : '#475569', fontSize: 12, fontWeight: 800, textAlign: 'center', cursor: 'pointer' }}>Browse file<input type="file" accept="image/*" onChange={(e) => { handleAvatarFile(e.target.files?.[0]); closeCamera(); }} style={{ display: 'none' }} /></label></div>
          </div>
        </div>
      )}
    </div>
  );
};
