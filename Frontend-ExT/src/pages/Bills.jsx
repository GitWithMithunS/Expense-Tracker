import React, { useEffect, useState, useContext } from "react";
import Dashboard from "../components/Dashboard";
import AppContext from "../context/AppContext";
import bill1 from "../assets/bill1.png";
import bill2 from "../assets/bill2.jpeg";
import bill3 from "../assets/bill3.jpeg";
import bill4 from "../assets/bill4.jpeg";



const Bills = () => {
  const { user } = useContext(AppContext);
  const [bills, setBills] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);

  useEffect(() => {
    // Mock data
    const mockData = [
    
  {
    id: 1,
    fileUrl: bill1,
    description: "March electricity bill",
    month: "March 2025 ",
    category: "Electricity",
  },
  {
    id: 2,
    fileUrl: bill2,
    description: "WiFi invoice",
    month: "February 2025",
    category: "WiFi",
  },
  {
    id: 3,
    fileUrl: bill3,
    description: "OTT Subscription",
    month: "April 2025",
    category: "OTT",
  },
  {
    id: 4,
    fileUrl: bill4,
    description: "Maintenance bill",
    month: "January 2025 ",
    category: "Rent",
  },
  
];


    setBills(mockData);
  }, [user]);

  // close on Escape key
  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === "Escape") setSelectedImage(null);
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, []);

  return (
    <Dashboard activeMenu="Bills">
      <h2 className="text-2xl font-semibold text-gray-800 mb-6">My Bills</h2>

<div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
  {bills.map((bill) => (
    <div
      key={bill.id}
      role="button"
      tabIndex={0}
      onClick={() => setSelectedImage(bill.fileUrl)}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          setSelectedImage(bill.fileUrl);
        }
      }}
      className="bg-white border border-gray-200 rounded-xl shadow-sm p-0 overflow-hidden cursor-pointer focus:outline-none focus:ring-2 focus:ring-indigo-400"
      aria-label={`Open bill ${bill.id}`}
    >
      <img
        src={bill.fileUrl}
        alt={`Bill ${bill.id}`}
        className="w-full h-48 object-cover transition-transform hover:scale-105"
        loading="lazy"
      />
      {/* below image details (optional) */}
      <div className="p-3 text-sm text-gray-700">
        <p className="whitespace-normal break-words">
  <span className="font-medium">Description: </span>{bill.description}
</p>

        <p className="mt-1 whitespace-normal break-words">
    <span className="font-medium">Month: </span>{bill.month}
  </p>
         <p className="mt-1 whitespace-normal break-words">
    <span className="font-medium">Category: </span>{bill.category}
  </p>
      </div>
    </div>
  ))}
</div>

{selectedImage && (
  <div
    className="fixed inset-0 z-[9999] bg-black/85 overflow-y-auto no-scrollbar"
    onPointerDown={(e) => {
      // if clicked outside image → close
      if (e.target === e.currentTarget) {
        setSelectedImage(null);
      }
    }}
    onClick={(e) => {
      if (e.target === e.currentTarget) {
        setSelectedImage(null);
      }
    }}
    role="dialog"
    aria-modal="true"
  >
    <div
      className="min-h-screen w-full flex justify-center items-start pt-10"
      onClick={(e) => e.stopPropagation()} 
    >
      {/* Close (X) button */}
      <button
        onClick={() => setSelectedImage(null)}
        className="fixed top-4 right-4 z-[10000] bg-white/10 hover:bg-white/20 text-white rounded-full w-10 h-10 flex items-center justify-center"
      >
        ✕
      </button>

      <img
        src={selectedImage}
        alt="Selected Bill"
        className="max-w-[95vw] h-auto object-contain"
        style={{ display: "block", margin: "0 auto" }}
        onClick={(e) => e.stopPropagation()} 
      />
    </div>
  </div>
)}


    </Dashboard>
  );
};

export default Bills;
