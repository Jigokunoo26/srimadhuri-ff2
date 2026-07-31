/**
 * ═══════════════════════════════════════════════════════════════════════════
 * SRI MADHURI MAKEOVERS — SITE CONFIGURATION
 * ═══════════════════════════════════════════════════════════════════════════
 * 
 * Edit this file to update ANY content on the website.
 * No code changes required — just update values below and refresh.
 * 
 * ═══════════════════════════════════════════════════════════════════════════
 */

const DEFAULT_CONFIG = {

  /* ─── Brand Identity ─────────────────────────────────────────────────── */
  brand: {
    name: "Sri Madhuri",
    suffix: "Makeovers",
    fullName: "Sri Madhuri Makeovers",
    tagline: "Where Beauty Meets Confidence",
    subtitle: "Premium Beauty Services & Professional Makeovers",
    description: "Experience premium beauty services, fashion styling, and personalized treatments at Sri Madhuri Makeovers — Khammam's most trusted luxury beauty destination.",
    founded: 2021,
    city: "Khammam",
    state: "Telangana",
    country: "India",
  },

  /* ─── Contact Information ────────────────────────────────────────────── */
  contact: {
    phone: "+918985291053",
    phoneClean: "918985291053",
    email: "hello@srimadhurimakeovers.com",
    address: "Mustafa Nagar, Opposite Chakri School, Khammam, Telangana",
    addressShort: "Mustafa Nagar, Khammam",
    mapEmbedUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3826.5!2d80.15!3d17.25!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMTfCsDE1JzAwLjAiTiA4MMKwMDknMDAuMCJF!5e0!3m2!1sen!2sin!4v1",
    parkingInfo: "Free parking available near Chakri School",
    workingHours: {
      weekdays: "Mon - Sat: 10:00 AM - 9:00 PM",
      sunday: "Sunday: By Appointment Only",
    },
  },

  /* ─── Social Links ───────────────────────────────────────────────────── */
  social: {
    instagram: "https://www.instagram.com/sri__madhuri_makevoers?igsh=Y3Jtb2htY3BoN2tk",
    facebook: "#",
    youtube: "https://youtube.com/@srimadhurimakeovers?si=hzkMdaR8oxfKjiCg",
    linkedin: "#",
    whatsapp: "https://wa.me/918985291053",
    googleReview: "https://share.google/jHJd45mOnxxzCnGhn",
    embedSocialRef: "b313c8f1eb04905b12038b545bed73685768e1ee",
  },

  /* ─── Hero Section ───────────────────────────────────────────────────── */
  hero: {
    heading: "Where Beauty Meets Confidence",
    subheading: "Premium Beauty Services & Professional Makeovers",
    ctaPrimary: { text: "Book Appointment", link: "#booking" },
    ctaSecondary: { text: "Explore Services", link: "#services" },
    backgroundImage: "WhatsApp Image 2026-07-18 at 9.24.10 PM.jpeg",
  },

  /* ─── Statistics ─────────────────────────────────────────────────────── */
  stats: [
    { number: 1000, suffix: "+", label: "Happy Clients", icon: "fas fa-smile" },
    { number: 500, suffix: "+", label: "Bridal Makeovers", icon: "fas fa-ring" },
    { number: 1000, suffix: "+", label: "Happy Smiles", icon: "fas fa-heart" },
    { number: 5, suffix: "+", label: "Years Experience", icon: "fas fa-award" },
  ],

  /* ─── About Section ──────────────────────────────────────────────────── */
  about: {
    heading: "About Sri Madhuri Makeovers",
    subheading: "Where Beauty Meets Confidence",
    image: "WhatsApp Image 2026-07-18 at 9.24.10 PM.jpeg",
    paragraphs: [
      "Sri Madhuri Makeovers is a professional beauty salon dedicated to enhancing confidence through high-quality beauty and grooming services. We specialize in bridal makeovers, party makeup, hair styling, skincare, and personalized beauty treatments for women. Our experienced team combines modern beauty techniques with premium products to deliver elegant, long-lasting results for every occasion.",
      "Whether it's your wedding day, a festive celebration, or a regular self-care visit, we focus on providing a relaxing, hygienic, and customer-friendly experience. Our goal is to become one of the most trusted beauty destinations in Khammam.",
    ],
    features: [
      { icon: "fas fa-user-tie", title: "Expert Beauticians", description: "Professional and experienced team delivering timely, excellent results." },
      { icon: "fas fa-spa", title: "Premium Experience", description: "Hygienic, comfortable salon environment with top-quality products." },
      { icon: "fas fa-heart", title: "Personalized Care", description: "Affordable packages and personalized beauty consultations." },
    ],
  },

  /* ─── Services ───────────────────────────────────────────────────────── */
  services: [
    {
      name: "Bridal Makeup",
      icon: "fas fa-ring",
      description: "Flawless HD & Airbrush makeup to make your special day truly magical.",
      price: "Starting ₹15,000",
      duration: "3-4 Hours",
      benefits: ["Long-lasting HD finish", "Airbrush technology", "Saree draping included", "Pre-bridal consultation"],
      idealFor: "Brides & Pre-wedding functions",
      productsUsed: ["MAC", "Huda Beauty", "Kryolan", "Urban Decay"],
      image: "image_search_1784394112206.jpg.jpeg",
      category: "bridal",
    },
    {
      name: "Hair Styling & Color",
      icon: "fas fa-cut",
      description: "Trendy cuts, vibrant coloring, Keratin treatment, and rejuvenating hair spas.",
      price: "Starting ₹500",
      duration: "1-3 Hours",
      benefits: ["Personalized consultation", "Premium products", "Color protection", "Post-care guidance"],
      idealFor: "All hair types & occasions",
      productsUsed: ["L'Oréal Professionnel", "Schwarzkopf", "Matrix", "Wella"],
      image: "image_search_1784394131419.jpg.jpeg",
      category: "hair",
    },
    {
      name: "Skin Care & Facials",
      icon: "fas fa-spa",
      description: "Luxurious facial treatments for glowing, healthy, and rejuvenated skin.",
      price: "Starting ₹800",
      duration: "45-90 Mins",
      benefits: ["Deep cleansing", "Anti-aging treatment", "Hydration boost", "Glow enhancement"],
      idealFor: "Regular skincare & special occasions",
      productsUsed: ["Dermalogica", "O3+", "VLCC", "Lotus"],
      image: "image_search_1784394187949.jpg.jpeg",
      category: "skincare",
    },
    {
      name: "Nail Art & Spa",
      icon: "fas fa-hand-sparkles",
      description: "Exquisite manicures, pedicures, and customized nail art designs.",
      price: "Starting ₹400",
      duration: "30-60 Mins",
      benefits: ["Gel & acrylic options", "Custom designs", "Relaxing spa", "Premium polishes"],
      idealFor: "Special occasions & regular care",
      productsUsed: ["OPI", "Sally Hansen", "Lakme"],
      image: "image_search_1784394172084.jpg.jpeg",
      category: "nailart",
    },
    {
      name: "Fashion Styling",
      icon: "fas fa-tshirt",
      description: "Expert saree draping, groom makeup, and personalized fashion consultations.",
      price: "Starting ₹2,000",
      duration: "1-2 Hours",
      benefits: ["Saree draping styles", "Outfit coordination", "Accessory guidance", "Photoshoot ready"],
      idealFor: "Weddings, parties & photo shoots",
      productsUsed: ["Premium styling accessories"],
      image: "image_search_1784394166482.jpg.jpeg",
      category: "styling",
    },
    {
      name: "Essentials",
      icon: "fas fa-eye",
      description: "Painless waxing, precision eyebrow shaping, and regular maintenance.",
      price: "Starting ₹200",
      duration: "15-45 Mins",
      benefits: ["Painless techniques", "Precision threading", "Skin-friendly products", "Hygiene assured"],
      idealFor: "Regular grooming & maintenance",
      productsUsed: ["Rica", "GiGi", "Fem"],
      image: "image_search_1784394210626.jpg.jpeg",
      category: "essentials",
    },
  ],

  /* ─── Gallery ────────────────────────────────────────────────────────── */
  gallery: {
    categories: ["All", "Bridal", "Hair", "Skincare", "Nail Art", "Styling", "Essentials"],
    images: [
      { src: "image_search_1784394112206.jpg.jpeg", alt: "Bridal Makeup", category: "bridal" },
      { src: "image_search_1784394131419.jpg.jpeg", alt: "Hair Styling", category: "hair" },
      { src: "image_search_1784394166482.jpg.jpeg", alt: "Fashion Styling", category: "styling" },
      { src: "image_search_1784394172084.jpg.jpeg", alt: "Nail Art", category: "nailart" },
      { src: "image_search_1784394187949.jpg.jpeg", alt: "Spa Treatment", category: "skincare" },
      { src: "image_search_1784394210626.jpg.jpeg", alt: "Makeover", category: "essentials" },
    ],
  },

  /* ─── Testimonials ───────────────────────────────────────────────────── */
  testimonials: [
    {
      name: "Swathi",
      role: "Bride",
      image: "WhatsApp Image 2026-07-19 at 12.44.20 AM.jpeg",
      rating: 5,
      text: "Sri Madhuri made me look like an absolute queen on my wedding day. The HD makeup was flawless and lasted all night!",
    },
    {
      name: "Priya Sharma",
      role: "Happy Client",
      image: "WhatsApp Image 2026-07-19 at 12.44.47 AM.jpeg",
      rating: 5,
      text: "I had the most relaxing facial and skincare treatment. The staff is so friendly, and my skin has never felt better!",
    },
    {
      name: "Emily Rose",
      role: "Regular Client",
      image: "WhatsApp Image 2026-07-19 at 12.45.26 AM.jpeg",
      rating: 5,
      text: "Best hair spa and keratin treatment I've ever had. The staff is extremely polite and the ambiance is incredibly luxurious.",
    },
  ],

  /* ─── Membership Plans ───────────────────────────────────────────────── */
  membership: [
    {
      tier: "Silver",
      price: "₹2,999/year",
      color: "#C0C0C0",
      benefits: [
        "10% off all services",
        "Birthday special discount",
        "Priority booking",
        "1 free facial per year",
        "Loyalty points (1x)",
      ],
    },
    {
      tier: "Gold",
      price: "₹5,999/year",
      color: "#D4AF37",
      featured: true,
      benefits: [
        "20% off all services",
        "Birthday complimentary makeover",
        "Priority booking + home service",
        "2 free facials per year",
        "Loyalty points (2x)",
        "Free hair spa quarterly",
        "Exclusive member events",
      ],
    },
    {
      tier: "Platinum",
      price: "₹9,999/year",
      color: "#E5E4E2",
      benefits: [
        "30% off all services",
        "Complimentary birthday makeover + photoshoot",
        "VIP priority + home service",
        "Unlimited facials",
        "Loyalty points (3x)",
        "Monthly hair spa",
        "Exclusive events + early access",
        "1 complimentary bridal trial",
      ],
    },
  ],

  /* ─── Offers ─────────────────────────────────────────────────────────── */
  offers: [
    {
      title: "Monsoon Glow Package",
      description: "Complete facial + hair spa + manicure combo at a special monsoon price.",
      originalPrice: "₹3,500",
      offerPrice: "₹2,499",
      discount: "30% OFF",
      endDate: "2026-08-31T23:59:59",
      badge: "Limited Time",
    },
    {
      title: "Bridal Season Special",
      description: "Book your complete bridal package and get pre-bridal treatments free.",
      originalPrice: "₹25,000",
      offerPrice: "₹18,999",
      discount: "25% OFF",
      endDate: "2026-09-30T23:59:59",
      badge: "Best Seller",
    },
  ],

  /* ─── Team Members ───────────────────────────────────────────────────── */
  team: [
    {
      name: "Sri Madhuri",
      role: "Founder & Lead Artist",
      experience: "5+ Years",
      skills: ["Bridal Makeup", "HD Makeup", "Fashion Styling"],
      image: "WhatsApp Image 2026-07-18 at 9.24.10 PM.jpeg",
      social: { instagram: "#" },
    },
    {
      name: "Expert Stylist",
      role: "Senior Hair Stylist",
      experience: "4+ Years",
      skills: ["Hair Coloring", "Keratin Treatment", "Hair Spa"],
      image: "image_search_1784394131419.jpg.jpeg",
      social: { instagram: "#" },
    },
    {
      name: "Skin Specialist",
      role: "Skincare Expert",
      experience: "3+ Years",
      skills: ["Facials", "Skin Analysis", "Anti-aging"],
      image: "image_search_1784394187949.jpg.jpeg",
      social: { instagram: "#" },
    },
  ],

  /* ─── SEO Configuration ──────────────────────────────────────────────── */
  seo: {
    title: "Sri Madhuri Makeovers | Premium Beauty Salon in Khammam",
    description: "Sri Madhuri Makeovers — Khammam's premier luxury beauty salon offering bridal makeup, hair styling, skincare, nail art, and fashion styling. Book your appointment today.",
    keywords: "beauty salon khammam, bridal makeup khammam, hair salon khammam, makeover khammam, sri madhuri makeovers, best salon khammam, bridal makeover telangana, hair spa khammam, facial khammam, nail art khammam",
    ogImage: "WhatsApp Image 2026-07-18 at 9.24.10 PM.jpeg",
    canonicalUrl: "https://srimadhurimakeovers.com",
    locale: "en_IN",
  },

  /* ─── AI Features (Future-ready toggles) ─────────────────────────────── */
  aiFeatures: {
    skinAnalysis: false,
    faceShapeDetection: false,
    virtualMakeupTryOn: false,
    hairstyleRecommendation: false,
    foundationMatching: false,
    lipstickRecommendation: false,
    chatAssistant: false,
  },

  /* ─── Booking Form Options ───────────────────────────────────────────── */
  booking: {
    services: [
      "Bridal Makeup",
      "Party Makeup",
      "Hair Styling & Color",
      "Hair Spa & Keratin",
      "Skin Care & Facial",
      "Nail Art & Spa",
      "Fashion Styling",
      "Saree Draping",
      "Waxing & Threading",
      "Pre-Bridal Package",
      "Other",
    ],
    timeSlots: [
      "10:00 AM", "10:30 AM", "11:00 AM", "11:30 AM",
      "12:00 PM", "12:30 PM", "1:00 PM", "1:30 PM",
      "2:00 PM", "2:30 PM", "3:00 PM", "3:30 PM",
      "4:00 PM", "4:30 PM", "5:00 PM", "5:30 PM",
      "6:00 PM", "6:30 PM", "7:00 PM", "7:30 PM",
      "8:00 PM", "8:30 PM",
    ],
  },
};

let SITE_CONFIG = { ...DEFAULT_CONFIG };

async function loadSiteConfig() {
    try {
        const response = await fetch('/api/config');
        if (response.ok) {
            const apiConfig = await response.json();
            SITE_CONFIG = { ...DEFAULT_CONFIG, ...apiConfig };
        } else {
            console.error('Failed to load config from API, using defaults');
            SITE_CONFIG = { ...DEFAULT_CONFIG };
        }
    } catch (err) {
        console.error('Error fetching config:', err);
        SITE_CONFIG = { ...DEFAULT_CONFIG };
    }
}
