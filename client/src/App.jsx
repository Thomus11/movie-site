import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import HomePage from './pages/home/HomePage';
import UserDashboard from './pages/user/UserDashboard';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminAuthPage from './pages/admin/AdminAuthPage';
import NotFound from './Pages/NotFound';
import { AuthProvider } from './contexts/AuthContext';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<HomePage />} />

          {/* User and Admin dashboards */}
          <Route path="/user-dashboard" element={<UserDashboard />} />
          <Route path="/admin-auth" element={<AdminAuthPage />} />
          <Route path="/admin-dashboard" element={<AdminDashboard />} />

          {/* Fallback */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

// Note: BookingPageWrapper was removed as it references a non-existent BookingPage component
// If you need to implement booking functionality later, you can add it back

export default App;