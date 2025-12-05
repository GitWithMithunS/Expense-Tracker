

export default function CalendarGrid({
    cells,
    year,
    monthIndex,
    today,
    netPerDay,
    openDay
}) {

    const pad = (n) => (n < 10 ? "0" + n : n);
    const formatDateKey = (y, m, d) => `${y}-${pad(m + 1)}-${pad(d)}`;

    return (
        <>
            {/* WEEKDAYS */}
            <div className="grid grid-cols-7 text-xs text-gray-500 mb-2">
                {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((w) => (
                    <div key={w} className="py-2 text-center">{w}</div>
                ))}
            </div>

            {/* DAYS GRID */}
            <div className="grid grid-cols-7 gap-2">
                {cells.map((day, idx) => {
                    if (day === null) return <div key={idx} className="h-24 p-2 border rounded bg-gray-50" />;

                    const dateStr = formatDateKey(year, monthIndex, day);
                    const net = netPerDay[dateStr] || 0;

                    const tagText = net === 0 ? "" : net > 0 ? `+₹${net}` : `-₹${Math.abs(net)}`;
                    const tagColor = net > 0
                        ? "bg-green-500 text-white"
                        : net < 0
                            ? "bg-red-500 text-white"
                            : "bg-gray-100 text-gray-500";

                    const isToday =
                        dateStr ===
                        `${today.getFullYear()}-${pad(today.getMonth() + 1)}-${pad(today.getDate())}`;

                    return (
                        <div
                            key={dateStr}
                            onClick={() => openDay(dateStr)}
                            className={`h-24 p-2 border rounded cursor-pointer relative flex flex-col justify-between
                ${isToday ? "ring-2 ring-purple-200" : ""}
              `}
                        >
                            <div className="flex justify-between items-start">
                                <div className="text-sm font-medium text-gray-700">{day}</div>
                                {tagText && (
                                    <div className={`text-xs font-semibold px-2 py-0.5 rounded ${tagColor}`}>
                                        {tagText}
                                    </div>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>
        </>
    );
}
