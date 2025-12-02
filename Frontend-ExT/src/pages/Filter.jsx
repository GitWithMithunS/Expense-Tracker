import React, { useState, useEffect } from "react";
import Dashboard from "../components/common/Dashboard";
import axiosConfig from "../util/axiosConfig";
import { API_ENDPOINTS } from "../util/apiEnpoints";
import EmptyState from "@/components/charts/EmptyState";
import { SlidersHorizontal, ChevronDown } from "lucide-react";

import  useUniversalFilter  from "../components/common/FilterLogic";

const Filter = () => {
  const [transactions, setTransactions] = useState([]);

  // Load transactions
  useEffect(() => {
    const load = async () => {
      const res = await axiosConfig.get(API_ENDPOINTS.GET_ALL_TRANSACTIONS);
      setTransactions(res.data || []);
    };
    load();
  }, []);

  const {
    filters,
    filteredTransactions,
    dropdown,
    filterButtons,
    toggleDropdown,
    updateFilter,
    clearFilters,
    getFilterLabel
  } = useUniversalFilter(transactions);

  return (
    <Dashboard activeMenu="Filter">
      <div className="p-6">

        {/* FILTER BAR */}
        <div className="flex items-center gap-4 bg-white shadow rounded-xl p-4">

          <div className="p-3 bg-grey rounded-lg shadow-sm ">
            <SlidersHorizontal className="text-gray-600" />
          </div>

          {filterButtons.map((item) => (
            <div key={item.id} className="relative ">
              <button
                onClick={() => toggleDropdown(item.id)}
                className="flex items-center gap-2 px-4 py-2 bg-white border rounded-lg shadow-sm hover:shadow-md cursor-pointer"
              >
                {getFilterLabel(item.id)}
                <ChevronDown size={16} />
              </button>

              {dropdown === item.id && (
                <div className="absolute top-12 left-0 bg-white border shadow-lg rounded-lg p-4 w-56 z-20">
                  {/* PAYMENT METHOD */}
                  {item.id === "paymentMethod" &&
                    ["cash", "card", "upi", "netbanking"].map((pm) => (
                      <p
                        key={pm}
                        className="cursor-pointer p-2 hover:bg-gray-100 rounded"
                        onClick={() => updateFilter("paymentMethod", pm)}
                      >
                        {pm.toUpperCase()}
                      </p>
                    ))}

                  {/* SORT */}
                  {item.id === "sortBy" && (
                    <>
                      <p onClick={() => updateFilter("sortBy", "date-asc")} className="dropdown-opt cursor-pointer">
                        Date (Old → New)
                      </p>
                      <p onClick={() => updateFilter("sortBy", "date-desc")} className="dropdown-opt cursor-pointer">
                        Date (New → Old)
                      </p>
                      <p onClick={() => updateFilter("sortBy", "amount-asc")} className="dropdown-opt cursor-pointer">
                        Amount (Low → High)
                      </p>
                      <p onClick={() => updateFilter("sortBy", "amount-desc")} className="dropdown-opt cursor-pointer">
                        Amount (High → Low)
                      </p>
                    </>
                  )}

                  {/* TYPE */}
                  {item.id === "type" && (
                    <>
                      <p onClick={() => updateFilter("type", "income")} className="cursor-pointer p-2 hover:bg-gray-100 rounded">
                        Income
                      </p>
                      <p onClick={() => updateFilter("type", "expense")} className="cursor-pointer p-2 hover:bg-gray-100 rounded">
                        Expense
                      </p>
                    </>
                  )}

                  {/* DATE */}
                  {item.id === "date" && (
                    <div>
                      <label className="text-xs text-gray-500">Start Date</label>
                      <input
                        type="date"
                        className="border w-full rounded px-3 py-2 mb-3"
                        onChange={(e) => updateFilter("startDate", e.target.value)}
                      />
                      <label className="text-xs text-gray-500">End Date</label>
                      <input
                        type="date"
                        className="border w-full rounded px-3 py-2"
                        onChange={(e) => updateFilter("endDate", e.target.value)}
                      />
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}

          <button
            onClick={clearFilters}
            className="ml-auto px-4 py-2 text-white bg-purple-600 hover:bg-purple-500 rounded-lg text-sm cursor-pointer"
          >
            Clear All
          </button>

        </div>

        {/* RESULT GRID */}
        <div className="mt-6">
          {filteredTransactions.length === 0 ? (
            <EmptyState message="No transaction to filter." type="list" />
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredTransactions.map((t) => (
                <div key={t.id} className="bg-white rounded-2xl shadow p-5 border">
                  <div className="flex justify-between items-center mb-3">
                    <div className="text-4xl">{t.icon}</div>
                    <p
                      className={`text-xl font-bold ${
                        t.type === "income" ? "text-green-600" : "text-red-500"
                      }`}
                    >
                      {t.type === "income" ? "+ " : "- "}₹{t.amount}
                    </p>
                  </div>
                  <p className="text-lg font-semibold text-gray-800">{t.categoryName}</p>
                  <span className="px-3 py-1 text-xs bg-gray-100 text-gray-600 rounded-full mt-2 inline-block">
                    {t.paymentMethod.toUpperCase()}
                  </span>
                  {t.notes && <p className="text-sm text-gray-500 mt-3">{t.notes}</p>}
                  <div className="mt-4 bg-blue-50 text-blue-600 px-4 py-2 rounded-xl text-sm">
                    {t.date}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </Dashboard>
  );
};

export default Filter;
