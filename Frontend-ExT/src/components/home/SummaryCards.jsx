import React from "react";

export default function SummaryCards({
  totalIncome,
  totalExpense,
  dailySpendLimit,
  daysRemaining,
}) {
  return (
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

      {/* Daily Spend Limit */}
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
  );
}
