import React, { useState, useEffect } from 'react';
import { useStore } from '../../context/StoreContext';
import { useAuth } from '../../context/AuthContext';
import { sendAdminResetOtp } from '../../lib/emailService';
import ImageUploader from '../../components/ImageUploader';
import {
  Save, Check, Store, Phone, Clock, Share2, Image, MessageSquare, Plus, X,
  Shield, Key, Lock, Mail, User, CheckCircle2, AlertCircle, RefreshCw, KeyRound
} from 'lucide-react';

const AdminSettings = () => {
  const { storeInfo, updateStoreInfo } = useStore();
  const { adminUsername, adminEmail, updateAdminCredentials } = useAuth();
  const [formData, setFormData] = useState({ ...storeInfo });
  const [saved, setSaved] = useState(false);
  const [newFaqQ, setNewFaqQ] = useState('');
  const [newFaqA, setNewFaqA] = useState('');

  // Credentials management state
  const [credForm, setCredForm] = useState({
    username: adminUsername || 'admin',
    email: adminEmail || 'nandhiniverma031@gmail.com',
    password: '',
    confirmPassword: ''
  });
  const [credError, setCredError] = useState('');
  const [credSuccess, setCredSuccess] = useState('');
  const [otpModalOpen, setOtpModalOpen] = useState(false);
  const [otpCode, setOtpCode] = useState('');
  const [activeOtpSession, setActiveOtpSession] = useState(null);
  const [otpCountdown, setOtpCountdown] = useState(0);
  const [sendingOtp, setSendingOtp] = useState(false);
  const [verifyingOtp, setVerifyingOtp] = useState(false);

  useEffect(() => {
    setCredForm(prev => ({
      ...prev,
      username: adminUsername || 'admin',
      email: adminEmail || 'nandhiniverma031@gmail.com'
    }));
  }, [adminUsername, adminEmail]);

  useEffect(() => {
    if (otpCountdown <= 0) return;
    const timer = setInterval(() => {
      setOtpCountdown(prev => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, [otpCountdown]);

  const handleInitiateOtpRequest = async (e) => {
    e.preventDefault();
    setCredError('');
    setCredSuccess('');

    if (!credForm.username.trim()) {
      setCredError('Username cannot be empty.');
      return;
    }

    if (!credForm.email.trim() || !credForm.email.includes('@')) {
      setCredError('Please enter a valid administrative email address.');
      return;
    }

    if (credForm.password) {
      if (credForm.password.length < 5) {
        setCredError('New password must be at least 5 characters long.');
        return;
      }
      if (credForm.password !== credForm.confirmPassword) {
        setCredError('New password and confirmation do not match.');
        return;
      }
    }

    const isUserChanged = credForm.username.trim() !== adminUsername;
    const isEmailChanged = credForm.email.trim() !== adminEmail;
    const isPassChanged = Boolean(credForm.password.trim());

    if (!isUserChanged && !isEmailChanged && !isPassChanged) {
      setCredError('No changes detected in username, email, or password.');
      return;
    }

    setSendingOtp(true);
    const genOtp = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = Date.now() + 10 * 60 * 1000;

    try {
      await sendAdminResetOtp({
        toEmail: adminEmail,
        adminUsername: adminUsername || 'Administrator',
        otpCode: genOtp,
        expiresMinutes: 10
      });

      setActiveOtpSession({
        code: genOtp,
        expiresAt,
        newUsername: credForm.username.trim(),
        newEmail: credForm.email.trim(),
        newPassword: credForm.password.trim()
      });
      setOtpCode('');
      setOtpCountdown(600);
      setOtpModalOpen(true);
    } catch (err) {
      console.error(err);
      setCredError('Failed to dispatch OTP email. Please verify EmailJS settings.');
    } finally {
      setSendingOtp(false);
    }
  };

  const handleVerifyOtpAndSave = async (e) => {
    e.preventDefault();
    setCredError('');

    if (!activeOtpSession) {
      setCredError('No active OTP session. Please request a new code.');
      setOtpModalOpen(false);
      return;
    }

    if (Date.now() > activeOtpSession.expiresAt) {
      setCredError('The OTP code has expired. Please request a fresh one.');
      return;
    }

    if (otpCode.trim() !== activeOtpSession.code) {
      setCredError('Incorrect OTP verification code. Please check your email.');
      return;
    }

    setVerifyingOtp(true);
    try {
      await updateAdminCredentials({
        username: activeOtpSession.newUsername,
        password: activeOtpSession.newPassword,
        email: activeOtpSession.newEmail
      });

      setOtpModalOpen(false);
      setActiveOtpSession(null);
      setCredForm(prev => ({ ...prev, password: '', confirmPassword: '' }));
      setCredSuccess(
        `Admin credentials & email successfully updated! Changes saved to .env on disk and active session.`
      );
      setTimeout(() => setCredSuccess(''), 7000);
    } catch (err) {
      console.error(err);
      setCredError('Failed to update credentials. Please try again.');
    } finally {
      setVerifyingOtp(false);
    }
  };

  const formatCountdown = (secs) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await updateStoreInfo(formData);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const addFaq = () => {
    if (!newFaqQ.trim() || !newFaqA.trim()) return;
    const faqs = formData.faqs || [];
    setFormData({ ...formData, faqs: [...faqs, { question: newFaqQ.trim(), answer: newFaqA.trim() }] });
    setNewFaqQ('');
    setNewFaqA('');
  };

  const removeFaq = (index) => {
    const faqs = [...(formData.faqs || [])];
    faqs.splice(index, 1);
    setFormData({ ...formData, faqs });
  };

  return (
    <div style={{ maxWidth: '960px' }}>
      {/* Header */}
      <div style={{ marginBottom: '1.75rem' }}>
        <h2 style={{ fontSize: 'clamp(1.5rem, 4vw, 2rem)', color: 'var(--text-primary)', marginBottom: '4px' }}>
          Salon & Store Configuration
        </h2>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.86rem' }}>
          Update admin security credentials, store phone numbers, WhatsApp booking links, working hours, and social profiles.
        </p>
      </div>

      {saved && (
        <div style={{ background: 'var(--success-bg)', border: '1px solid var(--success)', color: 'var(--success)', padding: '12px 18px', borderRadius: 'var(--radius-sm)', display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '1.25rem', fontSize: '0.9rem' }}>
          <Check size={18} /> Salon configuration saved successfully!
        </div>
      )}

      {/* Admin Login Credentials & Security Card */}
      <div
        className="surface settings-card"
        style={{
          padding: '1.75rem',
          marginBottom: '1.75rem',
          border: '1px solid rgba(200, 151, 90, 0.35)',
          borderRadius: 'var(--radius-md)'
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '0.75rem', marginBottom: '1.25rem' }}>
          <div>
            <h3 style={{ fontSize: '1.25rem', color: 'var(--amber-light)', display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
              <Shield size={20} color="var(--amber)" /> Admin Login Credentials & Security
            </h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.84rem' }}>
              Update your administrative username, password, and email address. Updates require 6-digit OTP verification sent to your current admin email.
            </p>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'rgba(200, 151, 90, 0.1)', border: '1px solid var(--border-subtle)', padding: '4px 10px', borderRadius: 'var(--radius-full)', fontSize: '0.75rem', color: 'var(--amber-light)' }}>
            <Lock size={12} /> OTP Verification Active
          </div>
        </div>

        {/* Current Active Credentials Badges */}
        <div className="admin-grid-2" style={{ marginBottom: '1.25rem', background: 'rgba(255, 255, 255, 0.02)', padding: '0.85rem 1rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)' }}>
          <div>
            <span style={{ fontSize: '0.72rem', textTransform: 'uppercase', color: 'var(--text-muted)', letterSpacing: '0.08em' }}>Current Username</span>
            <div style={{ fontWeight: '600', color: 'var(--text-primary)', fontSize: '0.92rem', marginTop: '2px', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <User size={14} color="var(--amber)" /> {adminUsername}
            </div>
          </div>
          <div>
            <span style={{ fontSize: '0.72rem', textTransform: 'uppercase', color: 'var(--text-muted)', letterSpacing: '0.08em' }}>Current Admin Email</span>
            <div style={{ fontWeight: '600', color: 'var(--text-primary)', fontSize: '0.92rem', marginTop: '2px', display: 'flex', alignItems: 'center', gap: '6px', wordBreak: 'break-all' }}>
              <Mail size={14} color="var(--amber)" /> {adminEmail}
            </div>
          </div>
        </div>

        {credSuccess && (
          <div style={{ background: 'rgba(90, 155, 110, 0.15)', border: '1px solid var(--success)', color: 'var(--success)', padding: '10px 14px', borderRadius: 'var(--radius-sm)', display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '1.25rem', fontSize: '0.85rem' }}>
            <Check size={16} /> {credSuccess}
          </div>
        )}

        {credError && (
          <div style={{ background: 'rgba(194, 90, 90, 0.15)', border: '1px solid var(--danger)', color: '#f87171', padding: '10px 14px', borderRadius: 'var(--radius-sm)', display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '1.25rem', fontSize: '0.85rem' }}>
            <AlertCircle size={16} /> {credError}
          </div>
        )}

        <form onSubmit={handleInitiateOtpRequest}>
          <div className="admin-grid-2" style={{ marginBottom: '1rem' }}>
            <div className="form-group" style={{ margin: 0 }}>
              <label className="form-label">New Username</label>
              <input
                type="text"
                className="form-input"
                value={credForm.username}
                onChange={e => setCredForm({ ...credForm, username: e.target.value })}
                placeholder="admin"
                required
              />
              <small style={{ color: 'var(--text-muted)', fontSize: '0.72rem', marginTop: '2px', display: 'block' }}>
                Used to log into the Admin Vendor Portal (/admin)
              </small>
            </div>

            <div className="form-group" style={{ margin: 0 }}>
              <label className="form-label">New Admin Email</label>
              <input
                type="email"
                className="form-input"
                value={credForm.email}
                onChange={e => setCredForm({ ...credForm, email: e.target.value })}
                placeholder="newadmin@gmail.com"
                required
              />
              <small style={{ color: 'var(--text-muted)', fontSize: '0.72rem', marginTop: '2px', display: 'block' }}>
                Where future password resets and OTPs will be delivered
              </small>
            </div>
          </div>

          <div className="admin-grid-2" style={{ marginBottom: '1.25rem' }}>
            <div className="form-group" style={{ margin: 0 }}>
              <label className="form-label">New Password (leave blank to keep current)</label>
              <input
                type="password"
                className="form-input"
                value={credForm.password}
                onChange={e => setCredForm({ ...credForm, password: e.target.value })}
                placeholder="Enter new password..."
              />
            </div>

            <div className="form-group" style={{ margin: 0 }}>
              <label className="form-label">Confirm New Password</label>
              <input
                type="password"
                className="form-input"
                value={credForm.confirmPassword}
                onChange={e => setCredForm({ ...credForm, confirmPassword: e.target.value })}
                placeholder="Re-type new password..."
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={sendingOtp}
            className="btn btn-primary"
            style={{ gap: '8px', padding: '0.75rem 1.5rem', width: '100%', maxWidth: '380px' }}
          >
            <KeyRound size={16} />
            {sendingOtp ? 'Sending OTP to email...' : 'Send Verification OTP to Apply'}
          </button>
        </form>
      </div>

      {/* OTP Verification Modal */}
      {otpModalOpen && activeOtpSession && (
        <div className="modal-backdrop" onClick={() => setOtpModalOpen(false)}>
          <div className="modal-card" style={{ maxWidth: '440px', width: '95%' }} onClick={e => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <h3 style={{ fontSize: '1.25rem', color: 'var(--bone)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <KeyRound size={18} color="var(--amber)" /> Verify Administrator OTP
              </h3>
              <button onClick={() => setOtpModalOpen(false)} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
                <X size={18} />
              </button>
            </div>

            <p style={{ fontSize: '0.84rem', color: 'var(--text-secondary)', marginBottom: '1.25rem', lineHeight: 1.5 }}>
              For security, a 6-digit verification code has been dispatched to:
              <br />
              <strong style={{ color: 'var(--amber-light)', wordBreak: 'break-all' }}>{adminEmail}</strong>
            </p>

            {credError && (
              <div style={{ background: 'rgba(194, 90, 90, 0.15)', border: '1px solid var(--danger)', color: '#f87171', padding: '8px 12px', borderRadius: 'var(--radius-sm)', display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '1rem', fontSize: '0.82rem' }}>
                <AlertCircle size={15} /> {credError}
              </div>
            )}

            <form onSubmit={handleVerifyOtpAndSave}>
              <div className="form-group">
                <label className="form-label" style={{ textAlign: 'center', display: 'block' }}>Enter 6-Digit OTP Code</label>
                <input
                  type="text"
                  maxLength={6}
                  autoFocus
                  className="form-input"
                  value={otpCode}
                  onChange={e => setOtpCode(e.target.value.replace(/\D/g, ''))}
                  placeholder="• • • • • •"
                  style={{
                    fontSize: 'clamp(1.4rem, 5vw, 1.8rem)',
                    textAlign: 'center',
                    letterSpacing: 'clamp(6px, 2vw, 10px)',
                    fontFamily: 'monospace',
                    padding: '0.75rem',
                    borderColor: 'var(--amber)'
                  }}
                  required
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                <span>Expires: <strong style={{ color: otpCountdown < 60 ? 'var(--danger)' : 'var(--amber-light)' }}>{formatCountdown(otpCountdown)}</strong></span>
                <button
                  type="button"
                  onClick={handleInitiateOtpRequest}
                  disabled={sendingOtp || otpCountdown > 540}
                  style={{ background: 'none', border: 'none', color: 'var(--amber-light)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}
                >
                  <RefreshCw size={12} /> Resend Code
                </button>
              </div>

              <div style={{ display: 'flex', gap: '8px' }}>
                <button type="button" onClick={() => setOtpModalOpen(false)} className="btn btn-ghost" style={{ flex: 1 }}>
                  Cancel
                </button>
                <button type="submit" disabled={verifyingOtp || otpCode.length !== 6} className="btn btn-primary" style={{ flex: 2 }}>
                  {verifyingOtp ? 'Verifying...' : 'Verify & Save'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Main Settings Form */}
      <form onSubmit={handleSubmit}>
        {/* Salon Identity */}
        <div className="surface settings-card" style={{ padding: '1.75rem', marginBottom: '1.5rem', borderRadius: 'var(--radius-md)' }}>
          <h3 style={{ fontSize: '1.15rem', color: 'var(--amber-light)', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Store size={18} /> Salon Identity
          </h3>
          <div className="admin-grid-2">
            <div className="form-group" style={{ margin: 0 }}>
              <label className="form-label">Salon Name</label>
              <input type="text" className="form-input" value={formData.name || ''} onChange={e => setFormData({ ...formData, name: e.target.value })} required />
            </div>
            <div className="form-group" style={{ margin: 0 }}>
              <label className="form-label">Tagline</label>
              <input type="text" className="form-input" value={formData.tagline || ''} onChange={e => setFormData({ ...formData, tagline: e.target.value })} />
            </div>
          </div>
        </div>

        {/* Contact & WhatsApp */}
        <div className="surface settings-card" style={{ padding: '1.75rem', marginBottom: '1.5rem', borderRadius: 'var(--radius-md)' }}>
          <h3 style={{ fontSize: '1.15rem', color: 'var(--amber-light)', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Phone size={18} /> Contact & WhatsApp Booking
          </h3>
          <div className="admin-grid-3" style={{ marginBottom: '1rem' }}>
            <div className="form-group" style={{ margin: 0 }}>
              <label className="form-label">Display Phone</label>
              <input type="text" className="form-input" value={formData.phone || ''} onChange={e => setFormData({ ...formData, phone: e.target.value })} />
            </div>
            <div className="form-group" style={{ margin: 0 }}>
              <label className="form-label">WhatsApp Number (No +)</label>
              <input type="text" className="form-input" value={formData.whatsapp_number || ''} onChange={e => setFormData({ ...formData, whatsapp_number: e.target.value })} placeholder="e.g. 918985291053" required />
            </div>
            <div className="form-group" style={{ margin: 0 }}>
              <label className="form-label">Email</label>
              <input type="email" className="form-input" value={formData.email || ''} onChange={e => setFormData({ ...formData, email: e.target.value })} />
            </div>
          </div>
          <div className="form-group" style={{ margin: 0 }}>
            <label className="form-label">Salon Address</label>
            <input type="text" className="form-input" value={formData.address || ''} onChange={e => setFormData({ ...formData, address: e.target.value })} />
          </div>
        </div>

        {/* About Section */}
        <div className="surface settings-card" style={{ padding: '1.75rem', marginBottom: '1.5rem', borderRadius: 'var(--radius-md)' }}>
          <h3 style={{ fontSize: '1.15rem', color: 'var(--amber-light)', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <MessageSquare size={18} /> About Section (Homepage)
          </h3>
          <div className="admin-grid-2" style={{ marginBottom: '1rem' }}>
            <div className="form-group" style={{ margin: 0 }}>
              <label className="form-label">About Title</label>
              <input type="text" className="form-input" value={formData.about_title || ''} onChange={e => setFormData({ ...formData, about_title: e.target.value })} placeholder="Crafting Confidence, One Makeover at a Time" />
            </div>
            <div className="form-group" style={{ margin: 0 }}>
              <label className="form-label">Award Label</label>
              <input type="text" className="form-input" value={formData.about_award_label || ''} onChange={e => setFormData({ ...formData, about_award_label: e.target.value })} placeholder="Of Excellence in Khammam" />
            </div>
          </div>
          <div className="form-group">
            <label className="form-label">About Main Text</label>
            <textarea className="form-textarea" rows="3" value={formData.about_text || ''} onChange={e => setFormData({ ...formData, about_text: e.target.value })} />
          </div>
          <div className="form-group">
            <label className="form-label">About Secondary Text</label>
            <textarea className="form-textarea" rows="2" value={formData.about_subtext || ''} onChange={e => setFormData({ ...formData, about_subtext: e.target.value })} placeholder="Additional about paragraph..." />
          </div>
          <div style={{ marginTop: '1rem' }}>
            <ImageUploader label="About Section Image" currentUrl={formData.about_image_url || formData.hero_image_url || ''} onUpload={url => setFormData({ ...formData, about_image_url: url })} />
          </div>
          <div className="form-group" style={{ marginTop: '1rem' }}>
            <label className="form-label">Features (one per line)</label>
            <textarea className="form-textarea" rows="4" value={(formData.about_features || []).join('\n')} onChange={e => setFormData({ ...formData, about_features: e.target.value.split('\n').filter(f => f.trim()) })} placeholder="Expert Certified Beauticians&#10;100% Authentic Luxury Brands&#10;Hospital-Grade Sanitation&#10;Tailored Bridal Consultations" />
          </div>
        </div>

        {/* Operating Hours */}
        <div className="surface settings-card" style={{ padding: '1.75rem', marginBottom: '1.5rem', borderRadius: 'var(--radius-md)' }}>
          <h3 style={{ fontSize: '1.15rem', color: 'var(--amber-light)', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Clock size={18} /> Operating Hours
          </h3>
          <div className="admin-grid-3">
            <div className="form-group" style={{ margin: 0 }}>
              <label className="form-label">Mon - Fri Hours</label>
              <input type="text" className="form-input" value={formData.hours_weekday || ''} onChange={e => setFormData({ ...formData, hours_weekday: e.target.value })} />
            </div>
            <div className="form-group" style={{ margin: 0 }}>
              <label className="form-label">Saturday Hours</label>
              <input type="text" className="form-input" value={formData.hours_saturday || ''} onChange={e => setFormData({ ...formData, hours_saturday: e.target.value })} />
            </div>
            <div className="form-group" style={{ margin: 0 }}>
              <label className="form-label">Sunday Hours</label>
              <input type="text" className="form-input" value={formData.hours_sunday || ''} onChange={e => setFormData({ ...formData, hours_sunday: e.target.value })} />
            </div>
          </div>
        </div>

        {/* Social Links */}
        <div className="surface settings-card" style={{ padding: '1.75rem', marginBottom: '1.5rem', borderRadius: 'var(--radius-md)' }}>
          <h3 style={{ fontSize: '1.15rem', color: 'var(--amber-light)', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Share2 size={18} /> Social Media & Reviews
          </h3>
          <div className="admin-grid-2">
            <div className="form-group" style={{ margin: 0 }}>
              <label className="form-label">Instagram Profile URL</label>
              <input type="url" className="form-input" value={formData.social_instagram || ''} onChange={e => setFormData({ ...formData, social_instagram: e.target.value })} />
            </div>
            <div className="form-group" style={{ margin: 0 }}>
              <label className="form-label">YouTube Channel URL</label>
              <input type="url" className="form-input" value={formData.social_youtube || ''} onChange={e => setFormData({ ...formData, social_youtube: e.target.value })} />
            </div>
            <div className="form-group" style={{ margin: 0 }}>
              <label className="form-label">Facebook Page URL</label>
              <input type="url" className="form-input" value={formData.social_facebook || ''} onChange={e => setFormData({ ...formData, social_facebook: e.target.value })} />
            </div>
            <div className="form-group" style={{ margin: 0 }}>
              <label className="form-label">Google Review URL</label>
              <input type="url" className="form-input" value={formData.google_review_url || ''} onChange={e => setFormData({ ...formData, google_review_url: e.target.value })} />
            </div>
            <div className="form-group" style={{ margin: 0 }}>
              <label className="form-label">Google Review Count</label>
              <input type="number" className="form-input" value={formData.google_review_count || ''} onChange={e => setFormData({ ...formData, google_review_count: parseInt(e.target.value) || 0 })} placeholder="247" />
            </div>
          </div>
        </div>

        {/* FAQs */}
        <div className="surface settings-card" style={{ padding: '1.75rem', marginBottom: '1.5rem', borderRadius: 'var(--radius-md)' }}>
          <h3 style={{ fontSize: '1.15rem', color: 'var(--amber-light)', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <MessageSquare size={18} /> FAQs (Frequently Asked Questions)
          </h3>
          <div className="admin-grid-2" style={{ marginBottom: '1rem' }}>
            <div className="form-group" style={{ margin: 0 }}>
              <label className="form-label">Question</label>
              <input type="text" className="form-input" value={newFaqQ} onChange={e => setNewFaqQ(e.target.value)} placeholder="e.g. Do you take appointments on Sundays?" />
            </div>
            <div className="form-group" style={{ margin: 0 }}>
              <label className="form-label">Answer</label>
              <input type="text" className="form-input" value={newFaqA} onChange={e => setNewFaqA(e.target.value)} placeholder="e.g. Yes, by prior appointment only." />
            </div>
          </div>
          <button type="button" className="btn btn-ghost btn-sm" onClick={addFaq} style={{ gap: '6px', display: 'inline-flex', marginBottom: '1rem' }}>
            <Plus size={14} /> Add FAQ
          </button>
          {(formData.faqs || []).map((faq, i) => (
            <div key={i} style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start', padding: '0.75rem', background: 'rgba(255,255,255,0.03)', borderRadius: 'var(--radius-sm)', marginBottom: '0.5rem' }}>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontWeight: '600', color: 'var(--amber-light)', fontSize: '0.88rem' }}>Q: {faq.question}</div>
                <div style={{ color: 'var(--text-secondary)', fontSize: '0.84rem', marginTop: '3px' }}>A: {faq.answer}</div>
              </div>
              <button type="button" onClick={() => removeFaq(i)} style={{ background: 'none', border: 'none', color: 'var(--danger)', cursor: 'pointer', padding: '4px' }}>
                <X size={16} />
              </button>
            </div>
          ))}
        </div>

        <button type="submit" className="btn btn-primary" style={{ padding: '0.9rem 2rem', gap: '8px', width: '100%', maxWidth: '320px' }}>
          <Save size={18} /> Save All Settings
        </button>
      </form>

      <style>{`
        .admin-grid-3 {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 1rem;
        }
        @media (max-width: 768px) {
          .settings-card {
            padding: 1.25rem !important;
          }
          .admin-grid-3 {
            grid-template-columns: 1fr !important;
            gap: 0.85rem !important;
          }
        }
      `}</style>
    </div>
  );
};

export default AdminSettings;
