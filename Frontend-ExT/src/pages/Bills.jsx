import React, { useEffect, useState, useContext } from "react";
import Dashboard from "../components/common/Dashboard";
import AppContext from "../context/AppContext";

import EmptyState from "@/components/charts/EmptyState";
import useUniversalFilter from "../components/common/FilterLogic";

import axiosConfig from "@/util/axiosConfig";
import { API_ENDPOINTS } from "@/util/apiEnpoints";

const Bills = () => {
  const { user } = useContext(AppContext);

  const [bills, setBills] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);

  
function formatUrl(url) {
    // Replace 's3://' with 'https://'
    let formattedUrl = url.replace(/^s3:\/\//, 'https://');

    // Replace spaces with '+'
    formattedUrl = formattedUrl.replace(/\s+/g, '+');

    return formattedUrl;
}


  // Filter system
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

  // --------------------------
  // FETCH BILLS (CORRECT VERSION)
  // --------------------------
  useEffect(() => {
    if (!user) return;

    const fetchBills = async () => {
      try {
        const res = await axiosConfig.get(API_ENDPOINTS.LIST_BILLS);

        console.log("Raw bills from API:", res.data);

        const formatted = res.data.map((bill) => ({
          id: bill.id,
          description: bill.description,
          date: bill.date,
          category: bill.categoryName || "Misc", // adjust based on backend model
          fileUrl: `${API_ENDPOINTS.DOWNLOAD_BILL(bill.id)}`,
        }));

        console.log("Formatted bills:", formatted);

        setBills(formatted);
      } catch (error) {
        console.error("Failed to load bills:", error);
      }
    };

    fetchBills();
  }, [user]);

  // Category list for dropdown
  const categories = [...new Set(bills.map((b) => b.category))];

  // Convert stored YYYY-MM-DD to readable
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

        <button className="px-4 py-2 bg-purple-600 text-white rounded-lg text-sm">
          Apply Filter
        </button>

        <button
          onClick={clearFilters}
          className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg text-sm"
        >
          Clear
        </button>
      </div>

      {/* BILL GRID */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {!bills || bills.length === 0 ? (
          <div className="col-span-full text-center py-10">
            <EmptyState message="You haven't uploaded any bills yet." type="list" />
          </div>
        ) : (
          bills.map((bill) => (
            <div
              key={bill.id}
              className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden"
            >
              <div
                onClick={() => setSelectedImage(formatUrl(bill.fileUrl))}
                className="cursor-pointer"
              >
                <img
                  src={formatUrl(bill.fileUrl)}
                  onError={(e) => {
                    e.target.src =
                      "https://via.placeholder.com/300x200?text=Image+Not+Available";
                  }}
                  alt="Bill"
                  className="w-full h-48 object-cover"
                />
              </div>

              <div className="p-3 text-sm text-gray-700">
                <p><strong>Description:</strong> {bill.description}</p>
                <p className="mt-1"><strong>Date:</strong> {formatDate(bill.date)}</p>
                <p className="mt-1"><strong>Category:</strong> {bill.category}</p>

                <button
                  onClick={() => window.open(bill.fileUrl, "_blank")}
                  className="mt-3 w-full bg-purple-600 text-white py-1.5 rounded-lg text-sm"
                >
                  Download
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* IMAGE PREVIEW MODAL */}
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
