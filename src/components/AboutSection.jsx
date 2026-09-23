import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { Award, Users, Sparkles, ArrowUpRight } from 'lucide-react';

const AboutSection = () => {
  const { storeInfo, team, testimonials } = useStore();
  const [activeTestimonial, setActiveTestimonial] = useState(0);

  const aboutImage = storeInfo?.about_image_url || storeInfo?.hero_image_url || '/banner.jpeg';
  const features = storeInfo?.about_features && storeInfo.about_features.length > 0
    ? storeInfo.about_features
    : ['Expert certified beauticians', '100% authentic luxury brands', 'Hospital-grade sanitation', 'Tailored bridal consultations'];

  return (
    <section id="about" className="section" style={{ background: 'var(--bg-secondary)' }}>
      <div className="container">
        <div
          style={{ display: 'grid', gridTemplateColumns: '0.9fr 1.1fr', gap: '4.5rem', alignItems: 'center' }}
          className="about-grid"
        >
          {/* Studio Image with Award Badge */}
          <div className="about-img-wrapper" style={{ position: 'relative', height: 'min(65vh, 540px)', width: '100%' }}>
            <div style={{ borderRadius: 'var(--radius-lg)', overflow: 'hidden', height: '100%', background: 'var(--bg-tertiary)' }}>
              <img
                src={aboutImage}
                alt="Sri Madhuri studio"
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                onError={e => { e.currentTarget.src = '/banner.jpeg'; }}
              />
            </div>
            {/* Experience Award Badge */}
            <div
              className="about-award-badge"
              style={{
                position: 'absolute',
                top: -16,
                right: -16,
                background: 'rgba(12, 20, 16, 0.95)',
                backdropFilter: 'blur(12px)',
                border: '1px solid var(--border-medium)',
                borderRadius: 'var(--radius-md)',
                padding: '1.1rem 1.35rem',
                maxWidth: 210,
                boxShadow: 'var(--shadow-md)'
              }}
            >
              <Award size={24} style={{ color: 'var(--amber)', marginBottom: '6px' }} />
              <div style={{ fontFamily: 'Playfair Display, serif', fontSize: '1.45rem', color: 'var(--bone)', fontWeight: 600 }}>
                {storeInfo?.experience_years || '6+'}
              </div>
              <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.14em', marginTop: '3px' }}>
                {storeInfo?.about_award_label || 'Years in practice'}
              </div>
            </div>
          </div>

          {/* Editorial Story */}
          <div>
            <div style={{ fontSize: '0.72rem', color: 'var(--amber-light)', textTransform: 'uppercase', letterSpacing: '0.22em', marginBottom: '0.75rem', fontWeight: 600 }}>
              The Philosophy
            </div>
            <h2 style={{ color: 'var(--bone)', marginBottom: '1.25rem' }}>
              {storeInfo?.about_title || 'A small studio, by design.'}
            </h2>
            <p style={{ fontSize: 'clamp(0.95rem, 2vw, 1.05rem)', color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: '1.25rem' }}>
              {storeInfo?.about_text}
            </p>
            <p style={{ fontSize: '0.92rem', color: 'var(--text-muted)', lineHeight: 1.65, marginBottom: '2rem' }}>
              {storeInfo?.about_subtext}
            </p>

            <div className="about-features" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem 1.5rem' }}>
              {features.map((f, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                  <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--amber)', marginTop: '8px', flexShrink: 0 }} />
                  <span style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>{f}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Team Members */}
        {team && team.length > 0 && (
          <div style={{ marginTop: '5rem' }}>
            <div style={{ marginBottom: '2rem', maxWidth: 540 }}>
              <div style={{ fontSize: '0.72rem', color: 'var(--amber-light)', textTransform: 'uppercase', letterSpacing: '0.22em', marginBottom: '0.5rem', fontWeight: 600 }}>
                Artisans
              </div>
              <h3 style={{ color: 'var(--bone)', fontSize: 'clamp(1.4rem, 3.5vw, 1.8rem)' }}>
                The <em>people</em> you'll meet.
              </h3>
            </div>
            <div
              style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem' }}
              className="team-grid"
            >
              {team.map((m) => (
                <article key={m.id} className="surface" style={{ padding: '1rem', borderRadius: 'var(--radius-md)' }}>
                  <div style={{ aspectRatio: '3/4', borderRadius: 'var(--radius-sm)', overflow: 'hidden', background: 'var(--bg-tertiary)', marginBottom: '0.85rem' }}>
                    <img
                      src={m.image_url || '/WhatsApp Image 2026-07-18 at 9.24.10 PM.jpeg'}
                      alt={m.name}
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      onError={e => { e.currentTarget.src = '/banner.jpeg'; }}
                    />
                  </div>
                  <div style={{ fontFamily: 'Playfair Display, serif', fontSize: '1.1rem', color: 'var(--bone)' }}>{m.name}</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--amber-light)', textTransform: 'uppercase', letterSpacing: '0.12em', marginTop: '3px' }}>{m.role}</div>
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '4px' }}>{m.experience}</div>
                </article>
              ))}
            </div>
          </div>
        )}

        {/* Testimonials */}
        {testimonials && testimonials.length > 0 && (
          <div style={{ marginTop: '5rem', textAlign: 'center', maxWidth: 760, margin: '5rem auto 0' }}>
            <div style={{ fontSize: '0.72rem', color: 'var(--amber-light)', textTransform: 'uppercase', letterSpacing: '0.22em', marginBottom: '1.5rem', fontWeight: 600 }}>
              Client Reflections
            </div>
            <blockquote
              key={activeTestimonial}
              className="fade-up"
              style={{
                fontFamily: 'Playfair Display, serif',
                fontSize: 'clamp(1.2rem, 3.2vw, 1.8rem)',
                color: 'var(--bone)',
                fontStyle: 'italic',
                lineHeight: 1.45,
                marginBottom: '1.5rem',
                fontWeight: 400
              }}
            >
              "{testimonials[activeTestimonial]?.text}"
            </blockquote>
            <div style={{ fontSize: '0.9rem', color: 'var(--text-primary)' }}>
              {testimonials[activeTestimonial]?.name}
              <span style={{ color: 'var(--text-muted)' }}> · {testimonials[activeTestimonial]?.role}</span>
            </div>
            {testimonials.length > 1 && (
              <div style={{ display: 'flex', gap: '8px', justifyContent: 'center', marginTop: '1.75rem' }}>
                {testimonials.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveTestimonial(i)}
                    style={{
                      width: i === activeTestimonial ? 24 : 8,
                      height: 8,
                      borderRadius: 'var(--radius-full)',
                      border: 'none',
                      background: i === activeTestimonial ? 'var(--amber)' : 'var(--border-medium)',
                      cursor: 'pointer',
                      transition: 'var(--transition)'
                    }}
                    aria-label={`Show testimonial ${i + 1}`}
                  />
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      <style>{`
        @media (max-width: 900px) {
          .about-grid { grid-template-columns: 1fr !important; gap: 2.5rem !important; }
          .about-img-wrapper { height: 38vh !important; min-height: 280px !important; }
          .about-award-badge {
            top: 12px !important;
            right: 12px !important;
            padding: 0.85rem 1rem !important;
          }
        }
        @media (max-width: 500px) {
          .about-features {
            grid-template-columns: 1fr !important;
            gap: 0.85rem !important;
          }
          .team-grid {
            grid-template-columns: repeat(2, 1fr) !important;
            gap: 0.85rem !important;
          }
        }
      `}</style>
    </section>
  );
};

export default AboutSection;
