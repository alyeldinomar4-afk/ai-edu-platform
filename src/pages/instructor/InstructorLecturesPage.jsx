import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Video,
    Search,
    Play,
    Clock,
    Eye,
    Trash2,
    CheckCircle,
    LayoutGrid,
    List as ListIcon,
    Upload,
    Calendar,
    X,
    Edit,
    PauseCircle,
    FileText,
    UploadCloud,
    Bot,
    Zap
} from 'lucide-react';
import Button from '../../components/ui/Button';
import { lectures } from '../../data/mockData';
import toast from 'react-hot-toast';

import { useTranslation } from 'react-i18next';

// InstructorLecturesPage v1.3 - Localized and RTL support
const InstructorLecturesPage = () => {
    const { t, i18n } = useTranslation();
    const isRTL = i18n.language === 'ar';
    const [viewMode, setViewMode] = useState('list');
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [showVideoModal, setShowVideoModal] = useState(false);
    const [editingVideo, setEditingVideo] = useState(null);
    const [isSaving, setIsSaving] = useState(false);
    const [selectedFiles, setSelectedFiles] = useState([]);
    const [showQuizBuilder, setShowQuizBuilder] = useState(false);
    const [quizQuestions, setQuizQuestions] = useState([]);

    const addQuestion = () => {
        setQuizQuestions(prev => [...prev, { question: '', options: ['', '', '', ''], correctAnswer: 0 }]);
    };

    const updateQuestion = (index, field, value) => {
        setQuizQuestions(prev => prev.map((q, i) => i === index ? { ...q, [field]: value } : q));
    };

    const removeQuestion = (index) => {
        setQuizQuestions(prev => prev.filter((_, i) => i !== index));
    };

    // Initial Videos state
    const [videos, setVideos] = useState(lectures);

    // Filtering Logic
    const filteredVideos = useMemo(() => {
        if (!videos || !Array.isArray(videos)) return [];
        const search = searchTerm.toLowerCase();
        return videos.filter(video => {
            const title = video.title.toLowerCase();
            const course = video.course.toLowerCase();
            const matchesSearch = title.includes(search) || course.includes(search);
            const matchesStatus = statusFilter === 'all' || video.status === statusFilter;
            return matchesSearch && matchesStatus;
        });
    }, [videos, searchTerm, statusFilter]);

    // Actions
    const handleDeleteVideo = (id) => {
        setVideos(prev => prev.filter(v => v.id !== id));
        toast.success(t('dashboard.instructor.lectures.toasts.deleteSuccess'));
    };

    const togglePublish = (id) => {
        const video = videos.find(v => v.id === id);
        if (!video) return;

        const newStatus = video.status === 'published' ? 'draft' : 'published';
        toast.success(t('dashboard.instructor.lectures.toasts.statusUpdate', { status: t(`dashboard.instructor.lectures.${newStatus}`) }));

        setVideos(prev => prev.map(v => v.id === id ? { ...v, status: newStatus } : v));
    };

    const handleAddVideo = async (data) => {
        setIsSaving(true);
        // Simulate API saving
        await new Promise(resolve => setTimeout(resolve, 800));

        const newVideo = {
            ...data,
            id: Date.now(),
            views: "0",
            date: new Date().toISOString().split('T')[0],
            thumbnail: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&q=80"
        };
        setVideos(prev => [newVideo, ...prev]);
        setShowVideoModal(false);
        setIsSaving(false);
        setSelectedFiles([]);
        setShowQuizBuilder(false);
        setQuizQuestions([]);
        toast.success(t('dashboard.instructor.lectures.toasts.uploadSuccess'));
    };

    const handleUpdateVideo = async (data) => {
        setIsSaving(true);
        // Simulate API updating
        await new Promise(resolve => setTimeout(resolve, 800));

        setVideos(prev => prev.map(v => v.id === data.id ? { ...v, ...data } : v));
        setEditingVideo(null);
        setShowVideoModal(false);
        setIsSaving(false);
        setSelectedFiles([]);
        setShowQuizBuilder(false);
        setQuizQuestions([]);
        toast.success(t('dashboard.instructor.lectures.toasts.updateSuccess'));
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
        <div className="min-h-screen transition-colors duration-300">
            {/* Main Container */}
            <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10 mb-24">

                {/* Header Section */}
                <div className={`flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 ${isRTL ? 'text-right' : 'text-left'}`}>
                    <div className={isRTL ? 'text-right' : 'text-left'}>
                        <motion.h1
                            initial={{ opacity: 0, x: isRTL ? 20 : -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight"
                        >
                            {t('dashboard.instructor.lectures.title')}
                        </motion.h1>
                        <motion.p
                            initial={{ opacity: 0, x: isRTL ? 20 : -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.1 }}
                            className="text-slate-500 dark:text-slate-400 mt-1"
                        >
                            {t('dashboard.instructor.lectures.subtitle')}
                        </motion.p>
                    </div>
                    <motion.div
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                    >
                        <Button
                            onClick={() => setShowVideoModal(true)}
                            className="shadow-lg shadow-primary/25 hover:shadow-primary/40 px-6 py-2.5"
                        >
                            <Upload size={20} className={isRTL ? 'ml-2' : 'mr-2'} /> {t('dashboard.instructor.lectures.uploadNew')}
                        </Button>
                    </motion.div>
                </div>

                {/* Filters Row */}
                <div className={`flex flex-col md:flex-row gap-4 bg-white dark:bg-slate-900/50 p-2 rounded-2xl border border-slate-200/60 dark:border-slate-800/60 shadow-sm backdrop-blur-sm ${isRTL ? 'flex-row-reverse' : ''}`}>
                    <div className="relative flex-1">
                        <Search className={`absolute ${isRTL ? 'right-4' : 'left-4'} top-1/2 -translate-y-1/2 text-slate-400`} size={18} />
                        <input
                            type="text"
                            placeholder={t('dashboard.instructor.lectures.searchPlaceholder')}
                            className={`w-full ${isRTL ? 'pr-12 pl-4 text-right' : 'pl-12 pr-4 text-left'} py-3 bg-transparent border-none rounded-xl text-slate-900 dark:text-white focus:ring-0 outline-none placeholder:text-slate-400 transition-all`}
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>

                    <div className={`flex items-center gap-2 ${isRTL ? 'border-r pr-2' : 'border-l pl-2'} border-slate-200 dark:border-slate-800 ml-0 md:ml-2`}>
                        <select
                            className={`bg-transparent border-none rounded-xl px-4 py-2 text-sm font-medium outline-none text-slate-700 dark:text-slate-200 focus:ring-0 cursor-pointer [&>option]:dark:bg-slate-900 [&>option]:dark:text-white ${isRTL ? 'text-right' : 'text-left'}`}
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                        >
                            <option value="all">{t('dashboard.instructor.lectures.allStatus')}</option>
                            <option value="published">{t('dashboard.instructor.lectures.published')}</option>
                            <option value="pending">{t('dashboard.instructor.lectures.pending')}</option>
                            <option value="draft">{t('dashboard.instructor.lectures.draft')}</option>
                        </select>

                        <div className="h-6 w-px bg-slate-200 dark:bg-slate-800 mx-1" />

                        <div className="flex bg-slate-100/80 dark:bg-slate-800/80 p-1 rounded-xl">
                            <button
                                onClick={() => setViewMode('grid')}
                                className={`p-2 rounded-lg transition-all ${viewMode === 'grid' ? 'bg-white dark:bg-slate-700 text-primary shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                            >
                                <LayoutGrid size={18} />
                            </button>
                            <button
                                onClick={() => setViewMode('list')}
                                className={`p-2 rounded-lg transition-all ${viewMode === 'list' ? 'bg-white dark:bg-slate-700 text-primary shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                            >
                                <ListIcon size={18} />
                            </button>
                        </div>
                    </div>
                </div>

                {/* Content Area */}
                <AnimatePresence mode="wait">
                    {filteredVideos && filteredVideos.length > 0 ? (
                        viewMode === 'grid' ? (
                            <motion.div
                                key="grid"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 text-left"
                            >
                                 {filteredVideos.map((video) => (
                                    <div key={video.id} className={`group bg-white dark:bg-slate-900 rounded-2xl overflow-hidden border border-slate-200/60 dark:border-slate-800 shadow-md hover:shadow-xl transition-all duration-300 flex flex-col ${isRTL ? 'text-right' : 'text-left'}`}>
                                        <div className="relative aspect-video overflow-hidden">
                                            {video.thumbnail && <img src={video.thumbnail} alt="" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />}
                                            <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors" />
                                            <span className={`absolute bottom-3 ${isRTL ? 'left-3' : 'right-3'} px-2 py-1 bg-black/70 backdrop-blur-sm text-white text-[11px] font-bold rounded-lg`}>{video.duration}</span>
                                            <span className={`absolute top-3 ${isRTL ? 'right-3' : 'left-3'} px-2 py-1 text-[10px] font-bold rounded-lg uppercase tracking-wider shadow-sm ${getStatusStyle(video.status)}`}>
                                                {t(`dashboard.instructor.lectures.${video.status}`)}
                                            </span>
                                        </div>
                                        <div className="p-6 flex-1 flex flex-col">
                                            <h3 className="font-bold text-slate-900 dark:text-white mb-2 line-clamp-2 leading-snug">{video.title}</h3>
                                            <p className="text-sm text-slate-500 dark:text-slate-400 mb-6 font-medium bg-slate-50 dark:bg-slate-800/50 py-1 px-2 rounded-md inline-block w-fit">{video.course}</p>
                                            <div className={`mt-auto pt-5 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between ${isRTL ? 'flex-row-reverse' : ''}`}>
                                                <div className={`flex gap-4 text-[11px] text-slate-400 font-medium ${isRTL ? 'flex-row-reverse' : ''}`}>
                                                    <span className="flex items-center gap-1.5"><Eye size={14} /> {video.views}</span>
                                                    <span className="flex items-center gap-1.5"><Calendar size={14} /> {video.date}</span>
                                                </div>
                                                <div className="flex gap-2">
                                                    <button onClick={() => { setEditingVideo(video); setShowVideoModal(true); }} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors text-slate-500"><Edit size={18} /></button>
                                                    <button onClick={() => togglePublish(video.id)} className={`p-2 rounded-xl transition-colors ${video.status === 'published' ? 'hover:bg-amber-50 dark:hover:bg-amber-900/20 text-amber-500' : 'hover:bg-green-50 dark:hover:bg-green-900/20 text-green-500'}`}>{video.status === 'published' ? <PauseCircle size={18} /> : <CheckCircle size={18} />}</button>
                                                    <button onClick={() => handleDeleteVideo(video.id)} className="p-2 hover:bg-red-50 dark:hover:bg-red-900/20 text-red-500 transition-colors"><Trash2 size={18} /></button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </motion.div>
                        ) : (
                            <motion.div
                                key="list"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                className="bg-white dark:bg-slate-900 p-1 rounded-2xl border border-slate-200/60 dark:border-slate-800/60 shadow-xl overflow-hidden overflow-x-auto text-left"
                            >
                                <table className={`w-full min-w-[700px] ${isRTL ? 'text-right' : 'text-left'}`}>
                                    <thead>
                                        <tr className="border-b border-slate-100 dark:border-slate-800 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                                            <th className="px-8 py-5">{t('dashboard.instructor.lectures.table.details')}</th>
                                            <th className="px-6 py-5 text-center">{t('dashboard.instructor.lectures.table.engagement')}</th>
                                            <th className="px-6 py-5 text-center">{t('dashboard.instructor.lectures.table.status')}</th>
                                            <th className={`px-8 py-5 ${isRTL ? 'text-left' : 'text-right'}`}>{t('dashboard.instructor.lectures.table.actions')}</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-50 dark:divide-slate-800/50">
                                        {filteredVideos.map((video) => (
                                            <tr key={video.id} className="group hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-all duration-200">
                                                <td className="px-8 py-5">
                                                    <div className="flex items-center gap-4">
                                                        <div className="w-16 h-10 bg-slate-100 dark:bg-slate-800 rounded-lg overflow-hidden flex-shrink-0 shadow-sm">
                                                            {video.thumbnail && <img src={video.thumbnail} className="w-full h-full object-cover" alt="" />}
                                                        </div>
                                                        <div>
                                                            <p className="font-bold text-slate-900 dark:text-white group-hover:text-primary transition-colors mb-0.5">{video.title}</p>
                                                            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">{video.course}</p>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-5">
                                                    <div className="flex flex-col items-center gap-1.5 text-slate-500">
                                                        <span className="flex items-center gap-1.5 text-xs font-semibold"><Eye size={14} className="text-slate-400" /> {video.views}</span>
                                                        <span className="flex items-center gap-1.5 text-[11px] font-medium"><Clock size={14} className="text-slate-400" /> {video.duration}</span>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-5 text-center">
                                                    <span className={`inline-flex px-3 py-1 text-[10px] font-bold rounded-full uppercase tracking-widest shadow-sm ${getStatusStyle(video.status)}`}>
                                                        {t(`dashboard.instructor.lectures.${video.status}`)}
                                                    </span>
                                                </td>
                                                <td className={`px-8 py-5 ${isRTL ? 'text-left' : 'text-right'}`}>
                                                    <div className="flex justify-end gap-2 opacity-100 transition-opacity">
                                                        <button
                                                            onClick={() => { setEditingVideo(video); setShowVideoModal(true); }}
                                                            className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl text-slate-500 border border-transparent hover:border-slate-200 dark:hover:border-slate-700 transition-all"
                                                        >
                                                            <Edit size={18} />
                                                        </button>
                                                        <button
                                                            onClick={() => togglePublish(video.id)}
                                                            className={`p-2 rounded-xl transition-all border border-transparent ${video.status === 'published' ? 'hover:bg-amber-50 dark:hover:bg-amber-900/20 text-amber-500 hover:border-amber-100' : 'hover:bg-green-50 dark:hover:bg-green-900/20 text-green-500 hover:border-green-100'}`}
                                                        >
                                                            {video.status === 'published' ? <PauseCircle size={18} /> : <CheckCircle size={18} />}
                                                        </button>
                                                        <button
                                                            onClick={() => handleDeleteVideo(video.id)}
                                                            className="p-2 hover:bg-red-50 dark:hover:bg-red-900/20 text-red-500 border border-transparent hover:border-red-100 transition-all"
                                                        >
                                                            <Trash2 size={18} />
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </motion.div>
                        )
                    ) : (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="bg-white dark:bg-slate-900 py-24 rounded-3xl border border-dashed border-slate-300 dark:border-slate-700"
                        >
                            <div className="flex flex-col items-center gap-4">
                                <div className="w-20 h-20 bg-slate-50 dark:bg-slate-800 rounded-full flex items-center justify-center">
                                    <Video size={32} className="text-slate-300" />
                                </div>
                                <h3 className="text-xl font-bold text-slate-900 dark:text-white">{t('dashboard.instructor.lectures.noFound')}</h3>
                                <p className="text-slate-500 dark:text-slate-400 max-w-xs text-sm text-center">{t('dashboard.instructor.lectures.noFoundHint')}</p>
                                <Button variant="outline" onClick={() => { setSearchTerm(''); setStatusFilter('all'); }} className="px-8">
                                    {t('dashboard.instructor.lectures.clearFilters')}
                                </Button>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* Modal */}
            <AnimatePresence>
                {showVideoModal && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-slate-900/60 backdrop-blur-md" onClick={() => { setShowVideoModal(false); setEditingVideo(null); }} />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            className="relative w-full max-w-lg bg-white dark:bg-slate-900 rounded-[2rem] shadow-2xl overflow-hidden border border-white/20"
                        >
                            <div className="p-8 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-800/50">
                                <div>
                                    <h2 className="text-2xl font-bold text-slate-900 dark:text-white">{editingVideo ? t('dashboard.instructor.lectures.editTitle') : t('dashboard.instructor.lectures.addTitle')}</h2>
                                    <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">{t('dashboard.instructor.lectures.modalSubtitle')}</p>
                                </div>
                                <button onClick={() => { setShowVideoModal(false); setEditingVideo(null); }} className={`p-3 hover:bg-white dark:hover:bg-slate-700 rounded-full shadow-sm transition-all ${isRTL ? 'mr-auto' : 'ml-auto'}`}><X size={20} className="text-slate-500" /></button>
                            </div>

                            <form onSubmit={(e) => {
                                e.preventDefault();
                                const formData = new FormData(e.target);
                                const data = Object.fromEntries(formData);
                                if (!data.title.trim()) {
                                    toast.error(t('dashboard.instructor.lectures.toasts.titleRequired'));
                                    return;
                                }
                                const finalData = { ...data, quiz: showQuizBuilder ? quizQuestions : [] };
                                if (editingVideo) handleUpdateVideo({ ...editingVideo, ...finalData });
                                else handleAddVideo(finalData);
                            }} className="overflow-y-auto max-h-[80vh]">
                                <div className="p-8 space-y-6 text-left">
                                    <div className="space-y-2">
                                        <label className={`text-sm font-semibold text-slate-700 dark:text-slate-300 ${isRTL ? 'mr-1' : 'ml-1'}`}>{t('dashboard.instructor.lectures.form.title')}</label>
                                        <input name="title" required defaultValue={editingVideo?.title || ''} placeholder={t('dashboard.instructor.lectures.form.titlePlaceholder')} className={`w-full px-5 py-3.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl dark:text-white outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all ${isRTL ? 'text-right' : 'text-left'}`} />
                                    </div>

                                    <div className="space-y-2">
                                        <label className={`text-sm font-semibold text-slate-700 dark:text-slate-300 ${isRTL ? 'mr-1' : 'ml-1'}`}>{t('dashboard.instructor.lectures.form.course')}</label>
                                        <input name="course" required defaultValue={editingVideo?.course || ''} placeholder={t('dashboard.instructor.lectures.form.coursePlaceholder')} className={`w-full px-5 py-3.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl dark:text-white outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all ${isRTL ? 'text-right' : 'text-left'}`} />
                                    </div>

                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <label className={`text-sm font-semibold text-slate-700 dark:text-slate-300 ${isRTL ? 'mr-1' : 'ml-1'}`}>{t('dashboard.instructor.lectures.form.duration')}</label>
                                            <div className="relative">
                                                <Clock className={`absolute ${isRTL ? 'right-4' : 'left-4'} top-1/2 -translate-y-1/2 text-slate-400`} size={16} />
                                                <input name="duration" required defaultValue={editingVideo?.duration || '10:00'} className={`w-full ${isRTL ? 'pr-11 pl-4 text-right' : 'pl-11 pr-4 text-left'} py-3.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl dark:text-white outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all`} />
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <label className={`text-sm font-semibold text-slate-700 dark:text-slate-300 ${isRTL ? 'mr-1' : 'ml-1'}`}>{t('dashboard.instructor.lectures.form.privacy')}</label>
                                            <select name="status" defaultValue={editingVideo?.status || 'published'} className={`w-full px-5 py-3.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl dark:text-white outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all cursor-pointer appearance-none bg-[url('data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20fill%3D%22none%22%20viewBox%3D%220%200%2020%2020%22%3E%3Cpath%20stroke%3D%22%236B7280%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%20stroke-width%3D%221.5%22%20d%3D%22m6%208%204%204%204-4%22%2F%3E%3C%2Fsvg%3E')] bg-[length:20px] ${isRTL ? 'bg-[left_1rem_center]' : 'bg-[right_1rem_center]'} bg-no-repeat ${isRTL ? 'text-right' : 'text-left'}`}>
                                                <option value="published">{t('dashboard.instructor.lectures.form.public')}</option>
                                                <option value="draft">{t('dashboard.instructor.lectures.form.private')}</option>
                                                <option value="pending">{t('dashboard.instructor.lectures.form.pending')}</option>
                                            </select>
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <label className={`text-sm font-semibold text-slate-700 dark:text-slate-300 ${isRTL ? 'mr-1' : 'ml-1'}`}>{t('dashboard.instructor.lectures.form.resources')}</label>
                                        <div
                                            className="w-full border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-2xl p-6 flex flex-col items-center justify-center bg-slate-50 dark:bg-slate-800/50 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer group"
                                            onClick={() => document.getElementById('resource-file-upload').click()}
                                        >
                                            <UploadCloud className="w-8 h-8 text-slate-400 group-hover:text-primary transition-colors mb-2" />
                                            <p className="text-sm font-medium text-slate-600 dark:text-slate-300">
                                                {selectedFiles.length > 0
                                                    ? `${selectedFiles.length} file(s) selected`
                                                    : t('dashboard.instructor.lectures.form.uploadResources')}
                                            </p>
                                            <p className="text-xs text-slate-500 mt-1">{t('dashboard.instructor.lectures.form.uploadHint')}</p>
                                            <input
                                                type="file"
                                                id="resource-file-upload"
                                                className="hidden"
                                                multiple
                                                accept=".pdf,.doc,.docx,.zip,.rar"
                                                onChange={(e) => {
                                                    if (e.target.files && e.target.files.length > 0) {
                                                        setSelectedFiles(Array.from(e.target.files));
                                                    }
                                                }}
                                            />
                                        </div>

                                        {selectedFiles.length > 0 && (
                                            <div className="mt-4 space-y-2">
                                                {selectedFiles.map((file, idx) => (
                                                    <div key={idx} className="flex justify-between items-center bg-slate-100 dark:bg-slate-800 px-4 py-2 rounded-lg text-sm">
                                                        <span className="truncate text-slate-700 dark:text-slate-300">{file.name}</span>
                                                        <button
                                                            type="button"
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                setSelectedFiles(prev => prev.filter((_, i) => i !== idx));
                                                            }}
                                                            className="text-slate-400 hover:text-red-500 transition-colors"
                                                        >
                                                            <X size={14} />
                                                        </button>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>

                                    {/* Quiz Section Inline */}
                                    <div className="pt-4 space-y-4">
                                        <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800/80 rounded-2xl border border-slate-200 dark:border-slate-700">
                                            <div className="flex items-center gap-3">
                                                <Bot className="text-primary" size={24} />
                                                <div>
                                                    <h3 className="text-sm font-bold text-slate-900 dark:text-white">{t('dashboard.instructor.lectures.quiz.title')}</h3>
                                                    <p className="text-xs text-slate-500">{t('dashboard.instructor.lectures.quiz.add')}</p>
                                                </div>
                                            </div>
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    setShowQuizBuilder(!showQuizBuilder);
                                                    if (!showQuizBuilder && quizQuestions.length === 0) addQuestion();
                                                }}
                                                className={`px-4 py-2 rounded-xl transition-all font-bold text-xs ${showQuizBuilder ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'bg-white dark:bg-slate-700 text-slate-600 dark:text-slate-300'}`}
                                            >
                                                {showQuizBuilder ? t('dashboard.instructor.lectures.quiz.active') : t('dashboard.instructor.lectures.quiz.add')}
                                            </button>
                                        </div>

                                        <AnimatePresence>
                                            {showQuizBuilder && (
                                                <motion.div
                                                    initial={{ height: 0, opacity: 0 }}
                                                    animate={{ height: 'auto', opacity: 1 }}
                                                    exit={{ height: 0, opacity: 0 }}
                                                    className="overflow-hidden space-y-4"
                                                >
                                                    {quizQuestions.map((q, qIdx) => (
                                                        <div key={qIdx} className="p-5 pt-12 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl space-y-4 relative shadow-sm">
                                                            <button
                                                                type="button"
                                                                onClick={() => removeQuestion(qIdx)}
                                                                className={`absolute top-4 ${isRTL ? 'left-4' : 'right-4'} p-2 text-slate-300 hover:text-red-500 transition-colors`}
                                                            >
                                                                <X size={16} />
                                                            </button>
                                                            <div className="space-y-2">
                                                                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{t('dashboard.instructor.lectures.quiz.question')} {qIdx + 1}</label>
                                                                <input
                                                                    value={q.question}
                                                                    onChange={(e) => updateQuestion(qIdx, 'question', e.target.value)}
                                                                    placeholder={t('dashboard.instructor.lectures.quiz.questionPlaceholder')}
                                                                    className={`w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-xl outline-none focus:ring-2 focus:ring-primary/20 dark:text-white text-sm ${isRTL ? 'text-right' : 'text-left'}`}
                                                                />
                                                            </div>
                                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                                                {q.options.map((opt, oIdx) => (
                                                                    <div key={oIdx} className="flex items-center gap-2 group">
                                                                        <button
                                                                            type="button"
                                                                            onClick={() => updateQuestion(qIdx, 'correctAnswer', oIdx)}
                                                                            className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 transition-all ${q.correctAnswer === oIdx ? 'bg-primary border-primary text-white font-bold' : 'border-slate-200 dark:border-slate-700 hover:border-primary'}`}
                                                                        >
                                                                            {q.correctAnswer === oIdx && <CheckCircle size={12} />}
                                                                        </button>
                                                                        <input
                                                                            value={opt}
                                                                            onChange={(e) => {
                                                                                const newOptions = [...q.options];
                                                                                newOptions[oIdx] = e.target.value;
                                                                                updateQuestion(qIdx, 'options', newOptions);
                                                                            }}
                                                                            placeholder={`${t('dashboard.instructor.lectures.quiz.option')} ${oIdx + 1}`}
                                                                            className={`flex-1 px-3 py-2 text-xs bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-lg outline-none focus:ring-2 focus:ring-primary/20 dark:text-white ${isRTL ? 'text-right' : 'text-left'}`}
                                                                        />
                                                                    </div>
                                                                ))}
                                                            </div>
                                                        </div>
                                                    ))}
                                                    <button
                                                        type="button"
                                                        onClick={addQuestion}
                                                        className="w-full py-4 border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-2xl flex items-center justify-center gap-2 text-slate-400 hover:text-primary hover:border-primary/50 transition-all font-bold text-sm"
                                                    >
                                                        <Zap size={16} />
                                                        {t('dashboard.instructor.lectures.quiz.addQuestion')}
                                                    </button>
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                    </div>

                                    <div className={`pt-6 flex gap-4 sticky bottom-0 bg-white dark:bg-slate-900 pb-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
                                        <Button type="button" variant="outline" className="flex-1 py-3.5 rounded-2xl font-bold" onClick={() => { setShowVideoModal(false); setEditingVideo(null); setSelectedFiles([]); setShowQuizBuilder(false); setQuizQuestions([]); }} disabled={isSaving}>{t('dashboard.instructor.lectures.form.discard')}</Button>
                                        <Button className="flex-1 py-3.5 rounded-2xl font-bold shadow-lg shadow-primary/20" type="submit" disabled={isSaving}>
                                            {isSaving ? t('dashboard.instructor.lectures.form.saving') : (editingVideo ? t('dashboard.instructor.lectures.form.update') : t('dashboard.instructor.lectures.form.confirm'))}
                                        </Button>
                                    </div>
                                </div>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default InstructorLecturesPage;
