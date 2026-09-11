import { useState, type FormEvent } from 'react';
import { motion } from 'framer-motion';
import { Check, Edit3, Mail, ShieldCheck, UserRound, X } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '@app/hooks';
import { setCredentials } from '@features/auth/authSlice';

export default function ProfilePage() {
  const dispatch = useAppDispatch();
  const { user, token, refreshToken } = useAppSelector((state) => state.auth);
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [saved, setSaved] = useState(false);

  const displayName = user?.name?.trim() || user?.email?.split('@')[0] || 'Admin';
  const role = user?.role === 'ROLE_SUPER_ADMIN' ? 'Super Admin' : user?.role || 'Admin';
  const initials = displayName.slice(0, 2).toUpperCase();

  const openEditor = () => {
    setName(user?.name || '');
    setEmail(user?.email || '');
    setSaved(false);
    setIsEditing(true);
  };

  const handleSave = (event: FormEvent) => {
    event.preventDefault();
    if (!user || !name.trim() || !email.trim()) return;

    dispatch(setCredentials({
      token: token || '',
      refreshToken,
      user: { ...user, name: name.trim(), email: email.trim() },
    }));
    setIsEditing(false);
    setSaved(true);
  };

  return (
    <main className="profile-page">
      <motion.section
        className="profile-hero admin-card"
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
      >
        <div className="profile-hero-glow" />
        <div className="profile-hero-content">
          <div className="profile-avatar-wrap">
            <div className="profile-avatar">{initials}</div>
          </div>
          <div className="profile-hero-copy">
            <span className="profile-eyebrow">Administrator account</span>
            <h1>{displayName}</h1>
            <p><span className="profile-status-dot" /> Your account is active and secure</p>
          </div>
          <button className="profile-edit-button" type="button" onClick={openEditor}>
            <Edit3 size={16} /> Edit profile
          </button>
        </div>
      </motion.section>

      {saved && (
        <div className="profile-success" role="status">
          <Check size={17} /> Profile details saved successfully.
        </div>
      )}

      <section className="profile-grid">
        <motion.div className="profile-info-card admin-card" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }}>
          <div className="profile-card-heading">
            <div><span className="profile-section-label">Personal information</span><h2>Account details</h2></div>
            <UserRound size={21} />
          </div>
          <div className="profile-details">
            <div className="profile-detail-row"><span>Full name</span><strong>{displayName}</strong></div>
            <div className="profile-detail-row"><span>Email address</span><strong>{user?.email || 'Not available'}</strong></div>
            <div className="profile-detail-row"><span>Account ID</span><strong>#{user?.id ?? '—'}</strong></div>
          </div>
        </motion.div>

        <motion.div className="profile-info-card admin-card" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.18 }}>
          <div className="profile-card-heading">
            <div><span className="profile-section-label">Access & security</span><h2>Administrator access</h2></div>
            <ShieldCheck size={21} />
          </div>
          <div className="profile-role-banner"><ShieldCheck size={19} /><div><strong>{role}</strong><span>Full console access</span></div></div>
          <div className="profile-detail-row"><span><Mail size={15} /> Sign-in email</span><strong>{user?.email || 'Not available'}</strong></div>
        </motion.div>
      </section>

      {isEditing && (
        <div className="profile-modal-backdrop" role="presentation" onMouseDown={() => setIsEditing(false)}>
          <motion.form
            className="profile-edit-modal admin-card"
            onSubmit={handleSave}
            onMouseDown={(event) => event.stopPropagation()}
            initial={{ opacity: 0, scale: 0.96, y: 8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
          >
            <div className="profile-modal-header"><div><span className="profile-section-label">Account settings</span><h2>Edit profile</h2></div><button type="button" className="profile-close" onClick={() => setIsEditing(false)} aria-label="Close"><X size={19} /></button></div>
            <label>Full name<input value={name} onChange={(event) => setName(event.target.value)} required /></label>
            <label>Email address<input type="email" value={email} onChange={(event) => setEmail(event.target.value)} required /></label>
            <p className="profile-edit-note">Your administrator role is managed by your platform owner.</p>
            <div className="profile-modal-actions"><button type="button" className="profile-cancel" onClick={() => setIsEditing(false)}>Cancel</button><button type="submit" className="profile-save"><Check size={16} /> Save changes</button></div>
          </motion.form>
        </div>
      )}
    </main>
  );
}
