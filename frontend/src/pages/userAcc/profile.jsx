import React, { useState, useRef } from 'react';
import Header from '../../components/layout/Header';
import Footer from '../../components/layout/Footer';
import Sidebar from '../../components/layout/Sidebar';
// import { getProfile, updateProfile } from '../../api/userApi';

const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;600;700&family=Jost:wght@300;400;500&display=swap');
  :root { --maroon:#6B1B2A;--maroon-dark:#4A1019;--maroon-soft:#8B2535;--cream:#FAF7F4;--charcoal:#1C1C1E;--muted:#7A7A7A;--border:#E8E0D8; }
  .field-label { font-size:0.72rem;letter-spacing:0.1em;text-transform:uppercase;color:var(--muted);margin-bottom:6px;display:block; }
  .field-input { width:100%;padding:10px 14px;font-family:'Jost',sans-serif;font-size:0.875rem;background:#fff;border:1px solid var(--border);border-radius:3px;color:var(--charcoal);outline:none;transition:border-color .2s,box-shadow .2s; }
  .field-input:focus { border-color:var(--maroon);box-shadow:0 0 0 3px rgba(107,27,42,.08); }
  .field-input:disabled { background:#F5F0ED;color:var(--muted);cursor:not-allowed; }
  .field-input::placeholder { color:#BBADA8; }
  .btn-primary { padding:10px 28px;background:var(--maroon);color:#fff;border:none;border-radius:3px;font-family:'Jost',sans-serif;font-size:0.75rem;letter-spacing:0.15em;text-transform:uppercase;cursor:pointer;transition:background .2s; }
  .btn-primary:hover:not(:disabled) { background:var(--maroon-soft); }
  .btn-primary:disabled { opacity:.6;cursor:not-allowed; }
  .btn-ghost { padding:10px 28px;background:transparent;color:var(--maroon);border:1px solid var(--maroon);border-radius:3px;font-family:'Jost',sans-serif;font-size:0.75rem;letter-spacing:0.15em;text-transform:uppercase;cursor:pointer;transition:all .2s; }
  .btn-ghost:hover { background:var(--maroon);color:#fff; }
  .avatar-ring { width:96px;height:96px;border-radius:50%;border:2px solid var(--border);overflow:hidden;background:#F0EAE5;display:flex;align-items:center;justify-content:center;flex-shrink:0; }
`;

export default function Profile() {
  // TODO: replace with real data from API / auth context
  const [user, setUser] = useState({ name: 'Jane Doe', email: 'jane@example.com', avatar: '' });
  const [form, setForm] = useState({ name: user.name });
  const [nameError, setNameError] = useState('');
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [avatarPreview, setAvatarPreview] = useState(user.avatar || '');
  const [avatarFile, setAvatarFile] = useState(null);
  const fileRef = useRef();

  const isValidName = v => v.trim().length >= 2 && /^[a-zA-Z\s'-]+$/.test(v.trim());

  const handleNameChange = e => {
    setForm({ name: e.target.value });
    if (nameError) setNameError('');
  };

  const handleAvatarChange = e => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) { alert('Image must be under 5MB.'); return; }
    setAvatarFile(file);
    setAvatarPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setSuccess('');
    if (!form.name.trim()) { setNameError('Name is required.'); return; }
    if (!isValidName(form.name)) { setNameError('Name must contain only letters, spaces, hyphens or apostrophes.'); return; }
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('name', form.name.trim());
      if (avatarFile) formData.append('avatar', avatarFile);
      // await updateProfile(formData);
      console.log('Update profile:', form.name);
      setUser(p => ({ ...p, name: form.name.trim() }));
      setEditing(false);
      setSuccess('Profile updated successfully.');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const initials = user.name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2);

  return (
    <>
      <style>{STYLES}</style>
      <Header />
      <div className="min-h-screen" style={{ background: 'var(--cream)', fontFamily: "'Jost',sans-serif" }}>
        <div className="max-w-6xl mx-auto px-6 py-12 flex flex-col md:flex-row gap-10">
          <Sidebar variant="user" />

          <main className="flex-1 min-w-0">
            <h1 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: '1.7rem', fontWeight: 600, color: 'var(--charcoal)', marginBottom: '4px' }}>My Profile</h1>
            <p style={{ fontSize: '0.82rem', color: 'var(--muted)', marginBottom: '32px' }}>Manage your personal information</p>

            {/* Success toast */}
            {success && (
              <div className="mb-6 px-4 py-3 rounded-sm flex items-center gap-2 text-sm" style={{ background: 'rgba(56,161,105,.1)', color: '#276749', border: '1px solid rgba(56,161,105,.25)' }}>
                <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"/></svg>
                {success}
              </div>
            )}

            {/* Avatar section */}
            <div className="flex items-center gap-6 mb-8 pb-8" style={{ borderBottom: '1px solid var(--border)' }}>
              <div className="avatar-ring">
                {avatarPreview
                  ? <img src={avatarPreview} alt="Avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  : <span style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: '1.5rem', fontWeight: 600, color: 'var(--maroon)' }}>{initials}</span>
                }
              </div>
              <div>
                {/* IMAGE: user avatar — circular, 96×96px, uploaded by user */}
                <p style={{ fontSize: '0.9rem', fontWeight: 500, color: 'var(--charcoal)', marginBottom: '4px' }}>{user.name}</p>
                <p style={{ fontSize: '0.78rem', color: 'var(--muted)', marginBottom: '12px' }}>{user.email}</p>
                {editing && (
                  <>
                    <input ref={fileRef} type="file" accept="image/*" onChange={handleAvatarChange} style={{ display: 'none' }} />
                    <button onClick={() => fileRef.current.click()} className="btn-ghost" style={{ padding: '6px 16px', fontSize: '0.7rem' }}>
                      Change Photo
                    </button>
                  </>
                )}
              </div>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} noValidate>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">

                <div>
                  <label className="field-label">Full Name</label>
                  <input
                    className="field-input"
                    type="text" value={form.name}
                    onChange={handleNameChange}
                    disabled={!editing}
                    placeholder="Your full name"
                    style={{ borderColor: nameError ? '#C53030' : '' }}
                  />
                  {nameError && <p style={{ fontSize: '0.7rem', color: '#C53030', marginTop: '4px' }}>{nameError}</p>}
                </div>

                <div>
                  <label className="field-label">Email Address</label>
                  <input className="field-input" type="email" value={user.email} disabled />
                  <p style={{ fontSize: '0.7rem', color: 'var(--muted)', marginTop: '4px' }}>Email cannot be changed.</p>
                </div>

                <div>
                  <label className="field-label">Account Role</label>
                  <input className="field-input" value={user.role === 'admin' ? 'Administrator' : 'Customer'} disabled />
                </div>

                <div>
                  <label className="field-label">Member Since</label>
                  <input className="field-input" value={
                    // TODO: replace with real date from user object e.g. new Date(user.createdAt).toLocaleDateString()
                    'March 2025'
                  } disabled />
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-3">
                {!editing ? (
                  <button type="button" className="btn-primary" onClick={() => setEditing(true)}>Edit Profile</button>
                ) : (
                  <>
                    <button type="submit" className="btn-primary" disabled={loading}>{loading ? 'Saving…' : 'Save Changes'}</button>
                    <button type="button" className="btn-ghost" onClick={() => { setEditing(false); setForm({ name: user.name }); setAvatarPreview(user.avatar || ''); setAvatarFile(null); setNameError(''); }}>Cancel</button>
                  </>
                )}
              </div>
            </form>
          </main>
        </div>
      </div>
      <Footer />
    </>
  );
}