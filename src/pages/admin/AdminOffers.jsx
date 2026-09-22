import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { Plus, Trash2, Edit3, Check, X, Tag } from 'lucide-react';

const AdminOffers = () => {
  const { offers, updateOffer, addOffer, deleteOffer } = useStore();
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({});
  const [showAddModal, setShowAddModal] = useState(false);
  const [newOffer, setNewOffer] = useState({
    title: '',
    description: '',
    original_price: '₹',
    offer_price: '₹',
    discount: '',
    badge: 'Special Deal',
    end_date: '',
    is_active: true
  });

  const startEdit = (offer) => {
    setEditingId(offer.id);
    setEditForm({ ...offer });
  };

  const handleSave = async (id) => {
    await updateOffer(id, editForm);
    setEditingId(null);
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    await addOffer(newOffer);
    setShowAddModal(false);
    setNewOffer({
      title: '',
      description: '',
      original_price: '₹',
      offer_price: '₹',
      discount: '',
      badge: 'Special Deal',
      end_date: '',
      is_active: true
    });
  };

  return (
    <div>
      <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
        <div>
          <h2 style={{ fontSize: '2rem', color: 'var(--text-primary)', marginBottom: '4px' }}>
            Promotions & Special Deals
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
            Create limited-time festive offers, package discounts, and countdown deals.
          </p>
        </div>
        <button onClick={() => setShowAddModal(true)} className="btn btn-primary" style={{ gap: '8px' }}>
          <Plus size={18} /> Create New Offer
        </button>
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
          gap: '1.5rem'
        }}
      >
        {offers.map(offer => {
          const isEditing = editingId === offer.id;

          return (
            <div
              key={offer.id}
              className="glass-card"
              style={{
                padding: '1.75rem',
                border: '1px solid var(--border-medium)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between'
              }}
            >
              <div>
                {isEditing ? (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '1rem' }}>
                    <input
                      type="text"
                      className="form-input"
                      value={editForm.title}
                      placeholder="Title"
                      onChange={e => setEditForm({ ...editForm, title: e.target.value })}
                    />
                    <textarea
                      className="form-textarea"
                      rows="2"
                      value={editForm.description}
                      placeholder="Description"
                      onChange={e => setEditForm({ ...editForm, description: e.target.value })}
                    />
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                      <input
                        type="text"
                        className="form-input"
                        placeholder="Offer Price (e.g. ₹3,999)"
                        value={editForm.offer_price}
                        onChange={e => setEditForm({ ...editForm, offer_price: e.target.value })}
                      />
                      <input
                        type="text"
                        className="form-input"
                        placeholder="Original Price"
                        value={editForm.original_price || ''}
                        onChange={e => setEditForm({ ...editForm, original_price: e.target.value })}
                      />
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                      <input
                        type="text"
                        className="form-input"
                        placeholder="Discount (e.g. 25% OFF)"
                        value={editForm.discount || ''}
                        onChange={e => setEditForm({ ...editForm, discount: e.target.value })}
                      />
                      <input
                        type="date"
                        className="form-input"
                        value={editForm.end_date || ''}
                        onChange={e => setEditForm({ ...editForm, end_date: e.target.value })}
                      />
                    </div>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem' }}>
                      <input
                        type="checkbox"
                        checked={editForm.is_active}
                        onChange={e => setEditForm({ ...editForm, is_active: e.target.checked })}
                      />
                      Active on public site
                    </label>
                  </div>
                ) : (
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                      <span className="badge badge-gold">{offer.badge || 'Special'}</span>
                      <span className={offer.is_active ? 'badge badge-completed' : 'badge badge-cancelled'}>
                        {offer.is_active ? 'Active' : 'Disabled'}
                      </span>
                    </div>
                    <h3 style={{ fontSize: '1.4rem', color: 'var(--text-primary)', marginBottom: '0.4rem' }}>
                      {offer.title}
                    </h3>
                    <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', marginBottom: '1rem', lineHeight: 1.5 }}>
                      {offer.description}
                    </p>
                    <div style={{ display: 'flex', alignItems: 'baseline', gap: '10px', marginBottom: '1rem' }}>
                      <span style={{ fontSize: '1.6rem', fontWeight: '700', color: 'var(--gold-light)' }}>
                        {offer.offer_price}
                      </span>
                      {offer.original_price && (
                        <span style={{ fontSize: '1rem', color: 'var(--text-muted)', textDecoration: 'line-through' }}>
                          {offer.original_price}
                        </span>
                      )}
                      {offer.discount && (
                        <span style={{ fontSize: '0.8rem', color: 'var(--success)', fontWeight: '700' }}>
                          ({offer.discount})
                        </span>
                      )}
                    </div>
                    {offer.end_date && (
                      <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                        Expires on: {offer.end_date}
                      </div>
                    )}
                  </div>
                )}
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', marginTop: '1.5rem', borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '1rem' }}>
                {isEditing ? (
                  <>
                    <button onClick={() => handleSave(offer.id)} className="btn btn-primary btn-sm">
                      <Check size={15} /> Save
                    </button>
                    <button onClick={() => setEditingId(null)} className="btn btn-outline btn-sm">
                      <X size={15} />
                    </button>
                  </>
                ) : (
                  <>
                    <button onClick={() => startEdit(offer)} className="btn btn-outline btn-sm">
                      <Edit3 size={15} /> Edit
                    </button>
                    <button onClick={() => deleteOffer(offer.id)} className="btn btn-danger btn-sm">
                      <Trash2 size={15} />
                    </button>
                  </>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Add Modal */}
      {showAddModal && (
        <div className="modal-backdrop" onClick={() => setShowAddModal(false)}>
          <div className="modal-card" onClick={e => e.stopPropagation()}>
            <h3 style={{ fontSize: '1.6rem', marginBottom: '1.25rem' }}>Create Promotional Offer</h3>
            <form onSubmit={handleCreate}>
              <div className="form-group">
                <label className="form-label">Offer Title</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g. Diwali Bridal Glamour Package"
                  value={newOffer.title}
                  onChange={e => setNewOffer({ ...newOffer, title: e.target.value })}
                  required
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="form-group">
                  <label className="form-label">Offer Price</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="e.g. ₹18,999"
                    value={newOffer.offer_price}
                    onChange={e => setNewOffer({ ...newOffer, offer_price: e.target.value })}
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Original Price</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="e.g. ₹25,000"
                    value={newOffer.original_price}
                    onChange={e => setNewOffer({ ...newOffer, original_price: e.target.value })}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="form-group">
                  <label className="form-label">Discount Badge</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="e.g. 25% OFF"
                    value={newOffer.discount}
                    onChange={e => setNewOffer({ ...newOffer, discount: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Expiration Date</label>
                  <input
                    type="date"
                    className="form-input"
                    value={newOffer.end_date}
                    onChange={e => setNewOffer({ ...newOffer, end_date: e.target.value })}
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Description</label>
                <textarea
                  className="form-textarea"
                  rows="2"
                  value={newOffer.description}
                  onChange={e => setNewOffer({ ...newOffer, description: e.target.value })}
                />
              </div>

              <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '1rem', padding: '0.85rem' }}>
                Publish Offer
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminOffers;
