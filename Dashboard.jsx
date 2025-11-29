import { useContext, useState } from "react";
import Navbar from "./Frontend-ExT/src/components/common/Navbar";
import Sidebar from "./Frontend-ExT/src/components/common/Sidebar";
import AppContext from "./Frontend-ExT/src/context/AppContext";

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

            {/* Noting more to edit here boi */}

          {/* Page Content */}
          <div className="grow mx-5 my-6">
            {children}   {/*guys Only children here */}
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
