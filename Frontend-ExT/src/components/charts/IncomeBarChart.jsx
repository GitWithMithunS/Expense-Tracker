import React from "react";
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from "recharts";
import moment from "moment";
import CustomIncomeTooltip from "./CustomIncomeTooltip";

const IncomeBarChart = ({ incomeData }) => {
    return (
        <div className="bg-white p-5 rounded-xl shadow-md border border-gray-200 w-full">

            <h3 className="text-lg font-semibold text-gray-800 mb-4">
                Income Bar Graph
            </h3>

            <div className="h-[320px] sm:h-[340px] md:h-[360px] flex items-center justify-center">
                {/* <div className="h-72 w-full"> */}
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={incomeData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#ddd" />

                        <XAxis
                            dataKey="date"
                            tickFormatter={(value) =>
                                moment(value).format("Do MMM")
                            }
                        />

                        <YAxis />
                        <Tooltip content={<CustomIncomeTooltip />} />

                        <Bar dataKey="amount" fill="#805ad5" radius={[6, 6, 0, 0]} />
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};

export default IncomeBarChart;
