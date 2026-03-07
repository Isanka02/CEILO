import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';

// ─── Replace this with your auth context / store ──────────────────────────────
// import { useAuth } from '../context/AuthContext';

export default function Header() {
  const [scrolled, setScrolled]     = useState(false);
  const [menuOpen, setMenuOpen]     = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [keyword, setKeyword]       = useState('');
  const navigate  = useNavigate();
  const location  = useLocation();

  // ── Replace with real auth state ──────────────────────────────────────────
  const user     = null;   // e.g. from useAuth()
  const isAdmin  = false;  // e.g. user?.role === 'admin'
  const cartCount = 0;     // e.g. from cart context

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setMenuOpen(false);
    setSearchOpen(false);
  }, [location]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (keyword.trim()) {
      navigate(`/products?keyword=${keyword.trim()}`);
      setSearchOpen(false);
      setKeyword('');
    }
  };

  const handleLogout = () => {
    // TODO: call your logout function from auth context
    navigate('/login');
  };

  const navLinks = [
  { label: 'Shop',       to: '/products',    scroll: null          },
  { label: 'Categories', to: '/',            scroll: 'categories'  },
  { label: 'Reviews',    to: '/',            scroll: 'reviews'     },
];

  return (
    <>
      {/* ── Google Font ─────────────────────────────────────────────────── */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;600;700&family=Jost:wght@300;400;500&display=swap');

        :root {
          --maroon:      #6B1B2A;
          --maroon-dark: #4A1019;
          --maroon-soft: #8B2535;
          --cream:       #FAF7F4;
          --charcoal:    #1C1C1E;
          --muted:       #7A7A7A;
          --border:      #E8E0D8;
        }

        .font-display { font-family: 'Cormorant Garamond', serif; }
        .font-body    { font-family: 'Jost', sans-serif; }

        .header-glass {
          background: rgba(250, 247, 244, 0.92);
          backdrop-filter: blur(16px);
          -webkit-backdrop-filter: blur(16px);
        }
        .header-scrolled {
          box-shadow: 0 1px 24px rgba(107,27,42,0.08);
          border-bottom: 1px solid var(--border);
        }
        .nav-link {
          position: relative;
          font-family: 'Jost', sans-serif;
          font-weight: 400;
          font-size: 0.8rem;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: var(--charcoal);
          transition: color 0.2s;
        }
        .nav-link::after {
          content: '';
          position: absolute;
          bottom: -2px; left: 0;
          width: 0; height: 1px;
          background: var(--maroon);
          transition: width 0.3s ease;
        }
        .nav-link:hover { color: var(--maroon); }
        .nav-link:hover::after { width: 100%; }
        .nav-link.active { color: var(--maroon); }
        .nav-link.active::after { width: 100%; }

        .icon-btn {
          display: flex; align-items: center; justify-content: center;
          width: 36px; height: 36px;
          border-radius: 50%;
          color: var(--charcoal);
          transition: background 0.2s, color 0.2s;
          cursor: pointer;
          background: transparent;
          border: none;
        }
        .icon-btn:hover {
          background: rgba(107,27,42,0.08);
          color: var(--maroon);
        }

        .search-bar {
          animation: slideDown 0.25s ease;
        }
        @keyframes slideDown {
          from { opacity: 0; transform: translateY(-8px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        .mobile-menu {
          animation: fadeIn 0.2s ease;
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
      `}</style>

      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 header-glass ${scrolled ? 'header-scrolled' : ''}`}
        style={{ fontFamily: "'Jost', sans-serif" }}
      >
        {/* ── Top announcement bar ────────────────────────────────────────── */}
        <div
          className="text-center py-1.5 text-xs tracking-widest font-body"
          style={{ background: 'var(--maroon)', color: '#fff', letterSpacing: '0.15em' }}
        >
          FREE SHIPPING ON ORDERS OVER $75
        </div>

        {/* ── Main nav ────────────────────────────────────────────────────── */}
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">

          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 shrink-0">
            {/* IMAGE PLACEHOLDER — replace with your logo */}
            {/* <img src="/logo.svg" alt="CEILO" className="h-8 w-auto" /> */}
            <span
              className="font-display text-2xl font-semibold tracking-wide"
              style={{ color: 'var(--maroon)' }}
            >
              CEILO
            </span>
          </Link>

          {/* Desktop nav links */}
          <nav className="hidden md:flex items-center gap-10">
  {navLinks.map(({ label, to, scroll }) => (
    <Link
      key={label}
      to={to}
      className={`nav-link ${location.pathname === to && !scroll ? 'active' : ''}`}
      onClick={() => {
        if (scroll) {
          setTimeout(() => {
            document.getElementById(scroll)?.scrollIntoView({ behavior: 'smooth' });
          }, 100);
        }
      }}
    >
      {label}
    </Link>
  ))}
</nav>

          {/* Right icons */}
          <div className="flex items-center gap-1">

            {/* Search */}
            <button className="icon-btn" onClick={() => setSearchOpen(o => !o)} aria-label="Search">
              <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
                <circle cx="11" cy="11" r="7"/><path d="M21 21l-4.35-4.35"/>
              </svg>
            </button>

            {/* Cart */}
            <Link to="/checkout" className="icon-btn relative" aria-label="Cart">
              <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
                <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/>
                <path d="M16 10a4 4 0 01-8 0"/>
              </svg>
              {cartCount > 0 && (
                <span
                  className="absolute -top-1 -right-1 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center"
                  style={{ background: 'var(--maroon)', fontSize: '0.6rem' }}
                >
                  {cartCount}
                </span>
              )}
            </Link>

            {/* Notifications */}
            {user && (
              <Link to="/notifications" className="icon-btn" aria-label="Notifications">
                <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
                  <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 01-3.46 0"/>
                </svg>
              </Link>
            )}

            {/* User dropdown */}
            {user ? (
              <div className="dropdown dropdown-end">
                <button tabIndex={0} className="icon-btn" aria-label="Account">
                  <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
                    <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/>
                  </svg>
                </button>
                <ul
                  tabIndex={0}
                  className="dropdown-content menu shadow-lg rounded-box w-52 mt-2 py-2"
                  style={{ background: 'var(--cream)', border: '1px solid var(--border)' }}
                >
                  {[
                    { label: 'My Profile',   to: '/profile'         },
                    { label: 'My Orders',    to: '/profile/orders'  },
                    { label: 'Saved Items',  to: '/profile/saved'   },
                    { label: 'Addresses',    to: '/profile/addresses'},
                  ].map(({ label, to }) => (
                    <li key={to}>
                      <Link
                        to={to}
                        className="font-body text-sm py-2 px-4 hover:text-white rounded"
                        style={{ '--tw-bg-opacity': 1 }}
                        onMouseEnter={e => { e.currentTarget.style.background = 'var(--maroon)'; e.currentTarget.style.color = '#fff'; }}
                        onMouseLeave={e => { e.currentTarget.style.background = ''; e.currentTarget.style.color = ''; }}
                      >
                        {label}
                      </Link>
                    </li>
                  ))}
                  {isAdmin && (
                    <li>
                      <Link
                        to="/admin"
                        className="font-body text-sm py-2 px-4"
                        onMouseEnter={e => { e.currentTarget.style.background = 'var(--maroon)'; e.currentTarget.style.color = '#fff'; }}
                        onMouseLeave={e => { e.currentTarget.style.background = ''; e.currentTarget.style.color = ''; }}
                      >
                        Admin Panel
                      </Link>
                    </li>
                  )}
                  <li><hr style={{ borderColor: 'var(--border)' }} className="my-1" /></li>
                  <li>
                    <button
                      onClick={handleLogout}
                      className="font-body text-sm py-2 px-4 w-full text-left"
                      style={{ color: 'var(--maroon)' }}
                    >
                      Sign Out
                    </button>
                  </li>
                </ul>
              </div>
            ) : (
              <Link
                to="/login"
                className="hidden md:inline-flex items-center gap-2 px-5 py-2 text-xs tracking-widest font-body uppercase ml-2 transition-all duration-200"
                style={{
                  border: '1px solid var(--maroon)',
                  color: 'var(--maroon)',
                  borderRadius: '2px',
                }}
                onMouseEnter={e => { e.currentTarget.style.background = 'var(--maroon)'; e.currentTarget.style.color = '#fff'; }}
                onMouseLeave={e => { e.currentTarget.style.background = ''; e.currentTarget.style.color = 'var(--maroon)'; }}
              >
                Sign In
              </Link>
            )}

            {/* Mobile hamburger */}
            <button
              className="icon-btn md:hidden ml-1"
              onClick={() => setMenuOpen(o => !o)}
              aria-label="Menu"
            >
              {menuOpen ? (
                <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
                  <path d="M18 6L6 18M6 6l12 12"/>
                </svg>
              ) : (
                <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
                  <path d="M3 12h18M3 6h18M3 18h18"/>
                </svg>
              )}
            </button>
          </div>
        </div>

        {/* ── Search bar ──────────────────────────────────────────────────── */}
        {searchOpen && (
          <div
            className="search-bar border-t px-6 py-3"
            style={{ borderColor: 'var(--border)', background: 'var(--cream)' }}
          >
            <form onSubmit={handleSearch} className="max-w-xl mx-auto flex items-center gap-3">
              <input
                autoFocus
                type="text"
                value={keyword}
                onChange={e => setKeyword(e.target.value)}
                placeholder="Search for products..."
                className="flex-1 bg-transparent outline-none font-body text-sm py-1"
                style={{ borderBottom: '1px solid var(--maroon)', color: 'var(--charcoal)' }}
              />
              <button
                type="submit"
                className="text-xs uppercase tracking-widest font-body transition-colors"
                style={{ color: 'var(--maroon)' }}
              >
                Search
              </button>
            </form>
          </div>
        )}

        {/* ── Mobile menu ─────────────────────────────────────────────────── */}
        {menuOpen && (
          <nav
            className="mobile-menu md:hidden px-6 py-6 flex flex-col gap-5 border-t"
            style={{ background: 'var(--cream)', borderColor: 'var(--border)' }}
          >
            {navLinks.map(({ label, to, scroll }) => (
  <Link
    key={label}
    to={to}
    className="nav-link text-base"
    style={{ fontSize: '0.85rem' }}
    onClick={() => {
      if (scroll) {
        setTimeout(() => {
          document.getElementById(scroll)?.scrollIntoView({ behavior: 'smooth' });
        }, 100);
      }
    }}
  >
    {label}
  </Link>
))}
            <hr style={{ borderColor: 'var(--border)' }} />
            {user ? (
              <>
                <Link to="/profile"         className="nav-link" style={{ fontSize: '0.85rem' }}>Profile</Link>
                <Link to="/profile/orders"  className="nav-link" style={{ fontSize: '0.85rem' }}>My Orders</Link>
                <button onClick={handleLogout} className="nav-link text-left" style={{ fontSize: '0.85rem', color: 'var(--maroon)' }}>Sign Out</button>
              </>
            ) : (
              <Link to="/login" className="nav-link" style={{ fontSize: '0.85rem' }}>Sign In</Link>
            )}
          </nav>
        )}
      </header>

      {/* Spacer so content doesn't hide behind fixed header */}
      <div style={{ height: '104px' }} />
    </>
  );
}