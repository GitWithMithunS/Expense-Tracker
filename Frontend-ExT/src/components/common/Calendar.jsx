import React, { useMemo, useRef, useState } from "react";
import { X, ChevronLeft, ChevronRight, ChevronsLeft } from "lucide-react";

/**
 * CalendarPopup.jsx
 *
 * Single-file popup calendar with:
 *  - collapsible Upcoming Subscriptions panel (left)
 *  - month-grid calendar (right)
 *  - Option C renewal logic (calculates next renewal dates)
 *  - mock data included (replace with real API later)
 *
 * Usage: render this inside a modal wrapper or use as-is; it contains its own modal.
 *
 * NOTE: requires Tailwind CSS
 */

/* ---------- MOCK DATA (replace these with API calls later) ---------- */

// Mock transactions (one-off transactions)
const MOCK_TRANSACTIONS = [
  { id: "t1", date: "2025-02-09", type: "income", category: "Salary", desc: "Monthly salary", amount: 50000 },
  { id: "t2", date: "2025-02-14", type: "expense", category: "Food", desc: "Dinner out", amount: 580 },
  { id: "t3", date: "2025-02-10", type: "expense", category: "Transport", desc: "Cab fare", amount: 160 },
  { id: "t4", date: "2025-02-01", type: "income", category: "Investments", desc: "Returns", amount: 3600 },
  { id: "t5", date: "2025-02-09", type: "expense", category: "Groceries", desc: "Weekly groceries", amount: 1500 },
];

// Mock subscriptions (recurring). Fields:
// id, name, amount, renewalType ('monthly'|'weekly'|'yearly'), startMonth (YYYY-MM), endMonth (YYYY-MM or null)
const MOCK_SUBSCRIPTIONS = [
  { id: "s1", name: "Netflix", amount: 499, renewalType: "monthly", startMonth: "2024-10", endMonth: null },
  { id: "s2", name: "Gym", amount: 1200, renewalType: "monthly", startMonth: "2025-01", endMonth: "2025-03" },
  { id: "s3", name: "Magazine", amount: 299, renewalType: "yearly", startMonth: "2024-11", endMonth: null },
  { id: "s4", name: "Online Course", amount: 4000, renewalType: "one-time", startMonth: "2025-02", endMonth: "2025-02" }, // one-time handled as monthly single
];

/* ---------- Helpers ---------- */

const monthNames = [
  "January","February","March","April","May","June",
  "July","August","September","October","November","December",
];

// format YYYY-MM-DD
function pad(n){ return String(n).padStart(2,"0"); }
function formatDateKey(year, monthZeroIdx, day) {
  return `${year}-${pad(monthZeroIdx+1)}-${pad(day)}`;
}

// converts "YYYY-MM" to {year, monthIndex}
function parseMonthStr(m) {
  const [y, mm] = m.split("-").map(Number);
  return { year: y, monthIndex: mm - 1 };
}

// add months to "YYYY-MM" and return string "YYYY-MM"
function addMonthsToMonthStr(monthStr, add) {
  const { year, monthIndex } = parseMonthStr(monthStr);
  const d = new Date(year, monthIndex + add, 1);
  return `${d.getFullYear()}-${pad(d.getMonth()+1)}`;
}

// check if a monthStr (YYYY-MM) is <= or >= another using lexicographical compare
function monthStrLE(a, b){ return a <= b; }
function monthStrGE(a, b){ return a >= b; }

