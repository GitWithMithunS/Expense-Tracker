export default function FilterCategoryDropdown({ categories, updateFilter }) {
  return (
    <>
      {categories.map((cat) => (
        <p
          key={cat.id}
          className="cursor-pointer p-2 hover:bg-gray-100 rounded"
          onClick={() => updateFilter("categoryId", cat.id)}
        >
          {cat.icon} {cat.name}
        </p>
      ))}
    </>
  );
}
