import React, { useState, useEffect } from 'react';
import { useStore } from '../context/StoreContext';
import { X, Calendar, CheckCircle, MessageCircle, Clock, User, Phone, Mail } from 'lucide-react';
import confetti from 'canvas-confetti';

const BookingModal = ({ isOpen, onClose, preselectedService }) => {
  const { services, storeInfo, addBooking } = useStore();
  const [form, setForm] = useState({
    name: '', phone: '', email: '',
    service: '', date: '', time: '11:00 AM', message: ''
  });
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (!isOpen) return;
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    setForm(prev => ({
      ...prev,
      service: preselectedService?.name || preselectedService?.title || (services[0]?.name || ''),
      date: tomorrow.toISOString().split('T')[0]
    }));
  }, [isOpen, preselectedService, services]);

  if (!isOpen) return null;

  const slots = [
    '10:00 AM', '11:00 AM', '12:00 PM', '01:00 PM',
    '02:00 PM', '03:00 PM', '04:00 PM', '05:00 PM',
    '06:00 PM', '07:00 PM', '08:00 PM'
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name.trim() || !form.phone.trim()) {
      alert('Please share your name and phone number.');
      return;
    }
    setSubmitting(true);
    try {
      await addBooking({
        name: form.name.trim(),
        phone: form.phone.trim(),
        email: form.email.trim(),
        service: form.service,
        date: form.date,
        time: form.time,
        message: form.message.trim(),
        source: 'website'
      });

      try {
        confetti({
          particleCount: 70,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#c8975a', '#e0b478', '#f0e8d8']
        });
      } catch {}
      setSuccess(true);

      const phone = storeInfo?.whatsapp_number || '918985291053';
      const text = encodeURIComponent(
        `New appointment at Sri Madhuri Makeovers\n\n` +
        `Name: ${form.name}\nPhone: ${form.phone}\nService: ${form.service}\nDate: ${form.date}\nTime: ${form.time}\n` +
        (form.message ? `Notes: ${form.message}\n` : '') +
        `\nSent via website. Please confirm.`
      );
      setTimeout(() => window.open(`https://wa.me/${phone}?text=${text}`, '_blank'), 1000);
    } catch (err) {
      console.error(err);
      alert('Could not submit. Please try again or message us on WhatsApp.');
    } finally {
      setSubmitting(false);
    }
  };

  const reset = () => { setSuccess(false); onClose(); };

  return (
    <div className="modal-backdrop" onClick={reset}>
      <div
        className="modal-card"
        style={{
          width: '100%',
          maxWidth: '540px',
          padding: '1.75rem',
          borderRadius: 'var(--radius-lg)'
        }}
        onClick={e => e.stopPropagation()}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.25rem' }}>
          <div>
            <h3 style={{ fontSize: 'clamp(1.3rem, 4vw, 1.6rem)', color: 'var(--bone)', marginBottom: '4px' }}>
              {success ? 'Reservation Sent' : 'Reserve a Session'}
            </h3>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
              {success ? 'Check WhatsApp to confirm with our team.' : 'We will confirm your slot on WhatsApp within 2 hours.'}
            </p>
          </div>
          <button
            onClick={reset}
            style={{
              background: 'rgba(26, 38, 32, 0.6)',
              border: '1px solid var(--border-subtle)',
              color: 'var(--text-primary)',
              width: 38,
              height: 38,
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              flexShrink: 0
            }}
            aria-label="Close modal"
          >
            <X size={18} />
          </button>
        </div>

        {success ? (
          <div style={{ textAlign: 'center', padding: '1.5rem 0' }}>
            <div style={{ width: 60, height: 60, borderRadius: '50%', background: 'var(--success-bg)', color: 'var(--success)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.25rem', border: '1px solid var(--success)' }}>
              <CheckCircle size={30} />
            </div>
            <p style={{ color: 'var(--text-secondary)', maxWidth: 360, margin: '0 auto 1.25rem', lineHeight: 1.6, fontSize: '0.95rem' }}>
              Thank you, {form.name}. We have received your booking request for <strong style={{ color: 'var(--bone)' }}>{form.service}</strong> on {form.date} at {form.time}.
            </p>
            {form.email && (
              <p style={{ fontSize: '0.8rem', color: 'var(--amber-light)', maxWidth: 360, margin: '0 auto 1.5rem', background: 'rgba(200, 151, 90, 0.08)', padding: '0.65rem 1rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)', lineHeight: 1.4 }}>
                ✉️ A booking confirmation email will be delivered to <strong>{form.email}</strong> once our team confirms your appointment.
              </p>
            )}
            <button onClick={reset} className="btn btn-primary" style={{ width: '100%', maxWidth: 200 }}>
              Done
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <div className="admin-grid-2" style={{ marginBottom: '1rem' }}>
              <div className="form-group" style={{ margin: 0 }}>
                <label className="form-label">Your Name *</label>
                <div style={{ position: 'relative' }}>
                  <input
                    type="text"
                    required
                    placeholder="Full name"
                    value={form.name}
                    onChange={e => setForm({ ...form, name: e.target.value })}
                    className="form-input"
                    style={{ paddingLeft: '2.4rem' }}
                  />
                  <User size={15} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                </div>
              </div>

              <div className="form-group" style={{ margin: 0 }}>
                <label className="form-label">Phone (WhatsApp) *</label>
                <div style={{ position: 'relative' }}>
                  <input
                    type="tel"
                    required
                    placeholder="e.g. 9876543210"
                    value={form.phone}
                    onChange={e => setForm({ ...form, phone: e.target.value })}
                    className="form-input"
                    style={{ paddingLeft: '2.4rem' }}
                  />
                  <Phone size={15} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                </div>
              </div>
            </div>

            <div className="admin-grid-2" style={{ marginBottom: '1rem' }}>
              <div className="form-group" style={{ margin: 0 }}>
                <label className="form-label">Email Address (Optional)</label>
                <div style={{ position: 'relative' }}>
                  <input
                    type="email"
                    placeholder="you@email.com"
                    value={form.email}
                    onChange={e => setForm({ ...form, email: e.target.value })}
                    className="form-input"
                    style={{ paddingLeft: '2.4rem' }}
                  />
                  <Mail size={15} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                </div>
              </div>

              <div className="form-group" style={{ margin: 0 }}>
                <label className="form-label">Treatment</label>
                <select
                  value={form.service}
                  onChange={e => setForm({ ...form, service: e.target.value })}
                  className="form-select"
                >
                  {services.filter(s => s.is_active).map(s => (
                    <option key={s.id} value={s.name}>
                      {s.name} ({s.price})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="admin-grid-2" style={{ marginBottom: '1rem' }}>
              <div className="form-group" style={{ margin: 0 }}>
                <label className="form-label">Preferred Date *</label>
                <div style={{ position: 'relative' }}>
                  <input
                    type="date"
                    required
                    value={form.date}
                    onChange={e => setForm({ ...form, date: e.target.value })}
                    className="form-input"
                    style={{ paddingLeft: '2.4rem' }}
                  />
                  <Calendar size={15} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                </div>
              </div>

              <div className="form-group" style={{ margin: 0 }}>
                <label className="form-label">Preferred Time Slot *</label>
                <div style={{ position: 'relative' }}>
                  <select
                    value={form.time}
                    onChange={e => setForm({ ...form, time: e.target.value })}
                    className="form-select"
                    style={{ paddingLeft: '2.4rem' }}
                  >
                    {slots.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                  <Clock size={15} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                </div>
              </div>
            </div>

            <div className="form-group" style={{ marginBottom: '1.25rem' }}>
              <label className="form-label">Special Requests / Notes</label>
              <textarea
                rows={2}
                placeholder="Bridal attire colors, hair length, specific timing, etc."
                value={form.message}
                onChange={e => setForm({ ...form, message: e.target.value })}
                className="form-textarea"
                style={{ resize: 'none' }}
              />
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="btn btn-primary"
              style={{ width: '100%', padding: '0.95rem', gap: '8px', fontSize: '0.95rem' }}
            >
              {submitting ? 'Submitting...' : 'Confirm Reservation Request'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default BookingModal;
