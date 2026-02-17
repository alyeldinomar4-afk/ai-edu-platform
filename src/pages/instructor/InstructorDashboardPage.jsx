import { useState, useEffect } from 'react';
import { useAuth } from '../../auth/AuthContext';
import { Plus, Users, BarChart3, DollarSign, Video, X, Edit2, Trash2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Button from '../../components/ui/Button';
import { api } from '../../services/api';

const InstructorDashboardPage = () => {
    const { user } = useAuth();
    const [stats, setStats] = useState(null);
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
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

    const handleSave = () => {
        if (!formData.title.trim()) return;
        if (editingCourse) {
            setCourses(prev => prev.map(c =>
                c.id === editingCourse.id ? { ...c, ...formData, students: parseInt(formData.students) || 0 } : c
            ));
        } else {
            setCourses(prev => [...prev, {
                id: Date.now(),
                ...formData,
                students: parseInt(formData.students) || 0
            }]);
        }
        setShowModal(false);
    };

    const handleDelete = (id) => {
        setCourses(prev => prev.filter(c => c.id !== id));
        setShowDeleteConfirm(null);
    };

    const statCards = stats ? [
        { label: 'Total Students', value: stats.totalStudents.toLocaleString(), change: '↑ 12%', icon: Users, color: 'text-blue-500' },
        { label: 'Total Revenue', value: stats.totalRevenue, change: '↑ 8%', icon: DollarSign, color: 'text-green-500' },
        { label: 'Course Rating', value: stats.avgRating, sub: `Average from ${stats.totalReviews} reviews`, icon: BarChart3, color: 'text-yellow-500' },
        { label: 'Active Courses', value: stats.activeCourses, sub: `${stats.pendingReview} pending review`, icon: Video, color: 'text-purple-500' },
    ] : [];

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
                <div>
                    <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">Instructor Dashboard</h1>
                    <p className="text-slate-500 mt-2">Manage your courses and track performance.</p>
                </div>
                <Button onClick={openAddModal}>
                    <Plus className="w-5 h-5 mr-2" /> Create New Course
                </Button>
            </div>

            {/* Analytics Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-10">
                {statCards.map((card, i) => (
                    <motion.div
                        key={card.label}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1 }}
                        className="bg-white p-5 sm:p-6 rounded-xl shadow-sm border border-slate-100"
                    >
                        <div className="flex items-center justify-between mb-4">
                            <span className="text-slate-500 text-sm">{card.label}</span>
                            <card.icon className={`w-5 h-5 ${card.color}`} />
                        </div>
                        <h3 className="text-2xl sm:text-3xl font-bold text-slate-900">{card.value}</h3>
                        {card.change && <p className="text-green-500 text-xs mt-2 font-medium">{card.change} vs last month</p>}
                        {card.sub && <p className="text-slate-400 text-xs mt-2">{card.sub}</p>}
                    </motion.div>
                ))}
            </div>

            {/* Courses Table */}
            <section className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                <div className="p-4 sm:p-6 border-b border-slate-100">
                    <h2 className="text-lg font-bold text-slate-900">Your Courses</h2>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-slate-50 text-slate-500 font-medium">
                            <tr>
                                <th className="px-4 sm:px-6 py-4">Course Name</th>
                                <th className="px-4 sm:px-6 py-4">Students</th>
                                <th className="px-4 sm:px-6 py-4 hidden sm:table-cell">Status</th>
                                <th className="px-4 sm:px-6 py-4 hidden sm:table-cell">Revenue</th>
                                <th className="px-4 sm:px-6 py-4">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {courses.map((course) => (
                                <tr key={course.id} className="hover:bg-slate-50/50 transition-colors">
                                    <td className="px-4 sm:px-6 py-4 font-medium text-slate-900">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-lg bg-slate-200 shrink-0"></div>
                                            <div className="min-w-0">
                                                <span className="block truncate">{course.title}</span>
                                                <span className="text-xs text-slate-500 sm:hidden">{course.status} • {course.revenue}</span>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-4 sm:px-6 py-4 text-slate-600">{course.students}</td>
                                    <td className="px-4 sm:px-6 py-4 hidden sm:table-cell">
                                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                            course.status === 'Published'
                                                ? 'bg-green-100 text-green-800'
                                                : 'bg-yellow-100 text-yellow-800'
                                        }`}>
                                            {course.status}
                                        </span>
                                    </td>
                                    <td className="px-4 sm:px-6 py-4 text-slate-600 hidden sm:table-cell">{course.revenue}</td>
                                    <td className="px-4 sm:px-6 py-4">
                                        <div className="flex gap-1">
                                            <button
                                                onClick={() => openEditModal(course)}
                                                className="p-2 text-slate-400 hover:text-primary hover:bg-primary/10 rounded-lg transition-colors"
                                                title="Edit"
                                            >
                                                <Edit2 size={16} />
                                            </button>
                                            <button
                                                onClick={() => setShowDeleteConfirm(course.id)}
                                                className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                                                title="Delete"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </section>

            {/* Add/Edit Modal */}
            <AnimatePresence>
                {showModal && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
                        onClick={() => setShowModal(false)}
                    >
                        <motion.div
                            initial={{ scale: 0.95, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.95, opacity: 0 }}
                            className="bg-white rounded-2xl shadow-xl w-full max-w-lg p-6"
                            onClick={e => e.stopPropagation()}
                        >
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-xl font-bold text-slate-900">
                                    {editingCourse ? 'Edit Course' : 'Create New Course'}
                                </h2>
                                <button onClick={() => setShowModal(false)} className="p-2 hover:bg-slate-100 rounded-lg">
                                    <X size={20} className="text-slate-500" />
                                </button>
                            </div>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Course Title</label>
                                    <input
                                        type="text"
                                        value={formData.title}
                                        onChange={e => setFormData(prev => ({ ...prev, title: e.target.value }))}
                                        className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                                        placeholder="e.g. Advanced Python Masterclass"
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-1">Status</label>
                                        <select
                                            value={formData.status}
                                            onChange={e => setFormData(prev => ({ ...prev, status: e.target.value }))}
                                            className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary bg-white"
                                        >
                                            <option value="Draft">Draft</option>
                                            <option value="Published">Published</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-1">Price</label>
                                        <input
                                            type="text"
                                            value={formData.revenue}
                                            onChange={e => setFormData(prev => ({ ...prev, revenue: e.target.value }))}
                                            className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                                            placeholder="$0"
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className="flex gap-3 mt-6">
                                <Button variant="ghost" onClick={() => setShowModal(false)} className="flex-1">Cancel</Button>
                                <Button onClick={handleSave} className="flex-1">
                                    {editingCourse ? 'Save Changes' : 'Create Course'}
                                </Button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Delete Confirmation */}
            <AnimatePresence>
                {showDeleteConfirm && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
                        onClick={() => setShowDeleteConfirm(null)}
                    >
                        <motion.div
                            initial={{ scale: 0.95, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.95, opacity: 0 }}
                            className="bg-white rounded-2xl shadow-xl w-full max-w-sm p-6"
                            onClick={e => e.stopPropagation()}
                        >
                            <h2 className="text-lg font-bold text-slate-900 mb-2">Delete Course?</h2>
                            <p className="text-sm text-slate-500 mb-6">This action cannot be undone.</p>
                            <div className="flex gap-3">
                                <Button variant="ghost" onClick={() => setShowDeleteConfirm(null)} className="flex-1">Cancel</Button>
                                <Button variant="danger" onClick={() => handleDelete(showDeleteConfirm)} className="flex-1">Delete</Button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default InstructorDashboardPage;
