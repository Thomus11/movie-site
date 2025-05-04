// Footer.js

import React from 'react';
import { FaFacebook, FaTwitter, FaInstagram, FaYoutube } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer className="bg-[#03071e] text-white py-16 mt-8 border-t border-[#370617]">
      <div className="max-w-screen-xl mx-auto px-6">
        
        {/* Top Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">

          {/* Column 1: Logo/Brand */}
          <div className="flex flex-col items-center md:items-start">
            <h2 
              className="text-4xl font-bold text-[#6a040f] mb-4" 
              style={{ fontFamily: 'Cinzel, serif' }}
            >
              CineReserve
            </h2>
            <p className="text-gray-400 text-sm leading-relaxed">
              Your one-stop destination for all movie bookings. Get tickets for the latest films and enjoy premium movie experiences.
            </p>
          </div>

          
          <div className="flex flex-col items-center md:items-start">
            <h3 className="text-xl font-semibold mb-4" style={{ fontFamily: 'Cinzel, serif' }}>Quick Links</h3>
            <ul className="space-y-3">
              <li><a href="#" className="hover:text-[#6a040f] transition-colors duration-300">About Us</a></li>
              <li><a href="#" className="hover:text-[#6a040f] transition-colors duration-300">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-[#6a040f] transition-colors duration-300">Terms of Service</a></li>
              <li><a href="#" className="hover:text-[#6a040f] transition-colors duration-300">Contact Us</a></li>
            </ul>
          </div>

        
          <div className="flex flex-col items-center md:items-start">
            <h3 className="text-xl font-semibold mb-4" style={{ fontFamily: 'Cinzel, serif' }}>Stay Connected</h3>
            <div className="flex space-x-6 mb-4">
              <a href="#" className="text-[#6a040f] hover:text-white transition-colors duration-300">
                <FaFacebook size={24} />
              </a>
              <a href="#" className="text-[#6a040f] hover:text-white transition-colors duration-300">
                <FaTwitter size={24} />
              </a>
              <a href="#" className="text-[#6a040f] hover:text-white transition-colors duration-300">
                <FaInstagram size={24} />
              </a>
              <a href="#" className="text-[#6a040f] hover:text-white transition-colors duration-300">
                <FaYoutube size={24} />
              </a>
            </div>
            <div className="w-full max-w-sm">
              <input
                type="email"
                className="w-full p-3 rounded-lg bg-[#370617] text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#6a040f]"
                placeholder="Enter your email to subscribe"
              />
              <button className="w-full mt-3 p-3 bg-[#6a040f] text-white font-semibold rounded-lg hover:bg-[#370617] transition-all duration-300">
                Subscribe
              </button>
            </div>
          </div>

        </div>

        {/* Bottom */}
        <div className="mt-12 text-center">
          <p className="text-sm text-gray-500">&copy; {new Date().getFullYear()} CineReserve. All Rights Reserved.</p>
        </div>

      </div>
    </footer>
  );
};

export default Footer;
