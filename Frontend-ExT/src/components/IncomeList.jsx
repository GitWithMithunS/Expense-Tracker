import { Download, Mail } from "lucide-react";
import React from "react";
import TransactionInfoCard from "./TransactionInfoCard";
import moment from "moment";

const IncomeList = ({ transactions , onDelete}) => {

  
  return (
    <div className="card p-4 bg-white border border-gray-200 rounded-xl shadow-sm">
      
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <h4 className="text-lg font-semibold text-gray-800">Income Sources</h4>

        <div className="flex items-center gap-3">
          <button className="px-3 py-1.5 rounded-lg flex items-center gap-1
                             bg-green-500/20 border border-green-400
                             text-green-800 font-medium shadow-sm
                             hover:bg-green-500/30 transition-all">
            <Mail size={15} />
            Email
          </button>

          <button className="px-3 py-1.5 rounded-lg flex items-center gap-1
                             bg-blue-500/20 border border-blue-400
                             text-blue-800 font-medium shadow-sm
                             hover:bg-blue-500/30 transition-all">
            <Download size={15} />
            Download
          </button>
        </div>
      </div>

      {/* List */}
      <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 gap-4">
        {transactions?.map((income) => (
          <TransactionInfoCard
            key={income.id}
            title={income.name}
            icon={income.icon}
            date={moment(income.date).format("Do MMM YYYY")}
            amount={income.amount}
            type="income"
            onDelete={() => onDelete(income)}   
          />
        ))}
      </div>
    </div>
  );
};

export default IncomeList;
