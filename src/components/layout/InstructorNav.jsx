import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, MessageSquare, Star, Megaphone } from 'lucide-react';
import { cn } from '../../utils';

const InstructorNav = () => {
    const location = useLocation();

    const links = [
        { name: 'Dashboard', path: '/instructor/dashboard', icon: LayoutDashboard },
        { name: 'Q&A', path: '/instructor/qa', icon: MessageSquare },
        { name: 'Reviews', path: '/instructor/reviews', icon: Star },
        { name: 'Announcements', path: '/instructor/announcements', icon: Megaphone },
    ];

    return (
        <div className="mb-8 border-b border-slate-200 dark:border-slate-800">
            <nav className="-mb-px flex space-x-6 sm:space-x-8 overflow-x-auto">
                {links.map((link) => {
                    const isActive = location.pathname === link.path ||
                        (link.path === '/instructor/dashboard' && location.pathname === '/instructor');
                    return (
                        <Link
                            key={link.path}
                            to={link.path}
                            className={cn(
                                "whitespace-nowrap pb-4 px-1 border-b-2 font-medium text-sm flex items-center gap-2 transition-colors",
                                isActive
                                    ? "border-primary text-primary"
                                    : "border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300 dark:text-slate-400 dark:hover:text-slate-300 dark:hover:border-slate-700"
                            )}
                        >
                            <link.icon className={cn("w-4 h-4", isActive ? "text-primary" : "text-slate-400 group-hover:text-slate-500")} />
                            {link.name}
                        </Link>
                    )
                })}
            </nav>
        </div>
    );
};

export default InstructorNav;
