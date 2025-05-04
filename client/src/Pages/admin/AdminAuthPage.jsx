// AdminAuthPage.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function AdminAuthPage({ onVerify }) {
  const navigate = useNavigate();
  const [branch, setBranch] = useState("");
  const [adminCode, setAdminCode] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (adminCode === process.env.REACT_APP_ADMIN_CODE || adminCode === "SECRET123") {
      if (onVerify) {
        onVerify();
      }
      navigate("/admin-dashboard");
    } else {
      alert("Invalid Admin Code");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0B0C10] text-white">
      <form onSubmit={handleSubmit} className="bg-[#1f2025] p-8 rounded-lg shadow-lg w-full max-w-sm">
        <h2 className="text-2xl font-bold mb-6 text-center">Admin Verification</h2>
        <input
          type="text"
          placeholder="Branch Location"
          className="w-full mb-4 px-4 py-2 rounded bg-[#2a2b30] text-white focus:outline-none"
          value={branch}
          onChange={(e) => setBranch(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Admin Code"
          className="w-full mb-4 px-4 py-2 rounded bg-[#2a2b30] text-white focus:outline-none"
          value={adminCode}
          onChange={(e) => setAdminCode(e.target.value)}
          required
        />
        <button
          type="submit"
          className="w-full bg-white text-black py-2 rounded hover:bg-gray-300 transition"
        >
          Enter Dashboard
        </button>
      </form>
    </div>
  );
}
