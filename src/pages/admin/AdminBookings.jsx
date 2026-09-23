import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { Plus, Search, Filter, Download, MessageCircle, Calendar, Clock, User, Phone, CheckCircle, XCircle, AlertCircle, Mail, Send, Check, X } from 'lucide-react';

const AdminBookings = () => {
  const { bookings, updateBookingStatus, addBooking, sendConfirmationEmailForBooking, services } = useStore();
  const [statusFilter, setStatusFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [actionFeedback, setActionFeedback] = useState(null);
  const [sendingEmailId, setSendingEmailId] = useState(null);
  const [manualBooking, setManualBooking] = useState({
    name: '',
    phone: '',
    email: '',
    service: services[0]?.name || 'Bridal HD Airbrush Makeup',
    date: new Date().toISOString().split('T')[0],
    time: '11:00 AM',
    amount: '',
    notes: ''
  });

  const filteredBookings = bookings.filter(b => {
    const matchesStatus = statusFilter === 'all' || b.status === statusFilter;
    const matchesSearch =
      b.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.phone?.includes(searchTerm) ||
      b.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.service?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const handleStatusChange = async (id, newStatus) => {
    const booking = bookings.find(b => b.id === id);
    const result = await updateBookingStatus(id, newStatus);

    if (newStatus === 'confirmed') {
      if (booking?.email && booking.email.trim()) {
        const clientEmail = booking.email.trim();
        if (result?.emailResult?.success) {
          setActionFeedback({
            type: 'success',
            message: `Appointment confirmed! Confirmation email dispatched to client: ${clientEmail}`
          });
        } else {
          setActionFeedback({
            type: 'warning',
            message: `Appointment confirmed, but email delivery to ${clientEmail} failed: ${result?.emailResult?.error || 'Check EmailJS configuration'}`
          });
        }
      } else {
        setActionFeedback({
          type: 'info',
          message: `Appointment confirmed. (No email provided by customer — connect via WhatsApp)`
        });
      }
    } else {
      setActionFeedback({
        type: 'info',
        message: `Status updated to ${newStatus}.`
      });
    }

    setTimeout(() => setActionFeedback(null), 6000);
  };

  const handleManualEmailSend = async (booking) => {
    if (!booking.email || !booking.email.trim()) {
      alert('This customer did not provide an email address.');
      return;
    }
    const clientEmail = booking.email.trim();
    setSendingEmailId(booking.id);
    const res = await sendConfirmationEmailForBooking(booking);
    setSendingEmailId(null);
    if (res?.success) {
      setActionFeedback({
        type: 'success',
        message: `Confirmation email dispatched to ${clientEmail}!`
      });
    } else {
      setActionFeedback({
        type: 'warning',
        message: `Email delivery to ${clientEmail} failed: ${res?.error || 'Please check EmailJS settings'}`
      });
    }
    setTimeout(() => setActionFeedback(null), 6000);
  };

  const handleAddManualBooking = async (e) => {
    e.preventDefault();
    if (!manualBooking.name || !manualBooking.phone) {
      alert('Please fill out customer name and phone number.');
      return;
    }

    await addBooking({
      ...manualBooking,
      email: manualBooking.email.trim(),
      amount: Number(manualBooking.amount) || 0,
      source: 'manual',
      status: 'confirmed'
    });

    if (manualBooking.email.trim()) {
      setActionFeedback({
        type: 'success',
        message: `Walk-in appointment recorded and confirmation email dispatched to ${manualBooking.email.trim()}!`
      });
      setTimeout(() => setActionFeedback(null), 6000);
    }

    setShowAddModal(false);
    setManualBooking({
      name: '',
      phone: '',
      email: '',
      service: services[0]?.name || 'Bridal HD Airbrush Makeup',
      date: new Date().toISOString().split('T')[0],
      time: '11:00 AM',
      amount: '',
      notes: ''
    });
  };

  const exportCSV = () => {
    const headers = 'ID,Name,Phone,Email,Service,Date,Time,Amount,Status,Source,Created\n';
    const rows = bookings.map(b => (
      `"${b.id}","${b.name}","${b.phone}","${b.email || ''}","${b.service}","${b.date}","${b.time}","${b.amount || 0}","${b.status}","${b.source || 'website'}","${b.created_at || ''}"\n`
    ));
    const blob = new Blob([headers, ...rows], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `sri_madhuri_bookings_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  return (
    <div>
      {/* Header */}
      <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
        <div>
          <h2 style={{ fontSize: 'clamp(1.5rem, 4vw, 2rem)', color: 'var(--text-primary)', marginBottom: '4px' }}>
            Bookings & Client Leads
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.86rem' }}>
            Live status management. Approving a booking automatically dispatches an EmailJS confirmation to clients.
          </p>
        </div>
        <div className="bookings-header-actions" style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', width: 'auto' }}>
          <button onClick={exportCSV} className="btn btn-ghost btn-sm" style={{ gap: '6px' }}>
            <Download size={14} /> Export CSV
          </button>
          <button onClick={() => setShowAddModal(true)} className="btn btn-primary btn-sm" style={{ gap: '6px' }}>
            <Plus size={16} /> Add Walk-in
          </button>
        </div>
      </div>

      {/* Action Notification Banner */}
      {actionFeedback && (
        <div
          style={{
            padding: '10px 14px',
            borderRadius: 'var(--radius-sm)',
            marginBottom: '1.25rem',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            fontSize: '0.86rem',
            fontWeight: '500',
            background:
              actionFeedback.type === 'success'
                ? 'rgba(90, 155, 110, 0.15)'
                : actionFeedback.type === 'warning'
                ? 'rgba(212, 162, 58, 0.15)'
                : 'rgba(90, 139, 194, 0.15)',
            border: `1px solid ${
              actionFeedback.type === 'success'
                ? 'var(--success)'
                : actionFeedback.type === 'warning'
                ? 'var(--warning)'
                : 'var(--info)'
            }`,
            color:
              actionFeedback.type === 'success'
                ? 'var(--success)'
                : actionFeedback.type === 'warning'
                ? 'var(--warning)'
                : 'var(--info)'
          }}
        >
          {actionFeedback.type === 'success' && <CheckCircle size={16} />}
          {actionFeedback.type === 'warning' && <AlertCircle size={16} />}
          {actionFeedback.type === 'info' && <Mail size={16} />}
          <span>{actionFeedback.message}</span>
        </div>
      )}

      {/* Filter and Search Bar */}
      <div
        className="surface"
        style={{
          padding: '1.1rem 1.25rem',
          marginBottom: '1.5rem',
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '1rem',
          borderRadius: 'var(--radius-md)'
        }}
      >
        {/* Status Tabs (Swipeable on mobile) */}
        <div className="mobile-scroll-x" style={{ margin: 0, padding: 0 }}>
          {['all', 'pending', 'confirmed', 'completed', 'cancelled'].map(st => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              style={{
                padding: '6px 14px',
                borderRadius: 'var(--radius-full)',
                fontSize: '0.8rem',
                fontWeight: 500,
                cursor: 'pointer',
                border: '1px solid',
                textTransform: 'capitalize',
                background: statusFilter === st ? 'var(--bg-tertiary)' : 'transparent',
                borderColor: statusFilter === st ? 'var(--amber)' : 'transparent',
                color: statusFilter === st ? 'var(--amber-light)' : 'var(--text-muted)',
                whiteSpace: 'nowrap',
                transition: 'var(--transition)'
              }}
            >
              {st} ({st === 'all' ? bookings.length : bookings.filter(b => b.status === st).length})
            </button>
          ))}
        </div>

        {/* Search Input */}
        <div style={{ position: 'relative', width: '100%', maxWidth: '300px' }} className="booking-search-box">
          <input
            type="text"
            className="form-input"
            style={{ padding: '0.65rem 1rem 0.65rem 2.2rem', fontSize: '0.85rem' }}
            placeholder="Search by name, phone, service..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
          />
          <Search size={14} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
        </div>
      </div>

      {/* DESKTOP TABLE VIEW (Screens >= 768px) */}
      <div className="admin-table-container hide-on-mobile">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Date & Slot</th>
              <th>Client Information</th>
              <th>Service</th>
              <th>Amount</th>
              <th>Source</th>
              <th>Status</th>
              <th style={{ textAlign: 'right' }}>Update / Email</th>
            </tr>
          </thead>
          <tbody>
            {filteredBookings.length === 0 ? (
              <tr>
                <td colSpan="7" style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
                  No bookings found matching the selected filter.
                </td>
              </tr>
            ) : (
              filteredBookings.map(b => (
                <tr key={b.id}>
                  {/* Date & Slot */}
                  <td>
                    <div style={{ fontWeight: '600', color: 'var(--text-primary)' }}>{b.date}</div>
                    <div style={{ fontSize: '0.78rem', color: 'var(--amber-light)', display: 'flex', alignItems: 'center', gap: '4px', marginTop: '2px' }}>
                      <Clock size={12} /> {b.time}
                    </div>
                  </td>

                  {/* Customer Info */}
                  <td>
                    <div style={{ fontWeight: '600', color: 'var(--text-primary)' }}>{b.name}</div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '3px', flexWrap: 'wrap' }}>
                      <a
                        href={`https://wa.me/${b.phone.replace(/\D/g, '')}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{ color: '#25D366', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '3px' }}
                      >
                        <MessageCircle size={13} /> {b.phone}
                      </a>
                      {b.email && (
                        <span style={{ color: 'var(--amber-light)', fontSize: '0.78rem', display: 'flex', alignItems: 'center', gap: '3px' }} title={`Customer Email: ${b.email}`}>
                          <Mail size={12} /> {b.email}
                        </span>
                      )}
                    </div>
                    {b.message && (
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '2px', maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }} title={b.message}>
                        Note: {b.message}
                      </div>
                    )}
                  </td>

                  {/* Service */}
                  <td style={{ fontWeight: '500', color: 'var(--text-primary)' }}>
                    {b.service}
                  </td>

                  {/* Amount */}
                  <td style={{ fontWeight: '700', color: 'var(--amber-light)' }}>
                    ₹{Number(b.amount || 0).toLocaleString()}
                  </td>

                  {/* Source */}
                  <td>
                    <span style={{ fontSize: '0.72rem', textTransform: 'uppercase', color: 'var(--text-muted)', background: 'rgba(255,255,255,0.05)', padding: '2px 8px', borderRadius: '4px' }}>
                      {b.source || 'website'}
                    </span>
                  </td>

                  {/* Status Badge */}
                  <td>
                    <span className={`badge badge-${b.status}`}>
                      {b.status}
                    </span>
                  </td>

                  {/* Status Dropdown Action & Email Controls */}
                  <td style={{ textAlign: 'right' }}>
                    <div style={{ display: 'inline-flex', flexDirection: 'column', alignItems: 'flex-end', gap: '5px' }}>
                      <select
                        className="form-select"
                        style={{ padding: '6px 10px', fontSize: '0.8rem', width: '130px', margin: 0 }}
                        value={b.status}
                        onChange={e => handleStatusChange(b.id, e.target.value)}
                      >
                        <option value="pending">⏳ Pending</option>
                        <option value="confirmed">✅ Confirmed</option>
                        <option value="completed">✨ Completed</option>
                        <option value="cancelled">❌ Cancelled</option>
                      </select>

                      {b.email && (
                        <button
                          type="button"
                          onClick={() => handleManualEmailSend(b)}
                          disabled={sendingEmailId === b.id}
                          style={{
                            background: 'rgba(200, 151, 90, 0.08)',
                            border: '1px solid var(--border-subtle)',
                            borderRadius: 'var(--radius-sm)',
                            padding: '3px 8px',
                            fontSize: '0.72rem',
                            color: 'var(--amber-light)',
                            cursor: 'pointer',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '4px'
                          }}
                          title={`Dispatch confirmation email to ${b.email}`}
                        >
                          <Mail size={11} /> {sendingEmailId === b.id ? 'Sending...' : 'Send Mail'}
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* DEDICATED MOBILE CARD VIEW (Screens < 768px) */}
      <div className="show-on-mobile" style={{ display: 'flex', flexDirection: 'column', gap: '0.9rem' }}>
        {filteredBookings.length === 0 ? (
          <div className="surface" style={{ padding: '3rem 1.5rem', textAlign: 'center', color: 'var(--text-muted)' }}>
            No bookings found matching filter.
          </div>
        ) : (
          filteredBookings.map(b => (
            <div
              key={b.id}
              className="surface"
              style={{
                padding: '1.25rem',
                display: 'flex',
                flexDirection: 'column',
                gap: '10px',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--border-subtle)'
              }}
            >
              {/* Top Row: Client & Status */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <div style={{ fontWeight: '600', color: 'var(--bone)', fontSize: '1.05rem' }}>
                    {b.name}
                  </div>
                  <div style={{ fontSize: '0.85rem', color: 'var(--amber-light)', marginTop: '2px', fontWeight: 500 }}>
                    {b.service}
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <span className={`badge badge-${b.status}`}>
                    {b.status}
                  </span>
                  <div style={{ fontWeight: '700', color: 'var(--bone)', fontSize: '1.1rem', marginTop: '4px' }}>
                    ₹{Number(b.amount || 0).toLocaleString()}
                  </div>
                </div>
              </div>

              {/* Middle Row: Date, Slot & Source */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.82rem', color: 'var(--text-muted)', paddingTop: '6px', borderTop: '1px solid var(--border-subtle)' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <Clock size={13} style={{ color: 'var(--amber-light)' }} /> {b.date} · {b.time}
                </span>
                <span style={{ fontSize: '0.72rem', textTransform: 'uppercase', background: 'rgba(255,255,255,0.05)', padding: '2px 8px', borderRadius: '4px' }}>
                  {b.source || 'website'}
                </span>
              </div>

              {/* Direct Communication Strip */}
              <div style={{ display: 'flex', gap: '12px', alignItems: 'center', flexWrap: 'wrap', fontSize: '0.85rem' }}>
                <a
                  href={`https://wa.me/${b.phone.replace(/\D/g, '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ color: '#25D366', display: 'flex', alignItems: 'center', gap: '4px', fontWeight: 500 }}
                >
                  <MessageCircle size={15} /> {b.phone}
                </a>
                {b.email && (
                  <span style={{ color: 'var(--amber-light)', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <Mail size={13} /> {b.email}
                  </span>
                )}
              </div>

              {b.message && (
                <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', background: 'rgba(0,0,0,0.2)', padding: '6px 10px', borderRadius: '4px' }}>
                  Note: {b.message}
                </div>
              )}

              {/* Action Dropdown & Email Trigger */}
              <div style={{ display: 'flex', gap: '8px', alignItems: 'center', paddingTop: '8px', borderTop: '1px solid var(--border-subtle)' }}>
                <select
                  className="form-select"
                  style={{ padding: '8px 10px', fontSize: '0.88rem', flexGrow: 1, margin: 0 }}
                  value={b.status}
                  onChange={e => handleStatusChange(b.id, e.target.value)}
                >
                  <option value="pending">⏳ Pending</option>
                  <option value="confirmed">✅ Confirmed</option>
                  <option value="completed">✨ Completed</option>
                  <option value="cancelled">❌ Cancelled</option>
                </select>

                {b.email && (
                  <button
                    type="button"
                    onClick={() => handleManualEmailSend(b)}
                    disabled={sendingEmailId === b.id}
                    className="btn btn-ghost btn-sm"
                    style={{ gap: '4px', padding: '8px 12px' }}
                    title="Send confirmation email"
                  >
                    <Mail size={13} /> {sendingEmailId === b.id ? 'Sending...' : 'Email'}
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Manual Booking Modal */}
      {showAddModal && (
        <div className="modal-backdrop" onClick={() => setShowAddModal(false)}>
          <div className="modal-card" style={{ maxWidth: '520px' }} onClick={e => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
              <h3 style={{ color: 'var(--bone)', fontSize: '1.25rem' }}>
                Add Walk-in or Phone Client
              </h3>
              <button
                onClick={() => setShowAddModal(false)}
                style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleAddManualBooking}>
              <div className="admin-grid-2" style={{ marginBottom: '1rem' }}>
                <div className="form-group" style={{ margin: 0 }}>
                  <label className="form-label">Customer Name *</label>
                  <input
                    type="text"
                    required
                    className="form-input"
                    value={manualBooking.name}
                    onChange={e => setManualBooking({ ...manualBooking, name: e.target.value })}
                  />
                </div>
                <div className="form-group" style={{ margin: 0 }}>
                  <label className="form-label">Phone Number *</label>
                  <input
                    type="tel"
                    required
                    className="form-input"
                    value={manualBooking.phone}
                    onChange={e => setManualBooking({ ...manualBooking, phone: e.target.value })}
                  />
                </div>
              </div>

              <div className="admin-grid-2" style={{ marginBottom: '1rem' }}>
                <div className="form-group" style={{ margin: 0 }}>
                  <label className="form-label">Email (Optional)</label>
                  <input
                    type="email"
                    className="form-input"
                    value={manualBooking.email}
                    onChange={e => setManualBooking({ ...manualBooking, email: e.target.value })}
                    placeholder="Sends instant booking email"
                  />
                </div>
                <div className="form-group" style={{ margin: 0 }}>
                  <label className="form-label">Treatment</label>
                  <select
                    className="form-select"
                    value={manualBooking.service}
                    onChange={e => setManualBooking({ ...manualBooking, service: e.target.value })}
                  >
                    {services.map(s => <option key={s.id} value={s.name}>{s.name} ({s.price})</option>)}
                  </select>
                </div>
              </div>

              <div className="admin-grid-2" style={{ marginBottom: '1rem' }}>
                <div className="form-group" style={{ margin: 0 }}>
                  <label className="form-label">Date</label>
                  <input
                    type="date"
                    required
                    className="form-input"
                    value={manualBooking.date}
                    onChange={e => setManualBooking({ ...manualBooking, date: e.target.value })}
                  />
                </div>
                <div className="form-group" style={{ margin: 0 }}>
                  <label className="form-label">Time</label>
                  <input
                    type="text"
                    className="form-input"
                    value={manualBooking.time}
                    placeholder="e.g. 11:30 AM"
                    onChange={e => setManualBooking({ ...manualBooking, time: e.target.value })}
                  />
                </div>
              </div>

              <div className="form-group" style={{ marginBottom: '1.25rem' }}>
                <label className="form-label">Estimated Bill / Amount (₹)</label>
                <input
                  type="number"
                  className="form-input"
                  value={manualBooking.amount}
                  placeholder="e.g. 2999"
                  onChange={e => setManualBooking({ ...manualBooking, amount: e.target.value })}
                />
              </div>

              <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end', marginTop: '1.5rem' }}>
                <button type="button" onClick={() => setShowAddModal(false)} className="btn btn-ghost">
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary" style={{ gap: '6px' }}>
                  <Plus size={16} /> Save Appointment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <style>{`
        @media (max-width: 640px) {
          .bookings-header-actions {
            width: 100% !important;
          }
          .bookings-header-actions button {
            flex-grow: 1 !important;
            justify-content: center !important;
          }
          .booking-search-box {
            max-width: 100% !important;
          }
        }
      `}</style>
    </div>
  );
};

export default AdminBookings;
