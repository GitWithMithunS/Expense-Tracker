import Dashboard from "../components/Dashboard";
import { ArrowUpCircleIcon, ArrowDownCircleIcon } from "@heroicons/react/24/outline";
import BudgetStatus from "../components/BudgetStatus";
import BudgetManager from "../components/BudgetManager";
import Calendar from "../components/Calendar";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const navigate = useNavigate();
  const [openBudgetManager, setOpenBudgetManager] = useState(false);

  return (
    <Dashboard activeMenu="Dashboard">
      <div className="space-y-8">

        {/* ======= TOTAL BALANCE ======= */}
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-700">Total Balance</h2>
          <p className="text-3xl font-bold text-blue-600 mt-2">₹0.00</p>
        </div>

        {/* ======= ACTION BUTTONS ======= */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          
          {/* ADD INCOME */}
          <button
            onClick={() => navigate("/income")}
            className="w-full bg-white p-6 rounded-xl border border-gray-200 shadow-sm
                       flex flex-col items-center gap-3 hover:shadow-md transition-all"
          >
            <ArrowUpCircleIcon className="h-12 w-12 text-green-600" />
            <h3 className="text-lg font-semibold text-gray-800">Add Income</h3>
          </button>

          {/* ADD EXPENSE */}
          <button
            onClick={() => navigate("/expense")}
            className="w-full bg-white p-6 rounded-xl border border-gray-200 shadow-sm
                       flex flex-col items-center gap-3 hover:shadow-md transition-all"
          >
            <ArrowDownCircleIcon className="h-12 w-12 text-red-600" />
            <h3 className="text-lg font-semibold text-gray-800">Add Expense</h3>
          </button>

        </div>

        {/* ======= BUDGET SECTIONS ======= */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

          {/* Budget Status Card */}
          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
            <BudgetStatus />
          </div>

          {/* Budget Manager Card */}
          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
            <h3 className="text-xl font-semibold text-gray-800 mb-3">Budget Manager</h3>
            <p className="text-gray-600 mb-4">
              Plan your monthly budget and divide it across categories.
            </p>

            <button
              onClick={() => setOpenBudgetManager(true)}
              className="px-5 py-3 rounded-lg bg-purple-600 text-white hover:bg-purple-700 transition"
            >
              Set Monthly Budget
            </button>

            {openBudgetManager && (
              <BudgetManager onClose={() => setOpenBudgetManager(false)} />
            )}
          </div>
        </div>

        {/* ======= CALENDAR ======= */}
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
          <Calendar />
        </div>

      </div>
    </Dashboard>
  );
};

export default Home;
