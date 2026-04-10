import { ChevronRight, Home } from 'lucide-react';
import { Link } from 'react-router-dom';

const Breadcrumb = ({ items, light = false }) => {
    return (
        <nav className="flex items-center gap-2 text-sm mb-6 overflow-x-auto scrollbar-hide pb-1 whitespace-nowrap w-full" aria-label="Breadcrumb">
            <Link
                to="/"
                className={`flex items-center gap-1 shrink-0 transition-colors ${light ? 'text-slate-300 hover:text-white' : 'text-slate-500 dark:text-slate-400 hover:text-primary'}`}
                aria-label="Home"
            >
                <Home className="w-4 h-4 shrink-0" />
                <span className="hidden sm:inline">Home</span>
            </Link>

            {items.map((item, index) => (
                <div key={index} className="flex items-center gap-2 shrink-0">
                    <ChevronRight className={`w-4 h-4 shrink-0 ${light ? 'text-slate-500' : 'text-slate-300 dark:text-slate-600'}`} />
                    {item.href ? (
                        <Link
                            to={item.href}
                            className={`transition-colors shrink-0 ${light ? 'text-slate-300 hover:text-white' : 'text-slate-500 dark:text-slate-400 hover:text-primary'}`}
                        >
                            {item.label}
                        </Link>
                    ) : (
                        <span className={`font-medium shrink-0 ${light ? 'text-white' : 'text-slate-900 dark:text-white'}`}>
                            {item.label}
                        </span>
                    )}
                </div>
            ))}
        </nav>
    );
};

export default Breadcrumb;
