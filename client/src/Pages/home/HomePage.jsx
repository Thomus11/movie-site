import React, { useState } from "react";
import Navbar from "../../components/ui/Navbar";
import Carousel from "../../components/ui/MovieCarousel";
import AuthModal from "../../components/auth/AuthModal";
import AvailableNow from "../../components/movie/AvailableMovies";
import ComingSoon from "../../components/movie/ComingSoonMovies";
import Footer from "../../components/ui/Footer";
import UserDashboard from "../user/UserDashboard";
import AdminAuthPage from "../admin/AdminAuthPage";
import AdminDashboard from "../admin/AdminDashboard";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";


function HomePage() {
  const navigate = useNavigate();
  const { currentUser, setCurrentUser, showAuthModal, setShowAuthModal } = useAuth();
  const [authType, setAuthType] = useState("login");
  const [adminVerified, setAdminVerified] = useState(false); // whether admin branch+code was verified

  const openModal = (type) => {
    setAuthType(type);
    setShowAuthModal(true);
  };

  const closeModal = () => {
    setShowAuthModal(false);
  };

  const handleAdminVerification = () => {
    setAdminVerified(true);
  };

  // Not logged in
  return (
    <div className="relative min-h-screen bg-black">
      <Navbar openModal={openModal} />
      <div className="w-full h-screen">
        <Carousel />
      </div>
      <AvailableNow />
      <ComingSoon />
      {showAuthModal && <AuthModal type={authType} onClose={closeModal} />}
      <Footer />
    </div>
  );
}

export default HomePage;
