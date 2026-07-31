require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// ─── CONNECTION ──────────────────────────────────────────────────────────────

let isConnected = false;

async function connect() {
    if (isConnected) return;
    const uri = process.env.MONGODB_URI;
    if (!uri || uri.includes('<username>')) {
        throw new Error('MONGODB_URI is not set correctly in .env file');
    }
    await mongoose.connect(uri);
    isConnected = true;
    console.log('✅ Connected to MongoDB Atlas');
}

// ─── SCHEMAS ─────────────────────────────────────────────────────────────────

const AdminUserSchema = new mongoose.Schema({
    username:      { type: String, required: true, unique: true },
    password_hash: { type: String, required: true },
    email:         { type: String, default: '' },
    phone:         { type: String, default: '' }
});

const SettingsSchema = new mongoose.Schema({
    _singleton:       { type: String, default: 'main', unique: true },
    phone:            { type: String, default: '' },
    phoneClean:       { type: String, default: '' },
    email:            { type: String, default: '' },
    address:          { type: String, default: '' },
    hours_weekday:    { type: String, default: '' },
    hours_saturday:   { type: String, default: '' },
    hours_sunday:     { type: String, default: '' },
    social_instagram: { type: String, default: '' },
    social_youtube:   { type: String, default: '' },
    social_facebook:  { type: String, default: '' },
    google_review:    { type: String, default: '' }
});

const ServiceSchema = new mongoose.Schema({
    name:     { type: String, required: true },
    price:    { type: String, default: '' },
    duration: { type: String, default: '' },
    active:   { type: Boolean, default: true }
});

const GallerySchema = new mongoose.Schema({
    image:    { type: String, required: true },
    category: { type: String, default: 'General' }
});

const TestimonialSchema = new mongoose.Schema({
    name:   { type: String, required: true },
    role:   { type: String, default: '' },
    rating: { type: Number, default: 5 },
    text:   { type: String, default: '' },
    image:  { type: String, default: '' }
});

const OfferSchema = new mongoose.Schema({
    title:         { type: String, required: true },
    description:   { type: String, default: '' },
    originalPrice: { type: String, default: '' },
    offerPrice:    { type: String, default: '' },
    discount:      { type: String, default: '' },
    badge:         { type: String, default: '' },
    endDate:       { type: String, default: '' },
    active:        { type: Boolean, default: true }
});

const TeamSchema = new mongoose.Schema({
    name:       { type: String, required: true },
    role:       { type: String, default: '' },
    experience: { type: String, default: '' },
    image:      { type: String, default: '' }
});

const MembershipSchema = new mongoose.Schema({
    name:  { type: String, required: true },
    price: { type: String, default: '' },
    perks: { type: [String], default: [] }
});

const BookingSchema = new mongoose.Schema({
    name:       { type: String, required: true },
    phone:      { type: String, required: true },
    email:      { type: String, default: '' },
    service:    { type: String, required: true },
    date:       { type: String, default: '' },
    time:       { type: String, default: '' },
    message:    { type: String, default: '' },
    status:     { type: String, default: 'pending' },
    created_at: { type: Date, default: Date.now }
});

const OTPSchema = new mongoose.Schema({
    adminId:   { type: mongoose.Schema.Types.ObjectId, required: true, unique: true },
    otp:       { type: String, required: true },
    createdAt: { type: Number, default: Date.now },
    expiresAt: { type: Number, required: true },
    attempts:  { type: Number, default: 0 }
});

// ─── MODELS ──────────────────────────────────────────────────────────────────

const AdminUser   = mongoose.model('AdminUser',   AdminUserSchema);
const Settings    = mongoose.model('Settings',    SettingsSchema);
const Service     = mongoose.model('Service',     ServiceSchema);
const Gallery     = mongoose.model('Gallery',     GallerySchema);
const Testimonial = mongoose.model('Testimonial', TestimonialSchema);
const Offer       = mongoose.model('Offer',       OfferSchema);
const Team        = mongoose.model('Team',        TeamSchema);
const Membership  = mongoose.model('Membership',  MembershipSchema);
const Booking     = mongoose.model('Booking',     BookingSchema);
const OTP         = mongoose.model('OTP',         OTPSchema);

// ─── MODEL MAP ───────────────────────────────────────────────────────────────

const modelMap = {
    services:     Service,
    gallery:      Gallery,
    testimonials: Testimonial,
    offers:       Offer,
    team:         Team,
    membership:   Membership,
    bookings:     Booking
};

// ─── DEFAULT SETTINGS ────────────────────────────────────────────────────────

