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
        <div className={`h-full flex flex-col transition-all duration-500 ${query.length === 0 ? "justify-center items-center" : "justify-start pt-0"}`}>

            <div className={`w-full max-w-2xl relative transition-all duration-500 ${query.length === 0 ? "scale-110" : "scale-100"}`}>
                <Search className={`absolute left-6 top-1/2 -translate-y-1/2 w-6 h-6 transition-colors ${query.length === 0 ? "text-white/50" : "text-white/30"}`} />
                <input
                    type="text"
                    placeholder="Search your history..."
                    value={query}
                    onChange={handleSearch}
                    className="w-full bg-white/5 rounded-2xl py-6 pl-16 pr-6 text-white text-xl focus:outline-none focus:bg-white/10 transition-colors placeholder:text-white/20 shadow-2xl"
                    autoFocus
                />
            </div>

            <div className={`flex-1 w-full max-w-2xl overflow-y-auto custom-scrollbar relative z-10 transition-opacity duration-500 ${query.length === 0 ? "opacity-0 h-0 flex-none" : "opacity-100 mt-6"}`}>
                {query.length > 0 && results.length === 0 && (
                    <div className="text-center text-white/30 py-20">
                        <p>No memories found for &quot;{query}&quot;</p>
                    </div>
                )}

                {results.map((msg, idx) => (
                    <div key={idx} className="bg-white/5 p-6 rounded-2xl hover:bg-white/10 transition group mb-4">
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

            {/* Helper Text when empty */}
            {query.length === 0 && (
                <div className="mt-6 text-white/30 font-mono text-xs uppercase tracking-[0.3em] animate-pulse absolute bottom-10 md:static">
                    Type to travel back in time...
                </div>
            )}
        </div>
    );
}
