import { motion } from 'framer-motion';
import { ArrowRight, Zap, Sparkles, Play, Award, Users, Star, Code2, BarChart3, Palette, Megaphone, Camera, DollarSign, BookOpen } from 'lucide-react';
import Button from '../components/ui/Button';
import CourseCard from '../components/features/course/CourseCard';
import { courses, categories, testimonials, instructors } from '../data/mockData';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../auth/useAuth';
import { useTranslation } from 'react-i18next';
import { cn } from '../utils';

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
            {/* Hero Section */}
            <section className="relative min-h-[90vh] flex items-center pt-20 overflow-hidden bg-white dark:bg-slate-950 transition-colors duration-300">
                {/* Abstract Background Shapes */}
                <div className="absolute inset-0 z-0 opacity-30 dark:opacity-20 pointer-events-none">
                    <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] bg-linear-to-br from-primary to-accent rounded-full blur-[100px] animate-float" />
                    <div className="absolute bottom-[10%] left-[-10%] w-[400px] h-[400px] bg-linear-to-tr from-secondary to-primary-dark rounded-full blur-[80px] animate-float" style={{ animationDelay: '2s' }} />
                </div>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
                    <div className="grid lg:grid-cols-2 gap-12 items-center">
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.6 }}
                        >
                            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-100/50 dark:bg-slate-800/50 backdrop-blur-sm border border-slate-200 dark:border-slate-700 text-primary font-semibold text-sm mb-6">
                                <Sparkles className="w-4 h-4" />
                                <span>{t('home.heroBadge')}</span>
                            </div>
                            <h1 className={`text-5xl md:text-7xl font-bold text-slate-900 dark:text-white leading-tight mb-6 tracking-tight ${isAr ? 'leading-[1.4]' : ''}`}>
                                {t('home.heroTitleMain')}
                                {isAr ? ' ' : <br />}
                                <span className="text-transparent bg-clip-text bg-linear-to-r from-primary via-secondary to-accent">
                                    {t('home.heroTitleHighlight')}
                                </span>
                                {t('home.heroTitleSuffix') && (
                                    <>
                                        <br />
                                        {t('home.heroTitleSuffix')}
                                    </>
                                )}
                            </h1>
                            <p className="text-xl text-slate-600 dark:text-slate-400 mb-8 max-w-lg leading-relaxed">
                                {t('home.heroSubtitle').split('Nexora AI')[0]}
                                <span className="font-bold text-transparent bg-clip-text bg-linear-to-r from-primary to-secondary">Nexora AI</span>
                                {t('home.heroSubtitle').split('Nexora AI')[1]}
                            </p>
                             <div className="flex flex-col sm:flex-row gap-4">
                                <Link to="/courses">
                                    <Button size="lg" className="h-14 px-8 text-lg shadow-xl shadow-primary/20 hover:shadow-2xl hover:shadow-primary/30 transition-all w-full sm:w-auto">
                                        {t('home.btnStartLearning')} <ArrowRight className="w-5 h-5 ml-2" />
                                    </Button>
                                </Link>
                                <Link to="/ai-demo">
                                    <Button variant="outline" size="lg" className="h-14 px-8 text-lg border-2 hover:bg-slate-50 dark:hover:bg-slate-900 dark:border-slate-700 dark:text-slate-200 w-full sm:w-auto">
                                        <Play className="w-5 h-5 mr-2 fill-current" /> {t('home.btnWatchDemo')}
                                    </Button>
                                </Link>
                            </div>

                            <div className="mt-12 flex items-center gap-4 text-sm font-medium text-slate-500 dark:text-slate-400">
                                <div className="flex -space-x-3">
                                    {[
                                        "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=100&q=80",
                                        "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=100&q=80",
                                        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=100&q=80",
                                        "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80"
                                    ].map(((src, i) => (
                                        <div key={i} className="w-10 h-10 rounded-full border-2 border-white dark:border-slate-900 bg-slate-200 dark:bg-slate-800 flex items-center justify-center overflow-hidden">
                                            <img src={src} alt="User" className="w-full h-full object-cover" />
                                        </div>
                                    )))}
                                </div>
                                <p>{t('home.trustedBy')} <span className="text-slate-900 dark:text-white font-bold">10,000+</span> {t('home.students')}</p>
                            </div>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.8, delay: 0.2 }}
                            className="relative"
                        >
                            <div className="relative z-10 bg-white dark:bg-slate-900 p-4 rounded-3xl shadow-2xl shadow-slate-200/50 dark:shadow-black/50 border border-slate-100 dark:border-slate-800 transform -rotate-2 hover:rotate-0 transition-transform duration-500">
                                <img
                                    src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80"
                                    alt="Students learning"
                                    className="rounded-2xl w-full object-cover h-[400px] md:h-[500px] brightness-90 dark:brightness-75"
                                />

                                <div className="absolute -bottom-6 -left-6 bg-white dark:bg-slate-800 p-4 rounded-xl shadow-xl border border-slate-50 dark:border-slate-700 flex items-center gap-4 animate-float pointer-events-none" style={{ animationDelay: '1s' }}>
                                    <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center text-green-600 dark:text-green-400">
                                        <Award className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <p className="text-sm text-slate-500 dark:text-slate-400">{t('home.hero.courseCompleted')}</p>
                                        <p className="text-lg font-bold text-slate-900 dark:text-white">{t('home.hero.pythonMastery')}</p>
                                    </div>
                                </div>

                                <div className="absolute top-10 -right-8 bg-white dark:bg-slate-800 p-4 rounded-xl shadow-xl border border-slate-50 dark:border-slate-700 flex items-center gap-3 animate-float pointer-events-none" style={{ animationDelay: '0.5s' }}>
                                    <div className="w-10 h-10 bg-yellow-100 dark:bg-yellow-900/30 rounded-full flex items-center justify-center text-yellow-600 dark:text-yellow-400">
                                        <Star className="w-5 h-5 fill-current" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-bold text-slate-900 dark:text-white">{t('home.hero.rating')}</p>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Stats Section */}
            <section className="bg-slate-900 dark:bg-black text-white py-12 transition-colors duration-300">
                <div className="max-w-7xl mx-auto px-4 flex flex-wrap justify-between items-center gap-8 text-center md:text-left">
                    {[
                        { label: t('home.stats.learners'), value: '50k+' },
                        { label: t('home.stats.courses'), value: '200+' },
                        { label: t('home.stats.instructors'), value: '50+' },
                        { label: t('home.stats.satisfaction'), value: '99%' },
                    ].map((stat, idx) => (
                        <div key={idx} className="flex-1 min-w-[150px]">
                            <h3 className="text-4xl font-bold bg-clip-text text-transparent bg-linear-to-r from-primary via-secondary to-white">{stat.value}</h3>
                            <p className="text-slate-400 text-sm mt-1 uppercase tracking-wider">{stat.label}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* Categories Section */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
                <div className="text-center mb-16">
                    <span className="text-primary font-semibold tracking-wider uppercase text-sm">{t('home.categories.badge')}</span>
                    <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mt-2">{t('home.categories.title')}</h2>
                    <p className="text-slate-500 dark:text-slate-400 mt-3 max-w-xl mx-auto">{t('home.categories.subtitle')}</p>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                    {categories.map((cat, idx) => (
                        <motion.div
                            key={cat.id}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: idx * 0.05 }}
                            viewport={{ once: true }}
                            onClick={() => navigate(`/courses?category=${encodeURIComponent(cat.name)}`)}
                            className="group cursor-pointer p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-xl dark:hover:shadow-primary/10 hover:border-primary/20 transition-all text-center"
                        >
                            <div className={cn(
                                "w-14 h-14 mx-auto rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-all duration-300 shadow-sm",
                                cat.bgColor || "bg-slate-50 dark:bg-slate-800"
                            )}>
                                {cat.icon && iconMap[cat.icon] ? (
                                    (() => {
                                        const IconComponent = iconMap[cat.icon];
                                        return <IconComponent className={cn("w-7 h-7 transition-colors", cat.color || "text-slate-600 dark:text-slate-400")} />;
                                    })()
                                ) : (
                                    <span className="text-2xl transition-colors">{cat.icon || '📚'}</span>
                                )}
                            </div>
                            <h3 className="font-semibold text-slate-900 dark:text-white group-hover:text-primary transition-colors">
                                {t(`courses.categories.${cat.name.charAt(0).toLowerCase() + cat.name.slice(1).replace(/\s+/g, '')}`)}
                            </h3>
                            <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">{cat.count} {t('home.categories.coursesCount')}</p>
                        </motion.div>
                    ))}
                </div>
            </section>

            {/* Featured Courses */}
            <section className="bg-slate-50 dark:bg-slate-900/50 py-20 transition-colors duration-300">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-end mb-12">
                        <div>
                            <span className="text-primary font-semibold tracking-wider uppercase text-sm">{t('home.featured.badge')}</span>
                            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mt-2">{t('home.featured.title')}</h2>
                        </div>
                        <Link to="/courses">
                            <Button variant="ghost" className="hidden sm:flex items-center gap-1 hover:text-primary dark:text-slate-300 cursor-pointer">
                                {t('home.featured.btnViewAll')} <ArrowRight className="w-4 h-4" />
                            </Button>
                        </Link>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                        {courses.slice(0, 4).map((course, idx) => (
                            <motion.div
                                key={course.id}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ delay: idx * 0.1 }}
                                viewport={{ once: true }}
                            >
                                <CourseCard course={course} />
                            </motion.div>
                        ))}
                    </div>

                    <div className="mt-8 text-center sm:hidden">
                        <Link to="/courses">
                            <Button variant="outline" className="w-full h-12 dark:border-slate-700 dark:text-slate-300">{t('home.featured.btnViewAll')}</Button>
                        </Link>
                    </div>
                </div>
            </section>

            {/* AI Feature Highlight */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 relative overflow-visible">
                {/* Enhanced Neon Glow behind the content */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[110%] h-[110%] bg-linear-to-r from-primary/20 via-purple-500/10 to-transparent blur-[140px] rounded-full pointer-events-none z-0 animate-pulse" style={{ animationDuration: '4s' }} />
                
                <div className="bg-[#050505] rounded-2xl sm:rounded-[3rem] p-6 sm:p-10 md:p-20 overflow-hidden relative text-white border border-slate-800 shadow-[0_0_80px_-20px_rgba(138,43,226,0.25)] z-10">
                    <div className="relative z-10 grid lg:grid-cols-2 gap-12 items-center">
                        <div>
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
                                <Button size="lg" className="bg-white text-slate-900 hover:bg-slate-100 hover:scale-105 transition-transform border-none shadow-xl shadow-white/5">
                                    {t('home.aiHighlight.btnTryDemo')} <ArrowRight className="w-5 h-5 ml-2" />
                                </Button>
                            </Link>
                        </div>

                        <div className="relative">
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
                        </div>
                    </div>
                </div>
            </section>

            {/* Top Instructors Section - Theme Responsive */}
            <section className="relative py-20 overflow-hidden bg-white dark:bg-[#0a0a0a] border-y border-slate-200 dark:border-slate-800/60 transition-colors duration-500">
                {/* Decorative background elements - Only visible in dark or very subtle in light */}
                <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/3 w-[500px] h-[500px] bg-primary/10 dark:bg-primary/5 rounded-full blur-[100px] opacity-20 dark:opacity-40 mix-blend-multiply dark:mix-blend-screen pointer-events-none" />
                <div className="absolute bottom-0 left-0 translate-y-1/2 -translate-x-1/3 w-[400px] h-[400px] bg-secondary/10 dark:bg-secondary/5 rounded-full blur-[80px] opacity-20 dark:opacity-40 mix-blend-multiply dark:mix-blend-screen pointer-events-none" />
                
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <div className="flex flex-col md:flex-row items-center md:items-end justify-between mb-10 gap-6 text-center md:text-start">
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
                    </div>

                    <div className="grid lg:grid-cols-2 gap-6 max-w-5xl mx-auto">
                        {instructors.slice(0, 2).map((instructor, idx) => (
                            <motion.div
                                key={instructor.id}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ delay: idx * 0.15, duration: 0.4 }}
                                viewport={{ once: true }}
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
                                        
                                        {/* Restored Stats Row with Icons */}
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
                    </div>
                </div>
            </section>

            {/* Testimonials */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
                <div className="text-center mb-16">
                    <span className="text-primary font-semibold tracking-wider uppercase text-sm">{t('home.testimonials.badge')}</span>
                    <h2 className="text-3xl font-bold text-slate-900 dark:text-white mt-2">{t('home.testimonials.title')}</h2>
                    <p className="text-slate-500 dark:text-slate-400 mt-3">{t('home.testimonials.subtitle')}</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {testimonials.map((testimonial, idx) => (
                        <motion.div
                            key={testimonial.id}
                            initial={{ opacity: 0, scale: 0.95 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            transition={{ delay: idx * 0.1 }}
                            viewport={{ once: true }}
                            className="p-8 rounded-2xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
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
                </div>
            </section>

            {/* CTA Section */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-10">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="relative text-center py-16 px-8 rounded-3xl bg-linear-to-r from-primary via-secondary to-accent overflow-hidden"
                >
                    <div className="absolute inset-0 bg-black/20" />
                    <div className="relative z-10">
                        <Sparkles className="w-8 h-8 text-white/80 mx-auto mb-4" />
                        <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">{t('home.cta.title')}</h2>
                        <p className="text-white/80 text-lg mb-8 max-w-xl mx-auto">{t('home.cta.subtitle')}</p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Link to={getStartedPath}>
                                <Button size="lg" className="bg-white text-slate-900 hover:bg-slate-100 border-none shadow-xl h-14 px-8 text-lg">
                                    {isAuthenticated ? t('home.cta.btnContinue') : t('home.cta.btnGetStarted')} <ArrowRight className="w-5 h-5 ml-2" />
                                </Button>
                            </Link>
                        </div>
                    </div>
                </motion.div>
            </section>
        </div>
    );
};


export default HomePage;
