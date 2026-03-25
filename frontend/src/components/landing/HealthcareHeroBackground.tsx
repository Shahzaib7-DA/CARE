import React from 'react';

interface HealthcareHeroBackgroundProps {
    children: React.ReactNode;
    className?: string;
    overlayOpacity?: string;
}

/**
 * A reusable background image component for public-facing pages.
 * Displays a high-quality modern hospital environment image with a soft overlay.
 */
export const HealthcareHeroBackground: React.FC<HealthcareHeroBackgroundProps> = ({
    children,
    className = '',
    overlayOpacity = 'bg-black/30' // Soft overlay to maintain text readability
}) => {
    return (
        <div
            className={`relative bg-cover bg-center overflow-hidden ${className}`}
            style={{ backgroundImage: "url('/images/healthcare_hero_bg.png')" }}
        >
            {/* Soft overlay - backdrop-blur-sm adds depth while maintaining readability vertically */}
            <div className={`absolute inset-0 backdrop-blur-sm ${overlayOpacity} dark:bg-black/50 transition-colors duration-300 pointer-events-none`} />

            {/* Content wrapper */}
            <div className="relative z-10 w-full h-full">
                {children}
            </div>
        </div>
    );
};
