import { ChevronRight, Home } from 'lucide-react';
import { Link } from 'react-router-dom';

const Breadcrumb = ({ items }) => {
    return (
        <nav className="flex items-center gap-2 text-sm mb-6" aria-label="Breadcrumb">
            <Link
                to="/"
                className="flex items-center gap-1 text-slate-500 dark:text-slate-400 hover:text-primary transition-colors"
                aria-label="Home"
            >
                <Home className="w-4 h-4" />
                <span className="hidden sm:inline">Home</span>
            </Link>

            {items.map((item, index) => (
                <div key={index} className="flex items-center gap-2">
                    <ChevronRight className="w-4 h-4 text-slate-300 dark:text-slate-600" />
                    {item.href ? (
                        <Link
                            to={item.href}
                            className="text-slate-500 dark:text-slate-400 hover:text-primary transition-colors truncate max-w-[150px] sm:max-w-none"
                        >
                            {item.label}
                        </Link>
                    ) : (
                        <span className="text-slate-900 dark:text-white font-medium truncate max-w-[150px] sm:max-w-none">
                            {item.label}
                        </span>
                    )}
                </div>
            ))}
        </nav>
    );
};

export default Breadcrumb;
