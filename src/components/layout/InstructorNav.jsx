import { Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { LayoutDashboard, MessageSquare, Star, Megaphone, Video } from 'lucide-react';
import { cn } from '../../utils';

const InstructorNav = () => {
    const location = useLocation();
    const { t } = useTranslation();

    const links = [
        { name: t('instructorNav.dashboard'), path: '/instructor/dashboard', icon: LayoutDashboard },
        { name: t('instructorNav.lectures'), path: '/instructor/videos', icon: Video },
        { name: t('instructorNav.qa'), path: '/instructor/qa', icon: MessageSquare },
        { name: t('instructorNav.reviews'), path: '/instructor/reviews', icon: Star },
        { name: t('instructorNav.announcements'), path: '/instructor/announcements', icon: Megaphone },
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
