const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const nodemailer = require('nodemailer');
const twilio = require('twilio');
const db = require('../db/database');
const { requireAuth, redirectIfAuth } = require('../middleware/auth');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Multer setup for image uploads
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.join(__dirname, '../uploads'));
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + path.extname(file.originalname));
    }
});
const upload = multer({ storage: storage });

// Helper: Generate 6-digit OTP
function generateOTP() {
    return Math.floor(100000 + Math.random() * 900000).toString();
}

// Helper: Send OTP via Email
async function sendOTPEmail(toEmail, otp) {
    const transporter = nodemailer.createTransport({
        host:   process.env.SMTP_HOST || 'smtp.gmail.com',
        port:   process.env.SMTP_PORT || 587,
        secure: (process.env.SMTP_PORT || 587) == 465,
        auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS
        }
    });

    await transporter.sendMail({
        from:    `"Sri Madhuri Admin" <${process.env.SMTP_USER}>`,
        to:      toEmail,
        subject: '🔐 Password Reset OTP — Sri Madhuri Makeovers',
        html: `
            <div style="font-family: 'Segoe UI', sans-serif; max-width: 480px; margin: 0 auto; background: #0f172a; border-radius: 12px; overflow: hidden;">
                <div style="padding: 2rem; text-align: center; background: linear-gradient(135deg, #0f172a, #1e293b);">
                    <h1 style="color: #D4AF37; margin: 0; font-size: 1.5rem;">Sri Madhuri Makeovers</h1>
                    <p style="color: #94a3b8; margin: 0.5rem 0 0;">Admin Password Reset</p>
                </div>
                <div style="padding: 2rem; text-align: center;">
                    <p style="color: #cbd5e1; margin: 0 0 1.5rem;">Your one-time password reset code is:</p>
                    <div style="background: rgba(212,175,55,0.1); border: 2px dashed #D4AF37; border-radius: 10px; padding: 1.2rem; display: inline-block;">
                        <span style="font-size: 2.5rem; font-weight: 700; color: #D4AF37; letter-spacing: 12px; font-family: monospace;">${otp}</span>
                    </div>
                    <p style="color: #94a3b8; font-size: 0.85rem; margin: 1.5rem 0 0;">
                        ⏱ This code expires in <strong style="color: #f59e0b;">5 minutes</strong>.<br>
                        If you didn't request this, please ignore this email.
                    </p>
                </div>
                <div style="padding: 1rem; text-align: center; background: rgba(0,0,0,0.2);">
                    <p style="color: #475569; font-size: 0.75rem; margin: 0;">© ${new Date().getFullYear()} Sri Madhuri Makeovers</p>
                </div>
            </div>
        `
    });
}

// Helper: Send WhatsApp Message via Twilio
async function sendWhatsAppMessage(toPhone, message) {
    if (!process.env.TWILIO_ACCOUNT_SID || !process.env.TWILIO_AUTH_TOKEN) {
        console.log(`\n💬 [DEV WHATSAPP] To: ${toPhone}\nMessage: ${message}\n`);
        return;
    }
    try {
        const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
        
        let formattedPhone = toPhone.replace(/[^0-9]/g, '');
        if (formattedPhone.length === 10) formattedPhone = '91' + formattedPhone;
        if (!formattedPhone.startsWith('+')) formattedPhone = '+' + formattedPhone;

        const fromNumber = process.env.TWILIO_WHATSAPP_NUMBER || 'whatsapp:+14155238886';
        
        await client.messages.create({
            body: message,
            from: fromNumber,
            to:   `whatsapp:${formattedPhone}`
        });
        console.log(`WhatsApp message sent to ${formattedPhone}`);
    } catch (err) {
        console.error('Failed to send WhatsApp message:', err);
    }
}

// ─── AUTHENTICATION ─────────────────────────────────────────────────────────

router.get('/login', redirectIfAuth, (req, res) => {
    res.render('admin/login', { error: null });
});

router.post('/login', redirectIfAuth, async (req, res) => {
    const { username, password } = req.body;
    const user = await db.getByUsername(username);
    
    if (user && bcrypt.compareSync(password, user.password_hash)) {
        req.session.adminId = user.id;
        res.redirect('/admin');
    } else {
        res.render('admin/login', { error: 'Invalid username or password' });
    }
});

router.get('/logout', (req, res) => {
    req.session.destroy();
    res.redirect('/admin/login');
});

// ─── FORGOT PASSWORD (OTP-Based Reset) ─────────────────────────────────────

router.get('/forgot-password', redirectIfAuth, (req, res) => {
    res.render('admin/forgot-password', { error: null, success: null, step: 'request' });
});

