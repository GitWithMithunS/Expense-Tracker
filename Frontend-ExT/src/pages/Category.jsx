import React, { useContext, useEffect, useState } from "react";
import Dashboard from "../components/common/Dashboard";
import { Plus } from "lucide-react";
import CategoryList from "../components/category/CategoryList";
import axiosConfig from "../util/axiosConfig";
import { API_ENDPOINTS } from "../util/apiEnpoints";
import Model from "../components/common/Model";
import AddCategoryForm from "../components/category/AddCategoryForm";
import { showErrorToast, showSuccessToast } from "../components/common/CustomToast";
import toast from "react-hot-toast";
import { TransactionContext } from "../context/TransactionContext";

const Category = () => {
  const { state, dispatch } = useContext(TransactionContext);

  // const [loading, setLoading] = useState(false);
  const [categoryData, setCategoryData] = useState([]);
  const [openAddModal, setOpenAddModal] = useState(false);
  const [openEditModal, setOpenEditModal] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);

  // const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));


  // //to check if trasaction context is updated
  useEffect(() => {
    setCategoryData(state.categories);
    console.log("Category currently in category page form context → ", state.categories);
  }, [state]);




  // ------------------------
  // ADD CATEGORY
  // ------------------------
  const handleAddCategory = async (newCategory) => {
    const { name, type, emoji } = newCategory;
    console.log('newcategory : ', newCategory);
    
    // Check duplicates in UI state
    const exists = categoryData.some(
      (c) => c.name.toLowerCase() === name.trim().toLowerCase()
    );
    
    if (exists) {
      showErrorToast("Category already exists!");
      return;
    }
    
    try {
      // 1. Send to backend
      const res = await axiosConfig.post(API_ENDPOINTS.CREATE_CATEGORY, {
        name,
        type,
        // emoji,
        emoji
      });
      
      const savedCategory = res.data; // backend returns the saved category object
      
      // 2. Update local state
      setCategoryData((prev) => [...prev, savedCategory]);
      
      // 3. Update global TransactionContext
      dispatch({
        type: "ADD_CATEGORY",
        payload: savedCategory,
      });
      console.log('newcategory  from backend as response: ', savedCategory);

      showSuccessToast("Category added successfully!");
      return "success";
    } catch (error) {
      console.log("Add category error:", error);
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
  const { id, name, type, emoji } = updatedCategory;

  try {
    // 1. Update on backend
    const res = await axiosConfig.put(
      API_ENDPOINTS.UPDATE_CATEGORY(updatedCategory.id),
      { name, type, emoji }
    );

    const savedCategory = res.data;

    // 2. Update local UI list
    setCategoryData((prev) =>
      prev.map((item) => (item.id === id ? savedCategory : item))
    );

    // 3. Update global TransactionContext
    dispatch({
      type: "UPDATE_CATEGORY",
      payload: savedCategory,
    });

    showSuccessToast("Category updated successfully!");
    return "success";

  } catch (error) {
    console.log("Update Error →", error);
    showErrorToast("Failed to update category");
  }
};



//-----------------------------------------------
// DELETE CATEGORY
//-----------------------------------------------
const handleDeleteCategory = async (categoryObj) => {
  try {
    // 1. Delete from backend
    await axiosConfig.delete(API_ENDPOINTS.DELETE_CATEGORY(categoryObj.id));

    // 2. Remove locally
    setCategoryData((prev) =>
      prev.filter((item) => item.id !== categoryObj.id)
    );

    // 3. Update TransactionContext
    dispatch({
      type: "DELETE_CATEGORY",
      payload: categoryObj.id,
    });

    showSuccessToast("Category deleted successfully!");

  } catch (error) {
    console.log("Delete Error →", error);
    showErrorToast("Failed to delete category");
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
            className="cursor-pointer px-4 py-2 rounded-lg flex items-center gap-1
            bg-green-500/20 border border-green-300
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
