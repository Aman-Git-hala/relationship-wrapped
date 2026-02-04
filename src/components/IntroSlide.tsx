"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Heart } from "lucide-react";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function IntroSlide({ data, onNext }: { data: any, onNext: () => void }) {

    // 1. Prepare Data
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const [randomMessages, setRandomMessages] = useState<any[]>([]);

    // Position state (percentage coordinates)
    const [pos, setPos] = useState({ x: 50, y: 50, rotate: 0 });

    useEffect(() => {
        if (!data) return;
        const raw = [...(data?.wrapped?.sweetest || []), ...(data?.wrapped?.funniest || [])];
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const filtered = raw.filter((m: any) => m.message && m.message.length > 20 && m.message.length < 120);

        // Robust Shuffle: Fisher-Yates or simple sort with random
        const shuffled = filtered
            .map(value => ({ value, sort: Math.random() }))
            .sort((a, b) => a.sort - b.sort)
            .map(({ value }) => value)
            .slice(0, 10); // Pick top 10 random

        // eslint-disable-next-line react-hooks/set-state-in-effect
        setRandomMessages(shuffled);
    }, [data]);

    const [currentIndex, setCurrentIndex] = useState(0);

    // 2. Auto-Cycle & Randomize Position
    useEffect(() => {
        if (randomMessages.length === 0) return;
        const timer = setInterval(() => {
            setCurrentIndex((prev) => (prev + 1) % randomMessages.length);

            // Randomize position (keep within 20-80% to avoid edge clipping)
            setPos({
                x: Math.floor(Math.random() * 60) + 20,
                y: Math.floor(Math.random() * 60) + 20,
                rotate: Math.floor(Math.random() * 20) - 10 // Tilt between -10 and 10 deg
            });

        }, 3500); // Slightly faster
        return () => clearInterval(timer);
    }, [randomMessages]);

    const currentMessage = randomMessages[currentIndex] || {
        message: "It all started on " + (data?.meta?.start_date?.split(" ")[0] || "Day 1"),
        timestamp: data?.meta?.start_date
    };

    return (
        <div
            onClick={onNext}
            className="absolute inset-0 w-full h-full z-10 overflow-hidden cursor-pointer"
        >
            {/* BACKGROUND GRADIENT */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/60 pointer-events-none" />

            {/* FLASHBACK TEXT CONTAINER */}
            <AnimatePresence mode="popLayout">
                <motion.div
                    key={currentIndex}
                    initial={{ opacity: 0, scale: 0.5, filter: "blur(10px)" }}
                    animate={{
                        opacity: 1,
                        scale: 1,
                        filter: "blur(0px)",
                        left: `${pos.x}%`,
                        top: `${pos.y}%`,
                        rotate: pos.rotate
                    }}
                    exit={{ opacity: 0, scale: 1.5, filter: "blur(20px)" }}
                    transition={{ duration: 0.8, type: "spring", bounce: 0.5 }}
                    className="absolute max-w-[80vw] w-max -translate-x-1/2 -translate-y-1/2 flex flex-col items-center pointer-events-none"
                    style={{ transform: 'translate(-50%, -50%)' }} // Centering fix works best with CSS transform
                >
                    {/* The Message: HUGE & BOLD */}
                    <h2 className="text-5xl md:text-7xl lg:text-8xl font-black text-white leading-tight drop-shadow-[0_0_30px_rgba(255,255,255,0.5)] font-serif italic text-center whitespace-pre-wrap">
                        &quot;{currentMessage.message}&quot;
                    </h2>

                    {/* Metadata */}
                    <div className="mt-6 flex items-center gap-3 text-white/60 text-lg font-mono uppercase tracking-widest bg-black/40 backdrop-blur-md px-6 py-2 rounded-full border border-white/20 shadow-xl">
                        <Heart className="w-5 h-5 text-pink-500 fill-pink-500" />
                        <span>{currentMessage.timestamp?.split(" ")[0] || "Memory"}</span>
                    </div>
                </motion.div>
            </AnimatePresence>

            {/* HINT TEXT */}
            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 text-white/30 text-xs uppercase tracking-[0.3em] animate-pulse pointer-events-none">
                Tap anywhere to continue
            </div>

        </div>
    );
}