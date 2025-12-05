import { useState, useMemo } from "react";

const useUniversalFilter = (data = [], config = {}) => {
  const {
    enableType = true,
    enableCategory = true,
    enableDate = true,
    enableAmount = true,
    enableSorting = true,
  } = config;

  // -------------------------------------------
  // FILTER STATE
  // -------------------------------------------
  const [filters, setFilters] = useState({
    category: "",
    type: "",
    startDate: "",
    endDate: "",
    minAmount: "",
    maxAmount: "",
    sortBy: "",
  });

  // -------------------------------------------
  // DROPDOWN STATE FOR FILTER BAR
  // -------------------------------------------
  const [dropdown, setDropdown] = useState(null);

  const toggleDropdown = (id) => {
    setDropdown((prev) => (prev === id ? null : id));
  };

  // -------------------------------------------
  // UPDATE FILTER VALUE
  // -------------------------------------------
  const updateFilter = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
    setDropdown(null);
  };

  // -------------------------------------------
  // CLEAR ALL FILTERS
  // -------------------------------------------
  const clearFilters = () => {
    setFilters({
      category: "",
      type: "",
      startDate: "",
      endDate: "",
      minAmount: "",
      maxAmount: "",
      sortBy: "",
    });
    setDropdown(null);
  };

  // -------------------------------------------
  // AUTO-GENERATED FILTER BUTTONS BASED ON CONFIG
  // -------------------------------------------
  const filterButtons = [];

  if (enableCategory) filterButtons.push({ id: "category", label: "CATEGORY" });
  if (enableType) filterButtons.push({ id: "type", label: "TYPE" });
  if (enableDate) filterButtons.push({ id: "date", label: "DATE RANGE" });
  if (enableAmount) filterButtons.push({ id: "amount", label: "AMOUNT" });
  if (enableSorting) filterButtons.push({ id: "sortBy", label: "SORT" });

  // -------------------------------------------
  // LABELS FOR FILTER BUTTONS (USED IN FilterBar)
  // -------------------------------------------
  const getFilterLabel = (id) => {
    switch (id) {
      case "category":
        return filters.category ? `Category: ${filters.category}` : "CATEGORY";

      case "type":
        return filters.type ? `Type: ${filters.type}` : "TYPE";

      case "date":
        if (!filters.startDate && !filters.endDate) return "DATE RANGE";
        return `${filters.startDate || "..."} -> ${filters.endDate || "..."}`;

      case "amount":
        if (!filters.minAmount && !filters.maxAmount) return "AMOUNT";
        return `${filters.minAmount || 0} - ${filters.maxAmount || "∞"}`;

      case "sortBy":
        return filters.sortBy ? `Sort: ${filters.sortBy}` : "SORT";

      default:
        return id;
    }
  };

  // -------------------------------------------
  // APPLY FILTERING LOGIC (DYNAMICALLY)
  // -------------------------------------------
  const filteredTransactions = useMemo(() => {
    return data.filter((item) => {
      // CATEGORY
      if (enableCategory && filters.category && item.category !== filters.category)
        return false;

      // TYPE
      if (enableType && filters.type && item.type !== filters.type)
        return false;

      // DATE RANGE
      if (enableDate) {
        const itemDate = new Date(item.date);

        if (filters.startDate && itemDate < new Date(filters.startDate))
          return false;

        if (filters.endDate && itemDate > new Date(filters.endDate))
          return false;
      }

      // AMOUNT RANGE
      if (enableAmount) {
        if (filters.minAmount && Number(item.amount) < Number(filters.minAmount))
          return false;

        if (filters.maxAmount && Number(item.amount) > Number(filters.maxAmount))
          return false;
      }

      return true;
    });
  }, [data, filters]);

  return {
    filters,
    dropdown,
    filterButtons,
    filteredTransactions,
    toggleDropdown,
    updateFilter,
    clearFilters,
    getFilterLabel,
  };
};

export default useUniversalFilter;
