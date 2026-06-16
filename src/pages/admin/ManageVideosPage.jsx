import { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import {
    Video,
    Search,
    Filter,
    Play,
    Clock,
    Eye,
    Trash2,
    CheckCircle,
    LayoutGrid,
    List as ListIcon,
    Upload,
    MoreVertical,
    Calendar,
    User,
    X,
    Save,
    Edit,
    AlertTriangle,
    PauseCircle,
    Sparkles,
    Youtube
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import Button from '../../components/ui/Button';
import { api } from '../../services/api';
import { formatCompactNumber, formatDuration } from '../../utils/formatters';
import { Loader2 } from 'lucide-react';

// ManageVideosPage v1.3 - Fixed ReferenceError (Edit icon)
const ManageVideosPage = () => {
    const { t, i18n } = useTranslation();
    const isRTL = i18n.language === 'ar';
    const [viewMode, setViewMode] = useState('grid');
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [showVideoModal, setShowVideoModal] = useState(false);
    const [editingVideo, setEditingVideo] = useState(null);
    const [formValues, setFormValues] = useState({
        title: '',
        instructor: '',
        course: '',
        thumbnail: '',
        duration: '',
        status: 'published'
    });
 
    const [videos, setVideos] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(null);
 
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormValues(prev => ({ ...prev, [name]: value }));
    };

    const fetchVideos = async () => {
        setIsLoading(true);
        try {
            const data = await api.admin.videos.getAll(); 
            setVideos(data);
        } catch (error) {
            console.error('Error fetching videos:', error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchVideos();
    }, []);

    // Reset/Sync form values when modal opens or editingVideo changes
    useEffect(() => {
        if (showVideoModal) {
            setFormValues({
                title: editingVideo?.title || '',
                instructor: editingVideo?.instructor || '',
                course: editingVideo?.course || '',
                thumbnail: editingVideo?.thumbnail || 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&q=80',
                duration: editingVideo?.duration || 600,
                status: editingVideo?.status || 'published'
            });
        }
    }, [showVideoModal, editingVideo]);

    // Robust Filtering Logic
    const filteredVideos = useMemo(() => {
        if (!videos || !Array.isArray(videos)) return [];
        const search = (searchTerm || '').toLowerCase();
        return videos.filter(video => {
            if (!video) return false;
            const title = (video.title || '').toLowerCase();
            const instructor = (video.instructor || '').toLowerCase();
            const course = (video.course || '').toLowerCase();
            const matchesSearch = title.includes(search) || instructor.includes(search) || course.includes(search);
            const matchesStatus = statusFilter === 'all' || video.status === statusFilter;
            return matchesSearch && matchesStatus;
        });
    }, [videos, searchTerm, statusFilter]);

    // Actions
    const handleDeleteVideo = async (id) => {
        try {
            await api.admin.videos.delete(id);
            setVideos(prev => prev.filter(v => v.id !== id));
            setShowDeleteConfirm(null);
            toast.success(t('dashboard.admin.manageVideos.toasts.deleteSuccess'));
        } catch (error) {
            console.error('Error deleting video:', error);
        }
    };

    const togglePublish = async (id) => {
        try {
            await api.admin.videos.toggleStatus(id);
            const video = videos.find(v => v.id === id);
            if (!video) return;

            const newStatus = video.status === 'published' ? 'draft' : 'published';
            toast.success(t(`dashboard.admin.manageVideos.toasts.${newStatus === 'published' ? 'publishSuccess' : 'unpublishSuccess'}`));

            setVideos(prev => prev.map(v => v.id === id ? { ...v, status: newStatus } : v));
        } catch (error) {
            console.error('Error toggling status:', error);
        }
    };

    const handleAddVideo = async (data) => {
        try {
            const created = await api.admin.videos.create({
                ...data,
                views: 0,
                date: new Date().toISOString().split('T')[0],
                thumbnail: data.thumbnail || "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&q=80"
            });
            setVideos(prev => [created, ...prev]);
            setShowVideoModal(false);
            toast.success(t('dashboard.admin.manageVideos.toasts.addSuccess'));
        } catch (error) {
            console.error('Error adding video:', error);
        }
    };

    const handleUpdateVideo = async (data) => {
        try {
            const updated = await api.admin.videos.update(data.id, data);
            setVideos(prev => prev.map(v => v.id === data.id ? updated : v));
            setEditingVideo(null);
            setShowVideoModal(false);
            toast.success(t('dashboard.admin.manageVideos.toasts.updateSuccess'));
        } catch (error) {
            console.error('Error updating video:', error);
        }
    };

    const getStatusStyle = (status) => {
        switch (status) {
            case 'published': return 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400';
            case 'pending': return 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400';
            case 'draft': return 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-400';
            default: return 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-400';
        }
    };

    return (
        <div className="space-y-8 text-left">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div className="text-left">
                    <h1 className="text-2xl font-bold text-slate-900 dark:text-white">{t('dashboard.admin.manageVideos.title')}</h1>
                    <p className="text-slate-500 dark:text-slate-400">{t('dashboard.admin.manageVideos.subtitle')}</p>
                </div>
                <div className="flex gap-2 w-full sm:w-auto">
                    <button 
                        onClick={() => setShowVideoModal(true)}
                        className="relative group flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl font-medium tracking-wide text-white bg-primary hover:bg-primary/90 shadow-lg shadow-primary/30 hover:shadow-primary/50 overflow-hidden transition-all duration-300 active:scale-[0.98] cursor-pointer"
                    >
                        <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                        <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700 delay-[50ms]" />
                        <Upload size={18} className={`relative z-10 shrink-0 ${isRTL ? 'ml-2' : 'mr-2'}`} /> 
                        <span className="relative z-10">{t('dashboard.admin.manageVideos.uploadNew')}</span>
                    </button>
                </div>
            </div>

            {/* Filters */}
            <div className="flex flex-col md:flex-row gap-4 bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-100 dark:border-slate-800 shadow-sm">
                <div className="relative flex-1">
                    <Search className={`absolute ${isRTL ? 'right-3' : 'left-3'} top-1/2 -translate-y-1/2 text-slate-400`} size={18} />
                    <input
                        type="text"
                        placeholder={t('dashboard.admin.manageVideos.searchPlaceholder')}
                        className={`w-full ${isRTL ? 'pr-10 pl-4 text-right' : 'pl-10 pr-4 text-left'} py-2 bg-slate-50 dark:bg-slate-800 border-none rounded-lg text-slate-900 dark:text-white focus:ring-2 focus:ring-primary outline-none`}
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>

                <div className="flex items-center gap-3">
                    <select
                        className={`bg-slate-50 dark:bg-slate-800 border-none rounded-lg px-4 py-2 text-sm outline-none text-slate-700 dark:text-slate-200 ${isRTL ? 'text-right' : 'text-left'}`}
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                    >
                        <option value="all">{t('dashboard.admin.manageVideos.allStatus')}</option>
                        <option value="published">{t('dashboard.admin.manageVideos.published')}</option>
                        <option value="pending">{t('dashboard.admin.manageVideos.pending')}</option>
                        <option value="draft">{t('dashboard.admin.manageVideos.draft')}</option>
                    </select>
                    <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-lg">
                        <button onClick={() => setViewMode('grid')} className={`p-1.5 rounded-md ${viewMode === 'grid' ? 'bg-white dark:bg-slate-700 text-primary shadow-sm' : 'text-slate-500'}`}><LayoutGrid size={18} /></button>
                        <button onClick={() => setViewMode('list')} className={`p-1.5 rounded-md ${viewMode === 'list' ? 'bg-white dark:bg-slate-700 text-primary shadow-sm' : 'text-slate-500'}`}><ListIcon size={18} /></button>
                    </div>
                </div>
            </div>

            {/* Content Area */}
            {isLoading ? (
                <div className="py-20 flex flex-col items-center justify-center gap-4 bg-white dark:bg-slate-900 rounded-xl border border-slate-100 dark:border-slate-800 shadow-sm">
                    <Loader2 className="w-10 h-10 text-primary animate-spin" />
                    <p className="text-slate-500 dark:text-slate-400 font-medium">{t('common.loading')}</p>
                </div>
            ) : filteredVideos && filteredVideos.length > 0 ? (
                viewMode === 'grid' ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                        {filteredVideos.map((video) => (
                            <div key={video.id} className="bg-white dark:bg-slate-900 rounded-2xl overflow-hidden border border-slate-100 dark:border-slate-800 shadow-sm flex flex-col">
                                <div className="relative w-full aspect-video shrink-0 overflow-hidden bg-slate-100 dark:bg-slate-800">
                                    {video.thumbnail && <img src={video.thumbnail} alt="" className="w-full h-full object-cover" />}
                                    <span className={`absolute bottom-2 ${isRTL ? 'left-2' : 'right-2'} px-1.5 py-0.5 bg-black/70 text-white text-[10px] font-bold rounded uppercase`}>{formatDuration(video.duration)}</span>
                                    <span className={`absolute top-2 ${isRTL ? 'left-2' : 'right-2'} px-1.5 py-0.5 text-[10px] font-bold rounded uppercase tracking-wider ${getStatusStyle(video.status)}`}>
                                        {t(`dashboard.admin.manageVideos.${video.status}`)}
                                    </span>
                                </div>
                                <div className="p-5 flex-1 flex flex-col text-left">
                                    <h3 className="font-bold text-slate-900 dark:text-white mb-2 line-clamp-1">{video.title}</h3>
                                    <div className="space-y-1.5 mb-4">
                                        <div className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-2"><User size={14} className="text-primary" /> {video.instructor?.fullName}</div>
                                        <div className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-2 font-medium">{video.course}</div>
                                    </div>
                                    <div className="mt-auto pt-4 border-t border-slate-50 dark:border-slate-800 flex items-center justify-between">
                                        <div className={`flex gap-3 text-[10px] text-slate-400 ${isRTL ? 'flex-row-reverse' : 'flex-row'}`}>
                                            <span className="flex items-center gap-1"><Eye size={12} /> {formatCompactNumber(video.views)}</span>
                                            <span className="flex items-center gap-1"><Calendar size={12} /> {video.date}</span>
                                        </div>
                                        <div className="flex gap-1">
                                            <button onClick={() => { setEditingVideo(video); setShowVideoModal(true); }} className="group flex items-center justify-center h-8 px-2 rounded-full overflow-hidden text-slate-500 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 transition-all duration-300 hover:shadow-sm focus:outline-none cursor-pointer" title={t('common.edit')}>
                                                <Edit size={16} className="shrink-0" />
                                                <span className="max-w-0 w-0 overflow-hidden opacity-0 group-hover:max-w-[100px] group-hover:w-auto group-hover:opacity-100 group-hover:ml-1.5 rtl:group-hover:mr-1.5 rtl:group-hover:ml-0 whitespace-nowrap text-xs font-semibold transition-all duration-300 ease-in-out">{t('common.edit')}</span>
                                            </button>
                                            <button onClick={() => togglePublish(video.id)} className={`p-1.5 rounded-lg transition-colors ${video.status === 'published' ? 'text-amber-500 hover:bg-amber-50' : 'text-green-500 hover:bg-green-50'}`}>{video.status === 'published' ? <PauseCircle size={16} /> : <CheckCircle size={16} />}</button>
                                            <button onClick={() => setShowDeleteConfirm(video.id)} className="p-1.5 hover:bg-red-50 rounded-lg text-red-500 transition-colors"><Trash2 size={16} /></button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-100 dark:border-slate-800 shadow-sm overflow-hidden overflow-x-auto text-left">
                        <table className="w-full">
                            <thead className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-100 dark:border-slate-800">
                                <tr className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                                    <th className="px-6 py-4">{t('dashboard.admin.manageVideos.table.video')}</th>
                                    <th className="px-6 py-4">{t('dashboard.admin.manageVideos.table.instructor')}</th>
                                    <th className="px-6 py-4">{t('dashboard.admin.manageVideos.table.stats')}</th>
                                    <th className="px-6 py-4">{t('dashboard.admin.manageVideos.table.status')}</th>
                                    <th className="px-6 py-4 text-right rtl:text-left">{t('dashboard.admin.manageVideos.table.actions')}</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                                {filteredVideos.map((video) => (
                                    <tr key={video.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/20 transition-colors text-sm">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-12 h-8 bg-slate-100 dark:bg-slate-800 rounded flex-shrink-0">{video.thumbnail && <img src={video.thumbnail} className="w-full h-full object-cover rounded" alt="" />}</div>
                                                <div>
                                                    <p className="font-bold text-slate-900 dark:text-white line-clamp-1">{video.title}</p>
                                                    <p className="text-[11px] text-slate-500">{video.course}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-slate-600 dark:text-slate-300">{video.instructor?.fullName}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-[11px] text-slate-500">
                                            <div className="flex flex-col gap-0.5">
                                                <span className="flex items-center gap-1"><Eye size={12} /> {formatCompactNumber(video.views)}</span>
                                                <span className="flex items-center gap-1"><Clock size={12} /> {formatDuration(video.duration)}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`px-2 py-0.5 text-[10px] font-bold rounded-full uppercase tracking-wider ${getStatusStyle(video.status)}`}>
                                                {t(`dashboard.admin.manageVideos.${video.status}`)}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right rtl:text-left">
                                            <div className="flex justify-end gap-1 text-slate-500">
                                                <button onClick={() => { setEditingVideo(video); setShowVideoModal(true); }} className="group flex items-center justify-center h-8 px-2 rounded-full overflow-hidden text-slate-500 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 transition-all duration-300 hover:shadow-sm focus:outline-none cursor-pointer" title={t('common.edit')}>
                                                    <Edit size={16} className="shrink-0" />
                                                    <span className="max-w-0 w-0 overflow-hidden opacity-0 group-hover:max-w-[100px] group-hover:w-auto group-hover:opacity-100 group-hover:ml-1.5 rtl:group-hover:mr-1.5 rtl:group-hover:ml-0 whitespace-nowrap text-xs font-semibold transition-all duration-300 ease-in-out">{t('common.edit')}</span>
                                                </button>
                                                <button onClick={() => togglePublish(video.id)} className={`p-1.5 rounded-lg ${video.status === 'published' ? 'hover:bg-amber-50 text-amber-500' : 'hover:bg-green-50 text-green-500'}`}>{video.status === 'published' ? <PauseCircle size={16} /> : <CheckCircle size={16} />}</button>
                                                <button onClick={() => setShowDeleteConfirm(video.id)} className="p-1.5 hover:bg-red-50 rounded-lg text-red-500"><Trash2 size={16} /></button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )
            ) : (
                <div className="bg-white dark:bg-slate-900 py-20 rounded-xl border border-slate-100 dark:border-slate-800 shadow-sm">
                    <div className="flex flex-col items-center gap-3">
                        <div className="w-16 h-16 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400">
                            <Video size={32} />
                        </div>
                        <h3 className="text-lg font-bold text-slate-900 dark:text-white">{t('dashboard.admin.manageVideos.noFound')}</h3>
                        <p className="text-slate-500 text-sm">{t('dashboard.admin.manageVideos.noFoundHint')}</p>
                        <Button variant="outline" onClick={() => { setSearchTerm(''); setStatusFilter('all'); }}>{t('dashboard.admin.manageVideos.resetFilters')}</Button>
                    </div>
                </div>
            )}

            {/* Modal */}
            <AnimatePresence>
                {showVideoModal && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-slate-900/60 backdrop-blur-md" onClick={() => { setShowVideoModal(false); setEditingVideo(null); }} />
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
                                        <h2 className="text-xl font-bold dark:text-white">
                                            {editingVideo ? t('dashboard.admin.manageVideos.editTitle') : t('dashboard.admin.manageVideos.addTitle')}
                                        </h2>
                                        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">{t('dashboard.admin.manageVideos.uploadNew')}</p>
                                    </div>
                                    <button onClick={() => { setShowVideoModal(false); setEditingVideo(null); }} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors cursor-pointer">
                                        <X size={20} className="text-slate-500" />
                                    </button>
                                </div>

                                <div className="flex-1 overflow-y-auto p-6 scrollbar-hide">
                                    <form id="video-form" onSubmit={(e) => {
                                        e.preventDefault();
                                        const formData = new FormData(e.target);
                                        const data = Object.fromEntries(formData);
                                        if (editingVideo) handleUpdateVideo({ ...editingVideo, ...data });
                                        else handleAddVideo(data);
                                    }} className={`space-y-6 ${isRTL ? 'text-right' : 'text-left'}`}>
                                        


                                        <div className="space-y-2">
                                            <label className="block text-sm font-semibold mb-2 dark:text-slate-300">{t('dashboard.admin.manageVideos.form.title')}</label>
                                            <input name="title" required value={formValues.title} onChange={handleInputChange} className={`w-full px-4 py-3 border rounded-xl dark:bg-slate-950 border-slate-200 dark:border-slate-700 dark:text-white outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-lg font-medium ${isRTL ? 'text-right' : 'text-left'}`} />
                                        </div>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                            <div className="space-y-2">
                                                <label className="block text-sm font-semibold mb-2 dark:text-slate-300">{t('dashboard.admin.manageVideos.form.instructor')}</label>
                                                <input name="instructor" required value={formValues.instructor?.fullName} onChange={handleInputChange} className={`w-full px-4 py-3 border rounded-xl dark:bg-slate-950 border-slate-200 dark:border-slate-700 dark:text-white outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all font-medium ${isRTL ? 'text-right' : 'text-left'}`} />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="block text-sm font-semibold mb-2 dark:text-slate-300">{t('dashboard.admin.manageVideos.form.course')}</label>
                                                <input name="course" required value={formValues.course} onChange={handleInputChange} className={`w-full px-4 py-3 border rounded-xl dark:bg-slate-950 border-slate-200 dark:border-slate-700 dark:text-white outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all font-medium ${isRTL ? 'text-right' : 'text-left'}`} />
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <label className="block text-sm font-semibold mb-2 dark:text-slate-300">
                                                {isRTL ? 'رابط الصورة المصغرة' : 'Thumbnail URL'}
                                            </label>
                                            <input 
                                                name="thumbnail" 
                                                value={formValues.thumbnail}
                                                onChange={handleInputChange}
                                                placeholder="https://example.com/image.jpg"
                                                className={`w-full px-4 py-3 border rounded-xl dark:bg-slate-950 border-slate-200 dark:border-slate-700 dark:text-white outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all font-medium ${isRTL ? 'text-right' : 'text-left'}`} 
                                            />
                                            <p className="text-[10px] text-slate-500 mt-1">{isRTL ? 'مثال: https://images.unsplash.com/...' : 'Example: https://images.unsplash.com/...'}</p>
                                        </div>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                            <div className="space-y-2">
                                                <label className="block text-sm font-semibold mb-2 dark:text-slate-300">{t('dashboard.admin.manageVideos.form.duration')}</label>
                                                <input name="duration" required value={formValues.duration} onChange={handleInputChange} className={`w-full px-4 py-3 border rounded-xl dark:bg-slate-950 border-slate-200 dark:border-slate-700 dark:text-white outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all font-medium ${isRTL ? 'text-right' : 'text-left'}`} />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="block text-sm font-semibold mb-2 dark:text-slate-300">{t('dashboard.admin.manageVideos.form.status')}</label>
                                                <select name="status" value={formValues.status} onChange={handleInputChange} className={`w-full px-4 py-3 border rounded-xl dark:bg-slate-950 border-slate-200 dark:border-slate-700 dark:text-white outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all font-medium cursor-pointer appearance-none bg-[url('data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20fill%3D%22none%22%20viewBox%3D%220%200%2020%2020%22%3E%3Cpath%20stroke%3D%22%236B7280%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%20stroke-width%3D%221.5%22%20d%3D%22m6%208%204%204%204-4%22%2F%3E%3C%2Fsvg%3E')] bg-[length:20px] ${isRTL ? 'bg-[left_1rem_center]' : 'bg-[right_1rem_center]'} bg-no-repeat ${isRTL ? 'text-right' : 'text-left'}`}>
                                                    <option value="published">{t('dashboard.admin.manageVideos.published')}</option>
                                                    <option value="draft">{t('dashboard.admin.manageVideos.draft')}</option>
                                                    <option value="pending">{t('dashboard.admin.manageVideos.pending')}</option>
                                                </select>
                                            </div>
                                        </div>
                                    </form>
                                </div>
                                
                                <div className="p-6 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 flex gap-3 shrink-0">
                                    <Button variant="ghost" className="flex-1" onClick={() => { setShowVideoModal(false); setEditingVideo(null); }}>{t('common.cancel')}</Button>
                                    <Button className="flex-1" type="submit" form="video-form">{t('common.save')}</Button>
                                </div>
                            </div>

                            {/* Live Preview Side */}
                            <div className="hidden md:flex w-1/2 h-full bg-slate-100/50 dark:bg-slate-950 flex-col items-center justify-center p-10 relative">
                                <div className="absolute inset-0 bg-transparent bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:radial-gradient(ellipse_at_center,black,transparent)] pointer-events-none"></div>
                                
                                <div className="relative w-full max-w-sm">
                                    <div className="absolute -top-10 left-0 right-0 flex justify-center">
                                        <span className="bg-white/80 dark:bg-slate-900/80 text-primary text-xs font-bold px-4 py-1.5 rounded-full border border-primary/20 dark:border-primary/50 shadow-sm backdrop-blur-md relative z-20 flex items-center gap-1.5 animate-pulse">
                                            <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                                            {isRTL ? 'معاينة الفيديو' : 'Video Preview'}
                                        </span>
                                    </div>
                                    <motion.div 
                                        layout
                                        className="bg-white dark:bg-slate-900 rounded-3xl shadow-2xl shadow-slate-200/50 dark:shadow-black/50 border border-slate-100 dark:border-slate-800 overflow-hidden group hover:-translate-y-1 transition-transform duration-300"
                                    >
                                        <div className="h-44 bg-slate-900 relative overflow-hidden flex items-center justify-center">
                                            {formValues.thumbnail ? (
                                                <img src={formValues.thumbnail} alt="" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                                            ) : (
                                                <>
                                                    <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/20 via-purple-500/20 to-pink-500/20 mix-blend-overlay"></div>
                                                    <Youtube className="w-16 h-16 text-slate-700 transition-transform duration-500 group-hover:scale-110 z-10" />
                                                </>
                                            )}
                                        </div>
                                        <div className="p-5 flex-1 flex flex-col text-left text-slate-900 dark:text-white">
                                            <h3 className="font-bold text-lg mb-2 line-clamp-2 leading-tight">
                                                {formValues.title || (isRTL ? 'عنوان الفيديو...' : 'Video Title...')}
                                            </h3>
                                            <p className="text-sm font-medium text-slate-500 line-clamp-1 mb-1">
                                                <User size={14} className="inline mr-1" />
                                                {formValues.instructor || (isRTL ? 'اسم المدرب...' : 'Instructor Name...')}
                                            </p>
                                            <p className="text-xs font-semibold text-primary/80 line-clamp-1 mb-4">
                                                {formValues.course || (isRTL ? 'اسم الدورة...' : 'Course Name...')}
                                            </p>
                                            <div className="flex items-center gap-2 mt-4 pt-4 border-t border-slate-100 dark:border-slate-800">
                                                <span className="flex items-center gap-1.5 bg-slate-100 dark:bg-slate-800 px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-600 dark:text-slate-300">
                                                    <Clock size={14} /> {formatDuration(formValues.duration || 600)}
                                                </span>
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
                    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
                            onClick={() => setShowDeleteConfirm(null)}
                        />
                        <motion.div
                            initial={{ scale: 0.95, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.95, opacity: 0 }}
                            className="relative z-10 w-full max-w-sm bg-white dark:bg-slate-900 rounded-2xl p-6 shadow-2xl border border-slate-100 dark:border-slate-800"
                        >
                            <div className="flex flex-col items-center text-center gap-4">
                                <div className="w-12 h-12 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center text-red-600 dark:text-red-400">
                                    <AlertTriangle size={24} />
                                </div>
                                <div>
                                    <h3 className="text-lg font-bold text-slate-900 dark:text-white">{t('dashboard.admin.manageVideos.deleteTitle')}</h3>
                                    <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">{t('dashboard.admin.manageVideos.deleteContent')}</p>
                                </div>
                                <div className="flex gap-3 w-full mt-2">
                                    <Button variant="ghost" className="flex-1" onClick={() => setShowDeleteConfirm(null)}>{t('common.cancel')}</Button>
                                    <Button variant="danger" className="flex-1" onClick={() => handleDeleteVideo(showDeleteConfirm)}>{t('common.delete')}</Button>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default ManageVideosPage;
