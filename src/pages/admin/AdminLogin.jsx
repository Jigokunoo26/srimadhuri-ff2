import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Shield, Lock, User, AlertCircle, ArrowLeft, Mail, KeyRound, CheckCircle2, RefreshCw } from 'lucide-react';
import { sendAdminResetOtp } from '../../lib/emailService';

const AdminLogin = ({ onBackToSite }) => {
  const { login, updateCredentials } = useAuth();
  const [view, setView] = useState('login'); // 'login' | 'forgot_request' | 'forgot_verify' | 'forgot_new'
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [loading, setLoading] = useState(false);

  // Forgot password OTP states
  const [resetEmail, setResetEmail] = useState(import.meta.env.VITE_ADMIN_EMAIL || 'hello@srimadhurimakeovers.com');
  const [resetUser, setResetUser] = useState(import.meta.env.VITE_ADMIN_USERNAME || 'admin');
  const [enteredOtp, setEnteredOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [otpSession, setOtpSession] = useState(null); // { code, email, user, expiresAt }
  const [timerSeconds, setTimerSeconds] = useState(0);

  // Countdown timer for OTP expiry
  useEffect(() => {
    if (timerSeconds <= 0) return;
    const timer = setInterval(() => {
      setTimerSeconds(prev => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, [timerSeconds]);

  // Handle Standard Login
  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');
    setLoading(true);

    try {
      const result = await login(username, password);
      if (!result.success) {
        setError(result.error || 'Invalid credentials');
        setLoading(false);
      }
    } catch {
      setError('An error occurred during authentication');
      setLoading(false);
    }
  };

  // Step 1: Send OTP to Admin Email
  const handleRequestOtp = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');
    if (!resetEmail.trim() || !resetEmail.includes('@')) {
      setError('Please provide a valid administrative email address');
      return;
    }

    setLoading(true);
    // Generate secure 6-digit numeric OTP
    const generatedOtp = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = Date.now() + 10 * 60 * 1000; // 10 minutes

    try {
      const result = await sendAdminResetOtp({
        toEmail: resetEmail.trim(),
        adminUsername: resetUser.trim() || 'Admin',
        otpCode: generatedOtp,
        expiresMinutes: 10
      });

      setOtpSession({
        code: generatedOtp,
        email: resetEmail.trim(),
        user: resetUser.trim() || 'admin',
        expiresAt
      });
      setTimerSeconds(600); // 10 minutes countdown
      setSuccessMsg(result.message || `A 6-digit OTP code has been sent to ${resetEmail.trim()}`);
      setView('forgot_verify');
    } catch (err) {
      console.error(err);
      setError('Failed to send OTP email. Please verify your EmailJS setup in .env');
    } finally {
      setLoading(false);
    }
  };

  // Step 2: Verify OTP
  const handleVerifyOtp = (e) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');

    if (!otpSession) {
      setError('No active OTP session. Please request a new code.');
      setView('forgot_request');
      return;
    }

    if (Date.now() > otpSession.expiresAt) {
      setError('The OTP code has expired. Please request a fresh one.');
      return;
    }

    if (enteredOtp.trim() !== otpSession.code) {
      setError('Incorrect OTP verification code. Please check and try again.');
      return;
    }

    setSuccessMsg('OTP verified successfully. Please enter your new password.');
    setView('forgot_new');
  };

  // Step 3: Set New Password
  const handleResetPassword = (e) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');

    if (newPassword.length < 5) {
      setError('Password must be at least 5 characters long.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('Passwords do not match. Please verify.');
      return;
    }

    // Persist new credentials via AuthContext
    const targetUser = otpSession?.user || resetUser || 'admin';
    updateCredentials(targetUser, newPassword);

    setUsername(targetUser);
    setPassword('');
    setSuccessMsg('Password has been reset successfully! You can now sign in.');
    setView('login');
    setOtpSession(null);
  };

  const formatTime = (secs) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '2rem 1.5rem',
        background: 'radial-gradient(circle at center, #0d1527 0%, #080c16 100%)'
      }}
    >
      <div
        className="glass-card"
        style={{
          width: '100%',
          maxWidth: '460px',
          padding: '2.5rem',
          border: '1px solid var(--border-medium)',
          boxShadow: 'var(--shadow-lg)'
        }}
      >
        <button
          onClick={onBackToSite}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            background: 'none',
            border: 'none',
            color: 'var(--text-muted)',
            fontSize: '0.85rem',
            cursor: 'pointer',
            marginBottom: '1.5rem'
          }}
        >
          <ArrowLeft size={16} /> Back to Salon Website
        </button>

        {/* Header Icon */}
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div
            style={{
              width: '56px',
              height: '56px',
              borderRadius: '50%',
              background: 'var(--gold-gradient)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#080c16',
              margin: '0 auto 1rem',
              boxShadow: 'var(--gold-glow)'
            }}
          >
            {view === 'login' && <Shield size={28} />}
            {view === 'forgot_request' && <Mail size={26} />}
            {view === 'forgot_verify' && <KeyRound size={26} />}
            {view === 'forgot_new' && <Lock size={26} />}
          </div>

          <h2 style={{ fontSize: '1.85rem', color: 'var(--text-primary)', marginBottom: '6px' }}>
            {view === 'login' && 'Vendor Admin Portal'}
            {view === 'forgot_request' && 'Reset Admin Password'}
            {view === 'forgot_verify' && 'Verify 6-Digit OTP'}
            {view === 'forgot_new' && 'Set New Password'}
          </h2>
          <p style={{ fontSize: '0.86rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>
            {view === 'login' && 'Sign in to customize prices, manage appointments, and track revenue.'}
            {view === 'forgot_request' && 'We will dispatch an OTP verification code via EmailJS to your administrative email.'}
            {view === 'forgot_verify' && `Enter the 6-digit security code sent to ${otpSession?.email || resetEmail}.`}
            {view === 'forgot_new' && 'Choose a strong password to protect your admin dashboard.'}
          </p>
        </div>

        {/* Alerts */}
        {error && (
          <div
            style={{
              background: 'var(--danger-bg)',
              border: '1px solid rgba(239, 68, 68, 0.3)',
              color: '#f87171',
              padding: '0.75rem 1rem',
              borderRadius: 'var(--radius-sm)',
              fontSize: '0.85rem',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              marginBottom: '1.25rem'
            }}
          >
            <AlertCircle size={16} /> {error}
          </div>
        )}

        {successMsg && (
          <div
            style={{
              background: 'var(--success-bg)',
              border: '1px solid var(--success)',
              color: 'var(--success)',
              padding: '0.75rem 1rem',
              borderRadius: 'var(--radius-sm)',
              fontSize: '0.85rem',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              marginBottom: '1.25rem'
            }}
          >
            <CheckCircle2 size={16} /> {successMsg}
          </div>
        )}

        {/* VIEW 1: LOGIN FORM */}
        {view === 'login' && (
          <form onSubmit={handleLoginSubmit}>
            <div className="form-group">
              <label className="form-label">Username</label>
              <div style={{ position: 'relative' }}>
                <input
                  type="text"
                  className="form-input"
                  style={{ paddingLeft: '2.5rem' }}
                  value={username}
                  onChange={e => setUsername(e.target.value)}
                  placeholder="Admin username"
                  required
                />
                <User size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              </div>
            </div>

            <div className="form-group">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                <label className="form-label" style={{ margin: 0 }}>Password</label>
                <button
                  type="button"
                  onClick={() => { setError(''); setSuccessMsg(''); setView('forgot_request'); }}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: 'var(--gold-light)',
                    fontSize: '0.78rem',
                    cursor: 'pointer',
                    padding: 0,
                    textDecoration: 'underline'
                  }}
                >
                  Forgot Password?
                </button>
              </div>
              <div style={{ position: 'relative' }}>
                <input
                  type="password"
                  className="form-input"
                  style={{ paddingLeft: '2.5rem' }}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="Admin password"
                  required
                />
                <Lock size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary"
              style={{ width: '100%', marginTop: '1.25rem', padding: '0.85rem' }}
            >
              {loading ? 'Authenticating...' : 'Sign In to Dashboard'}
            </button>
          </form>
        )}

        {/* VIEW 2: FORGOT PASSWORD REQUEST OTP */}
        {view === 'forgot_request' && (
          <form onSubmit={handleRequestOtp}>
            <div className="form-group">
              <label className="form-label">Admin Username</label>
              <div style={{ position: 'relative' }}>
                <input
                  type="text"
                  className="form-input"
                  style={{ paddingLeft: '2.5rem' }}
                  value={resetUser}
                  onChange={e => setResetUser(e.target.value)}
                  placeholder="Admin username"
                  required
                />
                <User size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Admin Email Address</label>
              <div style={{ position: 'relative' }}>
                <input
                  type="email"
                  className="form-input"
                  style={{ paddingLeft: '2.5rem' }}
                  value={resetEmail}
                  onChange={e => setResetEmail(e.target.value)}
                  placeholder="hello@srimadhurimakeovers.com"
                  required
                />
                <Mail size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              </div>
              <small style={{ color: 'var(--text-muted)', fontSize: '0.78rem', marginTop: '6px', display: 'block' }}>
                EmailJS will dispatch a one-time 6-digit authorization code to this inbox.
              </small>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary"
              style={{ width: '100%', marginTop: '1.25rem', padding: '0.85rem', gap: '8px' }}
            >
              <Mail size={16} /> {loading ? 'Sending OTP...' : 'Send Reset Code'}
            </button>

            <button
              type="button"
              onClick={() => { setError(''); setSuccessMsg(''); setView('login'); }}
              style={{
                width: '100%',
                background: 'none',
                border: 'none',
                color: 'var(--text-muted)',
                fontSize: '0.82rem',
                cursor: 'pointer',
                marginTop: '1rem',
                textAlign: 'center'
              }}
            >
              Cancel & Return to Login
            </button>
          </form>
        )}

        {/* VIEW 3: VERIFY OTP */}
        {view === 'forgot_verify' && (
          <form onSubmit={handleVerifyOtp}>
            <div className="form-group">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                <label className="form-label" style={{ margin: 0 }}>6-Digit OTP Security Code</label>
                {timerSeconds > 0 ? (
                  <span style={{ fontSize: '0.78rem', color: 'var(--gold-light)' }}>
                    Expires in {formatTime(timerSeconds)}
                  </span>
                ) : (
                  <span style={{ fontSize: '0.78rem', color: '#f87171' }}>Expired</span>
                )}
              </div>
              <div style={{ position: 'relative' }}>
                <input
                  type="text"
                  maxLength={6}
                  className="form-input"
                  style={{
                    paddingLeft: '2.5rem',
                    letterSpacing: '0.35em',
                    fontSize: '1.2rem',
                    fontWeight: 'bold',
                    textAlign: 'center'
                  }}
                  value={enteredOtp}
                  onChange={e => setEnteredOtp(e.target.value.replace(/\D/g, ''))}
                  placeholder="------"
                  required
                />
                <KeyRound size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              </div>
            </div>

            <button
              type="submit"
              className="btn btn-primary"
              style={{ width: '100%', marginTop: '1.25rem', padding: '0.85rem' }}
            >
              Verify Code
            </button>

            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '1.25rem' }}>
              <button
                type="button"
                onClick={handleRequestOtp}
                disabled={loading || timerSeconds > 540}
                style={{
                  background: 'none',
                  border: 'none',
                  color: timerSeconds > 540 ? 'var(--text-muted)' : 'var(--gold-light)',
                  fontSize: '0.82rem',
                  cursor: timerSeconds > 540 ? 'not-allowed' : 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px'
                }}
              >
                <RefreshCw size={12} /> Resend Code
              </button>
              <button
                type="button"
                onClick={() => { setError(''); setSuccessMsg(''); setView('login'); }}
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'var(--text-muted)',
                  fontSize: '0.82rem',
                  cursor: 'pointer'
                }}
              >
                Back to Login
              </button>
            </div>
          </form>
        )}

        {/* VIEW 4: SET NEW PASSWORD */}
        {view === 'forgot_new' && (
          <form onSubmit={handleResetPassword}>
            <div className="form-group">
              <label className="form-label">New Password</label>
              <div style={{ position: 'relative' }}>
                <input
                  type="password"
                  className="form-input"
                  style={{ paddingLeft: '2.5rem' }}
                  value={newPassword}
                  onChange={e => setNewPassword(e.target.value)}
                  placeholder="Enter new password (min 5 chars)"
                  required
                />
                <Lock size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Confirm New Password</label>
              <div style={{ position: 'relative' }}>
                <input
                  type="password"
                  className="form-input"
                  style={{ paddingLeft: '2.5rem' }}
                  value={confirmPassword}
                  onChange={e => setConfirmPassword(e.target.value)}
                  placeholder="Confirm new password"
                  required
                />
                <Lock size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              </div>
            </div>

            <button
              type="submit"
              className="btn btn-primary"
              style={{ width: '100%', marginTop: '1.25rem', padding: '0.85rem' }}
            >
              Update Password & Sign In
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default AdminLogin;

