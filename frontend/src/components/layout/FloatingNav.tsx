import React, { useState } from 'react';
import { motion, useScroll, useMotionValueEvent } from 'framer-motion';

export interface NavItem {
    label: string;
    href: string;
}

interface FloatingNavProps {
    items: NavItem[];
}

/**
 * A polished floating navigation component that appears conditionally when scrolling up.
 */
export const FloatingNav: React.FC<FloatingNavProps> = ({ items }) => {
    const { scrollY } = useScroll();
    const [visible, setVisible] = useState(false);

    useMotionValueEvent(scrollY, "change", (latest) => {
        const previous = scrollY.getPrevious() ?? 0;

        if (latest > 100 && latest < previous) {
            // Scrolling up and scrolled past 100px - show nav
            setVisible(true);
        } else if (latest > 100 && latest > previous) {
            // Scrolling down - hide nav
            setVisible(false);
        } else {
            // Top of page - hide nav
            setVisible(false);
        }
    });

    return (
        <motion.div
            initial={{ opacity: 0, y: -100 }}
            animate={{
                y: visible ? 0 : -100,
                opacity: visible ? 1 : 0
            }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="fixed top-6 inset-x-0 mx-auto max-w-fit z-[100]"
        >
            <div className="flex items-center justify-center gap-6 px-8 py-3 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border border-slate-200 dark:border-slate-800 rounded-full shadow-lg">
                {items.map((item) => (
                    <a
                        key={item.href}
                        href={item.href}
                        className="text-sm font-medium text-slate-700 dark:text-slate-300 hover:text-teal-600 dark:hover:text-teal-400 transition-colors relative group py-1"
                    >
                        {item.label}
                        {/* Hover border bottom effect */}
                        <span className="absolute inset-x-0 -bottom-1 h-[2px] bg-teal-500 scale-x-0 group-hover:scale-x-100 transition-transform origin-left rounded-full" />
                    </a>
                ))}
            </div>
        </motion.div>
    );
};
