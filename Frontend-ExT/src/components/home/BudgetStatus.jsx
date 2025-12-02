import { useState, useEffect } from "react";
import axiosConfig from "../../util/axiosConfig";
import { API_ENDPOINTS } from "../../util/apiEnpoints";
import { PieChart, ChevronDown, ChevronUp } from "lucide-react";

const BudgetStatus = () => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  const [totalBudget, setTotalBudget] = useState(0);
  const [totalSpent, setTotalSpent] = useState(0);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchBudgetData = async () => {
      try {
        const res = await axiosConfig.get(API_ENDPOINTS.GET_BUDGET_DATA);
        const data = res.data;
        console.log("budget data loaded",res.data)

        setTotalBudget(data.totalBudget);
        setTotalSpent(data.totalSpent);

        const convertedCategories = (data.categories || []).map((cat) => {
          const percent = Math.round((cat.spent / cat.limit) * 100);

          return {
            category: cat.category,
            percent,
          };
        });

        setCategories(convertedCategories);
      } catch (error) {
        console.error("Budget Status fetch error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBudgetData();
  }, []);

  if (loading) {
    return (
      <div className="w-full bg-white shadow-md rounded-xl p-8 text-center">
        Loading budget status…
      </div>
    );
  }

  const percentUsed = Math.round((totalSpent / totalBudget) * 100);

  let color = "bg-green-500";
  if (percentUsed > 60 && percentUsed < 85) color = "bg-yellow-500";
  if (percentUsed >= 85) color = "bg-red-500";

  return (
    <div className="w-full bg-white shadow-md rounded-xl p-8 hover:shadow-lg transition-all">

      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-semibold tracking-wide flex items-center gap-2">
          <PieChart className="h-6 w-6 text-purple-600" />
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
        You've spent <b>₹{totalSpent.toLocaleString("en-IN")}</b> out of{" "}
        <b>₹{totalBudget.toLocaleString("en-IN")}</b>.
      </p>

      <button
        onClick={() => setOpen(!open)}
        className="mt-6 flex items-center gap-2 text-purple-600 font-semibold hover:underline"
      >
        {open ? (
          <>
            Hide category breakdown <ChevronUp className="h-5 w-5" />
          </>
        ) : (
          <>
            Show category breakdown <ChevronDown className="h-5 w-5" />
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
                  className="bg-purple-600 h-3 rounded-full transition-all"
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
