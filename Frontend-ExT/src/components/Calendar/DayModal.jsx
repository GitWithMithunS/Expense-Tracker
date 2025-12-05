import { X } from "lucide-react";

export default function DayModal({ selectedDate, transactions, onClose }) {
  return (
    <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-50">
      <div className="bg-white rounded-lg shadow-lg p-4 w-96 border">
        
        <div className="flex items-center justify-between mb-2">
          <div>
            <div className="text-sm text-gray-500">{selectedDate}</div>
            <h3 className="font-semibold">Transactions</h3>
          </div>
          <button className="text-gray-600 hover:text-black" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        <div className="max-h-56 overflow-y-auto space-y-3">
          {transactions.length === 0 ? (
            <div className="text-sm text-gray-500">
              No transactions on this date.
            </div>
          ) : (
            transactions.map((tx) => (
              <div key={tx.id} className="flex items-center justify-between p-3 border rounded">
                <div className="flex-1 pr-2">
                  <div className="flex items-center gap-2">
                    <div
                      className={`w-2 h-2 rounded-full ${
                        tx.type === "income" ? "bg-green-500" : "bg-red-500"
                      }`}
                    />
                    <div className="text-sm font-medium">{tx.name || tx.category}</div>
                  </div>
                </div>
                <div
                  className={`font-semibold ${
                    tx.type === "income" ? "text-green-600" : "text-red-600"
                  }`}
                >
                  {tx.type === "income" ? `+₹${tx.amount}` : `-₹${tx.amount}`}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
