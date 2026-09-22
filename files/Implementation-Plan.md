# Implementation Plan (Static Website + Supabase + Vendor Admin)
## Sri Madhuri Makeovers — Luxury Salon Platform

---

## 1. Architecture & Tech Stack

| Layer | Technology | Purpose & Advantages |
|---|---|---|
| **Public Website** | **Static Website (HTML5, CSS3, Modern JavaScript)** | Ultra-fast loading (<1s), mobile-first responsive, 100% SEO-friendly, zero server overhead, can be hosted on GitHub Pages, Vercel, Netlify, or Apache/Nginx. |
| **Styling & Assets** | **Custom Luxury CSS / Vanilla CSS** + Google Fonts (Playfair Display / Inter) + FontAwesome | High-end luxury gold & dark slate aesthetic, smooth micro-interactions, lightbox gallery, booking modal. |
| **Database** | **Supabase (PostgreSQL)** | Managed relational DB with real-time capabilities, Row Level Security (RLS), instant REST API, and built-in SQL query power. |
| **Storage** | **Supabase Storage** | Cloud bucket for gallery images, salon banners, staff avatars, and service pictures. |
| **Admin Panel** | **Protected Admin Portal** (Lightweight SPA / Node.js Admin or Direct Supabase Dashboard) | Full CRUD access to all records: bookings, income, services, gallery, offers, testimonials, team, and settings. |
| **Auth** | **Supabase Auth / Secure Session Auth** | Vendor login with encrypted credentials, session tokens, and role-based access. |
| **WhatsApp Integration** | `https://wa.me/<number>?text=<message>` | Zero-cost instant booking deep-link with pre-filled details per service and booking form. |
| **Notifications** | **Email (Nodemailer / Resend) & WhatsApp** | Automated confirmation alerts upon booking status updates. |

---

## 2. System Architecture

```
                    ┌─────────────────────────────────────────┐
                    │      Public Static Website              │
                    │  index.html, styles.css, script.js      │
                    │  - Hero, Services, Gallery, Offers      │
                    │  - Floating WhatsApp CTA (wa.me)        │
                    │  - On-site Booking Form                 │
                    └───────────────────┬─────────────────────┘
                                        │
                 Direct REST / Supabase Client (Anon Key)
                                        │
                                        ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                           SUPABASE PLATFORM                             │
│                                                                         │
│  ┌─────────────────────────┐       ┌─────────────────────────────────┐  │
│  │   PostgreSQL Database   │       │        Supabase Storage         │  │
│  │  - bookings             │       │  - salon-gallery                │  │
│  │  - services             │       │  - service-images               │  │
│  │  - store_info           │       │  - team-photos                  │  │
│  │  - offers               │       └─────────────────────────────────┘  │
│  │  - testimonials         │                                            │
│  │  - team                 │       ┌─────────────────────────────────┐  │
│  │  - admin_users          │       │        Supabase Auth            │  │
│  └─────────────────────────┘       │  - Admin credentials & session  │  │
│                                    └─────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────────────┘
                                        ▲
                                        │ Full Access (Service Role / Auth)
                                        │
                    ┌───────────────────┴─────────────────────┐
                    │          Vendor Admin Panel             │
                    │  - Dashboard & Income Analytics         │
                    │  - Complete Bookings & Status Control   │
                    │  - Manual Walk-in Booking Entry         │
                    │  - Services & Pricing Management        │
                    │  - Gallery, Offers, Team & Testimonials │
                    │  - Store Settings & Contact Info        │
                    └─────────────────────────────────────────┘
```

---

## 3. Supabase Database Schema (PostgreSQL)

