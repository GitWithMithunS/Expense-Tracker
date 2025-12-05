import { Calendar } from "lucide-react";

const BudgetHeader = ({ selectedMonth, setSelectedMonth, upcomingMonths, formatMonth }) => {
  return (
    <div className="flex items-center justify-between">
      <h1 className="text-xl font-bold text-gray-800">Budget Manager</h1>

      <div className="flex items-center gap-2">
        <Calendar className="text-purple-600" />
        <select
          value={selectedMonth}
          onChange={(e) => setSelectedMonth(e.target.value)}
          className="border p-2 rounded-lg focus:ring-2 focus:ring-purple-500"
        >
          {upcomingMonths.map((m) => (
            <option key={m} value={m}>
              {formatMonth(m)}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default BudgetHeader;
