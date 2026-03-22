import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Header from '../../components/layout/Header';
import Footer from '../../components/layout/Footer';
import { getMyNotifications, markAsRead } from '../../api/notificationApi';

const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300&family=Jost:wght@300;400;500&display=swap');
  :root { --maroon:#6B1B2A;--maroon-dark:#4A1019;--maroon-soft:#8B2535;--cream:#FAF7F4;--charcoal:#1C1C1E;--muted:#7A7A7A;--border:#E8E0D8; }

  .notif-item { display:flex;gap:16px;padding:18px 20px;background:#fff;border:1px solid var(--border);border-radius:4px;transition:border-color .2s,box-shadow .2s;cursor:pointer;position:relative; }
  .notif-item:hover { border-color:#C4A8A8;box-shadow:0 2px 12px rgba(107,27,42,.06); }
  .notif-item.unread { border-left:3px solid var(--maroon); }
  .notif-item.unread .notif-title { color:var(--charcoal); }

  .notif-icon { width:40px;height:40px;border-radius:50%;display:flex;align-items:center;justify-content:center;flex-shrink:0; }
  .icon-order { background:rgba(107,27,42,.08); }
  .icon-promo  { background:rgba(45,122,79,.08); }
  .icon-info   { background:rgba(30,64,175,.08); }

  .type-badge { display:inline-block;padding:2px 8px;border-radius:99px;font-size:0.6rem;font-weight:500;letter-spacing:0.08em;text-transform:uppercase; }
  .badge-order { background:rgba(107,27,42,.1);color:var(--maroon); }
  .badge-promo  { background:rgba(45,122,79,.1);color:#2D7A4F; }
  .badge-info   { background:#DBEAFE;color:#1E40AF; }

  .unread-dot { width:7px;height:7px;border-radius:50%;background:var(--maroon);flex-shrink:0;margin-top:6px; }

  .tab-btn { padding:8px 18px;font-family:'Jost',sans-serif;font-size:0.72rem;letter-spacing:0.08em;text-transform:uppercase;background:none;border:none;cursor:pointer;color:var(--muted);border-bottom:2px solid transparent;transition:all .2s; }
  .tab-btn.active { color:var(--maroon);border-bottom-color:var(--maroon); }

  .mark-all-btn { font-family:'Jost',sans-serif;font-size:0.7rem;color:var(--maroon);background:none;border:none;cursor:pointer;letter-spacing:0.08em;text-transform:uppercase;padding:0;transition:opacity .2s; }
  .mark-all-btn:hover { opacity:.7; }
  .mark-all-btn:disabled { opacity:.35;cursor:not-allowed; }

  .empty-state { border:1px dashed var(--border);border-radius:4px;padding:64px 24px;text-align:center; }
`;

const typeIcon = (type) => {
  if (type === 'order') return (
    <svg width="18" height="18" fill="none" stroke="var(--maroon)" strokeWidth="1.8" viewBox="0 0 24 24">
      <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"/>
    </svg>
  );
  if (type === 'promo') return (
    <svg width="18" height="18" fill="none" stroke="#2D7A4F" strokeWidth="1.8" viewBox="0 0 24 24">
      <path d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"/>
    </svg>
  );
  return (
    <svg width="18" height="18" fill="none" stroke="#1E40AF" strokeWidth="1.8" viewBox="0 0 24 24">
      <circle cx="12" cy="12" r="10"/><path d="M12 16v-4M12 8h.01"/>
    </svg>
  );
};

const timeAgo = (dateStr) => {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins  = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days  = Math.floor(diff / 86400000);
  if (mins < 60)  return `${mins}m ago`;
  if (hours < 24) return `${hours}h ago`;
  if (days < 7)   return `${days}d ago`;
  return new Date(dateStr).toLocaleDateString('en-GB', { day:'numeric', month:'short' });
};

export default function Notifications() {
  const [notifications, setNotifications] = useState([]);
  const [tab, setTab]                     = useState('All');
  const [fetching, setFetching]           = useState(true);
  const [apiError, setApiError]           = useState('');

  // ── Fetch on mount ──────────────────────────────────────────────────────────
  useEffect(() => {
    (async () => {
      try {
        const { data } = await getMyNotifications();
        setNotifications(data);
      } catch (err) {
        setApiError(err.response?.data?.message || 'Failed to load notifications.');
      } finally {
        setFetching(false);
      }
    })();
  }, []);

  const unreadCount = notifications.filter(n => !n.isRead).length;

  const markRead = async (id) => {
    try {
      await markAsRead(id);
      setNotifications(ns => ns.map(n => n._id === id ? { ...n, isRead: true } : n));
    } catch { /* silently ignore */ }
  };

  const markAllRead = async () => {
    try {
      const unread = notifications.filter(n => !n.isRead);
      await Promise.all(unread.map(n => markAsRead(n._id)));
      setNotifications(ns => ns.map(n => ({ ...n, isRead: true })));
    } catch { /* silently ignore */ }
  };

  const filtered = tab === 'All'
    ? notifications
    : tab === 'Unread'
    ? notifications.filter(n => !n.isRead)
    : notifications.filter(n => n.type === tab.toLowerCase());

  if (fetching) return (
    <>
      <style>{STYLES}</style>
      <Header />
      <div style={{ background:'var(--cream)', minHeight:'100vh', display:'flex', alignItems:'center', justifyContent:'center' }}>
        <p style={{ fontSize:'0.85rem', color:'var(--muted)', fontFamily:"'Jost',sans-serif" }}>Loading notifications…</p>
      </div>
      <Footer />
    </>
  );

  return (
    <>
      <style>{STYLES}</style>
      <Header />
      <div style={{ background:'var(--cream)', minHeight:'100vh', fontFamily:"'Jost',sans-serif", paddingBottom:'64px' }}>

        {/* Page header */}
        <div style={{ borderBottom:'1px solid var(--border)', background:'#fff', padding:'20px 6%' }}>
          <div className="flex items-center gap-2" style={{ fontSize:'0.7rem', color:'var(--muted)', letterSpacing:'0.08em' }}>
            <Link to="/" style={{ color:'var(--muted)', textDecoration:'none' }}>Home</Link>
            <span>/</span>
            <span style={{ color:'var(--charcoal)' }}>Notifications</span>
          </div>
        </div>

        <div className="max-w-3xl mx-auto px-6 py-10">

          {apiError && (
            <div className="mb-5 px-4 py-3 rounded-sm text-sm" style={{ background:'rgba(197,48,48,.08)', color:'#C53030', border:'1px solid rgba(197,48,48,.2)' }}>
              {apiError}
            </div>
          )}

          {/* Title row */}
          <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
            <div className="flex items-center gap-3">
              <h1 style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:'clamp(1.6rem,3vw,2.2rem)', fontWeight:600, color:'var(--charcoal)' }}>
                Notifications
              </h1>
              {unreadCount > 0 && (
                <span style={{ background:'var(--maroon)', color:'#fff', fontSize:'0.65rem', fontWeight:500, borderRadius:'99px', padding:'2px 8px', minWidth:'20px', textAlign:'center' }}>
                  {unreadCount}
                </span>
              )}
            </div>
            <button className="mark-all-btn" onClick={markAllRead} disabled={unreadCount === 0}>
              Mark all as read
            </button>
          </div>

          {/* Tabs */}
          <div style={{ display:'flex', gap:'2px', borderBottom:'1px solid var(--border)', marginBottom:'24px', overflowX:'auto' }}>
            {['All','Unread','Order','Promo','Info'].map(t => (
              <button key={t} className={`tab-btn${tab === t ? ' active' : ''}`} onClick={() => setTab(t)}>
                {t}
              </button>
            ))}
          </div>

          {/* Notifications list */}
          {filtered.length === 0 ? (
            <div className="empty-state">
              <svg width="36" height="36" fill="none" stroke="#D4C5C0" strokeWidth="1.2" viewBox="0 0 24 24" style={{ margin:'0 auto 14px', display:'block' }}>
                <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 01-3.46 0"/>
              </svg>
              <p style={{ fontSize:'0.85rem', color:'var(--muted)' }}>No notifications here.</p>
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              {filtered.map(notif => {
                const Wrapper = notif.link ? Link : 'div';
                const wrapperProps = notif.link ? { to: notif.link, style:{ textDecoration:'none' } } : {};
                return (
                  <Wrapper key={notif._id} {...wrapperProps}>
                    <div
                      className={`notif-item${!notif.isRead ? ' unread' : ''}`}
                      onClick={() => !notif.isRead && markRead(notif._id)}
                    >
                      {/* Icon */}
                      <div className={`notif-icon icon-${notif.type}`}>
                        {typeIcon(notif.type)}
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1 flex-wrap">
                          <span className={`type-badge badge-${notif.type}`}>{notif.type}</span>
                          <span style={{ fontSize:'0.68rem', color:'var(--muted)' }}>{timeAgo(notif.createdAt)}</span>
                        </div>
                        <p className="notif-title" style={{ fontSize:'0.85rem', fontWeight: notif.isRead ? 400 : 500, color: notif.isRead ? 'var(--charcoal)' : 'var(--charcoal)', marginBottom:'4px', lineHeight:1.4 }}>
                          {notif.title}
                        </p>
                        <p style={{ fontSize:'0.77rem', color:'var(--muted)', lineHeight:1.6 }}>
                          {notif.message}
                        </p>
                      </div>

                      {/* Unread dot */}
                      {!notif.isRead && <div className="unread-dot" />}
                    </div>
                  </Wrapper>
                );
              })}
            </div>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
}