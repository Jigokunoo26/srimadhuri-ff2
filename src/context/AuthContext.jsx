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

  const login = async (username, password) => {
    const trimmedUser = (username || '').trim();
    const cleanPassword = password || '';

    if (!trimmedUser || !cleanPassword) {
      return { success: false, error: 'Please enter both username and password' };
    }

    // 1. Check custom saved credentials in localStorage
    const savedCreds = localStorage.getItem('sri_madhuri_admin_custom_creds');
    if (savedCreds) {
      try {
        const creds = JSON.parse(savedCreds);
        if (trimmedUser === creds.username && cleanPassword === creds.password) {
          const session = {
            username: creds.username,
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

    // 2. Verify against Supabase admin_users table if configured
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

    // 3. Verify against hashed default administrative credentials
    const [uHash, pHash] = await Promise.all([
      sha256Hex(trimmedUser),
      sha256Hex(cleanPassword)
    ]);

    if (uHash === DEFAULT_USER_HASH && pHash === DEFAULT_PASS_HASH) {
      const session = {
        username: trimmedUser,
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
    const creds = { username: newUsername, password: newPassword };
    localStorage.setItem('sri_madhuri_admin_custom_creds', JSON.stringify(creds));
    if (adminUser) {
      setAdminUser({ ...adminUser, username: newUsername });
    }
    return true;
  };

  return (
    <AuthContext.Provider value={{ adminUser, login, logout, updateCredentials, isAuthenticated: !!adminUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