router.post('/forgot-password', redirectIfAuth, async (req, res) => {
    const { contact } = req.body;

    if (!contact || !contact.trim()) {
        return res.render('admin/forgot-password', {
            error: 'Please enter your registered email or phone number.',
            success: null, step: 'request'
        });
    }

    const admin = await db.findAdminByEmailOrPhone(contact);

    if (!admin) {
        return res.render('admin/forgot-password', {
            error: 'No admin account found with that email or phone number.',
            success: null, step: 'request'
        });
    }

    const otp = generateOTP();
    await db.storeOTP(admin.id, otp);

    const targetEmail = admin.email;

    if (targetEmail) {
        try {
            await sendOTPEmail(targetEmail, otp);
        } catch (emailErr) {
            console.error('Failed to send OTP email:', emailErr);
            console.log(`\n🔑 [DEV] OTP for ${admin.username}: ${otp}\n`);
        }
    } else {
        console.log(`\n🔑 [DEV] OTP for ${admin.username}: ${otp}\n`);
    }

    if (admin.phone) {
        const waMessage = `Your Sri Madhuri Makeovers Admin OTP is: *${otp}*.\n\nIt expires in 5 minutes.`;
        await sendWhatsAppMessage(admin.phone, waMessage);
    }

    let maskedContact = '';
    if (targetEmail) {
        const [name, domain] = targetEmail.split('@');
        maskedContact = name.substring(0, 2) + '***@' + domain;
    }
    if (admin.phone) {
        const ph = admin.phone.replace(/[^0-9]/g, '');
        maskedContact += (maskedContact ? ' / ' : '') + '******' + ph.slice(-4);
    }

    req.session.resetAdminId = admin.id;
    req.session.resetMaskedContact = maskedContact;

    res.render('admin/forgot-password', {
        error: null,
        success: `OTP sent to ${maskedContact}. Check your inbox.`,
        step: 'verify',
        maskedContact
    });
});

router.post('/verify-otp', redirectIfAuth, async (req, res) => {
    const { otp } = req.body;
    const adminId = req.session.resetAdminId;

    if (!adminId) {
        return res.render('admin/forgot-password', {
            error: 'Session expired. Please start over.',
            success: null, step: 'request'
        });
    }

    const result = await db.verifyOTP(adminId, otp);

    if (!result.valid) {
        return res.render('admin/forgot-password', {
            error: result.error,
            success: null,
            step: 'verify',
            maskedContact: req.session.resetMaskedContact || ''
        });
    }

    req.session.otpVerified = true;

    res.render('admin/forgot-password', {
        error: null, success: null,
        step: 'reset'
    });
});

router.post('/reset-password', redirectIfAuth, async (req, res) => {
    const { newPassword, confirmPassword } = req.body;
    const adminId = req.session.resetAdminId;

    if (!adminId || !req.session.otpVerified) {
        return res.render('admin/forgot-password', {
            error: 'Session expired or OTP not verified. Please start over.',
            success: null, step: 'request'
        });
    }

    if (!newPassword || newPassword.length < 6) {
        return res.render('admin/forgot-password', {
            error: 'Password must be at least 6 characters.',
            success: null, step: 'reset'
        });
    }

    if (newPassword !== confirmPassword) {
        return res.render('admin/forgot-password', {
            error: 'Passwords do not match.',
            success: null, step: 'reset'
        });
    }

    await db.resetAdminPassword(adminId, newPassword);
    await db.clearOTP(adminId);

    delete req.session.resetAdminId;
    delete req.session.resetMaskedContact;
    delete req.session.otpVerified;

    res.render('admin/login', { error: null, success: 'Password reset successful! Please login with your new password.' });
});

// ─── DASHBOARD ──────────────────────────────────────────────────────────────

router.get('/', requireAuth, async (req, res) => {
    const allBookings = await db.get('bookings');
    const totalBookings = allBookings.length;
    const pendingBookings = allBookings.filter(b => b.status === 'pending').length;
    
    const today = new Date().toISOString().split('T')[0];
    const todayBookings = allBookings.filter(b => b.date === today).length;
    
    const recentBookings = [...allBookings]
        .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
        .slice(0, 5);

    res.render('admin/dashboard', { 
        totalBookings, pendingBookings, todayBookings, recentBookings,
        title: 'Dashboard'
    });
});

// ─── BOOKINGS ───────────────────────────────────────────────────────────────

router.get('/bookings', requireAuth, async (req, res) => {
    const bookings = (await db.get('bookings'))
        .sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
    res.render('admin/bookings', { bookings, title: 'Bookings' });
});

