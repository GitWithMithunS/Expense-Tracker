import { ChevronsLeft } from "lucide-react";

export default function CalendarLeftPanel({
  leftOpen,
  setLeftOpen,
  baseTransactions
}) {
  return (
    <div
      className={`transition-all duration-300 ease-in-out bg-gray-50 border-r border-gray-100 overflow-y-auto
      ${leftOpen ? "w-80 p-5" : "w-12 p-3 flex items-center justify-center"}
      `}
    >
      {leftOpen ? (
        <div className="flex flex-col h-full">
          {/* HEADER */}
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">This Month</h3>
            <button className="p-2 rounded hover:bg-gray-100" onClick={() => setLeftOpen(false)}>
              <ChevronsLeft size={18} />
            </button>
          </div>

          {/* LIST */}
          <div className="space-y-3 pr-1">
            {baseTransactions.length === 0 && (
              <p className="text-sm text-gray-500">No data for this month</p>
            )}

            {baseTransactions.slice(0, 50).map((u) => (
              <div
                key={u.id}
                className="p-3 bg-white border rounded shadow-sm flex justify-between items-start"
              >
                <div className="flex-1">
                  <p className="text-sm text-gray-500">{u.date}</p>
                  <div className="flex items-center justify-between gap-2">
                    <h4 className="font-medium">{u.name}</h4>
                    <span
                      className={`text-sm font-semibold ${
                        u.type === "income" ? "text-green-600" : "text-red-600"
                      }`}
                    >
                      {u.type === "income" ? `+₹${u.amount}` : `-₹${u.amount}`}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <button
          className="p-2 rounded-full hover:bg-gray-100"
          onClick={() => setLeftOpen(true)}
        >
          ➤
        </button>
      )}
    </div>
  );
}
