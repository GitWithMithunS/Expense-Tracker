import React, { useEffect, useState } from "react";
import EmojiPickerComponent from "./EmojiPickerComponent";
import { Loader } from "lucide-react";
import { showWarningToast } from "./CustomToast";

const AddExpenseForm = ({
  onSubmit,
  onClose,
  initialExpenseData,
  isEditing,
  expenseCategories,
}) => {

  const [expense, setExpense] = useState({
    name: "",
    amount: "",
    date: "",
    categoryId: "",
    icon: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (key, value) => {
    setExpense((prev) => ({ ...prev, [key]: value }));
  };

  // Prefill data when editing
  useEffect(() => {
    if (isEditing && initialExpenseData) {
      setExpense(initialExpenseData);
    } else {
      setExpense({
        name: "",
        amount: "",
        date: "",
        categoryId: "",
        icon: "",
      });
    }
  }, [isEditing, initialExpenseData]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!expense.name.trim()) {
      showWarningToast("Please enter expense name");
      return;
    }
    if (!expense.amount || expense.amount <= 0) {
      showWarningToast("Amount must be greater than zero");
      return;
    }
    if (!expense.date) {
      showWarningToast("Please select date");
      return;
    }
    if (!expense.categoryId) {
      showWarningToast("Please select a category");
      return;
    }

    const today = new Date().toISOString().split("T")[0];
    if (expense.date > today) {
      showWarningToast("Date cannot be in the future");
      return;
    }

    try {
      setLoading(true);
      await onSubmit(expense);
      setLoading(false);
      onClose?.();
    } catch (error) {
      console.error("Form error →", error);
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">

      {/* ICON PICKER */}
      <div className="flex items-center gap-4">
        <EmojiPickerComponent
          selectedEmoji={expense.icon}
          className="bg-red-500"
          onSelect={(emoji) => handleChange("icon", emoji)}
        />
        <span className="text-sm text-gray-700">Pick Icon</span>
      </div>

      {/* NAME */}
      <div>
        <label className="text-sm font-medium">Expense Name</label>
        <input
          type="text"
          className="w-full p-2 border rounded-lg transition border-gray-300 
                     focus:ring-1 focus:ring-purple-500 focus:border-purple-500"
          placeholder="e.g., Grocery, Fuel, Shopping"
          value={expense.name}
          onChange={(e) => handleChange("name", e.target.value)}
        />
      </div>

      {/* AMOUNT */}
      <div>
        <label className="text-sm font-medium">Amount (₹)</label>
        <input
          type="number"
          min="1"
          className="w-full p-2 border rounded-lg transition border-gray-300 
                     focus:ring-1 focus:ring-purple-500 focus:border-purple-500"
          placeholder="e.g., 500"
          value={expense.amount}
          onChange={(e) => handleChange("amount", Number(e.target.value))}
        />
      </div>

      {/* CATEGORY SELECT */}
      <div className="relative w-full overflow-hidden">
        <label className="text-sm font-medium">Expense Category</label>

        <select
          className="block w-full p-2 border rounded-lg transition border-gray-300 
                     focus:ring-1 focus:ring-purple-500 focus:border-purple-500 bg-white text-sm"
          value={expense.categoryId}
          onChange={(e) => handleChange("categoryId", Number(e.target.value))}
        >
          <option value="">Select Category</option>

          {expenseCategories?.map((cat) => (
            <option key={cat.id} value={cat.id} className="truncate">
              {cat.icon} {cat.name}
            </option>
          ))}
        </select>
      </div>

      {/* DATE */}
      <div>
        <label className="text-sm font-medium">Date</label>
        <input
          type="date"
          className="w-full p-2 border rounded-lg transition border-gray-300 
                     focus:ring-1 focus:ring-purple-500 focus:border-purple-500"
          value={expense.date}
          onChange={(e) => handleChange("date", e.target.value)}
        />
      </div>

      {/* SUBMIT BUTTON */}
      <button
        type="submit"
        disabled={loading}
        className="w-full bg-purple-600 text-white py-2 rounded-lg flex items-center justify-center gap-2"
      >
        {loading && <Loader className="animate-spin w-5 h-5" />}
        {loading
          ? isEditing
            ? "Updating..."
            : "Adding..."
          : isEditing
          ? "Update Expense"
          : "Add Expense"}
      </button>
    </form>
  );
};

export default AddExpenseForm;