```sql
-- 1. Store Information (Singleton)
CREATE TABLE store_info (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL DEFAULT 'Sri Madhuri Makeovers',
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
    about_text TEXT,
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Services & Pricing
CREATE TABLE services (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    price VARCHAR(50) NOT NULL,
    duration VARCHAR(50),
    category VARCHAR(100) DEFAULT 'General',
    image_url TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    display_order INT DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Bookings / Appointments (All Records Accessible to Admin)
CREATE TABLE bookings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
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

-- 4. Gallery
CREATE TABLE gallery (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    image_url TEXT NOT NULL,
    category VARCHAR(100) DEFAULT 'General',
    title VARCHAR(255),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Special Offers & Promotions
CREATE TABLE offers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(255) NOT NULL,
    description TEXT,
    original_price VARCHAR(50),
    offer_price VARCHAR(50),
    discount VARCHAR(50),
    badge VARCHAR(50),
    end_date DATE,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. Testimonials
CREATE TABLE testimonials (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    role VARCHAR(100) DEFAULT 'Happy Client',
    rating INT DEFAULT 5 CHECK (rating >= 1 AND rating <= 5),
    text TEXT NOT NULL,
    image_url TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. Team Members
CREATE TABLE team (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    role VARCHAR(100) NOT NULL,
    experience VARCHAR(50),
    skills TEXT[],
    image_url TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8. Admin Users
CREATE TABLE admin_users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    username VARCHAR(100) UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    email VARCHAR(255),
    phone VARCHAR(50),
    role VARCHAR(50) DEFAULT 'owner',
    created_at TIMESTAMPTZ DEFAULT NOW()
);
```

---

## 4. Admin Panel Capabilities (Full Record Accessibility)

Every table and record in Supabase is completely visible and manageable by the admin:

1. **Dashboard Snapshot**:
   - Total Bookings, Today's Appointments, Pending Approvals, Total Earned Income.
   - Live stream of recent appointments.
2. **Bookings Central**:
   - Filter by status (`pending`, `confirmed`, `completed`, `cancelled`), date, or service.
   - One-click status change with instant trigger for client WhatsApp/Email notification.
   - Manual booking entry form (for walk-in and phone appointments).
3. **Income & Revenue Tracker**:
   - Calculated automatically from all bookings marked `completed`.
   - Date-range filtering (Today, This Week, This Month, Custom).
   - Export bookings and income summary as CSV.
4. **Services & Pricing CRUD**:
   - Add new service, update pricing/durations, toggle visibility on the public site, or delete.
5. **Gallery Manager**:
   - Upload new transformation photos directly to Supabase Storage bucket.
   - Filter by category (Bridal, Hair, Skincare, Nail Art, Styling).
6. **Offers & Deals**:
   - Create limited-time discounts with countdown timers and promotional badges.
7. **Testimonials & Reviews**:
   - Add, edit, or remove customer feedback.
8. **Store Settings**:
   - Dynamically update working hours, contact numbers, address, and social links without changing code.

---

## 5. WhatsApp Integration

- **Floating WhatsApp FAB**: Always accessible on mobile & desktop (`wa.me/918985291053`).
- **Context-aware CTA**:
  - Service card click pre-fills: *"Hi Sri Madhuri Makeovers! I'd like to book [Service Name] (₹[Price])."*
  - Form submission can simultaneously save to Supabase (`status: pending`) and redirect to WhatsApp with pre-filled booking details.

---

## 6. Implementation Milestones

| Phase | Description | Deliverables |
|---|---|---|
| **Phase 1: Database Setup** | Provision Supabase project, execute SQL schema, setup storage buckets | Tables created, initial seeds for services & settings |
| **Phase 2: Static Website** | Modern, responsive static site with dynamic Supabase client integration | `index.html`, `styles.css`, `script.js` connected to Supabase |
| **Phase 3: Admin Portal** | Secured Admin Panel with full records access | Authentication, Bookings manager, Income tracker, Content CRUD |
| **Phase 4: WhatsApp & Alerts** | Seamless WhatsApp booking redirects & email alerts | wa.me links, status notifications |
| **Phase 5: Testing & Deploy** | Cross-device QA, speed optimization, Supabase RLS security audit | Production deployment |
