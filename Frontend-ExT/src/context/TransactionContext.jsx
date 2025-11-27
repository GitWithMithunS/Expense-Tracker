import { createContext, useReducer } from "react";

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

  return (
    <TransactionContext.Provider value={{ state, dispatch }}>
      {children}
    </TransactionContext.Provider>
  );
}
