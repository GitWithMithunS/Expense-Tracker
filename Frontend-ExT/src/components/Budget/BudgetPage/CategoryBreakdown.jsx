const CategoryBreakdown = ({ categories }) => {
  return (
    <div className="space-y-4">
      {categories.map((cat) => {
        const spent = cat.spent ?? 0;
        const percent = Math.min((spent / cat.limit) * 100, 100);

        return (
          <div key={cat.categories + "-" + cat.limit}>
            <div className="flex justify-between text-sm mb-1">
              <span className="font-medium">{cat.categories}</span>
              <span className="text-gray-600">
                ₹{spent} / ₹{cat.limit}
              </span>
            </div>

            <div className="w-full h-2 bg-gray-200 rounded-full">
              <div
                className={`h-full rounded-full ${
                  percent > 90
                    ? "bg-red-500"
                    : percent > 50
                    ? "bg-yellow-500"
                    : "bg-green-500"
                }`}
                style={{ width: `${percent}%` }}
              ></div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default CategoryBreakdown;
