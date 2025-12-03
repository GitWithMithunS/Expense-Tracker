import React, { useContext, useEffect, useState } from 'react'
import Dashboard from '../components/common/Dashboard'
import { API_ENDPOINTS } from '../util/apiEnpoints';
import axiosConfig from '../util/axiosConfig';
import { showErrorToast, showSuccessToast } from '../components/common/CustomToast';


import LineChartComponent from '../components/charts/LineChartComponent';
import BarChartComponent from '../components/charts/BarChartComponent';
import PieChartComponent from '../components/charts/PieChartComponent';

import IncomeList from '../components/income/IncomeList';
import Model from '../components/common/Model';
import AddIncomeForm from '../components/income/AddIncomeForm';
import ConfirmDelete from '../components/common/ConfirmDelete';

import {
  generateExcelBlob,
  exportToPDF,
  exportToCSV,
  exportToExcel,
} from "../util/excelUtils";
import { TransactionContext } from '@/context/TransactionContext';



const Income = () => {

  const [incomeData, setIncomeData] = useState([]);
  const [categories, setCategories] = useState([]);

  const [openAddIncomeModal, setOpenAddIncomeModal] = useState(false);
  const [openDeleteAlert, setOpenDeleteAlert] = useState({ show: false, data: null });

  //transaction context
  const { state ,dispatch } = useContext(TransactionContext);

  // Load data from global context
  useEffect(() => {
    setIncomeData(state.incomes);
    setCategories(state.categories.filter(c => c.type === "INCOME"));
  }, [state]);

  // // Fetch income list
  // const fetchIncomeDetails = async () => {
  //   try {
  //     const response = await axiosConfig.get(API_ENDPOINTS.GET_ALL_INCOME);
  //     setIncomeData(response.data);
  //   } catch (err) {
  //     showErrorToast("Failed to load income");
  //     console.log(err.response?.data?.message || 'Failed fetching income details');
  //   }
  // };

  // // Fetch categories
  // const fetchIncomeCategories = async () => {
  //   try {
  //     const response = await axiosConfig.get(API_ENDPOINTS.CATEGORY_BY_TYPE("income"));
  //     console.log("from fetch all category" , response.data)
  //     setCategories(response.data);
  //   } catch (err) {
  //     showErrorToast("Failed to load categories");
  //     console.log(err.response?.data?.message || 'Failed fetching income categories');
  //   }
  // };
  // useEffect(() => {
  //   fetchIncomeDetails();
  //   fetchIncomeCategories();
  // }, []);

  // const handleAddIncome = async (data) => {
  //   try {
  //     await axiosConfig.post(API_ENDPOINTS.ADD_INCOME, data);
  //     await fetchIncomeDetails();
  //     showSuccessToast("Income added");
  //   } catch (err) {
  //     showErrorToast("Failed to add income");
  //     console.log(err.response?.data?.message || 'Failed adding income in backend');
  //   }
  // };
  // handle add income 
  const handleAddIncome = async (data) => {
    try {
      const payload = {
        amount: Number(data.amount),
        description: data.description,
        categoryId: data.categoryId
      };

      const res = await axiosConfig.post(API_ENDPOINTS.ADD_TRANSACTION, payload);

      const newTx = res.data?.data; // backend returns created transaction

      if (!newTx) {
        showErrorToast("Invalid response from server! Had some issue adding ur income. PLz try again");
        return;
      }
      console.log('new income added from handleaddincome' , newTx);

      // Update global context without refetching
      dispatch({
        type: "ADD_INCOME",
        payload: newTx
      });

      showSuccessToast("Income Added!");
      console.log('incomedata from income page' , incomeData);

      // refresh global state  
      //instead of calling fecth all transaction for every little cahnge we have used context redcer and are manually updating the state of transaction context and backend seperatly
      // fetchAllTransactions();

    } catch (err) {
      console.log(err);
      showErrorToast("Failed to add income");
    }
  };

  // const handleDeleteIncome = async (income) => {
  //   try {
  //     await axiosConfig.delete(API_ENDPOINTS.DELETE_INCOME(income.id));
  //     await fetchIncomeDetails();
  //     showSuccessToast("Income deleted");
  //   } catch (err) {
  //     showErrorToast("Failed to delete income");
  //     console.log(err.response?.data?.message || 'Failed to  delete income in backend');
  //   }
  // };
const handleDeleteIncome = async (income) => {
  try {
    await axiosConfig.delete(`/transactions/${income.id}`);

    // Update global state without full reload
    dispatch({
      type: "DELETE_TRANSACTION",
      payload: income.id
    });

    showSuccessToast("Income deleted");

  } catch (err) {
    console.log(err);
    showErrorToast("Failed to delete income");
  }
};




  //functions to handel downlaod and et mail for incomes
  const handleDownloadIncomeExcel = () => {
    if (!incomeData.length) {
      showErrorToast('Sorry ,No income data to downlaod! Add some income to proceed')
      return;
    }
    exportToExcel(incomeData, 'income');
    showSuccessToast("Excel downloaded!");
  };


  const handleDownloadIncomeCSV = () => {
    if (!incomeData.length) {
      showErrorToast('Sorry ,No income data to downlaod! Add some income to proceed')
      return;
    }
    exportToCSV(incomeData, 'income');
    showSuccessToast("Downloaded CSV!");
  };

  const handleDownloadIncomePDF = () => {
    if (!incomeData.length) {
      showErrorToast('Sorry ,No income data to downlaod! Add some income to proceed')
      return;
    }
    exportToPDF(incomeData, 'income');
    showSuccessToast("Downloaded PDF!");
  };

  //sending the excel to backend endpoint to mail the user 
  const handleEmailIncomeDetails = async () => {
    try {
      const excelBlob = generateExcelBlob(incomeData, 'income');

      const file = new Blob([excelBlob], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });

      const formData = new FormData();
      formData.append("file", file, "Income_Report.xlsx");

      //  send to backend email API (when you have one)
      //const response = await axiosConfig.post(API_ENDPOINTS.EMAIL_EXCEL, formData);

      console.log("Excel ready for email →", file);
      showSuccessToast("Email sent (Mock )");
    } catch (err) {
      showErrorToast("Failed to send email");
      console.log(err.response?.data?.message || 'Failed to sent excel to backend');
    }
  };




  return (
    <Dashboard activeMenu="Income">

      <div className="my-5 mx-auto space-y-6">

        {/* line chart */}
        <LineChartComponent
          data={incomeData}
          onAdd={() => setOpenAddIncomeModal(true)}
          type='income'
        />

        {/* Bar + Pie Chart side by side */}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 auto-rows-[1fr]">
          <BarChartComponent data={incomeData} type="income" />

          <PieChartComponent data={incomeData} categories={categories} type="income" />
        </div>



        {/* Income List below */}
        <IncomeList
          transactions={incomeData}
          onDelete={(item) => setOpenDeleteAlert({ show: true, data: item })}
          onEmail={handleEmailIncomeDetails}
          onDownloadExcel={handleDownloadIncomeExcel}
          onDownloadCSV={handleDownloadIncomeCSV}
          onDownloadPDF={handleDownloadIncomePDF}
        />


        {/* Add Income Modal */}
        <Model
          isOpen={openAddIncomeModal}
          onClose={() => setOpenAddIncomeModal(false)}
          title="Add Income"
        >
          <AddIncomeForm
            onSubmit={handleAddIncome}
            onClose={() => setOpenAddIncomeModal(false)}
            incomeCategories={categories}
          />
        </Model>

        {/* Delete Confirmation Modal */}
        <Model
          isOpen={openDeleteAlert.show}
          onClose={() => setOpenDeleteAlert({ show: false, data: null })}
          title="Confirm Delete"
        >
          <ConfirmDelete
            item={openDeleteAlert.data}
            label="income"
            onCancel={() => setOpenDeleteAlert({ show: false, data: null })}
            onConfirm={() => {
              handleDeleteIncome(openDeleteAlert.data);
              setOpenDeleteAlert({ show: false, data: null });
            }}
          />
        </Model>

      </div>

    </Dashboard>
  );
};

export default Income;
