import React, { useState, useRef, useEffect } from "react";
import { Bell, CheckCircle, Trash2 } from "lucide-react";
import { useContext } from "react";
import { TransactionContext } from "../context/TransactionContext";

const NotificationMenu = () => {
  const { state } = useContext(TransactionContext);

  const [showNotif, setShowNotif] = useState(false);
  const [showMore, setShowMore] = useState(false);
  const notifRef = useRef(null);

  // Build notifications
  const notifList = [...state.transactions]
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .map((tx) => ({
      id: tx.id,
      message:
        tx.type === "income"
          ? `₹${tx.amount} credited as ${tx.source || "Income"}`
          : `₹${tx.amount} debited for ${tx.categoryName || "Expense"}`,
      date: tx.date,
      type: tx.type,
      read: tx.read || false,
    }))
    .slice(0, 8);

  const unreadCount = notifList.filter((n) => !n.read).length;

  // CLOSE WHEN CLICK OUTSIDE
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (notifRef.current && !notifRef.current.contains(e.target)) {
        setShowNotif(false);
      }
    };

    if (showNotif) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showNotif]);

  // Mark all read
  const markAllRead = () => {
    notifList.forEach((n) => (n.read = true));
    setShowNotif(true);
  };

  // Clear all notifications
  const clearAll = () => {
    state.transactions.length = 0;
    setShowNotif(false);
  };

  return (
    <div className="relative" ref={notifRef}>

      {/* Notification Button */}
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

      {/* Dropdown */}
      {showNotif && (
        <div className="absolute right-0 mt-2 w-80 bg-white border border-gray-200 
                        rounded-lg shadow-xl z-50 overflow-hidden">

          {/* Header */}
          <div className="px-4 py-3 bg-gray-50 border-b">
            <h3 className="text-sm font-semibold text-gray-700">Notifications</h3>
          </div>

          {/* List */}
          <div className="max-h-64 overflow-y-auto">

            {notifList.length === 0 && (
              <p className="text-center py-4 text-gray-500 text-sm">No notifications</p>
            )}

            {notifList.slice(0, showMore ? 8 : 3).map((n) => (
              <div
                key={n.id}
                className={`px-4 py-3 border-b last:border-none hover:bg-gray-50 cursor-pointer
                 ${n.read ? "opacity-70" : "font-medium"}`}
              >
                <p className="text-sm text-gray-800">{n.message}</p>
                <p className="text-xs text-gray-500 mt-1">{n.date}</p>
              </div>
            ))}

          </div>

          {/* Show more / less */}
          {notifList.length > 3 && (
            <button
              onClick={() => setShowMore(!showMore)}
              className="w-full py-2 text-center text-sm text-purple-600 hover:bg-gray-100"
            >
              {showMore ? "Show Less ▲" : "Show More ▼"}
            </button>
          )}

          {/* Footer */}
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
  );
};

export default NotificationMenu;
