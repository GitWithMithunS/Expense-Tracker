import React, { useContext, useEffect, useState } from "react";
import { TransactionContext } from "@/context/TransactionContext";
import SummaryCards from "./SummaryCards";
import PieChartCard from "./PieChartCard";
import RecentTransactionsCard from "./RecentTransactionsCard";


const OverviewSection = () => {
  const [transactions, setTransactions] = useState([]);
  const { state } = useContext(TransactionContext);

  useEffect(() => {
    setTransactions(state.transactions);
  }, [state]);

  // TOTALSE
  const totalIncome = transactions
    .filter((t) => t.type === "income")
    .reduce((sum, t) => sum + Number(t.amount), 0);

  const totalExpense = transactions
    .filter((t) => t.type === "expense")
    .reduce((sum, t) => sum + Number(t.amount), 0);

  const balance = totalIncome - totalExpense;

  // DAILY LIMIT
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth();
  const totalDaysInMonth = new Date(year, month + 1, 0).getDate();
  const today = now.getDate();
  const daysRemaining = totalDaysInMonth - today;

  const dailySpendLimit =
    daysRemaining > 0 ? Math.max(0, balance / daysRemaining) : 0;

  // RECENT TRANSACTIONS
  const recentTransactions = transactions
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, 5);

  return (
    <div className="w-full bg-white p-6 rounded-xl shadow-lg">

      <h3 className="text-xl font-semibold mb-6">Financial Overview</h3>

      <SummaryCards
        totalIncome={totalIncome}
        totalExpense={totalExpense}
        dailySpendLimit={dailySpendLimit}
        daysRemaining={daysRemaining}
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <PieChartCard
          totalIncome={totalIncome}
          totalExpense={totalExpense}
          balance={balance}
        />

        <RecentTransactionsCard recentTransactions={recentTransactions} />
      </div>

    </div>
  );
};

export default OverviewSection;
