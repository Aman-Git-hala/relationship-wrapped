"use client";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function DashboardHistory({ data }: { data: any }) {
    const today = new Date();
    const currentMonth = today.getMonth(); // 0-indexed
    const currentDate = today.getDate();

    // Filter for messages from this day in history
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const memories = (data.search_index || []).filter((msg: any) => {
        const d = new Date(msg.timestamp);
        return d.getMonth() === currentMonth && d.getDate() === currentDate;
    });

    return (
        <div className="h-full flex flex-col gap-6">
            <div className="flex items-end justify-between pb-6">
                <div>
                    <h2 className="text-3xl font-bold text-white mb-1">On This Day</h2>
                    <p className="text-white/50">{today.toLocaleDateString(undefined, { month: 'long', day: 'numeric' })}</p>
                </div>
                <div className="px-4 py-2 bg-purple-500/10 rounded-full text-purple-400 text-xs font-bold uppercase tracking-widest">
                    {memories.length} Memories Found
                </div>
            </div>

            <div className="flex-1 overflow-y-auto space-y-4 pr-2 custom-scrollbar">
                {memories.length === 0 ? (
                    <div className="text-center text-white/30 py-20">
                        <p>No specific memories found for today&apos;s date in history.</p>
                        <p className="text-sm mt-2">Try checking back tomorrow!</p>
                    </div>
                ) : (
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    memories.map((msg: any, idx: number) => (
                        <div key={idx} className="relative pl-8 border-l border-white/5 py-2">
                            <div className="absolute -left-[5px] top-6 w-2.5 h-2.5 rounded-full bg-purple-500 box-content border-4 border-black" />
                            <div className="bg-white/5 p-6 rounded-2xl hover:bg-white/10 transition">
                                <div className="flex justify-between items-start mb-2">
                                    <span className="text-xl font-bold text-white">
                                        {new Date(msg.timestamp).getFullYear()}
                                    </span>
                                    <span className={`text-xs font-bold uppercase tracking-widest ${msg.sender === "aman" ? "text-blue-400" : "text-pink-400"}`}>
                                        {msg.sender}
                                    </span>
                                </div>
                                <p className="text-white/80 text-lg leading-relaxed">{msg.message}</p>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
