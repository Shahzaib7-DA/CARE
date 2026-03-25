

export const SkeletonBox = ({ className = '' }: { className?: string }) => (
    <div className={`bg-slate-200 dark:bg-slate-700 animate-pulse rounded ${className}`} />
);

export const SkeletonText = ({ className = '', width = 'w-full' }: { className?: string; width?: string }) => (
    <div className={`h-4 bg-slate-200 dark:bg-slate-700 animate-pulse rounded ${width} ${className}`} />
);

/**
 * Reusable skeleton loader matching patient/doctor cards layout.
 */
export const SkeletonCard = ({ className = '' }: { className?: string }) => {
    return (
        <div className={`p-6 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm ${className}`}>
            <div className="flex items-center gap-4 mb-4">
                <SkeletonBox className="w-12 h-12 rounded-full" />
                <div className="flex-1 space-y-2">
                    <SkeletonText width="w-3/4" />
                    <SkeletonText width="w-1/2" />
                </div>
            </div>
            <div className="space-y-2 mt-6">
                <SkeletonText />
                <SkeletonText />
                <SkeletonText width="w-5/6" />
            </div>
        </div>
    );
};

/**
 * Reusable skeleton loader for charts or prediction panels.
 */
export const SkeletonChart = ({ className = '' }: { className?: string }) => (
    <div className={`p-6 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm ${className}`}>
        <SkeletonText width="w-1/3" className="mb-6 h-6" />
        <SkeletonBox className="w-full h-48 rounded-lg" />
    </div>
);
