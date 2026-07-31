/**
 * db/seed.js
 * One-time script: imports existing data.json into MongoDB Atlas.
 * Run with: node db/seed.js
 */

require('dotenv').config({ path: require('path').join(__dirname, '../.env') });
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const fs = require('fs');
const path = require('path');

const MONGO_URI = process.env.MONGODB_URI;
if (!MONGO_URI || MONGO_URI.includes('<username>')) {
    console.error('❌ MONGODB_URI is not set correctly in .env — please add it first.');
    process.exit(1);
}

// ── Load data.json if it exists ───────────────────────────────────────────────
const dataPath = path.join(__dirname, 'data.json');
let jsonData = null;
if (fs.existsSync(dataPath)) {
    jsonData = JSON.parse(fs.readFileSync(dataPath, 'utf8'));
    console.log('📂 Found data.json — will import existing data.');
} else {
    console.log('ℹ️  No data.json found — will seed defaults only.');
}

// ── Schemas (minimal, for seeding) ───────────────────────────────────────────
const AdminUser   = mongoose.model('AdminUser',   new mongoose.Schema({ username: String, password_hash: String, email: String, phone: String }));
const Settings    = mongoose.model('Settings',    new mongoose.Schema({ _singleton: String, phone: String, phoneClean: String, email: String, address: String, hours_weekday: String, hours_saturday: String, hours_sunday: String, social_instagram: String, social_youtube: String, social_facebook: String, google_review: String }));
const Service     = mongoose.model('Service',     new mongoose.Schema({ name: String, price: String, duration: String, active: Boolean }));
const Gallery     = mongoose.model('Gallery',     new mongoose.Schema({ image: String, category: String }));
const Testimonial = mongoose.model('Testimonial', new mongoose.Schema({ name: String, role: String, rating: Number, text: String, image: String }));
const Offer       = mongoose.model('Offer',       new mongoose.Schema({ title: String, description: String, originalPrice: String, offerPrice: String, discount: String, badge: String, endDate: String, active: Boolean }));
const Team        = mongoose.model('Team',        new mongoose.Schema({ name: String, role: String, experience: String, image: String }));
const Membership  = mongoose.model('Membership',  new mongoose.Schema({ name: String, price: String, perks: [String] }));
const Booking     = mongoose.model('Booking',     new mongoose.Schema({ name: String, phone: String, email: String, service: String, date: String, time: String, message: String, status: String, created_at: Date }));

async function seed() {
    console.log('\n🌱 Starting MongoDB seed...\n');
    await mongoose.connect(MONGO_URI);
    console.log('✅ Connected to MongoDB Atlas\n');

    // ── Admin Users ──────────────────────────────────────────────────────────
    const adminCount = await AdminUser.countDocuments();
    if (adminCount === 0) {
        let adminData;
        if (jsonData && jsonData.admin_users && jsonData.admin_users.length > 0) {
            // Import existing admins from data.json (password_hash already bcrypted)
            adminData = jsonData.admin_users.map(u => ({
                username:      u.username,
                password_hash: u.password_hash,
                email:         u.email || '',
                phone:         u.phone || ''
            }));
        } else {
            // Seed default admin
            const hash = bcrypt.hashSync(process.env.ADMIN_PASSWORD || 'srimadhuri2026', 12);
            adminData = [{
                username:      process.env.ADMIN_USERNAME || 'admin',
                password_hash: hash,
                email:         process.env.NOTIFICATION_EMAIL || 'hello@srimadhurimakeovers.com',
                phone:         '8985291053'
            }];
        }
        await AdminUser.insertMany(adminData);
        console.log(`👤 Seeded ${adminData.length} admin user(s)`);
    } else {
        console.log('👤 Admin users already exist — skipping');
    }

    // ── Settings ─────────────────────────────────────────────────────────────
    const settingsCount = await Settings.countDocuments();
    if (settingsCount === 0) {
        const src = (jsonData && jsonData.settings) || {
            phone:            '+91 89852 91053',
            phoneClean:       '918985291053',
            email:            'hello@srimadhurimakeovers.com',
            address:          'Mustafa Nagar, Opposite Chakri School, Khammam, Telangana',
            hours_weekday:    '10:00 AM - 9:00 PM',
            hours_saturday:   '10:00 AM - 9:00 PM',
            hours_sunday:     'By Appointment Only',
            social_instagram: 'https://www.instagram.com/sri__madhuri_makevoers',
            social_youtube:   'https://youtube.com/@srimadhurimakeovers',
            social_facebook:  '',
            google_review:    'https://share.google/jHJd45mOnxxzCnGhn'
        };
        await Settings.create({ _singleton: 'main', ...src });
        console.log('⚙️  Seeded settings');
    } else {
        console.log('⚙️  Settings already exist — skipping');
    }

    // ── Collections ──────────────────────────────────────────────────────────
    const collections = [
        { name: 'services',     Model: Service,     key: 'services' },
        { name: 'gallery',      Model: Gallery,     key: 'gallery' },
        { name: 'testimonials', Model: Testimonial, key: 'testimonials' },
        { name: 'offers',       Model: Offer,       key: 'offers' },
        { name: 'team',         Model: Team,        key: 'team' },
        { name: 'membership',   Model: Membership,  key: 'membership' },
        { name: 'bookings',     Model: Booking,     key: 'bookings' }
    ];

    for (const col of collections) {
        const count = await col.Model.countDocuments();
        if (count === 0 && jsonData && jsonData[col.key] && jsonData[col.key].length > 0) {
            const items = jsonData[col.key].map(item => {
                const { id, ...rest } = item; // remove old numeric id
                if (col.key === 'bookings' && rest.created_at) {
                    rest.created_at = new Date(rest.created_at);
                }
                return rest;
            });
            await col.Model.insertMany(items);
            console.log(`📦 Seeded ${items.length} ${col.name}`);
        } else if (count > 0) {
            console.log(`📦 ${col.name} already exist — skipping`);
        } else {
            console.log(`📦 No ${col.name} in data.json — skipping`);
        }
    }

    console.log('\n✅ Seed complete! Your MongoDB Atlas database is ready.\n');
    await mongoose.disconnect();
    process.exit(0);
}

seed().catch(err => {
    console.error('❌ Seed failed:', err.message);
    process.exit(1);
});
