import { Search, Calendar, Image as ImageIcon } from "lucide-react";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function DashboardHome({ data, onChangeTab }: { data: any, onChangeTab: (tab: string) => void }) {
    const today = new Date().toDateString();

    // Select a random quote from available messages (sweetest or funniest)
    // We use a fixed seed based on the day or just random on mount
    const quotes = [...(data.wrapped.sweetest || []), ...(data.wrapped.funniest || [])];
    const randomQuote = quotes.length > 0 ? quotes[Math.floor(Math.random() * quotes.length)] : null;


    return (
        <div className="space-y-10">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-end gap-4 pb-8">
                <div>
                    <h2 className="text-4xl md:text-6xl font-black text-white mb-2 tracking-tight">Welcome Home.</h2>
                    <p className="text-white/50 text-lg">{today}</p>
                </div>
                <div className="flex gap-4">
                    <div className="px-4 py-2 bg-white/5 rounded-full text-white/60 text-xs font-bold uppercase tracking-widest">
                        {data.meta.total_messages.toLocaleString()} Messages
                    </div>
                    <div className="px-4 py-2 bg-green-500/10 rounded-full text-green-400 text-xs font-bold uppercase tracking-widest animate-pulse">
                        System Online
                    </div>
                </div>
            </div>

            {/* Quick Actions Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Search Card */}
                <div
                    onClick={() => onChangeTab("search")}
                    className="group bg-white/5 p-8 rounded-3xl hover:bg-white/10 transition cursor-pointer relative overflow-hidden"
                >
                    <div className="absolute top-0 right-0 p-4 opacity-20 group-hover:scale-110 transition-transform">
                        <Search className="w-24 h-24 text-white" />
                    </div>
                    <h3 className="text-white/40 uppercase text-xs font-bold tracking-widest mb-4">Find Anything</h3>
                    <p className="text-2xl font-bold text-white group-hover:text-pink-400 transition-colors">Time Machine</p>
                    <p className="text-sm text-white/40 mt-2">Search {data.meta.total_messages.toLocaleString()} messages...</p>
                </div>

                {/* Memories Card */}
                <div
                    onClick={() => onChangeTab("history")}
                    className="group bg-white/5 p-8 rounded-3xl hover:bg-white/10 transition cursor-pointer relative overflow-hidden"
                >
                    <div className="absolute top-0 right-0 p-4 opacity-20 group-hover:scale-110 transition-transform">
                        <Calendar className="w-24 h-24 text-purple-400" />
                    </div>
                    <h3 className="text-white/40 uppercase text-xs font-bold tracking-widest mb-4">Flashback</h3>
                    <p className="text-2xl font-bold text-white group-hover:text-purple-400 transition-colors">On This Day</p>
                    <p className="text-sm text-white/40 mt-2">See what happened exactly years ago.</p>
                </div>

                {/* Gallery Card */}
                <div
                    onClick={() => onChangeTab("gallery")}
                    className="group bg-white/5 p-8 rounded-3xl hover:bg-white/10 transition cursor-pointer relative overflow-hidden"
                >
                    <div className="absolute top-0 right-0 p-4 opacity-20 group-hover:scale-110 transition-transform">
                        <ImageIcon className="w-24 h-24 text-cyan-400" />
                    </div>
                    <h3 className="text-white/40 uppercase text-xs font-bold tracking-widest mb-4">Visuals</h3>
                    <p className="text-2xl font-bold text-white group-hover:text-cyan-400 transition-colors">The Gallery</p>
                    <p className="text-sm text-white/40 mt-2">Curated moments & media.</p>
                </div>
            </div>

            {/* Featured Memory Widget (Random Quote) */}
            {randomQuote && (
                <div className="w-full bg-gradient-to-r from-pink-900/20 to-purple-900/20 rounded-3xl flex flex-col items-center justify-center text-center p-12 relative overflow-hidden group">
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-pink-500 via-purple-500 to-cyan-500 opacity-50" />
                    <p className="text-pink-300 font-serif italic text-2xl md:text-4xl mb-6 leading-relaxed relative z-10">
                        &quot;{randomQuote.message}&quot;
                    </p>
                    <div className="flex items-center gap-3 text-white/40 text-xs uppercase tracking-widest z-10">
                        <span className={randomQuote.sender === "aman" ? "text-blue-400 font-bold" : "text-pink-400 font-bold"}>
                            {randomQuote.sender}
                        </span>
                        <span>•</span>
                        <span>{new Date(randomQuote.timestamp).toDateString()}</span>
                        <span>•</span>
                        <span className="opacity-50">{randomQuote.emotion || "Memory"}</span>
                    </div>
                </div>
            )}
        </div>
    )
}
