import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { Plus, Trash2, Edit3, Check, X, Sparkles, DollarSign, Clock, Layers } from 'lucide-react';

const AdminServices = () => {
  const { services, updateService, addService, deleteService } = useStore();
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({});
  const [showAddModal, setShowAddModal] = useState(false);
  const [newService, setNewService] = useState({
    name: '',
    price: '₹',
    duration: '60 mins',
    category: 'Bridal',
    badge: '',
    description: '',
    image_url: '/banner.jpeg',
    is_active: true
  });
  const [saveToast, setSaveToast] = useState(false);

  const startEdit = (service) => {
    setEditingId(service.id);
    setEditForm({ ...service });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditForm({});
  };

  const handleSaveEdit = async (id) => {
    await updateService(id, editForm);
    setEditingId(null);
    setSaveToast('Service price & details updated live!');
    setTimeout(() => setSaveToast(false), 3000);
  };

  const handleCreateService = async (e) => {
    e.preventDefault();
    if (!newService.name || !newService.price) {
      alert('Please provide at least a service name and price.');
      return;
    }
    await addService(newService);
    setShowAddModal(false);
    setNewService({
      name: '',
      price: '₹',
      duration: '60 mins',
      category: 'Bridal',
      badge: '',
      description: '',
      image_url: '/banner.jpeg',
      is_active: true
    });
    setSaveToast('New service published to salon catalog!');
    setTimeout(() => setSaveToast(false), 3000);
  };

  const handleDelete = async (id, name) => {
    if (window.confirm(`Are you sure you want to remove "${name}" from the catalog?`)) {
      await deleteService(id);
      setSaveToast(`"${name}" removed from services.`);
      setTimeout(() => setSaveToast(false), 3000);
    }
  };

  const categories = ['Bridal', 'Makeup', 'Hair', 'Skincare', 'Nails', 'Packages', 'General'];

  return (
    <div>
      {/* Toast Notification */}
      {saveToast && (
        <div
          style={{
            position: 'fixed',
            top: '20px',
            right: '20px',
            background: 'var(--success-bg)',
            border: '1px solid var(--success)',
            color: 'var(--success)',
            padding: '12px 20px',
            borderRadius: 'var(--radius-md)',
            boxShadow: 'var(--shadow-lg)',
            zIndex: 9999,
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            animation: 'fadeIn 0.2s ease'
          }}
        >
          <Check size={18} /> {saveToast}
        </div>
      )}

      {/* Header with Add Button */}
      <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
        <div>
          <h2 style={{ fontSize: '2rem', color: 'var(--text-primary)', marginBottom: '4px' }}>
            Services & Pricing Customizer
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
            Modify prices, durations, descriptions, and active status in real-time. Changes appear immediately on the website.
          </p>
        </div>
        <button onClick={() => setShowAddModal(true)} className="btn btn-primary" style={{ gap: '8px' }}>
          <Plus size={18} /> Add New Service
        </button>
      </div>

      {/* Services List Table (Desktop & Tablet) */}
      <div className="admin-table-container hide-on-mobile">
        <table className="admin-table">
          <thead>
            <tr>
              <th style={{ width: '22%' }}>Service Name</th>
              <th style={{ width: '15%' }}>Category</th>
              <th style={{ width: '15%' }}>Price (Editable)</th>
              <th style={{ width: '12%' }}>Duration</th>
              <th style={{ width: '10%' }}>Status</th>
              <th style={{ width: '15%' }}>Badge / Tag</th>
              <th style={{ width: '11%', textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {services.map(service => {
              const isEditing = editingId === service.id;

              return (
                <tr key={service.id} style={{ background: isEditing ? 'rgba(212, 175, 55, 0.07)' : 'transparent' }}>
                  {/* Name Column */}
                  <td>
                    {isEditing ? (
                      <div>
                        <input
                          type="text"
                          className="form-input"
                          style={{ padding: '6px 10px', fontSize: '0.88rem' }}
                          value={editForm.name}
                          onChange={e => setEditForm({ ...editForm, name: e.target.value })}
                        />
                        <textarea
                          className="form-textarea"
                          rows="2"
                          style={{ padding: '6px 10px', fontSize: '0.8rem', marginTop: '6px' }}
                          value={editForm.description || ''}
                          placeholder="Description"
                          onChange={e => setEditForm({ ...editForm, description: e.target.value })}
                        />
                      </div>
                    ) : (
                      <div>
                        <div style={{ fontWeight: '600', color: 'var(--text-primary)' }}>{service.name}</div>
                        <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '2px', maxWidth: '280px', textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>
                          {service.description}
                        </div>
                      </div>
                    )}
                  </td>

                  {/* Category Column */}
                  <td>
                    {isEditing ? (
                      <select
                        className="form-select"
                        style={{ padding: '6px 10px', fontSize: '0.85rem' }}
                        value={editForm.category}
                        onChange={e => setEditForm({ ...editForm, category: e.target.value })}
                      >
                        {categories.map(c => <option key={c} value={c}>{c}</option>)}
                      </select>
                    ) : (
                      <span className="badge badge-gold" style={{ fontSize: '0.75rem' }}>
                        {service.category || 'General'}
                      </span>
                    )}
                  </td>

                  {/* Price Column (LIVE CUSTOMIZATION FOCUS) */}
                  <td>
                    {isEditing ? (
                      <input
                        type="text"
                        className="form-input"
                        style={{ padding: '6px 10px', fontSize: '1rem', fontWeight: '700', color: 'var(--gold-light)' }}
                        value={editForm.price}
                        placeholder="e.g. ₹15,000"
                        onChange={e => setEditForm({ ...editForm, price: e.target.value })}
                      />
                    ) : (
                      <div style={{ fontSize: '1.15rem', fontWeight: '700', color: 'var(--gold-light)', fontFamily: 'Cormorant Garamond, serif' }}>
                        {service.price}
                      </div>
                    )}
                  </td>

                  {/* Duration Column */}
                  <td>
                    {isEditing ? (
                      <input
                        type="text"
                        className="form-input"
                        style={{ padding: '6px 10px', fontSize: '0.85rem' }}
                        value={editForm.duration}
                        placeholder="e.g. 90 mins"
                        onChange={e => setEditForm({ ...editForm, duration: e.target.value })}
                      />
                    ) : (
                      <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                        {service.duration || '—'}
                      </div>
                    )}
                  </td>

                  {/* Active Toggle Status */}
                  <td>
                    {isEditing ? (
                      <label style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer', fontSize: '0.82rem' }}>
                        <input
                          type="checkbox"
                          checked={editForm.is_active}
                          onChange={e => setEditForm({ ...editForm, is_active: e.target.checked })}
                        />
                        {editForm.is_active ? 'Active' : 'Hidden'}
                      </label>
                    ) : (
                      <span className={service.is_active ? 'badge badge-completed' : 'badge badge-cancelled'}>
                        {service.is_active ? 'Visible' : 'Hidden'}
                      </span>
                    )}
                  </td>

                  {/* Badge Tag */}
                  <td>
                    {isEditing ? (
                      <input
                        type="text"
                        className="form-input"
                        style={{ padding: '6px 10px', fontSize: '0.82rem' }}
                        value={editForm.badge || ''}
                        placeholder="e.g. Bestseller"
                        onChange={e => setEditForm({ ...editForm, badge: e.target.value })}
                      />
                    ) : (
                      service.badge ? (
                        <span style={{ fontSize: '0.75rem', color: 'var(--gold-primary)', background: 'rgba(212,175,55,0.1)', padding: '2px 8px', borderRadius: '4px' }}>
                          {service.badge}
                        </span>
                      ) : <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>None</span>
                    )}
                  </td>

                  {/* Action Buttons */}
                  <td style={{ textAlign: 'right' }}>
                    {isEditing ? (
                      <div style={{ display: 'flex', gap: '6px', justifyContent: 'flex-end' }}>
                        <button
                          onClick={() => handleSaveEdit(service.id)}
                          className="btn btn-primary btn-sm"
                          title="Save Changes"
                          style={{ padding: '6px 10px' }}
                        >
                          <Check size={16} /> Save
                        </button>
                        <button
                          onClick={cancelEdit}
                          className="btn btn-outline btn-sm"
                          title="Cancel"
                          style={{ padding: '6px 10px' }}
                        >
                          <X size={16} />
                        </button>
                      </div>
                    ) : (
                      <div style={{ display: 'flex', gap: '6px', justifyContent: 'flex-end' }}>
                        <button
                          onClick={() => startEdit(service)}
                          className="btn btn-outline btn-sm"
                          title="Edit Price & Details"
                          style={{ padding: '6px 10px' }}
                        >
                          <Edit3 size={15} /> Edit
                        </button>
                        <button
                          onClick={() => handleDelete(service.id, service.name)}
                          className="btn btn-danger btn-sm"
                          title="Delete Service"
                          style={{ padding: '6px 10px' }}
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Mobile Service Cards (< 768px) */}
      <div className="show-on-mobile" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {services.map(service => {
          const isEditing = editingId === service.id;

          return (
            <div
              key={service.id}
              className="glass-card"
              style={{
                padding: '1.15rem',
                border: isEditing ? '1px solid var(--gold-primary)' : '1px solid var(--border-color)',
                background: isEditing ? 'rgba(212, 175, 55, 0.05)' : 'var(--bg-secondary)',
                borderRadius: 'var(--radius-md)'
              }}
            >
              {isEditing ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                  <div>
                    <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '4px', display: 'block' }}>Service Name</label>
                    <input
                      type="text"
                      className="form-input"
                      value={editForm.name}
                      onChange={e => setEditForm({ ...editForm, name: e.target.value })}
                    />
                  </div>

                  <div className="admin-grid-2">
                    <div>
                      <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '4px', display: 'block' }}>Price</label>
                      <input
                        type="text"
                        className="form-input"
                        value={editForm.price}
                        placeholder="e.g. ₹15,000"
                        onChange={e => setEditForm({ ...editForm, price: e.target.value })}
                      />
                    </div>
                    <div>
                      <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '4px', display: 'block' }}>Duration</label>
                      <input
                        type="text"
                        className="form-input"
                        value={editForm.duration}
                        placeholder="e.g. 90 mins"
                        onChange={e => setEditForm({ ...editForm, duration: e.target.value })}
                      />
                    </div>
                  </div>

                  <div className="admin-grid-2">
                    <div>
                      <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '4px', display: 'block' }}>Category</label>
                      <select
                        className="form-select"
                        value={editForm.category}
                        onChange={e => setEditForm({ ...editForm, category: e.target.value })}
                      >
                        {categories.map(c => <option key={c} value={c}>{c}</option>)}
                      </select>
                    </div>
                    <div>
                      <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '4px', display: 'block' }}>Badge</label>
                      <input
                        type="text"
                        className="form-input"
                        value={editForm.badge || ''}
                        placeholder="e.g. Bestseller"
                        onChange={e => setEditForm({ ...editForm, badge: e.target.value })}
                      />
                    </div>
                  </div>

                  <div>
                    <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '4px', display: 'block' }}>Description</label>
                    <textarea
                      className="form-textarea"
                      rows="2"
                      value={editForm.description || ''}
                      onChange={e => setEditForm({ ...editForm, description: e.target.value })}
                    />
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '4px' }}>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '0.88rem' }}>
                      <input
                        type="checkbox"
                        checked={editForm.is_active}
                        onChange={e => setEditForm({ ...editForm, is_active: e.target.checked })}
                      />
                      <span>Active on Website</span>
                    </label>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginTop: '0.5rem' }}>
                    <button
                      onClick={() => handleSaveEdit(service.id)}
                      className="btn btn-primary"
                      style={{ justifyContent: 'center', padding: '10px' }}
                    >
                      <Check size={16} /> Save
                    </button>
                    <button
                      onClick={cancelEdit}
                      className="btn btn-outline"
                      style={{ justifyContent: 'center', padding: '10px' }}
                    >
                      <X size={16} /> Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '8px', marginBottom: '8px' }}>
                    <div>
                      <h4 style={{ fontSize: '1.05rem', fontWeight: '600', color: 'var(--text-primary)', marginBottom: '4px' }}>
                        {service.name}
                      </h4>
                      <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                        <span className="badge badge-gold" style={{ fontSize: '0.7rem' }}>
                          {service.category || 'General'}
                        </span>
                        {service.badge && (
                          <span style={{ fontSize: '0.7rem', color: 'var(--gold-primary)', background: 'rgba(212,175,55,0.1)', padding: '2px 6px', borderRadius: '4px' }}>
                            {service.badge}
                          </span>
                        )}
                      </div>
                    </div>
                    <span className={service.is_active ? 'badge badge-completed' : 'badge badge-cancelled'} style={{ fontSize: '0.75rem' }}>
                      {service.is_active ? 'Visible' : 'Hidden'}
                    </span>
                  </div>

                  {service.description && (
                    <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', margin: '8px 0', lineHeight: 1.4 }}>
                      {service.description}
                    </p>
                  )}

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '12px', paddingTop: '10px', borderTop: '1px solid var(--border-color)' }}>
                    <div>
                      <div style={{ fontSize: '1.25rem', fontWeight: '700', color: 'var(--gold-light)', fontFamily: 'Cormorant Garamond, serif' }}>
                        {service.price}
                      </div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                        <Clock size={12} style={{ display: 'inline', verticalAlign: '-1px', marginRight: '3px' }} />
                        {service.duration || '60 mins'}
                      </div>
                    </div>

                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button
                        onClick={() => startEdit(service)}
                        className="btn btn-outline btn-sm"
                        style={{ padding: '8px 12px' }}
                      >
                        <Edit3 size={15} /> Edit
                      </button>
                      <button
                        onClick={() => handleDelete(service.id, service.name)}
                        className="btn btn-danger btn-sm"
                        style={{ padding: '8px 10px' }}
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Add New Service Modal */}
      {showAddModal && (
        <div className="modal-backdrop" onClick={() => setShowAddModal(false)}>
          <div className="modal-card" onClick={e => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <h3 style={{ fontSize: '1.6rem', color: 'var(--text-primary)' }}>Add New Service</h3>
              <button onClick={() => setShowAddModal(false)} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleCreateService}>
              <div className="form-group">
                <label className="form-label">Service Title</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g., Sangeet Party Glam"
                  value={newService.name}
                  onChange={e => setNewService({ ...newService, name: e.target.value })}
                  required
                />
              </div>

              <div className="admin-grid-2">
                <div className="form-group">
                  <label className="form-label">Price (INR)</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="e.g. ₹4,500"
                    value={newService.price}
                    onChange={e => setNewService({ ...newService, price: e.target.value })}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Category</label>
                  <select
                    className="form-select"
                    value={newService.category}
                    onChange={e => setNewService({ ...newService, category: e.target.value })}
                  >
                    {categories.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
              </div>

              <div className="admin-grid-2">
                <div className="form-group">
                  <label className="form-label">Duration</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="e.g. 90 mins"
                    value={newService.duration}
                    onChange={e => setNewService({ ...newService, duration: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Badge (Optional)</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="e.g. Trending, Signature"
                    value={newService.badge}
                    onChange={e => setNewService({ ...newService, badge: e.target.value })}
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Description</label>
                <textarea
                  className="form-textarea"
                  rows="2"
                  placeholder="Details regarding the treatment..."
                  value={newService.description}
                  onChange={e => setNewService({ ...newService, description: e.target.value })}
                />
              </div>

              <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '1rem', padding: '0.85rem' }}>
                Publish Service
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminServices;
