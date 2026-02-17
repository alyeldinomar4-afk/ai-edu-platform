import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, BookOpen, Search, LogOut } from 'lucide-react';
import Button from '../ui/Button';
import { cn } from '../../utils';
import { useAuth } from '../../auth/useAuth';

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const { user, logout } = useAuth();
    const location = useLocation();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    const getDashboardPath = () => {
        if (!user) return '/login';
        return `/${user.role}/dashboard`;
    };

    const navLinks = [
        { name: 'Home', path: '/' },
        { name: 'Courses', path: '/courses' },
    ];

    // Add dashboard link if logged in
    if (user) {
        navLinks.push({ name: 'Dashboard', path: getDashboardPath() });
    }

    return (
        <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    {/* Logo */}
                    <Link to="/" className="flex items-center gap-2 group">
                        <div className="p-2 bg-primary/10 rounded-lg group-hover:bg-primary/20 transition-colors">
                            <BookOpen className="w-6 h-6 text-primary" />
                        </div>
                        <span className="font-bold text-xl tracking-tight text-slate-900">
                            AI<span className="text-primary">Edu</span>
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
                                    location.pathname === link.path ? "text-primary" : "text-slate-600"
                                )}
                            >
                                {link.name}
                            </Link>
                        ))}
                    </div>

                    {/* Desktop Actions */}
                    <div className="hidden md:flex items-center gap-4">
                        <div className="relative">
                            <Search className="w-5 h-5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                            <input
                                type="text"
                                placeholder="Search courses..."
                                className="pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 w-48 lg:w-64 transition-all"
                            />
                        </div>

                        {user ? (
                            <div className="flex items-center gap-4 pl-4 border-l border-slate-200">
                                <Link to={getDashboardPath()} className="flex items-center gap-3 hover:opacity-80 transition-opacity">
                                    <span className="text-sm font-medium text-slate-700 hidden lg:block">{user.name}</span>
                                    <img src={user.avatar} alt={user.name} className="w-9 h-9 rounded-full border border-slate-200" />
                                </Link>
                                <Button variant="ghost" size="sm" onClick={handleLogout} title="Logout">
                                    <LogOut size={18} className="text-slate-500 hover:text-red-500" />
                                </Button>
                            </div>
                        ) : (
                            <>
                                <Link to="/login">
                                    <Button variant="ghost" size="sm">Log in</Button>
                                </Link>
                                <Link to="/register">
                                    <Button size="sm">Get Started</Button>
                                </Link>
                            </>
                        )}
                    </div>

                    {/* Mobile menu button */}
                    <div className="md:hidden">
                        <button
                            onClick={() => setIsOpen(!isOpen)}
                            className="p-2 rounded-md text-slate-600 hover:bg-slate-100 cursor-pointer"
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
                        className="md:hidden bg-white border-b border-gray-100 overflow-hidden"
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
                                            : "text-slate-600 hover:bg-slate-50"
                                    )}
                                >
                                    {link.name}
                                </Link>
                            ))}
                            <div className="pt-4 border-t border-gray-100 flex flex-col gap-2">
                                {user ? (
                                    <>
                                        <Link to={getDashboardPath()} onClick={() => setIsOpen(false)} className="flex items-center gap-3 px-3 py-2">
                                            <img src={user.avatar} alt={user.name} className="w-8 h-8 rounded-full" />
                                            <span className="font-medium text-slate-900">{user.name}</span>
                                        </Link>
                                        <Button variant="ghost" className="w-full justify-start text-red-500" onClick={() => { handleLogout(); setIsOpen(false); }}>
                                            <LogOut size={16} className="mr-2" /> Logout
                                        </Button>
                                    </>
                                ) : (
                                    <>
                                        <Link to="/login" onClick={() => setIsOpen(false)}>
                                            <Button variant="ghost" className="w-full justify-start">Log in</Button>
                                        </Link>
                                        <Link to="/register" onClick={() => setIsOpen(false)}>
                                            <Button className="w-full justify-start">Get Started</Button>
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
