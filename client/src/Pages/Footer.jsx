import React from 'react';
import { FaFacebook, FaTwitter, FaInstagram, FaYoutube } from 'react-icons/fa';
import { FiMail, FiMapPin, FiPhone, FiClock } from 'react-icons/fi';

const Footer = () => {
  return (
    <footer className="bg-[#0B0C10] text-white pt-20 pb-12 border-t border-[#1F1F1F]">
      <div className="max-w-screen-xl mx-auto px-6">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-12 mb-16">
          
          {/* Brand Column */}
          <div className="flex flex-col">
            <h2 className="text-3xl font-bold mb-6 font-playfair tracking-wider">
              Cine<span className="text-red-500">Reserve</span>
            </h2>
            <p className="text-gray-400 mb-6 leading-relaxed font-light">
              Nairobi's premier cinema experience offering luxury screenings, gourmet concessions, and unforgettable movie moments.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-white transition-colors duration-300">
                <FaFacebook size={20} />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors duration-300">
                <FaTwitter size={20} />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors duration-300">
                <FaInstagram size={20} />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors duration-300">
                <FaYoutube size={20} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="flex flex-col">
            <h3 className="text-lg font-semibold mb-6 font-playfair tracking-wider uppercase text-gray-300">
              Navigation
            </h3>
            <ul className="space-y-3">
              {['Movies', 'Cinemas', 'Offers', 'Gift Cards'].map((item) => (
                <li key={item}>
                  <a href="#" className="text-gray-400 hover:text-red-400 transition-colors duration-300 flex items-center">
                    <span className="w-1 h-1 bg-red-500 rounded-full mr-3 opacity-0 group-hover:opacity-100 transition-opacity"></span>
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div className="flex flex-col">
            <h3 className="text-lg font-semibold mb-6 font-playfair tracking-wider uppercase text-gray-300">
              Contact
            </h3>
            <ul className="space-y-4">
              <li className="flex items-start">
                <FiMapPin className="text-red-500 mt-1 mr-3 flex-shrink-0" />
                <span className="text-gray-400">Nairobi, Kenya</span>
              </li>
              <li className="flex items-start">
                <FiMail className="text-red-500 mt-1 mr-3 flex-shrink-0" />
                <span className="text-gray-400">info@cinerserve.co.ke</span>
              </li>
              <li className="flex items-start">
                <FiPhone className="text-red-500 mt-1 mr-3 flex-shrink-0" />
                <span className="text-gray-400">+254 700 123456</span>
              </li>
              <li className="flex items-start">
                <FiClock className="text-red-500 mt-1 mr-3 flex-shrink-0" />
                <span className="text-gray-400">Daily: 10AM - 11PM</span>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div className="flex flex-col">
            <h3 className="text-lg font-semibold mb-6 font-playfair tracking-wider uppercase text-gray-300">
              Newsletter
            </h3>
            <p className="text-gray-400 mb-4 leading-relaxed font-light">
              Subscribe for exclusive offers and movie updates
            </p>
            <div className="flex">
              <input
                type="email"
                className="flex-grow p-3 rounded-l-lg bg-[#1F1F1F] text-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-red-500"
                placeholder="Your email"
              />
              <button className="bg-red-600 hover:bg-red-700 text-white px-4 rounded-r-lg transition-colors duration-300">
                <FiMail size={20} />
              </button>
            </div>
          </div>
        </div>

        {/* Copyright & Legal */}
        <div className="pt-8 border-t border-[#1F1F1F]">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-sm text-gray-500 mb-4 md:mb-0">
              &copy; {new Date().getFullYear()} CineReserve. All rights reserved.
            </p>
            <div className="flex space-x-6">
              <a href="#" className="text-sm text-gray-500 hover:text-white transition-colors duration-300">
                Privacy Policy
              </a>
              <a href="#" className="text-sm text-gray-500 hover:text-white transition-colors duration-300">
                Terms of Service
              </a>
              <a href="#" className="text-sm text-gray-500 hover:text-white transition-colors duration-300">
                Sitemap
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Font Import */}
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700&display=swap');
        .font-playfair {
          font-family: 'Playfair Display', serif;
        }
      `}</style>
    </footer>
  );
};

export default Footer;