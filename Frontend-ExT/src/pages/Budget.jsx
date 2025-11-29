import React, { useEffect, useState, useMemo } from "react";
import Dashboard from "../../src/components/common/Dashboard";
import axiosConfig from "../util/axiosConfig";
import { API_ENDPOINTS } from "../util/apiEnpoints";
import { TrendingUp, TrendingDown, Calendar, Plus } from "lucide-react";
import AddBudgetMasterForm from "../components/AddBudgetForm";

const Budget = () => {
  // ----------------------------------------
  // MONTH SELECTION (Next 12 months only)
  // ----------------------------------------

  const generateUpcomingMonths = () => {
    const arr = [];
    const now = new Date();
    for (let i = 0; i < 12; i++) {
      const m = new Date(now.getFullYear(), now.getMonth() + i, 1);
      arr.push(m.toISOString().slice(0, 7));
    }
    return arr;
  };

  


  const upcomingMonths = generateUpcomingMonths();
  const [selectedMonth, setSelectedMonth] = useState(upcomingMonths[0]);
  const [selectedType, setSelectedType] = useState(null);
  const [subscriptions, setSubscriptions] = useState([]);

  // ----------------------------------------
  // API STATES
  // ----------------------------------------
  const [budgets, setBudgets] = useState([]);
  const [goals, setGoals] = useState([]);
  const [showAddBudget, setShowAddBudget] = useState(false);

  const filteredSubscriptions = useMemo(() => {
  return subscriptions.filter((sub) => {
    // must start before or on selected month
    const starts = sub.startMonth <= selectedMonth;

    // if no endMonth → infinite subscription
    if (!sub.endMonth || sub.endMonth === "") return starts;

    // must end on or after selected month
    const ends = sub.endMonth >= selectedMonth;

    return starts && ends;
  });
}, [subscriptions, selectedMonth]);

  // ----------------------------------------
  // Fetch all data
  // ----------------------------------------
  useEffect(() => {
    const fetchAll = async () => {
      try {
        const budgetRes = await axiosConfig.get(API_ENDPOINTS.GET_BUDGET);
        const goalsRes = await axiosConfig.get(API_ENDPOINTS.GET_GOALS);

        setBudgets(budgetRes.data || []);
        setGoals(goalsRes.data || []);
      } catch (err) {
        console.error("Budget fetch error:", err);
      }
    };

    fetchAll();
  }, []);

  // ----------------------------------------
  // Current month budget
  // ----------------------------------------
  const currentBudget = useMemo(
    () => budgets.find((b) => b.month === selectedMonth),
    [budgets, selectedMonth]
  );

  const hasBudget = Boolean(currentBudget);

  const totalBudget = currentBudget?.totalBudget || 0;
  const categories = currentBudget?.categories || [];

  const categorySpent = currentBudget?.spentByCategory || {};

  // ----------------------------------------
  // Savings Goals Filter – Show goals active in selected month
  // ----------------------------------------
  const getGoalEndMonth = (goal) => {
    if (!goal.timeLimit) return null; // no limit → show always
    const [y, m] = goal.startMonth.split("-").map(Number);
    const end = new Date(y, m - 1 + goal.timeLimit, 1);
    return end.toISOString().slice(0, 7);
  };

  const activeGoals = goals.filter((g) => {
    const endMonth = getGoalEndMonth(g);
    if (!endMonth) return true;
    return selectedMonth <= endMonth;
  });

  // ----------------------------------------
  // PIE CHART DATA
  // ----------------------------------------
  const pieData = useMemo(() => {
    if (!currentBudget) return [];

    return [
      { name: "Total Budget", value: Number(currentBudget.totalBudget) },
      { name: "Total Spent", value: Number(currentBudget.totalSpent) },
      {
        name: "Remaining",
        value: Number(currentBudget.totalBudget - currentBudget.totalSpent),
      },
    ];
  }, [currentBudget]);

  const COLORS = ["#6B46C1", "#E53E3E", "#38A169"];

  // ----------------------------------------
  // Month Readable Format
  // ----------------------------------------
  const formatMonth = (m) => {
    const [y, mo] = m.split("-");
    return new Date(y, mo - 1).toLocaleString("en-US", { month: "long", year: "numeric" });
  };

  const handleSaveBudget = (newBudget) => {
  console.log("✔ Budget saved:", newBudget);

  // Insert new budget into existing budgets list
  setBudgets((prev) => [...prev, newBudget]);

  setShowAddBudget(false);
};

// SAVE SAVING GOAL
const handleSaveGoal = (newGoal) => {
  console.log("✔ Saving Goal saved:", newGoal);

  // append to goals state
  setGoals((prev) => [...prev, newGoal]);

  setShowAddBudget(false);
};


// SAVE SUBSCRIPTION
const handleSaveSubscription = (newSubscription) => {
  console.log("✔ Subscription saved:", newSubscription);

  setSubscriptions((prev) => [...prev, newSubscription]);

  setShowAddBudget(false);
};



  // ----------------------------------------
  // UI STARTS HERE
  // ----------------------------------------
  return (
    <Dashboard activeMenu="Budget">
      <div className="p-6 space-y-10">

        {/* ============================================= */}
        {/* PAGE HEADER                                   */}
        {/* ============================================= */}

        <div className="flex items-center justify-between">
          <h1 className="text-xl font-bold text-gray-800">Budget Manager</h1>

          {/* Month Selector */}
          <div className="flex items-center gap-2">
            <Calendar className="text-purple-600" />
            <select
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              className="border p-2 rounded-lg focus:ring-2 focus:ring-purple-500"
            >
              {upcomingMonths.map((m) => (
                <option key={m} value={m}>
                  {formatMonth(m)}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* ============================================= */}
        {/* ADD BUDGET BUTTON                             */}
        {/* ============================================= */}

        <div className="flex justify-end">
          <button
            disabled={hasBudget}
            onClick={() => setShowAddBudget(true)}
            className={`px-4 py-2 rounded-lg flex items-center gap-2 text-white
              ${hasBudget ? "bg-gray-400 cursor-not-allowed" : "bg-purple-600 hover:bg-purple-700"}
            `}
          >
            <Plus size={18} /> Create Budget
          </button>
        </div>

        {/* ============================================= */}
        {/* MONTH BUDGET SUMMARY                          */}
        {/* ============================================= */}

        <div className="bg-white border rounded-xl shadow-sm p-6">
          <h2 className="text-lg font-semibold mb-4">{formatMonth(selectedMonth)} Overview</h2>

          {!hasBudget ? (
            <p className="text-gray-500">No budget set for this month.</p>
          ) : (
            <>
              {/* Total Budget */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">

                <div className="bg-purple-50 p-4 border border-purple-200 rounded-lg">
                  <p className="text-gray-600 text-sm">Total Budget</p>
                  <h2 className="text-2xl font-bold text-purple-700 mt-1">
                    ₹{totalBudget.toLocaleString("en-IN")}
                  </h2>
                </div>

                <div className="bg-red-50 p-4 border border-red-200 rounded-lg">
                  <p className="text-gray-600 text-sm">Total Spent</p>
                  <h2 className="text-2xl font-bold text-red-600 mt-1">
                    ₹{currentBudget.totalSpent.toLocaleString("en-IN")}
                  </h2>
                </div>

                <div className="bg-green-50 p-4 border border-green-200 rounded-lg">
                  <p className="text-gray-600 text-sm">Remaining</p>
                  <h2 className="text-2xl font-bold text-green-600 mt-1">
                    ₹{(totalBudget - currentBudget.totalSpent).toLocaleString("en-IN")}
                  </h2>
                </div>

              </div>

              {/* CATEGORY PROGRESS */}
              <h3 className="text-md font-semibold mb-3">Category Breakdown</h3>

              <div className="space-y-4">
                {categories.map((cat) => {
                  const spent = categorySpent[cat.category] || 0;
                  const percent = Math.min((spent / cat.limit) * 100, 100);

                  return (
                    <div key={cat.categoryName + "-" + cat.limit}>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="font-medium">{cat.category}</span>
                        <span className="text-gray-600">
                          ₹{spent} / ₹{cat.limit}
                        </span>
                      </div>

                      <div className="w-full h-2 bg-gray-200 rounded-full">
                        <div
                          className={`h-full rounded-full ${
                            percent > 90
                              ? "bg-red-500"
                              : percent > 50
                              ? "bg-yellow-500"
                              : "bg-green-500"
                          }`}
                          style={{ width: `${percent}%` }}
                        ></div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </>
          )}
        </div>

        {/* ============================================= */}
        {/* SAVING GOALS FOR THIS MONTH                   */}
        {/* ============================================= */}

        <div className="bg-white border rounded-xl shadow-sm p-6">
          <h2 className="text-lg font-semibold mb-4">Saving Goals (Active this month)</h2>

          {activeGoals.length === 0 ? (
            <p className="text-gray-500">No active goals for this month.</p>
          ) : (
            <div className="grid md:grid-cols-2 gap-6">
              {activeGoals.map((goal) => {
                const progress = Math.min(
                  (goal.currentAmount / goal.targetAmount) * 100,
                  100
                );

                return (
                  <div key={goal.id} className="p-4 rounded-lg border shadow-sm bg-white">
                    <h3 className="font-semibold text-gray-800">{goal.title}</h3>

                    <p className="text-sm text-gray-500 mt-1">
                      Target: ₹{goal.targetAmount.toLocaleString("en-IN")}
                    </p>

                    <div className="mt-3 bg-gray-200 h-2 rounded-full">
                      <div
                        className="bg-green-500 h-full rounded-full"
                        style={{ width: `${progress}%` }}
                      ></div>
                    </div>

                    <p className="text-sm font-medium text-green-700 mt-2">
                      ₹{goal.currentAmount.toLocaleString("en-IN")} saved
                    </p>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* ============================================= */}
        {/* SUBSCRIPTIONS FOR THIS MONTH                  */}
        {/* ============================================= */}

        <div className="bg-white border rounded-xl shadow-sm p-6">
        <h2 className="text-lg font-semibold mb-4">Subscriptions</h2>

        {filteredSubscriptions.length === 0 ? (
            <p className="text-gray-500">No subscriptions added.</p>
        ) : (
            <div className="space-y-4">
            {filteredSubscriptions.map((sub, index) => (
                <div
                key={index}
                className="p-4 border rounded-lg shadow-sm bg-gray-50"
                >
                <h3 className="font-semibold text-gray-800">{sub.name}</h3>

                <p className="text-sm text-gray-600">
                    Amount: ₹{sub.amount}
                </p>

                <p className="text-sm text-gray-600">
                    Renewal: {sub.renewalType}
                </p>

                <p className="text-sm text-gray-600">
                    Start: {sub.startMonth}
                </p>

                <p className="text-sm text-gray-600">
                    Ends: {sub.endMonth || "Auto-renewing"}
                </p>
                </div>
            ))}
            </div>
        )}
        </div>


        {/* ============================================= */}
        {/* ADD BUDGET MODAL (Stub)                       */}
        {/* ============================================= */}

        {showAddBudget && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
            <div className="bg-white w-full max-w-2xl p-8 rounded-xl shadow-lg">
            <AddBudgetMasterForm
                selectedMonth={selectedMonth}
                onClose={() => setShowAddBudget(false)}
                onSaveBudget={handleSaveBudget}
                onSaveGoal={handleSaveGoal}
                onSaveSubscription={handleSaveSubscription}
            />
            </div>
        </div>
        )}



      </div>
    </Dashboard>
  );
};

export default Budget;
