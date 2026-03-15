import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Header from '../../components/layout/Header';
import Footer from '../../components/layout/Footer';    
import { registerUser } from '../../api/authApi';



// ─── Validators ───────────────────────────────────────────────────────────────
const isValidEmail = v => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim());
const isValidName  = v => v.trim().length >= 2 && /^[a-zA-Z\s'-]+$/.test(v.trim());

const validate = ({ name, email, password, confirm }) => {
  const errs = {};
  if (!name.trim())              errs.name     = 'Full name is required.';
  else if (!isValidName(name))   errs.name     = 'Name must be at least 2 letters and contain only letters, spaces, hyphens or apostrophes.';
  if (!email.trim())             errs.email    = 'Email is required.';
  else if (!isValidEmail(email)) errs.email    = 'Enter a valid email address (e.g. you@example.com).';
  if (!password)                 errs.password = 'Password is required.';
  else if (password.length < 6)  errs.password = 'Password must be at least 6 characters.';
  if (!confirm)                  errs.confirm  = 'Please confirm your password.';
  else if (confirm !== password) errs.confirm  = 'Passwords do not match.';
  return errs;
};

const getStrength = p => {
  if (!p) return { score: 0, label: '', color: '' };
  let s = 0;
  if (p.length >= 6)               s++;
  if (p.length >= 10)              s++;
  if (/[A-Z]/.test(p))            s++;
  if (/[0-9]/.test(p))            s++;
  if (/[^A-Za-z0-9]/.test(p))     s++;
  const labels = ['','Weak','Fair','Good','Strong','Very Strong'];
  const colors = ['','#C53030','#DD6B20','#D69E2E','#38A169','#276749'];
  return { score: s, label: labels[s], color: colors[s] };
};

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
  .field-error { display:flex;align-items:flex-start;gap:4px;font-size:0.7rem;color:#C53030;margin-top:4px; }
  .field-hint  { font-size:0.7rem;color:var(--muted);margin-top:4px; }
`;

const FieldError = ({ msg }) => msg ? (
  <p className="field-error">
    <svg width="11" height="11" fill="currentColor" viewBox="0 0 20 20" style={{ flexShrink:0,marginTop:'1px' }}>
      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd"/>
    </svg>
    {msg}
  </p>
) : null;

const EyeIcon = ({ show }) => show
  ? <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24"><path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94"/><path d="M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
  : <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>;

export default function Register() {
  const navigate = useNavigate();
  const [form, setForm]         = useState({ name:'', email:'', password:'', confirm:'' });
  const [errors, setErrors]     = useState({});
  const [apiError, setApiError] = useState('');
  const [loading, setLoading]   = useState(false);
  const [showPwd, setShowPwd]   = useState(false);
  const [touched, setTouched]   = useState({});

  const strength = getStrength(form.password);

  const handleChange = e => {
    const { name, value } = e.target;
    setForm(p => ({ ...p, [name]: value }));
    if (touched[name]) {
      const errs = validate({ ...form, [name]: value });
      setErrors(p => ({ ...p, [name]: errs[name] || '' }));
    }
    // live confirm check when password changes
    if (name === 'password' && touched.confirm) {
      setErrors(p => ({ ...p, confirm: value !== form.confirm ? 'Passwords do not match.' : '' }));
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
    setTouched({ name:true, email:true, password:true, confirm:true });
    const errs = validate(form);
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setLoading(true);
    try {
      // const data = await registerUser({ name: form.name, email: form.email, password: form.password });
      // saveToAuthContext(data);
      // navigate('/');
      console.log('Register payload:', { name: form.name, email: form.email });
    } catch (err) {
      setApiError(err.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
    <Header /> 
      <style>{STYLES}</style>
      <div className="min-h-screen flex" style={{ background:'var(--cream)',fontFamily:"'Jost',sans-serif" }}>

        {/* Decorative panel */}
        <div className="hidden lg:flex flex-col justify-between w-5/12 p-14 relative overflow-hidden" style={{ background: '#1A0810' }}>
          {/* IMAGE — replace /auth-visual-2.jpg with your chosen fashion image */}
          <img src="/auth-visual-2.jpg" alt="" style={{ position:'absolute',inset:0,width:'100%',height:'100%',objectFit:'cover',objectPosition:'center' }} />
          <div style={{ position:'absolute',inset:0,background:'linear-gradient(to bottom, rgba(26,8,16,0.55) 0%, rgba(26,8,16,0.45) 50%, rgba(26,8,16,0.75) 100%)' }} />
          <Link to="/" style={{ fontFamily:"'Cormorant Garamond',serif",fontSize:'1.8rem',fontWeight:600,color:'#fff',letterSpacing:'0.08em',zIndex:1 }}>CEILO</Link>
          <div style={{ zIndex:1 }}>
            <p style={{ fontFamily:"'Cormorant Garamond',serif",fontSize:'2.2rem',fontWeight:400,color:'#fff',lineHeight:1.35,marginBottom:'16px' }}>
              Fashion is the armor to survive the reality of everyday life.
            </p>
            <p style={{ fontSize:'0.75rem',color:'rgba(255,255,255,.45)',letterSpacing:'0.1em' }}>— Bill Cunningham</p>
          </div>
          <p style={{ fontSize:'0.72rem',color:'rgba(255,255,255,.3)',zIndex:1 }}>© {new Date().getFullYear()} CEILO</p>
        </div>

        {/* Form panel */}
        <div className="flex-1 flex items-center justify-center px-6 py-16">
          <div className="auth-panel-enter w-full max-w-sm">

            <Link to="/" className="lg:hidden block mb-10 text-center" style={{ fontFamily:"'Cormorant Garamond',serif",fontSize:'1.8rem',fontWeight:600,color:'var(--maroon)' }}>CEILO</Link>
            <h1 style={{ fontFamily:"'Cormorant Garamond',serif",fontSize:'1.9rem',fontWeight:600,color:'var(--charcoal)',marginBottom:'6px' }}>Create account</h1>
            <p style={{ fontSize:'0.82rem',color:'var(--muted)',marginBottom:'32px' }}>Join CEILO and discover curated fashion</p>

            {apiError && (
              <div className="mb-5 px-4 py-3 rounded-sm text-sm flex gap-2" style={{ background:'rgba(107,27,42,.08)',color:'var(--maroon)',border:'1px solid rgba(107,27,42,.2)' }}>
                <svg width="14" height="14" fill="currentColor" viewBox="0 0 20 20" style={{ marginTop:'1px',flexShrink:0 }}><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd"/></svg>
                {apiError}
              </div>
            )}

            <form onSubmit={handleSubmit} className="flex flex-col gap-4" noValidate>

              {/* Name */}
              <div className="flex flex-col gap-1.5">
                <label style={{ fontSize:'0.72rem',letterSpacing:'0.1em',textTransform:'uppercase',color:'var(--muted)' }}>Full Name</label>
                <input className={`auth-input${errors.name ? ' has-error':''}`} type="text" name="name" value={form.name} onChange={handleChange} onBlur={handleBlur} placeholder="Jane Doe" autoComplete="name" />
                <FieldError msg={errors.name} />
              </div>

              {/* Email */}
              <div className="flex flex-col gap-1.5">
                <label style={{ fontSize:'0.72rem',letterSpacing:'0.1em',textTransform:'uppercase',color:'var(--muted)' }}>Email Address</label>
                <input className={`auth-input${errors.email ? ' has-error':''}`} type="email" name="email" value={form.email} onChange={handleChange} onBlur={handleBlur} placeholder="you@example.com" autoComplete="email" />
                <FieldError msg={errors.email} />
              </div>

              {/* Password */}
              <div className="flex flex-col gap-1.5">
                <label style={{ fontSize:'0.72rem',letterSpacing:'0.1em',textTransform:'uppercase',color:'var(--muted)' }}>Password</label>
                <div className="relative">
                  <input className={`auth-input${errors.password ? ' has-error':''}`} type={showPwd ? 'text':'password'} name="password" value={form.password} onChange={handleChange} onBlur={handleBlur} placeholder="Min. 6 characters" autoComplete="new-password" style={{ paddingRight:'42px' }} />
                  <button type="button" className="eye-btn" onClick={() => setShowPwd(p => !p)} tabIndex={-1}><EyeIcon show={showPwd} /></button>
                </div>
                {/* Strength bar */}
                {form.password && (
                  <>
                    <div className="flex gap-1 mt-1">
                      {[1,2,3,4,5].map(i => (
                        <div key={i} style={{ height:'3px',flex:1,borderRadius:'99px',background: i <= strength.score ? strength.color : '#E8E0D8',transition:'background .3s' }} />
                      ))}
                    </div>
                    <p style={{ fontSize:'0.7rem',color: strength.color }}>{strength.label}</p>
                  </>
                )}
                {/* Rules hint — shown before user types */}
                {!form.password && (
                  <p className="field-hint">Must be at least 6 characters. Use uppercase, numbers & symbols for a stronger password.</p>
                )}
                <FieldError msg={errors.password} />
              </div>

              {/* Confirm */}
              <div className="flex flex-col gap-1.5">
                <label style={{ fontSize:'0.72rem',letterSpacing:'0.1em',textTransform:'uppercase',color:'var(--muted)' }}>Confirm Password</label>
                <input className={`auth-input${errors.confirm ? ' has-error':''}`} type="password" name="confirm" value={form.confirm} onChange={handleChange} onBlur={handleBlur} placeholder="••••••••" autoComplete="new-password" />
                <FieldError msg={errors.confirm} />
              </div>

              <button type="submit" className="auth-btn mt-1" disabled={loading}>
                {loading ? 'Creating account…' : 'Create Account'}
              </button>
            </form>

            <p className="mt-6 text-center" style={{ fontSize:'0.82rem',color:'var(--muted)' }}>
              Already have an account?{' '}
              <Link to="/login" style={{ color:'var(--maroon)',fontWeight:500,textDecoration:'none' }} onMouseEnter={e=>e.currentTarget.style.textDecoration='underline'} onMouseLeave={e=>e.currentTarget.style.textDecoration='none'}>Sign in</Link>
            </p>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}