import moment from "moment";
import React, { useMemo } from "react";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer
} from "recharts";
import CustomTooltip from "./CustomTooltip";
import EmptyState from "./EmptyState";

const LineChartComponent = ({ data, type = "income", onAdd }) => {

  const title = type === "income" ? "Income Overview" : "Expense Overview";

  const btnClass =
    type === "income"
      ? "cursor-pointer px-4 py-2 rounded-lg flex items-center gap-1 bg-green-500/30 border border-green-300 text-green-800 font-medium shadow-md hover:bg-green-500/40"
      : "cursor-pointer px-4 py-2 rounded-lg flex items-center gap-1 bg-red-500/30 border border-red-200 text-red-800 font-medium shadow-md hover:bg-red-500/40";
  const btnLabel = type === "income" ? "+ Add Income" : "+ Add Expense";
  const emptyMsg = type === "income"
    ? "No income chart data available. Add your first income."
    : "No expense chart data available. Add your first expense.";



  const processedData = useMemo(() => {
    const grouped = {};
          console.log('income data from line chart page' , data);


    data.forEach((item) => {
      // Convert createdAt to YYYY-MM-DD format using moment
      const date = moment(item.date).format("YYYY-MM-DD");

      if (!grouped[date]) {
        grouped[date] = { date, amount: 0 };
      }

      grouped[date].amount += Number(item.amount);
    });

    // return array of {date, amount}
    return Object.values(grouped).sort(
      (a, b) => new Date(a.date) - new Date(b.date)
    );
  }, [data]);



  if (!data.length) {
    return (
      <div className="bg-white p-5 rounded-xl shadow-md border border-gray-200 h-80">
        {/* HEADER */}
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
          <button
            onClick={onAdd}
            className={btnClass}
          >
            {btnLabel}
          </button>
        </div>

        <EmptyState message={emptyMsg} type="chart" />
      </div>
    );
  }

  return (
    <div className="bg-white p-5 rounded-xl shadow-md border border-gray-200">
      {/* HEADER */}
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-semibold text-gray-800">{title}</h3>

        <button
          onClick={onAdd}
          className={btnClass}
        >

          {btnLabel}
        </button>
      </div>

      {/* CHART */}
      <div className="h-60 sm:h-72 md:h-80 w-full overflow-x-auto">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={processedData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#ddd" />
            <XAxis
              dataKey="date"
              tickFormatter={(value) =>
                moment(value, "YYYY-MM-DD").format("Do MMM")
              }
            />
            <YAxis />
            <Tooltip content={<CustomTooltip />} />
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
    </div>
  );
};

export default LineChartComponent;
