import { UtensilsCrossed, TrendingUp, TrendingDown, Trash } from "lucide-react";
import React from "react";

const TransactionInfoCard = ({
    icon,
    title,
    date,
    amount,
    type,
    onDelete,
    categoryName,
    page

}) => {

    const amountStyle =
        type === "income"
            ? "bg-green-100 text-green-700 border border-green-300"
            : "bg-red-100 text-red-700 border border-red-300";

    const sign = type === "income" ? "+" : "-";

    const TrendIcon =
        type === "income" ? (
            <TrendingUp size={18} className="text-green-700" />
        ) : (
            <TrendingDown size={18} className="text-red-700" />
        );

    const formattedAmount = amount.toLocaleString("en-IN");

    const deleteStyle = (page === 'home' || page === 'filter') ? "opacity-0  transition-opacity text-gray-500 hover:text-yellow-600 ml-auto mr-2" :
        "opacity-0 group-hover:opacity-100 transition-opacity text-gray-500 hover:text-red-600 ml-auto mr-2"


    return (
        <div className="relative group">

            {/* Tooltip */}
            {categoryName && (
                <div
                    className="
                        absolute -top-7 left-1/2 -translate-x-1/2 
                        bg-gray-200 text-purple-800 text-[12px] px-3 py-1 rounded-md 
                        opacity-0 group-hover:opacity-100 
                        transition-opacity pointer-events-none z-20 
                    "
                >
                    Category: {categoryName}
                </div>
            )}

            {/* Category name shown on mobile only */}
            {categoryName && page!=='home' && (
                <p className="text-purple-700 text-xs mt-1 block md:hidden">
                    {categoryName}
                </p>
            )}



            <div
                className="relative flex items-center gap-4 p-4 rounded-lg
                    border border-gray-200 bg-white shadow-sm
                    hover:bg-purple-50 hover:shadow-md transition-all"
            >
                {/* Icon */}
                <div className="w-12 h-12 flex items-center justify-center 
                        bg-gray-100 rounded-full text-2xl shadow-sm">
                    {icon ? (
                        <span className="text-2xl">{icon}</span>
                    ) : (
                        <UtensilsCrossed size={22} className="text-purple-700" />
                    )}
                </div>

                {/* Details */}
                <div className="flex flex-col">
                    <p className="text-gray-800 font-semibold text-sm ">{  title}</p>
                    <p className="text-gray-500 mt-0.5 text-xs">{date}</p>
                </div>

                {/* Delete Button */}
                {/* {
                    (page === 'income' || page === 'expense') && */}
                <button
                onClick={() => onDelete()}
                className={deleteStyle}
                >
                    <Trash size={18} />
                </button>
                {/* } */}

                {/* Amount */}
                <div
                    className={`px-3 py-1 rounded-lg text-sm font-semibold shadow-sm flex items-center gap-2 ${amountStyle}`}
                >
                    {sign} ₹ {formattedAmount}
                    {TrendIcon}
                </div>
            </div>
        </div>
    );
};

export default TransactionInfoCard;
