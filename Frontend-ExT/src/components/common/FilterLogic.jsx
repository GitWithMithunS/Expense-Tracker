import { useState, useEffect, useMemo } from "react";

const useUniversalFilter = (data = []) => {
  const [filters, setFilters] = useState({
    paymentMethod: "",
    startDate: "",
    endDate: "",
    sortBy: "",
    category: "",
    type: "",
  });

  const [dropdown, setDropdown] = useState(null);

  // Buttons for UI
  const filterButtons = [
    { id: "paymentMethod", label: "PAYMENT METHOD" },
    { id: "sortBy", label: "SORT" },
    { id: "category", label: "CATEGORY" },
    { id: "type", label: "TYPE" },
    { id: "date", label: "DATE RANGE" },
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
      paymentMethod: "",
      startDate: "",
      endDate: "",
      sortBy: "",
      category: "",
      type: "",
    });
  };

  // Apply filtering whenever filters OR data change
  const filteredTransactions = useMemo(() => {
    if (!Array.isArray(data)) return [];

    let filtered = [...data];

    if (filters.paymentMethod)
      filtered = filtered.filter(
        (t) => t.paymentMethod.toLowerCase() === filters.paymentMethod.toLowerCase()
      );

    if (filters.category)
      filtered = filtered.filter((t) =>
        t.categoryName.toLowerCase().includes(filters.category.toLowerCase())
      );

    if (filters.type)
      filtered = filtered.filter((t) => t.type === filters.type);

    if (filters.startDate)
      filtered = filtered.filter((t) => t.date >= filters.startDate);

    if (filters.endDate)
      filtered = filtered.filter((t) => t.date <= filters.endDate);

    if (filters.sortBy === "date-asc")
      filtered.sort((a, b) => new Date(a.date) - new Date(b.date));

    if (filters.sortBy === "date-desc")
      filtered.sort((a, b) => new Date(b.date) - new Date(a.date));

    if (filters.sortBy === "amount-asc")
      filtered.sort((a, b) => a.amount - b.amount);

    if (filters.sortBy === "amount-desc")
      filtered.sort((a, b) => b.amount - a.amount);

    return filtered;
  }, [data, filters]);

  const getFilterLabel = (id) => {
    switch (id) {
      case "paymentMethod":
        return filters.paymentMethod
          ? `PAYMENT: ${filters.paymentMethod.toUpperCase()}`
          : "PAYMENT METHOD";

      case "sortBy":
        if (!filters.sortBy) return "SORT";
        const mapSort = {
          "date-asc": "DATE ↑",
          "date-desc": "DATE ↓",
          "amount-asc": "AMOUNT ↑",
          "amount-desc": "AMOUNT ↓",
        };
        return `SORT: ${mapSort[filters.sortBy]}`;

      case "category":
        return filters.category ? `CATEGORY: ${filters.category}` : "CATEGORY";

      case "type":
        return filters.type ? `TYPE: ${filters.type}` : "TYPE";

      case "date":
        if (!filters.startDate && !filters.endDate) return "DATE RANGE";
        return `${filters.startDate || "_"} → ${filters.endDate || "_"}`;

      default:
        return id;
    }
  };

  return {
    filters,
    dropdown,
    filteredTransactions,
    filterButtons,
    toggleDropdown,
    updateFilter,
    clearFilters,
    getFilterLabel,
  };
};

export default useUniversalFilter;
