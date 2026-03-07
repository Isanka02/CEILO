import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Header from '../../components/layout/Header';
import Footer from '../../components/layout/Footer';
import Sidebar from '../../components/layout/Sidebar';
// import { getMyOrders } from '../../api/orderApi';

const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;600;700&family=Jost:wght@300;400;500&display=swap');
  :root { --maroon:#6B1B2A;--maroon-dark:#4A1019;--maroon-soft:#8B2535;--cream:#FAF7F4;--charcoal:#1C1C1E;--muted:#7A7A7A;--border:#E8E0D8; }
  .order-row { background:#fff;border:1px solid var(--border);border-radius:4px;padding:20px 24px;transition:border-color .2s,box-shadow .2s;display:flex;flex-wrap:wrap;align-items:center;gap:16px; }
  .order-row:hover { border-color:#C4A8A8;box-shadow:0 2px 12px rgba(107,27,42,.06); }
  .status-badge { display:inline-flex;align-items:center;gap:5px;padding:3px 10px;border-radius:99px;font-size:0.68rem;letter-spacing:0.08em;text-transform:uppercase;font-weight:500; }
  .btn-outline { padding:7px 18px;background:transparent;color:var(--maroon);border:1px solid var(--maroon);border-radius:3px;font-family:'Jost',sans-serif;font-size:0.72rem;letter-spacing:0.1em;text-transform:uppercase;cursor:pointer;transition:all .2s;text-decoration:none;display:inline-block; }
  .btn-outline:hover { background:var(--maroon);color:#fff; }
`;

const STATUS_STYLES = {
  pending:    { bg: 'rgba(221,107,32,.1)',  color: '#C05621', dot: '#DD6B20' },
  processing: { bg: 'rgba(49,130,206,.1)',  color: '#2B6CB0', dot: '#3182CE' },
  shipped:    { bg: 'rgba(107,27,42,.1)',   color: '#6B1B2A', dot: '#6B1B2A' },
  delivered:  { bg: 'rgba(56,161,105,.1)', color: '#276749', dot: '#38A169' },
  canceled:   { bg: 'rgba(113,128,150,.1)',color: '#4A5568', dot: '#718096' },
};

// TODO: replace with real orders from API
const MOCK_ORDERS = [
  { _id: 'ORD001', createdAt: '2026-02-14', totalPrice: 128.00, orderStatus: 'delivered', paymentStatus: 'paid',    items: [{ name: 'Silk Blouse', quantity: 1, image: '' }, { name: 'Leather Belt', quantity: 1, image: '' }] },
  { _id: 'ORD002', createdAt: '2026-02-28', totalPrice:  64.50, orderStatus: 'shipped',   paymentStatus: 'pending', items: [{ name: 'Gold Earrings', quantity: 2, image: '' }] },
  { _id: 'ORD003', createdAt: '2026-03-04', totalPrice:  89.00, orderStatus: 'pending',   paymentStatus: 'pending', items: [{ name: 'Maroon Handbag', quantity: 1, image: '' }] },
];

export default function MyOrders() {
  const [orders] = useState(MOCK_ORDERS);
  const [filter, setFilter] = useState('all');

  const filtered = filter === 'all' ? orders : orders.filter(o => o.orderStatus === filter);

  const fmtDate  = d => new Date(d).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  const fmtPrice = p => `$${p.toFixed(2)}`;

  return (
    <>
      <style>{STYLES}</style>
      <Header />
      <div className="min-h-screen" style={{ background: 'var(--cream)', fontFamily: "'Jost',sans-serif" }}>
        <div className="max-w-6xl mx-auto px-6 py-12 flex flex-col md:flex-row gap-10">
          <Sidebar variant="user" />

          <main className="flex-1 min-w-0">
            <h1 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: '1.7rem', fontWeight: 600, color: 'var(--charcoal)', marginBottom: '4px' }}>My Orders</h1>
            <p style={{ fontSize: '0.82rem', color: 'var(--muted)', marginBottom: '28px' }}>Track and manage your purchases</p>

            {/* Filter tabs */}
            <div className="flex items-center gap-1 mb-6 flex-wrap">
              {['all','pending','processing','shipped','delivered','canceled'].map(s => (
                <button key={s} onClick={() => setFilter(s)}
                  style={{
                    padding: '6px 16px', borderRadius: '99px', border: 'none', cursor: 'pointer',
                    fontFamily: "'Jost',sans-serif", fontSize: '0.72rem', letterSpacing: '0.08em', textTransform: 'uppercase',
                    background: filter === s ? 'var(--maroon)' : '#fff',
                    color: filter === s ? '#fff' : 'var(--muted)',
                    border: `1px solid ${filter === s ? 'var(--maroon)' : 'var(--border)'}`,
                    transition: 'all .2s',
                  }}>
                  {s}
                </button>
              ))}
            </div>

            {/* Orders list */}
            {filtered.length === 0 ? (
              <div className="text-center py-16" style={{ border: '1px dashed var(--border)', borderRadius: '4px' }}>
                <svg width="36" height="36" fill="none" stroke="#C4B5B8" strokeWidth="1.5" viewBox="0 0 24 24" style={{ margin: '0 auto 12px' }}>
                  <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2"/><rect x="9" y="3" width="6" height="4" rx="1"/>
                </svg>
                <p style={{ fontSize: '0.85rem', color: 'var(--muted)' }}>No orders found.</p>
                <Link to="/products" className="btn-outline mt-4" style={{ display: 'inline-block' }}>Start Shopping</Link>
              </div>
            ) : (
              <div className="flex flex-col gap-3">
                {filtered.map(order => {
                  const st = STATUS_STYLES[order.orderStatus] || STATUS_STYLES.pending;
                  return (
                    <div key={order._id} className="order-row">

                      {/* Order items thumbnails */}
                      <div className="flex -space-x-2">
                        {order.items.slice(0, 3).map((item, i) => (
                          <div key={i} style={{ width: '44px', height: '44px', borderRadius: '4px', border: '2px solid #fff', background: '#F0EAE5', overflow: 'hidden', flexShrink: 0 }}>
                            {/* IMAGE: product thumbnail — 44×44px */}
                            {item.image
                              ? <img src={item.image} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                              : <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                  <svg width="16" height="16" fill="none" stroke="#C4B5B8" strokeWidth="1.5" viewBox="0 0 24 24"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><path d="M21 15l-5-5L5 21"/></svg>
                                </div>
                            }
                          </div>
                        ))}
                        {order.items.length > 3 && (
                          <div style={{ width: '44px', height: '44px', borderRadius: '4px', border: '2px solid #fff', background: '#F0EAE5', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <span style={{ fontSize: '0.68rem', color: 'var(--muted)' }}>+{order.items.length - 3}</span>
                          </div>
                        )}
                      </div>

                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-3 flex-wrap mb-1">
                          <span style={{ fontSize: '0.82rem', fontWeight: 500, color: 'var(--charcoal)' }}>#{order._id}</span>
                          <span className="status-badge" style={{ background: st.bg, color: st.color }}>
                            <span style={{ width: '5px', height: '5px', borderRadius: '50%', background: st.dot, display: 'inline-block' }} />
                            {order.orderStatus}
                          </span>
                          {order.paymentStatus === 'paid' && (
                            <span className="status-badge" style={{ background: 'rgba(56,161,105,.1)', color: '#276749' }}>
                              <span style={{ width: '5px', height: '5px', borderRadius: '50%', background: '#38A169', display: 'inline-block' }} />
                              Paid
                            </span>
                          )}
                        </div>
                        <p style={{ fontSize: '0.78rem', color: 'var(--muted)' }}>
                          {order.items.map(i => i.name).join(', ')} · {fmtDate(order.createdAt)}
                        </p>
                      </div>

                      {/* Price + action */}
                      <div className="flex items-center gap-4 shrink-0">
                        <span style={{ fontSize: '0.95rem', fontWeight: 600, color: 'var(--charcoal)', fontFamily: "'Cormorant Garamond',serif" }}>{fmtPrice(order.totalPrice)}</span>
                        <Link to={`/profile/orders/${order._id}`} className="btn-outline">View</Link>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </main>
        </div>
      </div>
      <Footer />
    </>
  );
}