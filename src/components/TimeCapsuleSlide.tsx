"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Lock, Send, Clock, Sparkles } from "lucide-react";
import confetti from "canvas-confetti";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function TimeCapsuleSlide({ onNext }: { onNext: () => void }) {
    const [message, setMessage] = useState("");
    const [isLocked, setIsLocked] = useState(false);
    const [unlockDate, setUnlockDate] = useState<string | null>(null);

    useEffect(() => {
        // Check if there's already a locked message
        const saved = localStorage.getItem("relationship_time_capsule");
        if (saved) {
            const parsed = JSON.parse(saved);
            setIsLocked(true);
            setUnlockDate(parsed.unlockDate);
        }
    }, []);

    const handleLock = () => {
        if (!message.trim()) return;

        // Lock for 1 year (or until next Valentine's Day/Anniversary)
        const nextYear = new Date();
        nextYear.setFullYear(nextYear.getFullYear() + 1);
        const dateString = nextYear.toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' });

        const data = {
            message,
            lockedAt: new Date().toISOString(),
            unlockDate: dateString
        };

        localStorage.setItem("relationship_time_capsule", JSON.stringify(data));

        setIsLocked(true);
        setUnlockDate(dateString);

        // Celebration
        confetti({
            particleCount: 150,
            spread: 70,
            origin: { y: 0.6 },
            colors: ['#FFD700', '#FFA500', '#FFFFFF']
        });
    };

    return (
        <div className="w-full h-full bg-[#0a0a0a] flex flex-col items-center justify-center relative overflow-hidden font-sans p-6">

            {/* Background Ambience */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-blue-900/20 via-black to-black pointer-events-none" />

            {/* Header */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="absolute top-8 z-20 text-center pointer-events-none"
            >
                <div className="flex items-center justify-center gap-2 mb-2">
                    <Clock className="w-4 h-4 text-cyan-500 animate-pulse" />
                    <span className="text-cyan-500 text-[10px] uppercase tracking-[0.3em]">Temporal Archive</span>
                </div>
                <h2 className="text-3xl font-black text-white/90 tracking-widest uppercase drop-shadow-md">
                    TIME CAPSULE
                </h2>
            </motion.div>

            {/* Content Container */}
            <div className="relative z-10 w-full max-w-md">
                <AnimatePresence mode="wait">
                    {!isLocked ? (
                        <motion.div
                            key="form"
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95, filter: "blur(10px)" }}
                            className="bg-white/5 border border-white/10 backdrop-blur-md p-8 rounded-2xl shadow-xl space-y-6"
                        >
                            <div className="text-center space-y-2">
                                <p className="text-white/80 font-medium">Write a message to your future selves.</p>
                                <p className="text-white/40 text-xs">What do you hope for? What specific memory do you want to keep fresh?</p>
                            </div>

                            <textarea
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                                placeholder="Dear Future Us..."
                                className="w-full h-40 bg-black/40 border border-white/10 rounded-xl p-4 text-white text-sm focus:outline-none focus:border-cyan-500/50 transition-colors resize-none placeholder:text-white/20"
                            />

                            <button
                                onClick={handleLock}
                                disabled={!message.trim()}
                                className="w-full py-4 bg-gradient-to-r from-cyan-600 to-blue-600 text-white font-bold uppercase tracking-widest text-xs rounded-xl hover:shadow-[0_0_20px_rgba(6,182,212,0.5)] disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2 group"
                            >
                                <Lock className="w-4 h-4 group-hover:scale-110 transition-transform" />
                                Seal & Lock
                            </button>
                        </motion.div>
                    ) : (
                        <motion.div
                            key="locked"
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ type: "spring", bounce: 0.4 }}
                            className="text-center space-y-8"
                        >
                            <div className="relative w-32 h-32 mx-auto">
                                <div className="absolute inset-0 bg-cyan-500/20 rounded-full animate-ping" />
                                <div className="relative w-full h-full bg-gradient-to-br from-gray-800 to-black rounded-full border-4 border-cyan-900 flex items-center justify-center shadow-[0_0_30px_rgba(6,182,212,0.3)]">
                                    <Lock className="w-12 h-12 text-cyan-400" />
                                </div>
                                <Sparkles className="absolute -top-2 -right-2 w-6 h-6 text-yellow-400 animate-bounce" />
                            </div>

                            <div className="space-y-2">
                                <h3 className="text-2xl font-bold text-white">Message Secured</h3>
                                <p className="text-white/50 text-sm tracking-widest uppercase">
                                    Do not open until
                                </p>
                                <p className="text-cyan-400 font-mono text-lg font-bold border-b border-cyan-500/30 inline-block pb-1">
                                    {unlockDate}
                                </p>
                            </div>

                            <p className="text-white/30 text-xs italic max-w-xs mx-auto">
                                "Time is the wisest counselor of all."
                            </p>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* Footer */}
            {/* Only show continue if locked? Or allow skipping? Let's allow skipping/continuing regardless, 
                 but maybe emphasize it more after locking. */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1 }}
                className="absolute bottom-12 z-20 text-center"
            >
                {isLocked && (
                    <button
                        onClick={onNext} // Or maybe restart? or End?
                        className="px-8 py-3 bg-white hover:bg-gray-200 text-black font-bold text-xs tracking-[0.2em] uppercase rounded-full transition-all hover:scale-105 active:scale-95 shadow-[0_0_20px_rgba(255,255,255,0.3)]"
                    >
                        Return to Dashboard
                    </button>
                )}
                {!isLocked && (
                    <button
                        onClick={onNext}
                        className="text-white/30 hover:text-white text-[10px] uppercase tracking-widest mt-4 transition-colors"
                    >
                        Skip for now
                    </button>
                )}
            </motion.div>

        </div>
    );
}
