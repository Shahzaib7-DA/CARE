import React from 'react';
import { motion } from 'framer-motion';

interface ScrollRevealWrapperProps {
    children: React.ReactNode;
    className?: string;
    delay?: number;
    duration?: number;
    yOffset?: number;
    once?: boolean;
}

/**
 * Wraps content to fade in and slide up when scrolled into view.
 * Ideal for polishing existing cards and sections.
 */
export const ScrollRevealWrapper: React.FC<ScrollRevealWrapperProps> = ({
    children,
    className = '',
    delay = 0,
    duration = 0.6,
    yOffset = 20,
    once = true
}) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: yOffset }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once, margin: "-50px" }}
            transition={{ duration, delay, ease: [0.215, 0.61, 0.355, 1] }}
            className={className}
        >
            {children}
        </motion.div>
    );
};
