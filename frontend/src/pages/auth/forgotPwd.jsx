import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { forgotPassword } from '../../api/authApi'; // ← connect your API file

export default function ForgotPwd() {
  const [email, setEmail]     = useState('');
  const [sent, setSent]       = useState(false);
  const [error, setError]     = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async e => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      // await forgotPassword({ email });
      console.log('Forgot password for:', email);
      setSent(true);
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

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

          <Link to="/" className="block mb-10 text-center" style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '1.8rem', fontWeight: 600, color: 'var(--maroon)' }}>
            CEILO
          </Link>

          {!sent ? (
            <>
              {/* Icon */}
              <div className="flex justify-center mb-6">
                <div className="w-14 h-14 rounded-full flex items-center justify-center"
                  style={{ background: 'rgba(107,27,42,0.08)' }}>
                  <svg width="24" height="24" fill="none" stroke="#6B1B2A" strokeWidth="1.8" viewBox="0 0 24 24">
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                    <path d="M7 11V7a5 5 0 0110 0v4"/>
                  </svg>
                </div>
              </div>

              <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '1.9rem', fontWeight: 600, color: 'var(--charcoal)', marginBottom: '6px', textAlign: 'center' }}>
                Forgot your password?
              </h1>
              <p style={{ fontSize: '0.82rem', color: 'var(--muted)', marginBottom: '32px', textAlign: 'center', lineHeight: 1.7 }}>
                No worries. Enter your email and we'll send you a reset link valid for 15 minutes.
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
                    Email Address
                  </label>
                  <input
                    className="auth-input" type="email"
                    value={email} onChange={e => setEmail(e.target.value)}
                    placeholder="you@example.com" required autoComplete="email"
                  />
                </div>
                <button type="submit" className="auth-btn mt-2" disabled={loading}>
                  {loading ? 'Sending…' : 'Send Reset Link'}
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
                Check your inbox
              </h2>
              <p style={{ fontSize: '0.82rem', color: 'var(--muted)', lineHeight: 1.8, marginBottom: '28px' }}>
                If <strong style={{ color: 'var(--charcoal)' }}>{email}</strong> is registered with CEILO, you'll receive a password reset link shortly.
              </p>
              <p style={{ fontSize: '0.75rem', color: 'var(--muted)' }}>
                Didn't get it?{' '}
                <button onClick={() => setSent(false)}
                  style={{ color: 'var(--maroon)', fontWeight: 500, background: 'none', border: 'none', cursor: 'pointer', fontFamily: "'Jost', sans-serif" }}>
                  Try again
                </button>
              </p>
            </div>
          )}

          <p className="mt-8 text-center" style={{ fontSize: '0.82rem', color: 'var(--muted)' }}>
            <Link to="/login" className="inline-flex items-center gap-1.5"
              style={{ color: 'var(--maroon)', textDecoration: 'none', fontWeight: 500 }}>
              <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path d="M19 12H5M12 19l-7-7 7-7"/>
              </svg>
              Back to Sign In
            </Link>
          </p>
        </div>
      </div>
    </>
  );
}