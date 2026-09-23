import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { MapPin, Phone, MessageCircle, Clock, Mail, Star, ExternalLink, Navigation, Copy, Check, Maximize2, X } from 'lucide-react';

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
        {/* Header */}
        <div style={{ marginBottom: '3.5rem', maxWidth: 640 }}>
          <div style={{ fontSize: '0.72rem', color: 'var(--amber-light)', textTransform: 'uppercase', letterSpacing: '0.22em', marginBottom: '0.75rem', fontWeight: 600 }}>
            Location & Hours
          </div>
          <h2 style={{ color: 'var(--bone)' }}>
            Come visit<em> the studio.</em>
          </h2>
          <p className="section-subtitle" style={{ margin: '0.75rem 0 0', textAlign: 'left' }}>
            Consultations are by appointment. We are happy to talk through your day over a chai before any commitment.
          </p>
        </div>

        <div
          style={{ display: 'grid', gridTemplateColumns: '0.9fr 1.1fr', gap: '2.5rem', alignItems: 'stretch' }}
          className="contact-grid"
        >
          {/* Details Card */}
          <div className="surface contact-card" style={{ padding: '2.25rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div>
              <div style={{ fontSize: '0.7rem', color: 'var(--amber-light)', textTransform: 'uppercase', letterSpacing: '0.2em', marginBottom: '0.5rem', fontWeight: 600 }}>
                Studio Address
              </div>
              <div style={{ fontSize: '1rem', color: 'var(--bone)', lineHeight: 1.55 }}>
                {storeInfo?.address}
              </div>
            </div>

            <div>
              <div style={{ fontSize: '0.7rem', color: 'var(--amber-light)', textTransform: 'uppercase', letterSpacing: '0.2em', marginBottom: '0.5rem', fontWeight: 600 }}>
                Direct Contact
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                <a href={`tel:${storeInfo?.phone_clean || whatsapp}`} style={{ display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--bone)', fontSize: '0.95rem' }}>
                  <Phone size={16} style={{ color: 'var(--amber)', flexShrink: 0 }} /> {phone}
                </a>
                <a href={`https://wa.me/${whatsapp}`} target="_blank" rel="noreferrer" style={{ display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--bone)', fontSize: '0.95rem' }}>
                  <MessageCircle size={16} style={{ color: 'var(--amber)', flexShrink: 0 }} /> WhatsApp direct (+{whatsapp})
                </a>
                {storeInfo?.email && (
                  <a href={`mailto:${storeInfo.email}`} style={{ display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--bone)', fontSize: '0.95rem', wordBreak: 'break-all' }}>
                    <Mail size={16} style={{ color: 'var(--amber)', flexShrink: 0 }} /> {storeInfo.email}
                  </a>
                )}
              </div>
            </div>

            <div>
              <div style={{ fontSize: '0.7rem', color: 'var(--amber-light)', textTransform: 'uppercase', letterSpacing: '0.2em', marginBottom: '0.5rem', fontWeight: 600 }}>
                Working Hours
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                <div>Mon - Fri · {storeInfo?.hours_weekday || '10:00 AM - 9:00 PM'}</div>
                <div>Saturday · {storeInfo?.hours_saturday || '10:00 AM - 9:00 PM'}</div>
                <div>Sunday · {storeInfo?.hours_sunday || 'By appointment'}</div>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginTop: 'auto', paddingTop: '1rem' }}>
              {storeInfo?.google_review_url && (
                <a href={storeInfo.google_review_url} target="_blank" rel="noreferrer" className="btn btn-ghost" style={{ gap: '8px', width: '100%' }}>
                  <Star size={14} fill="var(--amber)" color="var(--amber)" /> Rate us on Google
                  <ExternalLink size={12} style={{ opacity: 0.6 }} />
                </a>
              )}

              <a href={directionsUrl} target="_blank" rel="noreferrer" className="btn btn-primary" style={{ gap: '8px', width: '100%' }}>
                <Navigation size={14} /> Get Directions on Maps
              </a>
            </div>
          </div>

          {/* MAP CONTAINER */}
          <div
            className="surface map-card"
            style={{ padding: 0, overflow: 'hidden', height: 490, position: 'relative', borderRadius: 'var(--radius-md)' }}
          >
            <iframe
              title="Sri Madhuri Makeovers location"
              src={mapSrc}
              width="100%"
              height="100%"
              style={{ border: 0, width: '100%', height: '100%', display: 'block' }}
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />

            {/* Floating top bar */}
            <div
              style={{
                position: 'absolute',
                top: 12,
                left: 12,
                right: 12,
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                gap: '8px',
                pointerEvents: 'none'
              }}
            >
              <div
                style={{
                  background: 'rgba(12, 20, 16, 0.95)',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid var(--border-medium)',
                  borderRadius: 'var(--radius-sm)',
                  padding: '7px 12px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  pointerEvents: 'auto',
                  maxWidth: '70%'
                }}
              >
                <MapPin size={15} style={{ color: 'var(--amber)', flexShrink: 0 }} />
                <div style={{ minWidth: 0 }}>
                  <div style={{ fontFamily: 'Playfair Display, serif', fontSize: '0.88rem', color: 'var(--bone)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    Sri Madhuri Makeovers
                  </div>
                  <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                    Khammam
                  </div>
                </div>
              </div>

              <a
                href={directionsUrl}
                target="_blank"
                rel="noreferrer"
                className="btn btn-primary btn-sm"
                style={{ gap: '4px', pointerEvents: 'auto', padding: '6px 12px', fontSize: '0.78rem' }}
                onClick={(e) => e.stopPropagation()}
              >
                <Navigation size={12} /> Directions
              </a>
            </div>

            {/* Bottom bar with copy address */}
            <div
              style={{
                position: 'absolute',
                bottom: 12,
                left: 12,
                right: 12,
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                gap: '8px',
                pointerEvents: 'none'
              }}
            >
              <button
                onClick={(e) => { e.stopPropagation(); copyAddress(); }}
                style={{
                  background: 'rgba(12, 20, 16, 0.95)',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid var(--border-medium)',
                  borderRadius: 'var(--radius-sm)',
                  padding: '7px 12px',
                  fontSize: '0.78rem',
                  color: copied ? '#10b981' : 'var(--bone)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  cursor: 'pointer',
                  pointerEvents: 'auto',
                  transition: 'var(--transition)'
                }}
              >
                {copied ? <Check size={13} color="#10b981" /> : <Copy size={13} style={{ color: 'var(--amber)' }} />}
                <span>{copied ? 'Address Copied!' : 'Copy Address'}</span>
              </button>

              <button
                onClick={() => setLightbox(true)}
                style={{
                  background: 'rgba(12, 20, 16, 0.95)',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid var(--border-medium)',
                  borderRadius: 'var(--radius-sm)',
                  padding: '7px 10px',
                  color: 'var(--amber-light)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                  cursor: 'pointer',
                  pointerEvents: 'auto',
                  fontSize: '0.75rem'
                }}
                title="Expand Map"
              >
                <Maximize2 size={13} />
              </button>
            </div>
          </div>
        </div>

        {/* Fullscreen Map Modal */}
        {lightbox && (
          <div
            className="modal-backdrop"
            onClick={() => setLightbox(false)}
            style={{ zIndex: 1200, padding: '1rem' }}
          >
            <div
              style={{
                position: 'relative',
                width: '100%',
                maxWidth: '960px',
                height: '80vh',
                background: 'var(--bg-secondary)',
                borderRadius: 'var(--radius-md)',
                overflow: 'hidden',
                border: '1px solid var(--border-medium)'
              }}
              onClick={e => e.stopPropagation()}
            >
              <button
                onClick={() => setLightbox(false)}
                style={{
                  position: 'absolute',
                  top: 14,
                  right: 14,
                  width: 40,
                  height: 40,
                  borderRadius: '50%',
                  background: 'rgba(12, 20, 16, 0.9)',
                  border: '1px solid var(--border-medium)',
                  color: '#fff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  zIndex: 10
                }}
              >
                <X size={20} />
              </button>
              <iframe
                title="Expanded Map"
                src={mapSrc}
                style={{ width: '100%', height: '100%', border: 0 }}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </div>
        )}

        {/* FAQs */}
        {storeInfo?.faqs && storeInfo.faqs.length > 0 && (
          <div style={{ marginTop: '5rem', maxWidth: 760 }}>
            <div style={{ fontSize: '0.72rem', color: 'var(--amber-light)', textTransform: 'uppercase', letterSpacing: '0.22em', marginBottom: '0.5rem', fontWeight: 600 }}>
              Helpful Information
            </div>
            <h3 style={{ color: 'var(--bone)', fontSize: 'clamp(1.4rem, 3.5vw, 1.8rem)', marginBottom: '2rem' }}>
              Before you <em>ask.</em>
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              {storeInfo.faqs.map((faq, i) => (
                <div key={i} style={{ padding: '1.25rem 0', borderTop: '1px solid var(--border-subtle)' }}>
                  <div style={{ fontFamily: 'Playfair Display, serif', fontSize: '1.05rem', color: 'var(--bone)', marginBottom: '0.4rem', fontWeight: 500 }}>
                    {faq.question}
                  </div>
                  <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
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
          .contact-grid { grid-template-columns: 1fr !important; gap: 2rem !important; }
          .map-card { height: 350px !important; }
        }
      `}</style>
    </section>
  );
};

export default ContactSection;
