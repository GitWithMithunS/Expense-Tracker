import { Box, Download, Mail, Package } from "lucide-react";
import React, { useState, useEffect } from "react";
import TransactionInfoCard from "../common/TransactionInfoCard";
import moment from "moment";
import EmptyState from "../charts/EmptyState";

const IncomeList = ({
  transactions,
  onDelete,
  onEmail,
  onDownloadExcel,
  onDownloadCSV,
  onDownloadPDF
}) => {

  const [showDownloadMenu, setShowDownloadMenu] = useState(false);

  // Close dropdown when clicked outside
  useEffect(() => {
    const handleClickOutside = () => setShowDownloadMenu(false);
    window.addEventListener("click", handleClickOutside);

    return () => window.removeEventListener("click", handleClickOutside);
  }, []);


  return (
    <div className="card p-4 bg-white border border-gray-200 rounded-xl shadow-sm">

      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <h4 className="text-lg font-semibold text-gray-800">Income Sources</h4>

        <div className="flex items-center gap-3">

          {/* Email Button */}
          <button
            onClick={onEmail}
            className="cursor-pointer px-3 py-1.5 rounded-lg flex items-center gap-1
               bg-green-500/20 border border-green-400
               text-green-800 font-medium shadow-sm
               hover:bg-green-500/30 transition-all"
          >
            <Mail size={15} />
            Email
          </button>

          {/* DOWNLOAD DROPDOWN */}
          <div className="relative" onClick={(e) => e.stopPropagation()}>
            <button
              onClick={() => setShowDownloadMenu((prev) => !prev)}
              className="cursor-pointer px-3 py-1.5 rounded-lg flex items-center gap-1
                 bg-blue-500/20 border border-blue-400
                 text-blue-800 font-medium shadow-sm
                 hover:bg-blue-500/30 transition-all"
            >
              <Download size={15} />
              Download
            </button>

            {/* DROPDOWN MENU */}
            {showDownloadMenu && (
              <div
                className="absolute right-0 mt-2 w-40 bg-white border border-gray-200 
                           rounded-lg shadow-md z-50 animate-fadeIn"
              >
                <button
                  onClick={() => {
                    setShowDownloadMenu(false);
                    onDownloadExcel();
                  }}
                  className="cursor-pointer w-full text-left px-4 py-2 hover:bg-gray-100 border-b"
                >
                  Excel (.xlsx)
                </button>

                <button
                  onClick={() => {
                    setShowDownloadMenu(false);
                    onDownloadCSV();
                  }}
                  className="cursor-pointer w-full text-left px-4 py-2 hover:bg-gray-100 border-b"
                >
                  CSV (.csv)
                </button>

                <button
                  onClick={() => {
                    setShowDownloadMenu(false);
                    onDownloadPDF();
                  }}
                  className="cursor-pointer w-full text-left px-4 py-2 hover:bg-gray-100"
                >
                  PDF (.pdf)
                </button>
              </div>
            )}
          </div>

        </div>
      </div>

      {/* List */}
      {(transactions && transactions.length !== 0) ?
        (<div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 gap-4">
          {Array.isArray(transactions) &&
            transactions.map((income) => (
              <TransactionInfoCard
                key={income.id}
                title={income.name}
                icon={income.icon}
                date={moment(income.date).format("Do MMM YYYY")}
                amount={income.amount}
                categoryName={income.categoryName}
                type="income"
                onDelete={() => onDelete(income)}
              />
            ))}
        </div>) : (
          <div className="card p-4 bg-white border border-gray-200 rounded-xl shadow-sm">
            <EmptyState message="No income entries yet." />
          </div>
        )}
    </div>
  );
};

export default IncomeList;
