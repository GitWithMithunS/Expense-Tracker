import EmptyState from "@/components/charts/EmptyState";

const GoalsList = ({ activeGoals }) => {
  return (
    <div className="bg-white border rounded-xl shadow-sm p-6">
      <h2 className="text-lg font-semibold mb-4">Saving Goals (Active this month)</h2>

      {activeGoals.length === 0 ? (
        <EmptyState message="Add your monthly goals." type="list" />
      ) : (
        <div className="grid md:grid-cols-2 gap-6">
          {activeGoals.map((goal) => {
            return (
              <div key={goal.id} className="p-4 rounded-lg border shadow-sm bg-white">
                <h3 className="font-semibold text-gray-800">{goal.goalName}</h3>

                <p className="text-sm text-gray-500 mt-1">Target: ₹{goal.target}</p>

                <div className="mt-3 bg-gray-200 h-2 rounded-full">
                  <div
                    className="bg-green-500 h-full rounded-full"
                    style={{
                      width: `${Math.min((goal.saved / goal.target) * 100, 100)}%`,
                    }}
                  ></div>
                </div>

                <p className="text-sm font-medium text-green-700 mt-2">
                  ₹{goal.saved.toLocaleString("en-IN")} saved
                </p>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default GoalsList;
