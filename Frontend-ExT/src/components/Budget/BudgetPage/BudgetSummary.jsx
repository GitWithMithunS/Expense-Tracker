import EmptyState from "@/components/charts/EmptyState";

const BudgetSummary = ({ hasBudget, selectedMonth, formatMonth, totalBudget, currentBudget }) => {
  return (
    <div className="bg-white border rounded-xl shadow-sm p-6">
      <h2 className="text-lg font-semibold mb-4">{formatMonth(selectedMonth)} Overview</h2>

      {!hasBudget ? (
        <EmptyState message="Add your budget." type="list" />
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-purple-50 p-4 border border-purple-200 rounded-lg">
              <p className="text-gray-600 text-sm">Total Budget</p>
              <h2 className="text-2xl font-bold text-purple-700 mt-1">
                ₹{totalBudget.toLocaleString("en-IN")}
              </h2>
            </div>

            <div className="bg-red-50 p-4 border border-red-200 rounded-lg">
              <p className="text-gray-600 text-sm">Total Spent</p>
              <h2 className="text-2xl font-bold text-red-600 mt-1">
                ₹{currentBudget.totalSpent.toLocaleString("en-IN")}
              </h2>
            </div>

            <div className="bg-green-50 p-4 border border-green-200 rounded-lg">
              <p className="text-gray-600 text-sm">Remaining</p>
              <h2 className="text-2xl font-bold text-green-600 mt-1">
                ₹{(totalBudget - currentBudget.totalSpent).toLocaleString("en-IN")}
              </h2>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default BudgetSummary;
