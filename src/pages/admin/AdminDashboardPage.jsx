import { Users, BookOpen, Video, DollarSign, TrendingUp, AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../auth/useAuth';
import { api } from '../../services/api';
import { useEffect, useState } from 'react';
import { Loader2 } from 'lucide-react';
import { formatCompactNumber, formatCurrency } from '../../utils/formatters';

const StatCard = ({ title, value, change, icon: Icon, color }) => (
    <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-100 dark:border-slate-800 shadow-sm transition-colors"
    >
        <div className="flex justify-between items-start mb-4">
            <div className={`p-3 rounded-xl ${color}`}>
                <Icon size={24} className="text-white" />
            </div>
            <span className={`text-xs font-semibold px-2 py-1 rounded-full ${change >= 0 ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400' : 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400'}`}>
                {change >= 0 ? '+' : ''}{change}%
            </span>
        </div>
        <h3 className="text-slate-500 dark:text-slate-400 text-sm font-medium mb-1">{title}</h3>
        <p className="text-2xl font-bold text-slate-900 dark:text-white">{value}</p>
    </motion.div>
);

const AdminDashboardPage = () => {
    const { user } = useAuth();
    const { t, i18n } = useTranslation();
    const [stats, setStats] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            setIsLoading(true);
            try {
                const data = await api.admin.stats.getOverview();
                setStats(data);
            } catch (error) {
                console.error('Error fetching admin stats:', error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchStats();
    }, []);

    return (
        <div className="space-y-8 transition-colors duration-300">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 dark:text-white">{t('dashboard.admin.title')}</h1>
                    <p className="text-slate-500 dark:text-slate-400">{t('common.welcome')}, <Link to="/admin/profile" className="text-primary hover:underline">{user?.name}</Link></p>
                </div>
                <div className="text-sm text-slate-500 dark:text-slate-500 bg-slate-100 dark:bg-slate-800/50 px-3 py-1 rounded-full border border-slate-200 dark:border-slate-700">
                    {t('dashboard.admin.lastUpdated')}: {new Date().toLocaleDateString()}
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {isLoading ? (
                    [1, 2, 3, 4].map(i => (
                        <div key={i} className="h-40 bg-white dark:bg-slate-900 rounded-xl border border-slate-100 dark:border-slate-800 animate-pulse flex items-center justify-center">
                            <Loader2 className="w-6 h-6 text-slate-300 animate-spin" />
                        </div>
                    ))
                ) : (
                    <>
                        <StatCard title={t('dashboard.admin.stats.totalUsers')} value={formatCompactNumber(stats?.totalStudents || 0, i18n.language)} change={stats?.userGrowth || 0} icon={Users} color="bg-blue-500" />
                        <StatCard title={t('dashboard.admin.stats.activeCourses')} value={formatCompactNumber(stats?.activeCourses || 0, i18n.language)} change={stats?.courseGrowth || 0} icon={BookOpen} color="bg-indigo-500" />
                        <StatCard title={t('dashboard.admin.stats.videosUploaded')} value={formatCompactNumber(stats?.videosUploaded || 0, i18n.language)} change={stats?.videoGrowth || 0} icon={Video} color="bg-pink-500" />
                        <StatCard title={t('dashboard.admin.stats.totalRevenue')} value={formatCurrency(stats?.totalRevenue || 0, i18n.language)} change={stats?.revenueGrowth || 0} icon={DollarSign} color="bg-green-500" />
                    </>
                )}
            </div>

            {/* Charts / Placeholder */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-100 dark:border-slate-800 shadow-sm transition-colors">
                    <h3 className="font-bold text-slate-900 dark:text-white mb-6">{t('dashboard.admin.revenueOverview')}</h3>
                    <div className="h-64 flex items-end justify-between gap-2 overflow-hidden px-2">
                        {(stats?.revenueChart || [40, 60, 45, 70, 65, 85, 95]).map((h, i) => (
                            <div key={i} className="w-full bg-blue-100 dark:bg-slate-800 rounded-t-lg relative group h-full flex items-end">
                                <div
                                    className="bg-primary absolute bottom-0 w-full rounded-t-lg transition-all duration-500"
                                    style={{ height: `${h}%` }}
                                />
                                <div className="opacity-0 group-hover:opacity-100 absolute -top-8 left-1/2 -translate-x-1/2 bg-slate-900 dark:bg-slate-700 text-white text-xs py-1 px-2 rounded pointer-events-none z-10 whitespace-nowrap">
                                    ${h * 100}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 transition-colors">
                    <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-2">
                        <AlertCircle className="text-orange-500" /> {t('dashboard.admin.recentActivity')}
                    </h2>
                    <div className="space-y-4">
                        {(stats?.recentActivity || []).map((activity) => (
                            <div key={activity.id} className="flex gap-3 items-start p-3 hover:bg-slate-50 dark:hover:bg-slate-800/50 rounded-xl transition-colors">
                                <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 shrink-0">
                                    <Users size={16} />
                                </div>
                                <div className="min-w-0">
                                    <p className="text-sm font-medium text-slate-900 dark:text-white truncate">{activity.action}</p>
                                    <p className="text-xs text-slate-500 dark:text-slate-400">{activity.user} • {activity.time}</p>
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
