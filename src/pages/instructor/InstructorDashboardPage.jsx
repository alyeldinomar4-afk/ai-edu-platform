import { useState, useEffect } from 'react';
import { useAuth } from '../../auth/useAuth';
import { Plus, Users, BarChart3, DollarSign, Video, X, Edit2, Trash2, User } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import toast from 'react-hot-toast';
import Button from '../../components/ui/Button';
import InstructorNav from '../../components/layout/InstructorNav';
import { api } from '../../services/api';

const InstructorDashboardPage = () => {
    const { user } = useAuth();
    const { t } = useTranslation();
    const [stats, setStats] = useState(null);
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [editingCourse, setEditingCourse] = useState(null);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(null);
    const [formData, setFormData] = useState({ title: '', students: '', status: 'Draft', revenue: '$0' });

    useEffect(() => {
        const loadData = async () => {
            try {
                const [statsData, coursesData] = await Promise.all([
                    api.instructor.getStats(),
                    api.instructor.getCourses()
                ]);
                setStats(statsData);
                setCourses(coursesData);
            } catch (err) {
                console.error('Failed to load instructor data:', err);
            } finally {
                setLoading(false);
            }
        };
        loadData();
    }, []);

    const openAddModal = () => {
        setEditingCourse(null);
        setFormData({ title: '', students: '', status: 'Draft', revenue: '$0' });
        setShowModal(true);
    };

    const openEditModal = (course) => {
        setEditingCourse(course);
        setFormData({ title: course.title, students: String(course.students), status: course.status, revenue: course.revenue });
        setShowModal(true);
    };

    const handleSave = async (e) => {
        e?.preventDefault();
        if (!formData.title.trim()) {
            toast.error(t('instructor.modals.errorTitle', { defaultValue: 'Course title is required' }));
            return;
        }

        setIsSaving(true);

        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 800));

        if (editingCourse) {
            setCourses(prev => prev.map(c =>
                c.id === editingCourse.id ? { ...c, ...formData, students: parseInt(formData.students) || 0 } : c
            ));
            toast.success(t('instructor.modals.successUpdate', { defaultValue: 'Course updated successfully' }));
        } else {
            setCourses(prev => [...prev, {
                id: Date.now(),
                ...formData,
                students: parseInt(formData.students) || 0
            }]);
            toast.success(t('instructor.modals.successCreate', { defaultValue: 'Course created successfully' }));
        }

        setIsSaving(false);
        setShowModal(false);
    };

    const handleDelete = (id) => {
        setCourses(prev => prev.filter(c => c.id !== id));
        setShowDeleteConfirm(null);
        toast.success(t('common.deleted', { defaultValue: 'Course deleted' }));
    };

    const statCards = stats ? [
        { label: t('dashboard.instructor.stats.totalStudents'), value: stats.totalStudents.toLocaleString(), change: '↑ 12%', icon: Users, color: 'text-blue-500' },
        { label: t('dashboard.instructor.stats.totalRevenue'), value: stats.totalRevenue, change: '↑ 8%', icon: DollarSign, color: 'text-green-500' },
        { label: t('dashboard.instructor.stats.courseRating'), value: stats.avgRating, sub: t('dashboard.instructor.stats.avgFrom', { count: stats.totalReviews }), icon: BarChart3, color: 'text-yellow-500' },
        { label: t('dashboard.instructor.stats.activeCourses'), value: stats.activeCourses, sub: t('dashboard.instructor.stats.pendingReview', { count: stats.pendingReview }), icon: Video, color: 'text-purple-500' },
    ] : [];

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 transition-colors duration-300">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
                <div>
                    <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">{t('dashboard.instructor.title')}</h1>
                    <p className="text-slate-500 dark:text-slate-400 mt-2">{t('dashboard.instructor.subtitle')}</p>
                </div>
                <div className="flex gap-3 w-full sm:w-auto">
                    <Link to="/instructor/profile" className="flex-1 sm:flex-none">
                        <Button variant="outline" className="w-full">
                            <User className="w-5 h-5 mr-2" /> {t('dashboard.learner.profile')}
                        </Button>
                    </Link>
                    <Button onClick={openAddModal} className="flex-1 sm:flex-none">
                        <Plus className="w-5 h-5 mr-2" /> {t('dashboard.instructor.newCourse')}
                    </Button>
                </div>
            </div>

            <InstructorNav />

            {/* Analytics Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-10">
                {statCards.map((card, i) => (
                    <motion.div
                        key={card.label}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1 }}
                        className="bg-white dark:bg-slate-900 p-5 sm:p-6 rounded-xl shadow-sm border border-slate-100 dark:border-slate-800 transition-colors"
                    >
                        <div className="flex items-center justify-between mb-4">
                            <span className="text-slate-500 dark:text-slate-400 text-sm">{card.label}</span>
                            <card.icon className={`w-5 h-5 ${card.color}`} />
                        </div>
                        <h3 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">{card.value}</h3>
                        {card.change && <p className="text-green-500 dark:text-green-400 text-xs mt-2 font-medium">{card.change} {t('dashboard.instructor.stats.vsLastMonth')}</p>}
                        {card.sub && <p className="text-slate-400 dark:text-slate-500 text-xs mt-2">{card.sub}</p>}
                    </motion.div>
                ))}
            </div>

            {/* Courses Table */}
            <section className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 overflow-hidden transition-colors">
                <div className="p-4 sm:p-6 border-b border-slate-100 dark:border-slate-800">
                    <h2 className="text-lg font-bold text-slate-900 dark:text-white">{t('dashboard.instructor.yourCourses')}</h2>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-slate-50 dark:bg-slate-800/50 text-slate-500 dark:text-slate-400 font-medium border-b border-slate-100 dark:border-slate-800">
                            <tr>
                                <th className="px-4 sm:px-6 py-4">{t('dashboard.instructor.courseName')}</th>
                                <th className="px-4 sm:px-6 py-4">{t('dashboard.instructor.students')}</th>
                                <th className="px-4 sm:px-6 py-4 hidden sm:table-cell">{t('common.status')}</th>
                                <th className="px-4 sm:px-6 py-4 hidden sm:table-cell">{t('dashboard.instructor.revenue')}</th>
                                <th className="px-4 sm:px-6 py-4 text-right">{t('common.actions')}</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                            {courses.length > 0 ? courses.map((course) => (
                                <tr key={course.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                                    <td className="px-4 sm:px-6 py-4 font-medium text-slate-900 dark:text-white">
                                        <div className="flex items-center gap-3">
                                            <div className="w-12 h-12 rounded-lg bg-slate-200 dark:bg-slate-800 shrink-0 overflow-hidden shadow-sm">
                                                {course.image ? (
                                                    <img src={course.image} alt={course.title} className="w-full h-full object-cover transition-transform group-hover:scale-110 duration-500" />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center text-slate-400">
                                                        <Video size={20} />
                                                    </div>
                                                )}
                                            </div>
                                            <div className="min-w-0">
                                                <span className="block truncate font-bold">{course.title}</span>
                                                <span className="text-xs text-slate-500 dark:text-slate-400 sm:hidden">
                                                    {course.status === 'Published' ? t('dashboard.instructor.published') : t('dashboard.instructor.draft')} • {course.revenue}
                                                </span>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-4 sm:px-6 py-4 text-slate-600 dark:text-slate-300">{course.students}</td>
                                    <td className="px-4 sm:px-6 py-4 hidden sm:table-cell">
                                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${course.status === 'Published'
                                            ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400'
                                            : 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-400'
                                            }`}>
                                            {course.status === 'Published' ? t('dashboard.instructor.published') : t('dashboard.instructor.draft')}
                                        </span>
                                    </td>
                                    <td className="px-4 sm:px-6 py-4 text-slate-600 dark:text-slate-300 hidden sm:table-cell">{course.revenue}</td>
                                    <td className="px-4 sm:px-6 py-4 text-right">
                                        <div className="flex justify-end gap-1">
                                            <button
                                                onClick={() => openEditModal(course)}
                                                className="p-2 text-slate-400 dark:text-slate-500 hover:text-primary dark:hover:text-primary-dark hover:bg-primary/10 rounded-lg transition-colors"
                                                title={t('common.edit')}
                                            >
                                                <Edit2 size={16} />
                                            </button>
                                            <button
                                                onClick={() => setShowDeleteConfirm(course.id)}
                                                className="p-2 text-slate-400 dark:text-slate-500 hover:text-red-500 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                                                title={t('common.delete')}
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            )) : (
                                <tr>
                                    <td colSpan="5" className="px-6 py-16 text-center">
                                        <div className="flex flex-col items-center gap-3">
                                            <div className="w-16 h-16 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400">
                                                <Video size={28} />
                                            </div>
                                            <h3 className="text-lg font-bold text-slate-900 dark:text-white">{t('dashboard.instructor.noCourses')}</h3>
                                            <p className="text-sm text-slate-500 dark:text-slate-400">{t('dashboard.instructor.noCoursesHint')}</p>
                                            <Button onClick={openAddModal}>
                                                <Plus size={16} className="mr-2" /> {t('dashboard.instructor.newCourse')}
                                            </Button>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </section>

            {/* Add/Edit Modal */}
            <AnimatePresence>
                {showModal && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                            onClick={() => setShowModal(false)}
                        />
                        <motion.div
                            initial={{ scale: 0.95, opacity: 0, y: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.95, opacity: 0, y: 20 }}
                            className="bg-white dark:bg-slate-900 rounded-2xl shadow-xl w-full max-w-lg p-6 relative z-10 border border-slate-100 dark:border-slate-800 transition-colors"
                        >
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                                    {editingCourse ? t('dashboard.instructor.modals.editTitle') : t('dashboard.instructor.modals.createTitle')}
                                </h2>
                                <button onClick={() => setShowModal(false)} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors disabled:opacity-50">
                                    <X size={20} className="text-slate-500 dark:text-slate-400" />
                                </button>
                            </div>
                            <form onSubmit={handleSave}>
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">{t('dashboard.instructor.modals.courseTitle')}</label>
                                        <input
                                            type="text"
                                            required
                                            value={formData.title}
                                            onChange={e => setFormData(prev => ({ ...prev, title: e.target.value }))}
                                            className="w-full px-4 py-2.5 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
                                            placeholder={t('dashboard.instructor.modals.titlePlaceholder')}
                                        />
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">{t('common.status')}</label>
                                            <select
                                                value={formData.status}
                                                onChange={e => setFormData(prev => ({ ...prev, status: e.target.value }))}
                                                className="w-full px-4 py-2.5 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
                                            >
                                                <option value="Draft">{t('dashboard.instructor.draft')}</option>
                                                <option value="Published">{t('dashboard.instructor.published')}</option>
                                            </select>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">{t('dashboard.instructor.modals.price')}</label>
                                            <input
                                                type="text"
                                                value={formData.revenue}
                                                onChange={e => setFormData(prev => ({ ...prev, revenue: e.target.value }))}
                                                className="w-full px-4 py-2.5 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
                                                placeholder={t('dashboard.instructor.modals.pricePlaceholder')}
                                            />
                                        </div>
                                    </div>
                                </div>
                                <div className="flex gap-3 mt-8">
                                    <Button type="button" variant="ghost" onClick={() => setShowModal(false)} className="flex-1" disabled={isSaving}>{t('common.cancel')}</Button>
                                    <Button type="submit" className="flex-1" disabled={isSaving}>
                                        {isSaving ? t('common.loading') : (editingCourse ? t('dashboard.instructor.modals.saveChanges') : t('dashboard.instructor.modals.createCourse'))}
                                    </Button>
                                </div>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* Delete Confirmation */}
            <AnimatePresence>
                {showDeleteConfirm && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                            onClick={() => setShowDeleteConfirm(null)}
                        />
                        <motion.div
                            initial={{ scale: 0.95, opacity: 0, y: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.95, opacity: 0, y: 20 }}
                            className="bg-white dark:bg-slate-900 rounded-2xl shadow-xl w-full max-w-sm p-6 relative z-10 border border-slate-100 dark:border-slate-800 transition-colors"
                        >
                            <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-2">{t('dashboard.instructor.modals.deleteConfirm')}</h2>
                            <p className="text-slate-500 dark:text-slate-400 mb-6">{t('dashboard.instructor.modals.deleteHint')}</p>
                            <div className="flex gap-3">
                                <Button variant="ghost" onClick={() => setShowDeleteConfirm(null)} className="flex-1">{t('common.cancel')}</Button>
                                <Button variant="danger" onClick={() => handleDelete(showDeleteConfirm)} className="flex-1">{t('common.delete')}</Button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default InstructorDashboardPage;
