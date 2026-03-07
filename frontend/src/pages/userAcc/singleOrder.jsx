import React, { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import Header from '../../components/layout/Header';
import Footer from '../../components/layout/Footer';
import Sidebar from '../../components/layout/Sidebar';
// import { getOrderById, cancelOrder } from '../../api/orderApi';

const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;600;700&family=Jost:wght@300;400;500&display=swap');
  :root { --maroon:#6B1B2A;--maroon-dark:#4A1019;--maroon-soft:#8B2535;--cream:#FAF7F4;--charcoal:#1C1C1E;--muted:#7A7A7A;--border:#E8E0D8; }
  .section-card { background:#fff;border:1px solid var(--border);border-radius:4px;padding:24px; }
  .status-badge { display:inline-flex;align-items:center;gap:6px;padding:4px 12px;border-radius:99px;font-size:0.7rem;letter-spacing:0.08em;text-transform:uppercase;font-weight:500; }
  .btn-danger { padding:9px 22px;background:transparent;color:#C53030;border:1px solid #C53030;border-radius:3px;font-family:'Jost',sans-serif;font-size:0.72rem;letter-spacing:0.1em;text-transform:uppercase;cursor:pointer;transition:all .2s; }
  .btn-danger:hover { background:#C53030;color:#fff; }
  .step { display:flex;flex-direction:column;align-items:center;flex:1; }
  .step-dot { width:28px;height:28px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:0.65rem;font-weight:600;flex-shrink:0; }
  .step-line { flex:1;height:2px;margin-top:14px; }
`;

const STATUS_STYLES = {
  pending:    { bg: 'rgba(221,107,32,.1)',  color: '#C05621', dot: '#DD6B20' },
  processing: { bg: 'rgba(49,130,206,.1)',  color: '#2B6CB0', dot: '#3182CE' },
  shipped:    { bg: 'rgba(107,27,42,.1)',   color: '#6B1B2A', dot: '#6B1B2A' },
  delivered:  { bg: 'rgba(56,161,105,.1)', color: '#276749', dot: '#38A169' },
  canceled:   { bg: 'rgba(113,128,150,.1)',color: '#4A5568', dot: '#718096' },
};

const STEPS = ['pending', 'processing', 'shipped', 'delivered'];

// TODO: replace with real data fetched by order ID from API
const MOCK_ORDER = {
  _id: 'ORD001',
  createdAt: '2026-02-14T10:30:00Z',
  orderStatus: 'shipped',
  paymentStatus: 'pending',
  paymentMethod: 'cod',
  trackingNumber: 'TRK9284710',
  deliveryMethod: 'Standard Delivery',
  shippingPrice: 5.00,
  totalPrice: 128.00,
  shippingAddress: { street: '123 Elm Street', city: 'Colombo', state: 'Western', zip: '00100', country: 'Sri Lanka' },
  items: [
    { product: 'p1', name: 'Silk Blouse', price: 79.00, quantity: 1, color: 'Ivory', size: 'M', image: '' },
    { product: 'p2', name: 'Leather Belt', price: 44.00, quantity: 1, color: 'Tan',   size: 'S', image: '' },
  ],
};

export default function SingleOrder() {
  const { id }                    = useParams();
  const [order, setOrder]         = useState(MOCK_ORDER); // TODO: fetch by id
  const [canceling, setCanceling] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const fmtDate  = d => new Date(d).toLocaleDateString('en-US', { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' });
  const fmtPrice = p => `$${p.toFixed(2)}`;

  const handleCancel = async () => {
    setCanceling(true);
    try {
      // await cancelOrder(order._id);
      setOrder(p => ({ ...p, orderStatus: 'canceled' }));
      setShowConfirm(false);
    } catch (err) { console.error(err); }
    finally { setCanceling(false); }
  };

  const st = STATUS_STYLES[order.orderStatus] || STATUS_STYLES.pending;
  const stepIndex = STEPS.indexOf(order.orderStatus);

  return (
    <>
      <style>{STYLES}</style>
      <Header />
      <div className="min-h-screen" style={{ background: 'var(--cream)', fontFamily: "'Jost',sans-serif" }}>
        <div className="max-w-6xl mx-auto px-6 py-12 flex flex-col md:flex-row gap-10">
          <Sidebar variant="user" />

          <main className="flex-1 min-w-0">

            {/* Back + header */}
            <Link to="/profile/orders" className="inline-flex items-center gap-1.5 mb-6 text-sm" style={{ color: 'var(--muted)', textDecoration: 'none' }}
              onMouseEnter={e => e.currentTarget.style.color = 'var(--maroon)'}
              onMouseLeave={e => e.currentTarget.style.color = 'var(--muted)'}>
              <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
              Back to Orders
            </Link>

            <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
              <div>
                <h1 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: '1.7rem', fontWeight: 600, color: 'var(--charcoal)', marginBottom: '4px' }}>
                  Order #{order._id}
                </h1>
                <p style={{ fontSize: '0.78rem', color: 'var(--muted)' }}>Placed on {fmtDate(order.createdAt)}</p>
              </div>
              <div className="flex items-center gap-3">
                <span className="status-badge" style={{ background: st.bg, color: st.color }}>
                  <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: st.dot }} />
                  {order.orderStatus}
                </span>
                {order.orderStatus === 'pending' && (
                  <button className="btn-danger" onClick={() => setShowConfirm(true)}>Cancel Order</button>
                )}
              </div>
            </div>

            {/* Progress tracker */}
            {order.orderStatus !== 'canceled' && (
              <div className="section-card mb-5">
                <p style={{ fontSize: '0.72rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--muted)', marginBottom: '20px' }}>Order Progress</p>
                <div className="flex items-start">
                  {STEPS.map((step, i) => {
                    const done    = stepIndex >= i;
                    const current = stepIndex === i;
                    return (
                      <React.Fragment key={step}>
                        <div className="step">
                          <div className="step-dot" style={{ background: done ? 'var(--maroon)' : '#F0EAE5', color: done ? '#fff' : '#C4B5B8', border: current ? '2px solid var(--maroon)' : 'none' }}>
                            {done && !current
                              ? <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"/></svg>
                              : <span>{i + 1}</span>
                            }
                          </div>
                          <p style={{ fontSize: '0.65rem', marginTop: '6px', color: done ? 'var(--maroon)' : 'var(--muted)', textTransform: 'capitalize', fontWeight: done ? 500 : 400, textAlign: 'center' }}>{step}</p>
                        </div>
                        {i < STEPS.length - 1 && (
                          <div className="step-line" style={{ background: stepIndex > i ? 'var(--maroon)' : '#E8E0D8', marginTop: '14px' }} />
                        )}
                      </React.Fragment>
                    );
                  })}
                </div>
                {order.trackingNumber && (
                  <p style={{ fontSize: '0.75rem', color: 'var(--muted)', marginTop: '16px' }}>
                    Tracking number: <strong style={{ color: 'var(--charcoal)' }}>{order.trackingNumber}</strong>
                  </p>
                )}
              </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">

              {/* Items */}
              <div className="section-card lg:col-span-2">
                <p style={{ fontSize: '0.72rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--muted)', marginBottom: '16px' }}>Items Ordered</p>
                <div className="flex flex-col gap-4">
                  {order.items.map((item, i) => (
                    <div key={i} className="flex items-center gap-4" style={{ paddingBottom: i < order.items.length - 1 ? '16px' : 0, borderBottom: i < order.items.length - 1 ? '1px solid var(--border)' : 'none' }}>
                      {/* IMAGE: product image — 64×64px */}
                      <div style={{ width: '64px', height: '64px', borderRadius: '4px', background: '#F0EAE5', overflow: 'hidden', flexShrink: 0 }}>
                        {item.image
                          ? <img src={item.image} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                          : <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                              <svg width="20" height="20" fill="none" stroke="#C4B5B8" strokeWidth="1.5" viewBox="0 0 24 24"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><path d="M21 15l-5-5L5 21"/></svg>
                            </div>
                        }
                      </div>
                      <div className="flex-1 min-w-0">
                        <p style={{ fontSize: '0.88rem', fontWeight: 500, color: 'var(--charcoal)', marginBottom: '2px' }}>{item.name}</p>
                        <p style={{ fontSize: '0.75rem', color: 'var(--muted)' }}>
                          {item.color && `Color: ${item.color}`}{item.color && item.size && ' · '}{item.size && `Size: ${item.size}`} · Qty: {item.quantity}
                        </p>
                      </div>
                      <p style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: '1rem', fontWeight: 600, color: 'var(--charcoal)', flexShrink: 0 }}>{fmtPrice(item.price * item.quantity)}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Summary sidebar */}
              <div className="flex flex-col gap-4">

                {/* Shipping address */}
                <div className="section-card">
                  <p style={{ fontSize: '0.72rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--muted)', marginBottom: '12px' }}>Ship To</p>
                  <p style={{ fontSize: '0.85rem', color: 'var(--charcoal)', lineHeight: 1.8 }}>
                    {order.shippingAddress.street}<br />
                    {order.shippingAddress.city}{order.shippingAddress.state ? `, ${order.shippingAddress.state}` : ''} {order.shippingAddress.zip}<br />
                    {order.shippingAddress.country}
                  </p>
                </div>

                {/* Payment summary */}
                <div className="section-card">
                  <p style={{ fontSize: '0.72rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--muted)', marginBottom: '12px' }}>Payment</p>
                  <div className="flex flex-col gap-2">
                    {[
                      { label: 'Method',   value: 'Cash on Delivery' },
                      { label: 'Delivery', value: order.deliveryMethod || 'Standard' },
                      { label: 'Shipping', value: fmtPrice(order.shippingPrice) },
                      { label: 'Status',   value: order.paymentStatus === 'paid' ? '✓ Paid' : 'Pending collection' },
                    ].map(({ label, value }) => (
                      <div key={label} className="flex justify-between items-center">
                        <span style={{ fontSize: '0.78rem', color: 'var(--muted)' }}>{label}</span>
                        <span style={{ fontSize: '0.78rem', color: 'var(--charcoal)' }}>{value}</span>
                      </div>
                    ))}
                    <div style={{ borderTop: '1px solid var(--border)', paddingTop: '10px', marginTop: '4px' }} className="flex justify-between items-center">
                      <span style={{ fontSize: '0.82rem', fontWeight: 500, color: 'var(--charcoal)' }}>Total</span>
                      <span style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: '1.1rem', fontWeight: 600, color: 'var(--maroon)' }}>{fmtPrice(order.totalPrice)}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>

      {/* Cancel confirm modal */}
      {showConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center" style={{ background: 'rgba(0,0,0,0.4)' }}>
          <div className="bg-white rounded-md p-8 max-w-sm w-full mx-4 shadow-xl">
            <h3 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: '1.3rem', fontWeight: 600, color: 'var(--charcoal)', marginBottom: '8px' }}>Cancel this order?</h3>
            <p style={{ fontSize: '0.82rem', color: 'var(--muted)', marginBottom: '24px', lineHeight: 1.7 }}>This action cannot be undone. Your order will be marked as canceled.</p>
            <div className="flex gap-3">
              <button className="btn-danger" onClick={handleCancel} disabled={canceling} style={{ padding: '10px 24px' }}>
                {canceling ? 'Canceling…' : 'Yes, Cancel'}
              </button>
              <button onClick={() => setShowConfirm(false)} style={{ padding: '10px 24px', background: 'transparent', color: 'var(--muted)', border: '1px solid var(--border)', borderRadius: '3px', cursor: 'pointer', fontFamily: "'Jost',sans-serif", fontSize: '0.72rem', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
                Keep Order
              </button>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </>
  );
}