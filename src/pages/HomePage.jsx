import { motion } from 'framer-motion';
import { Zap, Sparkles, Star, Code2, BarChart3, Palette, Megaphone, Camera, DollarSign, BookOpen, ArrowRight, Users, Award } from 'lucide-react';
import React from 'react';
import Button from '../components/ui/Button';
import HeroSection from '../components/sections/HeroSection';
import AnimatedCounter from '../components/ui/AnimatedCounter';
import CourseCard from '../components/features/course/CourseCard';
import { courses, categories, testimonials, instructors } from '../data/mockData';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../auth/useAuth';
import { useTranslation } from 'react-i18next';
import { cn } from '../utils';

/* ─── Shared Framer Motion variants ─── */
const staggerContainer = {
    hidden: {},
    visible: {
        transition: {
            staggerChildren: 0.08,
            delayChildren: 0.1,
        },
    },
};

const fadeSlideUp = {
    hidden: { opacity: 0, y: 30, filter: 'blur(4px)' },
    visible: {
        opacity: 1,
        y: 0,
        filter: 'blur(0px)',
        transition: { duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] },
    },
};

const fadeScale = {
    hidden: { opacity: 0, scale: 0.85 },
    visible: {
        opacity: 1,
        scale: 1,
        transition: { duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] },
    },
};

const slideFromLeft = {
    hidden: { opacity: 0, x: -40 },
    visible: {
        opacity: 1,
        x: 0,
        transition: { duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] },
    },
};

const slideFromRight = {
    hidden: { opacity: 0, x: 40 },
    visible: {
        opacity: 1,
        x: 0,
        transition: { duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] },
    },
};


