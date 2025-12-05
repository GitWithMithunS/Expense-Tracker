import moment from "moment";
import EmptyState from "../charts/EmptyState";
import TransactionInfoCard from "../common/TransactionInfoCard";

export default function ResultsList({ loading, transactions }) {
    // console.log( 'from reults list ....transaction->' ,  transactions)
  if (loading)
    return <p className="text-gray-500 text-center py-10">Loading...</p>;

  if (!transactions.length)
    return <EmptyState message="No transactions found." type="list" />;

  return (
    <div className="space-y-4">
      {transactions && transactions.map((t) => (
        <TransactionInfoCard
          key={t.id}
          icon={t.categoryEmoji}
          title={t.title}
          date={moment(t.createdAt).format("Do MMM YYYY")}
          amount={Math.abs(t.amount)}
          type={t.categoryType === "INCOME" ? "income" : "expense"}
          categoryName={t.categoryName}
          page='filter'
        />
      ))}
    </div>
  );
}
