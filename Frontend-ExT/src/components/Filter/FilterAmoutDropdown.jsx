export default function FilterAmountDropdown({ updateFilter }) {
  return (
    <>
      <label className="text-xs text-gray-500">Min Amount</label>
      <input
        type="number"
        className="border w-full rounded px-3 py-2 mb-3"
        onChange={(e) => updateFilter("minAmount", e.target.value)}
      />

      <label className="text-xs text-gray-500">Max Amount</label>
      <input
        type="number"
        className="border w-full rounded px-3 py-2"
        onChange={(e) => updateFilter("maxAmount", e.target.value)}
      />
    </>
  );
}