const HomePage = () => {
    const navigate = useNavigate();
    const { isAuthenticated, user } = useAuth();
    const { t, i18n } = useTranslation();
    const isAr = i18n.language === 'ar';

    const getStartedPath = !isAuthenticated
        ? '/register'
        : user?.role === 'admin'
            ? '/admin/dashboard'
            : user?.role === 'instructor'
                ? '/instructor/dashboard'
                : '/learner/dashboard';

    const iconMap = {
        Code2,
        BarChart3,
        Palette,
        Megaphone,
        Camera,
        DollarSign,
    };

    return (
        <div className="space-y-0 pb-24 overflow-x-hidden transition-colors duration-300">
            {/* Hero Section — Clean & Minimal */}
            <HeroSection getStartedPath={getStartedPath} />


            {/* Stats Section — Animated Counters */}
            <section className="bg-slate-900 dark:bg-black text-white py-12 transition-colors duration-300">
                <motion.div
                    variants={staggerContainer}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: '-50px' }}
                    className="max-w-7xl mx-auto px-4 flex flex-wrap justify-between items-center gap-8 text-center md:text-left"
                >
                    {[
                        { label: t('home.stats.learners'), value: 50, suffix: 'k+' },
                        { label: t('home.stats.courses'), value: 200, suffix: '+' },
                        { label: t('home.stats.instructors'), value: 50, suffix: '+' },
                        { label: t('home.stats.satisfaction'), value: 99, suffix: '%' },
                    ].map((stat, idx) => (
                        <motion.div key={idx} variants={fadeSlideUp} className="flex-1 min-w-[150px]">
                            <h3 className="text-4xl font-bold bg-clip-text text-transparent bg-linear-to-r from-primary via-secondary to-white">
                                <AnimatedCounter target={stat.value} suffix={stat.suffix} duration={2.5} />
                            </h3>
                            <p className="text-slate-400 text-sm mt-1 uppercase tracking-wider">{stat.label}</p>
                        </motion.div>
                    ))}
                </motion.div>
            </section>

            {/* Categories Section — Premium Redesign */}
            <section className="relative py-24 overflow-hidden">
                {/* Background */}
                <div className="absolute inset-0 bg-gradient-to-b from-slate-50 via-white to-slate-50 dark:from-slate-950 dark:via-[#0c1020] dark:to-slate-950 transition-colors duration-500" />
                <div className="absolute inset-0 opacity-[0.02] dark:opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(circle, rgba(99,102,241,0.8) 1px, transparent 1px)', backgroundSize: '32px 32px' }} />

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                        className="text-center mb-16"
                    >
                        <motion.span
                            initial={{ opacity: 0, scale: 0.9 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 dark:bg-primary/15 border border-primary/20 text-primary font-semibold tracking-wider uppercase text-xs mb-4"
                        >
                            <motion.span animate={{ rotate: [0, 15, -15, 0] }} transition={{ duration: 3, repeat: Infinity }}>
                                <Sparkles className="w-3.5 h-3.5" />
                            </motion.span>
                            {t('home.categories.badge')}
                        </motion.span>
                        <h2 className="text-3xl md:text-5xl font-extrabold text-slate-900 dark:text-white mt-3 tracking-tight">{t('home.categories.title')}</h2>
                        <p className="text-slate-500 dark:text-slate-400 mt-4 max-w-xl mx-auto text-base leading-relaxed">{t('home.categories.subtitle')}</p>
                    </motion.div>

                    <motion.div
                        variants={staggerContainer}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, margin: '-30px' }}
                        className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-5"
                    >
                        {categories.map((cat, idx) => {
                            const IconComponent = cat.icon && iconMap[cat.icon] ? iconMap[cat.icon] : null;
                            return (
                                <motion.div
                                    key={cat.id}
                                    variants={fadeScale}
                                    onClick={() => navigate(`/courses?category=${encodeURIComponent(cat.name)}`)}
                                    whileHover={{ y: -8, transition: { duration: 0.3, ease: 'easeOut' } }}
                                    className="group cursor-pointer relative"
                                >
                                    {/* Gradient border glow on hover */}
                                    <div className="absolute -inset-[1px] rounded-2xl bg-gradient-to-br from-primary/0 via-secondary/0 to-accent/0 group-hover:from-primary/40 group-hover:via-secondary/40 group-hover:to-accent/40 transition-all duration-500 blur-[1px] opacity-0 group-hover:opacity-100" />
                                    
                                    <div className="relative p-6 rounded-2xl bg-white dark:bg-slate-900/80 backdrop-blur-sm border border-slate-100 dark:border-slate-800 group-hover:border-transparent shadow-sm group-hover:shadow-xl group-hover:shadow-primary/5 dark:group-hover:shadow-primary/10 transition-all duration-400 text-center overflow-hidden">
                                        {/* Subtle radial glow inside card on hover */}
                                        <div className="absolute inset-0 bg-gradient-to-br from-primary/[0.03] via-transparent to-secondary/[0.03] opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                                        
                                        {/* Icon */}
                                        <motion.div
                                            whileHover={{ scale: 1.18, rotate: [0, -8, 8, 0] }}
                                            transition={{ type: 'spring', stiffness: 400, damping: 15 }}
                                            className={cn(
                                                "w-16 h-16 mx-auto rounded-2xl flex items-center justify-center mb-5 relative group-hover:shadow-lg transition-shadow duration-300",
                                                cat.bgColor || "bg-slate-50 dark:bg-slate-800"
                                            )}
                                        >
                                            {IconComponent ? (
                                                <IconComponent className={cn("w-7 h-7 transition-all duration-300 group-hover:scale-110", cat.color || "text-slate-600 dark:text-slate-400")} />
                                            ) : (
                                                <span className="text-2xl transition-all duration-300 group-hover:scale-110">{cat.icon || '📚'}</span>
                                            )}
                                        </motion.div>
                                        
                                        {/* Title */}
                                        <h3 className="font-bold text-[15px] text-slate-800 dark:text-white group-hover:text-primary dark:group-hover:text-primary transition-colors duration-300 mb-2 relative z-10">
                                            {t(`courses.categories.${cat.name.charAt(0).toLowerCase() + cat.name.slice(1).replace(/\s+/g, '')}`)}
                                        </h3>
                                        
                                        {/* Course count pill */}
                                        <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-slate-400 dark:text-slate-500 bg-slate-50 dark:bg-slate-800/60 px-2.5 py-1 rounded-full relative z-10">
                                            {cat.count} {t('home.categories.coursesCount')}
                                        </span>
                                        
                                        {/* Hover arrow indicator */}
                                        <div className="mt-3 flex justify-center opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-300">
                                            <ArrowRight className={cn("w-4 h-4 text-primary", isAr && "rotate-180")} />
                                        </div>
                                    </div>
                                </motion.div>
                            );
                        })}
                    </motion.div>
                </div>
            </section>

            {/* Featured Courses — Stagger Grid */}
            <section className="bg-slate-50 dark:bg-slate-900/50 py-20 transition-colors duration-300">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                        className="flex justify-between items-end mb-12"
                    >
                        <div>
                            <span className="text-primary font-semibold tracking-wider uppercase text-sm">{t('home.featured.badge')}</span>
                            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mt-2">{t('home.featured.title')}</h2>
                        </div>
                        <Link to="/courses">
                            <Button variant="ghost" className="hidden sm:flex items-center gap-1 hover:text-primary dark:text-slate-300 cursor-pointer">
                                {t('home.featured.btnViewAll')} <ArrowRight className="w-4 h-4" />
                            </Button>
                        </Link>
                    </motion.div>

                    <motion.div
                        variants={staggerContainer}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, margin: '-30px' }}
                        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8"
                    >
                        {courses.slice(0, 4).map((course, idx) => (
                            <motion.div key={course.id} variants={fadeSlideUp}>
                                <CourseCard course={course} />
                            </motion.div>
                        ))}
                    </motion.div>

                    <div className="mt-8 text-center sm:hidden">
                        <Link to="/courses">
                            <Button variant="outline" className="w-full h-12 dark:border-slate-700 dark:text-slate-300">{t('home.featured.btnViewAll')}</Button>
                        </Link>
                    </div>
                </div>
            </section>

            {/* AI Feature Highlight — Cinematic Entrance */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 relative overflow-visible">
                {/* Enhanced Neon Glow behind the content */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[110%] h-[110%] bg-linear-to-r from-primary/20 via-purple-500/10 to-transparent blur-[140px] rounded-full pointer-events-none z-0 animate-pulse" style={{ animationDuration: '4s' }} />
                
                <motion.div
                    initial={{ opacity: 0, scale: 0.92, y: 40 }}
                    whileInView={{ opacity: 1, scale: 1, y: 0 }}
                    viewport={{ once: true, margin: '-80px' }}
                    transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                    className="bg-[#050505] rounded-2xl sm:rounded-[3rem] p-6 sm:p-10 md:p-20 overflow-hidden relative text-white border border-slate-800 shadow-[0_0_80px_-20px_rgba(138,43,226,0.25)] z-10"
                >
                    <div className="relative z-10 grid lg:grid-cols-2 gap-12 items-center">
                        <motion.div
                            initial={{ opacity: 0, x: isAr ? 30 : -30 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.7, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
                        >
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-white text-sm font-semibold mb-6 backdrop-blur-sm border border-white/10">
                                <Zap className="w-4 h-4 text-yellow-400" />
                                <span>{t('home.aiHighlight.badge')}</span>
                            </div>
                            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 leading-tight">
                                {t('home.aiHighlight.titleMain')} <br />
                                <span className="text-transparent bg-clip-text bg-linear-to-r from-primary to-secondary">{t('home.aiHighlight.titleHighlight')}</span>
                            </h2>
                            <p className="text-slate-300 text-base sm:text-lg mb-8 leading-relaxed">
                                {t('home.aiHighlight.subtitle')}
                            </p>
                            <Link to="/ai-demo">
                                <motion.div whileHover={{ scale: 1.06 }} whileTap={{ scale: 0.96 }}>
                                    <Button size="lg" className="bg-white text-slate-900 hover:bg-slate-100 border-none shadow-xl shadow-white/10 flex items-center gap-2 relative overflow-hidden group/ai">
                                        <span className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/15 to-transparent -translate-x-full group-hover/ai:translate-x-full transition-transform duration-700" />
                                        <motion.span
                                            animate={{ rotate: [0, 15, -15, 0] }}
                                            transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                                            className="relative z-10"
                                        >
                                            <Sparkles className="w-5 h-5 text-primary" />
                                        </motion.span>
                                        <span className="relative z-10">{t('home.aiHighlight.btnTryDemo')}</span>
                                        <ArrowRight className={cn("w-5 h-5 relative z-10 transition-transform group-hover/ai:translate-x-1", isAr && "rotate-180 group-hover/ai:-translate-x-1")} />
                                    </Button>
                                </motion.div>
                            </Link>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, x: isAr ? -30 : 30 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.7, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
                            className="relative"
                        >
                            {/* Abstract UI representation of chat */}
                            <div className="bg-slate-800/80 dark:bg-slate-900/80 backdrop-blur-md rounded-2xl p-4 sm:p-6 border border-slate-700 dark:border-slate-800 shadow-2xl relative z-20">
                                <div className="space-y-4">
                                    <div className="flex gap-3 sm:gap-4 items-start">
                                        <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary shrink-0">
                                            <Users className="w-4 h-4 sm:w-5 sm:h-5" />
                                        </div>
                                        <div className="bg-slate-700/50 dark:bg-slate-800/50 p-3 sm:p-4 rounded-2xl rounded-tl-none text-slate-300 text-xs sm:text-sm flex-1 min-w-0">
                                            <p>{t('home.aiHighlight.chatUserQuery')}</p>
                                        </div>
                                    </div>
                                    <div className="flex gap-3 sm:gap-4 items-start">
                                        <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-green-500/20 flex items-center justify-center text-green-400 shrink-0">
                                            <Zap className="w-4 h-4 sm:w-5 sm:h-5" />
                                        </div>
                                        <div className="bg-slate-700/50 dark:bg-slate-800/50 p-3 sm:p-4 rounded-2xl rounded-tl-none text-slate-300 text-xs sm:text-sm flex-1 min-w-0">
                                            <p className="mb-2">{t('home.aiHighlight.chatAiResponse')}</p>
                                            <div className="bg-[#0a0a0a] rounded-xl p-3 sm:p-4 font-mono text-[10px] sm:text-xs text-slate-300 overflow-x-auto border border-white/5 shadow-inner">
                                                <span className="text-pink-400">const</span> <span className="text-cyan-400">memoizedValue</span> = <span className="text-purple-400">useMemo</span>(() <span className="text-pink-400">=&gt;</span> <span className="text-yellow-300">computeExpensiveValue</span>(a, b), [a, b]);
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Decorative blurred circles behind */}
                            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full h-full bg-linear-to-r from-primary to-purple-600 blur-[80px] opacity-20 -z-10 rounded-full animate-pulse" />
                        </motion.div>
                    </div>
                </motion.div>
            </section>

            {/* Top Instructors Section - Stagger with Alternating Slides */}
            <section className="relative py-20 overflow-hidden bg-white dark:bg-[#0a0a0a] border-y border-slate-200 dark:border-slate-800/60 transition-colors duration-500">
                {/* Decorative background elements */}
                <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/3 w-[500px] h-[500px] bg-primary/10 dark:bg-primary/5 rounded-full blur-[100px] opacity-20 dark:opacity-40 mix-blend-multiply dark:mix-blend-screen pointer-events-none" />
                <div className="absolute bottom-0 left-0 translate-y-1/2 -translate-x-1/3 w-[400px] h-[400px] bg-secondary/10 dark:bg-secondary/5 rounded-full blur-[80px] opacity-20 dark:opacity-40 mix-blend-multiply dark:mix-blend-screen pointer-events-none" />
                
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                        className="flex flex-col md:flex-row items-center md:items-end justify-between mb-10 gap-6 text-center md:text-start"
                    >
                        <div className="max-w-2xl">
                            <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                                {t('home.instructors.titleMain')} <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">{t('home.instructors.titleHighlight')}</span>
                            </h2>
                            <p className="text-slate-500 dark:text-slate-400 text-sm mt-2 max-w-lg mx-auto md:mx-0">
                                {t('home.instructors.subtitle')}
                            </p>
                        </div>
                        <Link to="/instructors" className="group shrink-0">
                            <Button variant="outline" size="sm" className="border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:text-primary dark:hover:text-white hover:border-primary/50 dark:hover:border-slate-500 bg-white dark:bg-slate-800/30 backdrop-blur-sm rounded-full px-6 transition-all shadow-sm">
                                {t('home.instructors.viewAll')} <ArrowRight className={`w-3.5 h-3.5 transition-transform group-hover:translate-x-1 ${document.documentElement.dir === 'rtl' ? 'mr-1.5 rotate-180 group-hover:-translate-x-1' : 'ml-1.5'}`} />
                            </Button>
                        </Link>
                    </motion.div>

                    <motion.div
                        variants={staggerContainer}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, margin: '-50px' }}
                        className="grid lg:grid-cols-2 gap-6 max-w-5xl mx-auto"
                    >
                        {instructors.slice(0, 2).map((instructor, idx) => (
                            <motion.div
                                key={instructor.id}
                                variants={idx % 2 === 0 ? slideFromLeft : slideFromRight}
                                className="group relative rounded-2xl p-[1px] bg-slate-200 dark:bg-slate-800 hover:bg-gradient-to-r hover:from-primary/50 hover:to-secondary/50 transition-all duration-500 overflow-hidden shadow-sm hover:shadow-xl dark:shadow-2xl"
                            >
                                <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-secondary/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                                <div className="relative h-full bg-white dark:bg-[#121212] backdrop-blur-md rounded-[15px] p-5 sm:p-6 sm:py-8 flex flex-col sm:flex-row items-center sm:items-start gap-6 text-center sm:text-start border-[0.5px] border-slate-100 dark:border-slate-700/40 group-hover:border-primary/30 transition-colors">
                                    
                                    {/* Avatar */}
                                    <div className="relative shrink-0">
                                        <div className="absolute inset-0 bg-gradient-to-tr from-primary to-secondary rounded-full blur-md opacity-20 dark:opacity-30 group-hover:opacity-60 transition-opacity duration-300" />
                                        <img src={instructor.avatar} alt={instructor.name} className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-full object-cover border border-slate-200 dark:border-slate-700 shadow-md z-10" />
                                        <div className="absolute -bottom-1 -right-1 bg-white dark:bg-slate-800 rounded-full p-1.5 border border-slate-100 dark:border-slate-700 z-20 shadow-xs">
                                            <Award className="w-3.5 h-3.5 text-yellow-500 dark:text-yellow-400" />
                                        </div>
                                    </div>
                                    
                                    {/* Content */}
                                    <div className="flex-1 min-w-0 flex flex-col items-center sm:items-start w-full">
                                        <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-0.5 group-hover:text-primary transition-colors truncate w-full">{instructor.name}</h3>
                                        <p className="text-primary dark:text-secondary font-medium text-xs mb-3 truncate w-full">{instructor.role}</p>
                                        <p className="text-slate-500 dark:text-slate-400 text-xs sm:text-sm mb-4 line-clamp-1 w-full">{instructor.bio}</p>
                                        
                                        {/* Stats Row */}
                                        <div className="flex items-center gap-3 mb-5 text-slate-500 dark:text-slate-400 text-xs font-medium w-full truncate justify-center sm:justify-start">
                                            <div className="flex items-center gap-1.5 bg-slate-50 dark:bg-slate-800/50 px-2.5 py-1 rounded-lg border border-slate-100 dark:border-slate-700/50 shadow-sm">
                                                <BookOpen className="w-3.5 h-3.5 text-primary" />
                                                <span>{instructor.coursesCount} {t('home.instructors.courses')}</span>
                                            </div>
                                            <div className="flex items-center gap-1.5 bg-slate-50 dark:bg-slate-800/50 px-2.5 py-1 rounded-lg border border-slate-100 dark:border-slate-700/50 shadow-sm">
                                                <Star className="w-3.5 h-3.5 text-yellow-500 dark:text-yellow-400 fill-yellow-500 dark:fill-yellow-400" />
                                                <span>{instructor.rating}</span>
                                            </div>
                                        </div>
                                        
                                        <div className="mt-auto w-full sm:w-auto">
                                            <Link to={`/instructor/user/${encodeURIComponent(instructor.name.replace(/\s+/g, '-').toLowerCase())}`}>
                                                <Button size="sm" className="w-full sm:w-auto bg-slate-100 dark:bg-slate-800/80 hover:bg-gradient-to-r hover:from-primary hover:to-secondary text-slate-700 dark:text-white border-slate-200 dark:border-slate-700 shadow-none transition-all duration-300 text-xs px-5 py-2">
                                                    {t('home.instructors.viewProfile')}
                                                </Button>
                                            </Link>
                                        </div>
                                    </div>

                                </div>
                            </motion.div>
                        ))}
                    </motion.div>
                </div>
            </section>

            {/* Testimonials — Stagger with Scale */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="text-center mb-16"
                >
                    <span className="text-primary font-semibold tracking-wider uppercase text-sm">{t('home.testimonials.badge')}</span>
                    <h2 className="text-3xl font-bold text-slate-900 dark:text-white mt-2">{t('home.testimonials.title')}</h2>
                    <p className="text-slate-500 dark:text-slate-400 mt-3">{t('home.testimonials.subtitle')}</p>
                </motion.div>
                <motion.div
                    variants={staggerContainer}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: '-50px' }}
                    className="grid grid-cols-1 md:grid-cols-3 gap-8"
                >
                    {testimonials.map((testimonial, idx) => (
                        <motion.div
                            key={testimonial.id}
                            variants={fadeScale}
                            whileHover={{ y: -6, transition: { duration: 0.3 } }}
                            className="p-8 rounded-2xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-xl transition-all duration-300"
                        >
                            <div className="flex items-center gap-4 mb-6">
                                <img src={testimonial.avatar} alt={testimonial.name} className="w-12 h-12 rounded-full object-cover ring-2 ring-primary/10" />
                                <div>
                                    <h4 className="font-bold text-slate-900 dark:text-white">{testimonial.name}</h4>
                                    <p className="text-sm text-slate-500 dark:text-slate-400">
                                        {t(`home.testimonials.roles.${testimonial.role.charAt(0).toLowerCase() + testimonial.role.slice(1).replace(/\s+/g, '')}`)}
                                    </p>
                                </div>
                            </div>
                            <div className="flex gap-1 mb-4">
                                {[1, 2, 3, 4, 5].map(i => <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />)}
                            </div>
                            <p className="text-slate-600 dark:text-slate-300 italic leading-relaxed text-sm">"{testimonial.content}"</p>
                        </motion.div>
                    ))}
                </motion.div>
            </section>

            {/* CTA Section — Cinematic Zoom */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-10">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9, y: 30 }}
                    whileInView={{ opacity: 1, scale: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                    className="relative text-center py-16 px-8 rounded-3xl bg-linear-to-r from-primary via-secondary to-accent overflow-hidden"
                >
                    <div className="absolute inset-0 bg-black/20" />
                    {/* Animated floating particles */}
                    <motion.div
                        animate={{ y: [0, -15, 0], x: [0, 10, 0] }}
                        transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
                        className="absolute top-8 left-[15%] w-3 h-3 bg-white/20 rounded-full blur-[1px]"
                    />
                    <motion.div
                        animate={{ y: [0, 12, 0], x: [0, -8, 0] }}
                        transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
                        className="absolute bottom-12 right-[20%] w-4 h-4 bg-white/15 rounded-full blur-[1px]"
                    />
                    <motion.div
                        animate={{ y: [0, -10, 0], x: [0, -5, 0] }}
                        transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
                        className="absolute top-1/2 right-[10%] w-2 h-2 bg-white/25 rounded-full"
                    />
                    <div className="relative z-10 flex flex-col items-center">
                        <motion.div
                            initial={{ scale: 0, rotate: -180 }}
                            whileInView={{ scale: 1, rotate: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6, delay: 0.2, type: 'spring', stiffness: 200 }}
                        >
                            <Sparkles className="w-8 h-8 text-white/80 mx-auto mb-4" />
                        </motion.div>
                        <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">{t('home.cta.title')}</h2>
                        <p className="text-white/80 text-lg mb-8 max-w-xl mx-auto">{t('home.cta.subtitle')}</p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                            <Link to={getStartedPath}>
                                <motion.div whileHover={{ scale: 1.06 }} whileTap={{ scale: 0.96 }}>
                                    <Button size="lg" className="bg-white text-slate-900 hover:bg-slate-100 border-none shadow-xl shadow-white/20 h-14 px-8 text-lg flex items-center justify-center gap-2 relative overflow-hidden group/cta">
                                        <span className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/15 to-transparent -translate-x-full group-hover/cta:translate-x-full transition-transform duration-700" />
                                        <span className="relative z-10">{isAuthenticated ? t('home.cta.btnContinue') : t('home.cta.btnGetStarted')}</span>
                                        <ArrowRight className={cn("w-5 h-5 relative z-10 transition-transform group-hover/cta:translate-x-1", isAr && "rotate-180 group-hover/cta:-translate-x-1")} />
                                    </Button>
                                </motion.div>
                            </Link>
                        </div>
                    </div>
                </motion.div>
            </section>
        </div>
    );
};


export default HomePage;
