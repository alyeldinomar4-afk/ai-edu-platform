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
        { name: t('nav.aiDemo'), path: '/ai-demo' },
    ];

    // Add dashboard link if logged in
    if (user) {
        navLinks.push({ name: t('nav.dashboard'), path: getDashboardPath() });
    }

    return (
        <nav className="sticky top-0 z-50 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-gray-100 dark:border-slate-700/50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    {/* Logo */}
                    <Link to="/" className="flex items-center gap-2 group">
                        {/* Light mode logo */}
                        <div className="w-9 h-9 flex items-center justify-center transition-transform group-hover:scale-105 dark:hidden">
                            <img src={logoLight} alt="Nexora AI Logo" className="w-full h-full object-contain" />
                        </div>
                        {/* Dark mode logo */}
                        <div className="hidden w-9 h-9 items-center justify-center transition-transform group-hover:scale-105 dark:flex">
                            <img src={logoDark} alt="Nexora AI Logo" className="w-full h-full object-contain" />
                        </div>
                        <span className="font-extrabold text-2xl tracking-tight bg-clip-text text-transparent bg-linear-to-r from-slate-900 to-slate-700 dark:from-white dark:to-slate-300 transition-all group-hover:from-primary group-hover:to-primary-600">
                            Nexora <span className="text-primary italic">AI</span>
                        </span>
                    </Link>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center gap-8">
                        {navLinks.map((link) => (
                            <Link
                                key={link.path}
                                to={link.path}
                                className={cn(
                                    "text-sm font-medium transition-colors hover:text-primary",
                                    location.pathname === link.path ? "text-primary" : "text-slate-600 dark:text-slate-300"
                                )}
                            >
                                {link.name}
                            </Link>
                        ))}
                    </div>

                    {/* Desktop Actions */}
                    <div className="hidden md:flex items-center gap-3">
                        <button
                            onClick={() => i18n.changeLanguage(i18n.language === 'en' ? 'ar' : 'en')}
                            className="p-2 rounded-full text-slate-500 hover:text-primary dark:text-slate-400 dark:hover:text-primary transition-colors flex items-center gap-2"
                            title={t('nav.switchToArabic')}
                        >
                            <Globe size={20} />
                            <span className="text-sm font-medium">{i18n.language === 'en' ? 'العربية' : 'EN'}</span>
                        </button>
                        <ThemeToggle />

                        {user ? (
                            <div className="flex items-center gap-4 pl-4 border-l border-slate-200 dark:border-slate-700">
                                <Link to={getDashboardPath()} className="flex items-center gap-3 hover:opacity-80 transition-opacity">
                                    <span className="text-sm font-medium text-slate-700 dark:text-slate-300 hidden lg:block">{user.name}</span>
                                    <img src={user.avatar} alt={user.name} className="w-9 h-9 rounded-full border border-slate-200 dark:border-slate-600" />
                                </Link>
                                <Button variant="ghost" size="sm" onClick={handleLogout} title={t('nav.logout')}>
                                    <LogOut size={18} className="text-slate-500 hover:text-red-500 dark:text-slate-400" />
                                </Button>
                            </div>
                        ) : (
                            <>
                                <Link to="/login">
                                    <Button variant="ghost" size="sm">{t('nav.login')}</Button>
                                </Link>
                                <Link to="/register">
                                    <Button size="sm">{t('nav.getStarted')}</Button>
                                </Link>
                            </>
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
