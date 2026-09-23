import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import fs from 'node:fs';
import path from 'node:path';

function credentialsUpdatePlugin() {
  return {
    name: 'credentials-update-plugin',
    configureServer(server) {
      server.middlewares.use('/api/update-credentials', (req, res, next) => {
        if (req.method !== 'POST') {
          return next();
        }

        let body = '';
        req.on('data', chunk => {
          body += chunk;
        });

        req.on('end', () => {
          try {
            const data = JSON.parse(body || '{}');
            const { username, password, email } = data;

            const envPath = path.resolve(process.cwd(), '.env');
            if (fs.existsSync(envPath)) {
              let envContent = fs.readFileSync(envPath, 'utf8');

              const updateOrAppend = (content, key, val) => {
                const regex = new RegExp(`^${key}=.*$`, 'm');
                if (regex.test(content)) {
                  return content.replace(regex, `${key}=${val}`);
                }
                return `${content}\n${key}=${val}`;
              };

              if (username && username.trim()) {
                envContent = updateOrAppend(envContent, 'ADMIN_USERNAME', username.trim());
                envContent = updateOrAppend(envContent, 'VITE_ADMIN_USERNAME', username.trim());
              }
              if (password && password.trim()) {
                envContent = updateOrAppend(envContent, 'ADMIN_PASSWORD', password.trim());
                envContent = updateOrAppend(envContent, 'VITE_ADMIN_PASSWORD', password.trim());
              }
              if (email && email.trim()) {
                envContent = updateOrAppend(envContent, 'ADMIN_EMAIL', email.trim());
                envContent = updateOrAppend(envContent, 'VITE_ADMIN_EMAIL', email.trim());
              }

              fs.writeFileSync(envPath, envContent, 'utf8');
              console.log('✅ Updated .env credentials on disk:', { username, email });
            }

            res.writeHead(200, {
              'Content-Type': 'application/json',
              'Access-Control-Allow-Origin': '*'
            });
            res.end(JSON.stringify({ success: true, message: 'Updated .env successfully' }));
          } catch (err) {
            console.error('Error updating .env:', err);
            res.writeHead(500, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ success: false, error: err.message }));
          }
        });
      });
    }
  };
}

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  const adminUsername = env.VITE_ADMIN_USERNAME || env.ADMIN_USERNAME || '';
  const adminPassword = env.VITE_ADMIN_PASSWORD || env.ADMIN_PASSWORD || '';
  const adminEmail = env.VITE_ADMIN_EMAIL || env.ADMIN_EMAIL || 'hello@srimadhurimakeovers.com';
  const emailJsServiceId = env.VITE_EMAILJS_SERVICE_ID || env.EMAILJS_SERVICE_ID || '';
  const emailJsPublicKey = env.VITE_EMAILJS_PUBLIC_KEY || env.EMAILJS_PUBLIC_KEY || '';
  const emailJsTemplateAdminOtp = env.VITE_EMAILJS_TEMPLATE_ADMIN_OTP || env.EMAILJS_TEMPLATE_ADMIN_OTP || '';
  const emailJsTemplateBookingConfirm = env.VITE_EMAILJS_TEMPLATE_BOOKING_CONFIRM || env.EMAILJS_TEMPLATE_BOOKING_CONFIRM || '';

  return {
    plugins: [react(), credentialsUpdatePlugin()],
    define: {
      'import.meta.env.VITE_ADMIN_USERNAME': JSON.stringify(adminUsername),
      'import.meta.env.VITE_ADMIN_PASSWORD': JSON.stringify(adminPassword),
      'import.meta.env.VITE_ADMIN_EMAIL': JSON.stringify(adminEmail),
      'import.meta.env.VITE_EMAILJS_SERVICE_ID': JSON.stringify(emailJsServiceId),
      'import.meta.env.VITE_EMAILJS_PUBLIC_KEY': JSON.stringify(emailJsPublicKey),
      'import.meta.env.VITE_EMAILJS_TEMPLATE_ADMIN_OTP': JSON.stringify(emailJsTemplateAdminOtp),
      'import.meta.env.VITE_EMAILJS_TEMPLATE_BOOKING_CONFIRM': JSON.stringify(emailJsTemplateBookingConfirm)
    },
    server: {
      port: 3000,
      open: true
    },
    build: {
      outDir: 'dist'
    }
  };
});
