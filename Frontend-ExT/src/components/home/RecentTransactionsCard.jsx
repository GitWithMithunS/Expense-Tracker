import React from "react";
import { TrendingUp, TrendingDown } from "lucide-react";
import EmptyState from "@/components/charts/EmptyState";
import TransactionInfoCard from "../common/TransactionInfoCard";
import moment from "moment";

export default function RecentTransactionsCard({ recentTransactions }) {
    console.log('revent transactions -> ' , recentTransactions);
  return (
    <div className="bg-white rounded-xl shadow-lg border border-blue-300 p-4">

      <h3 className="text-lg font-semibold mb-4">Recent Transactions</h3>

      {recentTransactions.length === 0 ? (
        <div className="h-94 flex items-center justify-center">
          <EmptyState message="No recent transactions." type="list" />
        </div>
      ) : (
        // <ul className="space-y-3">
        //   {recentTransactions.map((tx) => {
        //     const isIncome = tx.type === "income";

        //     return (
        //       <li
        //         key={tx.id}
        //         className="flex items-center justify-between p-4 rounded-xl
        //           bg-white border border-gray-200 shadow-sm hover:shadow-md
        //           transition-all"
        //       >
        //         {/* LEFT */}
        //         <div className="flex items-center gap-4">
        //           <div className="w-12 h-12 flex items-center justify-center 
        //             bg-gray-100 rounded-full text-2xl shadow-sm">
        //             <span>{tx.icon}</span>
        //           </div>

        //           <div className="flex flex-col">
        //             <p className="text-gray-900 font-semibold text-sm">
        //               {tx.categoryName}
        //             </p>
        //             <p className="text-gray-500 text-xs">
        //               {new Date(tx.date).toLocaleDateString("en-GB", {
        //                 day: "2-digit",
        //                 month: "short",
        //                 year: "numeric",
        //               })}
        //             </p>
        //           </div>
        //         </div>

        //         {/* RIGHT */}
        //         <div
        //           className={`px-3 py-1.5 rounded-lg text-sm font-semibold shadow-sm flex items-center gap-2 border 
        //             ${isIncome
        //               ? "bg-green-100 text-green-700 border-green-300"
        //               : "bg-red-100 text-red-700 border-red-300"
        //             }`}
        //         >
        //           {isIncome ? "+" : "-"} ₹{tx.amount}
        //           {isIncome ? (
        //             <TrendingUp size={16} className="text-green-700" />
        //           ) : (
        //             <TrendingDown size={16} className="text-red-700" />
        //           )}
        //         </div>
        //       </li>
        //     );
        //   })}
        // </ul>

        <div className="space-y-4">
      {recentTransactions && recentTransactions.map((t) => (
        <TransactionInfoCard
          key={t.id}
          icon={t.icon}
          title={t.name}
          date={moment(t.createdAt).format("Do MMM YYYY")}
          amount={Math.abs(t.amount)}
          type={t.type === "income" ? "income" : "expense"}
          categoryName={t.categoryName}
          page ='home'
        />
      ))}
    </div>
      )}
    </div>
  );
}
