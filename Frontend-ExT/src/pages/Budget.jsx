import React, { useEffect, useState, useMemo } from "react";
import Dashboard from "../../src/components/common/Dashboard";

import axiosConfig from "../util/axiosConfig";
import { API_ENDPOINTS } from "../util/apiEnpoints";
import { TrendingUp, TrendingDown, Calendar, Plus } from "lucide-react";
import AddBudgetMasterForm from "../components/home/AddBudgetForm";
import Model from "@/components/common/Model";
import EmptyState from "@/components/charts/EmptyState";
import BudgetHeader from "@/components/Budget/BudgetPage/BudgetHeader";
import BudgetSummary from "@/components/Budget/BudgetPage/BudgetSummary";
import CategoryBreakdown from "@/components/Budget/BudgetPage/CategoryBreakdown";
import SubscriptionsList from "@/components/Budget/BudgetPage/SubscriptionsList";
import GoalsList from "@/components/Budget/BudgetPage/GoalsList";
import AddBudgetModal from "@/components/Budget/BudgetPage/AddBudgetModal";

const Budget = () => {
    // ----------------------------------------
    // MONTH SELECTION (Next 12 months only)
    // ----------------------------------------

    const generateUpcomingMonths = () => {
        const arr = [];
        const now = new Date();
        for (let i = 0; i < 12; i++) {
            const m = new Date(now.getFullYear(), now.getMonth() + i, 1);
            arr.push(m.toISOString().slice(0, 7));
        }
        return arr;
    };




    const upcomingMonths = generateUpcomingMonths();
    const [selectedMonth, setSelectedMonth] = useState(upcomingMonths[0]);
    const [subscriptions, setSubscriptions] = useState([]);
    const [categoryBudgets, setCategoryBudgets] = useState([]);

    // ----------------------------------------
    // API STATES
    // ----------------------------------------
    const [budgets, setBudgets] = useState([]);
    const [goals, setGoals] = useState([]);
    const [showAddBudget, setShowAddBudget] = useState(false);

    const filteredSubscriptions = useMemo(() => {
        return subscriptions.filter((sub) => {
            // must start before or on selected month
            const starts = sub.startMonth <= selectedMonth;

            // if no endMonth → infinite subscription
            if (!sub.endMonth || sub.endMonth === "") return starts;

            // must end on or after selected month
            const ends = sub.endMonth >= selectedMonth;

            return starts && ends;
        });
    }, [subscriptions, selectedMonth]);

    // ----------------------------------------
    // Current month budget
    // ----------------------------------------
    const currentBudget = useMemo(
        () => budgets.find((b) => b.month === selectedMonth),
        [budgets, selectedMonth]
    );


    const hasBudget = Boolean(currentBudget);

    const totalBudget = currentBudget?.totalBudget || 0;
    const categories = categoryBudgets;


    const categorySpent = currentBudget?.spentByCategory || {};

    // ----------------------------------------
    // Savings Goals Filter – Show goals active in selected month
    // ----------------------------------------
    const getGoalEndMonth = (goal) => {
        if (!goal.timeLimit) return null; // no limit → show always
        const [y, m] = goal.startMonth.split("-").map(Number);
        const end = new Date(y, m - 1 + goal.timeLimit, 1);
        return end.toISOString().slice(0, 7);
    };

    const activeGoals = goals.filter((g) => {
        const endMonth = getGoalEndMonth(g);
        if (!endMonth) return true;
        return selectedMonth <= endMonth;
    });

    // ----------------------------------------
    // Month Readable Format
    // ----------------------------------------
    const formatMonth = (m) => {
        const [y, mo] = m.split("-");
        return new Date(y, mo - 1).toLocaleString("en-US", { month: "long", year: "numeric" });
    };

    const handleSaveBudget = (newBudget) => {
        console.log("✔ Budget saved:", newBudget);

        // Insert new budget into existing budgets list
        setBudgets((prev) => [...prev, newBudget]);

        setShowAddBudget(false);
    };

    // SAVE SAVING GOAL
    const handleSaveGoal = (newGoal) => {
        console.log("✔ Saving Goal saved:", newGoal);

        // append to goals state
        setGoals((prev) => [...prev, newGoal]);

        setShowAddBudget(false);
    };


    // SAVE SUBSCRIPTION
    const handleSaveSubscription = (newSubscription) => {
        console.log("✔ Subscription saved:", newSubscription);

        setSubscriptions((prev) => [...prev, newSubscription]);

        setShowAddBudget(false);
    };


    // ----------------------------------------
    // UI STARTS HERE
    // ----------------------------------------
    return (
    <Dashboard activeMenu="Budget">
      <div className="p-6 space-y-10">
        
        <BudgetHeader
          selectedMonth={selectedMonth}
          setSelectedMonth={setSelectedMonth}
          upcomingMonths={upcomingMonths}
          formatMonth={formatMonth}
        />

        <BudgetSummary
          hasBudget={hasBudget}
          selectedMonth={selectedMonth}
          totalBudget={totalBudget}
          currentBudget={currentBudget}
          formatMonth={formatMonth}
        />

        {hasBudget && <CategoryBreakdown categories={categoryBudgets} />}

        <GoalsList activeGoals={activeGoals} />

        <SubscriptionsList filteredSubscriptions={filteredSubscriptions} />

        <AddBudgetModal
          show={showAddBudget}
          selectedMonth={selectedMonth}
          onClose={() => setShowAddBudget(false)}
          onSaveBudget={handleSaveBudget}
          onSaveGoal={handleSaveGoal}
          onSaveSubscription={handleSaveSubscription}
        />
      </div>
    </Dashboard>
  );
};

export default Budget;
