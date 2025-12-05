import React, { useState, useEffect, useContext } from "react";
import Dashboard from "../components/common/Dashboard";
import { TransactionContext } from "@/context/TransactionContext";


import axiosConfig from "../util/axiosConfig";
import { API_ENDPOINTS } from "../util/apiEnpoints";
import FilterBar from "@/components/Filter/FilterBarComponent";
import ResultsList from "@/components/Filter/ResultsList";
import useUniversalFilter from "@/components/Filter/FilterLogic";

const Filter = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(false);

  const { state } = useContext(TransactionContext);
  const categories = state.categories || [];
      // console.log( 'from FIlter page ....transaction->' ,  transactions)


  const {
    filters,
    dropdown,
    filterButtons,
    toggleDropdown,
    updateFilter,
    clearFilters,
    getFilterLabel,
  } = useUniversalFilter();

  const buildQuery = () => {
    const params = {};

    if (filters.type) params.type = filters.type.toUpperCase();
    if (filters.categoryId) params.categoryId = filters.categoryId;
    if (filters.startDate) params.start = filters.startDate;
    if (filters.endDate) params.end = filters.endDate;
    if (filters.minAmount) params.min = filters.minAmount;
    if (filters.maxAmount) params.max = filters.maxAmount;

    if (filters.sortBy) {
      params.sort = filters.sortBy.includes("asc") ? "asc" : "desc";
    }

    return params;
  };

  const fetchFilteredData = async () => {
    try {
      setLoading(true);
      const query = buildQuery();

      const res = await axiosConfig.get(API_ENDPOINTS.FILTER_TRANSACTIONS, {
        params: query,
      });

      const list = res.data?.data?.data || [];
      setTransactions(list);
    } catch (err) {
      console.error("Filter error", err);
      setTransactions([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFilteredData();
  }, [filters]);

  return (
    <Dashboard activeMenu="Filter">
      <div className="p-4 sm:p-6">

        <FilterBar
          filterButtons={filterButtons}
          dropdown={dropdown}
          toggleDropdown={toggleDropdown}
          getFilterLabel={getFilterLabel}
          clearFilters={clearFilters}
          categories={categories}
          updateFilter={updateFilter}
        />

        <div className="mt-6 bg-white p-4 rounded-2xl shadow border">
          <ResultsList
            loading={loading}
            transactions={transactions}
          />
        </div>

      </div>
    </Dashboard>
  );
};

export default Filter;
