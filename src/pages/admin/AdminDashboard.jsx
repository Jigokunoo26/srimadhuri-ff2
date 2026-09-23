import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { Calendar, CheckCircle, Clock, DollarSign, TrendingUp, Sparkles, MessageCircle, AlertCircle, ArrowRight, Mail } from 'lucide-react';

const AdminDashboard = ({ onNavigateTab }) => {
  const { bookings, services, incomeStats, updateBookingStatus } = useStore();
  const [actionFeedback, setActionFeedback] = useState(null);

  const recentBookings = bookings.slice(0, 6);

  const handleStatusChange = async (b, newStatus) => {
    const res = await updateBookingStatus(b.id, newStatus);
    if (newStatus === 'confirmed') {
      if (b.email && b.email.trim()) {
        const clientEmail = b.email.trim();
        if (res?.emailResult?.success) {
          setActionFeedback({ type: 'success', message: `Confirmed! Email dispatched to ${clientEmail}` });
        } else {
          setActionFeedback({ type: 'warning', message: `Marked confirmed. Email failed: ${res?.emailResult?.error || 'Check settings'}` });
        }
      } else {
        setActionFeedback({ type: 'info', message: `Confirmed. (No email provided by customer)` });
      }
    } else {
      setActionFeedback({ type: 'info', message: `Status updated to ${newStatus}` });
    }
    setTimeout(() => setActionFeedback(null), 5000);
  };

  return (
    <div>
      {/* Welcome Banner */}
      <div style={{ marginBottom: '1.75rem' }}>
        <h2 style={{ fontSize: 'clamp(1.5rem, 4.2vw, 2.2rem)', color: 'var(--text-primary)', marginBottom: '4px' }}>
          Vendor Overview & Revenue
        </h2>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem' }}>
          Live snapshot of salon performance, appointment requests, and earned revenue.
        </p>
      </div>

      {actionFeedback && (
        <div
          style={{
            padding: '10px 14px',
            borderRadius: 'var(--radius-sm)',
            marginBottom: '1.25rem',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            fontSize: '0.85rem',
            fontWeight: '500',
            background: actionFeedback.type === 'success' ? 'rgba(90, 155, 110, 0.15)' : 'rgba(90, 139, 194, 0.15)',
            border: `1px solid ${actionFeedback.type === 'success' ? 'var(--success)' : 'var(--info)'}`,
            color: actionFeedback.type === 'success' ? 'var(--success)' : 'var(--info)'
          }}
        >
          {actionFeedback.type === 'success' ? <CheckCircle size={16} /> : <Mail size={16} />}
          <span>{actionFeedback.message}</span>
        </div>
      )}

      {/* 4 Stat Cards: 2x2 on mobile, 4-col on desktop */}
      <div
        className="stats-grid-dashboard"
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '1.25rem',
          marginBottom: '2rem'
        }}
      >
        {/* Total Earned Revenue */}
        <div className="surface" style={{ padding: '1.25rem 1.4rem', borderLeft: '3px solid var(--amber)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 600 }}>
              Completed Revenue
            </span>
            <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'rgba(200, 151, 90, 0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--amber-light)' }}>
              <TrendingUp size={16} />
            </div>
          </div>
          <div style={{ fontSize: 'clamp(1.5rem, 4vw, 2rem)', fontWeight: '700', color: 'var(--amber-light)', fontFamily: 'Playfair Display, serif' }}>
            ₹{incomeStats.totalRevenue.toLocaleString()}
          </div>
          <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '2px' }}>
            From completed slots
          </div>
        </div>

        {/* Pending Approvals */}
        <div className="surface" style={{ padding: '1.25rem 1.4rem', borderLeft: '3px solid var(--warning)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 600 }}>
              Pending Approvals
            </span>
            <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'var(--warning-bg)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--warning)' }}>
              <Clock size={16} />
            </div>
          </div>
          <div style={{ fontSize: 'clamp(1.5rem, 4vw, 2rem)', fontWeight: '700', color: 'var(--warning)', fontFamily: 'Playfair Display, serif' }}>
            {incomeStats.pendingCount}
          </div>
          <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '2px' }}>
            Awaiting confirmation
          </div>
        </div>

        {/* Confirmed Bookings */}
        <div className="surface" style={{ padding: '1.25rem 1.4rem', borderLeft: '3px solid var(--info)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 600 }}>
              Confirmed Bookings
            </span>
            <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'var(--info-bg)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--info)' }}>
              <Calendar size={16} />
            </div>
          </div>
          <div style={{ fontSize: 'clamp(1.5rem, 4vw, 2rem)', fontWeight: '700', color: 'var(--info)', fontFamily: 'Playfair Display, serif' }}>
            {incomeStats.confirmedCount}
          </div>
          <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '2px' }}>
            Scheduled upcoming
          </div>
        </div>

        {/* Active Treatments */}
        <div className="surface" style={{ padding: '1.25rem 1.4rem', borderLeft: '3px solid var(--moss-light)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 600 }}>
              Live Treatments
            </span>
            <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'rgba(74, 107, 78, 0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--moss-light)' }}>
              <Sparkles size={16} />
            </div>
          </div>
          <div style={{ fontSize: 'clamp(1.5rem, 4vw, 2rem)', fontWeight: '700', color: 'var(--bone)', fontFamily: 'Playfair Display, serif' }}>
            {services.filter(s => s.is_active).length}
          </div>
          <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '2px' }}>
            Active in catalog
          </div>
        </div>
      </div>

      {/* Quick Links Grid */}
      <div
        className="quick-actions-grid"
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
          gap: '1rem',
          marginBottom: '2rem'
        }}
      >
        <div
          className="surface"
          onClick={() => onNavigateTab('services')}
          style={{ padding: '1.25rem 1.4rem', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}
        >
          <div>
            <h4 style={{ fontSize: '1.05rem', color: 'var(--text-primary)', marginBottom: '2px' }}>Customize Prices</h4>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Modify prices or add new treatments</p>
          </div>
          <ArrowRight size={16} color="var(--amber)" />
        </div>

        <div
          className="surface"
          onClick={() => onNavigateTab('bookings')}
          style={{ padding: '1.25rem 1.4rem', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}
        >
          <div>
            <h4 style={{ fontSize: '1.05rem', color: 'var(--text-primary)', marginBottom: '2px' }}>Manage Bookings</h4>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Approve, complete, or add walk-ins</p>
          </div>
          <ArrowRight size={16} color="var(--amber)" />
        </div>

        <div
          className="surface"
          onClick={() => onNavigateTab('settings')}
          style={{ padding: '1.25rem 1.4rem', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}
        >
          <div>
            <h4 style={{ fontSize: '1.05rem', color: 'var(--text-primary)', marginBottom: '2px' }}>Salon Information</h4>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Update WhatsApp, phone & hours</p>
          </div>
          <ArrowRight size={16} color="var(--amber)" />
        </div>
      </div>

      {/* Recent Bookings Feed */}
      <div className="surface" style={{ padding: '1.5rem 1.25rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '8px' }}>
          <div>
            <h3 style={{ fontSize: '1.25rem', color: 'var(--text-primary)' }}>Recent Appointment Requests</h3>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Latest leads requiring review</p>
          </div>
          <button onClick={() => onNavigateTab('bookings')} className="btn btn-ghost btn-sm">
            View All ({bookings.length})
          </button>
        </div>

        {/* Desktop / Tablet Table */}
        <div className="admin-table-container hide-on-mobile">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Date & Slot</th>
                <th>Client Name</th>
                <th>Service</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {recentBookings.map(b => (
                <tr key={b.id}>
                  <td>
                    <div style={{ fontWeight: '600' }}>{b.date}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--amber-light)' }}>{b.time}</div>
                  </td>
                  <td>
                    <div style={{ fontWeight: '600', color: 'var(--text-primary)' }}>{b.name}</div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '2px', flexWrap: 'wrap' }}>
                      <a
                        href={`https://wa.me/${b.phone.replace(/\D/g, '')}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{ color: '#25D366', fontSize: '0.78rem', display: 'flex', alignItems: 'center', gap: '4px' }}
                      >
                        <MessageCircle size={12} /> {b.phone}
                      </a>
                      {b.email && (
                        <span style={{ color: 'var(--amber-light)', fontSize: '0.75rem', display: 'flex', alignItems: 'center', gap: '3px' }} title={`Customer Email: ${b.email}`}>
                          <Mail size={11} /> {b.email}
                        </span>
                      )}
                    </div>
                  </td>
                  <td style={{ color: 'var(--text-secondary)' }}>{b.service}</td>
                  <td>
                    <span className={`badge badge-${b.status}`}>{b.status}</span>
                  </td>
                  <td>
                    <select
                      className="form-select"
                      style={{ padding: '6px 8px', fontSize: '0.8rem', width: '120px', margin: 0 }}
                      value={b.status}
                      onChange={e => handleStatusChange(b, e.target.value)}
                    >
                      <option value="pending">Pending</option>
                      <option value="confirmed">Confirmed</option>
                      <option value="completed">Completed</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile Booking Cards (< 768px) */}
        <div className="show-on-mobile" style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
          {recentBookings.map(b => (
            <div
              key={b.id}
              style={{
                background: 'var(--bg-tertiary)',
                borderRadius: 'var(--radius-sm)',
                padding: '1rem',
                border: '1px solid var(--border-subtle)',
                display: 'flex',
                flexDirection: 'column',
                gap: '8px'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <div style={{ fontWeight: '600', color: 'var(--text-primary)', fontSize: '0.95rem' }}>{b.name}</div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--amber-light)', marginTop: '2px' }}>{b.service}</div>
                </div>
                <span className={`badge badge-${b.status}`}>{b.status}</span>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.8rem', color: 'var(--text-muted)', paddingTop: '6px', borderTop: '1px solid var(--border-subtle)' }}>
                <span>{b.date} · {b.time}</span>
                <a
                  href={`https://wa.me/${b.phone.replace(/\D/g, '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ color: '#25D366', display: 'flex', alignItems: 'center', gap: '4px', fontWeight: 500 }}
                >
                  <MessageCircle size={14} /> WhatsApp
                </a>
              </div>

              <div style={{ display: 'flex', gap: '8px', alignItems: 'center', marginTop: '4px' }}>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Status:</span>
                <select
                  className="form-select"
                  style={{ padding: '6px 8px', fontSize: '0.85rem', flexGrow: 1, margin: 0 }}
                  value={b.status}
                  onChange={e => handleStatusChange(b, e.target.value)}
                >
                  <option value="pending">⏳ Pending</option>
                  <option value="confirmed">✅ Confirmed</option>
                  <option value="completed">✨ Completed</option>
                  <option value="cancelled">❌ Cancelled</option>
                </select>
              </div>
            </div>
          ))}
        </div>
      </div>

      <style>{`
        @media (max-width: 600px) {
          .stats-grid-dashboard {
            grid-template-columns: repeat(2, 1fr) !important;
            gap: 0.75rem !important;
          }
          .stats-grid-dashboard > div {
            padding: 1rem 0.9rem !important;
          }
        }
      `}</style>
    </div>
  );
};

export default AdminDashboard;
