"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Home, Search, Calendar, Image as ImageIcon } from "lucide-react";

// Placeholder components for the other tabs (we will build these next)
const SearchView = () => <div className="p-10 text-white/50 text-xl">Search Engine Coming Soon...</div>;
const HistoryView = () => <div className="p-10 text-white/50 text-xl">Time Capsule Coming Soon...</div>;
const GalleryView = () => <div className="p-10 text-white/50 text-xl">Gallery Coming Soon...</div>;

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
                        className="w-full max-w-6xl mx-auto"
                    >
                        {/* DYNAMIC CONTENT SWITCHER */}
                        {activeTab === "home" && <HomeView data={data} onChangeTab={setActiveTab} />}
                        {activeTab === "search" && <SearchView />}
                        {activeTab === "history" && <HistoryView />}
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

    return (
        <div className="space-y-10">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-end gap-4 border-b border-white/10 pb-8">
                <div>
                    <h2 className="text-4xl md:text-6xl font-black text-white mb-2 tracking-tight">Welcome Home.</h2>
                    <p className="text-white/50 text-lg">{today}</p>
                </div>
                <div className="px-4 py-2 bg-green-500/10 border border-green-500/20 rounded-full text-green-400 text-xs font-bold uppercase tracking-widest animate-pulse">
                    System Online
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
                    <p className="text-sm text-white/40 mt-2">See what happened exactly 1 year ago.</p>
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

            {/* Featured Memory Widget (Placeholder for now) */}
            <div className="w-full h-80 bg-gradient-to-r from-pink-900/20 to-purple-900/20 border border-white/10 rounded-3xl flex flex-col items-center justify-center text-center p-8">
                <p className="text-pink-300 font-serif italic text-2xl md:text-3xl mb-4">&quot;You are my favorite notification.&quot;</p>
                <p className="text-white/30 text-xs uppercase tracking-widest">Random Quote Generator (Initializing...)</p>
            </div>
        </div>
    )
}