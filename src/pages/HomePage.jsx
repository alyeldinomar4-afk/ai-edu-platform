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

            {/* Stats Section — Unified Style with Categories */}
            <section className="relative py-12 md:py-16 px-4 md:px-8 overflow-hidden">
                {/* Background match Categories in light, transparent in dark */}
                <div className="absolute inset-0 bg-[#F5F3FF] dark:bg-transparent transition-colors duration-500" />
                <div className="absolute inset-0 opacity-[0.02] dark:opacity-0" style={{ backgroundImage: 'radial-gradient(circle, rgba(99,102,241,0.8) 1px, transparent 1px)', backgroundSize: '32px 32px' }} />

                <div className="max-w-7xl mx-auto relative z-10 px-4 md:px-0">
                    <motion.div
                        variants={staggerContainer}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, margin: '-50px' }}
                        className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6"
                    >
                        {[
                            { label: t('home.stats.learners'), subtitle: t('home.stats.learnersSub'), value: 50, suffix: 'k+' },
                            { label: t('home.stats.courses'), subtitle: t('home.stats.coursesSub'), value: 200, suffix: '+' },
                            { label: t('home.stats.instructors'), subtitle: t('home.stats.instructorsSub'), value: 50, suffix: '+' },
                            { label: t('home.stats.satisfaction'), subtitle: t('home.stats.satisfactionSub'), value: 99, suffix: '%' },
                        ].map((stat, idx) => (
                            <motion.div 
                                key={idx} 
                                variants={fadeSlideUp} 
                                className="relative group"
                            >
                                {/* Stat Card — Floating Square Look */}
                                <div className="p-5 sm:p-7 rounded-[24px] bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 transition-all duration-500 group-hover:translate-y-[-6px] shadow-sm hover:shadow-xl hover:shadow-primary/10 flex flex-col items-center justify-center text-center h-full">
                                    <div className="relative mb-3">
                                        <h3 className="text-3xl md:text-4xl font-black text-primary dark:text-primary-light selection:bg-primary/20">
                                            <AnimatedCounter target={stat.value} suffix={stat.suffix} duration={2.5} />
                                        </h3>
                                        <div className="mt-1.5 mx-auto w-10 h-1 bg-primary/20 rounded-full overflow-hidden">
                                            <motion.div 
                                                initial={{ width: 0 }}
                                                whileInView={{ width: '100%' }}
                                                transition={{ duration: 2, delay: 0.5 + (idx * 0.2) }}
                                                className="h-full bg-primary"
                                            />
                                        </div>
                                    </div>
                                    <p className="text-slate-900 dark:text-white text-[10px] font-black uppercase tracking-[0.15em] mb-1">{stat.label}</p>
                                    <p className="text-slate-500 dark:text-slate-400 text-[9px] font-medium tracking-wide">{stat.subtitle}</p>
                                </div>
                            </motion.div>
                        ))}
                    </motion.div>
                </div>
            </section>

            {/* Categories Section — Premium Redesign */}
            <section className="relative py-24 overflow-hidden">
                {/* Background */}
                <div className="absolute inset-0 bg-[#F5F3FF] dark:bg-slate-950 transition-colors duration-500" />
                <div className="absolute inset-0 opacity-[0.02] dark:opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(circle, rgba(99,102,241,0.8) 1px, transparent 1px)', backgroundSize: '32px 32px' }} />

                <div className="max-w-7xl mx-auto px-6 sm:px-6 lg:px-8 relative z-10">
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
                            const isSpecial = idx % 3 === 0; // Simulate some trending categories
                            return (
                                <motion.div
                                    key={cat.id}
                                    variants={fadeScale}
                                    onClick={() => navigate(`/courses?category=${encodeURIComponent(cat.name)}`)}
                                    whileHover={{ 
                                        y: -10,
                                        transition: { duration: 0.3, ease: 'easeOut' } 
                                    }}
                                    className="group cursor-pointer relative"
                                >
                                    {/* Gradient border glow on hover */}
                                    <div className="absolute -inset-[1.5px] rounded-2xl bg-gradient-to-br from-primary via-secondary to-accent opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-[2px]" />

                                    <div className="relative p-7 rounded-2xl bg-white dark:bg-slate-900/90 backdrop-blur-md border border-slate-100 dark:border-slate-800 shadow-sm group-hover:shadow-2xl group-hover:shadow-primary/20 transition-all duration-400 text-center overflow-hidden h-full flex flex-col items-center">
                                        {/* Special Badge (Trending/Popular) */}
                                        {isSpecial && (
                                            <div className="absolute -top-1 -right-1 bg-gradient-to-r from-primary to-purple-600 text-white text-[9px] font-black px-2.5 py-1 rounded-bl-xl rounded-tr-xl shadow-lg z-20 uppercase tracking-tighter transition-transform group-hover:scale-110">
                                                {idx % 6 === 0 ? t('home.categories.trending', { defaultValue: 'Trending' }) : t('home.categories.hot', { defaultValue: 'Popular' })}
                                            </div>
                                        )}

                                        {/* Subtle radial glow inside card on hover */}
                                        <div className="absolute inset-0 bg-gradient-to-br from-primary/[0.05] via-transparent to-secondary/[0.05] opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                                        {/* Icon Container with centered alignment */}
                                        <motion.div
                                            whileHover={{ scale: 1.1, rotate: [0, -5, 5, 0] }}
                                            transition={{ type: 'spring', stiffness: 400, damping: 15 }}
                                            className={cn(
                                                "w-16 h-16 rounded-2xl flex items-center justify-center mb-6 relative group-hover:shadow-xl transition-all duration-300",
                                                cat.bgColor || "bg-slate-50 dark:bg-slate-800/80"
                                            )}
                                        >
                                            {IconComponent ? (
                                                <IconComponent className={cn("w-7 h-7 transition-all duration-300 group-hover:scale-110", cat.color || "text-slate-600 dark:text-slate-400")} />
                                            ) : (
                                                <span className="text-2xl transition-all duration-300 group-hover:scale-110">{cat.icon || '📚'}</span>
                                            )}
                                        </motion.div>

                                        {/* Title with improved weight and spacing */}
                                        <h3 className="font-extrabold text-[15px] text-slate-800 dark:text-white group-hover:text-primary dark:group-hover:text-primary transition-colors duration-300 mb-2.5 relative z-10 leading-tight">
                                            {t(`courses.categories.${cat.name.charAt(0).toLowerCase() + cat.name.slice(1).replace(/\s+/g, '')}`)}
                                        </h3>

                                        {/* Course count pill (Centered and Styled) */}
                                        <span className="mt-auto inline-flex items-center gap-1.5 text-[11px] font-bold text-slate-400 dark:text-slate-500 bg-slate-50/80 dark:bg-slate-800/60 px-3 py-1.5 rounded-full relative z-10 border border-slate-100 dark:border-slate-700/50">
                                            <span className="w-1 h-1 bg-primary rounded-full animate-pulse" />
                                            {cat.count} {t('home.categories.coursesCount')}
                                        </span>
                                    </div>
                                </motion.div>
                            );
                        })}
                    </motion.div>
                </div>
            </section>

            {/* Featured Courses — Stagger Grid with Carousel Mobile */}
            <section className="bg-[#F5F3FF] dark:bg-slate-900/50 py-20 md:py-24 transition-colors duration-300">
                <div className="max-w-7xl mx-auto px-6 sm:px-6 lg:px-8">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                        className="flex justify-between items-end mb-12"
                    >
                        <div>
                            <span className="text-primary font-semibold text-sm">{t('home.featured.badge')}</span>
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
                            className="flex overflow-x-auto snap-x snap-mandatory gap-6 pb-8 px-6 -mx-6 scrollbar-hide md:grid md:grid-cols-2 lg:grid-cols-4 md:px-0 md:mx-0 md:snap-none md:overflow-visible"
                        >
                            {courses.slice(0, 4).map((course, idx) => (
                                <motion.div 
                                    key={course.id} 
                                    variants={fadeSlideUp}
                                    className="flex-none w-[85%] sm:w-[320px] md:w-auto snap-start"
                                >
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
            <section className="relative py-20 md:py-24 overflow-hidden bg-[#F5F3FF] dark:bg-[#0a0a0a] border-y border-slate-200 dark:border-slate-800/60 transition-colors duration-500">
                {/* Decorative background elements */}
                <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/3 w-[500px] h-[500px] bg-primary/10 dark:bg-primary/5 rounded-full blur-[100px] opacity-20 dark:opacity-40 mix-blend-multiply dark:mix-blend-screen pointer-events-none" />
                <div className="absolute bottom-0 left-0 translate-y-1/2 -translate-x-1/3 w-[400px] h-[400px] bg-secondary/10 dark:bg-secondary/5 rounded-full blur-[80px] opacity-20 dark:opacity-40 mix-blend-multiply dark:mix-blend-screen pointer-events-none" />

                <div className="max-w-7xl mx-auto px-6 sm:px-6 lg:px-8 relative z-10">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                        className="flex flex-col md:flex-row items-center md:items-end justify-between mb-10 gap-6 text-center md:text-start p-8 rounded-3xl bg-[#F5F3FF] dark:bg-transparent border border-primary/5 dark:border-none"
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
                                whileHover={{ y: -8, transition: { duration: 0.4 } }}
                                className="group relative rounded-[32px] p-[1px] bg-slate-200 dark:bg-slate-800 hover:bg-gradient-to-r hover:from-primary/50 hover:to-secondary/50 transition-all duration-500 overflow-hidden shadow-sm hover:shadow-2xl dark:shadow-2xl"
                            >
                                <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-secondary/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                                <div className="relative h-full bg-white dark:bg-[#121212] backdrop-blur-md rounded-[31px] p-6 sm:p-8 flex flex-col sm:flex-row items-center sm:items-start gap-8 text-center sm:text-start border-[0.5px] border-slate-100 dark:border-slate-700/40 group-hover:border-primary/20 transition-colors">

                                    {/* Avatar with Glow Ring */}
                                    <div className="relative shrink-0">
                                        <div className="absolute inset-0 bg-gradient-to-tr from-primary to-secondary rounded-full blur-xl opacity-0 group-hover:opacity-40 transition-opacity duration-500 scale-125" />
                                        <div className="relative p-1 bg-gradient-to-tr from-slate-200 to-slate-100 dark:from-slate-700 dark:to-slate-800 rounded-full group-hover:from-primary group-hover:to-secondary transition-all duration-500">
                                            <img src={instructor.avatar} alt={instructor.name} className="w-20 h-20 sm:w-24 sm:h-24 rounded-full object-cover border-2 border-white dark:border-slate-900 shadow-xl z-10" />
                                        </div>
                                        <div className="absolute -bottom-1 -right-1 bg-white dark:bg-slate-800 rounded-full p-2 border border-slate-100 dark:border-slate-700 z-20 shadow-lg">
                                            <Award className="w-4 h-4 text-primary" />
                                        </div>
                                    </div>

                                    {/* Content Reveal on Hover */}
                                    <div className="flex-1 min-w-0 flex flex-col items-center sm:items-start w-full">
                                        <div className="mb-2">
                                            <h3 className="text-xl font-black text-slate-900 dark:text-white mb-0.5 group-hover:text-primary transition-colors">{instructor.name}</h3>
                                            <p className="text-primary dark:text-secondary font-bold text-[10px] uppercase tracking-widest">{instructor.role}</p>
                                        </div>
                                        
                                        <p className="text-slate-500 dark:text-slate-400 text-xs sm:text-sm mb-6 line-clamp-2 w-full leading-relaxed">
                                            {instructor.bio}
                                        </p>

                                        {/* Dynamic Stats Row */}
                                        <div className="flex items-center gap-4 mb-6 text-slate-500 dark:text-slate-400 text-xs font-bold w-full justify-center sm:justify-start">
                                            <div className="flex items-center gap-2 bg-slate-50 dark:bg-slate-800/50 px-3 py-1.5 rounded-xl border border-slate-100 dark:border-slate-700/50">
                                                <BookOpen className="w-4 h-4 text-primary/80" />
                                                <span>{instructor.coursesCount} Courses</span>
                                            </div>
                                            <div className="flex items-center gap-2 bg-slate-50 dark:bg-slate-800/50 px-3 py-1.5 rounded-xl border border-slate-100 dark:border-slate-700/50">
                                                <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                                                <span>{instructor.rating} Rating</span>
                                            </div>
                                        </div>

                                        <div className="w-full sm:w-auto mt-auto">
                                            <Link to={`/instructor/user/${encodeURIComponent(instructor.name.replace(/\s+/g, '-').toLowerCase())}`}>
                                                <Button size="sm" className="w-full sm:w-auto bg-slate-900 dark:bg-slate-800 hover:bg-primary text-white border-none shadow-lg hover:shadow-primary/30 transition-all duration-300 text-[11px] font-black uppercase tracking-wider px-7 py-3 rounded-xl">
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

            {/* Testimonials — Stagger with Scale & Carousel Mobile */}
            <section className="bg-[#F5F3FF] dark:bg-transparent py-20 md:py-24 transition-colors duration-300">
                <div className="max-w-7xl mx-auto px-6 sm:px-6 lg:px-8 pb-20">
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
                        className="flex overflow-x-auto snap-x snap-mandatory gap-6 pb-12 px-6 -mx-6 scrollbar-hide md:grid md:grid-cols-3 md:px-0 md:mx-0 md:snap-none md:overflow-visible relative"
                    >
                        {testimonials.map((testimonial, idx) => (
                            <motion.div
                                key={testimonial.id}
                                variants={fadeScale}
                                whileHover={{ y: -8, transition: { duration: 0.3 } }}
                                className="flex-none w-[85%] sm:w-[400px] md:w-auto snap-start p-8 sm:p-10 rounded-3xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800/60 shadow-sm hover:shadow-2xl hover:shadow-primary/5 transition-all duration-500 relative overflow-hidden"
                            >
                                <div className="absolute top-0 right-0 p-6 opacity-[0.03] dark:opacity-[0.05]">
                                    <Users className="w-20 h-20 rotate-12" />
                                </div>
                                <div className="flex items-center gap-5 mb-8">
                                    <div className="relative group/avatar">
                                        <div className="absolute inset-0 bg-primary/20 rounded-full blur-md opacity-0 group-hover/avatar:opacity-100 transition-opacity" />
                                        <img src={testimonial.avatar} alt={testimonial.name} className="relative w-14 h-14 rounded-full object-cover ring-4 ring-slate-50 dark:ring-slate-800 shadow-lg" />
                                    </div>
                                    <div>
                                        <h4 className="font-black text-slate-900 dark:text-white text-base">{testimonial.name}</h4>
                                        <p className="text-[10px] font-black uppercase tracking-widest text-primary/80">
                                            {t(`home.testimonials.roles.${testimonial.role.charAt(0).toLowerCase() + testimonial.role.slice(1).replace(/\s+/g, '')}`)}
                                        </p>
                                    </div>
                                </div>
                                <div className="flex gap-1.5 mb-6">
                                    {[1, 2, 3, 4, 5].map(i => <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />)}
                                </div>
                                <p className="text-slate-600 dark:text-slate-300 italic leading-[1.8] text-sm md:text-base font-medium relative z-10">"{testimonial.content}"</p>
                            </motion.div>
                        ))}
                    </motion.div>
                </div>
            </section>

            {/* CTA Section — Cinematic Zoom */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-10">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9, y: 30 }}
                    whileInView={{ opacity: 1, scale: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                    className="relative text-center py-16 px-8 rounded-3xl bg-[linear-gradient(135deg,#7C3AED,#A855F7)] overflow-hidden shadow-2xl shadow-primary/20"
                >
                    <div className="absolute inset-0 bg-black/10" />
                    
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
                        <h2 className="text-3xl sm:text-5xl font-bold text-white mb-6 leading-tight">
                            {t('home.cta.title')}
                        </h2>
                        <p className="text-white/90 text-sm sm:text-base mb-10 max-w-md mx-auto">
                            {t('home.cta.subtitle')}
                        </p>
                        <Link to={getStartedPath}>
                            <Button size="lg" variant="primary" className="bg-white text-primary hover:bg-white hover:scale-105 hover:shadow-xl px-10 py-3 rounded-full font-bold transition-all shadow-lg border-none">
                                {isAuthenticated ? t('home.cta.btnContinue', { defaultValue: 'Continue Learning' }) : t('home.cta.getStarted', { defaultValue: 'Get Started Now' })}
                            </Button>
                        </Link>
                    </div>
                </motion.div>
            </section>
        </div>
    );
};


export default HomePage;
