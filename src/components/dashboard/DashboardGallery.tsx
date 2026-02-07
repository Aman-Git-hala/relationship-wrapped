"use client";
import { useState } from "react";

export default function DashboardGallery() {
    const PHOTO_COUNT = 20;
    const images = Array.from({ length: PHOTO_COUNT }).map((_, i) => `/memories/${i + 1}.jpeg`);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const [failedImages, setFailedImages] = useState<Set<number>>(new Set());

    const handleImageError = (index: number) => {
        setFailedImages(prev => {
            const next = new Set(prev);
            next.add(index);
            return next;
        });
    };

    // If all images failed (e.g. none uploaded yet), show a message?
    // Optional, but for now just hiding the broken ones.

    return (
        <div className="h-full overflow-y-auto custom-scrollbar">
            <h2 className="text-3xl font-bold text-white mb-6 sticky top-0 bg-black/80 backdrop-blur-xl py-4 z-10">The Gallery</h2>
            {/* UPDATED: Increased columns to make images smaller */}
            <div className="columns-3 md:columns-4 lg:columns-5 gap-4 space-y-4">
                {images.map((src, idx) => {
                    if (failedImages.has(idx)) return null;
                    return (
                        <div key={idx} className="break-inside-avoid relative group rounded-xl overflow-hidden mb-4">
                            <img
                                src={src}
                                alt={`Memory ${idx + 1}`}
                                loading="lazy"
                                onError={() => handleImageError(idx)}
                                className="w-full h-full object-cover transform transition duration-700 group-hover:scale-110" // Removed h-auto to avoid jump, using flex helpers
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
                        </div>
                    );
                })}
            </div>

            {failedImages.size === PHOTO_COUNT && (
                <div className="text-center text-white/30 py-20">
                    <p>No gallery images found.</p>
                    <p className="text-xs mt-2">Upload photos to /public/memories/</p>
                </div>
            )}
        </div>
    );
}
