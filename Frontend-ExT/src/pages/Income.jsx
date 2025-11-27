import React, { useEffect, useState } from 'react'
import Dashboard from '../components/Dashboard'
import { useUser } from '../hooks/useUser';
import { API_ENDPOINTS } from '../util/apiEnpoints';
import { showErrorToast, showSuccessToast } from '../components/CustomToast';
import axiosConfig from '../util/axiosConfig';
import IncomeList from '../components/IncomeList';
import Model from '../components/Model'
import { Plus } from 'lucide-react';
import AddIncomeForm from '../components/AddIncomeForm';
import IncomeChart from '../components/IncomeChart';

const Income = () => {

  // useUser();  //for auto login when the page is refreshed or reloaded

  const [incomeData, setIncomeData] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [openAddIncomeModal, setOpenAddIncomeModal] = useState(false);
  const [openDeleteAlert, setOpenDeleteAlert] = useState({
    show: false,
    data: null,
  });

  const fetchIncomeDetails = async () => {
    if (loading) return;

    setLoading(false);


    try {
      const response = await axiosConfig.get(API_ENDPOINTS.GET_ALL_INCOME);

      if (response.status === 200 || response.status === 201) {
        console.log('Income List', response.data);
        setIncomeData(response.data);
      }

    } catch (error) {
      console.error("Failed to fecth income details ", error);
      showErrorToast(error.response?.data?.message || "Failed to fetch income details");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchIncomeDetails();
    fetchIncomeCategories();
  }, [])


  const fetchIncomeCategories = async () => {
    try {

      const response = await axiosConfig.get(API_ENDPOINTS.CATEGORY_BY_TYPE('income'));

      if (response.status === 200 || response.status === 201) {
        console.log('Income categories fetched', response.data);
        setCategories(response.data);
      }

    } catch (error) {
      console.error("Failed to fecth income categories ", error);
      showErrorToast(error.response?.data?.message || "Failed to fetch income categories");
    } finally {
      setLoading(false);
    }

  }


  const handleAddIncome = async (incomeData) => {
    try {
      const response = await axiosConfig.post(API_ENDPOINTS.ADD_INCOME, incomeData);

      if (response.status === 200 || response.status === 201) {
        // Use backend-generated item
        const newIncome = response.data.added ?? incomeData;

        ////or call backend api to get latest data
        // await fetchIncomeDetails();

        //or  Update state instantly
        setIncomeData((prev) => [newIncome, ...prev]);
        // setIncomeData((prev) => [...prev, incomeData]);
        showSuccessToast('Congragulation!! , Income added');
      }



    } catch (err) {
      showErrorToast(err.response?.data?.message || "Failed to add income");
    }
  };

  const handleDeleteIncome = async (incomeObj) => {
    try {
      const response = await axiosConfig.delete(
        API_ENDPOINTS.DELETE_INCOME(incomeObj.id)
      );

      if (response.status === 200 || response.status === 201) {
        setIncomeData((prev) =>
          prev.filter((item) => item.id !== incomeObj.id)
        );

        showSuccessToast("Income deleted successfully!");
      }
    } catch (err) {
      showErrorToast(err.response?.data?.message || "Failed to delete income");
    }
  };



  return (
    <>
      <Dashboard activeMenu='Income'>
        <div className="my-5 mx-auto">
              {/* Overview for income with line graph */}
              <IncomeChart incomeData={incomeData}/>
          <div className="grid grid-cols-1 gap-6 mt-6">
            <div>
              <button
                onClick={() => setOpenAddIncomeModal(true)}
                className="px-4 py-2 rounded-lg flex items-center gap-1
            bg-green-500/20 border border-green-400
            text-green-800 font-medium shadow-md hover:bg-green-500/30"
              >
                <Plus size={15} />
                Add Income
              </button>
            </div>


            <IncomeList
              transactions={incomeData}
              onDelete={handleDeleteIncome}
            />


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


          </div>
        </div>
      </Dashboard>
    </>
  )
}

export default Income