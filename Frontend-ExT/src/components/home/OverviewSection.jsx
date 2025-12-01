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
import moment from "moment";
import TransactionInfoCard from "../common/TransactionInfoCard";

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

            {recentTransactions.map((expense) => (
              <TransactionInfoCard
                key={expense.id}
                title={expense.name}
                icon={expense.icon}
                date={moment(expense.date).format("Do MMM YYYY")}
                amount={expense.amount}
                categoryName={expense.categoryName}
                page='home'

                type="recent-transactions"
                onDelete={() => onDelete(expense)}
              />
            ))}
          </ul>
        </div>
      </div>

    </div>
  );
};

export default OverviewSection;