// Helper: Send Booking Status Email
async function sendBookingStatusEmail(booking, status) {
    if (!booking.email) return;

    const transporter = nodemailer.createTransport({
        host:   process.env.SMTP_HOST || 'smtp.gmail.com',
        port:   process.env.SMTP_PORT || 587,
        secure: (process.env.SMTP_PORT || 587) == 465,
        auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS
        }
    });

    let subject = '';
    let message = '';
    let color = '#D4AF37';

    switch(status) {
        case 'confirmed':
            subject = '✅ Your Booking is Confirmed — Sri Madhuri Makeovers';
            message = `Your appointment for <strong>${booking.service}</strong> on <strong>${booking.date}</strong> at <strong>${booking.time}</strong> has been confirmed. We look forward to seeing you!`;
            color = '#10b981';
            break;
        case 'completed':
            subject = '✨ Thank You for Visiting Sri Madhuri Makeovers';
            message = `Your appointment for <strong>${booking.service}</strong> is marked as completed. We hope you loved your experience! We'd love it if you could leave us a review.`;
            color = '#4338ca';
            break;
        case 'cancelled':
            subject = '❌ Booking Cancelled — Sri Madhuri Makeovers';
            message = `Your appointment for <strong>${booking.service}</strong> on <strong>${booking.date}</strong> has been cancelled. If this was a mistake or you'd like to reschedule, please contact us.`;
            color = '#ef4444';
            break;
        default:
            return;
    }

    try {
        await transporter.sendMail({
            from:    `"Sri Madhuri Makeovers" <${process.env.SMTP_USER}>`,
            to:      booking.email,
            subject: subject,
            html: `
                <div style="font-family: 'Segoe UI', sans-serif; max-width: 480px; margin: 0 auto; background: #0f172a; border-radius: 12px; overflow: hidden;">
                    <div style="padding: 2rem; text-align: center; background: linear-gradient(135deg, #0f172a, #1e293b);">
                        <h1 style="color: #D4AF37; margin: 0; font-size: 1.5rem;">Sri Madhuri Makeovers</h1>
                    </div>
                    <div style="padding: 2rem; text-align: center;">
                        <p style="color: #cbd5e1; margin: 0 0 1rem; font-size: 1.1rem;">Hello <strong>${booking.name}</strong>,</p>
                        <div style="background: rgba(255,255,255,0.05); border-left: 4px solid ${color}; padding: 1.2rem; margin-bottom: 1.5rem; text-align: left;">
                            <p style="color: #FDFBF7; margin: 0; font-size: 0.95rem; line-height: 1.6;">
                                ${message}
                            </p>
                        </div>
                        <p style="color: #94a3b8; font-size: 0.85rem; margin: 0;">
                            Need help? Reply to this email or call us at 8985291053.
                        </p>
                    </div>
                    <div style="padding: 1rem; text-align: center; background: rgba(0,0,0,0.2);">
                        <p style="color: #475569; font-size: 0.75rem; margin: 0;">© ${new Date().getFullYear()} Sri Madhuri Makeovers</p>
                    </div>
                </div>
            `
        });
        console.log(`Booking status email sent to ${booking.email} for status: ${status}`);
    } catch (err) {
        console.error('Failed to send booking status email:', err);
    }
}

// Helper: Send WhatsApp Booking Status
async function sendBookingStatusWhatsApp(booking, status) {
    if (!booking.phone) return;
    
    let waMessage = '';
    switch(status) {
        case 'confirmed':
            waMessage = `✅ *Booking Confirmed*\n\nHello ${booking.name},\nYour appointment for *${booking.service}* on *${booking.date}* at *${booking.time}* has been confirmed. We look forward to seeing you at Sri Madhuri Makeovers!`;
            break;
        case 'completed':
            waMessage = `✨ *Thank You!*\n\nHello ${booking.name},\nYour appointment for *${booking.service}* is completed. We hope you loved your experience at Sri Madhuri Makeovers!`;
            break;
        case 'cancelled':
            waMessage = `❌ *Booking Cancelled*\n\nHello ${booking.name},\nYour appointment for *${booking.service}* on *${booking.date}* has been cancelled. Please contact us to reschedule.`;
            break;
        default:
            return;
    }
    
    await sendWhatsAppMessage(booking.phone, waMessage);
}

