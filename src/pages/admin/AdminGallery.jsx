import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import ImageUploader from '../../components/ImageUploader';
import { Image, Plus, Trash2, Edit3, Save, X, Tag, Grid, Maximize2 } from 'lucide-react';

const AdminGallery = () => {
  const { gallery, addGalleryItem, deleteGalleryItem, categories } = useStore();
  const [showForm, setShowForm] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [preview, setPreview] = useState(null);
  const [filterCat, setFilterCat] = useState('All');
  const [form, setForm] = useState({ title: '', category: 'Bridal', image_url: '' });
  const [saving, setSaving] = useState(false);

  const galleryCategories = ['All', ...new Set(gallery.map(g => g.category || 'General'))];
  const filtered = filterCat === 'All' ? gallery : gallery.filter(g => g.category === filterCat);

  const resetForm = () => { setForm({ title: '', category: 'Bridal', image_url: '' }); setEditItem(null); setShowForm(false); };

  const handleSave = async () => {
    if (!form.image_url) { alert('Please add an image.'); return; }
    setSaving(true);
    if (editItem) {
      // update not available directly via store for gallery – delete+add
      await deleteGalleryItem(editItem.id);
    }
    await addGalleryItem({ title: form.title || 'Salon Photo', category: form.category, image_url: form.image_url });
    setSaving(false);
    resetForm();
  };

  const catOptions = categories.length > 0
    ? categories.map(c => c.name)
    : ['Bridal', 'Hair', 'Makeup', 'Skincare', 'Nails', 'Packages', 'Salon'];

  return (
    <div>
      {/* Header */}
      <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
        <div>
          <h2 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '2rem', color: 'var(--text-primary)', marginBottom: '4px' }}>
            Gallery <span className="text-gold-gradient">Manager</span>
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>{gallery.length} photos · Click any image to preview</p>
        </div>
        <button className="btn btn-primary" onClick={() => { resetForm(); setShowForm(true); }} style={{ gap: '8px', display: 'flex', alignItems: 'center' }}>
          <Plus size={16} /> Add Photo
        </button>
      </div>

      {/* Add/Edit Form */}
      {showForm && (
        <div className="glass-card" style={{ padding: 'clamp(1rem, 4vw, 1.75rem)', marginBottom: '2rem', border: '1px solid var(--gold-primary)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
            <h3 style={{ color: 'var(--gold-light)', fontSize: '1.1rem' }}>
              {editItem ? 'Edit Photo' : 'Add New Photo'}
            </h3>
            <button onClick={resetForm} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
              <X size={20} />
            </button>
          </div>
          <div className="admin-grid-2">
            <div>
              <label className="form-label">Photo Title</label>
              <input className="input" placeholder="e.g. Royal Bridal Makeover" value={form.title}
                onChange={e => setForm(p => ({ ...p, title: e.target.value }))} />
            </div>
            <div>
              <label className="form-label">Category</label>
              <select className="input" value={form.category} onChange={e => setForm(p => ({ ...p, category: e.target.value }))}>
                {catOptions.map(c => <option key={c}>{c}</option>)}
              </select>
            </div>
          </div>
          <div style={{ marginTop: '1.25rem' }}>
            <ImageUploader
              label="Photo"
              currentUrl={form.image_url}
              onUpload={url => setForm(p => ({ ...p, image_url: url }))}
            />
          </div>
          <div style={{ display: 'flex', gap: '10px', marginTop: '1.25rem', justifyContent: 'flex-end' }}>
            <button className="btn btn-ghost btn-sm" onClick={resetForm}>Cancel</button>
            <button className="btn btn-primary btn-sm" onClick={handleSave} disabled={saving} style={{ gap: '6px', display: 'flex', alignItems: 'center' }}>
              <Save size={14} /> {saving ? 'Saving...' : 'Save Photo'}
            </button>
          </div>
        </div>
      )}

      {/* Category Filter */}
      <div className="mobile-scroll-x" style={{ display: 'flex', gap: '8px', marginBottom: '1.5rem', paddingBottom: '4px' }}>
        {galleryCategories.map(cat => (
          <button key={cat} onClick={() => setFilterCat(cat)}
            style={{
              padding: '6px 16px', borderRadius: 'var(--radius-full)', fontSize: '0.83rem', fontWeight: '600',
              cursor: 'pointer', border: '1px solid', whiteSpace: 'nowrap',
              background: filterCat === cat ? 'var(--gold-gradient)' : 'rgba(255,255,255,0.04)',
              borderColor: filterCat === cat ? 'var(--gold-primary)' : 'var(--border-subtle)',
              color: filterCat === cat ? '#080c16' : 'var(--text-muted)'
            }}
          >{cat}</button>
        ))}
      </div>

      {/* Gallery Grid */}
      {filtered.length === 0 ? (
        <div className="glass-card" style={{ padding: '4rem', textAlign: 'center' }}>
          <Image size={48} style={{ color: 'var(--text-muted)', marginBottom: '1rem' }} />
          <p style={{ color: 'var(--text-muted)' }}>No photos yet. Add your first gallery image!</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '1.25rem' }}>
          {filtered.map(item => (
            <div key={item.id} className="glass-card" style={{ position: 'relative', overflow: 'hidden', borderRadius: 'var(--radius-md)', cursor: 'pointer' }}
              onClick={() => setPreview(item)}>
              <img src={item.image_url} alt={item.title}
                style={{ width: '100%', height: '200px', objectFit: 'cover', display: 'block' }}
                onError={e => { e.target.style.background = 'var(--bg-secondary)'; e.target.src = ''; }} />
              <div style={{
                position: 'absolute', inset: 0,
                background: 'linear-gradient(180deg, transparent 40%, rgba(8,12,22,0.9) 100%)',
                display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', padding: '1rem'
              }}>
                <span style={{ fontSize: '0.72rem', color: 'var(--gold-light)', textTransform: 'uppercase', letterSpacing: '1px' }}>{item.category}</span>
                <p style={{ color: '#fff', fontSize: '0.9rem', fontWeight: '600', margin: '2px 0 8px' }}>{item.title}</p>
                <div style={{ display: 'flex', gap: '8px' }} onClick={e => e.stopPropagation()}>
                  <button className="btn btn-outline btn-sm" style={{ fontSize: '0.75rem', padding: '4px 10px', gap: '4px', display: 'flex', alignItems: 'center' }}
                    onClick={() => { setForm({ title: item.title, category: item.category, image_url: item.image_url }); setEditItem(item); setShowForm(true); }}>
                    <Edit3 size={12} /> Edit
                  </button>
                  <button className="btn btn-danger btn-sm" style={{ fontSize: '0.75rem', padding: '4px 10px', gap: '4px', display: 'flex', alignItems: 'center' }}
                    onClick={() => { if (window.confirm('Delete this photo?')) deleteGalleryItem(item.id); }}>
                    <Trash2 size={12} /> Delete
                  </button>
                </div>
              </div>
              <div style={{ position: 'absolute', top: '10px', right: '10px', color: 'var(--gold-primary)' }}>
                <Maximize2 size={16} />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Lightbox */}
      {preview && (
        <div className="modal-backdrop" onClick={() => setPreview(null)}>
          <div style={{ position: 'relative', maxWidth: '800px', width: '100%' }} onClick={e => e.stopPropagation()}>
            <button onClick={() => setPreview(null)}
              style={{ position: 'absolute', top: '-44px', right: 0, background: 'rgba(255,255,255,0.15)', border: 'none', color: '#fff', borderRadius: '50%', width: '36px', height: '36px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <X size={20} />
            </button>
            <img src={preview.image_url} alt={preview.title}
              style={{ width: '100%', maxHeight: '80vh', objectFit: 'contain', borderRadius: 'var(--radius-md)', boxShadow: 'var(--shadow-lg)' }} />
            <p style={{ textAlign: 'center', color: 'var(--gold-light)', marginTop: '1rem', fontSize: '1.05rem' }}>
              {preview.title} · {preview.category}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminGallery;
