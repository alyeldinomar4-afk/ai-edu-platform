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
    Ban,
    Lock,
    RotateCcw,
    Award,
    FileText,
    Briefcase,
    Phone,
    GraduationCap,
    Globe,
    Clock,
    Hash
} from 'lucide-react';
import Button from '../../components/ui/Button';

const ManageUsersPage = () => {
    const { t } = useTranslation();
    const [searchTerm, setSearchTerm] = useState('');
    const [roleFilter, setRoleFilter] = useState('all');
    const [statusFilter, setStatusFilter] = useState('all');
    const [showUserModal, setShowUserModal] = useState(false);
    const [editingUser, setEditingUser] = useState(null);
    const [selectedRole, setSelectedRole] = useState('learner');
    const [generatedPass, setGeneratedPass] = useState('');

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

    const generatePassword = () => {
        const chars = "1234567890";
        let password = "";
        for (let i = 0; i < 6; i++) {
            password += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        setGeneratedPass(password);
        toast.success(t('common.justNow')); // Generic feedback for generation
    };

    const stats = [
        { label: t('dashboard.admin.manageUsers.stats.totalUsers'), value: users.length, icon: Users, color: 'text-blue-600', bg: 'bg-blue-100 dark:bg-blue-900/30' },
        { label: t('dashboard.admin.manageUsers.stats.totalInstructors'), value: users.filter(u => u.role === 'instructor').length, icon: Shield, color: 'text-purple-600', bg: 'bg-purple-100 dark:bg-purple-900/30' },
        { label: t('dashboard.admin.manageUsers.stats.totalAdmins'), value: users.filter(u => u.role === 'admin').length, icon: Shield, color: 'text-amber-600', bg: 'bg-amber-100 dark:bg-amber-900/30' },
        { label: t('dashboard.admin.manageUsers.stats.suspendedUsers'), value: users.filter(u => u.status === 'suspended').length, icon: UserX, color: 'text-red-600', bg: 'bg-red-100 dark:bg-red-900/30' },
    ];

    return (
        <div className="space-y-8 text-left">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div className="text-left">
                    <h1 className="text-2xl font-bold text-slate-900 dark:text-white">{t('dashboard.admin.manageUsers.title')}</h1>
                    <p className="text-slate-500 dark:text-slate-400">{t('dashboard.admin.manageUsers.subtitle')}</p>
                </div>
                <button 
                    onClick={() => {
                        setEditingUser(null);
                        setSelectedRole('learner');
                        setGeneratedPass('');
                        setShowUserModal(true);
                    }}
                    className="relative group flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl font-medium tracking-wide text-white bg-primary hover:bg-primary/90 shadow-lg shadow-primary/30 hover:shadow-primary/50 overflow-hidden transition-all duration-300 active:scale-[0.98] cursor-pointer"
                >
                    <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700 delay-[50ms]" />
                    <UserPlus size={18} className={`relative z-10 shrink-0 ${t('dir') === 'rtl' ? 'ml-2' : 'mr-2'}`} /> 
                    <span className="relative z-10">{t('dashboard.admin.manageUsers.addNew')}</span>
                </button>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
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
                                                onClick={() => { 
                                                    setEditingUser(user); 
                                                    setSelectedRole(user.role);
                                                    setGeneratedPass('');
                                                    setShowUserModal(true); 
                                                }}
                                                title={t('dashboard.admin.manageUsers.editUser')}
                                                className="group flex items-center justify-center h-8 px-2 rounded-full overflow-hidden text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 transition-all duration-300 hover:shadow-sm focus:outline-none cursor-pointer"
                                            >
                                                <Edit size={16} className="shrink-0" />
                                                <span className="max-w-0 w-0 overflow-hidden opacity-0 group-hover:max-w-[100px] group-hover:w-auto group-hover:opacity-100 group-hover:ml-1.5 rtl:group-hover:mr-1.5 rtl:group-hover:ml-0 whitespace-nowrap text-xs font-semibold transition-all duration-300 ease-in-out">{t('common.edit')}</span>
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

            <AnimatePresence>
                {showUserModal && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 overflow-x-hidden overflow-y-auto">
                        {/* Backdrop */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 bg-slate-900/60 backdrop-blur-md"
                            onClick={() => { setShowUserModal(false); setEditingUser(null); }}
                        />
                        
                        {/* Centered Modal Content */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                            className="relative w-full max-w-4xl bg-white dark:bg-slate-900 rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.3)] flex flex-col overflow-hidden border border-white/20 dark:border-slate-800"
                        >
                            {/* Modal Header */}
                            <div className="px-8 py-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-800/50">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary shadow-inner">
                                        <UserPlus size={24} />
                                    </div>
                                    <div>
                                        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
                                            {editingUser ? t('dashboard.admin.manageUsers.editTitle') : t('dashboard.admin.manageUsers.addTitle')}
                                        </h2>
                                        <p className="text-sm text-slate-500 dark:text-slate-400">
                                            {editingUser ? t('dashboard.admin.manageUsers.editUser') : t('dashboard.admin.manageUsers.addNew')}
                                        </p>
                                    </div>
                                </div>
                                <button
                                    onClick={() => { setShowUserModal(false); setEditingUser(null); }}
                                    className="p-2.5 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-all text-slate-400 hover:text-red-500"
                                >
                                    <X size={24} />
                                </button>
                            </div>

                            {/* Modal Body */}
                            <form 
                                id="userForm"
                                onSubmit={(e) => {
                                    e.preventDefault();
                                    const formData = new FormData(e.target);
                                    const userData = Object.fromEntries(formData);
                                    if (editingUser) {
                                        handleUpdateUser({ ...editingUser, ...userData });
                                    } else {
                                        handleAddUser(userData);
                                    }
                                }} 
                                className="p-8 space-y-10 max-h-[70vh] overflow-y-auto custom-scrollbar"
                            >
                                {/* Section 1: Basic Info */}
                                <div className="space-y-6">
                                    <div className="flex items-center gap-3 text-primary border-b border-primary/10 pb-2">
                                        <Users size={18} />
                                        <h4 className="text-xs font-bold uppercase tracking-widest">{t('dashboard.admin.manageUsers.table.user')} Information</h4>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-1.5">
                                            <label className="text-xs font-bold text-slate-500 dark:text-slate-400 tracking-tight ml-1">{t('dashboard.admin.manageUsers.form.fullName')}</label>
                                            <input
                                                name="name"
                                                type="text"
                                                required
                                                defaultValue={editingUser?.name || ''}
                                                className="w-full px-5 py-3 border border-slate-200 dark:border-slate-700/80 rounded-2xl bg-slate-50/50 dark:bg-slate-900/50 text-slate-900 dark:text-white focus:ring-4 focus:ring-primary/10 focus:border-primary outline-none transition-all placeholder:text-slate-400 font-medium"
                                                placeholder={t('dashboard.admin.manageUsers.form.placeholderName')}
                                            />
                                        </div>
                                        <div className="space-y-1.5">
                                            <label className="text-xs font-bold text-slate-500 dark:text-slate-400 tracking-tight ml-1">{t('dashboard.admin.manageUsers.form.email')}</label>
                                            <div className="relative">
                                                <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                                                <input
                                                    name="email"
                                                    type="email"
                                                    required
                                                    defaultValue={editingUser?.email || ''}
                                                    className="w-full pl-12 pr-5 py-3 border border-slate-200 dark:border-slate-700/80 rounded-2xl bg-slate-50/50 dark:bg-slate-900/50 text-slate-900 dark:text-white focus:ring-4 focus:ring-primary/10 focus:border-primary outline-none transition-all placeholder:text-slate-400 font-medium"
                                                    placeholder={t('dashboard.admin.manageUsers.form.placeholderEmail')}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Section 2: Config */}
                                <div className="space-y-6">
                                    <div className="flex items-center gap-3 text-amber-500 border-b border-amber-500/10 pb-2">
                                        <Shield size={18} />
                                        <h4 className="text-xs font-bold uppercase tracking-widest">Role & Status Configuration</h4>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-1.5">
                                            <label className="text-xs font-bold text-slate-500 dark:text-slate-400 tracking-tight ml-1">{t('dashboard.admin.manageUsers.form.role')}</label>
                                            <select
                                                name="role"
                                                value={selectedRole}
                                                onChange={(e) => setSelectedRole(e.target.value)}
                                                className="w-full px-5 py-3 border border-slate-200 dark:border-slate-700/80 rounded-2xl bg-slate-50/50 dark:bg-slate-900/50 text-slate-900 dark:text-white focus:ring-4 focus:ring-primary/10 focus:border-primary outline-none transition-all cursor-pointer font-medium appearance-none"
                                            >
                                                <option value="learner">{t('dashboard.admin.manageUsers.learners').replace(/s$/, '')}</option>
                                                <option value="instructor">{t('dashboard.admin.manageUsers.instructors').replace(/s$/, '')}</option>
                                                <option value="admin">{t('dashboard.admin.manageUsers.admins').replace(/s$/, '')}</option>
                                            </select>
                                        </div>
                                        <div className="space-y-1.5">
                                            <label className="text-xs font-bold text-slate-500 dark:text-slate-400 tracking-tight ml-1">{t('dashboard.admin.manageUsers.form.status')}</label>
                                            <select
                                                name="status"
                                                defaultValue={editingUser?.status || 'active'}
                                                className="w-full px-5 py-3 border border-slate-200 dark:border-slate-700/80 rounded-2xl bg-slate-50/50 dark:bg-slate-900/50 text-slate-900 dark:text-white focus:ring-4 focus:ring-primary/10 focus:border-primary outline-none transition-all cursor-pointer font-medium appearance-none"
                                            >
                                                <option value="active">{t('dashboard.admin.manageUsers.active')}</option>
                                                <option value="suspended">{t('dashboard.admin.manageUsers.suspended')}</option>
                                            </select>
                                        </div>
                                    </div>
                                </div>

                                {/* Section 3: Dynamic Data */}
                                <AnimatePresence mode="wait">
                                    {selectedRole === 'instructor' && (
                                        <motion.div
                                            key="instructor-fields"
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: -10 }}
                                            className="space-y-6"
                                        >
                                            <div className="flex items-center gap-3 text-purple-500 border-b border-purple-500/10 pb-2">
                                                <Briefcase size={18} />
                                                <h4 className="text-xs font-bold uppercase tracking-widest">Professional Instructor details</h4>
                                            </div>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                <div className="space-y-1.5">
                                                    <label className="text-xs font-bold text-slate-500 dark:text-slate-400 tracking-tight ml-1">Department</label>
                                                    <div className="relative">
                                                        <Award size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                                                        <input name="department" type="text" className="w-full pl-12 pr-5 py-3 border border-slate-200 dark:border-slate-700 rounded-2xl bg-slate-50/50 dark:bg-slate-900/50 text-slate-900 dark:text-white focus:ring-4 focus:ring-primary/10 outline-none transition-all font-medium" placeholder="e.g. Computer Science"/>
                                                    </div>
                                                </div>
                                                <div className="space-y-1.5">
                                                    <label className="text-xs font-bold text-slate-500 dark:text-slate-400 tracking-tight ml-1">Experience</label>
                                                    <div className="relative">
                                                        <Clock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                                                        <input name="experience" type="text" className="w-full pl-12 pr-5 py-3 border border-slate-200 dark:border-slate-700 rounded-2xl bg-slate-50/50 dark:bg-slate-900/50 text-slate-900 dark:text-white focus:ring-4 focus:ring-primary/10 outline-none transition-all font-medium" placeholder="e.g. 5+ Years"/>
                                                    </div>
                                                </div>
                                                <div className="space-y-1.5">
                                                    <label className="text-xs font-bold text-slate-500 dark:text-slate-400 tracking-tight ml-1">Specialization</label>
                                                    <div className="relative">
                                                        <GraduationCap size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                                                        <input name="specialization" type="text" className="w-full pl-12 pr-5 py-3 border border-slate-200 dark:border-slate-700 rounded-2xl bg-slate-50/50 dark:bg-slate-900/50 text-slate-900 dark:text-white focus:ring-4 focus:ring-primary/10 outline-none transition-all font-medium" placeholder="e.g. AI Specialist"/>
                                                    </div>
                                                </div>
                                                <div className="space-y-1.5">
                                                    <label className="text-xs font-bold text-slate-500 dark:text-slate-400 tracking-tight ml-1">Social Profile</label>
                                                    <div className="relative">
                                                        <Globe size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                                                        <input name="linkedin" type="url" className="w-full pl-12 pr-5 py-3 border border-slate-200 dark:border-slate-700 rounded-2xl bg-slate-50/50 dark:bg-slate-900/50 text-slate-900 dark:text-white focus:ring-4 focus:ring-primary/10 outline-none transition-all font-medium" placeholder="linkedin.com/in/..."/>
                                                    </div>
                                                </div>
                                                <div className="md:col-span-2 space-y-1.5">
                                                    <label className="text-xs font-bold text-slate-500 dark:text-slate-400 tracking-tight ml-1">Professional Bio</label>
                                                    <textarea name="bio" rows="3" className="w-full px-5 py-3 border border-slate-200 dark:border-slate-700 rounded-2xl bg-slate-50/50 dark:bg-slate-900/50 text-slate-900 dark:text-white focus:ring-4 focus:ring-primary/10 outline-none transition-all font-medium resize-none" placeholder="Brief background..."></textarea>
                                                </div>
                                            </div>
                                        </motion.div>
                                    )}

                                    {selectedRole === 'learner' && (
                                        <motion.div
                                            key="student-fields"
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: -10 }}
                                            className="space-y-6"
                                        >
                                            <div className="flex items-center gap-3 text-blue-500 border-b border-blue-500/10 pb-2">
                                                <GraduationCap size={18} />
                                                <h4 className="text-xs font-bold uppercase tracking-widest">Academic details</h4>
                                            </div>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                <div className="space-y-1.5">
                                                    <label className="text-xs font-bold text-slate-500 dark:text-slate-400 tracking-tight ml-1">Educational Grade</label>
                                                    <select name="grade" className="w-full px-5 py-3 border border-slate-200 dark:border-slate-700 rounded-2xl bg-slate-50/50 dark:bg-slate-900/50 text-slate-900 dark:text-white focus:ring-4 focus:ring-primary/10 outline-none transition-all font-medium appearance-none">
                                                        <option value="">Select Grade</option>
                                                        <option value="y1">Academic Year 1</option>
                                                        <option value="y2">Academic Year 2</option>
                                                        <option value="y3">Academic Year 3</option>
                                                        <option value="y4">Academic Year 4</option>
                                                        <option value="grad">Graduate</option>
                                                    </select>
                                                </div>
                                                <div className="space-y-1.5">
                                                    <label className="text-xs font-bold text-slate-500 dark:text-slate-400 tracking-tight ml-1">Major/Focus</label>
                                                    <div className="relative">
                                                        <Hash size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                                                        <input name="major" type="text" className="w-full pl-12 pr-5 py-3 border border-slate-200 dark:border-slate-700 rounded-2xl bg-slate-50/50 dark:bg-slate-900/50 text-slate-900 dark:text-white focus:ring-4 focus:ring-primary/10 outline-none transition-all font-medium" placeholder="e.g. Software Engineering"/>
                                                    </div>
                                                </div>
                                                <div className="md:col-span-2 space-y-1.5">
                                                    <label className="text-xs font-bold text-slate-500 dark:text-slate-400 tracking-tight ml-1">Phone Number</label>
                                                    <div className="relative">
                                                        <Phone size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                                                        <input name="phone" type="tel" className="w-full pl-12 pr-5 py-3 border border-slate-200 dark:border-slate-700 rounded-2xl bg-slate-50/50 dark:bg-slate-900/50 text-slate-900 dark:text-white focus:ring-4 focus:ring-primary/10 outline-none transition-all font-medium" placeholder="+20 ..."/>
                                                    </div>
                                                </div>
                                            </div>
                                        </motion.div>
                                    )}

                                    {selectedRole === 'admin' && (
                                        <motion.div
                                            key="security-fields"
                                            initial={{ opacity: 0, scale: 0.95 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            exit={{ opacity: 0, scale: 0.95 }}
                                            className="space-y-6"
                                        >
                                            <div className="flex items-center gap-3 text-red-500 border-b border-red-500/10 pb-2">
                                                <Lock size={18} />
                                                <h4 className="text-xs font-bold uppercase tracking-widest">Security credentials</h4>
                                            </div>
                                            <div className="p-6 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/50 rounded-[2rem] space-y-4">
                                                <div className="flex items-center justify-between">
                                                    <label className="text-xs font-bold text-slate-500 uppercase tracking-tighter">New Admin Password</label>
                                                    <button type="button" onClick={generatePassword} className="flex items-center gap-2 px-3 py-1 bg-primary text-white text-[10px] font-bold rounded-full hover:bg-primary-dark transition-all transform hover:scale-105 active:scale-95 shadow-md shadow-primary/20 cursor-pointer">
                                                        <RotateCcw size={12} /> Re-Generate
                                                    </button>
                                                </div>
                                                <input name="password" type="text" value={generatedPass} onChange={(e) => setGeneratedPass(e.target.value)} className="w-full px-5 py-3 border-2 border-dashed border-primary/20 dark:border-slate-700 rounded-2xl bg-white dark:bg-slate-900 text-slate-900 dark:text-white font-mono text-center text-lg tracking-[0.5em] focus:border-primary focus:ring-0 outline-none transition-all placeholder:tracking-normal placeholder:font-sans" placeholder="······"/>
                                                <p className="text-[10px] text-center text-slate-400 italic">Admin accounts require a strong, generated password by default.</p>
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </form>

                            {/* Modal Footer */}
                            <div className="p-8 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/50 flex gap-4">
                                <Button 
                                    variant="outline" 
                                    className="flex-1 rounded-2xl h-14 text-lg font-bold border-2" 
                                    type="button" 
                                    onClick={() => { setShowUserModal(false); setEditingUser(null); }}
                                >
                                    {t('common.cancel')}
                                </Button>
                                <Button 
                                    form="userForm"
                                    type="submit"
                                    className="flex-1 rounded-2xl h-14 shadow-xl shadow-primary/30 text-lg font-black tracking-wide"
                                >
                                    {editingUser ? t('common.save') : t('dashboard.admin.manageUsers.form.createAccount')}
                                </Button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default ManageUsersPage;
