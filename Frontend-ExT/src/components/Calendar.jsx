import React, { useEffect, useState, useMemo, useContext } from "react";
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  CalendarIcon,
  PlusIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";
import { TransactionContext } from "../context/TransactionContext";

const monthNames = [
  "January","February","March","April","May","June",
  "July","August","September","October","November","December"
];

function formatDateKey(year, monthIndex, day) {
  const mm = String(monthIndex + 1).padStart(2, "0");
  const dd = String(day).padStart(2, "0");
  return `${year}-${mm}-${dd}`;
}

// For heatmap (expenses = red)
const EXPENSE_LOW = [252, 165, 165];  // light red
const EXPENSE_HIGH = [239, 68, 68];   // dark red

// For income amounts (green bubble in corner)
const INCOME_GREEN = "rgb(16,185,129)";  // emerald-500

// Helper: interpolate between two colors
function lerpColor(rgb1, rgb2, t) {
  const r = Math.round(rgb1[0] + (rgb2[0] - rgb1[0]) * t);
  const g = Math.round(rgb1[1] + (rgb2[1] - rgb1[1]) * t);
  const b = Math.round(rgb1[2] + (rgb2[2] - rgb1[2]) * t);
  return `rgb(${r}, ${g}, ${b})`;
}

export default function Calendar() {
  const { state } = useContext(TransactionContext);

  const today = new Date();
  const [month, setMonth] = useState(today.getMonth());
  const [year, setYear] = useState(today.getFullYear());

  const [selectedDate, setSelectedDate] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Add form
  const [form, setForm] = useState({
    type: "expense",
    category: "",
    desc: "",
    amount: "",
  });

  // ---------------------------------------------------------
  // 🔥 Build transactionsMap from global state (NO LOCAL STATE)
  // ---------------------------------------------------------
  const transactionsMap = useMemo(() => {
    const map = {};
    state.transactions.forEach((tx) => {
      const key = tx.date; // already YYYY-MM-DD from modal
      if (!map[key]) map[key] = [];
      map[key].push(tx);
    });
    return map;
  }, [state.transactions]);

  // ---------------------------------------------------------
  // Compute daily totals
  // ---------------------------------------------------------
  const totalsPerDay = useMemo(() => {
    const totals = {};

    Object.keys(transactionsMap).forEach((dateKey) => {
      const arr = transactionsMap[dateKey];

      const spent = arr
        .filter((t) => t.type === "expense")
        .reduce((s, t) => s + Number(t.amount), 0);

      const received = arr
        .filter((t) => t.type === "income")
        .reduce((s, t) => s + Number(t.amount), 0);

      totals[dateKey] = {
        spent,
        received,
        count: arr.length,
      };
    });

    return totals;
  }, [transactionsMap]);

  // Highest expense for heatmap
  const maxSpentThisMonth = useMemo(() => {
    let max = 0;
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    for (let d = 1; d <= daysInMonth; d++) {
      const key = formatDateKey(year, month, d);
      if (totalsPerDay[key]?.spent > max) max = totalsPerDay[key].spent;
    }
    return max;
  }, [totalsPerDay, month, year]);

  // ---------------------------------------------------------
  // Heatmap color only for EXPENSES
  // ---------------------------------------------------------
  function heatColorFor(dateKey) {
    const spent = totalsPerDay[dateKey]?.spent || 0;
    if (!spent) return "transparent";

    const t = maxSpentThisMonth === 0 ? 0 : spent / maxSpentThisMonth;
    return lerpColor(EXPENSE_LOW, EXPENSE_HIGH, t);
  }

  // ---------------------------------------------------------
  // Navigation
  // ---------------------------------------------------------
  const goNext = () => {
    const nextMonth = month === 11 ? 0 : month + 1;
    const nextYear = month === 11 ? year + 1 : year;
    setMonth(nextMonth);
    setYear(nextYear);
  };

  const goPrev = () => {
    const prevMonth = month === 0 ? 11 : month - 1;
    const prevYear = month === 0 ? year - 1 : year;
    setMonth(prevMonth);
    setYear(prevYear);
  };

  // ---------------------------------------------------------
  // Open modal for clicked date
  // ---------------------------------------------------------
  function openDayModal(day) {
    const key = formatDateKey(year, month, day);
    setSelectedDate(key);
    setIsModalOpen(true);
  }

  // ---------------------------------------------------------
  // Day grid building
  // ---------------------------------------------------------
  const firstDayOfMonth = new Date(year, month, 1);
  const startWeekday = firstDayOfMonth.getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const cells = [];
  for (let i = 0; i < startWeekday; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);

  return (
    <div className="w-full max-w-4xl mx-auto bg-white rounded-lg shadow p-6">

      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3 text-gray-700">
          <button onClick={goPrev} className="p-2 hover:bg-gray-100 rounded">
            <ChevronLeftIcon className="h-6 w-6" />
          </button>

          <div className="text-xl font-semibold">
            &lt; {monthNames[month]} {year} &gt;
          </div>

          <button onClick={goNext} className="p-2 hover:bg-gray-100 rounded">
            <ChevronRightIcon className="h-6 w-6" />
          </button>
        </div>

        <div className="flex items-center gap-2 text-sm text-gray-500">
          <CalendarIcon className="h-5 w-5 text-indigo-500" />
          <span>Monthly view</span>
        </div>
      </div>

      {/* Weekdays */}
      <div className="grid grid-cols-7 gap-2 text-xs text-center text-gray-500 mb-2">
        {["Sun","Mon","Tue","Wed","Thu","Fri","Sat"].map((wd) => (
          <div key={wd} className="py-1">{wd}</div>
        ))}
      </div>

      {/* Days grid */}
      <div className="grid grid-cols-7 gap-2">
        {cells.map((day, index) => {
          if (day === null)
            return <div key={index} className="h-20 p-2 border rounded bg-gray-50" />;

          const key = formatDateKey(year, month, day);
          const dayInfo = totalsPerDay[key] || {};

          const bg = heatColorFor(key);
          const isToday =
            key === formatDateKey(today.getFullYear(), today.getMonth(), today.getDate());

          return (
            <div
              key={key}
              onClick={() => openDayModal(day)}
              className="h-20 p-2 border rounded cursor-pointer relative"
              style={{ background: bg === "transparent" ? "" : bg + "33" }}
            >
              {/* Date + Income / Expense */}
              <div className="flex justify-between">
                <span className={`text-sm font-semibold ${isToday ? "text-indigo-600" : "text-gray-700"}`}>
                  {day}
                </span>

                {/* Income tag (green) */}
                {dayInfo.received > 0 && (
                  <span className="text-xs font-semibold text-white px-2 py-0.5 rounded-full"
                    style={{ background: INCOME_GREEN }}>
                    +₹{dayInfo.received}
                  </span>
                )}

                {/* Expense tag (red, only if income isn't shown) */}
                {dayInfo.received === 0 && dayInfo.spent > 0 && (
                  <span className="text-xs font-semibold text-white px-2 py-0.5 rounded-full bg-red-500">
                    -₹{dayInfo.spent}
                  </span>
                )}
              </div>

              {/* Transaction Count */}
              <div className="text-xs text-gray-500 mt-4">
                {dayInfo.count ? `${dayInfo.count} tx` : ""}
              </div>
            </div>
          );
        })}
      </div>

      {/* DAY MODAL */}
      {isModalOpen && selectedDate && (
        <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50">
          <div className="bg-white w-full max-w-2xl rounded-lg shadow-xl p-6">

            <div className="flex justify-between items-center mb-3">
              <div>
                <p className="text-gray-500 text-sm">{selectedDate}</p>
                <h2 className="text-xl font-semibold">Transactions</h2>
              </div>

              <button
                className="text-sm text-gray-500 hover:text-black"
                onClick={() => (setIsModalOpen(false), setSelectedDate(null))}
              >
                Close
              </button>
            </div>

            {/* Transaction list */}
            <div className="max-h-56 overflow-y-auto mb-4 space-y-3">
              {(transactionsMap[selectedDate] || []).length === 0 && (
                <p className="text-gray-500 text-sm">No transactions for this date.</p>
              )}

              {(transactionsMap[selectedDate] || []).map((tx) => (
                <div key={tx.id} className="p-3 border rounded flex justify-between">
                  <div>
                    <p className="font-semibold">{tx.category} • {tx.type}</p>
                    <p className="text-sm text-gray-600">{tx.desc}</p>
                  </div>
                  <p className={tx.type === "income" ? "text-green-600 font-bold" : "text-red-600 font-bold"}>
                    ₹{tx.amount}
                  </p>
                </div>
              ))}
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
