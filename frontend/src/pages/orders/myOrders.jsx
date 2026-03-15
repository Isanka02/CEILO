import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Header from '../../components/layout/Header';
import Footer from '../../components/layout/Footer';
import { getMyOrders } from '../../api/orderApi';

const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300&family=Jost:wght@300;400;500&display=swap');
  :root { --maroon:#6B1B2A;--maroon-dark:#4A1019;--maroon-soft:#8B2535;--cream:#FAF7F4;--charcoal:#1C1C1E;--muted:#7A7A7A;--border:#E8E0D8; }

  .order-card { background:#fff;border:1px solid var(--border);border-radius:4px;overflow:hidden;transition:border-color .2s,box-shadow .2s; }
  .order-card:hover { border-color:#C4A8A8;box-shadow:0 4px 20px rgba(107,27,42,.07); }

  .status-badge { display:inline-flex;align-items:center;gap:5px;padding:3px 10px;border-radius:99px;font-size:0.62rem;font-weight:500;letter-spacing:0.08em;text-transform:uppercase; }
  .status-pending    { background:#FEF3C7;color:#92400E; }
  .status-processing { background:#DBEAFE;color:#1E40AF; }
  .status-shipped    { background:rgba(107,27,42,.1);color:var(--maroon); }
  .status-delivered  { background:#D1FAE5;color:#065F46; }
  .status-canceled   { background:#F3F4F6;color:#6B7280; }

  .tab-btn { padding:8px 18px;font-family:'Jost',sans-serif;font-size:0.72rem;letter-spacing:0.08em;text-transform:uppercase;background:none;border:none;cursor:pointer;color:var(--muted);border-bottom:2px solid transparent;transition:all .2s; }
  .tab-btn.active { color:var(--maroon);border-bottom-color:var(--maroon); }

  .empty-state { border:1px dashed var(--border);border-radius:4px;padding:64px 24px;text-align:center; }
  .btn-maroon { display:inline-block;padding:11px 28px;background:var(--maroon);color:#fff;border-radius:3px;font-family:'Jost',sans-serif;font-size:0.72rem;letter-spacing:0.15em;text-transform:uppercase;text-decoration:none;transition:background .2s; }
  .btn-maroon:hover { background:var(--maroon-soft); }
`;

const TABS = ['All','Pending','Processing','Shipped','Delivered','Canceled'];

// ─── Mock orders — replace with API ──────────────────────────────────────────
const MOCK_ORDERS = [
  {
    _id:'ORD-X7K2P9', createdAt:'2026-03-01T10:22:00Z', orderStatus:'shipped',
    paymentStatus:'pending', totalPrice:265, shippingPrice:12,
    items:[
      { name:'Silk Draped Blouse',  image:'', price:69  },
      { name:'Pearl Drop Necklace', image:'', price:64  },
      { name:'Cashmere Wrap Scarf', image:'', price:120 },
    ],
  },
  {
    _id:'ORD-M3R8QT', createdAt:'2026-02-18T14:05:00Z', orderStatus:'delivered',
    paymentStatus:'paid', totalPrice:89, shippingPrice:0,
    items:[
      { name:'Gold Hoop Earrings', image:'', price:42 },
      { name:'Chain Belt',         image:'', price:55 },
    ],
  },
  {
    _id:'ORD-K9W4LZ', createdAt:'2026-01-30T09:11:00Z', orderStatus:'canceled',
    paymentStatus:'pending', totalPrice:145, shippingPrice:0,
    items:[
      { name:'Maroon Leather Tote', image:'', price:145 },
    ],
  },
  {
    _id:'ORD-P2N6YB', createdAt:'2026-01-12T16:44:00Z', orderStatus:'delivered',
    paymentStatus:'paid', totalPrice:80, shippingPrice:0,
    items:[
      { name:'Pearl Drop Necklace', image:'', price:80 },
    ],
  },
];

const statusLabel = s => s.charAt(0).toUpperCase() + s.slice(1);

export default function MyOrders() {
  const [tab, setTab] = useState('All');

  const filtered = tab === 'All'
    ? MOCK_ORDERS
    : MOCK_ORDERS.filter(o => o.orderStatus === tab.toLowerCase());

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
            <span style={{ color:'var(--charcoal)' }}>My Orders</span>
          </div>
        </div>

        <div className="max-w-4xl mx-auto px-6 py-10">
          <h1 style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:'clamp(1.6rem,3vw,2.2rem)', fontWeight:600, color:'var(--charcoal)', marginBottom:'28px' }}>
            My Orders
          </h1>

          {/* Tabs */}
          <div style={{ display:'flex', gap:'4px', borderBottom:'1px solid var(--border)', marginBottom:'28px', overflowX:'auto' }}>
            {TABS.map(t => (
              <button key={t} className={`tab-btn${tab === t ? ' active' : ''}`} onClick={() => setTab(t)}>
                {t}
                {t !== 'All' && (
                  <span style={{ marginLeft:'6px', fontSize:'0.6rem', background: tab === t ? 'var(--maroon)' : 'var(--border)', color: tab === t ? '#fff' : 'var(--muted)', borderRadius:'99px', padding:'1px 6px' }}>
                    {MOCK_ORDERS.filter(o => o.orderStatus === t.toLowerCase()).length}
                  </span>
                )}
              </button>
            ))}
          </div>

          {/* Orders list */}
          {filtered.length === 0 ? (
            <div className="empty-state">
              <svg width="36" height="36" fill="none" stroke="#D4C5C0" strokeWidth="1.2" viewBox="0 0 24 24" style={{ margin:'0 auto 14px', display:'block' }}>
                <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/>
              </svg>
              <p style={{ fontSize:'0.85rem', color:'var(--muted)', marginBottom:'20px' }}>No {tab.toLowerCase()} orders found.</p>
              <Link to="/products" className="btn-maroon">Start Shopping</Link>
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              {filtered.map(order => (
                <div key={order._id} className="order-card">
                  {/* Card header */}
                  <div className="flex items-center justify-between flex-wrap gap-3"
                    style={{ padding:'16px 20px', borderBottom:'1px solid var(--border)', background:'#FDFAF8' }}>
                    <div className="flex items-center gap-4 flex-wrap">
                      <div>
                        <p style={{ fontSize:'0.65rem', color:'var(--muted)', letterSpacing:'0.08em', textTransform:'uppercase', marginBottom:'2px' }}>Order</p>
                        <p style={{ fontSize:'0.82rem', fontWeight:500, color:'var(--charcoal)' }}>{order._id}</p>
                      </div>
                      <div>
                        <p style={{ fontSize:'0.65rem', color:'var(--muted)', letterSpacing:'0.08em', textTransform:'uppercase', marginBottom:'2px' }}>Date</p>
                        <p style={{ fontSize:'0.82rem', color:'var(--charcoal)' }}>
                          {new Date(order.createdAt).toLocaleDateString('en-GB', { day:'numeric', month:'short', year:'numeric' })}
                        </p>
                      </div>
                      <div>
                        <p style={{ fontSize:'0.65rem', color:'var(--muted)', letterSpacing:'0.08em', textTransform:'uppercase', marginBottom:'2px' }}>Total</p>
                        <p style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:'0.95rem', fontWeight:600, color:'var(--charcoal)' }}>${order.totalPrice}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className={`status-badge status-${order.orderStatus}`}>
                        <span style={{ width:'4px', height:'4px', borderRadius:'50%', background:'currentColor', display:'inline-block' }} />
                        {statusLabel(order.orderStatus)}
                      </span>
                      <span style={{ fontSize:'0.68rem', padding:'3px 10px', borderRadius:'99px', background: order.paymentStatus === 'paid' ? '#D1FAE5' : '#FEF3C7', color: order.paymentStatus === 'paid' ? '#065F46' : '#92400E' }}>
                        {order.paymentStatus === 'paid' ? 'Paid' : 'COD'}
                      </span>
                    </div>
                  </div>

                  {/* Items preview */}
                  <div className="flex items-center gap-3 flex-wrap" style={{ padding:'16px 20px' }}>
                    <div className="flex gap-2 flex-1">
                      {order.items.slice(0, 3).map((item, i) => (
                        <div key={i} style={{ width:'48px', height:'60px', background:'#F0EAE5', borderRadius:'2px', flexShrink:0, display:'flex', alignItems:'center', justifyContent:'center', position:'relative' }}>
                          {item.image
                            ? <img src={item.image} alt={item.name} style={{ width:'100%', height:'100%', objectFit:'cover', borderRadius:'2px' }} />
                            : <svg width="16" height="16" fill="none" stroke="#D4C5C0" strokeWidth="1.2" viewBox="0 0 24 24"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><path d="M21 15l-5-5L5 21"/></svg>
                          }
                          {i === 2 && order.items.length > 3 && (
                            <div style={{ position:'absolute', inset:0, background:'rgba(26,8,16,.45)', borderRadius:'2px', display:'flex', alignItems:'center', justifyContent:'center' }}>
                              <span style={{ fontSize:'0.65rem', color:'#fff', fontWeight:500 }}>+{order.items.length - 3}</span>
                            </div>
                          )}
                        </div>
                      ))}
                      <div style={{ paddingLeft:'8px' }}>
                        <p style={{ fontSize:'0.82rem', fontWeight:500, color:'var(--charcoal)', marginBottom:'2px' }}>{order.items[0].name}</p>
                        {order.items.length > 1 && (
                          <p style={{ fontSize:'0.72rem', color:'var(--muted)' }}>+{order.items.length - 1} more item{order.items.length > 2 ? 's' : ''}</p>
                        )}
                      </div>
                    </div>
                    <Link to={`/orders/${order._id}`}
                      style={{ fontSize:'0.68rem', color:'var(--maroon)', textDecoration:'none', letterSpacing:'0.1em', textTransform:'uppercase', border:'1px solid var(--maroon)', padding:'8px 18px', borderRadius:'3px', whiteSpace:'nowrap', transition:'all .2s' }}
                      onMouseEnter={e => { e.target.style.background='var(--maroon)'; e.target.style.color='#fff'; }}
                      onMouseLeave={e => { e.target.style.background='transparent'; e.target.style.color='var(--maroon)'; }}
                    >
                      View Details
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
}