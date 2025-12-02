// Calendar.jsx
import React, { useEffect, useMemo, useRef, useState } from "react";
import { X, ChevronLeft, ChevronRight, ChevronsLeft } from "lucide-react";
import axiosConfig from "../../util/axiosConfig";
import { API_ENDPOINTS } from "../../util/apiEnpoints";

/* ---------- Helpers ---------- */

const monthNames = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

// Format YYYY-MM-DD
const pad = (n) => String(n).padStart(2, "0");

const formatDateKey = (year, monthZeroIdx, day) =>
  `${year}-${pad(monthZeroIdx + 1)}-${pad(day)}`;

// "YYYY-MM" -> { year, monthIndex }
const parseMonthStr = (m) => {
  const [y, mm] = (m || "").split("-").map(Number);
  return { year: y, monthIndex: mm - 1 };
};

// Add months to YYYY-MM
const addMonthsToMonthStr = (monthStr, add) => {
  const { year, monthIndex } = parseMonthStr(monthStr);
  const d = new Date(year, monthIndex + add, 1);
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}`;
};

// Lexical compares
const monthStrLE = (a, b) => a <= b;
const monthStrGE = (a, b) => a >= b;

function generateRenewalsForSubscription(sub, windowStart, windowEnd) {
  const results = [];

  if (!sub || !sub.startMonth) return results;

  const { year: startY, monthIndex: startM } = parseMonthStr(sub.startMonth);

  const isWeekly = sub.renewalType === "weekly";
  const isMonthly = sub.renewalType === "monthly" || sub.renewalType === "one-time";
  const isYearly = sub.renewalType === "yearly";

  const renewalDay = 1;
  let cursor = new Date(startY, startM, renewalDay);

  let subEnd = null;
  if (sub.endMonth) {
    const { year: endY, monthIndex: endM } = parseMonthStr(sub.endMonth);
    subEnd = new Date(endY, endM, 28);
  }

  if (cursor > windowEnd) return results;

  while (cursor < windowStart) {
    if (isWeekly) cursor = new Date(cursor.getFullYear(), cursor.getMonth(), cursor.getDate() + 7);
    else if (isMonthly) cursor = new Date(cursor.getFullYear(), cursor.getMonth() + 1, renewalDay);
    else if (isYearly) cursor = new Date(cursor.getFullYear() + 1, cursor.getMonth(), renewalDay);
    else break;
  }

  while (cursor <= windowEnd) {
    if (subEnd && cursor > subEnd) break;

    results.push({
      date: `${cursor.getFullYear()}-${pad(cursor.getMonth() + 1)}-${pad(cursor.getDate())}`,
      id: `${sub.id}_${cursor.getFullYear()}${pad(cursor.getMonth() + 1)}${pad(cursor.getDate())}`,
      name: sub.name,
      amount: sub.amount,
      type: "expense",
      source: "subscription",
      originalSubId: sub.id,
    });

    if (isWeekly) cursor = new Date(cursor.getFullYear(), cursor.getMonth(), cursor.getDate() + 7);
    else if (isMonthly) cursor = new Date(cursor.getFullYear(), cursor.getMonth() + 1, renewalDay);
    else if (isYearly) cursor = new Date(cursor.getFullYear() + 1, cursor.getMonth(), renewalDay);
    else break;
  }

  return results;
}

/* ----------------------------------------
   MONTH/YEAR & UI STATES
-----------------------------------------*/

export default function CalendarPopup({ open = false, onClose = () => { } }) {
  const today = new Date();

  const [year, setYear] = useState(today.getFullYear());
  const [monthIndex, setMonthIndex] = useState(today.getMonth());
  const [leftOpen, setLeftOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);

  const [baseTransactions, setBaseTransactions] = useState([]);
  const [subscriptions, setSubscriptions] = useState([]);

  /* ---------- Calendar grid building ---------- */
  const firstDay = new Date(year, monthIndex, 1);
  const startWeekday = firstDay.getDay(); // 0..6 (0 = Sun)
  const daysInMonth = new Date(year, monthIndex + 1, 0).getDate();

  const cells = [];
  for (let i = 0; i < startWeekday; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);

  useEffect(() => {
    async function fetchData() {
      try {
        const txRes = await axiosConfig.get(API_ENDPOINTS.GET_ALL_TRANSACTIONS);
        console.log(txRes);
        const subRes = await axiosConfig.get(API_ENDPOINTS.GET_BUDGET_DATA);
        console.log(subRes);

        // Normalize transactions
        const normalizedTx =
          (txRes?.data || []).map((t) => ({
            id: t.id,
            date: t.date,
            type: t.type,               // income / expense
            amount: t.amount,
            name: t.categoryName,       // calendar uses t.name
            category: t.categoryName,
            desc: t.notes,
            icon: t.icon,
            paymentMethod: t.paymentMethod,
            original: t,
          }));

        // Normalize subscriptions
        const normalizedSubs =
          subRes?.data?.subscriptions?.map((s) => ({
            id: s.id,
            name: s.name,
            amount: s.amount,
            renewalType: s.renewalType ?? "monthly",
            startMonth: s.startMonth,
            endMonth: s.endMonth ?? null,
          })) || [];

        setBaseTransactions(normalizedTx);
        setSubscriptions(normalizedSubs);
      } catch (err) {
        console.error("Error fetching calendar data:", err);
      }
    }

    fetchData();
  }, []);


  /* ---------- handlers that must be INSIDE component ---------- */
  function goPrev() {
    if (monthIndex === 0) {
      setMonthIndex(11);
      setYear((y) => y - 1);
    } else {
      setMonthIndex((m) => m - 1);
    }
  }

  function goNext() {
    if (monthIndex === 11) {
      setMonthIndex(0);
      setYear((y) => y + 1);
    } else {
      setMonthIndex((m) => m + 1);
    }
  }

  function openDay(dateStr) {
    setSelectedDate(dateStr);
  }
  function closeDay() {
    setSelectedDate(null);
  }

  /* ----------------------------------------
     CALENDAR DATE WINDOW
  -----------------------------------------*/

  const windowStart = useMemo(() => new Date(year, monthIndex, 1), [year, monthIndex]);
  const windowEnd = useMemo(() => new Date(year, monthIndex + 1, 0, 23, 59, 59), [year, monthIndex]);

  /* ----------------------------------------
     RENEWAL EVENTS FOR CURRENT MONTH
  -----------------------------------------*/

  const subscriptionEvents = useMemo(() => {
    let all = [];
    subscriptions.forEach((s) => {
      all = all.concat(generateRenewalsForSubscription(s, windowStart, windowEnd));
    });
    return all;
  }, [subscriptions, windowStart, windowEnd]);

  /* ----------------------------------------
     MAP DATE -> TRANSACTIONS + SUBSCRIPTIONS
  -----------------------------------------*/

  const transactionsByDate = useMemo(() => {
    const map = {};

    const push = (tx) => {
      if (!tx || !tx.date) return;
      if (!map[tx.date]) map[tx.date] = [];
      map[tx.date].push(tx);
    };

    (baseTransactions || []).forEach(push);
    (subscriptionEvents || []).forEach(push);

    Object.keys(map).forEach((key) => {
      map[key].sort((a, b) => {
        if (a.type === "income" && b.type !== "income") return -1;
        if (b.type === "income" && a.type !== "income") return 1;
        return 0;
      });
    });

    return map;
  }, [baseTransactions, subscriptionEvents]);

  /* ----------------------------------------
     NET PER DAY
  -----------------------------------------*/

  const netPerDay = useMemo(() => {
    const net = {};
    Object.keys(transactionsByDate).forEach((date) => {
      net[date] = transactionsByDate[date].reduce(
        (acc, tx) => acc + (tx.type === "income" ? Number(tx.amount) : -Number(tx.amount)),
        0
      );
    });
    return net;
  }, [transactionsByDate]);

  /* ----------------------------------------
     UPCOMING SUBSCRIPTIONS (NEXT 6 MONTHS)
  -----------------------------------------*/

  const upcomingSubscriptions = useMemo(() => {
    const start = new Date(year, monthIndex, 1);          // 1st of selected month
    const end = new Date(year, monthIndex + 1, 0, 23, 59);// last day of selected month

    let all = [];

    // Add subscription renewals happening THIS MONTH
    subscriptions.forEach((s) => {
      const occ = generateRenewalsForSubscription(s, start, end);
      occ.forEach((o) => all.push({ ...o, original: s }));
    });

    // Add transactions happening THIS MONTH
    baseTransactions.forEach((tx) => {
      const txDate = new Date(tx.date);
      if (txDate >= start && txDate <= end) {
        all.push({
          ...tx,
          isTransaction: true,
        });
      }
    });

    // Sort by date ASC
    all.sort((a, b) => new Date(a.date) - new Date(b.date));

    return all;
  }, [subscriptions, baseTransactions, year, monthIndex]);


  // use ref
  const cal_ref = useRef(null);

  const handleBackdropClick = (e) => {
    if (cal_ref.current && !cal_ref.current.contains(e.target)) {
      console.log("Backdrop clicked → closing modal");
      onClose?.();
    }
  };

  /* ---------- UI ---------- */
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[90] flex items-center justify-center" onMouseDown={handleBackdropClick}>
      {/* backdrop */}
      <div className=" absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose}></div>

      {/* modal card */}
      <div
        className=" relative w-full overflow-y-auto  max-w-5xl mx-4 bg-white rounded-xl shadow-xl border border-gray-200 overflow-hidden"
        ref={cal_ref}
        style={{ minHeight: 420 }}
      >
        {/* Close */}
        <button className=" absolute top-1 right-1 z-20 text-gray-600 hover:text-black p-1" onClick={onClose}>
          <X size={20} />
        </button>

        <div className="flex h-full">
          {/* LEFT PANEL - collapsible */}
          <div
            className={`transition-all duration-300 ease-in-out bg-gray-50 border-r border-gray-100
    overflow-y-auto
    ${leftOpen ? "w-80 p-5" : "w-12 p-3 flex items-center justify-center"}`}
          >
            {leftOpen ? (
              <div className="flex flex-col h-full">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold">This Month</h3>
                  <button className="p-2 rounded hover:bg-gray-100" onClick={() => setLeftOpen(false)}>
                    <ChevronsLeft size={18} />
                  </button>
                </div>

                <div className="space-y-3 pr-1">
                  {upcomingSubscriptions.length === 0 && (
                    <p className="text-sm text-gray-500">No data for this month</p>
                  )}

                  {upcomingSubscriptions.slice(0, 50).map((u) => (
                    <div
                      key={u.id}
                      className="p-3 bg-white border rounded shadow-sm flex justify-between items-start"
                    >
                      <div className="flex-1">
                        <p className="text-sm text-gray-500">{u.date}</p>

                        <div className="flex items-center justify-between gap-2">
                          <h4 className="font-medium">{u.name}</h4>
                          <span
                            className={`text-sm font-semibold ${u.type === "income" ? "text-green-600" : "text-red-600"
                              }`}
                          >
                            {u.type === "income" ? `+₹${u.amount}` : `-₹${u.amount}`}
                          </span>
                        </div>

                        <p className="text-xs text-gray-500 mt-1">
                          {u.isTransaction ? "Transaction" : "Subscription"}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <button
                className="p-2 rounded-full hover:bg-gray-100"
                onClick={() => setLeftOpen(true)}
                aria-label="Open"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 text-gray-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            )}
          </div>

          {/* RIGHT - calendar area */}
          <div className="flex-1 p-6">
            {/* header */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <button onClick={goPrev} className="p-2 rounded hover:bg-gray-100">
                  <ChevronLeft size={18} />
                </button>

                <div className="text-lg font-semibold">
                  {monthNames[monthIndex]} {year}
                </div>

                <button onClick={goNext} className="p-2 rounded hover:bg-gray-100">
                  <ChevronRight size={18} />
                </button>
              </div>
            </div>

            {/* weekdays */}
            <div className="grid grid-cols-7 text-xs text-gray-500 mb-2">
              {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((w) => (
                <div key={w} className="py-2 text-center">
                  {w}
                </div>
              ))}
            </div>

            {/* days grid */}
            <div className="grid grid-cols-7 gap-2">
              {cells.map((day, idx) => {
                if (day === null) return <div key={idx} className="h-24 p-2 border rounded bg-gray-50" />;

                const dateStr = formatDateKey(year, monthIndex, day);
                const net = netPerDay[dateStr] || 0;
                const txs = transactionsByDate[dateStr] || [];

                const tagText = net === 0 ? "" : net > 0 ? `+₹${Math.abs(net)}` : `-₹${Math.abs(net)}`;
                const tagColor = net > 0 ? "bg-green-500 text-white" : net < 0 ? "bg-red-500 text-white" : "bg-gray-100 text-gray-500";

                const isToday = dateStr === `${today.getFullYear()}-${pad(today.getMonth() + 1)}-${pad(today.getDate())}`;

                return (
                  <div
                    key={dateStr}
                    className={`h-24 p-2 border rounded cursor-pointer relative flex flex-col justify-between ${isToday ? "ring-2 ring-purple-200" : ""}`}
                    onClick={() => openDay(dateStr)}
                  >
                    <div className="flex justify-between items-start">
                      <div className="text-sm font-medium text-gray-700">{day}</div>

                      {tagText && <div className={`text-xs font-semibold px-2 py-0.5 rounded ${tagColor}`}>{tagText}</div>}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Day transactions modal */}
        {selectedDate && (
          <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50">
            <div className="bg-white rounded-lg shadow-lg p-4 w-96 border">
              <div className="flex items-center justify-between mb-2">
                <div>
                  <div className="text-sm text-gray-500">{selectedDate}</div>
                  <h3 className="font-semibold">Transactions</h3>
                </div>
                <button className="text-gray-600 hover:text-black" onClick={closeDay}>
                  <X size={18} />
                </button>
              </div>

              <div className="max-h-56 overflow-y-auto space-y-3">
                {(transactionsByDate[selectedDate] || []).length === 0 ? (
                  <div className="text-sm text-gray-500">No transactions for this date.</div>
                ) : (
                  (transactionsByDate[selectedDate] || []).map((tx) => (
                    <div key={tx.id} className="flex items-center justify-between p-3 border rounded">
                      <div className="flex-1 pr-2">
                        <div className="flex items-center gap-2">
                          <div className={`w-2 h-2 rounded-full ${tx.type === "income" ? "bg-green-500" : "bg-red-500"}`} />
                          <div className="text-sm font-medium">{tx.name || tx.category || "Transaction"}</div>
                        </div>
                        <div className="text-xs text-gray-500 mt-1">{tx.desc || tx.source || ""}</div>
                      </div>
                      <div className={`font-semibold ${tx.type === "income" ? "text-green-600" : "text-red-600"}`}>
                        {tx.type === "income" ? `+₹${tx.amount}` : `-₹${tx.amount}`}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
