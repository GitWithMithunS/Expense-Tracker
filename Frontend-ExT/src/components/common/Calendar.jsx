import React, {
  useState,
  useMemo,
  useRef,
  useEffect,
  useContext,
} from "react";
import { TransactionContext } from "../../context/TransactionContext";
import { ChevronLeft, ChevronRight, ChevronsLeft, X } from "lucide-react";
import CalendarContainer from "../Calendar/CalendarContainer";
import CalendarLeftPanel from "../Calendar/CalendarLeftPanel";
import CalendarHeader from "../Calendar/CalendarHeader";
import CalendarGrid from "../Calendar/CalendarGrid";
import DayModal from "../Calendar/DayModal";

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

  /* FILTER TRANSACTIONS FOR CURRENT MONTH */
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
    <div>
      <CalendarContainer cal_ref={cal_ref} onClose={onClose}>

        {/* CLOSE BUTTON */}
        <button
          className="absolute top-1 right-1 z-20 text-gray-600 hover:text-black p-1"
          onClick={onClose}
        >
          <X size={20} />
        </button>

        <div className="flex h-full">

          <CalendarLeftPanel
            leftOpen={leftOpen}
            setLeftOpen={setLeftOpen}
            baseTransactions={baseTransactions}
          />

          <div className="flex-1 p-6">
            <CalendarHeader
              monthIndex={monthIndex}
              year={year}
              goPrev={goPrev}
              goNext={goNext}
            />

            <CalendarGrid
              cells={cells}
              year={year}
              monthIndex={monthIndex}
              today={today}
              netPerDay={netPerDay}
              openDay={openDay}
            />
          </div>
        </div>

        {selectedDate && (
          <DayModal
            selectedDate={selectedDate}
            transactions={transactionsByDate[selectedDate] ?? []}
            onClose={closeDay}
          />
        )}
      </CalendarContainer>
    </div>
  );
}