// generate renewal dates (YYYY-MM-DD) for a subscription within a date window:
// windowStart (Date object) .. windowEnd (Date object)
function generateRenewalsForSubscription(sub, windowStart, windowEnd) {
  // treat "one-time" same as monthly at startMonth on day 1
  const results = [];
  if(!sub.startMonth) return results;

  const { year: startY, monthIndex: startM } = parseMonthStr(sub.startMonth);

  // default renewal day: we'll set to 1st of month for monthly/yearly. (could be enhanced later)
  const renewalDay = 1;

  // convert to Date for iteration
  let cursor = new Date(startY, startM, renewalDay);

  // if renewalType weekly -> treat as weekly from start day
  // for simplicity: weekly -> every 7 days; monthly -> add 1 month; yearly -> add 12 months
  const isWeekly = sub.renewalType === "weekly";
  const isMonthly = sub.renewalType === "monthly" || sub.renewalType === "one-time";
  const isYearly = sub.renewalType === "yearly";

  // determine sub end date if provided (endMonth inclusive)
  let subEnd = null;
  if(sub.endMonth) {
    const { year: endY, monthIndex: endM } = parseMonthStr(sub.endMonth);
    subEnd = new Date(endY, endM, 28); // approximate end of month anchor
  }

  // advance cursor until it intersects windowStart, then keep adding until > windowEnd or > subEnd
  // But also skip if start is after windowEnd.
  if(cursor > windowEnd) return results;

  // Advance cursor forward until it's >= windowStart
  while(cursor < windowStart) {
    if(isWeekly) cursor = new Date(cursor.getFullYear(), cursor.getMonth(), cursor.getDate() + 7);
    else if(isMonthly) cursor = new Date(cursor.getFullYear(), cursor.getMonth() + 1, renewalDay);
    else if(isYearly) cursor = new Date(cursor.getFullYear() + 1, cursor.getMonth(), renewalDay);
  }

  // Push while inside window and (before subEnd if exists)
  while(cursor <= windowEnd) {
    if(subEnd && cursor > subEnd) break;
    // record renewal on cursor date
    results.push({
      date: `${cursor.getFullYear()}-${pad(cursor.getMonth()+1)}-${pad(cursor.getDate())}`,
      id: `${sub.id}_${cursor.getFullYear()}${pad(cursor.getMonth()+1)}${pad(cursor.getDate())}`,
      name: sub.name,
      amount: sub.amount,
      type: "expense", // subscriptions treated as expense events
      source: "subscription",
      originalSubId: sub.id,
    });

    if(isWeekly) cursor = new Date(cursor.getFullYear(), cursor.getMonth(), cursor.getDate() + 7);
    else if(isMonthly) cursor = new Date(cursor.getFullYear(), cursor.getMonth() + 1, renewalDay);
    else if(isYearly) cursor = new Date(cursor.getFullYear() + 1, cursor.getMonth(), renewalDay);
    else break; // unknown
  }

  return results;
}

/* ---------- Component ---------- */

