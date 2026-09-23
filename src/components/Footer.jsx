import React from 'react';
import { useStore } from '../context/StoreContext';
import { Shield, MessageCircle, ArrowUpRight } from 'lucide-react';

const Footer = ({ onSwitchToAdmin }) => {
  const { storeInfo } = useStore();
  const name = storeInfo?.name || 'Sri Madhuri Makeovers';
  const phone = storeInfo?.whatsapp_number || '918985291053';
  const year = new Date().getFullYear();

  return (
    <footer style={{ background: 'var(--bg-primary)', borderTop: '1px solid var(--border-subtle)', padding: '4rem 0 2rem' }}>
      <div className="container">
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1.5fr 1fr 1fr 1.2fr',
            gap: '2.5rem',
            marginBottom: '3.5rem'
          }}
          className="footer-grid"
        >
          <div>
            <div style={{ fontFamily: 'Playfair Display, serif', fontSize: '1.35rem', color: 'var(--bone)', marginBottom: '0.75rem', fontWeight: 600 }}>
              {name}
            </div>
            <p style={{ fontSize: '0.86rem', color: 'var(--text-muted)', lineHeight: 1.6, maxWidth: 320 }}>
              {storeInfo?.tagline || 'A luxury bridal and beauty studio in Khammam.'}
            </p>
          </div>

          <div>
            <div style={{ fontSize: '0.7rem', color: 'var(--amber-light)', textTransform: 'uppercase', letterSpacing: '0.18em', marginBottom: '0.85rem', fontWeight: 600 }}>
              Explore
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem', fontSize: '0.88rem', color: 'var(--text-secondary)' }}>
              <a href="#services">Services</a>
              <a href="#offers">Offers</a>
              <a href="#gallery">Portfolio</a>
              <a href="#about">About</a>
              <a href="#contact">Contact</a>
            </div>
          </div>

          <div>
            <div style={{ fontSize: '0.7rem', color: 'var(--amber-light)', textTransform: 'uppercase', letterSpacing: '0.18em', marginBottom: '0.85rem', fontWeight: 600 }}>
              Social & Chat
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem', fontSize: '0.88rem', color: 'var(--text-secondary)' }}>
              {storeInfo?.social_instagram && (
                <a href={storeInfo.social_instagram} target="_blank" rel="noreferrer">
                  Instagram <ArrowUpRight size={11} style={{ display: 'inline' }} />
                </a>
              )}
              {storeInfo?.social_youtube && (
                <a href={storeInfo.social_youtube} target="_blank" rel="noreferrer">
                  YouTube <ArrowUpRight size={11} style={{ display: 'inline' }} />
                </a>
              )}
              {storeInfo?.social_facebook && (
                <a href={storeInfo.social_facebook} target="_blank" rel="noreferrer">
                  Facebook <ArrowUpRight size={11} style={{ display: 'inline' }} />
                </a>
              )}
              <a href={`https://wa.me/${phone}`} target="_blank" rel="noreferrer">
                WhatsApp <ArrowUpRight size={11} style={{ display: 'inline' }} />
              </a>
            </div>
          </div>

          <div>
            <div style={{ fontSize: '0.7rem', color: 'var(--amber-light)', textTransform: 'uppercase', letterSpacing: '0.18em', marginBottom: '0.85rem', fontWeight: 600 }}>
              Studio & Admin
            </div>
            <div style={{ fontSize: '0.86rem', color: 'var(--text-secondary)', lineHeight: 1.55 }}>
              {storeInfo?.address}
            </div>
            <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginTop: '0.5rem' }}>
              {storeInfo?.hours_weekday}
            </div>
            <button
              onClick={onSwitchToAdmin}
              style={{
                marginTop: '1.25rem',
                background: 'rgba(200, 151, 90, 0.08)',
                border: '1px solid var(--border-subtle)',
                color: 'var(--amber-light)',
                padding: '8px 14px',
                borderRadius: 'var(--radius-full)',
                fontSize: '0.78rem',
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px'
              }}
            >
              <Shield size={13} /> Admin Portal
            </button>
          </div>
        </div>

        {/* Bottom Bar */}
        <div
          className="footer-bottom"
          style={{
            paddingTop: '1.75rem',
            borderTop: '1px solid var(--border-subtle)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            fontSize: '0.8rem',
            color: 'var(--text-muted)',
            flexWrap: 'wrap',
            gap: '8px'
          }}
        >
          <div>© {year} {name}. All rights reserved.</div>
          <div>Handcrafted with care in Khammam, Telangana</div>
        </div>
      </div>

      <style>{`
        @media (max-width: 900px) {
          .footer-grid {
            grid-template-columns: 1fr 1fr !important;
            gap: 2rem !important;
          }
        }
        @media (max-width: 540px) {
          .footer-grid {
            grid-template-columns: 1fr !important;
            gap: 1.75rem !important;
          }
          .footer-bottom {
            flex-direction: column !important;
            align-items: flex-start !important;
            gap: 6px !important;
          }
        }
      `}</style>
    </footer>
  );
};

export default Footer;
