import { useState, useEffect, useMemo } from 'react';
import Button from '../../components/ui/Button';
import { api } from '../../services/api';
import { Edit2, Trash2, Plus, X, Search, BookOpen, Sparkles, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { formatCurrency } from '../../utils/formatters';

const ManageCoursesPage = () => {
    const { t, i18n } = useTranslation();
    const isRTL = i18n.language === 'ar';
    const [courseList, setCourseList] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editingCourse, setEditingCourse] = useState(null);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(null);
    const [formData, setFormData] = useState({ title: '', instructor: '', category: '', price: '', discount: '', description: '', image: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80' });
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        const fetchCourses = async () => {
            setIsLoading(true);
            try {
                const data = await api.admin.courses.getAll();
                setCourseList(data);
            } catch (error) {
                console.error('Error fetching courses:', error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchCourses();
    }, []);

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
        setFormData({ title: '', instructor: '', category: '', price: '', discount: '', description: '', image: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80' });
        setShowModal(true);
    };

    const openEditModal = (course) => {
        setEditingCourse(course);
        setFormData({ title: course.title, instructor: course.instructor, category: course.category, price: String(course.price), discount: String(course.discount || ''), description: course.description || '', image: course.image || '' });
        setShowModal(true);
    };

    const handleSave = async () => {
        if (!formData.title.trim()) return;
        try {
            if (editingCourse) {
                const updated = await api.admin.courses.update(editingCourse.id, {
                    ...formData,
                    price: parseFloat(formData.price) || 0,
                    discount: parseInt(formData.discount) || 0
                });
                setCourseList(prev => prev.map(c => c.id === editingCourse.id ? updated : c));
            } else {
                const created = await api.admin.courses.create({
                    ...formData,
                    price: parseFloat(formData.price) || 0,
                    discount: parseInt(formData.discount) || 0
                });
                setCourseList(prev => [...prev, created]);
            }
            setShowModal(false);
        } catch (error) {
            console.error('Error saving course:', error);
        }
    };

    const handleDelete = async (id) => {
        try {
            await api.admin.courses.delete(id);
            setCourseList(prev => prev.filter(c => c.id !== id));
            setShowDeleteConfirm(null);
        } catch (error) {
            console.error('Error deleting course:', error);
        }
    };

    return (
        <div className="transition-colors duration-300">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8 text-left">
                <h1 className="text-2xl font-bold text-slate-900 dark:text-white">{t('dashboard.admin.manageCourses.title')}</h1>
                <button 
                    onClick={openAddModal} 
                    className="relative group flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl font-medium tracking-wide text-white bg-primary hover:bg-primary/90 shadow-lg shadow-primary/30 hover:shadow-primary/50 overflow-hidden transition-all duration-300 active:scale-[0.98] cursor-pointer"
                >
                    <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700 delay-[50ms]" />
                    <Plus size={18} className="relative z-10 shrink-0" /> 
                    <span className="relative z-10">{t('dashboard.admin.manageCourses.addNew')}</span>
                </button>
            </div>

            {/* Search Bar */}
            <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-100 dark:border-slate-800 shadow-sm mb-6">
                <div className="relative">
                    <Search className={`absolute ${isRTL ? 'right-3' : 'left-3'} top-1/2 -translate-y-1/2 text-slate-400`} size={18} />
                    <input
                        type="text"
                        placeholder={t('dashboard.admin.manageCourses.searchPlaceholder')}
                        className={`w-full ${isRTL ? 'pr-10 pl-4 text-right' : 'pl-10 pr-4 text-left'} py-2 bg-slate-50 dark:bg-slate-800 border-none rounded-lg text-slate-900 dark:text-white focus:ring-2 focus:ring-primary transition-all outline-none`}
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm transition-colors">
                {isLoading ? (
                    <div className="py-20 flex flex-col items-center justify-center gap-4">
                        <Loader2 className="w-10 h-10 text-primary animate-spin" />
                        <p className="text-slate-500 dark:text-slate-400 font-medium">{t('common.loading')}</p>
                    </div>
                ) : filteredCourses.length > 0 ? (
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
                                                        <span className="text-xs text-slate-500 dark:text-slate-400 sm:hidden">{course.instructor.fullName}</span>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="p-4 text-slate-600 dark:text-slate-300 hidden sm:table-cell">{course.instructor.fullName}</td>
                                            <td className="p-4 hidden md:table-cell">
                                                <span className="px-2 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-xs font-semibold text-slate-600 dark:text-slate-400">
                                                    {course.category ? t(`courses.categories.${course.category.name.charAt(0).toLowerCase() + course.category.name.slice(1).replace(/\s+/g, '')}`) : ''}
                                                </span>
                                            </td>
                                            <td className="p-4 font-medium text-slate-900 dark:text-white">{formatCurrency(course.price)}</td>
                                            <td className="p-4 text-right rtl:text-left">
                                                <div className="flex justify-end gap-1">
                                                    <button
                                                        onClick={() => openEditModal(course)}
                                                        className="group flex items-center justify-center h-9 px-2 rounded-full overflow-hidden text-slate-400 dark:text-slate-500 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 transition-all duration-300 hover:shadow-sm focus:outline-none cursor-pointer"
                                                        title={t('common.edit')}
                                                    >
                                                        <Edit2 size={18} className="shrink-0" />
                                                        <span className="max-w-0 w-0 overflow-hidden opacity-0 group-hover:max-w-[100px] group-hover:w-auto group-hover:opacity-100 group-hover:ml-1.5 rtl:group-hover:mr-1.5 rtl:group-hover:ml-0 whitespace-nowrap text-xs font-semibold transition-all duration-300 ease-in-out">{t('common.edit')}</span>
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
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-slate-900/60 backdrop-blur-md" onClick={() => setShowModal(false)} />
                        <motion.div
                            initial={{ x: isRTL ? '-100%' : '100%' }}
                            animate={{ x: 0 }}
                            exit={{ x: isRTL ? '-100%' : '100%' }}
                            transition={{ type: 'spring', bounce: 0, duration: 0.4 }}
                            className="relative z-10 w-full max-w-5xl bg-slate-50 dark:bg-slate-950 h-full shadow-2xl flex flex-col md:flex-row overflow-hidden border-l border-slate-200 dark:border-slate-800 rtl:border-l-0 rtl:border-r"
                        >
                            {/* Editor Side */}
                            <div className="w-full md:w-1/2 h-full bg-white dark:bg-slate-900 flex flex-col border-r border-slate-200 dark:border-slate-800 rtl:border-r-0 rtl:border-l">
                                <div className="flex justify-between items-center p-6 border-b border-slate-100 dark:border-slate-800 shrink-0">
                                    <div>
                                        <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                                            {editingCourse ? t('dashboard.admin.manageCourses.editCourse') : t('dashboard.admin.manageCourses.addCourse')}
                                        </h2>
                                        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">{t('dashboard.admin.manageCourses.addNew')}</p>
                                    </div>
                                    <button onClick={() => setShowModal(false)} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors cursor-pointer">
                                        <X size={20} className="text-slate-500 dark:text-slate-400" />
                                    </button>
                                </div>

                                <div className="flex-1 overflow-y-auto p-6 scrollbar-hide">
                                    <form id="course-form" className="space-y-6">
                                        


                                        <div className="space-y-2">
                                            <label className={`block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2 ${isRTL ? 'text-right' : 'text-left'}`}>{t('dashboard.admin.manageCourses.courseTitle')}</label>
                                            <input
                                                type="text"
                                                value={formData.title}
                                                onChange={e => setFormData(prev => ({ ...prev, title: e.target.value }))}
                                                className={`w-full px-4 py-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-lg font-medium ${isRTL ? 'text-right' : 'text-left'}`}
                                                placeholder={t('dashboard.admin.manageCourses.titlePlaceholder')}
                                            />
                                        </div>

                                        <div className="space-y-2">
                                            <label className={`block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2 ${isRTL ? 'text-right' : 'text-left'}`}>{t('dashboard.admin.manageCourses.table.instructor')}</label>
                                            <input
                                                type="text"
                                                value={formData.instructor}
                                                onChange={e => setFormData(prev => ({ ...prev, instructor: e.target.value }))}
                                                className={`w-full px-4 py-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all font-medium ${isRTL ? 'text-right' : 'text-left'}`}
                                                placeholder={t('dashboard.admin.manageCourses.instructorPlaceholder')}
                                            />
                                        </div>

                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                            <div className="space-y-2">
                                                <label className={`block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2 ${isRTL ? 'text-right' : 'text-left'}`}>{t('dashboard.admin.manageCourses.table.category')}</label>
                                                <select
                                                    value={formData.category}
                                                    onChange={e => setFormData(prev => ({ ...prev, category: e.target.value }))}
                                                    className={`w-full px-4 py-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all font-medium cursor-pointer appearance-none bg-[url('data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20fill%3D%22none%22%20viewBox%3D%220%200%2020%2020%22%3E%3Cpath%20stroke%3D%22%236B7280%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%20stroke-width%3D%221.5%22%20d%3D%22m6%208%204%204%204-4%22%2F%3E%3C%2Fsvg%3E')] bg-[length:20px] ${isRTL ? 'bg-[left_1rem_center]' : 'bg-[right_1rem_center]'} bg-no-repeat ${isRTL ? 'text-right' : 'text-left'}`}
                                                >
                                                    <option value="">{t('common.select') || 'Select'}</option>
                                                    <option value="Data Science">{t('courses.categories.dataScience')}</option>
                                                    <option value="Development">{t('courses.categories.development')}</option>
                                                    <option value="Design">{t('courses.categories.design')}</option>
                                                    <option value="Finance">{t('courses.categories.finance')}</option>
                                                    <option value="Marketing">{t('courses.categories.marketing')}</option>
                                                </select>
                                            </div>
                                            <div className="space-y-2">
                                                <label className={`block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2 ${isRTL ? 'text-right' : 'text-left'}`}>{t('dashboard.admin.manageCourses.priceLabel')}</label>
                                                <input
                                                    type="number"
                                                    value={formData.price}
                                                    onChange={e => setFormData(prev => ({ ...prev, price: e.target.value }))}
                                                    className={`w-full px-4 py-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all font-medium ${isRTL ? 'text-right' : 'text-left'}`}
                                                    placeholder={t('dashboard.admin.manageCourses.pricePlaceholder')}
                                                />
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                            <div className="space-y-2">
                                                <label className={`block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2 ${isRTL ? 'text-right' : 'text-left'}`}>{t('dashboard.admin.manageCourses.discountLabel')}</label>
                                                <input
                                                    type="number"
                                                    min="0"
                                                    max="100"
                                                    value={formData.discount}
                                                    onChange={e => setFormData(prev => ({ ...prev, discount: e.target.value }))}
                                                    className={`w-full px-4 py-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all font-medium ${isRTL ? 'text-right' : 'text-left'}`}
                                                    placeholder={t('dashboard.admin.manageCourses.discountPlaceholder')}
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <label className={`block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2 ${isRTL ? 'text-right' : 'text-left'}`}>{t('dashboard.admin.manageCourses.thumbnailLabel') || (isRTL ? 'رابط صورة الغلاف' : 'Thumbnail URL')}</label>
                                                <input
                                                    type="text"
                                                    value={formData.image}
                                                    onChange={e => setFormData(prev => ({ ...prev, image: e.target.value }))}
                                                    className={`w-full px-4 py-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all font-medium ${isRTL ? 'text-right' : 'text-left'}`}
                                                    placeholder={t('dashboard.admin.manageCourses.thumbnailPlaceholder') || 'https://example.com/image.jpg'}
                                                />
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            <label className={`block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2 ${isRTL ? 'text-right' : 'text-left'}`}>{t('dashboard.admin.manageCourses.descriptionLabel') || (isRTL ? 'وصف الدورة' : 'Course Description')}</label>
                                            <textarea
                                                rows="3"
                                                value={formData.description}
                                                onChange={e => setFormData(prev => ({ ...prev, description: e.target.value }))}
                                                className={`w-full px-4 py-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all font-medium ${isRTL ? 'text-right' : 'text-left'} resize-none`}
                                                placeholder={t('dashboard.admin.manageCourses.descriptionPlaceholder') || (isRTL ? 'أدخل وصف الدورة...' : 'Enter course description...')}
                                            />
                                        </div>
                                    </form>
                                </div>
                                <div className="p-6 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 flex gap-3 shrink-0">
                                    <Button variant="ghost" onClick={() => setShowModal(false)} className="flex-1">{t('common.cancel')}</Button>
                                    <Button onClick={handleSave} className="flex-1">
                                        {editingCourse ? t('common.save') : t('dashboard.admin.manageCourses.addCourse')}
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
                                            {isRTL ? 'معاينة الكورس' : 'Course Preview'}
                                        </span>
                                    </div>
                                    <motion.div 
                                        layout
                                        className="bg-white dark:bg-slate-900 rounded-3xl shadow-2xl shadow-slate-200/50 dark:shadow-black/50 border border-slate-100 dark:border-slate-800 overflow-hidden group hover:-translate-y-1 transition-transform duration-300"
                                    >
                                        <div className="h-44 bg-slate-900 relative overflow-hidden flex items-center justify-center">
                                            <img src={formData.image || 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'} alt="" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                                        </div>
                                        <div className="p-5">
                                            <h3 className="font-bold text-lg text-slate-900 dark:text-white mb-2 line-clamp-2 leading-tight">
                                                {formData.title || (isRTL ? 'عنوان الكورس...' : 'Course Title...')}
                                            </h3>
                                            <p className="text-sm font-medium text-slate-500 line-clamp-1 mb-4 flex items-center gap-2">
                                                {formData.instructor || (isRTL ? 'اسم المدرب...' : 'Instructor Name...')}
                                            </p>

                                            <div className="flex items-center justify-between mt-4 border-t border-slate-100 dark:border-slate-800 pt-4">
                                                <div className="font-bold text-lg text-primary">
                                                    ${formData.price || '0'}
                                                </div>
                                                {formData.category && (
                                                    <span className="px-3 py-1 bg-slate-100 dark:bg-slate-800 rounded-full text-xs font-semibold text-slate-600 dark:text-slate-300">
                                                        {formData.category}
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    </motion.div>
                                    
                                    {/* Abstract glow behind the card */}
                                    <div className="absolute -inset-4 bg-primary/20 blur-3xl -z-10 rounded-full opacity-50 flex-shrink-0 dark:opacity-30 mix-blend-multiply dark:mix-blend-screen pointer-events-none"></div>
                                </div>
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
