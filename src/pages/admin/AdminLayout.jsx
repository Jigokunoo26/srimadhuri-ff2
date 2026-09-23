import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import AdminDashboard from './AdminDashboard';
import AdminServices from './AdminServices';
import AdminBookings from './AdminBookings';
import AdminOffers from './AdminOffers';
import AdminSettings from './AdminSettings';
import AdminGallery from './AdminGallery';
import AdminTestimonials from './AdminTestimonials';
import AdminTeam from './AdminTeam';
import AdminCategories from './AdminCategories';
import AdminHero from './AdminHero';
import {
  LayoutDashboard,
  Sparkles,
  Calendar,
  Tag,
  Settings,
  LogOut,
  ExternalLink,
  Shield,
  Image,
  MessageSquare,
  Users,
  Layers,
  Palette
} from 'lucide-react';

const AdminLayout = ({ onExitAdmin }) => {
  const { logout, adminUser } = useAuth();
  const [activeTab, setActiveTab] = useState('dashboard');

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'bookings', label: 'Bookings Central', icon: Calendar },
    { id: 'services', label: 'Services & Prices', icon: Sparkles },
    { id: 'categories', label: 'Categories', icon: Layers },
    { id: 'offers', label: 'Deals & Offers', icon: Tag },
    { id: 'gallery', label: 'Gallery Photos', icon: Image },
    { id: 'testimonials', label: 'Testimonials', icon: MessageSquare },
    { id: 'team', label: 'Team', icon: Users },
    { id: 'hero', label: 'Hero & Branding', icon: Palette },
    { id: 'settings', label: 'Salon Settings', icon: Settings }
  ];

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-primary)', display: 'flex', flexDirection: 'column' }}>
      {/* Top Admin Sticky Bar */}
      <header
        style={{
          background: 'rgba(12, 20, 16, 0.97)',
          borderBottom: '1px solid var(--border-medium)',
          padding: '0.75rem 1rem',
          position: 'sticky',
          top: 0,
          zIndex: 999,
          backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)'
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', maxWidth: '1400px', margin: '0 auto', gap: '8px' }}>
          {/* Logo & Portal Label */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', minWidth: 0 }}>
            <div
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '8px',
                background: 'var(--amber-gradient)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--bg-primary)',
                flexShrink: 0
              }}
            >
              <Shield size={18} />
            </div>
            <div style={{ minWidth: 0 }}>
              <div
                style={{
                  fontFamily: 'Playfair Display, serif',
                  fontSize: 'clamp(1rem, 3.2vw, 1.2rem)',
                  fontWeight: 600,
                  color: 'var(--bone)',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis'
                }}
              >
                Sri Madhuri Makeovers
              </div>
              <div style={{ fontSize: '0.66rem', color: 'var(--amber-light)', letterSpacing: '0.12em', textTransform: 'uppercase', fontWeight: 600 }}>
                Vendor Portal
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexShrink: 0 }}>
            <button
              onClick={onExitAdmin}
              className="btn btn-ghost btn-sm"
              style={{ gap: '5px', padding: '6px 12px' }}
              title="View Public Website"
            >
              <ExternalLink size={14} />
              <span className="hide-on-mobile">Website</span>
            </button>
            <button
              onClick={logout}
              className="btn btn-danger btn-sm"
              style={{ gap: '5px', padding: '6px 12px' }}
              title="Logout"
            >
              <LogOut size={14} />
              <span className="hide-on-mobile">Logout</span>
            </button>
          </div>
        </div>

        {/* Tab Navigation Menu (Horizontal touch swiping on mobile) */}
        <div
          className="mobile-scroll-x"
          style={{
            maxWidth: '1400px',
            margin: '0.5rem auto 0',
            paddingBottom: '2px',
            borderTop: '1px solid rgba(200, 151, 90, 0.08)',
            paddingTop: '6px'
          }}
        >
          {navItems.map(item => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '7px 13px',
                  borderRadius: 'var(--radius-full)',
                  fontSize: '0.82rem',
                  fontWeight: 500,
                  cursor: 'pointer',
                  border: '1px solid',
                  background: isActive ? 'var(--bg-tertiary)' : 'transparent',
                  borderColor: isActive ? 'var(--amber)' : 'transparent',
                  color: isActive ? 'var(--amber-light)' : 'var(--text-muted)',
                  whiteSpace: 'nowrap',
                  transition: 'var(--transition)',
                  touchAction: 'manipulation'
                }}
              >
                <Icon size={14} /> {item.label}
              </button>
            );
          })}
        </div>
      </header>

      {/* Main Admin Content Container */}
      <main
        className="admin-main-wrapper"
        style={{
          flexGrow: 1,
          padding: '2rem 1.5rem',
          maxWidth: '1400px',
          width: '100%',
          margin: '0 auto'
        }}
      >
        {activeTab === 'dashboard' && <AdminDashboard onNavigateTab={setActiveTab} />}
        {activeTab === 'bookings' && <AdminBookings />}
        {activeTab === 'services' && <AdminServices />}
        {activeTab === 'categories' && <AdminCategories />}
        {activeTab === 'offers' && <AdminOffers />}
        {activeTab === 'gallery' && <AdminGallery />}
        {activeTab === 'testimonials' && <AdminTestimonials />}
        {activeTab === 'team' && <AdminTeam />}
        {activeTab === 'hero' && <AdminHero />}
        {activeTab === 'settings' && <AdminSettings />}
      </main>

      <style>{`
        @media (max-width: 768px) {
          .admin-main-wrapper {
            padding: 1.25rem 0.85rem !important;
          }
        }
      `}</style>
    </div>
  );
};

export default AdminLayout;
