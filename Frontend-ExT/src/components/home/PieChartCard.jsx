import React from "react";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
import EmptyState from "@/components/charts/EmptyState";

const COLORS = ["#34D399", "#F87171", "#60A5FA"];

export default function PieChartCard({ totalIncome, totalExpense, balance }) {
  const pieData = [
    { name: "Income", value: totalIncome },
    { name: "Expense", value: totalExpense },
    { name: "Balance", value: balance > 0 ? balance : 0 },
  ];

  const empty = totalIncome === 0 && totalExpense === 0 && balance === 0;

  return (
    <div className="bg-white p-2 rounded-xl shadow-lg border border-purple-300 flex flex-col">

      <h3 className="relative pb-2 mt-4 pl-4 text-lg font-semibold">
        Pie Chart Spread
      </h3>

      {empty ? (
        <div className="h-full flex items-center justify-center">
          <EmptyState message="No Transaction to be shown" type="chart" />
        </div>
      ) : (
        <div className="w-full h-94 mt-6 flex items-center justify-center">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={pieData}
                dataKey="value"
                nameKey="name"
                outerRadius={110}
                cx="55%"
                cy="50%"
                label={(entry) =>
                  `${entry.name}: ₹${entry.value.toLocaleString("en-IN")}`
                }
              >
                {pieData.map((entry, index) => (
                  <Cell key={index} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>

              <Tooltip
                formatter={(value, name) => [
                  `₹${value.toLocaleString("en-IN")}`,
                  name,
                ]}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}
