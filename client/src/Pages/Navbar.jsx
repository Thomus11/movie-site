// Navber.js

import React from "react";

function Navbar({ openModal }) {
  return (
    <nav className="fixed top-0 left-0 w-full bg-[#0B0C10] text-white p-4 z-50">
      <div className="flex justify-between items-center max-w-screen-xl mx-auto">
        
    
        <div className="flex items-center space-x-2">
          <div className="text-4xl font-bold text-[#6a040f]" style={{ fontFamily: 'Cinzel, serif' }}>
            🎬 Cine
          </div>
          <div className="text-4xl font-bold text-white" style={{ fontFamily: 'Cinzel, serif' }}>
            Reserve
          </div>
        </div>

      
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
        
      </div>
    </nav>
  );
}

export default Navbar;
