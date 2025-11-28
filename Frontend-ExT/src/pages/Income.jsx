import React, { useEffect, useState } from 'react'
import Dashboard from '../components/Dashboard'
import { API_ENDPOINTS } from '../util/apiEnpoints';
import axiosConfig from '../util/axiosConfig';
import { showErrorToast, showSuccessToast } from '../components/CustomToast';

import IncomeChart from '../components/charts/IncomeChart';
import IncomeBarChart from '../components/charts/IncomeBarChart';
import IncomePieChart from '../components/charts/IncomePieChart';

import IncomeList from '../components/IncomeList';
import Model from '../components/Model';
import AddIncomeForm from '../components/AddIncomeForm';
import ConfirmDelete from '../components/ConfirmDelete';
// import { exportIncomeToExcel, generateIncomeExcelBlob } from "../util/excelUtils";
import {
  exportIncomeToExcel,
  exportIncomeToCSV,
  exportIncomeToPDF,
  generateIncomeExcelBlob,
} from "../util/excelUtils";



const Income = () => {

  const [incomeData, setIncomeData] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);

  const [openAddIncomeModal, setOpenAddIncomeModal] = useState(false);
  const [openDeleteAlert, setOpenDeleteAlert] = useState({ show: false, data: null });

  // Fetch income list
  const fetchIncomeDetails = async () => {
    try {
      const response = await axiosConfig.get(API_ENDPOINTS.GET_ALL_INCOME);
      setIncomeData(response.data);
    } catch (err) {
      showErrorToast("Failed to load income");
      console.log(err.response?.data?.message || 'Failed fetching income details');
    }
  };
  
  // Fetch categories
  const fetchIncomeCategories = async () => {
    try {
      const response = await axiosConfig.get(API_ENDPOINTS.CATEGORY_BY_TYPE("income"));
      setCategories(response.data);
    } catch (err) {
      showErrorToast("Failed to load categories");
      console.log(err.response?.data?.message || 'Failed fetching income categories');
    }
  };

  useEffect(() => {
    fetchIncomeDetails();
    fetchIncomeCategories();
  }, []);

  const handleAddIncome = async (data) => {
    try {
      await axiosConfig.post(API_ENDPOINTS.ADD_INCOME, data);
      await fetchIncomeDetails();
      showSuccessToast("Income added");
    } catch(err) {
      showErrorToast("Failed to add income");
      console.log(err.response?.data?.message || 'Failed adding income in backend');
    }
  };

  const handleDeleteIncome = async (income) => {
    try {
      await axiosConfig.delete(API_ENDPOINTS.DELETE_INCOME(income.id));
      await fetchIncomeDetails();
      showSuccessToast("Income deleted");
    } catch(err) {
      showErrorToast("Failed to delete income");
      console.log(err.response?.data?.message || 'Failed to  delete income in backend');
    }
  };


  //functions to handel downlaod and et mail for incomes

  const handleDownloadIncomeExcel = () => {
  exportIncomeToExcel(incomeData);
  showSuccessToast("Excel downloaded!");
};


const handleDownloadIncomeCSV = () => {
  exportIncomeToCSV(incomeData);
  showSuccessToast("Downloaded CSV!");
};

const handleDownloadIncomePDF = () => {
  exportIncomeToPDF(incomeData);
  showSuccessToast("Downloaded PDF!");
};

//sending the excel to backend endpoint to mail the user 
const handleEmailIncomeDetails = async () => {
  try {
    const excelBlob = generateIncomeExcelBlob(incomeData);

    const file = new Blob([excelBlob], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });

    const formData = new FormData();
    formData.append("file", file, "Income_Report.xlsx");

    //  send to backend email API (when you have one)
    //const response = await axiosConfig.post(API_ENDPOINTS.EMAIL_EXCEL, formData);
    
    console.log("Excel ready for email →", file);
    showSuccessToast("Email sent (Mock Mode)");
  } catch (err) {
    showErrorToast("Failed to send email");
    console.log(err.response?.data?.message || 'Failed to sent excel to backend');
  }
};



  return (
    <Dashboard activeMenu="Income">

      <div className="my-5 mx-auto space-y-6">

        {/* Full-width line chart */}
        <IncomeChart
          incomeData={incomeData}
          onAddIncome={() => setOpenAddIncomeModal(true)}
        />

        {/* Bar + Pie Chart side by side */}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 auto-rows-[1fr]">
          <IncomeBarChart incomeData={incomeData} />
          <IncomePieChart incomeData={incomeData} categories={categories} />
        </div>



        {/* Income List below */}
        {/* <IncomeList
          transactions={incomeData}
          onDelete={(item) => setOpenDeleteAlert({ show: true, data: item })}
          onDownload={handleDownloadIncomeDetails}
          onEmail={handleEmailIncomeDetails}
        /> */}
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
