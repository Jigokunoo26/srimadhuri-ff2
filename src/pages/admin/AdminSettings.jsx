import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import ImageUploader from '../../components/ImageUploader';
import { Save, Check, Store, Phone, Clock, Share2, Image, MessageSquare, Plus, X } from 'lucide-react';

const AdminSettings = () => {
  const { storeInfo, updateStoreInfo } = useStore();
  const [formData, setFormData] = useState({ ...storeInfo });
  const [saved, setSaved] = useState(false);
  const [newFaqQ, setNewFaqQ] = useState('');
  const [newFaqA, setNewFaqA] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    await updateStoreInfo(formData);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const addFaq = () => {
    if (!newFaqQ.trim() || !newFaqA.trim()) return;
    const faqs = formData.faqs || [];
    setFormData({ ...formData, faqs: [...faqs, { question: newFaqQ.trim(), answer: newFaqA.trim() }] });
    setNewFaqQ('');
    setNewFaqA('');
  };

  const removeFaq = (index) => {
    const faqs = [...(formData.faqs || [])];
    faqs.splice(index, 1);
    setFormData({ ...formData, faqs });
  };

  return (
    <div style={{ maxWidth: '900px' }}>
      <div style={{ marginBottom: '2rem' }}>
        <h2 style={{ fontSize: '2rem', color: 'var(--text-primary)', marginBottom: '4px' }}>
          Salon & Store Configuration
        </h2>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
          Update store phone numbers, WhatsApp booking links, working hours, and social profiles.
        </p>
      </div>

      {saved && (
        <div style={{ background: 'var(--success-bg)', border: '1px solid var(--success)', color: 'var(--success)', padding: '12px 20px', borderRadius: 'var(--radius-md)', display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '1.5rem' }}>
          <Check size={18} /> Salon configuration saved successfully!
        </div>
      )}

      <form onSubmit={handleSubmit}>
        {/* Salon Identity */}
        <div className="glass-card" style={{ padding: '2rem', marginBottom: '1.5rem' }}>
          <h3 style={{ fontSize: '1.2rem', color: 'var(--gold-light)', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Store size={18} /> Salon Identity
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <label className="form-label">Salon Name</label>
              <input type="text" className="form-input" value={formData.name || ''} onChange={e => setFormData({ ...formData, name: e.target.value })} required />
            </div>
            <div className="form-group">
              <label className="form-label">Tagline</label>
              <input type="text" className="form-input" value={formData.tagline || ''} onChange={e => setFormData({ ...formData, tagline: e.target.value })} />
            </div>
          </div>
        </div>

        {/* Contact & WhatsApp */}
        <div className="glass-card" style={{ padding: '2rem', marginBottom: '1.5rem' }}>
          <h3 style={{ fontSize: '1.2rem', color: 'var(--gold-light)', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Phone size={18} /> Contact & WhatsApp Booking
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <label className="form-label">Display Phone</label>
              <input type="text" className="form-input" value={formData.phone || ''} onChange={e => setFormData({ ...formData, phone: e.target.value })} />
            </div>
            <div className="form-group">
              <label className="form-label">WhatsApp Number (No +)</label>
              <input type="text" className="form-input" value={formData.whatsapp_number || ''} onChange={e => setFormData({ ...formData, whatsapp_number: e.target.value })} placeholder="e.g. 918985291053" required />
            </div>
            <div className="form-group">
              <label className="form-label">Email</label>
              <input type="email" className="form-input" value={formData.email || ''} onChange={e => setFormData({ ...formData, email: e.target.value })} />
            </div>
          </div>
          <div className="form-group">
            <label className="form-label">Salon Address</label>
            <input type="text" className="form-input" value={formData.address || ''} onChange={e => setFormData({ ...formData, address: e.target.value })} />
          </div>
        </div>

        {/* About Section */}
        <div className="glass-card" style={{ padding: '2rem', marginBottom: '1.5rem' }}>
          <h3 style={{ fontSize: '1.2rem', color: 'var(--gold-light)', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <MessageSquare size={18} /> About Section (Homepage)
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <label className="form-label">About Title</label>
              <input type="text" className="form-input" value={formData.about_title || ''} onChange={e => setFormData({ ...formData, about_title: e.target.value })} placeholder="e.g. Crafting Confidence, One Makeover at a Time" />
            </div>
            <div className="form-group">
              <label className="form-label">Award Label</label>
              <input type="text" className="form-input" value={formData.about_award_label || ''} onChange={e => setFormData({ ...formData, about_award_label: e.target.value })} placeholder="e.g. Of Excellence in Khammam" />
            </div>
          </div>
          <div className="form-group">
            <label className="form-label">About Main Text</label>
            <textarea className="form-textarea" rows="3" value={formData.about_text || ''} onChange={e => setFormData({ ...formData, about_text: e.target.value })} />
          </div>
          <div className="form-group">
            <label className="form-label">About Secondary Text</label>
            <textarea className="form-textarea" rows="2" value={formData.about_subtext || ''} onChange={e => setFormData({ ...formData, about_subtext: e.target.value })} placeholder="Additional about paragraph..." />
          </div>
          <div style={{ marginTop: '1rem' }}>
            <ImageUploader label="About Section Image" currentUrl={formData.about_image_url || formData.hero_image_url || ''} onUpload={url => setFormData({ ...formData, about_image_url: url })} />
          </div>
          <div className="form-group" style={{ marginTop: '1rem' }}>
            <label className="form-label">Features (one per line)</label>
            <textarea className="form-textarea" rows="4" value={(formData.about_features || []).join('\n')} onChange={e => setFormData({ ...formData, about_features: e.target.value.split('\n').filter(f => f.trim()) })} placeholder="Expert Certified Beauticians&#10;100% Authentic Luxury Brands&#10;Hospital-Grade Sanitation&#10;Tailored Bridal Consultations" />
          </div>
        </div>

        {/* Working Hours */}
        <div className="glass-card" style={{ padding: '2rem', marginBottom: '1.5rem' }}>
          <h3 style={{ fontSize: '1.2rem', color: 'var(--gold-light)', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Clock size={18} /> Operating Hours
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <label className="form-label">Mon - Fri Hours</label>
              <input type="text" className="form-input" value={formData.hours_weekday || ''} onChange={e => setFormData({ ...formData, hours_weekday: e.target.value })} />
            </div>
            <div className="form-group">
              <label className="form-label">Saturday Hours</label>
              <input type="text" className="form-input" value={formData.hours_saturday || ''} onChange={e => setFormData({ ...formData, hours_saturday: e.target.value })} />
            </div>
            <div className="form-group">
              <label className="form-label">Sunday Hours</label>
              <input type="text" className="form-input" value={formData.hours_sunday || ''} onChange={e => setFormData({ ...formData, hours_sunday: e.target.value })} />
            </div>
          </div>
        </div>

        {/* Social Links */}
        <div className="glass-card" style={{ padding: '2rem', marginBottom: '1.5rem' }}>
          <h3 style={{ fontSize: '1.2rem', color: 'var(--gold-light)', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Share2 size={18} /> Social Media & Reviews
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <label className="form-label">Instagram Profile URL</label>
              <input type="url" className="form-input" value={formData.social_instagram || ''} onChange={e => setFormData({ ...formData, social_instagram: e.target.value })} />
            </div>
            <div className="form-group">
              <label className="form-label">YouTube Channel URL</label>
              <input type="url" className="form-input" value={formData.social_youtube || ''} onChange={e => setFormData({ ...formData, social_youtube: e.target.value })} />
            </div>
            <div className="form-group">
              <label className="form-label">Facebook Page URL</label>
              <input type="url" className="form-input" value={formData.social_facebook || ''} onChange={e => setFormData({ ...formData, social_facebook: e.target.value })} />
            </div>
            <div className="form-group">
              <label className="form-label">Google Review URL</label>
              <input type="url" className="form-input" value={formData.google_review_url || ''} onChange={e => setFormData({ ...formData, google_review_url: e.target.value })} />
            </div>
            <div className="form-group">
              <label className="form-label">Google Review Count</label>
              <input type="number" className="form-input" value={formData.google_review_count || ''} onChange={e => setFormData({ ...formData, google_review_count: parseInt(e.target.value) || 0 })} placeholder="247" />
              <small style={{ color: 'var(--text-muted)', fontSize: '0.78rem', marginTop: '4px', display: 'block' }}>
                Total number of Google reviews to display
              </small>
            </div>
          </div>
        </div>

        {/* Map Embed */}
        <div className="glass-card" style={{ padding: '2rem', marginBottom: '1.5rem' }}>
          <h3 style={{ fontSize: '1.2rem', color: 'var(--gold-light)', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Image size={18} /> Google Maps Embed
          </h3>
          <div className="form-group">
            <label className="form-label">Google Maps Embed URL (optional)</label>
            <input type="url" className="form-input" value={formData.map_embed_url || ''} onChange={e => setFormData({ ...formData, map_embed_url: e.target.value })} placeholder="https://www.google.com/maps/embed?pb=..." />
            <small style={{ color: 'var(--text-muted)', fontSize: '0.78rem', marginTop: '4px', display: 'block' }}>
              Get embed URL from Google Maps → Share → Embed a map → Copy HTML. Leave empty to use coordinates below.
            </small>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <label className="form-label">Latitude</label>
              <input type="number" step="any" className="form-input" value={formData.map_lat ?? ''} onChange={e => setFormData({ ...formData, map_lat: parseFloat(e.target.value) || 0 })} placeholder="17.2264" />
            </div>
            <div className="form-group">
              <label className="form-label">Longitude</label>
              <input type="number" step="any" className="form-input" value={formData.map_lng ?? ''} onChange={e => setFormData({ ...formData, map_lng: parseFloat(e.target.value) || 0 })} placeholder="80.1509" />
            </div>
            <div className="form-group">
              <label className="form-label">Zoom (1-21)</label>
              <input type="number" min="1" max="21" className="form-input" value={formData.map_zoom ?? ''} onChange={e => setFormData({ ...formData, map_zoom: parseInt(e.target.value) || 16 })} placeholder="16" />
            </div>
          </div>
          <a
            href={`https://www.google.com/maps?q=${formData.map_lat},${formData.map_lng}`}
            target="_blank"
            rel="noreferrer"
            className="btn btn-outline btn-sm"
            style={{ marginTop: '0.5rem', gap: '6px', display: 'inline-flex' }}
          >
            Open in Google Maps
          </a>
          <div className="form-group" style={{ marginTop: '1rem' }}>
            <label className="form-label">Google Maps Embed (paste iframe HTML)</label>
            <textarea
              className="form-textarea"
              rows={4}
              value={formData.map_iframe_html || ''}
              onChange={e => setFormData({ ...formData, map_iframe_html: e.target.value })}
              placeholder='<iframe src="https://www.google.com/maps/embed?pb=..." width="600" height="450" style="border:0;" allowfullscreen="" loading="lazy" referrerpolicy="strict-origin-when-cross-origin"></iframe>'
            />
            <small style={{ color: 'var(--text-muted)', fontSize: '0.78rem', marginTop: '4px', display: 'block' }}>
              Go to Google Maps → Share → Embed a map → Copy HTML → paste the entire iframe tag here.
            </small>
          </div>
        </div>

        {/* FAQs */}
        <div className="glass-card" style={{ padding: '2rem', marginBottom: '1.5rem' }}>
          <h3 style={{ fontSize: '1.2rem', color: 'var(--gold-light)', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <MessageSquare size={18} /> FAQs (Frequently Asked Questions)
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
            <div className="form-group">
              <label className="form-label">Question</label>
              <input type="text" className="form-input" value={newFaqQ} onChange={e => setNewFaqQ(e.target.value)} placeholder="e.g. Do you take appointments on Sundays?" />
            </div>
            <div className="form-group">
              <label className="form-label">Answer</label>
              <input type="text" className="form-input" value={newFaqA} onChange={e => setNewFaqA(e.target.value)} placeholder="e.g. Yes, by prior appointment only." />
            </div>
          </div>
          <button type="button" className="btn btn-outline btn-sm" onClick={addFaq} style={{ gap: '6px', display: 'flex', alignItems: 'center', marginBottom: '1rem' }}>
            <Plus size={14} /> Add FAQ
          </button>
          {(formData.faqs || []).map((faq, i) => (
            <div key={i} style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start', padding: '0.75rem', background: 'rgba(255,255,255,0.03)', borderRadius: 'var(--radius-sm)', marginBottom: '0.5rem' }}>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: '600', color: 'var(--gold-light)', fontSize: '0.9rem' }}>Q: {faq.question}</div>
                <div style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginTop: '4px' }}>A: {faq.answer}</div>
              </div>
              <button type="button" onClick={() => removeFaq(i)} style={{ background: 'none', border: 'none', color: 'var(--danger)', cursor: 'pointer', padding: '4px' }}>
                <X size={16} />
              </button>
            </div>
          ))}
        </div>

        <button type="submit" className="btn btn-primary" style={{ padding: '0.9rem 2.5rem', gap: '8px' }}>
          <Save size={18} /> Save All Settings
        </button>
      </form>
    </div>
  );
};

export default AdminSettings;
