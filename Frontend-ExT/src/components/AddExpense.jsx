//not being used
import React, { useState, useContext } from "react";
import GlassModal from "./ui/GlassModal";
import FloatingInput from "./ui/FloatingInput";
import { TransactionContext } from "../context/TransactionContext";

const AddExpenseModal = ({ onClose }) => {
  const { dispatch } = useContext(TransactionContext);

  const [form, setForm] = useState({
    amount: "",
    category: "",
    paymentMethod: "Cash",
    description: "",
    date: "",
  });

  const update = (field, value) =>
    setForm((prev) => ({ ...prev, [field]: value }));

  const handleSubmit = (e) => {
    e.preventDefault();

    // VALIDATION
    if (!form.amount || Number(form.amount) <= 0) {
      alert("Amount must be greater than 0");
      return;
    }
    if (!form.category.trim()) {
      alert("Category is required");
      return;
    }
    if (!form.date) {
      alert("Please select a date");
      return;
    }

    const expensePayload = {
      id: Date.now(),
      type: "expense",
      amount: Number(form.amount),
      category: form.category,
      paymentMethod: form.paymentMethod,
      description: form.description,
      date: form.date,
    };

    // 🔥 ADD TO GLOBAL STATE
    dispatch({
      type: "ADD_EXPENSE",
      payload: expensePayload,
    });

    console.log("Saving Expense →", expensePayload);

    // RESET & CLOSE
    onClose();
  };

  return (
    <GlassModal onClose={onClose}>
      <h2 className="text-2xl text-white font-semibold mb-6 text-center">
        − Add Expense
      </h2>

      <form onSubmit={handleSubmit} className="space-y-5">

        <FloatingInput
          label="Amount (₹)"
          type="number"
          required
          onChange={(v) => update("amount", v)}
        />

        <FloatingInput
          label="Category"
          required
          onChange={(v) => update("category", v)}
        />

        {/* Payment Method */}
        <div className="text-white">
          <label className="block mb-1 opacity-80">Payment Method</label>
          <select
            className="w-full p-3 rounded-lg bg-white/10 text-white border border-white/40"
            value={form.paymentMethod}
            onChange={(e) => update("paymentMethod", e.target.value)}
          >
            <option className="text-black">Cash</option>
            <option className="text-black">UPI</option>
            <option className="text-black">Card</option>
            <option className="text-black">Bank Transfer</option>
          </select>
        </div>

        <FloatingInput
          label="Description (optional)"
          onChange={(v) => update("description", v)}
        />

        {/* Date */}
        <div className="text-white">
          <label className="block mb-1 opacity-80">Date</label>
          <input
            type="date"
            className="w-full p-3 rounded-lg bg-white/10 text-white border border-white/40"
            required
            onChange={(e) => update("date", e.target.value)}
          />
        </div>

        {/* Save button */}
        <button
          className="w-full py-3 bg-pink-500 rounded-xl text-white font-semibold
                     hover:bg-pink-600 transition-all shadow-lg"
          type="submit"
        >
          Save Expense
        </button>

      </form>
    </GlassModal>
  );
};

export default AddExpenseModal;
