const LoadingSkeleton = ({ className = "", variant = "default" }) => {
    const baseClasses = "animate-pulse bg-slate-200 rounded";

    const variants = {
        default: "h-4 w-full",
        title: "h-8 w-3/4",
        text: "h-4 w-full",
        card: "h-64 w-full",
        avatar: "h-12 w-12 rounded-full",
        button: "h-10 w-24",
    };

    return (
        <div className={`${baseClasses} ${variants[variant]} ${className}`} />
    );
};

export const CourseCardSkeleton = () => {
    return (
        <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-slate-100">
            <LoadingSkeleton variant="card" className="h-48 rounded-none" />
            <div className="p-5 space-y-3">
                <div className="flex items-center justify-between">
                    <LoadingSkeleton className="h-6 w-16" />
                    <LoadingSkeleton className="h-4 w-12" />
                </div>
                <LoadingSkeleton variant="title" className="h-6" />
                <LoadingSkeleton className="h-4 w-1/2" />
                <div className="flex gap-4">
                    <LoadingSkeleton className="h-4 w-20" />
                    <LoadingSkeleton className="h-4 w-20" />
                </div>
                <div className="flex items-center justify-between pt-2">
                    <LoadingSkeleton className="h-6 w-16" />
                    <LoadingSkeleton variant="button" />
                </div>
            </div>
        </div>
    );
};

export const StatCardSkeleton = () => {
    return (
        <div className="bg-white p-6 rounded-xl border border-slate-100 shadow-sm">
            <div className="flex flex-col items-center justify-center text-center space-y-3">
                <LoadingSkeleton className="h-12 w-12 rounded-full" />
                <LoadingSkeleton className="h-8 w-12" />
                <LoadingSkeleton className="h-4 w-24" />
            </div>
        </div>
    );
};

export const ProgressCardSkeleton = () => {
    return (
        <div className="bg-white p-5 rounded-xl border border-slate-100 shadow-sm">
            <div className="flex justify-between items-start mb-4">
                <div className="flex-1 space-y-2">
                    <LoadingSkeleton className="h-5 w-3/4" />
                    <LoadingSkeleton className="h-4 w-1/2" />
                </div>
                <LoadingSkeleton variant="button" className="h-9" />
            </div>
            <LoadingSkeleton className="h-2 w-full rounded-full" />
            <LoadingSkeleton className="h-3 w-20 mt-2 ml-auto" />
        </div>
    );
};

export default LoadingSkeleton;
