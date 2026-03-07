import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Header from '../../components/layout/Header';
import Footer from '../../components/layout/Footer';
import Sidebar from '../../components/layout/Sidebar';
// import { getSavedItems, removeSavedItem } from '../../api/userApi';

const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;600;700&family=Jost:wght@300;400;500&display=swap');
  :root { --maroon:#6B1B2A;--maroon-dark:#4A1019;--maroon-soft:#8B2535;--cream:#FAF7F4;--charcoal:#1C1C1E;--muted:#7A7A7A;--border:#E8E0D8; }
  .product-card { background:#fff;border:1px solid var(--border);border-radius:4px;overflow:hidden;transition:border-color .2s,box-shadow .2s;position:relative; }
  .product-card:hover { border-color:#C4A8A8;box-shadow:0 4px 20px rgba(107,27,42,.08); }
  .product-img { width:100%;aspect-ratio:3/4;object-fit:cover;background:#F0EAE5;display:block; }
  .btn-primary { padding:10px 20px;background:var(--maroon);color:#fff;border:none;border-radius:3px;font-family:'Jost',sans-serif;font-size:0.72rem;letter-spacing:0.12em;text-transform:uppercase;cursor:pointer;transition:background .2s;width:100%; }
  .btn-primary:hover { background:var(--maroon-soft); }
  .remove-btn { position:absolute;top:10px;right:10px;width:30px;height:30px;border-radius:50%;background:rgba(255,255,255,.92);border:none;cursor:pointer;display:flex;align-items:center;justify-content:center;color:#7A7A7A;transition:all .2s;box-shadow:0 1px 4px rgba(0,0,0,.1); }
  .remove-btn:hover { background:#fff;color:#C53030; }
`;

// TODO: replace with real saved items fetched from API
const MOCK_ITEMS = [
  { _id: 'p1', name: 'Silk Draped Blouse', slug: 'silk-draped-blouse', price: 89.00, discountPrice: 69.00, images: [''], category: { name: 'Tops' } },
  { _id: 'p2', name: 'Maroon Leather Tote', slug: 'maroon-leather-tote', price: 145.00, discountPrice: null, images: [''], category: { name: 'Bags' } },
  { _id: 'p3', name: 'Gold Hoop Earrings', slug: 'gold-hoop-earrings', price: 42.00, discountPrice: null, images: [''], category: { name: 'Jewelry' } },
];

export default function SavedWishList() {
  const [items, setItems] = useState(MOCK_ITEMS);
  const [removing, setRemoving] = useState(null);

  const handleRemove = async (productId) => {
    setRemoving(productId);
    try {
      // await removeSavedItem(productId);
      setItems(p => p.filter(i => i._id !== productId));
    } catch (err) { console.error(err); }
    finally { setRemoving(null); }
  };

  const fmtPrice = p => `$${p.toFixed(2)}`;

  return (
    <>
      <style>{STYLES}</style>
      <Header />
      <div className="min-h-screen" style={{ background: 'var(--cream)', fontFamily: "'Jost',sans-serif" }}>
        <div className="max-w-6xl mx-auto px-6 py-12 flex flex-col md:flex-row gap-10">
          <Sidebar variant="user" />

          <main className="flex-1 min-w-0">
            <div className="flex items-center justify-between mb-2">
              <h1 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: '1.7rem', fontWeight: 600, color: 'var(--charcoal)' }}>Saved Items</h1>
              <span style={{ fontSize: '0.78rem', color: 'var(--muted)' }}>{items.length} {items.length === 1 ? 'item' : 'items'}</span>
            </div>
            <p style={{ fontSize: '0.82rem', color: 'var(--muted)', marginBottom: '32px' }}>Your curated wishlist</p>

            {items.length === 0 ? (
              <div className="text-center py-16" style={{ border: '1px dashed var(--border)', borderRadius: '4px' }}>
                <svg width="36" height="36" fill="none" stroke="#C4B5B8" strokeWidth="1.5" viewBox="0 0 24 24" style={{ margin: '0 auto 12px' }}>
                  <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/>
                </svg>
                <p style={{ fontSize: '0.85rem', color: 'var(--muted)', marginBottom: '16px' }}>Your wishlist is empty.</p>
                <Link to="/products" style={{ padding: '9px 22px', background: 'var(--maroon)', color: '#fff', borderRadius: '3px', fontFamily: "'Jost',sans-serif", fontSize: '0.72rem', letterSpacing: '0.12em', textTransform: 'uppercase', textDecoration: 'none' }}>
                  Explore Products
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {items.map(item => (
                  <div key={item._id} className="product-card">

                    {/* Remove button */}
                    <button className="remove-btn" onClick={() => handleRemove(item._id)} disabled={removing === item._id} title="Remove from wishlist">
                      {removing === item._id
                        ? <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" style={{ animation: 'spin 1s linear infinite' }}><path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4"/></svg>
                        : <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M18 6L6 18M6 6l12 12"/></svg>
                      }
                    </button>

                    {/* Product image */}
                    {/* IMAGE: product photo — 3:4 aspect ratio */}
                    <Link to={`/products/${item.slug}`}>
                      <div className="product-img" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        {item.images[0]
                          ? <img src={item.images[0]} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                          : <svg width="32" height="32" fill="none" stroke="#C4B5B8" strokeWidth="1.5" viewBox="0 0 24 24"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><path d="M21 15l-5-5L5 21"/></svg>
                        }
                      </div>
                    </Link>

                    {/* Info */}
                    <div style={{ padding: '12px 14px 14px' }}>
                      <p style={{ fontSize: '0.65rem', color: 'var(--muted)', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '4px' }}>
                        {item.category?.name}
                      </p>
                      <Link to={`/products/${item.slug}`} style={{ textDecoration: 'none' }}>
                        <p style={{ fontSize: '0.85rem', fontWeight: 500, color: 'var(--charcoal)', marginBottom: '6px', lineHeight: 1.3 }}>{item.name}</p>
                      </Link>
                      <div className="flex items-center gap-2 mb-10px">
                        {item.discountPrice ? (
                          <>
                            <span style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: '1rem', fontWeight: 600, color: 'var(--maroon)' }}>{fmtPrice(item.discountPrice)}</span>
                            <span style={{ fontSize: '0.78rem', color: 'var(--muted)', textDecoration: 'line-through' }}>{fmtPrice(item.price)}</span>
                          </>
                        ) : (
                          <span style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: '1rem', fontWeight: 600, color: 'var(--charcoal)' }}>{fmtPrice(item.price)}</span>
                        )}
                      </div>
                      <div style={{ marginTop: '10px' }}>
                        <Link to={`/products/${item.slug}`}>
                          <button className="btn-primary">View Item</button>
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </main>
        </div>
      </div>
      <Footer />
    </>
  );
}