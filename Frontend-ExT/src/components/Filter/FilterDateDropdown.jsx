export default function FilterDateDropdown({ updateFilter }) {
  return (
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
  );
}
