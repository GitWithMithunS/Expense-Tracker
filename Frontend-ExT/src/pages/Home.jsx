import Dashboard from "../components/Dashboard";
import BudgetStatus from "../components/BudgetStatus";
import BudgetManager from "../components/BudgetManager";
import Calendar from "../components/Calendar";
import { useContext, useState } from "react";
import AddIncomeModal from "../components/AddIncome";
import AddExpenseModal from "../components/AddExpense";
import OverviewSection from "../components/OverviewSection";
import { TransactionContext } from "../context/TransactionContext";
import { CreditCard, Wallet } from "lucide-react";

const Home = () => {
  const [openBudgetManager, setOpenBudgetManager] = useState(false);
  const [showIncomeModal, setShowIncomeModal] = useState(false);
  const [showExpenseModal, setShowExpenseModal] = useState(false);

  const { state } = useContext(TransactionContext);

  // totals
  const totalIncome = state.incomes.reduce((s, i) => s + Number(i.amount), 0);
  const totalExpense = state.expenses.reduce((s, e) => s + Number(e.amount), 0);
  const totalBalance = totalIncome - totalExpense;

  // newest-first helper  
  const sortNewestFirst = (arr) => {
    return [...arr]
      .sort((a, b) => {
        if (a.date && b.date) return new Date(b.date) - new Date(a.date);
        return (b.id || 0) - (a.id || 0);
      })
      .slice(0, 5);
  };

  const recentIncome = sortNewestFirst(state.incomes);
  const recentExpense = sortNewestFirst(state.expenses);

  return (
    <Dashboard activeMenu="Dashboard">
      <div className="space-y-8">

        {/* ===== TOTAL BALANCE ===== */}
        <div className="bg-white p-6 rounded-xl border shadow-sm">
          <h2 className="text-lg font-semibold text-gray-700">Total Balance</h2>

          <p
            className={`text-3xl font-bold mt-2 ${
              totalBalance >= 0 ? "text-green-600" : "text-red-600"
            }`}
          >
            ₹{totalBalance.toLocaleString("en-IN")}
          </p>
        </div>

{/* ===== RECENT INCOME & EXPENSE ===== */}
<div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">

  {/* INCOME BOX */}
  <div className="bg-white rounded-xl shadow-lg border h-80 flex flex-col overflow-hidden">

    <div className="p-6 flex-1 flex flex-col min-h-0">
      <h3 className="text-lg font-semibold mb-3">Income</h3>

      <ul className="space-y-2 text-sm overflow-y-auto flex-1 min-h-0 pr-2">
        {recentIncome.length === 0 && (
          <li className="text-gray-500">No income yet.</li>
        )}

        {recentIncome.map((inc) => (
          <li
            key={inc.id}
            className="border-b pb-1 flex justify-between items-center"
          >
            <span>{inc.source || "Income"}</span>
            <span className="text-green-600 font-semibold">
              ₹{inc.amount}
            </span>
          </li>
        ))}
      </ul>
    </div>

    {/* Fixed footer button */}
    <div className="px-6 py-3 border-t bg-white flex justify-center">
      <button
        onClick={() => setShowIncomeModal(true)}
        className="px-4 py-2 bg-emerald-500 text-white rounded-lg shadow 
                   flex items-center gap-2 hover:bg-emerald-600 transition"
      >
        <Wallet className="h-5 w-5" />
        <span className="text-sm font-medium">Add Income</span>
      </button>
    </div>
  </div>

  {/* EXPENSE BOX */}
  <div className="bg-white rounded-xl shadow-lg border h-80 flex flex-col overflow-hidden">

    <div className="p-6 flex-1 flex flex-col min-h-0">
      <h3 className="text-lg font-semibold mb-3">Expense</h3>

      <ul className="space-y-2 text-sm overflow-y-auto flex-1 min-h-0 pr-2">
        {recentExpense.length === 0 && (
          <li className="text-gray-500">No expenses yet.</li>
        )}

        {recentExpense.map((exp) => (
          <li
            key={exp.id}
            className="border-b pb-1 flex justify-between items-center"
          >
            <span>{exp.category}</span>
            <span className="text-red-600 font-semibold">
              ₹{exp.amount}
            </span>
          </li>
        ))}
      </ul>
    </div>

    {/* Fixed footer button */}
    <div className="px-6 py-3 border-t bg-white flex justify-center">
      <button
        onClick={() => setShowExpenseModal(true)}
        className="px-4 py-2 bg-pink-500 text-white rounded-lg shadow 
                   flex items-center gap-2 hover:bg-pink-600 transition"
      >
        <CreditCard className="h-5 w-5" />
        <span className="text-sm font-medium">Add Expense</span>
      </button>
    </div>
  </div>

</div>


        {/* MODALS */}
        {showIncomeModal && <AddIncomeModal onClose={() => setShowIncomeModal(false)} />}
        {showExpenseModal && <AddExpenseModal onClose={() => setShowExpenseModal(false)} />}

        <div><OverviewSection /></div>

        {/* BUDGET SECTION */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-xl border shadow-sm">
            <BudgetStatus />
          </div>

          <div className="bg-white p-6 rounded-xl border shadow-sm">
            <h3 className="text-xl font-semibold mb-3">Budget Manager</h3>
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

        {/* CALENDAR */}
        <div className="bg-white p-6 rounded-xl border shadow-sm">
          <Calendar />
        </div>

      </div>
    </Dashboard>
  );
};

export default Home;
