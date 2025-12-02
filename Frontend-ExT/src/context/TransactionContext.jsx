import { createContext, useReducer, useEffect } from "react";
import axiosConfig from "../util/axiosConfig";
import { API_ENDPOINTS } from "../util/apiEnpoints";

export const TransactionContext = createContext();

const initialState = {
  balance: 0,

  // Full lists
  incomes: [],
  expenses: [],
  transactions: [],

  // Recent lists
  recentIncomes: [],
  recentExpenses: [],
  recentTransactions: [],

  categories: [],
};



// ===============================
// REDUCER
// ===============================
function reducer(state, action) {
  switch (action.type) {

    case "SET_CATEGORIES":
      return { ...state, categories: action.payload };

    case "SET_ALL_DATA":
      return {
        ...state,
        incomes: action.payload.incomes,
        expenses: action.payload.expenses,
        transactions: action.payload.transactions,
        recentIncomes: action.payload.recentIncomes,
        recentExpenses: action.payload.recentExpenses,
        recentTransactions: action.payload.recentTransactions,
        balance: action.payload.balance,
      };

    case "ADD_INCOME": {
      const newIncome = action.payload;

      return {
        ...state,
        incomes: [newIncome, ...state.incomes],
        recentIncomes: [newIncome, ...state.recentIncomes].slice(0, 5),
        recentTransactions: [
          { ...newIncome, type: "INCOME" },
          ...state.recentTransactions,
        ].slice(0, 5),
        balance: state.balance + Number(newIncome.amount),
      };
    }

    case "ADD_EXPENSE": {
      const newExpense = action.payload;

      return {
        ...state,
        expenses: [newExpense, ...state.expenses],
        recentExpenses: [newExpense, ...state.recentExpenses].slice(0, 5),
        recentTransactions: [
          { ...newExpense, type: "EXPENSE" },
          ...state.recentTransactions,
        ].slice(0, 5),
        balance: state.balance + Number(newExpense.amount), // amount is NEGATIVE, so adding reduces balance
      };
    }

    default:
      return state;
  }
}

// ===============================
// PROVIDER
// ===============================
export default function TransactionProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  // -------------------------------------------
  // Fetch ALL transactions and categorize them
  // -------------------------------------------
  const fetchAllTransactions = async () => {
    try {
      const res = await axiosConfig.get(API_ENDPOINTS.GET_ALL_TRANSACTIONS);

      const list = res.data?.data || [];
      
      console.log('from transaction context -> fetch all transactions: ' ,res.data);
      // Sort newest first
      const sorted = [...list].sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
      );

      // Categorize
      const incomes = sorted.filter((tx) => tx.amount >= 0);
      const expenses = sorted.filter((tx) => tx.amount < 0);
      
      const balance = incomes.reduce((sum, i) => sum + i.amount, 0) +
      expenses.reduce((sum, e) => sum + e.amount, 0);
      
      console.log('from transaction context -> income: ' , incomes , 'expense: ' , expenses , 'balance: ', balance);
      dispatch({
        type: "SET_ALL_DATA",
        payload: {
          incomes,
          expenses,
          transactions: sorted,
          recentIncomes: incomes.slice(0, 5),
          recentExpenses: expenses.slice(0, 5),
          recentTransactions: sorted.slice(0, 5),
          balance,
        },
      });

    } catch (err) {
      console.error("Failed to load all transactions", err);
    }
  };

  // -------------------------------------------
  // Fetch categories
  // -------------------------------------------
  const fetchCategories = async () => {
    try {
      const res = await axiosConfig.get(API_ENDPOINTS.GET_ALL_CATEGORIES);
      console.log('from transaction context -> categories ' ,res.data);
      dispatch({ type: "SET_CATEGORIES", payload: res.data });
    } catch (err) {
      console.error("Failed to load categories", err);
    }
  };

  // First-time load
  useEffect(() => {
  //     const token = localStorage.getItem("token");
  // if (!token) return; // do nothing when logged out
    fetchCategories();
    fetchAllTransactions();
  }, []);

  return (
    <TransactionContext.Provider value={{
      state,
      dispatch,
      fetchAllTransactions,
    }}>
      {children}
    </TransactionContext.Provider>
  );
}