router.post('/bookings/:id/status', requireAuth, async (req, res) => {
    const { status } = req.body;
    const booking = await db.getById('bookings', req.params.id);
    
    if (booking) {
        await db.updateBookingStatus(req.params.id, status);
        
        if (process.env.SMTP_USER && process.env.SMTP_PASS && process.env.SMTP_USER !== 'hello@srimadhurimakeovers.com') {
            await sendBookingStatusEmail(booking, status);
        }
        
        await sendBookingStatusWhatsApp(booking, status);
    }
    
    res.redirect('/admin/bookings');
});

// ─── SETTINGS ───────────────────────────────────────────────────────────────

router.get('/settings', requireAuth, async (req, res) => {
    const settings = await db.getSettings();
    res.render('admin/settings', { settings, title: 'Settings' });
});

router.post('/settings', requireAuth, async (req, res) => {
    await db.updateSettings(req.body);
    res.redirect('/admin/settings');
});

// ─── SERVICES ───────────────────────────────────────────────────────────────

router.get('/services', requireAuth, async (req, res) => {
    const services = await db.get('services');
    res.render('admin/services', { services, title: 'Services' });
});

router.post('/services/add', requireAuth, async (req, res) => {
    const { name, price, duration, active } = req.body;
    await db.insert('services', { 
        name, 
        price, 
        duration, 
        active: active === 'on' 
    });
    res.redirect('/admin/services');
});

router.post('/services/edit/:id', requireAuth, async (req, res) => {
    const { name, price, duration, active } = req.body;
    await db.update('services', req.params.id, { 
        name, 
        price, 
        duration, 
        active: active === 'on' 
    });
    res.redirect('/admin/services');
});

router.post('/services/delete/:id', requireAuth, async (req, res) => {
    await db.delete('services', req.params.id);
    res.redirect('/admin/services');
});

// ─── GALLERY ────────────────────────────────────────────────────────────────

router.get('/gallery', requireAuth, async (req, res) => {
    const gallery = await db.get('gallery');
    res.render('admin/gallery', { gallery, title: 'Gallery' });
});

router.post('/gallery/add', requireAuth, upload.single('image'), async (req, res) => {
    const { category } = req.body;
    
    if (req.file) {
        await db.insert('gallery', { 
            image:    `/uploads/${req.file.filename}`,
            category: category || 'General'
        });
    }
    res.redirect('/admin/gallery');
});

router.post('/gallery/delete/:id', requireAuth, async (req, res) => {
    const img = await db.getById('gallery', req.params.id);
    if (img && img.image) {
        const filePath = path.join(__dirname, '../', img.image);
        if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
        }
    }
    await db.delete('gallery', req.params.id);
    res.redirect('/admin/gallery');
});

// ─── TESTIMONIALS ───────────────────────────────────────────────────────────

router.get('/testimonials', requireAuth, async (req, res) => {
    const testimonials = await db.get('testimonials');
    res.render('admin/testimonials', { testimonials, title: 'Testimonials' });
});

router.post('/testimonials/add', requireAuth, upload.single('image'), async (req, res) => {
    const { name, role, rating, text } = req.body;
    await db.insert('testimonials', { 
        name, 
        role, 
        rating: parseInt(rating), 
        text,
        image: req.file ? `/uploads/${req.file.filename}` : ''
    });
    res.redirect('/admin/testimonials');
});

router.post('/testimonials/delete/:id', requireAuth, async (req, res) => {
    const testimonial = await db.getById('testimonials', req.params.id);
    if (testimonial && testimonial.image) {
        const filePath = path.join(__dirname, '../', testimonial.image);
        if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
        }
    }
    await db.delete('testimonials', req.params.id);
    res.redirect('/admin/testimonials');
});

// ─── TEAM ───────────────────────────────────────────────────────────────────

router.get('/team', requireAuth, async (req, res) => {
    const team = await db.get('team');
    res.render('admin/team', { team, title: 'Team' });
});

router.post('/team/add', requireAuth, upload.single('image'), async (req, res) => {
    const { name, role, experience } = req.body;
    await db.insert('team', { 
        name, 
        role, 
        experience,
        image: req.file ? `/uploads/${req.file.filename}` : ''
    });
    res.redirect('/admin/team');
});

router.post('/team/delete/:id', requireAuth, async (req, res) => {
    const member = await db.getById('team', req.params.id);
    if (member && member.image) {
        const filePath = path.join(__dirname, '../', member.image);
        if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
        }
    }
    await db.delete('team', req.params.id);
    res.redirect('/admin/team');
});

// ─── OFFERS ─────────────────────────────────────────────────────────────────

router.get('/offers', requireAuth, async (req, res) => {
    const offers = await db.get('offers');
    res.render('admin/offers', { offers, title: 'Offers' });
});

