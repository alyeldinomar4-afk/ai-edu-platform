import { Construction } from 'lucide-react';

const ComingSoon = ({ title = "Coming Soon" }) => {
    return (
        <div className="flex flex-col items-center justify-center h-96 text-center p-8 bg-white dark:bg-slate-800/50 rounded-xl border border-slate-100 dark:border-slate-700 border-dashed">
            <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-full mb-4 text-slate-400 dark:text-slate-500">
                <Construction className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">{title}</h3>
            <p className="text-slate-500 dark:text-slate-400 max-w-md">
                This feature is currently under development. Check back later for updates.
            </p>
        </div>
    );
};

export default ComingSoon;
