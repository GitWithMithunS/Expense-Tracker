import React, { useContext, useEffect, useMemo, useState } from "react";
import { TransactionContext } from "../../context/TransactionContext";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { API_ENDPOINTS } from "@/util/apiEnpoints";
import axiosConfig from "@/util/axiosConfig";
import { TrendingDown, TrendingUp } from "lucide-react";

const OverviewSection = () => {
  const [transactions, setTransactions] = useState([]);

useEffect(() => {
  const fetchTx = async () => {
    try {
      const res = await axiosConfig.get(API_ENDPOINTS.GET_ALL_TRANSACTIONS);
      setTransactions(res.data || []);
    } catch (err) {
      console.error("Error fetching transactions:", err);
    }
  };

  fetchTx();
}, []);

// TOTALS
const totalIncome = transactions
  .filter((t) => t.type === "income")
  .reduce((sum, t) => sum + Number(t.amount), 0);

const totalExpense = transactions
  .filter((t) => t.type === "expense")
  .reduce((sum, t) => sum + Number(t.amount), 0);

const balance = totalIncome - totalExpense;

// DAILY LIMIT
const now = new Date();
const year = now.getFullYear();
const month = now.getMonth();
const totalDaysInMonth = new Date(year, month + 1, 0).getDate();
const today = now.getDate();
const daysRemaining = totalDaysInMonth - today;

const dailySpendLimit =
  daysRemaining > 0 ? Math.max(0, balance / daysRemaining) : 0;

// RECENT 5 EXPENSES
const recentFiveExpenses = transactions
  .filter((t) => t.type === "expense")
  .sort((a, b) => new Date(b.date) - new Date(a.date))
  .slice(0, 5);

// RECENT 5 MIXED TX
const recentTransactions = transactions
  .sort((a, b) => new Date(b.date) - new Date(a.date))
  .slice(0, 5);

// PIE CHART DATA
const pieData = [
  { name: "Income", value: totalIncome },
  { name: "Expense", value: totalExpense },
  { name: "Balance", value: balance > 0 ? balance : 0 },
];

const COLORS = ["#34D399", "#60A5FA", "#F87171"];

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
      <h3 className="text-xl font-semibold mb-6">Financial Overview</h3>

<div className="grid grid-cols-1 md:grid-cols-2 gap-6">

  {/* LEFT: PIE CHART */}
  <div className="bg-white p-6 rounded-xl shadow-lg border border-purple-300">
    {pieData.length === 0 ? (
      <p className="text-gray-500">No financial data available.</p>
    ) : (
      <div className="w-full h-72 flex items-center justify-center">
  <ResponsiveContainer width="100%" height="100%">
    <PieChart>
      <Pie
        data={pieData}
        dataKey="value"
        nameKey="name"
        outerRadius={110}
        cx="50%"
        cy="50%"          // <-- THIS centers the chart!!
        label={(entry) =>
          `${entry.name}: ₹${entry.value.toLocaleString("en-IN")}`
        }
      >
        {pieData.map((entry, index) => (
          <Cell
            key={`cell-${index}`}
            fill={COLORS[index % COLORS.length]}
          />
        ))}
      </Pie>

      <Tooltip
        formatter={(value, name) => [`₹${value.toLocaleString("en-IN")}`, name]}
      />
    </PieChart>
  </ResponsiveContainer>
</div>


    )}
  </div>

  {/* RIGHT: RECENT TX LIST */}
  <div className="bg-white rounded-xl shadow-lg border border-blue-300 p-4">
    <h3 className="text-lg font-semibold mb-4">Recent Transactions</h3>

    <ul className="space-y-3">
      {recentTransactions.length === 0 && (
        <li className="text-gray-500">No recent transactions.</li>
      )}

      {recentTransactions.map((tx) => {
        const isIncome = tx.type === "income";

        return (
          <li
            key={tx.id}
            className="flex items-center justify-between p-4 rounded-xl
                       bg-white border border-gray-200 shadow-sm hover:shadow-md
                       transition-all"
          >
            {/* LEFT */}
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 flex items-center justify-center 
                              bg-gray-100 rounded-full text-2xl shadow-sm">
                <span>{tx.icon}</span>
              </div>
              <div className="flex flex-col">
                <p className="text-gray-900 font-semibold text-sm">
                  {tx.categoryName}
                </p>
                <p className="text-gray-500 text-xs">
                  {new Date(tx.date).toLocaleDateString("en-GB", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                  })}
                </p>
              </div>
            </div>

            {/* AMOUNT */}
            <div
              className={`px-3 py-1.5 rounded-lg text-sm font-semibold shadow-sm flex items-center gap-2 border 
                ${isIncome
                  ? "bg-green-100 text-green-700 border-green-300"
                  : "bg-red-100 text-red-700 border-red-300"
                }`}
            >
              {isIncome ? "+" : "-"} ₹{tx.amount}
              {isIncome ? (
                <TrendingUp size={16} className="text-green-700" />
              ) : (
                <TrendingDown size={16} className="text-red-700" />
              )}
            </div>
          </li>
        );
      })}
    </ul>
  </div>
</div>



    </div>
  );
};

export default OverviewSection;
