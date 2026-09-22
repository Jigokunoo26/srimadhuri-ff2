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
        padding: '7rem 0 4rem',
        overflow: 'hidden'
      }}
    >
      <div className="container" style={{ position: 'relative', zIndex: 10 }}>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1.1fr 0.9fr',
            gap: '4rem',
            alignItems: 'center'
          }}
          className="hero-grid"
        >
          {/* Left: Editorial copy */}
          <div className="fade-up" style={{ maxWidth: 620 }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '10px', marginBottom: '2rem' }}>
              <span style={{ width: 32, height: 1, background: 'var(--amber)' }} />
              <span style={{ fontSize: '0.72rem', color: 'var(--amber-light)', textTransform: 'uppercase', letterSpacing: '0.22em', fontWeight: 500 }}>
                Khammam, since 2019
              </span>
            </div>

            <h1 style={{ fontSize: 'clamp(2.8rem, 5.4vw, 4.6rem)', marginBottom: '1.5rem', color: 'var(--bone)' }}>
              {heroTitle.split(',')[0]}<em>{heroTitle.split(',').slice(1).join(',')}</em>
            </h1>

            <p style={{ fontSize: '1.08rem', color: 'var(--text-secondary)', maxWidth: 520, marginBottom: '2.5rem', lineHeight: 1.7 }}>
              {heroSubtitle}
            </p>

            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', marginBottom: '3.5rem' }}>
              <button onClick={onOpenBooking} className="btn btn-primary" style={{ gap: '8px' }}>
                <Calendar size={16} /> {heroCta}
              </button>
              <button onClick={handleWhatsApp} className="btn btn-ghost" style={{ gap: '8px' }}>
                <MessageCircle size={16} /> Chat with us
                <ArrowUpRight size={14} style={{ opacity: 0.6 }} />
              </button>
            </div>

            {/* Inline trust strip — minimal, no fake logos */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '2.5rem', paddingTop: '2rem', borderTop: '1px solid var(--border-subtle)' }}>
              <div>
                <div style={{ fontFamily: 'Playfair Display, serif', fontSize: '1.8rem', color: 'var(--bone)', fontWeight: 500 }}>
                  {happyClients}
                </div>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.15em', marginTop: '2px' }}>
                  Brides served
                </div>
              </div>
              <div>
                <div style={{ fontFamily: 'Playfair Display, serif', fontSize: '1.8rem', color: 'var(--bone)', fontWeight: 500 }}>
                  {ratingScore}<span style={{ color: 'var(--amber-light)' }}>★</span>
                </div>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.15em', marginTop: '2px' }}>
                  Client rating
                </div>
              </div>
              <div>
                <div style={{ fontFamily: 'Playfair Display, serif', fontSize: '1.8rem', color: 'var(--bone)', fontWeight: 500 }}>
                  {expYears}<em> yrs</em>
                </div>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.15em', marginTop: '2px' }}>
                  Studio practice
                </div>
              </div>
            </div>
          </div>

          {/* Right: Real photograph */}
          <div style={{ position: 'relative', height: 'min(78vh, 640px)' }} className="hero-image">
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

            {/* Floating info card */}
            <div
              style={{
                position: 'absolute',
                bottom: -20,
                left: -20,
                background: 'var(--bg-secondary)',
                border: '1px solid var(--border-medium)',
                borderRadius: 'var(--radius-md)',
                padding: '1rem 1.4rem',
                maxWidth: 240,
                boxShadow: 'var(--shadow-md)'
              }}
              className="hero-card"
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--success)' }} />
                <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.12em' }}>
                  Booking open
                </span>
              </div>
              <div style={{ fontFamily: 'Playfair Display, serif', fontSize: '1.1rem', color: 'var(--bone)' }}>
                Wedding season<em> slots</em>
              </div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
                Oct-Mar dates filling
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 900px) {
          .hero-grid { grid-template-columns: 1fr !important; gap: 3rem !important; }
          .hero-image { height: 60vh !important; }
          .hero-card { left: 12px !important; }
        }
      `}</style>
    </section>
  );
};

export default Hero;
