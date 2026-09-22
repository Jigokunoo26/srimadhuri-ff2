import React, { useState, useEffect } from 'react';
import { useStore } from '../context/StoreContext';
import { Calendar, Clock } from 'lucide-react';

const Countdown = ({ targetDate }) => {
  const [time, setTime] = useState({ d: 0, h: 0, m: 0, s: 0 });

  useEffect(() => {
    if (!targetDate) return;
    const tick = () => {
      const diff = new Date(targetDate).getTime() - Date.now();
      if (diff > 0) {
        setTime({
          d: Math.floor(diff / 86400000),
          h: Math.floor((diff / 3600000) % 24),
          m: Math.floor((diff / 60000) % 60),
          s: Math.floor((diff / 1000) % 60)
        });
      } else {
        setTime({ d: 0, h: 0, m: 0, s: 0 });
      }
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [targetDate]);

  if (time.d + time.h + time.m + time.s === 0) return null;

  return (
    <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'baseline' }}>
      {[
        { v: time.d, l: 'days' },
        { v: time.h, l: 'hrs' },
        { v: time.m, l: 'min' },
        { v: time.s, l: 'sec' }
      ].map((t, i) => (
        <div key={i} style={{ textAlign: 'left' }}>
          <div style={{ fontFamily: 'Playfair Display, serif', fontSize: '1.6rem', color: 'var(--bone)', fontWeight: 500, lineHeight: 1 }}>
            {String(t.v).padStart(2, '0')}
          </div>
          <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.18em', marginTop: '4px' }}>
            {t.l}
          </div>
        </div>
      ))}
    </div>
  );
};

const OffersSection = ({ onSelectOffer }) => {
  const { offers } = useStore();
  const active = offers.filter(o => o.is_active);
  if (active.length === 0) return null;

  return (
    <section id="offers" className="section" style={{ background: 'var(--bg-secondary)' }}>
      <div className="container">
        <div style={{ textAlign: 'center', marginBottom: '5rem', maxWidth: 640, margin: '0 auto 5rem' }}>
          <h2 style={{ color: 'var(--bone)' }}>
            Seasonal<em> offerings.</em>
          </h2>
          <p className="section-subtitle">
            Limited packages curated for wedding season, festive weeks, and slow Sunday afternoons.
          </p>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {active.map((offer, i) => (
            <article
              key={offer.id}
              className="surface"
              style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1.2fr auto',
                gap: '3rem',
                alignItems: 'center',
                padding: '2rem 2.5rem'
              }}
              onClick={() => onSelectOffer(offer)}
            >
              <div>
                {offer.badge && (
                  <div style={{ fontSize: '0.7rem', color: 'var(--amber-light)', textTransform: 'uppercase', letterSpacing: '0.22em', fontWeight: 500, marginBottom: '0.75rem' }}>
                    {offer.badge}
                  </div>
                )}
                <h3 style={{ fontSize: '1.6rem', color: 'var(--bone)', marginBottom: '0.5rem' }}>
                  {offer.title}
                </h3>
                <p style={{ fontSize: '0.92rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                  {offer.description}
                </p>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
                <Countdown targetDate={offer.end_date} />
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '0.5rem' }}>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: '10px' }}>
                  <span style={{ fontFamily: 'Playfair Display, serif', fontSize: '1.8rem', color: 'var(--bone)', fontWeight: 500 }}>
                    {offer.offer_price}
                  </span>
                  {offer.original_price && (
                    <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)', textDecoration: 'line-through' }}>
                      {offer.original_price}
                    </span>
                  )}
                </div>
                {offer.discount && (
                  <span className="badge badge-amber" style={{ fontSize: '0.7rem' }}>
                    {offer.discount}
                  </span>
                )}
                <button onClick={(e) => { e.stopPropagation(); onSelectOffer(offer); }} className="btn btn-link btn-sm" style={{ marginTop: '0.5rem' }}>
                  Claim this
                </button>
              </div>
            </article>
          ))}
        </div>
      </div>

      <style>{`
        @media (max-width: 800px) {
          .surface[style*="grid-template-columns"] { grid-template-columns: 1fr !important; gap: 1.5rem !important; }
        }
      `}</style>
    </section>
  );
};

export default OffersSection;
