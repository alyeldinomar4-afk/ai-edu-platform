import { useState, useEffect, useRef } from 'react';
import { useAuth } from '../../auth/useAuth';
import { Plus, Users, BarChart3, DollarSign, Video, X, Edit, Edit2, Trash2, User, TrendingUp, ArrowUpRight, Sparkles, Image as ImageIcon } from 'lucide-react';
import { motion, AnimatePresence, useInView, useSpring, useMotionValue } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import toast from 'react-hot-toast';
import Button from '../../components/ui/Button';
import InstructorNav from '../../components/layout/InstructorNav';
import { api } from '../../services/api';
import { formatCurrency, formatNumber, formatCompactNumber } from '../../utils/formatters';

// Animated counter
const AnimatedStat = ({ value }) => {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true });
    const numStr = String(value).replace(/[^0-9.]/g, '');
    const prefix = String(value).match(/^[^0-9]*/)?.[0] || '';
    const suffix = String(value).match(/[^0-9.]*$/)?.[0] || '';
    const numericValue = parseFloat(numStr) || 0;
    const motionValue = useMotionValue(0);
    const springValue = useSpring(motionValue, { stiffness: 80, damping: 20 });
    const [display, setDisplay] = useState('0');

    useEffect(() => {
        if (isInView) motionValue.set(numericValue);
    }, [isInView, numericValue, motionValue]);

    useEffect(() => {
        const unsub = springValue.on('change', (latest) => {
            if (numStr.includes('.')) setDisplay(latest.toFixed(1));
            else setDisplay(Math.round(latest).toLocaleString());
        });
        return unsub;
    }, [springValue, numStr]);

    return <span ref={ref}>{prefix}{display}{suffix}</span>;
};

const stagger = { hidden: {}, visible: { transition: { staggerChildren: 0.08, delayChildren: 0.1 } } };
const fadeUp = { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] } } };

