import React from 'react';
import { useStore } from '../context/StoreContext';
import { Calendar, MessageCircle, ArrowUpRight } from 'lucide-react';

const Hero = ({ onOpenBooking }) => {
  const { storeInfo } = useStore();
  const phone = storeInfo?.whatsapp_number || '918985291053';
  const heroTitle = storeInfo?.hero_title || 'Bridal artistry, quietly considered.';
  const heroSubtitle = storeInfo?.hero_subtitle || 'A luxury salon in Khammam for brides who want restraint, not performance. Hair, skin, and makeup that read beautifully in every photograph and even better in person.';
  const heroCta = storeInfo?.hero_cta || 'Reserve';
  const happyClients = storeInfo?.happy_clients || '2,500+';
  const ratingScore = storeInfo?.rating_score || '4.9';
  const expYears = storeInfo?.experience_years || '6';

  const handleWhatsApp = () => {
    window.open(`https://wa.me/${phone}?text=${encodeURIComponent('Hi Sri Madhuri, I would like to enquire about an appointment.')}`, '_blank');
  };

  return (
    <section
      id="home"
      style={{
        position: 'relative',
        minHeight: '100dvh',
        display: 'flex',
        alignItems: 'center',
        padding: '6.5rem 0 3.5rem',
        overflow: 'hidden'
      }}
    >
      <div className="container" style={{ position: 'relative', zIndex: 10 }}>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1.1fr 0.9fr',
            gap: '3.5rem',
            alignItems: 'center'
          }}
          className="hero-grid"
        >
          {/* Left: Editorial copy */}
          <div className="fade-up" style={{ maxWidth: 620 }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '10px', marginBottom: '1.25rem' }}>
              <span style={{ width: 28, height: 1, background: 'var(--amber)' }} />
              <span style={{ fontSize: '0.72rem', color: 'var(--amber-light)', textTransform: 'uppercase', letterSpacing: '0.22em', fontWeight: 600 }}>
                Khammam, since 2019
              </span>
            </div>

            <h1
              style={{
                fontSize: 'clamp(2.35rem, 5.2vw, 4.4rem)',
                marginBottom: '1.25rem',
                color: 'var(--bone)',
                lineHeight: 1.12
              }}
            >
              {heroTitle.split(',')[0]}<em>{heroTitle.split(',').slice(1).join(',')}</em>
            </h1>

            <p
              style={{
                fontSize: 'clamp(0.95rem, 2.5vw, 1.08rem)',
                color: 'var(--text-secondary)',
                maxWidth: 520,
                marginBottom: '2rem',
                lineHeight: 1.65
              }}
            >
              {heroSubtitle}
            </p>

            {/* Action buttons */}
            <div
              className="hero-actions"
              style={{
                display: 'flex',
                gap: '12px',
                flexWrap: 'wrap',
                marginBottom: '2.5rem'
              }}
            >
              <button
                onClick={onOpenBooking}
                className="btn btn-primary hero-btn"
                style={{ gap: '8px' }}
              >
                <Calendar size={16} /> {heroCta}
              </button>
              <button
                onClick={handleWhatsApp}
                className="btn btn-ghost hero-btn"
                style={{ gap: '8px' }}
              >
                <MessageCircle size={16} /> Chat with us
                <ArrowUpRight size={14} style={{ opacity: 0.6 }} />
              </button>
            </div>

            {/* Inline trust strip */}
            <div
              className="hero-trust-strip"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '2rem',
                paddingTop: '1.75rem',
                borderTop: '1px solid var(--border-subtle)'
              }}
            >
              <div>
                <div style={{ fontFamily: 'Playfair Display, serif', fontSize: 'clamp(1.5rem, 4vw, 1.8rem)', color: 'var(--bone)', fontWeight: 500, lineHeight: 1 }}>
                  {happyClients}
                </div>
                <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.14em', marginTop: '4px' }}>
                  Brides served
                </div>
              </div>
              <div>
                <div style={{ fontFamily: 'Playfair Display, serif', fontSize: 'clamp(1.5rem, 4vw, 1.8rem)', color: 'var(--bone)', fontWeight: 500, lineHeight: 1 }}>
                  {ratingScore}<span style={{ color: 'var(--amber-light)' }}>★</span>
                </div>
                <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.14em', marginTop: '4px' }}>
                  Client rating
                </div>
              </div>
              <div>
                <div style={{ fontFamily: 'Playfair Display, serif', fontSize: 'clamp(1.5rem, 4vw, 1.8rem)', color: 'var(--bone)', fontWeight: 500, lineHeight: 1 }}>
                  {expYears}<em> yrs</em>
                </div>
                <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.14em', marginTop: '4px' }}>
                  Studio practice
                </div>
              </div>
            </div>
          </div>

          {/* Right: Studio photograph */}
          <div
            style={{
              position: 'relative',
              height: 'min(74vh, 600px)',
              width: '100%'
            }}
            className="hero-image"
          >
            <div
              style={{
                position: 'absolute',
                inset: 0,
                borderRadius: 'var(--radius-lg)',
                overflow: 'hidden',
                background: 'var(--bg-tertiary)'
              }}
            >
              <img
                src="/WhatsApp Image 2026-07-18 at 9.24.10 PM.jpeg"
                alt="Bridal makeup in progress at Sri Madhuri studio"
                style={{ width: '100%', height: '100%', objectFit: 'cover', filter: 'brightness(0.95) saturate(0.95)' }}
                onError={(e) => { e.currentTarget.src = 'https://picsum.photos/seed/sri-madhuri-bride/800/1000'; }}
              />
            </div>

            {/* Floating info badge */}
            <div
              style={{
                position: 'absolute',
                bottom: 16,
                left: 16,
                background: 'rgba(19, 29, 24, 0.95)',
                backdropFilter: 'blur(12px)',
                border: '1px solid var(--border-medium)',
                borderRadius: 'var(--radius-md)',
                padding: '0.85rem 1.15rem',
                maxWidth: 220,
                boxShadow: 'var(--shadow-md)'
              }}
              className="hero-card"
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '3px' }}>
                <span style={{ width: 7, height: 7, borderRadius: '50%', background: 'var(--success)' }} />
                <span style={{ fontSize: '0.68rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.12em', fontWeight: 600 }}>
                  Booking open
                </span>
              </div>
              <div style={{ fontFamily: 'Playfair Display, serif', fontSize: '1.05rem', color: 'var(--bone)' }}>
                Wedding season<em> slots</em>
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
                Oct-Mar dates filling
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 900px) {
          .hero-grid {
            grid-template-columns: 1fr !important;
            gap: 2.5rem !important;
          }
          .hero-image {
            height: 44vh !important;
            min-height: 280px !important;
          }
          .hero-trust-strip {
            gap: 1.25rem !important;
            justify-content: space-between !important;
          }
        }
        @media (max-width: 480px) {
          .hero-actions {
            flex-direction: column !important;
            width: 100% !important;
          }
          .hero-btn {
            width: 100% !important;
            justify-content: center !important;
          }
          .hero-image {
            height: 38vh !important;
          }
          .hero-card {
            bottom: 10px !important;
            left: 10px !important;
            padding: 0.65rem 0.9rem !important;
          }
        }
      `}</style>
    </section>
  );
};

export default Hero;
