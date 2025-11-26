import { Layers2, Pencil, Trash } from "lucide-react";
import React from "react";

const CategoryList = ({ categories, onEditCategory, onDeleteCategory }) => {
  return (
    <div className="card p-4 bg-white">
      <div className="flex items-center mb-4">
        <h4 className="text-lg font-semibold">Category Sources</h4>
      </div>

      {categories.length === 0 ? (
        <p className="text-gray-500">
          No categories added yet. Add some categories to get started.
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {categories.map((category) => (
            <div
              key={category.id}
              className="group relative flex items-center gap-4 p-4 rounded-lg 
                         border border-gray-200 bg-white shadow-sm
                         hover:bg-purple-50 hover:shadow-md transition-all"
            >
              {/* Icon */}
              <div className="w-12 h-12 flex items-center justify-center 
                              bg-gray-100 rounded-full text-2xl shadow-sm">
                {category.icon ? (
                  <span>{category.icon}</span>
                ) : (
                  <Layers2 className="text-purple-700" size={24} />
                )}
              </div>

              {/* Category details */}
              <div className="flex flex-col justify-center">
                <p className="text-gray-800 font-semibold text-sm">
                  {category.name}
                </p>

                <p className="text-gray-500 mt-0.5 capitalize text-xs">
                  {category.type}
                </p>
              </div>

              {/*  Action buttons - placed exactly AFTER category details div */}
              <div className="flex items-center gap-3 ml-auto opacity-0 group-hover:opacity-100 transition-opacity">
                {/* Edit */}
                <button
                  onClick={() => onEditCategory?.(category)}
                  className="text-gray-500 hover:text-blue-600"
                >
                  <Pencil size={18} />
                </button>

                {/* Delete */}
                <button
                  onClick={() => onDeleteCategory?.(category)}
                  className="text-gray-500 hover:text-red-600"
                >
                  <Trash size={18} />
                </button>
              </div>

            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CategoryList;