router.post('/offers/add', requireAuth, async (req, res) => {
    const { title, description, originalPrice, offerPrice, discount, badge, endDate, active } = req.body;
    await db.insert('offers', { 
        title, 
        description, 
        originalPrice,
        offerPrice,
        discount,
        badge,
        endDate,
        active: active === 'on'
    });
    res.redirect('/admin/offers');
});

router.post('/offers/toggle/:id', requireAuth, async (req, res) => {
    const offer = await db.getById('offers', req.params.id);
    if (offer) {
        await db.update('offers', req.params.id, { active: !offer.active });
    }
    res.redirect('/admin/offers');
});

router.post('/offers/delete/:id', requireAuth, async (req, res) => {
    await db.delete('offers', req.params.id);
    res.redirect('/admin/offers');
});

// ─── CREDENTIALS ────────────────────────────────────────────────────────────

router.get('/credentials', requireAuth, async (req, res) => {
    const admin = await db.getAdminById(req.session.adminId);
    res.render('admin/credentials', { 
        title: 'Credentials',
        currentUsername: admin ? admin.username : '',
        currentEmail:    admin ? (admin.email || '') : '',
        currentPhone:    admin ? (admin.phone || '') : '',
        success: null,
        error:   null
    });
});

router.post('/credentials', requireAuth, async (req, res) => {
    const { currentPassword, newUsername, newPassword, confirmPassword } = req.body;
    const admin = await db.getAdminById(req.session.adminId);

    if (!admin) {
        return res.render('admin/credentials', { 
            title: 'Credentials', currentUsername: '', currentEmail: '', currentPhone: '',
            success: null, error: 'Admin user not found. Please re-login.' 
        });
    }

    if (!bcrypt.compareSync(currentPassword, admin.password_hash)) {
        return res.render('admin/credentials', { 
            title: 'Credentials', currentUsername: admin.username,
            currentEmail: admin.email || '', currentPhone: admin.phone || '',
            success: null, error: 'Current password is incorrect.' 
        });
    }

    if (newPassword) {
        if (newPassword.length < 6) {
            return res.render('admin/credentials', { 
                title: 'Credentials', currentUsername: admin.username,
                currentEmail: admin.email || '', currentPhone: admin.phone || '',
                success: null, error: 'New password must be at least 6 characters.' 
            });
        }
        if (newPassword !== confirmPassword) {
            return res.render('admin/credentials', { 
                title: 'Credentials', currentUsername: admin.username,
                currentEmail: admin.email || '', currentPhone: admin.phone || '',
                success: null, error: 'New password and confirm password do not match.' 
            });
        }
    }

    const trimmedUsername = newUsername ? newUsername.trim() : '';
    if (!trimmedUsername) {
        return res.render('admin/credentials', { 
            title: 'Credentials', currentUsername: admin.username,
            currentEmail: admin.email || '', currentPhone: admin.phone || '',
            success: null, error: 'Username cannot be empty.' 
        });
    }

    const result = await db.updateAdminCredentials(req.session.adminId, {
        newUsername: trimmedUsername,
        newPassword: newPassword || null
    });

    if (!result.success) {
        return res.render('admin/credentials', { 
            title: 'Credentials', currentUsername: admin.username,
            currentEmail: admin.email || '', currentPhone: admin.phone || '',
            success: null, error: result.error 
        });
    }

    req.session.destroy(() => {
        res.redirect('/admin/login');
    });
});

router.post('/credentials/recovery', requireAuth, async (req, res) => {
    const { recoveryEmail, recoveryPhone } = req.body;
    const admin = await db.getAdminById(req.session.adminId);

    if (!admin) {
        return res.render('admin/credentials', {
            title: 'Credentials', currentUsername: '', currentEmail: '', currentPhone: '',
            success: null, error: 'Admin user not found.'
        });
    }

    if (!recoveryEmail || !recoveryEmail.trim()) {
        return res.render('admin/credentials', {
            title: 'Credentials', currentUsername: admin.username,
            currentEmail: admin.email || '', currentPhone: admin.phone || '',
            success: null, error: 'Recovery email is required.'
        });
    }

    await db.updateAdminProfile(req.session.adminId, {
        email: recoveryEmail.trim(),
        phone: (recoveryPhone || '').trim()
    });

    const updatedAdmin = await db.getAdminById(req.session.adminId);
    res.render('admin/credentials', {
        title: 'Credentials',
        currentUsername: updatedAdmin.username,
        currentEmail:    updatedAdmin.email || '',
        currentPhone:    updatedAdmin.phone || '',
        success: 'Recovery contact info updated successfully!',
        error:   null
    });
});

module.exports = router;
