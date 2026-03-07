import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import Header from '../../components/layout/Header';
import Footer from '../../components/layout/Footer';

const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;0,700;1,300;1,400&family=Jost:wght@300;400;500&display=swap');
  :root { --maroon:#6B1B2A;--maroon-dark:#4A1019;--maroon-soft:#8B2535;--cream:#FAF7F4;--charcoal:#1C1C1E;--muted:#7A7A7A;--border:#E8E0D8; }

  /* ── Hero / Carousel ──────────────────────────────────────────── */
  .hero { position:relative;height:92vh;min-height:580px;display:flex;align-items:flex-end;overflow:hidden; }
  .hero-overlay { position:absolute;inset:0;background:linear-gradient(to top,rgba(26,8,16,0.78) 0%,rgba(26,8,16,0.25) 55%,transparent 100%);z-index:1;pointer-events:none; }
  .hero-content { position:relative;z-index:2;padding:0 6% 8%; }

  .carousel-track { position:absolute;inset:0;display:flex;transition:transform .9s cubic-bezier(.77,0,.175,1); }
  .carousel-slide { min-width:100%;height:100%;flex-shrink:0; }
  .carousel-slide img { width:100%;height:100%;object-fit:cover;object-position:center;display:block; }
  .slide-bg { width:100%;height:100%; }

  .carousel-dots { position:absolute;bottom:32px;left:6%;z-index:3;display:flex;gap:8px;align-items:center; }
  .dot { width:6px;height:6px;border-radius:50%;background:rgba(255,255,255,.3);border:none;cursor:pointer;padding:0;transition:all .35s ease; }
  .dot.active { background:#fff;width:24px;border-radius:3px; }

  .carousel-arrow { position:absolute;top:50%;transform:translateY(-50%);z-index:3;width:46px;height:46px;border-radius:50%;background:rgba(255,255,255,.1);border:1px solid rgba(255,255,255,.2);cursor:pointer;display:flex;align-items:center;justify-content:center;transition:all .2s;backdrop-filter:blur(6px); }
  .carousel-arrow:hover { background:rgba(255,255,255,.22);border-color:rgba(255,255,255,.45); }
  .carousel-arrow.prev { left:20px; }
  .carousel-arrow.next { right:20px; }

  .slide-counter { position:absolute;top:32px;right:6%;z-index:3;font-family:'Jost',sans-serif;font-size:0.7rem;color:rgba(255,255,255,.45);letter-spacing:0.14em; }

  .hero-text { animation:textIn .7s .15s ease both; }
  @keyframes textIn { from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:translateY(0)} }

  /* ── Rest of page ─────────────────────────────────────────────── */
  .section-title { font-family:'Cormorant Garamond',serif;font-size:clamp(1.8rem,3vw,2.4rem);font-weight:600;color:var(--charcoal);margin-bottom:6px; }

  .product-card { background:#fff;border:1px solid var(--border);border-radius:4px;overflow:hidden;transition:border-color .25s,box-shadow .25s;position:relative; }
  .product-card:hover { border-color:#C4A8A8;box-shadow:0 8px 32px rgba(107,27,42,.1); }
  .product-card:hover .card-img { transform:scale(1.04); }
  .card-img-wrap { overflow:hidden;aspect-ratio:3/4;background:#F0EAE5; }
  .card-img { width:100%;height:100%;object-fit:cover;display:block;transition:transform .5s ease; }

  .wishlist-btn { position:absolute;top:12px;right:12px;width:32px;height:32px;border-radius:50%;background:rgba(255,255,255,.9);border:none;cursor:pointer;display:flex;align-items:center;justify-content:center;transition:all .2s;box-shadow:0 1px 4px rgba(0,0,0,.1);opacity:0; }
  .product-card:hover .wishlist-btn { opacity:1; }

  .cat-card { position:relative;overflow:hidden;border-radius:4px;cursor:pointer;aspect-ratio:4/5;display:block; }
  .cat-card img { width:100%;height:100%;object-fit:cover;transition:transform .5s ease; }
  .cat-card:hover img { transform:scale(1.06); }
  .cat-overlay { position:absolute;inset:0;background:linear-gradient(to top,rgba(26,8,16,0.7) 0%,transparent 60%); }
  .cat-label { position:absolute;bottom:0;left:0;right:0;padding:20px 18px; }

  .btn-outline-light { display:inline-block;padding:11px 28px;border:1px solid rgba(255,255,255,.6);color:#fff;border-radius:3px;font-family:'Jost',sans-serif;font-size:0.72rem;letter-spacing:0.15em;text-transform:uppercase;text-decoration:none;transition:all .25s; }
  .btn-outline-light:hover { background:#fff;color:var(--charcoal); }
  .btn-maroon { display:inline-block;padding:11px 28px;background:var(--maroon);color:#fff;border-radius:3px;font-family:'Jost',sans-serif;font-size:0.72rem;letter-spacing:0.15em;text-transform:uppercase;text-decoration:none;transition:background .2s;border:none;cursor:pointer; }
  .btn-maroon:hover { background:var(--maroon-soft); }
  .btn-outline-dark { display:inline-block;padding:11px 28px;border:1px solid var(--maroon);color:var(--maroon);border-radius:3px;font-family:'Jost',sans-serif;font-size:0.72rem;letter-spacing:0.15em;text-transform:uppercase;text-decoration:none;transition:all .2s; }
  .btn-outline-dark:hover { background:var(--maroon);color:#fff; }

  .promo-strip { background:var(--maroon-dark);padding:64px 6%; }
  .testimonial-card { background:#fff;border:1px solid var(--border);border-radius:4px;padding:28px; }
`;

// ─── Carousel slides ──────────────────────────────────────────────────────────
// Add your 5 photos to /public/ and update src paths.
// Each slide has its own heading and subtitle that animates in.
const SLIDES = [
  {
    src: '/hero-1.jpg',
    fallback: '#3D0A14',
    label: 'New Arrivals — Spring 2026',
    heading: <>Curated for the<br /><em>discerning</em> few</>,
    sub: 'Handpicked luxury fashion and accessories. Every piece tells a story of craftsmanship and elegance.',
  },
  {
    src: '/hero-2.jpg',
    fallback: '#2A0A18',
    label: 'Fine Jewelry',
    heading: <>Adorn yourself<br />with <em>intention</em></>,
    sub: 'Delicate pieces crafted from ethically sourced materials, designed to be treasured forever.',
  },
  {
    src: '/hero-3.jpg',
    fallback: '#1A0810',
    label: 'Bags & Accessories',
    heading: <>The art of<br /><em>understated</em> luxury</>,
    sub: 'Impeccably crafted bags and accessories that elevate every look, every day.',
  },
  {
    src: '/hero-4.jpg',
    fallback: '#350C1A',
    label: 'New In',
    heading: <>Where fashion<br />meets <em>craftsmanship</em></>,
    sub: 'Every thread chosen with care. Every silhouette shaped with purpose and intention.',
  },
];

const FEATURED = [
  { _id:'p1', name:'Silk Draped Blouse',  slug:'silk-draped-blouse',  price:89,  discountPrice:69,  images:[''], category:{ name:'Tops'    } },
  { _id:'p2', name:'Maroon Leather Tote', slug:'maroon-leather-tote', price:145, discountPrice:null, images:[''], category:{ name:'Bags'    } },
  { _id:'p3', name:'Gold Hoop Earrings',  slug:'gold-hoop-earrings',  price:42,  discountPrice:null, images:[''], category:{ name:'Jewelry' } },
  { _id:'p4', name:'Pearl Drop Necklace', slug:'pearl-drop-necklace', price:80,  discountPrice:64,  images:[''], category:{ name:'Jewelry' } },
];

const CATEGORIES = [
  { name:'Accessories', slug:'accessories', image:'accessories.jpg' },
  { name:'Makeup',        slug:'makeup',        image:'makeup.jpg' },
  { name:'Jewelry',     slug:'jewelry',     image:'Jewelry.jpg' },
  { name:'Clothing',    slug:'clothing',    image:'clothing.png' },
];

const TESTIMONIALS = [
  { name:'Amara S.',  rating:5, text:'Absolutely love CEILO! The quality is unmatched and every piece feels luxurious.' },
  { name:'Priya M.',  rating:5, text:'Beautiful packaging, fast delivery, and the silk blouse is stunning in person.' },
  { name:'Kavya P.',  rating:5, text:'CEILO never disappoints. Already on my third order and each one has been perfect.' },
];

const StarRow = ({ n }) => (
  <div className="flex gap-0.5 mb-3">
    {[1,2,3,4,5].map(i => (
      <svg key={i} width="13" height="13" viewBox="0 0 24 24"
        fill={i<=n?'#6B1B2A':'none'} stroke={i<=n?'#6B1B2A':'#D4C5C0'} strokeWidth="1.5">
        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
      </svg>
    ))}
  </div>
);

export default function ProductHome() {
  const [current, setCurrent]       = useState(0);
  const [paused, setPaused]         = useState(false);
  const [savedItems, setSavedItems] = useState([]);
  const total = SLIDES.length;

  const next = useCallback(() => setCurrent(c => (c + 1) % total), [total]);
  const prev = useCallback(() => setCurrent(c => (c - 1 + total) % total), [total]);

  // Auto-advance every 5s, pause on hover
  useEffect(() => {
    if (paused) return;
    const id = setInterval(next, 5000);
    return () => clearInterval(id);
  }, [paused, next]);

  const toggleSave = id => setSavedItems(p => p.includes(id) ? p.filter(i => i !== id) : [...p, id]);
  const slide = SLIDES[current];

  return (
    <>
      <style>{STYLES}</style>
      <Header />
      <div style={{ background:'var(--cream)', fontFamily:"'Jost',sans-serif" }}>

        {/* ── HERO CAROUSEL ────────────────────────────────────────── */}
        <section
          className="hero"
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
        >
          {/* Sliding track — all slides sit side by side, we move with translateX */}
          <div
            className="carousel-track"
            style={{ transform:`translateX(-${current * 100}%)` }}
          >
            {SLIDES.map((s, i) => (
              <div key={i} className="carousel-slide">
                {/* IMAGE: drop hero-1.jpg … hero-5.jpg into /public/ */}
                {s.src
                  ? <img src={s.src} alt={`Slide ${i + 1}`} />
                  : <div className="slide-bg" style={{ background: s.fallback }} />
                }
              </div>
            ))}
          </div>

          {/* Gradient overlay */}
          <div className="hero-overlay" />

          {/* Slide counter */}
          <div className="slide-counter">
            {String(current + 1).padStart(2,'0')} / {String(total).padStart(2,'0')}
          </div>

          {/* Prev arrow */}
          <button className="carousel-arrow prev" onClick={prev} aria-label="Previous">
            <svg width="18" height="18" fill="none" stroke="#fff" strokeWidth="2" viewBox="0 0 24 24">
              <path d="M15 18l-6-6 6-6"/>
            </svg>
          </button>

          {/* Next arrow */}
          <button className="carousel-arrow next" onClick={next} aria-label="Next">
            <svg width="18" height="18" fill="none" stroke="#fff" strokeWidth="2" viewBox="0 0 24 24">
              <path d="M9 18l6-6-6-6"/>
            </svg>
          </button>

          {/* Dot indicators */}
          <div className="carousel-dots">
            {SLIDES.map((_, i) => (
              <button
                key={i}
                className={`dot${current === i ? ' active' : ''}`}
                onClick={() => setCurrent(i)}
                aria-label={`Slide ${i + 1}`}
              />
            ))}
          </div>

          {/* Text content — key re-triggers animation on each slide change */}
          <div className="hero-content">
            <div key={current} className="hero-text">
              <p style={{ fontSize:'0.72rem',letterSpacing:'0.2em',textTransform:'uppercase',color:'rgba(255,255,255,.6)',marginBottom:'14px' }}>
                {slide.label}
              </p>
              <h1 style={{ fontFamily:"'Cormorant Garamond',serif",fontSize:'clamp(2.6rem,6vw,5rem)',fontWeight:300,color:'#fff',lineHeight:1.1,marginBottom:'20px',maxWidth:'620px' }}>
                {slide.heading}
              </h1>
              <p style={{ fontSize:'0.85rem',color:'rgba(255,255,255,.65)',maxWidth:'380px',lineHeight:1.8,marginBottom:'32px' }}>
                {slide.sub}
              </p>
              <div className="flex gap-4 flex-wrap">
                <Link to="/products" className="btn-maroon">Shop Now</Link>
                <button
  className="btn-outline-light"
  onClick={() => document.getElementById('reviews')?.scrollIntoView({ behavior:'smooth' })}
>
  Our Reviews
</button>
              </div>
            </div>
          </div>
        </section>

        {/* ── FEATURED PRODUCTS ─────────────────────────────────────── */}
        <section style={{ padding:'72px 6%' }}>
          <div className="flex items-end justify-between mb-10">
            <div>
              <p style={{ fontSize:'0.72rem',letterSpacing:'0.15em',textTransform:'uppercase',color:'var(--maroon)',marginBottom:'6px' }}>Handpicked</p>
              <h2 className="section-title" style={{ marginBottom:0 }}>Featured Pieces</h2>
            </div>
            <Link to="/products" className="btn-outline-dark" style={{ whiteSpace:'nowrap' }}>View All</Link>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {FEATURED.map(product => (
              <div key={product._id} className="product-card">
                <button className="wishlist-btn" onClick={() => toggleSave(product._id)}>
                  <svg width="15" height="15" viewBox="0 0 24 24"
                    fill={savedItems.includes(product._id)?'#6B1B2A':'none'} stroke="#6B1B2A" strokeWidth="1.8">
                    <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/>
                  </svg>
                </button>
                <Link to={`/products/${product.slug}`}>
                  {/* IMAGE: product photo — 3:4 portrait ratio */}
                  <div className="card-img-wrap">
                    {product.images[0]
                      ? <img src={product.images[0]} alt={product.name} className="card-img" />
                      : <div style={{ width:'100%',height:'100%',display:'flex',alignItems:'center',justifyContent:'center',background:'#F0EAE5' }}>
                          <svg width="32" height="32" fill="none" stroke="#D4C5C0" strokeWidth="1.2" viewBox="0 0 24 24"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><path d="M21 15l-5-5L5 21"/></svg>
                        </div>
                    }
                  </div>
                </Link>
                <div style={{ padding:'14px 16px 18px' }}>
                  <p style={{ fontSize:'0.65rem',color:'var(--muted)',letterSpacing:'0.08em',textTransform:'uppercase',marginBottom:'4px' }}>{product.category?.name}</p>
                  <Link to={`/products/${product.slug}`} style={{ textDecoration:'none' }}>
                    <p style={{ fontSize:'0.9rem',fontWeight:500,color:'var(--charcoal)',marginBottom:'8px',lineHeight:1.3 }}>{product.name}</p>
                  </Link>
                  <div className="flex items-center gap-2">
                    {product.discountPrice ? (
                      <>
                        <span style={{ fontFamily:"'Cormorant Garamond',serif",fontSize:'1.05rem',fontWeight:600,color:'var(--maroon)' }}>${product.discountPrice}</span>
                        <span style={{ fontSize:'0.78rem',color:'var(--muted)',textDecoration:'line-through' }}>${product.price}</span>
                      </>
                    ) : (
                      <span style={{ fontFamily:"'Cormorant Garamond',serif",fontSize:'1.05rem',fontWeight:600,color:'var(--charcoal)' }}>${product.price}</span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── PROMO STRIP ───────────────────────────────────────────── */}
        <section className="promo-strip">
          <div className="max-w-3xl mx-auto text-center">
            <p style={{ fontSize:'0.72rem',letterSpacing:'0.2em',textTransform:'uppercase',color:'rgba(255,255,255,.5)',marginBottom:'16px' }}>The CEILO Promise</p>
            <h2 style={{ fontFamily:"'Cormorant Garamond',serif",fontSize:'clamp(1.8rem,4vw,3rem)',fontWeight:300,color:'#fff',lineHeight:1.3,marginBottom:'20px' }}>
              <em>Every piece</em> is curated with intention.<br />Every detail, deliberate.
            </h2>
            <p style={{ fontSize:'0.82rem',color:'rgba(255,255,255,.55)',lineHeight:1.8,maxWidth:'500px',margin:'0 auto 32px' }}>
              We source only the finest materials from trusted artisans. Free shipping on orders over $75. Easy returns within 30 days.
            </p>
            <Link to="/products" className="btn-outline-light">Explore the Collection</Link>
          </div>
        </section>

        {/* ── SHOP BY CATEGORY ──────────────────────────────────────── */}
        <section id="categories" style={{ padding:'72px 6%' }}>
          <div className="text-center mb-10">
            <p style={{ fontSize:'0.72rem',letterSpacing:'0.15em',textTransform:'uppercase',color:'var(--maroon)',marginBottom:'6px' }}>Browse</p>
            <h2 className="section-title">Shop by Category</h2>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {CATEGORIES.map(cat => (
              <Link key={cat.slug} to={`/category/${cat.slug}`} className="cat-card">
                {/* IMAGE: category photo — portrait 4:5 ratio */}
                {cat.image
                  ? <img src={cat.image} alt={cat.name} />
                  : <div style={{ width:'100%',height:'100%',background:'linear-gradient(135deg,var(--maroon-dark),var(--maroon-soft))',display:'flex',alignItems:'center',justifyContent:'center' }}>
                      <span style={{ fontFamily:"'Cormorant Garamond',serif",fontSize:'2rem',fontWeight:300,color:'rgba(255,255,255,.3)' }}>{cat.name[0]}</span>
                    </div>
                }
                <div className="cat-overlay" />
                <div className="cat-label">
                  <p style={{ fontFamily:"'Cormorant Garamond',serif",fontSize:'1.2rem',fontWeight:600,color:'#fff',marginBottom:'2px' }}>{cat.name}</p>
                  <p style={{ fontSize:'0.68rem',color:'rgba(255,255,255,.6)',letterSpacing:'0.1em',textTransform:'uppercase' }}>Shop →</p>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* ── TESTIMONIALS ──────────────────────────────────────────── */}
        <section id="reviews" style={{ padding:'72px 6%', background:'#fff', borderTop:'1px solid var(--border)' }}>
          <div className="text-center mb-10">
            <p style={{ fontSize:'0.72rem',letterSpacing:'0.15em',textTransform:'uppercase',color:'var(--maroon)',marginBottom:'6px' }}>Community</p>
            <h2 className="section-title">Loved by Our Customers</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 max-w-5xl mx-auto">
            {TESTIMONIALS.map((t, i) => (
              <div key={i} className="testimonial-card">
                <StarRow n={t.rating} />
                <p style={{ fontSize:'0.88rem',color:'var(--charcoal)',lineHeight:1.75,marginBottom:'16px',fontStyle:'italic' }}>"{t.text}"</p>
                <p style={{ fontSize:'0.75rem',fontWeight:500,color:'var(--maroon)',letterSpacing:'0.05em' }}>— {t.name}</p>
              </div>
            ))}
          </div>
          <div className="text-center mt-10">
            <Link to="/shop-reviews" className="btn-outline-dark">Read All Reviews</Link>
          </div>
        </section>

        {/* ── USP STRIP ─────────────────────────────────────────────── */}
        <section style={{ padding:'48px 6%', borderTop:'1px solid var(--border)' }}>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-5xl mx-auto text-center">
            {[
              { icon:'M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8', label:'Free Shipping',   sub:'On orders over $75' },
              { icon:'M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z', label:'Authentic Quality', sub:'Curated & verified' },
              { icon:'M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15', label:'Easy Returns', sub:'30-day hassle-free' },
              { icon:'M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z', label:'Dedicated Support', sub:"We're here for you" },
            ].map(({ icon, label, sub }) => (
              <div key={label}>
                <div style={{ width:'44px',height:'44px',borderRadius:'50%',background:'rgba(107,27,42,.08)',display:'flex',alignItems:'center',justifyContent:'center',margin:'0 auto 12px' }}>
                  <svg width="18" height="18" fill="none" stroke="var(--maroon)" strokeWidth="1.6" viewBox="0 0 24 24"><path d={icon}/></svg>
                </div>
                <p style={{ fontSize:'0.82rem',fontWeight:500,color:'var(--charcoal)',marginBottom:'3px' }}>{label}</p>
                <p style={{ fontSize:'0.72rem',color:'var(--muted)' }}>{sub}</p>
              </div>
            ))}
          </div>
        </section>

      </div>
      <Footer />
    </>
  );
}