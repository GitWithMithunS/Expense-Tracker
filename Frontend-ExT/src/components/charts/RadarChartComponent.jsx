import React, { useMemo } from "react";
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import EmptyState from "./EmptyState";

const RadarChartComponent = ({ data = [], categories = [], type = "expense" }) => {
  const title = type === "income" ? "Income Radar Overview" : "Expense Radar Overview";
  const emptyMsg = type === "income" ? "No income radar data available." : "No expense radar data available.";

  // If you're only using categories (with .limit and .spent) you can feed categories directly.
  // If you want to derive spent from `data` (transactions), you can sum transactions per category instead.
  const chartData = useMemo(() => {
    // If categories empty but transactions present, try to derive category info from transactions
    if ((!categories || categories.length === 0) && data && data.length > 0) {
      // derive a simple mapping: categoryName -> spent
      const map = {};
      data.forEach((t) => {
        const catKey = t.categoryName || t.category || String(t.categoryId || "unknown");
        if (!map[catKey]) map[catKey] = { subject: catKey, Spent: 0, Limit: 0 };
        if (t.type === "expense" || type === "expense") map[catKey].Spent += Number(t.amount || 0);
        else map[catKey].Limit += Number(t.amount || 0);
      });
      return Object.values(map);
    }

    // Use categories array: create subject, Spent and Limit keys
    return (categories || []).map((c) => ({
      subject: `${c.icon ?? ""} ${c.category}`,
      Spent: Number(c.spent ?? 0),
      Limit: Number(c.limit ?? 0),
    }));
  }, [categories, data, type]);

  if (!chartData || chartData.length === 0) {
    return (
      <div className="bg-white p-5 rounded-xl shadow-md border border-gray-200 h-80">
        <EmptyState message={emptyMsg} type="chart" />
      </div>
    );
  }

  // compute a good max for radius axis (round up a bit)
  const maxValCandidate = Math.max(
    ...chartData.flatMap((d) => [d.Spent ?? 0, d.Limit ?? 0]),
    100
  );
  // round up to nearest 100 (or 10 for smaller numbers)
  const roundTo = maxValCandidate > 1000 ? 100 : 50;
  const maxValue = Math.ceil(maxValCandidate / roundTo) * roundTo;

  return (
    <div className="bg-white p-5 rounded-xl shadow-md border border-gray-200 w-full">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">{title}</h3>

      <div className="h-[350px] flex items-center justify-center">
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart data={chartData}>
            <PolarGrid stroke="#e6e6e6" />
            <PolarAngleAxis dataKey="subject" tick={{ fontSize: 12 }} />
            <PolarRadiusAxis angle={30} domain={[0, maxValue]} tick={{ fontSize: 10 }} />
            <Radar name="Spent" dataKey="Spent" stroke="#E53E3E" fill="#E53E3E" fillOpacity={0.45} isAnimationActive={false} />
            <Radar name="Limit" dataKey="Limit" stroke="#3182CE" fill="#3182CE" fillOpacity={0.25} isAnimationActive={false} />
            <Tooltip />
            <Legend verticalAlign="top" height={36} />
          </RadarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default RadarChartComponent;
