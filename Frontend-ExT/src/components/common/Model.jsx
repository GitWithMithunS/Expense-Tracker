import { FileWarningIcon, Triangle, TriangleAlert, X } from "lucide-react";
import { useRef } from "react";

const Model = ({ isOpen, onClose, children, title }) => {
  if (!isOpen) return null;

  const modalRef = useRef(null);

  const handleBackdropClick = (e) => {
    if (modalRef.current && !modalRef.current.contains(e.target)) {
      console.log("Backdrop clicked → closing modal");
      onClose?.();
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex justify-center items-center 
                 bg-black/30 backdrop-blur-[1px]"
      onMouseDown={handleBackdropClick}
    >
      <div className="relative w-full max-w-xl mx-4">

        <div
          ref={modalRef}
          className="bg-white rounded-xl shadow-xl border border-gray-200 "
          onMouseDown={(e) => e.stopPropagation()} // prevents modal click from closing
        >
          {/* Header */}
          <div className="flex items-start justify-between p-5 border-b border-gray-100">
            <div className="flex flex-col">
              <h3 className="text-lg font-semibold text-gray-800">{title}</h3>

              {title === "Contact Support" && (
                <p className="text-[11px] text-orange-600 mt-1 flex items-center gap-1">
                  <TriangleAlert size={14} /> email quota — please use support only for essential issues/requests.
                </p>
              )}
            </div>

            <button
              onClick={onClose}
              className="text-gray-500 hover:bg-gray-200 w-9 h-9 flex items-center 
               justify-center rounded-full transition"
            >
              <X size={18} />
            </button>
          </div>



          {/* Body */}
          <div className="p-5 bg-white">{children}</div>
        </div>
      </div>
    </div>
  );
};

export default Model;
