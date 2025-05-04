import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import HomePage from './Pages/Home';
import Dashboard from './Pages/UserDashboard';
import NotFound from './Pages/NotFound';

function App() {
  return (
    <Router>
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<HomePage />} />

        {/* User and Admin dashboards */}
        <Route path="/dashboard" element={<Dashboard />} />

        {/* Fallback */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}

// Wrap BookingPage to extract movieId from the route params
import { useParams } from 'react-router-dom';
const BookingPageWrapper = () => {
  const { movieId } = useParams();
  return <BookingPage movieId={movieId} />;
};

export default App;