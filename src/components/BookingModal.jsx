import React, { useState, useEffect } from 'react';
import { useStore } from '../context/StoreContext';
import { X, Calendar, CheckCircle, MessageCircle } from 'lucide-react';
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

  const slots = ['10:00 AM', '10:30 AM', '11:00 AM', '11:30 AM', '12:00 PM', '12:30 PM', '01:00 PM', '02:00 PM', '03:00 PM', '04:00 PM', '05:00 PM', '06:00 PM', '07:00 PM', '08:00 PM'];

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

      try { confetti({ particleCount: 70, spread: 70, origin: { y: 0.6 }, colors: ['#c8975a', '#e0b478', '#f0e8d8'] }); } catch {}
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
      <div className="modal-card" onClick={e => e.stopPropagation()}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem' }}>
          <div>
            <h3 style={{ fontSize: '1.6rem', color: 'var(--bone)', marginBottom: '4px' }}>
              {success ? 'Reservation sent' : 'Reserve a session'}
            </h3>
            <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)' }}>
              {success ? 'Check WhatsApp to confirm with our team.' : 'We will confirm your slot on WhatsApp within 2 hours.'}
            </p>
          </div>
          <button onClick={reset} style={{ background: 'transparent', border: '1px solid var(--border-subtle)', color: 'var(--text-primary)', width: 36, height: 36, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
            <X size={18} />
          </button>
        </div>

        {success ? (
          <div style={{ textAlign: 'center', padding: '2rem 0' }}>
            <div style={{ width: 64, height: 64, borderRadius: '50%', background: 'var(--success-bg)', color: 'var(--success)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem', border: '1px solid var(--success)' }}>
              <CheckCircle size={32} />
            </div>
            <p style={{ color: 'var(--text-secondary)', maxWidth: 360, margin: '0 auto 1.25rem', lineHeight: 1.6 }}>
              Thank you, {form.name}. We have noted your interest in <em style={{ color: 'var(--bone)' }}>{form.service}</em> on {form.date} at {form.time}.
            </p>
            {form.email && (
              <p style={{ fontSize: '0.82rem', color: 'var(--gold-light)', maxWidth: 360, margin: '0 auto 1.75rem', background: 'rgba(212, 175, 55, 0.08)', padding: '0.65rem 1rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)', lineHeight: 1.4 }}>
                ✉️ A booking confirmation email will be delivered to <strong>{form.email}</strong> once our team confirms your appointment.
              </p>
            )}
            <button onClick={reset} className="btn btn-primary" style={{ minWidth: 160 }}>Done</button>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">Service</label>
              <select className="form-select" value={form.service} onChange={e => setForm({ ...form, service: e.target.value })} required>
                {services.filter(s => s.is_active).map(s => (
                  <option key={s.id} value={s.name}>
                    {s.name} ({s.price})
                  </option>
                ))}
              </select>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div className="form-group">
                <label className="form-label">Date</label>
                <input type="date" className="form-input" value={form.date} onChange={e => setForm({ ...form, date: e.target.value })} required />
              </div>
              <div className="form-group">
                <label className="form-label">Time</label>
                <select className="form-select" value={form.time} onChange={e => setForm({ ...form, time: e.target.value })}>
                  {slots.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div className="form-group">
                <label className="form-label">Your name</label>
                <input type="text" className="form-input" placeholder="Sravani Devi" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required />
              </div>
              <div className="form-group">
                <label className="form-label">WhatsApp number</label>
                <input type="tel" className="form-input" placeholder="98765 43210" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} required />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Email (optional)</label>
              <input type="email" className="form-input" placeholder="For the confirmation receipt" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} />
            </div>

            <div className="form-group">
              <label className="form-label">Notes for the team</label>
              <textarea className="form-textarea" rows="2" placeholder="Saree drape preference, sensitivities, occasion details..." value={form.message} onChange={e => setForm({ ...form, message: e.target.value })} />
            </div>

            <button type="submit" disabled={submitting} className="btn btn-primary" style={{ width: '100%', marginTop: '0.5rem' }}>
              <Calendar size={16} /> {submitting ? 'Sending...' : 'Reserve & open WhatsApp'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default BookingModal;
