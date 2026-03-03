import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, MessageSquare, FileText, HelpCircle, List, Zap, Send, Clock, User } from 'lucide-react';
import Button from '../../components/ui/Button';
import VideoPlayer from '../../components/features/video/VideoPlayer';
import Playlist from '../../components/features/video/Playlist';
import ContextualAI from '../../components/features/ai/ContextualAI';
import Quiz from '../../components/features/course/Quiz';

const VideoPlayerPage = () => {
    const { courseId } = useParams();
    const [rightSidebarTab, setRightSidebarTab] = useState('playlist'); // playlist, ai
    const [activeTab, setActiveTab] = useState('overview');
    const [videoState, setVideoState] = useState({ currentTime: 0, isPlaying: false });
    const [markers, setMarkers] = useState([]);

    const handleVideoStateChange = (newState) => {
        setVideoState(prev => ({ ...prev, ...newState }));
    };

    const addMarker = (time) => {
        if (!markers.includes(time)) {
            setMarkers(prev => [...prev, time]);
        }
    };

    // Mock data
    const courseTitle = "Machine Learning Fundamentals";
    const currentLecture = { title: "Introduction to Neural Networks" };
    const playlistData = [
        {
            title: "Introduction",
            lectures: [
                { id: 1, title: "Course Overview", duration: "05:20", completed: true, thumbnail: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=400&q=80" },
                { id: 2, title: "What is ML?", duration: "12:45", completed: true, thumbnail: "https://images.unsplash.com/photo-1527474305487-b87b222841cc?w=400&q=80" },
            ]
        },
        {
            title: "Neural Networks",
            lectures: [
                { id: 3, title: "Neurons & Perceptrons", duration: "15:30", completed: false, thumbnail: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=400&q=80" },
                { id: 4, title: "Activation Functions", duration: "10:15", locked: true, thumbnail: "https://images.unsplash.com/photo-1515879218367-8466d910aaa4?w=400&q=80" },
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
                        <VideoPlayer
                            onStateChange={handleVideoStateChange}
                            markers={markers}
                        />
                    </div>

                    <div className="p-4 md:p-6">
                        <div className="border-b border-slate-800 mb-6 flex gap-6 overflow-x-auto no-scrollbar">
                            {[
                                { id: 'playlist', label: 'Content', icon: List, mobileOnly: true },
                                { id: 'ai', label: 'AI Tutor', icon: Zap, mobileOnly: true },
                                { id: 'overview', label: 'Overview', icon: FileText },
                                { id: 'quiz', label: 'Quiz', icon: HelpCircle },
                                { id: 'comments', label: 'Q&A', icon: HelpCircle },
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
                                    <ContextualAI
                                        videoState={videoState}
                                        addMarker={addMarker}
                                    />
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
                                <div className="space-y-6">
                                    {/* Question Submission Form */}
                                    <div className="bg-slate-900/50 p-4 rounded-xl border border-slate-800 mb-8">
                                        <h3 className="text-sm font-semibold text-slate-200 mb-3">Ask a question to the instructor</h3>
                                        <div className="flex gap-4">
                                            <div className="w-8 h-8 rounded-full bg-slate-700 shrink-0 flex items-center justify-center text-[10px] font-bold">YOU</div>
                                            <div className="flex-1">
                                                <textarea
                                                    placeholder="Type your question here (e.g. Can you explain the difference between RNN and LSTM?)"
                                                    rows="2"
                                                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 text-sm text-slate-200 focus:outline-none focus:ring-1 focus:ring-primary transition-all resize-none mb-2"
                                                />
                                                <div className="flex justify-end">
                                                    <Button size="sm">
                                                        <Send size={14} className="mr-2" /> Post Question
                                                    </Button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Questions List */}
                                    <div className="space-y-4">
                                        <div className="flex items-center justify-between">
                                            <h3 className="font-bold text-white uppercase text-[10px] tracking-wider text-slate-500">Discussion forum</h3>
                                            <span className="text-xs text-slate-500">2 questions asked</span>
                                        </div>

                                        {[
                                            {
                                                id: 1,
                                                user: "Mohammed Khaled",
                                                question: "How do we decide the number of hidden layers in a deep neural network?",
                                                date: "2 hours ago",
                                                reply: "Hi Mohammed! Generally, it starts with trial and error. More layers allow for more complex abstractions, but also risk overfitting. Start small and use validation metrics to guide your architecture."
                                            },
                                            {
                                                id: 2,
                                                user: "Nour Ali",
                                                question: "Is backpropagation the only way to train neural networks?",
                                                date: "1 day ago",
                                                reply: null
                                            }
                                        ].map(q => (
                                            <div key={q.id} className="p-4 bg-slate-900 rounded-xl border border-slate-800">
                                                <div className="flex items-center gap-3 mb-3">
                                                    <div className="w-8 h-8 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-[10px] text-slate-400 font-bold">
                                                        {q.user.charAt(0)}
                                                    </div>
                                                    <div>
                                                        <p className="text-sm font-semibold text-slate-200">{q.user}</p>
                                                        <p className="text-[10px] text-slate-500">{q.date}</p>
                                                    </div>
                                                </div>
                                                <p className="text-sm text-slate-300 mb-4">{q.question}</p>

                                                {q.reply ? (
                                                    <div className="mt-4 pt-4 border-t border-slate-800/50 flex gap-3">
                                                        <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center text-primary">
                                                            <User size={12} />
                                                        </div>
                                                        <div className="flex-1">
                                                            <div className="flex items-center gap-2 mb-1">
                                                                <p className="text-xs font-bold text-primary">Instructor Reply</p>
                                                                <span className="text-[10px] text-slate-600 px-1.5 py-0.5 bg-slate-800 rounded">Official</span>
                                                            </div>
                                                            <p className="text-xs text-slate-400 leading-relaxed italic">"{q.reply}"</p>
                                                        </div>
                                                    </div>
                                                ) : (
                                                    <div className="mt-2 text-[10px] font-medium text-yellow-600/70 italic flex items-center gap-1.5">
                                                        <Clock size={10} /> Waiting for instructor's response...
                                                    </div>
                                                )}
                                            </div>
                                        ))}
                                    </div>
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
                            <ContextualAI
                                videoState={videoState}
                                addMarker={addMarker}
                            />
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default VideoPlayerPage;
