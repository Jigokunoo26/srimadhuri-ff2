import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import ImageUploader from '../../components/ImageUploader';
import { Users, Plus, Trash2, Edit3, Save, X } from 'lucide-react';

const AdminTeam = () => {
  const { team, addTeamMember, updateTeamMember, deleteTeamMember } = useStore();
  const [showForm, setShowForm] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({ name: '', role: '', experience: '3+ Years', skills: '', image_url: '' });

  const resetForm = () => {
    setForm({ name: '', role: '', experience: '3+ Years', skills: '', image_url: '' });
    setEditItem(null);
    setShowForm(false);
  };

  const handleEdit = (member) => {
    setForm({
      name: member.name,
      role: member.role,
      experience: member.experience || '3+ Years',
      skills: Array.isArray(member.skills) ? member.skills.join(', ') : (member.skills || ''),
      image_url: member.image_url || ''
    });
    setEditItem(member);
    setShowForm(true);
  };

  const handleSave = async () => {
    if (!form.name.trim() || !form.role.trim()) { alert('Name and role are required.'); return; }
    setSaving(true);
    const payload = {
      name: form.name,
      role: form.role,
      experience: form.experience,
      skills: form.skills.split(',').map(s => s.trim()).filter(Boolean),
      image_url: form.image_url
    };
    if (editItem) {
      await updateTeamMember(editItem.id, payload);
    } else {
      await addTeamMember(payload);
    }
    setSaving(false);
    resetForm();
  };

  return (
    <div>
      {/* Header */}
      <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
        <div>
          <h2 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '2rem', color: 'var(--text-primary)', marginBottom: '4px' }}>
            Team <span className="text-gold-gradient">Members</span>
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>{team.length} members · Appears in the About section of your website</p>
        </div>
        <button className="btn btn-primary" onClick={() => { resetForm(); setShowForm(true); }}
          style={{ gap: '8px', display: 'flex', alignItems: 'center' }}>
          <Plus size={16} /> Add Member
        </button>
      </div>

      {/* Form */}
      {showForm && (
        <div className="glass-card" style={{ padding: 'clamp(1rem, 4vw, 1.75rem)', marginBottom: '2rem', border: '1px solid var(--gold-primary)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
            <h3 style={{ color: 'var(--gold-light)', fontSize: '1.1rem' }}>{editItem ? 'Edit Member' : 'Add Team Member'}</h3>
            <button onClick={resetForm} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}><X size={20} /></button>
          </div>
          <div className="admin-grid-2">
            <div>
              <label className="form-label">Full Name *</label>
              <input className="input" placeholder="e.g. Sri Madhuri" value={form.name}
                onChange={e => setForm(p => ({ ...p, name: e.target.value }))} />
            </div>
            <div>
              <label className="form-label">Role / Title *</label>
              <input className="input" placeholder="e.g. Founder & Master Stylist" value={form.role}
                onChange={e => setForm(p => ({ ...p, role: e.target.value }))} />
            </div>
            <div>
              <label className="form-label">Experience</label>
              <input className="input" placeholder="e.g. 5+ Years" value={form.experience}
                onChange={e => setForm(p => ({ ...p, experience: e.target.value }))} />
            </div>
            <div>
              <label className="form-label">Skills (comma-separated)</label>
              <input className="input" placeholder="Bridal Makeup, HD Airbrush, Saree Draping" value={form.skills}
                onChange={e => setForm(p => ({ ...p, skills: e.target.value }))} />
            </div>
          </div>
          <div style={{ marginTop: '1.25rem' }}>
            <ImageUploader label="Profile Photo" currentUrl={form.image_url}
              onUpload={url => setForm(p => ({ ...p, image_url: url }))} />
          </div>
          <div style={{ display: 'flex', gap: '10px', marginTop: '1.5rem', justifyContent: 'flex-end' }}>
            <button className="btn btn-ghost btn-sm" onClick={resetForm}>Cancel</button>
            <button className="btn btn-primary btn-sm" onClick={handleSave} disabled={saving}
              style={{ gap: '6px', display: 'flex', alignItems: 'center' }}>
              <Save size={14} /> {saving ? 'Saving...' : (editItem ? 'Update Member' : 'Add Member')}
            </button>
          </div>
        </div>
      )}

      {/* Team Grid */}
      {team.length === 0 ? (
        <div className="glass-card" style={{ padding: '4rem', textAlign: 'center' }}>
          <Users size={48} style={{ color: 'var(--text-muted)', marginBottom: '1rem' }} />
          <p style={{ color: 'var(--text-muted)' }}>No team members yet. Add your first staff member!</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '1.25rem' }}>
          {team.map(member => (
            <div key={member.id} className="glass-card" style={{ padding: '1.5rem', display: 'flex', gap: '1.25rem', alignItems: 'flex-start' }}>
              {/* Photo */}
              <div style={{
                width: '72px', height: '72px', borderRadius: '50%', overflow: 'hidden', flexShrink: 0,
                background: 'var(--bg-secondary)', border: '2px solid var(--gold-primary)'
              }}>
                {member.image_url ? (
                  <img src={member.image_url} alt={member.name}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    onError={e => e.target.style.display = 'none'} />
                ) : (
                  <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <span style={{ fontSize: '1.5rem', color: 'var(--gold-primary)', fontWeight: '700' }}>{member.name?.[0]}</span>
                  </div>
                )}
              </div>
              {/* Info */}
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontWeight: '700', color: 'var(--text-primary)', fontSize: '1.05rem' }}>{member.name}</div>
                <div style={{ fontSize: '0.82rem', color: 'var(--gold-primary)', marginBottom: '4px' }}>{member.role}</div>
                <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: '8px' }}>{member.experience}</div>
                {Array.isArray(member.skills) && member.skills.length > 0 && (
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '5px', marginBottom: '12px' }}>
                    {member.skills.map((sk, i) => (
                      <span key={i} style={{
                        padding: '2px 9px', borderRadius: 'var(--radius-full)',
                        background: 'rgba(212,175,55,0.1)', border: '1px solid rgba(212,175,55,0.3)',
                        color: 'var(--gold-light)', fontSize: '0.72rem'
                      }}>{sk}</span>
                    ))}
                  </div>
                )}
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button className="btn btn-outline btn-sm" style={{ gap: '5px', display: 'flex', alignItems: 'center', fontSize: '0.78rem' }}
                    onClick={() => handleEdit(member)}>
                    <Edit3 size={12} /> Edit
                  </button>
                  <button className="btn btn-danger btn-sm" style={{ gap: '5px', display: 'flex', alignItems: 'center', fontSize: '0.78rem' }}
                    onClick={() => { if (window.confirm(`Delete ${member.name}?`)) deleteTeamMember(member.id); }}>
                    <Trash2 size={12} /> Remove
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminTeam;