const defaultSettings = {
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

// ─── INIT (seed admin + settings if first run) ────────────────────────────────

async function initDB() {
    // Seed default settings if not present
    const existingSettings = await Settings.findOne({ _singleton: 'main' });
    if (!existingSettings) {
        await Settings.create({ _singleton: 'main', ...defaultSettings });
        console.log('⚙️  Default settings seeded in MongoDB.');
    }

    // Seed admin user if not present
    const existingAdmin = await AdminUser.findOne();
    if (!existingAdmin) {
        const adminUser = process.env.ADMIN_USERNAME || 'admin';
        const adminPass = process.env.ADMIN_PASSWORD || 'srimadhuri2026';
        const hash = bcrypt.hashSync(adminPass, 12);
        await AdminUser.create({
            username:      adminUser,
            password_hash: hash,
            email:         process.env.NOTIFICATION_EMAIL || 'hello@srimadhurimakeovers.com',
            phone:         '8985291053'
        });
        console.log('👤 Default admin user seeded in MongoDB.');
    }
}

// ─── DB API ──────────────────────────────────────────────────────────────────

const db = {
    connect,
    initDB,

    // ── Generic CRUD ──────────────────────────────────────────────────────────

    get: async (table) => {
        const Model = modelMap[table];
        if (!Model) return [];
        const docs = await Model.find().lean();
        return docs.map(d => ({ ...d, id: d._id.toString() }));
    },

    getById: async (table, id) => {
        const Model = modelMap[table];
        if (!Model) return null;
        try {
            const doc = await Model.findById(id).lean();
            if (!doc) return null;
            return { ...doc, id: doc._id.toString() };
        } catch {
            return null;
        }
    },

    insert: async (table, item) => {
        const Model = modelMap[table];
        if (!Model) return null;
        const doc = await Model.create(item);
        return doc._id.toString();
    },

    update: async (table, id, updates) => {
        const Model = modelMap[table];
        if (!Model) return false;
        try {
            const result = await Model.findByIdAndUpdate(id, updates, { new: true });
            return !!result;
        } catch {
            return false;
        }
    },

    delete: async (table, id) => {
        const Model = modelMap[table];
        if (!Model) return false;
        try {
            const result = await Model.findByIdAndDelete(id);
            return !!result;
        } catch {
            return false;
        }
    },

    // ── Settings ──────────────────────────────────────────────────────────────

    getSettings: async () => {
        const doc = await Settings.findOne({ _singleton: 'main' }).lean();
        return doc || defaultSettings;
    },

    updateSettings: async (newSettings) => {
        await Settings.findOneAndUpdate(
            { _singleton: 'main' },
            { $set: newSettings },
            { upsert: true, new: true }
        );
    },

    // ── Admin Users ───────────────────────────────────────────────────────────

    getByUsername: async (username) => {
        const doc = await AdminUser.findOne({ username }).lean();
        if (!doc) return null;
        return { ...doc, id: doc._id.toString() };
    },

    getAdminById: async (id) => {
        try {
            const doc = await AdminUser.findById(id).lean();
            if (!doc) return null;
            return { ...doc, id: doc._id.toString() };
        } catch {
            return null;
        }
    },

    updateAdminCredentials: async (adminId, { newUsername, newPassword }) => {
        try {
            const user = await AdminUser.findById(adminId);
            if (!user) return { success: false, error: 'Admin user not found' };

            if (newUsername && newUsername !== user.username) {
                const existing = await AdminUser.findOne({ username: newUsername });
                if (existing && existing._id.toString() !== adminId.toString()) {
                    return { success: false, error: 'Username already taken' };
                }
                user.username = newUsername;
            }

            if (newPassword) {
                user.password_hash = bcrypt.hashSync(newPassword, 12);
            }

            await user.save();
            return { success: true };
        } catch (err) {
            return { success: false, error: err.message };
        }
    },

    updateAdminProfile: async (adminId, { email, phone }) => {
        try {
            const update = {};
            if (email) update.email = email;
            if (phone !== undefined) update.phone = phone;
            await AdminUser.findByIdAndUpdate(adminId, update);
            return true;
        } catch {
            return false;
        }
    },

    findAdminByEmailOrPhone: async (value) => {
        const cleaned = value.trim().toLowerCase();
        const admins = await AdminUser.find().lean();
        const found = admins.find(u => {
            const emailMatch = u.email && u.email.toLowerCase() === cleaned;
            const phoneMatch = u.phone && u.phone.replace(/[^0-9]/g, '').includes(cleaned.replace(/[^0-9]/g, ''));
            return emailMatch || phoneMatch;
        });
        if (!found) return null;
        return { ...found, id: found._id.toString() };
    },

    // ── Bookings ──────────────────────────────────────────────────────────────

    insertBooking: async (bookingData) => {
        const doc = await Booking.create({
            ...bookingData,
            status:     'pending',
            created_at: new Date()
        });
        return doc._id.toString();
    },

    updateBookingStatus: async (id, status) => {
        try {
            await Booking.findByIdAndUpdate(id, { status });
            return true;
        } catch {
            return false;
        }
    },

    // ── OTP ───────────────────────────────────────────────────────────────────

    storeOTP: async (adminId, otp) => {
        await OTP.findOneAndUpdate(
            { adminId },
            {
                adminId,
                otp,
                createdAt: Date.now(),
                expiresAt: Date.now() + (5 * 60 * 1000),
                attempts:  0
            },
            { upsert: true, new: true }
        );
    },

    verifyOTP: async (adminId, otp) => {
        const record = await OTP.findOne({ adminId });
        if (!record) return { valid: false, error: 'No OTP found. Please request a new one.' };

        if (Date.now() > record.expiresAt) {
            await OTP.deleteOne({ adminId });
            return { valid: false, error: 'OTP has expired. Please request a new one.' };
        }
        if (record.attempts >= 5) {
            await OTP.deleteOne({ adminId });
            return { valid: false, error: 'Too many attempts. Please request a new OTP.' };
        }
        if (record.otp !== otp) {
            record.attempts += 1;
            await record.save();
            return { valid: false, error: `Incorrect OTP. ${5 - record.attempts} attempts remaining.` };
        }
        return { valid: true };
    },

    clearOTP: async (adminId) => {
        await OTP.deleteOne({ adminId });
    },

    resetAdminPassword: async (adminId, newPassword) => {
        try {
            const hash = bcrypt.hashSync(newPassword, 12);
            await AdminUser.findByIdAndUpdate(adminId, { password_hash: hash });
            return true;
        } catch {
            return false;
        }
    }
};

module.exports = db;
