import React, { useState } from "react";
import { PiggyBank, Wallet, Repeat, Plus, Trash2, X } from "lucide-react";

const AddBudgetMasterForm = ({
  selectedMonth,
  onClose,
  onSaveBudget,
  onSaveGoal,
  onSaveSubscription
}) => {
  const [selectedType, setSelectedType] = useState(null);

  return (
    <div className="space-y-6">
      {/* ---------------------- */}
      {/* STEP 1: TYPE SELECTOR  */}
      {/* ---------------------- */}
      {!selectedType && (
        <BudgetTypeSelector
          onClose={onClose}
          onSelect={(type) => setSelectedType(type)}
        />
      )}

      {/* ---------------------- */}
      {/* STEP 2: MONTHLY BUDGET */}
      {/* ---------------------- */}
      {selectedType === "monthly" && (
        <AddMonthlyBudgetForm
          selectedMonth={selectedMonth}
          onClose={onClose}
          onSave={onSaveBudget}
        />
      )}

      {/* ---------------------- */}
      {/* STEP 3: SAVING GOAL    */}
      {/* ---------------------- */}
      {selectedType === "saving-goal" && (
        <AddSavingGoalForm
          onClose={onClose}
          onSave={onSaveGoal}
        />
      )}

      {/* ---------------------- */}
      {/* STEP 4: SUBSCRIPTION   */}
      {/* ---------------------- */}
      {selectedType === "subscription" && (
        <AddSubscriptionForm
          selectedMonth={selectedMonth}
          onClose={onClose}
          onSave={onSaveSubscription}
        />
      )}
    </div>
  );
};

export default AddBudgetMasterForm;





/* --------------------------------------------------------- */
/* ---------------------- TYPE SELECTOR --------------------- */
/* --------------------------------------------------------- */

const BudgetTypeSelector = ({ onClose, onSelect }) => {
  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">Select Budget Type</h2>
        <button onClick={onClose} className="text-gray-600 hover:text-black">
          <X size={20} />
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

        <OptionCard
          icon={<PiggyBank className="text-purple-600 mb-2" />}
          title="Saving Goal"
          desc="Track long-term savings"
          onClick={() => onSelect("saving-goal")}
        />

        <OptionCard
          icon={<Wallet className="text-purple-600 mb-2" />}
          title="Monthly Budget"
          desc="Plan expenses for this month"
          onClick={() => onSelect("monthly")}
        />

        <OptionCard
          icon={<Repeat className="text-purple-600 mb-2" />}
          title="Subscription"
          desc="Recurring apps & services"
          onClick={() => onSelect("subscription")}
        />
      </div>
    </div>
  );
};

const OptionCard = ({ icon, title, desc, onClick }) => (
  <div
    onClick={onClick}
    className="p-4 border rounded-lg hover:bg-purple-50 cursor-pointer text-center"
  >
    {icon}
    <h3 className="font-semibold">{title}</h3>
    <p className="text-sm text-gray-600">{desc}</p>
  </div>
);





/* --------------------------------------------------------- */
/* -------------------- MONTHLY BUDGET FORM ---------------- */
/* --------------------------------------------------------- */

