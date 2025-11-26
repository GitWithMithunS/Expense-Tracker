import { useContext, useState } from "react";
import Navbar from "./Navbar";
import AppContext from "../context/AppContext";
import Sidebar from "./Sidebar";
import { useNavigate } from "react-router-dom";
import { ArrowUpCircleIcon, ArrowDownCircleIcon } from "@heroicons/react/24/outline";
import BudgetStatus from "./BudgetStatus";
import BudgetManager from "./BudgetManager";
import Calendar from "./Calendar";



const Dashboard = ({ children, activeMenu }) => {
  const { user } = useContext(AppContext);
  const navigate = useNavigate();
  const [openBudgetManager, setOpenBudgetManager] = useState(false);


  (() => console.log(user, "frm dashboard"))();

  return (
    <>
      <div className="min-h-screen bg-gray-100">
        <Navbar activeMenu={activeMenu} />

        {user && (
          <div className="flex">
            <div className="max-[1080px]:hidden">
              <Sidebar activeMenu={activeMenu} />
            </div>

            {/* MAIN CONTENT */}
            <div className="grow mx-5 my-6">

              {/* ======= INSERTED DASHBOARD UI HERE ======= */}
              <div className="w-full bg-white shadow-md rounded-xl p-8 mb-10 hover:shadow-lg transition-all">
                <h2 className="text-lg font-semibold mb-2 tracking-wide text-gray-700">
                  TOTAL BALANCE:
                </h2>
                <div className="text-3xl font-bold text-blue-600 mt-2">₹0.00</div>
              </div>

              <div className="flex flex-wrap gap-10 justify-center mb-10">

                {/* ADD INCOME BUTTON */}
                <button
                    onClick={() => navigate("/add-income")}
                    className="w-80 bg-gradient-to-r from-indigo-500 to-indigo-600 text-white shadow-md
                                rounded-xl p-8 text-center cursor-pointer 
                                hover:scale-105 hover:shadow-xl transition-all flex flex-col items-center gap-3"
                    >
                    <ArrowUpCircleIcon className="h-10 w-10 text-white" />
                    <h3 className="text-lg font-semibold tracking-wide">ADD INCOME</h3>
                </button>


                {/* ADD EXPENSE BUTTON */}
                <button
                    onClick={() => navigate("/add-expense")}
                    className="w-80 bg-gradient-to-r from-amber-500 to-amber-600 text-white shadow-md
                                rounded-xl p-8 text-center cursor-pointer 
                                hover:scale-105 hover:shadow-xl transition-all flex flex-col items-center gap-3"
                    >
                    <ArrowDownCircleIcon className="h-10 w-10 text-white" />
                    <h3 className="text-lg font-semibold tracking-wide">ADD EXPENSE</h3>
                </button>

              </div>

              {/* BUDGET STATUS + BUDGET MANAGER */}
              <div className="flex flex-col md:flex-row gap-10 mb-10">
    <div className="w-full md:w-1/2">
        <BudgetStatus />
    </div>

                <div className="w-full md:w-1/2 bg-white shadow-md rounded-xl p-10 hover:shadow-lg transition-all">
  <h3 className="text-xl font-semibold mb-4 tracking-wide">BUDGET MANAGER</h3>
  <p className="text-gray-600 mb-4">Plan your monthly budget and divide it across categories.</p>

  <button
    onClick={() => setOpenBudgetManager(true)}
    className="mt-4 bg-indigo-600 text-white px-5 py-3 rounded-lg hover:bg-indigo-700"
  >
    Set Monthly Budget
  </button>
</div>

{openBudgetManager && (
  <BudgetManager onClose={() => setOpenBudgetManager(false)} />
)}

              </div>
              <div className="grow mx-5">
  {/* other dashboard cards */}
  <Calendar  />
</div>

              {/* KEEP CHILDREN FOR OTHER PAGES */}
              <div>{children}</div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default Dashboard;
