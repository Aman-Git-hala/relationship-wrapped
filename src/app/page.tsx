"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Maximize, Minimize } from "lucide-react";
import confetti from "canvas-confetti";

// Component Imports
import HookSection from "@/components/HookSection";
import IntroSlide from "@/components/IntroSlide";
import StatsSlide from "@/components/StatsSlide";
import LoveSlide from "@/components/LoveSlide";
import Dashboard from "@/components/Dashboard";
import MemoriesSlide from "@/components/MemoriesSlide";
import MapSlide from "@/components/MapSlide";
import MusicSlide from "@/components/MusicSlide";
import TimeCapsuleSlide from "@/components/TimeCapsuleSlide";
import VHSEffect from "@/components/ui/VHSEffect";
import PasswordScreen from "@/components/PasswordScreen";
import { fakeData } from "@/data/fakeData";

// --- CONFIGURATION (Initial Paths) ---
// Remote Cloudinary URLs
// Remote Cloudinary URLs (ORIGINAL - COMMENTED OUT FOR SHOWCASE)
// const VIDEO_URLS = {
//   intro: "https://res.cloudinary.com/dpdflqxwr/video/upload/v1770191169/bg-video_qrb93t.mp4",
//   stats: "https://res.cloudinary.com/dpdflqxwr/video/upload/v1770191110/bg-stats_yfpiuf.mp4",
//   memories: "https://res.cloudinary.com/dpdflqxwr/video/upload/v1770191087/bg-memories_akettx.mp4",
//   love: "/bg-love.mp4", // Still local until provided
// };

// DUMMY VIDEO URLs (FOR SHOWCASE)
const VIDEO_URLS = {
  intro: "https://videos.pexels.com/video-files/856973/856973-hd_1920_1080_25fps.mp4", // Abstract lights
  stats: "https://videos.pexels.com/video-files/3129671/3129671-hd_1920_1080_30fps.mp4", // Particles
  memories: "https://videos.pexels.com/video-files/4763824/4763824-hd_1920_1080_24fps.mp4", // Clouds or calm
  love: "https://videos.pexels.com/video-files/855018/855018-hd_1920_1080_30fps.mp4", // Hearts or romantic/abstract
};

const INITIAL_SLIDES = [
  { id: "intro", bg: VIDEO_URLS.intro, audio: "/music-intro.mp3" },
  { id: "stats", bg: VIDEO_URLS.stats, audio: "/music-stats.mp3" },
  { id: "memories", bg: VIDEO_URLS.memories, audio: "/music-memories.mp3" },
  { id: "map", bg: VIDEO_URLS.stats, audio: "/music-stats.mp3" }, // Reusing stats bg/audio for now
  { id: "music", bg: VIDEO_URLS.memories, audio: "" }, // Handles its own audio
  { id: "capsule", bg: VIDEO_URLS.stats, audio: "/music-stats.mp3" }, // Quiet reflection
  { id: "love", bg: VIDEO_URLS.love, audio: "/music-love.mp3" },
];

