import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useParams, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ArrowLeft, MessageSquare, FileText, HelpCircle, List, Zap, Send, Clock, User } from 'lucide-react';
import Button from '../../components/ui/Button';
import VideoPlayer from '../../components/features/video/VideoPlayer';
import Playlist from '../../components/features/video/Playlist';
import ContextualAI from '../../components/features/ai/ContextualAI';
import Quiz from '../../components/features/course/Quiz';

import { api } from '../../services/api';
import { formatDuration } from '../../utils/formatters';
import toast from 'react-hot-toast';
import { Loader2 } from 'lucide-react';

const VideoPlayerPage = () => {
    const { courseId } = useParams();
    const { t, i18n } = useTranslation();
    const [rightSidebarTab, setRightSidebarTab] = useState('playlist'); // playlist, ai
    const [isTheaterMode, setIsTheaterMode] = useState(false);
    const [activeTab, setActiveTab] = useState('overview');
    const [videoState, setVideoState] = useState({ currentTime: 0, isPlaying: false });
    const [markers, setMarkers] = useState([]);
    const [questionInput, setQuestionInput] = useState('');
    const [questions, setQuestions] = useState([]);
    // TODO: Replace with api.instructor.questions.getAll() when backend is ready
    const [courseData, setCourseData] = useState(null);
    const [courseLectures, setCourseLectures] = useState([]);
    const [activeLectureId, setActiveLectureId] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const scrollContainerRef = useRef(null);


    // Fetch course and lectures
    useEffect(() => {
        const loadCourseContent = async () => {
            setIsLoading(true);
            try {
                const id = parseInt(courseId);
                const [course, lecturesData] = await Promise.all([
                    api.courses.getById(id),
                    api.courses.getLectures(id)
                ]);
                setCourseData(course);
                setCourseLectures(lecturesData);
                if (lecturesData.length > 0) {
                    setActiveLectureId(lecturesData[0].id);
                }
            } catch (error) {
                console.error('Error loading course content:', error);
                toast.error(t('common.error'));
            } finally {
                setIsLoading(false);
            }
        };
        if (courseId) loadCourseContent();
    }, [courseId, t]);

    // Reset scroll when lecture changes
    useEffect(() => {
        if (scrollContainerRef.current) {
            scrollContainerRef.current.scrollTop = 0;
        }
    }, [activeLectureId]);



    const handleLectureSelect = (lecture) => {
        setActiveLectureId(lecture.id);
        setVideoState({ currentTime: 0, isPlaying: false });
        toast.dismiss();
    };

    const handleVideoStateChange = (newState) => {
        setVideoState(prev => ({ ...prev, ...newState }));
    };

    const addMarker = (time) => {
        if (!markers.includes(time)) {
            setMarkers(prev => [...prev, time]);
        }
    };
    
  

    const handlePostQuestion = () => {
        if (!questionInput.trim()) return;

        const newQuestion = {
            id: questions.length + 1,
            user: t('videoPlayer.discussion.you'),
            question: questionInput,
            date: t('videoPlayer.discussion.justNow'),
            reply: null
        };

        setQuestions(prev => [newQuestion, ...prev]);
        setQuestionInput('');
        toast.success(t('videoPlayer.discussion.toasts.postSuccess'));
    };

    // Find current lecture
    const lectureData = courseLectures.find(l => l.id === activeLectureId) || courseLectures[0] || {};
    const courseTitle = courseData?.title || "...";
    const currentLecture = { title: lectureData?.title || "..." };

    // Group lectures into sections for the playlist
    const playlistData = courseLectures.length >= 3 ? [
        {
            title: t('videoPlayer.playlist.intro') || "Introduction & Basics",
            lectures: [courseLectures[0]]
        },
        {
            title: t('videoPlayer.playlist.advanced') || "Advanced Concepts",
            lectures: courseLectures.slice(1).filter(Boolean)
        }
    ] : [
        {
            title: t('videoPlayer.playlist.courseContent') || "Course Content",
            lectures: courseLectures.length > 0 ? courseLectures.filter(Boolean) : (lectureData.id ? [lectureData] : [])
        }
    ];

    if (isLoading) {
        return (
            <div className="h-screen flex flex-col items-center justify-center bg-white dark:bg-slate-950 transition-colors">
                <Loader2 className="w-12 h-12 text-primary animate-spin mb-4" />
                <p className="text-slate-500 dark:text-slate-400 font-medium animate-pulse">{t('common.loading')}</p>
            </div>
        );
    }

      console.log(lectureData?.video);
    

    return (
        <div className="dark immersive-mode flex flex-col h-screen h-[100dvh] bg-[#020617] text-slate-200 overflow-hidden transition-all duration-700 relative">
            {/* Cinematic Background Elements - Always Visible */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-purple-900/15 blur-[120px] rounded-full" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-900/15 blur-[120px] rounded-full" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[radial-gradient(circle_at_center,rgba(99,102,241,0.04)_0%,transparent_70%)]" />
            </div>

            {/* Top Bar - Solid Dark */}
            <header className="h-16 bg-[#0A0F1C] border-b border-slate-800 flex items-center justify-between px-6 flex-shrink-0 z-20">
                <div className="flex items-center gap-4">
                    <Link to={`/courses/${courseId}`} className="text-slate-400 hover:text-white transition-colors">
                        <motion.div whileHover={{ x: -3, scale: 1.1 }} whileTap={{ scale: 0.9 }} transition={{ type: 'spring', stiffness: 400, damping: 20 }}>
                            <ArrowLeft strokeWidth={1.5} size={20} />
                        </motion.div>
                    </Link>
                    <div>
                        <h1 className="text-white font-bold text-[15px] leading-tight tracking-wide">{currentLecture.title}</h1>
                        <p className="text-slate-500 text-xs leading-tight mt-0.5 font-medium">{courseTitle}</p>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <Button size="sm" variant="outline" className="bg-[#1E293B] border-slate-700 text-slate-300 hover:bg-slate-700 hover:text-white rounded-xl text-xs px-3 font-semibold transition-colors">
                        <HelpCircle size={14} className="mr-1.5" /> {t('videoPlayer.header.help')}
                    </Button>
                </div>
            </header>

            <div className="flex-1 flex overflow-hidden">
                {/* Main Content (Video + Tabs) */}
                <div
                    ref={scrollContainerRef}
                    className="flex-1 flex flex-col min-h-0 overflow-y-auto bg-[#020617] transition-all duration-500 ease-in-out relative z-10"
                >
                    <div className={`transition-all duration-500 ${isTheaterMode ? 'p-2 md:p-4 pb-0 max-w-[1600px] mx-auto w-full' : 'p-4 md:p-6 pb-0'}`}>
                        <VideoPlayer
                            src={lectureData?.video?.url}
                            title={currentLecture.title}
                            onStateChange={handleVideoStateChange}
                            markers={markers}
                            isTheaterMode={isTheaterMode}
                            onToggleTheaterMode={() => setIsTheaterMode(!isTheaterMode)}
                        />
                    </div>

                    <div className={`transition-all duration-500 ${isTheaterMode ? 'p-2 md:p-4 max-w-[1600px] mx-auto w-full' : 'p-4 md:p-6'}`}>
                        <div className="border-b border-slate-200 dark:border-slate-800 mb-6 flex gap-6 overflow-x-auto no-scrollbar">
                            {[
                                { id: 'playlist', label: t('videoPlayer.tabs.playlist'), icon: List, mobileOnly: true, theaterOnly: true },
                                { id: 'ai', label: t('videoPlayer.tabs.ai'), icon: Zap, mobileOnly: true, theaterOnly: true },
                                { id: 'overview', label: t('videoPlayer.tabs.overview'), icon: FileText },
                                { id: 'quiz', label: t('videoPlayer.tabs.quiz'), icon: HelpCircle },
                                { id: 'comments', label: t('videoPlayer.tabs.comments'), icon: HelpCircle },
                                { id: 'resources', label: t('videoPlayer.tabs.resources'), icon: FileText },
                            ].map(tab => (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`pb-4 px-2 flex items-center gap-2.5 text-[13px] font-bold transition-all relative flex-shrink-0 tracking-wide ${(tab.mobileOnly && !isTheaterMode) ? 'lg:hidden' : ''
                                        } ${activeTab === tab.id ? 'text-white' : 'text-slate-500 hover:text-slate-300'}`}
                                >
                                     <tab.icon size={16} className={activeTab === tab.id ? 'text-indigo-400' : ''} />
                                     {tab.label}
                                     {activeTab === tab.id && (
                                         <motion.div
                                             layoutId="video-tab-indicator"
                                             className="absolute bottom-0 left-0 right-0 h-[3px] bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full shadow-[0_0_12px_rgba(99,102,241,0.6)]"
                                             transition={{ type: 'spring', stiffness: 500, damping: 35 }}
                                         />
                                     )}
                                </button>
                            ))}
                        </div>

                        <div className="text-slate-600 dark:text-slate-300">
                            {/* Mobile Only Views */}
                            {activeTab === 'playlist' && (
                                <div className={`${isTheaterMode ? '' : 'lg:hidden'} h-[500px]`}>
                                    <Playlist sections={playlistData} currentLecture={activeLectureId} onSelect={handleLectureSelect} />
                                </div>
                            )}
                            {activeTab === 'ai' && (
                                <div className={`${isTheaterMode ? '' : 'lg:hidden'} h-[500px] flex flex-col overflow-hidden rounded-xl border border-slate-200 dark:border-slate-800`}>
                                    <ContextualAI
                                        videoState={videoState}
                                        addMarker={addMarker}
                                    />
                                </div>
                            )}

                            {activeTab === 'overview' && (
                                <div className="max-w-3xl">
                                    <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-4">{t('videoPlayer.overview.title')}</h2>
                                    <p className="leading-relaxed text-slate-500 dark:text-slate-400 font-medium">
                                        {lectureData?.description || courseData?.description || t('videoPlayer.overview.noDescription')}
                                    </p>
                                </div>
                            )}
                            {activeTab === 'quiz' && (
                                <div className="max-w-2xl">
                                    <Quiz questions={lectureData?.quiz} />
                                </div>
                            )}
                            {activeTab === 'comments' && (
                                <div className="space-y-6">
                                    {/* Question Submission Form */}
                                    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 rounded-xl mb-8 shadow-sm">
                                        <h3 className="text-sm font-semibold text-slate-800 dark:text-slate-200 mb-3">{t('videoPlayer.discussion.askTitle')}</h3>
                                        <div className="flex gap-4">
                                            <div className="w-8 h-8 rounded-full bg-slate-700 shrink-0 flex items-center justify-center text-[10px] font-bold">{t('videoPlayer.discussion.you')}</div>
                                            <div className="flex-1">
                                                <textarea
                                                    placeholder={t('videoPlayer.discussion.placeholder')}
                                                    rows="2"
                                                    value={questionInput}
                                                    onChange={(e) => setQuestionInput(e.target.value)}
                                                    className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg px-4 py-2 text-sm text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-primary transition-all resize-none mb-2"
                                                />
                                                <div className="flex justify-end">
                                                    <Button
                                                        size="sm"
                                                        onClick={handlePostQuestion}
                                                        disabled={!questionInput.trim()}
                                                    >
                                                        <Send size={14} className="mr-2" /> {t('videoPlayer.discussion.postQuestion')}
                                                    </Button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Questions List */}
                                    <div className="space-y-4">
                                        <div className="flex items-center justify-between">
                                            <h3 className="font-bold uppercase text-[10px] tracking-wider text-slate-500 dark:text-slate-400">{t('videoPlayer.discussion.forumTitle')}</h3>
                                            <span className="text-xs text-slate-400 dark:text-slate-500">{t('videoPlayer.discussion.questionsCount', { count: questions.length })}</span>
                                        </div>

                                        {questions.map(q => (
                                            <div key={q.id} className="p-4 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
                                                <div className="flex items-center gap-3 mb-3">
                                                    <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center text-[10px] text-slate-500 dark:text-slate-400 font-bold">
                                                        {q.user.charAt(0)}
                                                    </div>
                                                    <div>
                                                        <p className="text-sm font-semibold text-slate-900 dark:text-slate-200">{q.user}</p>
                                                        <p className="text-[10px] text-slate-500 dark:text-slate-500">{q.date}</p>
                                                    </div>
                                                </div>
                                                <p className="text-sm text-slate-600 dark:text-slate-300 mb-4 font-medium">{q.question}</p>

                                                {q.reply ? (
                                                    <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800/50 flex gap-3">
                                                        <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center text-primary">
                                                            <User size={12} />
                                                        </div>
                                                        <div className="flex-1">
                                                            <div className="flex items-center gap-2 mb-1">
                                                                <p className="text-xs font-bold text-primary">{t('videoPlayer.discussion.instructorReply')}</p>
                                                                <span className="text-[10px] text-slate-600 px-1.5 py-0.5 bg-slate-800 rounded">{t('videoPlayer.discussion.official')}</span>
                                                            </div>
                                                            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed italic">"{q.reply}"</p>
                                                        </div>
                                                    </div>
                                                ) : (
                                                    <div className="mt-2 text-[10px] font-medium text-yellow-600/70 italic flex items-center gap-1.5">
                                                        <Clock size={10} /> {t('videoPlayer.discussion.waitingResponse')}
                                                    </div>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                            {activeTab === 'resources' && (
                                <div className="space-y-3 max-w-xl">
                                    <div className="p-3 bg-white dark:bg-slate-900 rounded-lg flex items-center gap-3 border border-slate-200 dark:border-slate-800 hover:border-primary/20 dark:hover:border-slate-700 cursor-pointer transition-colors shadow-sm">
                                        <FileText className="text-blue-500 dark:text-blue-400" size={20} />
                                        <div>
                                            <p className="text-sm font-medium text-slate-900 dark:text-slate-200">Lecture Slides.pdf</p>
                                            <p className="text-xs text-slate-500 dark:text-slate-500">2.4 MB</p>
                                        </div>
                                    </div>
                                    <div className="p-3 bg-white dark:bg-slate-900 rounded-lg flex items-center gap-3 border border-slate-200 dark:border-slate-800 hover:border-primary/20 dark:hover:border-slate-700 cursor-pointer transition-colors shadow-sm">
                                        <FileText className="text-blue-500 dark:text-blue-400" size={20} />
                                        <div>
                                            <p className="text-sm font-medium text-slate-900 dark:text-slate-200">Source Code.zip</p>
                                            <p className="text-xs text-slate-500 dark:text-slate-500">1.1 MB</p>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Right Sidebar (Playlist / AI) */}
                <div className={`w-80 md:w-[380px] bg-[#0A0F1C] border-l border-slate-800 flex flex-col flex-shrink-0 transition-all duration-500 relative z-20 ${isTheaterMode ? 'hidden' : 'hidden lg:flex'}`}>
                    <div className="flex border-b border-slate-800 h-[64px] shrink-0 bg-[#0A0F1C]">
                        <button
                            onClick={() => setRightSidebarTab('playlist')}
                            className={`flex-1 flex items-center justify-center gap-2.5 text-[11px] font-black uppercase tracking-[0.15em] transition-all relative ${rightSidebarTab === 'playlist' ? 'text-white bg-[#1E293B]' : 'text-slate-500 hover:text-slate-300 hover:bg-slate-800/30'}`}
                        >
                            <List size={16} className={rightSidebarTab === 'playlist' ? 'text-indigo-400' : ''} /> {t('videoPlayer.tabs.playlist')}
                            {rightSidebarTab === 'playlist' && (
                                <motion.div
                                    layoutId="sidebar-tab"
                                    className="absolute bottom-0 left-0 right-0 h-[3px] bg-indigo-500 shadow-[0_0_15px_rgba(99,102,241,0.4)]"
                                    transition={{ type: 'spring', stiffness: 500, damping: 35 }}
                                />
                            )}
                        </button>
                        <button
                            onClick={() => setRightSidebarTab('ai')}
                            className={`flex-1 flex items-center justify-center gap-2.5 text-[11px] font-black uppercase tracking-[0.15em] transition-all relative ${rightSidebarTab === 'ai' ? 'text-white bg-[#1E293B]' : 'text-slate-500 hover:text-slate-300 hover:bg-slate-800/30'}`}
                        >
                            <motion.div animate={rightSidebarTab === 'ai' ? { rotate: [0, 15, -15, 0] } : {}} transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}>
                                <Zap size={16} className={rightSidebarTab === 'ai' ? 'text-purple-400 fill-purple-400/20' : ''} />
                            </motion.div>
                            {t('videoPlayer.tabs.ai')}
                            {rightSidebarTab === 'ai' && (
                                <motion.div
                                    layoutId="sidebar-tab"
                                    className="absolute bottom-0 left-0 right-0 h-[3px] bg-purple-500 shadow-[0_0_15px_rgba(168,85,247,0.4)]"
                                    transition={{ type: 'spring', stiffness: 500, damping: 35 }}
                                />
                            )}
                        </button>
                    </div>

                    <div className="flex-1 flex flex-col min-h-0 overflow-hidden relative">
                        {rightSidebarTab === 'playlist' ? (
                            <Playlist sections={playlistData} currentLecture={activeLectureId} onSelect={handleLectureSelect} />
                        ) : (
                            <ContextualAI
                                videoState={videoState}
                                addMarker={addMarker}
                                data={{
                                    title:courseData?.title,
                                    description:courseData?.description,
                                    chunks:courseData?.transcript?.chunks
                                }}
                            />
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default VideoPlayerPage;
