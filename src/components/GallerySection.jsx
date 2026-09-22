import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { X } from 'lucide-react';

const GallerySection = () => {
  const { gallery } = useStore();
  const [active, setActive] = useState('All');
  const [preview, setPreview] = useState(null);

  const categories = ['All', ...new Set(gallery.map(g => g.category || 'General'))];
  const filtered = active === 'All' ? gallery : gallery.filter(g => g.category === active);

  return (
    <section id="gallery" className="section" style={{ background: 'var(--bg-primary)' }}>
      <div className="container">
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', marginBottom: '4rem', alignItems: 'end' }}>
          <div>
            <h2 style={{ color: 'var(--bone)' }}>
              Portfolio<em> in progress.</em>
            </h2>
          </div>
          <p style={{ color: 'var(--text-secondary)', fontSize: '1rem', lineHeight: 1.7 }}>
            Recent work across bridal, hair, and skincare. Most shoots happen in-studio, occasionally at the venue.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '3rem' }}>
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setActive(cat)}
              style={{
                padding: '7px 16px',
                borderRadius: 'var(--radius-full)',
                fontSize: '0.82rem',
                cursor: 'pointer',
                border: '1px solid',
                transition: 'var(--transition)',
                background: active === cat ? 'var(--bg-tertiary)' : 'transparent',
                borderColor: active === cat ? 'var(--amber)' : 'var(--border-subtle)',
                color: active === cat ? 'var(--amber-light)' : 'var(--text-secondary)',
                fontWeight: 500
              }}
            >
              {cat}
            </button>
          ))}
        </div>

        {filtered.length === 0 ? (
          <div className="surface" style={{ padding: '4rem', textAlign: 'center' }}>
            <p style={{ color: 'var(--text-muted)' }}>No images in this category yet.</p>
          </div>
        ) : (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(4, 1fr)',
              gridAutoRows: '220px',
              gap: '1rem'
            }}
            className="gallery-grid"
          >
            {filtered.map((item, i) => {
              const span = i % 7 === 0 ? { gridColumn: 'span 2', gridRow: 'span 2' } :
                           i % 5 === 0 ? { gridRow: 'span 2' } : {};
              return (
                <figure
                  key={item.id}
                  style={{
                    margin: 0,
                    borderRadius: 'var(--radius-md)',
                    overflow: 'hidden',
                    cursor: 'pointer',
                    position: 'relative',
                    background: 'var(--bg-tertiary)',
                    ...span
                  }}
                  onClick={() => setPreview(item)}
                >
                  <img
                    src={item.image_url}
                    alt={item.title}
                    style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.6s ease' }}
                    onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.04)'}
                    onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
                    onError={e => { e.currentTarget.src = `https://picsum.photos/seed/sri-madhuri-${i}/600/600`; }}
                  />
                  <figcaption
                    style={{
                      position: 'absolute',
                      inset: 0,
                      background: 'linear-gradient(180deg, transparent 50%, rgba(8, 12, 10, 0.92) 100%)',
                      padding: '1.25rem',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'flex-end',
                      opacity: 0,
                      transition: 'opacity 0.3s ease'
                    }}
                    onMouseEnter={e => e.currentTarget.style.opacity = 1}
                    onMouseLeave={e => e.currentTarget.style.opacity = 0}
                  >
                    <span style={{ fontSize: '0.7rem', color: 'var(--amber-light)', textTransform: 'uppercase', letterSpacing: '0.18em', fontWeight: 500, marginBottom: '4px' }}>
                      {item.category}
                    </span>
                    <span style={{ fontFamily: 'Playfair Display, serif', fontSize: '1.1rem', color: 'var(--bone)' }}>
                      {item.title}
                    </span>
                  </figcaption>
                </figure>
              );
            })}
          </div>
        )}
      </div>

      {preview && (
        <div
          onClick={() => setPreview(null)}
          style={{
            position: 'fixed', inset: 0, zIndex: 1100,
            background: 'rgba(8, 12, 10, 0.95)',
            backdropFilter: 'blur(12px)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            padding: '2rem'
          }}
        >
          <button
            onClick={() => setPreview(null)}
            style={{
              position: 'absolute', top: 24, right: 24,
              width: 44, height: 44, borderRadius: '50%',
              background: 'var(--bg-secondary)', border: '1px solid var(--border-medium)',
              color: 'var(--text-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center',
              cursor: 'pointer'
            }}
          >
            <X size={20} />
          </button>
          <div style={{ maxWidth: 900, width: '100%' }} onClick={e => e.stopPropagation()}>
            <img src={preview.image_url} alt={preview.title} style={{ width: '100%', maxHeight: '80vh', objectFit: 'contain', borderRadius: 'var(--radius-md)' }} />
            <div style={{ textAlign: 'center', marginTop: '1.5rem' }}>
              <div style={{ fontFamily: 'Playfair Display, serif', fontSize: '1.4rem', color: 'var(--bone)', fontStyle: 'italic' }}>
                {preview.title}
              </div>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.18em', marginTop: '6px' }}>
                {preview.category}
              </div>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @media (max-width: 900px) {
          .gallery-grid { grid-template-columns: repeat(2, 1fr) !important; }
        }
        @media (max-width: 600px) {
          .gallery-grid { grid-template-columns: 1fr !important; grid-auto-rows: 280px !important; }
        }
      `}</style>
    </section>
  );
};

export default GallerySection;
