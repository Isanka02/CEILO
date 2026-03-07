import React, { useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import Header from '../../components/layout/Header';
import Footer from '../../components/layout/Footer';
// import { getProducts } from '../../api/productApi';
// import { getCategories } from '../../api/categoryApi';

const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;600;700&family=Jost:wght@300;400;500&display=swap');
  :root { --maroon:#6B1B2A;--maroon-dark:#4A1019;--maroon-soft:#8B2535;--cream:#FAF7F4;--charcoal:#1C1C1E;--muted:#7A7A7A;--border:#E8E0D8; }
  .product-card { background:#fff;border:1px solid var(--border);border-radius:4px;overflow:hidden;transition:border-color .25s,box-shadow .25s;position:relative; }
  .product-card:hover { border-color:#C4A8A8;box-shadow:0 8px 28px rgba(107,27,42,.09); }
  .product-card:hover .card-img { transform:scale(1.04); }
  .card-img-wrap { overflow:hidden;aspect-ratio:3/4;background:#F0EAE5; }
  .card-img { width:100%;height:100%;object-fit:cover;display:block;transition:transform .5s ease; }
  .wishlist-btn { position:absolute;top:10px;right:10px;width:30px;height:30px;border-radius:50%;background:rgba(255,255,255,.92);border:none;cursor:pointer;display:flex;align-items:center;justify-content:center;transition:all .2s;box-shadow:0 1px 4px rgba(0,0,0,.1);opacity:0; }
  .product-card:hover .wishlist-btn { opacity:1; }
  .filter-label { font-size:0.7rem;letter-spacing:0.1em;text-transform:uppercase;color:var(--muted);display:block;margin-bottom:8px; }
  .filter-input { width:100%;padding:8px 12px;font-family:'Jost',sans-serif;font-size:0.82rem;background:#fff;border:1px solid var(--border);border-radius:3px;color:var(--charcoal);outline:none;transition:border-color .2s; }
  .filter-input:focus { border-color:var(--maroon); }
  .filter-check { display:flex;align-items:center;gap:8px;cursor:pointer;font-size:0.82rem;color:var(--charcoal);padding:4px 0; }
  .filter-check input { accent-color:var(--maroon);width:14px;height:14px; }
  .sort-select { padding:8px 14px;font-family:'Jost',sans-serif;font-size:0.78rem;background:#fff;border:1px solid var(--border);border-radius:3px;color:var(--charcoal);outline:none;cursor:pointer;appearance:none;padding-right:28px; }
  .badge { display:inline-flex;align-items:center;gap:5px;padding:4px 10px;border-radius:99px;font-size:0.68rem;background:rgba(107,27,42,.08);color:var(--maroon);cursor:pointer; }
  .badge:hover { background:rgba(107,27,42,.15); }
  .pagination-btn { width:34px;height:34px;border-radius:3px;border:1px solid var(--border);background:#fff;cursor:pointer;font-family:'Jost',sans-serif;font-size:0.78rem;color:var(--charcoal);transition:all .2s;display:flex;align-items:center;justify-content:center; }
  .pagination-btn.active { background:var(--maroon);border-color:var(--maroon);color:#fff; }
  .pagination-btn:hover:not(.active):not(:disabled) { border-color:var(--maroon);color:var(--maroon); }
  .pagination-btn:disabled { opacity:.4;cursor:not-allowed; }
`;

// TODO: replace with real data from API
const MOCK_CATEGORIES = [
  { _id:'c1',name:'Accessories' },{ _id:'c2',name:'Tops' },{ _id:'c3',name:'Bags' },{ _id:'c4',name:'Jewelry' },
];
const MOCK_PRODUCTS = Array.from({ length: 12 }, (_, i) => ({
  _id: `p${i+1}`,
  name: ['Silk Draped Blouse','Maroon Leather Tote','Gold Hoop Earrings','Pearl Drop Necklace','Cashmere Wrap Scarf','Velvet Clutch','Diamond Stud Earrings','Leather Crossbody','Satin Slip Dress','Chain Belt','Suede Ankle Boots','Crystal Bracelet'][i],
  slug: ['silk-draped-blouse','maroon-leather-tote','gold-hoop-earrings','pearl-drop-necklace','cashmere-wrap-scarf','velvet-clutch','diamond-stud-earrings','leather-crossbody','satin-slip-dress','chain-belt','suede-ankle-boots','crystal-bracelet'][i],
  price: [89,145,42,80,120,95,210,165,130,55,175,68][i],
  discountPrice: [69,null,null,64,null,75,null,null,99,null,null,null][i],
  images: [''],
  category: { _id: ['c2','c3','c4','c4','c1','c3','c4','c3','c2','c1','c1','c4'][i], name: ['Tops','Bags','Jewelry','Jewelry','Accessories','Bags','Jewelry','Bags','Tops','Accessories','Accessories','Jewelry'][i] },
  averageRating: [4.8,4.5,4.9,4.7,4.6,4.3,5.0,4.4,4.7,4.1,4.6,4.8][i],
}));

const StarMini = ({ rating }) => (
  <div className="flex items-center gap-0.5">
    {[1,2,3,4,5].map(i => (
      <svg key={i} width="10" height="10" viewBox="0 0 24 24" fill={i<=Math.round(rating)?'#6B1B2A':'none'} stroke={i<=Math.round(rating)?'#6B1B2A':'#D4C5C0'} strokeWidth="1.5">
        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
      </svg>
    ))}
    <span style={{ fontSize:'0.65rem',color:'var(--muted)',marginLeft:'3px' }}>{rating}</span>
  </div>
);

export default function ProductList() {
  const [searchParams] = useSearchParams();
  const [sort, setSort]             = useState('newest');
  const [selectedCats, setSelectedCats] = useState([]);
  const [minPrice, setMinPrice]     = useState('');
  const [maxPrice, setMaxPrice]     = useState('');
  const [keyword, setKeyword]       = useState(searchParams.get('keyword') || '');
  const [page, setPage]             = useState(1);
  const [savedItems, setSavedItems] = useState([]);
  const [mobileFilter, setMobileFilter] = useState(false);
  const LIMIT = 8;

  const toggleCat = id => setSelectedCats(p => p.includes(id) ? p.filter(c => c !== id) : [...p, id]);
  const toggleSave = id => setSavedItems(p => p.includes(id) ? p.filter(i => i !== id) : [...p, id]);

  const filtered = MOCK_PRODUCTS.filter(p => {
    if (keyword && !p.name.toLowerCase().includes(keyword.toLowerCase())) return false;
    if (selectedCats.length && !selectedCats.includes(p.category._id)) return false;
    if (minPrice && p.price < Number(minPrice)) return false;
    if (maxPrice && p.price > Number(maxPrice)) return false;
    return true;
  }).sort((a, b) => {
    if (sort === 'price_asc')  return a.price - b.price;
    if (sort === 'price_desc') return b.price - a.price;
    if (sort === 'popular')    return b.averageRating - a.averageRating;
    return 0;
  });

  const pages   = Math.ceil(filtered.length / LIMIT);
  const visible = filtered.slice((page - 1) * LIMIT, page * LIMIT);
  const activeFilters = [...selectedCats.map(id => MOCK_CATEGORIES.find(c => c._id === id)?.name).filter(Boolean), ...(minPrice || maxPrice ? [`$${minPrice||0}–$${maxPrice||'∞'}`] : [])];

  const clearAll = () => { setSelectedCats([]); setMinPrice(''); setMaxPrice(''); setKeyword(''); setPage(1); };

  const FilterPanel = () => (
    <div>
      {/* Search */}
      <div className="mb-6">
        <label className="filter-label">Search</label>
        <div className="relative">
          <input className="filter-input" style={{ paddingLeft:'34px' }} placeholder="Search products…" value={keyword} onChange={e => { setKeyword(e.target.value); setPage(1); }} />
          <svg width="14" height="14" fill="none" stroke="var(--muted)" strokeWidth="1.8" viewBox="0 0 24 24" style={{ position:'absolute',left:'10px',top:'50%',transform:'translateY(-50%)' }}>
            <circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/>
          </svg>
        </div>
      </div>

      {/* Categories */}
      <div className="mb-6">
        <label className="filter-label">Category</label>
        {MOCK_CATEGORIES.map(cat => (
          <label key={cat._id} className="filter-check">
            <input type="checkbox" checked={selectedCats.includes(cat._id)} onChange={() => { toggleCat(cat._id); setPage(1); }} />
            {cat.name}
          </label>
        ))}
      </div>

      {/* Price range */}
      <div className="mb-6">
        <label className="filter-label">Price Range</label>
        <div className="flex items-center gap-2">
          <input className="filter-input" type="number" placeholder="Min" min="0" value={minPrice} onChange={e => { setMinPrice(e.target.value); setPage(1); }} style={{ width:'80px' }} />
          <span style={{ color:'var(--muted)',fontSize:'0.78rem' }}>–</span>
          <input className="filter-input" type="number" placeholder="Max" min="0" value={maxPrice} onChange={e => { setMaxPrice(e.target.value); setPage(1); }} style={{ width:'80px' }} />
        </div>
      </div>

      {activeFilters.length > 0 && (
        <button onClick={clearAll} style={{ fontSize:'0.72rem',color:'var(--maroon)',background:'none',border:'none',cursor:'pointer',padding:0,letterSpacing:'0.06em',textDecoration:'underline' }}>
          Clear all filters
        </button>
      )}
    </div>
  );

  return (
    <>
      <style>{STYLES}</style>
      <Header />
      <div className="min-h-screen" style={{ background:'var(--cream)',fontFamily:"'Jost',sans-serif" }}>

        {/* Page header */}
        <div style={{ borderBottom:'1px solid var(--border)',background:'#fff',padding:'32px 6%' }}>
          <p style={{ fontSize:'0.72rem',letterSpacing:'0.15em',textTransform:'uppercase',color:'var(--maroon)',marginBottom:'4px' }}>CEILO</p>
          <h1 style={{ fontFamily:"'Cormorant Garamond',serif",fontSize:'clamp(1.6rem,3vw,2.2rem)',fontWeight:600,color:'var(--charcoal)' }}>All Products</h1>
        </div>

        <div className="flex max-w-screen-xl mx-auto px-6 py-10 gap-10">

          {/* ── Sidebar filters (desktop) ─────────────────────────── */}
          <aside className="hidden lg:block w-56 shrink-0">
            <div className="sticky top-24">
              <FilterPanel />
            </div>
          </aside>

          {/* ── Main content ──────────────────────────────────────── */}
          <main className="flex-1 min-w-0">

            {/* Toolbar */}
            <div className="flex items-center justify-between gap-4 mb-6 flex-wrap">
              <div className="flex items-center gap-3 flex-wrap">
                <p style={{ fontSize:'0.78rem',color:'var(--muted)' }}>{filtered.length} product{filtered.length !== 1 ? 's' : ''}</p>
                {activeFilters.map(f => (
                  <span key={f} className="badge">{f} <span onClick={clearAll}>✕</span></span>
                ))}
              </div>
              <div className="flex items-center gap-3">
                {/* Mobile filter toggle */}
                <button className="lg:hidden flex items-center gap-1.5" onClick={() => setMobileFilter(p => !p)}
                  style={{ padding:'7px 14px',border:'1px solid var(--border)',borderRadius:'3px',background:'#fff',fontFamily:"'Jost',sans-serif",fontSize:'0.72rem',letterSpacing:'0.08em',textTransform:'uppercase',cursor:'pointer',color:'var(--charcoal)' }}>
                  <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24"><path d="M22 3H2l8 9.46V19l4 2v-8.54L22 3z"/></svg>
                  Filters
                </button>
                <div className="relative">
                  <select className="sort-select" value={sort} onChange={e => setSort(e.target.value)}
                    style={{ backgroundImage:'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'12\' height=\'12\' viewBox=\'0 0 24 24\' fill=\'none\' stroke=\'%237A7A7A\' stroke-width=\'2\'%3E%3Cpath d=\'M6 9l6 6 6-6\'/%3E%3C/svg%3E")',backgroundRepeat:'no-repeat',backgroundPosition:'right 8px center',backgroundSize:'12px' }}>
                    <option value="newest">Newest</option>
                    <option value="price_asc">Price: Low to High</option>
                    <option value="price_desc">Price: High to Low</option>
                    <option value="popular">Most Popular</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Mobile filter panel */}
            {mobileFilter && (
              <div className="lg:hidden bg-white rounded-md p-5 mb-6" style={{ border:'1px solid var(--border)' }}>
                <FilterPanel />
              </div>
            )}

            {/* Products grid */}
            {visible.length === 0 ? (
              <div className="text-center py-20" style={{ border:'1px dashed var(--border)',borderRadius:'4px' }}>
                <svg width="36" height="36" fill="none" stroke="#C4B5B8" strokeWidth="1.5" viewBox="0 0 24 24" style={{ margin:'0 auto 12px' }}>
                  <circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/>
                </svg>
                <p style={{ fontSize:'0.85rem',color:'var(--muted)',marginBottom:'12px' }}>No products found matching your filters.</p>
                <button onClick={clearAll} style={{ fontSize:'0.72rem',color:'var(--maroon)',background:'none',border:'none',cursor:'pointer',textDecoration:'underline' }}>Clear filters</button>
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
                {visible.map(product => (
                  <div key={product._id} className="product-card">
                    <button className="wishlist-btn" onClick={() => toggleSave(product._id)}>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill={savedItems.includes(product._id)?'#6B1B2A':'none'} stroke="#6B1B2A" strokeWidth="1.8">
                        <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/>
                      </svg>
                    </button>
                    {product.discountPrice && (
                      <div style={{ position:'absolute',top:'10px',left:'10px',background:'var(--maroon)',color:'#fff',fontSize:'0.6rem',fontWeight:600,letterSpacing:'0.08em',padding:'3px 8px',borderRadius:'2px',textTransform:'uppercase' }}>
                        Sale
                      </div>
                    )}
                    <Link to={`/products/${product.slug}`}>
                      {/* IMAGE: product photo — 3:4 portrait */}
                      <div className="card-img-wrap">
                        {product.images[0]
                          ? <img src={product.images[0]} alt={product.name} className="card-img" />
                          : <div style={{ width:'100%',height:'100%',display:'flex',alignItems:'center',justifyContent:'center',background:'#F0EAE5' }}>
                              <svg width="28" height="28" fill="none" stroke="#D4C5C0" strokeWidth="1.2" viewBox="0 0 24 24"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><path d="M21 15l-5-5L5 21"/></svg>
                            </div>
                        }
                      </div>
                    </Link>
                    <div style={{ padding:'12px 14px 16px' }}>
                      <p style={{ fontSize:'0.62rem',color:'var(--muted)',letterSpacing:'0.08em',textTransform:'uppercase',marginBottom:'3px' }}>{product.category.name}</p>
                      <Link to={`/products/${product.slug}`} style={{ textDecoration:'none' }}>
                        <p style={{ fontSize:'0.85rem',fontWeight:500,color:'var(--charcoal)',marginBottom:'5px',lineHeight:1.3 }}>{product.name}</p>
                      </Link>
                      <StarMini rating={product.averageRating} />
                      <div className="flex items-center gap-2 mt-2">
                        {product.discountPrice ? (
                          <>
                            <span style={{ fontFamily:"'Cormorant Garamond',serif",fontSize:'1rem',fontWeight:600,color:'var(--maroon)' }}>${product.discountPrice}</span>
                            <span style={{ fontSize:'0.75rem',color:'var(--muted)',textDecoration:'line-through' }}>${product.price}</span>
                          </>
                        ) : (
                          <span style={{ fontFamily:"'Cormorant Garamond',serif",fontSize:'1rem',fontWeight:600,color:'var(--charcoal)' }}>${product.price}</span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Pagination */}
            {pages > 1 && (
              <div className="flex items-center justify-center gap-2 mt-10">
                <button className="pagination-btn" disabled={page === 1} onClick={() => setPage(p => p - 1)}>
                  <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M15 18l-6-6 6-6"/></svg>
                </button>
                {Array.from({ length: pages }, (_, i) => i + 1).map(n => (
                  <button key={n} className={`pagination-btn${page === n ? ' active' : ''}`} onClick={() => setPage(n)}>{n}</button>
                ))}
                <button className="pagination-btn" disabled={page === pages} onClick={() => setPage(p => p + 1)}>
                  <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M9 18l6-6-6-6"/></svg>
                </button>
              </div>
            )}
          </main>
        </div>
      </div>
      <Footer />
    </>
  );
}