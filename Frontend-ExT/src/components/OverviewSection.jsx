import React, { useContext } from "react";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
import { TransactionContext } from "../context/TransactionContext";

const OverviewSection = () => {
  const { state } = useContext(TransactionContext);

  // -----------------------------
  // TOP SUMMARY VALUES
  // -----------------------------
  const totalIncome = state.incomes.reduce(
    (sum, item) => sum + Number(item.amount),
    0
  );

  const totalExpense = state.expenses.reduce(
    (sum, item) => sum + Number(item.amount),
    0
  );

  const totalSavings = totalIncome - totalExpense;

  // -----------------------------
  // RECENT 5 ENTRIES
  // -----------------------------
  const recentTransactions = state.transactions.slice(0, 5);
  const recentIncome = state.incomes.slice(0, 5);
  const recentExpense = state.expenses.slice(0, 5);

  // -----------------------------
  // PIE CHART (EXPENSE BY CATEGORY)
  // -----------------------------
  const pieDataObject = state.expenses.reduce((acc, item) => {
    if (!acc[item.category]) acc[item.category] = 0;
    acc[item.category] += Number(item.amount);
    return acc;
  }, {});

  const formattedPie = Object.entries(pieDataObject).map(([name, value]) => ({
    name,
    value,
  }));

  const COLORS = ["#60A5FA", "#34D399", "#F472B6", "#FBBF24", "#A78BFA"];

  return (
    <div className="w-full mt-10">

      {/* TOP SUMMARY BAR */}
      <div className="w-full bg-white p-6 rounded-xl shadow-lg flex justify-around mb-10">
        <div className="text-center">
          <h2 className="text-xl font-bold text-green-600">₹{totalIncome}</h2>
          <p className="text-gray-600">Income</p>
        </div>

        <div className="text-center">
          <h2 className="text-xl font-bold text-red-600">₹{totalExpense}</h2>
          <p className="text-gray-600">Expense</p>
        </div>

        <div className="text-center">
          <h2 className="text-xl font-bold text-blue-600">₹{totalSavings}</h2>
          <p className="text-gray-600">Savings</p>
        </div>
      </div>

      {/* GRID SECTION */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8">

        {/* RECENT 5 Transactions */}
        <div className="bg-white p-6 rounded-xl shadow-lg h-64">
          <h3 className="text-lg font-semibold mb-3">Recent 5 Transactions</h3>
          <ul className="space-y-2 text-sm overflow-y-scroll h-40">
            {recentTransactions.length === 0 && (
              <p className="text-gray-500 text-center mt-5">No transactions yet.</p>
            )}

            {recentTransactions.map((t, idx) => (
              <li key={idx} className="border-b pb-1 flex justify-between">
                <span>{t.category}</span>
                <span
                  className={`${
                    t.type === "income" ? "text-green-600" : "text-red-600"
                  }`}
                >
                  ₹{t.amount}
                </span>
              </li>
            ))}
          </ul>
        </div>

        {/* PIE CHART */}
        <div className="bg-white p-6 rounded-xl shadow-lg h-64">
          <h3 className="text-lg font-semibold mb-3">Expense Breakdown</h3>

          {formattedPie.length === 0 ? (
            <p className="text-gray-500 text-center mt-5">No expenses yet.</p>
          ) : (
            <ResponsiveContainer width="100%" height="80%">
              <PieChart>
                <Pie
                  data={formattedPie}
                  dataKey="value"
                  nameKey="name"
                  outerRadius={80}
                  label
                >
                  {formattedPie.map((entry, i) => (
                    <Cell
                      key={`cell-${i}`}
                      fill={COLORS[i % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* RECENT 5 INCOME */}
        <div className="bg-white p-6 rounded-xl shadow-lg h-64">
          <h3 className="text-lg font-semibold mb-3">Recent 5 Income</h3>
          <ul className="space-y-2 text-sm overflow-y-scroll h-40">
            {recentIncome.length === 0 && (
              <p className="text-gray-500 text-center mt-5">No income yet.</p>
            )}

            {recentIncome.map((t, idx) => (
              <li key={idx} className="border-b pb-1 flex justify-between">
                <span>{t.source || t.category}</span>
                <span className="text-green-600">₹{t.amount}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* RECENT 5 EXPENSE */}
        <div className="bg-white p-6 rounded-xl shadow-lg h-64">
          <h3 className="text-lg font-semibold mb-3">Recent 5 Expense</h3>
          <ul className="space-y-2 text-sm overflow-y-scroll h-40">
            {recentExpense.length === 0 && (
              <p className="text-gray-500 text-center mt-5">No expenses yet.</p>
            )}

            {recentExpense.map((t, idx) => (
              <li key={idx} className="border-b pb-1 flex justify-between">
                <span>{t.category}</span>
                <span className="text-red-600">₹{t.amount}</span>
              </li>
            ))}
          </ul>
        </div>

      </div>

      {/* LARGE BOTTOM RECENT 5 TRANSACTIONS BOX */}
      <div className="bg-white p-6 rounded-xl shadow-lg h-64 mt-10">
        <h3 className="text-lg font-semibold mb-3">
          Recent 5 Transactions (Large Box)
        </h3>

        <ul className="space-y-2 text-sm overflow-y-scroll h-40">
          {recentTransactions.length === 0 && (
            <p className="text-gray-500 text-center mt-5">No transactions yet.</p>
          )}

          {recentTransactions.map((t, idx) => (
            <li key={idx} className="border-b pb-1 flex justify-between">
              <span>{t.category}</span>
              <span
                className={`${
                  t.type === "income" ? "text-green-600" : "text-red-600"
                }`}
              >
                ₹{t.amount}
              </span>
            </li>
          ))}
        </ul>
      </div>

    </div>
  );
};

export default OverviewSection;
