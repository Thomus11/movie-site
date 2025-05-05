// AdminDashboard.jsx
import React, { useState } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { FaTheaterMasks, FaCalendarAlt, FaUsers, FaChartLine } from "react-icons/fa";

export default function AdminDashboard() {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  
  // Redirect if not logged in or not an admin
  if (!currentUser || currentUser.role !== "admin") {
    navigate('/');
    return null;
  }

  const stats = [
    { title: "Total Screenings", value: "24", icon: FaTheaterMasks, color: "bg-[#6a040f]" },
    { title: "Today's Shows", value: "8", icon: FaCalendarAlt, color: "bg-[#370617]" },
    { title: "Active Users", value: "156", icon: FaUsers, color: "bg-[#6a040f]" },
    { title: "Revenue", value: "KES 45,670", icon: FaChartLine, color: "bg-[#370617]" }
  ];

  return (
    <div className="min-h-screen bg-[#0B0C10] text-white p-8">
      {/* header */}
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold mb-2">Admin Dashboard</h1>
        <p className="text-lg text-gray-400 mb-8">Welcome back, {currentUser.username}</p>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {stats.map((stat, index) => (
            <div
              key={index}
              className={`${stat.color} rounded-lg p-6 transition-transform hover:scale-105`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-200 mb-2">{stat.title}</p>
                  <h3 className="text-2xl font-bold">{stat.value}</h3>
                </div>
                <stat.icon size={24} className="text-white opacity-80" />
              </div>
            </div>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Upcoming Screenings */}
          <div className="bg-[#1F2025] rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4">Upcoming Screenings</h2>
            <div className="space-y-4">
              {[1, 2, 3].map((_, index) => (
                <div key={index} className="flex items-center justify-between border-b border-gray-700 pb-4">
                  <div>
                    <h3 className="font-medium">The Kings of Kings</h3>
                    <p className="text-sm text-gray-400">Today, 7:00 PM</p>
                  </div>
                  <button className="text-sm bg-[#6a040f] px-4 py-2 rounded-full hover:bg-[#370617] transition">
                    Edit
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Activities */}
          <div className="bg-[#1F2025] rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4">Recent Activities</h2>
            <div className="space-y-4">
              {[1, 2, 3].map((_, index) => (
                <div key={index} className="flex items-center justify-between border-b border-gray-700 pb-4">
                  <div>
                    <h3 className="font-medium">New Booking</h3>
                    <p className="text-sm text-gray-400">2 tickets for Until Dawn</p>
                  </div>
                  <span className="text-sm text-gray-400">2 mins ago</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}