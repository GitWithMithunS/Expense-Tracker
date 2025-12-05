const BillCard = ({ bill, onView, onDownload, formatDate }) => {
  return (
    <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden transition">
      <div onClick={() => onView(bill.fileUrl)} className="cursor-pointer">
        <img
          src={bill.fileUrl}
          alt="Bill"
          className="w-full h-48 object-cover"
        />
      </div>

      <div className="p-3 text-sm text-gray-700">
        <p><strong>Description:</strong> {bill.description}</p>
        <p className="mt-1"><strong>Date:</strong> {formatDate(bill.date)}</p>
        <p className="mt-1"><strong>Category:</strong> {bill.category}</p>

        <button
          onClick={() => onDownload(bill.fileUrl, `${bill.description}.jpg`)}
          className="mt-3 w-full bg-purple-600 text-white py-1.5 rounded-lg text-sm hover:bg-purple-500"
        >
          Download
        </button>
      </div>
    </div>
  );
};

export default BillCard;
