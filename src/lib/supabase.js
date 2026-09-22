import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

export const isSupabaseConfigured = Boolean(
  supabaseUrl && 
  supabaseAnonKey && 
  !supabaseUrl.includes('your-supabase')
);

export const supabase = isSupabaseConfigured 
  ? createClient(supabaseUrl, supabaseAnonKey) 
  : null;

// Initial Salon Data (matches database schema and actual salon services)
export const initialStoreInfo = {
  name: 'Sri Madhuri Makeovers',
  tagline: 'Where Beauty Meets Confidence',
  phone: '+91 89852 91053',
  phone_clean: '918985291053',
  whatsapp_number: '918985291053',
  email: 'hello@srimadhurimakeovers.com',
  address: 'Mustafa Nagar, Opposite Chakri School, Khammam, Telangana',
  hours_weekday: '10:00 AM - 9:00 PM',
  hours_saturday: '10:00 AM - 9:00 PM',
  hours_sunday: 'By Appointment Only',
  social_instagram: 'https://www.instagram.com/sri__madhuri_makevoers',
  social_youtube: 'https://youtube.com/@srimadhurimakeovers',
  social_facebook: 'https://www.facebook.com/srimadhurimakeovers',
  google_review_url: 'https://search.google.com/local/writereview?placeid=ChIJXWHVBQBXNDoRARWlA1BqItA',
  about_text: 'Sri Madhuri Makeovers is a professional beauty salon dedicated to enhancing confidence through high-quality beauty and grooming services. We specialize in bridal makeovers, party makeup, hair styling, skincare, and personalized beauty treatments for women.',
  about_subtext: "Whether it's your grand wedding day, pre-wedding rituals, a festive party, or regular self-care, our studio is designed to offer a peaceful, sanitized, and deeply rejuvenating beauty experience.",
  about_title: 'Crafting Confidence, One Makeover at a Time',
  about_award_label: 'Of Excellence in Khammam',
  about_image_url: '/banner.jpeg',
  about_features: [
    'Expert Certified Beauticians',
    '100% Authentic Luxury Brands',
    'Hospital-Grade Sanitation',
    'Tailored Bridal Consultations'
  ],
  hero_title: 'Luxury Makeovers & Bridal Artistry',
  hero_subtitle: 'Experience premier styling, personalized bridal rituals, and flawless aesthetics crafted with passion in Khammam.',
  hero_badge: 'Premium Luxury Beauty Salon',
  hero_cta: 'Reserve',
  hero_image_url: '/banner.jpeg',
  experience_years: '6+',
  happy_clients: '2,500+',
  rating_score: '4.9★',
  google_review_count: 247,
  map_embed_url: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3810.8473933755513!2d80.1483022750431!3d17.226190983633707!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3a34570005d5615d%3A0xd0226a5003a51501!2sSri%20Madhuri%27s%20Makeovers%20%26%20Beauty%20Saloon!5e0!3m2!1sen!2sus!4v1788524908759!5m2!1sen!2sus",
  map_lat: 17.226191,
  map_lng: 80.1508772,
  map_zoom: 17,
  map_iframe_html: `<iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3810.8473933755513!2d80.1483022750431!3d17.226190983633707!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3a34570005d5615d%3A0xd0226a5003a51501!2sSri%20Madhuri%27s%20Makeovers%20%26%20Beauty%20Saloon!5e0!3m2!1sen!2sus!4v1788524908759!5m2!1sen!2sus" width="600" height="450" style="border:0;" allowfullscreen="" loading="lazy" referrerpolicy="strict-origin-when-cross-origin"></iframe>`
};

