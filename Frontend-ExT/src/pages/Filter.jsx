// ---------------- FILTER PAGE ----------------

import React, { useState, useEffect, useContext } from "react";
import Dashboard from "../components/common/Dashboard";
import axiosConfig from "../util/axiosConfig";
import { API_ENDPOINTS } from "../util/apiEnpoints";
import EmptyState from "@/components/charts/EmptyState";
import { SlidersHorizontal, ChevronDown, TrendingUpDownIcon, TrendingUpIcon, TrendingUp, TrendingDownIcon } from "lucide-react";

import useUniversalFilter from "../components/common/FilterLogic";
import { TransactionContext } from "@/context/TransactionContext";
import moment from "moment";
import TransactionInfoCard from "@/components/common/TransactionInfoCard";

const Filter = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(false);

  // Load categories from global context
  const { state } = useContext(TransactionContext);
  const categories = state.categories || [];

  // filter UI hook
  const {
    filters,
    dropdown,
    filterButtons,
    toggleDropdown,
    updateFilter,
    clearFilters,
    getFilterLabel,
  } = useUniversalFilter();

  // ---------------------------------------
  // BUILD QUERY PARAMS
  // ---------------------------------------
  const buildQuery = () => {
    const params = {};

    if (filters.type) params.type = filters.type.toUpperCase();

    if (filters.categoryId) params.categoryId = filters.categoryId;

    if (filters.startDate) params.start = filters.startDate;
    if (filters.endDate) params.end = filters.endDate;

    // Amount filtering
    if (filters.minAmount) params.min = filters.minAmount;
    if (filters.maxAmount) params.max = filters.maxAmount;

    // Sorting
    if (filters.sortBy) {
      if (filters.sortBy.includes("asc")) params.sort = "asc";
      if (filters.sortBy.includes("desc")) params.sort = "desc";
    }
    filters.page = 10;
    filters.size = 100;

    return params;
  };

  // ---------------------------------------
  // FETCH FILTERED RESULTS
  // ---------------------------------------
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

  // API Trigger
  useEffect(() => {
    fetchFilteredData();
  }, [filters]);

  return (
    <Dashboard activeMenu="Filter">
      <div className="p-4 sm:p-6">

        {/* FILTER BAR */}
        <div className="flex flex-wrap items-center gap-4 bg-white shadow rounded-xl p-4">

          <div className="p-3 rounded-lg shadow-sm bg-gray-100">
            <SlidersHorizontal className="text-gray-600" />
          </div>

          {/* Filter Buttons */}
          {filterButtons.map((item) => (
            <div key={item.id} className="relative">
              <button
                onClick={() => toggleDropdown(item.id)}
                className="flex items-center gap-2 px-4 py-2 bg-white border rounded-lg shadow-sm hover:shadow-md cursor-pointer"
              >
                {getFilterLabel(item.id)}
                <ChevronDown size={16} />
              </button>

              {/* Dropdowns */}
              {dropdown === item.id && (
                <div className="absolute top-12 left-0 bg-white border shadow-lg rounded-lg p-4 w-56 z-20">

                  {/* TYPE */}
                  {item.id === "type" && (
                    <>
                      <p className="p-2 hover:bg-gray-100 cursor-pointer"
                        onClick={() => updateFilter("type", "income")}>
                        Income
                      </p>
                      <p className="p-2 hover:bg-gray-100 cursor-pointer"
                        onClick={() => updateFilter("type", "expense")}>
                        Expense
                      </p>
                    </>
                  )}

                  {/* CATEGORY */}
                  {item.id === "category" && (
                    <>
                      {categories.map((cat) => (
                        <p
                          key={cat.id}
                          className="cursor-pointer p-2 hover:bg-gray-100 rounded"
                          onClick={() =>
                            updateFilter("categoryId", cat.id)
                          }
                        >
                          {cat.icon} {cat.name}
                        </p>
                      ))}
                    </>
                  )}

                  {/* DATE RANGE */}
                  {item.id === "date" && (
                    <>
                      <label className="text-xs text-gray-500">Start Date</label>
                      <input
                        type="date"
                        className="border w-full rounded px-3 py-2 mb-3"
                        onChange={(e) =>
                          updateFilter("startDate", e.target.value)
                        }
                      />

                      <label className="text-xs text-gray-500">End Date</label>
                      <input
                        type="date"
                        className="border w-full rounded px-3 py-2"
                        onChange={(e) =>
                          updateFilter("endDate", e.target.value)
                        }
                      />
                    </>
                  )}

                  {/* SORT */}
                  {item.id === "sortBy" && (
                    <>
                      <p className="p-2 hover:bg-gray-100 cursor-pointer"
                        onClick={() => updateFilter("sortBy", "date-asc")}>
                        Date (Old → New)
                      </p>

                      <p className="p-2 hover:bg-gray-100 cursor-pointer"
                        onClick={() => updateFilter("sortBy", "date-desc")}>
                        Date (New → Old)
                      </p>

                      <p className="p-2 hover:bg-gray-100 cursor-pointer"
                        onClick={() => updateFilter("sortBy", "amount-asc")}>
                        Amount (Low → High)
                      </p>

                      <p className="p-2 hover:bg-gray-100 cursor-pointer"
                        onClick={() => updateFilter("sortBy", "amount-desc")}>
                        Amount (High → Low)
                      </p>
                    </>
                  )}

                  {/* AMOUNT RANGE */}
                  {item.id === "amount" && (
                    <>
                      <label className="text-xs text-gray-500">Min Amount</label>
                      <input
                        type="number"
                        className="border w-full rounded px-3 py-2 mb-3"
                        onChange={(e) =>
                          updateFilter("minAmount", e.target.value)
                        }
                      />

                      <label className="text-xs text-gray-500">Max Amount</label>
                      <input
                        type="number"
                        className="border w-full rounded px-3 py-2"
                        onChange={(e) =>
                          updateFilter("maxAmount", e.target.value)
                        }
                      />
                    </>
                  )}

                </div>
              )}
            </div>
          ))}

          <button
            onClick={clearFilters}
            className="ml-auto px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white rounded-lg"
          >
            Clear All
          </button>
        </div>

        {/* RESULTS */}
        {/* RESULTS */}
        <div className="mt-6 bg-white p-6 rounded-2xl shadow border-gray-100">

          {loading ? (
            <p className="text-gray-500 text-center py-10">Loading...</p>
          ) : transactions.length === 0 ? (
            <EmptyState message="No transactions found." type="list" />
          ) : (
            <div className="space-y-4">
              {transactions.map((t) => (
                <TransactionInfoCard
                  key={t.id}
                  icon={t.categoryEmoji}
                  title={t.categoryName}
                  date={moment(t.createdAt).format("Do MMM YYYY")}
                  amount={Math.abs(t.amount)}
                  type={t.categoryType === "INCOME" ? "income" : "expense"}
                  categoryName={t.categoryName}
                  page="filter"
                  onDelete={() => handleDelete(t.id)}   // optional delete handler
                />
              ))}
            </div>
          )}
        </div>


      </div>
    </Dashboard>
  );
};

export default Filter;
