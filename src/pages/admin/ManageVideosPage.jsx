import { useState, useMemo } from 'react';
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
    PauseCircle
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import Button from '../../components/ui/Button';

// ManageVideosPage v1.3 - Fixed ReferenceError (Edit icon)
const ManageVideosPage = () => {
    const { t } = useTranslation();
    const [viewMode, setViewMode] = useState('grid');
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [showVideoModal, setShowVideoModal] = useState(false);
    const [editingVideo, setEditingVideo] = useState(null);

    // Initial Videos state
    const [videos, setVideos] = useState([
        {
            id: 1,
            title: "Introduction to Neural Networks",
            instructor: "Dr. Laila Hassan",
            course: "Machine Learning Fundamentals",
            views: "1.2k",
            duration: "12:45",
            status: "published",
            date: "2024-02-15",
            thumbnail: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&q=80"
        },
        {
            id: 2,
            title: "Advanced React Patterns",
            instructor: "Ahmed Mansour",
            course: "Advanced React Patterns",
            views: "856",
            duration: "25:30",
            status: "published",
            date: "2024-02-10",
            thumbnail: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800&q=80"
        },
        {
            id: 3,
            title: "Data Visualization with D3.js",
            instructor: "Ahmed Mansour",
            course: "Python for Finance",
            views: "0",
            duration: "18:20",
            status: "pending",
            date: "2024-02-25",
            thumbnail: "https://images.unsplash.com/photo-1551434678-e076c223a692?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
        },
        {
            id: 4,
            title: "Ethics in Artificial Intelligence",
            instructor: "Dr. Laila Hassan",
            course: "UX Design for AI Interfaces",
            views: "2.4k",
            duration: "45:00",
            status: "published",
            date: "2024-01-30",
            thumbnail: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
        },
        {
            id: 5,
            title: "Git Workflow for Teams",
            instructor: "Ahmed Mansour",
            course: "Full-Stack Web Development",
            views: "152",
            duration: "10:15",
            status: "draft",
            date: "2024-02-20",
            thumbnail: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800&q=80"
        },
        {
            id: 6,
            title: "Deep Learning Fundamentals",
            instructor: "Dr. Laila Hassan",
            course: "Machine Learning Fundamentals",
            views: "3.1k",
            duration: "32:10",
            status: "published",
            date: "2024-01-12",
            thumbnail: "https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=800&q=80"
        }
    ]);

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
    const handleDeleteVideo = (id) => {
        setVideos(prev => prev.filter(v => v.id !== id));
        toast.success(t('dashboard.admin.manageVideos.toasts.deleteSuccess'));
    };

    const togglePublish = (id) => {
        const video = videos.find(v => v.id === id);
        if (!video) return;

        const newStatus = video.status === 'published' ? 'draft' : 'published';
        toast.success(t(`dashboard.admin.manageVideos.toasts.${newStatus === 'published' ? 'publishSuccess' : 'unpublishSuccess'}`));

        setVideos(prev => prev.map(v => v.id === id ? { ...v, status: newStatus } : v));
    };

    const handleAddVideo = (data) => {
        const newVideo = {
            ...data,
            id: Date.now(),
            views: "0",
            date: new Date().toISOString().split('T')[0],
            thumbnail: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&q=80"
        };
        setVideos(prev => [newVideo, ...prev]);
        setShowVideoModal(false);
        toast.success(t('dashboard.admin.manageVideos.toasts.addSuccess'));
    };

    const handleUpdateVideo = (data) => {
        setVideos(prev => prev.map(v => v.id === data.id ? { ...v, ...data } : v));
        setEditingVideo(null);
        setShowVideoModal(false);
        toast.success(t('dashboard.admin.manageVideos.toasts.updateSuccess'));
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
                    <Button onClick={() => setShowVideoModal(true)}>
                        <Upload size={18} className={`${t('dir') === 'rtl' ? 'ml-2' : 'mr-2'}`} /> {t('dashboard.admin.manageVideos.uploadNew')}
                    </Button>
                </div>
            </div>

            {/* Filters */}
            <div className="flex flex-col md:flex-row gap-4 bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-100 dark:border-slate-800 shadow-sm">
                <div className="relative flex-1">
                    <Search className={`absolute ${t('dir') === 'rtl' ? 'right-3' : 'left-3'} top-1/2 -translate-y-1/2 text-slate-400`} size={18} />
                    <input
                        type="text"
                        placeholder={t('dashboard.admin.manageVideos.searchPlaceholder')}
                        className={`w-full ${t('dir') === 'rtl' ? 'pr-10 pl-4 text-right' : 'pl-10 pr-4 text-left'} py-2 bg-slate-50 dark:bg-slate-800 border-none rounded-lg text-slate-900 dark:text-white focus:ring-2 focus:ring-primary outline-none`}
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>

                <div className="flex items-center gap-3">
                    <select
                        className={`bg-slate-50 dark:bg-slate-800 border-none rounded-lg px-4 py-2 text-sm outline-none text-slate-700 dark:text-slate-200 ${t('dir') === 'rtl' ? 'text-right' : 'text-left'}`}
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
            {filteredVideos && filteredVideos.length > 0 ? (
                viewMode === 'grid' ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                        {filteredVideos.map((video) => (
                            <div key={video.id} className="bg-white dark:bg-slate-900 rounded-2xl overflow-hidden border border-slate-100 dark:border-slate-800 shadow-sm flex flex-col">
                                <div className="relative aspect-video bg-slate-100 dark:bg-slate-800">
                                    {video.thumbnail && <img src={video.thumbnail} alt="" className="w-full h-full object-cover" />}
                                    <span className={`absolute bottom-2 ${t('dir') === 'rtl' ? 'left-2' : 'right-2'} px-1.5 py-0.5 bg-black/70 text-white text-[10px] font-bold rounded uppercase`}>{video.duration}</span>
                                    <span className={`absolute top-2 ${t('dir') === 'rtl' ? 'left-2' : 'right-2'} px-1.5 py-0.5 text-[10px] font-bold rounded uppercase tracking-wider ${getStatusStyle(video.status)}`}>
                                        {t(`dashboard.admin.manageVideos.${video.status}`)}
                                    </span>
                                </div>
                                <div className="p-5 flex-1 flex flex-col text-left">
                                    <h3 className="font-bold text-slate-900 dark:text-white mb-2 line-clamp-1">{video.title}</h3>
                                    <div className="space-y-1.5 mb-4">
                                        <div className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-2"><User size={14} className="text-primary" /> {video.instructor}</div>
                                        <div className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-2 font-medium">{video.course}</div>
                                    </div>
                                    <div className="mt-auto pt-4 border-t border-slate-50 dark:border-slate-800 flex items-center justify-between">
                                        <div className={`flex gap-3 text-[10px] text-slate-400 ${t('dir') === 'rtl' ? 'flex-row-reverse' : 'flex-row'}`}>
                                            <span className="flex items-center gap-1"><Eye size={12} /> {video.views}</span>
                                            <span className="flex items-center gap-1"><Calendar size={12} /> {video.date}</span>
                                        </div>
                                        <div className="flex gap-1">
                                            <button onClick={() => { setEditingVideo(video); setShowVideoModal(true); }} className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors text-slate-500"><Edit size={16} /></button>
                                            <button onClick={() => togglePublish(video.id)} className={`p-1.5 rounded-lg transition-colors ${video.status === 'published' ? 'text-amber-500 hover:bg-amber-50' : 'text-green-500 hover:bg-green-50'}`}>{video.status === 'published' ? <PauseCircle size={16} /> : <CheckCircle size={16} />}</button>
                                            <button onClick={() => handleDeleteVideo(video.id)} className="p-1.5 hover:bg-red-50 rounded-lg text-red-500 transition-colors"><Trash2 size={16} /></button>
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
                                    <th className={`px-6 py-4 ${t('dir') === 'rtl' ? 'text-left' : 'text-right'}`}>{t('dashboard.admin.manageVideos.table.actions')}</th>
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
                                        <td className="px-6 py-4 whitespace-nowrap text-slate-600 dark:text-slate-300">{video.instructor}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-[11px] text-slate-500">
                                            <div className="flex flex-col gap-0.5">
                                                <span className="flex items-center gap-1"><Eye size={12} /> {video.views}</span>
                                                <span className="flex items-center gap-1"><Clock size={12} /> {video.duration}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`px-2 py-0.5 text-[10px] font-bold rounded-full uppercase tracking-wider ${getStatusStyle(video.status)}`}>
                                                {t(`dashboard.admin.manageVideos.${video.status}`)}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right">
                                            <div className="flex justify-end gap-1 text-slate-500">
                                                <button onClick={() => { setEditingVideo(video); setShowVideoModal(true); }} className="p-1.5 hover:bg-slate-100 rounded-lg"><Edit size={16} /></button>
                                                <button onClick={() => togglePublish(video.id)} className={`p-1.5 rounded-lg ${video.status === 'published' ? 'hover:bg-amber-50 text-amber-500' : 'hover:bg-green-50 text-green-500'}`}>{video.status === 'published' ? <PauseCircle size={16} /> : <CheckCircle size={16} />}</button>
                                                <button onClick={() => handleDeleteVideo(video.id)} className="p-1.5 hover:bg-red-50 rounded-lg text-red-500"><Trash2 size={16} /></button>
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
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => { setShowVideoModal(false); setEditingVideo(null); }} />
                         <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="relative w-full max-w-md bg-white dark:bg-slate-900 rounded-2xl shadow-2xl overflow-hidden text-left">
                            <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
                                <h2 className="text-xl font-bold dark:text-white">{editingVideo ? t('dashboard.admin.manageVideos.editTitle') : t('dashboard.admin.manageVideos.addTitle')}</h2>
                                <button onClick={() => { setShowVideoModal(false); setEditingVideo(null); }} className="p-2 hover:bg-slate-100 rounded-full"><X size={20} className="text-slate-500" /></button>
                            </div>
                            <form onSubmit={(e) => {
                                e.preventDefault();
                                const formData = new FormData(e.target);
                                const data = Object.fromEntries(formData);
                                if (editingVideo) handleUpdateVideo({ ...editingVideo, ...data });
                                else handleAddVideo(data);
                            }} className={`p-6 space-y-4 ${t('dir') === 'rtl' ? 'text-right' : 'text-left'}`}>
                                <div>
                                    <label className="block text-sm font-medium mb-1 dark:text-slate-300">{t('dashboard.admin.manageVideos.form.title')}</label>
                                    <input name="title" required defaultValue={editingVideo?.title || ''} className={`w-full px-4 py-2 border rounded-xl dark:bg-slate-800 dark:border-slate-700 dark:text-white outline-none ${t('dir') === 'rtl' ? 'text-right' : 'text-left'}`} />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium mb-1 dark:text-slate-300">{t('dashboard.admin.manageVideos.form.instructor')}</label>
                                        <input name="instructor" required defaultValue={editingVideo?.instructor || ''} className={`w-full px-4 py-2 border rounded-xl dark:bg-slate-800 dark:border-slate-700 dark:text-white outline-none ${t('dir') === 'rtl' ? 'text-right' : 'text-left'}`} />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium mb-1 dark:text-slate-300">{t('dashboard.admin.manageVideos.form.course')}</label>
                                        <input name="course" required defaultValue={editingVideo?.course || ''} className={`w-full px-4 py-2 border rounded-xl dark:bg-slate-800 dark:border-slate-700 dark:text-white outline-none ${t('dir') === 'rtl' ? 'text-right' : 'text-left'}`} />
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium mb-1 dark:text-slate-300">{t('dashboard.admin.manageVideos.form.duration')}</label>
                                        <input name="duration" required defaultValue={editingVideo?.duration || '10:00'} className={`w-full px-4 py-2 border rounded-xl dark:bg-slate-800 dark:border-slate-700 dark:text-white outline-none ${t('dir') === 'rtl' ? 'text-right' : 'text-left'}`} />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium mb-1 dark:text-slate-300">{t('dashboard.admin.manageVideos.form.status')}</label>
                                        <select name="status" defaultValue={editingVideo?.status || 'published'} className={`w-full px-4 py-2 border rounded-xl dark:bg-slate-800 dark:border-slate-700 dark:text-white outline-none ${t('dir') === 'rtl' ? 'text-right' : 'text-left'}`}>
                                            <option value="published">{t('dashboard.admin.manageVideos.published')}</option>
                                            <option value="draft">{t('dashboard.admin.manageVideos.draft')}</option>
                                            <option value="pending">{t('dashboard.admin.manageVideos.pending')}</option>
                                        </select>
                                    </div>
                                </div>
                                <div className="pt-4 flex gap-3">
                                    <Button variant="outline" className="flex-1" onClick={() => { setShowVideoModal(false); setEditingVideo(null); }}>{t('common.cancel')}</Button>
                                    <Button className="flex-1" type="submit">{t('common.save')}</Button>
                                </div>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default ManageVideosPage;
