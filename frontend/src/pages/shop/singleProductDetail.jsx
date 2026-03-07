import React, { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import Header from '../../components/layout/Header';
import Footer from '../../components/layout/Footer';
// import { getProductBySlug } from '../../api/productApi';
// import { saveItem, removeSavedItem } from '../../api/userApi';

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

// TODO: replace with real data from getProductBySlug(slug) API
const MOCK_PRODUCT = {
  _id:'p1', name:'Silk Draped Blouse', slug:'silk-draped-blouse',
  description:'Crafted from the finest mulberry silk, this draped blouse falls effortlessly over the body with an elegant fluidity. The relaxed silhouette is elevated by subtle gathering at the shoulders and a delicate tie detail at the waist. Perfect for both day and evening wear.',
  price:89, discountPrice:69,
  images:['','',''],
  category:{ _id:'c2', name:'Tops', slug:'tops' },
  tags:['silk','luxury','blouse'],
  variants:[
    { color:'Ivory', size:'XS', stock:3 },{ color:'Ivory', size:'S', stock:8 },{ color:'Ivory', size:'M', stock:5 },
    { color:'Blush', size:'S',  stock:2 },{ color:'Blush', size:'M', stock:6 },{ color:'Blush', size:'L', stock:4 },
    { color:'Black', size:'M',  stock:0 },{ color:'Black', size:'L', stock:7 },
  ],
  averageRating:4.8, numReviews:12, isActive:true,
};

const MOCK_REVIEWS = [
  { _id:'rv1', user:{ name:'Amara S.' }, rating:5, comment:'Absolutely beautiful. The silk is incredibly soft and the drape is perfect. Already ordered in another color!', createdAt:'2026-02-28' },
  { _id:'rv2', user:{ name:'Priya M.' }, rating:5, comment:'Fits true to size. Elegant and versatile — wore it to a dinner and received so many compliments.', createdAt:'2026-02-20' },
  { _id:'rv3', user:{ name:'Kavya P.' }, rating:4, comment:'Lovely quality. The ivory shade is more cream than pure white which actually photographs beautifully.', createdAt:'2026-02-10' },
];

const RELATED = [
  { _id:'p2',name:'Pearl Drop Necklace', slug:'pearl-drop-necklace', price:80, discountPrice:64, images:[''], category:{ name:'Jewelry' } },
  { _id:'p3',name:'Chain Belt',          slug:'chain-belt',          price:55, discountPrice:null,images:[''], category:{ name:'Accessories' } },
  { _id:'p4',name:'Satin Slip Dress',    slug:'satin-slip-dress',    price:130,discountPrice:99, images:[''], category:{ name:'Tops' } },
  { _id:'p5',name:'Velvet Clutch',       slug:'velvet-clutch',       price:95, discountPrice:75, images:[''], category:{ name:'Bags' } },
];

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
  const { slug } = useParams();
  const product  = MOCK_PRODUCT; // TODO: fetch by slug

  const colors  = [...new Set(product.variants.map(v => v.color))];
  const sizes   = [...new Set(product.variants.map(v => v.size))];

  const [activeImg, setActiveImg]   = useState(0);
  const [selColor, setSelColor]     = useState(colors[0] || '');
  const [selSize, setSelSize]       = useState('');
  const [qty, setQty]               = useState(1);
  const [tab, setTab]               = useState('description');
  const [saved, setSaved]           = useState(false);
  const [addedMsg, setAddedMsg]     = useState('');

  const getStock = () => {
    if (!selColor || !selSize) return null;
    const v = product.variants.find(v => v.color === selColor && v.size === selSize);
    return v ? v.stock : null;
  };
  const stock = getStock();
  const inStock = stock === null ? true : stock > 0;

  const handleAddToCart = () => {
    if (!selSize) { alert('Please select a size.'); return; }
    // TODO: add to cart context / API
    console.log('Add to cart:', { product: product._id, color: selColor, size: selSize, qty });
    setAddedMsg('Added to cart!');
    setTimeout(() => setAddedMsg(''), 2500);
  };

  const fmtDate = d => new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

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
                    <span style={{ fontFamily:"'Cormorant Garamond',serif",fontSize:'1.8rem',fontWeight:700,color:'var(--maroon)' }}>${product.discountPrice}</span>
                    <span style={{ fontFamily:"'Cormorant Garamond',serif",fontSize:'1.2rem',color:'var(--muted)',textDecoration:'line-through' }}>${product.price}</span>
                    <span style={{ fontSize:'0.72rem',fontWeight:600,color:'#276749',background:'rgba(56,161,105,.1)',padding:'3px 8px',borderRadius:'99px' }}>
                      {Math.round((1 - product.discountPrice / product.price) * 100)}% off
                    </span>
                  </>
                ) : (
                  <span style={{ fontFamily:"'Cormorant Garamond',serif",fontSize:'1.8rem',fontWeight:700,color:'var(--charcoal)' }}>${product.price}</span>
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
                  <p style={{ fontSize:'0.72rem',letterSpacing:'0.1em',textTransform:'uppercase',color:'var(--muted)',marginBottom:'10px' }}>Size</p>
                  <div className="flex gap-2 flex-wrap">
                    {sizes.map(s => {
                      const v = product.variants.find(v => v.color === selColor && v.size === s);
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
                <div className="mb-3 px-4 py-2 rounded-sm flex items-center gap-2 text-sm" style={{ background:'rgba(56,161,105,.1)',color:'#276749',border:'1px solid rgba(56,161,105,.25)' }}>
                  <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"/></svg>
                  {addedMsg}
                </div>
              )}

              <button className="btn-wishlist" onClick={() => setSaved(p => !p)}>
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
                <ul className="mt-5" style={{ paddingLeft:'18px',display:'flex',flexDirection:'column',gap:'6px' }}>
                  <li>100% Mulberry Silk</li>
                  <li>Dry clean recommended</li>
                  <li>Model is 5'8" wearing size S</li>
                  <li>True to size — see size guide</li>
                </ul>
              </div>
            ) : (
              <div className="max-w-2xl">
                {MOCK_REVIEWS.map(r => (
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
              {RELATED.map(p => (
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
                          ? <><span style={{ fontFamily:"'Cormorant Garamond',serif",fontSize:'0.95rem',fontWeight:600,color:'var(--maroon)' }}>${p.discountPrice}</span><span style={{ fontSize:'0.72rem',color:'var(--muted)',textDecoration:'line-through' }}>${p.price}</span></>
                          : <span style={{ fontFamily:"'Cormorant Garamond',serif",fontSize:'0.95rem',fontWeight:600,color:'var(--charcoal)' }}>${p.price}</span>
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
      <Footer />
    </>
  );
}