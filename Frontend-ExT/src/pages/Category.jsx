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
  const { dispatch } = useContext(TransactionContext);

  const [loading, setLoading] = useState(false);
  const [categoryData, setCategoryData] = useState([]);
  const [openAddModal, setOpenAddModal] = useState(false);
  const [openEditModal, setOpenEditModal] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);

  // Dummy delay (fake backend delay)
  const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

  // ------------------------
  // Fetch all categories
  // ------------------------
  const fetchCategoryDetails = async () => {
    if (loading) return;

    console.log("Fetching categories...");
    setLoading(true);

    try {
      const response = await axiosConfig.get(API_ENDPOINTS.GET_ALL_CATEGORIES);

      // TEMPORARY FALLBACK
      if (!Array.isArray(response.data)) {
        console.log("Dummy response detected → Using fallback categories");

        const fallback = [
          { id: 1, name: "Food", type: "expense", icon: "🍕" },
          { id: 2, name: "Salary", type: "income", icon: "💰" },
          { id: 3, name: "Bills", type: "expense", icon: "🧾" },
        ];

        setCategoryData(fallback);

        // UPDATE GLOBAL CONTEXT
        dispatch({
          type: "SET_CATEGORIES",
          payload: fallback,
        });

        return;
      }

      console.log("Categories fetched:", response.data);
      setCategoryData(response.data);

      // UPDATE GLOBAL CONTEXT
      dispatch({
        type: "SET_CATEGORIES",
        payload: response.data,
      });

    } catch (error) {
      console.log("Fetch Error:", error);
      showErrorToast("Failed to fetch categories!");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategoryDetails();
  }, []);

  // ------------------------
  // ADD CATEGORY
  // ------------------------
  const handleAddCategory = async (newCategory) => {
    const { name, type, icon } = newCategory;

    // Duplicate Check
    const exists = categoryData.some(
      (c) => c.name.toLowerCase() === name.trim().toLowerCase()
    );

    if (exists) {
      showErrorToast("Category already exists!");
      return;
    }

    console.log("Adding category →", newCategory);
    await delay(1000); // simulate API time

    try {
      // Dummy POST
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

      const updatedList = [...categoryData, newItem];
      setCategoryData(updatedList);

      // UPDATE GLOBAL CONTEXT
      dispatch({
        type: "SET_CATEGORIES",
        payload: updatedList,
      });

      showSuccessToast("Category Added!");
      return "success";

    } catch (error) {
      console.log("Add Error →", error);
      showErrorToast("Failed to add category");
      throw error;
    }
  };

  // ------------------------
  // OPEN EDIT MODAL
  // ------------------------
  const handleEditCategory = (categoryObj) => {
    console.log("Editing category:", categoryObj);
    setSelectedCategory(categoryObj);
    setOpenEditModal(true);
  };

  // ------------------------
  // UPDATE CATEGORY
  // ------------------------
  const handleUpdateCategory = async (updatedCategory) => {
    console.log("Updating category:", updatedCategory);
    await delay(1000);

    try {
      // Dummy API request
      await axiosConfig.put(
        `${API_ENDPOINTS.UPDATE_CATEGORY}/${updatedCategory.id}`,
        updatedCategory
      );

      const updatedList = categoryData.map((item) =>
        item.id === updatedCategory.id ? updatedCategory : item
      );

      setCategoryData(updatedList);

      // UPDATE GLOBAL CONTEXT
      dispatch({
        type: "SET_CATEGORIES",
        payload: updatedList,
      });

      showSuccessToast("Category Updated!");
      return "success";

    } catch (error) {
      console.log("Update Error →", error);
      showErrorToast("Failed to update category");
      throw error;
    }
  };

  // ------------------------
  // DELETE CATEGORY
  // ------------------------
  const handleDeleteCategory = async (categoryObj) => {
    console.log("Deleting →", categoryObj);

    await delay(1000);

    try {
      await axiosConfig.delete(
        `${API_ENDPOINTS.DELETE_CATEGORY}/${categoryObj.id}`
      );

      const updatedList = categoryData.filter(
        (item) => item.id !== categoryObj.id
      );

      setCategoryData(updatedList);

      // UPDATE GLOBAL CONTEXT
      dispatch({
        type: "SET_CATEGORIES",
        payload: updatedList,
      });

      showSuccessToast("Category Deleted!");

    } catch (error) {
      console.log("Delete Error →", error);
      showErrorToast("Failed to delete category");
    }
  };

  return (
    <Dashboard activeMenu="Category">
      <div className="my-5 mx-auto">

        {/* Header */}
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

        {/* List */}
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
