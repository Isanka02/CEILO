import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Header from '../../components/layout/Header';
import Footer from '../../components/layout/Footer';
import { createOrder } from '../../api/orderApi';
import { useCart } from '../../context/CartContext';

const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300;1,400&family=Jost:wght@300;400;500&display=swap');
  :root { --maroon:#6B1B2A;--maroon-dark:#4A1019;--maroon-soft:#8B2535;--cream:#FAF7F4;--charcoal:#1C1C1E;--muted:#7A7A7A;--border:#E8E0D8; }

  .checkout-input { width:100%;padding:11px 14px;font-family:'Jost',sans-serif;font-size:0.82rem;color:var(--charcoal);background:#fff;border:1px solid var(--border);border-radius:3px;outline:none;transition:border-color .2s; }
  .checkout-input:focus { border-color:var(--maroon); }
  .checkout-input::placeholder { color:#B8B0A8; }
  .checkout-input.error { border-color:#C0392B; }

  .checkout-label { display:block;font-size:0.68rem;letter-spacing:0.1em;text-transform:uppercase;color:var(--muted);margin-bottom:6px; }

  .section-card { background:#fff;border:1px solid var(--border);border-radius:4px;padding:28px 32px;margin-bottom:16px; }
  .section-num { width:24px;height:24px;border-radius:50%;background:var(--maroon);color:#fff;font-size:0.7rem;font-weight:500;display:flex;align-items:center;justify-content:center;flex-shrink:0; }

  .cod-badge { background:rgba(107,27,42,.06);border:1px solid rgba(107,27,42,.15);border-radius:3px;padding:14px 18px;display:flex;align-items:center;gap:12px; }

  .btn-maroon { display:block;width:100%;padding:14px;background:var(--maroon);color:#fff;border:none;border-radius:3px;font-family:'Jost',sans-serif;font-size:0.75rem;letter-spacing:0.15em;text-transform:uppercase;cursor:pointer;transition:background .2s; }
  .btn-maroon:hover:not(:disabled) { background:var(--maroon-soft); }
  .btn-maroon:disabled { opacity:.55;cursor:not-allowed; }

  .order-item { display:flex;gap:14px;padding:14px 0;border-bottom:1px solid var(--border); }
  .order-item:last-child { border-bottom:none; }
  .item-img { width:64px;height:80px;object-fit:cover;border-radius:2px;background:#F0EAE5;flex-shrink:0; }

  .summary-row { display:flex;justify-content:space-between;align-items:center;padding:7px 0;font-size:0.82rem; }
  .summary-total { display:flex;justify-content:space-between;align-items:center;padding:14px 0 0;border-top:1px solid var(--border);margin-top:6px; }

  .step-fade { animation:fadeIn .4s ease; }
  @keyframes fadeIn { from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)} }

  .success-overlay { position:fixed;inset:0;background:rgba(26,8,16,.6);z-index:50;display:flex;align-items:center;justify-content:center;padding:20px; }
  .success-card { background:#fff;border-radius:6px;padding:48px 40px;max-width:440px;width:100%;text-align:center; }
  .success-icon { width:56px;height:56px;border-radius:50%;background:rgba(107,27,42,.08);display:flex;align-items:center;justify-content:center;margin:0 auto 20px; }
`;

// ─── Mock cart data — replace with real CartContext ──────────────────────────
const CART_ITEMS = [
  { _id:'p1', name:'Silk Draped Blouse',  image:'', price:69,  quantity:1, color:'Ivory',  size:'M'  },
  { _id:'p4', name:'Pearl Drop Necklace', image:'', price:64,  quantity:1, color:null,     size:null },
  { _id:'p5', name:'Cashmere Wrap Scarf', image:'', price:120, quantity:2, color:'Camel',  size:null },
];

const DELIVERY_OPTIONS = [
  { id:'standard', label:'Standard Delivery', sub:'5–7 business days', price:0    },
  { id:'express',  label:'Express Delivery',  sub:'2–3 business days', price:12   },
];

const PROVINCES = ['Western','Central','Southern','Northern','Eastern','North Western','North Central','Uva','Sabaragamuwa'];

export default function Checkout() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    firstName:'', lastName:'', email:'', phone:'',
    street:'', city:'', state:'', zip:'', country:'Sri Lanka',
    saveAddress: false,
  });
  const [delivery, setDelivery] = useState('standard');
  const [errors, setErrors]     = useState({});
  const [loading, setLoading]   = useState(false);
  const [success, setSuccess]   = useState(false);
  const [orderId, setOrderId]   = useState('');

  const shippingPrice = DELIVERY_OPTIONS.find(d => d.id === delivery)?.price ?? 0;
  const subtotal      = CART_ITEMS.reduce((s, i) => s + i.price * i.quantity, 0);
  const total         = subtotal + shippingPrice;

  const set = (k, v) => { setForm(f => ({ ...f, [k]:v })); setErrors(e => ({ ...e, [k]:'' })); };

  const validate = () => {
    const e = {};
    if (!form.firstName.trim()) e.firstName = 'Required';
    if (!form.lastName.trim())  e.lastName  = 'Required';
    if (!form.email.trim() || !/\S+@\S+\.\S+/.test(form.email)) e.email = 'Valid email required';
    if (!form.phone.trim())     e.phone  = 'Required';
    if (!form.street.trim())    e.street = 'Required';
    if (!form.city.trim())      e.city   = 'Required';
    if (!form.zip.trim())       e.zip    = 'Required';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;
    setLoading(true);
    try {
      // TODO: replace with real API call
      // const order = await createOrder({ items, shippingAddress, deliveryMethod, shippingPrice, totalPrice });
      await new Promise(r => setTimeout(r, 1400)); // mock delay
      const mockId = 'ORD-' + Math.random().toString(36).slice(2,8).toUpperCase();
      setOrderId(mockId);
      setSuccess(true);
    } catch (err) {
      alert('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const Field = ({ label, name, type='text', half, placeholder, as }) => (
    <div className={half ? '' : ''}>
      <label className="checkout-label">{label}</label>
      {as === 'select' ? (
        <select
          className={`checkout-input${errors[name] ? ' error' : ''}`}
          value={form[name]} onChange={e => set(name, e.target.value)}
          style={{ appearance:'none', backgroundImage:'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'12\' height=\'12\' viewBox=\'0 0 24 24\' fill=\'none\' stroke=\'%237A7A7A\' stroke-width=\'2\'%3E%3Cpath d=\'M6 9l6 6 6-6\'/%3E%3C/svg%3E")', backgroundRepeat:'no-repeat', backgroundPosition:'right 12px center', backgroundSize:'12px' }}
        >
          {PROVINCES.map(p => <option key={p}>{p}</option>)}
        </select>
      ) : (
        <input
          type={type}
          className={`checkout-input${errors[name] ? ' error' : ''}`}
          placeholder={placeholder}
          value={form[name]}
          onChange={e => set(name, e.target.value)}
        />
      )}
      {errors[name] && <p style={{ fontSize:'0.68rem',color:'#C0392B',marginTop:'4px' }}>{errors[name]}</p>}
    </div>
  );

  return (
    <>
      <style>{STYLES}</style>
      <Header />
      <div style={{ background:'var(--cream)', minHeight:'100vh', fontFamily:"'Jost',sans-serif", paddingBottom:'64px' }}>

        {/* ── Page header ── */}
        <div style={{ borderBottom:'1px solid var(--border)', background:'#fff', padding:'20px 6%' }}>
          <div className="flex items-center gap-2" style={{ fontSize:'0.7rem', color:'var(--muted)', letterSpacing:'0.08em' }}>
            <Link to="/products" style={{ color:'var(--muted)', textDecoration:'none' }}>Shop</Link>
            <span>/</span>
            <Link to="/cart" style={{ color:'var(--muted)', textDecoration:'none' }}>Cart</Link>
            <span>/</span>
            <span style={{ color:'var(--charcoal)' }}>Checkout</span>
          </div>
        </div>

        <div className="max-w-6xl mx-auto px-6 py-10">
          <h1 style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:'clamp(1.6rem,3vw,2.2rem)', fontWeight:600, color:'var(--charcoal)', marginBottom:'32px' }}>
            Checkout
          </h1>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

            {/* ── LEFT: Form ── */}
            <div className="lg:col-span-2 step-fade">

              {/* Contact */}
              <div className="section-card">
                <div className="flex items-center gap-3 mb-6">
                  <div className="section-num">1</div>
                  <h2 style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:'1.15rem', fontWeight:600, color:'var(--charcoal)' }}>Contact Information</h2>
                </div>
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <Field label="First Name" name="firstName" placeholder="Jane" />
                  <Field label="Last Name"  name="lastName"  placeholder="Smith" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <Field label="Email Address" name="email" type="email" placeholder="jane@example.com" />
                  <Field label="Phone Number"  name="phone" type="tel"   placeholder="+94 77 000 0000" />
                </div>
              </div>

              {/* Shipping */}
              <div className="section-card">
                <div className="flex items-center gap-3 mb-6">
                  <div className="section-num">2</div>
                  <h2 style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:'1.15rem', fontWeight:600, color:'var(--charcoal)' }}>Shipping Address</h2>
                </div>
                <div className="mb-4">
                  <Field label="Street Address" name="street" placeholder="123 Main Street, Apt 4B" />
                </div>
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <Field label="City"     name="city" placeholder="Colombo" />
                  <Field label="Province" name="state" as="select" />
                </div>
                <div className="grid grid-cols-2 gap-4 mb-5">
                  <Field label="Postal Code" name="zip"     placeholder="10001" />
                  <Field label="Country"     name="country" placeholder="Sri Lanka" />
                </div>
                <label className="flex items-center gap-2 cursor-pointer" style={{ fontSize:'0.78rem', color:'var(--muted)' }}>
                  <input type="checkbox" checked={form.saveAddress} onChange={e => set('saveAddress', e.target.checked)}
                    style={{ accentColor:'var(--maroon)', width:'14px', height:'14px' }} />
                  Save this address to my account
                </label>
              </div>

              {/* Delivery */}
              <div className="section-card">
                <div className="flex items-center gap-3 mb-6">
                  <div className="section-num">3</div>
                  <h2 style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:'1.15rem', fontWeight:600, color:'var(--charcoal)' }}>Delivery Method</h2>
                </div>
                <div className="flex flex-col gap-3">
                  {DELIVERY_OPTIONS.map(opt => (
                    <label key={opt.id} className="flex items-center gap-4 cursor-pointer"
                      style={{ padding:'14px 18px', border:`1px solid ${delivery === opt.id ? 'var(--maroon)' : 'var(--border)'}`, borderRadius:'3px', background: delivery === opt.id ? 'rgba(107,27,42,.03)' : '#fff', transition:'all .2s' }}>
                      <input type="radio" name="delivery" value={opt.id} checked={delivery === opt.id} onChange={() => setDelivery(opt.id)}
                        style={{ accentColor:'var(--maroon)', width:'15px', height:'15px' }} />
                      <div className="flex-1">
                        <p style={{ fontSize:'0.82rem', fontWeight:500, color:'var(--charcoal)', marginBottom:'2px' }}>{opt.label}</p>
                        <p style={{ fontSize:'0.72rem', color:'var(--muted)' }}>{opt.sub}</p>
                      </div>
                      <span style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:'0.95rem', fontWeight:600, color: opt.price === 0 ? '#2D7A4F' : 'var(--charcoal)' }}>
                        {opt.price === 0 ? 'Free' : `$${opt.price}`}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Payment */}
              <div className="section-card">
                <div className="flex items-center gap-3 mb-6">
                  <div className="section-num">4</div>
                  <h2 style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:'1.15rem', fontWeight:600, color:'var(--charcoal)' }}>Payment</h2>
                </div>
                <div className="cod-badge">
                  <div style={{ width:'36px', height:'36px', borderRadius:'50%', background:'rgba(107,27,42,.1)', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
                    <svg width="16" height="16" fill="none" stroke="var(--maroon)" strokeWidth="1.8" viewBox="0 0 24 24">
                      <rect x="2" y="5" width="20" height="14" rx="2"/><path d="M2 10h20"/>
                    </svg>
                  </div>
                  <div>
                    <p style={{ fontSize:'0.82rem', fontWeight:500, color:'var(--charcoal)', marginBottom:'2px' }}>Cash on Delivery</p>
                    <p style={{ fontSize:'0.72rem', color:'var(--muted)' }}>Pay in cash when your order arrives at your door.</p>
                  </div>
                </div>
              </div>

            </div>

            {/* ── RIGHT: Order Summary ── */}
            <div>
              <div className="section-card" style={{ position:'sticky', top:'24px' }}>
                <h2 style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:'1.1rem', fontWeight:600, color:'var(--charcoal)', marginBottom:'20px' }}>
                  Order Summary
                </h2>

                {/* Items */}
                <div style={{ marginBottom:'4px' }}>
                  {CART_ITEMS.map(item => (
                    <div key={item._id} className="order-item">
                      {/* IMAGE: product thumbnail */}
                      <div style={{ width:'64px', height:'80px', background:'#F0EAE5', borderRadius:'2px', flexShrink:0, display:'flex', alignItems:'center', justifyContent:'center' }}>
                        {item.image
                          ? <img src={item.image} alt={item.name} style={{ width:'100%', height:'100%', objectFit:'cover', borderRadius:'2px' }} />
                          : <svg width="20" height="20" fill="none" stroke="#D4C5C0" strokeWidth="1.2" viewBox="0 0 24 24"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><path d="M21 15l-5-5L5 21"/></svg>
                        }
                      </div>
                      <div className="flex-1 min-w-0">
                        <p style={{ fontSize:'0.82rem', fontWeight:500, color:'var(--charcoal)', marginBottom:'3px', lineHeight:1.3 }}>{item.name}</p>
                        <p style={{ fontSize:'0.7rem', color:'var(--muted)', marginBottom:'6px' }}>
                          {[item.color, item.size].filter(Boolean).join(' · ')}
                          {item.quantity > 1 && ` · Qty ${item.quantity}`}
                        </p>
                        <p style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:'0.95rem', fontWeight:600, color:'var(--charcoal)' }}>
                          ${item.price * item.quantity}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Totals */}
                <div>
                  <div className="summary-row">
                    <span style={{ color:'var(--muted)' }}>Subtotal</span>
                    <span style={{ color:'var(--charcoal)' }}>${subtotal}</span>
                  </div>
                  <div className="summary-row">
                    <span style={{ color:'var(--muted)' }}>Shipping</span>
                    <span style={{ color: shippingPrice === 0 ? '#2D7A4F' : 'var(--charcoal)' }}>
                      {shippingPrice === 0 ? 'Free' : `$${shippingPrice}`}
                    </span>
                  </div>
                  <div className="summary-total">
                    <span style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:'1rem', fontWeight:600, color:'var(--charcoal)' }}>Total</span>
                    <span style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:'1.2rem', fontWeight:600, color:'var(--maroon)' }}>${total}</span>
                  </div>
                </div>

                <button className="btn-maroon mt-5" onClick={handleSubmit} disabled={loading}>
                  {loading ? 'Placing Order…' : 'Place Order'}
                </button>

                <p style={{ fontSize:'0.68rem', color:'var(--muted)', textAlign:'center', marginTop:'12px', lineHeight:1.6 }}>
                  By placing your order you agree to our{' '}
                  <a href="#" style={{ color:'var(--maroon)', textDecoration:'none' }}>Terms & Conditions</a>.
                </p>
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* ── Success Modal ── */}
      {success && (
        <div className="success-overlay">
          <div className="success-card">
            <div className="success-icon">
              <svg width="24" height="24" fill="none" stroke="var(--maroon)" strokeWidth="1.8" viewBox="0 0 24 24">
                <path d="M20 6L9 17l-5-5"/>
              </svg>
            </div>
            <h2 style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:'1.6rem', fontWeight:600, color:'var(--charcoal)', marginBottom:'8px' }}>
              Order Placed!
            </h2>
            <p style={{ fontSize:'0.82rem', color:'var(--muted)', lineHeight:1.7, marginBottom:'6px' }}>
              Thank you for your order. We'll prepare it with care.
            </p>
            <p style={{ fontSize:'0.75rem', color:'var(--maroon)', fontWeight:500, marginBottom:'28px', letterSpacing:'0.05em' }}>
              {orderId}
            </p>
            <div className="flex flex-col gap-3">
              <button className="btn-maroon" onClick={() => navigate(`/orders/${orderId}`)}>
                View Order
              </button>
              <Link to="/products" style={{ fontSize:'0.72rem', color:'var(--muted)', textDecoration:'none', textAlign:'center', letterSpacing:'0.08em', textTransform:'uppercase' }}>
                Continue Shopping
              </Link>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </>
  );
}