import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { Tag, Plus, Trash2, Edit3, Save, X, Layers } from 'lucide-react';

const AdminCategories = () => {
  const { categories, addCategory, updateCategory, deleteCategory } = useStore();
  const [showForm, setShowForm] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [saving, setSaving] = useState(false);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');

  const resetForm = () => {
    setName('');
    setDescription('');
    setEditItem(null);
    setShowForm(false);
  };

  const handleEdit = (cat) => {
    setName(cat.name);
    setDescription(cat.description || '');
    setEditItem(cat);
    setShowForm(true);
  };

  const handleSave = async () => {
    if (!name.trim()) {
      alert('Category name is required.');
      return;
    }
    setSaving(true);
    if (editItem) {
      await updateCategory(editItem.id, { name: name.trim(), description: description.trim() });
    } else {
      await addCategory({ name: name.trim(), description: description.trim() });
    }
    setSaving(false);
    resetForm();
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h2 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '2rem', color: 'var(--text-primary)', marginBottom: '4px' }}>
            Service & Gallery <span className="text-gold-gradient">Categories</span>
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
            Organize services and photo galleries into clear, filterable sections
          </p>
        </div>
        <button
          className="btn btn-primary"
          onClick={() => { resetForm(); setShowForm(true); }}
          style={{ gap: '8px', display: 'flex', alignItems: 'center' }}
        >
          <Plus size={16} /> Add Category
        </button>
      </div>

      {showForm && (
        <div className="glass-card" style={{ padding: '1.75rem', marginBottom: '2rem', border: '1px solid var(--gold-primary)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
            <h3 style={{ color: 'var(--gold-light)', fontSize: '1.1rem' }}>
              {editItem ? 'Edit Category' : 'Add New Category'}
            </h3>
            <button onClick={resetForm} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
              <X size={20} />
            </button>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' }}>
            <div>
              <label className="form-label">Category Name *</label>
              <input
                className="input"
                placeholder="e.g. Bridal, Hair, Nails, Skincare"
                value={name}
                onChange={e => setName(e.target.value)}
              />
            </div>
            <div>
              <label className="form-label">Description (Optional)</label>
              <input
                className="input"
                placeholder="Brief note or tagline"
                value={description}
                onChange={e => setDescription(e.target.value)}
              />
            </div>
          </div>
          <div style={{ display: 'flex', gap: '10px', marginTop: '1.5rem', justifyContent: 'flex-end' }}>
            <button className="btn btn-ghost btn-sm" onClick={resetForm}>Cancel</button>
            <button
              className="btn btn-primary btn-sm"
              onClick={handleSave}
              disabled={saving}
              style={{ gap: '6px', display: 'flex', alignItems: 'center' }}
            >
              <Save size={14} /> {saving ? 'Saving...' : (editItem ? 'Update Category' : 'Save Category')}
            </button>
          </div>
        </div>
      )}

      {categories.length === 0 ? (
        <div className="glass-card" style={{ padding: '4rem', textAlign: 'center' }}>
          <Layers size={48} style={{ color: 'var(--text-muted)', marginBottom: '1rem' }} />
          <p style={{ color: 'var(--text-muted)' }}>No categories configured yet.</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.25rem' }}>
          {categories.map(c => (
            <div key={c.id} className="glass-card" style={{ padding: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                  <Tag size={16} style={{ color: 'var(--gold-primary)' }} />
                  <span style={{ fontWeight: '700', fontSize: '1.05rem', color: 'var(--text-primary)' }}>{c.name}</span>
                </div>
                {c.description && (
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', margin: '0 0 10px 0' }}>{c.description}</p>
                )}
              </div>
              <div style={{ display: 'flex', gap: '6px' }}>
                <button
                  className="btn btn-outline btn-sm"
                  style={{ padding: '4px 8px' }}
                  onClick={() => handleEdit(c)}
                  title="Edit Category"
                >
                  <Edit3 size={13} />
                </button>
                <button
                  className="btn btn-danger btn-sm"
                  style={{ padding: '4px 8px' }}
                  onClick={() => {
                    if (window.confirm(`Delete category "${c.name}"?`)) {
                      deleteCategory(c.id);
                    }
                  }}
                  title="Delete Category"
                >
                  <Trash2 size={13} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminCategories;
