import { useState } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { LayoutDashboard, BookOpen, Video, Users, Settings, LogOut, Menu, X, User, Globe } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../auth/useAuth';
import ThemeToggle from '../ui/ThemeToggle';

const sidebarStagger = {
    hidden: {},
    visible: {
        transition: {
            staggerChildren: 0.06,
            delayChildren: 0.15,
        },
    },
};

const sidebarItem = {
    hidden: { opacity: 0, x: -16 },
    visible: {
        opacity: 1,
        x: 0,
        transition: { duration: 0.35, ease: [0.25, 0.46, 0.45, 0.94] },
    },
};

const AdminLayout = () => {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const location = useLocation();
    const navigate = useNavigate();
    const { user, logout } = useAuth();
    const { t, i18n } = useTranslation();

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    const links = [
        { name: t('dashboard.admin.dashboard'), key: 'Dashboard', path: '/admin/dashboard', icon: LayoutDashboard },
        { name: t('dashboard.admin.courses'), key: 'Courses', path: '/admin/courses', icon: BookOpen },
        { name: t('dashboard.admin.videos'), key: 'Videos', path: '/admin/videos', icon: Video },
        { name: t('dashboard.admin.users'), key: 'Users', path: '/admin/users', icon: Users },
        { name: t('dashboard.admin.profile'), key: 'Profile', path: '/admin/profile', icon: User },
        { name: t('dashboard.admin.settings.title'), key: 'Settings', path: '/admin/settings', icon: Settings },
    ];

    const SidebarContent = () => (
        <>
            {/* Logo / Title */}
            <div className="p-6 border-b border-slate-800">
                <motion.h1
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4 }}
                    className="text-xl font-bold text-white flex items-center gap-2"
                >
                    <motion.div
                        animate={{ rotate: [0, 10, -10, 0] }}
                        transition={{ duration: 2, repeat: Infinity, repeatDelay: 5, ease: 'easeInOut' }}
                    >
                        <LayoutDashboard className="text-primary" />
                    </motion.div>
                    {t('dashboard.admin.panel')}
                </motion.h1>
            </div>

            {/* Navigation Links */}
            <motion.nav
                variants={sidebarStagger}
                initial="hidden"
                animate="visible"
                className="flex-1 p-4 space-y-1"
            >
                {links.map((link) => {
                    const isActive = location.pathname === link.path;
                    return (
                        <motion.div key={link.path} variants={sidebarItem}>
                            <Link
                                to={link.path}
                                onClick={() => setSidebarOpen(false)}
                                className={`relative flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 cursor-pointer group overflow-hidden ${isActive
                                    ? 'bg-primary text-white font-medium shadow-lg shadow-primary/25'
                                    : 'hover:bg-slate-800 hover:text-white text-slate-400'
                                    }`}
                            >
                                {/* Active glow indicator */}
                                {isActive && (
                                    <motion.div
                                        layoutId="admin-sidebar-active"
                                        className="absolute inset-0 bg-primary rounded-xl"
                                        transition={{ type: 'spring', stiffness: 350, damping: 30 }}
                                        style={{ zIndex: -1 }}
                                    />
                                )}
                                <motion.div
                                    whileHover={{ scale: 1.15, rotate: 5 }}
                                    transition={{ type: 'spring', stiffness: 400, damping: 17 }}
                                >
                                    <link.icon size={20} />
                                </motion.div>
                                <span className="relative z-10">{link.name}</span>
                                {/* Hover shine effect */}
                                {!isActive && (
                                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/[0.03] to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
                                )}
                            </Link>
                        </motion.div>
                    );
                })}
            </motion.nav>

            {/* Logout */}
            <div className="p-4 border-t border-slate-800">
                <motion.button
                    whileHover={{ x: 4 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-red-500/10 transition-colors text-red-400 hover:text-red-300 cursor-pointer group"
                >
                    <motion.div
                        whileHover={{ rotate: -12 }}
                        transition={{ type: 'spring', stiffness: 300 }}
                    >
                        <LogOut size={20} />
                    </motion.div>
                    {t('dashboard.admin.logout')}
                </motion.button>
            </div>
        </>
    );

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex">
            {/* Mobile Sidebar Overlay */}
            <AnimatePresence>
                {sidebarOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
                        onClick={() => setSidebarOpen(false)}
                    />
                )}
            </AnimatePresence>

            {/* Sidebar - Desktop: always visible, Mobile: slide-in */}
            <aside className={`
                fixed lg:static inset-y-0 z-50
                ${i18n.language === 'ar' ? 'right-0' : 'left-0'}
                w-64 bg-slate-900 text-slate-300 flex flex-col
                transform transition-transform duration-300 ease-in-out
                ${sidebarOpen ? 'translate-x-0' : (i18n.language === 'ar' ? 'translate-x-full lg:translate-x-0' : '-translate-x-full lg:translate-x-0')}
                lg:flex-shrink-0
            `}>
                <SidebarContent />
            </aside>

            {/* Main Content */}
            <div className="flex-1 overflow-auto min-w-0">
                <header className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-700 h-16 flex items-center justify-between px-4 sm:px-8">
                    <div className="flex items-center gap-3">
                        {/* Mobile hamburger */}
                        <button
                            onClick={() => setSidebarOpen(!sidebarOpen)}
                            className="lg:hidden p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 cursor-pointer"
                        >
                            {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
                        </button>
                        <h2 className="font-semibold text-slate-900 dark:text-white">
                            {links.find(l => l.path === location.pathname)?.name || t('dashboard.admin.dashboard')}
                        </h2>
                    </div>
                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => i18n.changeLanguage(i18n.language === 'en' ? 'ar' : 'en')}
                            className="p-2 rounded-full text-slate-500 hover:text-primary dark:text-slate-400 dark:hover:text-primary transition-colors flex items-center gap-2"
                            title={i18n.language === 'en' ? 'العربية' : 'English'}
                        >
                            <Globe size={20} />
                            <span className="text-xs font-bold uppercase">{i18n.language === 'en' ? 'ar' : 'en'}</span>
                        </button>
                        <ThemeToggle />
                        <Link to="/admin/profile" className="flex items-center gap-3 hover:bg-slate-100 dark:hover:bg-slate-800 p-2 rounded-xl transition-colors cursor-pointer group">
                            {user && (
                                <>
                                    <span className="text-sm font-medium text-slate-700 dark:text-slate-300 hidden sm:block group-hover:text-primary transition-colors">{user.name}</span>
                                    <div className="w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden border border-slate-200 dark:border-slate-800">
                                        <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
                                    </div>
                                </>
                            )}
                        </Link>
                    </div>
                </header>
                <main className="p-4 sm:p-8">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default AdminLayout;
