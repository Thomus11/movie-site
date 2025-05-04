import React from 'react';
import { Routes, Route } from 'react-router-dom';
import ProtectedRoute from './Pages/ProtectedRoute';

import HomePage from './pages/home/HomePage';
import UserDashboard from './pages/user/UserDashboard';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminAuthPage from './pages/admin/AdminAuthPage';
import NotFound from './Pages/NotFound';

function App() {
  return (
    <Routes>
      {/* Public routes */}
      <Route path="/" element={<HomePage />} />

      {/* Protected User Dashboard */}
      <Route 
        path="/user-dashboard" 
        element={
          <ProtectedRoute>
            <UserDashboard />
          </ProtectedRoute>
        } 
      />

      {/* Admin routes */}
      <Route path="/admin-auth" element={<AdminAuthPage />} />
      <Route path="/admin-dashboard" element={<AdminDashboard />} />

      {/* Fallback */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default App;