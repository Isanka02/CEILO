import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Header from '../../components/layout/Header';
import Footer from '../../components/layout/Footer';

const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;0,700;1,300;1,400&family=Jost:wght@300;400;500&display=swap');
  :root { --maroon:#6B1B2A;--maroon-dark:#4A1019;--maroon-soft:#8B2535;--cream:#FAF7F4;--charcoal:#1C1C1E;--muted:#7A7A7A;--border:#E8E0D8; }

  .review-card { background:#fff;border:1px solid var(--border);border-radius:4px;padding:22px 24px;transition:border-color .2s,box-shadow .2s; }
  .review-card:hover { border-color:#C4A8A8;box-shadow:0 4px 20px rgba(107,27,42,.07); }

  .avatar { width:40px;height:40px;border-radius:50%;background:var(--maroon);color:#fff;display:flex;align-items:center;justify-content:center;font-size:0.8rem;font-weight:500;flex-shrink:0;overflow:hidden; }

  .star-btn { background:none;border:none;cursor:pointer;padding:2px;transition:transform .15s; }
  .star-btn:hover { transform:scale(1.2); }

  .rating-bar-wrap { display:flex;align-items:center;gap:10px;margin-bottom:6px; }
  .rating-bar-bg { flex:1;height:6px;background:var(--border);border-radius:99px;overflow:hidden; }
  .rating-bar-fill { height:100%;background:var(--maroon);border-radius:99px;transition:width .6s ease; }

  .btn-maroon { display:block;width:100%;padding:12px;background:var(--maroon);color:#fff;border:none;border-radius:3px;font-family:'Jost',sans-serif;font-size:0.72rem;letter-spacing:0.15em;text-transform:uppercase;cursor:pointer;transition:background .2s; }
  .btn-maroon:hover:not(:disabled) { background:var(--maroon-soft); }
  .btn-maroon:disabled { opacity:.5;cursor:not-allowed; }

  .review-textarea { width:100%;padding:12px 14px;font-family:'Jost',sans-serif;font-size:0.82rem;color:var(--charcoal);background:#fff;border:1px solid var(--border);border-radius:3px;outline:none;resize:vertical;min-height:100px;transition:border-color .2s;box-sizing:border-box; }
  .review-textarea:focus { border-color:var(--maroon); }
  .review-textarea::placeholder { color:#B8B0A8; }

  .filter-btn { padding:6px 16px;border-radius:99px;font-family:'Jost',sans-serif;font-size:0.7rem;letter-spacing:0.08em;text-transform:uppercase;border:1px solid;cursor:pointer;transition:all .2s;background:#fff; }

  .skeleton { background:linear-gradient(90deg,#F0EAE5 25%,#FAF7F4 50%,#F0EAE5 75%);background-size:200% 100%;animation:shimmer 1.4s infinite;border-radius:4px; }
  @keyframes shimmer { 0%{background-position:200% 0}100%{background-position:-200% 0} }

  .success-toast { position:fixed;bottom:28px;right:28px;z-index:99;background:var(--charcoal);color:#fff;padding:14px 20px;border-radius:4px;font-size:0.78rem;display:flex;align-items:center;gap:10px;animation:slideUp .3s ease; }
  @keyframes slideUp { from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:translateY(0)} }
`;

// ─── API ─────────────────────────────────────────────────────────────────────
const fetchShopReviews = async () => {
  const res = await fetch('/api/shop-reviews');
  if (!res.ok) throw new Error('Failed to fetch reviews');
  return res.json(); // { reviews, total, averageRating }
};

const submitReview = async ({ rating, comment }) => {
  const res = await fetch('/api/shop-reviews', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    },
    body: JSON.stringify({ rating, comment }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Failed to submit review');
  return data;
};

// ─── HELPERS ─────────────────────────────────────────────────────────────────
const RATING_LABELS = { 1:'Poor', 2:'Fair', 3:'Good', 4:'Great', 5:'Excellent' };

const StarDisplay = ({ rating, size = 14 }) => (
  <div className="flex gap-0.5">
    {[1,2,3,4,5].map(i => (
      <svg key={i} width={size} height={size} viewBox="0 0 24 24"
        fill={i <= Math.round(rating) ? '#6B1B2A' : 'none'}
        stroke={i <= Math.round(rating) ? '#6B1B2A' : '#D4C5C0'} strokeWidth="1.5">
        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
      </svg>
    ))}
  </div>
);

const initials = (name = '') =>
  name.split(' ').map(w => w[0]).slice(0, 2).join('').toUpperCase() || '?';

const timeAgo = (dateStr) => {
  const days = Math.floor((Date.now() - new Date(dateStr)) / 86400000);
  if (days === 0) return 'Today';
  if (days === 1) return 'Yesterday';
  if (days < 30)  return `${days} days ago`;
  const months = Math.floor(days / 30);
  return months === 1 ? '1 month ago' : `${months} months ago`;
};

// ─── COMPONENT ───────────────────────────────────────────────────────────────
export default function ShopReviews() {
  const [data, setData]             = useState({ reviews: [], total: 0, averageRating: 0 });
  const [loading, setLoading]       = useState(true);
  const [error, setError]           = useState('');
  const [filterStar, setFilterStar] = useState(0);

  // Form
  const [rating, setRating]         = useState(0);
  const [hovered, setHovered]       = useState(0);
  const [comment, setComment]       = useState('');
  const [formError, setFormError]   = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [toast, setToast]           = useState('');

  // TODO: replace with real auth context
  const user = null; // e.g. from useAuth()

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const res = await fetchShopReviews();
        setData(res);
      } catch {
        setError('Could not load reviews. Please try again.');
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const breakdown = [5,4,3,2,1].map(star => {
    const count = data.reviews.filter(r => r.rating === star).length;
    const pct   = data.total > 0 ? Math.round((count / data.total) * 100) : 0;
    return { star, count, pct };
  });

  const filtered = filterStar === 0
    ? data.reviews
    : data.reviews.filter(r => r.rating === filterStar);

  const handleSubmit = async () => {
    if (rating === 0)               return setFormError('Please select a star rating.');
    if (comment.trim().length < 10) return setFormError('Comment must be at least 10 characters.');
    setFormError('');
    setSubmitting(true);
    try {
      const newReview = await submitReview({ rating, comment: comment.trim() });
      // Replace existing review by same user (upsert) or prepend new one
      setData(prev => {
        const without = prev.reviews.filter(r => r.user?._id !== newReview.user?._id);
        return { ...prev, reviews: [newReview, ...without], total: without.length < prev.reviews.length ? prev.total : prev.total + 1 };
      });
      setRating(0);
      setComment('');
      setToast('Your review has been submitted. Thank you!');
      setTimeout(() => setToast(''), 3500);
    } catch (err) {
      setFormError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <style>{STYLES}</style>
      <Header />
      <div style={{ background:'var(--cream)', minHeight:'100vh', fontFamily:"'Jost',sans-serif", paddingBottom:'72px' }}>

        {/* Breadcrumb */}
        <div style={{ borderBottom:'1px solid var(--border)', background:'#fff', padding:'20px 6%' }}>
          <div className="flex items-center gap-2" style={{ fontSize:'0.7rem', color:'var(--muted)', letterSpacing:'0.08em' }}>
            <Link to="/" style={{ color:'var(--muted)', textDecoration:'none' }}>Home</Link>
            <span>/</span>
            <span style={{ color:'var(--charcoal)' }}>Reviews</span>
          </div>
        </div>

        {/* Hero strip */}
        <div style={{ background:'var(--maroon-dark)', padding:'52px 6%', textAlign:'center' }}>
          <p style={{ fontSize:'0.72rem', letterSpacing:'0.2em', textTransform:'uppercase', color:'rgba(255,255,255,.5)', marginBottom:'10px' }}>
            Community
          </p>
          <h1 style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:'clamp(2rem,4vw,3rem)', fontWeight:300, color:'#fff', marginBottom:'14px' }}>
            What Our Customers Say
          </h1>
          {!loading && data.total > 0 && (
            <div className="flex items-center justify-center gap-3">
              <StarDisplay rating={data.averageRating} size={18} />
              <span style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:'1.5rem', fontWeight:600, color:'#fff' }}>
                {data.averageRating.toFixed(1)}
              </span>
              <span style={{ fontSize:'0.78rem', color:'rgba(255,255,255,.5)' }}>
                ({data.total} review{data.total !== 1 ? 's' : ''})
              </span>
            </div>
          )}
        </div>

        <div className="max-w-6xl mx-auto px-6 py-10">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

            {/* ── LEFT SIDEBAR ── */}
            <div>

              {/* Rating breakdown */}
              {!loading && data.total > 0 && (
                <div style={{ background:'#fff', border:'1px solid var(--border)', borderRadius:'4px', padding:'24px', marginBottom:'16px' }}>
                  <div className="text-center mb-5">
                    <p style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:'3.5rem', fontWeight:600, color:'var(--charcoal)', lineHeight:1 }}>
                      {data.averageRating.toFixed(1)}
                    </p>
                    <div className="flex justify-center mt-2 mb-1">
                      <StarDisplay rating={data.averageRating} size={16} />
                    </div>
                    <p style={{ fontSize:'0.72rem', color:'var(--muted)' }}>
                      Based on {data.total} review{data.total !== 1 ? 's' : ''}
                    </p>
                  </div>
                  {breakdown.map(({ star, count, pct }) => (
                    <div key={star} className="rating-bar-wrap">
                      <span style={{ fontSize:'0.72rem', color:'var(--muted)', width:'10px' }}>{star}</span>
                      <svg width="10" height="10" viewBox="0 0 24 24" fill="#6B1B2A" stroke="#6B1B2A" strokeWidth="1">
                        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
                      </svg>
                      <div className="rating-bar-bg">
                        <div className="rating-bar-fill" style={{ width:`${pct}%` }} />
                      </div>
                      <span style={{ fontSize:'0.7rem', color:'var(--muted)', width:'24px', textAlign:'right' }}>{count}</span>
                    </div>
                  ))}
                </div>
              )}

              {/* Write review form */}
              <div style={{ background:'#fff', border:'1px solid var(--border)', borderRadius:'4px', padding:'24px' }}>
                <h3 style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:'1.1rem', fontWeight:600, color:'var(--charcoal)', marginBottom:'18px', paddingBottom:'14px', borderBottom:'1px solid var(--border)' }}>
                  Write a Review
                </h3>

                {!user ? (
                  <div style={{ textAlign:'center', padding:'12px 0' }}>
                    <p style={{ fontSize:'0.8rem', color:'var(--muted)', marginBottom:'14px', lineHeight:1.6 }}>
                      Sign in to share your experience with CEILO.
                    </p>
                    <Link to="/login"
                      style={{ fontSize:'0.72rem', color:'var(--maroon)', textDecoration:'none', border:'1px solid var(--maroon)', padding:'9px 22px', borderRadius:'3px', letterSpacing:'0.1em', textTransform:'uppercase', display:'inline-block' }}>
                      Sign In
                    </Link>
                  </div>
                ) : (
                  <>
                    <div style={{ marginBottom:'16px' }}>
                      <p style={{ fontSize:'0.68rem', letterSpacing:'0.1em', textTransform:'uppercase', color:'var(--muted)', marginBottom:'8px' }}>Your Rating</p>
                      <div className="flex gap-1 mb-1">
                        {[1,2,3,4,5].map(i => (
                          <button key={i} className="star-btn"
                            onMouseEnter={() => setHovered(i)}
                            onMouseLeave={() => setHovered(0)}
                            onClick={() => { setRating(i); setFormError(''); }}>
                            <svg width="26" height="26" viewBox="0 0 24 24"
                              fill={i <= (hovered || rating) ? '#6B1B2A' : 'none'}
                              stroke={i <= (hovered || rating) ? '#6B1B2A' : '#D4C5C0'} strokeWidth="1.5">
                              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
                            </svg>
                          </button>
                        ))}
                      </div>
                      {(hovered || rating) > 0 && (
                        <p style={{ fontSize:'0.72rem', color:'var(--maroon)', fontWeight:500 }}>
                          {RATING_LABELS[hovered || rating]}
                        </p>
                      )}
                    </div>

                    <div style={{ marginBottom:'14px' }}>
                      <p style={{ fontSize:'0.68rem', letterSpacing:'0.1em', textTransform:'uppercase', color:'var(--muted)', marginBottom:'6px' }}>Your Comment</p>
                      <textarea
                        className="review-textarea"
                        placeholder="Share your experience with CEILO..."
                        value={comment}
                        maxLength={500}
                        onChange={e => { setComment(e.target.value); setFormError(''); }}
                      />
                      <p style={{ fontSize:'0.68rem', color:'var(--muted)', textAlign:'right', marginTop:'3px' }}>{comment.length}/500</p>
                    </div>

                    {formError && (
                      <p style={{ fontSize:'0.72rem', color:'#C0392B', marginBottom:'12px' }}>{formError}</p>
                    )}

                    <button className="btn-maroon" onClick={handleSubmit} disabled={submitting}>
                      {submitting ? 'Submitting…' : 'Submit Review'}
                    </button>
                  </>
                )}
              </div>
            </div>

            {/* ── RIGHT: Reviews list ── */}
            <div className="lg:col-span-2">

              {/* Filter pills */}
              {!loading && data.total > 0 && (
                <div className="flex items-center gap-2 mb-6 flex-wrap">
                  {[0,5,4,3,2,1].map(s => (
                    <button key={s} className="filter-btn"
                      onClick={() => setFilterStar(s)}
                      style={{
                        background:  filterStar === s ? 'var(--maroon)' : '#fff',
                        color:       filterStar === s ? '#fff' : 'var(--muted)',
                        borderColor: filterStar === s ? 'var(--maroon)' : 'var(--border)',
                      }}>
                      {s === 0 ? 'All' : `${s} ★`}
                    </button>
                  ))}
                  <span style={{ fontSize:'0.72rem', color:'var(--muted)', marginLeft:'4px' }}>
                    {filtered.length} review{filtered.length !== 1 ? 's' : ''}
                  </span>
                </div>
              )}

              {/* Skeletons */}
              {loading && (
                <div className="flex flex-col gap-4">
                  {[1,2,3,4].map(i => <div key={i} style={{ height:'120px' }} className="skeleton" />)}
                </div>
              )}

              {/* Error */}
              {!loading && error && (
                <div style={{ background:'#FEF2F2', border:'1px solid #FECACA', borderRadius:'4px', padding:'16px 20px', fontSize:'0.82rem', color:'#991B1B' }}>
                  {error}
                </div>
              )}

              {/* Empty */}
              {!loading && !error && filtered.length === 0 && (
                <div style={{ border:'1px dashed var(--border)', borderRadius:'4px', padding:'56px 24px', textAlign:'center' }}>
                  <svg width="36" height="36" fill="none" stroke="#D4C5C0" strokeWidth="1.2" viewBox="0 0 24 24" style={{ margin:'0 auto 14px', display:'block' }}>
                    <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/>
                  </svg>
                  <p style={{ fontSize:'0.85rem', color:'var(--muted)', marginBottom:'8px' }}>
                    {filterStar > 0 ? `No ${filterStar}-star reviews yet.` : 'No reviews yet. Be the first!'}
                  </p>
                  {filterStar > 0 && (
                    <button onClick={() => setFilterStar(0)}
                      style={{ fontSize:'0.7rem', color:'var(--maroon)', background:'none', border:'none', cursor:'pointer', textDecoration:'underline' }}>
                      Show all reviews
                    </button>
                  )}
                </div>
              )}

              {/* Cards */}
              {!loading && !error && filtered.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {filtered.map(review => (
                    <div key={review._id} className="review-card">
                      <div className="flex items-start gap-3 mb-3">
                        <div className="avatar">
                          {review.user?.avatar
                            ? <img src={review.user.avatar} alt={review.user.name} style={{ width:'100%', height:'100%', objectFit:'cover' }} />
                            : initials(review.user?.name)
                          }
                        </div>
                        <div className="flex-1 min-w-0">
                          <p style={{ fontSize:'0.82rem', fontWeight:500, color:'var(--charcoal)', marginBottom:'4px' }}>
                            {review.user?.name || 'Anonymous'}
                          </p>
                          <StarDisplay rating={review.rating} size={12} />
                        </div>
                        <span style={{ fontSize:'0.68rem', color:'var(--muted)', whiteSpace:'nowrap' }}>
                          {timeAgo(review.createdAt)}
                        </span>
                      </div>
                      <p style={{ fontSize:'0.82rem', color:'var(--charcoal)', lineHeight:1.75, fontStyle:'italic' }}>
                        "{review.comment}"
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>

          </div>
        </div>
      </div>

      {/* Success toast */}
      {toast && (
        <div className="success-toast">
          <svg width="16" height="16" fill="none" stroke="#4ADE80" strokeWidth="2" viewBox="0 0 24 24">
            <path d="M20 6L9 17l-5-5"/>
          </svg>
          {toast}
        </div>
      )}

      <Footer />
    </>
  );
}








