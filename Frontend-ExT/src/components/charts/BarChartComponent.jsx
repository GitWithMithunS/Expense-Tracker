import React, { useMemo } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from "recharts";
import moment from "moment";
import CustomTooltip from "./CustomTooltip";
import EmptyState from "./EmptyState";

const BarChartComponent = ({ data, type = "income" }) => {
  const title = type === "income" ? "Income Bar Graph" : "Expense Bar Graph";
  const emptyMsg =
    type === "income"
      ? "No income bar chart data available."
      : "No expense bar chart data available.";

  if (!data.length) {
    return (
      <div className="bg-white p-5 rounded-xl shadow-md border border-gray-200 h-80">
        <EmptyState message={emptyMsg} type="chart" />
      </div>
    );
  }

    const processedData = useMemo (() => {
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
    

  return (
    <div className="bg-white p-5 rounded-xl shadow-md border border-gray-200 w-full">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">{title}</h3>

      <div className="h-[320px] sm:h-[340px] md:h-[360px] flex items-center justify-center">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={processedData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#ddd" />

            <XAxis
              dataKey="date"
              tickFormatter={(value) => moment(value).format("Do MMM")}
            />

            <YAxis />
            <Tooltip content={<CustomTooltip />} />

            <Bar dataKey="amount" fill="#805ad5" radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default BarChartComponent;