const InstructorDashboardPage = () => {
    const { user } = useAuth();
    const { t, i18n } = useTranslation();
    const isAr = i18n.language === 'ar';
    const [stats, setStats] = useState(null);
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [editingCourse, setEditingCourse] = useState(null);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(null);
    const [formData, setFormData] = useState({ title: '', students: 0, status: 'draft', revenue: 0, image: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', description: '' });

    useEffect(() => {
        const loadData = async () => {
            try {
                const [statsData, coursesData] = await Promise.all([
                    api.instructor.getStats(),
                    api.instructor.courses.getAll()
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
        setFormData({ title: '', students: 0, status: 'draft', revenue: 0, image: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', description: '' });
        setShowModal(true);
    };

    const openEditModal = (course) => {
        setEditingCourse(course);
        setFormData({ title: course.title, students: course.students, status: course.status, revenue: course.revenue, image: course.image || '', description: course.description || '' });
        setShowModal(true);
    };

    const handleSave = async (e) => {
        e?.preventDefault();
        if (!formData.title.trim()) {
            toast.error(t('dashboard.instructor.toasts.titleRequired'));
            return;
        }
        setIsSaving(true);
        try {
            if (editingCourse) {
                const updated = await api.instructor.courses.update(editingCourse.id, formData);
                setCourses(prev => prev.map(c =>
                    c.id === editingCourse.id ? updated : c
                ));
                toast.success(t('dashboard.instructor.toasts.updateSuccess'));
            } else {
                const created = await api.instructor.courses.create({
                    ...formData,
                    students: 0,
                    revenue: parseFloat(formData.revenue) || 0,
                    status: formData.status || 'draft'
                });
                setCourses(prev => [...prev, created]);
                toast.success(t('dashboard.instructor.toasts.createSuccess'));
            }
        } catch (error) {
            console.error('Error saving course:', error);
            toast.error(t('common.error'));
        } finally {
            setIsSaving(false);
            setShowModal(false);
        }
    };

    const handleDelete = async (id) => {
        try {
            await api.instructor.courses.delete(id);
            setCourses(prev => prev.filter(c => c.id !== id));
            setShowDeleteConfirm(null);
            toast.success(t('common.deleted', { defaultValue: 'Course deleted' }));
        } catch (error) {
            console.error('Error deleting course:', error);
        }
    };

    const statCards = stats ? [
        { label: t('dashboard.instructor.stats.totalStudents'), value: stats.totalStudents, change: '+12%', icon: Users, color: 'from-blue-500 to-indigo-600', bgLight: 'bg-blue-50 dark:bg-blue-900/20', textColor: 'text-blue-600 dark:text-blue-400', isCompact: true },
        { label: t('dashboard.instructor.stats.totalRevenue'), value: stats.totalRevenue, change: '+8%', icon: DollarSign, color: 'from-emerald-500 to-teal-600', bgLight: 'bg-emerald-50 dark:bg-emerald-900/20', textColor: 'text-emerald-600 dark:text-emerald-400', isCurrency: true },
        { label: t('dashboard.instructor.stats.courseRating'), value: stats.avgRating, sub: t('dashboard.instructor.stats.avgFrom', { count: stats.totalReviews }), icon: BarChart3, color: 'from-amber-500 to-orange-600', bgLight: 'bg-amber-50 dark:bg-amber-900/20', textColor: 'text-amber-600 dark:text-amber-400' },
        { label: t('dashboard.instructor.stats.activeCourses'), value: stats.activeCourses, sub: t('dashboard.instructor.stats.pendingReview', { count: stats.pendingReview }), icon: Video, color: 'from-purple-500 to-pink-600', bgLight: 'bg-purple-50 dark:bg-purple-900/20', textColor: 'text-purple-600 dark:text-purple-400' },
    ] : [];

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 transition-colors duration-300">
            {/* Header */}
            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8"
            >
                <div>
                    <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">{t('dashboard.instructor.title')}</h1>
                    <p className="text-slate-500 dark:text-slate-400 mt-2">{t('dashboard.instructor.subtitle')}</p>
                </div>
                <div className="flex gap-3 w-full sm:w-auto">
                    <Link to="/instructor/profile" className="flex-1 sm:flex-none">
                        <Button variant="outline" className="w-full">
                            <User className="w-5 h-5 mr-2 rtl:ml-2 rtl:mr-0" /> {t('dashboard.learner.profile')}
                        </Button>
                    </Link>
                    <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={openAddModal}
                        className="relative flex-1 sm:flex-none group flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl font-medium tracking-wide text-white bg-primary hover:bg-primary/90 shadow-lg shadow-primary/30 hover:shadow-primary/50 overflow-hidden transition-all duration-300 cursor-pointer"
                    >
                        <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                        <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700 delay-[50ms]" />
                        <Plus className="w-5 h-5 relative z-10" />
                        <span className="relative z-10">{t('dashboard.instructor.newCourse')}</span>
                    </motion.button>
                </div>
            </motion.div>

            <InstructorNav />

            {/* Stats Cards */}
            {stats && (
                <motion.div
                    variants={stagger}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-10"
                >
                    {statCards.map((card, i) => (
                        <motion.div
                            key={i}
                            variants={fadeUp}
                            whileHover={{ y: -4, transition: { duration: 0.2 } }}
                            className="group relative bg-white dark:bg-slate-900 p-5 sm:p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 transition-all duration-300 hover:shadow-lg hover:shadow-primary/5 dark:hover:shadow-primary/10 overflow-hidden"
                        >
                            {/* Gradient accent top */}
                            <div className={`absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r ${card.color} opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />

                            <div className="flex items-center justify-between mb-3">
                                <span className="text-slate-500 dark:text-slate-400 text-sm font-medium">{card.label}</span>
                                <motion.div
                                    whileHover={{ scale: 1.1, rotate: 5 }}
                                    transition={{ type: 'spring', stiffness: 400 }}
                                    className={`w-10 h-10 rounded-xl flex items-center justify-center ${card.bgLight} ${card.textColor}`}
                                >
                                    <card.icon className="w-5 h-5" />
                                </motion.div>
                            </div>
                            <h3 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mb-1">
                                <AnimatedStat value={card.isCurrency ? formatCurrency(card.value, i18n.language) : card.isCompact ? formatCompactNumber(card.value, i18n.language) : formatNumber(card.value, i18n.language)} />
                            </h3>
                            {card.change && (
                                <div className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 text-xs font-semibold">
                                    <ArrowUpRight className="w-3 h-3" />
                                    {card.change} <span className="text-slate-400 dark:text-slate-500 font-normal">{t('dashboard.instructor.stats.vsLastMonth')}</span>
                                </div>
                            )}
                            {card.sub && <p className="text-slate-400 dark:text-slate-500 text-xs mt-1">{card.sub}</p>}
                        </motion.div>
                    ))}
                </motion.div>
            )}

            {/* Courses Table */}
            <motion.section
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 overflow-hidden transition-colors"
            >
                <div className="p-4 sm:p-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
                    <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                        <Video className="w-5 h-5 text-primary" />
                        {t('dashboard.instructor.yourCourses')}
                    </h2>
                    <span className="text-xs text-slate-400 dark:text-slate-500 font-medium">{courses.length} {isAr ? 'دورة' : 'courses'}</span>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left rtl:text-right text-sm">
                        <thead className="bg-slate-50 dark:bg-slate-800/50 text-slate-500 dark:text-slate-400 font-medium border-b border-slate-100 dark:border-slate-800">
                            <tr>
                                <th className="px-4 sm:px-6 py-4">{t('dashboard.instructor.courseName')}</th>
                                <th className="px-4 sm:px-6 py-4">{t('dashboard.instructor.students')}</th>
                                <th className="px-4 sm:px-6 py-4 hidden sm:table-cell">{t('common.status')}</th>
                                <th className="px-4 sm:px-6 py-4 hidden sm:table-cell">{t('dashboard.instructor.revenue')}</th>
                                <th className="px-4 sm:px-6 py-4 text-right rtl:text-left">{t('common.actions')}</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                            {courses.length > 0 ? courses.map((course, i) => (
                                <motion.tr
                                    key={course.id}
                                    initial={{ opacity: 0, x: isAr ? 10 : -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: i * 0.05 }}
                                    className="group hover:bg-slate-50/80 dark:hover:bg-slate-800/30 transition-colors"
                                >
                                    <td className="px-4 sm:px-6 py-4 font-medium text-slate-900 dark:text-white">
                                        <div className="flex items-center gap-3">
                                            <div className="w-12 h-12 rounded-xl bg-slate-100 dark:bg-slate-800 shrink-0 overflow-hidden shadow-sm group-hover:shadow-md transition-shadow">
                                                {course.image ? (
                                                    <img src={course.image} alt={course.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center text-slate-400">
                                                        <Video size={20} />
                                                    </div>
                                                )}
                                            </div>
                                            <div className="min-w-0">
                                                <span className="block truncate font-bold group-hover:text-primary transition-colors">{course.title}</span>
                                                <span className="text-xs text-slate-500 dark:text-slate-400 sm:hidden">
                                                    {course.status === 'published' ? t('dashboard.instructor.published') : t('dashboard.instructor.draft')} • {formatCurrency(course.revenue)}
                                                </span>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-4 sm:px-6 py-4 text-slate-600 dark:text-slate-300 font-medium">{formatNumber(course.students)}</td>
                                    <td className="px-4 sm:px-6 py-4 hidden sm:table-cell">
                                        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${course.status === 'published'
                                            ? 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400'
                                            : 'bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-400'
                                            }`}>
                                            <div className={`w-1.5 h-1.5 rounded-full ${course.status === 'published' ? 'bg-emerald-500' : 'bg-amber-500'}`} />
                                            {course.status === 'published' ? t('dashboard.instructor.published') : t('dashboard.instructor.draft')}
                                        </span>
                                    </td>
                                    <td className="px-4 sm:px-6 py-4 text-slate-600 dark:text-slate-300 hidden sm:table-cell font-semibold">{formatCurrency(course.revenue)}</td>
                                    <td className="px-4 sm:px-6 py-4 text-right rtl:text-left">
                                        <div className="flex justify-end gap-1">
                                            <button
                                                onClick={() => openEditModal(course)}
                                                className="group relative flex items-center justify-center h-9 px-3 rounded-full bg-gradient-to-r from-slate-100 to-slate-50 hover:from-indigo-50 hover:to-purple-50 dark:from-slate-800 dark:to-slate-800/80 dark:hover:from-indigo-900/40 dark:hover:to-purple-900/40 text-slate-500 hover:text-indigo-600 dark:hover:text-indigo-400 border border-slate-200/50 hover:border-indigo-300/50 dark:border-slate-700/50 dark:hover:border-indigo-500/50 shadow-sm hover:shadow-md hover:shadow-indigo-500/10 transition-all duration-300 cursor-pointer overflow-hidden"
                                                title={t('common.edit')}
                                            >
                                                <Edit size={16} className="shrink-0 group-hover:scale-110 group-hover:-rotate-12 transition-transform duration-300 text-slate-400 group-hover:text-indigo-600 dark:group-hover:text-indigo-400" />
                                                <span className="max-w-0 w-0 overflow-hidden opacity-0 group-hover:max-w-[100px] group-hover:w-auto group-hover:opacity-100 group-hover:ml-2 rtl:group-hover:mr-2 rtl:group-hover:ml-0 whitespace-nowrap text-xs font-bold transition-all duration-500 ease-in-out">
                                                    {t('common.edit')}
                                                </span>
                                            </button>
                                            <motion.button
                                                whileHover={{ scale: 1.1 }}
                                                whileTap={{ scale: 0.9 }}
                                                onClick={() => setShowDeleteConfirm(course.id)}
                                                className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                                                title={t('common.delete')}
                                            >
                                                <Trash2 size={16} />
                                            </motion.button>
                                        </div>
                                    </td>
                                </motion.tr>
                            )) : (
                                <tr>
                                    <td colSpan="5" className="px-6 py-16 text-center">
                                        <div className="flex flex-col items-center gap-3">
                                            <motion.div
                                                animate={{ y: [0, -5, 0] }}
                                                transition={{ duration: 2, repeat: Infinity }}
                                                className="w-16 h-16 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400"
                                            >
                                                <Video size={28} />
                                            </motion.div>
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
            </motion.section>

            {/* Add/Edit Side Panel */}
            <AnimatePresence>
                {showModal && (
                    <div className="fixed inset-0 z-50 flex justify-end">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="absolute inset-0 bg-slate-900/40 dark:bg-black/60 backdrop-blur-sm cursor-pointer"
                            onClick={() => setShowModal(false)}
                        />
                        <motion.div
                            initial={{ x: isAr ? '-100%' : '100%' }}
                            animate={{ x: 0 }}
                            exit={{ x: isAr ? '-100%' : '100%' }}
                            transition={{ type: 'spring', bounce: 0, duration: 0.4 }}
                            className="relative z-10 w-full max-w-5xl bg-slate-50 dark:bg-slate-950 h-full shadow-2xl flex flex-col md:flex-row overflow-hidden border-l border-slate-200 dark:border-slate-800 rtl:border-l-0 rtl:border-r"
                        >
                            {/* Editor Side */}
                            <div className="w-full md:w-1/2 h-full bg-white dark:bg-slate-900 flex flex-col border-r border-slate-200 dark:border-slate-800 rtl:border-r-0 rtl:border-l">
                                <div className="flex justify-between items-center p-6 border-b border-slate-100 dark:border-slate-800">
                                    <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                                        {editingCourse ? t('dashboard.instructor.modals.editTitle') : t('dashboard.instructor.modals.createTitle')}
                                    </h2>
                                    <button onClick={() => setShowModal(false)} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors cursor-pointer">
                                        <X size={20} className="text-slate-500" />
                                    </button>
                                </div>

                                <div className="flex-1 overflow-y-auto p-6 scrollbar-hide">
                                    <form id="course-form" onSubmit={handleSave} className="space-y-6">


                                        <div>
                                            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">{t('dashboard.instructor.modals.courseTitle')}</label>
                                            <input
                                                type="text"
                                                required
                                                value={formData.title}
                                                onChange={e => setFormData(prev => ({ ...prev, title: e.target.value }))}
                                                className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-lg font-medium"
                                                placeholder={t('dashboard.instructor.modals.titlePlaceholder')}
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">{t('dashboard.admin.manageCourses.descriptionLabel') || (isAr ? 'وصف الدورة' : 'Course Description')}</label>
                                            <textarea
                                                rows="3"
                                                value={formData.description || ''}
                                                onChange={e => setFormData(prev => ({ ...prev, description: e.target.value }))}
                                                className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all font-medium resize-none"
                                                placeholder={t('dashboard.admin.manageCourses.descriptionPlaceholder') || (isAr ? 'أدخل وصف الدورة...' : 'Enter course description...')}
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">{t('dashboard.admin.manageCourses.thumbnailLabel') || (isAr ? 'رابط صورة الغلاف' : 'Thumbnail URL')}</label>
                                            <div className="relative">
                                                <input
                                                    type="text"
                                                    value={formData.image || ''}
                                                    onChange={e => setFormData(prev => ({ ...prev, image: e.target.value }))}
                                                    className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all font-medium"
                                                    placeholder="https://example.com/image.jpg"
                                                />
                                            </div>
                                        </div>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">{t('common.status')}</label>
                                                <select
                                                    value={formData.status}
                                                    onChange={e => setFormData(prev => ({ ...prev, status: e.target.value }))}
                                                    className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all font-medium"
                                                >
                                                    <option value="draft">{t('dashboard.instructor.draft')}</option>
                                                    <option value="published">{t('dashboard.instructor.published')}</option>
                                                </select>
                                            </div>
                                            <div>
                                                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">{t('dashboard.instructor.modals.price')}</label>
                                                <input
                                                    type="number"
                                                    value={formData.revenue}
                                                    onChange={e => setFormData(prev => ({ ...prev, revenue: e.target.value === '' ? '' : e.target.value }))}
                                                    className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all font-medium"
                                                    placeholder="0.00"
                                                />
                                            </div>
                                        </div>
                                    </form>
                                </div>

                                <div className="p-6 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 flex gap-3">
                                    <Button type="button" variant="ghost" onClick={() => setShowModal(false)} className="flex-1" disabled={isSaving}>{t('common.cancel')}</Button>
                                    <Button type="submit" form="course-form" className="flex-1" disabled={isSaving}>
                                        {isSaving ? t('common.loading') : (editingCourse ? t('dashboard.instructor.modals.saveChanges') : t('dashboard.instructor.modals.createCourse'))}
                                    </Button>
                                </div>
                            </div>

                            {/* Live Preview Side */}
                            <div className="hidden md:flex w-1/2 h-full bg-slate-100/50 dark:bg-slate-950 flex-col items-center justify-center p-10 relative">
                                <div className="absolute inset-0 bg-transparent bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:radial-gradient(ellipse_at_center,black,transparent)] pointer-events-none"></div>

                                <div className="relative w-full max-w-sm">
                                    <div className="absolute -top-10 left-0 right-0 flex justify-center">
                                        <span className="bg-white/80 dark:bg-slate-900/80 text-primary text-xs font-bold px-4 py-1.5 rounded-full border border-primary/20 dark:border-primary/50 shadow-sm backdrop-blur-md relative z-20 flex items-center gap-1.5 animate-pulse">
                                            <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                                            {isAr ? 'معاينة حية' : 'Live Preview'}
                                        </span>
                                    </div>
                                    <motion.div
                                        layout
                                        className="bg-white dark:bg-slate-900 rounded-3xl shadow-2xl shadow-slate-200/50 dark:shadow-black/50 border border-slate-100 dark:border-slate-800 overflow-hidden group hover:-translate-y-1 transition-transform duration-300"
                                    >
                                        <div className="h-48 bg-slate-50 dark:bg-slate-800 relative overflow-hidden flex items-center justify-center">
                                            {formData.image ? (
                                                <img src={formData.image} alt="" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                                            ) : (
                                                <>
                                                    {formData.title.includes('AI') || formData.title.includes('الذكاء') ? (
                                                        <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/20 via-purple-500/20 to-pink-500/20 mix-blend-overlay"></div>
                                                    ) : null}
                                                    <ImageIcon className="w-16 h-16 text-slate-200 dark:text-slate-700 transition-transform duration-500 group-hover:scale-110" />
                                                </>
                                            )}

                                            {/* Status Badge */}
                                            <AnimatePresence>
                                                {formData.status === 'published' && (
                                                    <motion.div
                                                        initial={{ opacity: 0, scale: 0.8 }}
                                                        animate={{ opacity: 1, scale: 1 }}
                                                        exit={{ opacity: 0, scale: 0.8 }}
                                                        className="absolute top-4 right-4 rtl:left-4 rtl:right-auto bg-emerald-500/90 backdrop-blur-sm text-white text-[10px] font-bold px-2 py-1 rounded-lg shadow-sm tracking-wider uppercase"
                                                    >
                                                        {t('dashboard.instructor.published')}
                                                    </motion.div>
                                                )}
                                            </AnimatePresence>
                                        </div>
                                        <div className="p-6">
                                            <h3 className="font-bold text-xl text-slate-900 dark:text-white mb-3 line-clamp-2 min-h-[56px] leading-tight">
                                                {formData.title || (isAr ? 'عنوان الدورة...' : 'Course Title...')}
                                            </h3>
                                            <div className="flex items-center justify-between mt-5 pt-5 border-t border-slate-100 dark:border-slate-800">
                                                <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400 font-medium bg-slate-50 dark:bg-slate-800/50 px-3 py-1.5 rounded-lg">
                                                    <Users size={16} className="text-primary" />
                                                    {formatNumber(formData.students || 0)}
                                                </div>
                                                <div className="text-xl font-black bg-gradient-to-r from-primary to-indigo-600 bg-clip-text text-transparent">
                                                    {formatCurrency(formData.revenue || 0)}
                                                </div>
                                            </div>
                                        </div>
                                    </motion.div>

                                    {/* Abstract glow behind the card */}
                                    <div className="absolute -inset-4 bg-primary/20 blur-3xl -z-10 rounded-full opacity-50 dark:opacity-30 mix-blend-multiply dark:mix-blend-screen"></div>
                                </div>
                            </div>
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
                            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                            className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl w-full max-w-sm p-6 relative z-10 border border-slate-100 dark:border-slate-800"
                        >
                            <div className="w-12 h-12 rounded-full bg-red-50 dark:bg-red-900/20 flex items-center justify-center text-red-500 mx-auto mb-4">
                                <Trash2 size={24} />
                            </div>
                            <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-2 text-center">{t('dashboard.instructor.modals.deleteConfirm')}</h2>
                            <p className="text-slate-500 dark:text-slate-400 mb-6 text-center text-sm">{t('dashboard.instructor.modals.deleteHint')}</p>
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
