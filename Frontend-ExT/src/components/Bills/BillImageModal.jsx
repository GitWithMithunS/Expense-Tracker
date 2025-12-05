const BillImageModal = ({ image, onClose }) => {
  if (!image) return null;

  return (
    <div
      className="fixed inset-0 bg-black/85 z-50 flex items-center justify-center"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <button
        onClick={onClose}
        className="absolute top-4 right-4 bg-white/20 text-white rounded-full w-10 h-10 flex items-center justify-center"
      >
        ✕
      </button>

      <img
        src={image}
        className="max-w-[95vw] max-h-[90vh] object-contain"
        alt=""
      />
    </div>
  );
};

export default BillImageModal;
