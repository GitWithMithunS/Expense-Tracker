/* --------------------------------------------------------- */
/* ---------------------- TYPE SELECTOR --------------------- */
/* --------------------------------------------------------- */
import { PiggyBank, Wallet, Repeat, Plus, Trash2, X } from "lucide-react";


export const BudgetTypeSelector = ({ onClose, onSelect }) => {
  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">Select Budget Type</h2>
        <button onClick={onClose} className="text-gray-600 hover:text-black">
          <X size={20} />
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

        <OptionCard
          icon={<PiggyBank className="text-purple-600 mb-2" />}
          title="Saving Goal"
          desc="Track long-term savings"
          onClick={() => onSelect("saving-goal")}
        />

        <OptionCard
          icon={<Wallet className="text-purple-600 mb-2" />}
          title="Monthly Budget"
          desc="Plan expenses for this month"
          onClick={() => onSelect("monthly")}
        />

        <OptionCard
          icon={<Repeat className="text-purple-600 mb-2" />}
          title="Subscription"
          desc="Recurring apps & services"
          onClick={() => onSelect("subscription")}
        />
      </div>
    </div>
  );
};

const OptionCard = ({ icon, title, desc, onClick }) => (
  <div
    onClick={onClick}
    className="p-4 border rounded-lg hover:bg-purple-50 cursor-pointer text-center"
  >
    {icon}
    <h3 className="font-semibold">{title}</h3>
    <p className="text-sm text-gray-600">{desc}</p>
  </div>
);