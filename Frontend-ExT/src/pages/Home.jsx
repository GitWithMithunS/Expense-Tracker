import Dashboard from "../../../Dashboard";
import BudgetStatus from "../components/home/BudgetStatus";
import BudgetManager from "../components/home/BudgetManager";
import Calendar from "../components/common/Calendar";
import { useContext, useEffect, useState } from "react";
// import AddIncomeModal from "../components/AddIncome";
// import AddExpenseModal from "../components/AddExpense";
import OverviewSection from "../components/home/OverviewSection";
import { TransactionContext } from "../context/TransactionContext";
import { CreditCard, TrendingDown, TrendingUp, Wallet } from "lucide-react";
import axiosConfig from "../util/axiosConfig";
import { API_ENDPOINTS } from "../util/apiEnpoints";
import { useNavigate } from "react-router-dom";


const Home = () => {
  const [openBudgetManager, setOpenBudgetManager] = useState(false);
  const [showIncomeModal, setShowIncomeModal] = useState(false);
  const [showExpenseModal, setShowExpenseModal] = useState(false);
  const navigate = useNavigate();

  const { state } = useContext(TransactionContext);

  console.log(state.categories);   //just a checker 

  // newest-first helper  
  const sortNewestFirst = (arr) => {
    return [...arr]
      .sort((a, b) => {
        if (a.date && b.date) return new Date(b.date) - new Date(a.date);
        return (b.id || 0) - (a.id || 0);
      })
      .slice(0, 5);
  };

  const [recentIncome, setRecentIncome] = useState([]);
  const [recentExpense, setRecentExpense] = useState([]);

  const [allTransactions, setAllTransactions] = useState([]);

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const response = await axiosConfig.get(API_ENDPOINTS.GET_ALL_TRANSACTIONS);
        setAllTransactions(response.data);
      } catch (error) {
        console.error("Error fetching transactions:", error);
      }
    };

    fetchAll();
  }, []);

  // COMPUTE TOTALS
  const totalIncome = allTransactions
    .filter(tx => tx.type === "income")
    .reduce((sum, tx) => sum + Number(tx.amount || 0), 0);

  const totalExpense = allTransactions
    .filter(tx => tx.type === "expense")
    .reduce((sum, tx) => sum + Number(tx.amount || 0), 0);

  const balance = totalIncome - totalExpense;


  useEffect(() => {
    const fetchIncome = async () => {
      try {
        const response = await axiosConfig.get(API_ENDPOINTS.GET_ALL_TRANSACTIONS);

        const allTx = response.data;

        // Filter income + sort by latest + take recent 5
        const recent = allTx
          .filter((tx) => tx.type === "income")
          .sort((a, b) => new Date(b.date) - new Date(a.date))
          .slice(0, 5);

        setRecentIncome(recent);

      } catch (error) {
        console.error("Error fetching income:", error);
      }
    };

    fetchIncome();
  }, []);

  useEffect(() => {
    const fetchExpenses = async () => {
      try {
        const response = await axiosConfig.get(API_ENDPOINTS.GET_ALL_TRANSACTIONS);

        const allTx = response.data;

        // Filter ONLY expense + sort by latest + take 5 recent
        const recent = allTx
          .filter((tx) => tx.type === "expense")
          .sort((a, b) => new Date(b.date) - new Date(a.date))
          .slice(0, 5);

        setRecentExpense(recent);

      } catch (error) {
        console.error("Error fetching expense:", error);
      }
    };

    fetchExpenses();
  }, []);

  return (
    <Dashboard activeMenu="Dashboard">
      <div className="space-y-8">

        {/* ===== TOTAL BALANCE ===== */}
        <div className="bg-white p-6 rounded-xl shadow-lg border border-blue-300">
  <h2 className="text-lg font-semibold text-gray-700">Total Balance</h2>

  <p
    className={`text-3xl font-bold mt-2 ${
      balance >= 0 ? "text-green-600" : "text-red-600"
    }`}
  >
    ₹{balance.toLocaleString("en-IN")}
  </p>
</div>


{/* ===== RECENT INCOME & EXPENSE ===== */}
<div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">

  {/* INCOME BOX */}
  <div className="bg-white rounded-xl shadow-lg border flex flex-col overflow-hidden p-4 border-green-300">

  {/* 🔵 Add Income Button at the Top */}
  <div className="flex justify-end mb-4">
    <button
          onClick={() => navigate("/income")}
          className="flex items-center gap-2 px-6 py-2.5 bg-green-100 text-green-700 
                     border border-green-300 rounded-lg shadow-sm hover:bg-green-200 
                     transition-all duration-200 active:scale-95"
        >
          <TrendingUp size={18} className="text-green-700" />
          <span className="font-semibold">Add Income</span>
        </button>
  </div>

  {/* 💰 Income List */}
  <ul className="space-y-3 pr-2">

    {recentIncome.length === 0 && (
      <li className="text-gray-500">No income yet.</li>
    )}

    {recentIncome.map((inc) => (
      <li
        key={inc.id}
        className="flex items-center justify-between p-4 rounded-xl
                   bg-white border border-gray-200 shadow-sm hover:shadow-md
                   transition-all"
      >
        {/* LEFT SIDE */}
        <div className="flex items-center gap-4">

          {/* Category Emoji */}
          <div className="w-12 h-12 flex items-center justify-center 
                          bg-gray-100 rounded-full text-2xl shadow-sm">
            <span>{inc.icon || "💰"}</span>
          </div>

          {/* Name + Date */}
          <div className="flex flex-col">
            <p className="text-gray-900 font-semibold text-sm">
              {inc.categoryName}
            </p>
            <p className="text-gray-500 text-xs">
              {new Date(inc.date).toLocaleDateString("en-GB", {
                day: "2-digit",
                month: "short",
                year: "numeric",
              })}
            </p>
          </div>
        </div>

        {/* RIGHT SIDE — Amount Badge */}
        <div
          className="px-3 py-1.5 rounded-lg text-sm font-semibold shadow-sm
                     flex items-center gap-2 bg-green-100 text-green-700 
                     border border-green-300"
        >
          ₹{inc.amount}
          <TrendingUp size={16} className="text-green-700" />
        </div>
      </li>
    ))}

  </ul>

</div>


  {/* EXPENSE BOX */}
  <div className="bg-white rounded-xl shadow-lg border flex flex-col overflow-hidden p-4 border-red-300">

  {/* 🔴 Add Expense Button at the Top */}
  <div className="flex justify-end mb-4">
    <button
      onClick={() => navigate("/expense")}
      className="flex items-center gap-2 px-6 py-2.5 bg-red-100 text-red-700
                 border border-red-300 rounded-lg shadow-sm hover:bg-red-200
                 transition-all duration-200 active:scale-95"
    >
      <TrendingDown size={18} className="text-red-700" />
      <span className="font-semibold">Add Expense</span>
    </button>
  </div>

  {/* 🔻 Expense List */}
  <ul className="space-y-3 pr-2">

    {recentExpense.length === 0 && (
      <li className="text-gray-500">No expenses yet.</li>
    )}

    {recentExpense.map((exp) => (
      <li
        key={exp.id}
        className="flex items-center justify-between p-4 rounded-xl
                   bg-white border border-gray-200 shadow-sm hover:shadow-md
                   transition-all"
      >

        {/* LEFT SIDE */}
        <div className="flex items-center gap-4">

          {/* Category Emoji */}
          <div className="w-12 h-12 flex items-center justify-center 
                          bg-gray-100 rounded-full text-2xl shadow-sm">
            <span>{exp.icon || "💸"}</span>
          </div>

          {/* Name + Date */}
          <div className="flex flex-col">
            <p className="text-gray-900 font-semibold text-sm">
              {exp.categoryName}
            </p>
            <p className="text-gray-500 text-xs">
              {new Date(exp.date).toLocaleDateString("en-GB", {
                day: "2-digit",
                month: "short",
                year: "numeric",
              })}
            </p>
          </div>
        </div>

        {/* RIGHT SIDE — Amount Badge */}
        <div
          className="px-3 py-1.5 rounded-lg text-sm font-semibold shadow-sm
                     flex items-center gap-2 bg-red-100 text-red-700 
                     border border-red-300"
        >
          ₹{exp.amount}
          <TrendingDown size={16} className="text-red-700" />
        </div>

      </li>
    ))}

  </ul>

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

      </div>
    </Dashboard>
  );
};

export default Home;
