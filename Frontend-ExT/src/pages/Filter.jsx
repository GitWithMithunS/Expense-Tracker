import React, { useState, useEffect } from "react";
import { ChevronDown, SlidersHorizontal } from "lucide-react";
import Dashboard from "../components/Dashboard";

import axiosConfig from "../util/axiosConfig"; 
import { API_ENDPOINTS } from "../util/apiEnpoints";

const Filter = () => {
  const [transactions, setTransactions] = useState([]);
  const [filteredTransactions, setFilteredTransactions] = useState([]);

  const [filters, setFilters] = useState({
    paymentMethod: "",
    startDate: "",
    endDate: "",
    sortBy: "",
    category: "",
    type: "",
  });

  const [dropdown, setDropdown] = useState(null);

  const filterButtons = [
  { id: "paymentMethod", label: "PAYMENT METHOD" },
  { id: "sortBy", label: "SORT" },
  { id: "category", label: "CATEGORY" },
  { id: "type", label: "TYPE" },            // NEW FILTER
  { id: "date", label: "DATE RANGE" },
];


  // ______________________________________
  // FETCH TRANSACTIONS (Mock if MOCK_MODE=true)
  // ______________________________________
  const fetchTransactions = async () => {
    try {
      console.log("📌 Calling mock/real API:", API_ENDPOINTS.GET_ALL_TRANSACTIONS);

      const response = await axiosConfig.get(API_ENDPOINTS.GET_ALL_TRANSACTIONS);

      console.log("📥 Fetched Transactions:", response.data);

      setTransactions(response.data);
      setFilteredTransactions(response.data);
    } catch (error) {
      console.error("❌ Error fetching transactions:", error);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  // ______________________________________
  // APPLY FILTERS
  // ______________________________________
  useEffect(() => {
    applyFilters();
  }, [filters]);

  const applyFilters = () => {
    let filtered = [...transactions];

    // Payment Method Filter
    if (filters.paymentMethod) {
      filtered = filtered.filter(
        (t) => t.paymentMethod.toLowerCase() === filters.paymentMethod.toLowerCase()
      );
    }

    // Category Filter
    if (filters.category.trim() !== "") {
      filtered = filtered.filter((t) =>
        t.categoryName.toLowerCase().includes(filters.category.toLowerCase())
      );
    }

    // Date Range
    if (filters.startDate) {
      filtered = filtered.filter((t) => t.date >= filters.startDate);
    }
    if (filters.endDate) {
      filtered = filtered.filter((t) => t.date <= filters.endDate);
    }
    // TYPE Filter
    if (filters.type) {
      filtered = filtered.filter(
        (t) => t.type.toLowerCase() === filters.type.toLowerCase()
      );
    }


    // Sorting
    if (filters.sortBy === "date-asc") {
      filtered.sort((a, b) => new Date(a.date) - new Date(b.date));
    }
    if (filters.sortBy === "date-desc") {
      filtered.sort((a, b) => new Date(b.date) - new Date(a.date));
    }
    if (filters.sortBy === "amount-asc") {
      filtered.sort((a, b) => a.amount - b.amount);
    }
    if (filters.sortBy === "amount-desc") {
      filtered.sort((a, b) => b.amount - a.amount);
    }

    setFilteredTransactions(filtered);
  };

  // ______________________________________
  // UI HELPERS
  // ______________________________________
  const toggleDropdown = (id) => {
    setDropdown(dropdown === id ? null : id);
  };

  const updateFilter = (key, value) => {
    setFilters({ ...filters, [key]: value });
    setDropdown(null);
  };

  const getFilterLabel = (id) => {
  switch (id) {
    case "paymentMethod":
      return filters.paymentMethod
        ? `PAYMENT METHOD: ${filters.paymentMethod.toUpperCase()}`
        : "PAYMENT METHOD";

    case "sortBy":
      if (!filters.sortBy) return "SORT";
      const mapSort = {
        "date-asc": "DATE ↑",
        "date-desc": "DATE ↓",
        "amount-asc": "AMOUNT ↑",
        "amount-desc": "AMOUNT ↓"
      };
      return `SORT: ${mapSort[filters.sortBy]}`;

    case "category":
      return filters.category
        ? `CATEGORY: ${filters.category}`
        : "CATEGORY";

    case "date":
      if (!filters.startDate && !filters.endDate) return "DATE RANGE";
      return `DATE: ${filters.startDate || "_"} → ${filters.endDate || "_"}`;

    case "type":
      return filters.type
        ? `TYPE: ${filters.type.toUpperCase()}`
        : "TYPE";

    default:
      return item.label;
  }
};


  // ______________________________________
  // RENDER
  // ______________________________________

  return (
    <Dashboard activeMenu="Filter">
      <div className="p-6">

        {/* FILTER BAR */}
        <div className="flex items-center gap-4 bg-white shadow rounded-xl p-4">

          {/* Filter Icon */}
          <div className="p-3 bg-gray-100 rounded-lg shadow-sm hover:shadow cursor-pointer">
            <SlidersHorizontal className="text-gray-600" />
          </div>

          {/* Filter Chips */}
          {filterButtons.map((item) => (
            <div key={item.id} className="relative">
              <button
                onClick={() => toggleDropdown(item.id)}
                className="flex items-center gap-2 px-4 py-2 bg-white border rounded-lg shadow-sm hover:shadow-md transition"
              >
                <span className="text-gray-700 text-sm font-medium">
                  {getFilterLabel(item.id)}
                </span>
                <ChevronDown size={16} />
              </button>


              {/* DROPDOWNS */}
              {dropdown === item.id && (
                <div className="absolute top-12 left-0 bg-white border shadow-lg rounded-lg p-4 w-56 z-20">

                  {/* PAYMENT METHOD */}
                  {item.id === "paymentMethod" && (
                    <>
                      {["cash", "card", "upi", "netbanking"].map((pm) => (
                        <p
                          key={pm}
                          className="cursor-pointer p-2 hover:bg-gray-100 rounded"
                          onClick={() => updateFilter("paymentMethod", pm)}
                        >
                          {pm.toUpperCase()}
                        </p>
                      ))}
                    </>
                  )}

                  {/* SORT */}
                  {item.id === "sortBy" && (
                    <>
                      <p className="dropdown-opt" onClick={() => updateFilter("sortBy", "date-asc")}>
                        Date (Old → New)
                      </p>
                      <p className="dropdown-opt" onClick={() => updateFilter("sortBy", "date-desc")}>
                        Date (New → Old)
                      </p>
                      <p className="dropdown-opt" onClick={() => updateFilter("sortBy", "amount-asc")}>
                        Amount (Low → High)
                      </p>
                      <p className="dropdown-opt" onClick={() => updateFilter("sortBy", "amount-desc")}>
                        Amount (High → Low)
                      </p>
                    </>
                  )}

                  {/* CATEGORY */}
                  {/* TYPE FILTER */}
                  {item.id === "type" && (
                    <>
                      <p
                        className="cursor-pointer p-2 hover:bg-gray-100 rounded"
                        onClick={() => updateFilter("type", "income")}
                      >
                        Income
                      </p>
                      <p
                        className="cursor-pointer p-2 hover:bg-gray-100 rounded"
                        onClick={() => updateFilter("type", "expense")}
                      >
                        Expense
                      </p>
                    </>
                  )}


                  {/* DATE RANGE */}
                  {item.id === "date" && (
                    <div>
                      <label className="text-xs text-gray-500">Start Date</label>
                      <input
                        type="date"
                        className="border w-full rounded px-3 py-2 mb-3"
                        onChange={(e) => updateFilter("startDate", e.target.value)}
                      />

                      <label className="text-xs text-gray-500">End Date</label>
                      <input
                        type="date"
                        className="border w-full rounded px-3 py-2"
                        onChange={(e) => updateFilter("endDate", e.target.value)}
                      />
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
          {/* CLEAR ALL BUTTON */}
          <button
            onClick={() =>
              setFilters({
                paymentMethod: "",
                startDate: "",
                endDate: "",
                sortBy: "",
                category: "",
                type: "",
              })
            }
            className="ml-auto px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-lg text-sm font-medium"
          >
            Clear All
          </button>
        </div>

        {/* TRANSACTION CARD GRID */}
<div className="mt-6">
  {filteredTransactions.length === 0 ? (
    <p className="text-center text-gray-500">No transactions found</p>
  ) : (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">

      {filteredTransactions.map((t) => (
        <div
          key={t.id}
          className="bg-white rounded-2xl shadow hover:shadow-lg p-5 transition border border-gray-100"
        >

          {/* TOP ROW → ICON + AMOUNT */}
          <div className="flex justify-between items-center mb-3">
            <div className="text-4xl">{t.icon}</div>

            <p
              className={`text-xl font-bold ${
                t.type === "income" ? "text-green-600" : "text-red-500"
              }`}
            >
              {t.type === "income" ? "+ " : "- "}₹{t.amount}
            </p>
          </div>

          {/* CATEGORY NAME */}
          <p className="text-lg font-semibold text-gray-800">{t.categoryName}</p>

          {/* PAYMENT METHOD TAG */}
          <span className="inline-block mt-2 px-3 py-1 text-xs bg-gray-100 text-gray-600 rounded-full">
            {t.paymentMethod.toUpperCase()}
          </span>

          {/* NOTES */}
          {t.notes && (
            <p className="text-sm text-gray-500 mt-3 italic">{t.notes}</p>
          )}

          {/* DATE BAR */}
          <div className="mt-4 bg-blue-50 text-blue-600 px-4 py-2 rounded-xl text-sm font-medium">
            {t.date}
          </div>

        </div>
      ))}

    </div>
  )}
</div>

      </div>
    </Dashboard>
  );
};

export default Filter;
