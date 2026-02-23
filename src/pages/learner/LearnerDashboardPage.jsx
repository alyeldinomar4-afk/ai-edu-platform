import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../auth/useAuth';
import { BookOpen, Clock, Award, Play, Sparkles, TrendingUp } from 'lucide-react';
import { motion } from 'framer-motion';
import Button from '../../components/ui/Button';
import { api } from '../../services/api';

const LearnerDashboardPage = () => {
    const { user } = useAuth();
    const [stats, setStats] = useState({ hoursWatched: 0, certificates: 0, coursesInProgress: 0 });
    const [progress, setProgress] = useState([]);
    const [recommendations, setRecommendations] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadDashboard = async () => {
            try {
                const [statsData, progressData, recsData] = await Promise.all([
                    api.learner.getStats(),
                    api.learner.getProgress(),
                    api.learner.getRecommendations()
                ]);
                setStats(statsData);
                setProgress(progressData);
                setRecommendations(recsData);
            } catch (err) {
                console.error('Failed to load dashboard:', err);
            } finally {
                setLoading(false);
            }
        };
        loadDashboard();
    }, []);

    const statCards = [
        { label: 'Courses in Progress', value: stats.coursesInProgress, icon: BookOpen, color: 'bg-blue-100 dark:bg-blue-900/30 text-primary dark:text-blue-400' },
        { label: 'Learning Time', value: `${stats.hoursWatched}h`, icon: Clock, color: 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-400' },
        { label: 'Certificates Earned', value: stats.certificates, icon: Award, color: 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400' },
    ];

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 transition-colors duration-300">
            {/* Welcome */}
            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-8"
            >
                <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">Welcome back, {user?.name}!</h1>
                <p className="text-slate-500 dark:text-slate-400 mt-2">Ready to continue your learning journey?</p>
            </motion.div>

            {/* Stats Overview */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 mb-10">
                {statCards.map((stat, i) => (
                    <motion.div
                        key={stat.label}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1 }}
                        className="bg-white dark:bg-slate-900 p-5 sm:p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 flex items-center gap-4 transition-colors"
                    >
                        <div className={`w-12 h-12 rounded-full flex items-center justify-center ${stat.color}`}>
                            <stat.icon className="w-6 h-6" />
                        </div>
                        <div>
                            <h3 className="text-2xl font-bold text-slate-900 dark:text-white">{stat.value}</h3>
                            <p className="text-sm text-slate-500 dark:text-slate-400">{stat.label}</p>
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* Continue Learning */}
            <section className="mb-10">
                <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                    <Play className="w-5 h-5 text-primary" /> Continue Learning
                </h2>
                <div className="space-y-4">
                    {progress.map((course) => (
                        <motion.div
                            key={course.courseId}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="bg-white dark:bg-slate-900 p-4 sm:p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row gap-4 sm:gap-6 items-center transition-colors"
                        >
                            <img
                                src={course.image}
                                alt={course.title}
                                className="w-full sm:w-40 h-28 object-cover rounded-xl"
                            />
                            <div className="flex-1 w-full">
                                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-1 mb-2">
                                    <h3 className="font-bold text-lg text-slate-900 dark:text-white">{course.title}</h3>
                                    <span className="text-xs font-semibold bg-blue-100 dark:bg-blue-900/30 text-primary dark:text-blue-400 px-2 py-1 rounded-full w-fit">In Progress</span>
                                </div>
                                <p className="text-slate-500 dark:text-slate-400 text-sm mb-3">{course.lastLesson}</p>
                                <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-2 mb-2">
                                    <div className="bg-primary h-2 rounded-full transition-all duration-500" style={{ width: `${course.progress}%` }}></div>
                                </div>
                                <div className="flex justify-between text-xs text-slate-400 dark:text-slate-500">
                                    <span>{course.progress}% Completed</span>
                                </div>
                            </div>
                            <Link to={`/courses/${course.courseId}/learn`}>
                                <Button>
                                    <Play className="w-4 h-4 mr-2" /> Resume
                                </Button>
                            </Link>
                        </motion.div>
                    ))}
                </div>
            </section>

            {/* Recommended Courses */}
            <section className="mb-10">
                <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-yellow-500" /> Recommended for You
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                    {recommendations.map((course, i) => (
                        <motion.div
                            key={course.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.1 }}
                        >
                            <Link to={`/courses/${course.id}`} className="block bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 overflow-hidden hover:shadow-md dark:hover:shadow-primary/10 transition-all group">
                                <img
                                    src={course.image}
                                    alt={course.title}
                                    className="w-full h-36 object-cover group-hover:scale-105 transition-transform duration-300"
                                />
                                <div className="p-4">
                                    <span className="text-xs font-semibold text-primary bg-primary/10 px-2 py-0.5 rounded-full">{course.category}</span>
                                    <h3 className="font-bold text-slate-900 dark:text-white mt-2 mb-1 line-clamp-1">{course.title}</h3>
                                    <p className="text-sm text-slate-500 dark:text-slate-400">{course.instructor}</p>
                                    <div className="flex items-center gap-1 mt-2 text-sm text-yellow-500">
                                        ★ {course.rating} <span className="text-slate-400 dark:text-slate-500">({course.reviews})</span>
                                    </div>
                                </div>
                            </Link>
                        </motion.div>
                    ))}
                </div>
            </section>

            {/* Quick Actions */}
            <section>
                <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-green-500" /> Quick Actions
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Link to="/courses" className="bg-white dark:bg-slate-900 p-5 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 hover:border-primary/30 transition-colors flex items-center gap-4">
                        <div className="w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-primary dark:text-blue-400">
                            <BookOpen className="w-6 h-6" />
                        </div>
                        <div>
                            <h3 className="font-semibold text-slate-900 dark:text-white">Browse Courses</h3>
                            <p className="text-sm text-slate-500 dark:text-slate-400">Explore new topics</p>
                        </div>
                    </Link>
                    <Link to="/ai-demo" className="bg-white dark:bg-slate-900 p-5 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 hover:border-primary/30 transition-colors flex items-center gap-4">
                        <div className="w-12 h-12 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center text-purple-600 dark:text-purple-400">
                            <Sparkles className="w-6 h-6" />
                        </div>
                        <div>
                            <h3 className="font-semibold text-slate-900 dark:text-white">AI Tutor</h3>
                            <p className="text-sm text-slate-500 dark:text-slate-400">Get help from AI assistant</p>
                        </div>
                    </Link>
                </div>
            </section>
        </div>
    );
};

export default LearnerDashboardPage;
