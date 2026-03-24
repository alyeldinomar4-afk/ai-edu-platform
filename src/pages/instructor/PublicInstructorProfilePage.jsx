import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { User, Star, Users, PlayCircle, Clock, BookOpen, Globe, Linkedin, Twitter } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import toast from 'react-hot-toast';
import { useAuth } from '../../auth/useAuth';
import Button from '../../components/ui/Button';
import LoadingSkeleton, { CourseCardSkeleton } from '../../components/ui/LoadingSkeleton';
import CourseCard from '../../components/features/course/CourseCard';
import { courses } from '../../data/mockData';

const PublicInstructorProfilePage = () => {
    const { name } = useParams(); // Using the name from the URL
    const { t } = useTranslation();
    const navigate = useNavigate();
    const { isAuthenticated } = useAuth();
    // Decode name and handle any potential formatting issues
    const instructorName = decodeURIComponent(name).replace(/-/g, ' ');

    const [isLoading, setIsLoading] = useState(true);
    const [instructorCourses, setInstructorCourses] = useState([]);
    const [isFollowing, setIsFollowing] = useState(false);

    // Simulate loading and fetching instructor's courses
    useEffect(() => {
        setIsLoading(true);
        // Find courses taught by this instructor
        const foundCourses = courses.filter(course =>
            course.instructor.toLowerCase() === instructorName.toLowerCase()
        );

        // If they don't have courses in mock data, let's just assign some random ones for demo purposes
        if (foundCourses.length === 0) {
            setInstructorCourses(courses.slice(0, 4));
        } else {
            setInstructorCourses(foundCourses);
        }

        const timer = setTimeout(() => setIsLoading(false), 800);
        return () => clearTimeout(timer);
    }, [instructorName]);

    const handleFollowToggle = () => {
        if (!isAuthenticated) {
            toast.error(t('publicInstructor.loginRequiredToFollow'));
            navigate('/login', { state: { from: window.location.pathname } });
            return;
        }

        setIsFollowing(!isFollowing);
        // Simulate API call or toast notification here
        if (!isFollowing) {
            toast.success(`${t('publicInstructor.following')} ${instructorName}`);
            console.log(`Now following ${instructorName}`);
        } else {
            console.log(`Unfollowed ${instructorName}`);
        }
    };

    // Mock instructor details based on name
    const instructorStats = {
        totalStudents: 25400,
        reviews: 4800,
        averageRating: 4.8,
        courseCount: instructorCourses.length || 12
    };

    if (isLoading) {
        return (
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 min-h-screen">
                <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm overflow-hidden mb-12">
                    <div className="bg-slate-950 dark:bg-black h-48 w-full" />
                    <div className="px-8 pb-8 relative">
                        <div className="flex flex-col md:flex-row gap-6 relative -top-16 items-start md:items-end">
                            <LoadingSkeleton className="w-32 h-32 rounded-2xl shrink-0 border-4 border-white dark:border-slate-900" />
                            <div className="flex-1 pb-2 w-full">
                                <LoadingSkeleton className="w-48 h-8 mb-2" />
                                <LoadingSkeleton className="w-32 h-4" />
                            </div>
                        </div>
                        <div className="mt-2 text-center md:text-left">
                            <LoadingSkeleton className="w-full h-24 mb-6" />
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-slate-50 dark:bg-slate-950 min-h-screen py-12 transition-colors duration-300">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

                {/* Profile Header */}
                <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/60 dark:border-slate-800/80 shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-none overflow-hidden mb-12 transition-colors">
                    {/* Cover Banner */}
                    <div className="h-48 md:h-64 w-full bg-linear-to-r from-slate-900 via-primary-950 to-slate-900 relative overflow-hidden">
                        {/* Decorative elements */}
                        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
                        <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-500/20 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />

                        {/* Interactive particles/grid overlay (visual only) */}
                        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMSIgY3k9IjEiIHI9IjEiIGZpbGw9InJnYmEoMjU1LCAyNTUsIDI1NSwgMC4wNSkiLz48L3N2Zz4=')] opacity-50" />
                    </div>

                    <div className="px-6 md:px-10 pb-8 relative">
                        <div className="flex flex-col md:flex-row gap-6 relative -top-16 items-start md:items-end">
                            {/* Profile Image (Overlapping banner) */}
                            <motion.div
                                initial={{ y: 20, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                className="shrink-0 relative group"
                            >
                                <div className="w-32 h-32 md:w-40 md:h-40 rounded-2xl bg-white dark:bg-slate-800 shadow-xl overflow-hidden border-4 border-white dark:border-slate-900 mx-auto md:mx-0 z-10 relative">
                                    <img
                                        src={`https://ui-avatars.com/api/?name=${instructorName}&background=0D8ABC&color=fff&size=200`}
                                        alt={instructorName}
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                    />
                                </div>
                                <div className="absolute inset-0 bg-primary/10 rounded-2xl -z-10 translate-y-2 blur-md" />
                            </motion.div>

                            {/* Info beside image (desktop) / below image (mobile) */}
                            <div className="flex-1 pb-4 md:pb-2 text-center md:text-left mt-2 md:mt-0 w-full">
                                <motion.h1
                                    initial={{ y: 10, opacity: 0 }}
                                    animate={{ y: 0, opacity: 1 }}
                                    transition={{ delay: 0.1 }}
                                    className="text-3xl md:text-5xl font-bold text-white capitalize mb-2"
                                >
                                    {instructorName}
                                </motion.h1>
                                <motion.p
                                    initial={{ y: 10, opacity: 0 }}
                                    animate={{ y: 0, opacity: 1 }}
                                    transition={{ delay: 0.2 }}
                                    className="text-primary font-medium text-sm md:text-base flex items-center justify-center md:justify-start gap-2 mb-4"
                                >
                                    <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                                    Senior Technical Instructor
                                </motion.p>

                                {/* Social Links */}
                                <motion.div
                                    initial={{ y: 10, opacity: 0 }}
                                    animate={{ y: 0, opacity: 1 }}
                                    transition={{ delay: 0.25 }}
                                    className="flex items-center justify-center md:justify-start gap-4 mb-2"
                                >
                                    <a href="#" className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-500 hover:text-primary hover:bg-primary/10 transition-all hover:scale-110" title="Website">
                                        <Globe size={18} />
                                    </a>
                                    <a href="#" className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-500 hover:text-[#0A66C2] hover:bg-[#0A66C2]/10 transition-all hover:scale-110" title="LinkedIn">
                                        <Linkedin size={18} />
                                    </a>
                                    <a href="#" className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-500 hover:text-[#1DA1F2] hover:bg-[#1DA1F2]/10 transition-all hover:scale-110" title="Twitter">
                                        <Twitter size={18} />
                                    </a>
                                </motion.div>
                            </div>

                            {/* Actions */}
                            <motion.div
                                initial={{ y: 10, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ delay: 0.3 }}
                                className="hidden md:flex gap-3 pb-2"
                            >
                                <Button
                                    onClick={handleFollowToggle}
                                    variant={isFollowing ? "outline" : "primary"}
                                    className={`shadow-lg shadow-primary/20 transition-all ${isFollowing ? 'hover:bg-red-50 hover:text-red-500 hover:border-red-200 dark:hover:bg-red-900/20 dark:hover:border-red-800' : ''}`}
                                >
                                    {isFollowing ? t('publicInstructor.following') : t('publicInstructor.follow')}
                                </Button>
                            </motion.div>
                        </div>

                        {/* Bio & Stats Layout */}
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 md:-mt-8">

                            {/* Left Col: Bio */}
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.4 }}
                                className="lg:col-span-2 space-y-6"
                            >
                                <div>
                                    <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-3">{t('publicInstructor.aboutMe')}</h3>
                                    <div className="text-slate-600 dark:text-slate-300 space-y-4 leading-relaxed text-sm md:text-base">
                                        <p>
                                            Hi, I'm {instructorName}. I am a passionate software engineer and educator with over a decade of experience in the tech industry. My goal is to break down complex architectural concepts and programming paradigms into easily digestible lessons.
                                        </p>
                                        <p>
                                            I believe that learning should be practical and hands-on. In my courses, you won't just learn the theory—you will build real-world applications that solve actual problems. Let's build something amazing together!
                                        </p>
                                    </div>
                                </div>
                            </motion.div>

                            {/* Right Col: Stats */}
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.5 }}
                                className="lg:col-span-1"
                            >
                                <div className="bg-slate-50 dark:bg-slate-800/50 p-6 rounded-2xl border border-slate-100 dark:border-slate-700/50 space-y-4">
                                    <h3 className="font-bold text-slate-900 dark:text-white uppercase tracking-wider text-xs mb-4 text-slate-500">{t('publicInstructor.statistics')}</h3>

                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 rounded-full bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-500 flex items-center justify-center shrink-0">
                                            <Star className="w-5 h-5 fill-current" />
                                        </div>
                                        <div>
                                            <div className="font-bold text-slate-900 dark:text-white flex items-baseline gap-1">
                                                {instructorStats.averageRating}
                                                <span className="text-sm font-normal text-slate-500"> {t('publicInstructor.rating')}</span>
                                            </div>
                                            <div className="text-xs text-slate-500">{t('publicInstructor.from')} {instructorStats.reviews.toLocaleString()} {t('publicInstructor.reviews')}</div>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 rounded-full bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-500 flex items-center justify-center shrink-0">
                                            <Users className="w-5 h-5" />
                                        </div>
                                        <div>
                                            <div className="font-bold text-slate-900 dark:text-white">
                                                {instructorStats.totalStudents.toLocaleString()}
                                            </div>
                                            <div className="text-xs text-slate-500">{t('publicInstructor.students')}</div>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-500 flex items-center justify-center shrink-0">
                                            <PlayCircle className="w-5 h-5" />
                                        </div>
                                        <div>
                                            <div className="font-bold text-slate-900 dark:text-white">
                                                {instructorStats.courseCount}
                                            </div>
                                            <div className="text-xs text-slate-500">{t('publicInstructor.courses')}</div>
                                        </div>
                                    </div>

                                    <Button
                                        className={`w-full mt-4 md:hidden transition-all ${isFollowing ? 'hover:bg-red-50 hover:text-red-500 hover:border-red-200 dark:hover:bg-red-900/20 dark:hover:border-red-800' : ''}`}
                                        variant={isFollowing ? "outline" : "primary"}
                                        onClick={handleFollowToggle}
                                    >
                                        {isFollowing ? t('publicInstructor.following') : t('publicInstructor.follow')}
                                    </Button>
                                </div>
                            </motion.div>
                        </div>
                    </div>
                </div>

                {/* Courses Section */}
                <div className="space-y-6">
                    <div className="flex items-center justify-between">
                        <h2 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                            <BookOpen className="w-6 h-6 text-primary" />
                            {t('publicInstructor.coursesBy', { instructorName })}
                        </h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        <AnimatePresence mode="popLayout">
                            {instructorCourses.map((course, index) => (
                                <motion.div
                                    key={course.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.3, delay: index * 0.1 }}
                                >
                                    <CourseCard course={course} />
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default PublicInstructorProfilePage;
