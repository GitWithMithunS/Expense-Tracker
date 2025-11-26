import React, { useState, useMemo } from "react";
import { ChevronLeftIcon, ChevronRightIcon, CalendarIcon, PlusIcon, TrashIcon } from "@heroicons/react/24/outline";

/**
 * Calendar.jsx
 * Usage: import Calendar from "./Calendar"; <Calendar />
 *
 * All outputs that would go to backend are printed to console.
 * Tailwind CSS required.
 */

const monthNames = [
  "January","February","March","April","May","June",
  "July","August","September","October","November","December",
];

function formatDateKey(year, monthIndex, day) {
  // returns YYYY-MM-DD
  const mm = String(monthIndex + 1).padStart(2, "0");
  const dd = String(day).padStart(2, "0");
  return `${year}-${mm}-${dd}`;
}

// small helper: interpolate between two RGB colors by t [0..1]
function lerpColor(rgb1, rgb2, t) {
  const r = Math.round(rgb1[0] + (rgb2[0] - rgb1[0]) * t);
  const g = Math.round(rgb1[1] + (rgb2[1] - rgb1[1]) * t);
  const b = Math.round(rgb1[2] + (rgb2[2] - rgb1[2]) * t);
  return `rgb(${r}, ${g}, ${b})`;
}

// low->high colors for heatmap (green -> yellow -> red)
const LOW_COLOR = [34,197,94];    // emerald-500
const MID_COLOR = [250,204,21];   // amber-400
const HIGH_COLOR = [239,68,68];   // red-500