export default function Home() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [data, setData] = useState<any>(null);

  // Stages: password -> loading -> ready -> hook -> slides -> dashboard
  const [stage, setStage] = useState("password");
  const [loadingProgress, setLoadingProgress] = useState(0); // 0 to 100
  const [assetsLoaded, setAssetsLoaded] = useState(false);

  // Asset Management
  const [loadedAssets, setLoadedAssets] = useState<Record<string, string>>({});
  const [currentSlide, setCurrentSlide] = useState(0);
  const audioRef = useRef<HTMLAudioElement>(null);

  // --- FULLSCREEN LOGIC ---
  const [isFullscreen, setIsFullscreen] = useState(false);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().then(() => setIsFullscreen(true));
    } else {
      document.exitFullscreen().then(() => setIsFullscreen(false));
    }
  };

  useEffect(() => {
    const handleChange = () => setIsFullscreen(!!document.fullscreenElement);
    document.addEventListener("fullscreenchange", handleChange);
    return () => document.removeEventListener("fullscreenchange", handleChange);
  }, []);

  // 1. ASSET LOADER ENGINE
  useEffect(() => {
    // 1. Load Data (FAKE DATA MODE)
    // fetch("/data.json")
    //   .then((res) => res.json())
    //   .then((jsonData) => setData(jsonData))
    //   .catch((err) => console.error("Error loading data:", err));

    // IMMEDIATE LOAD
    setData(fakeData);

    // 2. Define Assets to Download (High Priority)
    const assetsToLoad = [
      VIDEO_URLS.intro,
      VIDEO_URLS.stats,
      VIDEO_URLS.memories,
      "/music-intro.mp3",
      "/music-stats.mp3",
    ];
    // We'll track progress per file and average them for a smooth bar.
    // Simplifying: we'll mainly track the big video progress since it dominates.

    let completed = 0;
    const totalAssets = assetsToLoad.length;

    const loadFile = (url: string) => {
      return new Promise<void>((resolve) => {
        const xhr = new XMLHttpRequest();
        xhr.open("GET", url, true);
        xhr.responseType = "blob";

        xhr.onprogress = (event) => {
          if (event.lengthComputable) {
            // Calculate percentage for this specific file
            // Ideally we combine total bytes, but for simplicity let's say the Video is 90% of the work.
            if (url.includes("mp4")) {
              const percent = (event.loaded / event.total) * 90;
              setLoadingProgress(Math.min(90, percent)); // Cap at 90% until done
            }
          }
        };

        xhr.onload = () => {
          if (xhr.status === 200) {
            const blob = xhr.response;
            const objectUrl = URL.createObjectURL(blob);

            setLoadedAssets((prev) => ({
              ...prev,
              [url]: objectUrl // Map original path -> new Blob URL
            }));
          }
          completed++;
          if (completed === totalAssets) {
            setLoadingProgress(100);
            setAssetsLoaded(true);
          }
          resolve();
        };

        xhr.onerror = () => {
          console.error("Failed to load:", url);
          // Even if failed, we proceed to avoid locking the app
          completed++;
          if (completed === totalAssets) setAssetsLoaded(true);
          resolve();
        };

        xhr.send();
      });
    };

    // Trigger Loads
    assetsToLoad.forEach(loadFile);

  }, []);

  // Transition from Loading to Ready when assets are done AND we are in loading stage
  useEffect(() => {
    if (stage === "loading" && assetsLoaded) {
      setTimeout(() => setStage("ready"), 500);
    }
  }, [stage, assetsLoaded]);


  // 2. AUDIO ENGINE
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    let targetSrc = "";
    // RESOLVE ASSET PATHS: Check if we have a blob URL, otherwise fallback (though preloader should catch them)
    const getResolvedPath = (path: string) => loadedAssets[path] || path;

    if (stage === "hook") targetSrc = getResolvedPath(INITIAL_SLIDES[0].audio);
    if (stage === "slides") {
      const slideAudio = INITIAL_SLIDES[currentSlide].audio;
      if (slideAudio) targetSrc = getResolvedPath(slideAudio);
    }

    const currentSrc = audio.getAttribute("src");
    const fadeDuration = (stage === "hook") ? 5000 : 1000;

    if (!targetSrc) {
      // If we want silence (e.g. MusicSlide handles its own audio), fade out and pause
      if (!audio.paused) {
        const fadeOut = setInterval(() => {
          if (audio.volume > 0.05) audio.volume -= 0.05;
          else {
            clearInterval(fadeOut);
            audio.pause();
            audio.src = ""; // Clear src
          }
        }, 50);
      }
      return;
    }

    if (currentSrc !== targetSrc) {
      // Quick fade out/in logic
      const fadeOut = setInterval(() => {
        if (audio.volume > 0.05) audio.volume -= 0.05;
        else {
          clearInterval(fadeOut);
          audio.pause();
          audio.src = targetSrc;
          audio.load();
          audio.play().then(() => {
            // Fade In
            const fadeIn = setInterval(() => {
              if (audio.volume < 0.9) audio.volume += 0.05;
              else clearInterval(fadeIn);
            }, fadeDuration / 20);
          }).catch(() => console.warn("Audio missing/blocked"));
        }
      }, 50);
    }
  }, [stage, currentSlide, loadedAssets]);

  const handleStart = () => {
    confetti({ particleCount: 200, spread: 120, origin: { y: 0.6 }, colors: ['#22c55e', '#ffffff', '#ff0000'] });
    setStage("hook");
  };

  const nextSlide = () => {
    if (currentSlide < INITIAL_SLIDES.length - 1) {
      setCurrentSlide((prev) => prev + 1);
    } else {
      setStage("dashboard");
    }
  };

  // Resolve Video Path
  const getActiveVideo = () => {
    const path = (stage === "hook" || stage === "slides")
      ? (stage === "hook" ? INITIAL_SLIDES[0].bg : INITIAL_SLIDES[currentSlide].bg)
      : "";
    return loadedAssets[path] || path;
  };
  const activeVideo = getActiveVideo();

  return (
    <main className="flex h-screen w-screen flex-col items-center justify-center relative overflow-hidden text-white bg-black font-sans">

      {/* 0. VHS OVERLAY (Global) */}
      <VHSEffect
        active={true}
        intensity={stage === "loading" ? "high" : stage === "hook" ? "medium" : "low"}
      />

      {/* FULLSCREEN TOGGLE - Only visible when NOT in fullscreen */}
      {!isFullscreen && (
        <button
          onClick={toggleFullscreen}
          className="absolute top-6 right-6 z-50 p-3 bg-white/10 backdrop-blur-md rounded-full text-white/50 hover:text-white hover:bg-white/20 transition-all border border-white/5"
        >
          <Maximize className="w-5 h-5" />
        </button>
      )}

      {/* SKIP BUTTON - Visible in hook and slides */}
      {(stage === "hook" || stage === "slides") && (
        <motion.button
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 20 }}
          onClick={() => {
            if (stage === "hook") setStage("slides");
            else nextSlide();
          }}
          className="absolute top-6 right-20 z-50 px-6 py-2 bg-white/10 backdrop-blur-md rounded-full text-white/70 hover:text-white hover:bg-white/20 transition-all border border-white/5 text-xs font-bold tracking-widest uppercase"
        >
          SKIP
        </motion.button>
      )}

      {/* BACKGROUND VIDEO LAYER */}
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

      <audio ref={audioRef} loop />

      {/* CONTENT LAYER */}
      <div className="relative z-20 w-full h-full flex flex-col items-center justify-center">
        <AnimatePresence mode="wait">

          {/* PASSWORD SCREEN */}
          {stage === "password" && (
            <PasswordScreen key="password" onSuccess={() => setStage("loading")} />
          )}

          {/* LOADING SCREEN WITH PROGRESS BAR */}
          {stage === "loading" && (
            <motion.div
              key="loader"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="flex flex-col items-center gap-6"
            >
              <div className="w-64 h-2 bg-white/10 rounded-full overflow-hidden border border-white/5">
                <motion.div
                  className="h-full bg-green-500 shadow-[0_0_10px_#22c55e]"
                  initial={{ width: 0 }}
                  animate={{ width: `${loadingProgress}%` }}
                  transition={{ ease: "linear" }}
                />
              </div>
              <div className="flex flex-col items-center gap-1">
                <span className="text-green-400 font-mono text-sm tracking-widest uppercase animate-pulse">
                  Downloading Memories...
                </span>
                <span className="text-white/30 font-mono text-xs">
                  {loadingProgress.toFixed(0)}%
                </span>
              </div>
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
              {INITIAL_SLIDES[currentSlide].id === "intro" && <IntroSlide data={data} onNext={nextSlide} />}
              {INITIAL_SLIDES[currentSlide].id === "stats" && <StatsSlide data={data} onNext={nextSlide} />}
              {INITIAL_SLIDES[currentSlide].id === "memories" && <MemoriesSlide onNext={nextSlide} />}
              {INITIAL_SLIDES[currentSlide].id === "map" && <MapSlide onNext={nextSlide} />}
              {INITIAL_SLIDES[currentSlide].id === "music" && <MusicSlide onNext={nextSlide} />}
              {INITIAL_SLIDES[currentSlide].id === "capsule" && <TimeCapsuleSlide onNext={nextSlide} />}
              {INITIAL_SLIDES[currentSlide].id === "love" && <LoveSlide data={data} onNext={nextSlide} />}
            </>
          )}

          {/* DASHBOARD */}
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