import { useState } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { LayoutDashboard, BookOpen, Video, Users, Settings, LogOut, Menu, X, User, Globe } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../auth/useAuth';
import ThemeToggle from '../ui/ThemeToggle';

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
            <div className="p-6 border-b border-slate-800">
                <h1 className="text-xl font-bold text-white flex items-center gap-2">
                    <LayoutDashboard className="text-primary" /> {t('dashboard.admin.panel')}
                </h1>
            </div>

            <nav className="flex-1 p-4 space-y-1">
                {links.map((link) => {
                    const isActive = location.pathname === link.path;
                    return (
                        <Link
                            key={link.path}
                            to={link.path}
                            onClick={() => setSidebarOpen(false)}
                            className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-colors cursor-pointer ${isActive
                                ? 'bg-primary text-white font-medium'
                                : 'hover:bg-slate-800 hover:text-white'
                                }`}
                        >
                            <link.icon size={20} />
                            {link.name}
                        </Link>
                    );
                })}
            </nav>

            <div className="p-4 border-t border-slate-800">
                <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-slate-800 hover:text-white transition-colors text-red-400 cursor-pointer"
                >
                    <LogOut size={20} />
                    {t('dashboard.admin.logout')}
                </button>
            </div>
        </>
    );

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex">
            {/* Mobile Sidebar Overlay */}
            {sidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-40 lg:hidden"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

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
