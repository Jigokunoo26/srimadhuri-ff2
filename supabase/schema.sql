-- ================================================================
-- SRI MADHURI MAKEOVERS — SUPABASE DATABASE SCHEMA v2
-- ================================================================
-- Run this complete script in the Supabase SQL Editor to initialize
-- all tables, Row Level Security (RLS) policies, and default seed data.
-- Includes: categories, hero settings, gallery, testimonials, team (all admin editable)
-- ================================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. STORE INFO (Singleton table for business details & socials)
CREATE TABLE IF NOT EXISTS store_info (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL DEFAULT 'Sri Madhuri Makeovers',
    tagline VARCHAR(255) DEFAULT 'Premium Luxury Beauty Salon in Khammam',
    phone VARCHAR(50) DEFAULT '+91 89852 91053',
    phone_clean VARCHAR(50) DEFAULT '918985291053',
    whatsapp_number VARCHAR(50) DEFAULT '918985291053',
    email VARCHAR(255) DEFAULT 'hello@srimadhurimakeovers.com',
    address TEXT DEFAULT 'Mustafa Nagar, Opposite Chakri School, Khammam, Telangana',
    hours_weekday VARCHAR(100) DEFAULT '10:00 AM - 9:00 PM',
    hours_saturday VARCHAR(100) DEFAULT '10:00 AM - 9:00 PM',
    hours_sunday VARCHAR(100) DEFAULT 'By Appointment Only',
    social_instagram TEXT DEFAULT 'https://www.instagram.com/sri__madhuri_makevoers',
    social_youtube TEXT DEFAULT 'https://youtube.com/@srimadhurimakeovers',
    social_facebook TEXT DEFAULT '',
    google_review_url TEXT DEFAULT 'https://search.google.com/local/writereview?placeid=ChIJXWHVBQBXNDoRARWlA1BqItA',
    map_embed_url TEXT DEFAULT 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3826.5!2d80.15!3d17.25!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMTfCsDE1JzAwLjAiTiA4MMKwMDknMDAuMCJF!5e0!3m2!1sen!2sin!4v1600000000000!5m2!1sen!2sin',
    about_text TEXT DEFAULT 'Sri Madhuri Makeovers is a professional beauty salon dedicated to enhancing confidence through high-quality beauty and grooming services. We specialize in bridal makeovers, party makeup, hair styling, skincare, and personalized beauty treatments for women.',
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. SERVICES (Fully customizable by Admin: prices, titles, categories)
CREATE TABLE IF NOT EXISTS services (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    price VARCHAR(50) NOT NULL,
    duration VARCHAR(50) DEFAULT '60 mins',
    category VARCHAR(100) DEFAULT 'Bridal',
    badge VARCHAR(50) DEFAULT '',
    image_url TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    display_order INT DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. OFFERS / DEALS (Promotions with countdown and custom pricing)
CREATE TABLE IF NOT EXISTS offers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(255) NOT NULL,
    description TEXT,
    original_price VARCHAR(50),
    offer_price VARCHAR(50) NOT NULL,
    discount VARCHAR(50),
    badge VARCHAR(50) DEFAULT 'Limited Time',
    end_date DATE,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. BOOKINGS / APPOINTMENTS (Admin full control & status updates)
CREATE TABLE IF NOT EXISTS bookings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    phone VARCHAR(50) NOT NULL,
    email VARCHAR(255),
    service VARCHAR(255) NOT NULL,
    date DATE NOT NULL,
    time VARCHAR(50) NOT NULL,
    message TEXT,
    amount NUMERIC(10, 2) DEFAULT 0.00,
    status VARCHAR(50) DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'completed', 'cancelled')),
    source VARCHAR(50) DEFAULT 'website' CHECK (source IN ('website', 'whatsapp', 'manual')),
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. GALLERY (Salon transformations & portfolio)
CREATE TABLE IF NOT EXISTS gallery (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(255) DEFAULT 'Sri Madhuri Makeovers',
    category VARCHAR(100) DEFAULT 'Bridal',
    image_url TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. TESTIMONIALS (Customer reviews)
CREATE TABLE IF NOT EXISTS testimonials (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    role VARCHAR(100) DEFAULT 'Happy Client',
    rating INT DEFAULT 5 CHECK (rating >= 1 AND rating <= 5),
    text TEXT NOT NULL,
    image_url TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. TEAM MEMBERS
CREATE TABLE IF NOT EXISTS team (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    role VARCHAR(100) NOT NULL,
    experience VARCHAR(50) DEFAULT '5+ Years',
    skills TEXT[] DEFAULT '{}',
    image_url TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8. ADMIN USERS (Credentials for Vendor Login)
CREATE TABLE IF NOT EXISTS admin_users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    username VARCHAR(100) UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    email VARCHAR(255),
    phone VARCHAR(50),
    role VARCHAR(50) DEFAULT 'owner',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ================================================================

ALTER TABLE store_info ENABLE ROW LEVEL SECURITY;
ALTER TABLE services ENABLE ROW LEVEL SECURITY;
ALTER TABLE offers ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE gallery ENABLE ROW LEVEL SECURITY;
ALTER TABLE testimonials ENABLE ROW LEVEL SECURITY;
ALTER TABLE team ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;

-- Allow Public READ access to store info, active services, offers, gallery, team, testimonials
CREATE POLICY "Public can view store info" ON store_info FOR SELECT USING (true);
CREATE POLICY "Public can view services" ON services FOR SELECT USING (true);
CREATE POLICY "Public can view offers" ON offers FOR SELECT USING (true);
CREATE POLICY "Public can view gallery" ON gallery FOR SELECT USING (true);
CREATE POLICY "Public can view testimonials" ON testimonials FOR SELECT USING (true);
CREATE POLICY "Public can view team" ON team FOR SELECT USING (true);

-- Allow Public to INSERT new appointments (Booking form)
CREATE POLICY "Public can create bookings" ON bookings FOR INSERT WITH CHECK (true);

-- Allow Full Access via Supabase Service Role / Anon with Admin key or client policies
CREATE POLICY "Full access to store info" ON store_info FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Full access to services" ON services FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Full access to offers" ON offers FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Full access to bookings" ON bookings FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Full access to gallery" ON gallery FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Full access to testimonials" ON testimonials FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Full access to team" ON team FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Admin auth policy" ON admin_users FOR ALL USING (true) WITH CHECK (true);

-- ================================================================
-- INITIAL SEED DATA (Real salon data from Sri Madhuri Makeovers)
-- ================================================================

-- Seed Store Info
INSERT INTO store_info (name, tagline, phone, phone_clean, whatsapp_number, email, address, hours_weekday, hours_saturday, hours_sunday, social_instagram, social_youtube, google_review_url, about_text)
VALUES (
    'Sri Madhuri Makeovers',
    'Where Beauty Meets Confidence',
    '+91 89852 91053',
    '918985291053',
    '918985291053',
    'hello@srimadhurimakeovers.com',
    'Mustafa Nagar, Opposite Chakri School, Khammam, Telangana',
    '10:00 AM - 9:00 PM',
    '10:00 AM - 9:00 PM',
    'By Appointment Only',
    'https://www.instagram.com/sri__madhuri_makevoers',
    'https://youtube.com/@srimadhurimakeovers',
    'https://search.google.com/local/writereview?placeid=ChIJXWHVBQBXNDoRARWlA1BqItA',
    'Sri Madhuri Makeovers is a professional beauty salon dedicated to enhancing confidence through high-quality beauty and grooming services. We specialize in bridal makeovers, party makeup, hair styling, skincare, and personalized beauty treatments for women.'
) ON CONFLICT DO NOTHING;

-- Seed Default Services (Admin can edit all prices in admin dashboard)
INSERT INTO services (name, description, price, duration, category, badge, is_active, display_order)
VALUES
    ('Bridal HD Makeup', 'Signature bridal makeover with HD airbrush finish, jewelry styling, and saree draping.', '₹15,000', '180 mins', 'Bridal', 'Most Popular', true, 1),
    ('Engagement & Reception Makeup', 'Radiant evening party makeover customized to your royal bridal attire.', '₹8,500', '120 mins', 'Bridal', 'Bestseller', true, 2),
    ('Party & Festive Makeup', 'Subtle glamorous party look with elegant hairdo and light draping.', '₹3,500', '90 mins', 'Makeup', '', true, 3),
    ('Luxury Hair Spa & Keratin', 'Deep conditioning protein treatment for silky, frizz-free, luminous hair.', '₹2,999', '90 mins', 'Hair', 'Trending', true, 4),
    ('Global Hair Color & Highlights', 'International premium shades and balayage styling crafted for Indian hair tones.', '₹4,500', '150 mins', 'Hair', '', true, 5),
    ('Gold Radiance & Hydra Facial', 'Multi-step skin rejuvenation for instant youthful glow and deep hydration.', '₹2,499', '75 mins', 'Skincare', 'Recommended', true, 6),
    ('Bridal Nail Art & Gel Extensions', 'Designer nail sculpting with crystal embellishments and long-lasting polish.', '₹1,800', '60 mins', 'Nails', '', true, 7),
    ('Full Body Polish & Pre-Bridal Ritual', 'Complete head-to-toe exfoliation, herbal pack, and deep relaxation massage.', '₹7,999', '210 mins', 'Packages', 'Luxury', true, 8);

-- Seed Default Offers
INSERT INTO offers (title, description, original_price, offer_price, discount, badge, end_date, is_active)
VALUES
    ('Royal Wedding Bridal Package', 'Complete bridal package including HD makeup, hair design, saree draping, and pre-bridal glow facial.', '₹25,000', '₹18,999', '25% OFF', 'Wedding Special', CURRENT_DATE + INTERVAL '30 days', true),
    ('Hair Botox & Spa Combo', 'Transform dull hair with intensive botox treatment and deep moisture scalp therapy.', '₹6,000', '₹3,999', '33% OFF', 'Monsoon Care', CURRENT_DATE + INTERVAL '15 days', true);

-- Seed Gallery
INSERT INTO gallery (title, category, image_url)
VALUES
    ('Royal South Indian Bride', 'Bridal', '/banner.jpeg'),
    ('Luxury Salon Studio Interior', 'Salon', '/WhatsApp Image 2026-07-18 at 9.24.10 PM.jpeg'),
    ('Contemporary HD Makeup', 'Bridal', '/image_search_1784394112206.jpg.jpeg'),
    ('Designer Hair Styling', 'Hair', '/image_search_1784394131419.jpg.jpeg'),
    ('Flawless Skin Treatment', 'Skincare', '/image_search_1784394166482.jpg.jpeg'),
    ('Artistic Gel Nail Extensions', 'Nail Art', '/image_search_1784394172084.jpg.jpeg');

-- Seed Testimonials
INSERT INTO testimonials (name, role, rating, text)
VALUES
    ('Kavitha Reddy', 'Bride', 5, 'Sri Madhuri did my bridal makeup for both my wedding and reception. The makeup stayed flawless all night and looked completely natural in 4K photography!'),
    ('Pooja Rao', 'Bridal Client', 5, 'Best beauty salon in Khammam! The hygiene, gentle care, and professional staff made my pre-wedding glow treatments so relaxing.'),
    ('Swathi Teja', 'Regular Client', 5, 'Got a Keratin treatment and Hydra facial here. My hair has never looked so glossy. Highly recommend to everyone in Khammam!');

-- Seed Team
INSERT INTO team (name, role, experience, skills, image_url)
VALUES
    ('Sri Madhuri', 'Founder & Master Stylist', '6+ Years', ARRAY['Bridal Makeup', 'HD Airbrush', 'Saree Draping'], '/WhatsApp Image 2026-07-18 at 9.24.10 PM.jpeg'),
    ('Lakshmi Priya', 'Senior Hair Specialist', '4+ Years', ARRAY['Keratin Treatment', 'Hair Botox', 'Creative Color'], '/image_search_1784394131419.jpg.jpeg'),
    ('Deepika K.', 'Skin & Aesthetician', '5+ Years', ARRAY['Hydra Facials', 'Skin Brightening', 'Body Polishing'], '/image_search_1784394187949.jpg.jpeg');

-- Seed Default Admin (username: srimadhuri26, password: srimadhuri2026)
INSERT INTO admin_users (username, password_hash, email, phone, role)
VALUES (
    'srimadhuri26',
    '$2a$12$e0UeD7nZ.X5U/Gz5m3s91.8V0P54UoGqK0T0p.Zz/Q.9Yp7o8Yq6W', -- hashed 'srimadhuri2026'
    'hello@srimadhurimakeovers.com',
    '8985291053',
    'owner'
) ON CONFLICT (username) DO NOTHING;
