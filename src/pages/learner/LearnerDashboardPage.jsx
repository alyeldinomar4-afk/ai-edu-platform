import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../auth/useAuth';
import { BookOpen, Clock, Award, Play, Sparkles, TrendingUp, User, Camera, Shield, ChevronRight, Megaphone, Bell, ArrowRight } from 'lucide-react';
import { motion, useInView, useSpring, useMotionValue, useTransform } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import Button from '../../components/ui/Button';
import { api } from '../../services/api';

// Animated counter component
const AnimatedStat = ({ value, suffix = '' }) => {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true });
    const numericValue = typeof value === 'string' ? parseFloat(value) || 0 : value;
    const motionValue = useMotionValue(0);
    const springValue = useSpring(motionValue, { stiffness: 80, damping: 20 });
    const [display, setDisplay] = useState('0');

    useEffect(() => {
        if (isInView) {
            motionValue.set(numericValue);
        }
    }, [isInView, numericValue, motionValue]);

    useEffect(() => {
        const unsubscribe = springValue.on('change', (latest) => {
            setDisplay(Math.round(latest).toString());
        });
        return unsubscribe;
    }, [springValue]);

    return <span ref={ref}>{display}{suffix}</span>;
};

// Stagger variants
const stagger = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.08, delayChildren: 0.1 } },
};
const fadeUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] } },
};

