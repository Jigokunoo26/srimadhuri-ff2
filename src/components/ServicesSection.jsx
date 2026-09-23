import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { Clock, MessageCircle, ArrowUpRight } from 'lucide-react';

const ServicesSection = ({ onSelectService }) => {
  const { services, storeInfo } = useStore();
  const [activeCategory, setActiveCategory] = useState('All');

  const categories = ['All', ...new Set(services.filter(s => s.is_active).map(s => s.category || 'General'))];
  const filtered = activeCategory === 'All'
    ? services.filter(s => s.is_active)
    : services.filter(s => s.is_active && s.category === activeCategory);

  const phone = storeInfo?.whatsapp_number || '918985291053';
  const handleWhatsApp = (s) => {
    window.open(`https://wa.me/${phone}?text=${encodeURIComponent(`Hi, I would like to enquire about ${s.name} (${s.price}).`)}`, '_blank');
  };

  return (
    <section id="services" className="section" style={{ background: 'var(--bg-primary)' }}>
      <div className="container">
        {/* Section Header */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '2rem',
            marginBottom: '3rem',
            alignItems: 'end'
          }}
          className="services-header"
        >
          <div>
            <div style={{ fontSize: '0.72rem', color: 'var(--amber-light)', textTransform: 'uppercase', letterSpacing: '0.22em', marginBottom: '0.75rem', fontWeight: 600 }}>
              Curated Catalog
            </div>
            <h2 style={{ color: 'var(--bone)' }}>
              Treatments<em> for every kind of day.</em>
            </h2>
          </div>
          <p style={{ color: 'var(--text-secondary)', fontSize: 'clamp(0.92rem, 2vw, 1.05rem)', lineHeight: 1.65 }}>
            From full-day bridal rituals to a 90-minute refresh before a family dinner. Every service is a private session, never a chair in a busy room.
          </p>
        </div>

        {/* Category filter — Touch-friendly swipeable pills on mobile */}
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
              onClick={() => setActiveCategory(cat)}
              style={{
                padding: '9px 18px',
                borderRadius: 'var(--radius-full)',
                fontSize: '0.86rem',
                fontWeight: 500,
                cursor: 'pointer',
                border: '1px solid',
                transition: 'var(--transition)',
                whiteSpace: 'nowrap',
                background: activeCategory === cat ? 'var(--bg-tertiary)' : 'rgba(26, 38, 32, 0.4)',
                borderColor: activeCategory === cat ? 'var(--amber)' : 'var(--border-subtle)',
                color: activeCategory === cat ? 'var(--amber-light)' : 'var(--text-secondary)',
                touchAction: 'manipulation'
              }}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Bento grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(6, 1fr)',
            gap: '1.25rem'
          }}
          className="services-bento"
        >
          {filtered.map((service, i) => {
            const isLarge = i === 0;
            const gridColumn = isLarge ? 'span 3' : i === 1 ? 'span 3' : 'span 2';
            return (
              <article
                key={service.id}
                className="surface"
                style={{
                  gridColumn,
                  display: 'flex',
                  flexDirection: 'column',
                  padding: 0,
                  overflow: 'hidden',
                  cursor: 'pointer',
                  borderRadius: 'var(--radius-md)'
                }}
                onClick={() => onSelectService(service)}
              >
                {service.image_url && (
                  <div className="service-img-wrapper" style={{ height: isLarge ? 260 : 190, overflow: 'hidden', position: 'relative' }}>
                    <img
                      src={service.image_url}
                      alt={service.name}
                      style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.6s ease' }}
                      onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.04)'}
                      onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
                      onError={e => { e.currentTarget.src = '/banner.jpeg'; }}
                    />
                    {service.badge && (
                      <span className="badge badge-amber" style={{ position: 'absolute', top: 12, left: 12, fontSize: '0.72rem' }}>
                        {service.badge}
                      </span>
                    )}
                  </div>
                )}
                <div style={{ padding: '1.35rem 1.25rem', display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
                    <span style={{ fontSize: '0.68rem', color: 'var(--amber-light)', textTransform: 'uppercase', letterSpacing: '0.18em', fontWeight: 600 }}>
                      {service.category}
                    </span>
                    {service.duration && (
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <Clock size={11} /> {service.duration}
                      </span>
                    )}
                  </div>

                  <h3 style={{ fontSize: isLarge ? '1.45rem' : '1.18rem', marginBottom: '0.45rem', color: 'var(--bone)', lineHeight: 1.25 }}>
                    {service.name}
                  </h3>

                  <p style={{ fontSize: '0.86rem', color: 'var(--text-secondary)', lineHeight: 1.55, marginBottom: '1.25rem', flexGrow: 1 }}>
                    {service.description}
                  </p>

                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '0.85rem', borderTop: '1px solid var(--border-subtle)', gap: '8px' }}>
                    <div style={{ fontFamily: 'Playfair Display, serif', fontSize: '1.35rem', color: 'var(--bone)', fontWeight: 500 }}>
                      {service.price}
                    </div>
                    <div style={{ display: 'flex', gap: '6px' }} onClick={e => e.stopPropagation()}>
                      <button
                        onClick={() => handleWhatsApp(service)}
                        className="btn btn-ghost btn-sm"
                        title="Chat on WhatsApp"
                        style={{ width: 38, height: 38, padding: 0, borderRadius: '50%' }}
                      >
                        <MessageCircle size={15} />
                      </button>
                      <button
                        onClick={() => onSelectService(service)}
                        className="btn btn-primary btn-sm"
                        style={{ gap: '4px', padding: '0.5rem 1rem' }}
                      >
                        Reserve <ArrowUpRight size={13} />
                      </button>
                    </div>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </div>

      <style>{`
        @media (max-width: 1100px) {
          .services-bento { grid-template-columns: repeat(4, 1fr) !important; }
          .services-bento > article { grid-column: span 2 !important; }
        }
        @media (max-width: 768px) {
          .services-bento { grid-template-columns: 1fr !important; gap: 1rem !important; }
          .services-bento > article { grid-column: span 1 !important; }
          .services-header { grid-template-columns: 1fr !important; gap: 1rem !important; margin-bottom: 2rem !important; }
          .service-img-wrapper { height: 210px !important; }
        }
      `}</style>
    </section>
  );
};

export default ServicesSection;
