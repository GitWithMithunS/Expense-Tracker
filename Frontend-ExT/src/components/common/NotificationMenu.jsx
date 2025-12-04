import React, { useState, useRef, useEffect } from "react";
import { Bell, CheckCircle, Trash2 } from "lucide-react";
import axiosConfig from "../../util/axiosConfig";
import NotificationCard from "./NotificationCard";
import { API_ENDPOINTS } from "../../util/apiEnpoints";
import { showErrorToast, showSuccessToast } from "../common/CustomToast";
// import { C } from "@fullcalendar/core/internal-common";

const NotificationMenu = () => {
  const notifRef = useRef(null);
  const [showNotif, setShowNotif] = useState(false);
  const [showMore, setShowMore] = useState(false);

  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);

  const unreadCount = notifications.filter(n => n.status === "UNREAD").length;

  // ----------------------------
  // FETCH NOTIFICATIONS (API)
  // ----------------------------
  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const res = await axiosConfig.get(API_ENDPOINTS.GET_NOTIFICATIONS);

      setNotifications(res.data.data.reverse() || []);
    } catch (err) {
      showErrorToast("Failed to load notifications");
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  // Fetch when user opens dropdown
  const toggleDropdown = () => {
    const nextState = !showNotif;
    setShowNotif(nextState);

    if (nextState) fetchNotifications();
  };

  // Close when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (notifRef.current && !notifRef.current.contains(e.target)) {
        setShowNotif(false);
      }
    };

    if (showNotif) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showNotif]);

  // ----------------------------
  // MARK ALL AS READ
  // ----------------------------
  const markAllRead = async () => {
    try {
      await axiosConfig.patch(API_ENDPOINTS.MARK_ALL_READ);
      setNotifications(prev =>
        prev.map(n => ({ ...n, status: "READ" }))
      );
      showSuccessToast("All notifications marked read");
    } catch (err) {
      showErrorToast("Failed to mark read");
      console.log(err);
    }
  };

  // ----------------------------
  // DELETE ONE
  // ----------------------------
  const deleteOne = async (id) => {
    try {
      await axiosConfig.delete(API_ENDPOINTS.DELETE_NOTIFICATIONS(id));
      setNotifications(prev => prev.filter(n => n.id !== id));
      showSuccessToast("Notification Deleted Successfully");
    } catch (err) {
      console.log("some error occured while deleting notification from notification servcie" , err);
      showErrorToast("Delete notfication failed");
    }
  };

  // ----------------------------
  // CLEAR ALL
  // ----------------------------
  const clearAll = async () => {
    try {
      await axiosConfig.delete(API_ENDPOINTS.DELETE_ALL_NOTIFICATIONS)
      
      setNotifications([]);
      showSuccessToast("All Notifications cleared");
      setShowNotif(false);
    } catch (err) {
      console.log("some error occured in clearall from notification servcie" , err);
      showErrorToast("Failed to clear notfications");
    }
  };

  return (
    <div className="relative" ref={notifRef}>
      {/* Notification Icon Button */}
      <button
        onClick={toggleDropdown}
        className="relative cursor-pointer w-10 h-10 flex items-center justify-center 
                   bg-gray-100 hover:bg-gray-200 rounded-full transition"
      >
        <Bell className="w-5 h-5 text-purple-500" />

        {unreadCount > 0 && (
          <span className="absolute -top-0.5 -right-0.5 w-3 h-3 bg-red-500 rounded-full border-2 border-white"></span>
        )}
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
            {loading && <p className="text-gray-500 text-center py-4">Loading...</p>}

            {!loading && notifications.length === 0 && (
              <p className="text-center py-6 text-gray-500 text-sm">No notifications</p>
            )}

            {!loading &&
              notifications
                .slice(0, showMore ? notifications.length : 3)
                .map(n => (
                  <NotificationCard
                    key={n.id}
                    id={n.id}
                    message={n.message}
                    date={n.createdAt}
                    read={n.status === "READ"}
                    onDelete={() => deleteOne(n.id)}
                    onToggleRead={() =>
                      setNotifications(prev =>
                        prev.map(x =>
                          x.id === n.id
                            ? { ...x, status: x.status === "UNREAD" ? "READ" : "UNREAD" }
                            : x
                        )
                      )
                    }
                  />
                ))}
          </div>

          {/* Show more/less */}
          {notifications.length > 3 && (
            <button
              className="w-full py-2 text-center text-sm text-purple-600 hover:bg-gray-100"
              onClick={() => setShowMore(!showMore)}
            >
              {showMore ? "Show Less ▲" : "Show More ▼"}
            </button>
          )}

          {/* Footer */}
          <div className="flex items-center justify-between border-t bg-gray-50 px-3 py-2">
            <button
              onClick={markAllRead}
              className="flex items-center gap-2 text-xs text-green-600 hover:text-green-700"
            >
              <CheckCircle size={14} /> Mark all read
            </button>

            <button
              onClick={clearAll}
              className="flex items-center gap-2 text-xs text-red-600 hover:text-red-700"
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
