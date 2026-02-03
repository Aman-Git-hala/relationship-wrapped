"use client";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Heart } from "lucide-react";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function HookSection({ data, onComplete }: { data: any; onComplete: () => void }) {
    // Logic: Prioritize long, sweet texts
    const [selectedText, setSelectedText] = useState({ message: "I love you", sender: "Me", timestamp: "2024" });

    useEffect(() => {
        if (!data) return;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const goodTexts = data.wrapped.sweetest.filter((m: any) => m.message.length > 50);
        const pool = goodTexts.length > 0 ? goodTexts : data.wrapped.sweetest;
        if (pool.length > 0) {
            // eslint-disable-next-line react-hooks/set-state-in-effect
            setSelectedText(pool[Math.floor(Math.random() * pool.length)]);
        }
    }, [data]);

    return (
        <motion.div
            className="bg-white/95 backdrop-blur-md text-black p-12 md:p-16 rounded-sm shadow-[0_0_100px_rgba(255,255,255,0.2)] relative font-serif max-w-2xl transform rotate-1"
            initial={{ y: 200, opacity: 0, rotate: -3 }}
            animate={{ y: 0, opacity: 1, rotate: 1 }}
            exit={{ y: -50, opacity: 0, rotate: 5, filter: "blur(20px)" }}
            onAnimationComplete={() => setTimeout(onComplete, 6000)}
        >
            <div className="border-b-2 border-black/10 pb-6 mb-8 flex justify-between items-end">
                <h2 className="text-xl font-bold uppercase tracking-widest text-black/40">Memory #802</h2>
                <Heart className="w-6 h-6 text-red-500 fill-red-500" />
            </div>
            <div className="my-8">
                <p className="text-2xl md:text-4xl font-medium leading-relaxed text-center italic text-gray-900">
                    &quot;{selectedText.message}&quot;
                </p>
            </div>
            <div className="border-t-2 border-black/10 pt-6 flex justify-between text-xs font-bold uppercase tracking-wider text-black/40">
                <span>{selectedText.timestamp.split(" ")[0]}</span>
                <span>{selectedText.sender}</span>
            </div>
            <motion.div
                className="absolute bottom-0 left-0 h-1 bg-red-500"
                initial={{ width: "0%" }}
                animate={{ width: "100%" }}
                transition={{ duration: 6, ease: "linear" }}
            />
        </motion.div>
    );
}