export const initialServices = [
  {
    id: 's-1',
    name: 'Bridal HD Airbrush Makeup',
    description: 'Signature 4K high-definition bridal makeup with custom hair design, saree draping, and jewelry setting.',
    price: '₹15,000',
    duration: '180 mins',
    category: 'Bridal',
    badge: 'Most Popular',
    image_url: '/banner.jpeg',
    is_active: true,
    display_order: 1
  },
  {
    id: 's-2',
    name: 'Engagement & Reception Makeup',
    description: 'Radiant evening party makeover customized to match your reception attire and jewelry palette.',
    price: '₹8,500',
    duration: '120 mins',
    category: 'Bridal',
    badge: 'Bestseller',
    image_url: '/WhatsApp Image 2026-07-18 at 9.24.10 PM.jpeg',
    is_active: true,
    display_order: 2
  },
  {
    id: 's-3',
    name: 'Party & Sangeet Glow Makeup',
    description: 'Dewy luminous finish with elegant waves or braids and saree or lehenga styling.',
    price: '₹3,500',
    duration: '90 mins',
    category: 'Makeup',
    badge: '',
    image_url: '/image_search_1784394112206.jpg.jpeg',
    is_active: true,
    display_order: 3
  },
  {
    id: 's-4',
    name: 'Luxury Hair Spa & Keratin Therapy',
    description: 'Intense keratin protein infusion restoring silky smoothness, deep shine, and frizz control.',
    price: '₹2,999',
    duration: '90 mins',
    category: 'Hair',
    badge: 'Trending',
    image_url: '/image_search_1784394131419.jpg.jpeg',
    is_active: true,
    display_order: 4
  },
  {
    id: 's-5',
    name: 'Global Hair Color & Balayage Highlights',
    description: 'Rich multidimensional hues crafted with ammonia-free Italian pigments for healthy glossy hair.',
    price: '₹4,500',
    duration: '150 mins',
    category: 'Hair',
    badge: '',
    image_url: '/image_search_1784394131419.jpg.jpeg',
    is_active: true,
    display_order: 5
  },
  {
    id: 's-6',
    name: '24K Gold Hydra Glow Facial',
    description: 'Ultrasonic cleansing, galvanic hydration, and pure gold infusion for glass skin radiance.',
    price: '₹2,499',
    duration: '75 mins',
    category: 'Skincare',
    badge: 'Signature',
    image_url: '/image_search_1784394166482.jpg.jpeg',
    is_active: true,
    display_order: 6
  },
  {
    id: 's-7',
    name: 'Bridal Nail Art & Gel Extensions',
    description: 'Artistic ombre and crystal embellishments sculpted with long-lasting gel extensions.',
    price: '₹1,800',
    duration: '60 mins',
    category: 'Nails',
    badge: '',
    image_url: '/image_search_1784394172084.jpg.jpeg',
    is_active: true,
    display_order: 7
  },
  {
    id: 's-8',
    name: 'Royal Pre-Bridal Glow Ritual',
    description: 'Comprehensive head-to-toe body polish, brightening facial, hair spa, and mani-pedi spa.',
    price: '₹7,999',
    duration: '210 mins',
    category: 'Packages',
    badge: 'All-in-One',
    image_url: '/banner.jpeg',
    is_active: true,
    display_order: 8
  }
];

export const initialOffers = [
  {
    id: 'o-1',
    title: 'Complete Royal Wedding Package',
    description: 'Includes HD Bridal Makeup, Reception Look, Pre-Bridal Facial, and Designer Saree Draping.',
    original_price: '₹25,000',
    offer_price: '₹18,999',
    discount: '25% OFF',
    badge: 'Wedding Season Deal',
    end_date: '2026-10-30',
    is_active: true
  },
  {
    id: 'o-2',
    title: 'Hair Botox & Hydra Facial Duo',
    description: 'Revitalize dull hair and tired skin with this rejuvenating luxury weekend makeover combo.',
    original_price: '₹6,000',
    offer_price: '₹3,999',
    discount: '33% OFF',
    badge: 'Limited Slots',
    end_date: '2026-09-30',
    is_active: true
  }
];