const LearnerDashboardPage = () => {
    const { user } = useAuth();
    const { t, i18n } = useTranslation();
    const isAr = i18n.language === 'ar';
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

    // Time-based greeting
    const getGreeting = () => {
        const hour = new Date().getHours();
        if (hour < 12) return t('dashboard.learner.greeting.morning', { defaultValue: 'Good Morning' });
        if (hour < 18) return t('dashboard.learner.greeting.afternoon', { defaultValue: 'Good Afternoon' });
        return t('dashboard.learner.greeting.evening', { defaultValue: 'Good Evening' });
    };

    const getGreetingEmoji = () => {
        const hour = new Date().getHours();
        if (hour < 12) return '☀️';
        if (hour < 18) return '🌤️';
        return '🌙';
    };

    const statCards = [
        { label: t('dashboard.learner.stats.inProgress'), value: stats.coursesInProgress, suffix: '', icon: BookOpen, color: 'from-blue-500 to-indigo-600', bgLight: 'bg-blue-50 dark:bg-blue-900/20', textColor: 'text-blue-600 dark:text-blue-400' },
        { label: t('dashboard.learner.stats.learningTime'), value: stats.hoursWatched, suffix: t('common.h', { defaultValue: 'h' }), icon: Clock, color: 'from-amber-500 to-orange-600', bgLight: 'bg-amber-50 dark:bg-amber-900/20', textColor: 'text-amber-600 dark:text-amber-400' },
        { label: t('dashboard.learner.stats.certificates'), value: stats.certificates, suffix: '', icon: Award, color: 'from-emerald-500 to-teal-600', bgLight: 'bg-emerald-50 dark:bg-emerald-900/20', textColor: 'text-emerald-600 dark:text-emerald-400' },
    ];

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 transition-colors duration-300">
            {/* Welcome — Gradient text + time greeting */}
            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-8"
            >
                <div className="flex items-center gap-2 mb-1">
                    <motion.span
                        animate={{ rotate: [0, 15, -15, 0] }}
                        transition={{ duration: 3, repeat: Infinity, repeatDelay: 4 }}
                        className="text-2xl"
                    >
                        {getGreetingEmoji()}
                    </motion.span>
                    <span className="text-sm font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider">{getGreeting()}</span>
                </div>
                <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">
                    {t('common.welcome')}{' '}
                    <Link to="/learner/profile" className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-purple-500 to-pink-500 hover:opacity-80 transition-opacity">
                        {user?.name}
                    </Link>!
                </h1>
                <p className="text-slate-500 dark:text-slate-400 mt-2">{t('dashboard.learner.welcomePrompt')}</p>
            </motion.div>

            {/* Stats Overview — Animated counters + hover lift */}
            <motion.div
                variants={stagger}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 mb-10"
            >
                {statCards.map((stat, i) => (
                    <motion.div
                        key={i}
                        variants={fadeUp}
                        whileHover={{ y: -4, transition: { duration: 0.2 } }}
                        className="group relative bg-white dark:bg-slate-900 p-5 sm:p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 flex items-center gap-4 transition-all duration-300 hover:shadow-lg hover:shadow-primary/5 dark:hover:shadow-primary/10 overflow-hidden"
                    >
                        {/* Gradient accent top */}
                        <div className={`absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r ${stat.color} opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />

                        <motion.div
                            whileHover={{ scale: 1.1, rotate: 5 }}
                            transition={{ type: 'spring', stiffness: 400 }}
                            className={`w-12 h-12 rounded-2xl flex items-center justify-center ${stat.bgLight} ${stat.textColor}`}
                        >
                            <stat.icon className="w-6 h-6" />
                        </motion.div>
                        <div>
                            <h3 className="text-2xl font-bold text-slate-900 dark:text-white">
                                <AnimatedStat value={stat.value} suffix={stat.suffix} />
                            </h3>
                            <p className="text-sm text-slate-500 dark:text-slate-400">{stat.label}</p>
                        </div>
                    </motion.div>
                ))}
            </motion.div>

            {/* Continue Learning — Animated progress bars */}
            <section className="mb-10">
                <motion.h2
                    initial={{ opacity: 0, x: isAr ? 10 : -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="text-xl font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2"
                >
                    <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ duration: 2, repeat: Infinity }}>
                        <Play className="w-5 h-5 text-primary fill-primary" />
                    </motion.div>
                    {t('dashboard.learner.continueLearning')}
                </motion.h2>
                <div className="space-y-4">
                    {progress.length > 0 ? progress.map((course, i) => (
                        <motion.div
                            key={course.courseId}
                            initial={{ opacity: 0, x: isAr ? 20 : -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: i * 0.1 }}
                            whileHover={{ y: -2 }}
                            className="group bg-white dark:bg-slate-900 p-4 sm:p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row gap-4 sm:gap-6 items-center transition-all duration-300 hover:shadow-lg hover:border-primary/20"
                        >
                            <div className="relative w-full sm:w-40 h-28 rounded-xl overflow-hidden">
                                <img
                                    src={course.image}
                                    alt={course.title}
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                />
                                {/* Play overlay */}
                                <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                                    <div className="w-10 h-10 rounded-full bg-white/90 flex items-center justify-center shadow-lg">
                                        <Play className="w-5 h-5 text-primary fill-primary ml-0.5" />
                                    </div>
                                </div>
                            </div>
                            <div className="flex-1 w-full text-left">
                                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-1 mb-2">
                                    <h3 className="font-bold text-lg text-slate-900 dark:text-white group-hover:text-primary transition-colors">{course.title}</h3>
                                    <span className="text-xs font-semibold bg-blue-100 dark:bg-blue-900/30 text-primary dark:text-blue-400 px-2 py-1 rounded-full w-fit">{t('common.inProgress')}</span>
                                </div>
                                <p className="text-slate-500 dark:text-slate-400 text-sm mb-3">{course.lastLesson}</p>
                                {/* Animated gradient progress bar */}
                                <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-2.5 mb-2 overflow-hidden">
                                    <motion.div
                                        initial={{ width: 0 }}
                                        animate={{ width: `${course.progress}%` }}
                                        transition={{ duration: 1.2, ease: [0.25, 0.46, 0.45, 0.94], delay: 0.3 + i * 0.15 }}
                                        className="h-full rounded-full bg-gradient-to-r from-primary via-purple-500 to-pink-500 relative"
                                    >
                                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer" />
                                    </motion.div>
                                </div>
                                <div className="flex justify-between text-xs text-slate-400 dark:text-slate-500">
                                    <span>{course.progress}% {t('common.completed')}</span>
                                </div>
                            </div>
                            <Link to={`/courses/${course.courseId}/learn`}>
                                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                                    <Button className="relative overflow-hidden group/btn">
                                        <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover/btn:translate-x-full transition-transform duration-700" />
                                        <Play className="w-4 h-4 mr-2 relative z-10" /> <span className="relative z-10">{t('dashboard.learner.resume')}</span>
                                    </Button>
                                </motion.div>
                            </Link>
                        </motion.div>
                    )) : (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="bg-white dark:bg-slate-900 p-10 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 text-center"
                        >
                            <motion.div
                                animate={{ y: [0, -5, 0] }}
                                transition={{ duration: 2, repeat: Infinity }}
                                className="w-16 h-16 rounded-full bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center text-primary mx-auto mb-4"
                            >
                                <BookOpen size={28} />
                            </motion.div>
                            <h3 className="font-bold text-lg text-slate-900 dark:text-white mb-1">{t('dashboard.learner.noCourses')}</h3>
                            <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">{t('dashboard.learner.noCoursesHint')}</p>
                            <Link to="/courses">
                                <Button>{t('dashboard.learner.browseCourses')}</Button>
                            </Link>
                        </motion.div>
                    )}
                </div>
            </section>

            {/* Recommended Courses */}
            <section className="mb-10">
                <motion.h2
                    initial={{ opacity: 0, x: isAr ? 10 : -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="text-xl font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2"
                >
                    <motion.div animate={{ rotate: [0, 15, -15, 0] }} transition={{ duration: 3, repeat: Infinity }}>
                        <Sparkles className="w-5 h-5 text-yellow-500" />
                    </motion.div>
                    {t('dashboard.learner.recommended')}
                </motion.h2>
                <motion.div
                    variants={stagger}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6"
                >
                    {recommendations.length > 0 ? recommendations.map((course, i) => (
                        <motion.div key={course.id} variants={fadeUp}>
                            <Link to={`/courses/${course.id}`} className="block bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 overflow-hidden hover:shadow-lg dark:hover:shadow-primary/10 hover:border-primary/20 transition-all group">
                                <div className="relative overflow-hidden">
                                    <img
                                        src={course.image}
                                        alt={course.title}
                                        className="w-full h-36 object-cover group-hover:scale-105 transition-transform duration-500"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                                </div>
                                <div className="p-4">
                                    <span className="text-xs font-semibold text-primary bg-primary/10 px-2 py-0.5 rounded-full">{course.category}</span>
                                    <h3 className="font-bold text-slate-900 dark:text-white mt-2 mb-1 line-clamp-1 group-hover:text-primary transition-colors">{course.title}</h3>
                                    <p className="text-sm text-slate-500 dark:text-slate-400">{course.instructor}</p>
                                    <div className="flex items-center gap-1 mt-2 text-sm text-yellow-500">
                                        ★ {course.rating} <span className="text-slate-400 dark:text-slate-500">({course.reviews})</span>
                                    </div>
                                </div>
                            </Link>
                        </motion.div>
                    )) : (
                        <div className="col-span-full bg-white dark:bg-slate-900 p-10 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 text-center">
                            <motion.div
                                animate={{ rotate: [0, 10, -10, 0] }}
                                transition={{ duration: 3, repeat: Infinity }}
                                className="w-16 h-16 rounded-full bg-yellow-50 dark:bg-yellow-900/20 flex items-center justify-center text-yellow-500 mx-auto mb-4"
                            >
                                <Sparkles size={28} />
                            </motion.div>
                            <h3 className="font-bold text-lg text-slate-900 dark:text-white mb-1">{t('dashboard.learner.noRecs')}</h3>
                            <p className="text-sm text-slate-500 dark:text-slate-400">{t('dashboard.learner.noRecsHint')}</p>
                        </div>
                    )}
                </motion.div>
            </section>

            {/* Instructor Announcements */}
            <section className="mb-10">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                        <Megaphone className="w-5 h-5 text-primary" /> {t('dashboard.learner.announcements')}
                    </h2>
                    <motion.span
                        animate={{ scale: [1, 1.1, 1] }}
                        transition={{ duration: 2, repeat: Infinity }}
                        className="bg-primary/10 text-primary text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-wider"
                    >
                        {t('common.new', { defaultValue: 'New' })}
                    </motion.span>
                </div>
                <div className="space-y-4">
                    <motion.div
                        initial={{ opacity: 0, x: isAr ? -10 : 10 }}
                        animate={{ opacity: 1, x: 0 }}
                        whileHover={{ y: -2 }}
                        className="bg-gradient-to-r from-primary/5 to-transparent dark:from-primary/10 dark:to-transparent p-5 rounded-2xl border border-primary/10 flex gap-4 items-start transition-all hover:shadow-md hover:border-primary/20"
                    >
                        <motion.div
                            animate={{ rotate: [0, 10, -10, 0] }}
                            transition={{ duration: 4, repeat: Infinity }}
                            className="w-10 h-10 rounded-full bg-white dark:bg-slate-800 flex items-center justify-center text-primary shadow-sm border border-primary/5"
                        >
                            <Bell size={20} />
                        </motion.div>
                        <div className="flex-1">
                            <div className="flex justify-between items-start mb-1">
                                <h3 className="font-bold text-slate-900 dark:text-white">New Bonus Section Added!</h3>
                                <span className="text-xs text-slate-500">2h ago</span>
                            </div>
                            <p className="text-sm text-slate-600 dark:text-slate-400 mb-3">Hi everyone! I just uploaded 3 new videos covering the latest React 19 hooks. Make sure to check them out in Section 8...</p>
                            <Link to="/courses/2" className="text-xs font-bold text-primary hover:underline flex items-center gap-1 group">
                                {t('common.viewCourse', { defaultValue: 'View Course' })} <ChevronRight size={12} className="group-hover:translate-x-1 transition-transform" />
                            </Link>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Quick Actions — 3D hover + animated icons */}
            <section>
                <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-green-500" /> {t('dashboard.learner.quickActions')}
                </h2>
                <motion.div
                    variants={stagger}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
                >
                    {[
                        { to: '/courses', icon: BookOpen, title: t('dashboard.learner.browseCourses'), desc: t('dashboard.learner.browseCoursesHint', { defaultValue: 'Explore new topics' }), gradient: 'from-blue-500 to-indigo-600', bg: 'bg-blue-50 dark:bg-blue-900/20', text: 'text-blue-600 dark:text-blue-400' },
                        { to: '/ai-demo', icon: Sparkles, title: t('dashboard.learner.aiTutor'), desc: t('dashboard.learner.aiTutorHint'), gradient: 'from-purple-500 to-pink-600', bg: 'bg-purple-50 dark:bg-purple-900/20', text: 'text-purple-600 dark:text-purple-400' },
                        { to: '/learner/profile', icon: User, title: t('dashboard.learner.profile'), desc: t('dashboard.learner.profileHint'), gradient: 'from-teal-500 to-emerald-600', bg: 'bg-teal-50 dark:bg-teal-900/20', text: 'text-teal-600 dark:text-teal-400' },
                    ].map((action, i) => (
                        <motion.div key={action.to} variants={fadeUp}>
                            <Link to={action.to}>
                                <motion.div
                                    whileHover={{ y: -6, transition: { duration: 0.2 } }}
                                    className="group relative bg-white dark:bg-slate-900 p-5 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 hover:border-transparent transition-all duration-300 flex items-center gap-4 overflow-hidden"
                                >
                                    {/* Gradient border glow on hover */}
                                    <div className={`absolute -inset-[1px] rounded-2xl bg-gradient-to-r ${action.gradient} opacity-0 group-hover:opacity-20 blur-[1px] transition-opacity duration-400`} />
                                    {/* Gradient accent top bar */}
                                    <div className={`absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r ${action.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />

                                    <motion.div
                                        whileHover={{ scale: 1.15, rotate: 8 }}
                                        transition={{ type: 'spring', stiffness: 400 }}
                                        className={`w-12 h-12 shrink-0 rounded-2xl flex items-center justify-center ${action.bg} ${action.text} relative z-10`}
                                    >
                                        <action.icon className="w-6 h-6" />
                                    </motion.div>
                                    <div className="relative z-10 flex-1">
                                        <h3 className="font-semibold text-slate-900 dark:text-white group-hover:text-primary transition-colors">{action.title}</h3>
                                        <p className="text-sm text-slate-500 dark:text-slate-400 text-left">{action.desc}</p>
                                    </div>
                                    <ArrowRight className={`w-4 h-4 text-slate-300 dark:text-slate-600 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all relative z-10 ${isAr ? 'rotate-180 group-hover:-translate-x-1' : ''}`} />
                                </motion.div>
                            </Link>
                        </motion.div>
                    ))}
                </motion.div>
            </section>
        </div>
    );
};

export default LearnerDashboardPage;
