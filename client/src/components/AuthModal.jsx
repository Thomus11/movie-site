// AuthModal.jsx

import React, { useEffect } from "react";
import { useFormik } from "formik";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import api from "../api"; // <-- use the centralized Axios instance

export default function AuthModal({ type, onClose, onLogin }) {
  const isLogin = type === "login";
  const navigate = useNavigate();

  useEffect(() => {
    // Optional: reapply token if it changes later
    const storedToken = localStorage.getItem("token");
    if (storedToken) {
      api.defaults.headers.common["Authorization"] = `Bearer ${storedToken}`;
    }
  }, []);

  const formik = useFormik({
    initialValues: {
      fullName: "",
      email: "",
      password: "",
      confirmPassword: "",
      phone: "",
      role: "",
    },
    validate: (values) => {
      const errors = {};
      const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;

      if (!isLogin) {
        if (!values.fullName) errors.fullName = "Full name is required";
        if (!values.phone) errors.phone = "Phone number is required";
        if (values.password !== values.confirmPassword)
          errors.confirmPassword = "Passwords must match";
      }

      if (!values.email) {
        errors.email = "Email is required";
      } else if (!/\S+@\S+\.\S+/.test(values.email)) {
        errors.email = "Email address is invalid";
      }

      if (!values.password) {
        errors.password = "Password is required";
      } else if (!passwordRegex.test(values.password)) {
        errors.password =
          "Password must be at least 8 characters and include uppercase, lowercase, number, and special character.";
      }

      return errors;
    },
    onSubmit: async (values) => {
      try {
        if (isLogin) {
          const res = await api.post("/login", {
            email: values.email,
            password: values.password,
          });

          const { access_token, role, username } = res.data;
          localStorage.setItem("token", access_token);
          localStorage.setItem("username", username);
          localStorage.setItem("role", role);

          // Set token for future requests
          api.defaults.headers.common["Authorization"] = `Bearer ${access_token}`;

          onLogin({ username, role });
          toast.success("Login successful!");
          navigate(role === "admin" ? "/admin-auth" : "/dashboard");
        } else {
          await api.post("/register", {
            username: values.email,
            email: values.email,
            password: values.password,
            full_name: values.fullName,
            phone: values.phone,
            role: values.role || "user", 
          });

          toast.success("Your account has been created successfully. Please log in.");
          onClose();
        }
      } catch (err) {
        toast.error(err.response?.data?.message || "An error occurred");
        console.error(err);
      }
    },
  });

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
      <div className="bg-[#0B0C10] rounded-xl shadow-lg w-full max-w-md p-8 animate-fade-in relative text-white">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-400 hover:text-white text-xl font-bold"
        >
          &times;
        </button>
        <h2 className="text-2xl font-semibold mb-6 text-center">
          {isLogin ? "Log In" : "Sign Up"}
        </h2>

        <form className="space-y-4" onSubmit={formik.handleSubmit}>
          {!isLogin && (
            <>
              <div>
                <input
                  type="text"
                  name="fullName"
                  placeholder="Full Name"
                  className="w-full border border-gray-600 bg-transparent px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-white"
                  value={formik.values.fullName}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
                {formik.touched.fullName && formik.errors.fullName && (
                  <div className="text-red-400 text-sm">
                    {formik.errors.fullName}
                  </div>
                )}
              </div>
              <div>
                <input
                  type="text"
                  name="phone"
                  placeholder="Phone Number"
                  className="w-full border border-gray-600 bg-transparent px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-white"
                  value={formik.values.phone}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
                {formik.touched.phone && formik.errors.phone && (
                  <div className="text-red-400 text-sm">
                    {formik.errors.phone}
                  </div>
                )}
              </div>
            </>
          )}

          <div>
            <input
              type="email"
              name="email"
              placeholder="Email"
              className="w-full border border-gray-600 bg-transparent px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-white"
              value={formik.values.email}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
            {formik.touched.email && formik.errors.email && (
              <div className="text-red-400 text-sm">
                {formik.errors.email}
              </div>
            )}
          </div>

          <div>
            <input
              type="password"
              name="password"
              placeholder="Password"
              className="w-full border border-gray-600 bg-transparent px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-white"
              value={formik.values.password}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
            {formik.touched.password && formik.errors.password && (
              <div className="text-red-400 text-sm">
                {formik.errors.password}
              </div>
            )}
          </div>

          {!isLogin && (
            <div>
              <input
                type="password"
                name="confirmPassword"
                placeholder="Confirm Password"
                className="w-full border border-gray-600 bg-transparent px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-white"
                value={formik.values.confirmPassword}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
              {formik.touched.confirmPassword &&
                formik.errors.confirmPassword && (
                  <div className="text-red-400 text-sm">
                    {formik.errors.confirmPassword}
                  </div>
                )}
            </div>
          )}

          <button
            type="submit"
            className="w-full bg-white text-black py-2 rounded-lg font-semibold hover:bg-gray-300 transition"
          >
            {isLogin ? "Log In" : "Sign Up"}
          </button>
        </form>
      </div>
    </div>
  );
}
