import Dashboard from "../components/Dashboard";
import { ArrowUpCircleIcon, ArrowDownCircleIcon } from "@heroicons/react/24/outline";
import BudgetStatus from "../components/BudgetStatus";
import BudgetManager from "../components/BudgetManager";
import Calendar from "../components/Calendar";
import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import AddIncomeModal from "../components/AddIncome";
import AddExpenseModal from "../components/AddExpense";
import OverviewSection from "../components/OverviewSection";
import { TransactionContext } from "../context/TransactionContext";

const Home = () => {
  const navigate = useNavigate();
  const [openBudgetManager, setOpenBudgetManager] = useState(false);
  const [showIncomeModal, setShowIncomeModal] = useState(false);
  const [showExpenseModal, setShowExpenseModal] = useState(false);
  const { state } = useContext(TransactionContext);

  const totalIncome = state.incomes.reduce(
    (sum, item) => sum + Number(item.amount),
    0
  );

  const totalExpense = state.expenses.reduce(
    (sum, item) => sum + Number(item.amount),
    0
  );

  const totalBalance = totalIncome - totalExpense;

  return (
    <Dashboard activeMenu="Dashboard">
      <div className="space-y-8">

        {/* ======= TOTAL BALANCE ======= */}
<div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">

  {/* Header */}
  <h2 className="text-lg font-semibold text-gray-700">Total Balance</h2>

  {/* Amount */}
  <p
    className={`text-3xl font-bold mt-2 ${
      totalBalance >= 0 ? "text-green-600" : "text-red-600"
    }`}
  >
    ₹{totalBalance.toLocaleString("en-IN")}
  </p>

  {/* Income & Expense Summary */}
  <div className="text-sm text-gray-500 mt-2 flex items-center gap-6">
    <span>
      Income:{" "}
      <span className="text-green-600 font-semibold">
        ₹{totalIncome.toLocaleString("en-IN")}
      </span>
    </span>
    <span>
      Expense:{" "}
      <span className="text-red-600 font-semibold">
        ₹{totalExpense.toLocaleString("en-IN")}
      </span>
    </span>
  </div>

  {/* Divider */}
  <div className="my-5 border-t border-gray-200"></div>

  {/* Action Buttons Row */}
  <div className="flex items-center justify-center gap-8">

    {/* ADD INCOME */}
    <button
      onClick={() => setShowIncomeModal(true)}
      className="w-20 h-20 bg-gradient-to-br from-emerald-300 to-emerald-400 
                 text-white shadow-md rounded-2xl flex flex-col items-center justify-center 
                 hover:scale-110 hover:shadow-xl transition-all"
    >
      <span className="text-5xl font-bold leading-none">+</span>
    </button>

    {/* ADD EXPENSE */}
    <button
      onClick={() => setShowExpenseModal(true)}
      className="w-20 h-20 bg-gradient-to-br from-pink-300 to-pink-400 
                 text-white shadow-md rounded-2xl flex flex-col items-center justify-center 
                 hover:scale-110 hover:shadow-xl transition-all"
    >
      <span className="text-5xl font-bold leading-none">−</span>
    </button>

  </div>

  {/* MODALS */}
  {showIncomeModal && (
    <AddIncomeModal onClose={() => setShowIncomeModal(false)} />
  )}

  {showExpenseModal && (
    <AddExpenseModal onClose={() => setShowExpenseModal(false)} />
  )}

</div>



        {/* ======= ACTION BUTTONS ======= */}
        


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
        <div className="grow mx-5">
   <OverviewSection />
</div>
      </div>
    </Dashboard>
  );
};

export default Home;
