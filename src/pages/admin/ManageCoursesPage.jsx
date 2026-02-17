import { useState } from 'react';
import Button from '../../components/ui/Button';
import { courses } from '../../data/mockData';
import { Edit2, Trash2, Plus, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const ManageCoursesPage = () => {
    const [courseList, setCourseList] = useState(courses);
    const [showModal, setShowModal] = useState(false);
    const [editingCourse, setEditingCourse] = useState(null);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(null);
    const [formData, setFormData] = useState({ title: '', instructor: '', category: '', price: '' });

    const openAddModal = () => {
        setEditingCourse(null);
        setFormData({ title: '', instructor: '', category: '', price: '' });
        setShowModal(true);
    };

    const openEditModal = (course) => {
        setEditingCourse(course);
        setFormData({ title: course.title, instructor: course.instructor, category: course.category, price: String(course.price) });
        setShowModal(true);
    };

    const handleSave = () => {
        if (!formData.title.trim()) return;
        if (editingCourse) {
            setCourseList(prev => prev.map(c =>
                c.id === editingCourse.id ? { ...c, ...formData, price: parseFloat(formData.price) || 0 } : c
            ));
        } else {
            setCourseList(prev => [...prev, {
                id: Date.now(),
                ...formData,
                price: parseFloat(formData.price) || 0,
                image: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
                rating: 0, reviews: 0, level: 'Beginner', lessons: 0, duration: '0h 0m'
            }]);
        }
        setShowModal(false);
    };

    const handleDelete = (id) => {
        setCourseList(prev => prev.filter(c => c.id !== id));
        setShowDeleteConfirm(null);
    };

    return (
        <div>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
                <h1 className="text-2xl font-bold text-slate-900">Manage Courses</h1>
                <Button className="flex items-center gap-2" onClick={openAddModal}>
                    <Plus size={18} /> Add New Course
                </Button>
            </div>

            <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 text-sm uppercase tracking-wider">
                                <th className="p-4 font-semibold">Course</th>
                                <th className="p-4 font-semibold hidden sm:table-cell">Instructor</th>
                                <th className="p-4 font-semibold hidden md:table-cell">Category</th>
                                <th className="p-4 font-semibold">Price</th>
                                <th className="p-4 font-semibold text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {courseList.map((course) => (
                                <tr key={course.id} className="hover:bg-slate-50 transition-colors">
                                    <td className="p-4">
                                        <div className="flex items-center gap-3">
                                            <img src={course.image} alt="" className="w-10 h-10 rounded-lg object-cover flex-shrink-0" />
                                            <div className="min-w-0">
                                                <span className="font-medium text-slate-900 block truncate">{course.title}</span>
                                                <span className="text-xs text-slate-500 sm:hidden">{course.instructor}</span>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="p-4 text-slate-600 hidden sm:table-cell">{course.instructor}</td>
                                    <td className="p-4 hidden md:table-cell">
                                        <span className="px-2 py-1 rounded-full bg-slate-100 text-xs font-semibold text-slate-600">{course.category}</span>
                                    </td>
                                    <td className="p-4 font-medium text-slate-900">${course.price}</td>
                                    <td className="p-4 text-right">
                                        <div className="flex justify-end gap-1">
                                            <button
                                                onClick={() => openEditModal(course)}
                                                className="p-2 text-slate-400 hover:text-primary hover:bg-primary/10 rounded-lg transition-colors"
                                                title="Edit course"
                                            >
                                                <Edit2 size={18} />
                                            </button>
                                            <button
                                                onClick={() => setShowDeleteConfirm(course.id)}
                                                className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                                                title="Delete course"
                                            >
                                                <Trash2 size={18} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                <div className="p-4 border-t border-slate-200 text-center text-sm text-slate-500">
                    Showing {courseList.length} courses
                </div>
            </div>

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
                                    {editingCourse ? 'Edit Course' : 'Add New Course'}
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
                                        placeholder="e.g. Introduction to Machine Learning"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Instructor</label>
                                    <input
                                        type="text"
                                        value={formData.instructor}
                                        onChange={e => setFormData(prev => ({ ...prev, instructor: e.target.value }))}
                                        className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                                        placeholder="e.g. Dr. Sarah Smith"
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-1">Category</label>
                                        <select
                                            value={formData.category}
                                            onChange={e => setFormData(prev => ({ ...prev, category: e.target.value }))}
                                            className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary bg-white"
                                        >
                                            <option value="">Select</option>
                                            <option value="Data Science">Data Science</option>
                                            <option value="Development">Development</option>
                                            <option value="Design">Design</option>
                                            <option value="Finance">Finance</option>
                                            <option value="Marketing">Marketing</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-1">Price ($)</label>
                                        <input
                                            type="number"
                                            value={formData.price}
                                            onChange={e => setFormData(prev => ({ ...prev, price: e.target.value }))}
                                            className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                                            placeholder="19.99"
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

            {/* Delete Confirmation Modal */}
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
                            <p className="text-sm text-slate-500 mb-6">This action cannot be undone. The course and all its data will be permanently removed.</p>
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

export default ManageCoursesPage;
