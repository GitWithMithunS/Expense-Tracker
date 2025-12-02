// NotificationMenu.jsx
import React, { useState, useRef, useEffect } from "react";
import { Bell, CheckCircle, Trash2 } from "lucide-react";
import NotificationCard from "./NotificationCard";

const NotificationMenu = () => {
  const notifRef = useRef(null);
  const [showNotif, setShowNotif] = useState(false);
  const [showMore, setShowMore] = useState(false);

  // ------------------------------
  // MOCK NOTIFICATIONS (replace with API)
  // ------------------------------
  const [notifications, setNotifications] = useState([
    {
      id: 1001,
      message: "₹50,000 Salary credited to your account",
      date: "2025-02-01",
      type: "income",
      read: false,
    },
    {
      id: 1002,
      message: "₹899 WiFi recharge processed",
      date: "2025-02-03",
      type: "subscription",
      read: false,
    },
    {
      id: 1003,
      message: "₹450 spent on Food & Dining",
      date: "2025-02-06",
      type: "expense",
      read: true,
    },
  ]);

  const unreadCount = notifications.filter((n) => !n.read).length;

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (notifRef.current && !notifRef.current.contains(e.target)) {
        setShowNotif(false);
      }
    };

    if (showNotif) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showNotif]);

  // Toggle a single notification read/unread
  const toggleRead = (id) => {
    setNotifications((prev) => prev.map(n => n.id === id ? { ...n, read: !n.read } : n));
  };

  // Delete a single notification
  const deleteOne = (id) => {
    setNotifications((prev) => prev.filter(n => n.id !== id));
  };

  // Mark all as read
  const markAllRead = () => {
    setNotifications((prev) => prev.map(n => ({ ...n, read: true })));
  };

  // Clear all notifications
  const clearAll = () => {
    setNotifications([]);
    setShowNotif(false);
  };

  return (
    <div className="relative" ref={notifRef}>
      {/* Notification Button */}
      <button
        onClick={() => setShowNotif(!showNotif)}
        className="relative cursor-pointer w-10 h-10 flex items-center justify-center 
                   bg-gray-100 hover:bg-gray-200 rounded-full transition"
        aria-label="Notifications"
      >
        <Bell className="w-5 h-5 text-purple-500" />
        {unreadCount > 0 && <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white"></span>}
      </button>

      {/* Dropdown */}
      {showNotif && (
        <div className="absolute right-0 mt-2 w-100 bg-white border border-gray-200 rounded-lg shadow-xl z-50 overflow-hidden">
          {/* Header */}
          <div className="px-4 py-3 bg-gray-50 border-b flex items-center justify-between">
            <h3 className="text-sm font-semibold text-gray-700">Notifications</h3>
            <div className="text-xs text-gray-500">{unreadCount} unread</div>
          </div>

          {/* List */}
          <div className="max-h-64 overflow-y-auto p-2 space-y-2">
            {notifications.length === 0 && (
              <p className="text-center py-6 text-gray-500 text-sm">No notifications</p>
            )}

            {notifications.slice(0, showMore ? notifications.length : 3).map((n) => (
              <NotificationCard
                key={n.id}
                id={n.id}
                message={n.message}
                date={n.date}
                type={n.type}
                read={n.read}
                onDelete={deleteOne}
                onToggleRead={toggleRead}
              />
            ))}
          </div>

          {/* Show more / less */}
          {notifications.length > 3 && (
            <button
              onClick={() => setShowMore(!showMore)}
              className="w-full py-2 text-center text-sm text-purple-600 hover:bg-gray-100"
            >
              {showMore ? "Show Less ▲" : "Show More ▼"}
            </button>
          )}

          {/* Footer */}
          <div className="flex items-center justify-between border-t bg-gray-50 px-3 py-2">
            <button
              onClick={markAllRead}
              className="flex items-center gap-2 text-xs text-green-600 hover:text-green-700 cursor-pointer"
            >
              <CheckCircle size={14} /> Mark all read
            </button>

            <button
              onClick={clearAll}
              className="flex items-center gap-2 text-xs text-red-600 hover:text-red-700 cursor-pointer"
            >
              <Trash2 size={14} /> Clear all
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationMenu;