export default function CalendarPopup({ open = false, onClose = () => {} }) {
  // month/year state for calendar (default to today)
  const today = new Date();
  const [year, setYear] = useState(today.getFullYear());
  const [monthIndex, setMonthIndex] = useState(today.getMonth());

  // left panel collapsed by default
  const [leftOpen, setLeftOpen] = useState(false);

  // day modal
  const [selectedDate, setSelectedDate] = useState(null);



  // mock data (replace with API later)
  const baseTransactions = useMemo(() => MOCK_TRANSACTIONS, []);
  const subscriptions = useMemo(() => MOCK_SUBSCRIPTIONS, []);

  // compute window range for this calendar view: start = 1st of current month, end = last of current month
  const windowStart = useMemo(() => new Date(year, monthIndex, 1), [year, monthIndex]);
  const windowEnd = useMemo(() => new Date(year, monthIndex + 1, 0, 23, 59, 59), [year, monthIndex]);

  // generate subscription renewal events within window (Option C)
  const subscriptionEvents = useMemo(() => {
    let all = [];
    subscriptions.forEach((s) => {
      const ev = generateRenewalsForSubscription(s, windowStart, windowEnd);
      all = all.concat(ev);
    });
    return all;
  }, [subscriptions, windowStart, windowEnd]);

  // build map date -> [transactions + subscriptionEvents]
  const transactionsByDate = useMemo(() => {
    const map = {};

    function push(tx) {
      if(!map[tx.date]) map[tx.date] = [];
      map[tx.date].push(tx);
    }

    baseTransactions.forEach(t => push(t));
    subscriptionEvents.forEach(s => push(s));

    // ensure arrays sorted maybe by type or amount
    Object.keys(map).forEach(k => {
      map[k].sort((a,b) => {
        // incomes first
        if(a.type === "income" && b.type !== "income") return -1;
        if(b.type === "income" && a.type !== "income") return 1;
        return 0;
      });
    });

    return map;
  }, [baseTransactions, subscriptionEvents]);

  // net totals per day (income - expense)
  const netPerDay = useMemo(() => {
    const net = {};
    Object.keys(transactionsByDate).forEach(date => {
      const arr = transactionsByDate[date];
      let n = 0;
      arr.forEach(tx => {
        n += (tx.type === "income" ? Number(tx.amount) : -Number(tx.amount));
      });
      net[date] = n;
    });
    return net;
  }, [transactionsByDate]);

  // upcoming subscriptions (left panel) -> next N upcoming renewal dates across subs
  const upcomingSubscriptions = useMemo(() => {
    // We'll compute next renewal for each subscription starting from today and sort
    const horizonEnd = new Date();
    horizonEnd.setMonth(horizonEnd.getMonth() + 6); // show upcoming 6 months
    let upcoming = [];
    subscriptions.forEach(s => {
      const occurrences = generateRenewalsForSubscription(s, new Date(), horizonEnd);
      occurrences.forEach(o => {
        upcoming.push({
          ...o,
          original: s
        });
      });
    });
    upcoming.sort((a,b) => new Date(a.date) - new Date(b.date));
    return upcoming;
  }, [subscriptions]);

  /* ---------- Calendar grid building ---------- */
  const firstDay = new Date(year, monthIndex, 1);
  const startWeekday = firstDay.getDay(); // 0..6
  const daysInMonth = new Date(year, monthIndex + 1, 0).getDate();
  const cells = [];
  for(let i=0;i<startWeekday;i++) cells.push(null);
  for(let d=1; d<=daysInMonth; d++) cells.push(d);

  /* ---------- handlers ---------- */
  function goPrev() {
    if(monthIndex === 0) {
      setMonthIndex(11); setYear(y => y - 1);
    } else setMonthIndex(m => m - 1);
  }
  function goNext() {
    if(monthIndex === 11) {
      setMonthIndex(0); setYear(y => y + 1);
    } else setMonthIndex(m => m + 1);
  }

  function openDay(dateStr) { setSelectedDate(dateStr); }
  function closeDay() { setSelectedDate(null); }

    // use ref
  const cal_ref = useRef(null);


  const handleBackdropClick = (e) => {
    if (modalRef.current && !modalRef.current.contains(e.target)) {
      console.log("Backdrop clicked → closing modal");
      onClose?.();
    }
  };

  /* ---------- UI ---------- */
  if(!open) return null;

  return (
    <div className="fixed inset-0 z-[90] flex items-center justify-center"
      onMouseDown={handleBackdropClick}
    >
      {/* backdrop */}
      <div className=" absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose}></div>

      {/* modal card */}
      <div className=" relative w-full max-w-5xl mx-4 rounded-xl shadow-xl bg-white border border-gray-200 overflow-hidden"
           ref={cal_ref}
           style={{ minHeight: 420 }}  >
        {/* Close */}
        <button
          className=" absolute top-1 right-1 z-20 text-gray-600 hover:text-black p-1"
          onClick={onClose}
        >
          <X size={20} />
        </button>

        <div className="flex h-full">

          {/* LEFT PANEL - collapsible */}
          <div className={`transition-all duration-300 ease-in-out bg-gray-50 border-r border-gray-100
                          ${leftOpen ? "w-80 p-5" : "w-12 p-3 flex items-center justify-center"}`}>
            {leftOpen ? (
              <div className="flex flex-col h-full">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold">Upcoming Subscriptions</h3>
                  <button className="p-2 rounded hover:bg-gray-100" onClick={() => setLeftOpen(false)}>
                    <ChevronsLeft size={18} />
                  </button>
                </div>

                <div className="flex-1 overflow-y-auto space-y-3 pr-1">
                  {upcomingSubscriptions.length === 0 && (
                    <p className="text-sm text-gray-500">No upcoming subscriptions</p>
                  )}

                  {upcomingSubscriptions.slice(0, 20).map(u => (
                    <div key={u.id} className="p-3 bg-white border rounded shadow-sm flex justify-between items-start">
                      <div className="flex-1">
                        <p className="text-sm text-gray-500">{u.date}</p>
                        <div className="flex items-center justify-between gap-2">
                          <h4 className="font-medium">{u.name}</h4>
                          <span className="text-sm font-semibold text-red-600">₹{u.amount}</span>
                        </div>
                        <p className="text-xs text-gray-500 mt-1">Subscription</p>
                      </div>
                    </div>
                  ))}
                </div>

              </div>
            ) : (
              <button className="p-2 rounded-full hover:bg-gray-100" onClick={() => setLeftOpen(true)} aria-label="Open upcoming">
                {/* small chevron icon */}
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
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

              <div className="flex items-center gap-3">
                <button className="px-3 py-1 rounded bg-gray-100 text-sm">Day</button>
                <button className="px-3 py-1 rounded bg-purple-600 text-white text-sm">Week</button>
                <button className="px-3 py-1 rounded bg-gray-100 text-sm">Month</button>
              </div>
            </div>

            {/* weekdays */}
            <div className="grid grid-cols-7 text-xs text-gray-500 mb-2">
              {["Sun","Mon","Tue","Wed","Thu","Fri","Sat"].map(w => (
                <div key={w} className="py-2 text-center">{w}</div>
              ))}
            </div>

            {/* days grid */}
            <div className="grid grid-cols-7 gap-2">
              {cells.map((day, idx) => {
                if(day === null) return <div key={idx} className="h-24 p-2 border rounded bg-gray-50" />;

                const dateStr = formatDateKey(year, monthIndex, day);
                const net = netPerDay[dateStr] || 0;
                const txs = transactionsByDate[dateStr] || [];

                // tag display text
                const tagText = net === 0 ? "" : (net > 0 ? `+₹${Math.abs(net)}` : `-₹${Math.abs(net)}`);
                const tagColor = net > 0 ? "bg-green-500 text-white" : (net < 0 ? "bg-red-500 text-white" : "bg-gray-100 text-gray-500");

                // highlight today
                const isToday = dateStr === `${today.getFullYear()}-${pad(today.getMonth()+1)}-${pad(today.getDate())}`;

                return (
                  <div
                    key={dateStr}
                    className={`h-24 p-2 border rounded cursor-pointer relative flex flex-col justify-between ${isToday ? "ring-2 ring-purple-200" : ""}`}
                    onClick={() => openDay(dateStr)}
                  >
                    <div className="flex justify-between items-start">
                      <div className="text-sm font-medium text-gray-700">{day}</div>

                      {tagText && (
                        <div className={`text-xs font-semibold px-2 py-0.5 rounded ${tagColor}`}>
                          {tagText}
                        </div>
                      )}
                    </div>

                    {/* small list of event dots or names (show up to 2) */}
                    <div className="text-xs text-gray-600 mt-1">
                      {txs.slice(0,2).map((t) => (
                        <div key={t.id} className="flex items-center justify-between">
                          <span className={`truncate ${t.type === "income" ? "text-green-600" : "text-red-600"} text-xs`}>
                            {t.name || t.category || (t.source || "txn")}
                          </span>
                          <span className={`text-xs font-semibold ${t.type === "income" ? "text-green-600" : "text-red-600"}`}>
                            {t.type === "income" ? `+₹${t.amount}` : `-₹${t.amount}`}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

        </div>

        {/* Day transactions modal (small) */}
        {selectedDate && (
          <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50">
            <div className="bg-white rounded-lg shadow-lg p-4 w-96 border">
              <div className="flex items-center justify-between mb-2">
                <div>
                  <div className="text-sm text-gray-500">{selectedDate}</div>
                  <h3 className="font-semibold">Transactions</h3>
                </div>
                <button className="text-gray-600 hover:text-black" onClick={closeDay}><X size={18} /></button>
              </div>

              <div className="max-h-56 overflow-y-auto space-y-3">
                {(transactionsByDate[selectedDate] || []).length === 0 ? (
                  <div className="text-sm text-gray-500">No transactions for this date.</div>
                ) : (
                  (transactionsByDate[selectedDate] || []).map(tx => (
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

/* small helper used above */
// function pad(n){ return String(n).padStart(2,"0"); }
// function formatDateKey(y, mZero, d){ return `${y}-${pad(mZero+1)}-${pad(d)}`; }
