"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Lock, Unlock } from "lucide-react";

interface PasswordScreenProps {
    onSuccess: () => void;
}

export default function PasswordScreen({ onSuccess }: PasswordScreenProps) {
    const [input, setInput] = useState("");
    const [error, setError] = useState(false);
    const [success, setSuccess] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (input.toLowerCase() === "loveyouidiot") {
            setSuccess(true);
            setError(false);
            setTimeout(onSuccess, 1500); // Wait for success animation
        } else {
            setError(true);
            setInput("");
            setTimeout(() => setError(false), 2000); // Clear error state after a bit
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black font-mono text-green-500"
        >
            {/* Background Matrix-like effect or just simple noise could go here if global CSS doesn't cover it, but leveraging global styles */}

            <div className="w-full max-w-md p-8 space-y-8">
                <motion.div
                    initial={{ y: -20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    className="text-center space-y-2"
                >
                    <div className="flex justify-center mb-4">
                        {success ? (
                            <Unlock className="w-12 h-12 text-green-400 animate-pulse" />
                        ) : (
                            <Lock className="w-12 h-12 text-green-600/80" />
                        )}
                    </div>
                    <h1 className="text-2xl tracking-widest uppercase border-b border-green-900/50 pb-4">
                        Encrypted Archives
                    </h1>
                    <p className="text-sm text-green-700/80">
                        Enter passkey to decrypt relationship data.
                    </p>
                </motion.div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="relative group">
                        <input
                            type="password"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            className="w-full bg-black/50 border-b-2 border-green-900/50 py-3 px-4 text-center text-xl tracking-[0.5em] text-green-400 focus:outline-none focus:border-green-500 placeholder-green-900/30 transition-all font-bold"
                            placeholder="••••••••••••"
                            autoFocus
                        />

                        {/* Glitch border effect on focus could go here */}
                        <div className={`absolute bottom-0 left-0 h-0.5 bg-green-500 transition-all duration-300 ${input ? 'w-full' : 'w-0'}`} />
                    </div>

                    <div className="h-6 text-center">
                        {error && (
                            <motion.p
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="text-red-500 text-xs tracking-widest uppercase font-bold"
                            >
                                Access Denied: Invalid Key
                            </motion.p>
                        )}
                        {success && (
                            <motion.p
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="text-green-400 text-xs tracking-widest uppercase font-bold shadow-green-500/50 drop-shadow-lg"
                            >
                                Access Granted. Decrypting...
                            </motion.p>
                        )}
                    </div>

                    <button
                        type="submit"
                        disabled={success}
                        className={`w-full py-4 uppercase tracking-widest text-xs font-bold transition-all duration-300 
              ${success
                                ? 'bg-green-500 text-black hover:bg-green-400'
                                : 'bg-green-900/20 text-green-600 hover:bg-green-900/40 hover:text-green-400 border border-green-900/30'
                            }`}
                    >
                        {success ? "Unlocking..." : "Authenticate"}
                    </button>
                </form>

                <div className="text-center text-[10px] text-green-900/40">
                    SECURE CONNECTION ESTABLISHED
                    <br />
                    ID: 8472-UE-92
                </div>
            </div>
        </motion.div>
    );
}
