import React from 'react';
import { Routes, Route } from 'react-router-dom';
import  HomePage  from './Pages/home/HomePage';
import UserDashboard from './Pages/user/UserDashboard';
import NotFound from './Pages/NotFound';
import ProtectedRoute from './Pages/ProtectedRoute';


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