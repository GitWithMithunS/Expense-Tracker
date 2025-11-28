import React, { useMemo } from "react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

const COLORS = [
  "#6B46C1",
  "#38A169",
  "#3182CE",
  "#D69E2E",
  "#E53E3E",
  "#805AD5",
];

const IncomePieChart = ({ incomeData, categories }) => {
  const chartData = useMemo(() => {
    const map = {};

    incomeData.forEach((item) => {
      const cat = categories.find((c) => c.id === item.categoryId);
      if (!cat) return;

      if (!map[cat.name]) {
        map[cat.name] = {
          name: `${cat.icon} ${cat.name}`,
          value: 0,
        };
      }

      map[cat.name].value += item.amount;
    });

    return Object.values(map);
  }, [incomeData, categories]);

  return (
    <div className="bg-white p-5 rounded-xl shadow-md border border-gray-200 w-full">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">
        Income Breakdown by Category
      </h3>

      {/* Same height as bar chart */}
      {/* <div className="h-[350px] sm:h-[380px] md:h-[400px]"> */}
      <div className="h-[320px] sm:h-[340px] md:h-[360px] flex items-center justify-center">

        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={chartData}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius="75%"   // Bigger
              innerRadius="45%"   // Inner hole also bigger
              paddingAngle={2}
              label={{ fontSize: 12 }}
            >
              {chartData.map((_, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Pie>

            <Tooltip />
            <Legend verticalAlign="bottom" height={30} />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default IncomePieChart;
