import AddBudgetMasterForm from "@/components/Budget/AddBudgetForm";

const AddBudgetModal = ({
  show,
  selectedMonth,
  onClose,
  onSaveBudget,
  onSaveGoal,
  onSaveSubscription,
}) => {
  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white w-full max-w-2xl p-8 rounded-xl shadow-lg">
        <AddBudgetMasterForm
          selectedMonth={selectedMonth}
          onClose={onClose}
          onSaveBudget={onSaveBudget}
          onSaveGoal={onSaveGoal}
          onSaveSubscription={onSaveSubscription}
        />
      </div>
    </div>
  );
};

export default AddBudgetModal;
