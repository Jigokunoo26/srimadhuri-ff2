const express = require('express');
const router = express.Router();
const db = require('../db/database');
const nodemailer = require('nodemailer');

// POST /api/bookings
router.post('/', async (req, res) => {
    try {
        const { name, phone, email, service, date, time, message } = req.body;

        if (!name || !phone || !service) {
            return res.status(400).json({ error: 'Name, phone, and service are required.' });
        }

        const newId = await db.insertBooking({ name, phone, email, service, date, time, message });

        // Optional: Send Email Notification to Admin if SMTP is configured
        if (process.env.SMTP_USER && process.env.SMTP_PASS && process.env.SMTP_USER !== 'hello@srimadhurimakeovers.com') {
            try {
                const transporter = nodemailer.createTransport({
                    host:   process.env.SMTP_HOST,
                    port:   process.env.SMTP_PORT,
                    secure: process.env.SMTP_PORT == 465,
                    auth: {
                        user: process.env.SMTP_USER,
                        pass: process.env.SMTP_PASS
                    }
                });

                const mailOptions = {
                    from:    process.env.SMTP_USER,
                    to:      process.env.NOTIFICATION_EMAIL || process.env.SMTP_USER,
                    subject: `New Booking Request: ${name} - ${service}`,
                    text:    `New booking received!\n\nName: ${name}\nPhone: ${phone}\nEmail: ${email}\nService: ${service}\nDate: ${date}\nTime: ${time}\nMessage: ${message}`
                };

                await transporter.sendMail(mailOptions);
                console.log('Admin notification email sent.');
            } catch (emailErr) {
                console.error('Failed to send notification email:', emailErr);
            }
        }

        res.status(201).json({ success: true, bookingId: newId });
    } catch (err) {
        console.error('Error creating booking:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

module.exports = router;
