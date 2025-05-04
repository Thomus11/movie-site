// Navbar.jsx

import React from "react";
import { useAuth } from "../../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { FaUserCircle } from "react-icons/fa";

function Navbar({ openModal }) {
  const { currentUser, setCurrentUser } = useAuth();
  const navigate = useNavigate();

  const handleProfileClick = () => {
    if (currentUser) {
      navigate('/user-dashboard');
    }
  };

  return (
    <nav className="fixed top-0 left-0 w-full bg-[#0B0C10] text-white p-4 z-50">
      <div className="flex justify-between items-center max-w-screen-xl mx-auto">
        <div className="flex items-center space-x-2 cursor-pointer" onClick={() => navigate('/')}>
          <div className="text-4xl font-bold text-[#6a040f]" style={{ fontFamily: 'Cinzel, serif' }}>
            🎬 Cine
          </div>
          <div className="text-4xl font-bold text-white" style={{ fontFamily: 'Cinzel, serif' }}>
            Reserve
          </div>
        </div>

        {currentUser ? (
          <div className="space-x-4 flex items-center">
            <span className="mr-2">Welcome, {currentUser.username}</span>
            <FaUserCircle 
              size={32} 
              className="text-[#6a040f] hover:text-[#370617] cursor-pointer transition-colors mr-4"
              onClick={handleProfileClick}
            />
            <button
              onClick={() => {
                setCurrentUser(null);
                navigate('/');
              }}
              className="bg-[#6a040f] px-6 py-2 rounded-full font-semibold hover:bg-[#370617] transition"
            >
              Logout
            </button>
          </div>
        ) : (
          <div className="space-x-4">
            <button
              onClick={() => openModal("login")}
              className="bg-[#6a040f] px-6 py-2 rounded-full font-semibold hover:bg-[#370617] transition"
            >
              Login
            </button>
            <button
              onClick={() => openModal("signup")}
              className="bg-[#6a040f] px-6 py-2 rounded-full font-semibold hover:bg-[#370617] transition"
            >
              Sign Up
            </button>
          </div>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
