import React, { useState } from 'react';
import Header from '../../components/layout/Header';
import Sidebar from '../../components/layout/Sidebar';
// import { getShopReviews, deleteShopReview } from '../../api/shopReviewApi';

const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;600;700&family=Jost:wght@300;400;500&display=swap');
  :root { --maroon:#6B1B2A;--maroon-dark:#4A1019;--maroon-soft:#8B2535;--cream:#FAF7F4;--charcoal:#1C1C1E;--muted:#7A7A7A;--border:#E8E0D8; }
  .section-card { background:#fff;border:1px solid var(--border);border-radius:4px; }
  .review-card { background:#fff;border:1px solid var(--border);border-radius:4px;padding:20px;transition:border-color .2s; }
  .review-card:hover { border-color:#C4A8A8; }
  .avatar-sm { width:36px;height:36px;border-radius:50%;background:rgba(107,27,42,.1);display:flex;align-items:center;justify-content:center;font-family:'Cormorant Garamond',serif;font-size:0.9rem;font-weight:600;color:var(--maroon);flex-shrink:0; }
  .action-btn { padding:5px 12px;border-radius:3px;font-family:'Jost',sans-serif;font-size:0.68rem;letter-spacing:0.08em;text-transform:uppercase;cursor:pointer;border:1px solid;transition:all .2s; }
`;

// TODO: replace with real data from getShopReviews() API
const MOCK_REVIEWS = [
  { _id:'r1', user:{ name:'Amara Silva',  avatar:'' }, rating:5, comment:'Absolutely love CEILO! The quality is unmatched and delivery was super fast.', createdAt:'2026-03-01' },
  { _id:'r2', user:{ name:'Priya Mendis', avatar:'' }, rating:4, comment:'Great products and beautiful packaging. Will definitely shop again.', createdAt:'2026-02-20' },
  { _id:'r3', user:{ name:'Kavya Perera', avatar:'' }, rating:5, comment:'The silk blouse is everything I dreamed of. CEILO never disappoints!', createdAt:'2026-02-15' },
  { _id:'r4', user:{ name:'Riya Fernando',avatar:'' }, rating:3, comment:'Good quality but shipping took longer than expected.', createdAt:'2026-02-10' },
];

const StarRating = ({ rating, size = 14 }) => (
  <div className="flex items-center gap-0.5">
    {[1,2,3,4,5].map(i => (
      <svg key={i} width={size} height={size} viewBox="0 0 24 24" fill={i <= rating ? '#6B1B2A' : 'none'} stroke={i <= rating ? '#6B1B2A' : '#C4B5B8'} strokeWidth="1.5">
        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
      </svg>
    ))}
  </div>
);

export default function shopReviewsAdmin() {
  const [reviews, setReviews]   = useState(MOCK_REVIEWS);
  const [deleteId, setDeleteId] = useState(null);
  const [filter, setFilter]     = useState('all');

  const filtered = filter === 'all' ? reviews : reviews.filter(r => r.rating === Number(filter));

  const avgRating = reviews.length > 0 ? (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1) : '0.0';

  const ratingCounts = [5,4,3,2,1].map(n => ({
    n, count: reviews.filter(r => r.rating === n).length,
    pct: reviews.length ? Math.round((reviews.filter(r => r.rating === n).length / reviews.length) * 100) : 0,
  }));

  const handleDelete = async () => {
    try {
      // await deleteShopReview(deleteId);
      setReviews(p => p.filter(r => r._id !== deleteId));
    } catch (err) { console.error(err); }
    finally { setDeleteId(null); }
  };

  const initials = name => name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2);
  const fmtDate  = d => new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

  return (
    <>
      <style>{STYLES}</style>
      <Header />
      <div className="min-h-screen" style={{ background: 'var(--cream)', fontFamily: "'Jost',sans-serif" }}>
        <div className="max-w-7xl mx-auto px-6 py-12 flex flex-col md:flex-row gap-10">
          <Sidebar variant="admin" />

          <main className="flex-1 min-w-0">
            <h1 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: '1.7rem', fontWeight: 600, color: 'var(--charcoal)', marginBottom: '4px' }}>Shop Reviews</h1>
            <p style={{ fontSize: '0.82rem', color: 'var(--muted)', marginBottom: '32px' }}>Customer reviews for your overall store</p>

            {/* Summary */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">

              {/* Average rating */}
              <div className="bg-white rounded-md p-6 flex items-center gap-5" style={{ border: '1px solid var(--border)' }}>
                <div>
                  <p style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: '3rem', fontWeight: 700, color: 'var(--maroon)', lineHeight: 1 }}>{avgRating}</p>
                  <StarRating rating={Math.round(Number(avgRating))} size={16} />
                  <p style={{ fontSize: '0.72rem', color: 'var(--muted)', marginTop: '4px' }}>{reviews.length} review{reviews.length !== 1 ? 's' : ''}</p>
                </div>
              </div>

              {/* Rating breakdown */}
              <div className="bg-white rounded-md p-6 md:col-span-2" style={{ border: '1px solid var(--border)' }}>
                <p style={{ fontSize: '0.72rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--muted)', marginBottom: '14px' }}>Rating Breakdown</p>
                <div className="flex flex-col gap-2.5">
                  {ratingCounts.map(({ n, count, pct }) => (
                    <div key={n} className="flex items-center gap-3">
                      <span style={{ fontSize: '0.72rem', color: 'var(--muted)', width: '12px', textAlign: 'right' }}>{n}</span>
                      <svg width="11" height="11" viewBox="0 0 24 24" fill="var(--maroon)" stroke="var(--maroon)" strokeWidth="1.5">
                        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
                      </svg>
                      <div style={{ flex: 1, height: '4px', background: '#F0EAE5', borderRadius: '99px', overflow: 'hidden' }}>
                        <div style={{ height: '100%', width: `${pct}%`, background: 'var(--maroon)', borderRadius: '99px', transition: 'width .4s ease' }} />
                      </div>
                      <span style={{ fontSize: '0.72rem', color: 'var(--muted)', width: '32px' }}>{count}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Filter by stars */}
            <div className="flex items-center gap-2 mb-5 flex-wrap">
              {['all','5','4','3','2','1'].map(f => (
                <button key={f} onClick={() => setFilter(f)}
                  style={{ padding: '6px 14px', borderRadius: '99px', fontFamily: "'Jost',sans-serif", fontSize: '0.7rem', letterSpacing: '0.06em', textTransform: 'uppercase', cursor: 'pointer', border: '1px solid', transition: 'all .2s', background: filter === f ? 'var(--maroon)' : '#fff', color: filter === f ? '#fff' : 'var(--muted)', borderColor: filter === f ? 'var(--maroon)' : 'var(--border)' }}>
                  {f === 'all' ? 'All' : `${f} ★`}
                </button>
              ))}
            </div>

            {/* Reviews grid */}
            {filtered.length === 0 ? (
              <div className="text-center py-12" style={{ border: '1px dashed var(--border)', borderRadius: '4px', color: 'var(--muted)', fontSize: '0.85rem' }}>
                No reviews found.
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filtered.map(review => (
                  <div key={review._id} className="review-card">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        {/* IMAGE: user avatar 36×36px circular — falls back to initials */}
                        <div className="avatar-sm">
                          {review.user.avatar
                            ? <img src={review.user.avatar} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '50%' }} />
                            : initials(review.user.name)
                          }
                        </div>
                        <div>
                          <p style={{ fontSize: '0.85rem', fontWeight: 500, color: 'var(--charcoal)' }}>{review.user.name}</p>
                          <p style={{ fontSize: '0.7rem', color: 'var(--muted)' }}>{fmtDate(review.createdAt)}</p>
                        </div>
                      </div>
                      <button className="action-btn" onClick={() => setDeleteId(review._id)} style={{ borderColor: '#C53030', color: '#C53030' }}
                        onMouseEnter={e => { e.currentTarget.style.background = '#C53030'; e.currentTarget.style.color = '#fff'; }}
                        onMouseLeave={e => { e.currentTarget.style.background = ''; e.currentTarget.style.color = '#C53030'; }}>
                        Delete
                      </button>
                    </div>
                    <StarRating rating={review.rating} />
                    <p style={{ fontSize: '0.85rem', color: 'var(--charcoal)', marginTop: '10px', lineHeight: 1.6 }}>{review.comment}</p>
                  </div>
                ))}
              </div>
            )}

            {/* Delete confirm */}
            {deleteId && (
              <div className="fixed inset-0 z-50 flex items-center justify-center" style={{ background: 'rgba(0,0,0,0.4)' }}>
                <div className="bg-white rounded-md p-8 max-w-sm w-full mx-4 shadow-xl">
                  <h3 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: '1.3rem', fontWeight: 600, color: 'var(--charcoal)', marginBottom: '8px' }}>Delete review?</h3>
                  <p style={{ fontSize: '0.82rem', color: 'var(--muted)', marginBottom: '24px' }}>This review will be permanently removed.</p>
                  <div className="flex gap-3">
                    <button onClick={handleDelete} style={{ padding:'10px 24px',background:'#C53030',color:'#fff',border:'none',borderRadius:'3px',fontFamily:"'Jost',sans-serif",fontSize:'0.72rem',letterSpacing:'0.12em',textTransform:'uppercase',cursor:'pointer' }}>Delete</button>
                    <button onClick={() => setDeleteId(null)} style={{ padding:'10px 24px',background:'transparent',color:'var(--muted)',border:'1px solid var(--border)',borderRadius:'3px',fontFamily:"'Jost',sans-serif",fontSize:'0.72rem',letterSpacing:'0.12em',textTransform:'uppercase',cursor:'pointer' }}>Cancel</button>
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