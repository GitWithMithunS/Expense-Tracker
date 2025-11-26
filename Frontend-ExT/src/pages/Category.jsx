import React, { useEffect, useState } from 'react'
import Dashboard from '../components/Dashboard'
import { LayoutDashboard, Plus } from 'lucide-react'
import CategoryList from '../components/CategoryList'
import axiosConfig from '../util/axiosConfig'
import { API_ENDPOINTS } from '../util/apiEnpoints'
import toast from 'react-hot-toast'
import Expense from './Expense'

const Category = () => {

  // useUser();  //backedn not yet connected

  // //scheme for categories
  // name : String
  // icon : String
  // type : string (income / Expense)

  //if anyone can write dummy categories for now

  const [loading, setLoading] = useState(false);
  const [categoryData, setCategoryData] = useState([]);
  const [openAddCategoryModel, setOpenAddCategoryModel] = useState(false);
  const [openEditCategoryModel, setOpenEditCategoryModel] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);

  //fecthing all data fof categories form backend apis
  const fetchCategoryDetails = async () => {
    if (loading) return;

    setLoading(true);

    // as we dont have api yet cant fetch
    try {
      const respone = await axiosConfig.get(API_ENDPOINTS.GET_ALL_CATEGORIES);
      if (respone.status == 200) {
        console.log('categories', respone.data);
        setCategoryData(respone.data);
      }
    } catch (error) {
      console.error('Something went wrong while fetching categories ', error);
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchCategoryDetails();
  }, []);



  return (
    <>
      <Dashboard activeMenu='Category'>
        <div className="my-5 mx-auto">
          {/* add button to add category */}
          <div className="flex justify-between items-center mb-5">
            <h2 className="text-2xl font-semibold">All Categories</h2>
            <button
              className="px-4 py-2 rounded-lg flex items-center gap-1
              bg-green-500/20 backdrop-blur-md border border-green-400/40
              text-green-800 font-medium shadow-lg
              hover:bg-green-500/30 hover:shadow-green-400/50
              transition-all duration-300"
            >
              <Plus size={15} />
              Add Category
            </button>
          </div>

          {/* Category list */}
          <CategoryList />


          {/* Adding category modal */}


          {/* Updating category model */}


        </div>
      </Dashboard>
    </>
  )
}

export default Category