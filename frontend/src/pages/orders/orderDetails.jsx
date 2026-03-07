import React, { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import Header from '../../components/layout/Header';
import Footer from '../../components/layout/Footer';
// import { getOrderById, cancelOrder } from '../../api/orderApi';

const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300&family=Jost:wght@300;400;500&display=swap');
  :root { --maroon:#6B1B2A;--maroon-dark:#4A1019;--maroon-soft:#8B2535;--cream:#FAF7F4;--charcoal:#1C1C1E;--muted:#7A7A7A;--border:#E8E0D8; }

  .detail-card { background:#fff;border:1px solid var(--border);border-radius:4px;padding:24px 28px;margin-bottom:16px; }
  .card-title { font-family:'Cormorant Garamond',serif;font-size:1rem;font-weight:600;color:var(--charcoal);margin-bottom:18px;padding-bottom:14px;border-bottom:1px solid var(--border); }

  .order-item { display:flex;gap:14px;padding:14px 0;border-bottom:1px solid var(--border); }
  .order-item:last-child { border-bottom:none;padding-bottom:0; }

  .status-badge { display:inline-flex;align-items:center;gap:6px;padding:4px 12px;border-radius:99px;font-size:0.65rem;font-weight:500;letter-spacing:0.08em;text-transform:uppercase; }
  .status-pending    { background:#FEF3C7;color:#92400E; }
  .status-processing { background:#DBEAFE;color:#1E40AF; }
  .status-shipped    { background:rgba(107,27,42,.1);color:var(--maroon); }
  .status-delivered  { background:#D1FAE5;color:#065F46; }
  .status-canceled   { background:#F3F4F6;color:#6B7280; }
  .pay-pending { background:#FEF3C7;color:#92400E; }
  .pay-paid    { background:#D1FAE5;color:#065F46; }

  .timeline { position:relative;padding-left:28px; }
  .timeline::before { content:'';position:absolute;left:8px;top:6px;bottom:6px;width:1px;background:var(--border); }
  .timeline-step { position:relative;margin-bottom:20px; }
  .timeline-step:last-child { margin-bottom:0; }
  .timeline-dot { position:absolute;left:-24px;top:3px;width:10px;height:10px;border-radius:50%;border:2px solid var(--border);background:#fff; }
  .timeline-dot.done { background:var(--maroon);border-color:var(--maroon); }
  .timeline-dot.active { background:#fff;border-color:var(--maroon);box-shadow:0 0 0 3px rgba(107,27,42,.15); }

  .btn-cancel { padding:10px 24px;border:1px solid #C0392B;color:#C0392B;background:#fff;border-radius:3px;font-family:'Jost',sans-serif;font-size:0.72rem;letter-spacing:0.1em;text-transform:uppercase;cursor:pointer;transition:all .2s; }
  .btn-cancel:hover { background:#C0392B;color:#fff; }
  .btn-outline { padding:10px 24px;border:1px solid var(--maroon);color:var(--maroon);background:#fff;border-radius:3px;font-family:'Jost',sans-serif;font-size:0.72rem;letter-spacing:0.1em;text-transform:uppercase;cursor:pointer;transition:all .2s;text-decoration:none;display:inline-block; }
  .btn-outline:hover { background:var(--maroon);color:#fff; }

  .confirm-overlay { position:fixed;inset:0;background:rgba(26,8,16,.55);z-index:50;display:flex;align-items:center;justify-content:center;padding:20px; }
  .confirm-card { background:#fff;border-radius:4px;padding:36px 32px;max-width:400px;width:100%; }

  .summary-row { display:flex;justify-content:space-between;font-size:0.82rem;padding:6px 0; }
`;

// ─── STATUS HELPERS ──────────────────────────────────────────────────────────
const STATUS_STEPS = ['pending','processing','shipped','delivered'];

const statusClass = s => `status-${s}`;
const statusLabel = s => s.charAt(0).toUpperCase() + s.slice(1);
const statusDot   = s => {
  const i = STATUS_STEPS.indexOf(s);
  return (step) => {
    const si = STATUS_STEPS.indexOf(step);
    if (si < i)  return 'done';
    if (si === i) return 'active';
    return '';
  };
};

// ─── MOCK ORDER — replace with API call ──────────────────────────────────────
const MOCK_ORDER = {
  _id: 'ORD-X7K2P9',
  createdAt: '2026-03-01T10:22:00Z',
  orderStatus: 'shipped',
  paymentStatus: 'pending',
  paymentMethod: 'cod',
  trackingNumber: 'SL123456789',
  deliveryMethod: 'Express Delivery',
  shippingPrice: 12,
  totalPrice: 265,
  shippingAddress: {
    street: '42 Galle Road, Apt 3A',
    city:   'Colombo',
    state:  'Western',
    zip:    '00300',
    country:'Sri Lanka',
  },
  items: [
    { _id:'p1', name:'Silk Draped Blouse',  image:'', price:69,  quantity:1, color:'Ivory', size:'M'   },
    { _id:'p4', name:'Pearl Drop Necklace', image:'', price:64,  quantity:1, color:null,    size:null  },
    { _id:'p5', name:'Cashmere Wrap Scarf', image:'', price:120, quantity:1, color:'Camel', size:null  },
  ],
};

export default function OrderDetails() {
  const { id } = useParams();
  const order  = MOCK_ORDER; // TODO: replace with API fetch by id
  const [showCancel, setShowCancel] = useState(false);
  const [canceled,   setCanceled]   = useState(false);

  const currentStatus = canceled ? 'canceled' : order.orderStatus;
  const dotState      = statusDot(currentStatus);
  const canCancel     = currentStatus === 'pending' && !canceled;

  const handleCancel = () => {
    // TODO: await cancelOrder(order._id);
    setCanceled(true);
    setShowCancel(false);
  };

  const subtotal = order.items.reduce((s, i) => s + i.price * i.quantity, 0);

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
            <Link to="/account/orders" style={{ color:'var(--muted)', textDecoration:'none' }}>My Orders</Link>
            <span>/</span>
            <span style={{ color:'var(--charcoal)' }}>{order._id}</span>
          </div>
        </div>

        <div className="max-w-5xl mx-auto px-6 py-10">

          {/* Title row */}
          <div className="flex items-start justify-between flex-wrap gap-4 mb-8">
            <div>
              <h1 style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:'clamp(1.5rem,3vw,2rem)', fontWeight:600, color:'var(--charcoal)', marginBottom:'6px' }}>
                Order {order._id}
              </h1>
              <p style={{ fontSize:'0.75rem', color:'var(--muted)' }}>
                Placed on {new Date(order.createdAt).toLocaleDateString('en-GB', { day:'numeric', month:'long', year:'numeric' })}
              </p>
            </div>
            <div className="flex items-center gap-3">
              <span className={`status-badge ${statusClass(currentStatus)}`}>
                <span style={{ width:'5px', height:'5px', borderRadius:'50%', background:'currentColor', display:'inline-block' }} />
                {statusLabel(currentStatus)}
              </span>
              <span className={`status-badge ${order.paymentStatus === 'paid' ? 'pay-paid' : 'pay-pending'}`}>
                {order.paymentStatus === 'paid' ? 'Paid' : 'Pay on Delivery'}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

            {/* ── LEFT ── */}
            <div className="lg:col-span-2">

              {/* Order items */}
              <div className="detail-card">
                <p className="card-title">Items ({order.items.length})</p>
                {order.items.map(item => (
                  <div key={item._id} className="order-item">
                    <div style={{ width:'60px', height:'76px', background:'#F0EAE5', borderRadius:'2px', flexShrink:0, display:'flex', alignItems:'center', justifyContent:'center' }}>
                      {item.image
                        ? <img src={item.image} alt={item.name} style={{ width:'100%', height:'100%', objectFit:'cover', borderRadius:'2px' }} />
                        : <svg width="18" height="18" fill="none" stroke="#D4C5C0" strokeWidth="1.2" viewBox="0 0 24 24"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><path d="M21 15l-5-5L5 21"/></svg>
                      }
                    </div>
                    <div className="flex-1">
                      <p style={{ fontSize:'0.85rem', fontWeight:500, color:'var(--charcoal)', marginBottom:'3px' }}>{item.name}</p>
                      <p style={{ fontSize:'0.7rem', color:'var(--muted)', marginBottom:'8px' }}>
                        {[item.color, item.size].filter(Boolean).join(' · ')}
                        {item.quantity > 1 && ` · Qty ${item.quantity}`}
                      </p>
                      <p style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:'0.95rem', fontWeight:600, color:'var(--charcoal)' }}>
                        ${item.price * item.quantity}
                      </p>
                    </div>
                    <Link to={`/products/${item._id}`} style={{ fontSize:'0.68rem', color:'var(--maroon)', textDecoration:'none', letterSpacing:'0.08em', textTransform:'uppercase', alignSelf:'center', whiteSpace:'nowrap' }}>
                      Buy Again
                    </Link>
                  </div>
                ))}
              </div>

              {/* Order timeline */}
              {currentStatus !== 'canceled' && (
                <div className="detail-card">
                  <p className="card-title">Order Progress</p>
                  <div className="timeline">
                    {STATUS_STEPS.map(step => (
                      <div key={step} className="timeline-step">
                        <div className={`timeline-dot ${dotState(step)}`} />
                        <p style={{ fontSize:'0.78rem', fontWeight: dotState(step) ? 500 : 400, color: dotState(step) ? 'var(--charcoal)' : 'var(--muted)', marginBottom:'2px' }}>
                          {statusLabel(step)}
                        </p>
                        {step === 'shipped' && order.trackingNumber && dotState(step) && (
                          <p style={{ fontSize:'0.7rem', color:'var(--maroon)' }}>
                            Tracking: {order.trackingNumber}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Shipping address */}
              <div className="detail-card">
                <p className="card-title">Delivery Address</p>
                <p style={{ fontSize:'0.82rem', color:'var(--charcoal)', lineHeight:1.8 }}>
                  {order.shippingAddress.street}<br />
                  {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zip}<br />
                  {order.shippingAddress.country}
                </p>
              </div>
            </div>

            {/* ── RIGHT: Summary ── */}
            <div>
              <div className="detail-card" style={{ position:'sticky', top:'24px' }}>
                <p className="card-title">Order Summary</p>

                <div className="summary-row">
                  <span style={{ color:'var(--muted)' }}>Subtotal</span>
                  <span>${subtotal}</span>
                </div>
                <div className="summary-row">
                  <span style={{ color:'var(--muted)' }}>Shipping</span>
                  <span style={{ color: order.shippingPrice === 0 ? '#2D7A4F' : 'var(--charcoal)' }}>
                    {order.shippingPrice === 0 ? 'Free' : `$${order.shippingPrice}`}
                  </span>
                </div>
                <div style={{ display:'flex', justifyContent:'space-between', padding:'12px 0 0', borderTop:'1px solid var(--border)', marginTop:'6px' }}>
                  <span style={{ fontFamily:"'Cormorant Garamond',serif", fontWeight:600, color:'var(--charcoal)' }}>Total</span>
                  <span style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:'1.1rem', fontWeight:600, color:'var(--maroon)' }}>${order.totalPrice}</span>
                </div>

                <div style={{ borderTop:'1px solid var(--border)', marginTop:'18px', paddingTop:'18px' }}>
                  <div className="summary-row" style={{ marginBottom:'4px' }}>
                    <span style={{ color:'var(--muted)' }}>Payment</span>
                    <span style={{ textTransform:'capitalize' }}>Cash on Delivery</span>
                  </div>
                  <div className="summary-row">
                    <span style={{ color:'var(--muted)' }}>Delivery</span>
                    <span>{order.deliveryMethod}</span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex flex-col gap-3 mt-6">
                  <Link to="/products" className="btn-outline" style={{ textAlign:'center' }}>Continue Shopping</Link>
                  {canCancel && (
                    <button className="btn-cancel" onClick={() => setShowCancel(true)}>Cancel Order</button>
                  )}
                  {currentStatus === 'canceled' && (
                    <p style={{ fontSize:'0.72rem', color:'#6B7280', textAlign:'center', padding:'8px 0' }}>This order has been canceled.</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Cancel confirmation modal */}
      {showCancel && (
        <div className="confirm-overlay">
          <div className="confirm-card">
            <h3 style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:'1.3rem', fontWeight:600, color:'var(--charcoal)', marginBottom:'10px' }}>
              Cancel this order?
            </h3>
            <p style={{ fontSize:'0.82rem', color:'var(--muted)', lineHeight:1.7, marginBottom:'24px' }}>
              This action cannot be undone. Your order will be marked as canceled.
            </p>
            <div className="flex gap-3">
              <button onClick={() => setShowCancel(false)} className="btn-outline" style={{ flex:1, textAlign:'center' }}>
                Keep Order
              </button>
              <button onClick={handleCancel} className="btn-cancel" style={{ flex:1 }}>
                Yes, Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </>
  );
}