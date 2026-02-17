import { useState } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { LayoutDashboard, BookOpen, Video, Users, Settings, LogOut, Menu, X } from 'lucide-react';
import { useAuth } from '../../auth/useAuth';

const AdminLayout = () => {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const location = useLocation();
    const navigate = useNavigate();
    const { user, logout } = useAuth();

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    const links = [
        { name: 'Dashboard', path: '/admin/dashboard', icon: LayoutDashboard },
        { name: 'Courses', path: '/admin/courses', icon: BookOpen },
        { name: 'Videos', path: '/admin/videos', icon: Video },
        { name: 'Users', path: '/admin/users', icon: Users },
        { name: 'Settings', path: '/admin/settings', icon: Settings },
    ];

    const SidebarContent = () => (
        <>
            <div className="p-6 border-b border-slate-800">
                <h1 className="text-xl font-bold text-white flex items-center gap-2">
                    <LayoutDashboard className="text-primary" /> Admin Panel
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
                    Logout
                </button>
            </div>
        </>
    );

    return (
        <div className="min-h-screen bg-slate-50 flex">
            {/* Mobile Sidebar Overlay */}
            {sidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-40 lg:hidden"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            {/* Sidebar - Desktop: always visible, Mobile: slide-in */}
            <aside className={`
                fixed lg:static inset-y-0 left-0 z-50
                w-64 bg-slate-900 text-slate-300 flex flex-col
                transform transition-transform duration-300 ease-in-out
                ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
                lg:flex-shrink-0
            `}>
                <SidebarContent />
            </aside>

            {/* Main Content */}
            <div className="flex-1 overflow-auto min-w-0">
                <header className="bg-white border-b border-slate-200 h-16 flex items-center justify-between px-4 sm:px-8">
                    <div className="flex items-center gap-3">
                        {/* Mobile hamburger */}
                        <button
                            onClick={() => setSidebarOpen(!sidebarOpen)}
                            className="lg:hidden p-2 rounded-lg hover:bg-slate-100 text-slate-600 cursor-pointer"
                        >
                            {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
                        </button>
                        <h2 className="font-semibold text-slate-900">
                            {links.find(l => l.path === location.pathname)?.name || 'Dashboard'}
                        </h2>
                    </div>
                    <div className="flex items-center gap-3">
                        {user && (
                            <>
                                <span className="text-sm font-medium text-slate-700 hidden sm:block">{user.name}</span>
                                <div className="w-8 h-8 rounded-full bg-slate-200 overflow-hidden">
                                    <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
                                </div>
                            </>
                        )}
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
