import React, { useState, useEffect, useMemo } from "react";
import { motion } from "framer-motion";

// Stock cute photos from Unsplash
const PHOTOS = [
    "https://images.unsplash.com/photo-1517849845537-4d257902454a?w=500&q=80", // Dog
    "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=500&q=80", // Girl smiling
    "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=500&q=80", // Portrait
    "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=500&q=80", // Girl
    "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=500&q=80", // Man
    "https://images.unsplash.com/photo-1517423568366-eb15049696f8?w=500&q=80", // Coffee
    "https://images.unsplash.com/photo-1516054719069-b364e6224ce1?w=500&q=80", // Cats
    "https://images.unsplash.com/photo-1516726817505-f5ed8251b47c?w=500&q=80", // Sunset
    "https://images.unsplash.com/photo-1511988617509-a57c8a288659?w=500&q=80", // Couple holding hands
    "https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?w=500&q=80", // Love heart
    "https://images.unsplash.com/photo-1474552226712-ac0f0961a954?w=500&q=80", // Flowers
    "https://images.unsplash.com/photo-1518331483807-f64201c741e2?w=500&q=80", // Couple laughing
    "https://images.unsplash.com/photo-1523303819875-bf7d0458a436?w=500&q=80", // Beach
    "https://images.unsplash.com/photo-1520024146169-3240400354ae?w=500&q=80", // Fireplace/Cozy
    "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=500&q=80", // Coffee shop
    "https://images.unsplash.com/photo-1516975080664-ed2fc6a32937?w=500&q=80", // Paints
    "https://images.unsplash.com/photo-1501901609772-99547d90393c?w=500&q=80", // Starry sky
    "https://images.unsplash.com/photo-1490750967868-58cb7506aed6?w=500&q=80", // Flowers top down
    "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=500&q=80", // Beach
    "https://images.unsplash.com/photo-1519681393784-d8e5b5a4570e?w=500&q=80"  // Night sky
];
const PHOTO_COUNT = PHOTOS.length;

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
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const [failedImages, setFailedImages] = useState<Set<number>>(new Set());

    const handleImageError = (index: number) => {
        setFailedImages(prev => {
            const next = new Set(prev);
            next.add(index);
            return next;
        });
    };

    useEffect(() => {
        const index = Math.floor(Math.random() * TEXT_OPTIONS.length);
        setRandomText(TEXT_OPTIONS[index]);
    }, []);

    // Duplicate photos for infinite scroll effect
    const filmStripPhotos = useMemo(() => [...PHOTOS, ...PHOTOS], []);

    return (
        <div className="relative w-full h-full flex flex-col items-center justify-between overflow-hidden bg-black z-30">

            {/* FILM STRIPS CONTAINER */}
            <div className="absolute inset-0 flex justify-center gap-4 md:gap-12 pointer-events-none opacity-80">
                {/* Left Strip (Moving Up) */}
                <div className="relative w-[120px] md:w-[240px] h-full overflow-hidden border-x-[6px] border-black bg-[#1a1a1a] flex flex-col">
                    {/* Perforations */}
                    <div className="absolute top-0 left-0 w-3 h-full flex flex-col gap-2 z-10">
                        {Array.from({ length: 50 }).map((_, i) => (
                            <div key={i} className="w-1.5 h-2 bg-black rounded-sm mx-auto" />
                        ))}
                    </div>
                    <div className="absolute top-0 right-0 w-3 h-full flex flex-col gap-2 z-10">
                        {Array.from({ length: 50 }).map((_, i) => (
                            <div key={i} className="w-1.5 h-2 bg-black rounded-sm mx-auto" />
                        ))}
                    </div>

                    <motion.div
                        className="flex flex-col gap-3 py-4"
                        animate={{ y: "-50%" }}
                        transition={{ ease: "linear", duration: 40, repeat: Infinity }}
                    >
                        {filmStripPhotos.map((src, i) => {
                            const originalIndex = i % PHOTO_COUNT;
                            if (failedImages.has(originalIndex)) return null;
                            return (
                                <div key={i} className="relative w-full aspect-[3/4] px-4 py-2">
                                    <div className="w-full h-full bg-black overflow-hidden relative border border-white/10">
                                        <img
                                            src={src}
                                            alt="Memory"
                                            className="w-full h-full object-cover filter sepia-[0.3] contrast-125"
                                            onError={() => handleImageError(originalIndex)}
                                        />
                                        <div className="absolute bottom-2 right-2 text-[8px] font-mono text-white/50 bg-black/50 px-1">
                                            {1000 + originalIndex}
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </motion.div>
                </div>

                {/* Right Strip (Moving Down) - Hidden on small screens if too crowded, or just showing two strips */}
                <div className="hidden md:flex relative w-[240px] h-full overflow-hidden border-x-[6px] border-black bg-[#1a1a1a] flex-col">
                    {/* Perforations */}
                    <div className="absolute top-0 left-0 w-4 h-full flex flex-col gap-2 z-10">
                        {Array.from({ length: 50 }).map((_, i) => (
                            <div key={i} className="w-2 h-3 bg-black rounded-sm mx-auto" />
                        ))}
                    </div>
                    <div className="absolute top-0 right-0 w-4 h-full flex flex-col gap-2 z-10">
                        {Array.from({ length: 50 }).map((_, i) => (
                            <div key={i} className="w-2 h-3 bg-black rounded-sm mx-auto" />
                        ))}
                    </div>

                    <motion.div
                        className="flex flex-col gap-4 py-4"
                        initial={{ y: "-50%" }}
                        animate={{ y: "0%" }}
                        transition={{ ease: "linear", duration: 45, repeat: Infinity }}
                    >
                        {filmStripPhotos.map((src, i) => {
                            const originalIndex = i % PHOTO_COUNT;
                            if (failedImages.has(originalIndex)) return null;
                            return (
                                <div key={i} className="relative w-full aspect-[3/4] px-5 py-2">
                                    <div className="w-full h-full bg-black overflow-hidden relative border-2 border-white/10">
                                        <img
                                            src={src}
                                            alt="Memory"
                                            className="w-full h-full object-cover grayscale contrast-125 hover:grayscale-0 transition-all duration-500"
                                            onError={() => handleImageError(originalIndex)}
                                        />
                                        <div className="absolute bottom-2 right-2 text-[8px] font-mono text-white/50 bg-black/50 px-1">
                                            {2000 + originalIndex}
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </motion.div>
                </div>
            </div>

            {/* HEADER - Fixed at Top */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, delay: 0.5 }}
                className="text-center z-40 relative mt-4 bg-black/80 backdrop-blur-md p-4 rounded-xl border border-white/10 shadow-2xl"
            >
                <h2 className="text-3xl font-black text-white tracking-widest uppercase drop-shadow-[0_0_15px_rgba(255,255,255,0.5)]">
                    Flashback
                </h2>
                <p className="text-white/60 text-[10px] md:text-xs tracking-[0.3em] mt-2 font-mono">
                    ARCHIVE_2024_2025 // ENCRYPTED
                </p>
            </motion.div>

            {/* FOOTER - Fixed at Bottom */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, delay: 1 }}
                className="z-40 text-center w-[90%] max-w-2xl bg-black/80 backdrop-blur-xl p-6 md:p-8 rounded-3xl border border-white/10 shadow-2xl mb-8"
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
