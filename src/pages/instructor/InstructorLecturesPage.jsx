import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
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
    Zap,
    ArrowLeft,
    ArrowRight,
    Sparkles,
    Youtube
} from 'lucide-react';
import Button from '../../components/ui/Button';
import { lectures } from '../../data/mockData';
import toast from 'react-hot-toast';

import { useTranslation } from 'react-i18next';

// InstructorLecturesPage v1.3 - Localized and RTL support
const InstructorLecturesPage = () => {
    const { t, i18n } = useTranslation();
    const navigate = useNavigate();
    const isRTL = i18n.language === 'ar';
    const [viewMode, setViewMode] = useState('grid');
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [showVideoModal, setShowVideoModal] = useState(false);
    const [editingVideo, setEditingVideo] = useState(null);
    const [thumbnailUrl, setThumbnailUrl] = useState('https://images.unsplash.com/photo-1516321318423-f06f85e504b3?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80');
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
            thumbnail: data.thumbnail || "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&q=80"
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
                {/* Navigation Back */}
                <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                >
                    <button
                        onClick={() => navigate('/instructor/dashboard')}
                        className={`group flex items-center gap-2.5 text-slate-500 hover:text-primary transition-all font-semibold text-sm ${isRTL ? 'flex-row-reverse text-right' : 'text-left'}`}
                    >
                        <div className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 group-hover:bg-primary/10 group-hover:text-primary transition-colors">
                            {isRTL ? <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" /> : <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />}
                        </div>
                        {t('dashboard.instructor.lectures.backToDashboard')}
                    </button>
                </motion.div>

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
                    <motion.button 
                        whileHover={{ scale: 1.02 }} 
                        whileTap={{ scale: 0.98 }} 
                        onClick={() => { setEditingVideo(null); setThumbnailUrl('https://images.unsplash.com/photo-1516321318423-f06f85e504b3?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'); setShowVideoModal(true); }}
                        className="relative flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl font-medium tracking-wide text-white bg-primary hover:bg-primary/90 shadow-lg shadow-primary/30 hover:shadow-primary/50 overflow-hidden transition-all duration-300 cursor-pointer"
                    >
                        <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                        <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700 delay-[50ms]" />
                        <Upload size={20} className="relative z-10 shrink-0" /> 
                        <span className="relative z-10">{t('dashboard.instructor.lectures.uploadNew')}</span>
                    </motion.button>
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
                                        <div className="relative w-full aspect-video shrink-0 overflow-hidden bg-slate-100 dark:bg-slate-800">
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
                                                    <button onClick={() => { setEditingVideo(video); setThumbnailUrl(video.thumbnail || ''); setShowVideoModal(true); }} className="group flex items-center justify-center h-9 px-2 rounded-full overflow-hidden text-slate-500 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 transition-all duration-300 hover:shadow-sm focus:outline-none cursor-pointer" title={t('common.edit')}>
                                                        <Edit size={18} className="shrink-0" />
                                                        <span className="max-w-0 w-0 overflow-hidden opacity-0 group-hover:max-w-[100px] group-hover:w-auto group-hover:opacity-100 group-hover:ml-1.5 rtl:group-hover:mr-1.5 rtl:group-hover:ml-0 whitespace-nowrap text-xs font-semibold transition-all duration-300 ease-in-out">{t('common.edit')}</span>
                                                    </button>
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
                                                            onClick={() => { setEditingVideo(video); setThumbnailUrl(video.thumbnail || ''); setShowVideoModal(true); }}
                                                            className="group flex items-center justify-center h-9 px-2 rounded-full overflow-hidden text-slate-500 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 transition-all duration-300 hover:shadow-sm focus:outline-none cursor-pointer"
                                                            title={t('common.edit')}
                                                        >
                                                            <Edit size={18} className="shrink-0" />
                                                            <span className="max-w-0 w-0 overflow-hidden opacity-0 group-hover:max-w-[100px] group-hover:w-auto group-hover:opacity-100 group-hover:ml-1.5 rtl:group-hover:mr-1.5 rtl:group-hover:ml-0 whitespace-nowrap text-xs font-semibold transition-all duration-300 ease-in-out">{t('common.edit')}</span>
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
                                        <h2 className="text-xl font-bold text-slate-900 dark:text-white">{editingVideo ? t('dashboard.instructor.lectures.editTitle') : t('dashboard.instructor.lectures.addTitle')}</h2>
                                        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">{t('dashboard.instructor.lectures.modalSubtitle')}</p>
                                    </div>
                                    <button onClick={() => { setShowVideoModal(false); setEditingVideo(null); }} className="p-2 hover:bg-slate-100 dark:bg-slate-800 rounded-lg transition-colors cursor-pointer">
                                        <X size={20} className="text-slate-500" />
                                    </button>
                                </div>

                                <div className="flex-1 overflow-y-auto p-6 scrollbar-hide">
                                    <form id="lecture-form" onSubmit={(e) => {
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
                                    }} className="space-y-6">
                                        


                                        <div className="space-y-2">
                                            <label className={`block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2 ${isRTL ? 'text-right' : 'text-left'}`}>{t('dashboard.instructor.lectures.form.title')}</label>
                                            <input name="title" required defaultValue={editingVideo?.title || ''} placeholder={t('dashboard.instructor.lectures.form.titlePlaceholder')} className={`w-full px-4 py-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-xl dark:text-white outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-lg font-medium ${isRTL ? 'text-right' : 'text-left'}`} />
                                        </div>

                                        <div className="space-y-2">
                                            <label className={`block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2 ${isRTL ? 'text-right' : 'text-left'}`}>{t('dashboard.instructor.lectures.form.course')}</label>
                                            <input name="course" required defaultValue={editingVideo?.course || ''} placeholder={t('dashboard.instructor.lectures.form.coursePlaceholder')} className={`w-full px-4 py-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-xl dark:text-white outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all font-medium ${isRTL ? 'text-right' : 'text-left'}`} />
                                        </div>

                                        <div className="space-y-2">
                                            <label className={`block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2 ${isRTL ? 'text-right' : 'text-left'}`}>{t('dashboard.admin.manageCourses.thumbnailLabel') || (isRTL ? 'رابط صورة الغلاف' : 'Thumbnail URL')}</label>
                                            <input name="thumbnail" value={thumbnailUrl} onChange={(e) => setThumbnailUrl(e.target.value)} placeholder={isRTL ? 'https://example.com/image.jpg' : 'https://example.com/image.jpg'} className={`w-full px-4 py-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-xl dark:text-white outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all font-medium ${isRTL ? 'text-right' : 'text-left'}`} />
                                        </div>

                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                            <div className="space-y-2">
                                                <label className={`block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2 ${isRTL ? 'text-right' : 'text-left'}`}>{t('dashboard.instructor.lectures.form.duration')}</label>
                                                <div className="relative">
                                                    <Clock className={`absolute ${isRTL ? 'right-4' : 'left-4'} top-1/2 -translate-y-1/2 text-slate-400`} size={16} />
                                                    <input name="duration" required defaultValue={editingVideo?.duration || '10:00'} className={`w-full ${isRTL ? 'pr-11 pl-4 text-right' : 'pl-11 pr-4 text-left'} py-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-xl dark:text-white outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all font-medium`} />
                                                </div>
                                            </div>
                                            <div className="space-y-2">
                                                <label className={`block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2 ${isRTL ? 'text-right' : 'text-left'}`}>{t('dashboard.instructor.lectures.form.privacy')}</label>
                                                <select name="status" defaultValue={editingVideo?.status || 'published'} className={`w-full px-4 py-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-xl dark:text-white outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all cursor-pointer appearance-none bg-[url('data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20fill%3D%22none%22%20viewBox%3D%220%200%2020%2020%22%3E%3Cpath%20stroke%3D%22%236B7280%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%20stroke-width%3D%221.5%22%20d%3D%22m6%208%204%204%204-4%22%2F%3E%3C%2Fsvg%3E')] bg-[length:20px] ${isRTL ? 'bg-[left_1rem_center]' : 'bg-[right_1rem_center]'} bg-no-repeat ${isRTL ? 'text-right' : 'text-left'} font-medium`}>
                                                    <option value="published">{t('dashboard.instructor.lectures.form.public')}</option>
                                                    <option value="draft">{t('dashboard.instructor.lectures.form.private')}</option>
                                                    <option value="pending">{t('dashboard.instructor.lectures.form.pending')}</option>
                                                </select>
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            <label className={`block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2 ${isRTL ? 'text-right' : 'text-left'}`}>{t('dashboard.instructor.lectures.form.resources')}</label>
                                            <div
                                                className="w-full border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-xl p-6 flex flex-col items-center justify-center bg-slate-50 dark:bg-slate-950/50 hover:bg-slate-100 dark:hover:bg-slate-900 transition-colors cursor-pointer group"
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

                                        {/* Quiz Builder */}
                                        <div className="pt-6 mt-6 border-t border-slate-100 dark:border-slate-800">
                                            <div className="flex items-center justify-between mb-4">
                                                <div className={`flex items-center gap-3 ${isRTL ? 'flex-row-reverse text-right' : ''}`}>
                                                    <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-600 dark:text-slate-400">
                                                        <FileText size={20} />
                                                    </div>
                                                    <div>
                                                        <h3 className="font-bold text-slate-900 dark:text-white leading-none">{t('dashboard.instructor.lectures.quiz.title')}</h3>
                                                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">{t('dashboard.instructor.lectures.quiz.add')}</p>
                                                    </div>
                                                </div>
                                                <button
                                                    type="button"
                                                    onClick={() => setShowQuizBuilder(!showQuizBuilder)}
                                                    className={`px-4 py-2 rounded-xl text-sm font-semibold transition-colors cursor-pointer ${showQuizBuilder ? 'bg-primary text-white' : 'bg-primary/10 text-primary hover:bg-primary/20'}`}
                                                >
                                                    {showQuizBuilder ? t('dashboard.instructor.lectures.quiz.active') : t('dashboard.instructor.lectures.quiz.add')}
                                                </button>
                                            </div>

                                            <AnimatePresence>
                                                {showQuizBuilder && (
                                                    <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden">
                                                        <div className="space-y-4 mt-4">
                                                            {quizQuestions.map((q, qIndex) => (
                                                                <div key={qIndex} className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl border border-slate-200 dark:border-slate-700">
                                                                    <div className="flex justify-between items-start mb-3">
                                                                        <label className={`block text-sm font-semibold text-slate-700 dark:text-slate-300 w-full flex flex-col gap-2 ${isRTL ? 'text-right' : 'text-left'}`}>
                                                                            <span>{t('dashboard.instructor.lectures.quiz.question')} {qIndex + 1}</span>
                                                                            <input 
                                                                                type="text"
                                                                                value={q.question}
                                                                                onChange={(e) => updateQuestion(qIndex, 'question', e.target.value)}
                                                                                placeholder={t('dashboard.instructor.lectures.quiz.questionPlaceholder')}
                                                                                className={`w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all font-normal ${isRTL ? 'text-right' : 'text-left'}`}
                                                                            />
                                                                        </label>
                                                                        <button type="button" onClick={() => removeQuestion(qIndex)} className="ml-3 rtl:ml-0 rtl:mr-3 mt-1 text-slate-400 hover:text-red-500 transition-colors p-1" title="Remove Question">
                                                                            <Trash2 size={16} />
                                                                        </button>
                                                                    </div>
                                                                    <div className="space-y-2 mt-4 ml-1 rtl:ml-0 rtl:mr-1">
                                                                        {q.options.map((opt, oIndex) => (
                                                                            <label key={oIndex} className="flex items-center gap-3 cursor-pointer group">
                                                                                <div className="relative flex items-center justify-center">
                                                                                    <input 
                                                                                        type="radio" 
                                                                                        name={`correct-${qIndex}`}
                                                                                        checked={q.correctAnswer === oIndex}
                                                                                        onChange={() => updateQuestion(qIndex, 'correctAnswer', oIndex)}
                                                                                        className="peer sr-only"
                                                                                    />
                                                                                    <div className="w-5 h-5 border-2 border-slate-300 dark:border-slate-600 rounded-full peer-checked:border-primary peer-checked:bg-primary transition-all flex items-center justify-center">
                                                                                        <div className="w-2 h-2 bg-white rounded-full scale-0 peer-checked:scale-100 transition-transform"/>
                                                                                    </div>
                                                                                </div>
                                                                                <input 
                                                                                    type="text"
                                                                                    value={opt}
                                                                                    onChange={(e) => {
                                                                                        const newOptions = [...q.options];
                                                                                        newOptions[oIndex] = e.target.value;
                                                                                        updateQuestion(qIndex, 'options', newOptions);
                                                                                    }}
                                                                                    placeholder={`${t('dashboard.instructor.lectures.quiz.option')} ${oIndex + 1}`}
                                                                                    className={`flex-1 px-3 py-1.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-sm font-normal transition-all ${q.correctAnswer === oIndex ? 'ring-1 ring-primary/30 border-primary/50 text-slate-900 dark:text-white' : 'text-slate-600 dark:text-slate-400'} ${isRTL ? 'text-right' : 'text-left'}`}
                                                                                />
                                                                            </label>
                                                                        ))}
                                                                    </div>
                                                                </div>
                                                            ))}
                                                            
                                                            <button
                                                                type="button"
                                                                onClick={addQuestion}
                                                                className="w-full py-3 border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-xl flex items-center justify-center gap-2 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/50 hover:text-primary transition-colors text-sm font-semibold cursor-pointer"
                                                            >
                                                                <FileText size={16} /> {t('dashboard.instructor.lectures.quiz.addQuestion')}
                                                            </button>
                                                        </div>
                                                    </motion.div>
                                                )}
                                            </AnimatePresence>
                                        </div>
                                    </form>
                                </div>
                                <div className="p-6 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 flex gap-3 shrink-0">
                                    <Button type="button" variant="ghost" className="flex-1" onClick={() => setShowVideoModal(false)}>{t('common.cancel')}</Button>
                                    <Button type="submit" form="lecture-form" className="flex-1 disabled:opacity-50 disabled:cursor-not-allowed" disabled={isSaving}>
                                        {isSaving ? t('dashboard.instructor.lectures.form.saving') : editingVideo ? t('common.save') : t('dashboard.instructor.lectures.form.uploadBtn')}
                                    </Button>
                                </div>
                            </div>

                            {/* Live Preview Side (Right in LTR) */}
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
                                            {thumbnailUrl ? (
                                                <img src={thumbnailUrl} alt="" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                                            ) : (
                                                <>
                                                    <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/20 via-purple-500/20 to-pink-500/20 mix-blend-overlay"></div>
                                                    <Youtube className="w-16 h-16 text-slate-700 transition-transform duration-500 group-hover:scale-110" />
                                                </>
                                            )}
                                            
                                            {/* Duration indicator */}
                                            <div className="absolute bottom-3 right-3 bg-black/80 backdrop-blur-md text-white text-xs font-bold px-2 py-1 rounded-md">
                                                {document.querySelector('input[name="duration"]')?.value || '10:00'}
                                            </div>
                                        </div>
                                        <div className="p-5">
                                            <h3 className="font-bold text-lg text-slate-900 dark:text-white mb-2 line-clamp-2 leading-tight">
                                                {document.querySelector('input[name="title"]')?.value || (isRTL ? 'عنوان الفيديو...' : 'Video Title...')}
                                            </h3>
                                            <p className="text-sm font-medium text-slate-500 line-clamp-1 mb-4">
                                                {document.querySelector('input[name="course"]')?.value || (isRTL ? 'اسم الدورة...' : 'Course Name...')}
                                            </p>

                                            <div className="flex items-center gap-2 mt-4 pt-4 border-t border-slate-100 dark:border-slate-800">
                                                <span className="flex items-center gap-1.5 bg-slate-100 dark:bg-slate-800 px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-600 dark:text-slate-300">
                                                    <Clock size={14} /> {t('dashboard.instructor.lectures.form.duration')}
                                                </span>
                                                {showQuizBuilder && (
                                                    <span className="flex items-center gap-1.5 bg-indigo-50 dark:bg-indigo-900/40 text-indigo-600 dark:text-indigo-400 px-3 py-1.5 rounded-lg text-xs font-semibold">
                                                        <Bot size={14} /> AI Quiz
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
        </div>
    );
};

export default InstructorLecturesPage;
