// AdminDashboard.jsx
import React from "react";
import { useAuth } from "../../contexts/AuthContext";
import { useNavigate } from "react-router-dom";

export default function AdminDashboard() {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  
  // Redirect if not logged in or not an admin
  if (!currentUser || currentUser.role !== "admin") {
    navigate('/');
    return null;
  }
  return (
    <div className="min-h-screen bg-[#0B0C10] text-white flex flex-col items-center justify-center">
      <h1 className="text-4xl font-bold mb-4">Admin Dashboard</h1>
      <p className="text-lg text-gray-300">Manage branches, screenings, and more...</p>
      {/* Later we can add cards, tables, etc */}
    </div>
  );
}

