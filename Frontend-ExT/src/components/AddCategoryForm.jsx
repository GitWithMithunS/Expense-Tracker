import React, { useEffect, useState } from "react";
import EmojiPickerComponent from "./EmojiPickerComponent";
import { showWarningToast } from "./CustomToast";
import { Loader } from "lucide-react";

const AddCategoryForm = ({ onSubmit, onClose, initialCategoryData, isEditing }) => {
  const [category, setCategory] = useState({
    name: "",
    type: "income",
    icon: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (key, value) => {
    setCategory((prev) => ({ ...prev, [key]: value }));
  };

  useEffect(() => {
    if (isEditing && initialCategoryData) {
      console.log("Prefilling form:", initialCategoryData);
      setCategory(initialCategoryData);
    } else {
      setCategory({ name: "", type: "income", icon: "" });
    }
  }, [isEditing, initialCategoryData]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!category.name.trim()) {
      showWarningToast("Please enter category name");
      return;
    }

    try {
      setLoading(true);
      await onSubmit(category);
      setLoading(false);
      onClose?.();
    } catch (error) {
      console.log("Form error →", error);
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">

      {/* Emoji Picker */}
      <div className="flex items-center gap-4 ">
        <EmojiPickerComponent
          selectedEmoji={category.icon}
          className="bg-green-500"
          onSelect={(emoji) => handleChange("icon", emoji)}
        />
        <span className="text-sm text-gray-700">Pick Icon</span>
      </div>

      {/* Name */}
      <div>
        <label className="text-sm font-medium">Category Name</label>
        <input
          type="text"
          className="w-full p-2 border rounded-lg 
           border-gray-300 
           focus:ring-1 focus:ring-purple-500 
           focus:border-purple-500 
           hover:border-purple-500 
           outline-none 
           transition"          placeholder="e.g., Food, Salary"
          value={category.name}
          onChange={(e) => handleChange("name", e.target.value)}
        />
      </div>

      {/* Type */}
      <div>
        <label className="text-sm font-medium">Category Type</label>
        <select
          className="w-full p-2 border rounded-lg 
           border-gray-300 
           focus:ring-1 focus:ring-purple-500 
           focus:border-purple-500 
           hover:border-purple-500 
           outline-none 
           transition"          value={category.type}
          onChange={(e) => handleChange("type", e.target.value)}
        >
          <option value="income">Income</option>
          <option value="expense">Expense</option>
        </select>
      </div>

      {/* Submit */}
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
            ? "Update Category"
            : "Add Category"}
      </button>

    </form>
  );
};

export default AddCategoryForm;
