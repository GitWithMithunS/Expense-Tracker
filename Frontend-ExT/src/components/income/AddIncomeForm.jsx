import React, { useEffect, useState } from "react";
import EmojiPickerComponent from "../common/EmojiPickerComponent";
import { Loader } from "lucide-react";
import { showWarningToast } from "../common/CustomToast";

const AddIncomeForm = ({
  onSubmit,
  onClose,
  initialIncomeData,
  isEditing,
  incomeCategories,
}) => {
  const [income, setIncome] = useState({
    name: "",
    amount: "",
    date: "",
    categoryId: "",
    icon: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (key, value) => {
    setIncome((prev) => ({ ...prev, [key]: value }));
  };

  // Prefill data when editing
  useEffect(() => {
    if (isEditing && initialIncomeData) {
      setIncome(initialIncomeData);
    } else {
      setIncome({
        name: "",
        amount: "",
        date: "",
        categoryId: "",
        icon: "",
      });
    }
  }, [isEditing, initialIncomeData]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!income.name.trim()) {
      showWarningToast("Please enter income name");
      return;
    }
    if (!income.amount || income.amount <= 0) {
      showWarningToast("Amount must be greater than zero");
      return;
    }
    if (!income.date) {
      showWarningToast("Please select date");
      return;
    }
    if (!income.categoryId) {
      showWarningToast("Please select a category");
      return;
    }

    const today = new Date().toISOString().split('T')[0];
    if(income.date>today){
        showWarningToast('Date cannot be in the future');
        return;
    }

    try {
      setLoading(true);
      await onSubmit(income);
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
          selectedEmoji={income.icon}
          className="bg-green-500"
          onSelect={(emoji) => handleChange("icon", emoji)}
        />
        <span className="text-sm text-gray-700">Pick Icon</span>
      </div>

      {/* NAME */}
      <div>
        <label className="text-sm font-medium">Income Source</label>
        <input
          type="text"
          className="w-full p-2 border rounded-lg transition 
                     border-gray-300 
                     focus:ring-1 focus:ring-purple-500 focus:border-purple-500"
          placeholder="e.g., Salary, Freelancing"
          value={income.name}
          onChange={(e) => handleChange("name", e.target.value)}
        />
      </div>

      {/* AMOUNT */}
      <div>
        <label className="text-sm font-medium">Amount (₹)</label>
        <input
          type="number"
          min="1"
          className="w-full p-2 border rounded-lg transition 
                     border-gray-300 
                     focus:ring-1 focus:ring-purple-500 focus:border-purple-500"
          placeholder="e.g., 50000"
          value={income.amount}
          onChange={(e) => handleChange("amount", Number(e.target.value))}
        />
      </div>

      {/* CATEGORY SELECT */}
<div className="relative w-full overflow-hidden">
  <label className="text-sm font-medium">Income Category</label>

  <select
    className="
      block w-full 
      p-2 border rounded-lg transition 
      border-gray-300 
      focus:ring-1 focus:ring-purple-500 
      focus:border-purple-500
      bg-white
      text-sm
    "
    style={{ maxWidth: "100%" }}
    value={income.categoryId}
    onChange={(e) => handleChange("categoryId", Number(e.target.value))}
  >
    <option value="">Select Category</option>

    {incomeCategories?.map((cat) => (
      <option
        key={cat.id}
        value={cat.id}
        className="truncate"
      >
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
          className="w-full p-2 border rounded-lg transition 
                     border-gray-300 
                     focus:ring-1 focus:ring-purple-500 focus:border-purple-500"
          value={income.date}
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
          ? "Update Income"
          : "Add Income"}
      </button>
    </form>
  );
};

export default AddIncomeForm;
