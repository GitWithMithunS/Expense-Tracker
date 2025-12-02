// NotificationCard.jsx
import React from "react";
import { TrendingUp, TrendingDown, Bell, CreditCard, Trash } from "lucide-react";

const NotificationCard = ({ id, message, date, type, read, onDelete, onToggleRead }) => {
  const TypeIcon =
    type === "income" ? <TrendingUp size={18} className="text-green-700" /> :
    type === "expense" ? <TrendingDown size={18} className="text-red-700" /> :
    type === "subscription" ? <CreditCard size={18} className="text-blue-700" /> :
    <Bell size={18} className="text-purple-700" />;

  return (
    <div className="relative group">
      {/* unread dot */}
      {!read && <span className="absolute left-2 top-3 w-2 h-2 bg-purple-600 rounded-full z-10"></span>}

      <div
        className={`relative flex items-center gap-4 p-3 rounded-lg border border-gray-200 bg-white-200 shadow-sm
           hover:bg-purple-50 hover:shadow-md transition-all cursor-pointer ${read ? "opacity-70" : "opacity-100"}`}
      >
        <div className="w-10 h-10 flex items-center justify-center bg-gray-100 rounded-full">
          {TypeIcon}
        </div>

        <div className="flex flex-col flex-1">
          <p className="text-sm font-medium text-gray-800">{message}</p>
          <p className="text-xs text-gray-500 mt-1">{date}</p>
        </div>

        <div className="flex items-center gap-2">
          {/* toggle read/unread */}
          <button
            onClick={() => onToggleRead(id)}
            className="text-xs text-gray-500 hover:text-gray-700 px-2 py-1 rounded cursor-pointer"
            title={read ? "Mark as unread" : "Mark as read"}
          >
            {read ? "Read" : "Mark"}
          </button>

          {/* delete */}
          <button
            onClick={() => onDelete(id)}
            className="opacity-0 group-hover:opacity-100 transition-opacity text-gray-500 hover:text-red-600 cursor-pointer"
            title="Delete notification"
          >
            <Trash size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default NotificationCard;
