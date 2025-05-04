import React from 'react';
import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#0B0C10] text-white flex flex-col items-center justify-center p-4">
      <h1 className="text-6xl font-bold mb-4 text-[#6a040f]">404</h1>
      <h2 className="text-3xl font-semibold mb-6">Page Not Found</h2>
      <p className="text-lg text-gray-300 mb-8">The page you are looking for doesn't exist or has been moved.</p>
      <Link 
        to="/" 
        className="bg-[#6a040f] px-6 py-3 rounded-full font-semibold hover:bg-[#370617] transition"
      >
        Return to Home
      </Link>
    </div>
  );
}