import React, { useState } from 'react';
import { useAdminStore } from '../../../store/useAdminStore';
import {
  Bell,
  Send,
  Users,
  CheckCircle2,
  Mail,
  Smartphone,
  Eye,
  X,
} from 'lucide-react';

export const AdminNotificationsView: React.FC = () => {
  const { notificationsList, addNotification, theme = 'dark' } = useAdminStore();
  const [showModal, setShowModal] = useState(false);
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [targetAudience, setTargetAudience] = useState<'ALL' | 'BUYERS' | 'SELLERS'>('ALL');
  const [channel, setChannel] = useState<'PUSH_AND_EMAIL' | 'IN_APP_ONLY'>('PUSH_AND_EMAIL');
  const [selectedNotification, setSelectedNotification] = useState<typeof notificationsList[number] | null>(null);
  const dark = theme === 'dark';
  const c = { text: dark ? '#F8FAFC' : '#0F172A', muted: dark ? '#94A3B8' : '#64748B', panel: dark ? 'rgba(15,23,42,.78)' : '#FFF', soft: dark ? 'rgba(30,41,59,.72)' : '#F8FAFC', border: dark ? 'rgba(148,163,184,.16)' : '#E2E8F0' };

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !message) return;

    addNotification({
      title,
      message,
      targetAudience,
      channel,
      status: 'DISPATCHED',
    });

    setShowModal(false);
    setTitle('');
    setMessage('');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24, maxWidth: 1000, margin: '0 auto', width: '100%' }}>
      <style>{`.broadcast-card{transition:transform .18s ease,box-shadow .18s ease}.broadcast-card:hover{transform:translateY(-3px);box-shadow:0 16px 35px rgba(2,6,23,.16)!important}`}</style>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <div style={{ color: '#60A5FA', fontSize: 11, fontWeight: 800, letterSpacing: '.1em', textTransform: 'uppercase' }}>Communications / platform reach</div><h1 style={{ fontSize: 'clamp(22px,2.4vw,30px)', fontWeight: 800, color: c.text, margin: '8px 0 0' }}>System broadcasts & alerts</h1>
          <p style={{ fontSize: 13, color: c.muted, marginTop: 8 }}>
            Dispatch real-time push alerts, critical platform updates, and transactional announcements.
          </p>
        </div>

      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {notificationsList.map((n) => (
          <div
            key={n.id}
            style={{
              background: c.panel,
              border: `1px solid ${c.border}`,
              borderRadius: 14,
              padding: 16,
              display: 'flex',
              flexDirection: 'column',
              gap: 10,
              boxShadow: '0 8px 24px rgba(2,6,23,.07)',
            }}
            className="broadcast-card"
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: 10, fontWeight: 800, padding: '2px 8px', borderRadius: 6, background: 'rgba(37, 99, 235, 0.2)', color: '#93C5FD' }}>
                TARGET: {n.targetAudience}
              </span>
              <span style={{ fontSize: 11, color: '#9CA3AF' }}>{n.sentAt}</span>
            </div>

              <h4 style={{ fontSize: 16, fontWeight: 800, color: c.text, margin: '5px 0 0' }}>{n.title}</h4>
            <p style={{ fontSize: 13, color: c.muted, lineHeight: '1.5', margin: 0 }}>{n.message}</p>

            <div style={{ fontSize: 10, color: '#10B981', fontWeight: 700, display: 'flex', alignItems: 'center', gap: 4 }}>
              <CheckCircle2 size={12} />
              <span>Channel: {n.channel.replace(/_/g, ' ')} · Dispatched</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 3 }}><button onClick={() => setSelectedNotification(n)} style={{ display: 'inline-flex', alignItems: 'center', gap: 5, border: '1px solid rgba(96,165,250,.45)', borderRadius: 8, padding: '7px 11px', background: 'rgba(96,165,250,.12)', color: '#60A5FA', fontSize: 11, fontWeight: 800, cursor: 'pointer' }}><Eye size={13} />View details</button></div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {showModal && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 9999, background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
          <div style={{ width: '100%', maxWidth: 460, background: dark ? '#0F172A' : '#FFF', borderRadius: 16, border: `1px solid ${c.border}`, padding: 24 }}>
            <h3 style={{ fontSize: 18, fontWeight: 800, color: c.text, marginBottom: 14 }}>Broadcast Platform Announcement</h3>
            <form onSubmit={handleSend} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <div>
                <label style={{ fontSize: 11, fontWeight: 700, color: '#9CA3AF', display: 'block', marginBottom: 4 }}>Title</label>
                <input type="text" required value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. Special Incentive Announcement" style={{ width: '100%', background: 'rgba(31, 41, 55, 0.8)', border: '1px solid rgba(255, 255, 255, 0.15)', borderRadius: 8, padding: 8, color: '#FFF' }} />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                <div>
                  <label style={{ fontSize: 11, fontWeight: 700, color: '#9CA3AF', display: 'block', marginBottom: 4 }}>Target Audience</label>
                  <select value={targetAudience} onChange={(e) => setTargetAudience(e.target.value as any)} style={{ width: '100%', background: '#1F2937', border: '1px solid rgba(255, 255, 255, 0.15)', borderRadius: 8, padding: 8, color: '#FFF' }}>
                    <option value="ALL">All Users</option>
                    <option value="BUYERS">Buyers Only</option>
                    <option value="SELLERS">Sellers Only</option>
                  </select>
                </div>
                <div>
                  <label style={{ fontSize: 11, fontWeight: 700, color: '#9CA3AF', display: 'block', marginBottom: 4 }}>Channel</label>
                  <select value={channel} onChange={(e) => setChannel(e.target.value as any)} style={{ width: '100%', background: '#1F2937', border: '1px solid rgba(255, 255, 255, 0.15)', borderRadius: 8, padding: 8, color: '#FFF' }}>
                    <option value="PUSH_AND_EMAIL">Push & Email</option>
                    <option value="IN_APP_ONLY">In-App Only</option>
                  </select>
                </div>
              </div>
              <div>
                <label style={{ fontSize: 11, fontWeight: 700, color: '#9CA3AF', display: 'block', marginBottom: 4 }}>Message</label>
                <textarea rows={3} required value={message} onChange={(e) => setMessage(e.target.value)} placeholder="Type announcement copy here..." style={{ width: '100%', background: 'rgba(31, 41, 55, 0.8)', border: '1px solid rgba(255, 255, 255, 0.15)', borderRadius: 8, padding: 8, color: '#FFF', fontSize: 12 }} />
              </div>
              <div style={{ display: 'flex', gap: 10, marginTop: 8 }}>
                <button type="submit" style={{ flex: 1, background: '#2563EB', color: '#FFF', border: 'none', borderRadius: 8, padding: '10px 0', fontSize: 13, fontWeight: 800, cursor: 'pointer' }}>Broadcast Live</button>
                <button type="button" onClick={() => setShowModal(false)} style={{ background: 'rgba(255, 255, 255, 0.1)', color: '#D1D5DB', border: 'none', borderRadius: 8, padding: '10px 16px', fontSize: 13, fontWeight: 700, cursor: 'pointer' }}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {selectedNotification && <div onClick={() => setSelectedNotification(null)} style={{ position: 'fixed', inset: 0, zIndex: 10000, background: 'rgba(2,6,23,.72)', backdropFilter: 'blur(8px)', display: 'grid', placeItems: 'center', padding: 20 }}><div onClick={(event) => event.stopPropagation()} style={{ width: 'min(100%, 560px)', background: dark ? '#0F172A' : '#FFF', border: `1px solid ${c.border}`, borderRadius: 18, padding: 24, color: c.text, boxShadow: '0 24px 70px rgba(0,0,0,.35)' }}><div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 16 }}><div><div style={{ color: '#60A5FA', fontSize: 10, fontWeight: 800, letterSpacing: '.08em' }}>ALERT DETAILS</div><h2 style={{ margin: '7px 0 4px', fontSize: 21 }}>{selectedNotification.title}</h2><div style={{ color: c.muted, fontSize: 12 }}>Broadcast dispatched {selectedNotification.sentAt}</div></div><button onClick={() => setSelectedNotification(null)} aria-label="Close alert details" style={{ border: 0, borderRadius: 8, width: 32, height: 32, background: dark ? 'rgba(255,255,255,.08)' : '#F1F5F9', color: c.muted, cursor: 'pointer' }}><X size={15} /></button></div><div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 9, marginTop: 22 }}>{[['Target audience', selectedNotification.targetAudience], ['Channel', selectedNotification.channel.replace(/_/g, ' ')], ['Status', selectedNotification.status]].map(([label, value]) => <div key={label} style={{ background: c.soft, borderRadius: 10, padding: 11 }}><div style={{ color: c.muted, fontSize: 10 }}>{label}</div><strong style={{ display: 'block', marginTop: 4, color: label === 'Status' ? '#34D399' : c.text, fontSize: 12 }}>{value}</strong></div>)}</div><div style={{ marginTop: 18, padding: 15, borderRadius: 11, border: `1px solid ${c.border}`, background: c.soft }}><div style={{ color: c.muted, fontSize: 10, fontWeight: 800, letterSpacing: '.06em', marginBottom: 8 }}>MESSAGE CONTENT</div><p style={{ margin: 0, color: c.text, fontSize: 13, lineHeight: 1.7 }}>{selectedNotification.message}</p></div><div style={{ display: 'flex', alignItems: 'center', gap: 7, marginTop: 16, color: '#34D399', fontSize: 12, fontWeight: 800 }}><CheckCircle2 size={15} />Alert delivered through {selectedNotification.channel.replace(/_/g, ' ').toLowerCase()}.</div><button onClick={() => setSelectedNotification(null)} style={{ width: '100%', marginTop: 22, border: 0, borderRadius: 9, padding: 11, background: '#2563EB', color: '#FFF', fontWeight: 800, cursor: 'pointer' }}>Close details</button></div></div>}
    </div>
  );
};
