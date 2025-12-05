import { SlidersHorizontal, ChevronDown } from "lucide-react";
import FilterDropdown from "./FilterDropdown";

export default function FilterBar({
  filterButtons,
  dropdown,
  toggleDropdown,
  getFilterLabel,
  clearFilters,
  categories,
  updateFilter,
}) {
  return (
    <div className="flex flex-wrap items-center gap-4 bg-white shadow rounded-xl p-4">

      {/* Icon */}
      <div className="p-3 rounded-lg shadow-sm bg-gray-100">
        <SlidersHorizontal className="text-gray-600" />
      </div>

      {/* Filter Buttons */}
      {filterButtons && filterButtons.map((btn) => (
        <div key={btn.id} className="relative">
          <button
            onClick={() => toggleDropdown(btn.id)}
            className="flex items-center gap-2 px-4 py-2 bg-white border rounded-lg shadow-sm hover:shadow-md cursor-pointer"
          >
            {getFilterLabel(btn.id)}
            <ChevronDown size={16} />
          </button>

          {dropdown === btn.id && (
            <FilterDropdown
              id={btn.id}
              categories={categories}
              updateFilter={updateFilter}
            />
          )}
        </div>
      ))}

      {/* Clear Button */}
      <button
        onClick={clearFilters}
        className="ml-auto px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white rounded-lg"
      >
        Clear All
      </button>
    </div>
  );
}
