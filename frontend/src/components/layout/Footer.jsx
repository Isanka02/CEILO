import React from 'react';
import { Link } from 'react-router-dom';

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;600&family=Jost:wght@300;400;500&display=swap');
        .footer-link {
          font-family: 'Jost', sans-serif;
          font-size: 0.78rem;
          letter-spacing: 0.06em;
          color: #C4B5B8;
          transition: color 0.2s;
          text-decoration: none;
        }
        .footer-link:hover { color: #fff; }
        .footer-social {
          width: 34px; height: 34px;
          border-radius: 50%;
          display: flex; align-items: center; justify-content: center;
          border: 1px solid rgba(255,255,255,0.15);
          color: #C4B5B8;
          transition: all 0.2s;
          cursor: pointer;
        }
        .footer-social:hover {
          border-color: #fff;
          color: #fff;
          background: rgba(255,255,255,0.05);
        }
      `}</style>

      <footer style={{ background: '#1A0810', color: '#C4B5B8', fontFamily: "'Jost', sans-serif" }}>

        {/* ── Newsletter strip ──────────────────────────────────────────── */}
        <div
          className="border-b"
          style={{ borderColor: 'rgba(255,255,255,0.08)' }}
        >
          <div className="max-w-7xl mx-auto px-6 py-10 flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <p
                className="text-white mb-1"
                style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '1.35rem', fontWeight: 600 }}
              >
                Join the CEILO Circle
              </p>
              <p style={{ fontSize: '0.78rem', letterSpacing: '0.05em' }}>
                New arrivals, exclusive offers & style notes — straight to your inbox.
              </p>
            </div>
            <form
              className="flex items-center gap-0 w-full md:w-auto"
              onSubmit={e => { e.preventDefault(); /* TODO: connect newsletter API */ }}
            >
              <input
                type="email"
                placeholder="your@email.com"
                className="flex-1 md:w-64 px-4 py-2.5 text-sm bg-transparent outline-none"
                style={{
                  border: '1px solid rgba(255,255,255,0.2)',
                  borderRight: 'none',
                  color: '#fff',
                  fontFamily: "'Jost', sans-serif",
                  borderRadius: '2px 0 0 2px',
                }}
              />
              <button
                type="submit"
                className="px-5 py-2.5 text-xs uppercase tracking-widest text-white transition-all duration-200"
                style={{
                  background: '#6B1B2A',
                  fontFamily: "'Jost', sans-serif",
                  letterSpacing: '0.12em',
                  borderRadius: '0 2px 2px 0',
                  border: 'none',
                  cursor: 'pointer',
                  whiteSpace: 'nowrap',
                }}
                onMouseEnter={e => e.currentTarget.style.background = '#8B2535'}
                onMouseLeave={e => e.currentTarget.style.background = '#6B1B2A'}
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>

        {/* ── Main footer grid ──────────────────────────────────────────── */}
        <div className="max-w-7xl mx-auto px-6 py-14 grid grid-cols-2 md:grid-cols-4 gap-10">

          {/* Brand column */}
          <div className="col-span-2 md:col-span-1">
            {/* IMAGE PLACEHOLDER — replace with white version of your logo */}
            {/* <img src="/logo-white.svg" alt="CEILO" className="h-7 mb-4" /> */}
            <p
              className="text-white mb-3"
              style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '1.6rem', fontWeight: 600, letterSpacing: '0.08em' }}
            >
              CEILO
            </p>
            <p style={{ fontSize: '0.78rem', lineHeight: 1.8, maxWidth: '200px' }}>
              Curated fashion for those who appreciate the finer things. Modern. Timeless. Yours.
            </p>
            {/* Social icons */}
            <div className="flex items-center gap-2 mt-5">
              {/* Instagram */}
              <a href="#" className="footer-social" aria-label="Instagram">
                <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
                  <circle cx="12" cy="12" r="4"/>
                  <circle cx="17.5" cy="6.5" r="0.5" fill="currentColor"/>
                </svg>
              </a>
              {/* Facebook */}
              <a href="#" className="footer-social" aria-label="Facebook">
                <svg width="14" height="14" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z"/>
                </svg>
              </a>
              {/* Pinterest */}
              <a href="#" className="footer-social" aria-label="Pinterest">
                <svg width="14" height="14" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 0C5.373 0 0 5.373 0 12c0 5.084 3.163 9.426 7.627 11.174-.105-.949-.2-2.405.042-3.441.218-.937 1.407-5.965 1.407-5.965s-.359-.719-.359-1.782c0-1.668.967-2.914 2.171-2.914 1.023 0 1.518.769 1.518 1.69 0 1.029-.655 2.568-.994 3.995-.283 1.194.599 2.169 1.777 2.169 2.133 0 3.772-2.249 3.772-5.495 0-2.873-2.064-4.882-5.012-4.882-3.414 0-5.418 2.561-5.418 5.207 0 1.031.397 2.138.893 2.738a.36.36 0 01.083.345l-.333 1.36c-.053.22-.174.267-.402.161-1.499-.698-2.436-2.889-2.436-4.649 0-3.785 2.75-7.262 7.929-7.262 4.163 0 7.398 2.967 7.398 6.931 0 4.136-2.607 7.464-6.227 7.464-1.216 0-2.359-.632-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0z"/>
                </svg>
              </a>
            </div>
          </div>

          {/* Shop links */}
          <div>
            <p className="text-white text-xs uppercase tracking-widest mb-5" style={{ letterSpacing: '0.15em' }}>Shop</p>
            <ul className="flex flex-col gap-3">
              {[
                { label: 'All Products',  to: '/products'          },
                { label: 'New Arrivals',  to: '/products?sort=new' },
                { label: 'Best Sellers', to: '/products?sort=popular' },
                { label: 'Categories',   to: '/category'           },
              ].map(({ label, to }) => (
                <li key={to}><Link to={to} className="footer-link">{label}</Link></li>
              ))}
            </ul>
          </div>

          {/* Account links */}
          <div>
            <p className="text-white text-xs uppercase tracking-widest mb-5" style={{ letterSpacing: '0.15em' }}>Account</p>
            <ul className="flex flex-col gap-3">
              {[
                { label: 'My Profile',  to: '/profile'          },
                { label: 'My Orders',   to: '/profile/orders'   },
                { label: 'Saved Items', to: '/profile/saved'    },
                { label: 'Addresses',   to: '/profile/addresses'},
              ].map(({ label, to }) => (
                <li key={to}><Link to={to} className="footer-link">{label}</Link></li>
              ))}
            </ul>
          </div>

          {/* Help links */}
          <div>
            <p className="text-white text-xs uppercase tracking-widest mb-5" style={{ letterSpacing: '0.15em' }}>Help</p>
            <ul className="flex flex-col gap-3">
              {[
                { label: 'Shop Reviews', to: '/shop-reviews'  },
                { label: 'Notifications', to: '/notifications' },
                { label: 'Contact Us',   to: '/contact'       },
                { label: 'Returns',      to: '/returns'       },
              ].map(({ label, to }) => (
                <li key={to}><Link to={to} className="footer-link">{label}</Link></li>
              ))}
            </ul>
          </div>
        </div>

        {/* ── Bottom bar ────────────────────────────────────────────────── */}
        <div
          className="border-t"
          style={{ borderColor: 'rgba(255,255,255,0.08)' }}
        >
          <div className="max-w-7xl mx-auto px-6 py-5 flex flex-col md:flex-row items-center justify-between gap-3">
            <p style={{ fontSize: '0.72rem', letterSpacing: '0.05em' }}>
              © {year} CEILO. All rights reserved.
            </p>
            <div className="flex items-center gap-6">
              {['Privacy Policy', 'Terms of Service', 'Cookie Policy'].map(label => (
                <a key={label} href="#" className="footer-link" style={{ fontSize: '0.72rem' }}>{label}</a>
              ))}
            </div>
          </div>
        </div>

      </footer>
    </>
  );
}