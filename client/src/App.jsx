import React from 'react';
import { Routes, Route } from 'react-router-dom';
import ProtectedRoute from './Pages/ProtectedRoute';


import NotFound from './Pages/NotFound';

function App() {
  return (
    <Routes>
      {/* Public routes */}
      <Route path="/" element={<HomePage />} />

        {/* User and Admin dashboards */}
        <Route path="/dashboard" element={<UserDashboard />} />

      {/* Fallback */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default App;