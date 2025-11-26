import toast from "react-hot-toast";
import { CheckCircle, XCircle, AlertTriangle, Info } from "lucide-react";

// Base Toast Style (similar to built-in React-Hot-Toast design)
const baseToastStyle = `
  flex items-center gap-3 bg-white text-gray-800 shadow-lg 
  p-3 rounded-lg border-l-4
`;

export const showSuccessToast = (message) =>
  toast.custom(
    (t) => (
      <div
        className={`${baseToastStyle} border-green-500 ${
          t.visible ? "animate-enter" : "animate-leave"
        }`}
      >
        <CheckCircle className="text-green-600" size={22} />
        <span className="text-sm">{message}</span>
      </div>
    ),
    { duration: 2200 }
  );

export const showErrorToast = (message) =>
  toast.custom(
    (t) => (
      <div
        className={`${baseToastStyle} border-red-500 ${
          t.visible ? "animate-enter" : "animate-leave"
        }`}
      >
        <XCircle className="text-red-600" size={22} />
        <span className="text-sm">{message}</span>
      </div>
    ),
    { duration: 2500 }
  );

export const showWarningToast = (message) =>
  toast.custom(
    (t) => (
      <div
        className={`${baseToastStyle} border-yellow-500 ${
          t.visible ? "animate-enter" : "animate-leave"
        }`}
      >
        <AlertTriangle className="text-yellow-600" size={22} />
        <span className="text-sm">{message}</span>
      </div>
    ),
    { duration: 2600 }
  );

export const showInfoToast = (message) =>
  toast.custom(
    (t) => (
      <div
        className={`${baseToastStyle} border-blue-500 ${
          t.visible ? "animate-enter" : "animate-leave"
        }`}
      >
        <Info className="text-blue-600" size={22} />
        <span className="text-sm">{message}</span>
      </div>
    ),
    { duration: 2400 }
  );
