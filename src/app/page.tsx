"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import confetti from "canvas-confetti";

// Component Imports
import HookSection from "@/components/HookSection";
import IntroSlide from "@/components/IntroSlide";
import StatsSlide from "@/components/StatsSlide";
import LoveSlide from "@/components/LoveSlide";
import Dashboard from "@/components/Dashboard"; // <--- NEW IMPORT

// --- CONFIGURATION ---
const SLIDES = [
  { id: "intro", bg: "/bg-video.mp4", audio: "/music-intro.mp3" },
  { id: "stats", bg: "/bg-stats.mp4", audio: "/music-stats.mp3" },
  { id: "love", bg: "/bg-love.mp4", audio: "/music-love.mp3" },
];

export default function Home() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [data, setData] = useState<any>(null);
  const [stage, setStage] = useState("loading"); // loading -> ready -> hook -> slides -> dashboard
  const [currentSlide, setCurrentSlide] = useState(0);
  const audioRef = useRef<HTMLAudioElement>(null);

  // 1. DATA LOADING & ASSET PRELOADING
  useEffect(() => {
    // Fetch Data
    fetch("/data.json")
      .then((res) => res.json())
      .then((jsonData) => {
        setTimeout(() => {
          setData(jsonData);
          setStage("ready");
        }, 1500);
      })
      .catch((err) => console.error("Error loading data:", err));

    // Speed Boost: Preload Videos
    SLIDES.forEach((slide) => {
      const link = document.createElement('link');
      link.rel = 'preload';
      link.as = 'video';
      link.href = slide.bg;
      document.head.appendChild(link);

      // Aggressive Fetch
      fetch(slide.bg).then(() => console.log("Preloaded:", slide.bg));
    });
  }, []);

  // 2. AUDIO ENGINE
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    let targetSrc = "";
    if (stage === "hook") targetSrc = SLIDES[0].audio;
    if (stage === "slides") targetSrc = SLIDES[currentSlide].audio;
    // Note: If stage is "dashboard", targetSrc is empty, so music keeps playing (or you can set specific dashboard music here)

    if (!targetSrc) return;
    const currentSrc = audio.getAttribute("src");

    const fadeDuration = (stage === "hook") ? 5000 : 1000;

    if (currentSrc !== targetSrc) {
      const fadeOut = setInterval(() => {
        if (audio.volume > 0.05) {
          audio.volume -= 0.05;
        } else {
          clearInterval(fadeOut);
          audio.pause();
          audio.src = targetSrc;
          audio.load();
          audio.play().then(() => {
            const fadeIn = setInterval(() => {
              if (audio.volume < 0.9) {
                audio.volume += 0.05;
              } else {
                clearInterval(fadeIn);
              }
            }, fadeDuration / 20);
          }).catch(() => console.warn("Audio file missing:", targetSrc));
        }
      }, 50);
    }
  }, [stage, currentSlide]);

  const handleStart = () => {
    confetti({ particleCount: 200, spread: 120, origin: { y: 0.6 }, colors: ['#22c55e', '#ffffff', '#ff0000'] });
    setStage("hook");
  };

  // --- CHANGED: LOGIC TO SWITCH TO DASHBOARD ---
  const nextSlide = () => {
    if (currentSlide < SLIDES.length - 1) {
      setCurrentSlide((prev) => prev + 1);
    } else {
      console.log("Wrapping finished. Welcome Home.");
      setStage("dashboard"); // <--- Switches the view to the Dashboard
    }
  };

  // HELPER: Decide which video to show
  // Only show video during the 'cinematic' stages. Hide it for Dashboard.
  const activeVideo = (stage === "hook" || stage === "slides")
    ? (stage === "hook" ? SLIDES[0].bg : SLIDES[currentSlide].bg)
    : "";

  return (
    <main className="flex h-screen w-screen flex-col items-center justify-center relative overflow-hidden text-white bg-black font-sans">

      {/* BACKGROUND VIDEO LAYER (Fades out when Dashboard starts) */}
      <AnimatePresence mode="popLayout">
        {activeVideo && (
          <motion.div
            key={activeVideo}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 2 }}
            className="absolute inset-0 z-0"
          >
            <div className="absolute inset-0 bg-black/50 z-10" />
            <video
              autoPlay loop muted playsInline
              className="w-full h-full object-cover"
              src={activeVideo}
            />
          </motion.div>
        )}
      </AnimatePresence>

      <audio ref={audioRef} />

      {/* CONTENT LAYER */}
      <div className="relative z-20 w-full h-full flex flex-col items-center justify-center">
        <AnimatePresence mode="wait">

          {/* LOADING */}
          {stage === "loading" && (
            <motion.div
              key="loader"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="text-green-400 font-mono text-xl animate-pulse tracking-widest"
            >
              INITIALIZING...
            </motion.div>
          )}

          {/* START SCREEN */}
          {stage === "ready" && (
            <motion.div
              key="start"
              initial={{ scale: 0.9, opacity: 0, y: 30 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 1.1, opacity: 0, filter: "blur(20px)" }}
              className="text-center cursor-pointer group px-4"
              onClick={handleStart}
            >
              <div className="bg-black/40 backdrop-blur-xl border border-white/10 p-12 md:p-16 rounded-3xl hover:bg-black/50 transition-all duration-500 shadow-2xl ring-1 ring-white/20">
                <h1 className="text-6xl md:text-9xl font-black tracking-tighter mb-6 text-transparent bg-clip-text bg-gradient-to-br from-green-400 via-emerald-500 to-teal-700 glitch-effect">
                  PLAY
                </h1>
                <p className="text-gray-300 text-xl uppercase tracking-[0.4em] group-hover:text-white transition-colors">
                  Our Story
                </p>
              </div>
            </motion.div>
          )}

          {/* CINEMATIC STAGES */}
          {stage === "hook" && data && (
            <HookSection data={data} onComplete={() => setStage("slides")} />
          )}

          {stage === "slides" && data && (
            <>
              {SLIDES[currentSlide].id === "intro" && <IntroSlide data={data} onNext={nextSlide} />}
              {SLIDES[currentSlide].id === "stats" && <StatsSlide data={data} onNext={nextSlide} />}
              {SLIDES[currentSlide].id === "love" && <LoveSlide data={data} onNext={nextSlide} />}
            </>
          )}

          {/* --- NEW: THE DASHBOARD --- */}
          {stage === "dashboard" && data && (
            <motion.div
              key="dashboard"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1 }}
              className="absolute inset-0 z-50 bg-black w-full h-full"
            >
              <Dashboard data={data} />
            </motion.div>
          )}

        </AnimatePresence>
      </div>
    </main>
  );
}