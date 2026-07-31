require('dotenv').config();
const express = require('express');
const session = require('express-session');
const path = require('path');
const cors = require('cors');
const db = require('./db/database');

const app = express();
const PORT = process.env.PORT || 8080;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Session Setup
app.use(session({
    secret: process.env.SESSION_SECRET || 'fallback-secret',
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: process.env.NODE_ENV === 'production',
        maxAge: 1000 * 60 * 60 * 24 // 24 hours
    }
}));

// View Engine (EJS for Admin)
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Routes
const apiRoutes     = require('./routes/api');
const bookingRoutes = require('./routes/booking');
const adminRoutes   = require('./routes/admin');

app.use('/api/config',   apiRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/admin',        adminRoutes);

// EJS frontend
app.get('/', async (req, res) => {
    try {
        const config       = await db.getSettings();
        const services     = (await db.get('services')).filter(s => s.active);
        const gallery      = await db.get('gallery');
        const testimonials = await db.get('testimonials');
        const team         = await db.get('team');
        const offers       = (await db.get('offers')).filter(o => o.active);

        res.render('index', { config, services, gallery, testimonials, team, offers });
    } catch (err) {
        console.error('Error rendering index:', err);
        res.status(500).send('Server error');
    }
});

// ── Start Server ───────────────────────────────────────────────────────────────
async function startServer() {
    try {
        await db.connect();
        await db.initDB();

        app.listen(PORT, () => {
            console.log(`\n✨ Sri Madhuri Makeovers running on http://localhost:${PORT}`);
            console.log(`🔒 Admin Panel: http://localhost:${PORT}/admin\n`);
        });
    } catch (err) {
        console.error('❌ Failed to start server:', err.message);
        process.exit(1);
    }
}

startServer();
