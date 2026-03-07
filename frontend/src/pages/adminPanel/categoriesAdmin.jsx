import React, { useState } from 'react';
import Header from '../../components/layout/Header';
import Sidebar from '../../components/layout/Sidebar';
// import { getCategories, createCategory, updateCategory, deleteCategory } from '../../api/categoryApi';

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
`;

const emptyForm = { name: '', slug: '', parentCategory: '' };

const validate = f => {
  const e = {};
  if (!f.name.trim())  e.name = 'Category name is required.';
  if (!f.slug.trim())  e.slug = 'Slug is required.';
  else if (!/^[a-z0-9-]+$/.test(f.slug)) e.slug = 'Slug must be lowercase letters, numbers and hyphens only.';
  return e;
};

// TODO: replace with real data from getCategories() API
const MOCK_CATS = [
  { _id:'c1', name:'Accessories', slug:'accessories', parentCategory: null },
  { _id:'c2', name:'Tops',        slug:'tops',        parentCategory: null },
  { _id:'c3', name:'Bags',        slug:'bags',        parentCategory: null },
  { _id:'c4', name:'Jewelry',     slug:'jewelry',     parentCategory: { _id:'c1', name:'Accessories' } },
];

export default function CategoriesAdmin() {
  const [cats, setCats]         = useState(MOCK_CATS);
  const [form, setForm]         = useState(emptyForm);
  const [errors, setErrors]     = useState({});
  const [touched, setTouched]   = useState({});
  const [editing, setEditing]   = useState(null); // id of cat being edited
  const [showForm, setShowForm] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [loading, setLoading]   = useState(false);

  const handleChange = e => {
    const { name, value } = e.target;
    // Auto-generate slug from name
    const updated = { ...form, [name]: value };
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

  const handleSubmit = async e => {
    e.preventDefault();
    setTouched({ name: true, slug: true });
    const errs = validate(form);
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setLoading(true);
    try {
      if (editing) {
        // await updateCategory(editing, form);
        setCats(p => p.map(c => c._id === editing ? { ...c, ...form, parentCategory: cats.find(c2 => c2._id === form.parentCategory) || null } : c));
      } else {
        // const newCat = await createCategory(form);
        const newCat = { _id: Date.now().toString(), ...form, parentCategory: cats.find(c => c._id === form.parentCategory) || null };
        setCats(p => [...p, newCat]);
      }
      setForm(emptyForm); setErrors({}); setTouched({}); setEditing(null); setShowForm(false);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  const handleEdit = cat => {
    setForm({ name: cat.name, slug: cat.slug, parentCategory: cat.parentCategory?._id || '' });
    setEditing(cat._id); setShowForm(true); setErrors({}); setTouched({});
  };

  const handleDelete = async () => {
    try {
      // await deleteCategory(deleteId);
      setCats(p => p.filter(c => c._id !== deleteId));
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
              <h1 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: '1.7rem', fontWeight: 600, color: 'var(--charcoal)' }}>Categories</h1>
              {!showForm && <button className="btn-primary" onClick={() => { setShowForm(true); setEditing(null); setForm(emptyForm); }}>+ Add Category</button>}
            </div>
            <p style={{ fontSize: '0.82rem', color: 'var(--muted)', marginBottom: '28px' }}>Manage product categories and subcategories</p>

            {/* Form */}
            {showForm && (
              <div className="bg-white rounded-md p-6 mb-6" style={{ border: '1px solid var(--border)' }}>
                <h2 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: '1.2rem', fontWeight: 600, color: 'var(--charcoal)', marginBottom: '20px' }}>
                  {editing ? 'Edit Category' : 'New Category'}
                </h2>
                <form onSubmit={handleSubmit} noValidate>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-5">
                    <div>
                      <label className="field-label">Name</label>
                      <input className={`field-input${errors.name ? ' has-error' : ''}`} name="name" value={form.name} onChange={handleChange} onBlur={handleBlur} placeholder="e.g. Jewelry" />
                      {errors.name && <p className="field-error">{errors.name}</p>}
                    </div>
                    <div>
                      <label className="field-label">Slug</label>
                      <input className={`field-input${errors.slug ? ' has-error' : ''}`} name="slug" value={form.slug} onChange={handleChange} onBlur={handleBlur} placeholder="e.g. jewelry" />
                      {errors.slug && <p className="field-error">{errors.slug}</p>}
                      <p style={{ fontSize: '0.68rem', color: 'var(--muted)', marginTop: '4px' }}>Auto-generated from name. Lowercase, hyphens only.</p>
                    </div>
                    <div>
                      <label className="field-label">Parent Category <span style={{ textTransform: 'none', letterSpacing: 0, color: 'var(--muted)' }}>(optional)</span></label>
                      <select className="field-input" name="parentCategory" value={form.parentCategory} onChange={handleChange}
                        style={{ appearance: 'none', background: '#fff url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'12\' height=\'12\' viewBox=\'0 0 24 24\' fill=\'none\' stroke=\'%237A7A7A\' stroke-width=\'2\'%3E%3Cpath d=\'M6 9l6 6 6-6\'/%3E%3C/svg%3E") no-repeat right 12px center' }}>
                        <option value="">None (top-level)</option>
                        {cats.filter(c => c._id !== editing).map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
                      </select>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <button type="submit" className="btn-primary" disabled={loading}>{loading ? 'Saving…' : editing ? 'Update Category' : 'Add Category'}</button>
                    <button type="button" className="btn-ghost" onClick={() => { setShowForm(false); setEditing(null); setForm(emptyForm); setErrors({}); setTouched({}); }}>Cancel</button>
                  </div>
                </form>
              </div>
            )}

            {/* Table */}
            <div className="section-card">
              <div className="table-header" style={{ gridTemplateColumns: '1.5fr 1.5fr 1.5fr auto' }}>
                <span>Name</span><span>Slug</span><span>Parent</span><span>Actions</span>
              </div>
              {cats.length === 0 ? (
                <div className="text-center py-12" style={{ color: 'var(--muted)', fontSize: '0.85rem' }}>No categories yet.</div>
              ) : cats.map(cat => (
                <div key={cat._id} className="table-row" style={{ gridTemplateColumns: '1.5fr 1.5fr 1.5fr auto', gap: '12px' }}>
                  <span style={{ fontWeight: 500 }}>{cat.name}</span>
                  <span style={{ color: 'var(--muted)', fontFamily: 'monospace', fontSize: '0.78rem' }}>{cat.slug}</span>
                  <span style={{ color: 'var(--muted)', fontSize: '0.78rem' }}>{cat.parentCategory?.name || '—'}</span>
                  <div className="flex gap-2">
                    <button className="action-btn" onClick={() => handleEdit(cat)} style={{ borderColor: 'var(--maroon)', color: 'var(--maroon)' }}
                      onMouseEnter={e => { e.currentTarget.style.background = 'var(--maroon)'; e.currentTarget.style.color = '#fff'; }}
                      onMouseLeave={e => { e.currentTarget.style.background = ''; e.currentTarget.style.color = 'var(--maroon)'; }}>Edit</button>
                    <button className="action-btn" onClick={() => setDeleteId(cat._id)} style={{ borderColor: '#C53030', color: '#C53030' }}
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
                  <h3 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: '1.3rem', fontWeight: 600, color: 'var(--charcoal)', marginBottom: '8px' }}>Delete category?</h3>
                  <p style={{ fontSize: '0.82rem', color: 'var(--muted)', marginBottom: '24px' }}>This will permanently delete the category. Products in this category will need to be reassigned.</p>
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