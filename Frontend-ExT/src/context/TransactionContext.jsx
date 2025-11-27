import { createContext, useEffect, useReducer } from "react";
import axiosConfig from "../util/axiosConfig";
import { API_ENDPOINTS } from "../util/apiEnpoints";

export const TransactionContext = createContext();

const initialState = {
  balance: 0,
  incomes: [],
  expenses: [],
  transactions: [],
  categories: [],   // will be filled from Categories Page
};

function reducer(state, action) {
  switch (action.type) {
    
    case "SET_CATEGORIES":
      return { ...state, categories: action.payload };

    case "ADD_CATEGORY":
      return { ...state, categories: [...state.categories, action.payload] };

    case "UPDATE_CATEGORY":
      return {
        ...state,
        categories: state.categories.map((cat) =>
          cat.id === action.payload.id ? action.payload : cat
        ),
      };

    case "DELETE_CATEGORY":
      return {
        ...state,
        categories: state.categories.filter(
          (cat) => cat.id !== action.payload
        ),
      };

    case "ADD_INCOME": {
      const updatedBalance = state.balance + Number(action.payload.amount);

      const updatedIncomes = [action.payload, ...state.incomes].slice(0, 5);

      const updatedTransactions = [
        { ...action.payload, type: "income" },
        ...state.transactions
      ].slice(0, 5);

      return {
        ...state,
        balance: updatedBalance,
        incomes: updatedIncomes,
        transactions: updatedTransactions,
      };
    }

    case "ADD_EXPENSE": {
      const updatedBalance = state.balance - Number(action.payload.amount);

      const updatedExpenses = [action.payload, ...state.expenses].slice(0, 5);

      const updatedTransactions = [
        { ...action.payload, type: "expense" },
        ...state.transactions
      ].slice(0, 5);

      return {
        ...state,
        balance: updatedBalance,
        expenses: updatedExpenses,
        transactions: updatedTransactions,
      };
    }

    default:
      return state;
  }
}

export default function TransactionProvider({ children }) {
  
  const [state, dispatch] = useReducer(reducer, initialState);

  
  // ---------------------------------------------
  // GLOBAL FETCH FUNCTION (Called from anywhere)
  // ---------------------------------------------
  const fetchCategories = async () => {
    try {
      const response = await axiosConfig.get(API_ENDPOINTS.GET_ALL_CATEGORIES);

      dispatch({
        type: "SET_CATEGORIES",
        payload: response.data,
      });

      console.log("Categories loaded globally ", response.data);

    } catch (err) {
      console.log("Failed to load categories", err);
    }
  };

  //we will be adding income fetch and expense fetch also here itslef for the first time when user is authenticated

  // LOAD CATEGORIES WHEN APP STARTS
  useEffect(() => {
    console.log('first call from transcation context');
    fetchCategories();
  }, []);


  return (
    <TransactionContext.Provider value={{ state, dispatch }}>
      {children}
    </TransactionContext.Provider>
  );
}