const AddMonthlyBudgetForm = ({ selectedMonth, onClose, onSave }) => {
  const [totalBudget, setTotalBudget] = useState("");
  const [notes, setNotes] = useState("");

  const [categoryLimits, setCategoryLimits] = useState([
    { id: Date.now(), category: "", limit: "" },
  ]);

  const addCategoryLimit = () => {
    setCategoryLimits([
      ...categoryLimits,
      { id: Date.now(), category: "", limit: "" },
    ]);
  };

  const updateCategoryValue = (id, field, value) => {
    setCategoryLimits((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, [field]: value } : item
      )
    );
  };

  const removeCategory = (id) => {
    setCategoryLimits((prev) => prev.filter((item) => item.id !== id));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const budgetObject = {
      month: selectedMonth,
      totalBudget: Number(totalBudget),
      totalSpent: 0,
      spentByCategory: {},
      notes,
      categories: categoryLimits.filter(
        (c) => c.category.trim() !== "" && c.limit !== ""
      ),
      createdAt: new Date().toISOString(),
    };

    onSave(budgetObject);
    onClose();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">

    <h2 className="text-xl font-semibold text-gray-800">Monthly Budget</h2>

    {/* Total Budget */}
    <div className="flex flex-col gap-1">
        <label className="text-sm font-medium text-gray-700">
        Total Monthly Budget
        </label>
        <input
        type="number"
        placeholder="Enter amount (₹)"
        className="w-full p-3 border rounded-lg shadow-sm focus:ring-2 focus:ring-purple-500 outline-none"
        value={totalBudget}
        onChange={(e) => setTotalBudget(e.target.value)}
        />
    </div>

    {/* Month */}
    <div className="flex flex-col gap-1">
        <label className="text-sm font-medium text-gray-700">Budget Month</label>
        <input
        type="month"
        disabled
        className="w-full p-3 border rounded-lg bg-gray-100 shadow-sm cursor-not-allowed"
        value={selectedMonth}
        />
    </div>

    {/* Category Limits */}
    <div className="space-y-3">
        <label className="text-sm font-medium text-gray-700">
        Category-wise Budget Limits
        </label>

        {categoryLimits.map((item) => (
        <div
            key={item.id}
            className="flex items-center gap-3 p-3 bg-gray-50 border rounded-lg shadow-sm"
        >
            <input
            type="text"
            placeholder="Category"
            className="flex-1 p-3 border rounded-lg shadow-sm focus:ring-2 focus:ring-purple-500 outline-none"
            value={item.category}
            onChange={(e) =>
                updateCategoryValue(item.id, "category", e.target.value)
            }
            />

            <input
            type="number"
            placeholder="Limit (₹)"
            className="w-40 p-3 border rounded-lg shadow-sm focus:ring-2 focus:ring-purple-500 outline-none"
            value={item.limit}
            onChange={(e) =>
                updateCategoryValue(item.id, "limit", e.target.value)
            }
            />

            {categoryLimits.length > 1 && (
            <button
                type="button"
                className="text-red-500 hover:text-red-700"
                onClick={() => removeCategory(item.id)}
            >
                <Trash2 size={20} />
            </button>
            )}
        </div>
        ))}

        <button
        type="button"
        onClick={addCategoryLimit}
        className="flex items-center gap-2 text-purple-600 font-medium hover:text-purple-800"
        >
        <Plus size={18} /> Add another category
        </button>
    </div>

    {/* Notes */}
    <div>
        <label className="text-sm font-medium text-gray-700">Notes (Optional)</label>
        <textarea
        rows="3"
        placeholder="Enter any notes"
        className="w-full p-3 border rounded-lg shadow-sm focus:ring-2 focus:ring-purple-500 outline-none resize-none"
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
        />
    </div>

    {/* Buttons */}
    <div className="flex justify-end items-center gap-4 pt-4">
        <button
        type="button"
        className="px-5 py-2 rounded-lg border text-gray-700 hover:bg-gray-100 shadow-sm"
        onClick={onClose}
        >
        Cancel
        </button>

        <button
        type="submit"
        className="px-6 py-2 rounded-lg bg-purple-600 text-white hover:bg-purple-700 shadow-sm"
        >
        Save Budget
        </button>
    </div>

    </form>

  );
};





/* --------------------------------------------------------- */
/* ---------------------- SAVING GOAL FORM ----------------- */
/* --------------------------------------------------------- */

const AddSavingGoalForm = ({ onSave, onClose }) => {
  const [title, setTitle] = useState("");
  const [targetAmount, setTargetAmount] = useState("");
  const [currentAmount, setCurrentAmount] = useState(0);
  const [startMonth, setStartMonth] = useState("");
  const [timeLimit, setTimeLimit] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    const goal = {
      title,
      targetAmount: Number(targetAmount),
      currentAmount: Number(currentAmount),
      startMonth,
      timeLimit: timeLimit === "" ? null : Number(timeLimit)
    };

    onSave(goal);
    onClose();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">

    <h2 className="text-xl font-semibold text-gray-800">Saving Goal</h2>

    {/* Goal Title */}
    <div className="flex flex-col gap-1">
        <label className="text-sm font-medium text-gray-700">Goal Title</label>
        <input
        type="text"
        placeholder="Eg: Buy a Laptop"
        className="w-full p-3 border rounded-lg shadow-sm focus:ring-2 focus:ring-purple-500 outline-none"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        />
    </div>

    {/* Target Amount */}
    <div className="flex flex-col gap-1">
        <label className="text-sm font-medium text-gray-700">Target Amount</label>
        <input
        type="number"
        placeholder="Enter amount (₹)"
        className="w-full p-3 border rounded-lg shadow-sm focus:ring-2 focus:ring-purple-500 outline-none"
        value={targetAmount}
        onChange={(e) => setTargetAmount(e.target.value)}
        />
    </div>

    {/* Start Month */}
    <div className="flex flex-col gap-1">
        <label className="text-sm font-medium text-gray-700">Start Month</label>
        <input
        type="month"
        className="w-full p-3 border rounded-lg shadow-sm focus:ring-2 focus:ring-purple-500 outline-none"
        value={startMonth}
        onChange={(e) => setStartMonth(e.target.value)}
        />
    </div>

    {/* Time Limit */}
    <div className="flex flex-col gap-1">
        <label className="text-sm font-medium text-gray-700">
        Time Limit (Optional)
        </label>
        <input
        type="number"
        placeholder="Number of months"
        className="w-full p-3 border rounded-lg shadow-sm focus:ring-2 focus:ring-purple-500 outline-none"
        value={timeLimit}
        onChange={(e) => setTimeLimit(e.target.value)}
        />
        <p className="text-xs text-gray-500">Leave empty for indefinite goal</p>
    </div>

    {/* Buttons */}
    <div className="flex justify-end items-center gap-4 pt-4">
        <button
        type="button"
        className="px-5 py-2 rounded-lg border text-gray-700 hover:bg-gray-100 shadow-sm"
        onClick={onClose}
        >
        Cancel
        </button>

        <button
        type="submit"
        className="px-6 py-2 rounded-lg bg-purple-600 text-white hover:bg-purple-700 shadow-sm"
        >
        Save Goal
        </button>
    </div>

    </form>

  );
};




