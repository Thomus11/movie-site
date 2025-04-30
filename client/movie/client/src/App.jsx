import React, { useState } from "react";
import Navbar from "./pages/HomePage.jsx/Navbar";
import Carousel from "./pages/HomePage.jsx/Carousel";
import AuthModal from "./components/AuthModal";
import AvailableNow from "./pages/HomePage.jsx/AvailableNow";
import ComingSoon from "./pages/HomePage.jsx/ComingSoon";
import Footer from "./pages/HomePage.jsx/Footer";
import UserDashboard from "./components/UserDashboard";
import AdminAuthPage from "./components/AdminAuthPage";
import AdminDashboard from "./components/AdminDashboard"; 

function App() {
  const [showModal, setShowModal] = useState(false);
  const [authType, setAuthType] = useState("login");
  const [user, setUser] = useState(null); // logged-in user object
  const [adminVerified, setAdminVerified] = useState(false); // whether admin branch+code was verified

  const openModal = (type) => {
    setAuthType(type);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
  };

  const handleLogin = (userData) => {
    setUser(userData);
    closeModal();
  };

  const handleAdminVerification = () => {
    setAdminVerified(true);
  };

  if (!user) {
    // Not logged in
    return (
      <div className="relative min-h-screen bg-black">
        <Navbar openModal={openModal} />
        <div className="w-full h-screen">
          <Carousel />
        </div>
        <AvailableNow />
        <ComingSoon />
        {showModal && <AuthModal type={authType} onClose={closeModal} onLogin={handleLogin} />}
        <Footer />
      </div>
    );
  }

  // Logged-in user
  if (user.role === "user") {
    return <UserDashboard user={user} />;
  } else if (user.role === "admin") {
    if (!adminVerified) {
      return <AdminAuthPage onVerify={handleAdminVerification} />;
    } else {
      return <AdminDashboard admin={user} />;
    }
  }

  return null;
}

export default App;
