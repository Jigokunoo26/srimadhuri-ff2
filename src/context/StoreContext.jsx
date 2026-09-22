import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  supabase,
  isSupabaseConfigured,
  initialStoreInfo,
  initialServices,
  initialOffers,
  initialBookings,
  initialGallery,
  initialTestimonials,
  initialTeam,
  initialCategories
} from '../lib/supabase';

const StoreContext = createContext();

export const StoreProvider = ({ children }) => {
  const loadLocal = (key, fallback) => {
    try {
      const saved = localStorage.getItem(`sri_madhuri_${key}`);
      return saved ? JSON.parse(saved) : fallback;
    } catch {
      return fallback;
    }
  };

  const saveLocal = (key, data) => {
    try {
      localStorage.setItem(`sri_madhuri_${key}`, JSON.stringify(data));
    } catch (e) {
      console.error('LocalStorage write error:', e);
    }
  };

  const [storeInfo, setStoreInfo] = useState(() => loadLocal('store_info', initialStoreInfo));
  const [services, setServices] = useState(() => loadLocal('services', initialServices));
  const [offers, setOffers] = useState(() => loadLocal('offers', initialOffers));
  const [bookings, setBookings] = useState(() => loadLocal('bookings', initialBookings));
  const [gallery, setGallery] = useState(() => loadLocal('gallery', initialGallery));
  const [testimonials, setTestimonials] = useState(() => loadLocal('testimonials', initialTestimonials));
  const [team, setTeam] = useState(() => loadLocal('team', initialTeam));
  const [categories, setCategories] = useState(() => loadLocal('categories', initialCategories));
  const [loading, setLoading] = useState(true);

  // Sync from Supabase on mount
  useEffect(() => {
    const fetchSupabaseData = async () => {
      if (!isSupabaseConfigured || !supabase) {
        setLoading(false);
        return;
      }

      try {
        const [
          { data: infoData },
          { data: servicesData },
          { data: offersData },
          { data: bookingsData },
          { data: galleryData },
          { data: testimonialsData },
          { data: teamData },
          { data: categoriesData }
        ] = await Promise.all([
          supabase.from('store_info').select('*').limit(1).single(),
          supabase.from('services').select('*').order('display_order', { ascending: true }),
          supabase.from('offers').select('*'),
          supabase.from('bookings').select('*').order('created_at', { ascending: false }),
          supabase.from('gallery').select('*'),
          supabase.from('testimonials').select('*'),
          supabase.from('team').select('*'),
          supabase.from('categories').select('*')
        ]);

        if (infoData) {
          setStoreInfo(infoData);
          saveLocal('store_info', infoData);
        }
        if (servicesData && servicesData.length > 0) {
          setServices(servicesData);
          saveLocal('services', servicesData);
        }
        if (offersData && offersData.length > 0) {
          setOffers(offersData);
          saveLocal('offers', offersData);
        }
        if (bookingsData && bookingsData.length > 0) {
          setBookings(bookingsData);
          saveLocal('bookings', bookingsData);
        }
        if (galleryData && galleryData.length > 0) {
          setGallery(galleryData);
          saveLocal('gallery', galleryData);
        }
        if (testimonialsData && testimonialsData.length > 0) {
          setTestimonials(testimonialsData);
          saveLocal('testimonials', testimonialsData);
        }
        if (teamData && teamData.length > 0) {
          setTeam(teamData);
          saveLocal('team', teamData);
        }
        if (categoriesData && categoriesData.length > 0) {
          setCategories(categoriesData);
          saveLocal('categories', categoriesData);
        }
      } catch (err) {
        console.warn('Notice: Using local store cache while Supabase connects:', err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchSupabaseData();
  }, []);

  // ── SERVICES ──
  const updateService = async (id, updatedFields) => {
    const updated = services.map(s => s.id === id ? { ...s, ...updatedFields } : s);
    setServices(updated);
    saveLocal('services', updated);
    if (isSupabaseConfigured && supabase) {
      try { await supabase.from('services').update(updatedFields).eq('id', id); } catch (e) { console.error(e); }
    }
  };

  const addService = async (newServiceData) => {
    const newService = {
      id: `s-${Date.now()}`,
      display_order: services.length + 1,
      is_active: true,
      ...newServiceData
    };
    const updated = [...services, newService];
    setServices(updated);
    saveLocal('services', updated);
    if (isSupabaseConfigured && supabase) {
      try {
        const { data } = await supabase.from('services').insert([newService]).select().single();
        if (data) setServices(prev => prev.map(s => s.id === newService.id ? data : s));
      } catch (e) { console.error(e); }
    }
    return newService;
  };

  const deleteService = async (id) => {
    const updated = services.filter(s => s.id !== id);
    setServices(updated);
    saveLocal('services', updated);
    if (isSupabaseConfigured && supabase) {
      try { await supabase.from('services').delete().eq('id', id); } catch (e) { console.error(e); }
    }
  };

  // ── OFFERS ──
  const updateOffer = async (id, updatedFields) => {
    const updated = offers.map(o => o.id === id ? { ...o, ...updatedFields } : o);
    setOffers(updated);
    saveLocal('offers', updated);
    if (isSupabaseConfigured && supabase) {
      try { await supabase.from('offers').update(updatedFields).eq('id', id); } catch (e) { console.error(e); }
    }
  };

  const addOffer = async (newOfferData) => {
    const newOffer = { id: `o-${Date.now()}`, is_active: true, ...newOfferData };
    const updated = [...offers, newOffer];
    setOffers(updated);
    saveLocal('offers', updated);
    if (isSupabaseConfigured && supabase) {
      try { await supabase.from('offers').insert([newOffer]); } catch (e) { console.error(e); }
    }
  };

  const deleteOffer = async (id) => {
    const updated = offers.filter(o => o.id !== id);
    setOffers(updated);
    saveLocal('offers', updated);
    if (isSupabaseConfigured && supabase) {
      try { await supabase.from('offers').delete().eq('id', id); } catch (e) { console.error(e); }
    }
  };

  // ── BOOKINGS ──
  const addBooking = async (bookingData) => {
    const matchedService = services.find(s => s.name === bookingData.service);
    let amount = bookingData.amount || 0;
    if (!amount && matchedService && matchedService.price) {
      amount = parseFloat(matchedService.price.replace(/[^0-9.]/g, '')) || 0;
    }

    const newBooking = {
      id: `b-${Date.now()}`,
      status: 'pending',
      amount,
      source: bookingData.source || 'website',
      created_at: new Date().toISOString(),
      ...bookingData
    };

    const updated = [newBooking, ...bookings];
    setBookings(updated);
    saveLocal('bookings', updated);
    if (isSupabaseConfigured && supabase) {
      try { await supabase.from('bookings').insert([newBooking]); } catch (e) { console.error(e); }
    }
    return newBooking;
  };

  const updateBookingStatus = async (id, status) => {
    const updated = bookings.map(b => b.id === id ? { ...b, status, updated_at: new Date().toISOString() } : b);
    setBookings(updated);
    saveLocal('bookings', updated);
    if (isSupabaseConfigured && supabase) {
      try { await supabase.from('bookings').update({ status }).eq('id', id); } catch (e) { console.error(e); }
    }
  };

  // ── STORE INFO / HERO / SETTINGS ──
  const updateStoreInfo = async (newInfo) => {
    const merged = { ...storeInfo, ...newInfo };
    setStoreInfo(merged);
    saveLocal('store_info', merged);
    if (isSupabaseConfigured && supabase) {
      try { await supabase.from('store_info').upsert(merged); } catch (e) { console.error(e); }
    }
  };

  // ── GALLERY ──
  const addGalleryItem = async (item) => {
    const newItem = { id: `g-${Date.now()}`, ...item };
    const updated = [newItem, ...gallery];
    setGallery(updated);
    saveLocal('gallery', updated);
    if (isSupabaseConfigured && supabase) {
      try { await supabase.from('gallery').insert([newItem]); } catch (e) { console.error(e); }
    }
  };

  const deleteGalleryItem = async (id) => {
    const updated = gallery.filter(g => g.id !== id);
    setGallery(updated);
    saveLocal('gallery', updated);
    if (isSupabaseConfigured && supabase) {
      try { await supabase.from('gallery').delete().eq('id', id); } catch (e) { console.error(e); }
    }
  };

  // ── TESTIMONIALS ──
  const addTestimonial = async (item) => {
    const newItem = { id: `t-${Date.now()}`, ...item };
    const updated = [newItem, ...testimonials];
    setTestimonials(updated);
    saveLocal('testimonials', updated);
    if (isSupabaseConfigured && supabase) {
      try { await supabase.from('testimonials').insert([newItem]); } catch (e) { console.error(e); }
    }
  };

  const updateTestimonial = async (id, updatedFields) => {
    const updated = testimonials.map(t => t.id === id ? { ...t, ...updatedFields } : t);
    setTestimonials(updated);
    saveLocal('testimonials', updated);
    if (isSupabaseConfigured && supabase) {
      try { await supabase.from('testimonials').update(updatedFields).eq('id', id); } catch (e) { console.error(e); }
    }
  };

  const deleteTestimonial = async (id) => {
    const updated = testimonials.filter(t => t.id !== id);
    setTestimonials(updated);
    saveLocal('testimonials', updated);
    if (isSupabaseConfigured && supabase) {
      try { await supabase.from('testimonials').delete().eq('id', id); } catch (e) { console.error(e); }
    }
  };

  // ── TEAM ──
  const addTeamMember = async (member) => {
    const newMember = { id: `tm-${Date.now()}`, ...member };
    const updated = [...team, newMember];
    setTeam(updated);
    saveLocal('team', updated);
    if (isSupabaseConfigured && supabase) {
      try { await supabase.from('team').insert([newMember]); } catch (e) { console.error(e); }
    }
  };

  const updateTeamMember = async (id, updatedFields) => {
    const updated = team.map(m => m.id === id ? { ...m, ...updatedFields } : m);
    setTeam(updated);
    saveLocal('team', updated);
    if (isSupabaseConfigured && supabase) {
      try { await supabase.from('team').update(updatedFields).eq('id', id); } catch (e) { console.error(e); }
    }
  };

  const deleteTeamMember = async (id) => {
    const updated = team.filter(m => m.id !== id);
    setTeam(updated);
    saveLocal('team', updated);
    if (isSupabaseConfigured && supabase) {
      try { await supabase.from('team').delete().eq('id', id); } catch (e) { console.error(e); }
    }
  };

  // ── CATEGORIES ──
  const addCategory = async (cat) => {
    const newCat = { id: `cat-${Date.now()}`, ...cat };
    const updated = [...categories, newCat];
    setCategories(updated);
    saveLocal('categories', updated);
    if (isSupabaseConfigured && supabase) {
      try { await supabase.from('categories').insert([newCat]); } catch (e) { console.error(e); }
    }
  };

  const updateCategory = async (id, updatedFields) => {
    const updated = categories.map(c => c.id === id ? { ...c, ...updatedFields } : c);
    setCategories(updated);
    saveLocal('categories', updated);
    if (isSupabaseConfigured && supabase) {
      try { await supabase.from('categories').update(updatedFields).eq('id', id); } catch (e) { console.error(e); }
    }
  };

  const deleteCategory = async (id) => {
    const updated = categories.filter(c => c.id !== id);
    setCategories(updated);
    saveLocal('categories', updated);
    if (isSupabaseConfigured && supabase) {
      try { await supabase.from('categories').delete().eq('id', id); } catch (e) { console.error(e); }
    }
  };

  // Auto-calculated income statistics
  const incomeStats = {
    totalRevenue: bookings
      .filter(b => b.status === 'completed')
      .reduce((sum, b) => sum + (Number(b.amount) || 0), 0),
    totalBookings: bookings.length,
    pendingBookings: bookings.filter(b => b.status === 'pending').length,
    todayBookings: bookings.filter(b => {
      const todayStr = new Date().toISOString().split('T')[0];
      return b.date === todayStr;
    }).length
  };

  return (
    <StoreContext.Provider
      value={{
        storeInfo,
        updateStoreInfo,
        services,
        updateService,
        addService,
        deleteService,
        offers,
        updateOffer,
        addOffer,
        deleteOffer,
        bookings,
        addBooking,
        updateBookingStatus,
        incomeStats,
        gallery,
        addGalleryItem,
        deleteGalleryItem,
        testimonials,
        addTestimonial,
        updateTestimonial,
        deleteTestimonial,
        team,
        addTeamMember,
        updateTeamMember,
        deleteTeamMember,
        categories,
        addCategory,
        updateCategory,
        deleteCategory,
        loading
      }}
    >
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => useContext(StoreContext);
