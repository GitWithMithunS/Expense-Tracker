import { useEffect, useState } from "react";
import RadarChartComponent from "../charts/RadarChartComponent";
import axiosConfig from "../../util/axiosConfig";
import { API_ENDPOINTS } from "../../util/apiEnpoints";
import EmptyState from "../charts/EmptyState";

const BudgetStatusCard = () => {
  const [transactions, setTransactions] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [chartData , setChartData] = useState([]);

  // useEffect(() => {
  //   const loadData = async () => {
  //     try {
  //       // Fetch all transactions
  //       const txRes = await axiosConfig.get(API_ENDPOINTS.GET_ALL_TRANSACTIONS);

  //       const val =  getchartData();
  //       setChartData(val);

  //       // Fetch category limits
  //       const budgetRes = await axiosConfig.get(API_ENDPOINTS.GET_BUDGET_DATA);
  //       console.log( 'transaction data(tx) for rader chart' ,txRes);
  //       console.log( 'transaction data(budgetRes) for rader chart' ,budgetRes);
  //       setTransactions(txRes.data || []);
  //       setCategories(budgetRes.data.categories || []);

  //     } catch (err) {
  //       console.error("Radar Chart fetch error:", err);
  //     } finally {
  //       setLoading(false);
  //     }
  //   };

  //   loadData();
  // }, []);


  // const getchartData = () => {

    const getchartData = ( () => {
      categories.reduce((acc, item) => {
      acc[item.categoryId] = {
        category: item.category,
        limit: item.limit,
        spent: item.spent
      };
      return acc;
    }, {})
});

    // setChartData(categoryMap);
  // }

  return (
    <div className="bg-white p-6 rounded-xl border shadow-sm">

      <h3 className="text-xl font-semibold mb-3">Budget Radar Analysis</h3>
      <p className="text-gray-600 mb-4">
        Visualize how your spending is distributed across categories.
      </p>

      {loading ? (
        <div className="text-center py-10 text-gray-500"><EmptyState message="Add budget to view radar chart." type="list" /></div>
      ) : (
        <RadarChartComponent
          data={transactions.filter(t => t.type === "expense")}  // Only expenses
          categories={categories}
          type="expense"
          // data = {chartData}
        />
      )}

    </div>
  );
};

export default BudgetStatusCard;
