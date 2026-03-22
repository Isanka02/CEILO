import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../../context/useCart';

const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;600;700&family=Jost:wght@300;400;500&display=swap');
  :root {
    --maroon:#6B1B2A; --maroon-dark:#4A1019; --maroon-soft:#8B2535;
    --cream:#FAF7F4; --charcoal:#1C1C1E; --muted:#7A7A7A; --border:#E8E0D8;
  }

  /* ── Announcement bar ── */
  .ceilo-announce {
    background: var(--maroon-dark);
    color: rgba(255,255,255,.75);
    font-family: 'Jost', sans-serif;
    font-size: 0.68rem;
    letter-spacing: 0.14em;
    text-transform: uppercase;
    text-align: center;
    padding: 9px 16px;
  }

  /* ── Header ── */
  .ceilo-header {
    position: sticky;
    top: 0;
    z-index: 40;
    background: #fff;
    border-bottom: 1px solid var(--border);
    font-family: 'Jost', sans-serif;
  }

  .ceilo-header-inner {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 5%;
    height: 64px;
  }

  /* ── Logo ── */
  .ceilo-logo {
    font-family: 'Cormorant Garamond', serif;
    font-size: 1.55rem;
    font-weight: 600;
    color: var(--charcoal);
    letter-spacing: 0.1em;
    text-decoration: none;
    flex-shrink: 0;
  }
  .ceilo-logo:hover { color: var(--maroon); }

  /* ── Nav links ── */
  .ceilo-nav {
    display: flex;
    align-items: center;
    gap: 32px;
    list-style: none;
    margin: 0;
    padding: 0;
  }
  .ceilo-nav a {
    font-size: 0.72rem;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    color: var(--charcoal);
    text-decoration: none;
    transition: color .2s;
    position: relative;
    padding-bottom: 2px;
  }
  .ceilo-nav a::after {
    content: '';
    position: absolute;
    bottom: -2px;
    left: 0;
    width: 0;
    height: 1px;
    background: var(--maroon);
    transition: width .25s ease;
  }
  .ceilo-nav a:hover { color: var(--maroon); }
  .ceilo-nav a:hover::after { width: 100%; }

  /* ── Right actions ── */
  .ceilo-actions {
    display: flex;
    align-items: center;
    gap: 4px;
  }

  .ceilo-icon-btn {
    width: 38px;
    height: 38px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    border: none;
    background: transparent;
    cursor: pointer;
    color: var(--charcoal);
    transition: background .2s, color .2s;
    position: relative;
    text-decoration: none;
  }
  .ceilo-icon-btn:hover { background: rgba(107,27,42,.07); color: var(--maroon); }

  /* Cart badge */
  .cart-badge {
    position: absolute;
    top: 4px;
    right: 4px;
    width: 16px;
    height: 16px;
    border-radius: 50%;
    background: var(--maroon);
    color: #fff;
    font-size: 0.55rem;
    font-weight: 600;
    display: flex;
    align-items: center;
    justify-content: center;
    line-height: 1;
  }

  /* ── User avatar trigger ── */
  .ceilo-avatar-btn {
    width: 34px;
    height: 34px;
    border-radius: 50%;
    border: 1.5px solid var(--border);
    background: rgba(107,27,42,.08);
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: hidden;
    transition: border-color .2s, box-shadow .2s;
    margin-left: 4px;
    flex-shrink: 0;
  }
  .ceilo-avatar-btn:hover { border-color: var(--maroon); box-shadow: 0 0 0 3px rgba(107,27,42,.1); }
  .ceilo-avatar-btn img { width: 100%; height: 100%; object-fit: cover; }
  .ceilo-avatar-initials {
    font-family: 'Cormorant Garamond', serif;
    font-size: 0.75rem;
    font-weight: 600;
    color: var(--maroon);
    user-select: none;
  }

  /* ── Dropdown ── */
  .ceilo-dropdown {
    position: absolute;
    top: calc(100% + 10px);
    right: 0;
    width: 230px;
    background: #fff;
    border: 1px solid var(--border);
    border-radius: 6px;
    box-shadow: 0 8px 32px rgba(26,8,16,.12);
    z-index: 100;
    overflow: hidden;
    animation: dropIn .18s ease;
  }
  @keyframes dropIn {
    from { opacity: 0; transform: translateY(-6px); }
    to   { opacity: 1; transform: translateY(0); }
  }

  .ceilo-dropdown-header {
    padding: 14px 16px 12px;
    border-bottom: 1px solid var(--border);
    background: #FDFAF8;
  }
  .ceilo-dropdown-name {
    font-size: 0.85rem;
    font-weight: 500;
    color: var(--charcoal);
    margin-bottom: 1px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .ceilo-dropdown-email {
    font-size: 0.7rem;
    color: var(--muted);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .ceilo-dropdown-section {
    padding: 6px 0;
    border-bottom: 1px solid var(--border);
  }
  .ceilo-dropdown-section:last-child { border-bottom: none; }

  .ceilo-dropdown-item {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 9px 16px;
    font-size: 0.78rem;
    color: var(--charcoal);
    text-decoration: none;
    cursor: pointer;
    transition: background .15s, color .15s;
    background: transparent;
    border: none;
    width: 100%;
    text-align: left;
    font-family: 'Jost', sans-serif;
    letter-spacing: 0.02em;
  }
  .ceilo-dropdown-item:hover { background: rgba(107,27,42,.06); color: var(--maroon); }
  .ceilo-dropdown-item svg { flex-shrink: 0; opacity: 0.7; }
  .ceilo-dropdown-item:hover svg { opacity: 1; }

  .ceilo-dropdown-item.danger { color: #C53030; }
  .ceilo-dropdown-item.danger:hover { background: rgba(197,48,48,.06); color: #C53030; }

  .ceilo-sign-in-btn {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    padding: 7px 18px;
    border: 1px solid var(--maroon);
    border-radius: 3px;
    color: var(--maroon);
    font-family: 'Jost', sans-serif;
    font-size: 0.7rem;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    text-decoration: none;
    transition: all .2s;
    white-space: nowrap;
  }
  .ceilo-sign-in-btn:hover { background: var(--maroon); color: #fff; }

  /* ── Mobile menu ── */
  .ceilo-mobile-overlay {
    position: fixed;
    inset: 0;
    background: rgba(26,8,16,.5);
    z-index: 50;
    animation: fadeIn .2s ease;
  }
  @keyframes fadeIn { from{opacity:0}to{opacity:1} }

  .ceilo-mobile-drawer {
    position: fixed;
    top: 0;
    right: 0;
    bottom: 0;
    width: min(320px, 85vw);
    background: #fff;
    z-index: 51;
    display: flex;
    flex-direction: column;
    animation: slideIn .25s ease;
    overflow-y: auto;
  }
  @keyframes slideIn {
    from { transform: translateX(100%); }
    to   { transform: translateX(0); }
  }

  .ceilo-mobile-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 18px 20px;
    border-bottom: 1px solid var(--border);
  }

  .ceilo-mobile-nav a,
  .ceilo-mobile-nav button {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 14px 20px;
    font-family: 'Jost', sans-serif;
    font-size: 0.82rem;
    letter-spacing: 0.06em;
    color: var(--charcoal);
    text-decoration: none;
    border: none;
    background: none;
    width: 100%;
    text-align: left;
    cursor: pointer;
    border-bottom: 1px solid var(--border);
    transition: background .15s, color .15s;
  }
  .ceilo-mobile-nav a:hover,
  .ceilo-mobile-nav button:hover { background: rgba(107,27,42,.05); color: var(--maroon); }
  .ceilo-mobile-nav .section-label {
    padding: 10px 20px 4px;
    font-size: 0.62rem;
    letter-spacing: 0.15em;
    text-transform: uppercase;
    color: var(--muted);
    border-bottom: none;
  }

  /* ── Search bar ── */
  .ceilo-search-overlay {
    position: fixed;
    inset: 0;
    background: rgba(26,8,16,.5);
    z-index: 45;
    display: flex;
    align-items: flex-start;
    justify-content: center;
    padding-top: 80px;
    animation: fadeIn .15s ease;
  }
  .ceilo-search-box {
    background: #fff;
    border-radius: 6px;
    width: min(560px, 90vw);
    box-shadow: 0 16px 48px rgba(26,8,16,.18);
    overflow: hidden;
    animation: dropIn .2s ease;
  }
  .ceilo-search-input {
    width: 100%;
    padding: 16px 20px 16px 48px;
    font-family: 'Jost', sans-serif;
    font-size: 0.95rem;
    color: var(--charcoal);
    border: none;
    outline: none;
    background: transparent;
  }
  .ceilo-search-input::placeholder { color: #B8B0A8; }

  @media (max-width: 768px) {
    .ceilo-nav { display: none; }
    .ceilo-sign-in-btn { display: none; }
  }
  @media (min-width: 769px) {
    .ceilo-hamburger { display: none !important; }
  }
`;

// ── Icons ─────────────────────────────────────────────────────────────────────
const Icon = {
  search:   <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24"><circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/></svg>,
  cart:     <svg width="19" height="19" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24"><path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 01-8 0"/></svg>,
  bell:     <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24"><path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 01-3.46 0"/></svg>,
  menu:     <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>,
  close:    <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>,
  profile:  <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>,
  orders:   <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24"><path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/></svg>,
  heart:    <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24"><path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/></svg>,
  address:  <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/></svg>,
  logout:   <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24"><path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>,
  admin:    <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>,
  shop:     <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>,
  category: <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>,
  star:     <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>,
};

const getInitials = (name = '') =>
  name.trim().split(' ').map(w => w[0]).slice(0, 2).join('').toUpperCase() || '?';

export default function Header() {
  const navigate = useNavigate();
  const { cartItems = [] } = useCart();

  // Read user from localStorage — stays in sync when profile updates it
  const [user, setUser] = useState(() => {
    try { return JSON.parse(localStorage.getItem('user') || 'null'); } catch { return null; }
  });

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileOpen,   setMobileOpen]   = useState(false);
  const [searchOpen,   setSearchOpen]   = useState(false);
  const [searchQuery,  setSearchQuery]  = useState('');

  const dropdownRef = useRef(null);
  const searchRef   = useRef(null);

  // Re-sync user from localStorage when storage changes (e.g. profile update)
  useEffect(() => {
    const sync = () => {
      try { setUser(JSON.parse(localStorage.getItem('user') || 'null')); } catch { setUser(null); }
    };
    window.addEventListener('storage', sync);
    // Also check on focus (tab switch back)
    window.addEventListener('focus', sync);
    return () => { window.removeEventListener('storage', sync); window.removeEventListener('focus', sync); };
  }, []);

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  // Close search on Escape
  useEffect(() => {
    const handler = (e) => { if (e.key === 'Escape') { setSearchOpen(false); setMobileOpen(false); } };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, []);

  // Focus search input when opened
  useEffect(() => {
    if (searchOpen && searchRef.current) searchRef.current.focus();
  }, [searchOpen]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    setDropdownOpen(false);
    setMobileOpen(false);
    navigate('/');
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setSearchOpen(false);
      navigate(`/products?keyword=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
    }
  };

  const cartCount = cartItems.reduce((s, i) => s + (i.quantity || 1), 0);
  const isAdmin   = user?.role === 'admin';

  const closeAll = () => { setDropdownOpen(false); setMobileOpen(false); };

  return (
    <>
      <style>{STYLES}</style>

      {/* ── Announcement bar ── */}
      <div className="ceilo-announce">
        Free shipping on orders over LKR 6000 &nbsp;&amp;&nbsp; free returns within 30 days
      </div>

      {/* ── Main header ── */}
      <header className="ceilo-header">
        <div className="ceilo-header-inner">

          {/* Logo */}
          <Link to="/" className="ceilo-logo">CEILO</Link>

          {/* Desktop nav */}
          <nav aria-label="Main">
            <ul className="ceilo-nav">
              <li><Link to="/products">Shop</Link></li>
              <li><Link to="/categories">Categories</Link></li>
              <li><Link to="/shop-reviews">Reviews</Link></li>
            </ul>
          </nav>

          {/* Right actions */}
          <div className="ceilo-actions">

            {/* Search */}
            <button className="ceilo-icon-btn" onClick={() => setSearchOpen(true)} aria-label="Search">
              {Icon.search}
            </button>

            {/* Cart */}
            <Link to="/checkout" className="ceilo-icon-btn" aria-label="Cart">
              {Icon.cart}
              {cartCount > 0 && <span className="cart-badge">{cartCount > 9 ? '9+' : cartCount}</span>}
            </Link>

            {user ? (
              <>
                {/* Notifications */}
                <Link to="/notifications" className="ceilo-icon-btn" aria-label="Notifications">
                  {Icon.bell}
                </Link>

                {/* Avatar → dropdown */}
                <div style={{ position: 'relative' }} ref={dropdownRef}>
                  <button
                    className="ceilo-avatar-btn"
                    onClick={() => setDropdownOpen(o => !o)}
                    aria-label="Account menu"
                    aria-expanded={dropdownOpen}
                  >
                    {user.avatar
                      ? <img src={user.avatar} alt={user.name} />
                      : <span className="ceilo-avatar-initials">{getInitials(user.name)}</span>
                    }
                  </button>

                  {dropdownOpen && (
                    <div className="ceilo-dropdown" role="menu">
                      {/* User info */}
                      <div className="ceilo-dropdown-header">
                        <p className="ceilo-dropdown-name">{user.name}</p>
                        <p className="ceilo-dropdown-email">{user.email}</p>
                      </div>

                      {/* Admin shortcut */}
                      {isAdmin && (
                        <div className="ceilo-dropdown-section">
                          <Link to="/admin" className="ceilo-dropdown-item" onClick={closeAll} role="menuitem"
                            style={{ color: 'var(--maroon)', fontWeight: 500 }}>
                            {Icon.admin} Admin Panel
                          </Link>
                        </div>
                      )}

                      {/* Account links */}
                      <div className="ceilo-dropdown-section">
                        <Link to="/profile" className="ceilo-dropdown-item" onClick={closeAll} role="menuitem">
                          {Icon.profile} My Profile
                        </Link>
                        <Link to="/profile/orders" className="ceilo-dropdown-item" onClick={closeAll} role="menuitem">
                          {Icon.orders} My Orders
                        </Link>
                        <Link to="/profile/saved" className="ceilo-dropdown-item" onClick={closeAll} role="menuitem">
                          {Icon.heart} Saved Items
                        </Link>
                        <Link to="/profile/addresses" className="ceilo-dropdown-item" onClick={closeAll} role="menuitem">
                          {Icon.address} Addresses
                        </Link>
                        <Link to="/notifications" className="ceilo-dropdown-item" onClick={closeAll} role="menuitem">
                          {Icon.bell} Notifications
                        </Link>
                      </div>

                      {/* Logout */}
                      <div className="ceilo-dropdown-section">
                        <button className="ceilo-dropdown-item danger" onClick={handleLogout} role="menuitem">
                          {Icon.logout} Sign Out
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <>
                {/* Sign In button (desktop) */}
                <Link to="/login" className="ceilo-sign-in-btn" style={{ marginLeft: '6px' }}>
                  Sign In
                </Link>
              </>
            )}

            {/* Hamburger (mobile) */}
            <button
              className="ceilo-icon-btn ceilo-hamburger"
              onClick={() => setMobileOpen(true)}
              aria-label="Open menu"
            >
              {Icon.menu}
            </button>
          </div>
        </div>
      </header>

      {/* ── Search overlay ── */}
      {searchOpen && (
        <div className="ceilo-search-overlay" onClick={() => setSearchOpen(false)}>
          <div className="ceilo-search-box" onClick={e => e.stopPropagation()}>
            <form onSubmit={handleSearch} style={{ display: 'flex', alignItems: 'center', position: 'relative' }}>
              <div style={{ position: 'absolute', left: '16px', color: 'var(--muted)' }}>{Icon.search}</div>
              <input
                ref={searchRef}
                className="ceilo-search-input"
                placeholder="Search products…"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
              />
              <button type="button" onClick={() => setSearchOpen(false)}
                style={{ padding: '16px', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--muted)' }}>
                {Icon.close}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* ── Mobile drawer ── */}
      {mobileOpen && (
        <>
          <div className="ceilo-mobile-overlay" onClick={() => setMobileOpen(false)} />
          <div className="ceilo-mobile-drawer">
            <div className="ceilo-mobile-header">
              <Link to="/" className="ceilo-logo" style={{ fontSize: '1.3rem' }} onClick={closeAll}>CEILO</Link>
              <button onClick={() => setMobileOpen(false)} className="ceilo-icon-btn">{Icon.close}</button>
            </div>

            <nav className="ceilo-mobile-nav">
              {/* Shop links */}
              <p className="section-label">Shop</p>
              <Link to="/products"    onClick={closeAll}>{Icon.shop}     All Products</Link>
              <Link to="/categories"  onClick={closeAll}>{Icon.category} Categories</Link>
              <Link to="/shop-reviews" onClick={closeAll}>{Icon.star}    Reviews</Link>

              {user ? (
                <>
                  {/* Account links */}
                  <p className="section-label">My Account</p>
                  {isAdmin && (
                    <Link to="/admin" onClick={closeAll} style={{ color: 'var(--maroon)', fontWeight: 500 }}>
                      {Icon.admin} Admin Panel
                    </Link>
                  )}
                  <Link to="/profile"       onClick={closeAll}>{Icon.profile}  My Profile</Link>
                  <Link to="/my-orders"        onClick={closeAll}>{Icon.orders}   My Orders</Link>
                  <Link to="/profile/saved"      onClick={closeAll}>{Icon.heart}    Saved Items</Link>
                  <Link to="/profile/addresses"     onClick={closeAll}>{Icon.address}  Addresses</Link>
                  <Link to="/notifications" onClick={closeAll}>{Icon.bell}     Notifications</Link>
                  <button onClick={handleLogout} style={{ color: '#C53030' }}>
                    {Icon.logout} Sign Out
                  </button>
                </>
              ) : (
                <>
                  <p className="section-label">Account</p>
                  <Link to="/login"    onClick={closeAll}>{Icon.profile} Sign In</Link>
                  <Link to="/register" onClick={closeAll}>{Icon.profile} Create Account</Link>
                </>
              )}
            </nav>
          </div>
        </>
      )}
    </>
  );
}