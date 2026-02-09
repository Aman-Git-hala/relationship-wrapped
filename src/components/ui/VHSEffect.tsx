
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface VHSEffectProps {
    intensity?: "low" | "medium" | "high";
    active?: boolean;
}

export default function VHSEffect({ intensity = "low", active = true }: VHSEffectProps) {
    // Random glitch triggers
    const [glitchActive, setGlitchActive] = useState(false);
    const [glitchPos, setGlitchPos] = useState({ x: 0, y: 0 });

    const [time, setTime] = useState<string | null>(null);

    useEffect(() => {
        const timeout = setTimeout(() => {
            setTime(new Date().toLocaleTimeString());
        }, 0);

        const timer = setInterval(() => {
            setTime(new Date().toLocaleTimeString());
        }, 1000);
        return () => {
            clearTimeout(timeout);
            clearInterval(timer);
        };
    }, []);

    useEffect(() => {
        if (!active) return;

        const triggerGlitch = () => {
            // Higher intensity = more frequent glitches
            const chance = intensity === "high" ? 0.3 : (intensity === "medium" ? 0.1 : 0.05);

            if (Math.random() < chance) {
                setGlitchPos({
                    x: Math.random() * 10 - 5,
                    y: Math.random() * 10 - 5
                });
                setGlitchActive(true);
                setTimeout(() => setGlitchActive(false), 200); // Short glitch
            }
        };

        const interval = setInterval(triggerGlitch, 2000); // Check every 2s
        return () => clearInterval(interval);
    }, [intensity, active]);

    if (!active) return null;

    return (
        <div className="fixed inset-0 pointer-events-none z-[100] overflow-hidden">
            {/* 1. Base Scanlines (Always on but subtle) */}
            <div className="vhs-scanlines mix-blend-overlay" />

            {/* 2. Base Noise */}
            <div className="vhs-noise" />

            {/* 3. Intense Glitch Overlay (Conditional) */}
            <AnimatePresence>
                {glitchActive && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 0.2 }}
                        exit={{ opacity: 0 }}
                        className="absolute inset-0 bg-red-500 mix-blend-color-burn"
                        style={{
                            transform: `translate(${glitchPos.x}px, ${glitchPos.y}px)`
                        }}
                    />
                )}
            </AnimatePresence>

            {/* 4. Chromatic Aberration Simulation (CSS Filter) */}
            <div className={`absolute inset-0 pointer-events-none mix-blend-screen opacity-30
                ${intensity === "high" ? "animate-pulse" : ""}`}
                style={{
                    boxShadow: "inset 0 0 20px rgba(0,0,0,0.5)",
                    background: "linear-gradient(rgba(18, 16, 16, 0) 50%, rgba(0, 0, 0, 0.25) 50%), linear-gradient(90deg, rgba(255, 0, 0, 0.06), rgba(0, 255, 0, 0.02), rgba(0, 0, 255, 0.06))",
                    backgroundSize: "100% 2px, 3px 100%"
                }}
            />

            {/* 5. Date Overlay (Classic VHS Style) */}
            <div className="absolute bottom-8 right-8 font-mono text-xl md:text-2xl text-white/50 tracking-widest bg-black/50 px-4 py-1"
                style={{ textShadow: "2px 2px 0px #ff0000, -1px -1px 0 #00ffff" }}>
                REC {time}
            </div>
        </div>
    );
}
