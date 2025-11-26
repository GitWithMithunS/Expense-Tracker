import { useContext, useState } from "react";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";
import AppContext from "../context/AppContext";

const Dashboard = ({ children, activeMenu }) => {
  const { user } = useContext(AppContext);

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar activeMenu={activeMenu} />

      {user && (
        <div className="flex">
          {/* Sidebar */}
          <div className="max-[1080px]:hidden">
            <Sidebar activeMenu={activeMenu} />
          </div>
                       
                       {/* Noting to be written here */}

          {/* Page Content of every pages*/}
          <div className="grow mx-5 my-6">
            {children}   {/* guys only children here */}
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
