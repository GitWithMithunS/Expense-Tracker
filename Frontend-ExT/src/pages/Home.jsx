import React, { useContext, useState, useEffect } from "react";
import Dashboard from "../components/common/Dashboard";
import OverviewSection from "../components/home/OverviewSection";
import TotalBalanceCard from "../components/home/TotalBalanceCard";
import IncomeSection from "../components/home/IncomeSection";
import ExpenseSection from "../components/home/ExpenseSection";
import HomeBudgetSection from "../components/home/HomeBudgetSection";

import { TransactionContext } from "../context/TransactionContext";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const navigate = useNavigate();
  const { state } = useContext(TransactionContext);

  const [recentIncome, setRecentIncome] = useState([]);
  const [recentExpense, setRecentExpense] = useState([]);
  const [allTransactions, setAllTransactions] = useState([]);

  // Update when context changes
  useEffect(() => {
    setAllTransactions(state.recentTransactions);
    setRecentIncome(state.recentIncomes);
    setRecentExpense(state.recentExpenses);
  }, [state]);

  // TOTALS
  const totalIncome = allTransactions
    .filter((tx) => tx.type === "income")
    .reduce((s, tx) => s + Number(tx.amount), 0);

  const totalExpense = allTransactions
    .filter((tx) => tx.type === "expense")
    .reduce((s, tx) => s + Number(tx.amount), 0);

  const balance = totalIncome - totalExpense;

  return (
    <Dashboard activeMenu="Dashboard">
      <div className="my-5 mx-auto space-y-6">

        <OverviewSection />

        <TotalBalanceCard balance={balance} />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
          <IncomeSection recentIncome={recentIncome} navigate={navigate} />
          <ExpenseSection recentExpense={recentExpense} navigate={navigate} />
        </div>

        <HomeBudgetSection />

      </div>
    </Dashboard>
  );
};

export default Home;
