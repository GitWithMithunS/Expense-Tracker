import { useState } from "react";


export const SubscriptionForm = ({ selectedMonth, onSave, onClose }) => {
  const [name, setName] = useState("");
  const [amount, setAmount] = useState("");
  const [renewalType, setRenewalType] = useState("monthly");
  const [startMonth, setStartMonth] = useState(selectedMonth);
  const [endMonth, setEndMonth] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    const subscription = {
      name,
      amount: Number(amount),
      renewalType,
      startMonth,
      endMonth: endMonth === "" ? null : endMonth
    };

    onSave(subscription);
    onClose();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">

  <h2 className="text-xl font-semibold text-gray-800">Subscription</h2>

  {/* Subscription Name */}
  <div className="flex flex-col gap-1">
    <label className="text-sm font-medium text-gray-700">Subscription Name</label>
    <input
      type="text"
      placeholder="Netflix, Amazon Prime, etc."
      className="w-full p-3 border rounded-lg shadow-sm focus:ring-2 focus:ring-purple-500 outline-none"
      value={name}
      onChange={(e) => setName(e.target.value)}
    />
  </div>

  {/* Amount */}
  <div className="flex flex-col gap-1">
    <label className="text-sm font-medium text-gray-700">Amount</label>
    <input
      type="number"
      className="w-full p-3 border rounded-lg shadow-sm focus:ring-2 focus:ring-purple-500 outline-none"
      value={amount}
      onChange={(e) => setAmount(e.target.value)}
    />
  </div>

  {/* Renewal Type */}
  <div className="flex flex-col gap-1">
    <label className="text-sm font-medium text-gray-700">Renewal Type</label>
    <select
      className="w-full p-3 border rounded-lg shadow-sm focus:ring-2 focus:ring-purple-500 outline-none"
      value={renewalType}
      onChange={(e) => setRenewalType(e.target.value)}
    >
      <option value="monthly">Monthly</option>
      <option value="weekly">Weekly</option>
      <option value="yearly">Yearly</option>
    </select>
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

  {/* End Month */}
  <div className="flex flex-col gap-1">
    <label className="text-sm font-medium text-gray-700">
      End Month (Optional)
    </label>
    <input
      type="month"
      className="w-full p-3 border rounded-lg shadow-sm focus:ring-2 focus:ring-purple-500 outline-none"
      value={endMonth}
      onChange={(e) => setEndMonth(e.target.value)}
    />
    <p className="text-xs text-gray-500">Leave empty for auto-renew</p>
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
      Save Subscription
    </button>
  </div>

</form>
  );
};