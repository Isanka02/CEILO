import React, { useState } from 'react';
import Header from '../../components/layout/Header';
import Sidebar from '../../components/layout/Sidebar';
// import { sendNotification } from '../../api/adminApi';

const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;600;700&family=Jost:wght@300;400;500&display=swap');
  :root { --maroon:#6B1B2A;--maroon-dark:#4A1019;--maroon-soft:#8B2535;--cream:#FAF7F4;--charcoal:#1C1C1E;--muted:#7A7A7A;--border:#E8E0D8; }
  .field-label { font-size:0.72rem;letter-spacing:0.1em;text-transform:uppercase;color:var(--muted);margin-bottom:6px;display:block; }
  .field-input { width:100%;padding:10px 14px;font-family:'Jost',sans-serif;font-size:0.875rem;background:#fff;border:1px solid var(--border);border-radius:3px;color:var(--charcoal);outline:none;transition:border-color .2s,box-shadow .2s; }
  .field-input:focus { border-color:var(--maroon);box-shadow:0 0 0 3px rgba(107,27,42,.08); }
  .field-input.has-error { border-color:#C53030 !important; }
  .field-input::placeholder { color:#BBADA8; }
  .field-error { font-size:0.7rem;color:#C53030;margin-top:4px; }
  .btn-primary { padding:11px 28px;background:var(--maroon);color:#fff;border:none;border-radius:3px;font-family:'Jost',sans-serif;font-size:0.75rem;letter-spacing:0.15em;text-transform:uppercase;cursor:pointer;transition:background .2s; }
  .btn-primary:hover:not(:disabled) { background:var(--maroon-soft); }
  .btn-primary:disabled { opacity:.6;cursor:not-allowed; }
  .type-btn { padding:10px 20px;border-radius:3px;font-family:'Jost',sans-serif;font-size:0.72rem;letter-spacing:0.1em;text-transform:uppercase;cursor:pointer;border:1px solid var(--border);transition:all .2s;background:#fff;color:var(--muted); }
  .type-btn.active { background:var(--maroon);color:#fff;border-color:var(--maroon); }
  .history-row { display:flex;align-items:flex-start;justify-content:space-between;gap:12px;padding:14px 0;border-bottom:1px solid var(--border); }
  .history-row:last-child { border-bottom:none; }
`;

const validate = f => {
  const e = {};
  if (!f.title.trim())   e.title   = 'Title is required.';
  if (!f.message.trim()) e.message = 'Message is required.';
  else if (f.message.trim().length < 10) e.message = 'Message must be at least 10 characters.';
  return e;
};

// TODO: replace with real sent history from API
const MOCK_HISTORY = [
  { _id:'n1', title:'Spring Collection is Live!', message:'Discover our new spring arrivals.', type:'promo',  sentAt:'2026-03-01', audience:'All Users' },
  { _id:'n2', title:'Shipping Delay Notice',       message:'Some orders may experience delays.', type:'info', sentAt:'2026-02-20', audience:'All Users' },
];

const TYPE_COLORS = {
  order: { bg:'rgba(49,130,206,.1)', color:'#2B6CB0' },
  promo: { bg:'rgba(107,27,42,.1)', color:'#6B1B2A' },
  info:  { bg:'rgba(113,128,150,.1)',color:'#4A5568' },
};

export default function SendNotificationAdmin() {
  const [form, setForm]         = useState({ title: '', message: '', type: 'info', userId: '' });
  const [errors, setErrors]     = useState({});
  const [touched, setTouched]   = useState({});
  const [loading, setLoading]   = useState(false);
  const [success, setSuccess]   = useState('');
  const [history, setHistory]   = useState(MOCK_HISTORY);
  const [audience, setAudience] = useState('all'); // 'all' | 'specific'

  const handleChange = e => {
    const { name, value } = e.target;
    setForm(p => ({ ...p, [name]: value }));
    if (touched[name]) {
      const errs = validate({ ...form, [name]: value });
      setErrors(p => ({ ...p, [name]: errs[name] || '' }));
    }
  };

  const handleBlur = e => {
    const { name } = e.target;
    setTouched(p => ({ ...p, [name]: true }));
    const errs = validate(form);
    setErrors(p => ({ ...p, [name]: errs[name] || '' }));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setSuccess('');
    setTouched({ title: true, message: true });
    const errs = validate(form);
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setLoading(true);
    try {
      const payload = {
        title:   form.title,
        message: form.message,
        type:    form.type,
        ...(audience === 'specific' && form.userId ? { userId: form.userId } : {}),
      };
      // await sendNotification(payload);
      console.log('Send notification:', payload);
      setHistory(p => [{ _id: Date.now().toString(), ...form, sentAt: new Date().toISOString().slice(0,10), audience: audience === 'all' ? 'All Users' : `User: ${form.userId}` }, ...p]);
      setForm({ title: '', message: '', type: 'info', userId: '' });
      setErrors({}); setTouched({});
      setSuccess('Notification sent successfully!');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  return (
    <>
      <style>{STYLES}</style>
      <Header />
      <div className="min-h-screen" style={{ background: 'var(--cream)', fontFamily: "'Jost',sans-serif" }}>
        <div className="max-w-7xl mx-auto px-6 py-12 flex flex-col md:flex-row gap-10">
          <Sidebar variant="admin" />

          <main className="flex-1 min-w-0">
            <h1 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: '1.7rem', fontWeight: 600, color: 'var(--charcoal)', marginBottom: '4px' }}>Send Notification</h1>
            <p style={{ fontSize: '0.82rem', color: 'var(--muted)', marginBottom: '32px' }}>Broadcast announcements or alerts to your customers</p>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

              {/* Form */}
              <div className="lg:col-span-2 bg-white rounded-md p-6" style={{ border: '1px solid var(--border)' }}>

                {success && (
                  <div className="mb-5 px-4 py-3 rounded-sm flex items-center gap-2 text-sm" style={{ background: 'rgba(56,161,105,.1)', color: '#276749', border: '1px solid rgba(56,161,105,.25)' }}>
                    <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"/></svg>
                    {success}
                  </div>
                )}

                <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-5">

                  {/* Audience */}
                  <div>
                    <label className="field-label">Audience</label>
                    <div className="flex gap-2">
                      <button type="button" className={`type-btn${audience === 'all' ? ' active' : ''}`} onClick={() => setAudience('all')}>All Users</button>
                      <button type="button" className={`type-btn${audience === 'specific' ? ' active' : ''}`} onClick={() => setAudience('specific')}>Specific User</button>
                    </div>
                  </div>

                  {audience === 'specific' && (
                    <div>
                      <label className="field-label">User ID</label>
                      <input className="field-input" name="userId" value={form.userId} onChange={handleChange} placeholder="Paste user ID here" />
                    </div>
                  )}

                  {/* Type */}
                  <div>
                    <label className="field-label">Type</label>
                    <div className="flex gap-2">
                      {['info', 'promo', 'order'].map(t => (
                        <button key={t} type="button" className={`type-btn${form.type === t ? ' active' : ''}`} onClick={() => setForm(p => ({ ...p, type: t }))}>
                          {t}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Title */}
                  <div>
                    <label className="field-label">Title</label>
                    <input className={`field-input${errors.title ? ' has-error' : ''}`} name="title" value={form.title} onChange={handleChange} onBlur={handleBlur} placeholder="e.g. New Collection Arrived!" />
                    {errors.title && <p className="field-error">{errors.title}</p>}
                  </div>

                  {/* Message */}
                  <div>
                    <label className="field-label">Message</label>
                    <textarea className={`field-input${errors.message ? ' has-error' : ''}`} name="message" value={form.message} onChange={handleChange} onBlur={handleBlur} placeholder="Write your notification message…" rows={4} style={{ resize: 'vertical' }} />
                    <div className="flex justify-between items-center mt-1">
                      {errors.message ? <p className="field-error">{errors.message}</p> : <span />}
                      <span style={{ fontSize: '0.68rem', color: 'var(--muted)' }}>{form.message.length} chars</span>
                    </div>
                  </div>

                  {/* Preview */}
                  {(form.title || form.message) && (
                    <div style={{ background: 'var(--cream)', border: '1px solid var(--border)', borderRadius: '4px', padding: '14px 16px' }}>
                      <p style={{ fontSize: '0.65rem', color: 'var(--muted)', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '8px' }}>Preview</p>
                      <div className="flex items-start gap-3">
                        <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'rgba(107,27,42,.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                          <svg width="14" height="14" fill="none" stroke="var(--maroon)" strokeWidth="1.8" viewBox="0 0 24 24"><path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 01-3.46 0"/></svg>
                        </div>
                        <div>
                          <p style={{ fontSize: '0.82rem', fontWeight: 500, color: 'var(--charcoal)', marginBottom: '2px' }}>{form.title || 'Notification Title'}</p>
                          <p style={{ fontSize: '0.75rem', color: 'var(--muted)', lineHeight: 1.5 }}>{form.message || 'Your message will appear here.'}</p>
                        </div>
                      </div>
                    </div>
                  )}

                  <button type="submit" className="btn-primary" style={{ alignSelf: 'flex-start' }} disabled={loading}>
                    {loading ? 'Sending…' : 'Send Notification'}
                  </button>
                </form>
              </div>

              {/* History */}
              <div className="bg-white rounded-md p-6" style={{ border: '1px solid var(--border)' }}>
                <p style={{ fontSize: '0.78rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--charcoal)', fontWeight: 500, marginBottom: '16px' }}>Recent Sent</p>
                {history.length === 0 ? (
                  <p style={{ fontSize: '0.82rem', color: 'var(--muted)' }}>No notifications sent yet.</p>
                ) : history.map(n => {
                  const tc = TYPE_COLORS[n.type] || TYPE_COLORS.info;
                  return (
                    <div key={n._id} className="history-row">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1 flex-wrap">
                          <p style={{ fontSize: '0.82rem', fontWeight: 500, color: 'var(--charcoal)' }}>{n.title}</p>
                          <span style={{ fontSize: '0.62rem', padding: '2px 8px', borderRadius: '99px', background: tc.bg, color: tc.color, textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 500 }}>{n.type}</span>
                        </div>
                        <p style={{ fontSize: '0.72rem', color: 'var(--muted)', marginBottom: '2px' }}>{n.message}</p>
                        <p style={{ fontSize: '0.65rem', color: '#BBADA8' }}>{n.audience} · {n.sentAt}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </main>
        </div>
      </div>
    </>
  );
}