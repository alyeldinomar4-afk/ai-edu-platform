import { useState, useEffect } from 'react';
import Navbar from '../../components/layout/Navbar';
import { PlayCircle, Clock, Award, Zap, BookOpen } from 'lucide-react';
import Button from '../../components/ui/Button';
import Breadcrumb from '../../components/ui/Breadcrumb';
import { StatCardSkeleton, ProgressCardSkeleton } from '../../components/ui/LoadingSkeleton';
import { api } from '../../services/api';
import { Link } from 'react-router-dom';
import { formatDuration } from '../../utils/formatters';

const DashboardPage = () => {
    const [isLoading, setIsLoading] = useState(true);
    const [stats, setStats] = useState({ hoursWatched: 0, certificates: 0, coursesInProgress: 0 });
    const [learningProgress, setLearningProgress] = useState([]);
    const [recommendedCourses, setRecommendedCourses] = useState([]);

    useEffect(() => {
        const loadDashboardData = async () => {
            setIsLoading(true);
            try {
                const [statsData, progressData, recsData] = await Promise.all([
                    api.learner.getStats(),
                    api.learner.getProgress(),
                    api.learner.getRecommendations()
                ]);
                setStats(statsData);
                setLearningProgress(progressData);
                setRecommendedCourses(recsData);
            } catch (error) {
                console.error('Error fetching dashboard data:', error);
            } finally {
                setIsLoading(false);
            }
        };
        loadDashboardData();
    }, []);

    const hasEnrolledCourses = learningProgress.length > 0;

    return (
        <div className="min-h-screen bg-slate-50 pb-12">
            <Navbar />
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
                {/* Breadcrumb */}
                <Breadcrumb items={[{ label: 'Dashboard' }]} />

                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 mb-8">
                    <div>
                        <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">My Learning Dashboard</h1>
                        <p className="text-sm sm:text-base text-slate-500 mt-1">Welcome back, Student!</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
                    {/* Main Content */}
                    <div className="lg:col-span-2 space-y-8">
                        {/* Stats */}
                        <div className="grid grid-cols-3 gap-3 sm:gap-4">
                            {isLoading ? (
                                <>
                                    <StatCardSkeleton />
                                    <StatCardSkeleton />
                                    <StatCardSkeleton />
                                </>
                            ) : (
                                <>
                                    <div className="bg-white p-4 sm:p-6 rounded-xl border border-slate-100 shadow-sm flex flex-col items-center justify-center text-center">
                                        <div className="p-2 sm:p-3 bg-blue-50 text-blue-600 rounded-full mb-2 sm:mb-3"><PlayCircle size={20} className="sm:w-6 sm:h-6" /></div>
                                        <span className="text-xl sm:text-2xl font-bold text-slate-900">{stats.hoursWatched}</span>
                                        <span className="text-[10px] sm:text-xs text-slate-500 mt-0.5">Hours Watched</span>
                                    </div>
                                    <div className="bg-white p-4 sm:p-6 rounded-xl border border-slate-100 shadow-sm flex flex-col items-center justify-center text-center">
                                        <div className="p-2 sm:p-3 bg-green-50 text-green-600 rounded-full mb-2 sm:mb-3"><Award size={20} className="sm:w-6 sm:h-6" /></div>
                                        <span className="text-xl sm:text-2xl font-bold text-slate-900">{stats.certificates}</span>
                                        <span className="text-[10px] sm:text-xs text-slate-500 mt-0.5">Certificates</span>
                                    </div>
                                    <div className="bg-white p-4 sm:p-6 rounded-xl border border-slate-100 shadow-sm flex flex-col items-center justify-center text-center">
                                        <div className="p-2 sm:p-3 bg-purple-50 text-purple-600 rounded-full mb-2 sm:mb-3"><Zap size={20} className="sm:w-6 sm:h-6" /></div>
                                        <span className="text-xl sm:text-2xl font-bold text-slate-900">{stats.coursesInProgress}</span>
                                        <span className="text-[10px] sm:text-xs text-slate-500 mt-0.5">In Progress</span>
                                    </div>
                                </>
                            )}
                        </div>

                        {/* In Progress */}
                        <section>
                            <h2 className="text-lg sm:text-xl font-bold text-slate-900 mb-4">Continue Learning</h2>
                            {isLoading ? (
                                <div className="space-y-4">
                                    <ProgressCardSkeleton />
                                    <ProgressCardSkeleton />
                                </div>
                            ) : hasEnrolledCourses ? (
                                <div className="space-y-4">
                                    {learningProgress.map((item) => (
                                        <div key={item.courseId} className="bg-white p-4 sm:p-5 rounded-xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
                                            <div className="flex flex-col sm:flex-row justify-between items-start gap-3 sm:gap-0 mb-4">
                                                <div className="flex-1">
                                                    <h3 className="font-bold text-sm sm:text-base text-slate-900 mb-1 line-clamp-1">{item.title}</h3>
                                                    <div className="text-xs sm:text-sm text-slate-500 flex items-center gap-2">
                                                        <PlayCircle size={14} className="flex-shrink-0" />
                                                        <span className="truncate">Next: {item.lastLesson}</span>
                                                    </div>
                                                </div>
                                                <Link to={`/courses/${item.courseId}/learn`}>
                                                    <Button size="sm" className="w-full sm:w-auto">Continue</Button>
                                                </Link>
                                            </div>
                                            <div className="w-full bg-slate-100 rounded-full h-2 mb-2">
                                                <div className="bg-primary h-2 rounded-full transition-all duration-1000" style={{ width: `${item.progress}%` }}></div>
                                            </div>
                                            <div className="text-xs text-slate-400 text-right">{item.progress}% Complete</div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="bg-white p-8 sm:p-12 rounded-xl border border-dashed border-slate-200 text-center">
                                    <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                        <BookOpen className="w-8 h-8 text-slate-400" />
                                    </div>
                                    <h3 className="text-lg font-semibold text-slate-900 mb-2">No courses yet</h3>
                                    <p className="text-sm text-slate-500 mb-6 max-w-md mx-auto">
                                        You haven't enrolled in any courses yet. Start learning today and track your progress here.
                                    </p>
                                    <Link to="/courses">
                                        <Button>Browse Courses</Button>
                                    </Link>
                                </div>
                            )}
                        </section>

                        {/* Recommended */}
                        <section>
                            <h2 className="text-xl font-bold text-slate-900 mb-4">Recommended for You</h2>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                {recommendedCourses.map(course => (
                                    <Link key={course.id} to={`/courses/${course.id}`} className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm hover:border-primary/50 transition-colors group">
                                        <div className="flex gap-4">
                                            <img src={course.image} alt={course.title} className="w-20 h-20 rounded-lg object-cover" />
                                            <div>
                                                <h4 className="font-bold text-slate-900 group-hover:text-primary transition-colors line-clamp-2">{course.title}</h4>
                                                <p className="text-xs text-slate-500 mt-1">{course.instructor}</p>
                                                <div className="flex items-center gap-1 mt-2 text-xs font-semibold text-slate-700">
                                                    <Clock size={12} /> {formatDuration(course.duration)}
                                                </div>
                                            </div>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        </section>
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-6">
                        <div className="bg-gradient-to-br from-indigo-900 to-purple-900 rounded-2xl p-6 text-white text-center relative overflow-hidden">
                            <div className="relative z-10">
                                <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4 backdrop-blur-sm">
                                    <Zap className="text-yellow-400" />
                                </div>
                                <h3 className="font-bold text-lg mb-2">AI Learning Assistant</h3>
                                <p className="text-indigo-200 text-sm mb-6">Get personalized course recommendations and study plans.</p>
                                <Link to="/ai-demo">
                                    <Button className="w-full bg-white text-indigo-900 hover:bg-indigo-50 border-none">Chat with AI</Button>
                                </Link>
                            </div>
                            <div className="absolute top-0 right-0 -mr-8 -mt-8 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
                            <div className="absolute bottom-0 left-0 -ml-8 -mb-8 w-32 h-32 bg-purple-500/20 rounded-full blur-2xl"></div>
                        </div>

                        <div className="bg-white p-6 rounded-xl border border-slate-100 shadow-sm">
                            <h3 className="font-bold text-slate-900 mb-4">Saved Videos</h3>
                            {/* TODO: Replace with api.learner.getSavedVideos() when backend implements it */}
                            <div className="space-y-3">
                                {[1, 2, 3].map((i) => (
                                    <div key={i} className="flex items-center gap-3 p-2 hover:bg-slate-50 rounded-lg cursor-pointer transition-colors">
                                        <div className="w-10 h-10 bg-slate-200 rounded-lg flex-shrink-0 relative">
                                            <PlayCircle className="absolute inset-0 m-auto w-5 h-5 text-slate-500" />
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium text-slate-700 line-clamp-1">How to optimize React Code</p>
                                            <p className="text-xs text-slate-400">10 mins ago</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <Button variant="ghost" className="w-full mt-4 text-xs">View All Saved</Button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DashboardPage;
