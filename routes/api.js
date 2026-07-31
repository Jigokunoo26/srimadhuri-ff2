const express = require('express');
const router = express.Router();
const db = require('../db/database');

// GET /api/config
router.get('/config', async (req, res) => {
    try {
        const settings     = await db.getSettings();
        const services     = (await db.get('services')).filter(s => s.active);
        const gallery      = await db.get('gallery');
        const testimonials = await db.get('testimonials');
        const offers       = (await db.get('offers')).filter(o => o.active);
        const team         = await db.get('team');
        const membership   = await db.get('membership');

        res.json({
            settings,
            services,
            gallery,
            testimonials,
            offers,
            team,
            membership
        });
    } catch (err) {
        console.error('Error fetching config:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

module.exports = router;
