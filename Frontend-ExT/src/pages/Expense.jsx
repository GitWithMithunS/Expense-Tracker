import React, { useEffect, useState } from "react";
import Dashboard from "../components/common/Dashboard";
import { API_ENDPOINTS } from "../util/apiEnpoints";
import axiosConfig from "../util/axiosConfig";
import { showErrorToast, showSuccessToast } from "../components/common/CustomToast";

import LineChartComponent from '../components/charts/LineChartComponent';
import BarChartComponent from '../components/charts/BarChartComponent';
import PieChartComponent from '../components/charts/PieChartComponent';

import ExpenseList from "../components/expense/ExpenseList";
import Model from "../components/common/Model";
import AddExpenseForm from "../components/expense/AddExpenseForm";
import ConfirmDelete from "../components/common/ConfirmDelete";

import {
  generateExcelBlob,
  exportToPDF,
  exportToCSV,
  exportToExcel,
} from "../util/excelUtils";

const Expense = () => {
  const [expenseData, setExpenseData] = useState([]);
  const [categories, setCategories] = useState([]);

  const [openAddExpenseModal, setOpenAddExpenseModal] = useState(false);
  const [openDeleteAlert, setOpenDeleteAlert] = useState({
    show: false,
    data: null,
  });

  /* --------------------------------------------
    FETCH ALL EXPENSES
  -------------------------------------------- */
  const fetchExpenseDetails = async () => {
    console.log(" Fetching expense details...");
    try {
      const response = await axiosConfig.get(API_ENDPOINTS.GET_ALL_EXPENSE);
      console.log("✔ Expense list fetched:", response.data);
      setExpenseData(response.data);
    } catch (err) {
      showErrorToast("Failed to load expenses");
      console.log(
        "Expense fetch error:",
        err.response?.data?.message || err.message
      );
    }
  };

  /* --------------------------------------------
    FETCH CATEGORIES FOR EXPENSE
  -------------------------------------------- */
  const fetchExpenseCategories = async () => {
    console.log("Fetching expense categories...");
    try {
      const response = await axiosConfig.get(
        API_ENDPOINTS.CATEGORY_BY_TYPE("expense")
      );
      console.log("✔ Expense categories fetched:", response.data);
      setCategories(response.data);
    } catch (err) {
      showErrorToast("Failed to load categories");
      console.log(
        " Expense category fetch error:",
        err.response?.data?.message || err.message
      );
    }
  };


  // initial loading once the page is rendered for the first time
  useEffect(() => {
    fetchExpenseDetails();
    fetchExpenseCategories();
  }, []);

  /* --------------------------------------------
    ADD EXPENSE
  -------------------------------------------- */
  const handleAddExpense = async (data) => {
    console.log(" Adding new expense:", data);
    try {
      await axiosConfig.post(API_ENDPOINTS.ADD_EXPENSE, data);
      console.log("✔ Expense added successfully");
      await fetchExpenseDetails();
      showSuccessToast("Expense added");
    } catch (err) {
      showErrorToast("Failed to add expense");
      console.log(
        " Add expense error:",
        err.response?.data?.message || err.message
      );
    }
  };

  /* --------------------------------------------
    DELETE EXPENSE
  -------------------------------------------- */
  const handleDeleteExpense = async (expense) => {
    console.log("🗑 Deleting expense:", expense);
    try {
      await axiosConfig.delete(API_ENDPOINTS.DELETE_EXPENSE(expense.id));
      console.log("✔ Expense deleted");
      await fetchExpenseDetails();
      showSuccessToast("Expense deleted");
    } catch (err) {
      showErrorToast("Failed to delete expense");
      console.log(
        " Delete expense error:",
        err.response?.data?.message || err.message
      );
    }
  };


  // DOWNLOAD: EXCEL / CSV / PDF
  const handleDownloadExpenseExcel = () => {
    console.log("⬇ Excel download clicked");
    if (!expenseData.length) {
      showErrorToast("No expense data to download");
      return;
    }
    exportToExcel(expenseData, 'expense');
    showSuccessToast("Expense Excel downloaded");
  };

  const handleDownloadExpenseCSV = () => {
    console.log("⬇ CSV download clicked");
    if (!expenseData.length) {
      showErrorToast("No expense data to download");
      return;
    }
    exportToCSV(expenseData, 'expense');
    showSuccessToast("Expense CSV downloaded");
  };

  const handleDownloadExpensePDF = () => {
    console.log("⬇ PDF download clicked");
    if (!expenseData.length) {
      showErrorToast("No expense data to download");
      return;
    }
    exportToPDF(expenseData, 'expense');
    showSuccessToast("Expense PDF downloaded");
  };

  /* --------------------------------------------
    EMAIL EXPENSE REPORT (Mock mode)
  -------------------------------------------- */
  const handleEmailExpenseDetails = async () => {
    console.log(" Preparing email report...");
    try {
      const excelBlob = generateExcelBlob(expenseData, 'expense');

      const file = new Blob([excelBlob], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });

      console.log(" Excel ready for email:", file);

      showSuccessToast("Email sent (Mock)");
    } catch (err) {
      showErrorToast("Failed to send email");
      console.log(
        " Email send error:",
        err.response?.data?.message || err.message
      );
    }
  };



  return (
    <Dashboard activeMenu="Expense">
      <div className="my-5 mx-auto space-y-6">

        {/* LINE CHART */}
        <LineChartComponent
          data={expenseData} // reuse chart with expenseData
          onAdd={() => setOpenAddExpenseModal(true)}
          type="expense"
        />

        {/* BAR + PIE */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 auto-rows-[1fr]">
          <BarChartComponent data={expenseData} type="expense" />
          {/* <PieChartComponent data={expenseData} categories={categories} type="expense" /> */}
        </div>

        {/* EXPENSE LIST */}
        <ExpenseList
          transactions={expenseData}
          onDelete={(item) => setOpenDeleteAlert({ show: true, data: item })}
          onEmail={handleEmailExpenseDetails}
          onDownloadExcel={handleDownloadExpenseExcel}
          onDownloadCSV={handleDownloadExpenseCSV}
          onDownloadPDF={handleDownloadExpensePDF}
        />

        {/* ADD EXPENSE MODAL */}
        <Model
          isOpen={openAddExpenseModal}
          onClose={() => setOpenAddExpenseModal(false)}
          title="Add Expense"
        >
          <AddExpenseForm
            onSubmit={handleAddExpense}
            onClose={() => setOpenAddExpenseModal(false)}
            expenseCategories={categories}
          />
        </Model>

        {/* DELETE MODAL */}
        <Model
          isOpen={openDeleteAlert.show}
          onClose={() => setOpenDeleteAlert({ show: false, data: null })}
          title="Confirm Delete"
        >
          <ConfirmDelete
            item={openDeleteAlert.data}
            label="expense"
            onCancel={() => setOpenDeleteAlert({ show: false, data: null })}
            onConfirm={() => {
              handleDeleteExpense(openDeleteAlert.data);
              setOpenDeleteAlert({ show: false, data: null });
            }}
          />
        </Model>
      </div>
    </Dashboard>
  );
};

export default Expense;
