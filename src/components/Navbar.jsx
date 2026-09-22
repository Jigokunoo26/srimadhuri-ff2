import React, { useState, useEffect } from 'react';
import { useStore } from '../context/StoreContext';
import { useAuth } from '../context/AuthContext';
import { Menu, X, Shield } from 'lucide-react';

const Navbar = ({ onOpenBooking, currentTab, setCurrentTab }) => {
  const { storeInfo } = useStore();
  const { isAuthenticated } = useAuth();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 30);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Services', href: '#services' },
    { name: 'Offers', href: '#offers' },
    { name: 'Portfolio', href: '#gallery' },
    { name: 'About', href: '#about' },
    { name: 'Contact', href: '#contact' }
  ];

  const studioName = storeInfo?.name?.split(' ').slice(0, -1).join(' ') || 'Sri Madhuri';
  const studioType = storeInfo?.name?.split(' ').slice(-1)[0] || 'Makeovers';

  return (
    <>
      <header
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          zIndex: 900,
          height: 64,
          display: 'flex',
          alignItems: 'center',
          background: isScrolled ? 'rgba(12, 20, 16, 0.92)' : 'transparent',
          backdropFilter: isScrolled ? 'blur(14px)' : 'none',
          borderBottom: isScrolled ? '1px solid var(--border-subtle)' : '1px solid transparent',
          transition: 'var(--transition)'
        }}
      >
        <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '2rem', width: '100%' }}>
          <a href="#home" style={{ display: 'flex', alignItems: 'baseline', gap: '8px', textDecoration: 'none' }}>
            <span style={{ fontFamily: 'Playfair Display, serif', fontSize: '1.25rem', fontWeight: 500, color: 'var(--bone)', letterSpacing: '-0.01em' }}>
              {studioName}
            </span>
            <span style={{ fontSize: '0.7rem', color: 'var(--amber-light)', textTransform: 'uppercase', letterSpacing: '0.18em', fontWeight: 500 }}>
              {studioType}
            </span>
          </a>

          <nav className="desktop-nav" style={{ display: 'flex', gap: '2.25rem', alignItems: 'center' }}>
            {navLinks.map(link => (
              <a
                key={link.name}
                href={link.href}
                style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', fontWeight: 400 }}
                onMouseEnter={e => (e.currentTarget.style.color = 'var(--amber-light)')}
                onMouseLeave={e => (e.currentTarget.style.color = 'var(--text-secondary)')}
              >
                {link.name}
              </a>
            ))}
          </nav>

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <button
              onClick={() => setCurrentTab('admin')}
              style={{
                background: 'transparent',
                border: '1px solid var(--border-subtle)',
                color: 'var(--text-muted)',
                width: 34, height: 34, borderRadius: '50%',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                cursor: 'pointer'
              }}
              title={isAuthenticated ? 'Admin Dashboard' : 'Admin Login'}
            >
              <Shield size={15} />
            </button>
            <button onClick={onOpenBooking} className="btn btn-primary btn-sm desktop-nav" style={{ gap: '6px' }}>
              Reserve
            </button>
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="mobile-toggle"
              style={{ background: 'transparent', border: '1px solid var(--border-subtle)', color: 'var(--text-primary)', width: 36, height: 36, borderRadius: '50%', display: 'none', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
              aria-label="Open menu"
            >
              <Menu size={18} />
            </button>
          </div>
        </div>
      </header>

      {mobileMenuOpen && (
        <div
          onClick={() => setMobileMenuOpen(false)}
          style={{ position: 'fixed', inset: 0, background: 'rgba(8, 12, 10, 0.96)', backdropFilter: 'blur(20px)', zIndex: 1000, padding: '5rem 1.5rem 2rem' }}
        >
          <button onClick={() => setMobileMenuOpen(false)} style={{ position: 'absolute', top: 18, right: 18, background: 'transparent', border: '1px solid var(--border-subtle)', color: 'var(--text-primary)', width: 40, height: 40, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
            <X size={20} />
          </button>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {navLinks.map(link => (
              <a key={link.name} href={link.href} onClick={() => setMobileMenuOpen(false)} style={{ fontFamily: 'Playfair Display, serif', fontSize: '1.8rem', color: 'var(--bone)' }}>
                {link.name}
              </a>
            ))}
            <button onClick={() => { setMobileMenuOpen(false); onOpenBooking(); }} className="btn btn-primary" style={{ marginTop: '1rem', width: '100%' }}>
              Reserve Appointment
            </button>
          </div>
        </div>
      )}

      <style>{`
        @media (max-width: 900px) {
          .desktop-nav { display: none !important; }
          .mobile-toggle { display: flex !important; }
        }
      `}</style>
    </>
  );
};

export default Navbar;
