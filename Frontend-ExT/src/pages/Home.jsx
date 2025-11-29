import Dashboard from "../components/common/Dashboard";
import BudgetStatus from "../components/home/BudgetStatus";
import BudgetManager from "../components/home/BudgetManager";
import Calendar from "../components/common/Calendar";
import { useContext, useEffect, useState } from "react";
// import AddIncomeModal from "../components/AddIncome";
// import AddExpenseModal from "../components/AddExpense";
import OverviewSection from "../components/home/OverviewSection";
import { TransactionContext } from "../context/TransactionContext";
import { CreditCard, Wallet } from "lucide-react";
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
        <div className="bg-white p-6 rounded-xl border shadow-sm">
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
                    <span>{inc.categoryName}</span>
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
                onClick={() => navigate("/income")}
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
                    {/* CATEGORY NAME */}
                    <span>{exp.categoryName || "Expense"}</span>

                    {/* AMOUNT */}
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
                onClick={() => navigate("/expense")}
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

      </div>
    </Dashboard>
  );
};

export default Home;
