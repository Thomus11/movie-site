import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// import HomePage from './pages/HomePage';
// import UserDashboard from './pages/UserDashboard';
// import AdminDashboard from './pages/AdminDashboard';
import BookingPage from './pages/BookingPage';
// import LoginPage from './pages/LoginPage';
// import RegisterPage from './pages/RegisterPage';
import NotFound from './pages/NotFound';

function App() {
  return (
    <Router>
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        {/* User and Admin dashboards */}
        <Route path="/user/dashboard" element={<UserDashboard />} />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />

        {/* Booking page (expects movieId from route param) */}
        <Route path="/book/:movieId" element={<BookingPageWrapper />} />

        {/* Fallback */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}

// Wrap BookingPage to extract `movieId` from the route params
import { useParams } from 'react-router-dom';
const BookingPageWrapper = () => {
  const { movieId } = useParams();
  return <BookingPage movieId={movieId} />;
};

export default App;
