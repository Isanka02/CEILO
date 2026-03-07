import React from 'react';
import { Link, useLocation } from 'react-router-dom';

// ─────────────────────────────────────────────────────────────────────────────
// Sidebar — two variants:  variant="user"  |  variant="admin"
// Usage:
//   <Sidebar variant="user" />
//   <Sidebar variant="admin" />
// ─────────────────────────────────────────────────────────────────────────────

const userNav = [
  {
    label: 'Profile',
    to: '/profile',
    icon: (
      <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
        <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/>
      </svg>
    ),
  },
  {
    label: 'My Orders',
    to: '/profile/orders',
    icon: (
      <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
        <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2"/>
        <rect x="9" y="3" width="6" height="4" rx="1"/>
        <path d="M9 12h6M9 16h4"/>
      </svg>
    ),
  },
  {
    label: 'Saved Items',
    to: '/profile/saved',
    icon: (
      <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
        <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/>
      </svg>
    ),
  },
  {
    label: 'Addresses',
    to: '/profile/addresses',
    icon: (
      <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/>
      </svg>
    ),
  },
  {
    label: 'Notifications',
    to: '/notifications',
    icon: (
      <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
        <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 01-3.46 0"/>
      </svg>
    ),
  },
];

const adminNav = [
  {
    label: 'Analytics',
    to: '/admin/analytics',
    icon: (
      <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
        <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
      </svg>
    ),
  },
  {
    label: 'Products',
    to: '/admin/products',
    icon: (
      <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
        <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/>
        <path d="M16 10a4 4 0 01-8 0"/>
      </svg>
    ),
  },
  {
    label: 'Categories',
    to: '/admin/categories',
    icon: (
      <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
        <rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/>
        <rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/>
      </svg>
    ),
  },
  {
    label: 'Orders',
    to: '/admin/orders',
    icon: (
      <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
        <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2"/>
        <rect x="9" y="3" width="6" height="4" rx="1"/>
      </svg>
    ),
  },
  {
    label: 'Users',
    to: '/admin/users',
    icon: (
      <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
        <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/>
        <path d="M23 21v-2a4 4 0 00-3-3.87"/><path d="M16 3.13a4 4 0 010 7.75"/>
      </svg>
    ),
  },
  {
    label: 'Shop Reviews',
    to: '/admin/shop-reviews',
    icon: (
      <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
      </svg>
    ),
  },
  {
    label: 'Notifications',
    to: '/admin/notifications',
    icon: (
      <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
        <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 01-3.46 0"/>
      </svg>
    ),
  },
];

export default function Sidebar({ variant = 'user' }) {
  const location = useLocation();
  const navItems = variant === 'admin' ? adminNav : userNav;
  const title    = variant === 'admin' ? 'Admin Panel' : 'My Account';

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@600&family=Jost:wght@300;400;500&display=swap');

        .sidebar-item {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 10px 14px;
          border-radius: 4px;
          font-family: 'Jost', sans-serif;
          font-size: 0.82rem;
          letter-spacing: 0.04em;
          color: #4A4A4A;
          text-decoration: none;
          transition: all 0.18s ease;
          border-left: 2px solid transparent;
        }
        .sidebar-item:hover {
          background: rgba(107, 27, 42, 0.06);
          color: #6B1B2A;
          border-left-color: rgba(107, 27, 42, 0.3);
        }
        .sidebar-item.active {
          background: rgba(107, 27, 42, 0.09);
          color: #6B1B2A;
          border-left-color: #6B1B2A;
          font-weight: 500;
        }
      `}</style>

      <aside
        className="w-56 shrink-0"
        style={{ fontFamily: "'Jost', sans-serif" }}
      >
        {/* Title */}
        <p
          className="mb-5 pb-4 border-b"
          style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontSize: '1.15rem',
            fontWeight: 600,
            color: '#1C1C1E',
            borderColor: '#E8E0D8',
            letterSpacing: '0.02em',
          }}
        >
          {title}
        </p>

        {/* Nav items */}
        <nav className="flex flex-col gap-1">
          {navItems.map(({ label, to, icon }) => {
            const isActive = location.pathname === to ||
              (to !== '/profile' && location.pathname.startsWith(to));
            return (
              <Link
                key={to}
                to={to}
                className={`sidebar-item ${isActive ? 'active' : ''}`}
              >
                <span style={{ opacity: isActive ? 1 : 0.5 }}>{icon}</span>
                {label}
              </Link>
            );
          })}
        </nav>

        {/* Admin: back to shop link */}
        {variant === 'admin' && (
          <div className="mt-6 pt-4 border-t" style={{ borderColor: '#E8E0D8' }}>
            <Link
              to="/"
              className="sidebar-item"
              style={{ fontSize: '0.75rem', color: '#7A7A7A' }}
            >
              <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
                <path d="M19 12H5M12 19l-7-7 7-7"/>
              </svg>
              Back to Shop
            </Link>
          </div>
        )}
      </aside>
    </>
  );
}