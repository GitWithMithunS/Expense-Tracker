import { useState } from "react";
import { ChevronDownIcon, ChevronUpIcon, ChartPieIcon } from "@heroicons/react/24/outline";

const BudgetStatus = () => {
  const [open, setOpen] = useState(false);

  const totalBudget = 20000;
  const usedAmount = 12500;

  const categories = [
    { category: "Food", percent: 38 },
    { category: "Travel", percent: 15 },
    { category: "Shopping", percent: 25 },
    { category: "Bills", percent: 22 }
  ];

  const percentUsed = Math.round((usedAmount / totalBudget) * 100);

  let color = "bg-green-500";
  if (percentUsed > 60 && percentUsed < 85) color = "bg-yellow-500";
  if (percentUsed >= 85) color = "bg-red-500";

  return (
    <div className="w-full bg-white shadow-md rounded-xl p-8 hover:shadow-lg transition-all">

      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-semibold tracking-wide flex items-center gap-2">
          <ChartPieIcon className="h-6 w-6 text-indigo-600" />
          BUDGET STATUS
        </h3>

        <div className="text-lg font-semibold text-gray-700">
          {percentUsed}% used
        </div>
      </div>

      <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden">
        <div
          className={`${color} h-4 transition-all duration-700`}
          style={{ width: `${percentUsed}%` }}
        ></div>
      </div>

      <p className="text-gray-600 text-sm mt-3">
        You've spent <b>₹{usedAmount}</b> out of <b>₹{totalBudget}</b>.
      </p>

      <button
        onClick={() => setOpen(!open)}
        className="mt-6 flex items-center gap-2 text-indigo-600 font-semibold hover:underline"
      >
        {open ? (
          <>
            Hide category breakdown <ChevronUpIcon className="h-5 w-5" />
          </>
        ) : (
          <>
            Show category breakdown <ChevronDownIcon className="h-5 w-5" />
          </>
        )}
      </button>

      {open && (
        <div className="mt-5 space-y-4">
          {categories.map((cat, index) => (
            <div key={index}>
              <div className="flex justify-between">
                <span className="font-medium text-gray-700">{cat.category}</span>
                <span className="text-gray-600">{cat.percent}%</span>
              </div>

              <div className="w-full bg-gray-200 rounded-full h-3">
                <div
                  className="bg-indigo-500 h-3 rounded-full transition-all"
                  style={{ width: `${cat.percent}%` }}
                ></div>
              </div>
            </div>
          ))}
        </div>
      )}

    </div>
  );
};

export default BudgetStatus;
