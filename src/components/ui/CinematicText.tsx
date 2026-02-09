
"use client";
import { useEffect, useState, useRef } from "react";
import { motion } from "framer-motion";

const CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+-=[]{}|;:,.<>?";

interface CinematicTextProps {
    text: string;
    className?: string;
    duration?: number; // Total duration of the effect in ms
    delay?: number; // Delay before starting
    once?: boolean; // Whether to run only once
}

export default function CinematicText({
    text,
    className = "",
    duration = 1500,
    delay = 0,
    once = true
}: CinematicTextProps) {
    const [displayText, setDisplayText] = useState("");
    const hasRun = useRef(false);

    useEffect(() => {
        if (once && hasRun.current) {
            return;
        }

        let timeoutId: NodeJS.Timeout;
        let intervalId: NodeJS.Timeout;

        const startAnimation = () => {
            const startTime = Date.now();
            const len = text.length;

            intervalId = setInterval(() => {
                const now = Date.now();
                const progress = Math.min((now - startTime) / duration, 1);

                // Determine how many characters should be "resolved" based on progress
                const resolvedCount = Math.floor(progress * len);

                let current = "";
                for (let i = 0; i < len; i++) {
                    if (i < resolvedCount) {
                        current += text[i];
                    } else {
                        // Random char
                        current += CHARS[Math.floor(Math.random() * CHARS.length)];
                    }
                }

                setDisplayText(current);

                if (progress >= 1) {
                    clearInterval(intervalId);
                    hasRun.current = true;
                    setDisplayText(text); // Ensure final state is correct
                }
            }, 30); // ~30fps update for the scramble
        };

        if (delay > 0) {
            timeoutId = setTimeout(startAnimation, delay);
        } else {
            startAnimation();
        }

        return () => {
            clearTimeout(timeoutId);
            clearInterval(intervalId);
        };
    }, [text, duration, delay, once]);

    return (
        <motion.span
            className={className}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
        >
            {displayText}
        </motion.span>
    );
}
