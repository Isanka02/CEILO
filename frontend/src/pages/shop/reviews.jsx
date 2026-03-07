import React, { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import Header from '../../components/layout/Header';
import Footer from '../../components/layout/Footer';
// import { getReviews, addReview } from '../../api/productApi';
// import { getProductBySlug } from '../../api/productApi';

const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;600;700&family=Jost:wght@300;400;500&display=swap');
  :root { --maroon:#6B1B2A;--maroon-dark:#4A1019;--maroon-soft:#8B2535;--cream:#FAF7F4;--charcoal:#1C1C1E;--muted:#7A7A7A;--border:#E8E0D8; }
  .review-card { background:#fff;border:1px solid var(--border);border-radius:4px;padding:24px;transition:border-color .2s; }
  .review-card:hover { border-color:#C4A8A8; }
  .avatar { width:40px;height:40px;border-radius:50%;background:rgba(107,27,42,.1);display:flex;align-items:center;justify-content:center;font-family:'Cormorant Garamond',serif;font-size:0.95rem;font-weight:600;color:var(--maroon);flex-shrink:0; }
  .field-input { width:100%;padding:10px 14px;font-family:'Jost',sans-serif;font-size:0.875rem;background:#fff;border:1px solid var(--border);border-radius:3px;color:var(--charcoal);outline:none;transition:border-color .2s,box-shadow .2s; }
  .field-input:focus { border-color:var(--maroon);box-shadow:0 0 0 3px rgba(107,27,42,.08); }
  .field-input.has-error { border-color:#C53030 !important; }
  .field-input::placeholder { color:#BBADA8; }
  .field-error { font-size:0.7rem;color:#C53030;margin-top:4px; }
  .btn-primary { padding:11px 28px;background:var(--maroon);color:#fff;border:none;border-radius:3px;font-family:'Jost',sans-serif;font-size:0.75rem;letter-spacing:0.15em;text-transform:uppercase;cursor:pointer;transition:background .2s; }
  .btn-primary:hover:not(:disabled) { background:var(--maroon-soft); }
  .btn-primary:disabled { opacity:.6;cursor:not-allowed; }
  .star-btn { background:none;border:none;cursor:pointer;padding:2px;transition:transform .15s; }
  .star-btn:hover { transform:scale(1.15); }
`;

// TODO: replace with real data
const MOCK_PRODUCT = { _id:'p1', name:'Silk Draped Blouse', slug:'silk-draped-blouse', price:89, discountPrice:69, images:[''], averageRating:4.8, numReviews:12, category:{ name:'Tops' } };
const MOCK_REVIEWS = [
  { _id:'rv1', user:{ name:'Amara S.',  avatar:'' }, rating:5, comment:'Absolutely beautiful. The silk is incredibly soft and the drape is perfect. Already ordered in another color!', createdAt:'2026-02-28' },
  { _id:'rv2', user:{ name:'Priya M.',  avatar:'' }, rating:5, comment:'Fits true to size. Elegant and versatile — wore it to a dinner and received so many compliments.', createdAt:'2026-02-20' },
  { _id:'rv3', user:{ name:'Kavya P.',  avatar:'' }, rating:4, comment:'Lovely quality. The ivory shade is more cream than pure white which actually photographs beautifully.', createdAt:'2026-02-10' },
  { _id:'rv4', user:{ name:'Riya F.',   avatar:'' }, rating:5, comment:'Worth every penny. Fast delivery, beautifully packaged, and the blouse is even nicer in person.', createdAt:'2026-01-30' },
  { _id:'rv5', user:{ name:'Nadia R.',  avatar:'' }, rating:4, comment:'Gorgeous fabric. A bit delicate for daily wear but perfect for occasions. Will treasure it.', createdAt:'2026-01-22' },
];

const StarRating = ({ rating, size = 16 }) => (
  <div className="flex items-center gap-0.5">
    {[1,2,3,4,5].map(i => (
      <svg key={i} width={size} height={size} viewBox="0 0 24 24" fill={i<=rating?'#6B1B2A':'none'} stroke={i<=rating?'#6B1B2A':'#D4C5C0'} strokeWidth="1.5">
        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
      </svg>
    ))}
  </div>
);

const StarPicker = ({ value, onChange }) => (
  <div className="flex items-center gap-1">
    {[1,2,3,4,5].map(i => (
      <button key={i} type="button" className="star-btn" onClick={() => onChange(i)}>
        <svg width="28" height="28" viewBox="0 0 24 24" fill={i<=value?'#6B1B2A':'none'} stroke={i<=value?'#6B1B2A':'#D4C5C0'} strokeWidth="1.5">
          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
        </svg>
      </button>
    ))}
    {value > 0 && <span style={{ fontSize:'0.75rem',color:'var(--muted)',marginLeft:'6px' }}>{['','Poor','Fair','Good','Great','Excellent'][value]}</span>}
  </div>
);

export default function Reviews() {
  const { slug }                    = useParams();
  const product                     = MOCK_PRODUCT; // TODO: fetch by slug
  const [reviews, setReviews]       = useState(MOCK_REVIEWS);
  const [form, setForm]             = useState({ rating:0, comment:'' });
  const [errors, setErrors]         = useState({});
  const [loading, setLoading]       = useState(false);
  const [success, setSuccess]       = useState('');
  const [filter, setFilter]         = useState('all');

  // TODO: replace with real auth context
  const isLoggedIn = false;

  const avgRating = reviews.length ? (reviews.reduce((s,r) => s + r.rating, 0) / reviews.length).toFixed(1) : '0.0';
  const ratingCounts = [5,4,3,2,1].map(n => ({ n, count: reviews.filter(r => r.rating===n).length, pct: reviews.length ? Math.round(reviews.filter(r=>r.rating===n).length/reviews.length*100) : 0 }));
  const filtered = filter==='all' ? reviews : reviews.filter(r => r.rating===Number(filter));

  const validate = () => {
    const e = {};
    if (!form.rating)                       e.rating  = 'Please select a rating.';
    if (!form.comment.trim())               e.comment = 'Please write a review.';
    else if (form.comment.trim().length<10) e.comment = 'Review must be at least 10 characters.';
    return e;
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setSuccess('');
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setLoading(true);
    try {
      // const review = await addReview(product._id, form);
      const mock = { _id: Date.now().toString(), user:{ name:'You', avatar:'' }, rating:form.rating, comment:form.comment, createdAt: new Date().toISOString().slice(0,10) };
      setReviews(p => [mock, ...p]);
      setForm({ rating:0, comment:'' }); setErrors({});
      setSuccess('Review submitted! Thank you.');
      setTimeout(() => setSuccess(''), 4000);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  const initials = name => name.split(' ').map(w=>w[0]).join('').toUpperCase().slice(0,2);
  const fmtDate  = d => new Date(d).toLocaleDateString('en-US',{month:'short',day:'numeric',year:'numeric'});

  return (
    <>
      <style>{STYLES}</style>
      <Header />
      <div className="min-h-screen" style={{ background:'var(--cream)',fontFamily:"'Jost',sans-serif" }}>

        {/* Breadcrumb */}
        <div style={{ borderBottom:'1px solid var(--border)',background:'#fff',padding:'12px 6%' }}>
          <div className="flex items-center gap-2" style={{ fontSize:'0.72rem',color:'var(--muted)' }}>
            <Link to="/" style={{ color:'var(--muted)',textDecoration:'none' }}>Home</Link><span>/</span>
            <Link to="/products" style={{ color:'var(--muted)',textDecoration:'none' }}>Products</Link><span>/</span>
            <Link to={`/products/${slug}`} style={{ color:'var(--muted)',textDecoration:'none' }}>{product.name}</Link><span>/</span>
            <span style={{ color:'var(--charcoal)' }}>Reviews</span>
          </div>
        </div>

        <div className="max-w-5xl mx-auto px-6 py-12">

          {/* Product summary */}
          <div className="flex items-center gap-5 mb-10 pb-10" style={{ borderBottom:'1px solid var(--border)' }}>
            {/* IMAGE: product thumbnail — 80×80px, 3:4 crop */}
            <div style={{ width:'80px',height:'80px',borderRadius:'4px',background:'#F0EAE5',overflow:'hidden',flexShrink:0 }}>
              {product.images[0]
                ? <img src={product.images[0]} alt={product.name} style={{ width:'100%',height:'100%',objectFit:'cover' }} />
                : <div style={{ width:'100%',height:'100%',display:'flex',alignItems:'center',justifyContent:'center' }}><svg width="24" height="24" fill="none" stroke="#D4C5C0" strokeWidth="1.2" viewBox="0 0 24 24"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><path d="M21 15l-5-5L5 21"/></svg></div>
              }
            </div>
            <div className="flex-1">
              <p style={{ fontSize:'0.65rem',color:'var(--muted)',letterSpacing:'0.1em',textTransform:'uppercase',marginBottom:'4px' }}>{product.category.name}</p>
              <Link to={`/products/${slug}`} style={{ textDecoration:'none' }}>
                <h1 style={{ fontFamily:"'Cormorant Garamond',serif",fontSize:'1.4rem',fontWeight:600,color:'var(--charcoal)',marginBottom:'6px' }}>{product.name}</h1>
              </Link>
              <div className="flex items-center gap-2">
                <StarRating rating={Math.round(Number(avgRating))} size={14}/>
                <span style={{ fontSize:'0.78rem',color:'var(--muted)' }}>{avgRating} · {reviews.length} reviews</span>
              </div>
            </div>
            <div className="hidden md:flex gap-4">
              {product.discountPrice
                ? <><span style={{ fontFamily:"'Cormorant Garamond',serif",fontSize:'1.3rem',fontWeight:700,color:'var(--maroon)' }}>${product.discountPrice}</span><span style={{ fontFamily:"'Cormorant Garamond',serif",fontSize:'1rem',color:'var(--muted)',textDecoration:'line-through',alignSelf:'center' }}>${product.price}</span></>
                : <span style={{ fontFamily:"'Cormorant Garamond',serif",fontSize:'1.3rem',fontWeight:700,color:'var(--charcoal)' }}>${product.price}</span>
              }
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

            {/* Write review / rating summary */}
            <div className="flex flex-col gap-5">
              {/* Rating summary */}
              <div className="bg-white rounded-md p-6" style={{ border:'1px solid var(--border)' }}>
                <div className="text-center mb-5">
                  <p style={{ fontFamily:"'Cormorant Garamond',serif",fontSize:'3.5rem',fontWeight:700,color:'var(--maroon)',lineHeight:1 }}>{avgRating}</p>
                  <StarRating rating={Math.round(Number(avgRating))} size={18}/>
                  <p style={{ fontSize:'0.72rem',color:'var(--muted)',marginTop:'4px' }}>{reviews.length} reviews</p>
                </div>
                {ratingCounts.map(({ n, count, pct }) => (
                  <div key={n} className="flex items-center gap-2 mb-2">
                    <span style={{ fontSize:'0.7rem',color:'var(--muted)',width:'10px' }}>{n}</span>
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="var(--maroon)" stroke="var(--maroon)" strokeWidth="1.5"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
                    <div style={{ flex:1,height:'3px',background:'#F0EAE5',borderRadius:'99px',overflow:'hidden' }}>
                      <div style={{ height:'100%',width:`${pct}%`,background:'var(--maroon)',borderRadius:'99px' }} />
                    </div>
                    <span style={{ fontSize:'0.68rem',color:'var(--muted)',width:'20px',textAlign:'right' }}>{count}</span>
                  </div>
                ))}
              </div>

              {/* Write review form */}
              <div className="bg-white rounded-md p-6" style={{ border:'1px solid var(--border)' }}>
                <h3 style={{ fontFamily:"'Cormorant Garamond',serif",fontSize:'1.1rem',fontWeight:600,color:'var(--charcoal)',marginBottom:'16px' }}>Write a Review</h3>
                {!isLoggedIn ? (
                  <div className="text-center py-3">
                    <p style={{ fontSize:'0.78rem',color:'var(--muted)',marginBottom:'14px' }}>Sign in to leave a review.</p>
                    <a href="/login" style={{ padding:'9px 20px',background:'var(--maroon)',color:'#fff',borderRadius:'3px',fontFamily:"'Jost',sans-serif",fontSize:'0.72rem',letterSpacing:'0.12em',textTransform:'uppercase',textDecoration:'none' }}>Sign In</a>
                  </div>
                ) : (
                  <>
                    {success && (
                      <div className="mb-4 px-3 py-2 rounded-sm flex items-center gap-2 text-xs" style={{ background:'rgba(56,161,105,.1)',color:'#276749',border:'1px solid rgba(56,161,105,.25)' }}>
                        <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"/></svg>
                        {success}
                      </div>
                    )}
                    <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">
                      <div>
                        <label style={{ fontSize:'0.7rem',letterSpacing:'0.1em',textTransform:'uppercase',color:'var(--muted)',display:'block',marginBottom:'8px' }}>Rating</label>
                        <StarPicker value={form.rating} onChange={v => { setForm(p=>({...p,rating:v})); setErrors(p=>({...p,rating:''})); }} />
                        {errors.rating && <p className="field-error">{errors.rating}</p>}
                      </div>
                      <div>
                        <label style={{ fontSize:'0.7rem',letterSpacing:'0.1em',textTransform:'uppercase',color:'var(--muted)',display:'block',marginBottom:'6px' }}>Review</label>
                        <textarea className={`field-input${errors.comment?' has-error':''}`} rows={4} value={form.comment} onChange={e => { setForm(p=>({...p,comment:e.target.value})); if(errors.comment) setErrors(p=>({...p,comment:''})); }} placeholder="Share your experience with this product…" style={{ resize:'vertical' }} />
                        <div className="flex justify-between mt-1">
                          {errors.comment ? <p className="field-error">{errors.comment}</p> : <span />}
                          <span style={{ fontSize:'0.65rem',color:'var(--muted)' }}>{form.comment.length}/500</span>
                        </div>
                      </div>
                      <button type="submit" className="btn-primary" disabled={loading}>{loading?'Submitting…':'Submit Review'}</button>
                    </form>
                  </>
                )}
              </div>
            </div>

            {/* Reviews list */}
            <div className="lg:col-span-2">
              {/* Filter */}
              <div className="flex items-center gap-2 mb-5 flex-wrap">
                {['all','5','4','3','2','1'].map(f => (
                  <button key={f} onClick={() => setFilter(f)}
                    style={{ padding:'5px 14px',borderRadius:'99px',fontFamily:"'Jost',sans-serif",fontSize:'0.7rem',letterSpacing:'0.06em',textTransform:'uppercase',cursor:'pointer',border:'1px solid',transition:'all .2s',
                      background:filter===f?'var(--maroon)':'#fff', color:filter===f?'#fff':'var(--muted)', borderColor:filter===f?'var(--maroon)':'var(--border)' }}>
                    {f==='all'?'All':f+' ★'}
                  </button>
                ))}
              </div>

              {filtered.length === 0 ? (
                <div className="text-center py-12" style={{ border:'1px dashed var(--border)',borderRadius:'4px',color:'var(--muted)',fontSize:'0.85rem' }}>No reviews for this rating.</div>
              ) : (
                <div className="flex flex-col gap-4">
                  {filtered.map(review => (
                    <div key={review._id} className="review-card">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-3">
                          {/* IMAGE: user avatar 40×40px circular */}
                          <div className="avatar">
                            {review.user.avatar
                              ? <img src={review.user.avatar} alt="" style={{ width:'100%',height:'100%',objectFit:'cover',borderRadius:'50%' }} />
                              : initials(review.user.name)
                            }
                          </div>
                          <div>
                            <p style={{ fontSize:'0.85rem',fontWeight:500,color:'var(--charcoal)',marginBottom:'3px' }}>{review.user.name}</p>
                            <StarRating rating={review.rating} size={13}/>
                          </div>
                        </div>
                        <span style={{ fontSize:'0.72rem',color:'var(--muted)' }}>{fmtDate(review.createdAt)}</span>
                      </div>
                      <p style={{ fontSize:'0.85rem',color:'var(--charcoal)',lineHeight:1.75 }}>{review.comment}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}