import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { MapPin, Phone, MessageCircle, Clock, Mail, Star, ExternalLink, Navigation, Copy, Check, Maximize2 } from 'lucide-react';

const ContactSection = () => {
  const { storeInfo } = useStore();
  const phone = storeInfo?.phone || '+91 89852 91053';
  const whatsapp = storeInfo?.whatsapp_number || '918985291053';
  const [copied, setCopied] = useState(false);
  const [lightbox, setLightbox] = useState(false);

  const lat = storeInfo?.map_lat || 17.226191;
  const lng = storeInfo?.map_lng || 80.1508772;
  const zoom = storeInfo?.map_zoom || 17;
  const directionsUrl = (lat && lng)
    ? `https://www.google.com/maps/place/Sri+Madhuri's+Makeovers+%26+Beauty+Saloon/@${lat},${lng},17z`
    : 'https://maps.app.goo.gl/dJHpaipbUKYNW7SA7';

  // Compute reliable Google Maps embed URL
  const getMapEmbedSrc = () => {
    if (storeInfo?.map_embed_url && storeInfo.map_embed_url.trim()) {
      return storeInfo.map_embed_url.trim();
    }
    if (storeInfo?.map_iframe_html) {
      const match = storeInfo.map_iframe_html.match(/src=["']([^"']+)["']/);
      if (match && match[1]) {
        return match[1];
      }
    }
    return `https://maps.google.com/maps?q=${lat},${lng}+(Sri+Madhuri's+Makeovers+%26+Beauty+Saloon)&t=&z=${zoom}&ie=UTF8&iwloc=B&output=embed`;
  };

  const mapSrc = getMapEmbedSrc();

  const externalMapUrl = directionsUrl;

  const copyAddress = () => {
    if (storeInfo?.address) {
      navigator.clipboard?.writeText(storeInfo.address);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <section id="contact" className="section" style={{ background: 'var(--bg-primary)' }}>
      <div className="container">
        <div style={{ marginBottom: '4rem', maxWidth: 640 }}>
          <h2 style={{ color: 'var(--bone)' }}>
            Come visit<em> the studio.</em>
          </h2>
          <p className="section-subtitle" style={{ margin: '1.25rem 0 0', textAlign: 'left' }}>
            Consultations are by appointment. We are happy to talk through your day over a chai before any commitment.
          </p>
        </div>

        <div
          style={{ display: 'grid', gridTemplateColumns: '0.9fr 1.1fr', gap: '3rem', alignItems: 'stretch' }}
          className="contact-grid"
        >
          <div className="surface" style={{ padding: '2.5rem', display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
            <div>
              <div style={{ fontSize: '0.7rem', color: 'var(--amber-light)', textTransform: 'uppercase', letterSpacing: '0.2em', marginBottom: '0.75rem' }}>
                Studio
              </div>
              <div style={{ fontSize: '1.05rem', color: 'var(--bone)', lineHeight: 1.5 }}>
                {storeInfo?.address}
              </div>
            </div>

            <div>
              <div style={{ fontSize: '0.7rem', color: 'var(--amber-light)', textTransform: 'uppercase', letterSpacing: '0.2em', marginBottom: '0.75rem' }}>
                Reach us
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                <a href={`tel:${storeInfo?.phone_clean || whatsapp}`} style={{ display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--bone)' }}>
                  <Phone size={16} style={{ color: 'var(--amber)' }} /> {phone}
                </a>
                <a href={`https://wa.me/${whatsapp}`} target="_blank" rel="noreferrer" style={{ display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--bone)' }}>
                  <MessageCircle size={16} style={{ color: 'var(--amber)' }} /> WhatsApp direct
                </a>
                {storeInfo?.email && (
                  <a href={`mailto:${storeInfo.email}`} style={{ display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--bone)' }}>
                    <Mail size={16} style={{ color: 'var(--amber)' }} /> {storeInfo.email}
                  </a>
                )}
              </div>
            </div>

            <div>
              <div style={{ fontSize: '0.7rem', color: 'var(--amber-light)', textTransform: 'uppercase', letterSpacing: '0.2em', marginBottom: '0.75rem' }}>
                Hours
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', color: 'var(--text-secondary)' }}>
                <div>Mon - Fri · {storeInfo?.hours_weekday || '10:00 AM - 9:00 PM'}</div>
                <div>Saturday · {storeInfo?.hours_saturday || '10:00 AM - 9:00 PM'}</div>
                <div>Sunday · {storeInfo?.hours_sunday || 'By appointment'}</div>
              </div>
            </div>

            {storeInfo?.google_review_url && (
              <a href={storeInfo.google_review_url} target="_blank" rel="noreferrer" className="btn btn-ghost" style={{ marginTop: 'auto', gap: '8px' }}>
                <Star size={14} fill="var(--amber)" color="var(--amber)" /> Rate us on Google
                <ExternalLink size={12} style={{ opacity: 0.6 }} />
              </a>
            )}

            <a href={directionsUrl} target="_blank" rel="noreferrer" className="btn btn-primary" style={{ gap: '8px' }}>
              <Navigation size={14} /> Get directions
            </a>
          </div>

          {/* MAP WIDGET */}
          <div
            className="surface"
            style={{ padding: 0, overflow: 'hidden', height: 520, position: 'relative' }}
          >
            <iframe
              title="Sri Madhuri Makeovers location"
              src={mapSrc}
              width="100%"
              height="100%"
              style={{ border: 0, width: '100%', height: '100%', display: 'block', minHeight: '520px' }}
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />

            {/* Floating action bar over the map */}
            <div
              style={{
                position: 'absolute',
                top: 16,
                left: 16,
                right: 16,
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                gap: '12px',
                pointerEvents: 'none'
              }}
            >
              <div
                style={{
                  background: 'rgba(12, 20, 16, 0.95)',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid var(--border-medium)',
                  borderRadius: 'var(--radius-md)',
                  padding: '10px 16px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  pointerEvents: 'auto',
                  maxWidth: '60%'
                }}
              >
                <MapPin size={16} style={{ color: 'var(--amber)', flexShrink: 0 }} />
                <div style={{ minWidth: 0 }}>
                  <div style={{ fontFamily: 'Playfair Display, serif', fontSize: '0.95rem', color: 'var(--bone)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    Sri Madhuri Makeovers
                  </div>
                  <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.12em' }}>
                    Khammam
                  </div>
                </div>
              </div>
              <a
                href={directionsUrl}
                target="_blank"
                rel="noreferrer"
                className="btn btn-primary btn-sm"
                style={{ gap: '6px', pointerEvents: 'auto' }}
                onClick={(e) => e.stopPropagation()}
              >
                <Navigation size={13} /> Directions
              </a>
            </div>

            {/* Bottom info chip with copy address */}
            <div
              style={{
                position: 'absolute',
                bottom: 16,
                left: 16,
                right: 16,
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                gap: '10px',
                pointerEvents: 'none'
              }}
            >
              <button
                onClick={(e) => { e.stopPropagation(); copyAddress(); }}
                style={{
                  background: 'rgba(12, 20, 16, 0.95)',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid var(--border-medium)',
                  borderRadius: 'var(--radius-md)',
                  padding: '10px 14px',
                  color: 'var(--bone)',
                  fontSize: '0.82rem',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  maxWidth: '70%',
                  pointerEvents: 'auto'
                }}
              >
                {copied ? <Check size={14} style={{ color: 'var(--amber)' }} /> : <Copy size={14} style={{ color: 'var(--amber)' }} />}
                <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {copied ? 'Address copied' : (storeInfo?.address || 'Copy address')}
                </span>
              </button>
              <button
                onClick={(e) => { e.stopPropagation(); setLightbox(true); }}
                style={{
                  background: 'rgba(12, 20, 16, 0.95)',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid var(--border-medium)',
                  borderRadius: '50%',
                  width: 40,
                  height: 40,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'var(--bone)',
                  cursor: 'pointer',
                  pointerEvents: 'auto'
                }}
                aria-label="View larger map"
                title="Open larger map"
              >
                <Maximize2 size={15} />
              </button>
            </div>
          </div>
        </div>

        {/* Map lightbox */}
        {lightbox && embedSrc && (
          <div
            onClick={() => setLightbox(false)}
            style={{
              position: 'fixed', inset: 0, zIndex: 1100,
              background: 'rgba(8, 12, 10, 0.95)',
              backdropFilter: 'blur(12px)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              padding: '2rem'
            }}
          >
            <div style={{ width: '100%', maxWidth: 1100, height: 'min(80vh, 720px)', position: 'relative' }} onClick={e => e.stopPropagation()}>
              <button
                onClick={() => setLightbox(false)}
                style={{
                  position: 'absolute', top: -50, right: 0,
                  background: 'transparent', border: '1px solid var(--border-medium)',
                  color: 'var(--bone)', width: 40, height: 40, borderRadius: '50%',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  cursor: 'pointer'
                }}
                aria-label="Close"
              >
                ×
              </button>
              <iframe
                title="Sri Madhuri Makeovers location enlarged"
                src={mapSrc}
                style={{ width: '100%', height: '100%', border: 0, borderRadius: 'var(--radius-md)' }}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </div>
        )}

        {/* FAQs */}
        {storeInfo?.faqs && storeInfo.faqs.length > 0 && (
          <div style={{ marginTop: '6rem', maxWidth: 760 }}>
            <h3 style={{ color: 'var(--bone)', fontSize: '1.8rem', marginBottom: '2.5rem' }}>
              Before you <em>ask.</em>
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              {storeInfo.faqs.map((faq, i) => (
                <div key={i} style={{ padding: '1.5rem 0', borderTop: '1px solid var(--border-subtle)' }}>
                  <div style={{ fontFamily: 'Playfair Display, serif', fontSize: '1.1rem', color: 'var(--bone)', marginBottom: '0.5rem' }}>
                    {faq.question}
                  </div>
                  <div style={{ fontSize: '0.95rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                    {faq.answer}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <style>{`
        @media (max-width: 900px) {
          .contact-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </section>
  );
};

export default ContactSection;
