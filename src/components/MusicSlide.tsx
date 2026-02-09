"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Disc, Play, Pause, Music, Heart } from "lucide-react";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function MusicSlide({ onNext }: { onNext: () => void }) {
    const [isPlaying, setIsPlaying] = useState(true);
    const audioRef = useRef<HTMLAudioElement | null>(null);

    // Placeholder song - naturally this would be "Their Song"
    // Using one of the existing tracks for now or a placeholder path
    const songPath = "/music-love.mp3";
    const songTitle = "Char Kadam";
    const songArtist = "Shaan, Shreya Ghoshal";

    useEffect(() => {
        if (audioRef.current) {
            audioRef.current.volume = 0.5;
            if (isPlaying) {
                audioRef.current.play().catch(e => console.log("Autoplay blocked", e));
            } else {
                audioRef.current.pause();
            }
        }
    }, [isPlaying]);

    return (
        <div className="w-full h-full bg-[#0a0a0a] flex flex-col items-center justify-center relative overflow-hidden font-sans">

            {/* Background Ambience */}
            <div className="absolute inset-0 bg-gradient-to-b from-purple-900/20 to-black pointer-events-none" />

            {/* Audio Element */}
            <audio ref={audioRef} src={songPath} loop />

            {/* Header */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="absolute top-8 z-20 text-center pointer-events-none"
            >
                <div className="flex items-center justify-center gap-2 mb-2">
                    <Music className="w-4 h-4 text-pink-500 animate-bounce" />
                    <span className="text-pink-500 text-[10px] uppercase tracking-[0.3em]">The Soundtrack</span>
                </div>
                <h2 className="text-3xl font-black text-white/90 tracking-widest uppercase drop-shadow-md">
                    OUR SONG
                </h2>
            </motion.div>

            {/* Main Content: Vinyl Player */}
            <div className="relative z-10 flex flex-col items-center gap-8">

                {/* Vinyl Record */}
                <motion.div
                    className="relative w-64 h-64 md:w-80 md:h-80 rounded-full bg-black border-4 border-gray-800 shadow-[0_0_50px_rgba(255,255,255,0.1)] flex items-center justify-center overflow-hidden"
                    animate={{ rotate: isPlaying ? 360 : 0 }}
                    transition={{ duration: 3, ease: "linear", repeat: Infinity, repeatType: "loop" }}
                >
                    {/* Grooves */}
                    <div className="absolute inset-2 rounded-full border border-gray-800/50" />
                    <div className="absolute inset-4 rounded-full border border-gray-800/50" />
                    <div className="absolute inset-8 rounded-full border border-gray-800/50" />
                    <div className="absolute inset-12 rounded-full border border-gray-800/50" />
                    <div className="absolute inset-16 rounded-full border border-gray-800/50" />

                    {/* Label */}
                    <div className="absolute w-24 h-24 bg-pink-600 rounded-full flex items-center justify-center shadow-inner">
                        <Heart className="w-8 h-8 text-white fill-white" />
                    </div>

                    {/* Shine Reflection */}
                    <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-transparent rounded-full pointer-events-none" />
                </motion.div>

                {/* Song Info */}
                <div className="text-center">
                    <motion.h3
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}
                        className="text-2xl font-bold text-white mb-1"
                    >
                        {songTitle}
                    </motion.h3>
                    <motion.p
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}
                        className="text-white/50 text-sm tracking-widest uppercase"
                    >
                        {songArtist}
                    </motion.p>
                </div>

                {/* Controls & Visualizer */}
                <div className="flex flex-col items-center gap-6">
                    {/* Visualizer Bars (Fake) */}
                    <div className="flex items-end gap-1 h-8">
                        {Array.from({ length: 12 }).map((_, i) => (
                            <motion.div
                                key={i}
                                className="w-1.5 bg-pink-500 rounded-t-full"
                                animate={{
                                    height: isPlaying ? [10, 32, 16, 24, 8, 32][i % 6] + (Math.random() * 10) : 4
                                }}
                                transition={{
                                    duration: 0.2,
                                    repeat: Infinity,
                                    repeatType: "mirror",
                                    delay: i * 0.05
                                }}
                            />
                        ))}
                    </div>

                    {/* Play/Pause Button */}
                    <button
                        onClick={() => setIsPlaying(!isPlaying)}
                        className="p-4 bg-white text-black rounded-full hover:scale-110 transition-transform active:scale-95"
                    >
                        {isPlaying ? <Pause className="w-6 h-6 fill-black" /> : <Play className="w-6 h-6 fill-black ml-1" />}
                    </button>
                </div>
            </div>

            {/* Footer */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1 }}
                className="absolute bottom-12 z-20 text-center"
            >
                <button
                    onClick={() => {
                        setIsPlaying(false); // Stop music when leaving
                        onNext();
                    }}
                    className="px-8 py-3 w-max bg-white/10 hover:bg-white text-white hover:text-black border border-white/20 font-bold text-xs tracking-[0.2em] uppercase rounded-full transition-all hover:scale-105 active:scale-95 backdrop-blur-md"
                >
                    Continue
                </button>
            </motion.div>

        </div>
    );
}
