import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import ImageUploader from '../../components/ImageUploader';
import { Star, Plus, Trash2, Edit3, Save, X, MessageSquare } from 'lucide-react';

const StarRating = ({ value, onChange }) => (
  <div style={{ display: 'flex', gap: '4px' }}>
    {[1, 2, 3, 4, 5].map(n => (
      <button
        key={n}
        type="button"
        onClick={() => onChange(n)}
        style={{
          background: 'none', border: 'none', cursor: 'pointer', padding: '2px',
          color: n <= value ? 'var(--gold-primary)' : 'var(--border-medium)',
          fontSize: '1.4rem', lineHeight: 1, transition: 'var(--transition)'
        }}
      >★</button>
    ))}
  </div>
);

const AdminTestimonials = () => {
  const { testimonials, addTestimonial, updateTestimonial, deleteTestimonial } = useStore();
  const [showForm, setShowForm] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({ name: '', role: 'Happy Client', rating: 5, text: '', image_url: '' });

  const resetForm = () => { setForm({ name: '', role: 'Happy Client', rating: 5, text: '', image_url: '' }); setEditItem(null); setShowForm(false); };

  const handleEdit = (t) => {
    setForm({ name: t.name, role: t.role || 'Happy Client', rating: t.rating || 5, text: t.text, image_url: t.image_url || '' });
    setEditItem(t);
    setShowForm(true);
  };

  const handleSave = async () => {
    if (!form.name.trim() || !form.text.trim()) { alert('Name and review text are required.'); return; }
    setSaving(true);
    if (editItem) {
      await updateTestimonial(editItem.id, form);
    } else {
      await addTestimonial(form);
    }
    setSaving(false);
    resetForm();
  };

  return (
    <div>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h2 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '2rem', color: 'var(--text-primary)', marginBottom: '4px' }}>
            Customer <span className="text-gold-gradient">Testimonials</span>
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>{testimonials.length} reviews · These appear on your public homepage</p>
        </div>
        <button className="btn btn-primary" onClick={() => { resetForm(); setShowForm(true); }}
          style={{ gap: '8px', display: 'flex', alignItems: 'center' }}>
          <Plus size={16} /> Add Review
        </button>
      </div>

      {/* Form */}
      {showForm && (
        <div className="glass-card" style={{ padding: '1.75rem', marginBottom: '2rem', border: '1px solid var(--gold-primary)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
            <h3 style={{ color: 'var(--gold-light)', fontSize: '1.1rem' }}>{editItem ? 'Edit Review' : 'Add New Review'}</h3>
            <button onClick={resetForm} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}><X size={20} /></button>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' }}>
            <div>
              <label className="form-label">Customer Name *</label>
              <input className="input" placeholder="e.g. Kavitha Reddy" value={form.name}
                onChange={e => setForm(p => ({ ...p, name: e.target.value }))} />
            </div>
            <div>
              <label className="form-label">Role / Label</label>
              <input className="input" placeholder="e.g. Bride, Regular Client" value={form.role}
                onChange={e => setForm(p => ({ ...p, role: e.target.value }))} />
            </div>
          </div>
          <div style={{ marginTop: '1.25rem' }}>
            <label className="form-label">Star Rating</label>
            <StarRating value={form.rating} onChange={v => setForm(p => ({ ...p, rating: v }))} />
          </div>
          <div style={{ marginTop: '1.25rem' }}>
            <label className="form-label">Review Text *</label>
            <textarea className="input" rows={4} placeholder="Write the customer's review here..."
              value={form.text} onChange={e => setForm(p => ({ ...p, text: e.target.value }))}
              style={{ resize: 'vertical' }} />
          </div>
          <div style={{ marginTop: '1.25rem' }}>
            <ImageUploader label="Customer Photo (optional)" currentUrl={form.image_url}
              onUpload={url => setForm(p => ({ ...p, image_url: url }))} compact />
          </div>
          <div style={{ display: 'flex', gap: '10px', marginTop: '1.5rem', justifyContent: 'flex-end' }}>
            <button className="btn btn-ghost btn-sm" onClick={resetForm}>Cancel</button>
            <button className="btn btn-primary btn-sm" onClick={handleSave} disabled={saving}
              style={{ gap: '6px', display: 'flex', alignItems: 'center' }}>
              <Save size={14} /> {saving ? 'Saving...' : (editItem ? 'Update Review' : 'Add Review')}
            </button>
          </div>
        </div>
      )}

      {/* Testimonials List */}
      {testimonials.length === 0 ? (
        <div className="glass-card" style={{ padding: '4rem', textAlign: 'center' }}>
          <MessageSquare size={48} style={{ color: 'var(--text-muted)', marginBottom: '1rem' }} />
          <p style={{ color: 'var(--text-muted)' }}>No testimonials yet. Add your first customer review!</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gap: '1rem' }}>
          {testimonials.map(t => (
            <div key={t.id} className="glass-card" style={{ padding: '1.5rem', display: 'flex', gap: '1.25rem', alignItems: 'flex-start' }}>
              {/* Avatar */}
              <div style={{
                width: '52px', height: '52px', borderRadius: '50%', overflow: 'hidden', flexShrink: 0,
                background: 'var(--bg-secondary)', border: '2px solid var(--gold-primary)',
                display: 'flex', alignItems: 'center', justifyContent: 'center'
              }}>
                {t.image_url ? (
                  <img src={t.image_url} alt={t.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                ) : (
                  <span style={{ fontSize: '1.25rem', color: 'var(--gold-primary)', fontWeight: '700' }}>{t.name?.[0]}</span>
                )}
              </div>

              {/* Content */}
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '8px' }}>
                  <div>
                    <div style={{ fontWeight: '700', color: 'var(--text-primary)', fontSize: '1rem' }}>{t.name}</div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--gold-primary)' }}>{t.role}</div>
                    <div style={{ display: 'flex', gap: '2px', marginTop: '4px' }}>
                      {[...Array(5)].map((_, i) => (
                        <span key={i} style={{ color: i < (t.rating || 5) ? 'var(--gold-primary)' : 'var(--border-medium)', fontSize: '1rem' }}>★</span>
                      ))}
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button className="btn btn-outline btn-sm" style={{ gap: '5px', display: 'flex', alignItems: 'center' }} onClick={() => handleEdit(t)}>
                      <Edit3 size={13} /> Edit
                    </button>
                    <button className="btn btn-danger btn-sm" style={{ gap: '5px', display: 'flex', alignItems: 'center' }}
                      onClick={() => { if (window.confirm('Delete this review?')) deleteTestimonial(t.id); }}>
                      <Trash2 size={13} /> Delete
                    </button>
                  </div>
                </div>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginTop: '0.75rem', lineHeight: '1.6', fontStyle: 'italic' }}>
                  "{t.text}"
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminTestimonials;
