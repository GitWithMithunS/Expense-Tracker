import React, { useEffect, useState, useContext } from "react";
import Dashboard from "../components/common/Dashboard";
import AppContext from "../context/AppContext";

import bill1 from "../assets/bill1.png";
import bill2 from "../assets/bill2.jpeg";
import bill3 from "../assets/bill3.jpeg";
import bill4 from "../assets/bill4.jpeg";

import EmptyState from "@/components/charts/EmptyState";
import useUniversalFilter from "../components/common/FilterLogic";

const Bills = () => {
  const { user } = useContext(AppContext);

  const [bills, setBills] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);

  // Initialize reusable filter hook
  const {
  filters,
  filteredTransactions: filtered,
  updateFilter,
  clearFilters,
} = useUniversalFilter(bills, {
  enablePayment: false,
  enableType: false,
  enableSorting: false,
  enableCategory: true,
  enableDate: true,
});


  // Load mock data or API data
  useEffect(() => {
    const mockData = [
      {
        id: 1,
        fileUrl: bill1,
        description: "Electricity bill",
        date: "2025-03-05",
        category: "Electricity",
      },
      {
        id: 2,
        fileUrl: bill2,
        description: "Broadband invoice",
        date: "2025-02-07",
        category: "WiFi",
      },
      {
        id: 3,
        fileUrl: bill3,
        description: "Netflix subscription",
        date: "2025-04-01",
        category: "OTT",
      },
      {
        id: 4,
        fileUrl: bill4,
        description: "Maintenance bill",
        date: "2025-01-15",
        category: "Maintenance",
      },
    ];

    setBills(mockData);
  }, [user]);

  // Get category dropdown options
  const categories = [...new Set(bills.map((b) => b.category))];

  const formatDate = (date) => {
    try {
      return new Date(date).toLocaleDateString("en-US", {
        day: "numeric",
        month: "short",
        year: "numeric",
      });
    } catch {
      return date;
    }
  };

  const downloadFile = (url, filename) => {
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    link.click();
  };

  return (
    <Dashboard activeMenu="Bills">
      <h2 className="text-2xl font-semibold text-gray-800 mb-4">My Bills</h2>

      {/* FILTER BAR */}
      <div className="mb-6 flex flex-wrap gap-4 items-center">

        {/* Start Date */}
        <input
          type="date"
          value={filters.startDate}
          onChange={(e) => updateFilter("startDate", e.target.value)}
          className="px-3 py-2 border rounded-lg text-sm bg-white"
        />

        {/* End Date */}
        <input
          type="date"
          value={filters.endDate}
          onChange={(e) => updateFilter("endDate", e.target.value)}
          className="px-3 py-2 border rounded-lg text-sm bg-white"
        />

        {/* Category */}
        <select
          value={filters.category}
          onChange={(e) => updateFilter("category", e.target.value)}
          className="px-3 py-2 border rounded-lg text-sm bg-white"
        >
          <option value="">All</option>
          {categories.map((cat) => (
            <option key={cat}>{cat}</option>
          ))}
        </select>

        {/* Apply Filters */}
        <button
          onClick={() => {}}
          className="px-4 py-2 bg-purple-600 text-white rounded-lg text-sm hover:bg-purple-500 cursor-pointer"
        >
          Apply Filter
        </button>

        {/* Clear Filters */}
        <button
          onClick={clearFilters}
          className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg text-sm hover:bg-gray-300 cursor-pointer"
        >
          Clear
        </button>
      </div>

      {/* BILL GRID */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {filtered.length === 0 ? (
          <div className="col-span-full text-center py-10">
            <EmptyState message="You haven't uploaded any bills." type="list" />
          </div>
        ) : (
          filtered.map((bill) => (
            <div
              key={bill.id}
              className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden transition"
            >
              <div
                onClick={() => setSelectedImage(bill.fileUrl)}
                className="cursor-pointer"
              >
                <img
                  src={bill.fileUrl}
                  alt="Bill"
                  className="w-full h-48 object-cover"
                />
              </div>

              <div className="p-3 text-sm text-gray-700">
                <p><strong>Description:</strong> {bill.description}</p>
                <p className="mt-1"><strong>Date:</strong> {formatDate(bill.date)}</p>
                <p className="mt-1"><strong>Category:</strong> {bill.category}</p>

                <button
                  onClick={() => downloadFile(bill.fileUrl, `${bill.description}.jpg`)}
                  className="mt-3 w-full bg-purple-600 text-white py-1.5 rounded-lg text-sm hover:bg-purple-500"
                >
                  Download
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* IMAGE POPUP */}
      {selectedImage && (
        <div
          className="fixed inset-0 bg-black/85 z-50 flex items-center justify-center"
          onClick={(e) => e.target === e.currentTarget && setSelectedImage(null)}
        >
          <button
            onClick={() => setSelectedImage(null)}
            className="absolute top-4 right-4 bg-white/20 text-white rounded-full w-10 h-10 flex items-center justify-center"
          >
            ✕
          </button>

          <img
            src={selectedImage}
            className="max-w-[95vw] max-h-[90vh] object-contain"
            alt=""
          />
        </div>
      )}
    </Dashboard>
  );
};

export default Bills;
