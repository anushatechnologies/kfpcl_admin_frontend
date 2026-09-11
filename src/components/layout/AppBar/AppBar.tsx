import React, { useState } from 'react';
import { Typography } from '@mui/material';
import { Breadcrumb } from '@components/Breadcrumb';
import AppLoader from '@components/AppLoader';
import ThemeSwitcher from '@components/ThemeSwitcher';
import { Bell } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const TopNav: React.FC = () => {
  const navigate = useNavigate();
  const [notificationsOpen, setNotificationsOpen] = useState(false);

  return (
    <>
      <header style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16, padding: '16px 24px', background: 'var(--color-header)', borderBottom: '1px solid var(--color-border)', boxShadow: 'var(--shadow-sm)', backdropFilter: 'blur(20px)', position: 'sticky', top: 0, zIndex: 40 }}>
        <div style={{ minWidth: 180, display: 'grid', gap: 4 }}>
          <Breadcrumb />
          <Typography component="div" sx={{ fontSize: 12, color: 'text.secondary', display: { xs: 'none', md: 'block' } }}>
            Manage operations, catalogs, and admin workflows.
          </Typography>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexShrink: 0 }}>
          <div className="header-notification-wrap">
            <button type="button" aria-label="Open notifications" aria-expanded={notificationsOpen} onClick={() => setNotificationsOpen((open) => !open)} style={{ width: 40, height: 40, borderRadius: 14, border: '1px solid var(--color-border)', background: 'var(--color-card)', color: 'var(--color-text-muted)', boxShadow: 'var(--shadow-sm)', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
              <Bell size={16} />
            </button>
            {notificationsOpen && <>
              <button className="notification-dismiss-layer" aria-label="Close notifications" onClick={() => setNotificationsOpen(false)} />
              <div className="notification-popover">
                <div className="notification-popover-header"><div><strong>Notifications</strong><span>Notification center</span></div><button onClick={() => { setNotificationsOpen(false); navigate('/notifications'); }}>View all</button></div>
                <div className="notification-list"><div className="notification-empty"><Bell size={22} /><strong>Notification history unavailable</strong><span>The supplied API contract supports sending notifications, but does not provide a list endpoint.</span><button onClick={() => { setNotificationsOpen(false); navigate('/notifications'); }}>Open notification center</button></div></div>
              </div>
            </>}
          </div>
          <ThemeSwitcher />
        </div>
      </header>
      <AppLoader />
    </>
  );
};

export default TopNav;
