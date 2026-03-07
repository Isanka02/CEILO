import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Header from '../../components/layout/Header';
import Footer from '../../components/layout/Footer';


// import { loginUser } from '../../api/authApi';

// ─── Validators ───────────────────────────────────────────────────────────────
const isValidEmail = v => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim());

const validate = ({ email, password }) => {
  const errs = {};
  if (!email.trim())             errs.email    = 'Email is required.';
  else if (!isValidEmail(email)) errs.email    = 'Enter a valid email address (e.g. you@example.com).';
  if (!password)                 errs.password = 'Password is required.';
  return errs;
};

// ─── Shared styles ────────────────────────────────────────────────────────────
const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;600;700&family=Jost:wght@300;400;500&display=swap');
  :root { --maroon:#6B1B2A;--maroon-dark:#4A1019;--maroon-soft:#8B2535;--cream:#FAF7F4;--charcoal:#1C1C1E;--muted:#7A7A7A;--border:#E8E0D8; }
  .auth-input { width:100%;padding:11px 14px;font-family:'Jost',sans-serif;font-size:0.875rem;background:#fff;border:1px solid var(--border);border-radius:3px;color:var(--charcoal);outline:none;transition:border-color .2s,box-shadow .2s; }
  .auth-input:focus { border-color:var(--maroon);box-shadow:0 0 0 3px rgba(107,27,42,.08); }
  .auth-input::placeholder { color:#BBADA8; }
  .auth-input.has-error { border-color:#C53030 !important; }
  .auth-btn { width:100%;padding:13px;background:var(--maroon);color:#fff;border:none;border-radius:3px;font-family:'Jost',sans-serif;font-size:0.75rem;letter-spacing:0.15em;text-transform:uppercase;cursor:pointer;transition:background .2s; }
  .auth-btn:hover:not(:disabled) { background:var(--maroon-soft); }
  .auth-btn:disabled { opacity:.6;cursor:not-allowed; }
  .auth-panel-enter { animation:fadeUp .4s ease both; }
  @keyframes fadeUp { from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:translateY(0)} }
  .eye-btn { position:absolute;right:12px;top:50%;transform:translateY(-50%);background:none;border:none;cursor:pointer;color:var(--muted);padding:0;display:flex;align-items:center; }
  .field-error { display:flex;align-items:center;gap:4px;font-size:0.7rem;color:#C53030;margin-top:4px; }
`;

// ─── Reusable field error msg ─────────────────────────────────────────────────
const FieldError = ({ msg }) => msg ? (
  <p className="field-error">
    <svg width="11" height="11" fill="currentColor" viewBox="0 0 20 20">
      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd"/>
    </svg>
    {msg}
  </p>
) : null;

// ─── Eye toggle icon ──────────────────────────────────────────────────────────
const EyeIcon = ({ show }) => show
  ? <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24"><path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94"/><path d="M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
  : <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>;

export default function Login() {
  const navigate = useNavigate();
  const [form, setForm]         = useState({ email: '', password: '' });
  const [errors, setErrors]     = useState({});
  const [apiError, setApiError] = useState('');
  const [loading, setLoading]   = useState(false);
  const [showPwd, setShowPwd]   = useState(false);
  const [touched, setTouched]   = useState({});

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
    setApiError('');
    setTouched({ email: true, password: true });
    const errs = validate(form);
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setLoading(true);
    try {
      // const data = await loginUser(form);
      // saveToAuthContext(data);
      // navigate('/');
      console.log('Login payload:', form);
    } catch (err) {
      setApiError(err.response?.data?.message || 'Invalid credentials. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
    <Header />
      <style>{STYLES}</style>
      <div className="min-h-screen flex" style={{ background: 'var(--cream)', fontFamily: "'Jost',sans-serif" }}>

        {/* ── Decorative left panel ────────────────────────────────────── */}
        <div className="hidden lg:flex flex-col justify-between w-5/12 p-14 relative overflow-hidden" style={{ background: '#1A0810' }}>
          {/* IMAGE — replace /auth-visual.jpg with your chosen fashion image */}
          <img src="/auth-visual.jpg" alt="" style={{ position:'absolute',inset:0,width:'100%',height:'100%',objectFit:'cover',objectPosition:'center' }} />
          {/* Dark overlay so text stays readable over the image */}
          <div style={{ position:'absolute',inset:0,background:'linear-gradient(to bottom, rgba(26,8,16,0.55) 0%, rgba(26,8,16,0.45) 50%, rgba(26,8,16,0.75) 100%)' }} />
          <Link to="/" style={{ fontFamily:"'Cormorant Garamond',serif",fontSize:'1.8rem',fontWeight:600,color:'#fff',letterSpacing:'0.08em',zIndex:1 }}>CEILO</Link>
          <div style={{ zIndex:1 }}>
            <p style={{ fontFamily:"'Cormorant Garamond',serif",fontSize:'2.2rem',fontWeight:400,color:'#fff',lineHeight:1.35,marginBottom:'16px' }}>
              Style is a way to say who you are without having to speak.
            </p>
            <p style={{ fontSize:'0.75rem',color:'rgba(255,255,255,.45)',letterSpacing:'0.1em' }}>— Rachel Zoe</p>
          </div>
          <p style={{ fontSize:'0.72rem',color:'rgba(255,255,255,.3)',zIndex:1 }}>© {new Date().getFullYear()} CEILO</p>
        </div>

        {/* ── Form panel ───────────────────────────────────────────────── */}
        <div className="flex-1 flex items-center justify-center px-6 py-16">
          <div className="auth-panel-enter w-full max-w-sm">

            <Link to="/" className="lg:hidden block mb-10 text-center" style={{ fontFamily:"'Cormorant Garamond',serif",fontSize:'1.8rem',fontWeight:600,color:'var(--maroon)' }}>CEILO</Link>
            <h1 style={{ fontFamily:"'Cormorant Garamond',serif",fontSize:'1.9rem',fontWeight:600,color:'var(--charcoal)',marginBottom:'6px' }}>Welcome back</h1>
            <p style={{ fontSize:'0.82rem',color:'var(--muted)',marginBottom:'32px' }}>Sign in to your CEILO account</p>

            {/* API error */}
            {apiError && (
              <div className="mb-5 px-4 py-3 rounded-sm text-sm flex gap-2" style={{ background:'rgba(107,27,42,.08)',color:'var(--maroon)',border:'1px solid rgba(107,27,42,.2)' }}>
                <svg width="14" height="14" fill="currentColor" viewBox="0 0 20 20" style={{ marginTop:'1px',flexShrink:0 }}><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd"/></svg>
                {apiError}
              </div>
            )}

            <form onSubmit={handleSubmit} className="flex flex-col gap-4" noValidate>

              {/* Email */}
              <div className="flex flex-col gap-1.5">
                <label style={{ fontSize:'0.72rem',letterSpacing:'0.1em',textTransform:'uppercase',color:'var(--muted)' }}>Email Address</label>
                <input className={`auth-input${errors.email ? ' has-error' : ''}`} type="email" name="email" value={form.email} onChange={handleChange} onBlur={handleBlur} placeholder="you@example.com" autoComplete="email" />
                <FieldError msg={errors.email} />
              </div>

              {/* Password */}
              <div className="flex flex-col gap-1.5">
                <div className="flex items-center justify-between">
                  <label style={{ fontSize:'0.72rem',letterSpacing:'0.1em',textTransform:'uppercase',color:'var(--muted)' }}>Password</label>
                  <Link to="/forgot-password" style={{ fontSize:'0.75rem',color:'var(--maroon)',textDecoration:'none' }} onMouseEnter={e=>e.currentTarget.style.textDecoration='underline'} onMouseLeave={e=>e.currentTarget.style.textDecoration='none'}>Forgot password?</Link>
                </div>
                <div className="relative">
                  <input className={`auth-input${errors.password ? ' has-error' : ''}`} type={showPwd ? 'text' : 'password'} name="password" value={form.password} onChange={handleChange} onBlur={handleBlur} placeholder="••••••••" autoComplete="current-password" style={{ paddingRight:'42px' }} />
                  <button type="button" className="eye-btn" onClick={() => setShowPwd(p => !p)} tabIndex={-1}><EyeIcon show={showPwd} /></button>
                </div>
                <FieldError msg={errors.password} />
              </div>

              <button type="submit" className="auth-btn mt-1" disabled={loading}>
                {loading ? 'Signing in…' : 'Sign In'}
              </button>
            </form>

            <p className="mt-6 text-center" style={{ fontSize:'0.82rem',color:'var(--muted)' }}>
              Don't have an account?{' '}
              <Link to="/register" style={{ color:'var(--maroon)',fontWeight:500,textDecoration:'none' }} onMouseEnter={e=>e.currentTarget.style.textDecoration='underline'} onMouseLeave={e=>e.currentTarget.style.textDecoration='none'}>Create one</Link>
            </p>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}