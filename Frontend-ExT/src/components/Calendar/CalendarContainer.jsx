export default function CalendarContainer({ cal_ref, children, onClose }) {
  return (
    <div className="fixed inset-0 z-90 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose}></div>

      <div
        ref={cal_ref}
        className="relative w-full overflow-y-auto max-w-5xl mx-4 bg-white rounded-xl shadow-xl border border-gray-200"
        style={{ minHeight: 420 }}
      >
        {children}
      </div>
    </div>
  );
}
