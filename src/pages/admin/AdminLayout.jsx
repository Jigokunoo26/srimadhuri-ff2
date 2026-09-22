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
  const { logout } = useAuth();
  const [activeTab, setActiveTab] = useState('dashboard');

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'services', label: 'Services & Prices', icon: Sparkles },
    { id: 'categories', label: 'Categories', icon: Layers },
    { id: 'bookings', label: 'Bookings Central', icon: Calendar },
    { id: 'offers', label: 'Special Deals', icon: Tag },
    { id: 'gallery', label: 'Gallery Photos', icon: Image },
    { id: 'testimonials', label: 'Testimonials', icon: MessageSquare },
    { id: 'team', label: 'Team', icon: Users },
    { id: 'hero', label: 'Hero & Branding', icon: Palette },
    { id: 'settings', label: 'Salon Settings', icon: Settings }
  ];

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-primary)', display: 'flex', flexDirection: 'column' }}>
      {/* Top Admin Bar */}
      <header
        style={{
          background: 'rgba(10, 15, 26, 0.96)',
          borderBottom: '1px solid var(--border-medium)',
          padding: '0.9rem 1.5rem',
          position: 'sticky',
          top: 0,
          zIndex: 999,
          backdropFilter: 'blur(16px)'
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', maxWidth: '1400px', margin: '0 auto' }}>
          {/* Logo & Portal Label */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '8px',
                background: 'var(--gold-gradient)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#080c16'
              }}
            >
              <Shield size={20} />
            </div>
            <div>
              <div style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.25rem', fontWeight: '700', color: 'var(--text-primary)' }}>
                Sri Madhuri Makeovers
              </div>
              <div style={{ fontSize: '0.72rem', color: 'var(--gold-primary)', letterSpacing: '1px', textTransform: 'uppercase' }}>
                Vendor Control Center
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <button
              onClick={onExitAdmin}
              className="btn btn-outline btn-sm"
              style={{ gap: '6px' }}
            >
              <ExternalLink size={14} /> View Public Website
            </button>
            <button
              onClick={logout}
              className="btn btn-danger btn-sm"
              style={{ gap: '6px' }}
            >
              <LogOut size={14} /> Logout
            </button>
          </div>
        </div>

        {/* Tab Navigation Menu */}
        <div
          style={{
            display: 'flex',
            gap: '6px',
            overflowX: 'auto',
            maxWidth: '1400px',
            margin: '0.75rem auto 0',
            paddingBottom: '4px'
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
                  padding: '7px 14px',
                  borderRadius: 'var(--radius-sm)',
                  fontSize: '0.82rem',
                  fontWeight: '600',
                  cursor: 'pointer',
                  border: 'none',
                  background: isActive ? 'rgba(212, 175, 55, 0.15)' : 'transparent',
                  color: isActive ? 'var(--gold-light)' : 'var(--text-muted)',
                  borderBottom: isActive ? '2px solid var(--gold-primary)' : '2px solid transparent',
                  whiteSpace: 'nowrap',
                  transition: 'var(--transition)'
                }}
              >
                <Icon size={15} /> {item.label}
              </button>
            );
          })}
        </div>
      </header>

      {/* Main Admin Content Container */}
      <main style={{ flexGrow: 1, padding: '2.5rem 1.5rem', maxWidth: '1400px', width: '100%', margin: '0 auto' }}>
        {activeTab === 'dashboard' && <AdminDashboard onNavigateTab={setActiveTab} />}
        {activeTab === 'services' && <AdminServices />}
        {activeTab === 'categories' && <AdminCategories />}
        {activeTab === 'bookings' && <AdminBookings />}
        {activeTab === 'offers' && <AdminOffers />}
        {activeTab === 'gallery' && <AdminGallery />}
        {activeTab === 'testimonials' && <AdminTestimonials />}
        {activeTab === 'team' && <AdminTeam />}
        {activeTab === 'hero' && <AdminHero />}
        {activeTab === 'settings' && <AdminSettings />}
      </main>
    </div>
  );
};

export default AdminLayout;
