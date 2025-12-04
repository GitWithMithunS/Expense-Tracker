// src/pages/Budget.jsx
import React, { useEffect, useState, useMemo } from "react";
import Dashboard from "../components/common/Dashboard";
import axiosConfig from "../util/axiosConfig";
import { API_ENDPOINTS } from "../util/apiEnpoints";
import { TrendingUp, TrendingDown, Calendar, Plus } from "lucide-react";
import AddBudgetMasterForm from "../components/home/AddBudgetForm";
import Model from "../components/common/Model";
import EmptyState from "../components/charts/EmptyState";
import { showErrorToast, showSuccessToast } from "../components/common/CustomToast";

const Budget = () => {
  // ----------------------------------------
  // MONTH SELECTION (Next 12 months only)
  // ----------------------------------------
  const generateUpcomingMonths = () => {
    const arr = [];
    const now = new Date();
    for (let i = 0; i < 12; i++) {
      const m = new Date(now.getFullYear(), now.getMonth() + i, 1);
      arr.push(m.toISOString().slice(0, 7)); // "YYYY-MM"
    }
    return arr;
  };

  const upcomingMonths = generateUpcomingMonths();
  const [selectedMonth, setSelectedMonth] = useState(upcomingMonths[0]);

  // subscription / plans
  const [subscriptions, setSubscriptions] = useState([]);
  const [defaultPlans, setDefaultPlans] = useState([]);

  // budgets / categories / goals (demo data structures)
  const [budgets, setBudgets] = useState([]);
  const [goals, setGoals] = useState([]);
  const [categoryBudgets, setCategoryBudgets] = useState([]);

  // modal state
  const [showAddBudget, setShowAddBudget] = useState(false);
  const [loadingSubs, setLoadingSubs] = useState(false);

  // ----------------------------------------
  // Helpers - normalize subscription returned by backend
  // ----------------------------------------
  const normalizeSubscription = (s) => ({
    id: s.id,
    platformName: s.platformName || s.platform || s.platformName,
    planName: s.planName || s.plan || s.planName,
    amount: Number(s.amount || 0),
    billingCycle: s.billingCycle || s.cycle || s.billingCycle,
    nextDueDate: s.nextDueDate || s.nextDueDate,
    daysUntilRenewal:
      typeof s.daysUntilRenewal === "number" ? s.daysUntilRenewal : null,
    status: s.status || "UNKNOWN",
    startMonth: s.startMonth || null,
    endMonth: s.endMonth || null,
    raw: s,
  });

  // ----------------------------------------
  // Filter subscriptions that apply to the selected month
  // ----------------------------------------
  const filteredSubscriptions = useMemo(() => {
    return subscriptions.filter((sub) => {
      // treat missing startMonth as always started
      if (sub.startMonth && sub.startMonth > selectedMonth) return false;
      // if no endMonth => active
      if (!sub.endMonth || sub.endMonth === "") return true;
      return sub.endMonth >= selectedMonth;
    });
  }, [subscriptions, selectedMonth]);

  // ----------------------------------------
  // Fetch subscriptions & default plans
  // ----------------------------------------
  useEffect(() => {
    const fetchAll = async () => {
      try {
        setLoadingSubs(true);

        // 1) User subscriptions
        // NOTE: API_ENDPOINTS.GET_USER_SUBSCRIPTIONS should be added to your endpoints file
        const subRes = await axiosConfig.get(API_ENDPOINTS.GET_USER_SUBSCRIPTIONS);
        const subsList = subRes.data?.data || [];
        setSubscriptions(subsList.map(normalizeSubscription));
        console.log('subres' , subRes);
        
        // 2) Default plans for "Add subscription" modal
        const plansRes = await axiosConfig.get(API_ENDPOINTS.GET_DEFAULT_PLANS);
        const plansList = plansRes.data?.data || [];
        setDefaultPlans(plansList);
        console.log('plansRes' , plansRes);

      } catch (err) {
        console.error("Failed to load subscriptions/plans", err);
        showErrorToast("Failed to load subscriptions");
      } finally {
        setLoadingSubs(false);
      }
    };

    fetchAll();
  }, []);

  // ----------------------------------------
  // Current month budget & helpers
  // ----------------------------------------
  const currentBudget = useMemo(
    () => budgets.find((b) => b.month === selectedMonth),
    [budgets, selectedMonth]
  );

  const hasBudget = Boolean(currentBudget);
  const totalBudget = currentBudget?.totalBudget || 0;
  const categories = categoryBudgets || [];
  const categorySpent = currentBudget?.spentByCategory || {};

  const getGoalEndMonth = (goal) => {
    if (!goal.timeLimit) return null;
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
  // Pie chart data (small helper)
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

  // ----------------------------------------
  // Add subscription (POST)
  // Accepts a subscription object with shape expected by backend:
  // { amount, platformName, billingCycle, planName }
  // ----------------------------------------
  const handleAddSubscription = async (payload) => {
    try {
      const res = await axiosConfig.post(API_ENDPOINTS.ADD_SUBSCRIPTION, payload);
      const created = res.data?.data;
      if (!created) {
        showErrorToast("Failed to add subscription (invalid response)");
        return;
      }
      const normalized = normalizeSubscription(created);
      setSubscriptions((prev) => [normalized, ...prev]);
      showSuccessToast("Subscription added");
      return normalized;
    } catch (err) {
      console.error("Add subscription error", err);
      showErrorToast("Failed to add subscription");
      throw err;
    }
  };

  // ----------------------------------------
  // Delete subscription
  // ----------------------------------------
  const handleDeleteSubscription = async (id) => {
    try {
      await axiosConfig.delete(`${API_ENDPOINTS.DELETE_SUBSCRIPTION}/${id}`);
      setSubscriptions((prev) => prev.filter((s) => s.id !== id));
      showSuccessToast("Subscription removed");
    } catch (err) {
      console.error("Delete subscription error", err);
      showErrorToast("Failed to delete subscription");
    }
  };

  // ----------------------------------------
  // Format helpers
  // ----------------------------------------
  const formatMonth = (m) => {
    if (!m) return "";
    const [y, mo] = m.split("-");
    return new Date(y, mo - 1).toLocaleString("en-US", { month: "long", year: "numeric" });
  };

  // ----------------------------------------
  // Budget/save stubs for compatibility with your UI
  // ----------------------------------------
  const handleSaveBudget = (newBudget) => {
    setBudgets((prev) => [...prev, newBudget]);
    setShowAddBudget(false);
    showSuccessToast("Budget saved (local)");
  };

  const handleSaveGoal = (newGoal) => {
    setGoals((prev) => [...prev, newGoal]);
    setShowAddBudget(false);
    showSuccessToast("Goal saved (local)");
  };


  // UI
  return (
    <Dashboard activeMenu="Budget">
      <div className="p-6 space-y-10">
        {/* HEADER */}
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

        {/* CREATE BUDGET ACTION */}
        <div className="flex justify-end">
          <button
            disabled={hasBudget}
            onClick={() => setShowAddBudget(true)}
            className={`px-4 py-2 rounded-lg flex items-center gap-2 text-white
              ${hasBudget ? "bg-gray-400 cursor-not-allowed" : "bg-purple-600 hover:bg-purple-700"}`}
          >
            <Plus size={18} /> Create Budget
          </button>
        </div>

        {/* MONTH SUMMARY */}
        <div className="bg-white border rounded-xl shadow-sm p-6">
          <h2 className="text-lg font-semibold mb-4">{formatMonth(selectedMonth)} Overview</h2>

          {!hasBudget ? (
            <EmptyState message=" Add your budget." type="list" />
          ) : (
            <>
              {/* Total / Spent / Remaining */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-purple-50 p-4 border border-purple-200 rounded-lg">
                  <p className="text-gray-600 text-sm">Total Budget</p>
                  <h2 className="text-2xl font-bold text-purple-700 mt-1">₹{totalBudget.toLocaleString("en-IN")}</h2>
                </div>

                <div className="bg-red-50 p-4 border border-red-200 rounded-lg">
                  <p className="text-gray-600 text-sm">Total Spent</p>
                  <h2 className="text-2xl font-bold text-red-600 mt-1">₹{currentBudget.totalSpent.toLocaleString("en-IN")}</h2>
                </div>

                <div className="bg-green-50 p-4 border border-green-200 rounded-lg">
                  <p className="text-gray-600 text-sm">Remaining</p>
                  <h2 className="text-2xl font-bold text-green-600 mt-1">₹{(totalBudget - currentBudget.totalSpent).toLocaleString("en-IN")}</h2>
                </div>
              </div>

              {/* Category Breakdown */}
              <h3 className="text-md font-semibold mb-3">Category Breakdown</h3>
              <div className="space-y-4">
                {categories.map((cat) => {
                  const spent = cat.spent ?? 0;
                  const percent = cat.limit ? Math.min((spent / cat.limit) * 100, 100) : 0;
                  return (
                    <div key={`${cat.categories}-${cat.limit}`}>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="font-medium">{cat.categories}</span>
                        <span className="text-gray-600">₹{spent} / ₹{cat.limit}</span>
                      </div>

                      <div className="w-full h-2 bg-gray-200 rounded-full">
                        <div
                          className={`h-full rounded-full ${percent > 90 ? "bg-red-500" : percent > 50 ? "bg-yellow-500" : "bg-green-500"}`}
                          style={{ width: `${percent}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </>
          )}
        </div>

        {/* SAVING GOALS */}
        <div className="bg-white border rounded-xl shadow-sm p-6">
          <h2 className="text-lg font-semibold mb-4">Saving Goals (Active this month)</h2>
          {activeGoals.length === 0 ? (
            <EmptyState message="Add your monthly goals." type="list" />
          ) : (
            <div className="grid md:grid-cols-2 gap-6">
              {activeGoals.map((goal) => {
                const progress = Math.min((goal.currentAmount / goal.targetAmount) * 100, 100);
                return (
                  <div key={goal.id} className="p-4 rounded-lg border shadow-sm bg-white">
                    <h3 className="font-semibold text-gray-800">{goal.goalName}</h3>
                    <p className="text-sm text-gray-500 mt-1">Target: ₹{goal.target.toLocaleString("en-IN")}</p>
                    <div className="mt-3 bg-gray-200 h-2 rounded-full">
                      <div className="bg-green-500 h-full rounded-full" style={{ width: `${Math.min((goal.saved / goal.target) * 100, 100)}%` }} />
                    </div>
                    <p className="text-sm font-medium text-green-700 mt-2">₹{goal.saved.toLocaleString("en-IN")} saved</p>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* SUBSCRIPTIONS */}
        <div className="bg-white border rounded-xl shadow-sm p-6">
          <h2 className="text-lg font-semibold mb-4">Subscriptions</h2>

          {loadingSubs ? (
            <p className="text-center text-gray-500">Loading subscriptions...</p>
          ) : filteredSubscriptions.length === 0 ? (
            <EmptyState message="Add your subscriptions." type="list" />
          ) : (
            <div className="space-y-4">
              {filteredSubscriptions.map((sub) => (
                <div key={sub.id} className="p-4 border rounded-lg shadow-sm bg-gray-50 flex justify-between items-center">
                  <div>
                    <h3 className="font-semibold text-gray-800">{sub.platformName}</h3>
                    <p className="text-sm text-gray-600">Plan: {sub.planName}</p>
                    <p className="text-sm text-gray-600">Amount: ₹{sub.amount}</p>
                    <p className="text-sm text-gray-600">Next: {sub.nextDueDate || "—"}</p>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <div className="text-sm px-3 py-1 rounded-lg bg-white border">{sub.billingCycle}</div>
                    <button onClick={() => handleDeleteSubscription(sub.id)} className="text-sm text-red-600 hover:underline">Remove</button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* ADD BUDGET SUBSCRIPTION MODAL */}
        {showAddBudget && (
          <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
            <div className="bg-white w-full max-w-2xl p-8 rounded-xl shadow-lg">
              <AddBudgetMasterForm
                selectedMonth={selectedMonth}
                defaultPlans={defaultPlans}
                onClose={() => setShowAddBudget(false)}
                onSaveBudget={handleSaveBudget}
                onSaveGoal={handleSaveGoal}
                onSaveSubscription={handleAddSubscription} // this should call backend
              />
            </div>
          </div>
        )}
      </div>
    </Dashboard>
  );
};

export default Budget;