/* --------------------------------------------------------- */
/* ---------------------- SUBSCRIPTION FORM ---------------- */
/* --------------------------------------------------------- */

const AddSubscriptionForm = ({ selectedMonth, onSave, onClose, defaultPlans = [] }) => {
  // ---------------------------
  // FORM STATES
  // ---------------------------
  const [platformName, setPlatformName] = useState("");
  const [planName, setPlanName] = useState("");
  const [billingCycle, setBillingCycle] = useState("");
  const [amount, setAmount] = useState("");
  const [startMonth, setStartMonth] = useState(selectedMonth);
  const [userSelectedPlatform, setUserSelectedPlatform] = useState("");

  // ---------------------------
  // GROUP PLANS BY PLATFORM
  // ---------------------------
  const platformGroups = [...new Set(defaultPlans.map((p) => p.platform))];

  const filteredPlans = defaultPlans.filter(
    (p) => p.platform === userSelectedPlatform
  );

  // ---------------------------
  // AUTO APPLY PLAN DETAILS
  // ---------------------------
  const handlePlanSelect = (plan) => {
    setPlanName(plan.plan);
    setAmount(plan.amount);
    setBillingCycle(plan.cycle);
    setPlatformName(plan.platform);
  };

  // ---------------------------
  // SUBMIT HANDLER
  // Backend expects:
  // { amount, platformName, billingCycle, planName }
  // ---------------------------
  const handleSubmit = (e) => {
    e.preventDefault();

    if (!platformName || !planName || !billingCycle || !amount) {
      alert("Please complete all fields.");
      return;
    }

    const payload = {
      platformName,
      planName,
      billingCycle,
      amount: Number(amount),
    };

    onSave(payload); // calls backend POST /subscriptions/add
    onClose();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">

      <h2 className="text-xl font-semibold text-gray-800 mb-2">Add Subscription</h2>

      {/* PLATFORM SELECT */}
      <div className="flex flex-col gap-1">
        <label className="text-sm font-medium text-gray-600">Platform</label>

        <select
          className="p-3 border rounded-lg shadow-sm"
          value={userSelectedPlatform}
          onChange={(e) => {
            setUserSelectedPlatform(e.target.value);
            setPlatformName(e.target.value);
            setPlanName("");
            setAmount("");
            setBillingCycle("");
          }}
        >
          <option value="">Select Platform</option>
          {platformGroups.map((platform) => (
            <option key={platform} value={platform}>
              {platform}
            </option>
          ))}
        </select>
      </div>

      {/* PLAN SELECT */}
      {userSelectedPlatform && (
        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium text-gray-600">Choose Plan</label>

          <div className="space-y-2">
            {filteredPlans.map((plan, index) => (
              <div
                key={index}
                onClick={() => handlePlanSelect(plan)}
                className={`p-3 border rounded-lg cursor-pointer hover:bg-purple-50 ${
                  planName === plan.plan ? "border-purple-600 bg-purple-50" : ""
                }`}
              >
                <p className="font-semibold">{plan.plan}</p>
                <p className="text-sm text-gray-600">
                  ₹{plan.amount} — {plan.cycle}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* MANUAL FIELDS (Auto-filled for default plans, but editable) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium text-gray-700">Plan Name</label>
          <input
            type="text"
            className="p-3 border rounded-lg shadow-sm"
            value={planName}
            onChange={(e) => setPlanName(e.target.value)}
            placeholder="Basic, Standard, Duo etc."
          />
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium text-gray-700">Billing Cycle</label>
          <select
            className="p-3 border rounded-lg shadow-sm"
            value={billingCycle}
            onChange={(e) => setBillingCycle(e.target.value)}
          >
            <option value="">Select</option>
            <option value="MONTHLY">Monthly</option>
            <option value="YEARLY">Yearly</option>
            <option value="WEEKLY">Weekly</option>
          </select>
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium text-gray-700">Amount (₹)</label>
          <input
            type="number"
            className="p-3 border rounded-lg shadow-sm"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="0"
          />
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium text-gray-700">Start Month</label>
          <input
            type="month"
            className="p-3 border rounded-lg shadow-sm"
            value={startMonth}
            onChange={(e) => setStartMonth(e.target.value)}
          />
        </div>

      </div>

      {/* BUTTONS */}
      <div className="flex justify-end gap-4 mt-6">
        <button
          type="button"
          onClick={onClose}
          className="px-5 py-2 rounded-lg border text-gray-700 hover:bg-gray-100"
        >
          Cancel
        </button>

        <button
          type="submit"
          className="px-6 py-2 rounded-lg bg-purple-600 text-white hover:bg-purple-700"
        >
          Save Subscription
        </button>
      </div>
    </form>
  );
};
