import React, { useState, useRef } from 'react';
import Header from '../../components/layout/Header';
import Sidebar from '../../components/layout/Sidebar';
// import { getProducts, createProduct, updateProduct, deleteProduct } from '../../api/productApi';
// import { getCategories } from '../../api/categoryApi';

const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;600;700&family=Jost:wght@300;400;500&display=swap');
  :root { --maroon:#6B1B2A;--maroon-dark:#4A1019;--maroon-soft:#8B2535;--cream:#FAF7F4;--charcoal:#1C1C1E;--muted:#7A7A7A;--border:#E8E0D8; }
  .section-card { background:#fff;border:1px solid var(--border);border-radius:4px; }
  .field-label { font-size:0.72rem;letter-spacing:0.1em;text-transform:uppercase;color:var(--muted);margin-bottom:6px;display:block; }
  .field-input { width:100%;padding:10px 14px;font-family:'Jost',sans-serif;font-size:0.875rem;background:#fff;border:1px solid var(--border);border-radius:3px;color:var(--charcoal);outline:none;transition:border-color .2s,box-shadow .2s; }
  .field-input:focus { border-color:var(--maroon);box-shadow:0 0 0 3px rgba(107,27,42,.08); }
  .field-input.has-error { border-color:#C53030 !important; }
  .field-input::placeholder { color:#BBADA8; }
  .field-error { font-size:0.7rem;color:#C53030;margin-top:4px; }
  .btn-primary { padding:9px 22px;background:var(--maroon);color:#fff;border:none;border-radius:3px;font-family:'Jost',sans-serif;font-size:0.72rem;letter-spacing:0.12em;text-transform:uppercase;cursor:pointer;transition:background .2s; }
  .btn-primary:hover:not(:disabled) { background:var(--maroon-soft); }
  .btn-primary:disabled { opacity:.6;cursor:not-allowed; }
  .btn-ghost { padding:9px 22px;background:transparent;color:var(--maroon);border:1px solid var(--maroon);border-radius:3px;font-family:'Jost',sans-serif;font-size:0.72rem;letter-spacing:0.12em;text-transform:uppercase;cursor:pointer;transition:all .2s; }
  .btn-ghost:hover { background:var(--maroon);color:#fff; }
  .table-header { display:grid;padding:12px 20px;background:#FAF7F4;border-bottom:1px solid var(--border);font-size:0.68rem;letter-spacing:0.1em;text-transform:uppercase;color:var(--muted); }
  .table-row { display:grid;padding:14px 20px;border-bottom:1px solid var(--border);align-items:center;font-size:0.82rem;color:var(--charcoal);transition:background .15s; }
  .table-row:last-child { border-bottom:none; }
  .table-row:hover { background:#FDFAF8; }
  .action-btn { padding:5px 12px;border-radius:3px;font-family:'Jost',sans-serif;font-size:0.68rem;letter-spacing:0.08em;text-transform:uppercase;cursor:pointer;border:1px solid;transition:all .2s; }
  .search-input { padding:8px 14px;font-family:'Jost',sans-serif;font-size:0.82rem;background:#fff;border:1px solid var(--border);border-radius:3px;color:var(--charcoal);outline:none;transition:border-color .2s; }
  .search-input:focus { border-color:var(--maroon); }
  .img-thumb { width:44px;height:44px;border-radius:4px;object-fit:cover;background:#F0EAE5;border:1px solid var(--border); }
  .img-preview { width:80px;height:80px;border-radius:4px;object-fit:cover;background:#F0EAE5;border:1px solid var(--border);position:relative; }
  .upload-zone { border:2px dashed var(--border);border-radius:4px;padding:24px;text-align:center;cursor:pointer;transition:border-color .2s; }
  .upload-zone:hover { border-color:var(--maroon); }
`;

const emptyForm = { name:'', slug:'', description:'', price:'', discountPrice:'', category:'', tags:'', isActive: true };

const validate = f => {
  const e = {};
  if (!f.name.trim())        e.name        = 'Product name is required.';
  if (!f.slug.trim())        e.slug        = 'Slug is required.';
  if (!f.description.trim()) e.description = 'Description is required.';
  if (!f.price)              e.price       = 'Price is required.';
  else if (isNaN(f.price) || Number(f.price) < 0) e.price = 'Enter a valid price.';
  if (f.discountPrice && (isNaN(f.discountPrice) || Number(f.discountPrice) < 0)) e.discountPrice = 'Enter a valid discount price.';
  if (!f.category)           e.category    = 'Category is required.';
  return e;
};

// TODO: replace with real data from API
const MOCK_CATS = [
  { _id:'c1', name:'Accessories' }, { _id:'c2', name:'Tops' }, { _id:'c3', name:'Bags' }, { _id:'c4', name:'Jewelry' },
];
const MOCK_PRODUCTS = [
  { _id:'p1', name:'Silk Draped Blouse', slug:'silk-draped-blouse', price:89.00, discountPrice:69.00, category:{ name:'Tops' }, isActive:true, numReviews:12, images:[''] },
  { _id:'p2', name:'Maroon Leather Tote', slug:'maroon-leather-tote', price:145.00, discountPrice:null, category:{ name:'Bags' }, isActive:true, numReviews:8, images:[''] },
  { _id:'p3', name:'Gold Hoop Earrings', slug:'gold-hoop-earrings', price:42.00, discountPrice:null, category:{ name:'Jewelry' }, isActive:false, numReviews:21, images:[''] },
];

export default function ProductAdmin() {
  const [products, setProducts] = useState(MOCK_PRODUCTS);
  const [search, setSearch]     = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing]   = useState(null);
  const [form, setForm]         = useState(emptyForm);
  const [errors, setErrors]     = useState({});
  const [touched, setTouched]   = useState({});
  const [loading, setLoading]   = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [images, setImages]     = useState([]);    // File objects for new uploads
  const [previews, setPreviews] = useState([]);    // preview URLs
  const fileRef = useRef();

  const filtered = products.filter(p => !search || p.name.toLowerCase().includes(search.toLowerCase()));

  const handleChange = e => {
    const { name, value, type, checked } = e.target;
    const val = type === 'checkbox' ? checked : value;
    const updated = { ...form, [name]: val };
    if (name === 'name' && !editing) updated.slug = value.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
    setForm(updated);
    if (touched[name]) {
      const errs = validate(updated);
      setErrors(p => ({ ...p, [name]: errs[name] || '' }));
    }
  };

  const handleBlur = e => {
    const { name } = e.target;
    setTouched(p => ({ ...p, [name]: true }));
    const errs = validate(form);
    setErrors(p => ({ ...p, [name]: errs[name] || '' }));
  };

  const handleImages = e => {
    const files = Array.from(e.target.files);
    setImages(p => [...p, ...files]);
    setPreviews(p => [...p, ...files.map(f => URL.createObjectURL(f))]);
  };

  const removePreview = i => {
    setImages(p => p.filter((_, idx) => idx !== i));
    setPreviews(p => p.filter((_, idx) => idx !== i));
  };

  const openEdit = prod => {
    setForm({ name: prod.name, slug: prod.slug, description: prod.description || '', price: prod.price, discountPrice: prod.discountPrice || '', category: prod.category?._id || '', tags: prod.tags?.join(', ') || '', isActive: prod.isActive });
    setPreviews(prod.images || []);
    setImages([]);
    setEditing(prod._id); setShowForm(true); setErrors({}); setTouched({});
  };

  const resetForm = () => { setForm(emptyForm); setImages([]); setPreviews([]); setErrors({}); setTouched({}); setEditing(null); setShowForm(false); };

  const handleSubmit = async e => {
    e.preventDefault();
    const allTouched = Object.fromEntries(Object.keys(form).map(k => [k, true]));
    setTouched(allTouched);
    const errs = validate(form);
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setLoading(true);
    try {
      const formData = new FormData();
      Object.entries(form).forEach(([k, v]) => formData.append(k, v));
      images.forEach(img => formData.append('images', img));
      if (editing) {
        // await updateProduct(editing, formData);
        setProducts(p => p.map(pr => pr._id === editing ? { ...pr, ...form, category: MOCK_CATS.find(c => c._id === form.category) || pr.category } : pr));
      } else {
        // const newProd = await createProduct(formData);
        const newProd = { _id: Date.now().toString(), ...form, images: previews, numReviews: 0, category: MOCK_CATS.find(c => c._id === form.category) || { name: '' } };
        setProducts(p => [newProd, ...p]);
      }
      resetForm();
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  const handleDelete = async () => {
    try {
      // await deleteProduct(deleteId);
      setProducts(p => p.filter(pr => pr._id !== deleteId));
    } catch (err) { console.error(err); }
    finally { setDeleteId(null); }
  };

  return (
    <>
      <style>{STYLES}</style>
      <Header />
      <div className="min-h-screen" style={{ background: 'var(--cream)', fontFamily: "'Jost',sans-serif" }}>
        <div className="max-w-7xl mx-auto px-6 py-12 flex flex-col md:flex-row gap-10">
          <Sidebar variant="admin" />

          <main className="flex-1 min-w-0">
            <div className="flex items-center justify-between mb-2">
              <h1 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: '1.7rem', fontWeight: 600, color: 'var(--charcoal)' }}>Products</h1>
              {!showForm && <button className="btn-primary" onClick={() => { resetForm(); setShowForm(true); }}>+ Add Product</button>}
            </div>
            <p style={{ fontSize: '0.82rem', color: 'var(--muted)', marginBottom: '28px' }}>Manage your product catalogue</p>

            {/* Product form */}
            {showForm && (
              <div className="bg-white rounded-md p-6 mb-6" style={{ border: '1px solid var(--border)' }}>
                <h2 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: '1.2rem', fontWeight: 600, color: 'var(--charcoal)', marginBottom: '20px' }}>
                  {editing ? 'Edit Product' : 'New Product'}
                </h2>
                <form onSubmit={handleSubmit} noValidate>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">

                    <div>
                      <label className="field-label">Product Name</label>
                      <input className={`field-input${errors.name ? ' has-error':''}`} name="name" value={form.name} onChange={handleChange} onBlur={handleBlur} placeholder="e.g. Silk Draped Blouse" />
                      {errors.name && <p className="field-error">{errors.name}</p>}
                    </div>

                    <div>
                      <label className="field-label">Slug</label>
                      <input className={`field-input${errors.slug ? ' has-error':''}`} name="slug" value={form.slug} onChange={handleChange} onBlur={handleBlur} placeholder="silk-draped-blouse" />
                      {errors.slug && <p className="field-error">{errors.slug}</p>}
                    </div>

                    <div className="md:col-span-2">
                      <label className="field-label">Description</label>
                      <textarea className={`field-input${errors.description ? ' has-error':''}`} name="description" value={form.description} onChange={handleChange} onBlur={handleBlur} placeholder="Describe this product…" rows={3} style={{ resize: 'vertical' }} />
                      {errors.description && <p className="field-error">{errors.description}</p>}
                    </div>

                    <div>
                      <label className="field-label">Price ($)</label>
                      <input className={`field-input${errors.price ? ' has-error':''}`} name="price" type="number" min="0" step="0.01" value={form.price} onChange={handleChange} onBlur={handleBlur} placeholder="0.00" />
                      {errors.price && <p className="field-error">{errors.price}</p>}
                    </div>

                    <div>
                      <label className="field-label">Discount Price ($) <span style={{ textTransform:'none',letterSpacing:0,color:'var(--muted)' }}>(optional)</span></label>
                      <input className={`field-input${errors.discountPrice ? ' has-error':''}`} name="discountPrice" type="number" min="0" step="0.01" value={form.discountPrice} onChange={handleChange} onBlur={handleBlur} placeholder="0.00" />
                      {errors.discountPrice && <p className="field-error">{errors.discountPrice}</p>}
                    </div>

                    <div>
                      <label className="field-label">Category</label>
                      <select className={`field-input${errors.category ? ' has-error':''}`} name="category" value={form.category} onChange={handleChange} onBlur={handleBlur}
                        style={{ appearance:'none', background:'#fff url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'12\' height=\'12\' viewBox=\'0 0 24 24\' fill=\'none\' stroke=\'%237A7A7A\' stroke-width=\'2\'%3E%3Cpath d=\'M6 9l6 6 6-6\'/%3E%3C/svg%3E") no-repeat right 12px center' }}>
                        <option value="">Select category</option>
                        {MOCK_CATS.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
                      </select>
                      {errors.category && <p className="field-error">{errors.category}</p>}
                    </div>

                    <div>
                      <label className="field-label">Tags <span style={{ textTransform:'none',letterSpacing:0,color:'var(--muted)' }}>(comma separated)</span></label>
                      <input className="field-input" name="tags" value={form.tags} onChange={handleChange} placeholder="silk, luxury, blouse" />
                    </div>

                    <div className="flex items-center gap-3 md:col-span-2">
                      <input type="checkbox" id="isActive" name="isActive" checked={form.isActive} onChange={handleChange} style={{ accentColor: 'var(--maroon)', width: '16px', height: '16px' }} />
                      <label htmlFor="isActive" style={{ fontSize: '0.82rem', color: 'var(--charcoal)', cursor: 'pointer' }}>Active (visible in shop)</label>
                    </div>

                    {/* Image upload */}
                    <div className="md:col-span-2">
                      <label className="field-label">Product Images</label>
                      {/* IMAGE: product photos — portrait 3:4 ratio recommended, multiple allowed */}
                      <div className="upload-zone" onClick={() => fileRef.current.click()}>
                        <input ref={fileRef} type="file" accept="image/*" multiple onChange={handleImages} style={{ display: 'none' }} />
                        <svg width="24" height="24" fill="none" stroke="#C4B5B8" strokeWidth="1.5" viewBox="0 0 24 24" style={{ margin: '0 auto 8px' }}>
                          <rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><path d="M21 15l-5-5L5 21"/>
                        </svg>
                        <p style={{ fontSize: '0.78rem', color: 'var(--muted)' }}>Click to upload images <span style={{ color: 'var(--maroon)' }}>(portrait ratio recommended)</span></p>
                      </div>
                      {previews.length > 0 && (
                        <div className="flex flex-wrap gap-3 mt-3">
                          {previews.map((src, i) => (
                            <div key={i} style={{ position: 'relative' }}>
                              <div className="img-preview">
                                {src ? <img src={src} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '4px' }} />
                                  : <div style={{ width: '100%', height: '100%', background: '#F0EAE5', borderRadius: '4px' }} />}
                              </div>
                              <button type="button" onClick={() => removePreview(i)}
                                style={{ position: 'absolute', top: '-6px', right: '-6px', width: '20px', height: '20px', borderRadius: '50%', background: '#C53030', color: '#fff', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '10px' }}>
                                ✕
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <button type="submit" className="btn-primary" disabled={loading}>{loading ? 'Saving…' : editing ? 'Update Product' : 'Add Product'}</button>
                    <button type="button" className="btn-ghost" onClick={resetForm}>Cancel</button>
                  </div>
                </form>
              </div>
            )}

            {/* Search */}
            <div className="mb-4">
              <input className="search-input" placeholder="Search products…" value={search} onChange={e => setSearch(e.target.value)} style={{ width: '280px' }} />
            </div>

            {/* Table */}
            <div className="section-card">
              <div className="table-header" style={{ gridTemplateColumns: 'auto 2fr 1fr 0.8fr 0.8fr 0.8fr auto' }}>
                <span></span><span>Product</span><span>Category</span><span>Price</span><span>Reviews</span><span>Status</span><span>Actions</span>
              </div>
              {filtered.length === 0 ? (
                <div className="text-center py-12" style={{ color: 'var(--muted)', fontSize: '0.85rem' }}>No products found.</div>
              ) : filtered.map(prod => (
                <div key={prod._id} className="table-row" style={{ gridTemplateColumns: 'auto 2fr 1fr 0.8fr 0.8fr 0.8fr auto', gap: '12px' }}>
                  {/* IMAGE: product thumbnail 44×44px */}
                  <div className="img-thumb" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    {prod.images?.[0]
                      ? <img src={prod.images[0]} alt={prod.name} style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '4px' }} />
                      : <svg width="16" height="16" fill="none" stroke="#C4B5B8" strokeWidth="1.5" viewBox="0 0 24 24"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><path d="M21 15l-5-5L5 21"/></svg>
                    }
                  </div>
                  <div>
                    <p style={{ fontWeight: 500 }}>{prod.name}</p>
                    <p style={{ fontSize: '0.7rem', color: 'var(--muted)', fontFamily: 'monospace' }}>{prod.slug}</p>
                  </div>
                  <span style={{ color: 'var(--muted)', fontSize: '0.78rem' }}>{prod.category?.name}</span>
                  <div>
                    <p style={{ fontFamily: "'Cormorant Garamond',serif", fontWeight: 600 }}>${prod.price.toFixed(2)}</p>
                    {prod.discountPrice && <p style={{ fontSize: '0.7rem', color: 'var(--maroon)' }}>${prod.discountPrice.toFixed(2)}</p>}
                  </div>
                  <span style={{ color: 'var(--muted)', fontSize: '0.78rem' }}>{prod.numReviews}</span>
                  <span style={{ fontSize: '0.68rem', fontWeight: 500, padding: '3px 10px', borderRadius: '99px', background: prod.isActive ? 'rgba(56,161,105,.1)' : 'rgba(113,128,150,.1)', color: prod.isActive ? '#276749' : '#4A5568' }}>
                    {prod.isActive ? 'Active' : 'Hidden'}
                  </span>
                  <div className="flex gap-2">
                    <button className="action-btn" onClick={() => openEdit(prod)} style={{ borderColor: 'var(--maroon)', color: 'var(--maroon)' }}
                      onMouseEnter={e => { e.currentTarget.style.background = 'var(--maroon)'; e.currentTarget.style.color = '#fff'; }}
                      onMouseLeave={e => { e.currentTarget.style.background = ''; e.currentTarget.style.color = 'var(--maroon)'; }}>Edit</button>
                    <button className="action-btn" onClick={() => setDeleteId(prod._id)} style={{ borderColor: '#C53030', color: '#C53030' }}
                      onMouseEnter={e => { e.currentTarget.style.background = '#C53030'; e.currentTarget.style.color = '#fff'; }}
                      onMouseLeave={e => { e.currentTarget.style.background = ''; e.currentTarget.style.color = '#C53030'; }}>Delete</button>
                  </div>
                </div>
              ))}
            </div>

            {/* Delete confirm */}
            {deleteId && (
              <div className="fixed inset-0 z-50 flex items-center justify-center" style={{ background: 'rgba(0,0,0,0.4)' }}>
                <div className="bg-white rounded-md p-8 max-w-sm w-full mx-4 shadow-xl">
                  <h3 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: '1.3rem', fontWeight: 600, color: 'var(--charcoal)', marginBottom: '8px' }}>Delete product?</h3>
                  <p style={{ fontSize: '0.82rem', color: 'var(--muted)', marginBottom: '24px' }}>This will permanently delete the product and all its images from Cloudinary.</p>
                  <div className="flex gap-3">
                    <button onClick={handleDelete} style={{ padding: '10px 24px', background: '#C53030', color: '#fff', border: 'none', borderRadius: '3px', fontFamily: "'Jost',sans-serif", fontSize: '0.72rem', letterSpacing: '0.12em', textTransform: 'uppercase', cursor: 'pointer' }}>Delete</button>
                    <button onClick={() => setDeleteId(null)} style={{ padding: '10px 24px', background: 'transparent', color: 'var(--muted)', border: '1px solid var(--border)', borderRadius: '3px', fontFamily: "'Jost',sans-serif", fontSize: '0.72rem', letterSpacing: '0.12em', textTransform: 'uppercase', cursor: 'pointer' }}>Cancel</button>
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