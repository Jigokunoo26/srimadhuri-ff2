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
          style={{ display: 'grid', gridTemplateColumns: '0.9fr 1.1fr', gap: '5rem', alignItems: 'center' }}
          className="about-grid"
        >
          <div style={{ position: 'relative', height: 'min(70vh, 580px)' }}>
            <div style={{ borderRadius: 'var(--radius-lg)', overflow: 'hidden', height: '100%', background: 'var(--bg-tertiary)' }}>
              <img
                src={aboutImage}
                alt="Sri Madhuri studio"
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                onError={e => { e.currentTarget.src = 'https://picsum.photos/seed/sri-madhuri-studio/800/1000'; }}
              />
            </div>
            <div
              style={{
                position: 'absolute', top: -20, right: -20,
                background: 'var(--bg-primary)', border: '1px solid var(--border-medium)',
                borderRadius: 'var(--radius-md)', padding: '1.25rem 1.5rem',
                maxWidth: 220
              }}
            >
              <Award size={28} style={{ color: 'var(--amber)', marginBottom: '8px' }} />
              <div style={{ fontFamily: 'Playfair Display, serif', fontSize: '1.6rem', color: 'var(--bone)' }}>
                {storeInfo?.experience_years || '6+'}
              </div>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.15em', marginTop: '4px' }}>
                {storeInfo?.about_award_label || 'Years in practice'}
              </div>
            </div>
          </div>

          <div>
            <h2 style={{ color: 'var(--bone)', marginBottom: '1.5rem' }}>
              {storeInfo?.about_title || 'A small studio, by design.'}
            </h2>
            <p style={{ fontSize: '1.05rem', color: 'var(--text-secondary)', lineHeight: 1.75, marginBottom: '1.5rem' }}>
              {storeInfo?.about_text}
            </p>
            <p style={{ fontSize: '0.95rem', color: 'var(--text-muted)', lineHeight: 1.7, marginBottom: '2.5rem' }}>
              {storeInfo?.about_subtext}
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem 2rem' }}>
              {features.map((f, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                  <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--amber)', marginTop: '10px', flexShrink: 0 }} />
                  <span style={{ fontSize: '0.92rem', color: 'var(--text-secondary)', lineHeight: 1.55 }}>{f}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Team — single row, no separate section header */}
        {team && team.length > 0 && (
          <div style={{ marginTop: '7rem' }}>
            <div style={{ marginBottom: '3rem', maxWidth: 540 }}>
              <h3 style={{ color: 'var(--bone)', fontSize: '1.8rem' }}>
                The <em>people</em> you'll meet.
              </h3>
            </div>
            <div
              style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '2rem' }}
              className="team-grid"
            >
              {team.map((m) => (
                <article key={m.id}>
                  <div style={{ aspectRatio: '3/4', borderRadius: 'var(--radius-md)', overflow: 'hidden', background: 'var(--bg-tertiary)', marginBottom: '1rem' }}>
                    <img
                      src={m.image_url || 'https://picsum.photos/seed/sri-madhuri-team/400/500'}
                      alt={m.name}
                      style={{ width: '100%', height: '100%', objectFit: 'cover', filter: 'grayscale(15%)' }}
                    />
                  </div>
                  <div style={{ fontFamily: 'Playfair Display, serif', fontSize: '1.15rem', color: 'var(--bone)' }}>{m.name}</div>
                  <div style={{ fontSize: '0.78rem', color: 'var(--amber-light)', textTransform: 'uppercase', letterSpacing: '0.15em', marginTop: '4px' }}>{m.role}</div>
                  <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginTop: '6px' }}>{m.experience}</div>
                </article>
              ))}
            </div>
          </div>
        )}

        {/* Testimonials — single rotating quote, no grid */}
        {testimonials && testimonials.length > 0 && (
          <div style={{ marginTop: '7rem', textAlign: 'center', maxWidth: 760, margin: '7rem auto 0' }}>
            <div style={{ fontSize: '0.72rem', color: 'var(--amber-light)', textTransform: 'uppercase', letterSpacing: '0.22em', marginBottom: '2rem' }}>
              What clients say
            </div>
            <blockquote
              key={activeTestimonial}
              className="fade-up"
              style={{
                fontFamily: 'Playfair Display, serif',
                fontSize: 'clamp(1.4rem, 2.4vw, 1.9rem)',
                color: 'var(--bone)',
                fontStyle: 'italic',
                lineHeight: 1.4,
                marginBottom: '2rem',
                fontWeight: 400
              }}
            >
              "{testimonials[activeTestimonial]?.text}"
            </blockquote>
            <div style={{ fontSize: '0.95rem', color: 'var(--text-primary)' }}>
              {testimonials[activeTestimonial]?.name}
              <span style={{ color: 'var(--text-muted)' }}> · {testimonials[activeTestimonial]?.role}</span>
            </div>
            {testimonials.length > 1 && (
              <div style={{ display: 'flex', gap: '8px', justifyContent: 'center', marginTop: '2rem' }}>
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
          .about-grid { grid-template-columns: 1fr !important; gap: 3rem !important; }
        }
      `}</style>
    </section>
  );
};

export default AboutSection;
