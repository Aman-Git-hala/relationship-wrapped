
"use client";
import { useMemo, useState } from "react";
import { motion } from "framer-motion";

interface VibeCalendarProps {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    data: any[]; // Array of message objects with 'timestamp'
}

export default function VibeCalendar({ data }: VibeCalendarProps) {
    const [hoveredDate, setHoveredDate] = useState<{ date: string; count: number } | null>(null);

    // Process data into valid daily counts for the last 365 days
    const calendarData = useMemo(() => {
        const counts: Record<string, number> = {};
        const today = new Date();
        const oneYearAgo = new Date();
        oneYearAgo.setFullYear(today.getFullYear() - 1);

        // Filter and count matches
        data.forEach((msg) => {
            if (!msg.timestamp) return;
            const date = new Date(msg.timestamp);
            if (date >= oneYearAgo && date <= today) {
                const key = date.toISOString().split("T")[0]; // YYYY-MM-DD
                counts[key] = (counts[key] || 0) + 1;
            }
        });

        // Generate full grid (Weeks x Days)
        // We need 52-53 columns, 7 rows.
        // We'll traverse week by week.
        const weeks = [];
        const current = new Date(oneYearAgo);

        // Align to previous Sunday to start the grid cleanly
        current.setDate(current.getDate() - current.getDay());

        while (current <= today) {
            const week = [];
            for (let i = 0; i < 7; i++) {
                const key = current.toISOString().split("T")[0];
                week.push({
                    date: key,
                    count: counts[key] || 0,
                    level: 0
                });
                current.setDate(current.getDate() + 1);
            }
            weeks.push(week);
        }

        // Normalize for color scales (0-4)
        const max = Math.max(...Object.values(counts), 1);

        return weeks.map(week => week.map(day => ({
            ...day,
            level: Math.ceil((day.count / max) * 4) // 0 to 4
        })));
    }, [data]);

    const getColor = (level: number) => {
        switch (level) {
            case 0: return "bg-white/5";
            case 1: return "bg-green-900/50";
            case 2: return "bg-green-700/60";
            case 3: return "bg-green-500/80";
            case 4: return "bg-green-400"; // Glowing max
            default: return "bg-white/5";
        }
    };

    return (
        <div className="flex flex-col gap-2 w-full overflow-x-auto pb-4">
            <div className="flex gap-1 min-w-max">
                {calendarData.map((week, wIdx) => (
                    <div key={wIdx} className="flex flex-col gap-1">
                        {week.map((day) => (
                            <motion.div
                                key={day.date}
                                initial={false}
                                whileHover={{ scale: 1.3, zIndex: 10 }}
                                onMouseEnter={() => setHoveredDate(day)}
                                onMouseLeave={() => setHoveredDate(null)}
                                className={`w-2 h-2 md:w-3 md:h-3 rounded-sm ${getColor(day.level)} transition-colors duration-300 relative cursor-pointer`}
                            >
                                {/* Tooltip for Hover */}
                                {hoveredDate?.date === day.date && (
                                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 bg-black border border-white/20 text-white text-[10px] whitespace-nowrap px-2 py-1 rounded shadow-xl z-50 pointer-events-none">
                                        <div className="font-bold">{day.date}</div>
                                        <div className="text-white/50">{day.count} messages</div>
                                    </div>
                                )}
                            </motion.div>
                        ))}
                    </div>
                ))}
            </div>

            {/* Legend */}
            <div className="flex items-center gap-2 text-[10px] text-white/30 mt-2 justify-end">
                <span>Less</span>
                <div className="w-2 h-2 rounded-sm bg-white/5" />
                <div className="w-2 h-2 rounded-sm bg-green-900/50" />
                <div className="w-2 h-2 rounded-sm bg-green-700/60" />
                <div className="w-2 h-2 rounded-sm bg-green-500/80" />
                <div className="w-2 h-2 rounded-sm bg-green-400" />
                <span>More</span>
            </div>
        </div>
    );
}
