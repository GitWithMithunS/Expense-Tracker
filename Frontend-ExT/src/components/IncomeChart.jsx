import React from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from "recharts";

const IncomeChart = ({ incomeData }) => {
  return (
    <div className="bg-white p-5 rounded-xl shadow-md border border-gray-200 space-y-8">

      <h3 className="text-lg font-semibold text-gray-800">Income (Last 30 Days)</h3>

      {/* LINE CHART */}
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={incomeData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#ddd" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Line
              type="monotone"
              dataKey="amount"
              stroke="#6b46c1"
              strokeWidth={3}
              dot={{ r: 4 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* BAR CHART */}
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={incomeData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#ddd" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="amount" fill="#805ad5" radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

    </div>
  );
};

export default IncomeChart;
