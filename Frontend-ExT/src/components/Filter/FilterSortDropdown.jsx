export default function FilterSortDropdown({ updateFilter }) {
  return (
    <>
      <p className="p-2 hover:bg-gray-100 cursor-pointer"
         onClick={() => updateFilter("sortBy", "date-asc")}>
        Date (Old → New)
      </p>

      <p className="p-2 hover:bg-gray-100 cursor-pointer"
         onClick={() => updateFilter("sortBy", "date-desc")}>
        Date (New → Old)
      </p>

      <p className="p-2 hover:bg-gray-100 cursor-pointer"
         onClick={() => updateFilter("sortBy", "amount-asc")}>
        Amount (Low → High)
      </p>

      <p className="p-2 hover:bg-gray-100 cursor-pointer"
         onClick={() => updateFilter("sortBy", "amount-desc")}>
        Amount (High → Low)
      </p>
    </>
  );
}
