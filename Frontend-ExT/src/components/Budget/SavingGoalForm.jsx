import { useState } from "react";

export const SavingGoalForm = ({ onSave, onClose }) => {
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