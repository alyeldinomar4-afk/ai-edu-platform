import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, BookOpen, LogOut, Globe } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import logoLight from '../../assets/logo-light.png';
import logoDark from '../../assets/logo-dark.png';
import Button from '../ui/Button';
import ThemeToggle from '../ui/ThemeToggle';
import { cn } from '../../utils';
import { useAuth } from '../../auth/useAuth';

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const { user, logout } = useAuth();
    const location = useLocation();
    const navigate = useNavigate();
    const { t, i18n } = useTranslation();

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    const getDashboardPath = () => {
        if (!user) return '/login';
        return `/${user.role}/dashboard`;
    };

    const navLinks = [
        { name: t('nav.home'), path: '/' },
        { name: t('nav.courses'), path: '/courses' },
        { name: t('nav.instructors'), path: '/instructors' },
    ];

    // Add dashboard link if logged in
    if (user) {
        navLinks.push({ name: t('nav.dashboard'), path: getDashboardPath() });
    }

    return (
        <nav className="sticky top-0 z-50 bg-white/70 dark:bg-slate-900/70 backdrop-blur-lg border-b border-slate-200/50 dark:border-slate-800/60 shadow-xs transition-all duration-300">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    {/* Left side: Logo */}
                    <div className="flex-1 flex items-center justify-start">
                        <Link to="/" className="flex items-center gap-2.5 group shrink-0 relative z-10">
                            {/* Light mode logo */}
                            <div className="w-8 h-8 flex items-center justify-center transition-transform group-hover:scale-105 dark:hidden">
                                <img src={logoLight} alt="Nexora AI Logo" className="w-full h-full object-contain" />
                            </div>
                            {/* Dark mode logo */}
                            <div className="hidden w-8 h-8 items-center justify-center transition-transform group-hover:scale-105 dark:flex">
                                <img src={logoDark} alt="Nexora AI Logo" className="w-full h-full object-contain" />
                            </div>
                            <span className="font-extrabold text-2xl tracking-tighter bg-clip-text text-transparent bg-linear-to-r from-slate-900 to-slate-800 dark:from-white dark:to-slate-200 transition-all group-hover:from-primary group-hover:to-primary-600">
                                Nexora<span className="text-primary italic ml-0.5">AI</span>
                            </span>
                        </Link>
                    </div>

                    {/* Center side: Navigation Links */}
                    <div className="hidden md:flex flex-none items-center justify-center">
                        <div className="flex items-center gap-1 py-1.5 px-1 bg-slate-50/50 dark:bg-slate-800/20 rounded-full border border-slate-200/40 dark:border-slate-700/40 backdrop-blur-sm shadow-xs transition-all duration-500">
                            {navLinks.map((link) => {
                                const isActive = location.pathname === link.path;
                                
                                return (
                                    <Link
                                        key={link.path}
                                        to={link.path}
                                        className={cn(
                                            "relative px-4 py-1.5 rounded-full text-sm font-semibold transition-all duration-300",
                                            isActive 
                                                ? "bg-primary text-white shadow-[0_4px_12px_rgba(79,70,229,0.3)] scale-[1.02]" 
                                                : "text-slate-500 dark:text-slate-400 hover:text-primary dark:hover:text-primary-light"
                                        )}
                                    >
                                        {link.name}
                                    </Link>
                                );
                            })}
                        </div>
                    </div>

                    {/* Right side: Actions */}
                    <div className="flex-1 flex items-center justify-end gap-2">
                        <div className="hidden md:flex items-center bg-slate-100/50 dark:bg-slate-800/50 rounded-full px-1 py-1 border border-slate-200/50 dark:border-slate-700/50">
                            <button
                                onClick={() => i18n.changeLanguage(i18n.language === 'en' ? 'ar' : 'en')}
                                className="p-1.5 rounded-full text-slate-500 hover:text-primary dark:text-slate-400 dark:hover:text-primary-light transition-colors flex items-center gap-1.5"
                                title={t('nav.switchToArabic')}
                            >
                                <Globe size={16} />
                                <span className="text-[10px] font-bold uppercase">{i18n.language === 'en' ? 'العربية' : 'EN'}</span>
                            </button>
                            <div className="w-[1px] h-4 bg-slate-300 dark:bg-slate-700 mx-0.5" />
                            <ThemeToggle />
                        </div>

                        <div className="hidden md:flex items-center">
                            {user ? (
                                <div className="flex items-center border-l-0 sm:border-l border-slate-200 dark:border-slate-800 sm:pl-3 ml-1">
                                    <div className="flex items-center gap-3 group cursor-pointer bg-slate-50/50 dark:bg-slate-800/20 hover:bg-white dark:hover:bg-slate-800 rounded-full py-1 pr-2 pl-3.5 transition-all duration-300 border border-slate-200/50 dark:border-slate-700/50 shadow-xs">
                                        <Link to={getDashboardPath()} className="flex items-center gap-2.5">
                                            <div className="flex flex-col items-end leading-none opacity-80 group-hover:opacity-100 transition-opacity">
                                                <span className="text-sm font-semibold text-slate-700 dark:text-slate-200 tracking-tight">{user.name}</span>
                                            </div>
                                            <div className="relative">
                                                <img src={user.avatar} alt={user.name} className="w-8 h-8 rounded-full object-cover border-2 border-white dark:border-slate-700 shadow-sm transition-transform duration-300 group-hover:scale-105" />
                                                <div className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 bg-green-500 border-2 border-white dark:border-slate-800 rounded-full"></div>
                                            </div>
                                        </Link>
                                        <div className="w-[1px] h-4 bg-slate-200 dark:bg-slate-700/80 mx-0.5" />
                                        <button onClick={handleLogout} title={t('nav.logout')} className="p-1.5 rounded-full text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition-all duration-300">
                                            <LogOut size={13} />
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <div className="flex items-center gap-2">
                                    <Link to="/login">
                                        <Button variant="ghost" size="sm">{t('nav.login')}</Button>
                                    </Link>
                                    <Link to="/register">
                                        <Button size="sm">{t('nav.getStarted')}</Button>
                                    </Link>
                                </div>
                            )}
                        </div>

                        {/* Mobile menu button */}
                        <div className="md:hidden flex items-center gap-2">
                            <button
                                onClick={() => i18n.changeLanguage(i18n.language === 'en' ? 'ar' : 'en')}
                                className="p-2 rounded-md text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                            >
                                <Globe size={20} />
                            </button>
                            <ThemeToggle />
                            <button
                                onClick={() => setIsOpen(!isOpen)}
                                className="p-2 rounded-md text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
                            >
                                {isOpen ? <X /> : <Menu />}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            {/* Mobile Menu */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="md:hidden bg-white dark:bg-slate-900 border-b border-gray-100 dark:border-slate-700/50 overflow-hidden"
                    >
                        <div className="px-4 pt-2 pb-6 space-y-2">
                            {navLinks.map((link) => (
                                <Link
                                    key={link.path}
                                    to={link.path}
                                    onClick={() => setIsOpen(false)}
                                    className={cn(
                                        "block px-3 py-2 rounded-md text-base font-medium",
                                        location.pathname === link.path
                                            ? "bg-primary/10 text-primary"
                                            : "text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800"
                                    )}
                                >
                                    {link.name}
                                </Link>
                            ))}
                            <div className="pt-4 border-t border-gray-100 dark:border-slate-700 flex flex-col gap-2">
                                {user ? (
                                    <>
                                        <Link to={getDashboardPath()} onClick={() => setIsOpen(false)} className="flex items-center gap-3 px-3 py-2">
                                            <img src={user.avatar} alt={user.name} className="w-8 h-8 rounded-full" />
                                            <span className="font-medium text-slate-900 dark:text-white">{user.name}</span>
                                        </Link>
                                        <Button variant="ghost" className="w-full justify-start text-red-500" onClick={() => { handleLogout(); setIsOpen(false); }}>
                                            <LogOut size={16} className="mr-2" /> {t('nav.logout')}
                                        </Button>
                                    </>
                                ) : (
                                    <>
                                        <Link to="/login" onClick={() => setIsOpen(false)}>
                                            <Button variant="ghost" className="w-full justify-start">{t('nav.login')}</Button>
                                        </Link>
                                        <Link to="/register" onClick={() => setIsOpen(false)}>
                                            <Button className="w-full justify-start">{t('nav.getStarted')}</Button>
                                        </Link>
                                    </>
                                )}
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </nav>
    );
};

export default Navbar;
