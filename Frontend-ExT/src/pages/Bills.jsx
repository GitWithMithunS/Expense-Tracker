import React, { useEffect, useState, useContext } from "react";
import Dashboard from "../../../Dashboard";
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
    // Mock data following your DB schema, using `date` (ISO) and other fields
    const mockData = [
      {
        id: 1,
        fileUrl: bill1,
        description: "Electricity bill",
        date: "2025-03-05T10:00:00Z",
        category: "Electricity",
      },
      {
        id: 2,
        fileUrl: bill2,
        description: "Broadband invoice",
        date: "2025-02-07T12:00:00Z",
        category: "WiFi",
      },
      {
        id: 3,
        fileUrl: bill3,
        description: "Netflix bills",
        date: "2025-04-01T09:00:00Z",
        category: "OTT",
      },
      {
        id: 4,
        fileUrl: bill4,
        description: "Maintenance bills",
        date: "2025-01-15T08:30:00Z",
        category: "Maintenance",
      },
    ];

    setBills(mockData);
  }, [user]);

  
  const formatDateUS = (isoString) => {
    try {
      return new Date(isoString).toLocaleDateString("en-US", {
        day: "numeric",
        month: "short",
        year: "numeric",
      });
    } catch {
      return isoString;
    }
  };

  return (
    <Dashboard activeMenu="Bills">
      <h2 className="text-2xl font-semibold text-gray-800 mb-6">My Bills</h2>

      {/* Grid of bills */}
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

            {/* Bill details */}
            <div className="p-3 text-sm text-gray-700">
              <p className="whitespace-normal break-words">
                <span className="font-medium">Description: </span>
                <span className="text-gray-600">{bill.description}</span>
              </p>

              <p className="mt-1 whitespace-normal break-words">
                <strong>Date:</strong>{" "}
                {formatDateUS(bill.date)}
              </p>

              <p className="mt-1 whitespace-normal break-words">
                <span className="font-medium">Category: </span>
                <span className="text-gray-600">{bill.category}</span>
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Lightbox popup — closes only on outside click or X; no ESC */}
      {selectedImage && (
        <div
          className="fixed inset-0 z-[9999] bg-black/85 overflow-y-auto no-scrollbar"
          onPointerDown={(e) => {
            if (e.target === e.currentTarget) {
              setSelectedImage(null);
            }
          }}
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setSelectedImage(null);
            }
          }}
        >
          <div
            className="min-h-screen w-full flex justify-center items-start pt-10"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close button */}
            <button
              onClick={() => setSelectedImage(null)}
              className="fixed top-4 right-4 z-[10000] bg-white/10 hover:bg-white/20 text-white rounded-full w-10 h-10 flex items-center justify-center"
              aria-label="Close"
            >
              ✕
            </button>

            {/* Image (fits without cropping) */}
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
