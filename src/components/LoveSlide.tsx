"use client";
import { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Heart, ArrowRight } from "lucide-react";
import confetti from "canvas-confetti";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function LoveSlide({ data, onNext }: { data: any, onNext: () => void }) {
    // Shuffle and pick 5 random sweet messages
    const sweetTexts = useMemo(() => {
        if (!data?.wrapped?.sweetest) return [];
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const raw = data.wrapped.sweetest.filter((m: any) => m.message.length > 5);

        return raw
            .map((value: any) => ({ value, sort: Math.random() }))
            .sort((a: any, b: any) => a.sort - b.sort)
            .map(({ value }: any) => value)
            .slice(0, 5);
    }, [data]);

    const [index, setIndex] = useState(0);

    useEffect(() => {
        if (sweetTexts.length === 0) return;
        const timer = setInterval(() => {
            if (index < sweetTexts.length - 1) {
                setIndex(prev => prev + 1);
            }
        }, 8000);
        return () => clearInterval(timer);
    }, [index, sweetTexts.length]);

    const handleNext = () => {
        if (index < sweetTexts.length - 1) {
            setIndex(index + 1);
            confetti({ particleCount: 50, spread: 60, origin: { y: 0.8 }, colors: ['#ef4444', '#ec4899'] });
        } else {
            onNext();
        }
    };

    const currentText = sweetTexts[index] || { message: "You are my favorite person.", timestamp: "Forever", sender: "Me" };

    return (
        <motion.div
            className="w-full h-full flex flex-col items-center justify-center p-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
        >
            {/* 1. HEADER - Strict spacing below it */}
            <div className="mb-12 text-center">
                <p className="text-pink-300/80 tracking-[0.5em] uppercase text-xs font-bold animate-pulse">
                    The Heart of the Matter
                </p>
            </div>

            {/* 2. CARD - Fixed width, centered */}
            <div className="relative w-full max-w-2xl min-h-[300px] flex items-center justify-center">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={index}
                        className="w-full bg-black/60 backdrop-blur-xl border border-pink-500/20 p-10 md:p-14 rounded-3xl text-center shadow-[0_0_50px_rgba(236,72,153,0.1)] flex flex-col items-center"
                        initial={{ y: 20, opacity: 0, scale: 0.95 }}
                        animate={{ y: 0, opacity: 1, scale: 1 }}
                        exit={{ y: -20, opacity: 0, scale: 1.05, filter: "blur(10px)" }}
                        transition={{ duration: 0.6 }}
                    >
                        <Heart className="w-8 h-8 text-pink-500 mb-8 fill-pink-500/20" />

                        {/* The Text - Responsive sizing */}
                        <p className="text-xl md:text-3xl font-serif italic leading-relaxed text-white/90 drop-shadow-md">
                            &quot;{currentText.message}&quot;
                        </p>

                        <div className="mt-10 w-full border-t border-white/5 pt-4 flex justify-between text-xs text-pink-200/40 font-mono uppercase tracking-widest">
                            <span>{currentText.timestamp.split(" ")[0]}</span>
                            <span>Memory {index + 1}/{sweetTexts.length}</span>
                        </div>
                    </motion.div>
                </AnimatePresence>
            </div>

            {/* 3. NAVIGATION - Strict spacing above it */}
            <div className="flex gap-3 mt-12">
                {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                {sweetTexts.map((_: any, i: number) => (
                    <div
                        key={i}
                        className={`h-1.5 rounded-full transition-all duration-500 ${i === index ? "w-8 bg-pink-500" : "w-1.5 bg-white/10"}`}
                    />
                ))}
            </div>

            {index === sweetTexts.length - 1 && (
                <motion.button
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-8 px-8 py-3 bg-white text-black font-bold rounded-full hover:scale-105 transition-transform flex items-center gap-2 shadow-lg z-20"
                    onClick={handleNext}
                >
                    Enter Our World <ArrowRight className="w-4 h-4" />
                </motion.button>
            )}

            {/* Click layer */}
            {index < sweetTexts.length - 1 && (
                <div className="absolute inset-0 z-10 cursor-pointer" onClick={handleNext} />
            )}
        </motion.div>
    );
}