import { useState, useMemo } from 'react';
import Button from '../../components/ui/Button';
import { courses } from '../../data/mockData';
import { Edit2, Trash2, Plus, X, Search, BookOpen } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';

const ManageCoursesPage = () => {
    const { t } = useTranslation();
    const [courseList, setCourseList] = useState(courses);
    const [showModal, setShowModal] = useState(false);
    const [editingCourse, setEditingCourse] = useState(null);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(null);
    const [formData, setFormData] = useState({ title: '', instructor: '', category: '', price: '', discount: '' });
    const [searchTerm, setSearchTerm] = useState('');

    const filteredCourses = useMemo(() => {
        const search = searchTerm.toLowerCase();
        return courseList.filter(course =>
            course.title.toLowerCase().includes(search) ||
            course.instructor.toLowerCase().includes(search) ||
            course.category.toLowerCase().includes(search)
        );
    }, [courseList, searchTerm]);

    const openAddModal = () => {
        setEditingCourse(null);
        setFormData({ title: '', instructor: '', category: '', price: '', discount: '' });
        setShowModal(true);
    };

    const openEditModal = (course) => {
        setEditingCourse(course);
        setFormData({ title: course.title, instructor: course.instructor, category: course.category, price: String(course.price), discount: String(course.discount || '') });
        setShowModal(true);
    };

    const handleSave = () => {
        if (!formData.title.trim()) return;
        if (editingCourse) {
            setCourseList(prev => prev.map(c =>
                c.id === editingCourse.id ? { ...c, ...formData, price: parseFloat(formData.price) || 0, discount: parseInt(formData.discount) || 0 } : c
            ));
        } else {
            setCourseList(prev => [...prev, {
                id: Date.now(),
                ...formData,
                price: parseFloat(formData.price) || 0,
                discount: parseInt(formData.discount) || 0,
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
        <div className="transition-colors duration-300">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8 text-left">
                <h1 className="text-2xl font-bold text-slate-900 dark:text-white">{t('dashboard.admin.manageCourses.title')}</h1>
                <Button className="flex items-center gap-2" onClick={openAddModal}>
                    <Plus size={18} /> {t('dashboard.admin.manageCourses.addNew')}
                </Button>
            </div>

            {/* Search Bar */}
            <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-100 dark:border-slate-800 shadow-sm mb-6">
                <div className="relative">
                    <Search className={`absolute ${t('dir') === 'rtl' ? 'right-3' : 'left-3'} top-1/2 -translate-y-1/2 text-slate-400`} size={18} />
                    <input
                        type="text"
                        placeholder={t('dashboard.admin.manageCourses.searchPlaceholder')}
                        className={`w-full ${t('dir') === 'rtl' ? 'pr-10 pl-4 text-right' : 'pl-10 pr-4 text-left'} py-2 bg-slate-50 dark:bg-slate-800 border-none rounded-lg text-slate-900 dark:text-white focus:ring-2 focus:ring-primary transition-all outline-none`}
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm transition-colors">
                {filteredCourses.length > 0 ? (
                    <>
                        <div className="overflow-x-auto">
                            <table className={`w-full text-left rtl:text-right border-collapse`}>
                                <thead>
                                    <tr className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 text-sm uppercase tracking-wider">
                                        <th className="p-4 font-semibold">{t('dashboard.admin.manageCourses.table.course')}</th>
                                        <th className="p-4 font-semibold hidden sm:table-cell">{t('dashboard.admin.manageCourses.table.instructor')}</th>
                                        <th className="p-4 font-semibold hidden md:table-cell">{t('dashboard.admin.manageCourses.table.category')}</th>
                                        <th className="p-4 font-semibold">{t('dashboard.admin.manageCourses.table.price')}</th>
                                        <th className="p-4 font-semibold text-right rtl:text-left">{t('dashboard.admin.manageCourses.table.actions')}</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                                    {filteredCourses.map((course) => (
                                        <tr key={course.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                                            <td className="p-4">
                                                <div className="flex items-center gap-3">
                                                    <img src={course.image} alt="" className="w-10 h-10 rounded-lg object-cover flex-shrink-0" />
                                                    <div className="min-w-0">
                                                        <span className="font-medium text-slate-900 dark:text-white block truncate">{course.title}</span>
                                                        <span className="text-xs text-slate-500 dark:text-slate-400 sm:hidden">{course.instructor}</span>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="p-4 text-slate-600 dark:text-slate-300 hidden sm:table-cell">{course.instructor}</td>
                                            <td className="p-4 hidden md:table-cell">
                                                <span className="px-2 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-xs font-semibold text-slate-600 dark:text-slate-400">
                                                    {course.category ? t(`courses.categories.${course.category.charAt(0).toLowerCase() + course.category.slice(1).replace(/\s+/g, '')}`) : ''}
                                                </span>
                                            </td>
                                            <td className="p-4 font-medium text-slate-900 dark:text-white">${course.price}</td>
                                            <td className="p-4 text-right rtl:text-left">
                                                <div className="flex justify-end gap-1">
                                                    <button
                                                        onClick={() => openEditModal(course)}
                                                        className="p-2 text-slate-400 dark:text-slate-500 hover:text-primary dark:hover:text-primary-dark hover:bg-primary/10 rounded-lg transition-colors"
                                                        title="Edit course"
                                                    >
                                                        <Edit2 size={18} />
                                                    </button>
                                                    <button
                                                        onClick={() => setShowDeleteConfirm(course.id)}
                                                        className="p-2 text-slate-400 dark:text-slate-500 hover:text-red-500 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
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
                        <div className="p-4 border-t border-slate-200 dark:border-slate-800 text-center text-sm text-slate-500 dark:text-slate-400">
                            {t('dashboard.admin.manageCourses.showing', { count: filteredCourses.length, total: courseList.length })}
                        </div>
                    </>
                ) : (
                    <div className="py-20 text-center">
                        <div className="flex flex-col items-center gap-3">
                            <div className="w-16 h-16 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400">
                                <BookOpen size={32} />
                            </div>
                            <h3 className="text-lg font-bold text-slate-900 dark:text-white">{t('dashboard.admin.manageCourses.noFound')}</h3>
                            <p className="text-slate-500 dark:text-slate-400 text-sm">
                                {searchTerm ? t('dashboard.admin.manageCourses.searchHint') : t('dashboard.admin.manageCourses.emptyHint')}
                            </p>
                            {searchTerm && (
                                <Button variant="outline" onClick={() => setSearchTerm('')}>
                                    {t('dashboard.admin.manageCourses.clearSearch')}
                                </Button>
                            )}
                        </div>
                    </div>
                )}
            </div>

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
                            className="bg-white dark:bg-slate-900 rounded-2xl shadow-xl w-full max-w-lg p-6 relative z-10 border border-slate-100 dark:border-slate-800 transition-colors text-left"
                        >
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                                    {editingCourse ? t('dashboard.admin.manageCourses.editCourse') : t('dashboard.admin.manageCourses.addCourse')}
                                </h2>
                                <button onClick={() => setShowModal(false)} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors">
                                    <X size={20} className="text-slate-500 dark:text-slate-400" />
                                </button>
                            </div>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">{t('dashboard.admin.manageCourses.courseTitle')}</label>
                                    <input
                                        type="text"
                                        value={formData.title}
                                        onChange={e => setFormData(prev => ({ ...prev, title: e.target.value }))}
                                        className={`w-full px-4 py-2.5 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors ${t('dir') === 'rtl' ? 'text-right' : 'text-left'}`}
                                        placeholder={t('dashboard.admin.manageCourses.titlePlaceholder')}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">{t('dashboard.admin.manageCourses.table.instructor')}</label>
                                    <input
                                        type="text"
                                        value={formData.instructor}
                                        onChange={e => setFormData(prev => ({ ...prev, instructor: e.target.value }))}
                                        className={`w-full px-4 py-2.5 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors ${t('dir') === 'rtl' ? 'text-right' : 'text-left'}`}
                                        placeholder={t('dashboard.admin.manageCourses.instructorPlaceholder')}
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">{t('dashboard.admin.manageCourses.table.category')}</label>
                                        <select
                                            value={formData.category}
                                            onChange={e => setFormData(prev => ({ ...prev, category: e.target.value }))}
                                            className={`w-full px-4 py-2.5 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors select ${t('dir') === 'rtl' ? 'text-right' : 'text-left'}`}
                                        >
                                            <option value="">{t('common.select') || 'Select'}</option>
                                            <option value="Data Science">{t('courses.categories.dataScience')}</option>
                                            <option value="Development">{t('courses.categories.development')}</option>
                                            <option value="Design">{t('courses.categories.design')}</option>
                                            <option value="Finance">{t('courses.categories.finance')}</option>
                                            <option value="Marketing">{t('courses.categories.marketing')}</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">{t('dashboard.admin.manageCourses.priceLabel')}</label>
                                        <input
                                            type="number"
                                            value={formData.price}
                                            onChange={e => setFormData(prev => ({ ...prev, price: e.target.value }))}
                                            className={`w-full px-4 py-2.5 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors ${t('dir') === 'rtl' ? 'text-right' : 'text-left'}`}
                                            placeholder={t('dashboard.admin.manageCourses.pricePlaceholder')}
                                        />
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">{t('dashboard.admin.manageCourses.discountLabel')}</label>
                                        <input
                                            type="number"
                                            min="0"
                                            max="100"
                                            value={formData.discount}
                                            onChange={e => setFormData(prev => ({ ...prev, discount: e.target.value }))}
                                            className={`w-full px-4 py-2.5 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors ${t('dir') === 'rtl' ? 'text-right' : 'text-left'}`}
                                            placeholder={t('dashboard.admin.manageCourses.discountPlaceholder')}
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className="flex gap-3 mt-8">
                                <Button variant="ghost" onClick={() => setShowModal(false)} className="flex-1">{t('common.cancel')}</Button>
                                <Button onClick={handleSave} className="flex-1">
                                    {editingCourse ? t('common.save') : t('dashboard.admin.manageCourses.addCourse')}
                                </Button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* Delete Confirmation Modal */}
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
                            className="bg-white dark:bg-slate-900 rounded-2xl shadow-xl w-full max-w-sm p-6 relative z-10 border border-slate-100 dark:border-slate-800 transition-colors text-left"
                        >
                            <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-2">{t('dashboard.admin.manageCourses.deleteTitle')}</h2>
                            <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">{t('dashboard.admin.manageCourses.deleteContent')}</p>
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

export default ManageCoursesPage;
