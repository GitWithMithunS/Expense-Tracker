import EmptyState from "@/components/charts/EmptyState";
import TransactionInfoCard from "@/components/common/TransactionInfoCard";
import { TrendingUp } from "lucide-react";
import moment from "moment";

export default function IncomeSection({ recentIncome, navigate }) {

  return (
    <div className="bg-white rounded-xl shadow-lg border flex flex-col overflow-hidden p-4 border-green-300">

      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <span className="text-gray-700 font-semibold text-xl">Income</span>

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

      {/* List */}
      <ul className="space-y-3 pr-2">
        {!recentIncome?.length ? (
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
            />
          ))
        )}
      </ul>

    </div>
  );
}
