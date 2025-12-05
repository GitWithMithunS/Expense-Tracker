import BillCard from "@/components/Bills/BillCard";
import BillImageModal from "@/components/Bills/BillImageModal";
import EmptyState from "@/components/charts/EmptyState";
import Dashboard from "@/components/common/Dashboard";
import FilterBar from "@/components/Filter/FilterBarComponent";
import useUniversalFilter from "@/components/Filter/FilterLogic";
import AppContext from "@/context/AppContext";
import React, { useState, useEffect, useContext } from "react";

const Bills = () => {
  const { user } = useContext(AppContext);

  const [bills, setBills] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);

  const {
    filters,
    filteredTransactions: filtered,
    updateFilter,
    clearFilters,
    dropdown,
    toggleDropdown,
    getFilterLabel
  } = useUniversalFilter(bills, {
    enableCategory: true,
    enableDate: true,
    enableType: false,
    enableAmount: false,
    enableSorting: false,
  });

  const categories = [...new Set(bills.map((b) => b.category))];

  const formatDate = (date) =>
    new Date(date).toLocaleDateString("en-US", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });

  const billFilterButtons = [
    { id: "category", label: "CATEGORY" },
    { id: "date", label: "DATE RANGE" },
  ];

  const downloadFile = (url, filename) => {
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    link.click();
  };

  return (
    <Dashboard activeMenu="Bills">
      <h2 className="text-2xl font-semibold text-gray-800 mb-4">My Bills</h2>

      {/* REUSABLE FILTER BAR */}
      <FilterBar
        filterButtons={billFilterButtons}
        dropdown={dropdown}
        toggleDropdown={toggleDropdown}
        getFilterLabel={getFilterLabel}
        clearFilters={clearFilters}
        categories={categories}
        updateFilter={updateFilter}
      />

      {/* BILL GRID */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {!filtered.length ? (
          <div className="col-span-full text-center py-10">
            <EmptyState message="You haven't uploaded any bills." type="list" />
          </div>
        ) : (
          filtered.map((bill) => (
            <BillCard
              key={bill.id}
              bill={bill}
              onView={setSelectedImage}
              onDownload={downloadFile}
              formatDate={formatDate}
            />
          ))
        )}
      </div>

      <BillImageModal image={selectedImage} onClose={() => setSelectedImage(null)} />
    </Dashboard>
  );
};

export default Bills;



