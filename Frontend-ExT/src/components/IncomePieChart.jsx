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
  "#6B46C1", // purple
  "#38A169", // green
  "#3182CE", // blue
  "#D69E2E", // yellow
  "#E53E3E", // red
  "#805AD5", // soft purple
];

const IncomePieChart = ({ incomeData, categories }) => {
  // Group income by category
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
    <div className="bg-white p-5 rounded-xl shadow-md border border-gray-200 mt-6">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">
        Income Breakdown by Category
      </h3>

      <div className="w-full h-80">
        <ResponsiveContainer>
          <PieChart>
            <Pie
              data={chartData}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={110}
              innerRadius={50}
              paddingAngle={3}
              label
            >
              {chartData.map((_, index) => (
                <Cell
                  key={index}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Pie>

            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default IncomePieChart;
