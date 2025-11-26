import React, { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import bgImage from "../assets/auth-bg.png";


// const bgImage = "../assets/auth-bg.png";

const Signup = () => {
  const [fullname, setFullname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const handleSignup = (e) => {
    e.preventDefault();

    if (!fullname || !email || !password || !confirmPassword) {
      setError("All fields are required.");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setError("");

    const user = { fullname, email };
    localStorage.setItem("user", JSON.stringify(user));

    // No auto-login → redirect to login
    navigate("/login");
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden">
      {/* Background */}
      <div
        className="absolute inset-0 bg-center bg-cover"
        style={{ backgroundImage: `url(${bgImage})` }}
      />
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />

      {/* Floating blur shape */}
      <motion.div
        animate={{ y: [-10, 10, -10] }}
        transition={{ duration: 14, repeat: Infinity, ease: "linear" }}
        className="hidden md:block absolute left-8 bottom-10 w-44 h-44 rounded-full bg-gradient-to-tr from-indigo-400 to-purple-500 opacity-20 blur-3xl"
      />

      {/* Glass card */}
      <motion.div
        initial={{ scale: 0.98, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.45 }}
        className="relative z-10 w-full max-w-3xl mx-4 bg-white/10 border border-white/20 backdrop-blur-md rounded-2xl shadow-xl p-8"
      >
        <div className="grid md:grid-cols-2 gap-4 items-center">
          {/* Left Content */}
          <div className="p-4">
            {/* 🔥 Correct animated emoji heading */}
            <motion.h2
              initial={{ y: -6, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.45 }}
              className="text-3xl font-semibold text-white mb-4 flex items-center gap-2"
            >
              Create Account
              <motion.span
                aria-hidden="true"
                initial={{ scale: 0.85, rotate: -10 }}
                animate={{
                  scale: [0.85, 1, 0.95],
                  rotate: [-10, 10, 0],
                }}
                transition={{
                  duration: 1.2,
                  repeat: Infinity,
                  repeatDelay: 2,
                }}
                className="inline-block"
              >
                ✨
              </motion.span>
            </motion.h2>

            <p className="text-sm text-gray-300">
              Join now to start tracking your income and expenses with beautiful
              charts.
              
            </p>
            <h2 className ="text-sm text-gray-300"> Track, Save, Smile!!</h2>

            <div className="mt-6 flex gap-2">
              <div className="px-3 py-1 rounded-full bg-white/10 text-white text-xs">
                Secure
              </div>
              <div className="px-3 py-1 rounded-full bg-white/10 text-white text-xs">
                Fast
              </div>
              <div className="px-3 py-1 rounded-full bg-white/10 text-white text-xs">
                Private
              </div>
            </div>
          </div>

          {/* Right form */}
          <div className="p-4">
            {error && (
              <p className="text-red-300 text-sm mb-3">{error}</p>
            )}

            <form onSubmit={handleSignup} className="space-y-3">
              <div>
                <label className="text-sm text-gray-200">Full Name</label>
                <input
                  type="text"
                  value={fullname}
                  onChange={(e) => setFullname(e.target.value)}
                  className="w-full mt-2 px-3 py-2 rounded-md bg-gray-800/60 text-white outline-none focus:ring-2 focus:ring-purple-400"
                />
              </div>

              <div>
                <label className="text-sm text-gray-200">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full mt-2 px-3 py-2 rounded-md bg-gray-800/60 text-white outline-none focus:ring-2 focus:ring-purple-400"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className="text-sm text-gray-200">Password</label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full mt-2 px-3 py-2 rounded-md bg-gray-800/60 text-white outline-none focus:ring-2 focus:ring-purple-400"
                  />
                </div>

                <div>
                  <label className="text-sm text-gray-200">
                    Confirm Password
                  </label>
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full mt-2 px-3 py-2 rounded-md bg-gray-800/60 text-white outline-none focus:ring-2 focus:ring-purple-400"
                  />
                </div>
              </div>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                className="w-full py-2 rounded-md bg-gradient-to-r from-purple-600 to-indigo-500 text-white font-semibold mt-1"
              >
                Sign Up
              </motion.button>
            </form>

            <p className="text-gray-300 text-sm text-center mt-3">
              Already have an account?{" "}
              <span
                onClick={() => navigate("/login")}
                className="text-purple-300 underline cursor-pointer"
              >
                Login
              </span>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Signup;
