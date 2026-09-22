# Product Requirements Document (PRD)
## Parlor Website with Vendor Admin Panel

**Version:** 1.0
**Status:** Draft
**Owner:** Product Owner

---

## 1. Overview

A two-sided web platform for a beauty parlor business:

1. **Public Website (Customer-Facing)** — A static-style informational page showing store details, services, gallery, and contact info, with a prominent **WhatsApp "Book Now / Contact"** button as the primary conversion action.
2. **Admin Panel (Vendor-Facing)** — A password-protected dashboard where the parlor owner/vendor can view bookings/orders, track income, and manage booking status.

## 2. Goals & Objectives

- Give the parlor a professional online presence without needing a complex e-commerce checkout.
- Let customers reach the vendor instantly via WhatsApp (low friction, high conversion for local service businesses).
- Give the vendor a simple back-office to track bookings and revenue without spreadsheets.
- Keep the public site fast, SEO-friendly, and cheap to host.

## 3. Non-Goals

- No online payment gateway integration in v1 (can be a fast-follow).
- No multi-vendor/marketplace support — single parlor/tenant only.
- No native mobile app.
- No real-time chat inside the website (WhatsApp handles conversation).

## 4. Target Users

| User | Description |
|---|---|
| **Customer** | Visits the site to learn about services, pricing, timings, location, and to contact/book via WhatsApp. |
| **Vendor (Parlor Owner/Staff)** | Logs into the admin panel to view incoming bookings, mark status (confirmed/completed/cancelled), and see income reports. |
| **(Optional) Admin/Superuser** | Manages services, pricing, and site content (could be same as Vendor in v1). |

## 5. Features

### 5.1 Public Website (Customer Side)

| Feature | Description | Priority |
|---|---|---|
| Home/Landing page | Hero banner, tagline, CTA to WhatsApp | P0 |
| Store Info | Address, map embed, opening hours | P0 |
| Services & Pricing | List of services (e.g., haircut, facial, bridal makeup) with price/duration | P0 |
| Gallery | Photos of salon/work samples | P1 |
| About Us | Short business description, staff intro | P1 |
| Contact Section | Phone, email, address, social links | P0 |
| **WhatsApp Button** | Floating/fixed button + inline CTA buttons that open `wa.me` deep link with a prefilled message | P0 |
| Simple Booking Form (optional) | Lightweight form (name, service, preferred date/time) that either (a) submits directly into admin panel as a "pending" order, or (b) opens WhatsApp with prefilled details | P1 |
| Testimonials/Reviews | Customer feedback section | P2 |
| SEO basics | Meta tags, Open Graph, sitemap, structured data (LocalBusiness schema) | P1 |
| Responsive design | Mobile-first, since most local customers browse on phone | P0 |

### 5.2 Admin Panel (Vendor Side)

| Feature | Description | Priority |
|---|---|---|
| Secure Login | Email/password (or phone OTP) auth for vendor | P0 |
| Dashboard Overview | Today's bookings, weekly/monthly income summary, quick stats | P0 |
| Orders/Bookings List | Table of all bookings — customer name, service, date/time, status, amount | P0 |
| Booking Status Management | Update status: Pending → Confirmed → Completed / Cancelled | P0 |
| Income Tracking | Auto-calculated income from completed bookings; filter by day/week/month/custom range | P0 |
| Manual Order Entry | Vendor can add a walk-in/phone booking manually | P1 |
| Service & Price Management | Add/edit/delete services shown on public site | P1 |
| Export Reports | Export income/orders as CSV/PDF | P2 |
| Notifications | Email/SMS/WhatsApp notification to vendor on new booking | P2 |
| Customer History | View repeat customers and their past bookings | P2 |
| Multi-staff support | Add staff logins with limited permissions | P3 |

## 6. User Flows

### 6.1 Customer Flow
1. Customer lands on homepage → browses services/gallery → clicks **"Book via WhatsApp"** button.
2. WhatsApp opens (web/app) with a prefilled message (e.g., *"Hi, I'd like to book [Service] at [Parlor Name]"*).
3. (Optional) Customer instead fills the on-site booking form → order created with status `Pending` → vendor sees it in admin panel and/or gets notified.

### 6.2 Vendor Flow
1. Vendor logs into `/admin`.
2. Views dashboard: today's bookings + income snapshot.
3. Opens Orders tab → reviews new booking → marks as Confirmed.
4. After service delivery → marks as Completed → income auto-updates.
5. Views Income tab → filters by date range → exports report if needed.

## 7. Data Model (High-Level)

- **Service**: id, name, description, price, duration, image, category
- **Booking/Order**: id, customer_name, phone, service_id, date, time_slot, status, amount, source (site-form/manual/whatsapp), created_at
- **Vendor/User**: id, name, email, phone, role, password_hash
- **StoreInfo**: name, address, coordinates, hours, phone, whatsapp_number, social_links, about_text

## 8. Success Metrics

- % of visitors clicking the WhatsApp button (conversion rate)
- Number of bookings captured per week
- Vendor login frequency / active usage
- Page load speed (<2s on mobile)
- Reduction in vendor's manual bookkeeping time

## 9. Constraints & Assumptions

- Single parlor, single location (v1).
- Vendor has a WhatsApp Business number.
- No online payments in v1 — payment is collected in-person/offline; income is logged manually or upon marking "Completed".
- Hosting budget is low/moderate (prefer low-cost or free-tier infra).

## 10. Future Enhancements (Post-v1)

- Online payment/advance booking deposit
- SMS/WhatsApp automated reminders
- Multi-branch/multi-vendor support
- Staff-wise scheduling calendar
- Customer loyalty program
