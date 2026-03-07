import React, { useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
// import { resetPassword } from '../../api/authApi'; // ← connect your API file

export default function ResetPwd() {
  const { token }              = useParams();
  const navigate               = useNavigate();
  const [form, setForm]        = useState({ password: '', confirm: '' });
  const [showPwd, setShowPwd]  = useState(false);
  const [done, setDone]        = useState(false);
  const [error, setError]      = useState('');
  const [loading, setLoading]  = useState(false);

  const handleChange = e => setForm(p => ({ ...p, [e.target.name]: e.target.value }));

  const handleSubmit = async e => {
    e.preventDefault();
    setError('');
    if (form.password !== form.confirm) {
      setError('Passwords do not match.');
      return;
    }
    setLoading(true);
    try {
      // await resetPassword(token, { password: form.password });
      console.log('Reset password with token:', token);
      setDone(true);
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid or expired reset link.');
    } finally {
      setLoading(false);
    }
  };

  const strength = (() => {
    const p = form.password;
    if (!p) return 0;
    let s = 0;
    if (p.length >= 6)               s++;
    if (p.length >= 10)              s++;
    if (/[A-Z]/.test(p))            s++;
    if (/[0-9]/.test(p))            s++;
    if (/[^A-Za-z0-9]/.test(p))     s++;
    return s;
  })();
  const strengthColor = ['', '#E53E3E', '#DD6B20', '#D69E2E', '#38A169', '#276749'][strength];
  const strengthLabel = ['', 'Weak', 'Fair', 'Good', 'Strong', 'Very Strong'][strength];

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;600;700&family=Jost:wght@300;400;500&display=swap');
        :root {
          --maroon: #6B1B2A; --maroon-dark: #4A1019; --maroon-soft: #8B2535;
          --cream: #FAF7F4; --charcoal: #1C1C1E; --muted: #7A7A7A; --border: #E8E0D8;
        }
        .auth-input {
          width: 100%; padding: 11px 14px;
          font-family: 'Jost', sans-serif; font-size: 0.875rem;
          background: #fff; border: 1px solid var(--border); border-radius: 3px;
          color: var(--charcoal); outline: none;
          transition: border-color 0.2s, box-shadow 0.2s;
        }
        .auth-input:focus { border-color: var(--maroon); box-shadow: 0 0 0 3px rgba(107,27,42,0.08); }
        .auth-input::placeholder { color: #BBADA8; }
        .auth-btn {
          width: 100%; padding: 13px; background: var(--maroon); color: #fff;
          border: none; border-radius: 3px; font-family: 'Jost', sans-serif;
          font-size: 0.75rem; letter-spacing: 0.15em; text-transform: uppercase;
          cursor: pointer; transition: background 0.2s;
        }
        .auth-btn:hover:not(:disabled) { background: var(--maroon-soft); }
        .auth-btn:disabled { opacity: 0.6; cursor: not-allowed; }
        .auth-panel-enter { animation: fadeUp 0.4s ease both; }
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(16px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>

      <div className="min-h-screen flex items-center justify-center px-6 py-16"
        style={{ background: 'var(--cream)', fontFamily: "'Jost', sans-serif" }}>

        <div className="auth-panel-enter w-full max-w-sm">

          <Link to="/" className="block mb-10 text-center"
            style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '1.8rem', fontWeight: 600, color: 'var(--maroon)' }}>
            CEILO
          </Link>

          {!done ? (
            <>
              <div className="flex justify-center mb-6">
                <div className="w-14 h-14 rounded-full flex items-center justify-center"
                  style={{ background: 'rgba(107,27,42,0.08)' }}>
                  <svg width="24" height="24" fill="none" stroke="#6B1B2A" strokeWidth="1.8" viewBox="0 0 24 24">
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                  </svg>
                </div>
              </div>

              <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '1.9rem', fontWeight: 600, color: 'var(--charcoal)', marginBottom: '6px', textAlign: 'center' }}>
                Set new password
              </h1>
              <p style={{ fontSize: '0.82rem', color: 'var(--muted)', marginBottom: '32px', textAlign: 'center', lineHeight: 1.7 }}>
                Choose a strong password for your CEILO account.
              </p>

              {error && (
                <div className="mb-5 px-4 py-3 rounded-sm text-sm"
                  style={{ background: 'rgba(107,27,42,0.08)', color: 'var(--maroon)', border: '1px solid rgba(107,27,42,0.2)' }}>
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="flex flex-col gap-4">

                <div className="flex flex-col gap-1.5">
                  <label style={{ fontSize: '0.72rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--muted)' }}>
                    New Password
                  </label>
                  <div className="relative">
                    <input
                      className="auth-input"
                      type={showPwd ? 'text' : 'password'}
                      name="password" value={form.password}
                      onChange={handleChange}
                      placeholder="Min. 6 characters" required
                      style={{ paddingRight: '42px' }}
                    />
                    <button type="button" onClick={() => setShowPwd(p => !p)} tabIndex={-1}
                      style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--muted)', padding: 0 }}>
                      {showPwd ? (
                        <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
                          <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94"/><path d="M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19"/><line x1="1" y1="1" x2="23" y2="23"/>
                        </svg>
                      ) : (
                        <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
                          <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>
                        </svg>
                      )}
                    </button>
                  </div>
                  {form.password && (
                    <div>
                      <div className="flex gap-1 mt-1.5">
                        {[1,2,3,4,5].map(i => (
                          <div key={i} className="h-1 flex-1 rounded-full transition-all duration-300"
                            style={{ background: i <= strength ? strengthColor : '#E8E0D8' }} />
                        ))}
                      </div>
                      <p style={{ fontSize: '0.7rem', color: strengthColor, marginTop: '4px' }}>{strengthLabel}</p>
                    </div>
                  )}
                </div>

                <div className="flex flex-col gap-1.5">
                  <label style={{ fontSize: '0.72rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--muted)' }}>
                    Confirm Password
                  </label>
                  <input
                    className="auth-input" type="password" name="confirm"
                    value={form.confirm} onChange={handleChange}
                    placeholder="••••••••" required
                    style={{ borderColor: form.confirm && form.confirm !== form.password ? '#E53E3E' : '' }}
                  />
                  {form.confirm && form.confirm !== form.password && (
                    <p style={{ fontSize: '0.72rem', color: '#E53E3E' }}>Passwords don't match</p>
                  )}
                </div>

                <button type="submit" className="auth-btn mt-2" disabled={loading}>
                  {loading ? 'Resetting…' : 'Reset Password'}
                </button>
              </form>
            </>
          ) : (
            /* ── Success state ────────────────────────────────────────── */
            <div className="text-center">
              <div className="flex justify-center mb-6">
                <div className="w-14 h-14 rounded-full flex items-center justify-center"
                  style={{ background: 'rgba(56,161,105,0.1)' }}>
                  <svg width="24" height="24" fill="none" stroke="#38A169" strokeWidth="2" viewBox="0 0 24 24">
                    <polyline points="20 6 9 17 4 12"/>
                  </svg>
                </div>
              </div>
              <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '1.7rem', fontWeight: 600, color: 'var(--charcoal)', marginBottom: '10px' }}>
                Password updated!
              </h2>
              <p style={{ fontSize: '0.82rem', color: 'var(--muted)', lineHeight: 1.8, marginBottom: '28px' }}>
                Your password has been reset successfully. You can now sign in with your new password.
              </p>
              <button
                onClick={() => navigate('/login')}
                className="auth-btn"
                style={{ maxWidth: '200px', margin: '0 auto', display: 'block' }}
              >
                Sign In
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
}