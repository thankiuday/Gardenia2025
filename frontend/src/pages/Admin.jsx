import { useState, useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import AdminLogin from './admin/AdminLogin';
import AdminDashboard from './admin/AdminDashboard';
import AdminRegistrations from './admin/AdminRegistrations';
import AdminContacts from './admin/AdminContacts';

const Admin = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);

  // Check for existing admin token on component mount
  useEffect(() => {
    const existingToken = localStorage.getItem('adminToken');
    if (existingToken) {
        setIsLoggedIn(true);
      }
      setLoading(false);
  }, []);

  // Listen for storage changes (when token is added/removed)
  useEffect(() => {
    const handleStorageChange = () => {
      const token = localStorage.getItem('adminToken');
      setIsLoggedIn(!!token);
    };

    const handleAdminLogout = () => {
      setIsLoggedIn(false);
    };

    // Listen for storage events (from other tabs) and custom events (from same tab)
    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('adminLogout', handleAdminLogout);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('adminLogout', handleAdminLogout);
    };
  }, []);

  const handleLogin = () => {
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    localStorage.removeItem('adminToken');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-emerald-100 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-emerald-600 animate-spin" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              </div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // Double-check localStorage to ensure we're in sync
  const currentToken = localStorage.getItem('adminToken');
  if (!isLoggedIn || !currentToken) {
    return <AdminLogin onLogin={handleLogin} />;
  }

  return (
    <Routes>
      <Route path="/" element={<AdminDashboard />} />
      <Route path="/registrations" element={<AdminRegistrations />} />
      <Route path="/contacts" element={<AdminContacts />} />
      <Route path="*" element={<Navigate to="/admin" replace />} />
    </Routes>
  );
};

export default Admin;