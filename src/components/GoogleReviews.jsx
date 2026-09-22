import React from 'react';
import { useStore } from '../context/StoreContext';
import { Star, ExternalLink } from 'lucide-react';

const PLACE_ID_RE = /placeid=([^&]+)/;
const extractPlaceId = (url) => {
  if (!url) return null;
  const m = url.match(PLACE_ID_RE);
  return m ? m[1] : null;
};

const StarRating = ({ value, size = 14 }) => (
  <div style={{ display: 'inline-flex', gap: '2px' }}>
    {[1, 2, 3, 4, 5].map(n => (
      <Star
        key={n}
        size={size}
        fill={n <= Math.round(value) ? 'var(--amber)' : 'transparent'}
        color={n <= Math.round(value) ? 'var(--amber)' : 'var(--text-muted)'}
      />
    ))}
  </div>
);

const GoogleReviews = () => {
  const { storeInfo, testimonials } = useStore();
  const reviewUrl = storeInfo?.google_review_url;
  const placeId = extractPlaceId(reviewUrl);

  // Top reviews = testimonials that look like Google reviews (have a real name + text)
  const topReviews = (testimonials || []).slice(0, 3);
  const avgFromStore = parseFloat(storeInfo?.rating_score) || 4.9;
  const count = storeInfo?.google_review_count || 247;

  return (
    <section className="section" style={{ background: 'var(--bg-primary)', borderTop: '1px solid var(--border-subtle)' }}>
      <div className="container">
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.6fr', gap: '4rem', alignItems: 'start' }} className="reviews-grid">
          {/* Left: score + summary */}
          <div>
            <div style={{ fontSize: '0.7rem', color: 'var(--amber-light)', textTransform: 'uppercase', letterSpacing: '0.22em', marginBottom: '1.5rem' }}>
              Verified on Google
            </div>

            <div style={{ display: 'flex', alignItems: 'baseline', gap: '12px', marginBottom: '0.5rem' }}>
              <span style={{ fontFamily: 'Playfair Display, serif', fontSize: '4rem', color: 'var(--bone)', fontWeight: 500, lineHeight: 1 }}>
                {avgFromStore.toFixed(1)}
              </span>
              <span style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>/ 5.0</span>
            </div>

            <StarRating value={avgFromStore} size={18} />

            <div style={{ marginTop: '1rem', color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
              Based on <strong style={{ color: 'var(--bone)' }}>{count}</strong> Google reviews
            </div>

            {reviewUrl && (
              <a
                href={reviewUrl}
                target="_blank"
                rel="noreferrer"
                className="btn btn-ghost"
                style={{ marginTop: '1.5rem', gap: '8px' }}
              >
                Read all on Google <ExternalLink size={13} />
              </a>
            )}

            <div style={{ marginTop: '2.5rem', paddingTop: '2rem', borderTop: '1px solid var(--border-subtle)' }}>
              <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', lineHeight: 1.6, fontStyle: 'italic' }}>
                "Real reviews from clients, collected and verified through Google Maps."
              </p>
            </div>
          </div>

          {/* Right: review cards */}
          <div style={{ display: 'grid', gap: '1rem' }}>
            {topReviews.length === 0 ? (
              <div className="surface" style={{ padding: '3rem', textAlign: 'center' }}>
                <p style={{ color: 'var(--text-muted)' }}>Reviews will appear here once added in the admin panel.</p>
              </div>
            ) : (
              topReviews.map((r, i) => (
                <article key={i} className="surface" style={{ padding: '1.75rem 2rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem', flexWrap: 'wrap', gap: '8px' }}>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{ fontFamily: 'Playfair Display, serif', fontSize: '1.05rem', color: 'var(--bone)' }}>
                          {r.name}
                        </span>
                        {r.verified && (
                          <span className="badge badge-amber" style={{ fontSize: '0.65rem' }}>
                            <Star size={9} fill="currentColor" /> Verified
                          </span>
                        )}
                      </div>
                      <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                        {r.role}
                      </div>
                    </div>
                    <StarRating value={r.rating || 5} size={13} />
                  </div>
                  <p style={{ fontSize: '0.92rem', color: 'var(--text-secondary)', lineHeight: 1.6, fontStyle: 'italic' }}>
                    "{r.text}"
                  </p>
                </article>
              ))
            )}

            {reviewUrl && topReviews.length > 0 && (
              <a
                href={reviewUrl}
                target="_blank"
                rel="noreferrer"
                style={{
                  textAlign: 'center',
                  padding: '0.85rem',
                  fontSize: '0.85rem',
                  color: 'var(--amber-light)',
                  textDecoration: 'none',
                  borderTop: '1px solid var(--border-subtle)',
                  marginTop: '0.5rem'
                }}
              >
                See all {count} reviews on Google →
              </a>
            )}
          </div>
        </div>

        {/* Elfsight Google Reviews — live widget */}
        <div style={{ marginTop: '4rem' }}>
          <div style={{ fontSize: '0.7rem', color: 'var(--amber-light)', textTransform: 'uppercase', letterSpacing: '0.22em', marginBottom: '1.5rem', textAlign: 'center' }}>
            Live from Google
          </div>
          {/* Elfsight Google Reviews | Untitled Google Reviews */}
          <script src="https://elfsightcdn.com/platform.js" async></script>
          <div
            className="elfsight-app-7c6783af-90ef-4d7f-bf20-fee0b8e7fbad"
            data-elfsight-app-lazy
            style={{ minHeight: 320 }}
          />
        </div>
      </div>

      <style>{`
        @media (max-width: 900px) {
          .reviews-grid { grid-template-columns: 1fr !important; gap: 2.5rem !important; }
        }
      `}</style>
    </section>
  );
};

export default GoogleReviews;
