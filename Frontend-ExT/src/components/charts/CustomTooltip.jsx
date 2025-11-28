import React from "react";
import moment from "moment";

const CustomIncomeTooltip = ({ active, payload, label }) => {
  if (!active || !payload || payload.length === 0) return null;

  const data = payload[0].payload;

  return (
    <div className="bg-white shadow-lg border border-gray-200 rounded-xl p-4 text-sm 
                    min-w-[180px]">
      {/* FORMAT DATE */}
      <p className="font-semibold text-gray-800">
        {moment(label, "YYYY-MM-DD").format("Do MMM YY")}

        {/* {moment(label).format("Do MMM YY")} */}
      </p>

      <p className="mt-1 text-gray-600">
        <span className="font-semibold text-purple-600">Total:</span>{" "}
        ₹{data.amount.toLocaleString("en-IN")}
      </p>

      {data.details && (
        <div className="mt-2">
          <p className="text-gray-700 font-medium">Details:</p>

          {Object.entries(data.details).map(([key, value]) => (
            <p key={key} className="text-gray-600 flex justify-between">
              <span>{key}</span>
              <span>₹{value.toLocaleString("en-IN")}</span>
            </p>
          ))}
        </div>
      )}
    </div>
  );
};

export default CustomIncomeTooltip;
