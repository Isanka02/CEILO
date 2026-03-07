import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Header from '../../components/layout/Header';
import Sidebar from '../../components/layout/Sidebar';
// import { getAnalytics } from '../../api/adminApi';

const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;600;700&family=Jost:wght@300;400;500&display=swap');
  :root { --maroon:#6B1B2A;--maroon-dark:#4A1019;--maroon-soft:#8B2535;--cream:#FAF7F4;--charcoal:#1C1C1E;--muted:#7A7A7A;--border:#E8E0D8; }
  .stat-card { background:#fff;border:1px solid var(--border);border-radius:4px;padding:22px 24px; }
  .section-card { background:#fff;border:1px solid var(--border);border-radius:4px;padding:24px; }
  .table-row { display:grid;align-items:center;padding:12px 0;border-bottom:1px solid var(--border);font-size:0.82rem;color:var(--charcoal); }
  .table-row:last-child { border-bottom:none; }
  .status-badge { display:inline-flex;align-items:center;gap:5px;padding:3px 10px;border-radius:99px;font-size:0.65rem;letter-spacing:0.08em;text-transform:uppercase;font-weight:500; }
`;

const STATUS_STYLES = {
  pending:    { bg:'rgba(221,107,32,.1)', color:'#C05621', dot:'#DD6B20' },
  processing: { bg:'rgba(49,130,206,.1)', color:'#2B6CB0', dot:'#3182CE' },
  shipped:    { bg:'rgba(107,27,42,.1)',  color:'#6B1B2A', dot:'#6B1B2A' },
  delivered:  { bg:'rgba(56,161,105,.1)',color:'#276749', dot:'#38A169' },
  canceled:   { bg:'rgba(113,128,150,.1)',color:'#4A5568',dot:'#718096' },
};

// TODO: replace with real data from getAnalytics() API call
const MOCK = {
  stats: [
    { label: 'Total Revenue',  value: '$12,480',  change: '+18%', up: true,  icon: 'M12 2v20M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6' },
    { label: 'Total Orders',   value: '284',       change: '+9%',  up: true,  icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2' },
    { label: 'Total Users',    value: '1,042',     change: '+24%', up: true,  icon: 'M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2' },
    { label: 'Pending Orders', value: '17',        change: '-3%',  up: false, icon: 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0' },
  ],
  recentOrders: [
    { _id: 'ORD008', user: 'Amara Silva',   total: 128.00, status: 'shipped',   date: '2026-03-05' },
    { _id: 'ORD007', user: 'Priya Mendis',  total:  64.50, status: 'pending',   date: '2026-03-04' },
    { _id: 'ORD006', user: 'Kavya Perera',  total:  89.00, status: 'delivered', date: '2026-03-03' },
    { _id: 'ORD005', user: 'Riya Fernando', total: 210.00, status: 'processing',date: '2026-03-02' },
    { _id: 'ORD004', user: 'Nadia Raj',     total:  45.00, status: 'canceled',  date: '2026-03-01' },
  ],
  topProducts: [
    { name: 'Silk Draped Blouse',   sales: 48, revenue: '$4,272' },
    { name: 'Maroon Leather Tote',  sales: 31, revenue: '$4,495' },
    { name: 'Gold Hoop Earrings',   sales: 67, revenue: '$2,814' },
    { name: 'Pearl Drop Necklace',  sales: 29, revenue: '$2,320' },
    { name: 'Cashmere Wrap Scarf',  sales: 22, revenue: '$1,540' },
  ],
  categoryBreakdown: [
    { name: 'Accessories', pct: 38 },
    { name: 'Tops',        pct: 27 },
    { name: 'Bags',        pct: 20 },
    { name: 'Jewelry',     pct: 15 },
  ],
};

export default function AnalyticsDash() {
  const [data] = useState(MOCK);
  const fmtDate  = d => new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

  return (
    <>
      <style>{STYLES}</style>
      <Header />
      <div className="min-h-screen" style={{ background: 'var(--cream)', fontFamily: "'Jost',sans-serif" }}>
        <div className="max-w-7xl mx-auto px-6 py-12 flex flex-col md:flex-row gap-10">
          <Sidebar variant="admin" />

          <main className="flex-1 min-w-0">
            <h1 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: '1.7rem', fontWeight: 600, color: 'var(--charcoal)', marginBottom: '4px' }}>Analytics</h1>
            <p style={{ fontSize: '0.82rem', color: 'var(--muted)', marginBottom: '32px' }}>Overview of your store's performance</p>

            {/* Stat cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              {data.stats.map(({ label, value, change, up, icon }) => (
                <div key={label} className="stat-card">
                  <div className="flex items-start justify-between mb-3">
                    <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'rgba(107,27,42,.08)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <svg width="16" height="16" fill="none" stroke="var(--maroon)" strokeWidth="1.8" viewBox="0 0 24 24">
                        <path d={icon} />
                        {label === 'Total Users' && <circle cx="9" cy="7" r="4"/>}
                      </svg>
                    </div>
                    <span style={{ fontSize: '0.68rem', fontWeight: 500, color: up ? '#276749' : '#C53030', background: up ? 'rgba(56,161,105,.1)' : 'rgba(197,48,48,.1)', padding: '2px 8px', borderRadius: '99px' }}>
                      {change}
                    </span>
                  </div>
                  <p style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: '1.7rem', fontWeight: 700, color: 'var(--charcoal)', lineHeight: 1 }}>{value}</p>
                  <p style={{ fontSize: '0.72rem', color: 'var(--muted)', marginTop: '4px', letterSpacing: '0.04em' }}>{label}</p>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">

              {/* Recent orders */}
              <div className="section-card lg:col-span-2">
                <div className="flex items-center justify-between mb-4">
                  <p style={{ fontSize: '0.78rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--charcoal)', fontWeight: 500 }}>Recent Orders</p>
                  <Link to="/admin/orders" style={{ fontSize: '0.72rem', color: 'var(--maroon)', textDecoration: 'none', letterSpacing: '0.06em' }}
                    onMouseEnter={e => e.currentTarget.style.textDecoration = 'underline'}
                    onMouseLeave={e => e.currentTarget.style.textDecoration = 'none'}>
                    View all →
                  </Link>
                </div>
                {/* Header row */}
                <div className="table-row" style={{ gridTemplateColumns: '1fr 1fr auto auto', color: 'var(--muted)', fontSize: '0.68rem', letterSpacing: '0.08em', textTransform: 'uppercase', borderBottom: '1px solid var(--border)', paddingBottom: '8px' }}>
                  <span>Order</span><span>Customer</span><span style={{ textAlign: 'center' }}>Status</span><span style={{ textAlign: 'right' }}>Total</span>
                </div>
                {data.recentOrders.map(o => {
                  const st = STATUS_STYLES[o.status] || STATUS_STYLES.pending;
                  return (
                    <div key={o._id} className="table-row" style={{ gridTemplateColumns: '1fr 1fr auto auto', gap: '8px' }}>
                      <div>
                        <p style={{ fontWeight: 500, fontSize: '0.82rem' }}>#{o._id}</p>
                        <p style={{ fontSize: '0.7rem', color: 'var(--muted)' }}>{fmtDate(o.date)}</p>
                      </div>
                      <span style={{ fontSize: '0.82rem' }}>{o.user}</span>
                      <span className="status-badge" style={{ background: st.bg, color: st.color }}>
                        <span style={{ width: '5px', height: '5px', borderRadius: '50%', background: st.dot }} />{o.status}
                      </span>
                      <span style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: '0.95rem', fontWeight: 600, color: 'var(--charcoal)', textAlign: 'right' }}>${o.total.toFixed(2)}</span>
                    </div>
                  );
                })}
              </div>

              {/* Category breakdown */}
              <div className="section-card">
                <p style={{ fontSize: '0.78rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--charcoal)', fontWeight: 500, marginBottom: '20px' }}>Sales by Category</p>
                <div className="flex flex-col gap-4">
                  {data.categoryBreakdown.map(({ name, pct }) => (
                    <div key={name}>
                      <div className="flex justify-between mb-1.5">
                        <span style={{ fontSize: '0.8rem', color: 'var(--charcoal)' }}>{name}</span>
                        <span style={{ fontSize: '0.78rem', color: 'var(--muted)' }}>{pct}%</span>
                      </div>
                      <div style={{ height: '4px', background: '#F0EAE5', borderRadius: '99px', overflow: 'hidden' }}>
                        <div style={{ height: '100%', width: `${pct}%`, background: 'var(--maroon)', borderRadius: '99px', transition: 'width .6s ease' }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Top products */}
            <div className="section-card">
              <p style={{ fontSize: '0.78rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--charcoal)', fontWeight: 500, marginBottom: '16px' }}>Top Products</p>
              <div className="table-row" style={{ gridTemplateColumns: '2fr 1fr 1fr', color: 'var(--muted)', fontSize: '0.68rem', letterSpacing: '0.08em', textTransform: 'uppercase', paddingBottom: '8px' }}>
                <span>Product</span><span style={{ textAlign: 'center' }}>Units Sold</span><span style={{ textAlign: 'right' }}>Revenue</span>
              </div>
              {data.topProducts.map((p, i) => (
                <div key={p.name} className="table-row" style={{ gridTemplateColumns: '2fr 1fr 1fr' }}>
                  <div className="flex items-center gap-3">
                    <span style={{ fontSize: '0.68rem', fontWeight: 600, color: 'var(--maroon)', width: '18px' }}>#{i + 1}</span>
                    <span style={{ fontSize: '0.85rem', fontWeight: 500 }}>{p.name}</span>
                  </div>
                  <span style={{ fontSize: '0.85rem', color: 'var(--muted)', textAlign: 'center' }}>{p.sales}</span>
                  <span style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: '0.95rem', fontWeight: 600, color: 'var(--charcoal)', textAlign: 'right' }}>{p.revenue}</span>
                </div>
              ))}
            </div>
          </main>
        </div>
      </div>
    </>
  );
}