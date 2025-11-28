import React, { useMemo } from "react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import EmptyState from "./EmptyState";

const COLORS = [
  "#6B46C1",
  "#38A169",
  "#3182CE",
  "#D69E2E",
  "#E53E3E",
  "#805AD5",
];

const PieChartComponent = ({ data, categories, type = "income" }) => {
  const title =
    type === "income"
      ? "Income Breakdown by Category"
      : "Expense Breakdown by Category";

  const emptyMsg =
    type === "income"
      ? "No income category breakdown available."
      : "No expense category breakdown available.";

  if (!data.length) {
    return (
      <div className="bg-white p-5 rounded-xl shadow-md border border-gray-200 h-80">
        <EmptyState message={emptyMsg} type="chart" />
      </div>
    );
  }

  const chartData = useMemo(() => {
    const map = {};

    data.forEach((item) => {
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
  }, [data, categories]);

  return (
    <div className="bg-white p-5 rounded-xl shadow-md border border-gray-200 w-full">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">{title}</h3>

      <div className="h-[320px] sm:h-[340px] md:h-[360px] flex items-center justify-center">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={chartData}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius="75%"
              innerRadius="45%"
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

export default PieChartComponent;
