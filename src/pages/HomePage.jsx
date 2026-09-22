import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import ServicesSection from '../components/ServicesSection';
import OffersSection from '../components/OffersSection';
import GallerySection from '../components/GallerySection';
import AboutSection from '../components/AboutSection';
import GoogleReviews from '../components/GoogleReviews';
import ContactSection from '../components/ContactSection';
import Footer from '../components/Footer';
import BookingModal from '../components/BookingModal';
import WhatsAppButton from '../components/WhatsAppButton';

const HomePage = ({ onSwitchToAdmin }) => {
  const [bookingModalOpen, setBookingModalOpen] = useState(false);
  const [selectedService, setSelectedService] = useState(null);

  const handleOpenBooking = (service = null) => {
    setSelectedService(service);
    setBookingModalOpen(true);
  };

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-primary)' }}>
      {/* Navbar */}
      <Navbar
        onOpenBooking={() => handleOpenBooking()}
        currentTab="home"
        setCurrentTab={tab => {
          if (tab === 'admin') onSwitchToAdmin();
        }}
      />

      {/* Hero */}
      <Hero onOpenBooking={() => handleOpenBooking()} />

      {/* Services & Live Pricing */}
      <ServicesSection onSelectService={service => handleOpenBooking(service)} />

      {/* Limited Time Offers & Deals */}
      <OffersSection onSelectOffer={offer => handleOpenBooking(offer)} />

      {/* Gallery */}
      <GallerySection />

      {/* About Story & Team */}
      <AboutSection />

      {/* Verified Google Reviews */}
      <GoogleReviews />

      {/* Contact & Map */}
      <ContactSection />

      {/* Footer */}
      <Footer onSwitchToAdmin={onSwitchToAdmin} />

      {/* Floating Action Button */}
      <WhatsAppButton />

      {/* Booking Modal */}
      <BookingModal
        isOpen={bookingModalOpen}
        onClose={() => setBookingModalOpen(false)}
        preselectedService={selectedService}
      />
    </div>
  );
};

export default HomePage;
