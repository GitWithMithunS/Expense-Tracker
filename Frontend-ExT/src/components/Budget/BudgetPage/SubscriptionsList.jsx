import EmptyState from "@/components/charts/EmptyState";

const SubscriptionsList = ({ filteredSubscriptions }) => {
  return (
    <div className="bg-white border rounded-xl shadow-sm p-6">
      <h2 className="text-lg font-semibold mb-4">Subscriptions</h2>

      {filteredSubscriptions.length === 0 ? (
        <EmptyState message="Add your subscriptions." type="list" />
      ) : (
        <div className="space-y-4">
          {filteredSubscriptions.map((sub, index) => (
            <div key={index} className="p-4 border rounded-lg shadow-sm bg-gray-50">
              <h3 className="font-semibold text-gray-800">{sub.name}</h3>
              <p className="text-sm text-gray-600">Amount: ₹{sub.amount}</p>
              <p className="text-sm text-gray-600">Renewal: {sub.renewalType}</p>
              <p className="text-sm text-gray-600">Start: {sub.startMonth}</p>
              <p className="text-sm text-gray-600">
                Ends: {sub.endMonth || "Auto-renewing"}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SubscriptionsList;
