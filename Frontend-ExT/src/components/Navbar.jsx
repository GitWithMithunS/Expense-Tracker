import React, { useState, useContext, useRef, useEffect } from 'react';
import AppContext from '../context/AppContext';
import { useNavigate } from 'react-router-dom';

// Icons
import {
  LogOut,
  Menu,
  User,
  X,
  Bell,
  CalendarDays,
  CheckCircle,
  Trash2
} from 'lucide-react';

import Sidebar from './Sidebar';
import logo from '../assets/logo.png';
import { TransactionContext } from "../context/TransactionContext";

const Navbar = ({ activeMenu }) => {
  const [openSidebar, setOpenSidebar] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [showNotif, setShowNotif] = useState(false);
  const [showMore, setShowMore] = useState(false);

  const dropdownRef = useRef(null);
  const notifRef = useRef(null);

  const { user } = useContext(AppContext);
  const { state } = useContext(TransactionContext);
  const navigate = useNavigate();

  // Logout
  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.clear();
    setShowDropdown(false);
    navigate('/login');
  };

  // CLOSE PROFILE DROPDOWN WHEN CLICKING OUTSIDE
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setShowDropdown(false);
      }
    };

    if (showDropdown) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showDropdown]);

  // CLOSE NOTIFICATION DROPDOWN WHEN CLICKING OUTSIDE
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (notifRef.current && !notifRef.current.contains(e.target)) {
        setShowNotif(false);
      }
    };

    if (showNotif) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showNotif]);

  // BUILD NOTIFICATIONS FROM TRANSACTIONS
  const notifList = [...state.transactions]
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .map((tx) => {
      const isIncome = tx.type === "income";
      return {
        id: tx.id,
        message: isIncome
          ? `₹${tx.amount} credited as ${tx.source || "Income"}`
          : `₹${tx.amount} debited for ${tx.category || "Expense"}`,
        date: tx.date,
        type: tx.type,
        read: tx.read || false
      };
    })
    .slice(0, 8); // store max 8 notifications


  // MARK ALL AS READ
  const markAllRead = () => {
    notifList.forEach(n => (n.read = true));
    setShowNotif(true); // refresh UI
  };

  // CLEAR ALL NOTIFICATIONS
  const clearAll = () => {
    state.transactions.length = 0; // wipe from context memory temporarily
    setShowNotif(false);
  };

  const unreadCount = notifList.filter(n => !n.read).length;

  return (
    <>
      <div className="flex items-center justify-between gap-5 bg-white border border-b border-gray-200/50 
                      backdrop-blur-[2px] py-4 px-4 sm:px-6 lg:px-7 sticky top-0 z-30">

        {/* LEFT SIDE — MENU + LOGO */}
        <div className="flex items-center gap-5">
          <button
            onClick={() => setOpenSidebar(!openSidebar)}
            className="block lg:hidden text-black hover:bg-gray-100 p-1 rounded transition"
          >
            {openSidebar ? <X /> : <Menu />}
          </button>

          <div className="flex items-center gap-2">
            <img src={logo} alt="Logo" className="h-10 w-10" />
            <span className="text-lg font-medium text-black truncate">
              Expense Tracker
            </span>
          </div>
        </div>

        {/* RIGHT SIDE — NOTIFS, CALENDAR, PROFILE */}
        <div className="flex items-center gap-4">

          {/* 🍔 NOTIFICATION DROPDOWN */}
          <div className="relative" ref={notifRef}>
            <button
              onClick={() => setShowNotif(!showNotif)}
              className="relative w-10 h-10 flex items-center justify-center 
                         bg-gray-100 hover:bg-gray-200 rounded-full transition"
            >
              <Bell className="w-5 h-5 text-purple-500" />

              {unreadCount > 0 && (
                <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full"></span>
              )}
            </button>

            {showNotif && (
              <div className="absolute right-0 mt-2 w-80 bg-white border border-gray-200 
                              rounded-lg shadow-xl z-50 overflow-hidden">

                {/* Header */}
                <div className="px-4 py-3 bg-gray-50 border-b">
                  <h3 className="text-sm font-semibold text-gray-700">Notifications</h3>
                </div>

                {/* Notification List */}
                <div className="max-h-64 overflow-y-auto">

                  {notifList.length === 0 && (
                    <p className="text-center py-4 text-gray-500 text-sm">No notifications</p>
                  )}

                  {notifList.slice(0, showMore ? 8 : 3).map((n, index) => (
                    <div
                      key={index}
                      className={`px-4 py-3 border-b last:border-none hover:bg-gray-50 cursor-pointer
                       ${n.read ? "opacity-70" : "font-medium"}`}
                    >
                      <p className="text-sm text-gray-800">{n.message}</p>
                      <p className="text-xs text-gray-500 mt-1">{n.date}</p>
                    </div>
                  ))}

                </div>

                {/* SHOW MORE / LESS */}
                {notifList.length > 3 && (
                  <button
                    onClick={() => setShowMore(!showMore)}
                    className="w-full py-2 text-center text-sm text-purple-600 hover:bg-gray-100"
                  >
                    {showMore ? "Show Less ▲" : "Show More ▼"}
                  </button>
                )}

                {/* FOOTER: MARK ALL READ & CLEAR */}
                <div className="flex items-center justify-between border-t bg-gray-50 px-4 py-2">
                  <button
                    onClick={markAllRead}
                    className="flex items-center gap-1 text-xs text-green-600 hover:text-green-700"
                  >
                    <CheckCircle size={14} /> Mark all read
                  </button>

                  <button
                    onClick={clearAll}
                    className="flex items-center gap-1 text-xs text-red-600 hover:text-red-700"
                  >
                    <Trash2 size={14} /> Clear all
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* 📅 CALENDAR ICON */}
          <button
            onClick={() => navigate('/dashboard#calendar')}
            className="w-10 h-10 flex items-center justify-center 
                       bg-gray-100 hover:bg-gray-200 rounded-full transition"
          >
            <CalendarDays className="w-5 h-5 text-purple-500" />
          </button>

          {/* 👤 PROFILE DROPDOWN */}
          
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setShowDropdown(!showDropdown)}
              className="flex items-center justify-center w-10 h-10 bg-gray-100 hover:bg-gray-200 
                         rounded-full transition focus:outline-none focus:ring-2 focus:ring-purple-400"
            >
              <User className="text-purple-500" />
            </button>

            {showDropdown && (
              <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg py-1 z-50">

                {/* User Details */}
                <div className="px-4 py-3 border-b">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center justify-center w-8 h-8 bg-gray-100 rounded-full">
                      <User className="w-4 h-4 text-purple-600" />
                    </div>

                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-800 truncate">
                        {user?.fullname || 'Guest User'}
                      </p>
                      <p className="text-xs text-gray-500 truncate">
                        {user?.email || 'guest@example.com'}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Logout */}
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-3 w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  <LogOut className="w-4 h-4 text-gray-500" />
                  Logout
                </button>

              </div>
            )}
          </div>

        </div>


        {/* MOBILE SIDEBAR */}
        {openSidebar && (
          <div className="fixed left-0 right-0 bg-white border-b border-gray-200 lg:hidden z-20 top-[73px]">
            <Sidebar activeMenu={activeMenu} />
          </div>
        )}

      </div>
    </>
  );
};

export default Navbar;
