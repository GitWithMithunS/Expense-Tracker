import BillCard from "@/components/Bills/BillCard";
import BillImageModal from "@/components/Bills/BillImageModal";
import EmptyState from "@/components/charts/EmptyState";
import Dashboard from "@/components/common/Dashboard";
import FilterBar from "@/components/Filter/FilterBarComponent";
import useUniversalFilter from "@/components/Filter/FilterLogic";
import AppContext from "@/context/AppContext";
import React, { useState, useEffect, useContext } from "react";

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

  return (
    <Dashboard activeMenu="Bills">
      {/* REUSABLE FILTER BAR */}
      <div className="p-4 sm:p-6">
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
            <EmptyState message="You haven't uploaded any bills yet." type="list" />
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
        </div>
    </Dashboard>
    
  );
};

export default Bills;



