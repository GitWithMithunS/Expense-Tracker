import React, { useState, useRef } from "react";
import {
  XMarkIcon,
  PlusIcon,
  TrashIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  CalculatorIcon,
} from "@heroicons/react/24/outline";

const BudgetManager = ({ onClose }) => {
  // ---------------- MONTH SELECTOR ----------------
  const monthNames = [
    "January","February","March","April","May","June",
    "July","August","September","October","November","December",
  ];

  const today = new Date();
  const [month, setMonth] = useState(today.getMonth());
  const [year, setYear] = useState(today.getFullYear());

  const nextMonth = () => {
    if (month === 11) { setMonth(0); setYear(year + 1); }
    else setMonth(month + 1);
  };

  const prevMonth = () => {
    if (month === 0) { setMonth(11); setYear(year - 1); }
    else setMonth(month - 1);
  };

  // ---------------- STATE ----------------
  const [totalBudget, setTotalBudget] = useState("");
  const [showNewCategory, setShowNewCategory] = useState(false);
  const [newCategoryInput, setNewCategoryInput] = useState("");

  const [categories, setCategories] = useState([
    "Food","Travel","Shopping","Bills","Entertainment"
  ]);

  const [categoryAllocations, setCategoryAllocations] = useState([
    { category: "Food", amount: "" }
  ]);

  const [errors, setErrors] = useState("");

  // ---------------- DRAGGABLE CALCULATOR ----------------
  const [showCalculator, setShowCalculator] = useState(false);
  const [calcValue, setCalcValue] = useState("");

  const calcRef = useRef(null);
  let offset = { x: 0, y: 0 };

  const handleDragStart = (e) => {
    offset = {
      x: e.clientX - calcRef.current.getBoundingClientRect().left,
      y: e.clientY - calcRef.current.getBoundingClientRect().top,
    };

    document.addEventListener("mousemove", handleDragging);
    document.addEventListener("mouseup", handleDragStop);
  };

  const handleDragging = (e) => {
    calcRef.current.style.left = `${e.clientX - offset.x}px`;
    calcRef.current.style.top = `${e.clientY - offset.y}px`;
  };

  const handleDragStop = () => {
    document.removeEventListener("mousemove", handleDragging);
  };

  // Calculator functions
  const handleCalcInput = (val) => setCalcValue(calcValue + val);
  const calculate = () => {
    try {
      setCalcValue(String(eval(calcValue || "0")));
    } catch {
      setCalcValue("Error");
    }
  };
  const clearCalc = () => setCalcValue("");
  const backspace = () => setCalcValue(calcValue.slice(0, -1));

  const applyCalcValue = () => {
    const updated = [...categoryAllocations];
    const idx = updated.length - 1;
    updated[idx].amount = calcValue;
    setCategoryAllocations(updated);
    setShowCalculator(false);
  };

  // ---------------- CATEGORY LOGIC ----------------
  const addCategoryRow = () => {
    setCategoryAllocations([...categoryAllocations, { category: "", amount: "" }]);
  };

  const updateAllocation = (index, field, value) => {
    const updated = [...categoryAllocations];
    updated[index][field] = value;
    setCategoryAllocations(updated);
  };

  const deleteRow = (index) => {
    const updated = [...categoryAllocations];
    updated.splice(index, 1);
    setCategoryAllocations(updated);
  };

  const confirmAddCategory = () => {
    if (!newCategoryInput.trim()) return setErrors("⚠ Category cannot be empty.");
    if (categories.includes(newCategoryInput))
      return setErrors("⚠ Category already exists.");

    setCategories([...categories, newCategoryInput]);
    setNewCategoryInput("");
    setShowNewCategory(false);
    setErrors("");
  };

  // ---------------- VALIDATIONS ----------------
  const validate = () => {
    let allocatedSum = categoryAllocations.reduce((sum, row) => {
      return sum + Number(row.amount || 0);
    }, 0);

    if (!totalBudget || totalBudget <= 0)
      return "⚠ Total budget must be greater than 0.";

    if (allocatedSum > Number(totalBudget))
      return "⚠ Total allocated amount exceeds total budget.";

    for (let row of categoryAllocations) {
      if (!row.category) return "⚠ Every row must have a category.";
      if (row.amount === "" || Number(row.amount) <= 0)
        return "⚠ Amount must be a positive number.";
    }

    return "";
  };

  // ---------------- SAVE ----------------
  const handleSaveBudget = () => {
    const errorMsg = validate();
    if (errorMsg) return setErrors(errorMsg);

    setErrors("");

    const data = {
      month: monthNames[month],
      year,
      totalBudget,
      allocations: categoryAllocations,
      allCategories: categories,
    };

    console.log("📊 FINAL BUDGET SETUP:", data);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50 px-4">
      <div className="bg-white w-full max-w-3xl rounded-xl shadow-xl p-8 relative">

        {/* CLOSE */}
        <button onClick={onClose} className="absolute right-4 top-4 text-gray-500 hover:text-red-500">
          <XMarkIcon className="h-6 w-6" />
        </button>

        {/* MONTH SELECTOR */}
        <div className="flex justify-center items-center gap-6 mb-8">
          <button onClick={prevMonth}>
            <ChevronLeftIcon className="h-8 w-8 text-gray-700 hover:text-indigo-600" />
          </button>

          <h2 className="text-2xl font-semibold text-indigo-700">
            &lt; {monthNames[month]} {year} &gt;
          </h2>

          <button onClick={nextMonth}>
            <ChevronRightIcon className="h-8 w-8 text-gray-700 hover:text-indigo-600" />
          </button>
        </div>

        {/* TOTAL BUDGET + CALCULATOR ICON */}
        <div className="mb-8 flex justify-between items-center">
          <div className="w-full">
            <label className="font-medium text-gray-700">Total Monthly Budget (₹)</label>
            <input
              type="number"
              value={totalBudget}
              onChange={(e) => setTotalBudget(e.target.value)}
              placeholder="Enter total income/budget"
              className="mt-2 w-full border border-gray-300 rounded-lg p-3 focus:ring focus:ring-indigo-200"
            />
          </div>

          {/* Calculator Icon */}
          <button
            onClick={() => setShowCalculator(!showCalculator)}
            className="ml-4 mt-8 text-gray-700 hover:text-orange-600"
          >
            <CalculatorIcon className="h-8 w-8" />
          </button>
        </div>

        {/* ERROR MESSAGE */}
        {errors && (
          <div className="text-red-600 font-semibold mb-4">{errors}</div>
        )}

        {/* CATEGORY ALLOCATION */}
        <h3 className="text-lg font-semibold mb-3 text-gray-700">Allocate by Categories</h3>

        {categoryAllocations.map((row, index) => (
          <div key={index} className="flex items-center gap-3 mb-3">
            {/* Category Select */}
            <select
              value={row.category}
              onChange={(e) => updateAllocation(index, "category", e.target.value)}
              className="w-1/2 border border-gray-300 rounded-lg p-2"
            >
              <option value="">Select category</option>
              {categories.map((cat, i) => (
                <option key={i} value={cat}>{cat}</option>
              ))}
            </select>

            {/* Amount */}
            <input
              type="number"
              value={row.amount}
              placeholder="Amount"
              onChange={(e) => updateAllocation(index, "amount", e.target.value)}
              className="w-1/3 border border-gray-300 rounded-lg p-2"
            />

            {/* Delete */}
            <button onClick={() => deleteRow(index)} className="text-red-600">
              <TrashIcon className="h-6 w-6" />
            </button>
          </div>
        ))}

        {/* ADD CATEGORY ROW + CREATE */}
        <div className="flex items-center gap-6 mt-4">
          <button onClick={addCategoryRow} className="flex items-center gap-2 text-indigo-600 hover:underline">
            <PlusIcon className="h-5 w-5" /> Add another category
          </button>

          <button onClick={() => setShowNewCategory(true)} className="flex items-center gap-2 text-green-600 hover:underline">
            <PlusIcon className="h-5 w-5" /> Create new category
          </button>
        </div>

        {/* NEW CATEGORY INPUT */}
        {showNewCategory && (
          <div className="mt-4 flex gap-3">
            <input
              type="text"
              value={newCategoryInput}
              onChange={(e) => setNewCategoryInput(e.target.value)}
              placeholder="Enter new category"
              className="w-full border border-gray-300 rounded-lg p-3"
            />
            <button
              onClick={confirmAddCategory}
              className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700"
            >
              Add
            </button>
          </div>
        )}

        {/* SAVE BUTTON */}
        <button
          onClick={handleSaveBudget}
          className="w-full mt-8 bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700"
        >
          Save Monthly Budget
        </button>
      </div>

      {/* ---------------- DRAGGABLE CALCULATOR ---------------- */}
      {showCalculator && (
        <div
          ref={calcRef}
          onMouseDown={handleDragStart}
          className="absolute top-20 right-10 bg-white w-56 shadow-xl rounded-lg p-4 cursor-move z-[999]"
        >
          <input
            value={calcValue}
            readOnly
            className="w-full border border-gray-300 rounded-lg p-2 mb-3 text-right"
          />

          <div className="grid grid-cols-4 gap-2">
            {[7, 8, 9, "/",
              4, 5, 6, "*",
              1, 2, 3, "-",
              0, ".", "=", "+"].map((item, i) => (
              <button
                key={i}
                onClick={() => (item === "=" ? calculate() : handleCalcInput(String(item)))}
                className="bg-gray-50 p-2 rounded-lg shadow-sm hover:bg-gray-200 text-lg"
              >
                {item}
              </button>
            ))}
          </div>

          <div className="flex justify-between mt-3">
            <button onClick={clearCalc} className="px-3 py-1 bg-red-500 text-white rounded-lg">
              Clear
            </button>
            <button onClick={backspace} className="px-3 py-1 bg-gray-400 text-white rounded-lg">
              ⌫
            </button>
            <button onClick={applyCalcValue} className="px-3 py-1 bg-green-600 text-white rounded-lg">
              Apply
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default BudgetManager;
