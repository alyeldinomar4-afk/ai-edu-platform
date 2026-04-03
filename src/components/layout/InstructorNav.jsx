import { Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { LayoutDashboard, MessageSquare, Star, Megaphone, Video } from 'lucide-react';
import { motion } from 'framer-motion';
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
        <div className="mb-8">
            <nav className="flex gap-1 p-1 bg-slate-100/80 dark:bg-slate-800/50 rounded-xl overflow-x-auto scrollbar-hide">
                {links.map((link) => {
                    const isActive = location.pathname === link.path ||
                        (link.path === '/instructor/dashboard' && location.pathname === '/instructor');
                    return (
                        <Link
                            key={link.path}
                            to={link.path}
                            className={cn(
                                "relative whitespace-nowrap px-4 py-2.5 rounded-lg font-medium text-sm flex items-center gap-2 transition-colors z-10",
                                isActive
                                    ? "text-primary"
                                    : "text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200"
                            )}
                        >
                            {isActive && (
                                <motion.div
                                    layoutId="instructor-tab"
                                    className="absolute inset-0 bg-white dark:bg-slate-900 rounded-lg shadow-sm"
                                    transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                                    style={{ zIndex: -1 }}
                                />
                            )}
                            <link.icon className={cn("w-4 h-4", isActive ? "text-primary" : "")} />
                            {link.name}
                        </Link>
                    );
                })}
            </nav>
        </div>
    );
};

export default InstructorNav;