export const initialBookings = [
  {
    id: 'b-101',
    name: 'Sravani V.',
    phone: '9876543210',
    email: 'sravani@gmail.com',
    service: 'Bridal HD Airbrush Makeup',
    date: '2026-09-12',
    time: '10:00 AM',
    amount: 15000,
    status: 'confirmed',
    source: 'website',
    message: 'Looking for saree draping style options too.',
    created_at: new Date().toISOString()
  },
  {
    id: 'b-102',
    name: 'Divya Sri',
    phone: '8765432109',
    email: 'divya@example.com',
    service: 'Luxury Hair Spa & Keratin Therapy',
    date: '2026-09-08',
    time: '02:30 PM',
    amount: 2999,
    status: 'pending',
    source: 'whatsapp',
    message: 'Please confirm afternoon slot.',
    created_at: new Date().toISOString()
  },
  {
    id: 'b-103',
    name: 'Harika R.',
    phone: '9123456780',
    email: 'harika@gmail.com',
    service: '24K Gold Hydra Glow Facial',
    date: '2026-09-02',
    time: '11:00 AM',
    amount: 2499,
    status: 'completed',
    source: 'manual',
    message: 'Walk-in booking.',
    created_at: new Date(Date.now() - 86400000 * 2).toISOString()
  }
];

export const initialGallery = [
  { id: 'g-1', title: 'Royal Bridal Makeover', category: 'Bridal', image_url: '/banner.jpeg' },
  { id: 'g-2', title: 'Luxury Studio Lounge', category: 'Salon', image_url: '/WhatsApp Image 2026-07-18 at 9.24.10 PM.jpeg' },
  { id: 'g-3', title: 'Dewy HD Bridal Glow', category: 'Bridal', image_url: '/image_search_1784394112206.jpg.jpeg' },
  { id: 'g-4', title: 'Balayage Hair Design', category: 'Hair', image_url: '/image_search_1784394131419.jpg.jpeg' },
  { id: 'g-5', title: 'Hydra Glow Skin Ritual', category: 'Skincare', image_url: '/image_search_1784394166482.jpg.jpeg' },
  { id: 'g-6', title: 'Embellished Nail Extensions', category: 'Nails', image_url: '/image_search_1784394172084.jpg.jpeg' }
];

export const initialTestimonials = [
  {
    id: 't-1',
    name: 'Kavitha Reddy',
    role: 'Bride',
    rating: 5,
    text: 'Sri Madhuri did my bridal makeup for both my wedding and reception. The makeup stayed flawless all night and looked completely natural in 4K photography!'
  },
  {
    id: 't-2',
    name: 'Pooja Rao',
    role: 'Bridal Client',
    rating: 5,
    text: 'Best beauty salon in Khammam! The hygiene, gentle care, and professional staff made my pre-wedding glow treatments so relaxing.'
  },
  {
    id: 't-3',
    name: 'Swathi Teja',
    role: 'Regular Client',
    rating: 5,
    text: 'Got a Keratin treatment and Hydra facial here. My hair has never looked so glossy. Highly recommend to everyone in Khammam!'
  }
];

export const initialTeam = [
  {
    id: 'tm-1',
    name: 'Sri Madhuri',
    role: 'Founder & Master Stylist',
    experience: '6+ Years Experience',
    skills: ['Bridal Makeup', 'HD Airbrush', 'Saree Draping'],
    image_url: '/WhatsApp Image 2026-07-18 at 9.24.10 PM.jpeg'
  },
  {
    id: 'tm-2',
    name: 'Lakshmi Priya',
    role: 'Senior Hair Specialist',
    experience: '4+ Years Experience',
    skills: ['Keratin Treatment', 'Hair Botox', 'Creative Color'],
    image_url: '/image_search_1784394131419.jpg.jpeg'
  },
  {
    id: 'tm-3',
    name: 'Deepika K.',
    role: 'Skin & Aesthetician',
    experience: '5+ Years Experience',
    skills: ['Hydra Facials', 'Skin Brightening', 'Body Polishing'],
    image_url: '/image_search_1784394187949.jpg.jpeg'
  }
];

export const initialCategories = [
  { id: 'cat-1', name: 'Bridal', description: 'Royal Bridal & Wedding Transformations' },
  { id: 'cat-2', name: 'Makeup', description: 'Party & Festive Makeovers' },
  { id: 'cat-3', name: 'Hair', description: 'Spas, Coloring & Botox Treatments' },
  { id: 'cat-4', name: 'Skincare', description: 'Facials, Hydration & Peels' },
  { id: 'cat-5', name: 'Nails', description: 'Artistic Gel & Acrylic Sculpting' },
  { id: 'cat-6', name: 'Packages', description: 'All-inclusive Beauty Rituals' }
];
