import React, { createContext, useContext, useState } from 'react';
import { supabase, isSupabaseConfigured } from '../lib/supabase';

const AuthContext = createContext();

// Cryptographic hash helper using Web Crypto API to avoid exposing credentials in source/bundles
const sha256Hex = async (text) => {
  try {
    const encoder = new TextEncoder();
    const data = encoder.encode(text);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  } catch {
    return null;
  }
};

// Cryptographic hash digests for default administrator verification
// (Prevents plaintext credentials from existing in client source code or production bundles)
const DEFAULT_USER_HASH = 'deb296b38bbd91f952899e192807c79a6c6f9e477857273dca085fa1a1abe6a0';
const DEFAULT_PASS_HASH = '35d79a2a4f8d5d8f38fc9ac46047df1de29f77432ae7246e708225de167deba0';

export const AuthProvider = ({ children }) => {
  const [adminUser, setAdminUser] = useState(() => {
    try {
      const saved = localStorage.getItem('sri_madhuri_admin_session');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const [adminUsername, setAdminUsername] = useState(() => {
    try {
      const saved = localStorage.getItem('sri_madhuri_admin_custom_creds');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.username) return parsed.username;
      }
    } catch {}
    return import.meta.env.VITE_ADMIN_USERNAME || 'admin';
  });

  const [adminEmail, setAdminEmail] = useState(() => {
    try {
      const savedEmail = localStorage.getItem('sri_madhuri_admin_email');
      if (savedEmail) return savedEmail;
      const savedCreds = localStorage.getItem('sri_madhuri_admin_custom_creds');
      if (savedCreds) {
        const parsed = JSON.parse(savedCreds);
        if (parsed.email) return parsed.email;
      }
    } catch {}
    return import.meta.env.VITE_ADMIN_EMAIL || 'nandhiniverma031@gmail.com';
  });

  const login = async (username, password) => {
    const trimmedUser = (username || '').trim();
    const cleanPassword = password || '';

    if (!trimmedUser || !cleanPassword) {
      return { success: false, error: 'Please enter both username and password' };
    }

    // 1. Check custom saved credentials in localStorage first
    const savedCreds = localStorage.getItem('sri_madhuri_admin_custom_creds');
    if (savedCreds) {
      try {
        const creds = JSON.parse(savedCreds);
        if (trimmedUser === creds.username && cleanPassword === creds.password) {
          const session = {
            username: creds.username,
            email: creds.email || adminEmail,
            role: 'owner',
            loggedInAt: new Date().toISOString()
          };
          setAdminUser(session);
          localStorage.setItem('sri_madhuri_admin_session', JSON.stringify(session));
          return { success: true };
        }
      } catch (e) {
        console.error('Error verifying stored credentials:', e);
      }
    }

    // 2. Verify against credentials configured in .env (ADMIN_USERNAME & ADMIN_PASSWORD)
    const envUser = (import.meta.env.VITE_ADMIN_USERNAME || '').trim();
    const envPass = import.meta.env.VITE_ADMIN_PASSWORD || '';
    if (envUser && envPass && trimmedUser === envUser && cleanPassword === envPass) {
      const session = {
        username: envUser,
        email: adminEmail,
        role: 'owner',
        loggedInAt: new Date().toISOString()
      };
      setAdminUser(session);
      localStorage.setItem('sri_madhuri_admin_session', JSON.stringify(session));
      return { success: true };
    }

    // 3. Verify against Supabase admin_users table if configured
    if (isSupabaseConfigured && supabase) {
      try {
        const { data: dbUser, error: dbError } = await supabase
          .from('admin_users')
          .select('*')
          .eq('username', trimmedUser)
          .maybeSingle();

        if (dbUser && !dbError) {
          let isMatch = false;
          if (dbUser.password_hash === cleanPassword) {
            isMatch = true;
          } else {
            const enteredPassHash = await sha256Hex(cleanPassword);
            if (enteredPassHash && dbUser.password_hash?.includes(enteredPassHash)) {
              isMatch = true;
            }
          }

          if (isMatch) {
            const session = {
              username: dbUser.username,
              role: dbUser.role || 'owner',
              email: dbUser.email,
              loggedInAt: new Date().toISOString()
            };
            setAdminUser(session);
            localStorage.setItem('sri_madhuri_admin_session', JSON.stringify(session));
            return { success: true };
          }
        }
      } catch (e) {
        console.warn('Supabase authentication check bypassed:', e);
      }
    }

    // 4. Verify against hashed default administrative credentials
    const [uHash, pHash] = await Promise.all([
      sha256Hex(trimmedUser),
      sha256Hex(cleanPassword)
    ]);

    if (uHash === DEFAULT_USER_HASH && pHash === DEFAULT_PASS_HASH) {
      const session = {
        username: trimmedUser,
        email: adminEmail,
        role: 'owner',
        loggedInAt: new Date().toISOString()
      };
      setAdminUser(session);
      localStorage.setItem('sri_madhuri_admin_session', JSON.stringify(session));
      return { success: true };
    }

    return { success: false, error: 'Invalid username or password' };
  };

  const logout = () => {
    setAdminUser(null);
    localStorage.removeItem('sri_madhuri_admin_session');
  };

  const updateCredentials = (newUsername, newPassword) => {
    return updateAdminCredentials({ username: newUsername, password: newPassword });
  };

  const updateAdminCredentials = async ({ username, password, email }) => {
    const trimmedUser = (username || adminUsername || 'admin').trim();
    const cleanEmail = (email || adminEmail || 'nandhiniverma031@gmail.com').trim();

    let currentPassword = import.meta.env.VITE_ADMIN_PASSWORD || 'admin';
    try {
      const existing = JSON.parse(localStorage.getItem('sri_madhuri_admin_custom_creds') || '{}');
      if (existing.password) currentPassword = existing.password;
    } catch {}

    const newPass = (password && password.trim()) ? password.trim() : currentPassword;
    const creds = { username: trimmedUser, password: newPass, email: cleanEmail };

    localStorage.setItem('sri_madhuri_admin_custom_creds', JSON.stringify(creds));
    localStorage.setItem('sri_madhuri_admin_email', cleanEmail);

    setAdminUsername(trimmedUser);
    setAdminEmail(cleanEmail);

    if (adminUser) {
      const updatedSession = { ...adminUser, username: trimmedUser, email: cleanEmail };
      setAdminUser(updatedSession);
      localStorage.setItem('sri_madhuri_admin_session', JSON.stringify(updatedSession));
    }

    // Call Vite backend API to persist to .env file on disk
    let diskUpdated = false;
    try {
      const res = await fetch('/api/update-credentials', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: trimmedUser,
          password: newPass,
          email: cleanEmail
        })
      });
      const data = await res.json();
      diskUpdated = Boolean(data.success);
    } catch (err) {
      console.warn('Notice: /api/update-credentials endpoint:', err);
    }

    return { success: true, diskUpdated, username: trimmedUser, email: cleanEmail };
  };

  return (
    <AuthContext.Provider
      value={{
        adminUser,
        adminUsername,
        adminEmail,
        login,
        logout,
        updateCredentials,
        updateAdminCredentials,
        isAuthenticated: !!adminUser
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
