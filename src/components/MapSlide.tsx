"use client";

import React, { useState, useEffect, useRef } from "react";
import { ComposableMap, Geographies, Geography, Marker, Line } from "react-simple-maps";
import { motion, AnimatePresence } from "framer-motion";
import { MapPin, Globe, Plus, X, Heart } from "lucide-react";

const geoUrl = "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json";

// Types
type Pin = {
    id: number;
    x: number; // Percent
    y: number; // Percent
    comment: string;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function MapSlide({ onNext }: { onNext: () => void }) {
    // 1. Geography Pins (Fixed Lat/Lon)
    const [geoMarkers, setGeoMarkers] = useState<{ name: string; coordinates: [number, number] }[]>([
        { name: "ME", coordinates: [77.1025, 28.7041] }, // Delhi (Approx)
        { name: "YOU", coordinates: [85.8312, 20.2961] }, // Bhubaneswar, Orissa
    ]);

    // 2. User Pins (Click to Drop - Relative to Container)
    const [userPins, setUserPins] = useState<Pin[]>([]);

    // 3. Interaction State
    const [isAddingPin, setIsAddingPin] = useState(false);
    const [tempPin, setTempPin] = useState<{ x: number, y: number } | null>(null);
    const [comment, setComment] = useState("");
    const mapContainerRef = useRef<HTMLDivElement>(null);

    const [randomFact, setRandomFact] = useState("");
    const facts = [
        "Distance is just a number.",
        "Everywhere is home with you.",
        "World domination in progress.",
        "Collecting memories, one pin at a time.",
        "Next destination: Wherever you are."
    ];

    useEffect(() => {
        setRandomFact(facts[Math.floor(Math.random() * facts.length)]);
    }, []);

    // Handle Click on Map Container to Drop Pin
    const handleContainerClick = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!mapContainerRef.current) return;

        // Only allow clicking if we are "in add mode" OR just let them click anywhere?
        // User said "drop a pin anywhere". Let's make it intuitive: Click -> Open Modal.

        const rect = mapContainerRef.current.getBoundingClientRect();
        const x = ((e.clientX - rect.left) / rect.width) * 100;
        const y = ((e.clientY - rect.top) / rect.height) * 100;

        setTempPin({ x, y });
        setIsAddingPin(true);
    };

    const savePin = () => {
        if (tempPin && comment.trim()) {
            setUserPins(prev => [...prev, { id: Date.now(), x: tempPin.x, y: tempPin.y, comment }]);
            setTempPin(null);
            setComment("");
            setIsAddingPin(false);
        }
    };

    return (
        <div className="w-full h-full bg-[#0a0a0a] flex flex-col items-center justify-center relative overflow-hidden font-sans">

            {/* Header */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="absolute top-8 z-20 text-center pointer-events-none"
            >
                <div className="flex items-center justify-center gap-2 mb-2">
                    <Globe className="w-4 h-4 text-blue-500 animate-pulse" />
                    <span className="text-blue-500 text-[10px] uppercase tracking-[0.3em]">Global Coverage</span>
                </div>
                <h2 className="text-3xl font-black text-white/90 tracking-widest uppercase drop-shadow-md">
                    OUR WORLD
                </h2>
                <p className="text-white/50 text-[10px] tracking-widest mt-1 uppercase">
                    Click anywhere to drop a memory
                </p>
            </motion.div>

            {/* Map Container - Clickable Area */}
            <motion.div
                ref={mapContainerRef}
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 1.5 }}
                className="w-full max-w-5xl h-auto aspect-[16/9] relative z-10 cursor-crosshair group"
                onClick={handleContainerClick}
            >
                <ComposableMap
                    projection="geoMercator"
                    projectionConfig={{
                        scale: 100
                    }}
                    style={{ width: "100%", height: "100%", pointerEvents: "none" }} // Disable inner SVG pointer events so container catches clicks
                >
                    <Geographies geography={geoUrl}>
                        {({ geographies }: { geographies: any[] }) =>
                            geographies.map((geo) => (
                                <Geography
                                    key={geo.rsmKey}
                                    geography={geo}
                                    fill="#1a1a1a"
                                    stroke="#333"
                                    strokeWidth={0.5}
                                    style={{
                                        default: { fill: "#1a1a1a", outline: "none" },
                                        hover: { fill: "#2a2a2a", outline: "none" },
                                        pressed: { fill: "#404040", outline: "none" }
                                    }}
                                />
                            ))
                        }
                    </Geographies>

                    {/* Connection Line */}
                    <Line
                        from={geoMarkers[0].coordinates}
                        to={geoMarkers[1].coordinates}
                        stroke="#ec4899"
                        strokeWidth={2}
                        strokeLinecap="round"
                        style={{
                            filter: "drop-shadow(0 0 4px rgba(236, 72, 153, 0.5))"
                        }}
                    />

                    {/* Geo Markers (Fixed) */}
                    {geoMarkers.map(({ name, coordinates }) => (
                        <Marker key={name} coordinates={coordinates}>
                            <motion.g
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{ type: "spring", stiffness: 260, damping: 20 }}
                            >
                                <circle r={4} fill="#F472B6" />
                                <circle r={2} fill="white" />
                                <text
                                    textAnchor="middle"
                                    y={-10}
                                    style={{
                                        fontFamily: "monospace",
                                        fontSize: "12px",
                                        fill: "#F472B6",
                                        fontWeight: "bold",
                                        textShadow: "0 2px 4px black"
                                    }}
                                >
                                    {name}
                                </text>
                            </motion.g>
                        </Marker>
                    ))}

                </ComposableMap>

                {/* User Pins Overlay */}
                {userPins.map((pin) => (
                    <div
                        key={pin.id}
                        className="absolute group/pin"
                        style={{ top: `${pin.y}%`, left: `${pin.x}%`, transform: 'translate(-50%, -100%)' }}
                    >
                        <MapPin className="w-6 h-6 text-yellow-400 drop-shadow-[0_4px_4px_rgba(0,0,0,0.5)] fill-yellow-400/20" />
                        {/* Hover Comment */}
                        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-max max-w-[150px] bg-white text-black text-[10px] p-2 rounded-lg opacity-0 group-hover/pin:opacity-100 transition-opacity pointer-events-none shadow-xl border border-white/20">
                            {pin.comment}
                            <div className="absolute top-full left-1/2 -translate-x-1/2 border-8 border-transparent border-t-white" />
                        </div>
                    </div>
                ))}

            </motion.div>

            {/* Add Pin Modal */}
            <AnimatePresence>
                {isAddingPin && tempPin && (
                    <>
                        {/* Backdrop */}
                        <motion.div
                            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                            className="absolute inset-0 bg-black/60 backdrop-blur-sm z-30"
                            onClick={() => setIsAddingPin(false)}
                        />

                        {/* Modal */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 20 }}
                            className="absolute z-40 bg-[#111] border border-white/10 p-6 rounded-2xl w-[90%] max-w-sm shadow-2xl"
                            style={{
                                top: '50%',
                                left: '50%',
                                transform: 'translate(-50%, -50%)',
                                marginTop: '-50px' // Offset slightly up
                            }}
                        >
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="text-white text-lg font-bold flex items-center gap-2">
                                    <MapPin className="w-4 h-4 text-yellow-500" />
                                    Drop a Memory
                                </h3>
                                <button onClick={() => setIsAddingPin(false)} className="text-white/50 hover:text-white">
                                    <X className="w-5 h-5" />
                                </button>
                            </div>

                            <textarea
                                autoFocus
                                value={comment}
                                onChange={(e) => setComment(e.target.value)}
                                placeholder="What happened here?"
                                className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-white text-sm mb-4 focus:outline-none focus:border-white/30 h-24 resize-none"
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter' && !e.shiftKey) {
                                        e.preventDefault();
                                        savePin();
                                    }
                                }}
                            />

                            <button
                                onClick={savePin}
                                disabled={!comment.trim()}
                                className="w-full py-3 bg-white text-black font-bold uppercase tracking-widest text-xs rounded-xl hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                            >
                                Pin It
                            </button>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>

            {/* Footer */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1 }}
                className="absolute bottom-12 z-20 text-center"
            >
                <p className="text-white/40 text-[10px] md:text-xs mb-6 italic max-w-md mx-auto px-4">
                    &quot;{randomFact}&quot;
                </p>

                <button
                    onClick={onNext}
                    className="px-8 py-3 bg-white hover:bg-gray-200 text-black font-bold text-xs tracking-[0.2em] uppercase rounded-full transition-all hover:scale-105 active:scale-95 shadow-[0_0_20px_rgba(255,255,255,0.3)]"
                >
                    Continue
                </button>
            </motion.div>

            {/* Background Grid */}
            <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none" />

        </div>
    );
}
