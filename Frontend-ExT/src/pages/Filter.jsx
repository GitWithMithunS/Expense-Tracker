import React, { useState, useEffect } from "react";
import axios from "axios";
import { ChevronDown, SlidersHorizontal } from "lucide-react";
import Dashboard from "../components/Dashboard";
import { BASEURL, API_ENDPOINTS } from "../util/apiEnpoints";

const Filter = () => {
  const [transactions, setTransactions] = useState([]);
  const [filteredTransactions, setFilteredTransactions] = useState([]);

  const [filters, setFilters] = useState({
    paymentMethod: "",
    startDate: "",
    endDate: "",
    sortBy: "",
    category: "",
  });

  const [dropdown, setDropdown] = useState(null);

  const filterButtons = [
    { id: "paymentMethod", label: "PAYMENT METHOD" },
    { id: "sortBy", label: "SORT" },
    { id: "category", label: "CATEGORY" },
    { id: "date", label: "DATE RANGE" },
  ];

  // 🎯 Fetch transactions when page loads
  useEffect(() => {
    fetchTransactions();
  }, []);

  const fetchTransactions = async () => {
    try {
      const response = await axios.get(BASEURL + API_ENDPOINTS.GET_ALL_TRANSACTIONS);

      // Store data
      setTransactions(response.data);
      setFilteredTransactions(response.data);

      console.log("Fetched Transactions:", response.data);
    } catch (error) {
      console.error("Error fetching transactions:", error);
    }
  };

  // 🎯 Apply filters
  useEffect(() => {
    applyFilters();
  }, [filters]);

  const applyFilters = () => {
    let filtered = [...transactions];

    // Filter: Payment Method
    if (filters.paymentMethod) {
      filtered = filtered.filter(
        (t) => t.paymentMethod === filters.paymentMethod
      );
    }

    // Filter: Date Range
    if (filters.startDate) {
      filtered = filtered.filter((t) => t.date >= filters.startDate);
    }

    if (filters.endDate) {
      filtered = filtered.filter((t) => t.date <= filters.endDate);
    }

    // Filter: Category
    if (filters.category.trim() !== "") {
      filtered = filtered.filter((t) =>
        t.categoryName.toLowerCase().includes(filters.category.toLowerCase())
      );
    }

    // Sort
    if (filters.sortBy === "date-asc") {
      filtered.sort((a, b) => new Date(a.date) - new Date(b.date));
    } else if (filters.sortBy === "date-desc") {
      filtered.sort((a, b) => new Date(b.date) - new Date(a.date));
    } else if (filters.sortBy === "amount-asc") {
      filtered.sort((a, b) => a.amount - b.amount);
    } else if (filters.sortBy === "amount-desc") {
      filtered.sort((a, b) => b.amount - a.amount);
    }

    setFilteredTransactions(filtered);
  };

  const toggleDropdown = (id) => {
    setDropdown(dropdown === id ? null : id);
  };

  const updateFilter = (key, value) => {
    setFilters({ ...filters, [key]: value });
    setDropdown(null);
  };

  return (
    <Dashboard activeMenu="Filter">
      <div className="p-6">

        {/* Filter Bar */}
        <div className="flex items-center gap-4 bg-white shadow rounded-xl p-4">

          {/* Filter Icon */}
          <div className="p-3 bg-gray-100 rounded-lg shadow-sm hover:shadow cursor-pointer">
            <SlidersHorizontal className="text-gray-600" />
          </div>

          {filterButtons.map((item) => (
            <div key={item.id} className="relative">
              <button
                className="flex items-center gap-2 px-4 py-2 bg-white border rounded-lg shadow-sm hover:shadow-md transition"
                onClick={() => toggleDropdown(item.id)}
              >
                <span className="text-gray-700 text-sm font-medium">
                  {item.label}
                </span>
                <ChevronDown size={16} />
              </button>

              {dropdown === item.id && (
                <div className="absolute top-12 left-0 bg-white shadow-lg rounded-lg p-4 w-56 z-10 border">
                  {/* PAYMENT METHOD */}
                  {item.id === "paymentMethod" && (
                    <>
                      <p className="cursor-pointer p-2 hover:bg-gray-100 rounded"
                         onClick={() => updateFilter("paymentMethod", "cash")}>Cash</p>
                      <p className="cursor-pointer p-2 hover:bg-gray-100 rounded"
                         onClick={() => updateFilter("paymentMethod", "card")}>Card</p>
                      <p className="cursor-pointer p-2 hover:bg-gray-100 rounded"
                         onClick={() => updateFilter("paymentMethod", "UPI")}>UPI</p>
                      <p className="cursor-pointer p-2 hover:bg-gray-100 rounded"
                         onClick={() => updateFilter("paymentMethod", "netbanking")}>Net Banking</p>
                    </>
                  )}

                  {/* SORT */}
                  {item.id === "sortBy" && (
                    <>
                      <p onClick={() => updateFilter("sortBy", "date-asc")}
                         className="cursor-pointer p-2 hover:bg-gray-100 rounded">Date (Old → New)</p>
                      <p onClick={() => updateFilter("sortBy", "date-desc")}
                         className="cursor-pointer p-2 hover:bg-gray-100 rounded">Date (New → Old)</p>
                      <p onClick={() => updateFilter("sortBy", "amount-asc")}
                         className="cursor-pointer p-2 hover:bg-gray-100 rounded">Amount (Low → High)</p>
                      <p onClick={() => updateFilter("sortBy", "amount-desc")}
                         className="cursor-pointer p-2 hover:bg-gray-100 rounded">Amount (High → Low)</p>
                    </>
                  )}

                  {/* CATEGORY */}
                  {item.id === "category" && (
                    <input
                      type="text"
                      placeholder="Search category..."
                      className="border w-full rounded px-3 py-2"
                      onChange={(e) => updateFilter("category", e.target.value)}
                    />
                  )}

                  {/* DATE RANGE */}
                  {item.id === "date" && (
                    <div>
                      <label className="text-sm text-gray-500">Start Date</label>
                      <input type="date"
                             className="border w-full rounded px-3 py-2 mb-3"
                             onChange={(e) => updateFilter("startDate", e.target.value)} />

                      <label className="text-sm text-gray-500">End Date</label>
                      <input type="date"
                             className="border w-full rounded px-3 py-2"
                             onChange={(e) => updateFilter("endDate", e.target.value)} />
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Show results */}
        <div className="mt-6 bg-white p-4 rounded-lg shadow">
          <h3 className="font-medium mb-2">Filtered Results ({filteredTransactions.length})</h3>

          <pre className="text-sm text-gray-700 bg-gray-100 p-3 rounded">
            {JSON.stringify(filteredTransactions, null, 2)}
          </pre>
        </div>

      </div>
    </Dashboard>
  );
};

export default Filter;
