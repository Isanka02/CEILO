import React, { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import Header from '../../components/layout/Header';
import Footer from '../../components/layout/Footer';
import { getProducts } from '../../api/productApi';
import { getCategoryBySlug } from '../../api/categoryApi';

const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,600;1,300&family=Jost:wght@300;400;500&display=swap');
  :root { --maroon:#6B1B2A;--maroon-dark:#4A1019;--maroon-soft:#8B2535;--cream:#FAF7F4;--charcoal:#1C1C1E;--muted:#7A7A7A;--border:#E8E0D8; }
  .product-card { background:#fff;border:1px solid var(--border);border-radius:4px;overflow:hidden;transition:border-color .25s,box-shadow .25s;position:relative; }
  .product-card:hover { border-color:#C4A8A8;box-shadow:0 8px 28px rgba(107,27,42,.09); }
  .product-card:hover .card-img { transform:scale(1.04); }
  .card-img-wrap { overflow:hidden;aspect-ratio:3/4;background:#F0EAE5; }
  .card-img { width:100%;height:100%;object-fit:cover;display:block;transition:transform .5s ease; }
  .wishlist-btn { position:absolute;top:10px;right:10px;width:30px;height:30px;border-radius:50%;background:rgba(255,255,255,.92);border:none;cursor:pointer;display:flex;align-items:center;justify-content:center;transition:all .2s;box-shadow:0 1px 4px rgba(0,0,0,.1);opacity:0; }
  .product-card:hover .wishlist-btn { opacity:1; }
  .sort-select { padding:8px 28px 8px 12px;font-family:'Jost',sans-serif;font-size:0.78rem;background:#fff;border:1px solid var(--border);border-radius:3px;color:var(--charcoal);outline:none;cursor:pointer;appearance:none; }
  .cat-hero { position:relative;height:260px;overflow:hidden;display:flex;align-items:flex-end; }
`;

// TODO: replace with real data
const CATEGORY_MAP = {
  accessories: { name:'Accessories', description:'Elevate every look with our curated accessories.', image:'/cat-a.jpg' },
  clothing:        { name:'Clothing',        description:'Refined silhouettes crafted from luxurious fabrics.', image:'/cat-c.jpg' },
  makeup:        { name:'Makeup',        description:'Enhance your natural beauty with our premium collection.', image:'/cat-m.jpg' },
  jewelry:     { name:'Jewelry',     description:'Delicate pieces that tell a story.', image:'/cat-j.jpg' },
};

const ALL_PRODUCTS = [
  { _id:'p1',name:'Silk Draped Blouse',  slug:'silk-draped-blouse',  price:89, discountPrice:69,  images:[''],category:'clothing',       averageRating:4.8 },
  { _id:'p2',name:'Maroon Leather Tote', slug:'maroon-leather-tote', price:145,discountPrice:null, images:[''],category:'makeup',       averageRating:4.5 },
  { _id:'p3',name:'Gold Hoop Earrings',  slug:'gold-hoop-earrings',  price:42, discountPrice:null, images:[''],category:'jewelry',    averageRating:4.9 },
  { _id:'p4',name:'Pearl Drop Necklace', slug:'pearl-drop-necklace', price:80, discountPrice:64,   images:[''],category:'jewelry',    averageRating:4.7 },
  { _id:'p5',name:'Cashmere Wrap Scarf', slug:'cashmere-wrap-scarf', price:120,discountPrice:null, images:[''],category:'accessories',averageRating:4.6 },
  { _id:'p6',name:'Velvet Clutch',       slug:'velvet-clutch',       price:95, discountPrice:75,   images:[''],category:'makeup',       averageRating:4.3 },
  { _id:'p7',name:'Crystal Bracelet',    slug:'crystal-bracelet',    price:68, discountPrice:null, images:[''],category:'jewelry',    averageRating:4.8 },
  { _id:'p8',name:'Chain Belt',          slug:'chain-belt',          price:55, discountPrice:null, images:[''],category:'accessories',averageRating:4.1 },
];

const StarMini = ({ r }) => (
  <div className="flex items-center gap-0.5">
    {[1,2,3,4,5].map(i => (
      <svg key={i} width="10" height="10" viewBox="0 0 24 24" fill={i<=Math.round(r)?'#6B1B2A':'none'} stroke={i<=Math.round(r)?'#6B1B2A':'#D4C5C0'} strokeWidth="1.5">
        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
      </svg>
    ))}
  </div>
);

export default function FilteredByCategory() {
  const { slug }    = useParams();
  const category    = CATEGORY_MAP[slug] || { name: slug, description: '' };
  const [sort, setSort]             = useState('newest');
  const [savedItems, setSavedItems] = useState([]);

  const products = ALL_PRODUCTS.filter(p => p.category === slug).sort((a,b) => {
    if (sort === 'price_asc')  return a.price - b.price;
    if (sort === 'price_desc') return b.price - a.price;
    if (sort === 'popular')    return b.averageRating - a.averageRating;
    return 0;
  });

  const toggleSave = id => setSavedItems(p => p.includes(id) ? p.filter(i => i !== id) : [...p, id]);

  return (
    <>
      <style>{STYLES}</style>
      <Header />
      <div className="min-h-screen" style={{ background:'var(--cream)',fontFamily:"'Jost',sans-serif" }}>

        {/* Category hero */}
<div className="cat-hero" style={{ background:'var(--maroon-dark)', backgroundImage: category.image ? `url(${category.image})` : 'none', backgroundSize:'cover', backgroundPosition:'center' }}>          {/* IMAGE: category banner — wide landscape, dark/moody lifestyle photo for this category */}
          <div style={{ position:'absolute',inset:0,background:'linear-gradient(to top,rgba(26,8,16,0.8) 0%,rgba(26,8,16,0.3) 100%)' }} />
          <div style={{ position:'relative',zIndex:1,padding:'0 6% 36px' }}>
            <div className="flex items-center gap-2 mb-3" style={{ fontSize:'0.7rem',color:'rgba(255,255,255,.5)',letterSpacing:'0.1em' }}>
              <Link to="/" style={{ color:'rgba(255,255,255,.5)',textDecoration:'none' }}>Home</Link>
              <span>/</span>
              <Link to="/products" style={{ color:'rgba(255,255,255,.5)',textDecoration:'none' }}>Products</Link>
              <span>/</span>
              <span style={{ color:'rgba(255,255,255,.8)' }}>{category.name}</span>
            </div>
            <h1 style={{ fontFamily:"'Cormorant Garamond',serif",fontSize:'clamp(2rem,5vw,3.2rem)',fontWeight:600,color:'#fff',marginBottom:'8px' }}>{category.name}</h1>
            {category.description && <p style={{ fontSize:'0.82rem',color:'rgba(255,255,255,.6)',maxWidth:'400px' }}>{category.description}</p>}
          </div>
        </div>

        <div className="max-w-6xl mx-auto px-6 py-10">

          {/* Toolbar */}
          <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
            <p style={{ fontSize:'0.78rem',color:'var(--muted)' }}>
              {products.length} product{products.length !== 1 ? 's' : ''} in <strong style={{ color:'var(--charcoal)' }}>{category.name}</strong>
            </p>
            <div className="flex items-center gap-3">
              <span style={{ fontSize:'0.72rem',color:'var(--muted)',letterSpacing:'0.08em',textTransform:'uppercase' }}>Sort</span>
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

          {/* All categories quick-nav */}
          <div className="flex items-center gap-2 mb-8 flex-wrap">
            {Object.entries(CATEGORY_MAP).map(([s, c]) => (
              <Link key={s} to={`/category/${s}`}
                style={{ padding:'6px 16px',borderRadius:'99px',fontFamily:"'Jost',sans-serif",fontSize:'0.7rem',letterSpacing:'0.08em',textTransform:'uppercase',textDecoration:'none',border:'1px solid',transition:'all .2s',
                  background: slug === s ? 'var(--maroon)' : '#fff',
                  color:      slug === s ? '#fff' : 'var(--muted)',
                  borderColor:slug === s ? 'var(--maroon)' : 'var(--border)' }}>
                {c.name}
              </Link>
            ))}
          </div>

          {/* Products grid */}
          {products.length === 0 ? (
            <div className="text-center py-20" style={{ border:'1px dashed var(--border)',borderRadius:'4px' }}>
              <p style={{ fontSize:'0.85rem',color:'var(--muted)',marginBottom:'16px' }}>No products in this category yet.</p>
              <Link to="/products" style={{ fontSize:'0.72rem',color:'var(--maroon)',textDecoration:'none',borderBottom:'1px solid var(--maroon)',paddingBottom:'2px',letterSpacing:'0.08em',textTransform:'uppercase' }}>Browse All Products</Link>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {products.map(product => (
                <div key={product._id} className="product-card">
                  <button className="wishlist-btn" onClick={() => toggleSave(product._id)}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill={savedItems.includes(product._id)?'#6B1B2A':'none'} stroke="#6B1B2A" strokeWidth="1.8">
                      <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/>
                    </svg>
                  </button>
                  {product.discountPrice && (
                    <div style={{ position:'absolute',top:'10px',left:'10px',background:'var(--maroon)',color:'#fff',fontSize:'0.6rem',fontWeight:600,letterSpacing:'0.08em',padding:'3px 8px',borderRadius:'2px',textTransform:'uppercase' }}>Sale</div>
                  )}
                  <Link to={`/products/${product.slug}`}>
                    {/* IMAGE: product photo — 3:4 portrait ratio */}
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
                    <Link to={`/products/${product.slug}`} style={{ textDecoration:'none' }}>
                      <p style={{ fontSize:'0.85rem',fontWeight:500,color:'var(--charcoal)',marginBottom:'5px',lineHeight:1.3 }}>{product.name}</p>
                    </Link>
                    <StarMini r={product.averageRating} />
                    <div className="flex items-center gap-2 mt-2">
                      {product.discountPrice
                        ? <><span style={{ fontFamily:"'Cormorant Garamond',serif",fontSize:'1rem',fontWeight:600,color:'var(--maroon)' }}>${product.discountPrice}</span><span style={{ fontSize:'0.75rem',color:'var(--muted)',textDecoration:'line-through' }}>${product.price}</span></>
                        : <span style={{ fontFamily:"'Cormorant Garamond',serif",fontSize:'1rem',fontWeight:600,color:'var(--charcoal)' }}>${product.price}</span>
                      }
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
}