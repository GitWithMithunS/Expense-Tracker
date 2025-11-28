import React, { useEffect, useState } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";

import axiosConfig from "../util/axiosConfig"; // adjust path
import { API_ENDPOINTS } from "@/util/apiEnpoints";

const CalendarPage = () => {
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
  const fetchTransactions = async () => {
    try {
      const response = await axiosConfig.get(API_ENDPOINTS.GET_ALL_TRANSACTIONS);
      console.log("Calendar fetched:", response.data);
      setTransactions(response.data);
    } catch (error) {
      console.error("Calendar API error:", error);
    }
  };

  fetchTransactions();
}, []);


  // Convert transactions to calendar events
  const calendarEvents = transactions.map((tx) => ({
    id: tx.id,
    title: `${tx.categoryName} - ₹${tx.amount}`,
    date: tx.date,
    backgroundColor: tx.type === "income" ? "#22c55e" : "#ef4444", // green / red
    borderColor: "transparent",
    textColor: "white",
  }));

  return (
    <div className="p-6 min-h-screen bg-gray-50">

      {/* PAGE LAYOUT */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

        {/* LEFT: RECENT TRANSACTIONS */}
        <div className="col-span-1 bg-white rounded-xl shadow p-5">

          <h2 className="text-xl font-semibold text-gray-800 mb-2">
            Recent Transactions
          </h2>
          <p className="text-sm text-gray-500 mb-4">Your latest activity</p>

          <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2">
            {transactions
              .sort((a, b) => new Date(b.date) - new Date(a.date))
              .slice(0, 10)
              .map((tx) => (
                <div
                  key={tx.id}
                  className="p-4 bg-gray-100 rounded-xl shadow-sm hover:bg-gray-200 transition cursor-pointer"
                >
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-3">
                      <div className="text-2xl">{tx.icon}</div>
                      <div>
                        <p className="font-medium text-gray-800">{tx.categoryName}</p>
                        <p className="text-xs text-gray-500">
                          {tx.date} — {tx.paymentMethod.toUpperCase()}
                        </p>
                      </div>
                    </div>

                    <span
                      className={`font-semibold ${
                        tx.type === "income"
                          ? "text-green-600"
                          : "text-red-600"
                      }`}
                    >
                      {tx.type === "income" ? "+ " : "- "}₹{tx.amount}
                    </span>
                  </div>
                </div>
              ))}
          </div>
        </div>

        {/* RIGHT: CALENDAR */}
        <div className="col-span-2 bg-white rounded-xl shadow p-5">

          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            Calendar
          </h2>

          <FullCalendar
            plugins={[dayGridPlugin, interactionPlugin]}
            initialView="dayGridMonth"
            height="700px"
            events={calendarEvents}
            eventDisplay="block"
          />
        </div>
      </div>
    </div>
  );
};

export default CalendarPage;
