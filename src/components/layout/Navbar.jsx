import { useState, useRef, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, BookOpen, LogOut, Globe, User, ChevronDown, Home, Users, LayoutDashboard, Sparkles } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import logoLight from '../../assets/logo-light.png';
import logoDark from '../../assets/logo-dark.png';
import Button from '../ui/Button';
import ThemeToggle from '../ui/ThemeToggle';
import { cn } from '../../utils';
import { useAuth } from '../../auth/useAuth';

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
    const profileRef = useRef(null);

    // Close profile dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (profileRef.current && !profileRef.current.contains(event.target)) {
                setIsProfileOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);
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

    const getProfilePath = () => {
        if (!user) return '/login';
        return `/${user.role}/profile`;
    };

    const navLinks = [
        { name: t('nav.home'), path: '/', icon: Home },
        { name: t('nav.courses'), path: '/courses', icon: BookOpen },
        { name: t('nav.instructors'), path: '/instructors', icon: Users },
    ];

    // Add dashboard link if logged in
    if (user) {
        navLinks.push({ name: t('nav.dashboard'), path: getDashboardPath(), icon: LayoutDashboard });
    }

    return (
        <nav className="sticky top-0 z-50 bg-white/75 dark:bg-[#090d1a]/80 backdrop-blur-2xl border-b border-transparent shadow-[0_4px_30px_rgb(0,0,0,0.03)] dark:shadow-[0_4px_30px_rgb(0,0,0,0.2)] transition-all duration-500">
            <div className="max-w-[1400px] mx-auto px-6 sm:px-10 lg:px-12">
                <div className="flex justify-between items-center h-[84px]">
                    {/* Left side: Logo */}
                    <div className="flex-1 flex items-center justify-start">
                        <Link to="/" className="flex items-center gap-3 group shrink-0 relative z-10">
                            {/* Light mode logo */}
                            <div className="w-9 h-9 flex items-center justify-center transition-transform group-hover:scale-105 dark:hidden">
                                <img src={logoLight} alt="Nexora AI Logo" className="w-full h-full object-contain" />
                            </div>
                            {/* Dark mode logo */}
                            <div className="hidden w-9 h-9 items-center justify-center transition-transform group-hover:scale-105 dark:flex">
                                <img src={logoDark} alt="Nexora AI Logo" className="w-full h-full object-contain" />
                            </div>
                            <span className="font-extrabold text-[26px] xl:text-[28px] tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 dark:from-white dark:via-slate-200 dark:to-white transition-all duration-300 group-hover:from-primary group-hover:via-primary group-hover:to-indigo-500">
                                Nexora<span className="text-primary group-hover:text-indigo-500 italic ml-1 font-black transition-colors duration-300">AI</span>
                            </span>
                        </Link>
                    </div>

                    {/* Center side: Navigation Links (Uncrowded) */}
                    <div className="hidden md:flex flex-none items-center justify-center gap-10">
                        {navLinks.map((link) => {
                            const isActive = location.pathname === link.path;
                            const IconComp = link.icon;
                            return (
                                <Link
                                    key={link.path}
                                    to={link.path}
                                    className={cn(
                                        "relative py-2 text-[15px] font-bold tracking-wide transition-all duration-300 group/nav",
                                        isActive 
                                            ? "text-primary dark:text-primary-light" 
                                            : "text-slate-600 dark:text-slate-300 hover:text-primary dark:hover:text-primary"
                                    )}
                                >
                                    {/* Text — visible by default, hides on hover */}
                                    <span className="inline-block transition-all duration-300 group-hover/nav:opacity-0 group-hover/nav:scale-75 group-hover/nav:blur-[2px]">
                                        {link.name}
                                    </span>
                                    {/* Icon — hidden by default, appears on hover in same position */}
                                    <span className="absolute inset-0 flex items-center justify-center opacity-0 scale-50 transition-all duration-300 group-hover/nav:opacity-100 group-hover/nav:scale-100 pointer-events-none">
                                        <IconComp className="w-5 h-5" />
                                    </span>
                                    {isActive && (
                                        <motion.div 
                                            layoutId="nav-underline" 
                                            className="absolute -bottom-[2px] left-0 right-0 h-[3px] bg-primary rounded-full shadow-[0_0_10px_rgba(79,70,229,0.5)]" 
                                            transition={{ type: "spring", stiffness: 500, damping: 30 }}
                                        />
                                    )}
                                </Link>
                            );
                        })}
                    </div>

                    {/* Right side: Actions */}
                    <div className="flex-1 flex items-center justify-end gap-6">
                        {/* Clean Theme & Lang Controls */}
                        <div className="hidden lg:flex items-center gap-5 pr-5 border-r border-slate-200 dark:border-slate-800/60">
                            <button
                                onClick={() => i18n.changeLanguage(i18n.language === 'en' ? 'ar' : 'en')}
                                className="text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white transition-colors flex items-center gap-1.5 font-bold"
                                title={t('nav.switchToArabic')}
                            >
                                <Globe size={18} />
                                <span className="text-[11px] uppercase tracking-wider">{i18n.language === 'en' ? 'Ar' : 'En'}</span>
                            </button>
                            <ThemeToggle />
                        </div>

                        <div className="hidden md:flex items-center">
                            {user ? (
                                <div className="relative" ref={profileRef}>
                                    <div 
                                        onClick={() => setIsProfileOpen(!isProfileOpen)}
                                        className="flex items-center gap-3 cursor-pointer group px-2 py-1 rounded-full hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
                                    >
                                        <div className="flex flex-col items-end leading-none opacity-80 group-hover:opacity-100 transition-opacity hidden xl:flex">
                                            <span className="text-[15px] font-bold text-slate-700 dark:text-slate-200 tracking-tight">{user.name}</span>
                                        </div>
                                        <div className="relative">
                                            <img src={user.avatar} alt={user.name} className="w-10 h-10 rounded-full object-cover border-2 border-slate-100 dark:border-slate-800 shadow-sm transition-transform duration-300 group-hover:scale-105" />
                                            <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 border-[2.5px] border-white dark:border-[#090d1a] rounded-full"></div>
                                        </div>
                                        <ChevronDown size={16} className={`text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-200 transition-transform duration-300 ${isProfileOpen ? 'rotate-180' : ''}`} />
                                    </div>
                                    
                                    <AnimatePresence>
                                        {isProfileOpen && (
                                            <motion.div 
                                                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                                transition={{ duration: 0.2 }}
                                                className="absolute right-0 top-14 w-56 bg-white dark:bg-[#111827] rounded-2xl shadow-[0_10px_40px_rgba(0,0,0,0.1)] dark:shadow-[0_10px_40px_rgba(0,0,0,0.3)] border border-slate-100 dark:border-slate-800/60 overflow-hidden z-50 flex flex-col p-2"
                                            >
                                                <div className="px-4 py-3 border-b border-slate-100 dark:border-slate-800/60 xl:hidden mb-1">
                                                    <p className="text-sm font-bold text-slate-800 dark:text-white truncate">{user.name}</p>
                                                    <p className="text-xs text-slate-500 dark:text-slate-400 truncate capitalize">{user.role}</p>
                                                </div>
                                                <Link to={getProfilePath()} onClick={() => setIsProfileOpen(false)} className="flex items-center gap-3 px-3 py-2.5 text-[14px] font-semibold text-slate-600 dark:text-slate-300 hover:text-primary hover:bg-primary/5 dark:hover:bg-primary/10 rounded-xl transition-colors cursor-pointer">
                                                    <User size={16} />
                                                    {t('nav.profile', { defaultValue: 'Profile' })}
                                                </Link>
                                                <button onClick={() => { setIsLogoutModalOpen(true); setIsProfileOpen(false); }} className="flex items-center gap-3 w-full px-3 py-2.5 text-[14px] font-semibold text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-xl transition-colors text-left mt-1 cursor-pointer">
                                                    <LogOut size={16} />
                                                    {t('nav.logout')}
                                                </button>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>
                            ) : (
                                <div className="flex items-center gap-5">
                                    <Link to="/login" className="text-[15px] font-bold text-slate-600 dark:text-slate-300 hover:text-primary transition-colors">
                                        {t('nav.login')}
                                    </Link>
                                    <Link to="/register">
                                        <button className="relative overflow-hidden bg-slate-900 dark:bg-white text-white dark:text-slate-900 px-6 py-2.5 rounded-full text-[15px] font-extrabold tracking-wide shadow-xl hover:shadow-2xl hover:-translate-y-0.5 transition-all duration-300 group">
                                            <div className="absolute inset-0 bg-gradient-to-r from-primary to-indigo-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                                            <span className="relative z-10 group-hover:text-white transition-colors duration-300">{t('nav.getStarted')}</span>
                                        </button>
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

            {/* Logout Confirmation Modal */}
            <AnimatePresence>
                {isLogoutModalOpen && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
                            onClick={() => setIsLogoutModalOpen(false)}
                        />
                        <motion.div
                            initial={{ scale: 0.95, opacity: 0, y: 10 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.95, opacity: 0, y: 10 }}
                            className="relative bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 max-w-sm w-full shadow-2xl border border-slate-100 dark:border-slate-800 flex flex-col items-center"
                        >
                            <div className="w-16 h-16 bg-red-100 dark:bg-red-500/20 rounded-full flex items-center justify-center mb-5">
                                <LogOut className="w-8 h-8 text-red-600 dark:text-red-500" />
                            </div>
                            <h3 className="text-xl font-bold text-center text-slate-900 dark:text-white mb-2">
                                {t('nav.logoutConfirmTitle', { defaultValue: 'Sign Out' })}
                            </h3>
                            <p className="text-center text-slate-500 dark:text-slate-400 text-sm mb-8 leading-relaxed">
                                {t('nav.logoutConfirmMessage', { defaultValue: 'Are you sure you want to sign out of your account?' })}
                            </p>
                            <div className="flex gap-3 w-full">
                                <button
                                    onClick={() => setIsLogoutModalOpen(false)}
                                    className="flex-1 px-4 py-3 rounded-xl font-bold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                                >
                                    {t('common.cancel', { defaultValue: 'Cancel' })}
                                </button>
                                <button
                                    onClick={() => {
                                        setIsLogoutModalOpen(false);
                                        handleLogout();
                                    }}
                                    className="flex-1 px-4 py-3 rounded-xl font-bold bg-red-600 hover:bg-red-700 text-white shadow-lg shadow-red-500/30 transition-all font-semibold"
                                >
                                    {t('nav.logout')}
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </nav>
    );
};

export default Navbar;
