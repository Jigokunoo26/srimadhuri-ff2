import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { Plus, Search, Filter, Download, MessageCircle, Calendar, Clock, User, Phone, CheckCircle, XCircle, AlertCircle, Mail, Send, Check } from 'lucide-react';

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

    const created = await addBooking({
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
      service: services[0]?.name || '',
      date: new Date().toISOString().split('T')[0],
      time: '11:00 AM',
      amount: '',
      notes: ''
    });
  };

  const exportCSV = () => {
    const headers = ['ID,Customer Name,Phone,Email,Service,Date,Time,Amount,Status,Source,Created At\n'];
    const rows = filteredBookings.map(b => (
      `"${b.id}","${b.name}","${b.phone}","${b.email || ''}","${b.service}","${b.date}","${b.time}","${b.amount || 0}","${b.status}","${b.source || 'website'}","${b.created_at}"\n`
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
      <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
        <div>
          <h2 style={{ fontSize: '2rem', color: 'var(--text-primary)', marginBottom: '4px' }}>
            Appointments & Client Leads Central
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
            Live status management for client leads. Changing status to Confirmed automatically sends a confirmation email to clients with an email on file.
          </p>
        </div>
        <div style={{ display: 'flex', gap: '10px' }}>
          <button onClick={exportCSV} className="btn btn-outline" style={{ gap: '8px' }}>
            <Download size={16} /> Export CSV
          </button>
          <button onClick={() => setShowAddModal(true)} className="btn btn-primary" style={{ gap: '8px' }}>
            <Plus size={18} /> Add Walk-in / Phone Client
          </button>
        </div>
      </div>

      {/* Action Notification Banner */}
      {actionFeedback && (
        <div
          style={{
            padding: '12px 18px',
            borderRadius: 'var(--radius-sm)',
            marginBottom: '1.5rem',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            fontSize: '0.9rem',
            fontWeight: '500',
            animation: 'fadeIn 0.2s ease-in',
            background:
              actionFeedback.type === 'success'
                ? 'rgba(16, 185, 129, 0.15)'
                : actionFeedback.type === 'warning'
                ? 'rgba(245, 158, 11, 0.15)'
                : 'rgba(59, 130, 246, 0.15)',
            border:
              actionFeedback.type === 'success'
                ? '1px solid #10b981'
                : actionFeedback.type === 'warning'
                ? '1px solid #f59e0b'
                : '1px solid #3b82f6',
            color:
              actionFeedback.type === 'success'
                ? '#10b981'
                : actionFeedback.type === 'warning'
                ? '#f59e0b'
                : '#60a5fa'
          }}
        >
          {actionFeedback.type === 'success' && <CheckCircle size={18} />}
          {actionFeedback.type === 'warning' && <AlertCircle size={18} />}
          {actionFeedback.type === 'info' && <Mail size={18} />}
          <span>{actionFeedback.message}</span>
        </div>
      )}

      {/* Filter and Search Bar */}
      <div
        className="glass-card"
        style={{
          padding: '1.25rem',
          marginBottom: '1.75rem',
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '1rem'
        }}
      >
        {/* Status Tabs */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
          {['all', 'pending', 'confirmed', 'completed', 'cancelled'].map(st => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              style={{
                padding: '6px 14px',
                borderRadius: 'var(--radius-full)',
                fontSize: '0.82rem',
                fontWeight: '600',
                textTransform: 'capitalize',
                cursor: 'pointer',
                border: '1px solid',
                background: statusFilter === st ? 'var(--gold-gradient)' : 'rgba(255, 255, 255, 0.04)',
                borderColor: statusFilter === st ? 'var(--gold-primary)' : 'var(--border-subtle)',
                color: statusFilter === st ? '#080c16' : 'var(--text-secondary)'
              }}
            >
              {st} {st === 'pending' && `(${bookings.filter(b => b.status === 'pending').length})`}
            </button>
          ))}
        </div>

        {/* Search Input */}
        <div style={{ position: 'relative', width: '100%', maxWidth: '300px' }}>
          <input
            type="text"
            className="form-input"
            style={{ paddingLeft: '2.4rem', paddingRight: '1rem', fontSize: '0.86rem' }}
            placeholder="Search by client, phone, or email..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
          />
          <Search size={15} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
        </div>
      </div>

      {/* Bookings Table */}
      <div className="admin-table-container">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Date & Slot</th>
              <th>Customer</th>
              <th>Service</th>
              <th>Amount</th>
              <th>Source</th>
              <th>Current Status</th>
              <th style={{ textAlign: 'right' }}>Update Status / Email</th>
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
                    <div style={{ fontSize: '0.78rem', color: 'var(--gold-light)', display: 'flex', alignItems: 'center', gap: '4px', marginTop: '2px' }}>
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
                        title="Chat with customer on WhatsApp"
                      >
                        <MessageCircle size={13} /> {b.phone}
                      </a>
                      {b.email && (
                        <span style={{ color: 'var(--gold-light)', fontSize: '0.78rem', display: 'flex', alignItems: 'center', gap: '3px' }} title={`Customer Email: ${b.email}`}>
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
                  <td style={{ fontWeight: '700', color: 'var(--gold-light)' }}>
                    ₹{Number(b.amount || 0).toLocaleString()}
                  </td>

                  {/* Source */}
                  <td>
                    <span style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--text-muted)', background: 'rgba(255,255,255,0.05)', padding: '2px 8px', borderRadius: '4px' }}>
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
                            background: 'rgba(212, 175, 55, 0.08)',
                            border: '1px solid var(--border-subtle)',
                            borderRadius: 'var(--radius-sm)',
                            padding: '3px 8px',
                            fontSize: '0.72rem',
                            color: 'var(--gold-light)',
                            cursor: 'pointer',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '4px',
                            transition: 'var(--transition)'
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

      {/* Manual Booking Modal */}
      {showAddModal && (
        <div className="modal-backdrop" onClick={() => setShowAddModal(false)}>
          <div className="modal-card" onClick={e => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <h3 style={{ fontSize: '1.6rem', color: 'var(--text-primary)' }}>Record Walk-in / Phone Client</h3>
              <button onClick={() => setShowAddModal(false)} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
                ✕
              </button>
            </div>

            <form onSubmit={handleAddManualBooking}>
              <div className="form-group">
                <label className="form-label">Customer Name *</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="Client name"
                  value={manualBooking.name}
                  onChange={e => setManualBooking({ ...manualBooking, name: e.target.value })}
                  required
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="form-group">
                  <label className="form-label">Phone Number *</label>
                  <input
                    type="tel"
                    className="form-input"
                    placeholder="10-digit number"
                    value={manualBooking.phone}
                    onChange={e => setManualBooking({ ...manualBooking, phone: e.target.value })}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Customer Email (optional)</label>
                  <input
                    type="email"
                    className="form-input"
                    placeholder="For confirmation receipt"
                    value={manualBooking.email}
                    onChange={e => setManualBooking({ ...manualBooking, email: e.target.value })}
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Service</label>
                <select
                  className="form-select"
                  value={manualBooking.service}
                  onChange={e => setManualBooking({ ...manualBooking, service: e.target.value })}
                >
                  {services.map(s => <option key={s.id} value={s.name}>{s.name} ({s.price})</option>)}
                </select>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' }}>
                <div className="form-group">
                  <label className="form-label">Date</label>
                  <input
                    type="date"
                    className="form-input"
                    value={manualBooking.date}
                    onChange={e => setManualBooking({ ...manualBooking, date: e.target.value })}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Time</label>
                  <input
                    type="text"
                    className="form-input"
                    value={manualBooking.time}
                    placeholder="11:00 AM"
                    onChange={e => setManualBooking({ ...manualBooking, time: e.target.value })}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Amount (₹)</label>
                  <input
                    type="number"
                    className="form-input"
                    placeholder="e.g. 15000"
                    value={manualBooking.amount}
                    onChange={e => setManualBooking({ ...manualBooking, amount: e.target.value })}
                  />
                </div>
              </div>

              <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '1rem', padding: '0.85rem' }}>
                Save Appointment & Confirm
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminBookings;
