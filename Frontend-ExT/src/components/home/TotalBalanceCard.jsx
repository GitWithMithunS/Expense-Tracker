export default function TotalBalanceCard({ balance }) {
  const isPositive = balance > 0;

  return (
    <div className="bg-white p-6 rounded-xl shadow-lg border border-blue-300">
      <h2 className="text-lg font-semibold text-gray-700">Total Balance</h2>

      <p
        className={`text-3xl font-bold mt-2 ${
          isPositive ? "text-green-600" : "text-red-600"
        }`}
      >
        ₹{balance.toLocaleString("en-IN")}
      </p>
    </div>
  );
}
