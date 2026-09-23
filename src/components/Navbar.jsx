import React, { useState, useEffect } from 'react';
import { useStore } from '../context/StoreContext';
import { useAuth } from '../context/AuthContext';
import { Menu, X, Shield, Calendar, Phone } from 'lucide-react';

const Navbar = ({ onOpenBooking, currentTab, setCurrentTab }) => {
  const { storeInfo } = useStore();
  const { isAuthenticated } = useAuth();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Lock body scroll when mobile menu is active
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileMenuOpen]);

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
          background: isScrolled ? 'rgba(12, 20, 16, 0.94)' : 'rgba(12, 20, 16, 0.4)',
          backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)',
          borderBottom: isScrolled ? '1px solid var(--border-subtle)' : '1px solid rgba(200, 151, 90, 0.08)',
          transition: 'var(--transition)'
        }}
      >
        <div
          className="container"
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '1rem',
            width: '100%'
          }}
        >
          {/* Logo */}
          <a
            href="#home"
            style={{
              display: 'flex',
              alignItems: 'baseline',
              gap: '6px',
              textDecoration: 'none',
              flexShrink: 0
            }}
          >
            <span
              style={{
                fontFamily: 'Playfair Display, serif',
                fontSize: 'clamp(1.15rem, 3.8vw, 1.35rem)',
                fontWeight: 600,
                color: 'var(--bone)',
                letterSpacing: '-0.01em',
                whiteSpace: 'nowrap'
              }}
            >
              {studioName}
            </span>
            <span
              style={{
                fontSize: '0.68rem',
                color: 'var(--amber-light)',
                textTransform: 'uppercase',
                letterSpacing: '0.16em',
                fontWeight: 600
              }}
            >
              {studioType}
            </span>
          </a>

          {/* Desktop Navigation */}
          <nav className="desktop-nav" style={{ display: 'flex', gap: '2rem', alignItems: 'center' }}>
            {navLinks.map(link => (
              <a
                key={link.name}
                href={link.href}
                style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', fontWeight: 400 }}
                onMouseEnter={e => (e.currentTarget.style.color = 'var(--amber-light)')}
                onMouseLeave={e => (e.currentTarget.style.color = 'var(--text-secondary)')}
              >
                {link.name}
              </a>
            ))}
          </nav>

          {/* Right Action Icons */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            {/* Admin Portal Shortcut */}
            <button
              onClick={() => setCurrentTab('admin')}
              style={{
                background: 'rgba(200, 151, 90, 0.08)',
                border: '1px solid var(--border-subtle)',
                color: 'var(--amber-light)',
                width: 38,
                height: 38,
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                touchAction: 'manipulation'
              }}
              title={isAuthenticated ? 'Admin Dashboard' : 'Admin Login'}
              aria-label="Admin Portal"
            >
              <Shield size={16} />
            </button>

            {/* Desktop Reserve Button */}
            <button
              onClick={onOpenBooking}
              className="btn btn-primary btn-sm desktop-nav"
              style={{ gap: '6px' }}
            >
              <Calendar size={13} /> Reserve
            </button>

            {/* Mobile Hamburger Toggle */}
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="mobile-toggle"
              style={{
                background: 'transparent',
                border: '1px solid var(--border-medium)',
                color: 'var(--text-primary)',
                width: 42,
                height: 42,
                borderRadius: '50%',
                display: 'none',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                touchAction: 'manipulation'
              }}
              aria-label="Open mobile menu"
            >
              <Menu size={20} />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div
          onClick={() => setMobileMenuOpen(false)}
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(8, 12, 10, 0.97)',
            backdropFilter: 'blur(24px)',
            WebkitBackdropFilter: 'blur(24px)',
            zIndex: 1000,
            padding: '5rem 1.5rem 2.5rem',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            animation: 'fadeIn 0.25s ease'
          }}
        >
          {/* Close button */}
          <button
            onClick={() => setMobileMenuOpen(false)}
            style={{
              position: 'absolute',
              top: 14,
              right: 14,
              background: 'rgba(26, 38, 32, 0.7)',
              border: '1px solid var(--border-medium)',
              color: 'var(--text-primary)',
              width: 44,
              height: 44,
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer'
            }}
            aria-label="Close menu"
          >
            <X size={22} />
          </button>

          {/* Links list */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div style={{ fontSize: '0.72rem', color: 'var(--amber-light)', textTransform: 'uppercase', letterSpacing: '0.22em', marginBottom: '0.5rem' }}>
              Navigation
            </div>
            {navLinks.map(link => (
              <a
                key={link.name}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                style={{
                  fontFamily: 'Playfair Display, serif',
                  fontSize: '1.75rem',
                  color: 'var(--bone)',
                  padding: '4px 0',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between'
                }}
              >
                <span>{link.name}</span>
                <span style={{ fontSize: '0.9rem', color: 'var(--amber-light)', opacity: 0.7 }}>→</span>
              </a>
            ))}
          </div>

          {/* Bottom quick actions */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenBooking();
              }}
              className="btn btn-primary"
              style={{ width: '100%', padding: '0.95rem', gap: '8px', fontSize: '1rem' }}
            >
              <Calendar size={18} /> Reserve Appointment
            </button>

            <button
              onClick={() => {
                setMobileMenuOpen(false);
                setCurrentTab('admin');
              }}
              className="btn btn-ghost"
              style={{ width: '100%', padding: '0.75rem', gap: '8px', fontSize: '0.88rem' }}
            >
              <Shield size={16} /> Admin Portal ({isAuthenticated ? 'Logged In' : 'Sign In'})
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
