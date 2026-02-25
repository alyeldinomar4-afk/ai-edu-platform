import { Outlet, Link } from 'react-router-dom';
import logoLight from '../../assets/logo-light.png';
import logoDark from '../../assets/logo-dark.png';
import ThemeToggle from '../ui/ThemeToggle';

const AuthLayout = () => {
    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative">
            {/* Theme toggle in top-right corner */}
            <div className="absolute top-4 right-4">
                <ThemeToggle />
            </div>

            <div className="sm:mx-auto sm:w-full sm:max-w-md">
                <Link to="/" className="flex justify-center items-center gap-2 mb-6">
                    {/* Light mode logo */}
                    <div className="w-14 h-14 flex items-center justify-center overflow-hidden dark:hidden transition-transform hover:scale-105">
                        <img src={logoLight} alt="Nexora AI Logo" className="w-full h-full object-contain" />
                    </div>
                    {/* Dark mode logo */}
                    <div className="hidden w-14 h-14 items-center justify-center overflow-hidden dark:flex transition-transform hover:scale-105">
                        <img src={logoDark} alt="Nexora AI Logo" className="w-full h-full object-contain" />
                    </div>
                    <span className="font-extrabold text-3xl tracking-tight bg-clip-text text-transparent bg-linear-to-r from-slate-900 to-slate-700 dark:from-white dark:to-slate-300">
                        Nexora <span className="text-primary italic">AI</span>
                    </span>
                </Link>
            </div>

            <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
                <div className="bg-white dark:bg-slate-800 py-8 px-4 shadow-xl shadow-slate-200/50 dark:shadow-slate-900/50 sm:rounded-xl sm:px-10 border border-slate-100 dark:border-slate-700">
                    <Outlet />
                </div>
            </div>
        </div>
    );
};

export default AuthLayout;
