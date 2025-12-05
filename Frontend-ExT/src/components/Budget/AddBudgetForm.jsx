import React, { useState } from "react";
import {BudgetTypeSelector} from "./BudgetTypeSelector"
import {MonthlyBudgetForm} from "./MonthlyBudgetForm"
import { SavingGoalForm } from "./SavingGoalForm";
import { SubscriptionForm } from "./SubscriptionForm";

const AddBudgetMasterForm = ({
  selectedMonth,
  onClose,
  onSaveBudget,
  onSaveGoal,
  onSaveSubscription
}) => {
  const [selectedType, setSelectedType] = useState(null);

  return (
    <div className="space-y-6">
      {/* ---------------------- */}
      {/* STEP 1: TYPE SELECTOR  */}
      {/* ---------------------- */}
      {!selectedType && (
        <BudgetTypeSelector
          onClose={onClose}
          onSelect={(type) => setSelectedType(type)}
        />
      )}

      {/* ---------------------- */}
      {/* STEP 2: MONTHLY BUDGET */}
      {/* ---------------------- */}
      {selectedType === "monthly" && (
        <MonthlyBudgetForm
          selectedMonth={selectedMonth}
          onClose={onClose}
          onSave={onSaveBudget}
        />
      )}

      {/* ---------------------- */}
      {/* STEP 3: SAVING GOAL    */}
      {/* ---------------------- */}
      {selectedType === "saving-goal" && (
        <SavingGoalForm
          onClose={onClose}
          onSave={onSaveGoal}
        />
      )}

      {/* ---------------------- */}
      {/* STEP 4: SUBSCRIPTION   */}
      {/* ---------------------- */}
      {selectedType === "subscription" && (
        <SubscriptionForm
          selectedMonth={selectedMonth}
          onClose={onClose}
          onSave={onSaveSubscription}
        />
      )}
    </div>
  );
};

export default AddBudgetMasterForm;