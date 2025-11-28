import React from "react";

const ConfirmDelete = ({ item, label,  onCancel, onConfirm }) => {
  return (
    <div className="space-y-4">

      <p className="text-gray-700">
        Are you sure you want to delete <b>{item?.name} {label}</b>?
      </p>

      <div className="flex justify-end gap-3">

        {/* Cancel */}
        <button
          onClick={onCancel}
          className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
        >
          Cancel
        </button>

        {/* Confirm */}
        <button
          onClick={onConfirm}
          className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
        >
          Yes, Delete
        </button>

      </div>
    </div>
  );
};

export default ConfirmDelete;
