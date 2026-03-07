import React, { useState } from 'react';
import Header from '../../components/layout/Header';
import Footer from '../../components/layout/Footer';
import Sidebar from '../../components/layout/Sidebar';
// import { getProfile, addAddress, deleteAddress } from '../../api/userApi';

const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;600;700&family=Jost:wght@300;400;500&display=swap');
  :root { --maroon:#6B1B2A;--maroon-dark:#4A1019;--maroon-soft:#8B2535;--cream:#FAF7F4;--charcoal:#1C1C1E;--muted:#7A7A7A;--border:#E8E0D8; }
  .field-label { font-size:0.72rem;letter-spacing:0.1em;text-transform:uppercase;color:var(--muted);margin-bottom:6px;display:block; }
  .field-input { width:100%;padding:10px 14px;font-family:'Jost',sans-serif;font-size:0.875rem;background:#fff;border:1px solid var(--border);border-radius:3px;color:var(--charcoal);outline:none;transition:border-color .2s,box-shadow .2s; }
  .field-input:focus { border-color:var(--maroon);box-shadow:0 0 0 3px rgba(107,27,42,.08); }
  .field-input.has-error { border-color:#C53030 !important; }
  .field-input::placeholder { color:#BBADA8; }
  .btn-primary { padding:10px 24px;background:var(--maroon);color:#fff;border:none;border-radius:3px;font-family:'Jost',sans-serif;font-size:0.75rem;letter-spacing:0.15em;text-transform:uppercase;cursor:pointer;transition:background .2s; }
  .btn-primary:hover:not(:disabled) { background:var(--maroon-soft); }
  .btn-primary:disabled { opacity:.6;cursor:not-allowed; }
  .btn-ghost { padding:10px 24px;background:transparent;color:var(--maroon);border:1px solid var(--maroon);border-radius:3px;font-family:'Jost',sans-serif;font-size:0.75rem;letter-spacing:0.15em;text-transform:uppercase;cursor:pointer;transition:all .2s; }
  .btn-ghost:hover { background:var(--maroon);color:#fff; }
  .address-card { background:#fff;border:1px solid var(--border);border-radius:4px;padding:20px;transition:border-color .2s; }
  .address-card:hover { border-color:#C4A8A8; }
  .field-error { font-size:0.7rem;color:#C53030;margin-top:4px; }
`;

const emptyForm = { label: '', street: '', city: '', state: '', zip: '', country: '' };

const validate = f => {
  const e = {};
  if (!f.street.trim())  e.street  = 'Street is required.';
  if (!f.city.trim())    e.city    = 'City is required.';
  if (!f.zip.trim())     e.zip     = 'ZIP code is required.';
  else if (!/^[A-Za-z0-9\s\-]{3,10}$/.test(f.zip.trim())) e.zip = 'Enter a valid ZIP code.';
  if (!f.country.trim()) e.country = 'Country is required.';
  return e;
};

export default function Addresses() {
  // TODO: replace with real data fetched from API on mount
  const [addresses, setAddresses] = useState([
    { _id: '1', label: 'Home', street: '123 Elm Street', city: 'Colombo', state: 'Western', zip: '00100', country: 'Sri Lanka' },
  ]);
  const [showForm, setShowForm]   = useState(false);
  const [form, setForm]           = useState(emptyForm);
  const [errors, setErrors]       = useState({});
  const [loading, setLoading]     = useState(false);
  const [touched, setTouched]     = useState({});
  const [deleteId, setDeleteId]   = useState(null);

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

  const handleAdd = async e => {
    e.preventDefault();
    setTouched({ street: true, city: true, zip: true, country: true });
    const errs = validate(form);
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setLoading(true);
    try {
      // const updated = await addAddress(form);
      // setAddresses(updated);
      const newAddr = { ...form, _id: Date.now().toString() };
      setAddresses(p => [...p, newAddr]);
      setForm(emptyForm); setErrors({}); setTouched({}); setShowForm(false);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  const handleDelete = async id => {
    try {
      // await deleteAddress(id);
      setAddresses(p => p.filter(a => a._id !== id));
    } catch (err) { console.error(err); }
    finally { setDeleteId(null); }
  };

  return (
    <>
      <style>{STYLES}</style>
      <Header />
      <div className="min-h-screen" style={{ background: 'var(--cream)', fontFamily: "'Jost',sans-serif" }}>
        <div className="max-w-6xl mx-auto px-6 py-12 flex flex-col md:flex-row gap-10">
          <Sidebar variant="user" />

          <main className="flex-1 min-w-0">
            <div className="flex items-center justify-between mb-2">
              <h1 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: '1.7rem', fontWeight: 600, color: 'var(--charcoal)' }}>My Addresses</h1>
              {!showForm && (
                <button className="btn-primary" style={{ padding: '8px 18px' }} onClick={() => setShowForm(true)}>+ Add New</button>
              )}
            </div>
            <p style={{ fontSize: '0.82rem', color: 'var(--muted)', marginBottom: '32px' }}>Manage your saved delivery addresses</p>

            {/* Address cards */}
            {addresses.length === 0 && !showForm && (
              <div className="text-center py-16" style={{ border: '1px dashed var(--border)', borderRadius: '4px' }}>
                <svg width="36" height="36" fill="none" stroke="#C4B5B8" strokeWidth="1.5" viewBox="0 0 24 24" style={{ margin: '0 auto 12px' }}>
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/>
                </svg>
                <p style={{ fontSize: '0.85rem', color: 'var(--muted)' }}>No saved addresses yet.</p>
                <button className="btn-primary mt-4" style={{ padding: '8px 20px' }} onClick={() => setShowForm(true)}>Add Address</button>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              {addresses.map(addr => (
                <div key={addr._id} className="address-card">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <svg width="14" height="14" fill="none" stroke="var(--maroon)" strokeWidth="1.8" viewBox="0 0 24 24">
                        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/>
                      </svg>
                      <span style={{ fontSize: '0.78rem', fontWeight: 500, color: 'var(--charcoal)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                        {addr.label || 'Address'}
                      </span>
                    </div>
                    <button onClick={() => setDeleteId(addr._id)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#C4B5B8', padding: 0 }}
                      onMouseEnter={e => e.currentTarget.style.color = '#C53030'} onMouseLeave={e => e.currentTarget.style.color = '#C4B5B8'}>
                      <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
                        <polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/><path d="M10 11v6M14 11v6"/><path d="M9 6V4h6v2"/>
                      </svg>
                    </button>
                  </div>
                  <p style={{ fontSize: '0.85rem', color: 'var(--charcoal)', lineHeight: 1.7 }}>
                    {addr.street}<br />
                    {addr.city}{addr.state ? `, ${addr.state}` : ''} {addr.zip}<br />
                    {addr.country}
                  </p>
                </div>
              ))}
            </div>

            {/* Delete confirm */}
            {deleteId && (
              <div className="fixed inset-0 z-50 flex items-center justify-center" style={{ background: 'rgba(0,0,0,0.4)' }}>
                <div className="bg-white rounded-md p-8 max-w-sm w-full mx-4 shadow-xl">
                  <h3 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: '1.3rem', fontWeight: 600, color: 'var(--charcoal)', marginBottom: '8px' }}>Delete address?</h3>
                  <p style={{ fontSize: '0.82rem', color: 'var(--muted)', marginBottom: '24px' }}>This address will be permanently removed from your account.</p>
                  <div className="flex gap-3">
                    <button className="btn-primary" style={{ background: '#C53030' }} onClick={() => handleDelete(deleteId)}>Delete</button>
                    <button className="btn-ghost" onClick={() => setDeleteId(null)}>Cancel</button>
                  </div>
                </div>
              </div>
            )}

            {/* Add address form */}
            {showForm && (
              <div className="bg-white rounded-md p-6" style={{ border: '1px solid var(--border)' }}>
                <h2 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: '1.2rem', fontWeight: 600, color: 'var(--charcoal)', marginBottom: '20px' }}>New Address</h2>
                <form onSubmit={handleAdd} noValidate>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-6">

                    <div className="md:col-span-2">
                      <label className="field-label">Label <span style={{ color: 'var(--muted)', textTransform: 'none', letterSpacing: 0 }}>(optional — e.g. Home, Office)</span></label>
                      <input className="field-input" name="label" value={form.label} onChange={handleChange} placeholder="Home" />
                    </div>

                    <div className="md:col-span-2">
                      <label className="field-label">Street Address</label>
                      <input className={`field-input${errors.street ? ' has-error' : ''}`} name="street" value={form.street} onChange={handleChange} onBlur={handleBlur} placeholder="123 Main Street" />
                      {errors.street && <p className="field-error">{errors.street}</p>}
                    </div>

                    <div>
                      <label className="field-label">City</label>
                      <input className={`field-input${errors.city ? ' has-error' : ''}`} name="city" value={form.city} onChange={handleChange} onBlur={handleBlur} placeholder="Colombo" />
                      {errors.city && <p className="field-error">{errors.city}</p>}
                    </div>

                    <div>
                      <label className="field-label">State / Province <span style={{ color: 'var(--muted)', textTransform: 'none', letterSpacing: 0 }}>(optional)</span></label>
                      <input className="field-input" name="state" value={form.state} onChange={handleChange} placeholder="Western" />
                    </div>

                    <div>
                      <label className="field-label">ZIP / Postal Code</label>
                      <input className={`field-input${errors.zip ? ' has-error' : ''}`} name="zip" value={form.zip} onChange={handleChange} onBlur={handleBlur} placeholder="00100" />
                      {errors.zip && <p className="field-error">{errors.zip}</p>}
                    </div>

                    <div>
                      <label className="field-label">Country</label>
                      <input className={`field-input${errors.country ? ' has-error' : ''}`} name="country" value={form.country} onChange={handleChange} onBlur={handleBlur} placeholder="Sri Lanka" />
                      {errors.country && <p className="field-error">{errors.country}</p>}
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <button type="submit" className="btn-primary" disabled={loading}>{loading ? 'Saving…' : 'Save Address'}</button>
                    <button type="button" className="btn-ghost" onClick={() => { setShowForm(false); setForm(emptyForm); setErrors({}); setTouched({}); }}>Cancel</button>
                  </div>
                </form>
              </div>
            )}
          </main>
        </div>
      </div>
      <Footer />
    </>
  );
}