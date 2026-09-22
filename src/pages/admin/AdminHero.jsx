import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import ImageUploader from '../../components/ImageUploader';
import { Save, Check, Sparkles, Sliders } from 'lucide-react';

const AdminHero = () => {
  const { storeInfo, updateStoreInfo } = useStore();
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);

  const [formData, setFormData] = useState({
    tagline: storeInfo?.tagline || 'Where Beauty Meets Confidence',
    hero_title: storeInfo?.hero_title || 'Luxury Makeovers & Bridal Artistry',
    hero_subtitle: storeInfo?.hero_subtitle || 'Experience premier styling, personalized bridal rituals, and flawless aesthetics crafted with passion in Khammam.',
    hero_badge: storeInfo?.hero_badge || 'Premium Luxury Beauty Salon',
    hero_cta: storeInfo?.hero_cta || 'Book Consultation',
    hero_image_url: storeInfo?.hero_image_url || '/banner.jpeg',
    about_title: storeInfo?.about_title || 'Crafting Confidence, One Makeover at a Time',
    about_text: storeInfo?.about_text || 'Sri Madhuri Makeovers is a professional beauty salon dedicated to enhancing confidence through high-quality beauty and grooming services.',
    experience_years: storeInfo?.experience_years || '6+',
    happy_clients: storeInfo?.happy_clients || '2,500+',
    rating_score: storeInfo?.rating_score || '4.9★'
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    await updateStoreInfo(formData);
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h2 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '2rem', color: 'var(--text-primary)', marginBottom: '4px' }}>
            Hero & <span className="text-gold-gradient">Branding Customizer</span>
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
            Customize your website headline, hero banner image, call-to-action text, and about section live
          </p>
        </div>
        <button
          onClick={handleSave}
          disabled={saving}
          className="btn btn-primary"
          style={{ gap: '8px', display: 'flex', alignItems: 'center' }}
        >
          {saved ? <Check size={16} /> : <Save size={16} />}
          {saved ? 'Saved Live!' : (saving ? 'Saving...' : 'Save Changes')}
        </button>
      </div>

      <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
        {/* Hero Section Configuration */}
        <div className="glass-card" style={{ padding: '1.75rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '1.5rem', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '0.75rem' }}>
            <Sparkles size={20} style={{ color: 'var(--gold-primary)' }} />
            <h3 style={{ fontSize: '1.15rem', color: 'var(--text-primary)', margin: 0 }}>Hero Banner Details</h3>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.25rem' }}>
            <div>
              <label className="form-label">Hero Badge Pill</label>
              <input
                className="input"
                name="hero_badge"
                value={formData.hero_badge}
                onChange={handleChange}
                placeholder="e.g. Khammam's Most Loved Salon"
              />
            </div>

            <div>
              <label className="form-label">Hero Main Tagline</label>
              <input
                className="input"
                name="tagline"
                value={formData.tagline}
                onChange={handleChange}
                placeholder="e.g. Where Beauty Meets Confidence"
              />
            </div>

            <div style={{ gridColumn: '1 / -1' }}>
              <label className="form-label">Hero Main Headline</label>
              <input
                className="input"
                name="hero_title"
                value={formData.hero_title}
                onChange={handleChange}
                placeholder="Headline text"
              />
            </div>

            <div style={{ gridColumn: '1 / -1' }}>
              <label className="form-label">Hero Subtitle Paragraph</label>
              <textarea
                className="input"
                rows={3}
                name="hero_subtitle"
                value={formData.hero_subtitle}
                onChange={handleChange}
                placeholder="Detailed hero subtitle text"
              />
            </div>

            <div>
              <label className="form-label">Call To Action Button Label</label>
              <input
                className="input"
                name="hero_cta"
                value={formData.hero_cta}
                onChange={handleChange}
                placeholder="e.g. Book Consultation"
              />
            </div>
          </div>

          <div style={{ marginTop: '1.5rem' }}>
            <ImageUploader
              label="Hero Banner Image"
              currentUrl={formData.hero_image_url}
              onUpload={url => setFormData(prev => ({ ...prev, hero_image_url: url }))}
            />
          </div>
        </div>

        {/* Brand Highlights & Counter Stats */}
        <div className="glass-card" style={{ padding: '1.75rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '1.5rem', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '0.75rem' }}>
            <Sliders size={20} style={{ color: 'var(--gold-primary)' }} />
            <h3 style={{ fontSize: '1.15rem', color: 'var(--text-primary)', margin: 0 }}>Stats & About Text</h3>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.25rem', marginBottom: '1.5rem' }}>
            <div>
              <label className="form-label">Years of Experience</label>
              <input
                className="input"
                name="experience_years"
                value={formData.experience_years}
                onChange={handleChange}
                placeholder="6+"
              />
            </div>
            <div>
              <label className="form-label">Happy Clients Count</label>
              <input
                className="input"
                name="happy_clients"
                value={formData.happy_clients}
                onChange={handleChange}
                placeholder="2,500+"
              />
            </div>
            <div>
              <label className="form-label">Client Rating Score</label>
              <input
                className="input"
                name="rating_score"
                value={formData.rating_score}
                onChange={handleChange}
                placeholder="4.9★"
              />
            </div>
          </div>

          <div>
            <label className="form-label">About Story Paragraph</label>
            <textarea
              className="input"
              rows={4}
              name="about_text"
              value={formData.about_text}
              onChange={handleChange}
              placeholder="Salon story and mission"
            />
          </div>
        </div>
      </form>
    </div>
  );
};

export default AdminHero;
