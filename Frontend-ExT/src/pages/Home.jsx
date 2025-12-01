import BudgetStatus from "../components/home/BudgetStatus";
import BudgetManager from "../components/home/BudgetManager";
import Calendar from "../components/common/Calendar";
import { useContext, useEffect, useState } from "react";
import OverviewSection from "../components/home/OverviewSection";
import { TransactionContext } from "../context/TransactionContext";
import { CreditCard, DollarSign, TrendingDown, TrendingUp, Wallet } from "lucide-react";
import axiosConfig from "../util/axiosConfig";
import { API_ENDPOINTS } from "../util/apiEnpoints";
import { useNavigate } from "react-router-dom";
import Dashboard from "../components/common/Dashboard";
import TransactionInfoCard from "@/components/common/TransactionInfoCard";
import moment from "moment";


const Home = () => {
  const [openBudgetManager, setOpenBudgetManager] = useState(false);
  const [showIncomeModal, setShowIncomeModal] = useState(false);
  const [showExpenseModal, setShowExpenseModal] = useState(false);
  const navigate = useNavigate();

  const { state } = useContext(TransactionContext);

  const [recentIncome, setRecentIncome] = useState([]);
  const [recentExpense, setRecentExpense] = useState([]);

  const [allTransactions, setAllTransactions] = useState([]);

  // COMPUTE TOTALS
  const totalIncome = allTransactions
    .filter(tx => tx.type === "income")
    .reduce((sum, tx) => sum + Number(tx.amount || 0), 0);

  const totalExpense = allTransactions
    .filter(tx => tx.type === "expense")
    .reduce((sum, tx) => sum + Number(tx.amount || 0), 0);

  const balance = totalIncome - totalExpense;

  const today = new Date().getDate();
  const totalDaysInMonth = new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0).getDate();

  const daysRemaining = Math.max(1, totalDaysInMonth - today); 
  const dailySpendLimit = balance > 0 ? balance / daysRemaining : 0;

  console.log(state.categories);   //just a checker 

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
      <div className="my-5 mx-auto space-y-6">

        {/* ====================================================== */}
        {/* SUMMARY BAR (Income | Expense | Daily Spend Limit)    */}
        {/* ====================================================== */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">

          {/* Total Income */}
          <div className="bg-emerald-50 p-4 rounded-lg border border-emerald-200">
            <p className="text-sm text-gray-600">Total Income</p>
            <h2 className="text-2xl font-bold text-emerald-600 mt-1">
              ₹{totalIncome.toLocaleString("en-IN")}
            </h2>

            <p className="text-xs text-gray-500 mt-1">
              Total income added this month
            </p>
          </div>

          {/* Total Expense */}
          <div className="bg-red-50 p-4 rounded-lg border border-red-200">
            <p className="text-sm text-gray-600">Total Expense</p>
            <h2 className="text-2xl font-bold text-red-600 mt-1">
              ₹{totalExpense.toLocaleString("en-IN")}
            </h2>

            <p className="text-xs text-gray-500 mt-1">
              Total money spent this month
            </p>
          </div>

          {/* Daily Spending Limit */}
          <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
            <p className="text-sm text-gray-600">You can spend per day</p>
            <h2 className="text-2xl font-bold text-blue-600 mt-1">
              ₹{dailySpendLimit.toFixed(0).toLocaleString("en-IN")}
            </h2>

            <p className="text-xs text-gray-500 mt-1">
              Based on your remaining balance and {daysRemaining} days left
            </p>
          </div>

        </div>

        {/* ===== TOTAL BALANCE ===== */}
        <div className="bg-white p-6 rounded-xl shadow-lg border border-blue-300">
          <h2 className="text-lg font-semibold text-gray-700">Total Balance</h2>

          <p
            className={`text-3xl font-bold mt-2 ${balance >= 0 ? "text-green-600" : "text-red-600"
              }`}
          >
            ₹{balance.toLocaleString("en-IN")}
          </p>
        </div>


        {/* ===== RECENT INCOME & EXPENSE ===== */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">

          {/* INCOME BOX */}
          <div className="bg-white rounded-xl shadow-lg border flex flex-col overflow-hidden p-4 border-green-300">

            {/* Add Income Button at the Top */}
            <div className="flex items-center justify-between mb-4">

              {/* Left Side Title */}
              <span className="text-gray-700 font-semibold text-xl">
                Income
              </span>

              {/* Right Side Button */}
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

              {recentIncome.map((expense) => (
                <TransactionInfoCard
                  key={expense.id}
                  title={expense.name}
                  icon={expense.icon}
                  date={moment(expense.date).format("Do MMM YYYY")}
                  amount={expense.amount}
                  page='home'
                  type='income'
                  categoryName={expense.categoryName}

                  onDelete={() => onDelete(expense)}
                />
              ))}

            </ul>

          </div>


          {/* EXPENSE BOX */}
          <div className="bg-white rounded-xl shadow-lg border flex flex-col overflow-hidden p-4 border-red-300">

            {/*  Add Expense Button at the Top */}
            <div className="flex items-center justify-between mb-4">

              {/* Left Side Title */}
              <span className="text-gray-700 font-semibold text-xl">
                Expense
              </span>
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

            {/*  Expense List */}
            <ul className="space-y-3 pr-2">

              {recentExpense.length === 0 && (
                <li className="text-gray-500">No expenses yet.</li>
              )}

              {/* transaction listing */}

              {recentExpense.map((expense) => (
                <TransactionInfoCard
                  key={expense.id}
                  title={expense.name}
                  icon={expense.icon}
                  date={moment(expense.date).format("Do MMM YYYY")}
                  amount={expense.amount}
                  categoryName={expense.categoryName}
                  page='home'
                  type="expense"
                  onDelete={() => onDelete(expense)}
                />
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
