import EmptyState from "@/components/charts/EmptyState";
import TransactionInfoCard from "@/components/common/TransactionInfoCard";
import { TrendingDown } from "lucide-react";
import moment from "moment";

export default function ExpenseSection({ recentExpense, navigate }) {
  return (
    <div className="bg-white rounded-xl shadow-lg border flex flex-col overflow-hidden p-4 border-red-300">

      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <span className="text-gray-700 font-semibold text-xl">Expense</span>

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

      {/* List */}
      <ul className="space-y-3 pr-2">
        {!recentExpense?.length ? (
          <EmptyState message="Add your first expense." type="list" />
        ) : (
          recentExpense.map((expense) => (
            <TransactionInfoCard
              key={expense.id}
              title={expense.name}
              icon={expense.icon}
              date={moment(expense.date).format("Do MMM YYYY")}
              amount={expense.amount}
              categoryName={expense.categoryName}
              page="home"
              type="expense"
            />
          ))
        )}
      </ul>

    </div>
  );
}
