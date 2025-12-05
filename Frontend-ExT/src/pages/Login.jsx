import React, { useContext, useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import bgImage from "../assets/back_pic.jpg";
import axiosConfig from "@/util/axiosConfig";
import { API_ENDPOINTS } from "@/util/apiEnpoints";
import { showErrorToast, showSuccessToast } from "@/components/common/CustomToast";
import AppContext from "@/context/AppContext";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const { user, setUser } = useContext(AppContext);

  // const generateDummyToken = () => {
  //   const payload = { email, ts: Date.now() };
  //   return btoa(JSON.stringify(payload)); // simple encoded token
  // };


  //login handling
  const handleLogin = async (e) => {
    e.preventDefault();

    // Email validation
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email)) {
      showErrorToast("Enter a valid email address.");
      return;
    }

    // Password validation
    if (!password || password.length < 6) {
      showErrorToast("Password must be at least 6 characters.");
      return;
    }

    try {
      const payload = { email, password };

      const response = await axiosConfig.post(API_ENDPOINTS.LOGIN, payload);

      console.log("Login API response:", response);

      const token = response.data?.data?.token;
      if (!token) {
        showErrorToast("Invalid server response. Token missing.");
        return;
      }

      // Decode JWT to extract userId
      const decoded = JSON.parse(atob(token.split(".")[1]));
      const userId = decoded.userId;

      console.log("Decoded JWT:", decoded);
      console.log("UserID from token:", userId);

      // Store authentication info
      localStorage.setItem("token", token);
      localStorage.setItem("userEmail", email);
      localStorage.setItem("userId", userId);

      // Update context
      const loggedInUser = { email, userId, token };
      console.log('login successful, loggedInUser ');
      
      setUser(loggedInUser);

      showSuccessToast("Login successful");

      navigate("/dashboard");
    } catch (error) {
      console.error("Login error:", error);
      const msg = error.response?.data?.message || "Login failed. Please try again.";
      showErrorToast(msg);
    }
  };


  return (
    <div className="min-h-screen flex w-full">
      {/* LEFT */}
      <div className="w-[60%] relative hidden md:block">
        <img src={bgImage} alt="login" className="w-full h-full object-cover" />
      </div>

      {/* RIGHT */}
      <div className="w-full md:w-[40%] bg-white flex flex-col justify-center px-10 md:px-16">
        <h1 className="text-3xl font-bold text-center mb-8">Expense Tracker</h1>

        <motion.h2
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-2xl font-semibold text-center mb-2"
        >
          Welcome Back 👋
        </motion.h2>

        {error && <p className="text-red-500 text-center mb-3">{error}</p>}

        <form onSubmit={handleLogin} className="space-y-4">
          <input
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-3 py-2 bg-gray-100 rounded-lg border"
          />

          <input
            type="password"
            placeholder="********"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-3 py-2 bg-gray-100 rounded-lg border"
          />

          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            type="submit"
            className="w-full bg-purple-700 text-white py-2 rounded-lg font-semibold"
          >
            Login
          </motion.button>
        </form>

        <p className="text-sm text-center mt-6">
          Don't have an account?{" "}
          <span
            className="text-purple-700 underline cursor-pointer"
            onClick={() => navigate("/signup")}
          >
            Create Account
          </span>
        </p>
      </div>
    </div>
  );
};

export default Login;