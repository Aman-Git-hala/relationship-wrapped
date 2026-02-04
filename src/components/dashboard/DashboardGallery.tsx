"use client";

export default function DashboardGallery() {
    const PHOTO_COUNT = 20;
    const images = Array.from({ length: PHOTO_COUNT }).map((_, i) => `/memories/${i + 1}.jpeg`);

    return (
        <div className="h-full overflow-y-auto custom-scrollbar">
            <h2 className="text-3xl font-bold text-white mb-6 sticky top-0 bg-black/80 backdrop-blur-xl py-4 z-10 border-b border-white/10">The Gallery</h2>
            {/* UPDATED: Increased columns to make images smaller */}
            <div className="columns-3 md:columns-4 lg:columns-5 gap-4 space-y-4">
                {images.map((src, idx) => (
                    <div key={idx} className="break-inside-avoid relative group rounded-xl overflow-hidden mb-4">
                        <img
                            src={src}
                            alt={`Memory ${idx + 1}`}
                            loading="lazy"
                            className="w-full h-auto object-cover transform transition duration-700 group-hover:scale-110"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
                    </div>
                ))}
            </div>
        </div>
    );
}
