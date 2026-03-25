import { useEffect, useState } from 'react';

/**
 * A toggle button that adds/removes a `high-contrast` class on the root HTML element.
 * Incorporates into accessibility tools without altering layout.
 */
export const AccessibilityToggle = () => {
    const [highContrast, setHighContrast] = useState(false);

    useEffect(() => {
        // Applying the class to the root element. Global CSS can inject custom overrides
        // using the .high-contrast selector.
        if (highContrast) {
            document.documentElement.classList.add('high-contrast');
        } else {
            document.documentElement.classList.remove('high-contrast');
        }
    }, [highContrast]);

    return (
        <button
            onClick={() => setHighContrast(!highContrast)}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm border border-slate-200 dark:border-slate-700 font-medium"
            aria-pressed={highContrast}
            aria-label={highContrast ? "Disable High Contrast Mode" : "Enable High Contrast Mode"}
        >
            <svg
                xmlns="http://www.w3.org/2000/svg"
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
            >
                <circle cx="12" cy="12" r="10" />
                <path d="M12 2a10 10 0 0 0 0 20Z" />
            </svg>
            <span className="text-sm">
                High Contrast: {highContrast ? 'ON' : 'OFF'}
            </span>
        </button>
    );
};
