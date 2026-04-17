import { Outlet, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import logoLight from '../../assets/logo-light.png';
import logoDark from '../../assets/logo-dark.png';
import ThemeToggle from '../ui/ThemeToggle';
import AuthBackground from '../ui/AuthBackground';

const AuthLayout = () => {
    return (
        <div className="min-h-screen flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden">

            {/* ── Animated Background ── */}
            <AuthBackground />

            {/* Theme toggle in top-right corner */}
            <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3, duration: 0.4 }}
                className="absolute top-4 right-4 z-20"
            >
                <ThemeToggle />
            </motion.div>

            <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10">
                <motion.div
                    initial={{ opacity: 0, y: -20, scale: 0.9 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                >
                    <Link to="/" className="flex justify-center items-center gap-2 mb-6">
                        <motion.div
                            initial={{ rotate: -10 }}
                            animate={{ rotate: 0 }}
                            transition={{ duration: 0.5, type: 'spring', stiffness: 200 }}
                            className="w-14 h-14 flex items-center justify-center overflow-hidden dark:hidden transition-transform hover:scale-105"
                        >
                            <img src={logoLight} alt="Nexora AI Logo" className="w-full h-full object-contain" />
                        </motion.div>
                        <motion.div
                            initial={{ rotate: -10 }}
                            animate={{ rotate: 0 }}
                            transition={{ duration: 0.5, type: 'spring', stiffness: 200 }}
                            className="hidden w-14 h-14 items-center justify-center overflow-hidden dark:flex transition-transform hover:scale-105"
                        >
                            <img src={logoDark} alt="Nexora AI Logo" className="w-full h-full object-contain" />
                        </motion.div>
                        <span className="font-extrabold text-3xl tracking-tight bg-clip-text text-transparent bg-linear-to-r from-slate-900 to-slate-700 dark:from-white dark:to-slate-300">
                            Nexora <span className="text-primary italic">AI</span>
                        </span>
                    </Link>
                </motion.div>
            </div>

            <motion.div
                initial={{ opacity: 0, y: 30, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.6, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
                className="mt-8 sm:mx-auto sm:w-full sm:max-w-md relative z-10"
            >
                <div className="bg-white/90 dark:bg-slate-800/80 backdrop-blur-xl py-8 px-4 shadow-xl shadow-slate-200/50 dark:shadow-slate-900/70 sm:rounded-xl sm:px-10 border border-slate-100/80 dark:border-slate-700/60 relative overflow-hidden">
                    <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-primary via-secondary to-accent" />
                    <Outlet />
                </div>
            </motion.div>
        </div>
    );
};

export default AuthLayout;
