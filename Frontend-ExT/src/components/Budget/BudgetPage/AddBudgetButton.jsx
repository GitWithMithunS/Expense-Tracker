import { Plus } from "lucide-react";

const AddBudgetButton = ({ hasBudget, onClick }) => {
  return (
    <div className="flex justify-end">
      <button
        disabled={hasBudget}
        onClick={onClick}
        className={`px-4 py-2 rounded-lg flex items-center gap-2 text-white
          ${hasBudget ? "bg-gray-400 cursor-not-allowed" : "bg-purple-600 hover:bg-purple-700"}
        `}
      >
        <Plus size={18} /> Create Budget
      </button>
    </div>
  );
};

export default AddBudgetButton;
