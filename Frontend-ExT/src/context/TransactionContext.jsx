import { createContext, useReducer, useEffect, useState } from "react";
import axiosConfig from "../util/axiosConfig";
import { API_ENDPOINTS } from "../util/apiEnpoints";
import { useNavigate } from "react-router-dom";

export const TransactionContext = createContext();


const initialState = {
  balance: 0,

  incomes: [],
  expenses: [],
  transactions: [],

  recentIncomes: [],
  recentExpenses: [],
  recentTransactions: [],

  categories: [],
};



// Helper: Normalize backend transaction → frontend format
const normalizeTransaction = (tx) => ({
  id: tx.id,
  amount: Math.abs(tx.amount),
  date: tx.createdAt,
  name: tx.title || tx.categoryName,
  icon: tx.categoryEmoji,
  categoryName: tx.categoryName,
  type: tx.amount >= 0 ? "income" : "expense"
});


// REDUCER
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
      const tx = normalizeTransaction(action.payload);

      return {
        ...state,
        incomes: [tx, ...state.incomes],
        recentIncomes: [tx, ...state.recentIncomes].slice(0, 5),
        recentTransactions: [tx, ...state.recentTransactions].slice(0, 5),
        balance: state.balance + tx.amount,
      };
    }

    case "ADD_EXPENSE": {
      const tx = normalizeTransaction(action.payload);

      return {
        ...state,
        expenses: [tx, ...state.expenses],
        recentExpenses: [tx, ...state.recentExpenses].slice(0, 5),
        recentTransactions: [tx, ...state.recentTransactions].slice(0, 5),
        balance: state.balance + tx.amount,
      };
    }

    case "DELETE_TRANSACTION": {
      return {
        ...state,
        incomes: state.incomes.filter((t) => t.id !== action.payload),
        expenses: state.expenses.filter((t) => t.id !== action.payload),
        transactions: state.transactions.filter((t) => t.id !== action.payload),
        recentTransactions: state.recentTransactions.filter(
          (t) => t.id !== action.payload
        ),
        recentIncomes: state.recentIncomes.filter((t) => t.id !== action.payload),
        recentExpenses: state.recentExpenses.filter((t) => t.id !== action.payload),
      };
    }

    case "RESET":
      return initialState;


    default:
      return state;
  }
}



// PROVIDER
export default function TransactionProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState);
  const [notification, setNotifications] = useState([]);


  // ----------------------------------------------------
  // Fetch ALL transactions → Normalize → Store globally
  // ----------------------------------------------------
  const fetchAllTransactions = async () => {
    try {
      const res = await axiosConfig.get(API_ENDPOINTS.GET_ALL_TRANSACTIONS);

      const list = res.data?.data || [];

      console.log('from fecth transaction context before normalization', res);


      // Normalize backend fields
      const normalized = list.map(normalizeTransaction);

      // Sort newest first
      const sorted = [...normalized].sort(
        (a, b) => new Date(b.date) - new Date(a.date)
      );

      const incomes = sorted.filter((tx) => tx.type === "income");
      const expenses = sorted.filter((tx) => tx.type === "expense");

      const balance =
        incomes.reduce((sum, i) => sum + i.amount, 0) +
        expenses.reduce((sum, e) => sum + e.amount, 0);

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
      console.log('from fecth transaction context', incomes);
    } catch (err) {
      console.error("Failed to load transactions", err);
    }
  };


  // ----------------------------------------------------
  // Fetch Categories ONLY once
  // ----------------------------------------------------
  const fetchCategories = async () => {
    try {
      const res = await axiosConfig.get(API_ENDPOINTS.GET_ALL_CATEGORIES);
      dispatch({ type: "SET_CATEGORIES", payload: res.data });
    } catch (err) {
      console.error("Failed to load categories", err);
    }
  };

  //  // FETCH NOTIFICATIONS (API)
  // const fetchNotifications = async () => {
  //   try {
  //     const res = await axiosConfig.get("/notifications");
  //     setNotifications(res.data.data);   // backend gives {status, message, data: []}
  //   } catch (err) {
  //     console.error("Failed to fetch notifications", err);
  //   }
  // };

  // Initial Load
  useEffect(() => {
    if (!localStorage.getItem('token')) {
      // navigate('/login');
      return;
    }
    fetchCategories();
    fetchAllTransactions();
    // fetchNotifications();
  }, []);

  const logout = () => {
    localStorage.removeItem("token");
    dispatch({ type: "RESET" });
  };


  return (
    <TransactionContext.Provider
      value={{
        state,
        dispatch,
        fetchAllTransactions,
        logout,
      }}
    >
      {children}
    </TransactionContext.Provider>
  );
}
