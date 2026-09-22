import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { StoreProvider } from './context/StoreContext';
import HomePage from './pages/HomePage';
import AdminLayout from './pages/admin/AdminLayout';
import AdminLogin from './pages/admin/AdminLogin';

const AppContent = () => {
  const { isAuthenticated } = useAuth();
  const [view, setView] = useState(() => {
    // Check if URL hash or path has #admin or /admin
    if (window.location.pathname.includes('/admin') || window.location.hash.includes('admin')) {
      return 'admin';
    }
    return 'public';
  });

  if (view === 'admin') {
    if (!isAuthenticated) {
      return <AdminLogin onBackToSite={() => setView('public')} />;
    }
    return <AdminLayout onExitAdmin={() => setView('public')} />;
  }

  return <HomePage onSwitchToAdmin={() => setView('admin')} />;
};

function App() {
  return (
    <AuthProvider>
      <StoreProvider>
        <AppContent />
      </StoreProvider>
    </AuthProvider>
  );
}

export default App;
