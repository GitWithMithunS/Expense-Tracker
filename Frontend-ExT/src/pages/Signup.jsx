import React, { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import bgImage from "../assets/back_pic.jpg";
import axiosConfig from "@/util/axiosConfig";
import { API_ENDPOINTS } from "@/util/apiEnpoints";
import { showErrorToast, showSuccessToast } from "@/components/common/CustomToast";

const Signup = () => {
  const [fullname, setFullname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");

  // const payload = {
  //   email: email,
  //   name: fullname,
  //   password: password
  // }

  const navigate = useNavigate();


  const handleSignup = async (e) => {
    e.preventDefault();

    // Email format validation
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email)) {
      setError("Enter a valid email address.");
      showErrorToast("Enter a valid email address.");
      return;
    }

    // Required fields
    if (!fullname || !email || !password || !confirmPassword) {
      setError("All fields are required.");
      showErrorToast("All fields are required.");
      return;
    }

    // Password validation
    if (password.length < 6) {
      setError("Password must be at least 6 characters long.");
      showErrorToast("Password must be at least 6 characters long.");
      return;
    }

    // Confirm password validation
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      showErrorToast("Passwords do not match.");
      return;
    }

    try {
      const payload = {
        name: fullname,
        email,
        password,
      };

      //signup request to backend
      const response = await axiosConfig.post(API_ENDPOINTS.REGISTER, payload);

      // Log full response
      console.log("Signup API response:", response);

      // Validate backend response
      if (response.data?.status !== "success") {
        showErrorToast(response.data.message || "Signup failed.");
        return;
      }

      // Notify user
      showSuccessToast("Account created successfully");

      // Redirect to login page
      navigate("/login");

    } catch (error) {
      console.error("Signup error:", error);

      const msg =
        error.response?.data?.message ||
        "Signup failed. Please try again.";

      showErrorToast(msg);
    }
  };


  return (
    <div className="min-h-screen flex w-full">
      {/* LEFT SIDE */}
      <div className="w-[60%] relative hidden md:block">
        <img src={bgImage} alt="signup" className="w-full h-full object-cover" />
      </div>

      {/* RIGHT SIDE */}
      <div className="w-full md:w-[40%] bg-white flex flex-col justify-center px-10 md:px-16">
        <h1 className="text-3xl font-bold text-center mb-8">Expense Tracker</h1>

        <motion.h2
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-2xl font-semibold text-center mb-2"
        >
          Create Account ✨
        </motion.h2>

        {error && <p className="text-red-500 text-center mb-3">{error}</p>}

        <form onSubmit={handleSignup} className="space-y-4">
          <input
            type="text"
            placeholder="Full Name"
            value={fullname}
            onChange={(e) => setFullname(e.target.value)}
            className="w-full px-3 py-2 bg-gray-100 rounded-lg border"
          />

          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-3 py-2 bg-gray-100 rounded-lg border"
          />

          <div className="grid grid-cols-2 gap-4">
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 bg-gray-100 rounded-lg border"
            />

            <input
              type="password"
              placeholder="Confirm"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full px-3 py-2 bg-gray-100 rounded-lg border"
            />
          </div>

          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            className="w-full bg-purple-700 text-white py-2 rounded-lg font-semibold"
            type="submit"
          >
            Sign Up
          </motion.button>
        </form>

        <p className="text-sm text-center mt-6">
          Already have an account?{" "}
          <span
            className="text-purple-700 underline cursor-pointer"
            onClick={() => navigate("/login")}
          >
            Login
          </span>
        </p>
      </div>
    </div>
  );
};

export default Signup;