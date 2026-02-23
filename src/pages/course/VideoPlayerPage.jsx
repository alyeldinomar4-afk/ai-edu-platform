import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, MessageSquare, FileText, HelpCircle, List, Zap } from 'lucide-react';
import Button from '../../components/ui/Button';
import VideoPlayer from '../../components/features/video/VideoPlayer';
import Playlist from '../../components/features/video/Playlist';
import ContextualAI from '../../components/features/ai/ContextualAI';
import Quiz from '../../components/features/course/Quiz';

const VideoPlayerPage = () => {
    const { courseId } = useParams();
    const [rightSidebarTab, setRightSidebarTab] = useState('playlist'); // playlist, ai
    const [activeTab, setActiveTab] = useState('overview');

    // Mock data
    const courseTitle = "Machine Learning Fundamentals";
    const currentLecture = { title: "Introduction to Neural Networks" };
    const playlistData = [
        {
            title: "Introduction",
            lectures: [
                { id: 1, title: "Course Overview", duration: "05:20", completed: true },
                { id: 2, title: "What is ML?", duration: "12:45", completed: true },
            ]
        },
        {
            title: "Neural Networks",
            lectures: [
                { id: 3, title: "Neurons & Perceptrons", duration: "15:30", completed: false },
                { id: 4, title: "Activation Functions", duration: "10:15", locked: true },
            ]
        }
    ];

    return (
        <div className="flex flex-col h-screen bg-slate-900 overflow-hidden transition-colors duration-300">
            {/* Top Bar */}
            <header className="h-16 bg-slate-900 border-b border-slate-800 flex items-center justify-between px-4 flex-shrink-0 transition-colors">
                <div className="flex items-center gap-4">
                    <Link to={`/courses/${courseId}`} className="p-2 hover:bg-slate-800 rounded-full text-slate-400 hover:text-white transition-colors">
                        <ArrowLeft size={20} />
                    </Link>
                    <div>
                        <h1 className="text-slate-100 font-semibold text-sm md:text-base line-clamp-1">{currentLecture.title}</h1>
                        <p className="text-slate-500 text-xs hidden md:block">{courseTitle}</p>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <Button size="sm" variant="outline" className="hidden md:flex bg-transparent border-slate-700 text-slate-300 hover:bg-slate-800">
                        <HelpCircle size={16} /> Help
                    </Button>
                </div>
            </header>

            <div className="flex-1 flex overflow-hidden">
                {/* Main Content (Video + Tabs) */}
                <div className="flex-1 flex flex-col overflow-y-auto bg-slate-950 transition-colors">
                    <div className="p-4 md:p-6 pb-0">
                        <VideoPlayer />
                    </div>

                    <div className="p-4 md:p-6">
                        <div className="border-b border-slate-800 mb-6 flex gap-6 overflow-x-auto no-scrollbar">
                            {[
                                { id: 'playlist', label: 'Content', icon: List, mobileOnly: true },
                                { id: 'ai', label: 'AI Tutor', icon: Zap, mobileOnly: true },
                                { id: 'overview', label: 'Overview', icon: FileText },
                                { id: 'quiz', label: 'Quiz', icon: HelpCircle },
                                { id: 'comments', label: 'Comments', icon: MessageSquare },
                                { id: 'resources', label: 'Resources', icon: FileText },
                            ].map(tab => (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`pb-4 px-2 flex items-center gap-2 text-sm font-medium transition-colors relative flex-shrink-0 ${tab.mobileOnly ? 'lg:hidden' : ''
                                        } ${activeTab === tab.id ? 'text-primary' : 'text-slate-400 hover:text-slate-200'}`}
                                >
                                    <tab.icon size={16} />
                                    {tab.label}
                                    {activeTab === tab.id && (
                                        <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary" />
                                    )}
                                </button>
                            ))}
                        </div>

                        <div className="text-slate-300">
                            {/* Mobile Only Views */}
                            {activeTab === 'playlist' && (
                                <div className="lg:hidden h-[500px]">
                                    <Playlist sections={playlistData} currentLecture={3} onSelect={() => { }} />
                                </div>
                            )}
                            {activeTab === 'ai' && (
                                <div className="lg:hidden h-[500px]">
                                    <ContextualAI />
                                </div>
                            )}

                            {activeTab === 'overview' && (
                                <div className="max-w-3xl">
                                    <h2 className="text-xl font-bold text-white mb-4">About this lecture</h2>
                                    <p className="leading-relaxed text-slate-400">
                                        In this lecture, we explore the fundamental building blocks of neural networks.
                                        We'll start with the biological inspiration behind artificial neurons and mathematically define the perceptron.
                                    </p>
                                </div>
                            )}
                            {activeTab === 'quiz' && (
                                <div className="max-w-2xl">
                                    <Quiz />
                                </div>
                            )}
                            {activeTab === 'comments' && (
                                <div className="text-center py-10 text-slate-500">
                                    <MessageSquare className="w-10 h-10 mx-auto mb-2 opacity-50" />
                                    <p>Discussion forum coming soon.</p>
                                </div>
                            )}
                            {activeTab === 'resources' && (
                                <div className="space-y-3 max-w-xl">
                                    <div className="p-3 bg-slate-900 rounded-lg flex items-center gap-3 border border-slate-800 hover:border-slate-700 cursor-pointer transition-colors">
                                        <FileText className="text-blue-400" size={20} />
                                        <div>
                                            <p className="text-sm font-medium text-slate-200">Lecture Slides.pdf</p>
                                            <p className="text-xs text-slate-500">2.4 MB</p>
                                        </div>
                                    </div>
                                    <div className="p-3 bg-slate-900 rounded-lg flex items-center gap-3 border border-slate-800 hover:border-slate-700 cursor-pointer transition-colors">
                                        <FileText className="text-blue-400" size={20} />
                                        <div>
                                            <p className="text-sm font-medium text-slate-200">Source Code.zip</p>
                                            <p className="text-xs text-slate-500">1.1 MB</p>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Right Sidebar (Playlist / AI) */}
                <div className="w-80 md:w-96 bg-white dark:bg-slate-900 border-l border-slate-200 dark:border-slate-800 flex flex-col flex-shrink-0 hidden lg:flex transition-colors">
                    <div className="flex border-b border-slate-100 dark:border-slate-800 transition-colors">
                        <button
                            onClick={() => setRightSidebarTab('playlist')}
                            className={`flex-1 py-3 text-sm font-semibold flex items-center justify-center gap-2 transition-colors ${rightSidebarTab === 'playlist' ? 'text-primary bg-primary/5 dark:bg-primary/10 border-b-2 border-primary' : 'text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'}`}
                        >
                            <List size={16} /> Content
                        </button>
                        <button
                            onClick={() => setRightSidebarTab('ai')}
                            className={`flex-1 py-3 text-sm font-semibold flex items-center justify-center gap-2 transition-colors ${rightSidebarTab === 'ai' ? 'text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-900/20 border-b-2 border-purple-600 dark:border-purple-400' : 'text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'}`}
                        >
                            <Zap size={16} /> AI Tutor
                        </button>
                    </div>

                    <div className="flex-1 overflow-hidden relative">
                        {rightSidebarTab === 'playlist' ? (
                            <Playlist sections={playlistData} currentLecture={3} onSelect={() => { }} />
                        ) : (
                            <ContextualAI />
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default VideoPlayerPage;
