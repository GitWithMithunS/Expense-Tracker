import FilterAmountDropdown from "./FilterAmoutDropdown";
import FilterSortDropdown from "./FilterSortDropdown";


export default function FilterDropdown({ id, categories, updateFilter }) {
    return (
        <div className="absolute top-12 left-0 bg-white border shadow-lg rounded-lg p-4 w-56 z-20">

            {id === "type" && (
                <>
                    <p className="p-2 hover:bg-gray-100 cursor-pointer"
                        onClick={() => updateFilter("type", "income")}>
                        Income
                    </p>
                    <p className="p-2 hover:bg-gray-100 cursor-pointer"
                        onClick={() => updateFilter("type", "expense")}>
                        Expense
                    </p>
                </>
            )}

            {id === "category" && (
                <>
                    {categories.map((cat) => (
                        <p
                            key={cat}
                            className="cursor-pointer p-2 hover:bg-gray-100 rounded"
                            onClick={() => updateFilter("category", cat)}
                        >
                            {cat}
                        </p>
                    ))}
                </>
            )}

            {id === "date" && (
                <>
                    <label className="text-xs text-gray-500">Start Date</label>
                    <input
                        type="date"
                        className="border w-full rounded px-3 py-2 mb-3"
                        onChange={(e) => updateFilter("startDate", e.target.value)}
                    />

                    <label className="text-xs text-gray-500">End Date</label>
                    <input
                        type="date"
                        className="border w-full rounded px-3 py-2"
                        onChange={(e) => updateFilter("endDate", e.target.value)}
                    />
                </>
            )}
            {id === "sortBy" && (
                <FilterSortDropdown updateFilter={updateFilter} />
            )}

            {id === "amount" && (
                <FilterAmountDropdown updateFilter={updateFilter} />
            )}

        </div>
    );
}
