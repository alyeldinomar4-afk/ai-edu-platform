import { Users, BookOpen, Video, DollarSign, TrendingUp } from 'lucide-react';
import { motion } from 'framer-motion';
import { useAuth } from '../../auth/useAuth';

const StatCard = ({ title, value, change, icon: Icon, color }) => (
    <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white p-6 rounded-xl border border-slate-100 shadow-sm"
    >
        <div className="flex justify-between items-start mb-4">
            <div className={`p-3 rounded-xl ${color}`}>
                <Icon size={24} className="text-white" />
            </div>
            <span className={`text-xs font-semibold px-2 py-1 rounded-full ${change >= 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                {change >= 0 ? '+' : ''}{change}%
            </span>
        </div>
        <h3 className="text-slate-500 text-sm font-medium mb-1">{title}</h3>
        <p className="text-2xl font-bold text-slate-900">{value}</p>
    </motion.div>
);

const AdminDashboardPage = () => {
    const { user } = useAuth();

    return (
        <div className="space-y-8">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">Admin Dashboard</h1>
                    <p className="text-slate-500">Welcome back, {user?.name}</p>
                </div>
                <div className="text-sm text-slate-500">
                    Last updated: {new Date().toLocaleDateString()}
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard title="Total Users" value="12,345" change={12} icon={Users} color="bg-blue-500" />
                <StatCard title="Active Courses" value="142" change={5} icon={BookOpen} color="bg-indigo-500" />
                <StatCard title="Videos Uploaded" value="1,204" change={8} icon={Video} color="bg-pink-500" />
                <StatCard title="Total Revenue" value="$45,678" change={24} icon={DollarSign} color="bg-green-500" />
            </div>

            {/* Charts / Placeholder */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white p-6 rounded-xl border border-slate-100 shadow-sm">
                    <h3 className="font-bold text-slate-900 mb-6">Revenue Overview</h3>
                    <div className="h-64 flex items-end justify-between gap-2">
                        {[40, 60, 45, 70, 65, 85, 95].map((h, i) => (
                            <div key={i} className="w-full bg-blue-100 rounded-t-lg relative group">
                                <div
                                    className="bg-primary absolute bottom-0 w-full rounded-t-lg transition-all duration-500"
                                    style={{ height: `${h}%` }}
                                />
                                <div className="opacity-0 group-hover:opacity-100 absolute -top-8 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-xs py-1 px-2 rounded pointer-events-none">
                                    ${h * 100}
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="flex justify-between mt-4 text-xs text-slate-400">
                        <span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span><span>Sat</span><span>Sun</span>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-xl border border-slate-100 shadow-sm">
                    <h3 className="font-bold text-slate-900 mb-6">Recent Activity</h3>
                    <div className="space-y-4">
                        {[1, 2, 3, 4, 5].map((i) => (
                            <div key={i} className="flex items-center gap-4">
                                <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-500">
                                    <Users size={16} />
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-slate-900">New user registered</p>
                                    <p className="text-xs text-slate-500">2 minutes ago</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboardPage;
