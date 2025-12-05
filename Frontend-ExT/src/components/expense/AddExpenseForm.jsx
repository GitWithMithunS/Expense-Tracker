import React, { useEffect, useState, useRef } from "react";
import EmojiPickerComponent from "../common/EmojiPickerComponent";
import { Loader, ImageUp } from "lucide-react";
import { showWarningToast } from "../common/CustomToast";
import axiosConfig from "@/util/axiosConfig";
import { API_ENDPOINTS } from "@/util/apiEnpoints";

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

  const [imageFile, setImageFile] = useState(null);
  const [loading, setLoading] = useState(false);

  // hidden file input ref
  const fileInputRef = useRef(null);

  const handleChange = (key, value) => {
    setExpense((prev) => ({ ...prev, [key]: value }));
  };



  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    setImageFile(file);
      console.log("Selected file:", file);

  try {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("billDescription", expense.name || "No Description");
    formData.append("date", expense.date || "");     // backend handles blank date
    formData.append("categoryId", expense.categoryId || 0);

    const res = await axiosConfig.post("/api/v1/bills/upload", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
        "X-User-Id": 1, //  replace with real user ID later
      },
    });
    // const res = await axiosConfig.post(API_ENDPOINTS.UPLOAD_BILL , formData);

    console.log("UPLOAD SUCCESS:", res.data);
  } catch (error) {
    console.error("UPLOAD ERROR:", error);
  }
};


  // open file dialog
  const triggerFileOpen = () => {
    fileInputRef.current?.click();
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

      const payload = {
        ...expense,
        imageFile, // attach uploaded file
      };

      await onSubmit(payload);
      setLoading(false);
      onClose?.();
    } catch (error) {
      console.error("Form error →", error);
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">

      {/* ICON PICKER + UPLOAD BUTTON */}
      <div className="flex items-center justify-between w-full">
        
        {/* left side emoji picker */}
        <div className="flex items-center gap-3">
          <EmojiPickerComponent
            selectedEmoji={expense.icon}
            onSelect={(emoji) => handleChange("icon", emoji)}
          />
          <span className="text-sm text-gray-700">Pick Icon</span>
        </div>

        {/* right side upload button */}
        <button
          type="button"
          onClick={triggerFileOpen}
          className="p-2 rounded-lg border border-gray-300 hover:bg-gray-100 transition"
        >
          <ImageUp className="w-5 h-5 text-purple-600" />
        </button>

        {/* hidden file input */}
        <input
          type="file"
          accept="image/*"
          ref={fileInputRef}
          onChange={handleFileUpload}
          className="hidden"
        />
      </div>

      {/* show selected file name */}
      {imageFile && (
        <p className="text-xs text-green-600 mt-1">
          Attached: {imageFile.name}
        </p>
      )}

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
