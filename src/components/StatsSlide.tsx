"use client";
import { useMemo } from "react";
import { motion } from "framer-motion";
import { Clock, TrendingUp, Activity, Heart, Moon, MessageSquare, ArrowRight } from "lucide-react";
import { AreaChart, Area, Tooltip, ResponsiveContainer, BarChart, Bar } from "recharts";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function StatsSlide({ data, onNext }: { data: any, onNext: () => void }) {

    // --- DATA PROCESSING ---
    const timeline = useMemo(() => data?.wrapped?.timeline || [], [data]);
    const messages = useMemo(() => data?.search_index || [], [data]);

    // 1. TIMELINE DATA
    const chartData = useMemo(() => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        return timeline.map((item: any) => ({
            name: item.month_year.split(" ")[0], // Just month name
            value: item.count,
        }));
    }, [timeline]);

    // 2. HOURLY DISTRIBUTION
    const hourlyData = useMemo(() => {
        const hours = new Array(24).fill(0);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        messages.forEach((msg: any) => {
            if (msg.timestamp) {
                const h = new Date(msg.timestamp).getHours();
                hours[h]++;
            }
        });
        return hours.map((count, hour) => ({
            hour: hour,
            label: `${hour}`,
            count
        }));
    }, [messages]);

    // 3. EMOTIONS
    const emotionStats = useMemo(() => {
        const counts: Record<string, number> = {};
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        messages.forEach((msg: any) => {
            if (msg.emotion && msg.emotion !== "neutral") {
                counts[msg.emotion] = (counts[msg.emotion] || 0) + 1;
            }
        });
        return Object.entries(counts)
            .sort(([, a], [, b]) => b - a)
            .slice(0, 5)
            .map(([key, val]) => ({ name: key, value: val }));
    }, [messages]);

    // 4. METRICS & COMMENTARY
    const totalMessages = data.meta.total_messages;
    const activeDays = timeline.length * 30; // Approx
    const msgsPerDay = (totalMessages / activeDays).toFixed(0);

    // Roast / Commentary Logic
    const volumeComments = [
        "A reasonable amount of talking.",
        "Basically writing a novel every month.",
        "Do you two ever put the phone down?",
        "Quality over quantity, right?",
        "RIP to your data plan.",
        "That's a lot of typing...",
        "Keyboard must be on fire."
    ];

    // Pick based on thresholds but with some variety if possible, 
    // or just pick purely random to fulfill the user request for "random each time"
    // However, stats should somewhat reflect reality. 
    // We'll stick to threshold-based buckets but pick randomly WITHIN the bucket.

    const getVolumeComment = (total: number) => {
        const high = ["Basically writing a novel.", "Do you ever stop?", "Phone addiction confirmed.", "Novel writers in the making."];
        const med = ["A healthy amount of chatter.", "Keeping the connection alive.", "Solid communication stats."];
        const low = ["Quality over quantity.", "Silent but strong.", "Less talk, more action?"];

        if (total > 50000) return high[Math.floor(Math.random() * high.length)];
        if (total > 10000) return med[Math.floor(Math.random() * med.length)];
        return low[Math.floor(Math.random() * low.length)];
    };

    // We use useMemo nicely here so it stays consistent during re-renders, but changes on mount (if we add a dependency like Date.now() or just let it run once)
    const volumeComment = useMemo(() => getVolumeComment(totalMessages), [totalMessages]);

    const nightOwls = hourlyData.filter(h => h.hour >= 0 && h.hour < 5).reduce((a, b) => a + b.count, 0);
    const nightOwlPercent = ((nightOwls / totalMessages) * 100).toFixed(1);

    const getSleepComment = (percent: number) => {
        const vamp = ["Vampires detected.", "Who needs sleep?", "Nocturnal lovebirds.", "Creatures of the night."];
        const normal = ["Healthy sleep schedule.", "Early birds.", "Responsibly asleep."];

        if (percent > 10) return vamp[Math.floor(Math.random() * vamp.length)];
        return normal[Math.floor(Math.random() * normal.length)];
    };

    const sleepComment = useMemo(() => getSleepComment(Number(nightOwlPercent)), [nightOwlPercent]);

    // Formatting
    const formatNum = (num: number) => num > 1000 ? (num / 1000).toFixed(1) + "k" : num.toString();
    const COLORS = ['#F472B6', '#A78BFA', '#60A5FA', '#34D399', '#FBBF24'];

    return (
        <div className="w-full h-full bg-black/90 text-white overflow-y-auto relative py-20 px-4 md:px-8 font-mono">

            {/* BACKGROUND DECOR */}
            <div className="fixed inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-gray-900 via-black to-black z-0" />

            {/* MAIN CONTAINER */}
            <div className="relative z-10 max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 mb-32">

                {/* --- LEFT COLUMN: RAW DATA & COMMENTARY --- */}
                <div className="flex flex-col gap-8">

                    {/* Header */}
                    <div className="mb-8">
                        <div className="flex items-center gap-2 mb-2">
                            <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse" />
                            <span className="text-xs uppercase tracking-[0.3em] text-red-500">Live Telemetry</span>
                        </div>
                        <h1 className="text-5xl font-black tracking-tighter text-white mb-4">THE STATS.</h1>
                        <p className="text-white/40 text-sm">
                            We crunched the numbers so you don&apos;t have to. Here is the raw data of your relationship.
                        </p>
                    </div>

                    {/* Metric 1: Volume */}
                    <div className="bg-white/5 border border-white/10 p-6 rounded-2xl hover:bg-white/10 transition-colors">
                        <div className="flex items-center gap-3 mb-4 text-white/50">
                            <MessageSquare className="w-5 h-5" />
                            <span className="text-xs uppercase tracking-widest">Total Volume</span>
                        </div>
                        <div className="text-6xl font-bold text-white mb-2">{formatNum(totalMessages)}</div>
                        <p className="text-pink-400 text-sm font-bold border-l-2 border-pink-500 pl-3 py-1">
                            &quot;{volumeComment}&quot;
                        </p>
                    </div>

                    {/* Metric 2: Daily Average */}
                    <div className="bg-white/5 border border-white/10 p-6 rounded-2xl hover:bg-white/10 transition-colors">
                        <div className="flex items-center gap-3 mb-4 text-white/50">
                            <Activity className="w-5 h-5" />
                            <span className="text-xs uppercase tracking-widest">Intensity</span>
                        </div>
                        <div className="flex items-baseline gap-2">
                            <div className="text-5xl font-bold text-white mb-2">{msgsPerDay}</div>
                            <span className="text-white/40 text-sm">msgs/day</span>
                        </div>
                        <p className="text-purple-400 text-sm italic">
                            Consistency is key.
                        </p>
                    </div>

                    {/* Metric 3: Night Owl */}
                    <div className="bg-white/5 border border-white/10 p-6 rounded-2xl hover:bg-white/10 transition-colors">
                        <div className="flex items-center gap-3 mb-4 text-white/50">
                            <Moon className="w-5 h-5" />
                            <span className="text-xs uppercase tracking-widest">Nocturnal Index</span>
                        </div>
                        <div className="text-5xl font-bold text-white mb-2">{nightOwlPercent}%</div>
                        <p className="text-blue-400 text-sm font-bold border-l-2 border-blue-500 pl-3 py-1">
                            &quot;{sleepComment}&quot;
                        </p>
                    </div>

                    <div className="p-4 rounded-xl dashed-border border-white/20 text-center text-white/30 text-xs uppercase tracking-widest">
                        End of raw data stream
                    </div>

                </div>

                {/* --- RIGHT COLUMN: VISUALS --- */}
                <div className="flex flex-col gap-8">

                    {/* Chart 1: Timeline */}
                    <div className="bg-black/40 backdrop-blur-md border border-white/10 p-6 rounded-3xl sticky top-8">
                        <div className="mb-6 flex justify-between items-center">
                            <h3 className="text-sm font-bold uppercase tracking-widest text-white/80">Activity Timeline</h3>
                            <TrendingUp className="w-4 h-4 text-green-400" />
                        </div>
                        <div className="h-48 w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={chartData}>
                                    <defs>
                                        <linearGradient id="colorVal" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#ec4899" stopOpacity={0.8} />
                                            <stop offset="95%" stopColor="#ec4899" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <Tooltip
                                        contentStyle={{ backgroundColor: '#000', border: '1px solid #333', borderRadius: '8px' }}
                                        itemStyle={{ color: '#fff' }}
                                    />
                                    <Area type="monotone" dataKey="value" stroke="#ec4899" fillOpacity={1} fill="url(#colorVal)" />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    {/* Chart 2: Hourly */}
                    <div className="bg-black/40 backdrop-blur-md border border-white/10 p-6 rounded-3xl">
                        <div className="mb-6 flex justify-between items-center">
                            <h3 className="text-sm font-bold uppercase tracking-widest text-white/80">Circadian Rhythm</h3>
                            <Clock className="w-4 h-4 text-blue-400" />
                        </div>
                        <div className="h-48 w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={hourlyData}>
                                    <Tooltip
                                        cursor={{ fill: 'rgba(255,255,255,0.1)' }}
                                        contentStyle={{ backgroundColor: '#000', border: '1px solid #333', borderRadius: '8px' }}
                                    />
                                    <Bar dataKey="count" fill="#3b82f6" radius={[2, 2, 0, 0]} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                        <p className="text-xs text-white/30 text-center mt-4 uppercase">00:00 - 23:00 Distribution</p>
                    </div>

                    {/* Chart 3: Emotions */}
                    <div className="bg-black/40 backdrop-blur-md border border-white/10 p-6 rounded-3xl">
                        <div className="mb-6 flex justify-between items-center">
                            <h3 className="text-sm font-bold uppercase tracking-widest text-white/80">Vibe Check</h3>
                            <Heart className="w-4 h-4 text-red-400" />
                        </div>
                        <div className="space-y-4">
                            {emotionStats.map((item, idx) => (
                                <div key={item.name} className="flex items-center gap-3">
                                    <span className="text-xs w-16 text-right text-white/50 uppercase">{item.name}</span>
                                    <div className="flex-1 h-2 bg-white/5 rounded-full overflow-hidden">
                                        <motion.div
                                            initial={{ width: 0 }}
                                            whileInView={{ width: `${(item.value / emotionStats[0].value) * 100}%` }}
                                            className="h-full rounded-full"
                                            style={{ backgroundColor: COLORS[idx % COLORS.length] }}
                                        />
                                    </div>
                                    <span className="text-xs w-8 text-white/70">{item.value}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                </div>
            </div>

            {/* Continue Button (Fixed Bottom) */}
            <div className="fixed bottom-0 left-0 w-full p-6 bg-gradient-to-t from-black via-black/80 to-transparent z-50 flex justify-center pointer-events-none">
                <motion.button
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 2 }}
                    onClick={onNext}
                    className="pointer-events-auto flex items-center gap-2 bg-white text-black px-8 py-3 rounded-full font-bold uppercase tracking-widest hover:scale-105 transition-transform shadow-xl"
                >
                    Next Chapter <ArrowRight className="w-4 h-4" />
                </motion.button>
            </div>

        </div>
    );
}