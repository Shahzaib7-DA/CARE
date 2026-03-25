import React from 'react';

export interface GlassCardProps extends React.HTMLAttributes<HTMLDivElement> {
    children: React.ReactNode;
    className?: string;
}

/**
 * Reusable GlassCard component for semi-transparent backdrop-blur styling.
 * Useful for Doctor profile cards, Patient medical record cards, and AI prediction result panels.
 */
export const GlassCard: React.FC<GlassCardProps> = ({ children, className = '', ...props }) => {
    return (
        <div
            className={`bg-white/40 dark:bg-slate-800/40 backdrop-blur-lg border border-white/30 dark:border-slate-700/50 rounded-xl shadow-md ${className}`}
            {...props}
        >
            {children}
        </div>
    );
};
