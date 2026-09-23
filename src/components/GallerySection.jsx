import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { X, Maximize2 } from 'lucide-react';

const GallerySection = () => {
  const { gallery } = useStore();
  const [active, setActive] = useState('All');
  const [preview, setPreview] = useState(null);

  const categories = ['All', ...new Set(gallery.map(g => g.category || 'General'))];
  const filtered = active === 'All' ? gallery : gallery.filter(g => g.category === active);

  return (
    <section id="gallery" className="section" style={{ background: 'var(--bg-primary)' }}>
      <div className="container">
        {/* Header */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '2rem',
            marginBottom: '3rem',
            alignItems: 'end'
          }}
          className="gallery-header"
        >
          <div>
            <div style={{ fontSize: '0.72rem', color: 'var(--amber-light)', textTransform: 'uppercase', letterSpacing: '0.22em', marginBottom: '0.75rem', fontWeight: 600 }}>
              Visual Archive
            </div>
            <h2 style={{ color: 'var(--bone)' }}>
              Portfolio<em> in progress.</em>
            </h2>
          </div>
          <p style={{ color: 'var(--text-secondary)', fontSize: 'clamp(0.92rem, 2vw, 1.05rem)', lineHeight: 1.65 }}>
            Recent work across bridal, hair, and skincare. Most shoots happen in-studio, occasionally at the venue.
          </p>
        </div>

        {/* Filter Pills with touch scrolling */}
        <div
          className="mobile-scroll-x"
          style={{
            marginBottom: '2.5rem',
            gap: '8px'
          }}
        >
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setActive(cat)}
              style={{
                padding: '8px 18px',
                borderRadius: 'var(--radius-full)',
                fontSize: '0.84rem',
                cursor: 'pointer',
                border: '1px solid',
                transition: 'var(--transition)',
                whiteSpace: 'nowrap',
                background: active === cat ? 'var(--bg-tertiary)' : 'rgba(26, 38, 32, 0.4)',
                borderColor: active === cat ? 'var(--amber)' : 'var(--border-subtle)',
                color: active === cat ? 'var(--amber-light)' : 'var(--text-secondary)',
                fontWeight: 500,
                touchAction: 'manipulation'
              }}
            >
              {cat}
            </button>
          ))}
        </div>

        {filtered.length === 0 ? (
          <div className="surface" style={{ padding: '3.5rem 1.5rem', textAlign: 'center' }}>
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
                  className="gallery-item"
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
                    onError={e => { e.currentTarget.src = '/banner.jpeg'; }}
                  />
                  <figcaption
                    style={{
                      position: 'absolute',
                      inset: 0,
                      background: 'linear-gradient(180deg, transparent 40%, rgba(8, 12, 10, 0.92) 100%)',
                      padding: '1rem',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'flex-end',
                      opacity: 0,
                      transition: 'opacity 0.3s ease'
                    }}
                    className="gallery-caption"
                  >
                    <div style={{ fontFamily: 'Playfair Display, serif', fontSize: '1rem', color: 'var(--bone)', fontWeight: 500 }}>
                      {item.title}
                    </div>
                    <div style={{ fontSize: '0.68rem', color: 'var(--amber-light)', textTransform: 'uppercase', letterSpacing: '0.15em', marginTop: '2px' }}>
                      {item.category}
                    </div>
                  </figcaption>
                </figure>
              );
            })}
          </div>
        )}
      </div>

      {/* Lightbox with safe viewport bounds on mobile */}
      {preview && (
        <div
          onClick={() => setPreview(null)}
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 1100,
            background: 'rgba(8, 12, 10, 0.96)',
            backdropFilter: 'blur(16px)',
            WebkitBackdropFilter: 'blur(16px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '1.25rem'
          }}
        >
          <button
            onClick={() => setPreview(null)}
            style={{
              position: 'absolute',
              top: 16,
              right: 16,
              width: 44,
              height: 44,
              borderRadius: '50%',
              background: 'rgba(26, 38, 32, 0.85)',
              border: '1px solid var(--border-medium)',
              color: 'var(--text-primary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              zIndex: 10
            }}
            aria-label="Close image preview"
          >
            <X size={22} />
          </button>
          <div style={{ maxWidth: 880, width: '100%' }} onClick={e => e.stopPropagation()}>
            <img
              src={preview.image_url}
              alt={preview.title}
              style={{ width: '100%', maxHeight: '78vh', objectFit: 'contain', borderRadius: 'var(--radius-md)' }}
              onError={e => { e.currentTarget.src = '/banner.jpeg'; }}
            />
            <div style={{ textAlign: 'center', marginTop: '1rem' }}>
              <div style={{ fontFamily: 'Playfair Display, serif', fontSize: '1.25rem', color: 'var(--bone)', fontStyle: 'italic' }}>
                {preview.title}
              </div>
              <div style={{ fontSize: '0.74rem', color: 'var(--amber-light)', textTransform: 'uppercase', letterSpacing: '0.16em', marginTop: '4px' }}>
                {preview.category}
              </div>
            </div>
          </div>
        </div>
      )}

      <style>{`
        .gallery-item:hover .gallery-caption {
          opacity: 1 !important;
        }
        @media (max-width: 900px) {
          .gallery-header { grid-template-columns: 1fr !important; gap: 1rem !important; }
          .gallery-grid { grid-template-columns: repeat(3, 1fr) !important; grid-auto-rows: 190px !important; }
        }
        @media (max-width: 600px) {
          .gallery-grid {
            grid-template-columns: repeat(2, 1fr) !important;
            grid-auto-rows: 160px !important;
            gap: 0.75rem !important;
          }
          .gallery-item {
            grid-column: span 1 !important;
            grid-row: span 1 !important;
          }
          /* Show caption on mobile tap/always on subtle bottom gradient */
          .gallery-caption {
            opacity: 1 !important;
            padding: 0.65rem !important;
            background: linear-gradient(180deg, transparent 50%, rgba(8, 12, 10, 0.88) 100%) !important;
          }
          .gallery-caption > div:first-child {
            font-size: 0.85rem !important;
          }
        }
      `}</style>
    </section>
  );
};

export default GallerySection;
