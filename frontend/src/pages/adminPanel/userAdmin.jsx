import React, { useState, useEffect } from 'react';
import Header from '../../components/layout/Header';
import Sidebar from '../../components/layout/Sidebar';
import { getAllUsers, blockUser, unblockUser } from '../../api/adminApi';

const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;600;700&family=Jost:wght@300;400;500&display=swap');
  :root { --maroon:#6B1B2A;--maroon-dark:#4A1019;--maroon-soft:#8B2535;--cream:#FAF7F4;--charcoal:#1C1C1E;--muted:#7A7A7A;--border:#E8E0D8; }
  .section-card { background:#fff;border:1px solid var(--border);border-radius:4px; }
  .table-header { display:grid;padding:12px 20px;background:#FAF7F4;border-bottom:1px solid var(--border);font-size:0.68rem;letter-spacing:0.1em;text-transform:uppercase;color:var(--muted); }
  .table-row { display:grid;padding:14px 20px;border-bottom:1px solid var(--border);align-items:center;font-size:0.82rem;color:var(--charcoal);transition:background .15s; }
  .table-row:last-child { border-bottom:none; }
  .table-row:hover { background:#FDFAF8; }
  .badge { display:inline-flex;align-items:center;padding:3px 10px;border-radius:99px;font-size:0.65rem;letter-spacing:0.08em;text-transform:uppercase;font-weight:500; }
  .action-btn { padding:5px 14px;border-radius:3px;font-family:'Jost',sans-serif;font-size:0.68rem;letter-spacing:0.08em;text-transform:uppercase;cursor:pointer;border:1px solid;transition:all .2s; }
  .search-input { padding:8px 14px;font-family:'Jost',sans-serif;font-size:0.82rem;background:#fff;border:1px solid var(--border);border-radius:3px;color:var(--charcoal);outline:none;transition:border-color .2s; }
  .search-input:focus { border-color:var(--maroon); }
  .avatar-sm { width:34px;height:34px;border-radius:50%;background:rgba(107,27,42,.1);display:flex;align-items:center;justify-content:center;font-family:'Cormorant Garamond',serif;font-size:0.85rem;font-weight:600;color:var(--maroon);flex-shrink:0; }
`;

export default function UserAdmin() {
  const [users, setUsers]       = useState([]);
  const [search, setSearch]     = useState('');
  const [filter, setFilter]     = useState('all');
  const [fetching, setFetching] = useState(true);
  const [apiError, setApiError] = useState('');

  useEffect(() => {
    (async () => {
      try {
        const { data } = await getAllUsers();
        setUsers(data);
      } catch (err) {
        setApiError(err.response?.data?.message || 'Failed to load users.');
      } finally {
        setFetching(false);
      }
    })();
  }, []);

  const filtered = users.filter(u => {
    const matchFilter = filter === 'all' || (filter === 'blocked' ? u.isBlocked : filter === 'admin' ? u.role === 'admin' : !u.isBlocked && u.role === 'user');
    const matchSearch = !search || u.name.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase());
    return matchFilter && matchSearch;
  });

  const handleBlock = async (userId) => {
    try {
      await blockUser(userId);
      setUsers(p => p.map(u => u._id === userId ? { ...u, isBlocked: true } : u));
    } catch (err) {
      setApiError(err.response?.data?.message || 'Failed to block user.');
    }
  };

  const handleUnblock = async (userId) => {
    try {
      await unblockUser(userId);
      setUsers(p => p.map(u => u._id === userId ? { ...u, isBlocked: false } : u));
    } catch (err) {
      setApiError(err.response?.data?.message || 'Failed to unblock user.');
    }
  };

  const initials = name => name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2);
  const fmtDate  = d => new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

  if (fetching) return (
    <>
      <style>{STYLES}</style>
      <Header />
      <div className="min-h-screen flex items-center justify-center" style={{ background: 'var(--cream)' }}>
        <p style={{ fontSize: '0.85rem', color: 'var(--muted)', fontFamily: "'Jost',sans-serif" }}>Loading users…</p>
      </div>
    </>
  );

  return (
    <>
      <style>{STYLES}</style>
      <Header />
      <div className="min-h-screen" style={{ background: 'var(--cream)', fontFamily: "'Jost',sans-serif" }}>
        <div className="max-w-7xl mx-auto px-6 py-12 flex flex-col md:flex-row gap-10">
          <Sidebar variant="admin" />

          <main className="flex-1 min-w-0">
            <h1 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: '1.7rem', fontWeight: 600, color: 'var(--charcoal)', marginBottom: '4px' }}>Users</h1>
            <p style={{ fontSize: '0.82rem', color: 'var(--muted)', marginBottom: '28px' }}>Manage customer accounts and access</p>

            {apiError && (
              <div className="mb-5 px-4 py-3 rounded-sm text-sm" style={{ background: 'rgba(197,48,48,.08)', color: '#C53030', border: '1px solid rgba(197,48,48,.2)' }}>
                {apiError}
              </div>
            )}

            {/* Filters */}
            <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
              <div className="flex gap-1.5 flex-wrap">
                {[
                  { key: 'all',     label: `All (${users.length})` },
                  { key: 'user',    label: `Customers (${users.filter(u => u.role === 'user' && !u.isBlocked).length})` },
                  { key: 'admin',   label: `Admins (${users.filter(u => u.role === 'admin').length})` },
                  { key: 'blocked', label: `Blocked (${users.filter(u => u.isBlocked).length})` },
                ].map(({ key, label }) => (
                  <button key={key} onClick={() => setFilter(key)}
                    style={{ padding: '6px 14px', borderRadius: '99px', fontFamily: "'Jost',sans-serif", fontSize: '0.7rem', letterSpacing: '0.06em', textTransform: 'uppercase', cursor: 'pointer', border: '1px solid', transition: 'all .2s', background: filter === key ? 'var(--maroon)' : '#fff', color: filter === key ? '#fff' : 'var(--muted)', borderColor: filter === key ? 'var(--maroon)' : 'var(--border)' }}>
                    {label}
                  </button>
                ))}
              </div>
              <input className="search-input" placeholder="Search name or email…" value={search} onChange={e => setSearch(e.target.value)} style={{ width: '220px' }} />
            </div>

            {/* Table */}
            <div className="section-card">
              <div className="table-header" style={{ gridTemplateColumns: '2fr 2fr 0.8fr 0.8fr 0.8fr auto' }}>
                <span>User</span><span>Email</span><span>Role</span><span>Orders</span><span>Joined</span><span>Actions</span>
              </div>

              {filtered.length === 0 ? (
                <div className="text-center py-12" style={{ color: 'var(--muted)', fontSize: '0.85rem' }}>No users found.</div>
              ) : filtered.map(user => (
                <div key={user._id} className="table-row" style={{ gridTemplateColumns: '2fr 2fr 0.8fr 0.8fr 0.8fr auto', gap: '12px' }}>

                  <div className="flex items-center gap-3">
                    {/* IMAGE: user avatar — 34×34px circular, falls back to initials */}
                    <div className="avatar-sm">{initials(user.name)}</div>
                    <div>
                      <p style={{ fontWeight: 500 }}>{user.name}</p>
                      {user.isBlocked && <span className="badge" style={{ background: 'rgba(197,48,48,.1)', color: '#C53030', fontSize: '0.6rem' }}>Blocked</span>}
                    </div>
                  </div>

                  <span style={{ color: 'var(--muted)', fontSize: '0.78rem' }}>{user.email}</span>

                  <span className="badge" style={{
                    background: user.role === 'admin' ? 'rgba(107,27,42,.1)' : 'rgba(56,161,105,.1)',
                    color: user.role === 'admin' ? 'var(--maroon)' : '#276749',
                  }}>
                    {user.role}
                  </span>

                  <span style={{ color: 'var(--muted)' }}>{user.orders}</span>

                  <span style={{ fontSize: '0.75rem', color: 'var(--muted)' }}>{fmtDate(user.createdAt)}</span>

                  <div>
                    {user.role !== 'admin' && (
                      user.isBlocked ? (
                        <button className="action-btn" onClick={() => handleUnblock(user._id)}
                          style={{ borderColor: '#276749', color: '#276749' }}
                          onMouseEnter={e => { e.currentTarget.style.background = '#276749'; e.currentTarget.style.color = '#fff'; }}
                          onMouseLeave={e => { e.currentTarget.style.background = ''; e.currentTarget.style.color = '#276749'; }}>
                          Unblock
                        </button>
                      ) : (
                        <button className="action-btn" onClick={() => handleBlock(user._id)}
                          style={{ borderColor: '#C53030', color: '#C53030' }}
                          onMouseEnter={e => { e.currentTarget.style.background = '#C53030'; e.currentTarget.style.color = '#fff'; }}
                          onMouseLeave={e => { e.currentTarget.style.background = ''; e.currentTarget.style.color = '#C53030'; }}>
                          Block
                        </button>
                      )
                    )}
                  </div>
                </div>
              ))}
            </div>
          </main>
        </div>
      </div>
    </>
  );
}