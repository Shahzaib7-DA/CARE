import { motion } from 'framer-motion';

/**
 * A glowing AI Assistant orb component floating in the bottom-right corner.
 * Triggers a subtle breathing animation and hover effects.
 */
export const AIOrb = () => {
    return (
        <motion.button
            className="fixed bottom-6 right-6 w-16 h-16 rounded-full bg-gradient-to-r from-blue-500 to-cyan-400 shadow-xl flex items-center justify-center z-[100] cursor-pointer focus:outline-none focus:ring-4 focus:ring-blue-400/50"
            animate={{
                scale: [1, 1.05, 1],
            }}
            transition={{
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut"
            }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            aria-label="Open AI Assistant"
            title="AI Assistant"
        >
            <div className="absolute inset-0 rounded-full bg-white/20 blur-sm mix-blend-overlay pointer-events-none" />

            {/* Orb Core Glow */}
            <div className="w-6 h-6 bg-white/40 rounded-full shadow-[0_0_15px_rgba(255,255,255,0.8)] pointer-events-none" />
        </motion.button>
    );
};
