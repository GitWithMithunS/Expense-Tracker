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
import BudgetStatusCard from "@/components/home/BudgetStatusCard";
import EmptyState from "@/components/charts/EmptyState";


const Home = () => {
  const [openBudgetManager, setOpenBudgetManager] = useState(false);
  const [showIncomeModal, setShowIncomeModal] = useState(false);
  const [showExpenseModal, setShowExpenseModal] = useState(false);

  const navigate = useNavigate();
  const { state } = useContext(TransactionContext);

  const [recentIncome, setRecentIncome] = useState([]);
  const [recentExpense, setRecentExpense] = useState([]);
  const [allTransactions, setAllTransactions] = useState([]);

  //transaction context
  // const {recentIncomes , recentExpenses} = useContext(TransactionContext);

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



  useEffect(() => {
    setAllTransactions(state.recentTransactions);
    setRecentIncome(state.recentIncomes);
    setRecentExpense(state.recentExpenses);
    // console.log('transaction context state', state);   //just a checker 
  }, [state])


  //set recent 5 transactions
  // useEffect(() => {
  //   const fetchAll = async () => {
  //     try {
  //       const response = await axiosConfig.get(API_ENDPOINTS.GET_ALL_TRANSACTIONS);
  //       setAllTransactions(response.data);
  //     } catch (error) {
  //       console.error("Error fetching transactions:", error);
  //     }
  //   };

  //   fetchAll();
  // }, []);


  //get recent incomes
  // useEffect(() => {
  //   // const fetchIncome = async () => {
  //   //   try {
  //   //     const response = await axiosConfig.get(API_ENDPOINTS.GET_ALL_TRANSACTIONS);

  //   //     const allTx = response.data;

  //   //     // Filter income + sort by latest + take recent 5
  //   //     const recent = allTx
  //   //       .filter((tx) => tx.type === "income")
  //   //       .sort((a, b) => new Date(b.date) - new Date(a.date))
  //   //       .slice(0, 5);

  //   //     setRecentIncome(recent);

  //   //   } catch (error) {
  //   //     console.error("Error fetching income:", error);
  //   //   }
  //   // };
  // setRecentIncome(recentIncome);
  //   fetchIncome();
  // }, []);


  //get recent expenses
  // useEffect(() => {
  //   const fetchExpenses = async () => {
  //     try {
  //       const response = await axiosConfig.get(API_ENDPOINTS.GET_ALL_TRANSACTIONS);

  //       const allTx = response.data;

  //       // Filter ONLY expense + sort by latest + take 5 recent
  //       const recent = allTx
  //         .filter((tx) => tx.type === "expense")
  //         .sort((a, b) => new Date(b.date) - new Date(a.date))
  //         .slice(0, 5);

  //       setRecentExpense(recent);

  //     } catch (error) {
  //       console.error("Error fetching expense:", error);
  //     }
  //   };

  //   fetchExpenses();
  // }, []);

  return (
    <Dashboard activeMenu="Dashboard">
      <div className="my-5 mx-auto space-y-6">



        <div><OverviewSection /></div>


        {/* ===== TOTAL BALANCE ===== */}
        <div className="bg-white p-6 rounded-xl shadow-lg border border-blue-300">
          <h2 className="text-lg font-semibold text-gray-700">Total Balance</h2>

          <p
            className={`text-3xl font-bold mt-2 ${balance > 0 ? "text-green-600" : "text-red-600"
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
               transition-all duration-200 active:scale-95 cursor-pointer"
              >
                <TrendingUp size={18} className="text-green-700" />
                <span className="font-semibold">Add Income</span>
              </button>

            </div>


            {/*  Income List */}
            <ul className="space-y-3 pr-2">

              {(!recentIncome || recentIncome.length === 0) ? (
                // <li className="text-gray-500">No income yet.</li>
                <EmptyState message="Add your first income." type="list" />
              ) : (
                recentIncome.map((income) => (
                  <TransactionInfoCard
                    key={income.id}
                    title={income.name}
                    icon={income.icon}
                    date={moment(income.createdAt).format("Do MMM YYYY")}
                    amount={income.amount}
                    page="home"
                    type="income"
                    categoryName={income.categoryName}
                    onDelete={() => onDelete(income)}
                  />
                ))
              )}


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
                 transition-all duration-200 active:scale-95 cursor-pointer"
              >
                <TrendingDown size={18} className="text-red-700" />
                <span className="font-semibold">Add Expense</span>
              </button>
            </div>

            {/*  Expense List */}
            <ul className="space-y-3 pr-2">

              {!recentExpense || recentExpense.length === 0 && (
                <EmptyState message="Add your first expense." type="list" />
                // <li className="text-gray-500">No expenses yet.</li>
              )}

              {/* transaction listing */}

              {recentExpense && recentExpense.map((expense) => (
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


        {/* BUDGET SECTION */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-xl border shadow-sm">
            <BudgetStatus />
          </div>

          {/* <div className="bg-white p-6 rounded-xl border shadow-sm">
            <BudgetStatusCard />
          </div> */}
          <BudgetStatusCard />
        </div>

      </div>
    </Dashboard>
  );
};

export default Home;