export default function Calendar() {
  const today = new Date();
  const [month, setMonth] = useState(today.getMonth());
  const [year, setYear] = useState(today.getFullYear());

  // transactions: { "YYYY-MM-DD": [{id, type, category, desc, amount}] }
  const [transactionsMap, setTransactionsMap] = useState({
    // example seed data
    // "2025-11-10": [{ id: 1, type: "expense", category: "Food", desc: "Lunch", amount: 150 }],
  });

  const [selectedDate, setSelectedDate] = useState(null); // YYYY-MM-DD
  const [isModalOpen, setIsModalOpen] = useState(false);

  // form state for adding a transaction
  const [form, setForm] = useState({
    type: "expense",
    category: "",
    desc: "",
    amount: ""
  });

  // compute days for the month grid
  const firstDayOfMonth = new Date(year, month, 1);
  const startWeekday = firstDayOfMonth.getDay(); // 0..6 Sun..Sat
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  // totals per day (memoized)
  const totalsPerDay = useMemo(() => {
    const totals = {};
    Object.keys(transactionsMap).forEach((dateKey) => {
      const arr = transactionsMap[dateKey] || [];
      const total = arr.reduce((s, item) => s + Number(item.amount || 0) * (item.type === "expense" ? 1 : -1), 0);
      // We'll consider "spent" as sum of expense amounts (positive)
      const spent = arr.filter(i => i.type === "expense").reduce((s,i)=>s+Number(i.amount||0),0);
      totals[dateKey] = { total, spent, count: arr.length };
    });
    return totals;
  }, [transactionsMap]);

  const maxSpentThisMonth = useMemo(() => {
    // find max spent in current month
    let max = 0;
    for (let d = 1; d <= daysInMonth; d++) {
      const key = formatDateKey(year, month, d);
      if (totalsPerDay[key]?.spent > max) max = totalsPerDay[key].spent;
    }
    return max;
  }, [totalsPerDay, year, month, daysInMonth]);

  // heat color calculation: returns CSS background color string
  function heatColorFor(dateKey) {
    const spent = totalsPerDay[dateKey]?.spent || 0;
    if (!spent) return "transparent";
    const t = maxSpentThisMonth === 0 ? 0 : Math.min(1, spent / maxSpentThisMonth);
    // use two-stage interpolation: 0..0.6 => LOW->MID, 0.6..1 => MID->HIGH
    if (t < 0.6) {
      const t2 = t / 0.6;
      return lerpColor(LOW_COLOR, MID_COLOR, t2);
    } else {
      const t2 = (t - 0.6) / 0.4;
      return lerpColor(MID_COLOR, HIGH_COLOR, t2);
    }
  }

  // navigation
  const goNext = () => {
    const nextMonth = month === 11 ? 0 : month + 1;
    const nextYear = month === 11 ? year + 1 : year;
    setMonth(nextMonth); setYear(nextYear);
    console.log({ action: "monthChange", month: monthNames[nextMonth], year: nextYear });
  };
  const goPrev = () => {
    const prevMonth = month === 0 ? 11 : month - 1;
    const prevYear = month === 0 ? year - 1 : year;
    setMonth(prevMonth); setYear(prevYear);
    console.log({ action: "monthChange", month: monthNames[prevMonth], year: prevYear });
  };

  // open day modal
  function openDayModal(day) {
    const key = formatDateKey(year, month, day);
    setSelectedDate(key);
    setIsModalOpen(true);
    console.log({ action: "openDay", date: key, summary: totalsPerDay[key] || { spent:0, count:0 } });
  }

  // add transaction (prints to console, updates state)
  function addTransactionToDate(dateKey) {
    // basic validation
    if (!form.category) return alert("Please select / enter a category.");
    if (!form.amount || Number(form.amount) <= 0) return alert("Enter amount > 0.");

    const payload = {
      id: Date.now(),
      type: form.type,
      category: form.category,
      desc: form.desc,
      amount: Number(form.amount)
    };

    setTransactionsMap(prev => {
      const next = { ...prev };
      next[dateKey] = next[dateKey] ? [...next[dateKey], payload] : [payload];
      return next;
    });

    console.log({ action: "addTransaction", date: dateKey, payload });
    // reset form
    setForm({ type: "expense", category: "", desc: "", amount: "" });
  }

  function deleteTransaction(dateKey, id) {
    setTransactionsMap(prev => {
      const next = { ...prev };
      next[dateKey] = (next[dateKey] || []).filter(t => t.id !== id);
      return next;
    });
    console.log({ action: "deleteTransaction", date: dateKey, payload: { id } });
  }

  // helper to render grid cells
  const cells = [];
  // fill empty cells before first day
  for (let i = 0; i < startWeekday; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);

  return (
    <div className="w-full max-w-4xl mx-auto bg-white rounded-lg shadow p-6">
      {/* header */}
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

      {/* weekdays header */}
      <div className="grid grid-cols-7 gap-2 text-xs text-center text-gray-500 mb-2">
        {["Sun","Mon","Tue","Wed","Thu","Fri","Sat"].map((wd) => (
          <div key={wd} className="py-1">{wd}</div>
        ))}
      </div>

      {/* days grid */}
      <div className="grid grid-cols-7 gap-2">
        {cells.map((cell, idx) => {
          if (cell === null) {
            return <div key={idx} className="h-20 p-2 border rounded bg-gray-50" />;
          }
          const key = formatDateKey(year, month, cell);
          const dayData = totalsPerDay[key];
          const spent = dayData?.spent || 0;
          const bg = heatColorFor(key);
          const isToday = key === formatDateKey(today.getFullYear(), today.getMonth(), today.getDate());

          return (
            <div
              key={key}
              className={`h-20 p-2 border rounded cursor-pointer relative flex flex-col justify-between`}
              onClick={() => openDayModal(cell)}
              style={{ background: bg === "transparent" ? undefined : bg + "22" }} // subtle tint
            >
              <div className="flex justify-between items-start">
                <div className={`text-sm font-medium ${isToday ? "text-indigo-600" : "text-gray-800"}`}>
                  {cell}
                </div>

                {spent > 0 && (
                  <div className="text-xs font-semibold text-red-600">
                    ₹{spent}
                  </div>
                )}
              </div>

              <div className="text-xs text-gray-500">
                {dayData?.count ? `${dayData.count} tx` : ""}
              </div>
            </div>
          );
        })}
      </div>

      {/* DAY MODAL */}
      {isModalOpen && selectedDate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
          <div className="bg-white w-full max-w-2xl rounded-lg shadow-xl p-6">
            <div className="flex justify-between items-start mb-3">
              <div>
                <div className="text-sm text-gray-500">{selectedDate}</div>
                <div className="text-xl font-semibold">Transactions</div>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => { setIsModalOpen(false); setSelectedDate(null); }}
                  className="text-sm text-gray-600 hover:text-gray-800"
                >
                  Close
                </button>
              </div>
            </div>

            {/* list transactions */}
            <div className="max-h-48 overflow-auto mb-4 space-y-3">
              {(transactionsMap[selectedDate] || []).length === 0 && (
                <div className="text-sm text-gray-500">No transactions for this day.</div>
              )}

              {(transactionsMap[selectedDate] || []).map(tx => (
                <div key={tx.id} className="flex items-center justify-between p-2 border rounded">
                  <div>
                    <div className="font-medium">{tx.category} • {tx.type}</div>
                    <div className="text-sm text-gray-600">{tx.desc}</div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="font-semibold">₹{tx.amount}</div>
                    <button onClick={() => deleteTransaction(selectedDate, tx.id)} className="text-red-600">
                      <TrashIcon className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* add form */}
            <div className="border-t pt-4">
              <div className="grid grid-cols-3 gap-3 mb-3">
                <select
                  value={form.type}
                  onChange={(e) => setForm(f => ({ ...f, type: e.target.value }))}
                  className="border p-2 rounded"
                >
                  <option value="expense">Expense</option>
                  <option value="income">Income</option>
                </select>

                <input
                  type="text"
                  placeholder="Category (e.g., Food)"
                  value={form.category}
                  onChange={(e) => setForm(f => ({ ...f, category: e.target.value }))}
                  className="border p-2 rounded"
                />

                <input
                  type="number"
                  placeholder="Amount"
                  value={form.amount}
                  onChange={(e) => setForm(f => ({ ...f, amount: e.target.value }))}
                  className="border p-2 rounded"
                />
              </div>

              <div className="flex gap-3 mb-3">
                <input
                  type="text"
                  placeholder="Description (optional)"
                  value={form.desc}
                  onChange={(e) => setForm(f => ({ ...f, desc: e.target.value }))}
                  className="flex-1 border p-2 rounded"
                />
                <button
                  onClick={() => addTransactionToDate(selectedDate)}
                  className="bg-indigo-600 px-4 py-2 rounded text-white"
                >
                  <div className="flex items-center gap-2"><PlusIcon className="h-4 w-4" /> Add</div>
                </button>
              </div>

              <div className="text-sm text-gray-500 mb-1">
                Tip: added data is printed to the console for backend saving.
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
