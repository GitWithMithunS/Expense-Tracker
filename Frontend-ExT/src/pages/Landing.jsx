import React from "react";
import {
    Wallet,
    BarChart3,
    CalendarDays,
    Bell,
    Target,
    Layers,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import landingpageimage from "../assets/landingpageimage.png";

const LandingPage = () => {
    const navigate = useNavigate();
    return (
        <div className="w-full min-h-screen bg-purple-700 text-black">

            {/* ---------------- HERO SECTION ---------------- */}
            <section className="relative px-8 md:px-20 pt-28 pb-32 text-center">

                {/* Spotlight Glow */}
                <div className="absolute inset-0 bg-gradient-to-b from-purple-600/60 to-purple-900/80 blur-3xl opacity-40"></div>

                <h1 className="relative text-5xl md:text-6xl font-extrabold leading-tight text-white drop-shadow-2xl">
                    Smart Expense Tracking.
                    <br />
                    Control Your Money Easily.
                </h1>

                <p className="relative mt-6 text-lg text-gray-200 max-w-2xl mx-auto">
                    A powerful and intelligent dashboard that helps you visualize,
                    manage, and optimize your expenses — all from one place.
                </p>

                <div className="relative mt-8">
                    <button onClick={() => navigate("/login")} className="px-10 py-3 bg-white text-purple-700 font-semibold rounded-full shadow-lg hover:bg-gray-100 transition cursor-pointer">
                        Start Tracking
                    </button>
                </div>
            </section>

            {/* --------------- GLASS FEATURES SECTION ---------------- */}
            <section className="px-8 md:px-20 py-16">
                <h2 className="text-3xl font-bold text-white text-center mb-12">
                    Everything You Need to Stay Financially Healthy
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

                    {/* Card */}
                    <div className="backdrop-blur-xl bg-white/20 border border-white/30 rounded-xl p-6 shadow-xl hover:bg-white/25 transition">
                        <CalendarDays className="w-10 h-10 text-white mb-4" />
                        <h3 className="text-xl font-semibold text-white">Smart Calendar</h3>
                        <p className="text-gray-200 mt-2">
                            Visualize renewals, dues, and transactions on your calendar.
                        </p>
                    </div>

                    <div className="backdrop-blur-xl bg-white/20 border border-white/30 rounded-xl p-6 shadow-xl hover:bg-white/25 transition">
                        <Bell className="w-10 h-10 text-white mb-4" />
                        <h3 className="text-xl font-semibold text-white">Instant Alerts</h3>
                        <p className="text-gray-200 mt-2">
                            Get notifications for transactions, reminder and more.
                        </p>
                    </div>

                    <div className="backdrop-blur-xl bg-white/20 border border-white/30 rounded-xl p-6 shadow-xl hover:bg-white/25 transition">
                        <BarChart3 className="w-10 h-10 text-white mb-4" />
                        <h3 className="text-xl font-semibold text-white">Visual Analytics</h3>
                        <p className="text-gray-200 mt-2">
                            Beautiful pie charts, radar charts, and spending insights.
                        </p>
                    </div>

                    <div className="backdrop-blur-xl bg-white/20 border border-white/30 rounded-xl p-6 shadow-xl hover:bg-white/25 transition">
                        <Target className="w-10 h-10 text-white mb-4" />
                        <h3 className="text-xl font-semibold text-white">Savings Goals</h3>
                        <p className="text-gray-200 mt-2">
                            Set financial goals and track progress visually.
                        </p>
                    </div>

                    <div className="backdrop-blur-xl bg-white/20 border border-white/30 rounded-xl p-6 shadow-xl hover:bg-white/25 transition">
                        <Layers className="w-10 h-10 text-white mb-4" />
                        <h3 className="text-xl font-semibold text-white">Auto Categorization</h3>
                        <p className="text-gray-200 mt-2">
                            Transactions are automatically categorized for clarity.
                        </p>
                    </div>

                    <div className="backdrop-blur-xl bg-white/20 border border-white/30 rounded-xl p-6 shadow-xl hover:bg-white/25 transition">
                        <Wallet className="w-10 h-10 text-white mb-4" />
                        <h3 className="text-xl font-semibold text-white">Budget Planner</h3>
                        <p className="text-gray-200 mt-2">
                            Set, adjust, and track monthly budgets with clean analytics.
                        </p>
                    </div>

                </div>
            </section>

            {/* ----------- ANALYTICS SHOWCASE (Mock UI) ------------- */}
            <section className="px-8 md:px-20 py-24 bg-purple-800">
                <h2 className="text-3xl font-bold text-white text-center mb-10">
                    A Dashboard That Works For You
                </h2>

                <div className="max-w-4xl mx-auto bg-white rounded-2xl p-8 shadow-lg">
                    <img
                        src={landingpageimage}
                        className="w-full mx-auto"
                        alt="Analytics Preview"
                    />
                </div>
            </section>

            {/* ----------- CTA SECTION ----------- */}
            <section className="px-8 md:px-20 py-20 text-center bg-purple-700">
                <h2 className="text-4xl font-bold text-white mb-6">
                    Start Managing Your Money Smarter
                </h2>

                <button onClick={() => navigate("/login")} className="px-10 py-3 bg-white text-purple-700 font-semibold rounded-full shadow-lg hover:bg-gray-100 transition cursor-pointer">
                    Create Your Free Account
                </button>
            </section>

            <footer className="py-8 bg-purple-900 text-purple-200">
                <div className="max-w-5xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between">

                    {/* Brand */}
                    <div className="text-center md:text-left mb-4 md:mb-0">
                        <h3 className="text-lg font-semibold text-white">Expense Tracker</h3>
                        <p className="text-xs text-purple-300 mt-1">
                            Smarter spending for a smarter life.
                        </p>
                    </div>

                    {/* Navigation Links */}
                    <div className="flex gap-6 text-sm font-medium">
                        <a href="/income" className="hover:text-white transition">Income</a>
                        <a href="/expense" className="hover:text-white transition">Expense</a>
                        <a href="/categories" className="hover:text-white transition">Categories</a>
                        <a href="/bills" className="hover:text-white transition">Bills</a>
                        <a href="/budget" className="hover:text-white transition">Budget</a>
                    </div>

                </div>

                {/* Bottom line */}
                <div className="text-center text-purple-400 text-xs mt-6">
                    © {new Date().getFullYear()} Expense Tracker. All Rights Reserved.
                </div>
            </footer>


        </div>
    );
};

export default LandingPage;
