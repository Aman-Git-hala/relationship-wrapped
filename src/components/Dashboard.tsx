"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Home, Search, Calendar, Image as ImageIcon } from "lucide-react";

// --- SUB-COMPONENT: SEARCH VIEW ---
function SearchView({ data }: { data: any }) {
    const [query, setQuery] = useState("");
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
                        <p>No memories found for "{query}"</p>
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

// --- SUB-COMPONENT: HISTORY VIEW ---
function HistoryView({ data }: { data: any }) {
    const today = new Date();
    const currentMonth = today.getMonth(); // 0-indexed
    const currentDate = today.getDate();

    // Filter for messages from this day in history
    const memories = (data.search_index || []).filter((msg: any) => {
        const d = new Date(msg.timestamp);
        return d.getMonth() === currentMonth && d.getDate() === currentDate;
    });

    return (
        <div className="h-full flex flex-col gap-6">
            <div className="flex items-end justify-between border-b border-white/10 pb-6">
                <div>
                    <h2 className="text-3xl font-bold text-white mb-1">On This Day</h2>
                    <p className="text-white/50">{today.toLocaleDateString(undefined, { month: 'long', day: 'numeric' })}</p>
                </div>
                <div className="px-4 py-2 bg-purple-500/10 border border-purple-500/20 rounded-full text-purple-400 text-xs font-bold uppercase tracking-widest">
                    {memories.length} Memories Found
                </div>
            </div>

            <div className="flex-1 overflow-y-auto space-y-4 pr-2 custom-scrollbar">
                {memories.length === 0 ? (
                    <div className="text-center text-white/30 py-20">
                        <p>No specific memories found for today's date in history.</p>
                        <p className="text-sm mt-2">Try checking back tomorrow!</p>
                    </div>
                ) : (
                    memories.map((msg: any, idx: number) => (
                        <div key={idx} className="relative pl-8 border-l border-white/10 py-2">
                            <div className="absolute -left-[5px] top-6 w-2.5 h-2.5 rounded-full bg-purple-500 box-content border-4 border-black" />
                            <div className="bg-white/5 p-6 rounded-2xl border border-white/5 hover:bg-white/10 transition">
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

// --- SUB-COMPONENT: GALLERY VIEW ---
function GalleryView() {
    const PHOTO_COUNT = 20;
    const images = Array.from({ length: PHOTO_COUNT }).map((_, i) => `/memories/${i + 1}.jpeg`);

    return (
        <div className="h-full overflow-y-auto custom-scrollbar">
            <h2 className="text-3xl font-bold text-white mb-6 sticky top-0 bg-black/80 backdrop-blur-xl py-4 z-10 border-b border-white/10">The Gallery</h2>
            <div className="columns-2 md:columns-3 gap-4 space-y-4">
                {images.map((src, idx) => (
                    <div key={idx} className="break-inside-avoid relative group rounded-2xl overflow-hidden">
                        <img
                            src={src}
                            alt={`Memory ${idx + 1}`}
                            loading="lazy"
                            className="w-full h-auto object-cover transform transition duration-700 group-hover:scale-110"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    </div>
                ))}
            </div>
        </div>
    );
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function Dashboard({ data }: { data: any }) {
    const [activeTab, setActiveTab] = useState("home");

    // Navigation Configuration
    const tabs = [
        { id: "home", label: "Home", icon: Home },
        { id: "search", label: "Time Machine", icon: Search },
        { id: "history", label: "On This Day", icon: Calendar },
        { id: "gallery", label: "The Gallery", icon: ImageIcon },
    ];

    return (
        <div className="min-h-screen w-full bg-black text-white font-sans flex overflow-hidden relative">

            {/* 1. BACKGROUND (Subtle Animated Gradient) */}
            <div className="absolute inset-0 z-0 bg-gradient-to-br from-gray-900 via-black to-gray-900 animate-pulse" />

            {/* 2. SIDEBAR (Desktop) */}
            <aside className="hidden md:flex w-72 h-screen z-20 flex-col bg-white/5 backdrop-blur-2xl border-r border-white/10 p-6">
                <div className="mb-12 flex items-center gap-4 px-2">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-pink-500 to-violet-500 shadow-lg shadow-pink-500/20" />
                    <div>
                        <h1 className="font-bold text-xl tracking-wider text-white">OUR WORLD</h1>
                        <p className="text-xs text-white/40 uppercase tracking-widest">OS v2.0</p>
                    </div>
                </div>

                <nav className="flex-1 space-y-3">
                    {tabs.map((tab) => {
                        const Icon = tab.icon;
                        const isActive = activeTab === tab.id;
                        return (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`w-full flex items-center gap-4 px-4 py-4 rounded-xl transition-all duration-300 group ${isActive
                                    ? "bg-white/10 text-white shadow-lg border border-white/5"
                                    : "text-white/40 hover:bg-white/5 hover:text-white"
                                    }`}
                            >
                                <Icon className={`w-5 h-5 ${isActive ? "text-pink-400" : "group-hover:text-pink-400 transition-colors"}`} />
                                <span className="font-medium text-sm tracking-wide">{tab.label}</span>
                            </button>
                        )
                    })}
                </nav>
            </aside>

            {/* 3. MOBILE NAV (Bottom Bar) */}
            <div className="md:hidden fixed bottom-0 left-0 right-0 h-20 bg-black/80 backdrop-blur-xl border-t border-white/10 z-50 flex justify-around items-center px-4 pb-2">
                {tabs.map((tab) => {
                    const Icon = tab.icon;
                    const isActive = activeTab === tab.id;
                    return (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`p-3 rounded-full transition-all ${isActive ? "text-pink-400 bg-white/10" : "text-white/40"}`}
                        >
                            <Icon className="w-6 h-6" />
                        </button>
                    )
                })}
            </div>

            {/* 4. MAIN CONTENT AREA */}
            <main className="flex-1 h-screen overflow-y-auto relative z-10 p-6 md:p-12">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={activeTab}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ duration: 0.2 }}
                        className="w-full max-w-6xl mx-auto h-full"
                    >
                        {/* DYNAMIC CONTENT SWITCHER */}
                        {activeTab === "home" && <HomeView data={data} onChangeTab={setActiveTab} />}
                        {activeTab === "search" && <SearchView data={data} />}
                        {activeTab === "history" && <HistoryView data={data} />}
                        {activeTab === "gallery" && <GalleryView />}
                    </motion.div>
                </AnimatePresence>
            </main>
        </div>
    );
}

// --- SUB-COMPONENT: HOME VIEW ---
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function HomeView({ data, onChangeTab }: { data: any, onChangeTab: (tab: string) => void }) {
    const today = new Date().toDateString();

    // Select a random quote from available messages (sweetest or funniest)
    // We use a fixed seed based on the day or just random on mount
    const quotes = [...(data.wrapped.sweetest || []), ...(data.wrapped.funniest || [])];
    const randomQuote = quotes.length > 0 ? quotes[Math.floor(Math.random() * quotes.length)] : null;


    return (
        <div className="space-y-10">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-end gap-4 border-b border-white/10 pb-8">
                <div>
                    <h2 className="text-4xl md:text-6xl font-black text-white mb-2 tracking-tight">Welcome Home.</h2>
                    <p className="text-white/50 text-lg">{today}</p>
                </div>
                <div className="flex gap-4">
                    <div className="px-4 py-2 bg-white/5 border border-white/10 rounded-full text-white/60 text-xs font-bold uppercase tracking-widest">
                        {data.meta.total_messages.toLocaleString()} Messages
                    </div>
                    <div className="px-4 py-2 bg-green-500/10 border border-green-500/20 rounded-full text-green-400 text-xs font-bold uppercase tracking-widest animate-pulse">
                        System Online
                    </div>
                </div>
            </div>

            {/* Quick Actions Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Search Card */}
                <div
                    onClick={() => onChangeTab("search")}
                    className="group bg-white/5 border border-white/10 p-8 rounded-3xl hover:bg-white/10 transition cursor-pointer relative overflow-hidden"
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
                    className="group bg-white/5 border border-white/10 p-8 rounded-3xl hover:bg-white/10 transition cursor-pointer relative overflow-hidden"
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
                    className="group bg-white/5 border border-white/10 p-8 rounded-3xl hover:bg-white/10 transition cursor-pointer relative overflow-hidden"
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
                <div className="w-full bg-gradient-to-r from-pink-900/20 to-purple-900/20 border border-white/10 rounded-3xl flex flex-col items-center justify-center text-center p-12 relative overflow-hidden group">
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