import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import Header from '../../components/layout/Header';
import Footer from '../../components/layout/Footer';
import { getProductBySlug, getProductReviews, getProducts } from '../../api/productApi';
import { saveItem, removeSavedItem } from '../../api/userApi';
import { useCart } from '../../context/useCart';

const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,600;0,700;1,400&family=Jost:wght@300;400;500&display=swap');
  :root { --maroon:#6B1B2A;--maroon-dark:#4A1019;--maroon-soft:#8B2535;--cream:#FAF7F4;--charcoal:#1C1C1E;--muted:#7A7A7A;--border:#E8E0D8; }
  .thumb { width:72px;height:72px;border-radius:3px;overflow:hidden;cursor:pointer;border:2px solid transparent;transition:border-color .2s;flex-shrink:0;background:#F0EAE5; }
  .thumb.active { border-color:var(--maroon); }
  .thumb img { width:100%;height:100%;object-fit:cover; }
  .variant-btn { padding:8px 16px;border-radius:3px;font-family:'Jost',sans-serif;font-size:0.78rem;cursor:pointer;border:1px solid var(--border);background:#fff;color:var(--charcoal);transition:all .2s; }
  .variant-btn.active { background:var(--maroon);color:#fff;border-color:var(--maroon); }
  .variant-btn:hover:not(.active) { border-color:var(--maroon);color:var(--maroon); }
  .btn-primary { width:100%;padding:14px;background:var(--maroon);color:#fff;border:none;border-radius:3px;font-family:'Jost',sans-serif;font-size:0.75rem;letter-spacing:0.15em;text-transform:uppercase;cursor:pointer;transition:background .2s; }
  .btn-primary:hover { background:var(--maroon-soft); }
  .btn-wishlist { width:100%;padding:13px;background:transparent;color:var(--maroon);border:1px solid var(--maroon);border-radius:3px;font-family:'Jost',sans-serif;font-size:0.75rem;letter-spacing:0.15em;text-transform:uppercase;cursor:pointer;transition:all .2s;display:flex;align-items:center;justify-content:center;gap:8px; }
  .btn-wishlist:hover { background:var(--maroon);color:#fff; }
  .qty-btn { width:36px;height:36px;border-radius:3px;border:1px solid var(--border);background:#fff;cursor:pointer;display:flex;align-items:center;justify-content:center;font-size:1.1rem;color:var(--charcoal);transition:all .2s; }
  .qty-btn:hover { border-color:var(--maroon);color:var(--maroon); }
  .tab-btn { padding:10px 20px;font-family:'Jost',sans-serif;font-size:0.75rem;letter-spacing:0.1em;text-transform:uppercase;cursor:pointer;border:none;background:transparent;color:var(--muted);border-bottom:2px solid transparent;transition:all .2s; }
  .tab-btn.active { color:var(--maroon);border-bottom-color:var(--maroon); }
  .review-item { padding:20px 0;border-bottom:1px solid var(--border); }
  .review-item:last-child { border-bottom:none; }
  .related-card { background:#fff;border:1px solid var(--border);border-radius:4px;overflow:hidden;transition:border-color .2s,box-shadow .2s; }
  .related-card:hover { border-color:#C4A8A8;box-shadow:0 4px 20px rgba(107,27,42,.08); }
  .related-card:hover .rel-img { transform:scale(1.04); }
  .rel-img { width:100%;aspect-ratio:3/4;object-fit:cover;display:block;background:#F0EAE5;transition:transform .5s ease; }
`;

const StarRow = ({ n, size = 16 }) => (
  <div className="flex items-center gap-0.5">
    {[1,2,3,4,5].map(i => (
      <svg key={i} width={size} height={size} viewBox="0 0 24 24" fill={i<=n?'#6B1B2A':'none'} stroke={i<=n?'#6B1B2A':'#D4C5C0'} strokeWidth="1.5">
        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
      </svg>
    ))}
  </div>
);

export default function SingleProductDetail() {
  const { slug }                    = useParams();
  const { addToCart }               = useCart();
  const [product, setProduct]       = useState(null);
  const [reviews, setReviews]       = useState([]);
  const [related, setRelated]       = useState([]);
  const [fetching, setFetching]     = useState(true);
  const [apiError, setApiError]     = useState('');
  const [activeImg, setActiveImg]   = useState(0);
  const [selColor, setSelColor]     = useState('');
  const [selSize, setSelSize]       = useState('');
  const [qty, setQty]               = useState(1);
  const [tab, setTab]               = useState('description');
  const [saved, setSaved]           = useState(false);
  const [addedMsg, setAddedMsg]     = useState('');
  const [saveLoading, setSaveLoading] = useState(false);
  const [showSizeGuide, setShowSizeGuide] = useState(false);

  useEffect(() => {
    setFetching(true);
    (async () => {
      try {
        const [prodRes, revRes] = await Promise.all([
          getProductBySlug(slug),
          getProductReviews(slug),
        ]);
        setProduct(prodRes.data);
        setReviews(revRes.data);
        // Fetch related products from same category
        if (prodRes.data?.category?._id) {
          try {
            const { data: rel } = await getProducts({ category: prodRes.data.category._id, limit: 4 });
            // Exclude current product from related list
            const relProducts = (rel.products ?? rel).filter(p => p.slug !== slug);
            setRelated(relProducts.slice(0, 4));
          } catch { /* silently ignore */ }
        }
        // Set default color to first variant's color
        const firstColor = [...new Set((prodRes.data.variants || []).map(v => v.color))][0] || '';
        setSelColor(firstColor);
      } catch (err) {
        setApiError(err.response?.data?.message || 'Failed to load product.');
      } finally {
        setFetching(false);
      }
    })();
  }, [slug]);

  const colors  = product ? [...new Set(product.variants.map(v => v.color))] : [];
  const sizes   = product ? [...new Set(product.variants.map(v => v.size))]  : [];

  const getStock = () => {
    if (!product || !selColor || !selSize) return null;
    const v = product.variants.find(v => v.color === selColor && v.size === selSize);
    return v ? v.stock : null;
  };
  const stock   = getStock();
  const inStock = stock === null ? true : stock > 0;

  // Wire up add-to-cart to CartContext
  const handleAddToCart = () => {
    // Only require size selection if this product actually has size variants
    if (sizes.length > 0 && !selSize) {
      setAddedMsg('⚠ Please select a size first.');
      setTimeout(() => setAddedMsg(''), 2500);
      return;
    }
    addToCart({
      _id:   product._id,
      name:  product.name,
      slug:  product.slug,
      image: product.images?.[0] || '',
      price: product.discountPrice || product.price,
      color: selColor || undefined,
      size:  selSize  || undefined,
    }, qty);
    setAddedMsg('Added to cart!');
    setTimeout(() => setAddedMsg(''), 2500);
  };

  const handleToggleSave = async () => {
    if (!product) return;
    setSaveLoading(true);
    try {
      if (saved) {
        await removeSavedItem(product._id);
        setSaved(false);
      } else {
        await saveItem(product._id);
        setSaved(true);
      }
    } catch {
      // silently ignore — user may not be logged in
    } finally {
      setSaveLoading(false);
    }
  };

  const fmtDate = d => new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

  if (fetching) return (
    <>
      <style>{STYLES}</style>
      <Header />
      <div className="min-h-screen flex items-center justify-center" style={{ background:'var(--cream)' }}>
        <p style={{ fontSize:'0.85rem', color:'var(--muted)', fontFamily:"'Jost',sans-serif" }}>Loading product…</p>
      </div>
      <Footer />
    </>
  );

  if (!product) return (
    <>
      <style>{STYLES}</style>
      <Header />
      <div className="min-h-screen flex items-center justify-center" style={{ background:'var(--cream)' }}>
        <p style={{ fontSize:'0.85rem', color:'#C53030', fontFamily:"'Jost',sans-serif" }}>{apiError || 'Product not found.'}</p>
      </div>
      <Footer />
    </>
  );

  return (
    <>
      <style>{STYLES}</style>
      <Header />
      <div className="min-h-screen" style={{ background:'var(--cream)',fontFamily:"'Jost',sans-serif" }}>

        {/* Breadcrumb */}
        <div style={{ borderBottom:'1px solid var(--border)',background:'#fff',padding:'12px 6%' }}>
          <div className="flex items-center gap-2" style={{ fontSize:'0.72rem',color:'var(--muted)' }}>
            <Link to="/" style={{ color:'var(--muted)',textDecoration:'none' }} onMouseEnter={e=>e.currentTarget.style.color='var(--maroon)'} onMouseLeave={e=>e.currentTarget.style.color='var(--muted)'}>Home</Link>
            <span>/</span>
            <Link to="/products" style={{ color:'var(--muted)',textDecoration:'none' }} onMouseEnter={e=>e.currentTarget.style.color='var(--maroon)'} onMouseLeave={e=>e.currentTarget.style.color='var(--muted)'}>Products</Link>
            <span>/</span>
            <Link to={`/category/${product.category.slug}`} style={{ color:'var(--muted)',textDecoration:'none' }} onMouseEnter={e=>e.currentTarget.style.color='var(--maroon)'} onMouseLeave={e=>e.currentTarget.style.color='var(--muted)'}>{product.category.name}</Link>
            <span>/</span>
            <span style={{ color:'var(--charcoal)' }}>{product.name}</span>
          </div>
        </div>

        {/* Main product section */}
        <div className="max-w-6xl mx-auto px-6 py-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">

            {/* ── Images ─────────────────────────────────────────── */}
            <div className="flex gap-4">
              {/* Thumbnails */}
              <div className="flex flex-col gap-3">
                {product.images.map((img, i) => (
                  <div key={i} className={`thumb${activeImg === i ? ' active' : ''}`} onClick={() => setActiveImg(i)}>
                    {/* IMAGE: product thumbnail — 72×72px */}
                    {img ? <img src={img} alt="" /> : <div style={{ width:'100%',height:'100%',background:'#F0EAE5' }} />}
                  </div>
                ))}
              </div>
              {/* Main image */}
              <div style={{ flex:1,aspectRatio:'3/4',borderRadius:'4px',overflow:'hidden',background:'#F0EAE5',position:'relative' }}>
                {/* IMAGE: main product photo — 3:4 portrait ratio */}
                {product.images[activeImg]
                  ? <img src={product.images[activeImg]} alt={product.name} style={{ width:'100%',height:'100%',objectFit:'cover' }} />
                  : <div style={{ width:'100%',height:'100%',display:'flex',alignItems:'center',justifyContent:'center' }}>
                      <svg width="48" height="48" fill="none" stroke="#D4C5C0" strokeWidth="1" viewBox="0 0 24 24"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><path d="M21 15l-5-5L5 21"/></svg>
                    </div>
                }
                {product.discountPrice && (
                  <div style={{ position:'absolute',top:'14px',left:'14px',background:'var(--maroon)',color:'#fff',fontSize:'0.68rem',fontWeight:600,letterSpacing:'0.1em',padding:'4px 10px',borderRadius:'2px',textTransform:'uppercase' }}>
                    Sale
                  </div>
                )}
              </div>
            </div>

            {/* ── Product info ────────────────────────────────────── */}
            <div>
              <p style={{ fontSize:'0.72rem',letterSpacing:'0.12em',textTransform:'uppercase',color:'var(--maroon)',marginBottom:'8px' }}>{product.category.name}</p>
              <h1 style={{ fontFamily:"'Cormorant Garamond',serif",fontSize:'clamp(1.6rem,3vw,2.2rem)',fontWeight:600,color:'var(--charcoal)',marginBottom:'10px',lineHeight:1.2 }}>{product.name}</h1>

              {/* Rating */}
              <div className="flex items-center gap-2 mb-5">
                <StarRow n={Math.round(product.averageRating)} />
                <span style={{ fontSize:'0.78rem',color:'var(--muted)' }}>{product.averageRating} ({product.numReviews} reviews)</span>
                <Link to={`/products/${slug}/reviews`} style={{ fontSize:'0.72rem',color:'var(--maroon)',textDecoration:'none',marginLeft:'4px' }}
                  onMouseEnter={e=>e.currentTarget.style.textDecoration='underline'}
                  onMouseLeave={e=>e.currentTarget.style.textDecoration='none'}>
                  Read all
                </Link>
              </div>

              {/* Price */}
              <div className="flex items-baseline gap-3 mb-6 pb-6" style={{ borderBottom:'1px solid var(--border)' }}>
                {product.discountPrice ? (
                  <>
                    <span style={{ fontFamily:"'Cormorant Garamond',serif",fontSize:'1.8rem',fontWeight:700,color:'var(--maroon)' }}>LKR {product.discountPrice}</span>
                    <span style={{ fontFamily:"'Cormorant Garamond',serif",fontSize:'1.2rem',color:'var(--muted)',textDecoration:'line-through' }}>LKR {product.price}</span>
                    <span style={{ fontSize:'0.72rem',fontWeight:600,color:'#276749',background:'rgba(56,161,105,.1)',padding:'3px 8px',borderRadius:'99px' }}>
                      {Math.round((1 - product.discountPrice / product.price) * 100)}% off
                    </span>
                  </>
                ) : (
                  <span style={{ fontFamily:"'Cormorant Garamond',serif",fontSize:'1.8rem',fontWeight:700,color:'var(--charcoal)' }}>LKR {product.price}</span>
                )}
              </div>

              {/* Color selector */}
              {colors.length > 0 && (
                <div className="mb-5">
                  <p style={{ fontSize:'0.72rem',letterSpacing:'0.1em',textTransform:'uppercase',color:'var(--muted)',marginBottom:'10px' }}>
                    Color — <span style={{ color:'var(--charcoal)',fontWeight:500 }}>{selColor}</span>
                  </p>
                  <div className="flex gap-2 flex-wrap">
                    {colors.map(c => (
                      <button key={c} className={`variant-btn${selColor === c ? ' active' : ''}`} onClick={() => { setSelColor(c); setSelSize(''); }}>{c}</button>
                    ))}
                  </div>
                </div>
              )}

              {/* Size selector */}
              {sizes.length > 0 && (
                <div className="mb-5">
                  <div className="flex items-center justify-between mb-2">
                    <p style={{ fontSize:'0.72rem',letterSpacing:'0.1em',textTransform:'uppercase',color:'var(--muted)' }}>
                      Size {selSize && <span style={{ color:'var(--charcoal)',fontWeight:500 }}>— {selSize}</span>}
                    </p>
                    <button
                      onClick={() => setShowSizeGuide(true)}
                      style={{ fontSize:'0.68rem',color:'var(--maroon)',background:'none',border:'none',cursor:'pointer',letterSpacing:'0.06em',textTransform:'uppercase',textDecoration:'underline',padding:0 }}>
                      Size Guide
                    </button>
                  </div>
                  <div className="flex gap-2 flex-wrap">
                    {sizes.map(s => {
                      const v = product.variants.find(v => (!selColor || v.color === selColor) && v.size === s);
                      const outOfStock = v ? v.stock === 0 : false;
                      return (
                        <button key={s} className={`variant-btn${selSize === s ? ' active' : ''}`}
                          onClick={() => !outOfStock && setSelSize(s)}
                          style={{ opacity: outOfStock ? 0.4 : 1, cursor: outOfStock ? 'not-allowed' : 'pointer', position:'relative' }}>
                          {s}
                          {outOfStock && <span style={{ fontSize:'0.55rem',position:'absolute',top:'-1px',right:'-1px',background:'#C53030',color:'#fff',padding:'1px 3px',borderRadius:'2px' }}>Out</span>}
                        </button>
                      );
                    })}
                  </div>
                  {!selSize && <p style={{ fontSize:'0.7rem',color:'#C05621',marginTop:'6px' }}>Please select a size to continue.</p>}
                </div>
              )}

              {/* Stock message */}
              {stock !== null && (
                <p style={{ fontSize:'0.72rem',color: stock === 0 ? '#C53030' : stock <= 3 ? '#C05621' : '#276749', marginBottom:'16px' }}>
                  {stock === 0 ? 'Out of stock' : stock <= 3 ? `Only ${stock} left` : 'In stock'}
                </p>
              )}

              {/* Qty + Add to cart */}
              <div className="flex items-center gap-3 mb-3">
                <div className="flex items-center gap-0">
                  <button className="qty-btn" style={{ borderRadius:'3px 0 0 3px' }} onClick={() => setQty(q => Math.max(1, q-1))}>−</button>
                  <div style={{ width:'44px',height:'36px',border:'1px solid var(--border)',borderLeft:'none',borderRight:'none',display:'flex',alignItems:'center',justifyContent:'center',fontSize:'0.88rem',color:'var(--charcoal)' }}>{qty}</div>
                  <button className="qty-btn" style={{ borderRadius:'0 3px 3px 0' }} onClick={() => setQty(q => stock ? Math.min(stock, q+1) : q+1)}>+</button>
                </div>
                <button className="btn-primary" style={{ flex:1 }} onClick={handleAddToCart} disabled={!inStock}>
                  {!inStock ? 'Out of Stock' : 'Add to Cart'}
                </button>
              </div>

              {addedMsg && (
                <div className="mb-3 px-4 py-2 rounded-sm flex items-center gap-2 text-sm" style={{
                  background: addedMsg.startsWith('⚠') ? 'rgba(221,107,32,.08)' : 'rgba(56,161,105,.1)',
                  color:      addedMsg.startsWith('⚠') ? '#C05621' : '#276749',
                  border:     addedMsg.startsWith('⚠') ? '1px solid rgba(221,107,32,.25)' : '1px solid rgba(56,161,105,.25)',
                }}>
                  {addedMsg.startsWith('⚠')
                    ? <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
                    : <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"/></svg>
                  }
                  {addedMsg.replace('⚠ ', '')}
                </div>
              )}

              <button className="btn-wishlist" onClick={handleToggleSave} disabled={saveLoading}>
                <svg width="15" height="15" viewBox="0 0 24 24" fill={saved?'currentColor':'none'} stroke="currentColor" strokeWidth="1.8">
                  <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/>
                </svg>
                {saved ? 'Saved to Wishlist' : 'Save to Wishlist'}
              </button>

              {/* Tags */}
              {product.tags?.length > 0 && (
                <div className="flex items-center gap-2 mt-5 flex-wrap">
                  <span style={{ fontSize:'0.68rem',color:'var(--muted)',textTransform:'uppercase',letterSpacing:'0.1em' }}>Tags:</span>
                  {product.tags.map(tag => (
                    <span key={tag} style={{ fontSize:'0.68rem',color:'var(--muted)',background:'#F0EAE5',padding:'3px 10px',borderRadius:'99px' }}>{tag}</span>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* ── Tabs: Description / Reviews ──────────────────────── */}
          <div className="mt-14">
            <div style={{ borderBottom:'1px solid var(--border)',marginBottom:'28px',display:'flex',gap:0 }}>
              {['description','reviews'].map(t => (
                <button key={t} className={`tab-btn${tab === t ? ' active' : ''}`} onClick={() => setTab(t)}>
                  {t === 'description' ? 'Description' : `Reviews (${product.numReviews})`}
                </button>
              ))}
            </div>

            {tab === 'description' ? (
              <div className="max-w-2xl" style={{ fontSize:'0.88rem',color:'var(--charcoal)',lineHeight:1.9 }}>
                <p>{product.description}</p>
              </div>
            ) : (
              <div className="max-w-2xl">
                {reviews.map(r => (
                  <div key={r._id} className="review-item">
                    <div className="flex items-center justify-between mb-2">
                      <div>
                        <p style={{ fontSize:'0.85rem',fontWeight:500,color:'var(--charcoal)',marginBottom:'4px' }}>{r.user.name}</p>
                        <StarRow n={r.rating} size={13} />
                      </div>
                      <span style={{ fontSize:'0.72rem',color:'var(--muted)' }}>{fmtDate(r.createdAt)}</span>
                    </div>
                    <p style={{ fontSize:'0.85rem',color:'var(--charcoal)',lineHeight:1.7,marginTop:'8px' }}>{r.comment}</p>
                  </div>
                ))}
                <Link to={`/products/${slug}/reviews`} style={{ display:'inline-block',marginTop:'16px',fontSize:'0.75rem',letterSpacing:'0.1em',textTransform:'uppercase',color:'var(--maroon)',textDecoration:'none',borderBottom:'1px solid var(--maroon)',paddingBottom:'2px' }}>
                  See all reviews →
                </Link>
              </div>
            )}
          </div>

          {/* ── Related Products ─────────────────────────────────── */}
          <div className="mt-16">
            <h2 style={{ fontFamily:"'Cormorant Garamond',serif",fontSize:'1.5rem',fontWeight:600,color:'var(--charcoal)',marginBottom:'24px' }}>You May Also Like</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {related.map(p => (
                <Link key={p._id} to={`/products/${p.slug}`} style={{ textDecoration:'none' }}>
                  <div className="related-card">
                    {/* IMAGE: related product — 3:4 portrait */}
                    <div style={{ overflow:'hidden',aspectRatio:'3/4',background:'#F0EAE5' }}>
                      {p.images[0]
                        ? <img src={p.images[0]} alt={p.name} className="rel-img" />
                        : <div style={{ width:'100%',height:'100%',display:'flex',alignItems:'center',justifyContent:'center' }}>
                            <svg width="24" height="24" fill="none" stroke="#D4C5C0" strokeWidth="1.2" viewBox="0 0 24 24"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><path d="M21 15l-5-5L5 21"/></svg>
                          </div>
                      }
                    </div>
                    <div style={{ padding:'12px 14px 14px' }}>
                      <p style={{ fontSize:'0.62rem',color:'var(--muted)',textTransform:'uppercase',letterSpacing:'0.08em',marginBottom:'3px' }}>{p.category.name}</p>
                      <p style={{ fontSize:'0.82rem',fontWeight:500,color:'var(--charcoal)',marginBottom:'5px',lineHeight:1.3 }}>{p.name}</p>
                      <div className="flex items-center gap-2">
                        {p.discountPrice
                          ? <><span style={{ fontFamily:"'Cormorant Garamond',serif",fontSize:'0.95rem',fontWeight:600,color:'var(--maroon)' }}>LKR {p.discountPrice}</span><span style={{ fontSize:'0.72rem',color:'var(--muted)',textDecoration:'line-through' }}>LKR {p.price}</span></>
                          : <span style={{ fontFamily:"'Cormorant Garamond',serif",fontSize:'0.95rem',fontWeight:600,color:'var(--charcoal)' }}>LKR {p.price}</span>
                        }
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Size Guide Modal */}
      {showSizeGuide && (
        <div className="fixed inset-0 z-50 flex items-center justify-center" style={{ background:'rgba(0,0,0,0.45)' }} onClick={() => setShowSizeGuide(false)}>
          <div onClick={e => e.stopPropagation()} style={{ background:'#fff', borderRadius:'4px', padding:'36px 32px', maxWidth:'520px', width:'90%', maxHeight:'80vh', overflowY:'auto' }}>
            <div className="flex items-center justify-between mb-6">
              <h3 style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:'1.4rem', fontWeight:600, color:'var(--charcoal)' }}>Size Guide</h3>
              <button onClick={() => setShowSizeGuide(false)} style={{ background:'none', border:'none', cursor:'pointer', color:'var(--muted)', fontSize:'1.2rem', lineHeight:1 }}>✕</button>
            </div>
            <p style={{ fontSize:'0.78rem', color:'var(--muted)', marginBottom:'20px', lineHeight:1.7 }}>
              All measurements are in centimetres. Measure yourself and compare to the chart below for the best fit.
            </p>
            <table style={{ width:'100%', borderCollapse:'collapse', fontSize:'0.8rem', color:'var(--charcoal)' }}>
              <thead>
                <tr style={{ borderBottom:'2px solid var(--border)', background:'#FAF7F4' }}>
                  {['Size','Chest','Waist','Hips','Length'].map(h => (
                    <th key={h} style={{ padding:'10px 12px', textAlign:'left', fontWeight:500, fontSize:'0.68rem', letterSpacing:'0.08em', textTransform:'uppercase', color:'var(--muted)' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {[
                  ['XS','80–84','62–66','88–92','56'],
                  ['S', '84–88','66–70','92–96','57'],
                  ['M', '88–94','70–76','96–102','58'],
                  ['L', '94–100','76–82','102–108','59'],
                  ['XL','100–108','82–90','108–116','60'],
                  ['XXL','108–116','90–98','116–124','61'],
                ].map(([size, ...rest], i) => (
                  <tr key={size} style={{ borderBottom:'1px solid var(--border)', background: i % 2 === 0 ? '#fff' : '#FDFAF8' }}>
                    <td style={{ padding:'10px 12px', fontWeight:600, color:'var(--maroon)' }}>{size}</td>
                    {rest.map((v, j) => <td key={j} style={{ padding:'10px 12px' }}>{v}</td>)}
                  </tr>
                ))}
              </tbody>
            </table>
            <p style={{ fontSize:'0.72rem', color:'var(--muted)', marginTop:'16px', lineHeight:1.6 }}>
              <strong style={{ color:'var(--charcoal)' }}>Tip:</strong> If you're between sizes, we recommend sizing up for a more relaxed fit.
            </p>
          </div>
        </div>
      )}

      <Footer />
    </>
  );
}