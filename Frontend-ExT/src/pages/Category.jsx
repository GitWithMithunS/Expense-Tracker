import React, { useContext, useEffect, useState } from "react";
import Dashboard from "../components/Dashboard";
import { Plus } from "lucide-react";
import CategoryList from "../components/CategoryList";
import axiosConfig from "../util/axiosConfig";
import { API_ENDPOINTS } from "../util/apiEnpoints";
import Model from "../components/Model";
import AddCategoryForm from "../components/AddCategoryForm";
import { showErrorToast, showSuccessToast } from "../components/CustomToast";
import toast from "react-hot-toast";
import { TransactionContext } from "../context/TransactionContext";

const Category = () => {
  const { state, dispatch } = useContext(TransactionContext);

  const [loading, setLoading] = useState(false);
  const [categoryData, setCategoryData] = useState([]);
  const [openAddModal, setOpenAddModal] = useState(false);
  const [openEditModal, setOpenEditModal] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);

  const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

  // //to fetch all categories hitting endpoint when page is reloded
  // useEffect(() => {
  //   fetchCategoryDetails();
  // }, []);
  //seting category as soon as their is a change in the state of category from transaction field

  // //to check if trasaction context is updated
  useEffect(() => {
    setCategoryData(state.categories);
    console.log("CONTEXT UPDATED → ", state.categories);
  }, [state.categories]);





  // // ------------------------
  // // FETCH ALL CATEGORIES  -> not required for now
  // // ------------------------
  // const fetchCategoryDetails = async () => {
  //   if (loading) return;

  //   console.log("Fetching categories...");
  //   setLoading(true);

  //   try {
  //     const response = await axiosConfig.get(API_ENDPOINTS.GET_ALL_CATEGORIES);

  //     console.log("Categories fetched:", response.data);
  //     setCategoryData(response.data);

  //     // UPDATE GLOBAL CONTEXT
  //     dispatch({
  //       type: "SET_CATEGORIES",
  //       payload: response.data,
  //     });

  //   } catch (error) {
  //     console.log("Fetch Error →", error);
  //     toast.error("Failed to fetch categories!");
  //   } finally {
  //     setLoading(false);
  //   }
  // };



  // ------------------------
  // ADD CATEGORY
  // ------------------------
  
  const handleAddCategory = async (newCategory) => {
    const { name, type, icon } = newCategory;

    const exists = categoryData.some(
      (c) => c.name.toLowerCase() === name.trim().toLowerCase()
    );

    if (exists) {
      showErrorToast("Category already exists!");
      return;
    }

    console.log("Adding category →", newCategory);
    
    await delay(1000);
    
    try {
      await axiosConfig.post(API_ENDPOINTS.ADD_CATEGORY, {
        name,
        type,
        icon,
      });

      const newItem = {
        id: Date.now(),
        userId: "user123",
        name,
        type,
        icon,
      };
      
      // setCategoryData((prev) => [...prev, newItem]);
      
      // // Update GLOBAL CONTEXT
      // dispatch({
        //   type: "ADD_CATEGORY",
        //   payload: newItem,
        // });
        
        showSuccessToast("Category Added!");
        console.log('category list after adding', categoryData);
        return "success";

    } catch (error) {
      console.log("Add Error →", error);
      showErrorToast("Failed to add category");
    }
  };

  
  // ------------------------
  // EDIT CATEGORY
  // ------------------------
  const handleEditCategory = (categoryObj) => {
    setSelectedCategory(categoryObj);
    setOpenEditModal(true);
  };



  // ------------------------
  // UPDATE CATEGORY
  // ------------------------
  const handleUpdateCategory = async (updatedCategory) => {
    console.log("Updating category:", updatedCategory);

    await delay(800);

    try {
      await axiosConfig.put(
        // `${API_ENDPOINTS.UPDATE_CATEGORY}/${updatedCategory.id}`,
        API_ENDPOINTS.UPDATE_CATEGORY(updatedCategory.id),
        updatedCategory
      );

      setCategoryData((prev) =>
        prev.map((item) =>
          item.id === updatedCategory.id ? updatedCategory : item
        )
      );

      // UPDATE GLOBAL CONTEXT
      dispatch({
        type: "UPDATE_CATEGORY",
        payload: updatedCategory,
      });
      console.log(state)

      showSuccessToast("Category Updated!");
      return "success";

    } catch (error) {
      console.log("Update Error →", error);
      showErrorToast("Failed to update category");
    }
  };



  // ------------------------
  // DELETE CATEGORY
  // ------------------------
  const handleDeleteCategory = async (categoryObj) => {
    console.log("Deleting category:", categoryObj);

    await delay(700);

    try {
      await axiosConfig.delete(
        `${API_ENDPOINTS.DELETE_CATEGORY}/${categoryObj.id}`
      );

      setCategoryData((prev) =>
        prev.filter((item) => item.id !== categoryObj.id)
      );

      // UPDATE GLOBAL CONTEXT
      dispatch({
        type: "DELETE_CATEGORY",
        payload: categoryObj.id,
      });

      showSuccessToast("Category Deleted!");

    } catch (error) {
      console.log("Delete Error →", error);
      showErrorToast("Failed to delete");
    }
  };

  return (
    <Dashboard activeMenu="Category">
      <div className="my-5 mx-auto">

        {/* HEADER */}
        <div className="flex justify-between items-center mb-5">
          <h2 className="text-2xl font-semibold">All Categories</h2>

          <button
            onClick={() => setOpenAddModal(true)}
            className="px-4 py-2 rounded-lg flex items-center gap-1
            bg-green-500/20 border border-green-400
            text-green-800 font-medium shadow-md hover:bg-green-500/30"
          >
            <Plus size={15} />
            Add Category
          </button>
        </div>

        {/* LIST */}
        <CategoryList
          categories={categoryData}
          onEditCategory={handleEditCategory}
          onDeleteCategory={handleDeleteCategory}
        />

        {/* ADD MODAL */}
        <Model
          isOpen={openAddModal}
          onClose={() => setOpenAddModal(false)}
          title="Add Category"
        >
          <AddCategoryForm
            onSubmit={handleAddCategory}
            onClose={() => setOpenAddModal(false)}
          />
        </Model>

        {/* EDIT MODAL */}
        <Model
          isOpen={openEditModal}
          onClose={() => {
            setOpenEditModal(false);
            setSelectedCategory(null);
          }}
          title="Update Category"
        >
          <AddCategoryForm
            isEditing={true}
            initialCategoryData={selectedCategory}
            onSubmit={handleUpdateCategory}
            onClose={() => setOpenEditModal(false)}
          />
        </Model>

      </div>
    </Dashboard>
  );
};

export default Category;
