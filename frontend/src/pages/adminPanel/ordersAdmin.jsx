import React, { useState } from 'react';
import Header from '../../components/layout/Header';
import Sidebar from '../../components/layout/Sidebar';
// import { getAllOrders, updateOrderStatus, markAsPaid } from '../../api/adminApi';

const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;600;700&family=Jost:wght@300;400;500&display=swap');
  :root { --maroon:#6B1B2A;--maroon-dark:#4A1019;--maroon-soft:#8B2535;--cream:#FAF7F4;--charcoal:#1C1C1E;--muted:#7A7A7A;--border:#E8E0D8; }
  .section-card { background:#fff;border:1px solid var(--border);border-radius:4px; }
  .status-badge { display:inline-flex;align-items:center;gap:5px;padding:3px 10px;border-radius:99px;font-size:0.65rem;letter-spacing:0.08em;text-transform:uppercase;font-weight:500; }
  .table-header { display:grid;padding:12px 20px;background:#FAF7F4;border-bottom:1px solid var(--border);font-size:0.68rem;letter-spacing:0.1em;text-transform:uppercase;color:var(--muted); }
  .table-row { display:grid;padding:14px 20px;border-bottom:1px solid var(--border);align-items:center;font-size:0.82rem;color:var(--charcoal);transition:background .15s; }
  .table-row:last-child { border-bottom:none; }
  .table-row:hover { background:#FDFAF8; }
  .action-btn { padding:5px 12px;border-radius:3px;font-family:'Jost',sans-serif;font-size:0.68rem;letter-spacing:0.08em;text-transform:uppercase;cursor:pointer;border:1px solid;transition:all .2s; }
  .filter-btn { padding:6px 14px;border-radius:99px;font-family:'Jost',sans-serif;font-size:0.7rem;letter-spacing:0.06em;text-transform:uppercase;cursor:pointer;transition:all .2s;border:1px solid var(--border); }
  .search-input { padding:8px 14px;font-family:'Jost',sans-serif;font-size:0.82rem;background:#fff;border:1px solid var(--border);border-radius:3px;color:var(--charcoal);outline:none;transition:border-color .2s; }
  .search-input:focus { border-color:var(--maroon); }
`;

const STATUS_STYLES = {
  pending:    { bg:'rgba(221,107,32,.1)', color:'#C05621', dot:'#DD6B20' },
  processing: { bg:'rgba(49,130,206,.1)', color:'#2B6CB0', dot:'#3182CE' },
  shipped:    { bg:'rgba(107,27,42,.1)',  color:'#6B1B2A', dot:'#6B1B2A' },
  delivered:  { bg:'rgba(56,161,105,.1)',color:'#276749', dot:'#38A169' },
  canceled:   { bg:'rgba(113,128,150,.1)',color:'#4A5568',dot:'#718096' },
};

const ORDER_STATUSES = ['pending','processing','shipped','delivered','canceled'];

// TODO: replace with real data from getAllOrders() API
const MOCK_ORDERS = [
  { _id:'ORD001', user:{name:'Amara Silva',  email:'amara@example.com'}, createdAt:'2026-03-05', totalPrice:128.00, orderStatus:'shipped',    paymentStatus:'pending', items:[{name:'Silk Blouse'},{name:'Belt'}] },
  { _id:'ORD002', user:{name:'Priya Mendis', email:'priya@example.com'}, createdAt:'2026-03-04', totalPrice: 64.50, orderStatus:'pending',    paymentStatus:'pending', items:[{name:'Gold Earrings'}] },
  { _id:'ORD003', user:{name:'Kavya Perera', email:'kavya@example.com'}, createdAt:'2026-03-03', totalPrice: 89.00, orderStatus:'delivered',  paymentStatus:'paid',    items:[{name:'Maroon Handbag'}] },
  { _id:'ORD004', user:{name:'Riya Fernando',email:'riya@example.com'},  createdAt:'2026-03-02', totalPrice:210.00, orderStatus:'processing', paymentStatus:'pending', items:[{name:'Cashmere Scarf'},{name:'Pearl Necklace'}] },
  { _id:'ORD005', user:{name:'Nadia Raj',    email:'nadia@example.com'}, createdAt:'2026-03-01', totalPrice: 45.00, orderStatus:'canceled',   paymentStatus:'pending', items:[{name:'Sunglasses'}] },
];

export default function OrdersAdmin() {
  const [orders, setOrders]     = useState(MOCK_ORDERS);
  const [filter, setFilter]     = useState('all');
  const [search, setSearch]     = useState('');
  const [selected, setSelected] = useState(null); // order being edited
  const [newStatus, setNewStatus] = useState('');
  const [updating, setUpdating] = useState(false);

  const filtered = orders.filter(o => {
    const matchStatus = filter === 'all' || o.orderStatus === filter;
    const matchSearch = !search || o._id.toLowerCase().includes(search.toLowerCase()) || o.user.name.toLowerCase().includes(search.toLowerCase());
    return matchStatus && matchSearch;
  });

  const handleStatusUpdate = async () => {
    if (!newStatus || !selected) return;
    setUpdating(true);
    try {
      // await updateOrderStatus(selected._id, { orderStatus: newStatus });
      setOrders(p => p.map(o => o._id === selected._id ? { ...o, orderStatus: newStatus } : o));
      setSelected(null); setNewStatus('');
    } catch (err) { console.error(err); }
    finally { setUpdating(false); }
  };

  const handleMarkPaid = async (orderId) => {
    try {
      // await markAsPaid(orderId);
      setOrders(p => p.map(o => o._id === orderId ? { ...o, paymentStatus: 'paid' } : o));
    } catch (err) { console.error(err); }
  };

  const fmtDate  = d => new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

  return (
    <>
      <style>{STYLES}</style>
      <Header />
      <div className="min-h-screen" style={{ background: 'var(--cream)', fontFamily: "'Jost',sans-serif" }}>
        <div className="max-w-7xl mx-auto px-6 py-12 flex flex-col md:flex-row gap-10">
          <Sidebar variant="admin" />

          <main className="flex-1 min-w-0">
            <h1 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: '1.7rem', fontWeight: 600, color: 'var(--charcoal)', marginBottom: '4px' }}>Orders</h1>
            <p style={{ fontSize: '0.82rem', color: 'var(--muted)', marginBottom: '28px' }}>Manage and update all customer orders</p>

            {/* Filters + search */}
            <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
              <div className="flex flex-wrap gap-1.5">
                {['all', ...ORDER_STATUSES].map(s => (
                  <button key={s} className="filter-btn" onClick={() => setFilter(s)}
                    style={{ background: filter === s ? 'var(--maroon)' : '#fff', color: filter === s ? '#fff' : 'var(--muted)', borderColor: filter === s ? 'var(--maroon)' : 'var(--border)' }}>
                    {s}
                  </button>
                ))}
              </div>
              <input className="search-input" placeholder="Search order ID or customer…" value={search} onChange={e => setSearch(e.target.value)} style={{ width: '220px' }} />
            </div>

            {/* Table */}
            <div className="section-card">
              <div className="table-header" style={{ gridTemplateColumns: '1fr 1.5fr 1fr auto auto auto' }}>
                <span>Order</span><span>Customer</span><span>Date</span><span>Status</span><span>Payment</span><span>Actions</span>
              </div>

              {filtered.length === 0 ? (
                <div className="text-center py-12" style={{ color: 'var(--muted)', fontSize: '0.85rem' }}>No orders found.</div>
              ) : filtered.map(order => {
                const st = STATUS_STYLES[order.orderStatus] || STATUS_STYLES.pending;
                return (
                  <div key={order._id} className="table-row" style={{ gridTemplateColumns: '1fr 1.5fr 1fr auto auto auto', gap: '12px' }}>

                    <div>
                      <p style={{ fontWeight: 500 }}>#{order._id}</p>
                      <p style={{ fontSize: '0.7rem', color: 'var(--muted)' }}>{order.items.map(i => i.name).join(', ')}</p>
                    </div>

                    <div>
                      <p style={{ fontWeight: 500 }}>{order.user.name}</p>
                      <p style={{ fontSize: '0.7rem', color: 'var(--muted)' }}>{order.user.email}</p>
                    </div>

                    <span style={{ fontSize: '0.78rem', color: 'var(--muted)' }}>{fmtDate(order.createdAt)}</span>

                    <span className="status-badge" style={{ background: st.bg, color: st.color }}>
                      <span style={{ width: '5px', height: '5px', borderRadius: '50%', background: st.dot }} />
                      {order.orderStatus}
                    </span>

                    <span className="status-badge" style={{
                      background: order.paymentStatus === 'paid' ? 'rgba(56,161,105,.1)' : 'rgba(221,107,32,.1)',
                      color: order.paymentStatus === 'paid' ? '#276749' : '#C05621'
                    }}>
                      {order.paymentStatus}
                    </span>

                    <div className="flex items-center gap-2">
                      <button className="action-btn" onClick={() => { setSelected(order); setNewStatus(order.orderStatus); }}
                        style={{ borderColor: 'var(--maroon)', color: 'var(--maroon)' }}
                        onMouseEnter={e => { e.currentTarget.style.background = 'var(--maroon)'; e.currentTarget.style.color = '#fff'; }}
                        onMouseLeave={e => { e.currentTarget.style.background = ''; e.currentTarget.style.color = 'var(--maroon)'; }}>
                        Edit
                      </button>
                      {order.orderStatus === 'delivered' && order.paymentStatus !== 'paid' && (
                        <button className="action-btn" onClick={() => handleMarkPaid(order._id)}
                          style={{ borderColor: '#276749', color: '#276749' }}
                          onMouseEnter={e => { e.currentTarget.style.background = '#276749'; e.currentTarget.style.color = '#fff'; }}
                          onMouseLeave={e => { e.currentTarget.style.background = ''; e.currentTarget.style.color = '#276749'; }}>
                          Mark Paid
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Edit status modal */}
            {selected && (
              <div className="fixed inset-0 z-50 flex items-center justify-center" style={{ background: 'rgba(0,0,0,0.4)' }}>
                <div className="bg-white rounded-md p-8 max-w-sm w-full mx-4 shadow-xl">
                  <h3 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: '1.3rem', fontWeight: 600, color: 'var(--charcoal)', marginBottom: '4px' }}>Update Order Status</h3>
                  <p style={{ fontSize: '0.78rem', color: 'var(--muted)', marginBottom: '20px' }}>Order #{selected._id} — {selected.user.name}</p>
                  <select value={newStatus} onChange={e => setNewStatus(e.target.value)}
                    style={{ width: '100%', padding: '10px 14px', border: '1px solid var(--border)', borderRadius: '3px', fontFamily: "'Jost',sans-serif", fontSize: '0.85rem', color: 'var(--charcoal)', outline: 'none', marginBottom: '20px', background: '#fff' }}>
                    {ORDER_STATUSES.map(s => <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>)}
                  </select>
                  <div className="flex gap-3">
                    <button onClick={handleStatusUpdate} disabled={updating}
                      style={{ padding: '10px 24px', background: 'var(--maroon)', color: '#fff', border: 'none', borderRadius: '3px', fontFamily: "'Jost',sans-serif", fontSize: '0.72rem', letterSpacing: '0.12em', textTransform: 'uppercase', cursor: 'pointer' }}>
                      {updating ? 'Saving…' : 'Update'}
                    </button>
                    <button onClick={() => { setSelected(null); setNewStatus(''); }}
                      style={{ padding: '10px 24px', background: 'transparent', color: 'var(--muted)', border: '1px solid var(--border)', borderRadius: '3px', fontFamily: "'Jost',sans-serif", fontSize: '0.72rem', letterSpacing: '0.12em', textTransform: 'uppercase', cursor: 'pointer' }}>
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            )}
          </main>
        </div>
      </div>
    </>
  );
}