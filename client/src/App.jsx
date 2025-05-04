import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './index.css'; // your custom styles

import HomePage from './Pages/Home';
import UserDashboard from './components/UserDashboard';
import NotFound from './Pages/NotFound';
import ProtectedRoute from "./components/ProtectedRoute";
import AdminDashboard from './components/AdminDashboard';

function App() {
  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/dashboard" element={
            <ProtectedRoute allowedRoles={["user", "admin"]}>
              <UserDashboard />
            </ProtectedRoute>
          } />
          <Route path="/admin-auth" element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <AdminDashboard />
            </ProtectedRoute>
          } />
          <Route path="/unauthorized" element={<div>Access Denied</div>} />
        </Routes>
      </Router>
      
      <ToastContainer
        position="top-center"
        autoClose={3000}
        hideProgressBar
        closeOnClick
        pauseOnHover
        draggable
        theme="colored"
        toastClassName="custom-toast"
      />
    </>
  );
}

export default App;
