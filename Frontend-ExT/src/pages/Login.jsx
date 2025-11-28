import React, { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import bgImage from "../assets/auth-bg.png";

// const bgImage = "../assets/auth-bg.png"; 

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();

    if (!email || !password) {
      setError("Email and Password required");
      return;
    }

    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (!storedUser) {
      setError("No user found. Please sign up first.");
      return;
    }
    if (storedUser.email !== email) {
      setError("Invalid email.");
      return;
    }

    // set dummy token
    localStorage.setItem("token", "dummy_token_123");
    navigate("/dashboard");

    const { setUser } = useUserContext();

const handleLoginSuccess = (res) => {
    setUser(res.data.user);   // simple, clean, correct
};

  };

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden">

      {/* Background image */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${bgImage})` }}
      ></div>

      {/* Subtle dark + blur overlay */}
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm"></div>

      {/* Floating glow */}
      <motion.div
        animate={{ x: [-20, 20, -20] }}
        transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
        className="hidden md:block absolute right-10 top-20 w-56 h-56 rounded-full bg-purple-500/20 blur-[90px]"
      />

      {/* Glass card */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative z-10 w-full max-w-md mx-4 p-[2px] rounded-2xl bg-gradient-to-br from-purple-500/40 to-indigo-500/40 shadow-xl"
      >
        <div className="bg-white/10 backdrop-blur-xl rounded-2xl px-8 py-10">

          {/* DIFFERENT EMOJI HEADING */}
          <motion.h2
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.6 }}
            className="text-3xl font-bold text-white text-center mb-4 flex items-center justify-center gap-2"
          >
            Welcome Back
            <motion.span
              aria-hidden="true"
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              👋
            </motion.span>
          </motion.h2>

          <p className="text-center text-gray-300 mb-6">
            Login, Go check your expenses!! 
          </p>

          {error && (
            <p className="text-red-300 text-sm text-center mb-4">{error}</p>
          )}

          {/* Login Form */}
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="text-sm text-gray-200">Email</label>
              <input
                type="email"
                className="w-full mt-2 px-3 py-2 rounded-md bg-gray-900/60 text-white outline-none focus:ring-2 focus:ring-indigo-400"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
              />
            </div>

            <div>
              <label className="text-sm text-gray-200">Password</label>
              <input
                type="password"
                className="w-full mt-2 px-3 py-2 rounded-md bg-gray-900/60 text-white outline-none focus:ring-2 focus:ring-indigo-400"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="******"
              />
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              type="submit"
              className="w-full bg-gradient-to-r from-purple-600 to-indigo-500 text-white py-2 rounded-md font-semibold shadow-md"
            >
              Login
            </motion.button>
          </form>

          {/* Signup link */}
          <p className="text-gray-300 text-sm text-center mt-6">
            Don't have an account?{" "}
            <span
              onClick={() => navigate("/signup")}
              className="text-purple-300 underline cursor-pointer"
            >
              Create account
            </span>
          </p>

        </div>
      </motion.div>

    </div>
  );
};

export default Login;
