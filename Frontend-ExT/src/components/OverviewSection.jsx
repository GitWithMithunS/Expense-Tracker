import React, { useContext, useMemo } from "react";
import { TransactionContext } from "../context/TransactionContext";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const OverviewSection = () => {
  const { state } = useContext(TransactionContext);

  // ===============================
  // TOTALS
  // ===============================
  const totalIncome = state.incomes.reduce(
    (sum, item) => sum + Number(item.amount || 0),
    0
  );

  const totalExpense = state.expenses.reduce(
    (sum, item) => sum + Number(item.amount || 0),
    0
  );

  const balance = totalIncome - totalExpense;

  // ===============================
  // DAILY SPEND LIMIT CALCULATION
  // ===============================
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth();

  const totalDaysInMonth = new Date(year, month + 1, 0).getDate();
  const today = now.getDate();
  const daysRemaining = totalDaysInMonth - today;

  const dailySpendLimit =
    daysRemaining > 0 ? Math.max(0, balance / daysRemaining) : 0;

  // ===============================
  // RECENT 5 EXPENSES
  // ===============================
  const recentFiveExpenses = [...state.expenses]
    .sort((a, b) => new Date(b.date) - new Date(a.date)) // newest first
    .slice(0, 5);

  // ===============================
  // GROUP BY CATEGORY FOR PIE CHART
  // ===============================
  const pieData = useMemo(() => {
    const grouped = {};

    recentFiveExpenses.forEach((exp) => {
      if (!grouped[exp.category]) grouped[exp.category] = 0;
      grouped[exp.category] += Number(exp.amount);
    });

    return Object.entries(grouped).map(([name, value]) => ({
      name,
      value,
    }));
  }, [recentFiveExpenses]);

  const COLORS = ["#34D399", "#60A5FA", "#F87171", "#FBBF24", "#A78BFA"];

  return (
    <div className="w-full mt-10 bg-white p-6 rounded-xl shadow-lg">

      {/* ====================================================== */}
{/* SUMMARY BAR (Income | Expense | Daily Spend Limit)    */}
{/* ====================================================== */}
<div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">

  {/* Total Income */}
  <div className="bg-emerald-50 p-4 rounded-lg border border-emerald-200">
    <p className="text-sm text-gray-600">Total Income</p>
    <h2 className="text-2xl font-bold text-emerald-600 mt-1">
      ₹{totalIncome.toLocaleString("en-IN")}
    </h2>

    <p className="text-xs text-gray-500 mt-1">
      Total income added this month
    </p>
  </div>

  {/* Total Expense */}
  <div className="bg-red-50 p-4 rounded-lg border border-red-200">
    <p className="text-sm text-gray-600">Total Expense</p>
    <h2 className="text-2xl font-bold text-red-600 mt-1">
      ₹{totalExpense.toLocaleString("en-IN")}
    </h2>

    <p className="text-xs text-gray-500 mt-1">
      Total money spent this month
    </p>
  </div>

  {/* Daily Spending Limit */}
  <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
    <p className="text-sm text-gray-600">You can spend per day</p>
    <h2 className="text-2xl font-bold text-blue-600 mt-1">
      ₹{dailySpendLimit.toFixed(0).toLocaleString("en-IN")}
    </h2>

    <p className="text-xs text-gray-500 mt-1">
      Based on your remaining balance and {daysRemaining} days left
    </p>
  </div>

</div>


      {/* ====================================================== */}
      {/* PIE CHART SECTION                                     */}
      {/* ====================================================== */}
      <h3 className="text-xl font-semibold mb-4">Recent 5 Expenses (Pie Chart)</h3>

      {pieData.length === 0 ? (
        <p className="text-gray-500">No recent expenses to display.</p>
      ) : (
        <div className="w-full h-72">
          <ResponsiveContainer>
            <PieChart>
              <Pie
                data={pieData}
                dataKey="value"
                nameKey="name"
                outerRadius={100}
                label
              >
                {pieData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      )}

    </div>
  );
};

export default OverviewSection;
