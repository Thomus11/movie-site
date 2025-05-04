import React, { useState } from "react";
import Navbar from "./Navbar";
import Carousel from "./Carousel";
import AuthModal from "../components/AuthModal";
import AvailableNow from "./AvailableNow";
import ComingSoon from "./ComingSoon";
import Footer from "./Footer";
import Dashboard from "./UserDashboard"
import AdminAuthPage from "../components/AdminAuthPage";
import AdminDashboard from "../components/AdminDashboard";
import { useNavigate } from "react-router-dom";


function HomePage() {
  const navigate = useNavigate();
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
  
    // Redirect based on role
    if (userData.role === "user") {
      navigate("/user-dashboard");
    } else if (userData.role === "admin") {
      navigate("/admin-auth");
    }
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
    return <Dashboard user={user} />;
  } else if (user.role === "admin") {
    if (!adminVerified) {
      return <AdminAuthPage onVerify={handleAdminVerification} />;
    } else {
      return <AdminDashboard admin={user} />;
    }
  }

  return null;
}

export default HomePage;
