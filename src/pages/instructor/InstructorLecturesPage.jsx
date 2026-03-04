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
    FileText
} from 'lucide-react';
import Button from '../../components/ui/Button';

// InstructorLecturesPage v1.2 - Modern SaaS Dashboard UI Refinement
const InstructorLecturesPage = () => {
    const [viewMode, setViewMode] = useState('list');
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [showVideoModal, setShowVideoModal] = useState(false);
    const [editingVideo, setEditingVideo] = useState(null);

    // Initial Videos state
    const [videos, setVideos] = useState([
        {
            id: 1,
            title: "Introduction to Neural Networks",
            course: "Mastering AI & Machine Learning",
            views: "1.2k",
            duration: "12:45",
            status: "published",
            date: "2024-02-15",
            thumbnail: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&q=80"
        },
        {
            id: 2,
            title: "Advanced React Patterns",
            course: "Modern Web Development",
            views: "856",
            duration: "25:30",
            status: "published",
            date: "2024-02-10",
            thumbnail: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800&q=80"
        },
        {
            id: 3,
            title: "Data Visualization with D3.js",
            course: "Data Science Specialization",
            views: "0",
            duration: "18:20",
            status: "pending",
            date: "2024-02-25",
            thumbnail: "https://images.unsplash.com/photo-1551434678-e076c223a692?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
        },
        {
            id: 4,
            title: "Ethics in Artificial Intelligence",
            course: "AI Policy & Governance",
            views: "2.4k",
            duration: "45:00",
            status: "published",
            date: "2024-01-30",
            thumbnail: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
        }
    ]);

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
        if (window.confirm('Are you sure you want to delete this lecture?')) {
            setVideos(prev => prev.filter(v => v.id !== id));
        }
    };

    const togglePublish = (id) => {
        setVideos(prev => prev.map(v => {
            if (v.id === id) {
                return { ...v, status: v.status === 'published' ? 'draft' : 'published' };
            }
            return v;
        }));
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
    };

    const handleUpdateVideo = (data) => {
        setVideos(prev => prev.map(v => v.id === data.id ? { ...v, ...data } : v));
        setEditingVideo(null);
        setShowVideoModal(false);
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
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
                    <div className="text-left">
                        <motion.h1
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight"
                        >
                            Course Lectures
                        </motion.h1>
                        <motion.p
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.1 }}
                            className="text-slate-500 dark:text-slate-400 mt-1"
                        >
                            Manage and organize your educational video content.
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
                            <Upload size={20} className="mr-2" /> Upload Lecture
                        </Button>
                    </motion.div>
                </div>

                {/* Filters Row */}
                <div className="flex flex-col md:flex-row gap-4 bg-white dark:bg-slate-900/50 p-2 rounded-2xl border border-slate-200/60 dark:border-slate-800/60 shadow-sm backdrop-blur-sm">
                    <div className="relative flex-1">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                        <input
                            type="text"
                            placeholder="Search by title or course..."
                            className="w-full pl-12 pr-4 py-3 bg-transparent border-none rounded-xl text-slate-900 dark:text-white focus:ring-0 outline-none placeholder:text-slate-400 transition-all"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>

                    <div className="flex items-center gap-2 p-1 border-l border-slate-200 dark:border-slate-800 ml-0 md:ml-2">
                        <select
                            className="bg-transparent border-none rounded-xl px-4 py-2 text-sm font-medium outline-none text-slate-700 dark:text-slate-200 focus:ring-0 cursor-pointer [&>option]:dark:bg-slate-900 [&>option]:dark:text-white"
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                        >
                            <option value="all">All Status</option>
                            <option value="published">Published</option>
                            <option value="pending">Pending</option>
                            <option value="draft">Draft</option>
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
                                    <div key={video.id} className="group bg-white dark:bg-slate-900 rounded-2xl overflow-hidden border border-slate-200/60 dark:border-slate-800 shadow-md hover:shadow-xl transition-all duration-300 flex flex-col">
                                        <div className="relative aspect-video overflow-hidden">
                                            {video.thumbnail && <img src={video.thumbnail} alt="" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />}
                                            <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors" />
                                            <span className="absolute bottom-3 right-3 px-2 py-1 bg-black/70 backdrop-blur-sm text-white text-[11px] font-bold rounded-lg">{video.duration}</span>
                                            <span className={`absolute top-3 left-3 px-2 py-1 text-[10px] font-bold rounded-lg uppercase tracking-wider shadow-sm ${getStatusStyle(video.status)}`}>{video.status}</span>
                                        </div>
                                        <div className="p-6 flex-1 flex flex-col">
                                            <h3 className="font-bold text-slate-900 dark:text-white mb-2 line-clamp-2 leading-snug">{video.title}</h3>
                                            <p className="text-sm text-slate-500 dark:text-slate-400 mb-6 font-medium bg-slate-50 dark:bg-slate-800/50 py-1 px-2 rounded-md inline-block w-fit">{video.course}</p>
                                            <div className="mt-auto pt-5 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                                                <div className="flex gap-4 text-[11px] text-slate-400 font-medium">
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
                                <table className="w-full">
                                    <thead>
                                        <tr className="border-b border-slate-100 dark:border-slate-800 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                                            <th className="px-8 py-5">Lecture Details</th>
                                            <th className="px-6 py-5 text-center">Engagement</th>
                                            <th className="px-6 py-5 text-center">Status</th>
                                            <th className="px-8 py-5 text-right">Actions</th>
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
                                                        {video.status}
                                                    </span>
                                                </td>
                                                <td className="px-8 py-5 text-right">
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
                            className="bg-white dark:bg-slate-900 py-24 rounded-3xl border border-dashed border-slate-300 dark:border-slate-700 text-center"
                        >
                            <div className="w-20 h-20 bg-slate-50 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-6">
                                <Video size={32} className="text-slate-300" />
                            </div>
                            <h3 className="text-xl font-bold text-slate-900 dark:text-white">No lectures found</h3>
                            <p className="text-slate-500 dark:text-slate-400 mb-8 max-w-xs mx-auto text-sm">We couldn't find any lectures matching your current search or filters.</p>
                            <Button variant="outline" onClick={() => { setSearchTerm(''); setStatusFilter('all'); }} className="px-8">
                                Clear All Filters
                            </Button>
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
                                    <h2 className="text-2xl font-bold text-slate-900 dark:text-white">{editingVideo ? 'Edit Lecture' : 'Upload New Lecture'}</h2>
                                    <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Set the core details for your course content.</p>
                                </div>
                                <button onClick={() => { setShowVideoModal(false); setEditingVideo(null); }} className="p-3 hover:bg-white dark:hover:bg-slate-700 rounded-full shadow-sm transition-all"><X size={20} className="text-slate-500" /></button>
                            </div>

                            <form onSubmit={(e) => {
                                e.preventDefault();
                                const formData = new FormData(e.target);
                                const data = Object.fromEntries(formData);
                                if (editingVideo) handleUpdateVideo({ ...editingVideo, ...data });
                                else handleAddVideo(data);
                            }} className="p-8 space-y-6 text-left">
                                <div className="space-y-2">
                                    <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 ml-1">Lecture Title</label>
                                    <input name="title" required defaultValue={editingVideo?.title || ''} placeholder="e.g. Understanding Neural Networks" className="w-full px-5 py-3.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl dark:text-white outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all" />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 ml-1">Assigned Course</label>
                                    <input name="course" required defaultValue={editingVideo?.course || ''} placeholder="e.g. AI Mastery 101" className="w-full px-5 py-3.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl dark:text-white outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all" />
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 ml-1">Duration (MM:SS)</label>
                                        <div className="relative">
                                            <Clock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                                            <input name="duration" required defaultValue={editingVideo?.duration || '10:00'} className="w-full pl-11 pr-4 py-3.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl dark:text-white outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all" />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 ml-1">Privacy Status</label>
                                        <select name="status" defaultValue={editingVideo?.status || 'published'} className="w-full px-5 py-3.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl dark:text-white outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all cursor-pointer appearance-none bg-[url('data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20fill%3D%22none%22%20viewBox%3D%220%200%2020%2020%22%3E%3Cpath%20stroke%3D%22%236B7280%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%20stroke-width%3D%221.5%22%20d%3D%22m6%208%204%204%204-4%22%2F%3E%3C%2Fsvg%3E')] bg-[length:20px] bg-[right_1rem_center] bg-no-repeat">
                                            <option value="published">Public (Published)</option>
                                            <option value="draft">Private (Draft)</option>
                                            <option value="pending">Awaiting Review (Pending)</option>
                                        </select>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 ml-1">Lecture Resources</label>
                                    <div
                                        className="w-full border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-2xl p-6 flex flex-col items-center justify-center bg-slate-50 dark:bg-slate-800/50 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer group"
                                        onClick={() => document.getElementById('resource-file-upload').click()}
                                    >
                                        <FileText className="w-8 h-8 text-slate-400 group-hover:text-primary transition-colors mb-2" />
                                        <p className="text-sm font-medium text-slate-600 dark:text-slate-300">Click to upload resource files</p>
                                        <p className="text-xs text-slate-500 mt-1">PDF, DOCX, ZIP up to 50MB</p>
                                        <input
                                            type="file"
                                            id="resource-file-upload"
                                            className="hidden"
                                            multiple
                                            accept=".pdf,.doc,.docx,.zip,.rar"
                                            onChange={(e) => {
                                                if (e.target.files && e.target.files.length > 0) {
                                                    alert(`${e.target.files.length} file(s) selected for upload.`);
                                                }
                                            }}
                                        />
                                    </div>
                                </div>

                                <div className="pt-6 flex gap-4">
                                    <Button variant="outline" className="flex-1 py-3.5 rounded-2xl font-bold" onClick={() => { setShowVideoModal(false); setEditingVideo(null); }}>Discard</Button>
                                    <Button className="flex-1 py-3.5 rounded-2xl font-bold shadow-lg shadow-primary/20" type="submit">
                                        {editingVideo ? 'Update Lecture' : 'Confirm Upload'}
                                    </Button>
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
