import React from 'react';
import { useStore } from '../../context/StoreContext';
import { Calendar, CheckCircle, Clock, DollarSign, TrendingUp, Sparkles, MessageCircle, AlertCircle, ArrowRight } from 'lucide-react';

const AdminDashboard = ({ onNavigateTab }) => {
  const { bookings, services, incomeStats, updateBookingStatus } = useStore();

  const recentBookings = bookings.slice(0, 6);

  return (
    <div>
      {/* Welcome Banner */}
      <div style={{ marginBottom: '2.5rem' }}>
        <h2 style={{ fontSize: '2.2rem', color: 'var(--text-primary)', marginBottom: '6px' }}>
          Vendor Overview & Revenue
        </h2>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>
          Live snapshot of salon performance, appointment requests, and earned revenue.
        </p>
      </div>

      {/* 4 Stat Cards */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '1.5rem',
          marginBottom: '2.5rem'
        }}
      >
        {/* Total Earned Revenue */}
        <div className="glass-card" style={{ padding: '1.75rem', borderLeft: '4px solid var(--gold-primary)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              Completed Revenue
            </span>
            <div style={{ width: '38px', height: '38px', borderRadius: '50%', background: 'rgba(212,175,55,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--gold-primary)' }}>
              <TrendingUp size={18} />
            </div>
          </div>
          <div style={{ fontSize: '2.2rem', fontWeight: '700', color: 'var(--gold-light)', fontFamily: 'Cormorant Garamond, serif' }}>
            ₹{incomeStats.totalRevenue.toLocaleString()}
          </div>
          <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '4px' }}>
            Auto-calculated from completed appointments
          </div>
        </div>

        {/* Pending Approvals */}
        <div className="glass-card" style={{ padding: '1.75rem', borderLeft: '4px solid var(--warning)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              Pending Approvals
            </span>
            <div style={{ width: '38px', height: '38px', borderRadius: '50%', background: 'var(--warning-bg)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--warning)' }}>
              <Clock size={18} />
            </div>
          </div>
          <div style={{ fontSize: '2.2rem', fontWeight: '700', color: 'var(--warning)' }}>
            {incomeStats.pendingBookings}
          </div>
          <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '4px' }}>
            Awaiting confirmation
          </div>
        </div>

        {/* Today's Appointments */}
        <div className="glass-card" style={{ padding: '1.75rem', borderLeft: '4px solid var(--info)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              Today's Bookings
            </span>
            <div style={{ width: '38px', height: '38px', borderRadius: '50%', background: 'var(--info-bg)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--info)' }}>
              <Calendar size={18} />
            </div>
          </div>
          <div style={{ fontSize: '2.2rem', fontWeight: '700', color: 'var(--info)' }}>
            {incomeStats.todayBookings}
          </div>
          <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '4px' }}>
            Scheduled for today
          </div>
        </div>

        {/* Total Services */}
        <div className="glass-card" style={{ padding: '1.75rem', borderLeft: '4px solid var(--success)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              Catalog Services
            </span>
            <div style={{ width: '38px', height: '38px', borderRadius: '50%', background: 'var(--success-bg)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--success)' }}>
              <Sparkles size={18} />
            </div>
          </div>
          <div style={{ fontSize: '2.2rem', fontWeight: '700', color: 'var(--success)' }}>
            {services.filter(s => s.is_active).length}
          </div>
          <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '4px' }}>
            Active on public site
          </div>
        </div>
      </div>

      {/* Quick Action Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1.25rem', marginBottom: '2.5rem' }}>
        <div
          className="glass-card"
          onClick={() => onNavigateTab('services')}
          style={{ padding: '1.5rem', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}
        >
          <div>
            <h4 style={{ fontSize: '1.1rem', color: 'var(--text-primary)', marginBottom: '2px' }}>Customize Prices</h4>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>Modify prices or add new treatments</p>
          </div>
          <ArrowRight size={18} color="var(--gold-primary)" />
        </div>

        <div
          className="glass-card"
          onClick={() => onNavigateTab('bookings')}
          style={{ padding: '1.5rem', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}
        >
          <div>
            <h4 style={{ fontSize: '1.1rem', color: 'var(--text-primary)', marginBottom: '2px' }}>Manage Bookings</h4>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>Approve, complete, or add walk-ins</p>
          </div>
          <ArrowRight size={18} color="var(--gold-primary)" />
        </div>

        <div
          className="glass-card"
          onClick={() => onNavigateTab('settings')}
          style={{ padding: '1.5rem', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}
        >
          <div>
            <h4 style={{ fontSize: '1.1rem', color: 'var(--text-primary)', marginBottom: '2px' }}>Salon Information</h4>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>Update WhatsApp, phone & hours</p>
          </div>
          <ArrowRight size={18} color="var(--gold-primary)" />
        </div>
      </div>

      {/* Recent Bookings Feed */}
      <div className="glass-card" style={{ padding: '1.75rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
          <h3 style={{ fontSize: '1.35rem', color: 'var(--text-primary)' }}>Recent Appointment Requests</h3>
          <button onClick={() => onNavigateTab('bookings')} className="btn btn-outline btn-sm">
            View All ({bookings.length})
          </button>
        </div>

        <div className="admin-table-container">
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
                    <div style={{ fontSize: '0.75rem', color: 'var(--gold-light)' }}>{b.time}</div>
                  </td>
                  <td>
                    <div style={{ fontWeight: '600', color: 'var(--text-primary)' }}>{b.name}</div>
                    <a
                      href={`https://wa.me/${b.phone.replace(/\D/g, '')}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{ color: '#25D366', fontSize: '0.78rem', display: 'flex', alignItems: 'center', gap: '4px' }}
                    >
                      <MessageCircle size={12} /> {b.phone}
                    </a>
                  </td>
                  <td style={{ color: 'var(--text-secondary)' }}>{b.service}</td>
                  <td>
                    <span className={`badge badge-${b.status}`}>{b.status}</span>
                  </td>
                  <td>
                    <select
                      className="form-select"
                      style={{ padding: '4px 8px', fontSize: '0.78rem', width: '120px', margin: 0 }}
                      value={b.status}
                      onChange={e => updateBookingStatus(b.id, e.target.value)}
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
      </div>
    </div>
  );
};

export default AdminDashboard;
