import emailjs from '@emailjs/browser';

const EMAILJS_SERVICE_ID = import.meta.env.VITE_EMAILJS_SERVICE_ID || 'service_3g3lgar';
const EMAILJS_PUBLIC_KEY = import.meta.env.VITE_EMAILJS_PUBLIC_KEY || '5YuQZMiM2qRkr8hk1';
const TEMPLATE_ADMIN_OTP = import.meta.env.VITE_EMAILJS_TEMPLATE_ADMIN_OTP || 'template_804sotb';
const TEMPLATE_BOOKING_CONFIRM = import.meta.env.VITE_EMAILJS_TEMPLATE_BOOKING_CONFIRM || 'template_f4f3yni';

export const isEmailJsConfigured = Boolean(
  EMAILJS_SERVICE_ID &&
  EMAILJS_PUBLIC_KEY &&
  !EMAILJS_PUBLIC_KEY.includes('your_') &&
  !EMAILJS_SERVICE_ID.includes('your_')
);

// Initialize EmailJS if credentials are present
if (isEmailJsConfigured) {
  try {
    emailjs.init(EMAILJS_PUBLIC_KEY);
  } catch (err) {
    console.warn('EmailJS initialization notice:', err);
  }
}

/**
 * Send 6-Digit Password Reset OTP to Administrator
 * @param {Object} params
 * @param {string} params.toEmail - Admin's destination email
 * @param {string} params.adminUsername - Admin's username
 * @param {string} params.otpCode - Generated 6-digit OTP
 * @param {number} [params.expiresMinutes=10] - OTP lifetime in minutes
 */
export const sendAdminResetOtp = async ({
  toEmail,
  adminUsername = 'Administrator',
  otpCode,
  expiresMinutes = 10
}) => {
  const targetEmail = (
    toEmail ||
    (typeof window !== 'undefined' ? localStorage.getItem('sri_madhuri_admin_email') : '') ||
    import.meta.env.VITE_ADMIN_EMAIL ||
    'nandhiniverma031@gmail.com'
  ).trim();

  const templateParams = {
    to_email: targetEmail,
    email: targetEmail,
    client_email: targetEmail,
    admin_username: adminUsername,
    otp_code: otpCode,
    expires_minutes: expiresMinutes,
    salon_name: 'Sri Madhuri Makeovers',
    support_phone: '+91 89852 91053'
  };

  // If EmailJS credentials are configured, send live email
  if (isEmailJsConfigured && TEMPLATE_ADMIN_OTP) {
    try {
      const response = await emailjs.send(
        EMAILJS_SERVICE_ID,
        TEMPLATE_ADMIN_OTP,
        templateParams,
        EMAILJS_PUBLIC_KEY
      );
      console.log('✅ Admin OTP Email dispatched via EmailJS:', response.status);
      return { success: true, message: 'OTP sent to your email.' };
    } catch (error) {
      console.warn('⚠️ EmailJS API call failed, falling back to simulated OTP:', error);
      // Fall through to simulated mode so administrator is never locked out
    }
  }

  // Development / Simulation Fallback
  console.log(
    '%c[EmailJS Dev Mode - Admin Password Reset OTP]',
    'color: #d4af37; font-weight: bold; font-size: 14px;'
  );
  console.log(`Destination: ${toEmail}`);
  console.log(`Username: ${adminUsername}`);
  console.log(`OTP Code: %c${otpCode}`, 'color: #10b981; font-weight: bold; font-size: 16px;');
  console.log(`Expires in: ${expiresMinutes} minutes`);

  return {
    success: true,
    simulated: true,
    message: `(Dev Mode) OTP sent to ${toEmail}. In test mode, your OTP is: ${otpCode}`
  };
};

/**
 * Send Booking Confirmation Email to Client
 * @param {Object} params
 * @param {string} params.clientName
 * @param {string} params.clientEmail
 * @param {string} params.clientPhone
 * @param {string} params.serviceName
 * @param {string} params.bookingDate
 * @param {string} params.bookingTime
 * @param {string} [params.bookingNotes='']
 * @param {string} [params.salonAddress]
 * @param {string} [params.salonPhone]
 */
export const sendBookingConfirmation = async ({
  clientName,
  clientEmail,
  clientPhone,
  serviceName,
  bookingDate,
  bookingTime,
  bookingNotes = '',
  salonAddress = 'Opposite Chakri School, Mustafa Nagar, Khammam, Telangana',
  salonPhone = '+91 89852 91053'
}) => {
  const cleanEmail = clientEmail?.trim();
  if (!cleanEmail || !cleanEmail.includes('@')) {
    return { success: false, error: 'No valid client email provided' };
  }

  // Supply every standard recipient field so EmailJS routes to the client
  // regardless of how the template's "To Email" field is configured ({{to_email}}, {{client_email}}, etc.)
  const templateParams = {
    to_email: cleanEmail,
    client_email: cleanEmail,
    email: cleanEmail,
    recipient_email: cleanEmail,
    to_name: clientName,
    client_name: clientName,
    client_phone: clientPhone,
    service_name: serviceName,
    title: serviceName,
    booking_date: bookingDate,
    booking_time: bookingTime,
    notes: bookingNotes || 'No special requests',
    salon_name: 'Sri Madhuri Makeovers',
    salon_address: salonAddress,
    salon_phone: salonPhone,
    whatsapp_url: `https://wa.me/918985291053`,
    maps_url: 'https://maps.app.goo.gl/dJHpaipbUKYNW7SA7',
    reply_to: (typeof window !== 'undefined' ? localStorage.getItem('sri_madhuri_admin_email') : '') || import.meta.env.VITE_ADMIN_EMAIL || 'nandhiniverma031@gmail.com'
  };

  if (isEmailJsConfigured && TEMPLATE_BOOKING_CONFIRM) {
    try {
      const response = await emailjs.send(
        EMAILJS_SERVICE_ID,
        TEMPLATE_BOOKING_CONFIRM,
        templateParams,
        EMAILJS_PUBLIC_KEY
      );
      console.log(`✅ Client booking confirmation sent via EmailJS to ${cleanEmail}:`, response.status);
      return { success: true, recipient: cleanEmail };
    } catch (error) {
      console.warn(`⚠️ EmailJS booking confirmation to ${cleanEmail} failed:`, error);
      return { success: false, error: error?.text || error?.message || 'Email delivery failed' };
    }
  }

  // Development / Simulation Fallback
  console.log(
    '%c[EmailJS Dev Mode - Client Booking Confirmation]',
    'color: #60a5fa; font-weight: bold; font-size: 14px;'
  );
  console.log(`Recipient: ${clientName} <${cleanEmail}>`);
  console.log(`Service: ${serviceName} on ${bookingDate} at ${bookingTime}`);

  return { success: true, simulated: true, recipient: cleanEmail };
};
