import React, { useState, useEffect, useMemo } from "react";
import { motion } from "framer-motion";

// Placeholders for now. User needs to add images to /public/memories/1.jpg, etc.
const PHOTO_COUNT = 20;
const PHOTOS = Array.from({ length: PHOTO_COUNT }).map((_, i) => `/memories/${i + 1}.jpeg`);

const TEXT_OPTIONS = [
    "So I was scrolling through our chat history last night (yes I’m that obsessive lol) and I found those messages from when we first started talking. It’s actually crazy how clueless we were. I was trying so hard to be cool and you were just being your chaotic self. I love that we didn't know yet that we were gonna be each other's entire world.",
    "Okay strictly between us... I still have that screenshot of the first time you called me 'yours'. I look at it whenever I'm having a bad day and it literally fixes everything. It’s wild that a single word from you has that much power over me but I honestly wouldn't have it any other way.",
    "Do you remember that specifically random night we stayed up until 4am talking about aliens and future houses? I was so tired the next day at work but I was smiling like an idiot the whole time. That’s when I knew I was in deep trouble with you.",
    "I don't think I say this enough but thank you for handling my overthinking. You have this way of making everything better just by being there. Like, the world feels so loud sometimes and then I talk to you and it’s suddenly quiet and safe. You’re my safe place.",
    "Real talk: I never believed in the whole 'soulmate' thing until you walked in and just ruined everyone else for me. Now I can't imagine a future that doesn't have you in it. You’re stuck with me now, sorry not sorry!",
    "Miss you. That’s it. That’s the tweet. Okay but actually, life is just significantly more boring when you aren't around. Can we just fast forward to the part where we’re old and sitting on a porch somewhere judging the neighbors together?"
];

export default function MemoriesSlide({ onNext }: { onNext: () => void }) {
    const [randomText, setRandomText] = useState("");

    useEffect(() => {
        const index = Math.floor(Math.random() * TEXT_OPTIONS.length);
        setRandomText(TEXT_OPTIONS[index]);
    }, []);

    const seamlessPhotos = useMemo(() => [...PHOTOS, ...PHOTOS, ...PHOTOS, ...PHOTOS], []);

    return (
        <div className="relative w-full h-full flex flex-col items-center justify-between py-12 md:py-20 overflow-hidden bg-transparent z-30">

            {/* HEADER - Fixed at Top */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, delay: 0.5 }}
                className="text-center z-40 relative mt-4"
            >
                <h2 className="text-4xl md:text-7xl font-black text-white tracking-widest uppercase drop-shadow-[0_0_15px_rgba(255,255,255,0.5)]">
                    Flashback
                </h2>
                <p className="text-white/60 text-xs md:text-sm tracking-[0.5em] mt-2 font-mono">
                    ARCHIVE_2024_2025 // ENCRYPTED
                </p>
            </motion.div>

            {/* MARQUEE TAPE - Centered */}
            <div className="absolute top-1/2 left-0 -translate-y-1/2 w-full h-[50vh] flex items-center z-10 -rotate-2 mix-blend-screen opacity-90">
                <motion.div
                    className="flex gap-12 pl-12 min-w-max"
                    animate={{ x: "-25%" }}
                    transition={{
                        ease: "linear",
                        duration: 40,
                        repeat: Infinity,
                        repeatType: "loop"
                    }}
                >
                    {seamlessPhotos.map((src, i) => (
                        <div
                            key={i}
                            className="relative group shrink-0"
                            style={{
                                transform: `rotate(${Math.sin(i * 1321) * 6}deg) scale(${0.8 + Math.random() * 0.2})`
                            }}
                        >
                            <div className="bg-white p-2 pb-8 w-[200px] md:w-[280px] shadow-2xl transform transition-transform duration-500 group-hover:scale-110 group-hover:z-50 group-hover:rotate-0 border border-gray-200">
                                <div className="aspect-[3/4] bg-gray-100 overflow-hidden relative">
                                    <img
                                        src={src}
                                        alt="Memory"
                                        loading="eager"
                                        className="w-full h-full object-cover filter sepia-[0.2] contrast-110"
                                        onError={(e) => {
                                            e.currentTarget.style.display = 'none';
                                            e.currentTarget.parentElement!.style.backgroundColor = '#1a1a1a';
                                        }}
                                    />
                                </div>
                            </div>
                        </div>
                    ))}
                </motion.div>
            </div>

            {/* FOOTER - Fixed at Bottom */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, delay: 1 }}
                className="z-40 text-center w-[90%] max-w-2xl bg-black/60 backdrop-blur-xl p-6 md:p-8 rounded-3xl border border-white/10 shadow-2xl mb-8"
            >
                <div className="flex flex-col gap-4">
                    <p className="text-gray-300 text-sm md:text-lg font-medium leading-relaxed font-sans opacity-90">
                        "{randomText}"
                    </p>

                    <button
                        onClick={onNext}
                        className="self-center mt-2 px-10 py-3 bg-white hover:bg-gray-200 text-black font-bold text-xs md:text-sm tracking-[0.2em] uppercase rounded-full transition-all hover:scale-105 active:scale-95"
                    >
                        Continue
                    </button>
                </div>
            </motion.div>
        </div>
    );
}
