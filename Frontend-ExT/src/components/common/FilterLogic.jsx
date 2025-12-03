import { useState, useMemo } from "react";

const useUniversalFilter = (categories = []) => {
  const [filters, setFilters] = useState({
    categoryId: "",
    type: "",
    startDate: "",
    endDate: "",
    sortBy: "",
  });

  const [dropdown, setDropdown] = useState(null);

  const filterButtons = [
    { id: "category", label: "CATEGORY" },
    { id: "type", label: "TYPE" },
    { id: "date", label: "DATE RANGE" },
    { id: "sortBy", label: "SORT" },
  ];

  const toggleDropdown = (id) => {
    setDropdown(dropdown === id ? null : id);
  };

  const updateFilter = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
    setDropdown(null);
  };

  const clearFilters = () => {
    setFilters({
      categoryId: "",
      type: "",
      startDate: "",
      endDate: "",
      sortBy: "",
    });
  };

  const getFilterLabel = (id) => {
    switch (id) {
      case "category":
        if (!filters.categoryId) return "CATEGORY";
        const cat = categories.find(c => c.id === Number(filters.categoryId));
        return `CATEGORY: ${cat?.categoryName || "?"}`;

      case "type":
        return filters.type ? `TYPE: ${filters.type}` : "TYPE";

      case "date":
        return filters.startDate || filters.endDate
          ? `${filters.startDate || "_"} → ${filters.endDate || "_"}`
          : "DATE RANGE";

      case "sortBy":
        if (!filters.sortBy) return "SORT";
        return `SORT: ${filters.sortBy}`;

      default:
        return id;
    }
  };

  return {
    filters,
    dropdown,
    filterButtons,
    toggleDropdown,
    updateFilter,
    clearFilters,
    getFilterLabel,
  };
};

export default useUniversalFilter;
