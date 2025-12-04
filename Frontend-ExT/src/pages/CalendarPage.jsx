import React, {
  useState,
  useMemo,
  useRef,
  useEffect,
  useContext,
} from "react";
import { TransactionContext } from "../context/TransactionContext";
import { ChevronLeft, ChevronRight, ChevronsLeft, X } from "lucide-react";
 
const monthNames = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];
 
const pad = (n) => (n < 10 ? "0" + n : n);
 
// Format yyyy-mm-dd
const formatDateKey = (y, m, d) => `${y}-${pad(m + 1)}-${pad(d)}`;
 
export default function CalendarPage({ onClose }) {
  const today = new Date();
 
  const [year, setYear] = useState(today.getFullYear());
  const [monthIndex, setMonthIndex] = useState(today.getMonth());
  const [leftOpen, setLeftOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [baseTransactions, setBaseTransactions] = useState([]);
 
  const { state } = useContext(TransactionContext);
  const cal_ref = useRef(null);
 
  /* ---------- Calendar grid ---------- */
  const firstDay = new Date(year, monthIndex, 1);
  const startWeekday = firstDay.getDay();
  const daysInMonth = new Date(year, monthIndex + 1, 0).getDate();
 
  const cells = [];
  for (let i = 0; i < startWeekday; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);
 
  /* ---------- Month Date Range ---------- */
  const windowStart = useMemo(
    () => new Date(year, monthIndex, 1),
    [year, monthIndex]
  );
  const windowEnd = useMemo(
    () => new Date(year, monthIndex + 1, 0, 23, 59, 59),
    [year, monthIndex]
  );
 
  /* 🔥 FILTER TRANSACTIONS FOR CURRENT MONTH */
  useEffect(() => {
    if (!state.transactions?.length) return;
 
    const filtered = state.transactions.filter((tx) => {
      if (!tx.date) return false;
 
      // Support all formats: "YYYY-MM-DD", "YYYY-MM-DDTHH:mm:ss", "YYYY-MM-DD HH:mm:ss"
      const datePart = tx.date.split("T")[0] || tx.date.split(" ")[0];
      const txDate = new Date(datePart + "T00:00:00");
 
      return txDate >= windowStart && txDate <= windowEnd;
    });
 
    setBaseTransactions(filtered);
  }, [state.transactions, windowStart, windowEnd]);
 
  /* ---------- Map Date → Transactions ---------- */
  const transactionsByDate = useMemo(() => {
    const map = {};
    baseTransactions.forEach((tx) => {
      const dateKey = tx.date.split("T")[0] || tx.date.split(" ")[0];
      if (!map[dateKey]) map[dateKey] = [];
      map[dateKey].push(tx);
    });
    return map;
  }, [baseTransactions]);
 
  /* ---------- Net Amount Per Day ---------- */
  const netPerDay = useMemo(() => {
    const net = {};
    Object.keys(transactionsByDate).forEach((date) => {
      net[date] = transactionsByDate[date].reduce(
        (sum, tx) =>
          sum + (tx.type === "income" ? Number(tx.amount) : -Number(tx.amount)),
        0
      );
    });
    return net;
  }, [transactionsByDate]);
 
  /* ---------- Controls ---------- */
  const goPrev = () => {
    if (monthIndex === 0) {
      setYear((y) => y - 1);
      setMonthIndex(11);
    } else setMonthIndex((m) => m - 1);
  };
 
  const goNext = () => {
    if (monthIndex === 11) {
      setYear((y) => y + 1);
      setMonthIndex(0);
    } else setMonthIndex((m) => m + 1);
  };
 
  const openDay = (dateStr) => setSelectedDate(dateStr);
  const closeDay = () => setSelectedDate(null);
 
  const handleBackdropClick = (e) => {
    if (cal_ref.current && !cal_ref.current.contains(e.target)) {
      onClose?.();
    }
  };
 
  /* ---------- UI ---------- */
  return (
    <div
      className="fixed inset-0 z-[90] flex items-center justify-center"
      onMouseDown={handleBackdropClick}
    >
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      ></div>
 
      <div
        className="relative w-full overflow-y-auto max-w-5xl mx-4 bg-white rounded-xl shadow-xl border border-gray-200"
        ref={cal_ref}
        style={{ minHeight: 420 }}
      >
        {/* CLOSE BUTTON */}
        <button
          className="absolute top-1 right-1 z-20 text-gray-600 hover:text-black p-1"
          onClick={onClose}
        >
          <X size={20} />
        </button>
 
        <div className="flex h-full">
          {/* LEFT PANEL */}
          <div
            className={`transition-all duration-300 ease-in-out bg-gray-50 border-r border-gray-100 overflow-y-auto
              ${leftOpen ? "w-80 p-5" : "w-12 p-3 flex items-center justify-center"}
            `}
          >
            {leftOpen ? (
              <div className="flex flex-col h-full">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold">This Month</h3>
                  <button
                    className="p-2 rounded hover:bg-gray-100"
                    onClick={() => setLeftOpen(false)}
                  >
                    <ChevronsLeft size={18} />
                  </button>
                </div>
 
                <div className="space-y-3 pr-1">
                  {baseTransactions.length === 0 && (
                    <p className="text-sm text-gray-500">No data for this month</p>
                  )}
 
                  {baseTransactions.slice(0, 50).map((u) => (
                    <div
                      key={u.id}
                      className="p-3 bg-white border rounded shadow-sm flex justify-between items-start"
                    >
                      <div className="flex-1">
                        <p className="text-sm text-gray-500">{u.date}</p>
 
                        <div className="flex items-center justify-between gap-2">
                          <h4 className="font-medium">{u.name}</h4>
                          <span
                            className={`text-sm font-semibold ${
                              u.type === "income"
                                ? "text-green-600"
                                : "text-red-600"
                            }`}
                          >
                            {u.type === "income"
                              ? `+₹${u.amount}`
                              : `-₹${u.amount}`}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <button
                className="p-2 rounded-full hover:bg-gray-100"
                onClick={() => setLeftOpen(true)}
              >
                ➤
              </button>
            )}
          </div>
 
          {/* RIGHT - CALENDAR */}
          <div className="flex-1 p-6">
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
 
            {/* WEEKDAYS */}
            <div className="grid grid-cols-7 text-xs text-gray-500 mb-2">
              {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((w) => (
                <div key={w} className="py-2 text-center">
                  {w}
                </div>
              ))}
            </div>
 
            {/* DAYS GRID */}
            <div className="grid grid-cols-7 gap-2">
              {cells.map((day, idx) => {
                if (day === null)
                  return (
                    <div key={idx} className="h-24 p-2 border rounded bg-gray-50" />
                  );
 
                const dateStr = formatDateKey(year, monthIndex, day);
                const net = netPerDay[dateStr] || 0;
 
                const tagText =
                  net === 0
                    ? ""
                    : net > 0
                    ? `+₹${Math.abs(net)}`
                    : `-₹${Math.abs(net)}`;
 
                const tagColor =
                  net > 0
                    ? "bg-green-500 text-white"
                    : net < 0
                    ? "bg-red-500 text-white"
                    : "bg-gray-100 text-gray-500";
 
                const isToday =
                  dateStr ===
                  `${today.getFullYear()}-${pad(today.getMonth() + 1)}-${pad(
                    today.getDate()
                  )}`;
 
                return (
                  <div
                    key={dateStr}
                    className={`h-24 p-2 border rounded cursor-pointer relative flex flex-col justify-between ${
                      isToday ? "ring-2 ring-purple-200" : ""
                    }`}
                    onClick={() => openDay(dateStr)}
                  >
                    <div className="flex justify-between items-start">
                      <div className="text-sm font-medium text-gray-700">{day}</div>
                      {tagText && (
                        <div
                          className={`text-xs font-semibold px-2 py-0.5 rounded ${tagColor}`}
                        >
                          {tagText}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
 
        {/* DAY MODAL */}
        {selectedDate && (
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-50">
            <div className="bg-white rounded-lg shadow-lg p-4 w-96 border">
              <div className="flex items-center justify-between mb-2">
                <div>
                  <div className="text-sm text-gray-500">{selectedDate}</div>
                  <h3 className="font-semibold">Transactions</h3>
                </div>
                <button
                  className="text-gray-600 hover:text-black"
                  onClick={closeDay}
                >
                  <X size={18} />
                </button>
              </div>
 
              <div className="max-h-56 overflow-y-auto space-y-3">
                {(transactionsByDate[selectedDate] || []).length === 0 ? (
                  <div className="text-sm text-gray-500">
                    No transactions on this date.
                  </div>
                ) : (
                  transactionsByDate[selectedDate].map((tx) => (
                    <div
                      key={tx.id}
                      className="flex items-center justify-between p-3 border rounded"
                    >
                      <div className="flex-1 pr-2">
                        <div className="flex items-center gap-2">
                          <div
                            className={`w-2 h-2 rounded-full ${
                              tx.type === "income"
                                ? "bg-green-500"
                                : "bg-red-500"
                            }`}
                          />
                          <div className="text-sm font-medium">
                            {tx.name || tx.category || "Transaction"}
                          </div>
                        </div>
                      </div>
                      <div
                        className={`font-semibold ${
                          tx.type === "income"
                            ? "text-green-600"
                            : "text-red-600"
                        }`}
                      >
                        {tx.type === "income"
                          ? `+₹${tx.amount}`
                          : `-₹${tx.amount}`}
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