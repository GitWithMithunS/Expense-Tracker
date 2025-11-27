import React, { useState, useContext } from "react";
import GlassModal from "./ui/GlassModal";
import FloatingInput from "./ui/FloatingInput";
import { TransactionContext } from "../context/TransactionContext";

const AddIncomeModal = ({ onClose }) => {
  const { dispatch } = useContext(TransactionContext);

  const [form, setForm] = useState({
    amount: "",
    source: "",
    paymentMethod: "Cash",
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
    if (!form.date) {
      alert("Please select a date");
      return;
    }

    const incomePayload = {
      id: Date.now(),
      type: "income",
      amount: Number(form.amount),
      source: form.source,
      paymentMethod: form.paymentMethod,
      date: form.date,
    };

    // 🔥 Dispatch ONLY when submit is pressed
    dispatch({
      type: "ADD_INCOME",
      payload: incomePayload,
    });

    console.log("Saving Income →", incomePayload);

    // CLOSE modal
    onClose();
  };

  return (
    <GlassModal onClose={onClose}>

      <h2 className="text-2xl text-white font-semibold mb-6 text-center">
        + Add Income
      </h2>

      <form onSubmit={handleSubmit} className="space-y-5">

        <FloatingInput
          label="Amount (₹)"
          type="number"
          required
          onChange={(v) => update("amount", v)}
        />

        <FloatingInput
          label="Source"
          onChange={(v) => update("source", v)}
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

        <button
          type="submit"
          className="w-full py-3 bg-emerald-500 rounded-xl text-white font-semibold
                     hover:bg-emerald-600 transition-all shadow-lg"
        >
          Save Income
        </button>

      </form>

    </GlassModal>
  );
};

export default AddIncomeModal;
