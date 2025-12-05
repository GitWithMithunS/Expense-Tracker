import { PiggyBank, Wallet, Repeat, Plus, Trash2, X } from "lucide-react";
import { useState } from "react";


export const MonthlyBudgetForm = ({ selectedMonth, onClose, onSave }) => {
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