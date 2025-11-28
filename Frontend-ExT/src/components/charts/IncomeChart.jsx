import moment from "moment";
import React from "react";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, BarChart, Bar
} from "recharts";
import CustomIncomeTooltip from "./CustomIncomeTooltip";

const IncomeChart = ({ incomeData, onAddIncome }) => {
  return (
    <div className="bg-white p-5 rounded-xl shadow-md border border-gray-200">

      {/* HEADER WITH BUTTON */}
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-semibold text-gray-800">
          Income Overview (Last 30 Days)
        </h3>

        <button
          onClick={onAddIncome}
          className="px-4 py-2 rounded-lg flex items-center gap-1
                     bg-green-500/20 border border-green-400
                     text-green-800 font-medium shadow-md 
                     hover:bg-green-500/30 transition-all"
        >
          + Add Income
        </button>
      </div>

      {/* LINE CHART */}
      <div className="h-60 sm:h-72 md:h-80 w-full overflow-x-auto">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={incomeData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#ddd" />
            {/* <XAxis dataKey="date" /> */}
            <XAxis
              dataKey="date"
              tickFormatter={(value) => moment(value, "YYYY-MM-DD").format("Do MMM YY")}
            />

            <YAxis />
            <Tooltip content={<CustomIncomeTooltip />} />
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

      {/* BAR CHART
      <div className="h-60 sm:h-72 md:h-80 w-full overflow-x-auto mt-10">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={incomeData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#ddd" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip content={<CustomIncomeTooltip />} />
            <Bar dataKey="amount" fill="#805ad5" radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div> */}

    </div>
  );
};

export default IncomeChart;


