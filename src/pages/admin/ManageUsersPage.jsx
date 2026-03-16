import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import { useTranslation } from 'react-i18next';
import {
    Users,
    Search,
    Shield,
    UserX,
    CheckCircle,
    Edit,
    Trash2,
    Mail,
    UserPlus,
    X,
    ChevronLeft,
    ChevronRight,
    Ban
} from 'lucide-react';
import Button from '../../components/ui/Button';

const ManageUsersPage = () => {
    const { t } = useTranslation();
    const [searchTerm, setSearchTerm] = useState('');
    const [roleFilter, setRoleFilter] = useState('all');
    const [statusFilter, setStatusFilter] = useState('all');
    const [showUserModal, setShowUserModal] = useState(false);
    const [editingUser, setEditingUser] = useState(null);

    // Initial users state
    const [users, setUsers] = useState([
        { id: 1, name: "Ahmed Mansour", email: "ahmed@example.com", role: "instructor", status: "active", joined: "2023-10-12", avatar: "https://ui-avatars.com/api/?name=Ahmed+Mansour&background=random" },
        { id: 2, name: "Mona Gamal", email: "mona@example.com", role: "learner", status: "active", joined: "2023-11-05", avatar: "https://ui-avatars.com/api/?name=Mona+Gamal&background=random" },
        { id: 3, name: "Youssef Khaled", email: "youssef@example.com", role: "learner", status: "suspended", joined: "2024-01-20", avatar: "https://ui-avatars.com/api/?name=Youssef+Khaled&background=random" },
        { id: 4, name: "Dr. Laila Hassan", email: "laila@example.com", role: "instructor", status: "active", joined: "2023-09-15", avatar: "https://ui-avatars.com/api/?name=Laila+Hassan&background=random" },
        { id: 5, name: "Nour Eddeen", email: "nour@example.com", role: "learner", status: "active", joined: "2024-02-10", avatar: "https://ui-avatars.com/api/?name=Nour+Eddeen&background=random" },
    ]);

    // Filtering Logic
    const filteredUsers = useMemo(() => {
        return users.filter(user => {
            const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                user.email.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesRole = roleFilter === 'all' || user.role === roleFilter;
            const matchesStatus = statusFilter === 'all' || user.status === statusFilter;
            return matchesSearch && matchesRole && matchesStatus;
        });
    }, [users, searchTerm, roleFilter, statusFilter]);

    // User Actions
    const handleAddUser = (userData) => {
        const newUser = {
            ...userData,
            id: users.length + 1,
            avatar: `https://ui-avatars.com/api/?name=${userData.name.replace(' ', '+')}&background=random`,
            joined: new Date().toISOString().split('T')[0],
            status: 'active'
        };
        setUsers([newUser, ...users]);
        setShowUserModal(false);
        toast.success(t('dashboard.admin.manageUsers.toasts.addSuccess'));
    };

    const handleUpdateUser = (userData) => {
        setUsers(users.map(u => u.id === userData.id ? { ...u, ...userData } : u));
        setEditingUser(null);
        setShowUserModal(false);
        toast.success(t('dashboard.admin.manageUsers.toasts.updateSuccess'));
    };

    const handleDeleteUser = (id) => {
        setUsers(users.filter(u => u.id !== id));
        // setShowActionMenu(null); // This was not defined in the original file but present in handleDeleteUser
        toast.success(t('dashboard.admin.manageUsers.toasts.deleteSuccess'));
    };

    const toggleStatus = (id) => {
        const userToToggle = users.find(u => u.id === id);
        if (!userToToggle) return;

        const newStatus = userToToggle.status === 'active' ? 'suspended' : 'active';
        toast.success(newStatus === 'active' 
            ? t('dashboard.admin.manageUsers.toasts.activatedSuccess') 
            : t('dashboard.admin.manageUsers.toasts.suspendedSuccess')
        );

        setUsers(prev => prev.map(u => u.id === id ? { ...u, status: newStatus } : u));
        // setShowActionMenu(null); // Also not defined in original state but present here
    };

    const stats = [
        { label: t('dashboard.admin.manageUsers.stats.totalUsers'), value: users.length, icon: Users, color: 'text-blue-600', bg: 'bg-blue-100 dark:bg-blue-900/30' },
        { label: t('dashboard.admin.manageUsers.stats.totalInstructors'), value: users.filter(u => u.role === 'instructor').length, icon: Shield, color: 'text-purple-600', bg: 'bg-purple-100 dark:bg-purple-900/30' },
        { label: t('dashboard.admin.manageUsers.stats.suspendedUsers'), value: users.filter(u => u.status === 'suspended').length, icon: UserX, color: 'text-red-600', bg: 'bg-red-100 dark:bg-red-900/30' },
    ];

    return (
        <div className="space-y-8 text-left">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div className="text-left">
                    <h1 className="text-2xl font-bold text-slate-900 dark:text-white">{t('dashboard.admin.manageUsers.title')}</h1>
                    <p className="text-slate-500 dark:text-slate-400">{t('dashboard.admin.manageUsers.subtitle')}</p>
                </div>
                <Button onClick={() => setShowUserModal(true)}>
                    <UserPlus size={18} className={`${t('dir') === 'rtl' ? 'ml-2' : 'mr-2'}`} /> {t('dashboard.admin.manageUsers.addNew')}
                </Button>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                {stats.map((stat, i) => (
                    <div key={i} className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-100 dark:border-slate-800 flex items-center gap-4 shadow-sm">
                        <div className={`w-12 h-12 rounded-full flex items-center justify-center ${stat.bg} ${stat.color}`}>
                            <stat.icon size={24} />
                        </div>
                        <div>
                            <p className="text-sm font-medium text-slate-500 dark:text-slate-400">{stat.label}</p>
                            <h3 className="text-2xl font-bold text-slate-900 dark:text-white">{stat.value}</h3>
                        </div>
                    </div>
                ))}
            </div>

            {/* Filters & Search */}
            <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-100 dark:border-slate-800 shadow-sm flex flex-col md:flex-row gap-4">
                <div className="relative flex-1">
                    <Search className={`absolute ${t('dir') === 'rtl' ? 'right-3' : 'left-3'} top-1/2 -translate-y-1/2 text-slate-400`} size={18} />
                    <input
                        type="text"
                        placeholder={t('dashboard.admin.manageUsers.searchPlaceholder')}
                        className={`w-full ${t('dir') === 'rtl' ? 'pr-10 pl-4 text-right' : 'pl-10 pr-4 text-left'} py-2 bg-slate-50 dark:bg-slate-800 border-none rounded-lg text-slate-900 dark:text-white focus:ring-2 focus:ring-primary transition-all outline-none`}
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <div className="flex gap-4">
                    <select
                        className={`bg-slate-50 dark:bg-slate-800 border-none rounded-lg px-4 py-2 text-sm text-slate-700 dark:text-slate-200 outline-none cursor-pointer ${t('dir') === 'rtl' ? 'text-right' : 'text-left'}`}
                        value={roleFilter}
                        onChange={(e) => setRoleFilter(e.target.value)}
                    >
                        <option value="all">{t('dashboard.admin.manageUsers.allRoles')}</option>
                        <option value="learner">{t('dashboard.admin.manageUsers.learners')}</option>
                        <option value="instructor">{t('dashboard.admin.manageUsers.instructors')}</option>
                        <option value="admin">{t('dashboard.admin.manageUsers.admins')}</option>
                    </select>
                    <select
                        className={`bg-slate-50 dark:bg-slate-800 border-none rounded-lg px-4 py-2 text-sm text-slate-700 dark:text-slate-200 outline-none cursor-pointer ${t('dir') === 'rtl' ? 'text-right' : 'text-left'}`}
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                    >
                        <option value="all">{t('dashboard.admin.manageUsers.allStatus')}</option>
                        <option value="active">{t('dashboard.admin.manageUsers.active')}</option>
                        <option value="suspended">{t('dashboard.admin.manageUsers.suspended')}</option>
                    </select>
                </div>
            </div>

            {/* Users Table */}
            <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-100 dark:border-slate-800 shadow-sm min-h-[400px]">
                <div className="overflow-x-auto">
                    <table className="w-full text-left rtl:text-right">
                        <thead>
                            <tr className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-100 dark:border-slate-800">
                                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">{t('dashboard.admin.manageUsers.table.user')}</th>
                                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">{t('dashboard.admin.manageUsers.table.role')}</th>
                                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">{t('dashboard.admin.manageUsers.table.joined')}</th>
                                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">{t('dashboard.admin.manageUsers.table.status')}</th>
                                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right rtl:text-left">{t('dashboard.admin.manageUsers.table.actions')}</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                            {filteredUsers.length > 0 ? filteredUsers.map((user) => (
                                <tr key={user.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/20 transition-colors">
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center gap-3">
                                            <img src={user.avatar} alt={user.name} className="w-10 h-10 rounded-full border border-slate-200 dark:border-slate-700" />
                                            <div>
                                                <p className="text-sm font-bold text-slate-900 dark:text-white">{user.name}</p>
                                                <p className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1">
                                                    <Mail size={12} /> {user.email}
                                                </p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider ${user.role === 'instructor'
                                            ? 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400'
                                            : user.role === 'admin'
                                            ? 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400'
                                            : 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400'
                                            }`}>
                                            {t(`dashboard.admin.manageUsers.${user.role === 'learner' ? 'learners' : user.role + 's'}`).replace(/s$/, '')}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500 dark:text-slate-400">
                                        {user.joined}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center gap-2">
                                            {user.status === 'active' ? (
                                                <span className="flex items-center gap-1 text-xs font-medium text-green-600">
                                                    <CheckCircle size={14} /> {t('dashboard.admin.manageUsers.active')}
                                                </span>
                                            ) : (
                                                <span className="flex items-center gap-1 text-xs font-medium text-red-500">
                                                    <UserX size={14} /> {t('dashboard.admin.manageUsers.suspended')}
                                                </span>
                                            )}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right rtl:text-left">
                                        <div className="flex items-center justify-end gap-1">
                                            {/* Edit */}
                                            <button
                                                onClick={() => { setEditingUser(user); setShowUserModal(true); }}
                                                title={t('dashboard.admin.manageUsers.editUser')}
                                                className="p-2 rounded-lg text-slate-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors"
                                            >
                                                <Edit size={16} />
                                            </button>
                                            {/* Suspend / Activate */}
                                            <button
                                                onClick={() => toggleStatus(user.id)}
                                                title={user.status === 'active' ? t('dashboard.admin.manageUsers.suspended') : t('dashboard.admin.manageUsers.active')}
                                                className={`p-2 rounded-lg transition-colors ${user.status === 'active'
                                                    ? 'text-slate-400 hover:text-amber-600 hover:bg-amber-50 dark:hover:bg-amber-900/20'
                                                    : 'text-slate-400 hover:text-green-600 hover:bg-green-50 dark:hover:bg-green-900/20'
                                                    }`}
                                            >
                                                {user.status === 'active' ? <Ban size={16} /> : <CheckCircle size={16} />}
                                            </button>
                                            {/* Delete */}
                                            <button
                                                onClick={() => { handleDeleteUser(user.id)} }
                                                title={t('dashboard.admin.manageUsers.deleteUser')}
                                                className="p-2 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            )) : (
                                <tr>
                                    <td colSpan="5" className="px-6 py-20 text-center">
                                        <div className="flex flex-col items-center gap-3">
                                            <div className="w-16 h-16 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400">
                                                <Search size={32} />
                                            </div>
                                            <p className="text-slate-500 dark:text-slate-400 font-medium">{t('dashboard.admin.manageUsers.noFound')}</p>
                                            <Button variant="outline" onClick={() => { setSearchTerm(''); setRoleFilter('all'); setStatusFilter('all'); }}>
                                                {t('dashboard.admin.manageUsers.clearFilters')}
                                            </Button>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                <div className="px-6 py-4 bg-slate-50 dark:bg-slate-800/30 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                    <p className="text-sm text-slate-500">{t('dashboard.admin.manageUsers.showing', { count: filteredUsers.length, total: users.length })}</p>
                    <div className="flex gap-2">
                        <button className="p-2 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-400 cursor-not-allowed">
                            <ChevronLeft size={18} />
                        </button>
                        <button className="p-2 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
                            <ChevronRight size={18} />
                        </button>
                    </div>
                </div>
            </div>

            {/* User Modal (Add/Edit) */}
            <AnimatePresence>
                {showUserModal && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center px-4 py-8 overflow-y-auto">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm"
                            onClick={() => { setShowUserModal(false); setEditingUser(null); }}
                        />
                             <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 20 }}
                            className="relative w-full max-w-lg bg-white dark:bg-slate-900 rounded-2xl shadow-2xl overflow-hidden text-left"
                        >
                            <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
                                <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                                    {editingUser ? t('dashboard.admin.manageUsers.editTitle') : t('dashboard.admin.manageUsers.addTitle')}
                                </h2>
                                <button
                                    onClick={() => { setShowUserModal(false); setEditingUser(null); }}
                                    className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors"
                                >
                                    <X size={20} className="text-slate-500" />
                                </button>
                            </div>

                            <form onSubmit={(e) => {
                                e.preventDefault();
                                const formData = new FormData(e.target);
                                const userData = Object.fromEntries(formData);
                                if (editingUser) {
                                    handleUpdateUser({ ...editingUser, ...userData });
                                } else {
                                    handleAddUser(userData);
                                }
                            }} className={`p-6 space-y-4 ${t('dir') === 'rtl' ? 'text-right' : 'text-left'}`}>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">{t('dashboard.admin.manageUsers.form.fullName')}</label>
                                    <input
                                        name="name"
                                        type="text"
                                        required
                                        defaultValue={editingUser?.name || ''}
                                        className={`w-full px-4 py-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary outline-none ${t('dir') === 'rtl' ? 'text-right' : 'text-left'}`}
                                        placeholder={t('dashboard.admin.manageUsers.form.placeholderName')}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">{t('dashboard.admin.manageUsers.form.email')}</label>
                                    <input
                                        name="email"
                                        type="email"
                                        required
                                        defaultValue={editingUser?.email || ''}
                                        className={`w-full px-4 py-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary outline-none ${t('dir') === 'rtl' ? 'text-right' : 'text-left'}`}
                                        placeholder={t('dashboard.admin.manageUsers.form.placeholderEmail')}
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">{t('dashboard.admin.manageUsers.form.role')}</label>
                                        <select
                                            name="role"
                                            defaultValue={editingUser?.role || 'learner'}
                                            className={`w-full px-4 py-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary outline-none ${t('dir') === 'rtl' ? 'text-right' : 'text-left'}`}
                                        >
                                            <option value="learner">{t('dashboard.admin.manageUsers.learners').replace(/s$/, '')}</option>
                                            <option value="instructor">{t('dashboard.admin.manageUsers.instructors').replace(/s$/, '')}</option>
                                            <option value="admin">{t('dashboard.admin.manageUsers.admins').replace(/s$/, '')}</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">{t('dashboard.admin.manageUsers.form.status')}</label>
                                        <select
                                            name="status"
                                            defaultValue={editingUser?.status || 'active'}
                                            className={`w-full px-4 py-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary outline-none ${t('dir') === 'rtl' ? 'text-right' : 'text-left'}`}
                                        >
                                            <option value="active">{t('dashboard.admin.manageUsers.active')}</option>
                                            <option value="suspended">{t('dashboard.admin.manageUsers.suspended')}</option>
                                        </select>
                                    </div>
                                </div>

                                <div className="pt-6 flex gap-3">
                                    <Button variant="outline" className="flex-1" type="button" onClick={() => { setShowUserModal(false); setEditingUser(null); }}>
                                        {t('common.cancel')}
                                    </Button>
                                    <Button className="flex-1" type="submit">
                                        {editingUser ? t('common.save') : t('dashboard.admin.manageUsers.form.createAccount')}
                                    </Button>
                                </div>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default ManageUsersPage;
