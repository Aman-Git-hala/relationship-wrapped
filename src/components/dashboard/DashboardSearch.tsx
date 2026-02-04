"use client";
import { useState } from "react";
import { Search } from "lucide-react";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function DashboardSearch({ data }: { data: any }) {
    const [query, setQuery] = useState("");
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const [results, setResults] = useState<any[]>([]);

    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        const q = e.target.value.toLowerCase();
        setQuery(q);
        if (q.length < 2) {
            setResults([]);
            return;
        }

        // Search logic: filter from data.search_index
        // Limit to 50 results for performance
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const matches = (data.search_index || [])
            .filter((msg: any) => msg.message && msg.message.toLowerCase().includes(q))
            .slice(0, 50);
        setResults(matches);
    };

    return (
        <div className="h-full flex flex-col gap-6">
            <div className="relative">
                <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-6 h-6 text-white/30" />
                <input
                    type="text"
                    placeholder="Search your history..."
                    value={query}
                    onChange={handleSearch}
                    className="w-full bg-white/5 border border-white/10 rounded-2xl py-6 pl-16 pr-6 text-white text-xl focus:outline-none focus:bg-white/10 transition-colors placeholder:text-white/20"
                    autoFocus
                />
            </div>

            <div className="flex-1 overflow-y-auto space-y-4 pr-2 custom-scrollbar">
                {query.length > 0 && results.length === 0 && (
                    <div className="text-center text-white/30 py-20">
                        <p>No memories found for &quot;{query}&quot;</p>
                    </div>
                )}

                {query.length === 0 && (
                    <div className="text-center text-white/30 py-20">
                        <p>Type to travel back in time...</p>
                    </div>
                )}

                {results.map((msg, idx) => (
                    <div key={idx} className="bg-white/5 p-6 rounded-2xl border border-white/5 hover:border-white/10 transition group">
                        <div className="flex justify-between items-start mb-2">
                            <span className={`text-xs font-bold uppercase tracking-widest ${msg.sender === "aman" ? "text-blue-400" : "text-pink-400"}`}>
                                {msg.sender}
                            </span>
                            <span className="text-xs text-white/30 font-mono">
                                {new Date(msg.timestamp).toLocaleString()}
                            </span>
                        </div>
                        <p className="text-white/80 leading-relaxed font-light text-lg">
                            {msg.message}
                        </p>
                        {msg.emotion && (
                            <div className="mt-4 flex gap-2">
                                <span className="text-[10px] px-2 py-1 rounded bg-white/5 text-white/30 uppercase tracking-wider">
                                    {msg.emotion}
                                </span>
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}
