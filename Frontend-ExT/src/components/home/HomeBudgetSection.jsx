import BudgetStatus from "@/components/Budget/BudgetStatus";
import BudgetStatusCard from "@/components/Budget/BudgetStatusCard";

export default function HomeBudgetSection() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="bg-white p-6 rounded-xl border shadow-sm">
        <BudgetStatus />
      </div>

      <BudgetStatusCard />
    </div>
  );
}
