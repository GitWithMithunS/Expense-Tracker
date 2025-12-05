import { ChevronLeft, ChevronRight } from "lucide-react";

export default function CalendarHeader({ monthIndex, year, goPrev, goNext }) {
  const monthNames = [
    "January","February","March","April","May","June",
    "July","August","September","October","November","December",
  ];

  return (
    <div className="flex items-center justify-between mb-4">
      <div className="flex items-center gap-3">
        <button onClick={goPrev} className="p-2 rounded hover:bg-gray-100">
          <ChevronLeft size={18} />
        </button>
        <div className="text-lg font-semibold">
          {monthNames[monthIndex]} {year}
        </div>
        <button onClick={goNext} className="p-2 rounded hover:bg-gray-100">
          <ChevronRight size={18} />
        </button>
      </div>
    </div>
  );
}
